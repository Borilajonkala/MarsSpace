import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaTelegramPlane } from 'react-icons/fa'
import {
  LuCircleAlert,
  LuEye,
  LuEyeOff,
  LuFileText,
  LuLock,
  LuUser,
} from 'react-icons/lu'
import AuthShell, { LanguageSwitcher } from '../Components/AuthShell.jsx'
import { useProfile } from '../profile/ProfileContext.js'
import { normalizeLogin, resolveAccount } from '../profile/authAccounts.js'

const LANG_STORAGE_KEY = 'mars_login_lang'

const TRANSLATIONS = {
  ru: {
    offerta: 'Offerta',
    title: 'Добро пожаловать в Space',
    subtitle: 'Что изучим сегодня?',
    student: 'Студент',
    parent: 'Родитель',
    telegram: 'Войти через Telegram',
    otherTelegram: 'Войти с другим Telegram',
    divider: 'или по ID и паролю',
    marsId: 'MARS ID',
    marsIdPlaceholder: 'Введите MARS ID или логин',
    password: 'ПАРОЛЬ',
    passwordPlaceholder: '•••••',
    submit: 'Войти',
    pending: 'Входим…',
    noAccount: 'Нет аккаунта?',
    register: 'Регистрация',
    errorEmpty: 'Введите логин и пароль.',
    errorWrong: 'Неверный логин или пароль.',
    infoTelegram: 'Вход через Telegram скоро станет доступен.',
    badgeClose: 'Скрыть',
  },
  uz: {
    offerta: 'Offerta',
    title: "Space'ga xush kelibsiz",
    subtitle: "Bugun nimalarni o'rganamiz?",
    student: "O'quvchi",
    parent: 'Ota-ona',
    telegram: 'Telegram orqali kirish',
    otherTelegram: 'Boshqa Telegram bilan kirish',
    divider: 'yoki ID va parol bilan',
    marsId: 'MARS ID',
    marsIdPlaceholder: 'MARS ID yoki loginni kiriting',
    password: 'PAROL',
    passwordPlaceholder: '•••••',
    submit: 'Kirish',
    pending: 'Kirilmoqda…',
    noAccount: "Akkountingiz yo'qmi?",
    register: "Ro'yxatdan o'tish",
    errorEmpty: 'Login va parolni kiriting.',
    errorWrong: "Login yoki parol noto'g'ri.",
    infoTelegram: 'Telegram orqali kirish tez orada ishga tushadi.',
    badgeClose: 'Yashirish',
  },
  en: {
    offerta: 'Offerta',
    title: 'Welcome to Space',
    subtitle: 'What will we learn today?',
    student: 'Student',
    parent: 'Parent',
    telegram: 'Sign in with Telegram',
    otherTelegram: 'Sign in with another Telegram',
    divider: 'or with ID and password',
    marsId: 'MARS ID',
    marsIdPlaceholder: 'Enter MARS ID or login',
    password: 'PASSWORD',
    passwordPlaceholder: '•••••',
    submit: 'Sign in',
    pending: 'Signing in…',
    noAccount: "Don't have an account?",
    register: 'Sign up',
    errorEmpty: 'Enter your login and password.',
    errorWrong: 'Wrong login or password.',
    infoTelegram: 'Telegram sign-in is coming soon.',
    badgeClose: 'Hide',
  },
}

const readStoredLang = () => {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY)
    return TRANSLATIONS[stored] ? stored : 'ru'
  } catch {
    return 'ru'
  }
}

