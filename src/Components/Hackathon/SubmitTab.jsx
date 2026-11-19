import { useMemo, useState } from 'react'
import { TOPIC_STORAGE_KEY, TOPICS, WORK_STORAGE_KEY, loadJSON, saveJSON } from './hackathonData'

const nowString = () => {
    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const SubmitTab = () => {
    const selectedTopicId = useMemo(() => loadJSON(TOPIC_STORAGE_KEY, null), [])
    const selectedTopic = TOPICS.find((topic) => topic.id === selectedTopicId)
    const [work, setWork] = useState(() => loadJSON(WORK_STORAGE_KEY, null))
    const [form, setForm] = useState({
        repoUrl: '',
        demoUrl: '',
        description: '',
    })
    const [error, setError] = useState('')

    const update = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        setError('')
    }

    const submit = (e) => {
        e.preventDefault()

        if (!form.repoUrl.trim()) return setError('GitHub havolasini kiriting.')
        if (!/^https?:\/\//i.test(form.repoUrl.trim())) return setError('GitHub havolasi http(s) bilan boshlanishi kerak.')
        if (form.demoUrl.trim() && !/^https?:\/\//i.test(form.demoUrl.trim())) {
            return setError('Demo havolasi http(s) bilan boshlanishi kerak.')
        }
        if (form.description.trim().length < 20) return setError('Tavsif kamida 20 belgidan iborat bo\'lishi kerak.')

        const saved = {
            ...form,
            repoUrl: form.repoUrl.trim(),
            demoUrl: form.demoUrl.trim(),
            description: form.description.trim(),
            topic: selectedTopic?.title || 'Mavzu tanlanmagan',
            team: 'Mening jamoam',
            submittedAt: nowString(),
            status: 'Tekshirilmoqda',
        }
        saveJSON(WORK_STORAGE_KEY, saved)
        setWork(saved)
        setForm({ repoUrl: '', demoUrl: '', description: '' })
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <section className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <h2 className="text-base font-bold text-gray-900">Ishni topshirish</h2>
                <p className="text-xs text-gray-400 mt-1 mb-5">
                    Loyiha havolalari va qisqa tavsifni kiriting. Topshirilgan ishni xakaton yakuniga qadar yangilash mumkin.
                </p>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tanlangan mavzu</label>
                        <div className="rounded-xl border border-gray-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-800">
                            {selectedTopic ? (
                                <span className="flex items-center gap-2">
                                    <span>{selectedTopic.emoji}</span>
                                    {selectedTopic.title}
                                </span>
                            ) : (
                                <span className="text-gray-400">Mavzu tanlanmagan — "Mavzular" bo'limidan tanlang</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">GitHub havolasi *</label>
                        <input
                            type="url"
                            value={form.repoUrl}
                            onChange={(e) => update('repoUrl', e.target.value)}
                            placeholder="https://github.com/username/project"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Demo havolasi (ixtiyoriy)</label>
                        <input
                            type="url"
                            value={form.demoUrl}
                            onChange={(e) => update('demoUrl', e.target.value)}
                            placeholder="https://my-project.vercel.app"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Loyiha tavsifi *</label>
                        <textarea
                            rows={4}
                            value={form.description}
                            onChange={(e) => update('description', e.target.value)}
                            placeholder="Loyiha nima qiladi, qanday texnologiyalar ishlatilgan..."
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition resize-y"
                        />
                    </div>

                    {error && (
                        <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#3f882f] hover:bg-[#367527] text-white text-sm font-bold px-5 py-3 transition cursor-pointer"
                    >
                        {work ? 'Ishni yangilash' : 'Ishni topshirish'}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" x2="19" y1="12" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </form>
            </section>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <h2 className="text-base font-bold text-gray-900 mb-4">Topshirilgan ish</h2>
                {work ? (
                    <div className="space-y-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold px-2.5 py-1">
                            ● {work.status}
                        </span>
                        <div>
                            <p className="text-xs text-gray-400">Mavzu</p>
                            <p className="text-sm font-semibold text-gray-900">{work.topic}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Topshirilgan vaqt</p>
                            <p className="text-sm font-semibold text-gray-900">{work.submittedAt}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">GitHub</p>
                            <a href={work.repoUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-emerald-700 hover:underline break-all">
                                {work.repoUrl}
                            </a>
                        </div>
                        {work.demoUrl && (
                            <div>
                                <p className="text-xs text-gray-400">Demo</p>
                                <a href={work.demoUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-emerald-700 hover:underline break-all">
                                    {work.demoUrl}
                                </a>
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-gray-400">Tavsif</p>
                            <p className="text-xs text-gray-600 leading-relaxed">{work.description}</p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center">
                        <div className="text-3xl mb-2">📦</div>
                        <p className="text-xs text-gray-500">Hozircha ish topshirilmagan.</p>
                    </div>
                )}
            </section>
        </div>
    )
}

export default SubmitTab
