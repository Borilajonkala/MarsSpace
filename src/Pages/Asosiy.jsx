import { useEffect, useRef, useState } from 'react'
import {
  LuBot,
  LuCheck,
  LuCrown,
  LuFlame,
  LuGift,
  LuGraduationCap,
  LuKeyboard,
  LuLock,
  LuPencil,
  LuShoppingBag,
  LuSparkles,
  LuStar,
  LuTrophy,
  LuUsers,
  LuVolume2,
  LuZap,
} from 'react-icons/lu'
import { DEFAULT_AVATAR, useProfile } from '../profile/ProfileContext.js'
/* ---------- Asosiy sahifa (3 ta ekran: home / typing / battle) ---------- */
const Asosiy = () => {
  const [view, setView] = useState('home') // 'home' | 'typing' | 'battle'

  return (
    <>
      <style>{css}</style>
      {view === 'home' && <Home go={setView} />}
      {view === 'typing' && <Typing back={() => setView('home')} />}
      {view === 'battle' && <Battle back={() => setView('home')} />}
    </>
  )
}


const MODULES = [
  {
    title: 'Modul 1',
    done: 11,
    lessons: [
      'Frontendga kirish',
      'Html taglar Va Extensionlardan foydalanish',
      'Iframe va <a> taglari',
      'Rasm turlari va img tag',
      "Ro'yxat elementlar",
      'Imtihon',
      'Css ga kirish',
      'Css Davomi',
      'Table',
      'Form taglari',
      'Box Modeling',
      'Imtihon', 
    ],
  },
  { title: 'Modul 2', done: 12 },
  { title: 'Modul 3', done: 7 },
  { title: 'Modul 4', done: 12 },
  { title: 'Modul 5', done: 11 },
  { title: 'Modul 6', done: 12 },
  { title: 'Modul 7', done: 12 },
  { title: 'Modul 8', done: 12 },
  { title: 'Modul 9', done: 12 },
  { title: 'Modul 10', done: 12 },
  { title: 'Modul 11', done: 6 },
].map((m) => ({
  ...m,
  // darsi nomi berilmagan modullar uchun vaqtincha nom
  lessons: m.lessons || Array.from({ length: 12 }, (_, i) => `${i + 1}-dars`),
}))

const TOTAL_LESSONS = MODULES.reduce((s, m) => s + m.lessons.length, 0)
const DONE_LESSONS = MODULES.reduce((s, m) => s + m.done, 0)

