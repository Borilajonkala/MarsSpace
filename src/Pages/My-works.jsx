import { useEffect, useMemo, useState } from 'react'

const MODULE_COUNT = 11
const LESSONS_PER_MODULE = 12

const BOOKING_DATES = [
  '18-noyabr, chorshanba',
  '20-noyabr, juma',
  '22-noyabr, yakshanba',
  '25-noyabr, seshanba',
]

const BOOKING_TIMES = ['15:00', '16:30', '17:30', '18:15', '19:00']

const COURSES = [
  {
    id: 'frontend',
    title: 'Front-End',
    isNew: true,
    group: 'YB-3158',
    branch: 'YUNUSABAD',
    schedule: 'Sesh, Pay, Shan 17:30',
    accent: '#38bdf8',
    softText: '#0369a1',
    done: 62,
    total: 132,
    block: 1,
    nextLesson: 'Category sahifasi',
    lastLesson: 'Loyiha setup',
    lessons: [
      { date: '17-noyabr, seshanba · 17:30', isToday: true, title: 'Category sahifasi', status: 'kutilmoqda' },
      { date: '19-noyabr, payshanba · 17:30', isToday: false, title: 'Foods + Orders sahifasi', status: 'kutilmoqda' },
      { date: '21-noyabr, shanba · 17:30', isToday: false, title: 'Loyihani guruhlash', status: 'kutilmoqda' },
      { date: '24-noyabr, seshanba · 17:30', isToday: false, title: "Cashier (to'lov, buyurtma)", status: 'kutilmoqda' },
    ],
    assignments: [
      { id: 'fe-1', title: 'Category sahifasi layout', module: '3-modul', due: '17-noyabr' },
      { id: 'fe-2', title: 'Foods sahifasi kartochkalari', module: '3-modul', due: '19-noyabr' },
      { id: 'fe-3', title: 'Orders sahifasi jadvali', module: '4-modul', due: '21-noyabr' },
    ],
  },
  {
    id: 'python',
    title: 'Python Backend',
    isNew: false,
    group: 'PY-2041',
    branch: 'CHILANZAR',
    schedule: 'Dush, Chor, Jum 15:00',
    accent: '#818cf8',
    softText: '#4338ca',
    done: 34,
    total: 144,
    block: 1,
    nextLesson: 'Django models',
    lastLesson: 'OOP amaliyot',
    lessons: [
      { date: '18-noyabr, chorshanba · 15:00', isToday: false, title: 'Django models', status: 'kutilmoqda' },
      { date: '20-noyabr, juma · 15:00', isToday: false, title: 'Admin panel sozlash', status: 'kutilmoqda' },
    ],
    assignments: [
      { id: 'py-1', title: 'OOP amaliyoti', module: '2-modul', due: '18-noyabr' },
      { id: 'py-2', title: 'Django models sxemasi', module: '3-modul', due: '20-noyabr' },
    ],
  },
  {
    id: 'scratch',
    title: 'Scratch & Game Dev',
    isNew: false,
    group: 'SC-1187',
    branch: 'MINOR',
    schedule: 'Pay, Shan 11:00',
    accent: '#34d399',
    softText: '#047857',
    done: 72,
    total: 72,
    block: 2,
    nextLesson: 'Yakuniy loyiha taqdimoti',
    lastLesson: '2D o‘yin sikli',
    lessons: [
      { date: '21-noyabr, shanba · 11:00', isToday: false, title: 'Yakuniy loyiha taqdimoti', status: 'yakunlangan' },
    ],
    assignments: [],
  },
]

const buildModules = (course) => {
  let left = course.done

  return Array.from({ length: MODULE_COUNT }, (_, index) => {
    const done = Math.min(LESSONS_PER_MODULE, Math.max(0, left))
    left -= done

    return { name: `${index + 1}-modul`, done, total: LESSONS_PER_MODULE }
  })
}

