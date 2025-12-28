# Claude Code Hook - 트레이 풍선 알림 + 클릭 시 실행한 창 포커스
# - payload 스키마가 달라도 절대 터지지 않게(안전 파싱)
# - stderr(Write-Error) 금지: 훅 실패로 잡힘 -> 조용히 exit 0

$ErrorActionPreference = "Stop"

# ---------- Safe helpers ----------
function Get-PropValue {
    param(
        [Parameter(Mandatory=$true)]$Obj,
        [Parameter(Mandatory=$true)][string]$Name
    )
    if ($null -eq $Obj) { return $null }
    $p = $Obj.PSObject.Properties[$Name]
    if ($null -eq $p) { return $null }
    return $p.Value
}

function Get-DeepValue {
    param(
        [Parameter(Mandatory=$true)]$Obj,
        [Parameter(Mandatory=$true)][string[]]$Path
    )
    $cur = $Obj
    foreach ($k in $Path) {
        $cur = Get-PropValue -Obj $cur -Name $k
        if ($null -eq $cur) { return $null }
    }
    return $cur
}

# --- WinForms 가능 환경인지 선 체크 (WSL/Linux pwsh 등에서는 알림 포기 + 훅 성공) ---
if (-not $IsWindows) { exit 0 }

try {
    Add-Type -AssemblyName System.Windows.Forms -ErrorAction Stop
    Add-Type -AssemblyName System.Drawing      -ErrorAction Stop
} catch {
    exit 0
}

# ---------- Win32 ----------
Add-Type @"
using System;
using System.Runtime.InteropServices;

public class Win32Focus {
    [DllImport("kernel32.dll")] public static extern IntPtr GetConsoleWindow();
    [DllImport("kernel32.dll")] public static extern uint GetCurrentThreadId();

    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr hWnd);

    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool fAttach);

    [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, int dwFlags, int dwExtraInfo);

    public const int SW_RESTORE = 9;
    public const int SW_SHOW = 5;

    public const int KEYEVENTF_KEYUP = 0x0002;
    public const byte VK_MENU = 0x12; // ALT
}
"@

function Focus-Window {
    param([IntPtr]$hWnd)
    if ($hWnd -eq [IntPtr]::Zero) { return }

    if ([Win32Focus]::IsIconic($hWnd)) {
        [void][Win32Focus]::ShowWindowAsync($hWnd, [Win32Focus]::SW_RESTORE)
    } else {
        [void][Win32Focus]::ShowWindowAsync($hWnd, [Win32Focus]::SW_SHOW)
    }

    # Foreground lock 우회(ALT 토글)
    [Win32Focus]::keybd_event([Win32Focus]::VK_MENU, 0, 0, 0)
    [Win32Focus]::keybd_event([Win32Focus]::VK_MENU, 0, [Win32Focus]::KEYEVENTF_KEYUP, 0)

    # AttachThreadInput으로 포커스 강제
    $fg = [Win32Focus]::GetForegroundWindow()
    [uint32]$fgPid = 0
    [uint32]$targetPid = 0

    [uint32]$curThread = [Win32Focus]::GetCurrentThreadId()
    [uint32]$fgThread = 0
    [uint32]$targetThread = 0

    if ($fg -ne [IntPtr]::Zero) {
        $fgThread = [Win32Focus]::GetWindowThreadProcessId($fg, [ref]$fgPid)
    }
    $targetThread = [Win32Focus]::GetWindowThreadProcessId($hWnd, [ref]$targetPid)

    try {
        if ($fgThread -ne 0) { [void][Win32Focus]::AttachThreadInput($curThread, $fgThread, $true) }
        if ($targetThread -ne 0) { [void][Win32Focus]::AttachThreadInput($curThread, $targetThread, $true) }

        [void][Win32Focus]::BringWindowToTop($hWnd)
        [void][Win32Focus]::SetForegroundWindow($hWnd)
    }
    finally {
        if ($targetThread -ne 0) { [void][Win32Focus]::AttachThreadInput($curThread, $targetThread, $false) }
        if ($fgThread -ne 0) { [void][Win32Focus]::AttachThreadInput($curThread, $fgThread, $false) }
    }
}

function Get-ParentPid {
    param([int]$Pid)
    try {
        $p = Get-CimInstance Win32_Process -Filter "ProcessId=$Pid"
        if ($null -ne $p) { return [int]$p.ParentProcessId }
    } catch {}
    return 0
}

