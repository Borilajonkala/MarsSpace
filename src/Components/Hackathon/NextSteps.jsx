import { STEPS } from './hackathonData'

const NextSteps = ({ onChangeTab }) => {
    return (
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Nima qilish kerak</h2>

            <div className="space-y-3">
                {STEPS.map((step) => (
                    <button
                        key={step.id}
                        type="button"
                        onClick={() => onChangeTab(step.tab)}
                        className="w-full flex items-center gap-4 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40 px-4 sm:px-5 py-4 text-left transition cursor-pointer group"
                    >
                        <span className="w-9 h-9 shrink-0 rounded-full bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-700 transition">
                            {step.id}
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-sm sm:text-[15px] font-bold text-gray-900">{step.title}</span>
                            <span className="block text-xs text-gray-400 mt-0.5 truncate">{step.hint}</span>
                        </span>
                        <svg className="w-4 h-4 shrink-0 text-gray-300 group-hover:text-emerald-600 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                ))}
            </div>
        </section>
    )
}

export default NextSteps
