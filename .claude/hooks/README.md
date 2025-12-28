# Claude Code 권한 요청 알림 시스템

Windows에서 Claude Code 권한 요청 시 Toast 알림을 표시하고, 클릭하면 즉시 Cursor/VSCode로 이동하는 시스템입니다.

## 🚀 빠른 시작 (새 프로젝트 설정)

### 1단계: 파일 복사

다음 파일들을 새 프로젝트의 `.claude/hooks/` 폴더로 복사합니다:

```
.claude/hooks/
├── bin/
│   └── ActivateCursor.exe    # 컴파일된 창 활성화 도구
├── on-permission-request.ps1  # 권한 요청 hook
└── register-protocol.ps1      # 프로토콜 등록 스크립트
```

### 2단계: 프로토콜 핸들러 등록 (최초 1회)

PowerShell에서 실행:

```powershell
pwsh -NoProfile -File ".claude/hooks/register-protocol.ps1"
```

> ⚠️ **주의**: `register-protocol.ps1`의 `$exePath` 경로를 새 프로젝트 경로로 수정해야 합니다.

### 3단계: settings.json 설정

프로젝트의 `.claude/settings.json`에 hook 추가:

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "pwsh -NoProfile -File .claude/hooks/on-permission-request.ps1"
          }
        ]
      }
    ]
  }
}
```

### 4단계: 테스트

```powershell
pwsh -NoProfile -File ".claude/hooks/on-permission-request.ps1"
```

알림이 표시되고, 클릭 시 Cursor로 이동하면 성공!

---

## 📁 파일 설명

| 파일 | 역할 |
|------|------|
| `on-permission-request.ps1` | Claude Code 권한 요청 시 실행되는 hook |
| `bin/ActivateCursor.exe` | Cursor 창을 빠르게 활성화하는 .NET 실행 파일 |
| `register-protocol.ps1` | `claude-activate://` 프로토콜 핸들러 등록 |
| `ActivateCursor/` | EXE 소스 코드 (.NET 프로젝트) |

---

## 🔧 커스터마이징

### 알림 제목/내용 변경

`on-permission-request.ps1`에서 수정:

```powershell
$title = "Claude Code 권한 요청"  # 알림 제목
$body  = if ($permissionMode) { "$message`n모드: $permissionMode" } else { $message }
```

### 다른 에디터 지원 (VSCode, Windsurf 등)

`ActivateCursor/Program.cs`에서 프로세스 이름 변경 후 재빌드:

```csharp
// Cursor 대신 다른 에디터
foreach (var proc in Process.GetProcessesByName("Code"))  // VSCode
```

재빌드:
```powershell
cd .claude/hooks/ActivateCursor
dotnet publish -c Release -o ../bin
```

---

## 🛠️ EXE 재빌드 방법

소스 코드를 수정한 후:

```powershell
cd .claude/hooks/ActivateCursor
dotnet publish -c Release -o ../bin
```

---

## 📋 요구사항

- Windows 10/11
- PowerShell 7+ (pwsh)
- .NET 8.0 Runtime
- BurntToast PowerShell 모듈 (자동 설치됨)

---

## 🐛 문제 해결

### 알림이 표시되지 않음

1. BurntToast 모듈 확인:
   ```powershell
   Get-Module -ListAvailable -Name BurntToast
   ```

2. Windows 알림 설정 확인:
   - 설정 → 시스템 → 알림 → PowerShell 알림 허용

### 클릭해도 이동하지 않음

1. 프로토콜 등록 확인:
   ```powershell
   Get-ItemProperty -Path "HKCU:\Software\Classes\claude-activate\shell\open\command"
   ```

2. EXE 경로가 올바른지 확인

3. 프로토콜 재등록:
   ```powershell
   pwsh -NoProfile -File ".claude/hooks/register-protocol.ps1"
   ```

### 이동 속도가 느림

- VBScript나 PowerShell 스크립트 대신 컴파일된 EXE를 사용하고 있는지 확인
- `register-protocol.ps1`에서 `$exePath`가 `.exe` 파일을 가리키는지 확인
