/**
 * Phase 1 프로토타입 메인 애플리케이션 (MVP - 드래그앤드롭)
 * 에너지 기반 카드 시스템
 */

import { motion } from 'framer-motion';
import { useBattleStore } from './stores/battleStore';
import { BattleScene } from './components/BattleScene';
import { CardHand } from './components/CardHand';
import { ResultScreen } from './components/ResultScreen';

function App() {
  const { phase, endTurn, resetGame } = useBattleStore();

  // 전투 화면
  if (phase === 'battle') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* 상단: 전투 UI (플레이어 vs 적) */}
          <BattleScene />

          {/* 중앙: 손패 카드 */}
          <div className="bg-gray-800/50 rounded-2xl p-6">
            <CardHand />
          </div>

          {/* 하단: 턴 종료 버튼 */}
          <div className="flex justify-center">
            <motion.button
              onClick={endTurn}
              className="px-12 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl font-bold text-lg shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              턴 종료
            </motion.button>
          </div>

          {/* 게임 설명 */}
          <div className="text-center text-gray-400 text-sm space-y-1">
            <p>카드를 드래그하여 플레이어(왼쪽) 또는 적(오른쪽)에게 사용하세요</p>
            <p>턴 종료 시 적이 반격합니다 (10 데미지)</p>
          </div>
        </div>
      </div>
    );
  }

  // 승리/패배 화면
  if (phase === 'victory' || phase === 'defeat') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 md:p-8">
        <ResultScreen phase={phase} onRestart={resetGame} />
      </div>
    );
  }

  // 기본 화면 (오류)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
      <p className="text-gray-400">알 수 없는 상태: {phase}</p>
    </div>
  );
}

export default App;