function Get-InvokerWindowHandle {
    param([int]$StartPid)

    $chain = New-Object System.Collections.Generic.List[object]
    $visited = New-Object 'System.Collections.Generic.HashSet[int]'
    $pid = $StartPid

    for ($depth = 0; $depth -lt 25; $depth++) {
        if ($pid -le 0) { break }
        if ($visited.Contains($pid)) { break }
        [void]$visited.Add($pid)

        try {
            $proc = Get-Process -Id $pid -ErrorAction Stop
            $chain.Add([pscustomobject]@{
                Pid   = $pid
                Name  = $proc.ProcessName
                Hwnd  = $proc.MainWindowHandle
                Title = $proc.MainWindowTitle
                Depth = $depth
            })
        } catch {}

        $pid = Get-ParentPid -Pid $pid
    }

    if ($chain.Count -eq 0) { return [IntPtr]::Zero }

    $candidates = $chain | Where-Object { $_.Hwnd -ne [IntPtr]::Zero }
    if (-not $candidates) { return [IntPtr]::Zero }

    $best = $null
    $bestScore = -1

    foreach ($c in $candidates) {
        $score = 0
        switch -Regex ($c.Name) {
            '^WindowsTerminal$' { $score += 200 }
            '^Code$'            { $score += 180 }
            '^Cursor$'          { $score += 170 }
            '^conhost$'         { $score += 20 }
            default             { $score += 50 }
        }
        if (-not [string]::IsNullOrWhiteSpace($c.Title)) { $score += 40 }
        $score += [Math]::Min(30, [int]$c.Depth)

        if ($score -gt $bestScore) { $bestScore = $score; $best = $c }
    }

    return $best.Hwnd
}

function Find-ByCwdFallback {
    param([string]$Cwd)

    if ([string]::IsNullOrWhiteSpace($Cwd)) { return [IntPtr]::Zero }

    $cwdNorm = $Cwd.Replace('/', '\').TrimEnd('\')
    $folderName = Split-Path $cwdNorm -Leaf
    if ([string]::IsNullOrWhiteSpace($folderName)) { return [IntPtr]::Zero }

    $p = Get-Process -Name 'WindowsTerminal','Cursor','Code' -ErrorAction SilentlyContinue |
        Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero -and $_.MainWindowTitle -like "*$folderName*" } |
        Select-Object -First 1

    if ($p) { return $p.MainWindowHandle }
    return [IntPtr]::Zero
}

try {
    # stdin JSON 읽기
    $inputJson = [Console]::In.ReadToEnd()
    if ([string]::IsNullOrWhiteSpace($inputJson)) { exit 0 }

    $hookData = $inputJson | ConvertFrom-Json

    # ---- payload 스키마가 달라도 안전하게 추출 ----
    # 1) tool name 후보들
    $toolName =
        (Get-PropValue $hookData "tool_name") ??
        (Get-DeepValue $hookData @("tool","name")) ??
        (Get-PropValue $hookData "name") ??
        (Get-PropValue $hookData "event") ??
        (Get-PropValue $hookData "type") ??
        "hook"

    # 2) tool input 후보들
    $toolInput =
        (Get-PropValue $hookData "tool_input") ??
        (Get-PropValue $hookData "input") ??
        (Get-DeepValue $hookData @("tool","input")) ??
        $null

    # 3) cwd 후보들
    $cwd =
        (Get-PropValue $hookData "cwd") ??
        (Get-PropValue $hookData "workdir") ??
        (Get-PropValue $hookData "workspace") ??
        $null

    $folderName = $null
    if ($cwd) {
        try { $folderName = Split-Path ($cwd.Replace('/', '\').TrimEnd('\')) -Leaf } catch {}
    }

    # ---- 타겟 핸들 결정 ----
    $targetHandle = [Win32Focus]::GetConsoleWindow()
    if ($targetHandle -eq [IntPtr]::Zero) { $targetHandle = Get-InvokerWindowHandle -StartPid $PID }
    if ($targetHandle -eq [IntPtr]::Zero) { $targetHandle = Find-ByCwdFallback -Cwd $cwd }

    # ---- 메시지 구성 ----
    $title = if ($folderName) { "[$folderName] 작업이 완료되었습니다." } else { "작업이 완료되었습니다." }
    $message = "도구: $toolName"

    if ($toolInput) {
        $cmd = $null
        try { $cmd = Get-PropValue $toolInput "command" } catch {}
        if ($cmd) {
            $cmdStr = [string]$cmd
            if ($cmdStr.Length -gt 80) { $cmdStr = $cmdStr.Substring(0, 80) + "..." }
            $message = "$toolName`: $cmdStr"
        } else {
            $fp = $null
            try { $fp = Get-PropValue $toolInput "file_path" } catch {}
            if ($fp) { $message = "$toolName`: $fp" }
        }
    }

    # ---- NotifyIcon ----
    $notify = New-Object System.Windows.Forms.NotifyIcon
    $notify.Icon = [System.Drawing.SystemIcons]::Warning
    $notify.Visible = $true
    $notify.BalloonTipTitle = $title
    $notify.BalloonTipText = $message
    $notify.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Warning

    $notify.Add_BalloonTipClicked({
        Start-Sleep -Milliseconds 150
        if ($targetHandle -eq [IntPtr]::Zero) { $targetHandle = [Win32Focus]::GetConsoleWindow() }
        if ($targetHandle -ne [IntPtr]::Zero) { Focus-Window -hWnd $targetHandle }
    })

    $notify.ShowBalloonTip(5000)

    # 메시지 루프 (클릭 이벤트 처리 시간 확보)
    $timer = New-Object System.Windows.Forms.Timer
    $timer.Interval = 6500
    $timer.Add_Tick({
        $timer.Stop()
        [System.Windows.Forms.Application]::ExitThread()
    })
    $timer.Start()

    [System.Windows.Forms.Application]::Run()

    $notify.Dispose()
    exit 0
}
catch {
    # 훅은 실패하면 안 되므로: stderr 출력 없이 조용히 성공 처리
    exit 0
}
