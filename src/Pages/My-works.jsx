import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Kurslarim sahifasi manzili (App.jsx dagi Route path ga qarab o'zgartirishingiz mumkin)
const COURSE_ROUTE = "/kurslarim";

const moduleNodes = [
  { id: 1, title: "1-modul", lessons: "12 / 12 dars", avgScore: 98, cx: 65, cy: 96 },
  { id: 2, title: "2-modul", lessons: "12 / 12 dars", avgScore: 95, cx: 155, cy: 93 },
  { id: 3, title: "3-modul", lessons: "10 / 12 dars", avgScore: 96, cx: 245, cy: 89 },
  { id: 4, title: "4-modul", lessons: "12 / 12 dars", avgScore: 92, cx: 335, cy: 84 },
  { id: 5, title: "5-modul", lessons: "12 / 12 dars", avgScore: 94, cx: 425, cy: 78 },
  { id: 6, title: "6-modul", lessons: "11 / 12 dars", avgScore: 91, cx: 515, cy: 72 },
  { id: 7, title: "7-modul", lessons: "12 / 12 dars", avgScore: 97, cx: 605, cy: 66 },
  { id: 8, title: "8-modul", lessons: "12 / 12 dars", avgScore: 93, cx: 695, cy: 61 },
  { id: 9, title: "9-modul", lessons: "12 / 12 dars", avgScore: 95, cx: 785, cy: 57 },
  { id: 10, title: "10-modul", lessons: "12 / 12 dars", avgScore: 100, cx: 875, cy: 54 },
  { id: 11, title: "11-modul", lessons: "7 / 12 dars", avgScore: 96, cx: 955, cy: 52, isCurrent: true },
];

const upcomingLessons = [
  {
    date: "21-noyabr, shanba · 17:30",
    title: "Loyihani guruhlash",
    isToday: true,
    status: "kutilmoqda",
  },
  {
    date: "24-noyabr, seshanba · 17:30",
    title: "Cashier (to'lov, buyurtma)",
    isToday: false,
    status: "kutilmoqda",
  },
  {
    date: "26-noyabr, payshanba · 17:30",
    title: "Monitor (tayyor zakazlar ekrani)",
    isToday: false,
    status: "kutilmoqda",
  },
  {
    date: "28-noyabr, shanba · 17:30",
    title: "Imtihon",
    isToday: false,
    status: "kutilmoqda",
  },
];

const quizOptions = ["React.Component", "Class", "Component", "Function"];

const MyWorks = () => {
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState("dashboard"); // "dashboard" | "quiz"
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);

  // Quiz state
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizChecked, setQuizChecked] = useState(false);

  // Tutor modal state
  const [tutorForm, setTutorForm] = useState({
    date: "",
    tutor: "",
    time: "",
    topic: "",
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleGoToFullCourse = () => {
    navigate(COURSE_ROUTE);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setQuizChecked(false);
  };

  const handleCheckQuiz = () => {
    if (!selectedOption) return;
    setQuizChecked(true);
  };

  const handleResetQuiz = () => {
    setSelectedOption(null);
    setQuizChecked(false);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsTutorModalOpen(false);
      setTutorForm({ date: "", tutor: "", time: "", topic: "" });
    }, 1200);
  };

  // QUIZ SAHIFASI
  if (activeView === "quiz") {
    const isCorrect = selectedOption === "React.Component";

    return (
      <div className="min-h-screen bg-[#f4f7fb] text-slate-800 px-4 py-8 sm:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-sm mb-6">
            <button
              type="button"
              onClick={() => {
                handleResetQuiz();
                setActiveView("dashboard");
              }}
              className="text-sky-500 hover:underline font-medium cursor-pointer"
            >
              Darslar
            </button>
            <span className="text-slate-400">›</span>
            <button
              type="button"
              onClick={handleGoToFullCourse}
              className="bg-indigo-100/80 hover:bg-indigo-200/70 text-indigo-600 font-semibold px-2.5 py-0.5 rounded-md transition cursor-pointer"
            >
              [New] Front-End
            </button>
            <span className="text-slate-400">›</span>
            <span className="text-slate-500">11-modul</span>
            <span className="text-slate-400">›</span>
            <span className="font-semibold text-slate-900">
              Foods + Orders sahifasi
            </span>
          </div>

          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
            <span>JOYLASHTIRISH</span>
            <span>1 / 5</span>
          </div>

          {/* 5-segment progress bar */}
          <div className="grid grid-cols-5 gap-2 mb-8">
            <div className="h-1.5 rounded-full bg-sky-500" />
            <div className="h-1.5 rounded-full bg-sky-100" />
            <div className="h-1.5 rounded-full bg-sky-100" />
            <div className="h-1.5 rounded-full bg-sky-100" />
            <div className="h-1.5 rounded-full bg-sky-100" />
          </div>

          {/* Main Quiz Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-10">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6">
              Class komponent yaratish uchun kodni to&apos;ldiring:
            </h2>

            {/* Code Box */}
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-6 font-mono text-sm sm:text-base text-slate-800 leading-relaxed mb-6 overflow-x-auto">
              <div className="flex flex-wrap items-center gap-2">
                <span>class App extends</span>
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className={`min-w-[155px] h-10 px-3 rounded-lg border-2 border-dashed flex items-center justify-center font-semibold transition-all ${
                    selectedOption
                      ? quizChecked
                        ? isCorrect
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-rose-500 bg-rose-50 text-rose-700"
                        : "border-sky-400 bg-white text-slate-900 shadow-xs"
                      : "border-slate-300 bg-white text-transparent"
                  }`}
                >
                  {selectedOption || "placeholder"}
                </button>
                <span>{"{"}</span>
              </div>
              <div className="pl-4 mt-1">render() {"{"}</div>
              <div className="pl-8">return &lt;MyComponent /&gt;;</div>
              <div className="pl-4">{"}"}</div>
              <div>{"}"}</div>
            </div>

            {/* Option Pills */}
            <div className="flex flex-wrap gap-3">
              {quizOptions.map((option) => {
                const isSelected = selectedOption === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className={`px-4 py-2.5 rounded-xl border font-mono text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "border-sky-500 bg-sky-50 text-sky-700 shadow-xs"
                        : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Feedback message */}
            {quizChecked && (
              <div
                className={`mt-5 text-sm font-medium px-4 py-2.5 rounded-xl ${
                  isCorrect
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {isCorrect
                  ? "To'g'ri! React class komponentlari React.Component dan meros oladi."
                  : "Noto'g'ri javob. Qaytadan urinib ko'ring."}
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={() => {
                handleResetQuiz();
                setActiveView("dashboard");
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
            >
              ← Orqaga
            </button>

            <button
              type="button"
              disabled={!selectedOption}
              onClick={handleCheckQuiz}
              className={`px-12 py-3 rounded-xl text-sm font-bold tracking-wide transition cursor-pointer ${
                selectedOption
                  ? "bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
                  : "bg-[#d5dde8] text-white cursor-not-allowed"
              }`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ASOSIY DASHBOARD
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* DARK HERO BANNER */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[#06152d] via-[#091d3e] to-[#0c254d] text-white shadow-lg border border-slate-800/80">
          {/* Dekorativ yulduzchalar */}
          <span className="pointer-events-none absolute top-12 left-[58%] w-1 h-1 rounded-full bg-white/40" />
          <span className="pointer-events-none absolute top-28 right-[11%] w-1 h-1 rounded-full bg-white/40" />
          <span className="pointer-events-none absolute bottom-24 left-[36%] w-0.5 h-0.5 rounded-full bg-white/30" />
          <span className="pointer-events-none absolute bottom-32 right-[28%] w-0.5 h-0.5 rounded-full bg-white/30" />

          <div className="p-6 sm:p-8 pb-4">
            {/* Top Row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-sky-300 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>HOZIR</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Foods + Orders sahifasi
                </h1>

                {/* Badges & Progress Info */}
                <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs sm:text-sm">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-200 font-medium">
                    [New] Front-End
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-200 font-medium">
                    MODUL 11 · BLOK 2
                  </span>
                  <span className="text-slate-300 ml-1">
                    67 / 132 dars · 51%
                  </span>
                  <button
                    type="button"
                    onClick={handleGoToFullCourse}
                    className="text-sky-400 hover:text-sky-300 hover:underline font-medium transition cursor-pointer"
                  >
                    Butun kurs →
                  </button>
                </div>
              </div>

              {/* Right Counter */}
              <div className="text-right shrink-0">
                <div className="text-[11px] font-bold tracking-wider uppercase text-sky-300/80">
                  TOPSHIRILMAGAN
                </div>
                <div className="text-3xl sm:text-4xl font-bold leading-tight mt-0.5">
                  119
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  21 Shan gacha
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setActiveView("quiz")}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#1da1f2] hover:bg-[#1991db] text-white font-semibold text-sm shadow-md shadow-sky-500/20 transition cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Quizni boshlash</span>
              </button>

              <button
                type="button"
                onClick={handleGoToFullCourse}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm transition cursor-pointer"
              >
                <svg
                  className="w-4 h-4 fill-current text-slate-200"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                </svg>
                <span>Vazifa</span>
              </button>
            </div>

            {/* Prev / Next Lesson Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-400 mt-5">
              <span>
                O&apos;tilgan:{" "}
                <span className="text-slate-200">Category sahifasi</span>{" "}
                <span className="text-emerald-400 font-semibold">100</span>
              </span>
              <span className="mx-1">→</span>
              <span>
                Keyingi:{" "}
                <span className="text-slate-200">Loyihani guruhlash</span>
              </span>
            </div>

            {/* SVG Growth Curve + Interactive Hover Tooltips */}
            <div className="relative mt-4 pt-8 pb-2">
              {/* Hover Tooltip Card (2-rasmdagi qora karta) */}
              {hoveredNode && (
                <div
                  style={{
                    left: `${(hoveredNode.cx / 1000) * 100}%`,
                    top: `${(hoveredNode.cy / 115) * 100}%`,
                  }}
                  className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-[122%] w-36 rounded-xl bg-[#0b1930]/95 border border-slate-600/60 px-3.5 py-2.5 shadow-xl backdrop-blur-xs transition-all duration-150"
                >
                  <div className="text-sm font-bold text-white">
                    {hoveredNode.title}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    {hoveredNode.lessons}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    o&apos;rt. ball {hoveredNode.avgScore}
                  </div>
                </div>
              )}

              <svg
                viewBox="0 0 1000 115"
                className="w-full h-24 overflow-visible"
                preserveAspectRatio="none"
              >
                <path
                  d="M 65 96 Q 350 90, 560 69 T 955 52"
                  fill="none"
                  stroke="#1da1f2"
                  strokeWidth="2.5"
                />

                {moduleNodes.map((node) => {
                  const isHovered = hoveredNode?.id === node.id;
                  return (
                    <g
                      key={node.id}
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setHoveredNode(node)}
                      className="cursor-pointer"
                    >
                      {/* Kattaroq ko'rinmas hover zonasi (qulay ushlash uchun) */}
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="18"
                        fill="transparent"
                      />

                      {/* Hover yoki joriy nuqta atrofidagi shaffof halqa */}
                      {(isHovered || node.isCurrent) && (
                        <circle
                          cx={node.cx}
                          cy={node.cy}
                          r={isHovered ? "12" : "9"}
                          fill="#38bdf8"
                          fillOpacity={isHovered ? "0.35" : "0.22"}
                        />
                      )}

                      {/* Asosiy nuqta */}
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r={isHovered ? "6.5" : "5"}
                        fill={node.isCurrent ? "#0b1f3f" : "#1da1f2"}
                        stroke={node.isCurrent || isHovered ? "#38bdf8" : "none"}
                        strokeWidth={node.isCurrent || isHovered ? "2.5" : "0"}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* SIZ + Rocket */}
              <div className="pointer-events-none absolute right-[2.8%] sm:right-[3.5%] top-2 flex flex-col items-center select-none">
                <span className="text-[10px] font-bold tracking-wider text-sky-300 uppercase">
                  SIZ
                </span>
                <span className="text-xl leading-none mt-0.5">🚀</span>
              </div>
            </div>
          </div>

          {/* Bottom Weekly Bar */}
          <div className="bg-[#040e1f]/80 border-t border-white/10 rounded-b-2xl px-6 sm:px-8 py-3 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-white">Bu hafta 1 / 2</span>
            <div className="w-28 h-1.5 rounded-full bg-slate-700 overflow-hidden">
              <div className="w-1/2 h-full rounded-full bg-emerald-400" />
            </div>
            <span className="text-slate-300">Yana 1 ta — va hafta toza</span>
          </div>
        </div>

        {/* MENING KURSLARIM & YAQIN DARSLAR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8">
            <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-3">
              MENING KURSLARIM
            </h2>

            <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Circular 51% Progress */}
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="5"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 22}
                      strokeDashoffset={2 * Math.PI * 22 * (1 - 0.51)}
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-indigo-600">
                    51%
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    [New] Front-End
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    YB-3158 · YUNUSABAD · Sesh, Pay, Shan 17:30
                  </p>
                  <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-medium text-amber-700">
                    <span>🕒</span>
                    <span>119 topshirilmagan · 21 Shan gacha</span>
                  </div>
                </div>
              </div>

              <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <span className="text-sm font-medium text-slate-500">
                  67 / 132
                </span>
                <button
                  type="button"
                  onClick={handleGoToFullCourse}
                  className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline mt-1 cursor-pointer"
                >
                  Butun kurs →
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* YAQIN DARSLAR Card */}
            <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs p-5">
              <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-3">
                YAQIN DARSLAR
              </h2>

              <div className="divide-y divide-slate-100">
                {upcomingLessons.map((lesson, idx) => (
                  <div
                    key={idx}
                    className="py-3 first:pt-1 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{lesson.date}</span>
                        {lesson.isToday && (
                          <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-600 font-semibold text-[11px]">
                            bugun
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {lesson.title}
                      </div>
                    </div>
                    <span className="text-xs italic text-slate-400 shrink-0">
                      {lesson.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* + Tyutor bilan dars band qilish */}
              <button
                type="button"
                onClick={() => setIsTutorModalOpen(true)}
                className="mt-4 w-full py-2.5 px-4 rounded-xl border border-dashed border-sky-400 bg-sky-50/60 hover:bg-sky-100/70 text-sky-600 font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                + Tyutor bilan dars band qilish
              </button>
            </div>

            {/* TOPSHIRIQLAR Card */}
            <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs p-5">
              <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-2">
                TOPSHIRIQLAR
              </h2>
              <p className="text-sm font-medium text-emerald-600">
                Topshiriqlar yo&apos;q
              </p>
            </div>

            {/* Sertifikat Tayyor Card */}
            <div className="bg-[#fffdf5] rounded-2xl border border-amber-300 shadow-xs p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-white flex items-center justify-center font-bold shrink-0">
                🏅
              </div>
              <div>
                <div className="text-xs font-bold text-amber-800">
                  Front-End
                </div>
                <div className="text-xs text-amber-700">sertifikat tayyor</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* YORDAMCHI O'QITUVCHI MODAL */}
      {isTutorModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-[1px] flex items-center justify-center p-4"
          onClick={() => setIsTutorModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-7 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="w-8" />
              <h3 className="text-lg font-bold text-slate-900 text-center">
                Yordamchi o&apos;qituvchi
              </h3>
              <button
                type="button"
                onClick={() => setIsTutorModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-lg leading-none transition cursor-pointer"
                aria-label="Yopish"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="mt-5 space-y-3.5">
              <div className="relative">
                <select
                  value={tutorForm.date}
                  onChange={(e) =>
                    setTutorForm({ ...tutorForm, date: e.target.value })
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-sky-400 focus:outline-none"
                >
                  <option value="">Sanani tanlash</option>
                  <option value="21-noyabr">21-noyabr, shanba</option>
                  <option value="23-noyabr">23-noyabr, dushanba</option>
                  <option value="24-noyabr">24-noyabr, seshanba</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  ▲
                </span>
              </div>

              <div className="relative">
                <select
                  value={tutorForm.tutor}
                  onChange={(e) =>
                    setTutorForm({ ...tutorForm, tutor: e.target.value })
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-sky-400 focus:outline-none"
                >
                  <option value="">Tutorni tanlash</option>
                  <option value="azizbek">Azizbek (Front-End)</option>
                  <option value="jasur">Jasur (React / JS)</option>
                  <option value="madina">Madina (HTML / CSS / Tailwind)</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  ▲
                </span>
              </div>

              <div className="relative">
                <select
                  value={tutorForm.time}
                  onChange={(e) =>
                    setTutorForm({ ...tutorForm, time: e.target.value })
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-sky-400 focus:outline-none"
                >
                  <option value="">Vaqtni tanlash</option>
                  <option value="14:00">14:00 - 14:30</option>
                  <option value="15:30">15:30 - 16:00</option>
                  <option value="17:00">17:00 - 17:30</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  ▲
                </span>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  maxLength={255}
                  placeholder="Mavzuni yozish"
                  value={tutorForm.topic}
                  onChange={(e) =>
                    setTutorForm({ ...tutorForm, topic: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pb-7 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none resize-none"
                />
                <span className="absolute right-3.5 bottom-2.5 text-xs text-slate-400">
                  {tutorForm.topic.length} / 255
                </span>
              </div>

              {bookingSuccess && (
                <div className="text-center text-xs font-semibold text-emerald-700 bg-emerald-50 py-2 rounded-xl">
                  Qo&apos;shimcha darsga muvaffaqiyatli yozildingiz!
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#b9e5a8] hover:bg-[#a7dc93] text-white font-bold text-sm transition cursor-pointer mt-2"
              >
                Qo&apos;shimcha darsga yozilish
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWorks;