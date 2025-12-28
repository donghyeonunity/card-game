"""
프로토타입용 픽셀 아트 전투 배경 생성 스크립트
- 해상도: 320 x 180 픽셀 (16:9)
- 스타일: 단순 그라데이션 픽셀 아트
- 색상: 어두운 던전 테마 (보라/회색 계열)
"""

from PIL import Image, ImageDraw
import os

# 설정
WIDTH = 320
HEIGHT = 180
OUTPUT_PATH = "src/assets/backgrounds/battle_bg_prototype_v1.png"

# 색상 팔레트 (HEX -> RGB)
COLORS = {
    "void_black": (26, 15, 31),      # #1A0F1F - 최상단
    "dark_purple": (59, 31, 71),     # #3B1F47 - 중간
    "stone_gray": (74, 59, 82),      # #4A3B52 - 하단
    "deep_violet": (106, 20, 106),   # #6A146A - 악센트
}

def create_gradient_background():
    """세로 그라데이션 배경 생성"""
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)

    # 3단계 그라데이션 영역 정의
    # 상단 1/3: void_black -> dark_purple
    # 중간 1/3: dark_purple
    # 하단 1/3: dark_purple -> stone_gray

    top_section = HEIGHT // 3
    mid_section = HEIGHT // 3
    bottom_section = HEIGHT - top_section - mid_section

    # 상단 그라데이션 (어두운 공간)
    for y in range(top_section):
        ratio = y / top_section
        r = int(COLORS["void_black"][0] + (COLORS["dark_purple"][0] - COLORS["void_black"][0]) * ratio)
        g = int(COLORS["void_black"][1] + (COLORS["dark_purple"][1] - COLORS["void_black"][1]) * ratio)
        b = int(COLORS["void_black"][2] + (COLORS["dark_purple"][2] - COLORS["void_black"][2]) * ratio)
        draw.rectangle([(0, y), (WIDTH, y+1)], fill=(r, g, b))

    # 중간 영역 (캐릭터 배치 영역)
    for y in range(top_section, top_section + mid_section):
        draw.rectangle([(0, y), (WIDTH, y+1)], fill=COLORS["dark_purple"])

    # 하단 그라데이션 (바닥)
    for y in range(bottom_section):
        ratio = y / bottom_section
        r = int(COLORS["dark_purple"][0] + (COLORS["stone_gray"][0] - COLORS["dark_purple"][0]) * ratio)
        g = int(COLORS["dark_purple"][1] + (COLORS["stone_gray"][1] - COLORS["dark_purple"][1]) * ratio)
        b = int(COLORS["dark_purple"][2] + (COLORS["stone_gray"][2] - COLORS["dark_purple"][2]) * ratio)
        y_pos = top_section + mid_section + y
        draw.rectangle([(0, y_pos), (WIDTH, y_pos+1)], fill=(r, g, b))

    return img

def add_floor_details(img):
    """바닥에 간단한 라인 추가 (픽셀 아트 느낌)"""
    draw = ImageDraw.Draw(img)

    # 바닥 시작 위치 (하단 1/3 지점)
    floor_start = HEIGHT * 2 // 3

    # 수평선 3개 추가 (던전 바닥 느낌)
    line_positions = [
        floor_start + 10,
        floor_start + 30,
        floor_start + 50,
    ]

    accent_color = COLORS["deep_violet"]
    darker_accent = tuple(int(c * 0.7) for c in accent_color)  # 더 어두운 악센트

    for i, y_pos in enumerate(line_positions):
        if y_pos < HEIGHT:
            # 교차 패턴으로 라인 색상 결정
            color = darker_accent if i % 2 == 0 else COLORS["stone_gray"]
            # 얇은 수평선 그리기
            draw.line([(0, y_pos), (WIDTH, y_pos)], fill=color, width=1)

    return img

def add_vignette_effect(img):
    """가장자리를 더 어둡게 (비네팅 효과)"""
    pixels = img.load()

    for y in range(HEIGHT):
        for x in range(WIDTH):
            # 중심으로부터의 거리 계산
            dx = (x - WIDTH/2) / (WIDTH/2)
            dy = (y - HEIGHT/2) / (HEIGHT/2)
            distance = (dx*dx + dy*dy) ** 0.5

            # 가장자리로 갈수록 어둡게
            if distance > 0.6:
                factor = 1 - min((distance - 0.6) * 0.5, 0.3)
                r, g, b = pixels[x, y]
                pixels[x, y] = (
                    int(r * factor),
                    int(g * factor),
                    int(b * factor)
                )

    return img

def main():
    """메인 실행 함수"""
    print("=== 픽셀 아트 전투 배경 생성 시작 ===")
    print(f"해상도: {WIDTH} x {HEIGHT}")
    print(f"출력 경로: {OUTPUT_PATH}")

    # 배경 생성
    print("\n1. 그라데이션 배경 생성 중...")
    img = create_gradient_background()

    print("2. 바닥 디테일 추가 중...")
    img = add_floor_details(img)

    print("3. 비네팅 효과 적용 중...")
    img = add_vignette_effect(img)

    # 저장
    output_dir = os.path.dirname(OUTPUT_PATH)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"디렉토리 생성: {output_dir}")

    img.save(OUTPUT_PATH, 'PNG')
    print(f"\n✓ 배경 생성 완료: {OUTPUT_PATH}")
    print(f"✓ 파일 크기: {os.path.getsize(OUTPUT_PATH)} bytes")

    # 메타데이터 저장
    metadata_path = OUTPUT_PATH.replace('.png', '_metadata.txt')
    with open(metadata_path, 'w', encoding='utf-8') as f:
        f.write("=== 전투 배경 메타데이터 ===\n")
        f.write(f"파일명: {os.path.basename(OUTPUT_PATH)}\n")
        f.write(f"해상도: {WIDTH} x {HEIGHT} 픽셀\n")
        f.write(f"스타일: 픽셀 아트 그라데이션\n")
        f.write(f"용도: 프로토타입 전투 화면 배경\n\n")
        f.write("색상 팔레트:\n")
        for name, rgb in COLORS.items():
            hex_code = '#{:02x}{:02x}{:02x}'.format(*rgb)
            f.write(f"  - {name}: {hex_code} / RGB{rgb}\n")
        f.write("\n구성:\n")
        f.write("  - 상단 1/3: 어두운 공간 (void_black -> dark_purple)\n")
        f.write("  - 중간 1/3: 캐릭터 배치 영역 (dark_purple)\n")
        f.write("  - 하단 1/3: 바닥 (dark_purple -> stone_gray)\n")
        f.write("  - 효과: 수평 라인, 비네팅\n")

    print(f"✓ 메타데이터 저장: {metadata_path}")
    print("\n=== 생성 완료 ===")

if __name__ == "__main__":
    main()
