import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dbData from '../../db.json'

const Login = () => {
  const navigate = useNavigate()
  const [phoneInput, setPhoneInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeLang, setActiveLang] = useState('Uz')

  // Mentorlar ro'yxati (db.json dan)
  const mentors = dbData.mentors || []

  // Kirish funksiyasi
  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    setErrorMsg('')

    if (!phoneInput || !passwordInput) {
      setErrorMsg(
        activeLang === 'Ru'
          ? 'Пожалуйста, введите номер телефона и пароль!'
          : activeLang === 'En'
          ? 'Please enter phone number and password!'
          : "Iltimos, telefon raqami va parolni kiriting!"
      )
      return
    }

    const cleanInput = phoneInput.replace(/[\s+\-()]/g, '').trim().toLowerCase()
    // Telefon faqat to'liq yoki kamida 9 xonali oxirgi qism bo'yicha qidiriladi
    const inputDigits = cleanInput.replace(/\D/g, '')

    const foundMentor = mentors.find((m) => {
      const cleanPhone = m.phone.replace(/[\s+\-()]/g, '').toLowerCase()
      const cleanMarsId = (m.marsId || '').toLowerCase()
      const matchesPhone =
        inputDigits.length >= 9 &&
        (cleanPhone === cleanInput || cleanPhone.endsWith(cleanInput))
      const matchesMarsId = cleanMarsId === cleanInput
      return matchesPhone || matchesMarsId
    })

    if (!foundMentor) {
      setErrorMsg(
        activeLang === 'Ru'
          ? 'Сотрудник с таким номером или Mars ID не найден!'
          : activeLang === 'En'
          ? 'Staff member with this phone or Mars ID not found!'
          : "Bunday telefon raqam yoki Mars ID li xodim topilmadi!"
      )
      return
    }

    if (foundMentor.password !== passwordInput) {
      setErrorMsg(
        activeLang === 'Ru'
          ? 'Неверный пароль!'
          : activeLang === 'En'
          ? 'Invalid password!'
          : "Parol noto'g'ri kiritildi!"
      )
      return
    }

    // Muvaffaqiyatli login: localStorage ga saqlash
    localStorage.setItem('mars_auth_user', JSON.stringify(foundMentor))
    navigate('/')
  }

  // Tezkor demo kirish
  const handleQuickLogin = (mentor) => {
    localStorage.setItem('mars_auth_user', JSON.stringify(mentor))
    navigate('/')
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#180a08] via-[#240e0b] to-[#120605] flex flex-col items-center justify-center p-4 relative font-sans">
      {/* Kosmik fon nurlari */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#d94826]/15 rounded-[100%] blur-2xl"></div>
      </div>

      {/* Asosiy Karta */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 transition-all">
        {/* Mars Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-1">
            <span className="text-4xl font-extrabold tracking-tight text-gray-900">mars</span>
            <span className="w-3.5 h-3.5 rounded-full border-3 border-red-500 bg-white inline-block -mt-4"></span>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-2">
            {activeLang === 'Ru'
              ? 'Вход для сотрудников'
              : activeLang === 'En'
              ? 'Staff Login'
              : 'Xodimlar uchun kirish'}
          </p>
        </div>

        {/* Mars ID Tugmasi */}
        <button
          type="button"
          onClick={() => mentors[0] && handleQuickLogin(mentors[0])}
          className="w-full bg-[#1b223c] hover:bg-[#252f52] text-white py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition shadow-md active:scale-[0.99] cursor-pointer"
        >
          {/* Barmoq izi ikonka */}
          <svg
            className="w-6 h-6 text-red-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
            <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
            <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
            <path d="M2 12a10 10 0 0 1 18-6" />
            <path d="M2 16h.01" />
            <path d="M21.8 16c.2-2 .131-5.354 0-6" />
            <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
            <path d="M8.65 22c.21-.66.45-1.32.57-2" />
            <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
          </svg>
          <span>
            {activeLang === 'Ru'
              ? 'Войти через Mars ID'
              : activeLang === 'En'
              ? 'Sign in with Mars ID'
              : 'Mars ID orqali kirish'}
          </span>
        </button>

        {/* Ajratuvchi chiziq */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-3 text-xs uppercase font-medium text-gray-400 absolute">
            {activeLang === 'Ru' ? 'или' : activeLang === 'En' ? 'or' : 'yoki'}
          </span>
        </div>

        {/* Xatolik xabari */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Forma */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="+998"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition placeholder-gray-400 text-sm"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={activeLang === 'Ru' ? 'Пароль' : activeLang === 'En' ? 'Password' : 'Parol'}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition placeholder-gray-400 text-sm pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {showPassword ? (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#fca590] hover:bg-[#fa8b71] text-white py-3.5 px-4 rounded-xl font-bold transition shadow-sm active:scale-[0.99] cursor-pointer"
          >
            {activeLang === 'Ru' ? 'Войти' : activeLang === 'En' ? 'Log In' : 'Kirish'}
          </button>
        </form>

        {/* Demo Kirish Ro'yxati */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 text-center">
            Tezkor sinov uchun mentor hisobi:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {mentors.slice(0, 4).map((m) => (
              <button
                key={m.id}
                onClick={() => handleQuickLogin(m)}
                className="text-left text-xs p-2.5 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50/50 transition cursor-pointer"
              >
                <p className="font-bold text-gray-900 truncate">{m.fullName}</p>
                <p className="text-[10px] text-gray-500 truncate">{m.marsId} • {m.role.split(' ')[0]}</p>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-2.5">
            Default parol: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">password123</code>
          </p>
        </div>
      </div>

      {/* Tillar tanlagichi */}
      <div className="flex items-center gap-1.5 mt-6 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10 z-10">
        {['En', 'Ru', 'Uz'].map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveLang(lang)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
              activeLang === lang ? 'bg-white/20 text-white shadow-xs' : 'text-gray-400 hover:text-white'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Login
