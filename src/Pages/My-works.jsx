import { useState } from 'react'

const MyWorks = () => {
  const [active, setActive] = useState(null)

  const modules = [
    { x: 80, y: 145, name: '1-modul', days: '10 / 12 dars', score: 90 },
    { x: 183, y: 140, name: '2-modul', days: '8 / 12 dars', score: 85 },
    { x: 286, y: 134, name: '3-modul', days: '9 / 12 dars', score: 95 },
    { x: 389, y: 127, name: '4-modul', days: '7 / 12 dars', score: 80 },
    { x: 492, y: 121, name: '5-modul', days: '10 / 12 dars', score: 90 },
    { x: 595, y: 115, name: '6-modul', days: '8 / 12 dars', score: 88 },
    { x: 698, y: 108, name: '7-modul', days: '11 / 12 dars', score: 95 },
    { x: 801, y: 102, name: '8-modul', days: '9 / 12 dars', score: 87 },
    { x: 904, y: 97, name: '9-modul', days: '10 / 12 dars', score: 92 },
    { x: 1007, y: 93, name: '10-modul', days: '12 / 12 dars', score: 100 },
  ]

  const lessons = [
    {
      date: '17-noyabr, seshanba · 17:30',
      isToday: true,
      title: 'Category sahifasi',
      status: 'kutilmoqda',
    },
    {
      date: '19-noyabr, payshanba · 17:30',
      isToday: false,
      title: 'Foods + Orders sahifasi',
      status: 'kutilmoqda',
    },
    {
      date: '21-noyabr, shanba · 17:30',
      isToday: false,
      title: 'Loyihani guruhlash',
      status: 'kutilmoqda',
    },
    {
      date: "24-noyabr, seshanba · 17:30",
      isToday: false,
      title: "Cashier (to'lov, buyurtma)",
      status: 'kutilmoqda',
    },
  ]

  const path = modules.reduce((result, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`

    const prev = modules[index - 1]
    const midX = (prev.x + point.x) / 2

    return result + ` C ${midX} ${prev.y}, ${midX} ${point.y}, ${point.x} ${point.y}`
  }, '')

  const radius = 26
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (47 / 100) * circumference

  return (
    <div className="w-full space-y-6">
      <div className="relative min-h-[465px] w-full overflow-hidden rounded-[20px] border border-[#263e66] bg-[#142849] text-white shadow-[0_15px_35px_rgba(0,0,0,0.18)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,#233d67,transparent_60%),linear-gradient(160deg,#1c355c,#101a31)]" />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px,transparent 1px)',
            backgroundSize: '210px 145px',
          }}
        />

        <div className="relative z-10 p-7">
          <div className="flex justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] tracking-widest text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                HOZIR
              </div>

              <h1 className="mt-3 text-[30px] font-bold tracking-tight">
                Loyiha ishi
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-blue-100">
                <span className="rounded-full border border-slate-500/60 bg-white/10 px-3 py-1">
                  [New] Front-End
                </span>

                <span className="rounded-full border border-slate-500/60 bg-white/10 px-3 py-1">
                  MODUL 11 · BLOK 1
                </span>

                <span>62 / 132 dars · 47%</span>

                <a href="#" className="text-cyan-300">
                  Butun kurs →
                </a>
              </div>

              <button className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold shadow-lg shadow-blue-500/20 transition hover:brightness-110">
                📂 Loyiha ishi
              </button>

              <p className="mt-5 text-[11px] text-slate-400">
                O‘tilgan: Loyiha setup
                <span className="ml-2 text-emerald-400">100</span>
                <span className="mx-3">→</span>
                Keyingi: Category sahifasi
              </p>
            </div>

            <div className="text-right">
              <p className="text-[9px] tracking-widest text-cyan-300">
                TOPSHIRILMAGAN
              </p>
              <h2 className="text-3xl font-bold">117</h2>
              <p className="text-[10px] text-slate-400">17 Sent gacha</p>
            </div>
          </div>

          <div className="relative mt-7 h-[205px] w-full">
            <svg
              viewBox="0 0 1100 190"
              preserveAspectRatio="none"
              className="h-full w-full overflow-visible"
            >
              <path
                d={path}
                fill="none"
                stroke="#22c8f5"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {modules.map((item, index) => (
                <g
                  key={index}
                  onMouseEnter={() => setActive(index)}
                  onMouseLeave={() => setActive(null)}
                  className="cursor-pointer"
                >
                  {active === index && (
                    <>
                      <circle
                        cx={item.x}
                        cy={item.y}
                        r="19"
                        fill="#22c8f5"
                        opacity="0.12"
                      />
                      <circle
                        cx={item.x}
                        cy={item.y}
                        r="12"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        opacity="0.5"
                      />
                    </>
                  )}

                  <circle
                    cx={item.x}
                    cy={item.y}
                    r="5.5"
                    fill="#28c8f5"
                    className="transition-all hover:fill-white"
                  />

                  <circle
                    cx={item.x}
                    cy={item.y}
                    r="13"
                    fill="transparent"
                  />
                </g>
              ))}

              <text
                x="1007"
                y="67"
                textAnchor="middle"
                fill="#67e8f9"
                fontSize="10"
              >
                SIZ
              </text>

              <text
                x="1007"
                y="83"
                textAnchor="middle"
                fontSize="27"
              >
                🚀
              </text>
            </svg>

            {active !== null && (
              <div
                className="pointer-events-none absolute z-30 w-[108px] rounded-xl border border-slate-600 bg-[#101b30] p-3 shadow-xl"
                style={{
                  left: `${(modules[active].x / 1100) * 100}%`,
                  top: `${(modules[active].y / 190) * 100}%`,
                  transform: 'translate(-50%, -115%)',
                }}
              >
                <p className="text-[13px] font-semibold">
                  {modules[active].name}
                </p>
                <p className="mt-2 text-[12px] text-slate-300">
                  {modules[active].days}
                </p>
                <p className="mt-1 text-[12px] text-slate-400">
                  o‘rt. ball {modules[active].score}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full bg-slate-700/70" />
      </div>

      <div className="grid grid-cols-1 gap-6 text-[#1e293b] lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            MENING KURSLARIM
          </h2>

          <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center">
            <div className="flex items-center gap-5">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke="#e2e8f0"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke="#4338ca"
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-xs font-bold text-[#4338ca]">
                  47%
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  [New] Front-End
                </h3>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  YB-3158 · YUNUSABAD · Sesh, Pay, Shan 17:30
                </p>

                <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#fff1e6] px-3 py-1 text-[11px] font-semibold text-[#ea580c]">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>117 topshirilmagan · 17 Sesh gacha</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:border-none sm:pt-0">
              <span className="text-xs font-medium text-slate-500">
                62 / 132
              </span>
              <a
                href="#"
                className="mt-0 flex items-center gap-1 text-xs font-semibold text-[#4338ca] transition hover:underline sm:mt-4"
              >
                <span>Butun kurs</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              YAQIN DARSLAR
            </h2>

            <div className="divide-y divide-slate-100">
              {lessons.map((lesson, index) => (
                <div key={index} className="py-3.5 first:pt-1 last:pb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs ${
                        lesson.isToday
                          ? 'font-bold text-slate-800'
                          : 'font-medium text-slate-500'
                      }`}
                    >
                      {lesson.date}
                    </span>
                    {lesson.isToday && (
                      <span className="rounded-full bg-[#e0f2fe] px-2.5 py-0.5 text-[10px] font-bold text-[#0284c7]">
                        bugun
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-900">
                      {lesson.title}
                    </p>
                    <span className="shrink-0 text-[11px] italic text-slate-400">
                      {lesson.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#38bdf8] bg-[#f0f9ff] py-3 text-xs font-semibold text-[#0284c7] transition hover:bg-[#e0f2fe]">
              <span className="text-base leading-none">+</span>
              <span>Tyutor bilan dars band qilish</span>
            </button>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              TOPSHIRIQLAR
            </h2>
            <p className="mt-2.5 text-xs font-medium text-[#16a34a]">
              Topshiriqlar yo'q
            </p>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-[#fde047] bg-[#fefce8] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eab308] text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#a16207]">Front-End</h4>
              <p className="mt-0.5 text-xs font-medium text-[#ca8a04]">
                sertifikat tayyor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyWorks