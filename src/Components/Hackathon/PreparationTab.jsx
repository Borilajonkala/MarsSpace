import { useMemo, useState } from 'react'
import { PREP_STORAGE_KEY, PREPARATION_ITEMS, RESOURCES, loadJSON, saveJSON } from './hackathonData'

const PreparationTab = () => {
    const [checked, setChecked] = useState(() => loadJSON(PREP_STORAGE_KEY, []))

    const toggle = (id) => {
        setChecked((prev) => {
            const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            saveJSON(PREP_STORAGE_KEY, next)
            return next
        })
    }

    const percent = useMemo(
        () => Math.round((checked.length / PREPARATION_ITEMS.length) * 100),
        [checked]
    )

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <section className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h2 className="text-base font-bold text-gray-900">Tayyorgarlik ro'yxati</h2>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        {checked.length} / {PREPARATION_ITEMS.length}
                    </span>
                </div>

                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-5">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${percent}%` }} />
                </div>

                <div className="space-y-2">
                    {PREPARATION_ITEMS.map((item) => {
                        const isDone = checked.includes(item.id)
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => toggle(item.id)}
                                className={`w-full flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition cursor-pointer ${
                                    isDone
                                        ? 'border-emerald-200 bg-emerald-50/50'
                                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <span
                                    className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition ${
                                        isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 bg-white text-transparent'
                                    }`}
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </span>
                                <span className="min-w-0">
                                    <span className={`block text-sm font-semibold ${isDone ? 'text-emerald-800' : 'text-gray-900'}`}>
                                        {item.title}
                                    </span>
                                    <span className="block text-xs text-gray-400 mt-0.5">{item.hint}</span>
                                </span>
                            </button>
                        )
                    })}
                </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <h2 className="text-base font-bold text-gray-900 mb-4">Foydali materiallar</h2>
                <div className="space-y-2">
                    {RESOURCES.map((resource) => (
                        <div
                            key={resource.id}
                            className="rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 px-4 py-3 transition"
                        >
                            <p className="text-sm font-semibold text-gray-900">{resource.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{resource.meta}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default PreparationTab
