import { useState, useRef, useEffect } from 'react'
import BattleLobby from './BattleLobby'

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
