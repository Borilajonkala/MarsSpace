import { HACKATHON, RESULTS } from './hackathonData'

const MEDAL = {
    1: 'bg-[#f6c453]/20 text-[#a9791a] border-[#f6c453]',
    2: 'bg-slate-100 text-slate-600 border-slate-300',
    3: 'bg-orange-50 text-orange-700 border-orange-200',
}

const ResultsTab = () => {
    return (
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                    <h2 className="text-base font-bold text-gray-900">Natijalar</h2>
                    <p className="text-xs text-gray-400 mt-1">{HACKATHON.resultsSubtitle}</p>
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold px-3 py-1">
                    E'lon qilindi
                </span>
            </div>

            {/* G'oliblar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {RESULTS.slice(0, 3).map((result) => (
                    <div
                        key={result.place}
                        className={`rounded-2xl border p-4 ${
                            result.place === 1
                                ? 'border-[#f6c453] bg-[#fffdf5]'
                                : 'border-gray-100 bg-white'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className={`w-8 h-8 rounded-full border text-xs font-black flex items-center justify-center ${MEDAL[result.place]}`}>
                                {result.place}
                            </span>
                            <span className="text-[11px] font-bold text-gray-400">{result.score} ball</span>
                        </div>
                        <h3 className="text-sm font-black text-gray-900 mt-3">{result.team}</h3>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{result.project}</p>
                        <p className="text-xs font-semibold text-gray-700 mt-3">{result.prize}</p>
                    </div>
                ))}
            </div>

            {/* To'liq jadval */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[560px]">
                    <thead>
                        <tr className="text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
                            <th className="py-2.5 pr-3 font-bold">O'rin</th>
                            <th className="py-2.5 pr-3 font-bold">Jamoa</th>
                            <th className="py-2.5 pr-3 font-bold">Loyiha</th>
                            <th className="py-2.5 pr-3 font-bold">Ball</th>
                            <th className="py-2.5 font-bold">Sovrin</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {RESULTS.map((result) => (
                            <tr key={result.place} className="hover:bg-gray-50/60 transition">
                                <td className="py-3 pr-3 font-black text-gray-700">{result.place}</td>
                                <td className="py-3 pr-3 font-semibold text-gray-900">{result.team}</td>
                                <td className="py-3 pr-3 text-gray-500">{result.project}</td>
                                <td className="py-3 pr-3 font-bold text-emerald-700">{result.score}</td>
                                <td className="py-3 text-gray-600">{result.prize}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default ResultsTab
