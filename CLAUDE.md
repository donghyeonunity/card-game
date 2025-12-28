# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고할 가이드를 제공합니다.

---

## 프로젝트 개요

- **프로젝트**: 에너지 기반 카드 게임
- **목표**: 스팀(Steam) 출시
- **개발**: 1인 개발

---

## 개발 단계

| 단계 | 목적 | 기술 스택 | 상태 |
|------|------|-----------|------|
| Phase 1: 프로토타입 | 핵심 메카닉 검증 | React + TypeScript (웹) | 진행 중 |
| Phase 2: 본개발 | 스팀 출시용 게임 제작 | Unity + C# | 예정 |

---

## 기술 스택

### 프로토타입 (Prototype/)
- React 19 + TypeScript 5.9 (strict mode)
- Vite 7.2 (빌드 도구)
- Zustand 5.0 (상태 관리)
- Tailwind CSS 4.1 (스타일링)
- Framer Motion 12 (애니메이션)

### 본개발 (Unity/) - 예정
- Unity (버전 TBD)
- C# 스크립팅
- 상태 관리, UI 시스템 등 (구체화 예정)

---

## 프로젝트 구조

```
card-game/
├── docs/              # 기획 문서
│   ├── PRD.md         # 게임 디자인 철학
│   └── coding_convention.md  # C# 코딩 컨벤션
├── Prototype/         # 웹 프로토타입 (React)
│   └── src/
│       ├── components/  # React 컴포넌트
│       ├── stores/      # Zustand 스토어
│       ├── types/       # TypeScript 타입
│       ├── data/        # 게임 데이터
│       └── assets/      # 정적 자산
├── Unity/             # 본개발 (예정)
│   └── Assets/
│       ├── Scripts/
│       ├── Prefabs/
│       └── ...
└── CLAUDE.md
```

---

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성
- **변수명/함수명**: 영어 (코드 표준 준수)

---

## 프로토타입 규칙 (React/TypeScript)

### 컴포넌트
- 함수형 컴포넌트 사용
- Props 인터페이스 정의
- Framer Motion으로 애니메이션 처리

### 상태 관리
- Zustand `create<Store>((set, get) => ({...}))` 패턴
- 초기 상태를 스토어 외부에 상수로 분리
- 불변성 유지: `{ ...state.player, energy: newEnergy }`

### 스타일링
- Tailwind CSS 유틸리티 클래스 사용
- 인라인 스타일 금지
- 게임 전용 색상: `--color-game-*` 변수

### 명명 규칙
- 변수/함수: camelCase (`handleSelect`)
- 컴포넌트: PascalCase (`BattleUI`)
- 상수: SCREAMING_SNAKE_CASE (`PHASE1_CARDS`)

---

## Unity/C# 코딩 컨벤션

**상세 규칙: `docs/coding_convention.md` 참조** (Pope Kim C# Coding Convention)

### 핵심 네이밍 규칙
| 대상 | 규칙 | 예시 |
|------|------|------|
| 클래스/public 메서드 | PascalCase | `PlayerManager`, `GetHealth()` |
| private 메서드 | camelCase | `getHealth()` |
| private 멤버 변수 | m 접두사 | `mHealth` |
| bool 변수 | b 접두사 | `bIsAlive` |
| 인터페이스 | I 접두사 | `IUpdatable` |
| enum | E 접두사 | `EState` |
| 상수 | ALL_CAPS | `MAX_COUNT` |

### 코드 스타일
- 들여쓰기: 스페이스 4칸
- 중괄호: 항상 새 줄
- var 사용 지양 (IEnumerable, anonymous 제외)

---

## 빌드 및 개발

### 프로토타입
```bash
cd Prototype
npm install          # 의존성 설치
npm run dev          # 개발 서버 (localhost:5173)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
npm run preview      # 빌드 결과 미리보기
```

### Unity (예정)
- Unity Editor 빌드 설정
- 스팀 빌드 파이프라인

---

## 문서 구조

| 경로 | 설명 |
|------|------|
| `docs/` | 기획, 시나리오, 아트 등 |
| `docs/PRD.md` | 게임 디자인 철학 |
| `docs/coding_convention.md` | C# 코딩 컨벤션 |
| `Prototype/README.md` | 프로토타입 실행 가이드 |

---

## 금지사항

### 공통
- 영어 주석 금지 (한국어로 작성)
- 하드코딩된 매직 넘버 금지

### 프로토타입 (React/TypeScript)
- `any` 타입 사용 금지
- `// @ts-ignore` 사용 금지
- 인라인 스타일 금지

### Unity/C# (coding_convention.md 참조)
- `var` 사용 지양
- `??` null 병합 연산자 금지
- `new()` shorthand 금지
- variable shadowing 금지
- 다중 줄 람다 금지
- `Find()` 런타임 남용 금지
- `Update()`에서 `GetComponent()` 금지