const Login = () => {
  const navigate = useNavigate()
  const { loginUser, refreshProfile, apiOnline } = useProfile()

  const [loginInput, setLoginInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [lang, setLang] = useState(readStoredLang)
  const [role, setRole] = useState('student')
  const [status, setStatus] = useState(null)
  const [pending, setPending] = useState(false)

  const t = TRANSLATIONS[lang]

  const changeLang = (code) => {
    setLang(code)
    try {
      localStorage.setItem(LANG_STORAGE_KEY, code)
    } catch {
      // Xotira yopilgan bo'lsa, til faqat shu sessiyada saqlanadi.
    }
  }

  const showStatus = (type, text) => setStatus({ type, text })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(null)

    const login = normalizeLogin(loginInput)
    const password = passwordInput.trim()

    if (!login || !password) {
      showStatus('error', t.errorEmpty)
      return
    }

    setPending(true)

    // json-server o'chirilgani ma'lum bo'lsa, behuda so'rov yubormaymiz.
    const account = await resolveAccount(login, { offline: apiOnline === false })

    const expectedPassword =
      account?.password ?? (login === 'timur' ? '12345' : null)

    if (!expectedPassword || password !== String(expectedPassword).trim()) {
      setPending(false)
      showStatus('error', t.errorWrong)
      return
    }

    const session = {
      id: account.id || 'user-timur',
      login,
      name: account.name || 'Timur',
      role,
      marsId: account.marsId || 'M-31710',
      profileId: account.profileId || 'profile-current',
      avatar: account.avatar || '/avatar-default.jpg',
      loggedInAt: new Date().toISOString(),
    }

    loginUser(session)
    refreshProfile({ silent: true })
    navigate('/', { replace: true })
  }

  return (
    <AuthShell closeLabel={t.badgeClose}>
      {/* Yuqori qator: Offerta + til */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#4c4c4c]">
          <LuFileText className="h-3.5 w-3.5" />
          {t.offerta}
        </span>
        <LanguageSwitcher lang={lang} onChange={changeLang} />
      </div>

      {/* Sarlavha */}
      <h1 className="mt-3 text-center text-[22px] font-semibold leading-tight text-[#2b2b2f]">
        {t.title}
      </h1>
      <p className="mt-1 text-center text-xs text-[#5f5f63]">{t.subtitle}</p>

      {/* Rol tanlash */}
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-white/25 p-1">
        {[
          { key: 'student', label: t.student },
          { key: 'parent', label: t.parent },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            aria-pressed={role === item.key}
            onClick={() => setRole(item.key)}
            className={`h-9 cursor-pointer rounded-lg text-sm transition ${
              role === item.key
                ? 'bg-white font-semibold text-[#2b2b2f] shadow-sm'
                : 'font-medium text-[#6b6b6f] hover:text-[#3a3a3d]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Telegram */}
      <button
        type="button"
        onClick={() => showStatus('info', t.infoTelegram)}
        className="mt-3 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#2aabee] text-sm font-semibold text-white transition hover:bg-[#229ed9] active:scale-[0.995]"
      >
        <FaTelegramPlane className="h-4 w-4" />
        {t.telegram}
      </button>
      <button
        type="button"
        onClick={() => showStatus('info', t.infoTelegram)}
        className="mt-2 cursor-pointer text-left text-[11px] font-medium text-[#2f5c74] transition hover:text-[#1f4457] hover:underline"
      >
        {t.otherTelegram}
      </button>

      {/* Ajratgich */}
      <div className="my-3 flex items-center gap-2 text-[11px] text-[#63636a]">
        <span className="h-px flex-1 bg-black/15" />
        {t.divider}
        <span className="h-px flex-1 bg-black/15" />
      </div>

      {/* Forma */}
      <form onSubmit={handleSubmit} noValidate>
        <label
          htmlFor="mars-id"
          className="mb-1 block text-[10px] font-bold tracking-[0.14em] text-[#5a5a5e]"
        >
          {t.marsId}
        </label>
        <div className="relative">
          <LuUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8f]" />
          <input
            id="mars-id"
            name="login"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck="false"
            value={loginInput}
            onChange={(event) => setLoginInput(event.target.value)}
            placeholder={t.marsIdPlaceholder}
            className="h-11 w-full rounded-lg border border-white/60 bg-white pl-10 pr-3 text-sm text-[#2b2b2f] outline-none transition placeholder:text-[#9a9a9f] focus:border-[#2aabee] focus:ring-2 focus:ring-white/50"
          />
        </div>

        <label
          htmlFor="mars-password"
          className="mb-1 mt-3 block text-[10px] font-bold tracking-[0.14em] text-[#5a5a5e]"
        >
          {t.password}
        </label>
        <div className="relative">
          <LuLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8f]" />
          <input
            id="mars-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={passwordInput}
            onChange={(event) => setPasswordInput(event.target.value)}
            placeholder={t.passwordPlaceholder}
            className="h-11 w-full rounded-lg border border-white/60 bg-white pl-10 pr-11 text-sm text-[#2b2b2f] outline-none transition placeholder:text-[#9a9a9f] focus:border-[#2aabee] focus:ring-2 focus:ring-white/50"
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-[#6d6d72] transition hover:bg-black/5 hover:text-[#3a3a3d]"
          >
            {showPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
          </button>
        </div>

        {status && (
          <div
            role={status.type === 'error' ? 'alert' : 'status'}
            className={`mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-[11px] font-medium ${
              status.type === 'error'
                ? 'border-red-950/20 bg-red-100/85 text-red-800'
                : 'border-sky-950/15 bg-sky-100/85 text-sky-800'
            }`}
          >
            <LuCircleAlert className="mt-px h-3.5 w-3.5 shrink-0" />
            <span>{status.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-3 h-11 w-full cursor-pointer rounded-lg bg-[#c78a70] text-sm font-semibold text-white transition hover:bg-[#bd7d62] active:scale-[0.995] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? t.pending : t.submit}
        </button>
      </form>

      <p className="mt-3 text-center text-[11px] text-[#55555a]">
        {t.noAccount}{' '}
        <Link
          to="/register"
          className="font-semibold text-[#2b2b2f] underline underline-offset-2 transition hover:text-black"
        >
          {t.register}
        </Link>
      </p>
    </AuthShell>
  )
}

export default Login
