import { useMemo, useState } from 'react'

/* ------------------------------------------------------------------
 * FRONT-END AKADEMIYA — /frontend sahifasi
 * To'liq responsiv platforma qobig'i, faqat Tailwind klasslari.
 * Mars Space uslubi: to'q navy (#0b1b33 / #142849) + orange (#F97316)
 * va cyan (#67e8f9) urg'ular.
 *
 * Ko'rinishlar (state: view):
 *   catalog   — hero, qidiruv, filtrlash, kurs kartalari, yo'l xaritasi
 *   dashboard — kabinet: davom etayotgan dars, streak, haftalik faollik
 *   lesson    — dars oynasi: player, tavsif, darslar ro'yxati
 * ------------------------------------------------------------------ */

const COURSES = [
  {
    id: 'html-css',
    title: 'HTML & CSS Asoslari',
    level: 'Boshlang‘ich',
    lessons: 24,
    weeks: 6,
    rating: 4.9,
    accent: '#F97316',
    category: 'Asoslar',
    tags: ['HTML', 'CSS', 'Responsive'],
    progress: 68,
    summary: 'Sahifa tuzilishi, semantik teglar, Flexbox va Grid bilan yotqizish.',
  },
  {
    id: 'javascript',
    title: 'JavaScript Chuqur',
    level: 'O‘rta',
    lessons: 32,
    weeks: 8,
    rating: 4.8,
    accent: '#FACC15',
    category: 'JavaScript',
    tags: ['ES2024', 'DOM', 'Async'],
    progress: 42,
    summary: 'Massivlar, closure, promise, event loop va DOM bilan ishlash.',
  },
  {
    id: 'react',
    title: 'React 19 + Vite',
    level: 'O‘rta',
    lessons: 28,
    weeks: 7,
    rating: 5.0,
    accent: '#38BDF8',
    category: 'React',
    tags: ['Hooks', 'Router', 'State'],
    progress: 24,
    summary: 'Komponentlar, hook’lar, routing va real loyiha arxitekturasi.',
  },
  {
    id: 'tailwind',
    title: 'Tailwind CSS Pro',
    level: 'O‘rta',
    lessons: 16,
    weeks: 4,
    rating: 4.7,
    accent: '#22D3EE',
    category: 'CSS',
    tags: ['Utility', 'Design', 'Dark mode'],
    progress: 55,
    summary: 'Dizayn tizimi, responsiv breakpoints va reusable komponentlar.',
  },
  {
    id: 'typescript',
    title: 'TypeScript Amalda',
    level: 'Yuqori',
    lessons: 20,
    weeks: 5,
    rating: 4.8,
    accent: '#60A5FA',
    category: 'JavaScript',
    tags: ['Types', 'Generics', 'Zod'],
    progress: 8,
    summary: 'Tiplar, generics va xavfsiz API bilan ishlash amaliyoti.',
  },
  {
    id: 'interview',
    title: 'Front-End Intervyu',
    level: 'Yuqori',
    lessons: 18,
    weeks: 3,
    rating: 4.9,
    accent: '#A78BFA',
    category: 'Intervyu',
    tags: ['Algoritm', 'Mock', 'CV'],
    progress: 0,
    summary: 'Texnik suhbat savollari, live-coding va portfolioni tayyorlash.',
  },
]

const CATEGORIES = ['Barchasi', 'Asoslar', 'JavaScript', 'React', 'CSS', 'Intervyu']

const ROADMAP = [
  { title: 'HTML & CSS poydevori', detail: '24 dars · semantika va layout', state: 'done' },
  { title: 'JavaScript mantig‘i', detail: '32 dars · DOM va async', state: 'done' },
  { title: 'React ekotizimi', detail: '28 dars · hook va routing', state: 'active' },
  { title: 'Loyiha va intervyu', detail: '18 dars · portfolioga tayyorgarlik', state: 'locked' },
]

const MENTORS = [
  { name: 'Dilshod Rahimov', role: 'Lead Front-End', courses: 6, accent: '#F97316', initials: 'DR' },
  { name: 'Malika Yusupova', role: 'React Engineer', courses: 4, accent: '#38BDF8', initials: 'MY' },
  { name: 'Bekzod To‘rayev', role: 'UI Engineer', courses: 3, accent: '#22D3EE', initials: 'BT' },
]

