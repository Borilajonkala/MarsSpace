import NextSteps from './NextSteps'
import QuickActions from './QuickActions'

const HomeTab = ({ onChangeTab }) => {
    return (
        <div className="space-y-5">
            {/* Natijalar banneri */}
            <section className="rounded-3xl bg-[linear-gradient(115deg,#141a2e_0%,#1b2340_60%,#2a2740_100%)] shadow-lg shadow-slate-900/10 px-5 sm:px-7 py-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-slate-400">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="4" rx="2" />
                            <line x1="16" x2="16" y1="2" y2="6" />
                            <line x1="8" x2="8" y1="2" y2="6" />
                            <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                        04.10.2026
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white mt-1.5 uppercase">
                        Natijalar e'lon qilindi
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={() => onChangeTab('results')}
                    className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full bg-[#f6c453] hover:bg-[#f0b93b] text-[#1f2430] text-sm font-bold px-5 py-3 transition active:scale-[0.99] cursor-pointer"
                >
                    Natijalarni ko'rish
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" x2="19" y1="12" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </button>
            </section>

            <NextSteps onChangeTab={onChangeTab} />

            <QuickActions onChangeTab={onChangeTab} />
        </div>
    )
}

export default HomeTab
