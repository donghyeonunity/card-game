/**
 * 손패 카드 영역 컴포넌트 (MVP)
 * 드래그 가능한 카드들을 가로로 배치
 */

import { DraggableCard } from './DraggableCard';
import { useBattleStore } from '../stores/battleStore';

export function CardHand() {
  const { hand, usedCardIds, player } = useBattleStore();

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white">손패 카드</h3>
        <p className="text-sm text-gray-400 mt-1">
          카드를 드래그하여 플레이어(왼쪽) 또는 적(오른쪽)에게 사용하세요
        </p>
      </div>

      {/* 카드 배치 */}
      <div className="flex justify-center gap-4 flex-wrap">
        {hand.map((card) => {
          const isUsed = usedCardIds.includes(card.id);
          const canAfford = player.energy >= card.energyCost;

          return (
            <DraggableCard
              key={card.id}
              card={card}
              isUsed={isUsed}
              canAfford={canAfford}
            />
          );
        })}
      </div>
    </div>
  );
}