const KursXaritasi = () => {
  // bir vaqtda bitta modul ochiq bo'ladi (null = hammasi yopiq)
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <div className="kx-card">
      <header className="kx-head">
        <div>
          <small>[NEW] FRONT-END</small>
          <h2>Kurs xaritasi</h2>
        </div>
        <b>{DONE_LESSONS}/{TOTAL_LESSONS}</b>
      </header>

      {MODULES.map((m, i) => {
        const open = openIdx === i
        const total = m.lessons.length
        const finished = m.done === total
        const pct = Math.round((m.done / total) * 100)

        return (
          <section key={i} className={'kx-mod' + (open ? ' open' : '')}>
            <button
              className="kx-row"
              onClick={() => setOpenIdx(open ? null : i)}
              aria-expanded={open}
            >
              <span className="kx-arrow">▸</span>
              <span className="kx-info">
                <strong>{m.title}</strong>
                <small>{m.done}/{total} dars</small>
              </span>
              <span className={'kx-pct' + (finished ? ' ok' : '')}>
                {finished && <LuCheck aria-hidden="true" />}
                {pct}%
              </span>
            </button>

            {open && (
              <div className="kx-list">
                {m.lessons.map((l, j) => {
                  const isDone = j < m.done
                  const isCurrent = j === m.done
                  return (
                    <div
                      key={j}
                      className={'kx-item' + (isDone ? ' done' : '') + (isCurrent ? ' current' : '')}
                    >
                      <span className="kx-node">
                        {isDone ? (
                          <LuCheck aria-hidden="true" />
                        ) : isCurrent ? (
                          <LuStar aria-hidden="true" />
                        ) : (
                          <LuLock aria-hidden="true" />
                        )}
                      </span>
                      <span className="kx-text">
                        <span className="kx-name">{l}</span>
                        {isCurrent && <em>BOSHLASH</em>}
                      </span>
                    </div>
                  )
                })}

                {/* Modul sovg'asi */}
                <div className={'kx-item gift' + (finished ? ' ready' : '')}>
                  <span className="kx-node">
                    {finished ? <LuGift aria-hidden="true" /> : <LuLock aria-hidden="true" />}
                  </span>
                  <span className="kx-text">
                    <span className="kx-name">Modul sovg'asi</span>
                    <em>{finished ? 'OLISH' : 'YOPIQ'}</em>
                  </span>
                </div>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

/* ------------------------------ HOME ------------------------------ */
const Home = ({ go }) => {
  const { profile, fullName } = useProfile()
  const [left, setLeft] = useState(9 * 60 + 28)

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  const mm = Math.floor(left / 60)
  const ss = String(left % 60).padStart(2, '0')

  const tasks = [
    { icon: <LuKeyboard aria-hidden="true" />, title: 'MARSTYPE: 5 daqiqa', right: '0 / 300', active: true, onClick: () => go('typing') },
    { icon: <LuZap aria-hidden="true" />, title: "Jang o'ynash", right: '—', onClick: () => go('battle') },
    { icon: <LuKeyboard aria-hidden="true" />, title: 'MARSTYPE: «Kod» mashq', right: '—', onClick: () => go('typing') },
  ]

  const group = [
    { n: fullName.split(' ')[0] || 'Siz', avatar: profile.avatar, me: true },
    { n: 'Bahtiyorov', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Bahtiyorov', on: true },
    { n: 'Sunnatov', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sunnatov', on: true },
    { n: 'Abduramon…', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Abduramon' },
    { n: 'Behzod', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Behzod' },
    { n: 'Musulmonov', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Musulmonov' },
    { n: 'Yusupov', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Yusupov' },
  ]

  return (
    <div className="page">
      <div className="wrap">
        <section className="exam">
          <div className="exam-top">
            <p className="crumb">
              [NEW] FRONT-END · MODUL 1 · <span className="pill">3-DARAJA ⌄</span>
            </p>
            <h1>Imtihon</h1>
            <p className="sub">10 / 12 dars · 83%</p>
            <div className="bar"><i style={{ width: '83%' }} /></div>
            <div className="btns">
              <button className="b-yellow">BOSHLASH</button>
              <button className="b-outline">Modul haqida</button>
            </div>
          </div>

          <div className="comet">
            <div className="comet-head">
              <span className="ball" />
              <div className="dots">
                <span className="dot on"><LuKeyboard aria-hidden="true" /></span>
                <span className="dot"><LuZap aria-hidden="true" /></span>
                <span className="dot"><LuKeyboard aria-hidden="true" /></span>
              </div>
              <div className="comet-txt">
                <small>
                  BUGUNGI KOMETA · 0 / 3 ·{' '}
                  <b>
                    <LuFlame className="inline align-[-2px]" aria-hidden="true" /> KETMA-KET 2 KUN — HAR KUNI +1 COIN
                  </b>
                </small>
                <strong>MARSTYPE: 5 daqiqa — 0 / 300</strong>
              </div>
              <span className="timer">⏱ {mm}:{ss}</span>
              <button className="b-green" onClick={() => go('typing')}>O'ynash →</button>
            </div>

            {tasks.map((t, i) => (
              <div className="trow" key={i}>
                <button className={'task' + (t.active ? ' active' : '')} onClick={t.onClick}>
                  <span className="ti">{t.icon}</span>
                  <span className="tt">{t.title}</span>
                  <span className="tr">{t.right}</span>
                </button>
                <button className="q">?</button>
              </div>
            ))}

            <p className="note">Har bir vazifa uchun +1 coin, uchalasi uchun +2. Ertaga yangi uchlik.</p>
            <p className="note">
              Ketma-ket yig'ilgan kunlar: 2-kundan +1 coin, 15-kundan +2 coin, 30-kundan +3 coin. Bir kun
              yig'ilmasa, hisob noldan boshlanadi. Yana 2 kundan keyin — har kuni +1 coin.
            </p>
          </div>
        </section>

        <div className="grid">
          <div className="main-col">
            {/* GURUH — modullar tepasida */}
            <section className="card grp">
              <h3 className="card-h grp-h">
                <span className="inline-flex items-center gap-2">
                  <LuUsers aria-hidden="true" /> Guruh · YB-3158
                </span>
                <span className="online"><i className="gdot" /> {group.filter((g) => g.on).length}</span>
              </h3>
              <div className="group">
                {group.map((g, i) => (
                  <div className="gm" key={i}>
                    <span className="av">
                      {g.avatar ? (
                        <img
                          src={g.avatar}
                          alt=""
                          className="av-img"
                          onError={(event) => {
                            event.currentTarget.src = DEFAULT_AVATAR
                          }}
                        />
                      ) : (
                        <span className="av-letter">{g.n.slice(0, 1)}</span>
                      )}
                      {g.on && <i className="on-dot" />}
                    </span>
                    <span className={'gn' + (g.me ? ' me' : '')}>{g.n}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* KURS XARITASI — modul ustiga bosilganda darslar ochiladi */}
            <div style={{ marginTop: 26 }}>
              <KursXaritasi />
            </div>
          </div>

          <Sidebar go={go} />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ O'NG USTUN ------------------------------ */
const RATING = [
  { n: 'Islomov H.', s: '6 370' },
  { n: 'Hasanov A.', s: '6 260' },
  { n: 'Erkinova M.', s: '6 100' },
]

const DAYS = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']

const Sidebar = ({ go }) => {
  const { fullName, xp } = useProfile()
  // qo'shimcha dars uchun tanlangan kunlar (Dush — yopiq)
  const [picked, setPicked] = useState([])
  const toggle = (d) =>
    setPicked((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]))

  const games = [
    { icon: <LuZap aria-hidden="true" />, title: 'MARSTYPE', onClick: () => go('typing') },
    { icon: <LuTrophy aria-hidden="true" />, title: 'Battle', onClick: () => go('battle') },
    { icon: '</>', title: 'Algo' },
    { icon: <LuShoppingBag aria-hidden="true" />, title: 'Space shop', right: '7' },
  ]

  return (
    <aside className="sb">
      <section className="card side">
        <h4>VAZIFALAR <em>2</em></h4>
        <ul className="dots-list">
          <li>Imtihon</li>
          <li>Deployment (vercel)</li>
        </ul>
      </section>

      <section className="card side">
        <h4>REYTING <a href="#!">Batafsil</a></h4>
        <ul className="rate">
          {RATING.map((r, i) => (
            <li key={i}>
              <span className="rn">{i + 1}</span>
              <span className="rname">{r.n}</span>
              <b>{r.s}</b>
            </li>
          ))}
          <li className="me">
            <span className="rn">—</span>
            <span className="rname">{fullName}</span>
            <b>{xp}</b>
          </li>
        </ul>
      </section>

      <section className="card side premium">
        <h4 className="prem-h">
          <LuCrown aria-hidden="true" /> SPACE PREMIUM
        </h4>
        <p>Mars IT School'da o'qish orqali yoqilgan</p>
        <button className="prem-btn">Premium nima beradi</button>
      </section>

      <section className="card side">
        <h4>QO'SHIMCHA DARS</h4>
        <div className="days">
          {DAYS.map((d, i) => (
            <div key={d} className="day">
              <small>{d}</small>
              <button
                className={'plus' + (picked.includes(d) ? ' on' : '')}
                disabled={i === 0}
                onClick={() => toggle(d)}
              >
                {picked.includes(d) ? <LuCheck aria-hidden="true" /> : '+'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="card side">
        <h4>MASHQ VA O'YINLAR</h4>
        <ul className="games">
          {games.map((g, i) => (
            <li key={i}>
              <button onClick={g.onClick}>
                <span className="gi">{g.icon}</span>
                <span className="gt">{g.title}</span>
                {g.right && <b>{g.right}</b>}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card side">
        <h4>SO'ROVNOMA</h4>
        <ul className="games">
          <li>
            <button>
              <span className="gi"><LuGraduationCap aria-hidden="true" /></span>
              <span className="gt">Darslarni baholash</span>
              <b>+16</b>
            </button>
          </li>
        </ul>
      </section>
    </aside>
  )
}

/* ---------------------------- TYPING TEST ---------------------------- */
const WORDS =
  "kod yozish bu san'at har kuni mashq qilsang tezroq yozasan klaviatura ustida barmoqlar raqs tushadi sabr bilan davom et xatolardan qo'rqma ular o'rgatadi dastur tuzish mantiq talab qiladi o'zgaruvchi funksiya massiv obyekt komponent holat".split(' ')

const makeText = () => {
  const out = []
  while (out.join(' ').length < 400) {
    out.push(WORDS[Math.floor(Math.random() * WORDS.length)])
  }
  return out.join(' ').slice(0, 400)
}

const Typing = ({ back }) => {
  const TOTAL = 300

  const [text] = useState(makeText)

  const [typed, setTyped] = useState('')
  const [time, setTime] = useState(300)
  const [started, setStarted] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!started) return
    const t = setInterval(() => setTime((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [started])

  const correct = [...typed].filter((c, i) => c === text[i]).length
  const done = time === 0 || correct >= TOTAL
  const elapsed = 300 - time
  const wpm = elapsed ? Math.round(correct / 5 / (elapsed / 60)) : 0
  const acc = typed.length ? Math.round((correct / typed.length) * 100) : 100

  const onChange = (e) => {
    if (done) return
    if (!started) setStarted(true)
    setTyped(e.target.value.slice(0, text.length))
  }

  const restart = () => {
    setTyped('')
    setTime(300)
    setStarted(false)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <div className="page dark" onClick={() => inputRef.current?.focus()}>
      <div className="nav">
        <button className="back" onClick={back}>← Chiqish</button>
      </div>

      <div className="mt">
        <div className="mt-stats">
          <span>{Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}</span>
          <span>{wpm} wpm</span>
          <span>{acc}%</span>
          <span>{Math.min(correct, TOTAL)} / {TOTAL}</span>
        </div>

        {done ? (
          <div className="mt-done">
            <h2 className="inline-flex items-center gap-2">
              {correct >= TOTAL ? 'Vazifa bajarildi!' : 'Vaqt tugadi'}
              {correct >= TOTAL && <LuSparkles aria-hidden="true" />}
            </h2>
            <p>{wpm} wpm · aniqlik {acc}%</p>
            <button className="b-green" onClick={restart}>Qayta boshlash</button>
          </div>
        ) : (
          <div className="mt-text">
            {[...text].map((c, i) => {
              let cls = ''
              if (i < typed.length) cls = typed[i] === c ? 'ok' : 'bad'
              else if (i === typed.length) cls = 'cur'
              return <span key={i} className={cls}>{c}</span>
            })}
          </div>
        )}

        <input
          ref={inputRef}
          className="mt-input"
          value={typed}
          onChange={onChange}
          autoFocus
        />
        {!done && <p className="hint">Yozishni boshlang — taymer birinchi harfda ishga tushadi</p>}
      </div>
    </div>
  )
}

/* ------------------------------ BATTLE ------------------------------ */
const Battle = ({ back }) => {
  const { profile, fullName } = useProfile()
  const [tab, setTab] = useState('BATTLE')
  const [seats, setSeats] = useState(4)
  const [searching, setSearching] = useState(false)
  const [found, setFound] = useState(false)
  const [open, setOpen] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const find = () => {
    if (searching) {
      clearTimeout(timer.current)
      setSearching(false)
      return
    }
    setFound(false)
    setSearching(true)
    timer.current = setTimeout(() => {
      setSearching(false)
      setFound(true)
    }, 2500)
  }

  return (
    <div className="page dark">
      <div className="nav">
        <button className="back" onClick={back}>← Chiqish</button>
        <div className="tabs">
          {['BATTLE', 'REYTING', 'RAQIBLAR', 'EMOTSIYALAR'].map((t) => (
            <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <span className="vol"><LuVolume2 aria-hidden="true" /></span>
      </div>

      <div className="bt">
        <div className="pills">
          <div className="pill2">
            <i className="gdot" /> <b className="g">6</b> <small>SPACE'DA</small>
            <span className="sep" />
            <b className="o">677</b> <small>JANGDA</small>
          </div>
          <div className="pill2">
            <LuZap aria-hidden="true" /> <b>0</b> <small>CHAQMOQLAR</small>
            <LuFlame aria-hidden="true" /> <b>0</b> <small>SERIYA</small>
            <LuTrophy aria-hidden="true" /> <b>0</b> <small>G'ALABALAR</small>
          </div>
        </div>

        <div className="vs">
          <div className="side-p">
            <span className="ring">
              <img
                src={profile.avatar || DEFAULT_AVATAR}
                alt={`${fullName} avatari`}
                onError={(event) => {
                  event.currentTarget.src = DEFAULT_AVATAR
                }}
              />
            </span>
            <small>{fullName.split(' ')[0] || 'SIZ'}</small>
          </div>
          <span className="vs-t">VS</span>
          <div className="side-p">
            <span className={'ring empty' + (found ? ' got' : '')}>
              {found ? <LuBot aria-hidden="true" /> : '+'}
            </span>
            <small>{found ? 'RAQIB' : 'TANLASH'}</small>
          </div>
        </div>

        <button className={'find' + (searching ? ' busy' : '')} onClick={find}>
          {searching ? 'QIDIRILMOQDA… (bekor qilish)' : found ? 'JANGNI BOSHLASH' : 'RAQIB TOPISH'}
        </button>

        <p className="first">
          Bugungi birinchi g'alaba: ×2 <LuZap className="inline align-[-2px]" aria-hidden="true" />
        </p>
        <button className="topic">
          PYTHON · BOSHLANG'ICH <LuPencil className="inline align-[-2px]" aria-hidden="true" />
        </button>

        <div className="room">
          <div className="room-h">
            <b>JANG XONASI</b> <small>3-8 o'quvchi bitta jangda</small>
          </div>
          <div className="room-b">
            <span className="lbl">Joylar:</span>
            {[3, 4, 6, 8].map((n) => (
              <button key={n} className={'seat' + (seats === n ? ' on' : '')} onClick={() => setSeats(n)}>
                {n}
              </button>
            ))}
            <button className="open" onClick={() => alert(`${seats} kishilik xona ochildi`)}>
              XONA OCHISH
            </button>
          </div>
        </div>

        <div className="opp">
          <button className={'sw' + (open ? ' on' : '')} onClick={() => setOpen(!open)}><i /></button>
          <div>
            <b>Men raqib qidiryapman</b>
            <small>{open ? "Siz raqiblar ro'yxatidasiz" : "Siz hech qaysi ro'yxatda yo'qsiz"}</small>
          </div>
          <button className="rq" onClick={() => setTab('RAQIBLAR')}>RAQIBLAR →</button>
        </div>

        <button className="bot">
          <LuBot className="inline align-[-2px]" aria-hidden="true" /> BOT BILAN MASHQ
        </button>
        <p className="foot">Mashq uchun chaqmoq berilmaydi.</p>
      </div>
    </div>
  )
}

/* ------------------------------- CSS ------------------------------- */
const css = `
*{box-sizing:border-box}
.page{min-height:100vh;background:#f6f5fb;font-family:'Nunito','Segoe UI',system-ui,sans-serif;color:#1d1b2e;padding:20px}
.page.dark{background:radial-gradient(ellipse at 50% 0,#14173a 0,#0a0c1f 55%,#07081a 100%);color:#e8eaff;padding:20px 20px 60px}
.page button{font-family:inherit;cursor:pointer}
.wrap{max-width:1190px}
.exam,.card{background:#fff;border:2px solid #ebe9f5;border-radius:20px;overflow:hidden}
.exam-top{padding:24px 24px 26px}
.crumb{margin:0 0 14px;font-size:11px;letter-spacing:.08em;font-weight:700;color:#6b6a80}
.pill{display:inline-block;border:1.5px solid #d9d7e8;border-radius:20px;padding:4px 10px;color:#1d1b2e;margin-left:2px}
h1{margin:0 0 8px;font-size:28px;font-weight:800}
.sub{margin:0 0 12px;font-size:14px;color:#55546a}
.bar{width:420px;max-width:100%;height:7px;background:#eceaf3;border-radius:6px;overflow:hidden;margin-bottom:22px}
.bar i{display:block;height:100%;background:#6cbf3f;border-radius:6px}
.btns{display:flex;gap:14px}
.b-yellow{background:#f6c443;border:0;border-bottom:4px solid #d9a420;color:#3b2f06;font-weight:800;font-size:14px;padding:12px 20px;border-radius:12px}
.b-outline{background:#fff;border:2px solid #5db3ec;color:#3a9fe0;font-weight:700;font-size:14px;padding:12px 20px;border-radius:14px}
.b-green{background:#6cbf3f;border:0;border-bottom:4px solid #4e9a28;color:#fff;font-weight:800;font-size:14px;padding:9px 16px;border-radius:12px}

.comet{background:linear-gradient(180deg,#14214f 0,#0b1030 100%);padding:14px 24px 18px;color:#fff;border-top:1px solid #2a3566}
.comet-head{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.ball{width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffd77a,#f09a1a);box-shadow:-18px -6px 18px rgba(255,190,80,.35)}
.dots{display:flex;gap:6px}
.dot{width:30px;height:30px;border-radius:50%;border:2px dashed #55608f;display:grid;place-items:center;font-size:12px;color:#aab3e0}
.dot svg{width:14px;height:14px}
.dot.on{border:3px solid #4b9be0;background:#1c2b63;color:#fff}
.comet-txt{flex:1;display:flex;flex-direction:column;gap:2px}
.comet-txt small{font-size:10.5px;letter-spacing:.04em;color:#9fb0f0;font-weight:700}
.comet-txt small b{color:#ffb25a}
.comet-txt strong{font-size:14px}
.timer{background:rgba(255,255,255,.14);padding:7px 14px;border-radius:20px;font-size:13px;font-weight:700}
.trow{display:flex;gap:10px;margin-bottom:10px}
.task{flex:1;display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.06);border:2px solid #3a4378;border-radius:14px;padding:13px 14px;color:#fff;font-size:14px;font-weight:700;text-align:left}
.task.active{border-color:#4b9be0;background:rgba(75,155,224,.12)}
.task:hover{background:rgba(255,255,255,.12)}
.ti{width:26px;height:26px;border-radius:8px;border:2px solid #5a6498;display:grid;place-items:center;font-size:12px}
.ti svg{width:14px;height:14px}
.task.active .ti{border-color:#4b9be0}
.tt{flex:1}
.tr{color:#9fb0f0;font-size:13px}
.q{width:52px;border-radius:14px;border:2px solid #3a4378;background:rgba(255,255,255,.06);color:#fff;font-weight:800;font-size:16px}
.note{margin:8px 0 0;font-size:11px;color:#a9b2dd;line-height:1.5}

.grid{display:grid;grid-template-columns:1fr 320px;gap:26px;margin-top:26px;align-items:start}
.main-col{min-width:0}
.card-h{margin:0;padding:14px 18px;font-size:14px;border-bottom:2px solid #ebe9f5}
.grp-h{display:flex;justify-content:space-between;align-items:center}
.online{display:flex;align-items:center;gap:6px;font-size:13px;color:#55546a}
.group{display:flex;gap:18px;padding:16px 22px 0;overflow-x:auto;background:linear-gradient(to bottom,#fff calc(100% - 34px),#f3f2f9 calc(100% - 34px))}
.gm{display:flex;flex-direction:column;align-items:center;width:74px;flex:none}
.av{position:relative;width:48px;height:48px;display:grid;place-items:center;font-size:44px;line-height:1.1;margin-bottom:12px}
.av-img{width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid #d8d5e8;background:#fff}
.av-letter{font-size:18px;font-weight:800;color:#6b6a80}
.on-dot{position:absolute;right:-6px;bottom:2px;width:8px;height:8px;border-radius:50%;background:#6cbf3f}
.gn{height:34px;display:flex;align-items:center;font-size:12px;font-weight:600;color:#55546a;white-space:nowrap}
.gn.me{height:auto;background:#fdf3d0;border-radius:10px;padding:3px 8px;margin-top:6px;font-weight:700;color:#1d1b2e}
.side{padding:18px 20px;margin-bottom:26px}
.side h4{margin:0 0 12px;font-size:12px;letter-spacing:.08em;color:#6b6a80;display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;border-bottom:1px solid #ebe9f5}
.side h4 em{background:#e8524a;color:#fff;font-style:normal;border-radius:50%;width:20px;height:20px;display:grid;place-items:center;font-size:11px}
.side h4 a{color:#3a9fe0;text-decoration:none;letter-spacing:0}
.side ul{list-style:none;margin:0;padding:0}
.side li{font-size:13px;padding:9px 0;border-bottom:1px solid #f0eef7}
.side li:last-child{border:0}
.dots-list li::before{content:'';display:inline-block;width:6px;height:6px;border-radius:50%;background:#e8524a;margin-right:10px}
.sb .side{margin-bottom:22px}

/* reyting */
.rate li{display:flex;align-items:center;gap:12px}
.rate .rn{width:14px;color:#9a99ad;font-size:12px}
.rate .rname{flex:1}
.rate b{font-size:13px;color:#55546a}
.rate li.me,.rate li.me .rn,.rate li.me b{color:#3a9fe0;font-weight:800}

/* premium */
.side.premium{background:linear-gradient(180deg,#f3e8ff 0,#fff 60%);border-color:#efe3fb}
.prem-h{color:#a855f7 !important;margin-bottom:6px !important;display:flex;align-items:center;gap:6px}
.prem-h svg{width:16px;height:16px}
.side.premium p{margin:0 0 14px;font-size:13px;color:#55546a}
.prem-btn{background:#fff;border:2px solid #ebe9f5;border-radius:12px;padding:10px 16px;font-weight:800;font-size:13px;color:#1d1b2e}
.prem-btn:hover{background:#f6f5fb}

/* qo'shimcha dars */
.days{display:flex;justify-content:space-between}
.day{display:flex;flex-direction:column;align-items:center;gap:8px}
.day small{font-size:11px;font-weight:700;color:#6b6a80}
.plus{width:34px;height:34px;border-radius:50%;border:0;background:#eceaf6;color:#3b3a52;font-size:20px;line-height:1;display:grid;place-items:center}
.plus:hover:not(:disabled){background:#dedcf0}
.plus:disabled{opacity:.45;cursor:not-allowed}
.plus.on{background:#6cbf3f;color:#fff;font-size:16px}

/* mashq va o'yinlar, so'rovnoma */
.games li{padding:0;border-bottom:1px solid #f0eef7}
.games li:last-child{border:0}
.games button{width:100%;display:flex;align-items:center;gap:12px;background:none;border:0;padding:10px 0;text-align:left;font-size:13px;color:#1d1b2e}
.games button:hover .gt{color:#3a9fe0}
.games .gi{width:18px;font-size:12px;color:#7c7b92;text-align:center;display:inline-grid;place-items:center}
.games .gi svg{width:14px;height:14px}
.games .gt{flex:1}
.games b{font-size:13px;color:#55546a}

/* kurs xaritasi */
.kx-card{background:#fff;border:2px solid #ebe9f5;border-radius:20px;overflow:hidden}
.kx-head{display:flex;justify-content:space-between;align-items:center;padding:20px 24px}
.kx-head small{font-size:11px;letter-spacing:.08em;font-weight:700;color:#6b6a80}
.kx-head h2{margin:4px 0 0;font-size:24px;font-weight:800}
.kx-head b{font-size:15px}
.kx-mod{border-top:2px solid #ebe9f5}
.kx-row{width:100%;display:flex;align-items:center;gap:18px;background:#fff;border:0;padding:20px 24px;text-align:left;cursor:pointer;font-family:inherit;color:inherit}
.kx-row:hover{background:#f6f5fb}
.kx-mod.open .kx-row{background:#f6f5fb}
.kx-arrow{font-size:10px;color:#6b6a80;transition:transform .2s;width:10px}
.kx-mod.open .kx-arrow{transform:rotate(90deg)}
.kx-info{flex:1;display:flex;flex-direction:column;gap:4px}
.kx-info strong{font-size:17px;font-weight:800}
.kx-info small{font-size:13px;color:#6b6a80}
.kx-pct{display:inline-flex;align-items:center;gap:4px;font-weight:800;font-size:14px}
.kx-pct.ok{color:#4e9a28}
.kx-pct svg{width:13px;height:13px}
.kx-list{padding:22px 24px 26px;background:#fff}
.kx-item{position:relative;display:flex;align-items:center;gap:18px;padding:8px 0;min-height:56px}
.kx-item::before{content:'';position:absolute;left:19px;top:0;bottom:0;width:3px;background:#cfe9bd}
.kx-item:first-child::before{top:50%}
.kx-item.done::before{background:#6cbf3f}
.kx-item.current::before,.kx-item.gift::before{background:#e4e2ee}
.kx-item.gift::before{bottom:50%}
.kx-node{position:relative;z-index:1;flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-size:16px;font-weight:800;background:#f1f0f7;color:#9a99ad}
.kx-node svg{width:17px;height:17px}
.kx-item.done .kx-node{background:#6cbf3f;color:#fff;box-shadow:0 0 0 4px #fff}
.kx-item.current .kx-node{background:#f6c443;color:#3b2f06;width:48px;height:48px;margin:0 -4px;font-size:20px;box-shadow:0 0 0 5px #fdf3d0}
.kx-text{display:flex;flex-direction:column;gap:2px}
.kx-name{font-size:15px;font-weight:700}
.kx-item.current .kx-name{font-size:16px}
.kx-text em{font-style:normal;font-size:10px;font-weight:800;letter-spacing:.1em;color:#f0a420}
.kx-item.gift .kx-text em{color:#a9a8bd}
.kx-item.gift:not(.ready) .kx-name{color:#9a99ad}
.kx-item.gift.ready .kx-text em{color:#4e9a28}
.kx-item.done{cursor:pointer}
.kx-item.done:hover .kx-name{color:#4e9a28}

/* dark pages */
.nav{max-width:920px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;position:relative}
.back{background:none;border:0;color:#aab3e0;font-size:13px;padding:6px}
.tabs{display:flex;border:1px solid #2b3262;background:#0e1230}
.tabs button{background:none;border:0;color:#aab3e0;font-size:11px;letter-spacing:.14em;font-weight:700;padding:10px 16px}
.tabs button.on{background:#6cbf3f;color:#fff}
.vol{opacity:.7;display:inline-flex;align-items:center}
.vol svg{width:18px;height:18px}
.bt{max-width:910px;margin:44px auto 0;display:flex;flex-direction:column;align-items:center}
.pills{display:flex;gap:22px;margin-bottom:18px;flex-wrap:wrap;justify-content:center}
.pill2{display:flex;align-items:center;gap:8px;border:1px solid #2b3262;background:rgba(20,26,60,.7);border-radius:30px;padding:9px 18px;font-size:13px}
.pill2 small{font-size:10px;letter-spacing:.1em;color:#9aa3d6;margin-right:10px}
.pill2 b{font-size:17px}
.pill2 b.g{color:#6cd44a}
.pill2 b.o{color:#ff7a45;font-size:20px}
.pill2 svg{width:16px;height:16px;color:#9aa3d6}
.gdot{width:8px;height:8px;border-radius:50%;background:#6cd44a}
.sep{width:1px;height:20px;background:#2b3262;margin:0 8px}
.vs{display:flex;align-items:center;gap:46px;margin-top:6px}
.side-p{display:flex;flex-direction:column;align-items:center;gap:12px}
.side-p small{font-size:11px;letter-spacing:.14em;color:#aab3e0;font-weight:700}
.ring{width:86px;height:86px;border-radius:50%;border:3px solid #34406f;background:#10163a;display:grid;place-items:center;font-size:42px;overflow:hidden}
.ring img{width:100%;height:100%;object-fit:cover;border-radius:50%}
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

/* typing */
.mt{max-width:900px;margin:90px auto 0}
.mt-stats{display:flex;gap:28px;color:#6cd44a;font-size:22px;font-weight:700;margin-bottom:24px}
.mt-text{font-family:'Roboto Mono',ui-monospace,Menlo,monospace;font-size:24px;line-height:1.9;color:#5a638f;word-break:break-word}
.mt-text .ok{color:#e8eaff}
.mt-text .bad{color:#ff5a5a;background:rgba(255,90,90,.15)}
.mt-text .cur{border-left:2px solid #6cd44a;margin-left:-2px;color:#9aa3d6}
.mt-input{position:absolute;opacity:0;pointer-events:none}
.hint{margin-top:30px;color:#7c86bb;font-size:13px}
.mt-done{text-align:center;padding:40px 0}
.mt-done h2{font-size:30px;margin:0 0 8px}
.mt-done p{color:#aab3e0;margin:0 0 20px}

@media(max-width:860px){
  .grid{grid-template-columns:1fr}
  .comet-head{flex-wrap:wrap}
  .vs{gap:20px}
  .group{overflow-x:auto}
}
@media(max-width:600px){
  .kx-row,.kx-head{padding-left:16px;padding-right:16px}
  .kx-list{padding:18px 16px 22px}
}
`

export default Asosiy