const ProgressRing = ({ percent, color }) => {
  const radius = 26
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
      <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} stroke="#e2e8f0" strokeWidth="5" fill="transparent" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke={color}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (percent / 100) * circumference}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <span className="absolute text-xs font-bold text-slate-700">{percent}%</span>
    </div>
  )
}

const Modal = ({ title, subtitle, onClose, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 sm:items-center sm:p-4"
    onClick={onClose}
  >
    <div
      className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="mt-0.5 truncate text-xs text-slate-400">{subtitle}</p>}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Yopish"
          className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {children}
    </div>
  </div>
)

const MyWorks = () => {
  const [activeCourse, setActiveCourse] = useState(0)
  const [hoveredModule, setHoveredModule] = useState(null)
  const [modal, setModal] = useState(null)
  const [submitted, setSubmitted] = useState({})
  const [booked, setBooked] = useState({})
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [toast, setToast] = useState('')

  const course = COURSES[activeCourse]
  const modules = useMemo(() => buildModules(course), [course])

  const percent = Math.round((course.done / course.total) * 100)
  const unfinishedIndex = modules.findIndex((item) => item.done < item.total)
  const currentModule = unfinishedIndex === -1 ? MODULE_COUNT - 1 : unfinishedIndex
  const isFinished = course.done >= course.total

  const pending = course.assignments.filter((item) => !submitted[item.id])
  const debt = pending.length
  const due = pending[0]?.due ?? ''

  const lessons = [...course.lessons, ...(booked[course.id] ?? [])]

  const points = modules.map((_, index) => ({
    x: 60 + index * 100,
    y: 130 - index * 8,
  }))

  const path = points.reduce((result, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`

    const prev = points[index - 1]
    const midX = (prev.x + point.x) / 2

    return result + ` C ${midX} ${prev.y}, ${midX} ${point.y}, ${point.x} ${point.y}`
  }, '')

  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => setToast(''), 2600)

    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!modal) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setModal(null)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [modal])

  const selectCourse = (index) => {
    setActiveCourse(index)
    setHoveredModule(null)
  }

  const openModule = (index) => {
    setModal({ type: 'module', index })
  }

  const openCourseFor = (index) => {
    selectCourse(index)
    setModal({ type: 'course' })
  }

  const openModuleFor = (index) => {
    selectCourse(index)
    setModal({ type: 'module' })
  }

  const bookLesson = () => {
    if (!bookingDate || !bookingTime) return

    const lesson = {
      date: `${bookingDate} · ${bookingTime}`,
      isToday: false,
      title: 'Tyutor bilan qo‘shimcha dars',
      status: 'band qilingan',
    }

    setBooked((prev) => ({ ...prev, [course.id]: [...(prev[course.id] ?? []), lesson] }))
    setBookingDate('')
    setBookingTime('')
    setModal(null)
    setToast(`Dars band qilindi: ${bookingDate} · ${bookingTime}`)
  }

  const submitAssignment = (assignment) => {
    setSubmitted((prev) => ({ ...prev, [assignment.id]: true }))
    setToast(`Topshiriq yuborildi: ${assignment.title}`)
  }

  const downloadCertificate = () => {
    const html = `<!doctype html>
<html lang="uz"><head><meta charset="utf-8"><title>${course.title} — sertifikat</title></head>
<body style="margin:0;padding:48px;font-family:Arial,Helvetica,sans-serif;background:#f1f5f9;color:#0f172a">
  <div style="max-width:720px;margin:0 auto;padding:48px 40px;border:1px solid #cbd5e1;border-radius:20px;background:#ffffff;text-align:center">
    <p style="margin:0;font-size:12px;letter-spacing:4px;color:#0369a1">MARS SPACE</p>
    <h1 style="margin:16px 0 8px;font-size:30px">Sertifikat</h1>
    <p style="margin:0;color:#475569">Kurs muvaffaqiyatli yakunlanganini tasdiqlaydi</p>
    <h2 style="margin:32px 0 4px;font-size:24px">${course.title}</h2>
    <p style="margin:0;color:#64748b">${course.group} · ${course.branch}</p>
    <p style="margin:32px 0 0;color:#475569">${course.total} dars · ${MODULE_COUNT} modul · 100%</p>
  </div>
</body></html>`

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `${course.title}-sertifikat.html`
    link.click()
    URL.revokeObjectURL(url)

    setToast('Sertifikat yuklab olindi')
  }

  const modalCourseIndex = activeCourse
  const modalModules = useMemo(() => buildModules(COURSES[modalCourseIndex]), [modalCourseIndex])

  return (
    <div className="w-full space-y-6 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      {/* Sarlavha */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Mening kurslarim
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
          Kurslar va modul yo‘li
        </h1>
        <p className="mt-1 max-w-xl text-sm text-slate-500">
          Modullar, darslar va topshiriqlar bo‘yicha progressni shu yerdan kuzatib boring.
        </p>
      </div>

      {/* Kurs tanlash */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {COURSES.map((item, index) => {
          const itemPercent = Math.round((item.done / item.total) * 100)
          const selected = index === activeCourse

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectCourse(index)}
              className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
                selected
                  ? 'border-slate-900 bg-white shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: item.accent }}
              >
                {item.title.charAt(0)}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-bold text-slate-900">{item.title}</span>
                  {item.isNew && (
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-700">
                      new
                    </span>
                  )}
                </span>
                <span className="mt-0.5 flex items-center justify-between gap-2 text-[11px] font-medium text-slate-400">
                  <span className="truncate">{item.group}</span>
                  <span>{itemPercent}%</span>
                </span>
                <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <span
                    className="block h-full rounded-full transition-all"
                    style={{ width: `${itemPercent}%`, backgroundColor: item.accent }}
                  />
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Tanlangan kurs hero */}
      <div className="rounded-2xl bg-[#142849] px-5 py-6 text-white sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-widest text-cyan-300">
              {isFinished ? 'YAKUNLANGAN KURS' : 'HOZIRGI KURS'}
            </p>

            <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
              {course.isNew ? '[New] ' : ''}
              {course.title}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-300">
              <span>
                {course.group} · {course.branch}
              </span>
              <span>
                MODUL {isFinished ? MODULE_COUNT : currentModule + 1} · BLOK {course.block}
              </span>
              <span>
                {course.done} / {course.total} dars · {percent}%
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  isFinished ? setModal({ type: 'certificate' }) : openModule(currentModule)
                }
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-[#0b1b33] transition hover:brightness-110"
                style={{ backgroundColor: course.accent }}
              >
                {isFinished ? 'Sertifikatni olish' : 'Davom ettirish'}
              </button>

              <button
                type="button"
                onClick={() => setModal({ type: 'course' })}
                className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-200 hover:underline"
              >
                Butun kurs
              </button>
            </div>

            <p className="mt-4 text-[11px] text-slate-400">
              O‘tilgan: {course.lastLesson}
              <span className="mx-2">→</span>
              Keyingi: {course.nextLesson}
            </p>
          </div>

          <div className="flex gap-6 text-right sm:gap-8">
            <button
              type="button"
              onClick={() => setModal({ type: 'assignments' })}
              className="rounded-lg text-right transition hover:opacity-80"
            >
              <p className="text-[9px] font-bold tracking-widest text-cyan-300">TOPSHIRILMAGAN</p>
              <h3 className="mt-1 text-2xl font-bold">{debt}</h3>
              <p className="text-[10px] text-slate-400">{due ? `${due} gacha` : '—'}</p>
            </button>

            <button
              type="button"
              onClick={() => setModal({ type: 'course' })}
              className="rounded-lg text-right transition hover:opacity-80"
            >
              <p className="text-[9px] font-bold tracking-widest text-cyan-300">MODUL</p>
              <h3 className="mt-1 text-2xl font-bold">
                {isFinished ? MODULE_COUNT : currentModule + 1}
                <span className="text-sm font-medium text-slate-400"> / {MODULE_COUNT}</span>
              </h3>
              <p className="text-[10px] text-slate-400">{course.schedule}</p>
            </button>
          </div>
        </div>

        {/* Modul yo'li */}
        <div id="modules" className="relative mt-6 h-[165px] w-full sm:h-[180px]">
          <svg viewBox="0 0 1100 170" preserveAspectRatio="none" className="h-full w-full overflow-visible">
            <path d={path} fill="none" stroke={course.accent} strokeWidth="2" strokeLinecap="round" opacity="0.8" />

            {points.map((point, index) => {
              const module = modules[index]
              const finished = module.done >= module.total
              const current = index === currentModule

              return (
                <g
                  key={module.name}
                  className="cursor-pointer"
                  onClick={() => openModule(index)}
                  onMouseEnter={() => setHoveredModule(index)}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  {current && <circle cx={point.x} cy={point.y} r="13" fill={course.accent} opacity="0.2" />}

                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="5.5"
                    fill={finished || current ? course.accent : '#334867'}
                    stroke={hoveredModule === index ? '#ffffff' : 'none'}
                    strokeWidth="1.5"
                  />

                  <circle cx={point.x} cy={point.y} r="16" fill="transparent" />
                </g>
              )
            })}

            <text
              x={points[currentModule].x}
              y={points[currentModule].y - 20}
              textAnchor="middle"
              fill="#67e8f9"
              fontSize="10"
            >
              {isFinished ? 'TUGADI' : 'SIZ'}
            </text>
          </svg>

          {hoveredModule !== null && (
            <div
              className="pointer-events-none absolute z-30 w-[116px] rounded-lg border border-slate-600 bg-[#101b30] p-3 shadow-lg"
              style={{
                left: `${(points[hoveredModule].x / 1100) * 100}%`,
                top: `${(points[hoveredModule].y / 170) * 100}%`,
                transform: 'translate(-50%, -118%)',
              }}
            >
              <p className="text-[13px] font-semibold">{modules[hoveredModule].name}</p>
              <p className="mt-1.5 text-[12px] text-slate-300">
                {modules[hoveredModule].done} / {modules[hoveredModule].total} dars
              </p>
              <p className="mt-0.5 text-[12px] text-slate-400">
                {modules[hoveredModule].done >= modules[hoveredModule].total
                  ? 'yakunlangan'
                  : hoveredModule === currentModule
                    ? 'davom etmoqda'
                    : 'yopiq'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pastki qism */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            MENING KURSLARIM
          </h2>

          <div className="space-y-3">
            {COURSES.map((item, index) => {
              const itemPercent = Math.round((item.done / item.total) * 100)
              const finished = item.done >= item.total
              const itemPending = item.assignments.filter((assignment) => !submitted[assignment.id])

              return (
                <div
                  key={item.id}
                  className={`flex flex-col justify-between gap-4 rounded-2xl border bg-white p-5 transition sm:flex-row sm:items-center ${
                    index === activeCourse ? 'border-slate-300 shadow-sm' : 'border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <ProgressRing percent={itemPercent} color={item.accent} />

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-slate-900">
                        {item.isNew ? '[New] ' : ''}
                        {item.title}
                      </h3>
                      <p className="mt-1 truncate text-xs font-medium text-slate-400">
                        {item.group} · {item.branch} · {item.schedule}
                      </p>

                      {itemPending.length > 0 ? (
                        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#fff1e6] px-3 py-1 text-[11px] font-semibold text-[#ea580c]">
                          <span>
                            {itemPending.length} topshirilmagan · {itemPending[0].due} gacha
                          </span>
                        </div>
                      ) : (
                        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                          <span>Barcha topshiriqlar yopilgan</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-between gap-4 border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:border-none sm:pt-0">
                    <span className="text-xs font-medium text-slate-500">
                      {item.done} / {item.total}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        finished ? openCourseFor(index) : openModuleFor(index)
                      }
                      className="text-xs font-semibold transition hover:underline"
                      style={{ color: item.softText }}
                    >
                      {finished ? 'Sertifikat →' : 'Davom ettirish →'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-4 lg:col-span-4">
          {/* Yaqin darslar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              YAQIN DARSLAR
            </h2>

            <div className="divide-y divide-slate-100">
              {lessons.map((lesson, index) => (
                <div key={`${course.id}-${index}`} className="py-3.5 first:pt-1 last:pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs ${
                        lesson.isToday ? 'font-bold text-slate-800' : 'font-medium text-slate-500'
                      }`}
                    >
                      {lesson.date}
                    </span>
                    {lesson.isToday && (
                      <span className="rounded-full bg-[#e0f2fe] px-2.5 py-0.5 text-[10px] font-bold text-[#0284c7]">
                        bugun
                      </span>
                    )}
                    {lesson.status === 'band qilingan' && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                        band
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-900">{lesson.title}</p>
                    <span className="shrink-0 text-[11px] italic text-slate-400">{lesson.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setModal({ type: 'booking' })}
              className="mt-3 w-full rounded-lg border border-dashed border-[#38bdf8] bg-[#f0f9ff] py-2.5 text-xs font-semibold text-[#0284c7] transition hover:bg-[#e0f2fe]"
            >
              Tyutor bilan dars band qilish
            </button>
          </div>

          {/* Topshiriqlar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">TOPSHIRIQLAR</h2>
              {debt > 0 && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">{debt}</span>
              )}
            </div>

            {debt > 0 ? (
              <>
                <p className="mt-2.5 text-xs font-medium text-slate-500">
                  {due} sanasigacha topshirish kerak.
                </p>
                <button
                  type="button"
                  onClick={() => setModal({ type: 'assignments' })}
                  className="mt-3 w-full rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  Topshiriqlarni ko‘rish
                </button>
              </>
            ) : (
              <p className="mt-2.5 text-xs font-medium text-[#16a34a]">Topshiriqlar yo‘q</p>
            )}
          </div>

          {/* Sertifikat */}
          <button
            type="button"
            onClick={() => setModal({ type: 'certificate' })}
            className="flex w-full items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                isFinished ? 'bg-[#fef3c7] text-[#a16207]' : 'bg-slate-100 text-slate-400'
              }`}
            >
              PDF
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-xs font-bold text-slate-700">{course.title}</h4>
              <p className="mt-0.5 text-xs font-medium text-slate-400">
                {isFinished ? 'sertifikat tayyor' : `sertifikat ${course.total}-darsdan keyin ochiladi`}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Modul oynasi */}
      {modal?.type === 'module' && (
        <Modal
          title={modules[modal.index ?? currentModule].name}
          subtitle={`${course.title} · ${modules[modal.index ?? currentModule].done} / ${modules[modal.index ?? currentModule].total} dars`}
          onClose={() => setModal(null)}
        >
          <div className="space-y-2">
            {Array.from({ length: LESSONS_PER_MODULE }, (_, lessonIndex) => {
              const module = modules[modal.index ?? currentModule]
              const done = lessonIndex < module.done
              const current =
                (modal.index ?? currentModule) === currentModule && lessonIndex === module.done
              const label = lessonIndex + 1 + '-dars'

              return (
                <div
                  key={label}
                  className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 ${
                    current ? 'border-[#38bdf8] bg-[#f0f9ff]' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800">{label}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {done ? 'yakunlangan' : current ? 'davom etmoqda' : 'yopiq'}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!done && !current}
                    onClick={() => {
                      setModal(null)
                      setToast(`${module.name} · ${label} ochildi`)
                    }}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${
                      done || current
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'cursor-not-allowed bg-slate-100 text-slate-400'
                    }`}
                  >
                    {done ? 'Takrorlash' : current ? 'Boshlash' : 'Yopiq'}
                  </button>
                </div>
              )
            })}
          </div>
        </Modal>
      )}

      {/* Butun kurs oynasi */}
      {modal?.type === 'course' && (
        <Modal
          title={`${course.title} — butun kurs`}
          subtitle={`${MODULE_COUNT} modul · ${course.total} dars · ${percent}%`}
          onClose={() => setModal(null)}
        >
          <div className="space-y-2">
            {modalModules.map((module, index) => {
              const modulePercent = Math.round((module.done / module.total) * 100)

              return (
                <button
                  key={module.name}
                  type="button"
                  onClick={() => setModal({ type: 'module', index })}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-left transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="w-16 shrink-0 text-[13px] font-semibold text-slate-800">{module.name}</span>

                  <span className="flex-1">
                    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${modulePercent}%`, backgroundColor: course.accent }}
                      />
                    </span>
                  </span>

                  <span className="w-16 shrink-0 text-right text-[11px] font-medium text-slate-500">
                    {module.done} / {module.total}
                  </span>
                </button>
              )
            })}
          </div>
        </Modal>
      )}

      {/* Topshiriqlar oynasi */}
      {modal?.type === 'assignments' && (
        <Modal
          title="Topshiriqlar"
          subtitle={`${course.title} · ${debt} ta topshirilmagan`}
          onClose={() => setModal(null)}
        >
          {course.assignments.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
              Bu kursda topshiriq yo‘q.
            </p>
          ) : (
            <div className="space-y-2">
              {course.assignments.map((assignment) => {
                const isSubmitted = Boolean(submitted[assignment.id])

                return (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-slate-800">{assignment.title}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {assignment.module} · {assignment.due} gacha
                      </p>
                    </div>

                    {isSubmitted ? (
                      <span className="shrink-0 rounded-lg bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
                        topshirilgan
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => submitAssignment(assignment)}
                        className="shrink-0 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
                      >
                        Topshirish
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Modal>
      )}

      {/* Dars band qilish oynasi */}
      {modal?.type === 'booking' && (
        <Modal title="Tyutor bilan dars" subtitle={`${course.title} · ${course.group}`} onClose={() => setModal(null)}>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sana</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {BOOKING_DATES.map((date) => (
              <button
                key={date}
                type="button"
                onClick={() => setBookingDate(date)}
                className={`rounded-lg border px-3 py-2 text-[11px] font-semibold transition ${
                  bookingDate === date
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {date}
              </button>
            ))}
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">Vaqt</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {BOOKING_TIMES.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setBookingTime(time)}
                className={`rounded-lg border px-3 py-2 text-[11px] font-semibold transition ${
                  bookingTime === time
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setModal(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Bekor qilish
            </button>

            <button
              type="button"
              onClick={bookLesson}
              disabled={!bookingDate || !bookingTime}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                bookingDate && bookingTime
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400'
              }`}
            >
              Band qilish
            </button>
          </div>
        </Modal>
      )}

      {/* Sertifikat oynasi */}
      {modal?.type === 'certificate' && (
        <Modal title="Sertifikat" subtitle={course.title} onClose={() => setModal(null)}>
          {isFinished ? (
            <>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#0369a1]">MARS SPACE</p>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{course.title}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {course.group} · {course.branch}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  {MODULE_COUNT} modul · {course.total} dars · 100%
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Yopish
                </button>

                <button
                  type="button"
                  onClick={downloadCertificate}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  Yuklab olish
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                Sertifikat kursning barcha darslari tugagach ochiladi. Hozir {percent}% yakunlangan.
              </p>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${percent}%`, backgroundColor: course.accent }}
                />
              </div>

              <p className="mt-2 text-[11px] text-slate-400">
                {course.done} / {course.total} dars yakunlangan
              </p>

              <button
                type="button"
                onClick={() => setModal({ type: 'course' })}
                className="mt-4 w-full rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                Modullarni ko‘rish
              </button>
            </>
          )}
        </Modal>
      )}

      {/* Xabar */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-center text-xs font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

export default MyWorks
