import { useEffect, useMemo, useState } from 'react'
import dbData from '../../db.json'

const STORAGE_KEY = 'mars_event_registrations'
const CLUB_STORAGE_KEY = 'mars_club_members'








const TYPE_META = {
	tadbir: { label: 'Tadbir', badge: 'bg-blue-50 text-blue-700 border-blue-200', emoji: '🎉' },
	togarak: { label: "To'garak", badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', emoji: '🧩' },
	hackathon: { label: 'Xakaton', badge: 'bg-purple-50 text-purple-700 border-purple-200', emoji: '🚀' },
}


const normalizeType = (raw) => {
	const t = String(raw || '').toLowerCase()
	if (t.includes('hack') || t.includes('xak')) return 'hackathon'
	if (t.includes('garak') || t.includes('club') || t.includes('kurs')) return 'togarak'
	return 'tadbir'
}

const formatDate = (value) => {
	if (!value) return ''
	const d = new Date(value)
	if (Number.isNaN(d.getTime())) return String(value)
	try {
		return d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
	} catch {
		return String(value)
	}
}

const loadList = (key) => {
	try {
		const saved = localStorage.getItem(key)
		const parsed = saved ? JSON.parse(saved) : []
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

const saveList = (key, value) => {




	try {
		localStorage.setItem(key, JSON.stringify(value))
	} catch {
		console.log('locolstorege yopilsayam sayt iwlaydi');
		
	}
}

const Events = () => {
	const [query, setQuery] = useState('')
	const [registrations, setRegistrations] = useState(() => loadList(STORAGE_KEY))
	const [memberships, setMemberships] = useState(() => loadList(CLUB_STORAGE_KEY))

		
const [clubs, setClubs] = useState([])
console.log(clubs);

  useEffect(() => {
    async function getClubs() {
      try {
        const response = await fetch('http://localhost:3001/CLUBS')

        if (!response.ok) {
          throw new Error(`Server xatosi: ${response.status}`)
        }

        const data = await response.json()
        setClubs(data)
      } catch (error) {
        console.error(error)
      }
    }

    getClubs()
  }, [])

	const events = useMemo(() => {
		if (Array.isArray(dbData.events) && dbData.events.length > 0) return dbData.events
		if (Array.isArray(dbData.announcements)) {
			return dbData.announcements.map((a) => ({
				id: a.id,
				title: a.title,
				description: a.content,
				date: a.date,
				type: a.type === 'event' ? 'hackathon' : 'tadbir',
				location: 'Mars IT School - Toshkent',
				organizer: a.author || 'Mars Administration',
				tags: ['Mars', a.type || 'tadbir'],
				seats: 50,
			}))
		}
		return []
	}, [])

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase()
		if (!q) return events
		return events.filter((event) => {
			const haystack = [event.title, event.description, event.location, event.organizer, ...(event.tags || [])]
				.filter(Boolean)
				.join(' ')
				.toLowerCase()
			return haystack.includes(q)
		})
	}, [events, query])

	const toggleRegister = (id) => {
		setRegistrations((prev) => {
			const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
			saveList(STORAGE_KEY, next)
			return next
		})
	}

	const toggleMembership = (id) => {
		setMemberships((prev) => {
			const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
			saveList(CLUB_STORAGE_KEY, next)
			return next
		})
	}

	return (
		<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
			<div className="text-black border-b border-gray-300 pb-4">
				<h1 className="text-[20px] font-bold">Tadbirlar va to'garaklar</h1>
				<p className="text-[15px] font-normal text-gray-500">
					Yakshanba tadbirlari va qiziqish bo'yicha muntazam mashg'ulotlar
				</p>
			</div>

			<section className="mt-6">
				<div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
					<div className="flex items-center gap-2">
						<h2 className="text-[16px] font-bold text-gray-900">Tadbirlar</h2>
						<span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
							{events.length}
						</span>
					</div>

					<div className="relative w-full sm:w-72">
						<svg
							className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="11" cy="11" r="8" />
							<line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Tadbir qidirish..."
							className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
						/>
					</div>
				</div>

				{filtered.length === 0 && (
					<div className="mt-5 bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
						<div className="text-4xl mb-3">{events.length === 0 ? '📅' : '🔍'}</div>
						<h3 className="font-bold text-gray-800">
							{events.length === 0 ? "Hozircha tadbirlar yo'q" : 'Hech narsa topilmadi'}
						</h3>
						<p className="text-xs text-gray-500 mt-1">
							{events.length === 0
								? 'db.json faylining "events" bo\'limiga ma\'lumot qo\'shilganda shu yerda chiqadi.'
								: "Qidiruv so'zini o'zgartiring."}
						</p>
					</div>
				)}

				{filtered.length > 0 && (
					<div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
						{filtered.map((event) => {
							const type = normalizeType(event.type)
							const meta = TYPE_META[type]
							const seats = Number(event.seats) || 0
							const baseRegistered = Number(event.registered) || 0
							const isRegistered = registrations.includes(event.id)
							const registered = baseRegistered + (isRegistered ? 1 : 0)
							const free = Math.max(seats - registered, 0)
							const percent = seats > 0 ? Math.min(Math.round((registered / seats) * 100), 100) : 0
							const isClosed = String(event.status || '').toLowerCase() === 'closed' || (seats > 0 && free === 0)

							return (
								<article
									key={event.id}
									className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
								>
									<div className="relative h-40 bg-gray-100">
										{event.image ? (
											<img
												src={event.image}
												alt={event.title}
												className="w-full h-full object-cover"
												loading="lazy"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-5xl bg-gray-50">
												{meta.emoji}
											</div>
										)}
										<span
											className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full border bg-white/95 ${meta.badge}`}
										>
											{meta.label}
										</span>
										{isRegistered && (
											<span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-sm">
												✓ Ro'yxatdansiz
											</span>
										)}
									</div>

									<div className="p-4 flex flex-col flex-1">
										<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-gray-500">
											{event.date && (
												<span className="flex items-center gap-1">
													<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
														<rect width="18" height="18" x="3" y="4" rx="2" />
														<line x1="3" x2="21" y1="10" y2="10" />
													</svg>
													{formatDate(event.date)}
												</span>
											)}
											{event.time && <span>🕒 {event.time}</span>}
										</div>

										<h3 className="mt-1.5 font-bold text-gray-900 text-[15px] leading-snug line-clamp-2">
											{event.title || 'Nomsiz tadbir'}
										</h3>

										{event.description && (
											<p className="text-xs text-gray-500 mt-1.5 line-clamp-3">{event.description}</p>
										)}

										<div className="mt-3 space-y-1 text-[11px] text-gray-500">
											{event.location && (
												<div className="flex items-center gap-1.5">
													<svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
														<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
														<circle cx="12" cy="10" r="3" />
													</svg>
													<span className="truncate">{event.location}</span>
												</div>
											)}
											{event.organizer && (
												<div className="flex items-center gap-1.5">
													<svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
														<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
														<circle cx="12" cy="7" r="4" />
													</svg>
													<span className="truncate">{event.organizer}</span>
												</div>
											)}
										</div>

										{Array.isArray(event.tags) && event.tags.length > 0 && (
											<div className="mt-3 flex flex-wrap gap-1.5">
												{event.tags.map((tag) => (
													<span
														key={tag}
														className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600"
													>
														{tag}
													</span>
												))}
											</div>
										)}

										{seats > 0 && (
											<div className="mt-4">
												<div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-1">
													<span>
														{registered} / {seats} joy band
													</span>
													<span className={free === 0 ? 'text-red-500' : 'text-emerald-600'}>
														{free === 0 ? "Bo'sh joy qolmadi" : `${free} joy qoldi`}
													</span>
												</div>
												<div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
													<div
														className={`h-full rounded-full transition-all ${percent >= 100 ? 'bg-red-500' : 'bg-emerald-500'}`}
														style={{ width: `${percent}%` }}
													/>
												</div>
											</div>
										)}

										<button
											type="button"
											disabled={isClosed && !isRegistered}
											onClick={() => toggleRegister(event.id)}
											className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition active:scale-[0.99] ${
												isRegistered
													? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer'
													: isClosed
														? 'bg-gray-100 text-gray-400 cursor-not-allowed'
														: 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer'
											}`}
										>
											{isRegistered ? "Ro'yxatdan chiqish" : isClosed ? "Ro'yxat yopilgan" : "Ro'yxatdan o'tish"}
										</button>
									</div>
								</article>
							)
						})}
					</div>
				)}
			</section>

			<section className="mt-8">
				<div className="flex items-center gap-2 border-t border-gray-200 pt-5">
					<h2 className="text-[16px] font-bold text-gray-900">To'garaklar</h2>
					<span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
					</span>
				</div>

				<div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
					{clubs.map((club) => {
						const isMember = memberships.includes(club.id)

						return (
							<article
								key={club.id}
								className="h-[400px] bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
							>
								<div className="relative h-[45%] shrink-0 bg-gray-100">
									<img
										src={club.image}
										alt={club.name}
										className="w-full h-full object-cover"
										loading="lazy"
									/>
									{isMember && (
										<span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-600 text-white shadow-sm">
											 A'zo
										</span>
									)}
								</div>

								<div className="p-4 flex flex-col flex-1 min-h-0">
									<h3 className="font-bold text-gray-900 text-[18px] leading-tight truncate">{club.name}</h3>
									<p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
										Har hafta · {club.members} a'zo
									</p>
									<p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{club.description}</p>

									<div className="mt-2 space-y-0.5 text-[11px] text-gray-500">
										<p className="truncate">{club.schedule}</p>
										<p className="truncate">{club.mentor}</p>
										<p className="truncate">{club.location}</p>
									</div>

									<button
										type="button"
										onClick={() => toggleMembership(club.id)}
										className={`mt-auto w-full py-2.5 rounded-xl text-xs font-bold transition active:scale-[0.99] cursor-pointer ${
											isMember
												? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
												: 'bg-gray-900 text-white hover:bg-gray-800'
										}`}
									>
										{isMember ? "A'zolikdan chiqish" : "A'zo bo'lish"}
									</button>
								</div>
							</article>
						)
					})}
				</div>
			</section>

			
		</div>
	)
}

export default Events
