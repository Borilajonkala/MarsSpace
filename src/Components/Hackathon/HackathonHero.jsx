import { HACKATHON, TABS } from './hackathonData'

const HackathonHero = ({ activeTab, onChangeTab }) => {
    return (
        <section className="rounded-3xl bg-[linear-gradient(120deg,#0e1020_0%,#151a30_55%,#1d2542_100%)] shadow-xl shadow-slate-900/20 overflow-hidden">
            {/* Yuqori qism */}
            <div className="px-5 sm:px-8 pt-6 sm:pt-7 pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-wide text-white leading-tight">
                            {HACKATHON.hero.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span className="text-sm font-black tracking-[0.2em] text-[#6ee7a8]">{HACKATHON.hero.year}</span>
                            <span className="inline-flex items-center rounded-lg border border-cyan-400/40 bg-cyan-400/5 px-3 py-1 text-[10px] sm:text-[11px] font-bold tracking-wider text-cyan-300">
                                {HACKATHON.hero.badge}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        title="Xabarlar"
                        className="shrink-0 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 flex items-center justify-center transition cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Tablar */}
            <div className="px-2 sm:px-4 overflow-x-auto">
                <div className="flex items-center gap-1 min-w-max pb-1">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => onChangeTab(tab.id)}
                                className={`relative px-3 sm:px-4 py-3 text-[11px] sm:text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                {tab.label}
                                <span
                                    className={`absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full transition ${
                                        isActive ? 'bg-emerald-400' : 'bg-transparent'
                                    }`}
                                />
                            </button>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default HackathonHero
