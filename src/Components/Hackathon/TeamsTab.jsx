import { useState } from 'react'
import { MEMBERSHIP_STORAGE_KEY, TEAMS, loadJSON, saveJSON } from './hackathonData'

const TeamsTab = () => {
    const [joined, setJoined] = useState(() => loadJSON(MEMBERSHIP_STORAGE_KEY, []))

    const toggleJoin = (id) => {
        setJoined((prev) => {
            const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            saveJSON(MEMBERSHIP_STORAGE_KEY, next)
            return next
        })
    }

    return (
        <div className="space-y-5">
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Ro'yxatdan o'tgan jamoalar</h2>
                        <p className="text-xs text-gray-400 mt-1">Bo'sh joyi bor jamoaga qo'shilib, mavzuni birgalikda tanlang.</p>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                        {TEAMS.length} jamoa
                    </span>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TEAMS.map((team) => {
                        const isMember = joined.includes(team.id)
                        const isFull = team.members.length >= team.max
                        const free = Math.max(team.max - team.members.length, 0)

                        return (
                            <article key={team.id} className="rounded-2xl border border-gray-100 p-4 hover:shadow-md transition">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">{team.name}</h3>
                                        <p className="text-[11px] text-gray-400 mt-0.5">{team.project}</p>
                                    </div>
                                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                        free === 0
                                            ? 'bg-red-50 text-red-600 border-red-200'
                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    }`}>
                                        {free === 0 ? "To'la" : `${free} joy bor`}
                                    </span>
                                </div>

                                <div className="mt-3 flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {team.members.slice(0, 4).map((member) => (
                                            <span
                                                key={member}
                                                title={member}
                                                className="w-7 h-7 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white"
                                            >
                                                {member.charAt(0)}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-[11px] text-gray-500 font-medium">
                                        {team.members.length} / {team.max} a'zo · {team.branch}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    disabled={isFull && !isMember}
                                    onClick={() => toggleJoin(team.id)}
                                    className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                        isMember
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                    }`}
                                >
                                    {isMember ? "Jamoadan chiqish" : isFull ? "Bo'sh joy yo'q" : "Jamoaga qo'shilish"}
                                </button>
                            </article>
                        )
                    })}
                </div>
            </section>

            <section className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-5">
                <h3 className="text-sm font-bold text-gray-900">Yakka ishtirokchilar</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-2xl">
                    Jamoangiz yo'qmi? Yakka holda ro'yxatdan o'tib, xakaton kuni tashkilotchilar yordamida jamoa bilan
                    birlashtirilasiz. Buning uchun "Takliflar" bo'limidagi formadan foydalaning.
                </p>
            </section>
        </div>
    )
}

export default TeamsTab
