<<<<<<< HEAD
<<<<<<< HEAD
import  { useState } from 'react'
=======
import { useEffect, useState } from 'react'
>>>>>>> 16aa550210adab982ff9c040691117c6c467dcfa
=======
import { useEffect, useState } from 'react'
>>>>>>> 9479d815f412338224381c0ba55b8053c8890263
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import {
    COIN_BALANCE_EVENT,
    getCoinBalance,
} from '../coinBalance.jsx'

const Header = ({ children }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [selectedTheme, setSelectedTheme] = useState("YO'LAK")

    // Saqlangan mentor/foydalanuvchi ma'lumotlari (buzilgan JSON ilovani yiqitmasligi uchun)
    const [currentUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('mars_auth_user') 
            return storedUser ? JSON.parse(storedUser) : null
        } catch {

            return null
        }
    })
    const [coins, setCoins] = useState(() => getCoinBalance(currentUser))

    useEffect(() => {
        const syncCoins = () => setCoins(getCoinBalance(currentUser))
        window.addEventListener(COIN_BALANCE_EVENT, syncCoins)
        window.addEventListener('storage', syncCoins)
        return () => {
            window.removeEventListener(COIN_BALANCE_EVENT, syncCoins)
            window.removeEventListener('storage', syncCoins)
        }
    }, [currentUser])

    // Dropdown'ni yopish (daisyUI focus orqali ochiladi)
    const closeDropdown = () => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    }

    // Profil sahifasiga o'tish + menyuni yopish
    const handleOpenProfile = () => {
        closeDropdown()
        navigate('/profile')
    }

    // Chiqish (Logout)
    const handleLogout = () => {
        // Himoyalangan route'lar token'ni tekshiradi, shuni tozalash kifoya
        localStorage.removeItem('token')
        localStorage.removeItem('mars_auth_user')
        navigate('/login')
    }

    // Joriy sahifa nomini aniqlash
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/':
                return 'Asosiy'
            case '/about':
                return 'Haqida / Kurslarim'
            case '/courses':
                return 'Kurslarim'
            case '/my-works':
                return 'Mening ishlarim'
            case '/games':
                return "O'yin-kulgi"
            case '/alogo':
                return "Alogo"
            case '/blog':
                return 'Blog'
            case '/hackathon':
                return 'Xakaton'
            case '/events':
                return "Tadbirlar va to'garaklar"
            case '/rating':
                return 'Reyting'
            case '/payment':
                return "Onlayn to'lov"
            case '/space-shop':
                return 'SpaceShop'
            case '/login':
                return 'Kirish'
            case '/profile':
            case '/profil':
                return 'Profil'
            default:
                return 'Asosiy'
        }
    }

    // Menyu ro'yxati (Rasm asosida)
    const menuItems = [
        {
            to: '/',
            label: 'Asosiy',
            icon: (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            )
        },
        {
            to: '/about',
            label: 'Kurslarim',
            icon: (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h10" />
                    <path d="M7 12h10" />
                    <path d="M7 17h6" />
                </svg>
            )
        },
        {
            to: '/my-works',
            label: 'Mening ishlarim',
            icon: (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 8 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                </svg>
            )
        },
        {
            to: '/games',
            label: "O'yin-kulgi",
            hasArrow: true,
            icon: (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="6" x2="10" y1="12" y2="12" />
                    <line x1="8" x2="8" y1="10" y2="14" />
                    <line x1="15" x2="15.01" y1="13" y2="13" />
                    <line x1="18" x2="18.01" y1="11" y2="11" />
                    <rect width="20" height="12" x="2" y="6" rx="6" />
                </svg>
            )
        },
        {
            to: '/alogo',
            label: 'Alogo',
            icon: (
                <span className="font-mono font-bold text-sm tracking-tight">&lt;/&gt;</span>
            )
        },
        {
            to: '/blog',
            label: 'Blog',
            icon: (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                    <path d="M6 6h10" />
                    <path d="M6 10h10" />
                </svg>
            )
        },
        {
            to: '/hackathon',
            label: 'Xakaton',
            icon: (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                </svg>
            )
        },
        {
            to: '/events',
            label: "Tadbirlar va to'garaklar",
            icon: (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
            )
        },
        {
            to: '/rating',
            label: 'Reyting',
            icon: (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
            )
        },
        {
            to: '/payment',
            label: "Onlayn to'lov",
            icon: (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
            )
        },
        {
            to: '/space-shop',
            label: 'SpaceShop',
            icon: (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 7h12l1 14H5L6 7Z" />
                    <path d="M9 7a3 3 0 0 1 6 0" />
                </svg>
            )
        },
        {
            to: '/login',
            label: 'Xodimlar Logini',
            icon: (
                <svg className="w-5 h-5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
            )
        }
    ]

    return (
        <div className="drawer lg:drawer-open min-h-screen bg-[#f8fafc]">
            {/* Mobil menyu tugmasi uchun checkbox */}
            <input id="mars-drawer" type="checkbox" className="drawer-toggle" />

            {/* ASOSIY SAHIFA KONTENTI (DRAWER-CONTENT) */}
            <div className="drawer-content flex flex-col min-h-screen">
                {/* ------------------------------------------------------------- */}
                {/* TOP NAVBAR (Rasm asosida) */}
                {/* ------------------------------------------------------------- */}
                <header className="navbar bg-white border-b border-gray-100 px-4 sm:px-6 h-16 sticky top-0 z-20 flex items-center justify-between">
                    {/* Chap taraf: Mobil burger + Sahifa nomi */}
                    <div className="flex items-center gap-3">
                        <label htmlFor="mars-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost btn-sm lg:hidden cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </label>
                        <h2 className="text-base sm:text-lg font-bold text-gray-800">
                            {getPageTitle()}
                        </h2>
                    </div>

                    {/* O'ng taraf: Coinlar, Energy, Rejimlar, Qo'ng'iroqcha, Profil */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Mars Coin */}
                        <div className="flex items-center gap-1.5 bg-[#fef9c3]/70 hover:bg-[#fef9c3] border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-bold text-amber-800 transition shadow-2xs">
                            <span className="text-sm">🪙</span>
                            <span>{coins}</span>
                        </div>

                        {/* Energy / XP */}
                        <div className="flex items-center gap-1.5 bg-[#eff6ff] hover:bg-[#dbeafe] border border-blue-200/70 px-2.5 py-1 rounded-full text-xs font-bold text-blue-700 transition shadow-2xs">
                            <span className="text-sm">⚡</span>
                            <span>{currentUser?.xp || 650}</span>
                        </div>

                        {/* Rejimlar tanlagichi (ESKI, YO'LAK, PIXEL, NEON) */}
                        <div className="hidden md:flex items-center gap-1 bg-gray-100/90 p-1 rounded-full text-[11px] font-semibold text-gray-500">
                            {['ESKI', "YO'LAK", 'PIXEL', 'NEON'].map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setSelectedTheme(mode)}
                                    className={`px-3 py-1 rounded-full transition cursor-pointer ${
                                        selectedTheme === mode
                                            ? 'bg-gray-900 text-white font-bold shadow-xs'
                                            : 'hover:text-gray-900'
                                    }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>

                        {/* Bildirishnomalar (Qo'ng'iroqcha) */}
                        <button className="btn btn-ghost btn-circle btn-sm text-gray-600 hover:bg-gray-100 relative cursor-pointer" title="Bildirishnomalar">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Profil rasmi va Dropdown */}
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm avatar cursor-pointer">
                                <div className="w-8 rounded-full border border-gray-300 overflow-hidden">
                                    {currentUser?.avatar ? (
                                        <img alt="Profil" src={currentUser.avatar} />
                                    ) : (
                                        <span className="flex h-8 w-8 items-center justify-center bg-base-200 text-base leading-none">
                                            🧑‍🚀
                                        </span>
                                    )}
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-lg bg-white rounded-2xl w-56 border border-gray-100">
                                <li className="menu-title px-3 py-1 text-xs text-gray-400">
                                    {currentUser ? currentUser.fullName : 'Mars Space'}
                                </li>
                                {currentUser ? (
                                    <>
                                        <li className="px-3 py-1 text-[11px] text-gray-500">
                                            {currentUser.marsId || currentUser.phone}
                                        </li>
                                        <li>
                                            <button
                                                type="button"
                                                onClick={handleOpenProfile}
                                                className="rounded-lg font-semibold text-gray-700"
                                            >
                                                Profil
                                            </button>
                                        </li>
                                        <div className="divider my-1"></div>
                                        <li>
                                            <button onClick={handleLogout} className="rounded-lg font-semibold text-red-600 hover:bg-red-50">
                                                Chiqish (Logout)
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <button
                                                type="button"
                                                onClick={handleOpenProfile}
                                                className="rounded-lg font-semibold text-gray-700"
                                            >
                                                Profil
                                            </button>
                                        </li>
                                        <div className="divider my-1"></div>
                                        <li><Link to="/login" className="rounded-lg font-bold text-red-600 hover:bg-red-50">Tizimga kirish</Link></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </header>

                {/* ------------------------------------------------------------- */}
                {/* SAHIFA KONTENTI: Outlet yoki children orqali almashadi! */}
                {/* ------------------------------------------------------------- */}
                <main className="flex-1 w-full bg-[#f8fafc] overflow-y-auto">
                    {children || <Outlet />}
                </main>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* CHAP SIDEBAR (DRAWER-SIDE - Rasm asosida) */}
            {/* ------------------------------------------------------------- */}
            <div className="drawer-side z-30">
                <label htmlFor="mars-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                
                <aside className="w-60 sm:w-64 min-h-full bg-white border-r border-gray-100 flex flex-col justify-between py-5 px-3">
                    <div>
                        {/* Mars Logo */}
                        <div className="px-3 mb-6 flex items-center justify-between">
                            <Link to="/" className="flex items-center gap-1 cursor-pointer">
                                <span className="text-2xl font-black tracking-tight text-[#1e1b4b]">MARS</span>
                                <span className="w-2.5 h-2.5 rounded-full border-2 border-red-500 bg-white inline-block -mt-3.5"></span>
                            </Link>
                        </div>

                        {/* Navigatsiya Havolalari */}
                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                                            isActive
                                                ? 'bg-[#eefbe8] text-[#3f882f]'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </div>
                                    {item.hasArrow && (
                                        <span className="text-gray-400 text-xs">›</span>
                                    )}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    {/* Pastki qism: 3D Avatar, Eduverse, Pochta */}
                    <div className="pt-4 border-t border-gray-100 space-y-3">
                        {/* 3D Qahramon */}
                        <div className="flex flex-col items-center justify-center p-2">
                            <div className="relative">
                                <div className="flex h-16 w-16 items-center justify-center text-4xl hover:scale-105 transition drop-shadow-md">
                                    🧑‍🚀
                                </div>
                                <div className="w-14 h-2 bg-emerald-500/20 rounded-full mx-auto -mt-1 blur-[1px]"></div>
                            </div>
                        </div>

                        <div className="space-y-1 text-xs">
                            <a
                                href="http://localhost:5173/"
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold transition"
                            >
                                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" x2="22" y1="12" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                                <span>Eduverse</span>
                            </a>

                            <a
                                href="#pochta"
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold transition"
                            >
                                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                <span>Pochta</span>
                            </a>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Header
