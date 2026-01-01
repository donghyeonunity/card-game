/**
 * 드래그 가능한 카드 컴포넌트 (MVP)
 * Framer Motion을 사용한 드래그앤드롭
 */

import { motion } from 'framer-motion';
import { useRef } from 'react';
import type { Card, CardTarget } from '../types';
import { useBattleStore } from '../stores/battleStore';

interface DraggableCardProps {
  card: Card;
  isUsed: boolean;
  canAfford: boolean;
}

export function DraggableCard({ card, isUsed, canAfford }: DraggableCardProps) {
  const { playCard } = useBattleStore();
  const constraintsRef = useRef(null);

  // 카드를 드롭했을 때 대상 영역 감지
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number; y: number } }) => {
    const { x } = info.point;
    const windowWidth = window.innerWidth;

    // 화면 중앙을 기준으로 좌우 판정
    const isLeftSide = x < windowWidth / 2;
    const target: CardTarget = isLeftSide ? 'player' : 'enemy';

    // 드롭존 요소 확인
    const dropzoneId = isLeftSide ? 'player-dropzone' : 'enemy-dropzone';
    const dropzone = document.getElementById(dropzoneId);

    if (dropzone) {
      const rect = dropzone.getBoundingClientRect();
      const { x: pointX, y: pointY } = info.point;

      // 드롭존 영역 안에 있는지 확인
      if (
        pointX >= rect.left &&
        pointX <= rect.right &&
        pointY >= rect.top &&
        pointY <= rect.bottom
      ) {
        // 카드 플레이
        playCard(card.id, target);
      }
    }
  };

  // 사용할 수 없는 카드는 드래그 불가
  const isDraggable = !isUsed && canAfford;

  // 카드 색상 (대상에 따라)
  const cardColor = card.target === 'enemy'
    ? 'from-red-700 to-red-600'
    : 'from-blue-700 to-blue-600';

  const borderColor = card.target === 'enemy'
    ? 'border-red-500'
    : 'border-blue-500';

  return (
    <motion.div
      ref={constraintsRef}
      drag={isDraggable}
      dragSnapToOrigin={true}
      dragElastic={0.2}
      dragConstraints={constraintsRef}
      onDragEnd={handleDragEnd}
      whileHover={isDraggable ? { scale: 1.05, y: -10 } : {}}
      whileDrag={{ scale: 1.1, rotate: 5, zIndex: 50 }}
      className={`
        relative w-40 h-56 rounded-xl p-4
        bg-gradient-to-br ${cardColor}
        border-2 ${borderColor}
        ${isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-50'}
        ${isUsed ? 'grayscale' : ''}
        shadow-lg
      `}
      style={{
        userSelect: 'none'
      }}
    >
      {/* 카드 번호 */}
      <div className="absolute top-2 left-2 text-xs font-mono text-white/60">
        #{card.cardNumber}
      </div>

      {/* 에너지 비용 */}
      <div className="absolute top-2 right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold text-yellow-900">
        {card.energyCost}
      </div>

      {/* 카드 제목 */}
      <div className="mt-8 text-center">
        <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
        <p className="text-sm text-gray-200 leading-tight">
          {card.description}
        </p>
      </div>

      {/* 대상 표시 */}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="text-xs font-bold text-white/80">
          {card.target === 'enemy' ? '→ 적 대상' : '← 자신 대상'}
        </span>
      </div>

      {/* 사용 불가 오버레이 */}
      {!canAfford && !isUsed && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-sm">에너지 부족</span>
        </div>
      )}

      {isUsed && (
        <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-sm">사용됨</span>
        </div>
      )}
    </motion.div>
  );
}
