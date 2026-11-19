import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* ------------------------------ BATTLE ------------------------------ */
const Battle = ({ back }) => {
  const [tab, setTab] = useState('BATTLE');
  const [seats, setSeats] = useState(4);
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const find = () => {
    if (searching) {
      clearTimeout(timer.current);
      setSearching(false);
      return;
    }
    setFound(false);
    setSearching(true);
    timer.current = setTimeout(() => {
      setSearching(false);
      setFound(true);
    }, 2500);
  };

  return (
    <div className="page dark">
      <style>{battleCss}</style>

      <div className="nav">
        <button className="back" onClick={back}>← Chiqish</button>
        <div className="tabs">
          {['BATTLE', 'REYTING', 'RAQIBLAR', 'EMOTSIYALAR'].map((t) => (
            <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        <span className="vol">🔊</span>
      </div>

      <div className="bt">
        <div className="pills">
          <div className="pill2">
            <i className="gdot" /> <b className="g">6</b> <small>SPACE'DA</small>
            <span className="sep" />
            <b className="o">677</b> <small>JANGDA</small>
          </div>
          <div className="pill2">
            ⚡ <b>0</b> <small>CHAQMOQLAR</small>
            🔥 <b>0</b> <small>SERIYA</small>
            🏆 <b>0</b> <small>G'ALABALAR</small>
          </div>
        </div>

        <div className="vs">
          <div className="side-p">
            <span className="ring">👨‍🚀</span>
            <small>SIZ</small>
          </div>
          <span className="vs-t">VS</span>
          <div className="side-p">
            <span className={'ring empty' + (found ? ' got' : '')}>{found ? '🤖' : '+'}</span>
            <small>{found ? 'RAQIB' : 'TANLASH'}</small>
          </div>
        </div>

        <button className={'find' + (searching ? ' busy' : '')} onClick={find}>
          {searching ? 'QIDIRILMOQDA… (bekor qilish)' : found ? 'JANGNI BOSHLASH' : 'RAQIB TOPISH'}
        </button>

        <p className="first">Bugungi birinchi g'alaba: ×2 ⚡</p>
        <button className="topic">PYTHON · BOSHLANG'ICH ✎</button>

        <div className="room">
          <div className="room-h">
            <b>JANG XONASI</b> <small>3-8 o'quvchi bitta jangda</small>
          </div>
          <div className="room-b">
            <span className="lbl">Joylar:</span>
            {[3, 4, 6, 8].map((n) => (
              <button
                key={n}
                className={'seat' + (seats === n ? ' on' : '')}
                onClick={() => setSeats(n)}
              >
                {n}
              </button>
            ))}
            <button className="open" onClick={() => alert(`${seats} kishilik xona ochildi`)}>
              XONA OCHISH
            </button>
          </div>
        </div>

        <div className="opp">
          <button className={'sw' + (open ? ' on' : '')} onClick={() => setOpen(!open)}>
            <i />
          </button>
          <div>
            <b>Men raqib qidiryapman</b>
            <small>
              {open ? "Siz raqiblar ro'yxatidasiz" : "Siz hech qaysi ro'yxatda yo'qsiz"}
            </small>
          </div>
          <button className="rq" onClick={() => setTab('RAQIBLAR')}>
            RAQIBLAR →
          </button>
        </div>

        <button className="bot">🤖 BOT BILAN MASHQ</button>
        <p className="foot">Mashq uchun chaqmoq berilmaydi.</p>
      </div>
    </div>
  );
};

/* ---------------------------- BATTLE CSS ---------------------------- */
const battleCss = `
*{box-sizing:border-box}
.page{min-height:100vh;font-family:'Nunito','Segoe UI',system-ui,sans-serif;padding:20px}
.page.dark{background:radial-gradient(ellipse at 50% 0,#14173a 0,#0a0c1f 55%,#07081a 100%);color:#e8eaff;padding:20px 20px 60px}
.page button{font-family:inherit;cursor:pointer}

.nav{max-width:920px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;position:relative}
.back{background:none;border:0;color:#aab3e0;font-size:13px;padding:6px}
.tabs{display:flex;border:1px solid #2b3262;background:#0e1230}
.tabs button{background:none;border:0;color:#aab3e0;font-size:11px;letter-spacing:.14em;font-weight:700;padding:10px 16px}
.tabs button.on{background:#6cbf3f;color:#fff}
.vol{opacity:.7}

.bt{max-width:910px;margin:44px auto 0;display:flex;flex-direction:column;align-items:center}
.pills{display:flex;gap:22px;margin-bottom:18px;flex-wrap:wrap;justify-content:center}
.pill2{display:flex;align-items:center;gap:8px;border:1px solid #2b3262;background:rgba(20,26,60,.7);border-radius:30px;padding:9px 18px;font-size:13px}
.pill2 small{font-size:10px;letter-spacing:.1em;color:#9aa3d6;margin-right:10px}
.pill2 b{font-size:17px}
.pill2 b.g{color:#6cd44a}
.pill2 b.o{color:#ff7a45;font-size:20px}
.gdot{width:8px;height:8px;border-radius:50%;background:#6cd44a}
.sep{width:1px;height:20px;background:#2b3262;margin:0 8px}

.vs{display:flex;align-items:center;gap:46px;margin-top:6px}
.side-p{display:flex;flex-direction:column;align-items:center;gap:12px}
.side-p small{font-size:11px;letter-spacing:.14em;color:#aab3e0;font-weight:700}
.ring{width:86px;height:86px;border-radius:50%;border:3px solid #34406f;background:#10163a;display:grid;place-items:center;font-size:42px}
.ring.empty{border:2px dashed #3b4478;font-size:30px;color:#7b86bd;background:transparent}
.ring.got{border-style:solid;color:#fff;font-size:42px}
.vs-t{font-size:26px;font-weight:900;color:#c4592c;letter-spacing:.1em;margin-top:-22px}

.find{margin-top:26px;width:400px;max-width:100%;background:#b85a2f;border:0;border-bottom:5px solid #8f4222;color:#fff;font-size:22px;letter-spacing:.2em;font-weight:800;padding:20px 0}
.find:hover{filter:brightness(1.08)}
.find.busy{background:#46507f;border-bottom-color:#2e3560;font-size:14px;letter-spacing:.1em}

.first{margin:18px 0 12px;font-weight:700;font-size:14px;color:#ffe9b0}
.topic{background:transparent;border:1px solid #3a4378;color:#dfe3ff;font-size:11px;letter-spacing:.12em;font-weight:700;padding:10px 14px}

.room{width:100%;margin-top:54px;border:1px solid #232b5a;background:rgba(18,23,58,.85);border-radius:12px;padding:16px 16px 18px}
.room-h{margin-bottom:14px}
.room-h b{letter-spacing:.06em;margin-right:8px}
.room-h small{color:#a9b2dd;font-size:12px}
.room-b{display:flex;align-items:center;gap:8px}
.lbl{font-size:12px;color:#a9b2dd;margin-right:4px}
.seat{width:34px;height:30px;background:#12183f;border:1px solid #2b3262;border-radius:6px;color:#fff;font-weight:700}
.seat.on{border-color:#6cd44a;color:#6cd44a}
.open{margin-left:auto;background:linear-gradient(90deg,#6cbf3f,#f0a24a);border:0;border-radius:8px;color:#fff;font-weight:800;letter-spacing:.1em;font-size:13px;padding:11px 16px}

.opp{width:100%;margin-top:42px;border:1px solid #232b5a;background:rgba(18,23,58,.6);padding:12px 14px;display:flex;align-items:center;gap:12px}
.opp div{flex:1;display:flex;flex-direction:column}
.opp b{font-size:13px}
.opp small{color:#9aa3d6;font-size:11px}
.sw{width:44px;height:24px;border-radius:14px;border:0;background:#2a3262;padding:3px;display:flex}
.sw i{width:18px;height:18px;border-radius:50%;background:#aab3e0;transition:transform .2s}
.sw.on{background:#4ca02b}
.sw.on i{transform:translateX(20px);background:#fff}
.rq{background:transparent;border:1px solid #3a4378;color:#cfd6ff;font-size:11px;letter-spacing:.1em;padding:7px 12px;font-weight:700}

.bot{margin-top:16px;background:transparent;border:1px solid #3a4378;color:#fff;letter-spacing:.14em;font-weight:700;font-size:12px;padding:14px 30px}
.foot{font-size:11px;color:#7c86bb;margin:10px 0 0}

@media(max-width:860px){
  .vs{gap:20px}
}
`;

// ==========================================
// ГЛАВНЫЙ КОМПОНЕНТ С ШАПКОЙ И ССЫЛКАМИ
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('battle'); // По умолчанию открыт Battle
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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
                <span>Играть в (Яндекс)</span>
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Отображаем Battle, если выбрана эта вкладка */}
      {activeTab === 'battle' && <Battle back={() => navigate('/')} />}
    </div>
  );
}