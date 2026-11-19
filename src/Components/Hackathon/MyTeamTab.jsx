import { useState } from 'react'
import dbData from '../../../db.json'
import { TEAM_STORAGE_KEY, loadJSON, saveJSON } from './hackathonData'

const MAX_MEMBERS = 4

const MyTeamTab = () => {
    const [team, setTeam] = useState(() => loadJSON(TEAM_STORAGE_KEY, null))
    const [teamName, setTeamName] = useState('')
    const [project, setProject] = useState('')
    const [copied, setCopied] = useState(false)

    const classmates = (dbData.group?.students || []).filter((student) => !student.isCurrent)

    const saveTeam = (next) => {
        setTeam(next)
        saveJSON(TEAM_STORAGE_KEY, next)
    }

    const createTeam = (e) => {
        e.preventDefault()
        if (!teamName.trim()) return
        const code = `MH26-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
        saveTeam({
            name: teamName.trim(),
            project: project.trim() || 'Mavzu tanlanmagan',
            code,
            members: ['Siz'],
        })
    }

    const toggleMember = (name) => {
        if (!team) return
        const has = team.members.includes(name)
        if (!has && team.members.length >= MAX_MEMBERS) return
        saveTeam({
            ...team,
            members: has ? team.members.filter((m) => m !== name) : [...team.members, name],
        })
    }

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(team.code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            setCopied(false)
        }
    }

    if (!team) {
        return (
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7 max-w-2xl">
                <h2 className="text-base font-bold text-gray-900">Jamoa tuzish</h2>
                <p className="text-xs text-gray-400 mt-1 mb-5">
                    Jamoa nomini kiriting va keyin guruhdoshlaringizni taklif qiling. Jamoa 2-4 kishidan iborat bo'ladi.
                </p>

                <form onSubmit={createTeam} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Jamoa nomi</label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Masalan: Nova Coders"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Loyiha mavzusi (ixtiyoriy)</label>
                        <input
                            type="text"
                            value={project}
                            onChange={(e) => setProject(e.target.value)}
                            placeholder="Masalan: AI yordamchi chatbot"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!teamName.trim()}
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-5 py-3 transition cursor-pointer"
                    >
                        Jamoa tuzish
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" x2="19" y1="12" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </form>
            </section>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <section className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">{team.name}</h2>
                        <p className="text-xs text-gray-400 mt-1">Mavzu: {team.project}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold px-3 py-1">
                        {team.members.length} / {MAX_MEMBERS} a'zo
                    </span>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                    <span className="text-xs text-gray-500 font-semibold">Taklif kodi:</span>
                    <span className="font-mono text-sm font-bold text-gray-900">{team.code}</span>
                    <button
                        type="button"
                        onClick={copyCode}
                        className="ml-auto text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                        {copied ? 'Nusxalandi ✓' : 'Nusxalash'}
                    </button>
                </div>

                <h3 className="text-sm font-bold text-gray-900 mt-6 mb-3">Jamoa a'zolari</h3>
                <div className="space-y-2">
                    {Array.from({ length: MAX_MEMBERS }).map((_, index) => {
                        const member = team.members[index]
                        return (
                            <div
                                key={index}
                                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                                    member ? 'border-gray-100 bg-white' : 'border-dashed border-gray-200 bg-gray-50/60'
                                }`}
                            >
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                    member ? 'bg-slate-900 text-white' : 'bg-white border border-gray-200 text-gray-300'
                                }`}>
                                    {member ? member.charAt(0).toUpperCase() : '+'}
                                </span>
                                <span className={`text-sm font-semibold ${member ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {member || "Bo'sh joy"}
                                </span>
                                {member === 'Siz' && (
                                    <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                        Siz
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>

                <button
                    type="button"
                    onClick={() => saveTeam(null)}
                    className="mt-5 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                >
                    Jamoani tark etish
                </button>
            </section>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <h2 className="text-base font-bold text-gray-900">Guruhdoshlarni taklif qilish</h2>
                <p className="text-xs text-gray-400 mt-1 mb-4">Guruh: {dbData.group?.code || 'YB-3171'}</p>

                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {classmates.map((student) => {
                        const added = team.members.includes(student.name)
                        const full = team.members.length >= MAX_MEMBERS && !added
                        return (
                            <div key={student.id} className="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-2">
                                <img
                                    src={student.avatar}
                                    alt={student.name}
                                    className="w-8 h-8 rounded-full bg-gray-100"
                                    loading="lazy"
                                />
                                <span className="text-sm font-semibold text-gray-800 truncate">{student.name}</span>
                                <button
                                    type="button"
                                    disabled={full}
                                    onClick={() => toggleMember(student.name)}
                                    className={`ml-auto shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                        added
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                    }`}
                                >
                                    {added ? 'Qo\'shildi' : "Qo'shish"}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}

export default MyTeamTab
