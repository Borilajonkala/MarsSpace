import { useState } from 'react'
import { TOPIC_STORAGE_KEY, TOPICS, loadJSON, saveJSON } from './hackathonData'

const LEVEL_STYLE = {
    Oson: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    "O'rta": 'bg-amber-50 text-amber-700 border-amber-200',
    Qiyin: 'bg-red-50 text-red-600 border-red-200',
}

const TopicsTab = ({ onChangeTab }) => {
    const [selected, setSelected] = useState(() => loadJSON(TOPIC_STORAGE_KEY, null))

    const choose = (id) => {
        const next = selected === id ? null : id
        setSelected(next)
        saveJSON(TOPIC_STORAGE_KEY, next)
    }

    return (
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                    <h2 className="text-base font-bold text-gray-900">Mavzular</h2>
                    <p className="text-xs text-gray-400 mt-1">Bitta mavzuni tanlang. Tanlov saqlanadi va topshirishda ko'rinadi.</p>
                </div>
                {selected && (
                    <button
                        type="button"
                        onClick={() => onChangeTab('submit')}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 transition cursor-pointer"
                    >
                        Tanlangan mavzu bilan davom etish
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {TOPICS.map((topic) => {
                    const isActive = selected === topic.id
                    return (
                        <article
                            key={topic.id}
                            className={`rounded-2xl border p-4 flex flex-col transition ${
                                isActive ? 'border-emerald-400 bg-emerald-50/40 shadow-sm' : 'border-gray-100 hover:border-gray-200'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <span className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xl shadow-2xs">
                                    {topic.emoji}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${LEVEL_STYLE[topic.level] || LEVEL_STYLE.Oson}`}>
                                    {topic.level}
                                </span>
                            </div>

                            <h3 className="text-sm font-bold text-gray-900 mt-3">{topic.title}</h3>
                            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed flex-1">{topic.description}</p>

                            <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium mt-3">
                                <span>{topic.category}</span>
                                <span>{topic.teamSize} · {topic.spots} joy</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => choose(topic.id)}
                                className={`mt-3 w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                    isActive
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                            >
                                {isActive ? '✓ Tanlandi' : 'Mavzuni tanlash'}
                            </button>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}

export default TopicsTab
