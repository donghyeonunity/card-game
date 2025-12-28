# 전투 배경 에셋 가이드

## 배경 생성 방법

### 1. HTML 생성기 사용 (권장)

프로젝트 루트의 `generate_battle_bg.html` 파일을 브라우저에서 열어 사용합니다.

```bash
# 브라우저에서 파일 열기
start generate_battle_bg.html  # Windows
open generate_battle_bg.html   # macOS
xdg-open generate_battle_bg.html # Linux
```

**사용법:**
1. HTML 파일을 브라우저에서 열면 자동으로 배경이 생성됩니다
2. "💾 다운로드 (PNG)" 버튼을 클릭하여 이미지 저장
3. 다운로드된 `battle_bg_prototype_v1.png` 파일을 이 디렉토리에 복사

### 2. Python 스크립트 사용 (선택)

Python과 Pillow 라이브러리가 설치된 경우 사용 가능합니다.

```bash
# 필수 라이브러리 설치
pip install pillow

# 스크립트 실행
cd Prototype
python generate_battle_bg.py
```

## 배경 사양

### 기본 정보
- **파일명**: `battle_bg_prototype_v1.png`
- **해상도**: 320 x 180 픽셀 (16:9 비율)
- **포맷**: PNG
- **스타일**: 픽셀 아트 그라데이션
- **용도**: 프로토타입 전투 화면 배경

### 색상 팔레트

| 색상명 | HEX | RGB | 용도 |
|--------|-----|-----|------|
| 보이드 블랙 | `#1A0F1F` | `rgb(26, 15, 31)` | 최상단 배경 |
| 다크 퍼플 | `#3B1F47` | `rgb(59, 31, 71)` | 중간 배경 |
| 스톤 그레이 | `#4A3B52` | `rgb(74, 59, 82)` | 하단/바닥 |
| 딥 바이올렛 | `#6A146A` | `rgb(106, 20, 106)` | 악센트/라인 |

### 구성 요소

```
┌─────────────────────────────────┐
│   상단 1/3: 어두운 공간          │  <- 보이드 블랙 → 다크 퍼플 그라데이션
│   (깊은 던전 분위기)             │
├─────────────────────────────────┤
│   중간 1/3: 캐릭터 배치 영역     │  <- 다크 퍼플 (균일)
│   (약간 밝은 영역)               │
├─────────────────────────────────┤
│   하단 1/3: 바닥                 │  <- 다크 퍼플 → 스톤 그레이 그라데이션
│   (수평 라인, 비네팅 효과)       │
└─────────────────────────────────┘
```

## 디자인 원칙

### 1. 단순성 우선
- 프로토타입 검증용이므로 복잡한 디테일보다 빠른 제작 우선
- 기본 그라데이션과 간단한 라인만으로 구성

### 2. 가독성 확보
- 카드 UI와 대비되어야 함
- 캐릭터 스프라이트가 잘 보여야 함
- 배경은 단순하게 유지

### 3. 일관된 색상
- 리치 보스 캐릭터와 동일한 색상 팔레트 사용
- 전체 게임의 다크 판타지 분위기 유지

### 4. 픽셀 아트 스타일
- 레트로 16비트 RPG 느낌
- 선명한 픽셀 렌더링 (안티앨리어싱 없음)
- 제한된 색상 팔레트 활용

## 사용 예시

### React 컴포넌트에서 import

```typescript
import battleBg from '@/assets/backgrounds/battle_bg_prototype_v1.png';

function BattleScene() {
  return (
    <div
      style={{
        backgroundImage: `url(${battleBg})`,
        backgroundSize: 'cover',
        width: '100%',
        height: '100%'
      }}
    >
      {/* 전투 UI */}
    </div>
  );
}
```

### CSS에서 사용

```css
.battle-scene {
  background-image: url('./assets/backgrounds/battle_bg_prototype_v1.png');
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
  image-rendering: pixelated; /* 픽셀 아트 선명하게 */
}
```

## 향후 개선 방향

### v2 계획
- [ ] 더 다양한 레이어 (벽면, 기둥 등)
- [ ] 간단한 파티클 효과 (먼지, 안개)
- [ ] 여러 던전 테마 (얼음, 불, 독 등)
- [ ] 애니메이션 배경 (약간의 움직임)

### 최적화
- [ ] WebP 포맷 추가 지원
- [ ] 다양한 해상도 대응 (2x, 3x)
- [ ] 스프라이트 시트로 통합

## 파일 관리

### 버전 관리
- v1: 초기 프로토타입 (단순 그라데이션)
- v2: 디테일 추가 (예정)
- v3: 애니메이션 지원 (예정)

### 네이밍 규칙
```
battle_bg_[테마]_v[버전].png

예시:
- battle_bg_prototype_v1.png (현재)
- battle_bg_dungeon_v1.png (향후)
- battle_bg_castle_v1.png (향후)
```

## 라이선스
프로젝트 내부용 에셋입니다. 외부 배포 시 별도 확인 필요.

---

**생성일**: 2025-12-28
**작성자**: Claude Code Art Director
**최종 수정**: 2025-12-28
