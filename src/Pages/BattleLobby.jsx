import { useState, useRef, useEffect } from 'react';

// ==========================================
// 1. СТРАНИЦА: BATTLE (Остается в твоем приложении)
// ==========================================
function BattleLobby() {
  const [playersCount, setPlayersCount] = useState(4);
  const [statusMessage, setStatusMessage] = useState('');
  const [stats] = useState({ coins: 15, points: 678, wins: 0 });

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="bg-slate-800 p-4 rounded-xl flex flex-wrap justify-between items-center gap-4 mb-6 border border-slate-700">
          <div>
            <span className="text-xs text-slate-400 uppercase">Текущий курс</span>
            <h2 className="text-lg font-bold text-orange-400">Python (начальный)</h2>
          </div>

          <div className="flex gap-4 sm:gap-6 text-center">
            <div className="bg-slate-700/50 px-4 py-2 rounded-lg">
              <p className="text-xs text-slate-400">Монеты</p>
              <p className="font-bold text-yellow-400">🪙 {stats.coins}</p>
            </div>
            <div className="bg-slate-700/50 px-4 py-2 rounded-lg">
              <p className="text-xs text-slate-400">Очки в бою</p>
              <p className="font-bold text-blue-400">⚡ {stats.points}</p>
            </div>
            <div className="bg-slate-700/50 px-4 py-2 rounded-lg">
              <p className="text-xs text-slate-400">Победы</p>
              <p className="font-bold text-green-400">🏆 {stats.wins}</p>
            </div>
          </div>
        </header>

        {statusMessage && (
          <div className="bg-indigo-600/30 border border-indigo-500 text-indigo-200 px-4 py-3 rounded-xl mb-6 flex justify-between items-center">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage('')} className="text-sm text-slate-300 hover:text-white cursor-pointer">
              ✕
            </button>
          </div>
        )}

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
            <div>
              <div className="inline-block bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
                Первая победа дня: ×2 ⚡
              </div>
              <h3 className="text-xl font-bold mb-2">Быстрый бой</h3>
              <p className="text-slate-400 text-sm mb-6">
                Сразись один на один со случайным учеником твоего уровня и заработай молнии.
              </p>
            </div>
            <button
              onClick={() => setStatusMessage('🔍 Ищем соперника по курсу Python (начальный)...')}
              className="w-full bg-orange-500 hover:bg-orange-600 font-bold py-3 rounded-xl transition cursor-pointer"
            >
              Найти соперника
            </button>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
            <div>
              <span className="text-xs text-purple-400 font-bold uppercase">Мультиплеер</span>
              <h3 className="text-xl font-bold mt-1 mb-2">Боевая комната</h3>
              <p className="text-slate-400 text-sm mb-4">
                Выбери количество участников и открой общую комнату для друзей.
              </p>
              <div className="mb-6">
                <p className="text-xs text-slate-400 mb-2">Количество учеников:</p>
                <div className="flex gap-2">
                  {[3, 4, 5, 6, 7, 8].map((num) => (
                    <button
                      key={num}
                      onClick={() => setPlayersCount(num)}
                      className={`w-8 h-8 rounded-lg font-bold text-sm transition cursor-pointer ${
                        playersCount === num ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setStatusMessage(`🚪 Создана комната на ${playersCount} учеников. Ждем остальных!`)}
              className="w-full bg-purple-600 hover:bg-purple-700 font-bold py-3 rounded-xl transition cursor-pointer"
            >
              Открыть комнату ({playersCount})
            </button>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
            <div>
              <span className="text-xs text-emerald-400 font-bold uppercase">Практика</span>
              <h3 className="text-xl font-bold mt-1 mb-2">Тренировка с ботом</h3>
              <p className="text-slate-400 text-sm mb-6">
                Потренируйся решать задачи без таймера. За этот режим молнии не даются.
              </p>
            </div>
            <button
              onClick={() => setStatusMessage('🤖 Запущена тренировка с ботом (молнии не начисляются).')}
              className="w-full bg-slate-700 hover:bg-slate-600 font-bold py-3 rounded-xl transition cursor-pointer"
            >
              Начать тренировку
            </button>
          </div>
        </main>
      </div>
    </div>
  );

}

export default BattleLobby