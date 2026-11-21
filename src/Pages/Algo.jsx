import { useEffect, useState } from "react";
import dbData from "../../db.json";

const companies = dbData.companies;
const QUESTIONS_PER_TEST = 4;
const RESULTS_API = "http://localhost:3000/algoResults";

const getTestQuestions = (company, taskIndex) => {
    const bank = company.questions ?? [];
    if (bank.length === 0) return [];

    const count = Math.min(QUESTIONS_PER_TEST, bank.length);
    const offset = taskIndex % bank.length;

    return Array.from({ length: count }, (_, index) => bank[(offset + index) % bank.length]);
};

const Algo = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [activeTest, setActiveTest] = useState(null);
    const [results, setResults] = useState(() => dbData.algoResults ?? []);
    const [saveStatus, setSaveStatus] = useState("idle");
    const selected = companies.find((company) => company.id === selectedId);

    useEffect(() => {
        let off = false;

        fetch(RESULTS_API)
            .then((response) => (response.ok ? response.json() : Promise.reject(new Error("json-server ishlamayapti"))))
            .then((data) => {
                if (!off && Array.isArray(data)) setResults(data);
            })
            .catch(() => { });

        return () => {
            off = true;
        };
    }, []);

    // Har bir masala uchun eng yaxshi natija
    const bestResults = results.reduce((acc, result) => {
        const key = `${result.companyId}-${result.taskIndex}`;
        if (!acc[key] || result.percent > acc[key].percent) acc[key] = result;
        return acc;
    }, {});

    const getTaskPercent = (companyId, taskIndex) => bestResults[`${companyId}-${taskIndex}`]?.percent ?? 0;

    const getCompanyPercent = (company) => {
        if (company.tasks.length === 0) return 0;
        const total = company.tasks.reduce((sum, _, index) => sum + getTaskPercent(company.id, index), 0);
        return Math.round(total / company.tasks.length);
    };

    const handleOpen = (id) => {
        setSelectedId(id);
        setActiveTest(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleBack = () => {
        setActiveTest(null);
        setSelectedId(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const startTest = (taskIndex) => {
        const questions = getTestQuestions(selected, taskIndex);
        if (questions.length === 0) return;

        setSaveStatus("idle");
        setActiveTest({ taskIndex, questions, current: 0, selected: null, score: 0, answers: [], finished: false });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const chooseAnswer = (optionIndex) => {
        setActiveTest((prev) => {
            if (!prev || prev.selected !== null) return prev;

            const isCorrect = optionIndex === prev.questions[prev.current].answer;
            return {
                ...prev,
                selected: optionIndex,
                score: prev.score + (isCorrect ? 1 : 0),
                answers: [...prev.answers, optionIndex],
            };
        });
    };

    const saveResult = async (test) => {
        const percent = Math.round((test.score / test.questions.length) * 100);

        const record = {
            id: `${selected.id}-${test.taskIndex}-${Date.now()}`,
            companyId: selected.id,
            companyName: selected.name,
            taskIndex: test.taskIndex,
            taskTitle: selected.tasks[test.taskIndex],
            score: test.score,
            total: test.questions.length,
            percent,
            answers: test.questions.map((question, index) => {
                const chosenIndex = test.answers[index];
                return {
                    question: question.question,
                    chosen: question.options[chosenIndex],
                    correct: question.options[question.answer],
                    isCorrect: chosenIndex === question.answer,
                };
            }),
            createdAt: new Date().toISOString(),
        };

        setResults((prev) => [...prev, record]);
        setSaveStatus("saving");

        try {
            const response = await fetch(RESULTS_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(record),
            });
            if (!response.ok) throw new Error("Natija saqlanmadi");
            setSaveStatus("saved");
        } catch {
            setSaveStatus("error");
        }
    };

    const nextQuestion = () => {
        if (!activeTest || activeTest.selected === null) return;

        if (activeTest.current + 1 >= activeTest.questions.length) {
            const finishedTest = { ...activeTest, finished: true };
            setActiveTest(finishedTest);
            saveResult(finishedTest);
            return;
        }

        setActiveTest((prev) => ({ ...prev, current: prev.current + 1, selected: null }));
    };

    if (selected && activeTest) {
        const taskTitle = selected.tasks[activeTest.taskIndex];

        if (activeTest.finished) {
            const percent = Math.round((activeTest.score / activeTest.questions.length) * 100);

            return (
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button type="button" onClick={() => setActiveTest(null)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors cursor-pointer">
                        &larr; Masalalar ro'yxatiga qaytish
                    </button>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
                        <p className="text-sm text-slate-500">{selected.name} · {taskTitle}</p>
                        <h2 className="text-2xl font-normal text-slate-900 mt-2">Test yakunlandi</h2>
                        <p className="text-5xl font-bold text-[#4b9fd3] mt-6">
                            {activeTest.score} / {activeTest.questions.length}
                        </p>
                        <p className="text-slate-600 mt-2">To'g'ri javoblar: {percent}%</p>
                        <p className="text-xs mt-3 text-slate-400">
                            {saveStatus === "saved" && "Javoblar db.json ga saqlandi ✓"}
                            {saveStatus === "saving" && "Saqlanmoqda..."}
                            {saveStatus === "error" && "Saqlanmadi: json-server ishlamayapti (npm run server)"}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                            <button type="button" onClick={() => startTest(activeTest.taskIndex)} className="bg-[#e6f4fd] hover:bg-[#d0eafb] text-[#4b9fd3] text-sm font-medium px-6 py-2.5 rounded-md transition-colors cursor-pointer">
                                Yana ishlash
                            </button>
                            <button type="button" onClick={() => setActiveTest(null)} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-6 py-2.5 rounded-md transition-colors cursor-pointer">
                                Masalalar ro'yxatiga qaytish
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        const question = activeTest.questions[activeTest.current];
        const answered = activeTest.selected !== null;

        const optionClass = (index) => {
            const base = "w-full text-left px-5 py-3.5 rounded-lg border text-sm transition-colors";
            if (!answered) return `${base} border-slate-200 hover:border-[#4b9fd3] hover:bg-[#f4fbff] cursor-pointer`;
            if (index === question.answer) return `${base} border-emerald-300 bg-emerald-50 text-emerald-800`;
            if (index === activeTest.selected) return `${base} border-rose-300 bg-rose-50 text-rose-700`;
            return `${base} border-slate-100 text-slate-400`;
        };

        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button type="button" onClick={() => setActiveTest(null)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors cursor-pointer">
                    &larr; Masalalar ro'yxatiga qaytish
                </button>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-4 px-8 py-6 border-b border-slate-100">
                        <img src={selected.logo} alt={selected.name} className={`w-12 h-12 shrink-0 ${selected.logoClass}`} />
                        <div className="flex flex-col">
                            <p className="text-xs uppercase tracking-wide text-slate-400">{selected.name} · Test</p>
                            <h2 className="text-lg font-medium text-slate-900">{taskTitle}</h2>
                        </div>
                    </div>
                    <div className="px-8 py-6">
                        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                            <span>Savol {activeTest.current + 1} / {activeTest.questions.length}</span>
                            <span>Ball: {activeTest.score}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                            <div className="h-full bg-[#4b9fd3] transition-all duration-300" style={{ width: `${((activeTest.current + (answered ? 1 : 0)) / activeTest.questions.length) * 100}%` }} />
                        </div>
                        <h3 className="text-base font-medium text-slate-900 mb-5">{question.question}</h3>
                        <div className="flex flex-col gap-3">
                            {question.options.map((option, index) => (
                                <button key={option} type="button" onClick={() => chooseAnswer(index)} disabled={answered} className={optionClass(index)}>
                                    <span className="font-mono text-xs text-slate-400 mr-2">{String.fromCharCode(65 + index)}.</span>
                                    {option}
                                </button>
                            ))}
                        </div>

                        {answered && (
                            <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
                                <p className={`text-sm font-medium ${activeTest.selected === question.answer ? "text-emerald-600" : "text-rose-600"}`}>
                                    {activeTest.selected === question.answer
                                        ? "To'g'ri javob!"
                                        : `Noto'g'ri. To'g'ri javob: ${String.fromCharCode(65 + question.answer)}`}
                                </p>
                                <button type="button" onClick={nextQuestion} className="bg-[#e6f4fd] hover:bg-[#d0eafb] text-[#4b9fd3] text-sm font-medium px-6 py-2.5 rounded-md transition-colors cursor-pointer">
                                    {activeTest.current + 1 >= activeTest.questions.length ? "Natijani ko'rish" : "Keyingi savol"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (selected) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button type="button" onClick={handleBack} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors cursor-pointer">
                    &larr; Kompaniyalar ro'yxatiga qaytish
                </button>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-6 px-8 py-6 border-b border-slate-100">
                        <img src={selected.logo} alt={selected.name} className={`w-20 h-20 shrink-0 ${selected.logoClass}`} />
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-normal text-slate-900">{selected.name}</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {selected.tasks.length} ta masala | {getCompanyPercent(selected)}% bajarildi
                            </p>
                        </div>
                    </div>

                    <ul className="divide-y divide-slate-100">
                        {selected.tasks.map((task, index) => {
                            const taskResult = bestResults[`${selected.id}-${index}`];

                            return (
                                <li
                                    key={task}
                                    className="flex items-center justify-between gap-4 px-8 py-5 hover:bg-slate-50/70 transition-colors"
                                >
                                    <span className="text-base text-slate-800">
                                        {index + 1}. {task}
                                    </span>
                                    <div className="flex items-center gap-4 shrink-0">
                                        {taskResult && (
                                            <span className={`text-sm font-medium ${taskResult.percent >= 60 ? "text-emerald-600" : "text-amber-600"}`}>
                                                {taskResult.percent}%
                                            </span>
                                        )}
                                        <button type="button" onClick={() => startTest(index)} className="w-[120px] text-center bg-[#e6f4fd] hover:bg-[#d0eafb] text-[#4b9fd3] text-sm font-medium px-6 py-2.5 rounded-md transition-colors cursor-pointer">
                                            Start
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className='text-2xl font-normal text-slate-900 tracking-tight'>
                TOP Kompaniyalar
            </h1>
            <img className="mt-[20px]" src="https://space.marsit.uz/img/editor-ads.08b4da43.webp" alt="" />
            <section className="flex items-center justify-between mt-[30px] gap-10 bg-[white] p-[20px] rounded-lg">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Olimpiada masalalari — mars.algo</h2>
                    <p className="text-base text-slate-700 leading-relaxed mb-3">Bu yerda mashhur kompaniyalar mahsulotlari asosidagi masalalarni yechasan. mars.algoʼda esa olimpiada masalalari: divizionlar, haftalik reyting, oylik musobaqalar.</p>
                    <p className="text-sm text-slate-500">9–16 avgust kunlari Toshkentda IOI 2026 — informatika boʻyicha xalqaro olimpiada — Oʻzbekiston tarixida birinchi marta oʻtadi.</p>
                </div>
                <div className="flex items-center gap-[10px]">
                    <a href="https://robocontest.uz/tasks" className=" w-[350px]  text-center bg-[#F26522] hover:bg-[#d95618] text-white font-semibold text-base px-7 py-3.5 rounded-lg transition-colors duration-200">
                        <span>Masalalarni yechishni boshlash</span>
                        <span> &rarr; </span>
                    </a>
                </div>
            </section>
            <section className="w-full bg-slate-50 py-8">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="shrink-0">
                                <img src={companies[0].logo} alt="Amazon" className="w-20 h-20 rounded-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-medium text-slate-900">Amazon</h2>
                                <p className="text-sm text-slate-500 mt-1">{companies[0].tasks.length} ta masala | {getCompanyPercent(companies[0])}% bajarildi</p>
                                <button type="button" onClick={() => handleOpen(companies[0].id)} className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 text-base font-normal mt-3 transition-colors cursor-pointer" >   Kirish &gt;
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="shrink-0">
                                <img src={companies[1].logo} alt="Netflix" className="w-20 h-20 rounded-full object-cover border border-slate-100" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-medium text-slate-900">Netflix</h2>
                                <p className="text-sm text-slate-500 mt-1">{companies[1].tasks.length} ta masala | {getCompanyPercent(companies[1])}% bajarildi</p>
                                <button type="button" onClick={() => handleOpen(companies[1].id)} className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 text-base font-normal mt-3 transition-colors cursor-pointer" >   Kirish &gt;
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="shrink-0">
                                <img src={companies[2].logo} alt="Google" className="w-20 h-20 rounded-full object-contain p-2 bg-slate-50" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-medium text-slate-900">Google</h2>
                                <p className="text-sm text-slate-500 mt-1">{companies[2].tasks.length} ta masala | {getCompanyPercent(companies[2])}% bajarildi</p>
                                <button type="button" onClick={() => handleOpen(companies[2].id)} className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 text-base font-normal mt-3 transition-colors cursor-pointer" >   Kirish &gt;
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="shrink-0">
                                <img src={companies[3].logo} alt="Facebook" className="w-20 h-20 rounded-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-medium text-slate-900 capitalize">{companies[3].name}</h2>
                                <p className="text-sm text-slate-500 mt-1">{companies[3].tasks.length} ta masala | {getCompanyPercent(companies[3])}% bajarildi</p>
                                <button type="button" onClick={() => handleOpen(companies[3].id)} className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 text-base font-normal mt-3 transition-colors cursor-pointer" >   Kirish &gt;
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}
export default Algo