const LESSONS = [
  { id: 'l1', module: '1-modul · HTML & CSS', title: 'Flexbox asoslari', minutes: 18, accent: '#F97316' },
  { id: 'l2', module: '1-modul · HTML & CSS', title: 'Grid bilan sahifa yotqizish', minutes: 22, accent: '#F97316' },
  { id: 'l3', module: '1-modul · HTML & CSS', title: 'Responsive breakpoints', minutes: 16, accent: '#F97316' },
  { id: 'l4', module: '2-modul · JavaScript', title: 'Funksiyalar va scope', minutes: 24, accent: '#FACC15' },
  { id: 'l5', module: '2-modul · JavaScript', title: 'DOM bilan ishlash', minutes: 21, accent: '#FACC15' },
  { id: 'l6', module: '3-modul · React', title: 'Komponentlar va props', minutes: 26, accent: '#38BDF8' },
  { id: 'l7', module: '3-modul · React', title: 'useState chuqur', minutes: 23, accent: '#38BDF8' },
  { id: 'l8', module: '3-modul · React', title: 'Ro‘yxatlar va key', minutes: 19, accent: '#38BDF8' },
]

const WEEK = [
  { day: 'Du', minutes: 35 },
  { day: 'Se', minutes: 55 },
  { day: 'Ch', minutes: 20 },
  { day: 'Pa', minutes: 70 },
  { day: 'Ju', minutes: 45 },
  { day: 'Sh', minutes: 25 },
  { day: 'Ya', minutes: 0 },
]

/* ------------------------------ ikonkalar ------------------------------ */

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" strokeLinecap="round" />
  </svg>
)

const BookmarkIcon = ({ filled }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
  >
    <path d="M6 4h12v16l-6-4-6 4V4Z" strokeLinejoin="round" />
  </svg>
)

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />
  </svg>
)

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </svg>
)

