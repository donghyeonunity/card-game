/**
 * 승리/패배 화면 컴포넌트 (MVP)
 * 게임 결과 표시 및 재시작 버튼
 */

import { motion } from 'framer-motion';
import type { GamePhase } from '../types';

interface ResultScreenProps {
  phase: GamePhase;
  onRestart: () => void;
}

export function ResultScreen({ phase, onRestart }: ResultScreenProps) {
  const isVictory = phase === 'victory';

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-gray-800 rounded-2xl p-12 max-w-md w-full text-center"
        initial={{ scale: 0.5, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        {/* 이모지 */}
        <motion.div
          className="text-8xl mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: 0.2, type: 'spring', duration: 0.8 }}
        >
          {isVictory ? '🎉' : '💀'}
        </motion.div>

        {/* 결과 제목 */}
        <h1
          className={`text-5xl font-bold mb-4 ${
            isVictory ? 'text-yellow-400' : 'text-red-400'
          }`}
        >
          {isVictory ? '승리!' : '패배...'}
        </h1>

        {/* 결과 메시지 */}
        <p className="text-gray-300 text-lg mb-8">
          {isVictory
            ? '적을 물리쳤습니다!'
            : '다음에는 더 잘할 수 있을 거예요.'
          }
        </p>

        {/* 재시작 버튼 */}
        <motion.button
          onClick={onRestart}
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl font-bold text-lg shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          다시 시작
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
