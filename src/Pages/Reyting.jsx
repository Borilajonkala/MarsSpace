import { useEffect, useMemo, useState } from 'react'
import { LuTrophy } from 'react-icons/lu'
import { useProfile } from '../profile/ProfileContext.js'


const API = 'http://localhost:3000'
const ME_LABEL = 'Men' 

const AVATARS = [
]
// har bir o'quvchiga doim bir xil rasm beradi (sahifa yangilansa ham o'zgarmaydi)
const pick = (key) => {
  const s = String(key)
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return AVATARS[h % AVATARS.length]
}


const VIEW = {
  quvvat: { top: 10, around: false, badge: true },
  coin: { top: 4, around: true, badge: false },
  battle: { top: 15, around: false, badge: true },
  marstype: { top: 15, around: false, badge: true },
  yutuq: { top: 12, around: true, badge: false },
  granpri: { top: 8, around: false, badge: false },
}

const TABS = [
  { key: 'quvvat', label: 'Quvvat' },
  { key: 'coin', label: 'Coin' },
  { key: 'battle', label: 'Battle' },
  { key: 'marstype', label: 'MARSTYPE' },
  { key: 'granpri', label: 'Gran-pri' },
  { key: 'yutuq', label: 'Yutuqlar' },
]


const fmt = (n) => Number(n).toLocaleString('en-US')


const rankList = (items) => {
  const sorted = [...items].sort((a, b) => b.value - a.value)
  return sorted.map((it) => ({ ...it, rank: 1 + sorted.filter((o) => o.value > it.value).length }))
}


const visible = (rows, { top, around }) => {
  const head = rows.slice(0, top)
  const i = rows.findIndex((r) => r.me)
  if (i < top) return head
  const from = around ? Math.max(top, i - 1) : i
  const to = around ? Math.min(rows.length, i + 2) : i + 1
  return [...head, ...(from > top ? [{ gap: true, id: 'gap' }] : []), ...rows.slice(from, to)]
}

