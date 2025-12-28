# Pope Kim C# Coding Convention — 핵심 요약

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
|---|---|---|
| 클래스 / 구조체 / 네임스페이스 | PascalCase | PlayerManager |
| 메서드 (public) | PascalCase, 동사+목적어 | GetHealth() |
| 메서드 (private) | camelCase | getHealth() |
| 지역 변수 / 매개변수 | camelCase | currentHp |
| 상수 | ALL_CAPS_WITH_UNDERSCORES | MAX_COUNT |
| private 멤버 변수 | m 접두사 | mHealth |
| bool 변수 | b 접두사 | bIsAlive |
| bool 프로퍼티 | Is/Has/Can/Should | IsDead |
| 인터페이스 | I 접두사 | IUpdatable |
| enum | E 접두사 | EState |
| Flags enum | Flags 접미사 | EOptionFlags |
| null 가능 반환/인자 | OrNull 접미사 | GetUserOrNull() |

---

## 코드 스타일

| 항목 | 규칙 |
|---|---|
| 들여쓰기 | 스페이스 4칸 |
| 중괄호 | 항상 새 줄 |
| 한 줄 if | 중괄호 생략 금지 |
| 변수 선언 | 한 줄에 하나 |
| 지역 변수 선언 위치 | 사용 직전 |
| switch | default 필수 |
| float 리터럴 | F 접미사 사용 |
| var | 지양 (예외: IEnumerable, anonymous) |
| 컬렉션 | 반드시 Generic |
| variable shadowing | 금지 |
| 람다 | 한 줄만 허용 |

---

## 클래스 구성 순서

1. 멤버 변수  
2. 프로퍼티  
3. 생성자  
4. 메서드 (public → private)

---

## 설계 & 사용 규칙

| 항목 | 규칙 |
|---|---|
| getter/setter | 메서드 대신 프로퍼티 |
| singleton | static class 사용 |
| 재귀 함수 | Recursive 접미사 |
| 기본 인자 | 사용 지양, 오버로딩 우선 |
| out 매개변수 | 함수 밖에서 선언 |
| 객체 initializer | 지양 |
| new() shorthand | 금지 |
| null 병합 연산자 ?? | 사용 금지 |
| 예외 처리 | 경계에서만 |
| Debug.Assert | 모든 가정에 사용 |

---

## async / await

| 항목 | 규칙 |
|---|---|
| async 반환형 | Task 사용 |
| async void | 이벤트 핸들러만 허용 |
| 메서드명 | Async 접미사 사용 금지 |

---

## 파일 & 프로젝트

| 항목 | 규칙 |
|---|---|
| 클래스 파일 | 클래스당 1파일 |
| 파일명 | 클래스명과 동일 |
| partial 클래스 | ClassName.PartName.cs |
| namespace | file-scoped 사용 |
| implicit global using | 금지 |
| Release 경고 | Error 처리 |
| nullable context | 활성화 |

---

## 기타

| 항목 | 규칙 |
|---|---|
| JSON 직렬화 | class 사용 |
| DTO | 값형 프로퍼티 nullable |
| 범용 타입 | readonly record struct |
| XAML 이름 | x + 컨트롤 타입 |

## 참고 문서
https://docs.popekim.com/ko/coding-standards/csharp