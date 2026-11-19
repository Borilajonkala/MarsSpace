import { useEffect, useState } from 'react'
import dbData from '../../db.json'

/* ------------------------------ DB / fallback ------------------------------ */
const FALLBACK_USER = {
  fullName: "Mars Space o'quvchisi",
  marsId: 'M-31710',
  groupCode: 'YB-3171',
  coins: 239,
  xp: 650,
  rank: 'Mars Cadet',
  attendanceRate: 95,
  homeworkRate: 98,
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MarsStudent&backgroundColor=ffd5dc',
  ...(dbData.currentUser || {}),
}

const readStoredUser = () => {
  try {
    const raw =
      localStorage.getItem('mars_auth_user') ||
      localStorage.getItem('mars_profile_user') ||
      localStorage.getItem('token')
    if (!raw) return FALLBACK_USER

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return FALLBACK_USER
    return { ...FALLBACK_USER, ...parsed }
  } catch {
    return FALLBACK_USER
  }
}

/* ------------------------------ Static content ------------------------------ */
const RANKS = ['Mars Cadet', 'Mars Explorer', 'Mars Ranger', 'Mars Commander', 'Mars Legend']
const LEVEL_XP = 700

const THEMES = [
  {
    name: "Mars qizil",
    bg: 'radial-gradient(ellipse at 18% -10%, #4a1526 0%, #150b1c 42%, #060714 100%)',
  },
  {
    name: 'Nebula',
    bg: 'radial-gradient(ellipse at 75% -5%, #2b1d5e 0%, #121030 48%, #060714 100%)',
  },
  {
    name: 'Chuqur kosmos',
    bg: 'radial-gradient(ellipse at 50% 110%, #0d3b45 0%, #0a1029 45%, #05060f 100%)',
  },
]

const SKINS = [
  {
    name: 'Kosmonavt',
    img: 'https://api.dicebear.com/7.x/bottts/svg?seed=MarsStudent&backgroundColor=c0aede',
  },
  {
    name: 'Yulduz',
    img: 'https://api.dicebear.com/7.x/bottts/svg?seed=MarsStar&backgroundColor=ffd5dc',
  },
  {
    name: 'Robot',
    img: 'https://api.dicebear.com/7.x/bottts/svg?seed=MarsBot&backgroundColor=b6e3f4',
  },
]

const CERTIFICATES = [
  { title: 'Frontend asoslari', module: 'Modul 1', date: '12.09.2026', status: 'done' },
  { title: 'HTML va CSS', module: 'Modul 2', date: '24.10.2026', status: 'done' },
  { title: 'JavaScript ES6+', module: 'Modul 3', date: 'Jarayonda', status: 'progress' },
]

const SHOP_ITEMS = (dbData.shopItems || []).slice(0, 5)