const NAV = [
  {
    id: 'catalog',
    label: 'Katalog',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'dashboard',
    label: 'Kabinet',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path d="M4 19V9m5 10V5m5 14v-7m5 7V8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'lesson',
    label: 'Dars oynasi',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <circle cx="12" cy="12" r="8" />
        <path d="m10.5 9.5 4.5 2.5-4.5 2.5v-5Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

/* ------------------------------ KATALOG ------------------------------ */

const CatalogView = ({ query, setQuery, category, setCategory, saved, toggleSave, openLesson }) => {
  const courses = useMemo(() => {
    const text = query.trim().toLowerCase()

    return COURSES.filter((course) => {
      if (category !== 'Barchasi' && course.category !== category) return false
      if (!text) return true

      return (
        course.title.toLowerCase().includes(text) ||
        course.summary.toLowerCase().includes(text) ||
        course.tags.some((tag) => tag.toLowerCase().includes(text))
      )
    })
  }, [query, category])

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-[#0b1b33] p-6 text-white shadow-xl sm:p-10">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[#F97316]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
            FRONT-END YO‘NALISHI
          </span>

          <h1 className="mt-4 max-w-2xl text-2xl font-bold leading-tight sm:text-4xl">
            6 oyda <span className="text-[#F97316]">front-end</span> dasturchi bo‘ling
          </h1>

          <p className="mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
            HTML’dan React’gacha bosqichma-bosqich yo‘l xaritasi, amaliy loyihalar va mentor
            yordami. Har bir dars 20 daqiqadan, nazorat testlari bilan.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex-1 sm:max-w-md">
              <span className="sr-only">Kurs qidirish</span>
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Kurs yoki texnologiya qidiring..."
                className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-[#F97316] focus:bg-white/10"
              />
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => openLesson('l4')}
                className="rounded-2xl bg-[#F97316] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ea580c]"
              >
                Yo‘nalishni boshlash
              </button>
              <a
                href="#roadmap"
                className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Yo‘l xaritasi
              </a>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center sm:max-w-lg sm:text-left">
            {[
              ['6', 'kurs'],
              ['138', 'dars'],
              ['12.2k', 'o‘quvchi'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block text-xl font-bold sm:text-2xl">{value}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- FILTR ---------------- */}
      <div id="kurslar" className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Kurs toifalari">
          {CATEGORIES.map((item) => {
            const active = item === category

            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-xs font-bold tracking-[0.02em] transition ${
                  active
                    ? 'bg-[#0b1b33] text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-[#F97316]/40 hover:text-[#ea580c]'
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>

        <p className="text-[11px] font-semibold text-slate-400">{courses.length} ta kurs topildi</p>
      </div>

      {/* ---------------- KURSLAR ---------------- */}
      {courses.length === 0 ? (
        <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm font-bold text-slate-700">Hech narsa topilmadi</p>
          <p className="mt-1 text-xs text-slate-500">
            Boshqa so‘z bilan qidirib ko‘ring yoki toifani “Barchasi”ga o‘zgartiring.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setCategory('Barchasi')
            }}
            className="mt-4 rounded-full bg-[#F97316] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#ea580c]"
          >
            Filtrlarni tozalash
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const isSaved = saved.has(course.id)

            return (
              <article
                key={course.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#F97316]/40 hover:shadow-lg"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: course.accent }}
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span
                      className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]"
                      style={{ backgroundColor: `${course.accent}1f`, color: course.accent }}
                    >
                      {course.level}
                    </span>
                    <h3 className="mt-2 truncate text-base font-bold text-slate-900">{course.title}</h3>
                  </div>

                  <button
                    type="button"
                    aria-label={isSaved ? 'Saqlanganlardan olib tashlash' : 'Kursni saqlash'}
                    aria-pressed={isSaved}
                    onClick={() => toggleSave(course.id)}
                    className={`shrink-0 rounded-full border p-2 transition ${
                      isSaved
                        ? 'border-[#F97316] bg-[#fff7ed] text-[#ea580c]'
                        : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                    }`}
                  >
                    <BookmarkIcon filled={isSaved} />
                  </button>
                </div>

                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{course.summary}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>
                    {course.lessons} dars · {course.weeks} hafta
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#d97706]">
                    <StarIcon />
                    {course.rating.toFixed(1)}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${course.progress}%`, backgroundColor: course.accent }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openLesson('l4')}
                    className="flex-1 rounded-full border border-slate-200 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-700 transition hover:border-[#F97316]/50 hover:text-[#ea580c]"
                  >
                    {course.progress > 0 ? 'Davom ettirish' : 'Boshlash'}
                  </button>

                  <a
                    href="#roadmap"
                    className="rounded-full px-3 py-2.5 text-[11px] font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    Batafsil
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* ---------------- YO‘L XARITASI + MENTORLAR ---------------- */}
      <div id="roadmap" className="mt-8 grid gap-4 lg:grid-cols-3">
        <section className="rounded-3xl bg-[#0b1b33] p-6 text-white lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-cyan-300">YO‘L XARITASI</p>
              <h2 className="mt-1 text-lg font-bold">Front-end mutaxassisligi</h2>
            </div>
            <span className="rounded-full bg-[#F97316] px-3 py-1 text-[10px] font-bold tracking-[0.08em]">
              46%
            </span>
          </div>

          <ol className="mt-5 space-y-2.5">
            {ROADMAP.map((step, index) => {
              const done = step.state === 'done'
              const active = step.state === 'active'

              return (
                <li
                  key={step.title}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-3 ${
                    active
                      ? 'border-[#F97316] bg-white/5'
                      : done
                        ? 'border-white/10 bg-white/[0.03]'
                        : 'border-white/5'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                      done
                        ? 'bg-[#F97316] text-white'
                        : active
                          ? 'bg-[#ffedd5] text-[#ea580c]'
                          : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {done ? '✓' : active ? '☆' : '🔒'}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-[13px] ${
                        step.state === 'locked' ? 'font-medium text-slate-400' : 'font-bold text-white'
                      }`}
                    >
                      {index + 1}. {step.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{step.detail}</p>
                  </div>

                  <span className="hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 sm:block">
                    {done ? 'Tugadi' : active ? 'Davom etmoqda' : 'Yopiq'}
                  </span>
                </li>
              )
            })}
          </ol>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-[10px] font-bold tracking-[0.18em] text-slate-400">MENTORLAR</p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">Kim o‘rgatadi?</h2>

          <ul className="mt-4 space-y-3">
            {MENTORS.map((mentor) => (
              <li key={mentor.name} className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                  style={{ backgroundColor: mentor.accent }}
                >
                  {mentor.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-slate-900">{mentor.name}</p>
                  <p className="text-[11px] text-slate-500">{mentor.role}</p>
                </div>
                <span className="shrink-0 text-[10px] font-semibold text-slate-400">
                  {mentor.courses} kurs
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => openLesson('l4')}
            className="mt-5 w-full rounded-full border border-slate-200 py-2.5 text-[11px] font-bold text-slate-700 transition hover:border-[#F97316]/50 hover:text-[#ea580c]"
          >
            Darsni davom ettirish
          </button>
        </section>
      </div>

      {/* ---------------- CTA ---------------- */}
      <section className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-[#F97316] to-[#fb923c] p-6 text-white sm:flex-row sm:p-8">
        <div>
          <h2 className="text-lg font-bold sm:text-xl">Birinchi darsni bugun boshlang</h2>
          <p className="mt-1 text-xs text-white/85 sm:text-sm">
            Ro‘yxatdan o‘tish bepul · 7 kunlik mentor yordami · sertifikat
          </p>
        </div>
        <button
          type="button"
          onClick={() => openLesson('l4')}
          className="w-full rounded-full bg-[#0b1b33] px-6 py-3 text-center text-sm font-bold transition hover:bg-[#142849] sm:w-auto"
        >
          Kurslarni boshlash
        </button>
      </section>
    </>
  )
}

/* ------------------------------ KABINET ------------------------------ */

const DashboardView = ({ completed, progress, activeLesson, openLesson }) => {
  // Kabinet doim keyingi tugallanmagan darsni taklif qiladi
  const nextLesson =
    LESSONS.find((lesson) => !completed.has(lesson.id)) ||
    LESSONS.find((lesson) => lesson.id === activeLesson) ||
    LESSONS[0]
  const maxMinutes = Math.max(...WEEK.map((day) => day.minutes))
  const totalMinutes = WEEK.reduce((sum, day) => sum + day.minutes, 0)

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] text-slate-400">KABINET</p>
          <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">Salom, Aziza 👋</h1>
          <p className="mt-1 text-xs text-slate-500">
            Bugun 1 ta dars qoldi — davom etamizmi?
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff7ed] px-3 py-1.5 text-[11px] font-bold text-[#ea580c]">
            🔥 12 kun streak
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b1b33] px-3 py-1.5 text-[11px] font-bold text-white">
            {progress}% tugallandi
          </span>
        </div>
      </header>

      {/* Davom etayotgan dars */}
      <section className="relative mt-5 overflow-hidden rounded-3xl bg-[#0b1b33] p-6 text-white">
        <div className="pointer-events-none absolute -right-8 -top-12 h-44 w-44 rounded-full bg-[#F97316]/25 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold tracking-[0.16em] text-cyan-300">DAVOM ETMOQDA</p>
            <h2 className="mt-1 text-lg font-bold sm:text-xl">{nextLesson.title}</h2>
            <p className="mt-1 text-[11px] text-slate-400">
              {nextLesson.module} · {nextLesson.minutes} daqiqa
            </p>

            <div className="mt-4 max-w-sm">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                <span>Kurs progressi</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#F97316] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openLesson(nextLesson.id)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#F97316] px-6 py-3 text-sm font-bold transition hover:bg-[#ea580c]"
          >
            <PlayIcon />
            Davom etish
          </button>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Haftalik faollik */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] text-slate-400">HAFTALIK FAOLLIK</p>
              <h2 className="mt-1 text-base font-bold text-slate-900">{totalMinutes} daqiqa</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
              7 kun
            </span>
          </div>

          <div className="mt-5 flex h-36 items-end justify-between gap-2">
            {WEEK.map((day) => {
              const height = Math.round((day.minutes / maxMinutes) * 100)
              const today = day.day === 'Pa'

              return (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-28 w-full items-end rounded-lg bg-slate-50">
                    <div
                      className={`w-full rounded-lg transition-all ${
                        today ? 'bg-[#F97316]' : 'bg-[#0b1b33]/15'
                      }`}
                      style={{ height: `${Math.max(height, 4)}%` }}
                      title={`${day.minutes} daqiqa`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold ${today ? 'text-[#ea580c]' : 'text-slate-400'}`}
                  >
                    {day.day}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Yutuqlar */}
        <section className="rounded-3xl bg-[#142849] p-5 text-white">
          <p className="text-[10px] font-bold tracking-[0.16em] text-cyan-300">YUTUQLAR</p>
          <h2 className="mt-1 text-base font-bold">3 ta nishon</h2>

          <ul className="mt-4 space-y-2.5">
            {[
              { icon: '🚀', title: 'Birinchi start', detail: 'Kursga yozildingiz' },
              { icon: '🔥', title: '12 kun streak', detail: 'Har kuni 20+ daqiqa' },
              { icon: '🏆', title: 'HTML & CSS', detail: '1-modul yakunlandi' },
            ].map((badge) => (
              <li key={badge.title} className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-base">
                  {badge.icon}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-bold">{badge.title}</p>
                  <p className="truncate text-[10px] text-slate-400">{badge.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Darslar ro'yxati */}
      <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Darslar</h2>
          <span className="text-[11px] font-semibold text-slate-400">
            {completed.size} / {LESSONS.length} yakunlangan
          </span>
        </div>

        <ul className="mt-3 divide-y divide-slate-100">
          {LESSONS.map((lesson) => {
            const done = completed.has(lesson.id)
            const current = lesson.id === activeLesson

            return (
              <li key={lesson.id}>
                <button
                  type="button"
                  onClick={() => openLesson(lesson.id)}
                  className="flex w-full items-center gap-3 py-3 text-left transition hover:opacity-80"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                      done
                        ? 'text-white'
                        : current
                          ? 'bg-[#ffedd5] text-[#ea580c]'
                          : 'bg-slate-100 text-slate-400'
                    }`}
                    style={done ? { backgroundColor: lesson.accent } : undefined}
                  >
                    {done ? '✓' : current ? '☆' : '🔒'}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-slate-900">{lesson.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {lesson.module} · {lesson.minutes} daqiqa
                    </p>
                  </div>

                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.08em] text-[#ea580c]">
                    {done ? 'Takrorlash' : current ? 'Boshlash' : 'Ochish'}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}

/* ------------------------------ DARS ------------------------------ */

const LessonView = ({ completed, activeLesson, openLesson, finishLesson, notice }) => {
  const index = LESSONS.findIndex((lesson) => lesson.id === activeLesson)
  const lesson = LESSONS[index] || LESSONS[0]
  const done = completed.has(lesson.id)
  const next = LESSONS[index + 1]

  return (
    <>
      <nav className="flex items-center gap-2 text-[11px] font-semibold text-slate-400" aria-label="Yo‘l">
        <span className="text-slate-500">Kabinet</span>
        <span>/</span>
        <span className="text-slate-500">{lesson.module}</span>
        <span>/</span>
        <span className="text-[#ea580c]">{index + 1}-dars</span>
      </nav>

      <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{lesson.title}</h1>
      <p className="mt-1 text-xs text-slate-500">
        {lesson.minutes} daqiqa · video, amaliyot va test
      </p>

      {notice && (
        <p className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700">
          {notice}
        </p>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="min-w-0">
          {/* Player */}
          <div className="relative isolate overflow-hidden rounded-3xl bg-[#0b1b33]">
            <div className="flex aspect-video items-center justify-center">
              <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-[#F97316]/25 blur-3xl" />
              <button
                type="button"
                className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#F97316] text-white shadow-lg shadow-[#F97316]/30 transition hover:scale-105 hover:bg-[#ea580c]"
                aria-label="Darsni qo‘yish"
              >
                <PlayIcon />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-[11px] font-semibold text-slate-300">
              <span className="truncate">{lesson.title}</span>
              <span className="shrink-0 text-slate-400">{lesson.minutes}:00</span>
            </div>
          </div>

          {/* Tavsif */}
          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-bold text-slate-900">Dars haqida</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Bu darsda {lesson.title.toLowerCase()} mavzusini amaliy misollar bilan ko‘rib chiqamiz.
              Video tugagach, 5 savoldan iborat test va kichik topshiriq ochiladi. Topshiriqni
              yuborsangiz, mentor 24 soat ichida fikr bildiradi.
            </p>

            <h3 className="mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
              Nima o‘rganasiz
            </h3>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {['Asosiy tushunchalar', 'Amaliy kod misoli', 'Keng tarqalgan xatolar', 'Mini topshiriq'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fff7ed] text-[9px] font-bold text-[#ea580c]">
                      ✓
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={finishLesson}
                disabled={done}
                className={`flex-1 rounded-full py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] transition ${
                  done
                    ? 'cursor-not-allowed bg-emerald-50 text-emerald-700'
                    : 'bg-[#F97316] text-white hover:bg-[#ea580c]'
                }`}
              >
                {done ? '✓ Dars yakunlangan' : 'Darsni tugatish'}
              </button>

              {next && (
                <button
                  type="button"
                  onClick={() => openLesson(next.id)}
                  className="flex-1 rounded-full border border-slate-200 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-700 transition hover:border-[#F97316]/50 hover:text-[#ea580c]"
                >
                  Keyingi dars →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Darslar ro'yxati */}
        <aside className="rounded-3xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              DARSLAR
            </h2>
            <span className="text-[10px] font-bold text-slate-400">
              {completed.size}/{LESSONS.length}
            </span>
          </div>

          <ol className="mt-3 space-y-1.5">
            {LESSONS.map((item, itemIndex) => {
              const itemDone = completed.has(item.id)
              const active = item.id === lesson.id

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openLesson(item.id)}
                    aria-current={active ? 'true' : undefined}
                    className={`flex w-full items-center gap-2.5 rounded-2xl px-2.5 py-2 text-left transition ${
                      active ? 'bg-[#fff7ed]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        itemDone
                          ? 'text-white'
                          : active
                            ? 'bg-[#ffedd5] text-[#ea580c]'
                            : 'bg-slate-100 text-slate-400'
                      }`}
                      style={itemDone ? { backgroundColor: item.accent } : undefined}
                    >
                      {itemDone ? '✓' : itemIndex + 1}
                    </span>
                    <span
                      className={`truncate text-[12px] ${
                        active ? 'font-bold text-slate-900' : 'font-medium text-slate-600'
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          <button
            type="button"
            onClick={() => openLesson(activeLesson)}
            className="mt-3 w-full rounded-full bg-[#0b1b33] py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#142849]"
          >
            Darsni qayta boshlash
          </button>
        </aside>
      </div>
    </>
  )
}

/* ------------------------------ SAHIFA ------------------------------ */

const Page = () => {
  const [view, setView] = useState('catalog')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Barchasi')
  const [saved, setSaved] = useState(() => new Set(['react']))
  const [completed, setCompleted] = useState(() => new Set(['l1', 'l2', 'l3']))
  const [activeLesson, setActiveLesson] = useState('l4')
  const [notice, setNotice] = useState('')

  const progress = Math.round((completed.size / LESSONS.length) * 100)

  const toggleSave = (id) => {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openLesson = (id) => {
    setActiveLesson(id)
    setView('lesson')
    setNotice('')
  }

  const finishLesson = () => {
    if (completed.has(activeLesson)) return

    setCompleted((prev) => new Set(prev).add(activeLesson))

    const index = LESSONS.findIndex((lesson) => lesson.id === activeLesson)
    const next = LESSONS[index + 1]

    setNotice(
      next
        ? `✓ Dars yakunlandi. Keyingisi: ${next.title}`
        : '✓ Barcha darslar yakunlandi. Tabriklaymiz!',
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
      <div className="grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
        {/* Sidebar — mobilda gorizontal lenta */}
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:flex-col lg:items-stretch lg:overflow-visible lg:pb-0">
            {NAV.map((item) => {
              const active = view === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-bold transition lg:w-full ${
                    active
                      ? 'bg-[#0b1b33] text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50 lg:bg-transparent lg:hover:bg-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              )
            })}
          </div>

          <div className="mt-4 hidden rounded-3xl bg-[#142849] p-4 text-white lg:block">
            <p className="text-[10px] font-bold tracking-[0.16em] text-cyan-300">STREAK</p>
            <p className="mt-1 text-lg font-bold">🔥 12 kun</p>
            <p className="mt-1 text-[10px] text-slate-400">
              Har kuni 20 daqiqa o‘qisangiz, nishon ochiladi.
            </p>
            <div className="mt-3 flex gap-1">
              {WEEK.map((day) => (
                <span
                  key={day.day}
                  className={`h-1.5 flex-1 rounded-full ${
                    day.minutes > 0 ? 'bg-[#F97316]' : 'bg-white/15'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 hidden rounded-3xl border border-slate-200 bg-white p-4 lg:block">
            <p className="text-[10px] font-bold tracking-[0.16em] text-slate-400">UMUMIY PROGRESS</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{progress}%</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#F97316] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] text-slate-400">
              {completed.size} / {LESSONS.length} dars yakunlangan
            </p>
          </div>
        </aside>

        {/* Kontent */}
        <main className="min-w-0">
          {view === 'catalog' && (
            <CatalogView
              query={query}
              setQuery={setQuery}
              category={category}
              setCategory={setCategory}
              saved={saved}
              toggleSave={toggleSave}
              openLesson={openLesson}
            />
          )}

          {view === 'dashboard' && (
            <DashboardView
              completed={completed}
              progress={progress}
              activeLesson={activeLesson}
              openLesson={openLesson}
            />
          )}

          {view === 'lesson' && (
            <LessonView
              completed={completed}
              activeLesson={activeLesson}
              openLesson={openLesson}
              finishLesson={finishLesson}
              notice={notice}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default Page
