import React, { useState, useRef, useEffect } from 'react';

// ==========================================
// 1. СТРАНИЦА: BATTLE (Остается в твоем приложении)
// ==========================================
function BattleLobby() {
  const [playersCount, setPlayersCount] = useState(4);
  const [statusMessage, setStatusMessage] = useState('');
  const [stats, setStats] = useState({ coins: 15, points: 678, wins: 0 });

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

// ==========================================
// ГЛАВНЫЙ КОМПОНЕНТ С ШАПКОЙ И ССЫЛКАМИ
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('battle'); // По умолчанию открыт Battle
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      {/* Навбар */}
      <nav className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2 font-extrabold text-xl text-orange-500">
          <span>MARS</span>
          <span className="text-slate-800">SPACE</span>
        </div>

        {/* Кнопка джойстика и выпадающее меню */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 font-medium ${
              isMenuOpen ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="6" y1="12" x2="10" y2="12"></line>
              <line x1="8" y1="10" x2="8" y2="14"></line>
              <line x1="15" y1="13" x2="15.01" y2="13"></line>
              <line x1="18" y1="11" x2="18.01" y2="11"></line>
              <rect x="2" y="6" width="20" height="12" rx="6"></rect>
            </svg>
          </button>

          {/* Выпадающее окно с 3 пунктами */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-2.5 shadow-xl border border-slate-100 flex flex-col gap-1 z-50">
              
              {/* 1. Battle (Остается внутри твоего сайта) */}
              <button
                onClick={() => {
                  setActiveTab('battle');
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition cursor-pointer text-left ${
                  activeTab === 'battle' ? 'bg-orange-50 text-orange-600' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                <span>Battle</span>
              </button>

              {/* 2. MARSTYPE -> Ссылка на Monkeytype (откроется в новой вкладке) */}
              <a
                href="https://monkeytype.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer text-left"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                  <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"></path>
                </svg>
                <span>MARSTYPE (Monkeytype)</span>
              </a>

              {/* 3. Играть -> Ссылка на Яндекс Игры (откроется в новой вкладке) */}
              <a
                href="https://yandex.ru/games"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer text-left"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="3" ry="3"></rect>
                  <circle cx="8.5" cy="8.5" r="1"></circle>
                  <circle cx="15.5" cy="8.5" r="1"></circle>
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="8.5" cy="15.5" r="1"></circle>
                  <circle cx="15.5" cy="15.5" r="1"></circle>
                </svg>
                <span>Играть (Яндекс)</span>
              </a>

            </div>
          )}
        </div>
      </nav>

      {/* Отображаем Battle, если выбрана эта вкладка */}
      {activeTab === 'battle' && <BattleLobby />}
    </div>
  );
}