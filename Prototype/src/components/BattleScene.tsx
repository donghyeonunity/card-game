/**
 * 배틀씬 레이아웃 컴포넌트 (MVP)
 * 좌우 배치: 플레이어(왼쪽) vs 적(오른쪽)
 */

import { motion } from 'framer-motion';
import { useBattleStore } from '../stores/battleStore';

export function BattleScene() {
  const { player, enemy, currentTurn, skipCounter } = useBattleStore();

  const playerHpPercent = (player.currentHp / player.maxHp) * 100;
  const enemyHpPercent = (enemy.currentHp / enemy.maxHp) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 상단: 턴 정보 */}
      <div className="text-center mb-8">
        <span className="text-2xl font-bold text-white bg-gray-700 px-6 py-2 rounded-full">
          턴 {currentTurn}
        </span>
      </div>

      {/* 중앙: 플레이어(왼쪽) vs 적(오른쪽) */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* 왼쪽: 플레이어 영역 */}
        <div
          id="player-dropzone"
          className="bg-blue-900/30 border-4 border-blue-500/50 rounded-2xl p-6 transition-all"
        >
          <div className="text-center mb-4">
            <span className="text-4xl">🧙</span>
            <h2 className="text-2xl font-bold text-blue-400 mt-2">플레이어</h2>
          </div>

          {/* HP 바 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-blue-300">HP</span>
              <span className="text-sm font-mono text-gray-300">
                {player.currentHp} / {player.maxHp}
              </span>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                animate={{ width: `${playerHpPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* 에너지 게이지 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-yellow-300">에너지</span>
              <span className="text-sm font-mono text-gray-300">
                {player.energy} / {player.maxEnergy}
              </span>
            </div>
            <div className="flex gap-2 justify-center">
              {Array.from({ length: player.maxEnergy }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    i < player.energy
                      ? 'bg-yellow-500 text-yellow-900'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                  initial={{ scale: 1 }}
                  animate={{ scale: i < player.energy ? [1, 1.15, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {i < player.energy ? '⚡' : '○'}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 mt-4">
            ← 카드를 여기로 드래그
          </div>
        </div>

        {/* 오른쪽: 적 영역 */}
        <div
          id="enemy-dropzone"
          className="bg-red-900/30 border-4 border-red-500/50 rounded-2xl p-6 transition-all"
        >
          <div className="text-center mb-4">
            <span className="text-4xl">👹</span>
            <h2 className="text-2xl font-bold text-red-400 mt-2">적</h2>
          </div>

          {/* HP 바 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-red-300">HP</span>
              <span className="text-sm font-mono text-gray-300">
                {enemy.currentHp} / {enemy.maxHp}
              </span>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-600 to-red-400"
                animate={{ width: `${enemyHpPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* 반격 정보 */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
            <div className="text-sm text-gray-300 text-center">
              <div className="font-bold text-orange-400 mb-1">반격</div>
              {skipCounter ? (
                <div className="text-green-400">무효화됨 🛡️</div>
              ) : (
                <div className="text-red-300">턴 종료 시 -{enemy.counterDamage} HP</div>
              )}
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 mt-4">
            카드를 여기로 드래그 →
          </div>
        </div>
      </div>
    </div>
  );
}
