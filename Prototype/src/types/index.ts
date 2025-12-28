/**
 * Phase 1 프로토타입 타입 정의 (v3)
 * 에너지 기반 카드 시스템
 */

// ===== 게임 단계 =====
export type GamePhase =
  | 'battle'       // 전투 진행 중
  | 'victory'      // 승리
  | 'defeat'       // 패배
  | 'survey';      // 설문 조사

// ===== 전투 관련 =====

// 단순화된 적 (HP 100, 반격 10/턴)
export interface Enemy {
  maxHp: number;          // 100
  currentHp: number;
  counterDamage: number;  // 10
}

// 플레이어
export interface Player {
  maxHp: number;          // 50
  currentHp: number;
  energy: number;         // 매 턴 3으로 회복, 최대 3
  maxEnergy: number;      // 3
}

// ===== 카드 관련 =====
// MVP: 드래그앤드롭 방식에서는 A/B 선택이 아닌 대상 지정 방식 사용
export type CardTarget = 'enemy' | 'player';

export interface CardEffect {
  damage?: number;           // 데미지 (적 대상)
  heal?: number;             // 회복량 (플레이어 대상)
  energyNext?: number;       // 다음 턴 에너지 증가
  skipCounter?: boolean;     // 반격 무효화
  selfDamage?: number;       // 자기 자신에게 입히는 데미지
}

export interface Card {
  id: string;
  cardNumber: number;
  title: string;
  description: string;    // 카드 효과 설명
  energyCost: number;     // 사용 시 소모 에너지 (1~3)
  target: CardTarget;     // 드래그 대상 ('enemy' | 'player')
  effect: CardEffect;     // 카드 효과
}

// ===== 턴 상태 =====
export interface TurnState {
  usedCardIds: string[];        // 이번 턴에 사용한 카드 ID들
  damageMultiplier: number;     // 데미지 배율 (버프 효과)
  counterDamageMultiplier: number; // 받는 반격 데미지 배율
  skipCounter: boolean;         // 이번 턴 반격 무효화
}

// ===== 데이터 수집 =====
export interface CardSelectionData {
  card_id: string;
  card_number: number;
  has_tag: boolean;
  choice: 'A' | 'B';
  decision_time_ms: number;
  hover_time_a_ms: number;
  hover_time_b_ms: number;
  switch_count: number;
  turn_number: number;
  player_hp: number;
  enemy_hp: number;
  player_energy: number;
  timestamp: number;
}

export interface GameResultData {
  result: 'victory' | 'defeat';
  total_turns: number;
  remaining_hp: number;
  final_energy: number;
  timestamp: number;
}

export interface SurveyData {
  q1_difficulty: number;      // Q1: 선택할 때 고민이 되었나요? (1-5)
  q2_tradeoff: number;         // Q2: 두 옵션 사이에 트레이드오프가 느껴졌나요? (1-5)
  q3_hardest_card: number;     // Q3: 가장 고민되었던 카드는? (1-6)
  q4_enemy_influence: number;  // Q4: 적의 존재가 선택에 영향을 주었나요? (1-5)
}

export interface CollectedData {
  selections: CardSelectionData[];
  result: GameResultData;
  survey: SurveyData | null;
}
