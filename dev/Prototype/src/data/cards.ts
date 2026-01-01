/**
 * Phase 1 프로토타입 카드 데이터 (MVP - 드래그앤드롭)
 * 에너지 기반 카드 시스템
 *
 * 총 6장의 카드 - 각 카드마다 에너지 코스트 (1~3)
 * 매 턴 에너지 3으로 시작, 카드 조합 전략 가능
 *
 * MVP: A/B 선택 제거, 드래그 대상(적/플레이어)으로 단순화
 */

import type { Card } from '../types';

export const PHASE1_CARDS: Card[] = [
  // 카드 1: 강타 (에너지 2, 적 대상)
  {
    id: 'card_1_strike',
    cardNumber: 1,
    title: '강타',
    description: '적에게 15 데미지',
    energyCost: 2,
    target: 'enemy',
    effect: {
      damage: 15
    }
  },

  // 카드 2: 연속 공격 (에너지 3, 적 대상)
  {
    id: 'card_2_combo',
    cardNumber: 2,
    title: '연속 공격',
    description: '적에게 25 데미지',
    energyCost: 3,
    target: 'enemy',
    effect: {
      damage: 25
    }
  },

  // 카드 3: 회복 (에너지 1, 플레이어 대상)
  {
    id: 'card_3_heal',
    cardNumber: 3,
    title: '회복',
    description: 'HP +10 회복',
    energyCost: 1,
    target: 'player',
    effect: {
      heal: 10
    }
  },

  // 카드 4: 에너지 충전 (에너지 1, 플레이어 대상)
  {
    id: 'card_4_energy',
    cardNumber: 4,
    title: '에너지 충전',
    description: '다음 턴 에너지 +1',
    energyCost: 1,
    target: 'player',
    effect: {
      energyNext: 1
    }
  },

  // 카드 5: 방어 태세 (에너지 1, 플레이어 대상)
  {
    id: 'card_5_defend',
    cardNumber: 5,
    title: '방어 태세',
    description: '이번 턴 반격 무효화',
    energyCost: 1,
    target: 'player',
    effect: {
      skipCounter: true
    }
  },

  // 카드 6: 집중 타격 (에너지 3, 적 대상)
  {
    id: 'card_6_focus',
    cardNumber: 6,
    title: '집중 타격',
    description: '35 데미지, HP -5 소모',
    energyCost: 3,
    target: 'enemy',
    effect: {
      damage: 35,
      selfDamage: 5
    }
  }
];
