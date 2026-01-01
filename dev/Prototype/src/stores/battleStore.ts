/**
 * Phase 1 프로토타입 배틀 스토어 (MVP - 드래그앤드롭)
 * 에너지 기반 카드 시스템
 * Zustand를 사용한 전역 상태 관리
 */

import { create } from 'zustand';
import type {
  GamePhase,
  Player,
  Enemy,
  Card,
  CardTarget
} from '../types';
import { PHASE1_CARDS } from '../data/cards';

interface BattleStore {
  // ===== 게임 상태 =====
  phase: GamePhase;
  currentTurn: number;

  // ===== 전투 상태 =====
  player: Player;
  enemy: Enemy;

  // ===== 핸드 시스템 =====
  hand: Card[];           // 손에 있는 카드들
  usedCardIds: string[];  // 이번 턴에 사용한 카드 ID들

  // ===== 다음 턴 효과 =====
  nextTurnEnergyBonus: number;  // 다음 턴 추가 에너지
  skipCounter: boolean;         // 이번 턴 반격 무효화

  // ===== 게임 액션 =====
  startGame: () => void;
  playCard: (cardId: string, target: CardTarget) => void;
  endTurn: () => void;
  checkGameOver: () => void;
  resetGame: () => void;
}

// 초기 플레이어 상태
const INITIAL_PLAYER: Player = {
  maxHp: 50,
  currentHp: 50,
  energy: 3,
  maxEnergy: 3
};

// 초기 적 상태
const INITIAL_ENEMY: Enemy = {
  maxHp: 100,
  currentHp: 100,
  counterDamage: 10
};

export const useBattleStore = create<BattleStore>((set, get) => ({
  // ===== 초기 상태 =====
  phase: 'battle',
  currentTurn: 1,
  player: { ...INITIAL_PLAYER },
  enemy: { ...INITIAL_ENEMY },
  hand: [...PHASE1_CARDS],
  usedCardIds: [],
  nextTurnEnergyBonus: 0,
  skipCounter: false,

  // ===== 게임 시작 =====
  startGame: () => {
    set({
      phase: 'battle',
      currentTurn: 1,
      player: { ...INITIAL_PLAYER },
      enemy: { ...INITIAL_ENEMY },
      hand: [...PHASE1_CARDS],
      usedCardIds: [],
      nextTurnEnergyBonus: 0,
      skipCounter: false
    });
  },

  // ===== 카드 플레이 (드래그앤드롭) =====
  playCard: (cardId: string, target: CardTarget) => {
    const state = get();
    const card = state.hand.find((c) => c.id === cardId);

    if (!card) return;

    // 에너지 부족 체크
    if (state.player.energy < card.energyCost) {
      console.warn('에너지 부족');
      return;
    }

    // 이미 사용한 카드 체크
    if (state.usedCardIds.includes(card.id)) {
      console.warn('이미 사용한 카드');
      return;
    }

    // 대상 불일치 체크
    if (card.target !== target) {
      console.warn('잘못된 대상');
      return;
    }

    // 에너지 소모
    const newEnergy = state.player.energy - card.energyCost;

    // 카드 효과 적용
    let newPlayerHp = state.player.currentHp;
    let newEnemyHp = state.enemy.currentHp;
    let newNextTurnEnergyBonus = state.nextTurnEnergyBonus;
    let newSkipCounter = state.skipCounter;

    // 적 대상 카드
    if (card.target === 'enemy') {
      if (card.effect.damage) {
        newEnemyHp = Math.max(0, state.enemy.currentHp - card.effect.damage);
      }
      if (card.effect.selfDamage) {
        newPlayerHp = Math.max(0, state.player.currentHp - card.effect.selfDamage);
      }
    }

    // 플레이어 대상 카드
    if (card.target === 'player') {
      if (card.effect.heal) {
        newPlayerHp = Math.min(state.player.maxHp, state.player.currentHp + card.effect.heal);
      }
      if (card.effect.energyNext) {
        newNextTurnEnergyBonus += card.effect.energyNext;
      }
      if (card.effect.skipCounter) {
        newSkipCounter = true;
      }
    }

    // 상태 업데이트
    set({
      player: {
        ...state.player,
        energy: newEnergy,
        currentHp: newPlayerHp
      },
      enemy: {
        ...state.enemy,
        currentHp: newEnemyHp
      },
      usedCardIds: [...state.usedCardIds, card.id],
      nextTurnEnergyBonus: newNextTurnEnergyBonus,
      skipCounter: newSkipCounter
    });

    // 게임 오버 체크
    get().checkGameOver();
  },

  // ===== 턴 종료 =====
  endTurn: () => {
    const state = get();

    // 적 반격 (skipCounter가 아니면)
    let newPlayerHp = state.player.currentHp;
    if (!state.skipCounter) {
      newPlayerHp = Math.max(0, state.player.currentHp - state.enemy.counterDamage);
    }

    // 다음 턴 에너지 계산
    const nextEnergy = Math.min(
      state.player.maxEnergy,
      state.player.maxEnergy + state.nextTurnEnergyBonus
    );

    // 턴 종료 및 다음 턴 시작
    set({
      currentTurn: state.currentTurn + 1,
      player: {
        ...state.player,
        currentHp: newPlayerHp,
        energy: nextEnergy
      },
      usedCardIds: [],
      nextTurnEnergyBonus: 0,
      skipCounter: false
    });

    // 게임 오버 체크
    get().checkGameOver();
  },

  // ===== 게임 오버 체크 =====
  checkGameOver: () => {
    const state = get();

    if (state.player.currentHp <= 0) {
      set({ phase: 'defeat' });
    } else if (state.enemy.currentHp <= 0) {
      set({ phase: 'victory' });
    }
  },

  // ===== 게임 리셋 =====
  resetGame: () => {
    set({
      phase: 'battle',
      currentTurn: 1,
      player: { ...INITIAL_PLAYER },
      enemy: { ...INITIAL_ENEMY },
      hand: [...PHASE1_CARDS],
      usedCardIds: [],
      nextTurnEnergyBonus: 0,
      skipCounter: false
    });
  }
}));