/* ------------------------------ Component ------------------------------ */
const Profil = () => {
  const [user, setUser] = useState(readStoredUser)
  const [themeIdx, setThemeIdx] = useState(0)
  const [skinIdx, setSkinIdx] = useState(0)
  const [modal, setModal] = useState(null) // 'shop' | 'edit' | null
  const [nameInput, setNameInput] = useState('')
  const [copied, setCopied] = useState(false)

  const xp = Number(user.xp) || 0
  const coins = Number(user.coins) || 0
  const streak = Number(dbData.marstype?.streakDays) || 2
  const level = Math.floor(xp / LEVEL_XP) + 1
  const levelXp = xp % LEVEL_XP
  const levelPct = Math.round((levelXp / LEVEL_XP) * 100)
  const rank = RANKS[Math.min(level - 1, RANKS.length - 1)]
  const attendance = Number(user.attendanceRate) || 95
  const homework = Number(user.homeworkRate) || 98

  // "Ulashish" holati avtomatik qaytadi
  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(t)
  }, [copied])

  // Modal Escape bilan yopiladi
  useEffect(() => {
    if (!modal) return
    const onKey = (e) => {
      if (e.key === 'Escape') setModal(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal])

  const badges = [
    { icon: '🚀', title: 'Start', hint: 'Birinchi dars', earned: true },
    { icon: '🔥', title: 'Seriya', hint: `${streak} kun ketma-ket`, earned: streak >= 2 },
    { icon: '🪙', title: 'Coin master', hint: `${coins} coin`, earned: coins >= 100 },
    { icon: '⚡', title: 'Tezkor', hint: '1000 XP', earned: xp >= 1000 },
    { icon: '🏆', title: 'Chempion', hint: "Battle g'olibi", earned: false },
    { icon: '🎓', title: 'Bitiruvchi', hint: 'Kurs yakuni', earned: false },
  ]

  const handleShare = async () => {
    const url = `${window.location.origin}/profile`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard API ishlamasa, eski usul
      const area = document.createElement('textarea')
      area.value = url
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
  }

  const openEdit = () => {
    setNameInput(user.fullName || '')
    setModal('edit')
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    const nextName = nameInput.trim() || user.fullName
    const nextUser = { ...user, fullName: nextName }
    setUser(nextUser)

    try {
      localStorage.setItem('mars_profile_user', JSON.stringify(nextUser))
      const stored = localStorage.getItem('mars_auth_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        localStorage.setItem(
          'mars_auth_user',
          JSON.stringify({ ...parsed, fullName: nextName })
        )
      }
    } catch {
      // localStorage yopiq bo'lsa ham UI ishlashda davom etadi
    }

    setModal(null)
  }

  return (
    <div className="pf" style={{ background: THEMES[themeIdx].bg }}>
      <style>{css}</style>
      <div className="pf-stars" />

      <div className="pf-wrap">
        {/* ------------------------------ HERO ------------------------------ */}
        <section className="pf-hero">
          {/* Avatar / personaj */}
          <div className="pf-char">
            <span className="pf-level-pill">⭐ {level}-DARAJA</span>

            <div className="pf-stage">
              <span className="pf-ring" />
              <img src={SKINS[skinIdx].img} alt={`${SKINS[skinIdx].name} qahramon`} />
              <span className="pf-shadow" />
            </div>

            <h1 className="pf-name">{user.fullName}</h1>
            <p className="pf-meta">
              {user.marsId || 'M-31710'} · {user.groupCode || 'YB-3171'} guruhi
            </p>
            <span className="pf-rank">👨‍🚀 {rank}</span>

            <div className="pf-chips">
              <span className="pf-chip gold">🪙 {coins}</span>
              <span className="pf-chip blue">⚡ {xp} XP</span>
              <span className="pf-chip">🔥 {streak} kun</span>
            </div>

            {/* Amallar */}
            <div className="pf-actions">
              <button
                type="button"
                className="pf-act"
                onClick={() => setThemeIdx((i) => (i + 1) % THEMES.length)}
                title={`Fon: ${THEMES[themeIdx].name}`}
              >
                <span className="ico">🖼️</span>
                <span>Fon</span>
              </button>
              <button
                type="button"
                className="pf-act"
                onClick={() => setSkinIdx((i) => (i + 1) % SKINS.length)}
                title={`Kiyim: ${SKINS[skinIdx].name}`}
              >
                <span className="ico">👕</span>
                <span>Kiyim</span>
              </button>
              <button type="button" className="pf-act" onClick={() => setModal('shop')}>
                <span className="ico">🛍️</span>
                <span>Do'kon</span>
              </button>
              <button type="button" className="pf-act" onClick={handleShare}>
                <span className="ico">{copied ? '✅' : '🔗'}</span>
                <span>{copied ? 'Nusxalandi' : 'Ulashish'}</span>
              </button>
              <button type="button" className="pf-act" onClick={openEdit}>
                <span className="ico">✏️</span>
                <span>Tahrirlash</span>
              </button>
            </div>
          </div>

          {/* Daraja va statistika */}
          <div className="pf-col">
            <div className="pf-card pf-level-card">
              <h3>
                <span>DARAJANGIZ</span>
                <span className="pf-muted">{rank}</span>
              </h3>

              <div className="pf-level-top">
                <div className="pf-big-level">{level}</div>
                <div className="pf-level-info">
                  <p className="pf-level-title">Keyingi daraja — {RANKS[Math.min(level, RANKS.length - 1)]}</p>
                  <p className="pf-muted small">
                    {levelXp} / {LEVEL_XP} XP · yana {LEVEL_XP - levelXp} XP kerak
                  </p>
                  <div className="pf-bar">
                    <i style={{ width: `${levelPct}%` }} />
                  </div>
                  <span className="pf-pct">{levelPct}%</span>
                </div>
              </div>
            </div>

            <div className="pf-stats">
              <div className="pf-stat">
                <span className="pf-stat-ico gold">🪙</span>
                <b>{coins}</b>
                <small>Mars Coin</small>
              </div>
              <div className="pf-stat">
                <span className="pf-stat-ico blue">⚡</span>
                <b>{xp}</b>
                <small>Umumiy XP</small>
              </div>
              <div className="pf-stat">
                <span className="pf-stat-ico green">📈</span>
                <b>{attendance}%</b>
                <small>Davomat</small>
              </div>
              <div className="pf-stat">
                <span className="pf-stat-ico pink">📝</span>
                <b>{homework}%</b>
                <small>Uy vazifasi</small>
              </div>
            </div>

            <div className="pf-card">
              <h3>
                <span>FAOLLIK</span>
                <span className="pf-muted">{streak} kunlik seriya 🔥</span>
              </h3>
              <div className="pf-bars">
                <div>
                  <div className="pf-bars-head">
                    <span>Davomat</span>
                    <b>{attendance}%</b>
                  </div>
                  <div className="pf-bar thin">
                    <i style={{ width: `${attendance}%` }} />
                  </div>
                </div>
                <div>
                  <div className="pf-bars-head">
                    <span>Uy vazifalari</span>
                    <b>{homework}%</b>
                  </div>
                  <div className="pf-bar thin green">
                    <i style={{ width: `${homework}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------ PASTKI QISM ------------------------------ */}
        <section className="pf-grid">
          <div className="pf-card">
            <h3>
              <span>YUTUQLAR</span>
              <span className="pf-muted">
                {badges.filter((b) => b.earned).length} / {badges.length}
              </span>
            </h3>
            <div className="pf-badges">
              {badges.map((b) => (
                <div
                  key={b.title}
                  className={'pf-badge' + (b.earned ? ' earned' : '')}
                  title={b.hint}
                >
                  <span className="pf-badge-ico">{b.earned ? b.icon : '🔒'}</span>
                  <b>{b.title}</b>
                  <small>{b.hint}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="pf-card">
            <h3>
              <span>SERTIFIKATLAR</span>
              <span className="pf-muted">{CERTIFICATES.filter((c) => c.status === 'done').length} ta</span>
            </h3>
            <ul className="pf-certs">
              {CERTIFICATES.map((c) => (
                <li key={c.title}>
                  <span className={'pf-cert-ico' + (c.status === 'done' ? ' done' : '')}>
                    {c.status === 'done' ? '🎖️' : '⏳'}
                  </span>
                  <span className="pf-cert-txt">
                    <b>{c.title}</b>
                    <small>
                      {c.module} · {c.date}
                    </small>
                  </span>
                  <span className={'pf-cert-state' + (c.status === 'done' ? ' done' : '')}>
                    {c.status === 'done' ? 'OLINGAN' : 'JARAYONDA'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* ------------------------------ MODALLAR ------------------------------ */}
      {modal === 'shop' && (
        <div className="pf-overlay" onClick={() => setModal(null)} role="presentation">
          <div
            className="pf-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Space shop"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="pf-modal-head">
              <div>
                <h3>SPACE SHOP</h3>
                <p className="pf-muted">Mars Coin evaziga sovg'alar</p>
              </div>
              <button type="button" className="pf-close" onClick={() => setModal(null)} aria-label="Yopish">
                ✕
              </button>
            </header>

            <div className="pf-shop-balance">🪙 Balans: <b>{coins}</b> coin</div>

            <ul className="pf-shop">
              {SHOP_ITEMS.map((item) => (
                <li key={item.id}>
                  <img src={item.image} alt={item.titleUz || item.name} loading="lazy" />
                  <span className="pf-shop-txt">
                    <b>{item.titleUz || item.name}</b>
                    <small>{item.category}</small>
                  </span>
                  <span className="pf-shop-price">🪙 {item.priceCoins}</span>
                </li>
              ))}
            </ul>
            <p className="pf-note">Xarid qilish uchun Space Shop bo'limidan foydalaning.</p>
          </div>
        </div>
      )}

      {modal === 'edit' && (
        <div className="pf-overlay" onClick={() => setModal(null)} role="presentation">
          <div
            className="pf-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Profilni tahrirlash"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="pf-modal-head">
              <div>
                <h3>PROFILNI TAHRIRLASH</h3>
                <p className="pf-muted">Ma'lumot brauzerda saqlanadi</p>
              </div>
              <button type="button" className="pf-close" onClick={() => setModal(null)} aria-label="Yopish">
                ✕
              </button>
            </header>

            <form onSubmit={handleSaveProfile} className="pf-form">
              <label>
                Ism va familiya
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Ismingizni kiriting"
                />
              </label>
              <label>
                Mars ID
                <input type="text" value={user.marsId || ''} readOnly />
              </label>
              <label>
                Guruh
                <input type="text" value={user.groupCode || ''} readOnly />
              </label>

              <div className="pf-form-btns">
                <button type="button" className="pf-btn ghost" onClick={() => setModal(null)}>
                  Bekor qilish
                </button>
                <button type="submit" className="pf-btn primary">
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------ CSS ------------------------------ */
const css = `
.pf{position:relative;min-height:100%;padding:24px;color:#e8eaff;font-family:'Nunito','Segoe UI',system-ui,sans-serif;overflow:hidden;transition:background .45s}
.pf-stars{position:absolute;inset:0;pointer-events:none;opacity:.55;background-image:radial-gradient(1.5px 1.5px at 30px 40px,rgba(255,255,255,.8),transparent),radial-gradient(1px 1px at 120px 90px,rgba(255,255,255,.5),transparent),radial-gradient(1px 1px at 60px 150px,rgba(255,255,255,.45),transparent),radial-gradient(1.5px 1.5px at 200px 30px,rgba(255,255,255,.55),transparent);background-size:240px 220px}
.pf-wrap{position:relative;z-index:1;max-width:1190px;margin:0 auto}
.pf button{font-family:inherit}
.pf-hero{display:grid;grid-template-columns:330px minmax(0,1fr);gap:20px;align-items:start}
.pf-char{position:relative;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.13);border-radius:24px;padding:20px 18px 18px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.35)}
.pf-level-pill{position:absolute;top:14px;left:14px;background:rgba(246,196,67,.14);border:1px solid rgba(246,196,67,.45);color:#ffe6a3;font-size:10.5px;font-weight:800;letter-spacing:.1em;border-radius:20px;padding:5px 10px}
.pf-stage{position:relative;width:200px;height:200px;margin:22px auto 2px;display:grid;place-items:center}
.pf-stage img{position:relative;z-index:2;width:132px;height:132px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18);padding:8px;filter:drop-shadow(0 16px 24px rgba(0,0,0,.45))}
.pf-ring{position:absolute;inset:8px;border-radius:50%;border:2px dashed rgba(167,139,250,.55);animation:pfspin 26s linear infinite}
.pf-stage::before{content:'';position:absolute;inset:16px;border-radius:50%;background:radial-gradient(circle at 50% 40%,rgba(124,92,255,.45),transparent 68%)}
.pf-shadow{position:absolute;bottom:4px;width:120px;height:16px;border-radius:50%;background:rgba(108,212,74,.22);filter:blur(6px)}
@keyframes pfspin{to{transform:rotate(360deg)}}
.pf-name{margin:10px 0 4px;font-size:22px;font-weight:800;line-height:1.2}
.pf-meta{margin:0;font-size:12px;color:#a9b2dd}
.pf-rank{display:inline-block;margin-top:10px;border:1px solid rgba(167,139,250,.45);background:rgba(124,92,255,.16);color:#d9ccff;border-radius:20px;padding:5px 12px;font-size:11px;font-weight:800;letter-spacing:.06em}
.pf-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin:14px 0 16px}
.pf-chip{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);border-radius:20px;padding:5px 10px;font-size:11.5px;font-weight:700}
.pf-chip.gold{color:#ffe6a3;border-color:rgba(246,196,67,.4);background:rgba(246,196,67,.1)}
.pf-chip.blue{color:#b9d6ff;border-color:rgba(96,165,250,.4);background:rgba(96,165,250,.12)}
.pf-actions{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.pf-act{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 2px;border-radius:13px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#e8eaff;font-size:10px;font-weight:700;cursor:pointer;transition:transform .18s,background .18s}
.pf-act:hover{background:rgba(255,255,255,.15);transform:translateY(-2px)}
.pf-act:active{transform:translateY(0)}
.pf-act .ico{font-size:17px;line-height:1}
.pf-col{display:flex;flex-direction:column;gap:16px;min-width:0}
.pf-card{background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.025));border:1px solid rgba(255,255,255,.11);border-radius:22px;padding:18px 20px;backdrop-filter:blur(10px)}
.pf-card h3{margin:0 0 14px;font-size:11.5px;letter-spacing:.14em;font-weight:800;color:#a9b2dd;display:flex;justify-content:space-between;align-items:center;gap:10px}
.pf-muted{color:#8f99c9;font-weight:700;letter-spacing:0}
.pf-muted.small{font-size:11.5px;margin:0 0 8px}
.pf-level-card{padding-bottom:20px}
.pf-level-top{display:flex;align-items:center;gap:18px}
.pf-big-level{flex:none;width:84px;height:84px;border-radius:22px;display:grid;place-items:center;font-size:36px;font-weight:900;color:#1c1330;background:linear-gradient(150deg,#ffd77a,#f09a1a);box-shadow:0 10px 28px rgba(240,154,26,.28)}
.pf-level-info{flex:1;min-width:0;position:relative}
.pf-level-title{margin:0 0 4px;font-size:14.5px;font-weight:800}
.pf-bar{height:10px;border-radius:8px;background:rgba(255,255,255,.1);overflow:hidden}
.pf-bar i{display:block;height:100%;border-radius:8px;background:linear-gradient(90deg,#7c5cff,#f472b6);transition:width .4s}
.pf-bar.thin{height:7px}
.pf-bar.green i{background:linear-gradient(90deg,#6cbf3f,#a3e635)}
.pf-pct{position:absolute;right:0;top:0;font-size:11px;font-weight:800;color:#d9ccff}
.pf-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.pf-stat{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:3px}
.pf-stat b{font-size:17px;font-weight:800}
.pf-stat small{font-size:10.5px;color:#8f99c9;font-weight:700}
.pf-stat-ico{font-size:15px}
.pf-bars{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.pf-bars-head{display:flex;justify-content:space-between;font-size:12px;margin-bottom:7px;color:#c9cfec}
.pf-bars-head b{font-weight:800}
.pf-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:20px;margin-top:20px}
.pf-badges{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:12px}
.pf-badge{display:flex;flex-direction:column;align-items:center;gap:3px;text-align:center;padding:12px 6px;border-radius:16px;border:1px dashed rgba(255,255,255,.14);background:rgba(255,255,255,.03);opacity:.55}
.pf-badge.earned{border-style:solid;border-color:rgba(246,196,67,.35);background:rgba(246,196,67,.08);opacity:1;box-shadow:0 8px 22px rgba(246,196,67,.08)}
.pf-badge-ico{font-size:22px;line-height:1.3}
.pf-badge b{font-size:11.5px;font-weight:800}
.pf-badge small{font-size:9.5px;color:#8f99c9}
.pf-certs{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.pf-certs li{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
.pf-cert-ico{flex:none;width:34px;height:34px;border-radius:11px;display:grid;place-items:center;font-size:16px;background:rgba(255,255,255,.08)}
.pf-cert-ico.done{background:rgba(246,196,67,.16)}
.pf-cert-txt{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
.pf-cert-txt b{font-size:12.5px;font-weight:800}
.pf-cert-txt small{font-size:10.5px;color:#8f99c9}
.pf-cert-state{font-size:9px;font-weight:800;letter-spacing:.08em;color:#8f99c9;border:1px solid rgba(255,255,255,.16);border-radius:20px;padding:4px 8px;white-space:nowrap}
.pf-cert-state.done{color:#d9f7c3;border-color:rgba(108,191,63,.5);background:rgba(108,191,63,.14)}
.pf-overlay{position:fixed;inset:0;z-index:60;background:rgba(4,6,20,.74);backdrop-filter:blur(6px);display:grid;place-items:center;padding:18px}
.pf-modal{width:100%;max-width:520px;max-height:84vh;overflow:auto;background:#12162f;border:1px solid rgba(255,255,255,.15);border-radius:22px;padding:20px;box-shadow:0 30px 80px rgba(0,0,0,.55)}
.pf-modal-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px}
.pf-modal-head h3{margin:0 0 3px;font-size:13px;letter-spacing:.14em;font-weight:800;color:#e8eaff}
.pf-modal-head p{margin:0;font-size:11.5px;color:#8f99c9}
.pf-close{flex:none;width:32px;height:32px;border-radius:10px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#e8eaff;cursor:pointer;font-size:13px}
.pf-close:hover{background:rgba(255,255,255,.14)}
.pf-shop-balance{display:inline-block;background:rgba(246,196,67,.12);border:1px solid rgba(246,196,67,.35);color:#ffe6a3;border-radius:12px;padding:7px 12px;font-size:12px;margin-bottom:12px}
.pf-shop{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.pf-shop li{display:flex;align-items:center;gap:12px;padding:9px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
.pf-shop img{width:46px;height:46px;object-fit:cover;border-radius:10px;flex:none}
.pf-shop-txt{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
.pf-shop-txt b{font-size:12px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pf-shop-txt small{font-size:10px;color:#8f99c9}
.pf-shop-price{flex:none;font-size:11.5px;font-weight:800;color:#ffe6a3}
.pf-note{margin:14px 0 0;font-size:10.5px;color:#8f99c9;line-height:1.5}
.pf-form{display:flex;flex-direction:column;gap:12px}
.pf-form label{display:flex;flex-direction:column;gap:6px;font-size:11px;font-weight:800;letter-spacing:.06em;color:#a9b2dd}
.pf-form input{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:11px 12px;color:#e8eaff;font-size:13px;font-family:inherit;outline:none}
.pf-form input:focus{border-color:rgba(167,139,250,.7);box-shadow:0 0 0 3px rgba(124,92,255,.2)}
.pf-form input[readonly]{opacity:.6;cursor:not-allowed}
.pf-form-btns{display:flex;justify-content:flex-end;gap:10px;margin-top:6px}
.pf-btn{border-radius:12px;padding:10px 16px;font-size:12.5px;font-weight:800;cursor:pointer;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#e8eaff}
.pf-btn:hover{background:rgba(255,255,255,.14)}
.pf-btn.primary{border:0;color:#1c1330;background:linear-gradient(150deg,#ffd77a,#f0a24a)}
.pf-btn.primary:hover{filter:brightness(1.06)}
@media(max-width:960px){
  .pf-hero{grid-template-columns:1fr}
  .pf-grid{grid-template-columns:1fr}
  .pf-stage{width:180px;height:180px}
}
@media(max-width:620px){
  .pf{padding:14px}
  .pf-stats{grid-template-columns:1fr 1fr}
  .pf-actions{grid-template-columns:repeat(3,1fr)}
  .pf-bars{grid-template-columns:1fr}
  .pf-big-level{width:70px;height:70px;font-size:30px;border-radius:18px}
}
`

export default Profil