const stamp = () => {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`
}

/* ---------------------------------- ASOSIY ---------------------------------- */
const Reyting = () => {
  const { profile, fullName } = useProfile()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('quvvat')
  const [scope, setScope] = useState({ coin: 'branch', battle: 'all' })

  useEffect(() => {
    let off = false
    const get = (url) =>
      fetch(url).then((r) => {
        if (!r.ok) throw new Error(url)
        return r.json()
      })

    // 1) json-server orqali, 2) bo'lmasa public/db.json fayldan
    Promise.all(['students', 'ratings', 'currentUser', 'groups', 'stats'].map((k) => get(`${API}/${k}`)))
      .then(([students, ratings, me, groups, stats]) => ({ students, ratings, me, groups, stats }))
      .catch(() =>
        get('/db.json').then((db) => ({
          students: db.students,
          ratings: db.ratings,
          me: db.currentUser,
          groups: db.groups,
          stats: db.stats,
        }))
      )
      .then((d) => !off && setData(d))
      .catch(() => !off && setError("Ma'lumotlarni yuklab bo'lmadi. json-server ishlayotganini yoki db.json public papkada ekanini tekshiring."))
    return () => {
      off = true
    }
  }, [])

  // o'quvchilarga guruh, filial va statistikani (stats) biriktiramiz
  const players = useMemo(() => {
    if (!data) return []
    const gmap = Object.fromEntries(data.groups.map((g) => [g.id, g]))
    const smap = Object.fromEntries((data.stats || []).map((x) => [x.studentId, x]))
    return data.students.map((s) => ({
      ...s,
      ...(smap[s.id] || {}),
      branchId: gmap[s.groupId]?.branchId,
    }))
  }, [data])

  // har bir tab uchun tayyor ro'yxat (hammasi db.json'dan)
  const boards = useMemo(() => {
    if (!data) return null
    const { ratings } = data
    const me = {
      ...data.me,
      fullName,
      avatar: profile.avatar,
      xp: Number(profile.xp) || 0,
      coins: Number(profile.coins) || 0,
    }
    const inScope = (s, sc) =>
      sc === 'group' ? s.groupId === me.groupId : sc === 'branch' ? s.branchId === me.branchId : true

    const base = (s) => ({ id: s.id, name: s.fullName, avatar: pick(s.id), level: s.level })
    const meBase = { id: 'me', me: true, name: ME_LABEL, level: me.level, avatar: null }

    const quvvat = rankList([
      ...ratings
        .filter((r) => !r.isCurrent)
        .map((r) => ({
          id: 'r' + r.rank,
          name: r.name,
          sub: 'Marsianin',
          value: r.score,
          level: r.level,
          avatar: pick(r.name),
        })),
      { ...meBase, sub: me.rank, value: me.xp },
    ])

    const coin = (sc) =>
      rankList([
        ...players.filter((s) => inScope(s, sc)).map((s) => ({ ...base(s), sub: s.rank, value: s.coins })),
        { ...meBase, sub: me.rank, value: me.coins },
      ])

    const battle = (sc) =>
      rankList(
        players
          .filter((s) => inScope(s, sc) && s.battleTotal > 0)
          .map((s) => ({
            ...base(s),
            sub: `${s.battleWins}/${s.battleTotal} g'alaba`,
            value: s.battlePoints,
          }))
      )

    const marstype = rankList(
      players.filter((s) => s.wpm > 0).map((s) => ({ ...base(s), sub: s.rank, value: s.wpm }))
    )

    const yutuq = rankList([
      ...players.filter((s) => s.trophies > 0).map((s) => ({ ...base(s), sub: s.category, value: s.trophies })),
      { ...meBase, sub: me.category, value: me.trophies ?? 0 },
    ])

    // Gran-pri: faqat harfli avatar, tagida yozuv yo'q
    const granpri = rankList(
      players.filter((s) => s.granpri > 0).map((s) => ({ id: s.id, name: s.fullName, avatar: null, value: s.granpri }))
    )

    return { quvvat, coin, battle, marstype, yutuq, granpri }
  }, [data, players, profile.avatar, profile.coins, profile.xp, fullName])

  if (error) return <div className="rt"><style>{css}</style><p className="rt-msg">{error}</p></div>
  if (!boards) return <div className="rt"><style>{css}</style><p className="rt-msg">Yuklanmoqda…</p></div>

  const myRank = (list) => list.find((r) => r.me)?.rank
  const chipValue = {
    quvvat: myRank(boards.quvvat) ? '#' + myRank(boards.quvvat) : '—',
    coin: myRank(boards.coin('all')) ? '#' + myRank(boards.coin('all')) : '—',
    battle: '—',
    marstype: '—',
    granpri: '—',
    yutuq: myRank(boards.yutuq) ? '#' + myRank(boards.yutuq) : '—',
  }

  /* ---- tanlangan tab uchun sozlama ---- */
  const cfg = {
    quvvat: { rows: boards.quvvat, caption: "Butun maktab bo'yicha", unit: 'quvvat' },
    coin: {
      rows: boards.coin(scope.coin),
      unit: 'coin',
      toggle: [['branch', 'Filialim'], ['group', 'Guruhim']],
      caption: scope.coin === 'group' ? "Guruhingiz bo'yicha · shu oy" : "Filialingiz bo'yicha · shu oy",
    },
    battle: {
      rows: boards.battle(scope.battle),
      icon: 'quvvat',
      toggle: [['all', 'Hammasi'], ['group', 'Guruhim']],
      caption: scope.battle === 'group' ? "Guruhingiz bo'yicha" : "Butun maktab bo'yicha",
    },
    marstype: { rows: boards.marstype, unit: 'WPM', caption: `Butun maktab bo'yicha · yangilangan ${stamp()}` },
    granpri: { rows: boards.granpri, unit: 'ochko', caption: "Butun maktab bo'yicha" },
    yutuq: { rows: boards.yutuq, icon: 'medal', caption: "Butun maktab bo'yicha" },
  }[tab]

  const view = VIEW[tab]
  const list = visible(cfg.rows, view)

  return (
    <div className="rt">
      <style>{css}</style>
      <h2 className="rt-title">
        Reyting va Yutuqlar
        <LuTrophy aria-hidden="true" />
      </h2>

      {/* yuqoridagi tablar */}
      <div className="rt-chips">
        {TABS.map((t) => (
          <button key={t.key} className={'chip' + (tab === t.key ? ' on' : '')} onClick={() => setTab(t.key)}>
            <span className="chip-i"><Icon k={t.key} /></span>
            <span className="chip-t">
              <small>{t.label}</small>
              <b>{chipValue[t.key]}</b>
            </span>
          </button>
        ))}
      </div>

      <div className="rt-card">
        <div className="rt-top">
          {cfg.toggle && (
            <div className="seg">
              {cfg.toggle.map(([k, l]) => (
                <button
                  key={k}
                  className={scope[tab] === k ? 'on' : ''}
                  onClick={() => setScope((s) => ({ ...s, [tab]: k }))}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
          <span className="cap">{cfg.caption}</span>
        </div>

        {cfg.rows.length === 0 ? (
          <p className="empty">Hozircha ma'lumot yo'q</p>
        ) : (
          <>
            {list.map((r) =>
              r.gap ? (
                <div key="gap" className="gap" />
              ) : (
                <Row key={r.id} r={r} unit={cfg.unit} icon={cfg.icon} badge={view.badge} />
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ---------------------------------- IKONKALAR ---------------------------------- */
const Icon = ({ k, size = 20 }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24' }
  switch (k) {
    case 'quvvat':
      return <svg {...p}><path d="M13.5 2 5 13.5h6L10 22l9-12h-6z" fill="#f2884a" /></svg>
    case 'coin':
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" fill="#f4b94c" />
          <circle cx="12" cy="12" r="6.5" fill="none" stroke="#d9952a" strokeWidth="1.6" />
        </svg>
      )
    case 'battle':
      return (
        <svg {...p} fill="none" stroke="#7b7a99" strokeWidth="2" strokeLinecap="round">
          <path d="M4 4l11 11M20 4 9 15M4 20l3-3M20 20l-3-3" />
        </svg>
      )
    case 'marstype':
      return (
        <svg {...p}>
          <rect x="2" y="6" width="20" height="12" rx="2.5" fill="#d9d6ec" />
          <path d="M5.5 10h2M9.5 10h2M13.5 10h2M17.5 10h1M7 14h10" stroke="#8a87aa" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'granpri':
      return (
        <svg {...p}>
          <rect x="3" y="3" width="18" height="18" fill="#fff" stroke="#3b3a52" strokeWidth="1" />
          {[0, 1, 2, 3].flatMap((r) =>
            [0, 1, 2, 3].map((c) =>
              (r + c) % 2 ? <rect key={r + '' + c} x={3 + c * 4.5} y={3 + r * 4.5} width="4.5" height="4.5" fill="#3b3a52" /> : null
            )
          )}
        </svg>
      )
    case 'yutuq':
      return (
        <svg {...p}>
          <path d="M7 3h10v6a5 5 0 0 1-10 0z" fill="#e0a03c" />
          <path d="M7 5H3.5c0 3 1.5 4.5 3.7 4.8M17 5h3.5c0 3-1.5 4.5-3.7 4.8" fill="none" stroke="#c98a26" strokeWidth="1.6" />
          <rect x="10.8" y="13.5" width="2.4" height="4" fill="#c98a26" />
          <rect x="7.5" y="18" width="9" height="3" rx="1" fill="#8d5a2b" />
        </svg>
      )
    case 'medal':
      return (
        <svg {...p}>
          <path d="M8 2h3l1 6-3 1zM16 2h-3l-1 6 3 1z" fill="#d86a8a" />
          <circle cx="12" cy="15" r="6.5" fill="#e8a33d" />
          <path d="m12 11.5 1.1 2.3 2.5.3-1.8 1.7.5 2.5-2.3-1.2-2.3 1.2.5-2.5-1.8-1.7 2.5-.3z" fill="#9a5b1c" />
        </svg>
      )
    default:
      return null
  }
}

// 1-3 o'rin uchun lenta shaklidagi medal
const MEDAL_COLORS = { 1: '#e8a33d', 2: '#b9b4dc', 3: '#b9764a' }
const Medal = ({ n }) => (
  <svg width="16" height="18" viewBox="0 0 20 22">
    <path d="M4 1h4l2 7-4 1zM16 1h-4l-2 7 4 1z" fill="#4a7fd6" />
    <circle cx="10" cy="14.5" r="6" fill={MEDAL_COLORS[n]} />
    <circle cx="10" cy="14.5" r="4.2" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1" />
    <text x="10" y="17.4" textAnchor="middle" fontSize="7" fontWeight="800" fill="#fff">{n}</text>
  </svg>
)

/* ---------------------------------- QATOR ---------------------------------- */
const Row = ({ r, unit, icon, badge }) => (
  <div className={'row' + (r.me ? ' me' : '')}>
    <span className="pos">{r.rank <= 3 ? <Medal n={r.rank} /> : r.rank}</span>

    <span className="ava">
      {r.avatar ? <img src={r.avatar} alt="" /> : <i>{r.name[0]}</i>}
      {badge && r.level && <em>{r.level}</em>}
    </span>

    <span className="who">
      <b>{r.name}</b>
      {r.sub && <small>{r.sub}</small>}
    </span>

    <span className="val">
      <b>{fmt(r.value)}</b>
      {unit && <small>{unit}</small>}
      {icon && <span className="vi"><Icon k={icon} size={18} /></span>}
    </span>
  </div>
)

/* ----------------------------------- CSS ----------------------------------- */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
.rt{min-height:100vh;background:#f8f7fc;padding:24px 24px 60px;font-family:'Manrope','Nunito','Segoe UI',system-ui,sans-serif;color:#1c1b2e}
.rt *{box-sizing:border-box}
.rt-msg{color:#6b6a80}
.rt-title{display:flex;align-items:center;gap:8px;margin:0 0 14px;font-size:22px;font-weight:700;letter-spacing:-.01em}
.rt-title svg{color:#d79a32}
.rt-chips,.rt-card{max-width:1151px}

/* tablar */
.rt-chips{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:12px}
.chip{display:flex;align-items:center;gap:10px;height:47px;background:#fff;border:1px solid #ebe9f4;border-radius:11px;padding:0 14px;cursor:pointer;font-family:inherit;color:inherit;text-align:left}
.chip:hover{border-color:#cfd3ee}
.chip.on{border:2px solid #6ab4ec;padding:0 13px}
.chip-i{display:grid;place-items:center;width:20px}
.chip-t{display:flex;flex-direction:column;line-height:1.15}
.chip-t small{font-size:11px;font-weight:500;color:#5e5d73}
.chip-t b{font-size:15px;font-weight:700;color:#1c1b2e}

/* karta */
.rt-card{background:#fff;border:1px solid #ebe9f4;border-radius:18px;padding:0 10px 14px}
.rt-top{display:flex;align-items:center;gap:14px;padding:15px 8px 14px}
.cap{font-size:12px;font-weight:500;color:#5e5d73}
.seg{display:flex;background:#f1f0f7;border-radius:10px;padding:3px}
.seg button{border:0;background:none;padding:7px 14px;border-radius:8px;font-family:inherit;font-weight:700;font-size:13px;color:#55546a;cursor:pointer}
.seg button.on{background:#fff;color:#1c1b2e;box-shadow:0 1px 3px rgba(0,0,0,.1)}

/* qator */
.row{display:flex;align-items:center;gap:11px;height:68px;padding:0 13px 0 0;border-radius:12px;border:1px solid transparent}
.row:hover{background:#f5f5f6}
.row:hover .who b{text-decoration:underline}
.row.me,.row.me:hover{background:#eef5ff;border-color:#b9dcf7}
.pos{flex:none;width:64px;display:grid;place-items:center;font-weight:600;font-size:15px;color:#5e5d73}
.ava{position:relative;flex:none;width:48px;height:48px;border-radius:50%;background:#fff;border:3px solid #55555f;display:grid;place-items:center}
.ava img{width:100%;height:100%;border-radius:50%;object-fit:cover;background:#fff}
.ava i{font-style:normal;font-weight:700;color:#9a99ad}
.row.me .ava,.ava:has(i){border-color:transparent;background:#f1f0f7}
.ava em{position:absolute;right:-5px;bottom:-4px;min-width:13px;height:13px;display:grid;place-items:center;background:#3a72b8;color:#fff;font-style:normal;font-size:9px;font-weight:700;border-radius:4px;padding:0 3px;border:1px solid #fff}
.who{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
.who b{font-size:16px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.who small{font-size:11.5px;font-weight:500;color:#6b6a80}
.val{display:flex;align-items:baseline;gap:5px}
.val b{font-size:19px;font-weight:600;letter-spacing:-.01em}
.val small{font-size:11px;font-weight:600;color:#6b6a80}
.vi{display:inline-grid;align-self:center;margin-left:4px}
.gap{height:14px}
.empty{padding:50px 0;text-align:center;color:#9a99ad;font-size:14px}

@media(max-width:600px){
  .rt{padding:20px 12px}
  .val b{font-size:16px}
  .rt-top{flex-wrap:wrap}
  .pos{width:40px}
}
`

export default Reyting
