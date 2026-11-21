import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LuAtSign,
  LuCircleAlert,
  LuEye,
  LuEyeOff,
  LuFileText,
  LuLock,
  LuUser,
} from 'react-icons/lu'
import AuthShell, { LanguageSwitcher } from '../Components/AuthShell.jsx'
import { DEFAULT_AVATAR, useProfile } from '../profile/ProfileContext.js'
import {
  normalizeLogin,
  resolveAccount,
  saveRemoteAccount,
} from '../profile/authAccounts.js'
import { upsertRegisteredUser } from '../profile/profileStore.js'

const LANG_STORAGE_KEY = 'mars_register_lang'
const STARTER_COINS = 10000

const TRANSLATIONS = {
  ru: {
    offerta: 'Offerta',
    title: 'Регистрация в Space',
    subtitle: 'Создайте аккаунт студента',
    student: 'Студент',
    parent: 'Родитель',
    fullName: 'ИМЯ И ФАМИЛИЯ',
    fullNamePlaceholder: 'Например: Тимур Ахмедов',
    login: 'ЛОГИН / НИКНЕЙМ',
    loginPlaceholder: 'timur',
    password: 'ПАРОЛЬ',
    passwordPlaceholder: '•••••',
    confirmPassword: 'ПОДТВЕРДИТЕ ПАРОЛЬ',
    confirmPasswordPlaceholder: '•••••',
    submit: 'Зарегистрироваться',
    pending: 'Создаём…',
    haveAccount: 'Уже есть аккаунт?',
    loginLink: 'Войти',
    errorEmpty: 'Заполните все поля.',
    errorMismatch: 'Пароли не совпадают.',
    errorTaken: 'Этот логин уже занят.',
    badgeClose: 'Скрыть',
  },
  uz: {
    offerta: 'Offerta',
    title: "Space'da ro'yxatdan o'tish",
    subtitle: "O'quvchi akkaunti yarating",
    student: "O'quvchi",
    parent: 'Ota-ona',
    fullName: 'ISM VA FAMILIYA',
    fullNamePlaceholder: 'Masalan: Timur Ahmedov',
    login: 'LOGIN / NIKNEYM',
    loginPlaceholder: 'timur',
    password: 'PAROL',
    passwordPlaceholder: '•••••',
    confirmPassword: 'PAROLNI TASDIQLANG',
    confirmPasswordPlaceholder: '•••••',
    submit: "Ro'yxatdan o'tish",
    pending: 'Yaratilmoqda…',
    haveAccount: 'Akkountingiz bormi?',
    loginLink: 'Kirish',
    errorEmpty: "Barcha maydonlarni to'ldiring.",
    errorMismatch: 'Parollar mos kelmadi.',
    errorTaken: 'Bu login allaqachon band.',
    badgeClose: 'Yashirish',
  },
  en: {
    offerta: 'Offerta',
    title: 'Register in Space',
    subtitle: 'Create a student account',
    student: 'Student',
    parent: 'Parent',
    fullName: 'NAME AND SURNAME',
    fullNamePlaceholder: 'e.g. Timur Ahmedov',
    login: 'LOGIN / NICKNAME',
    loginPlaceholder: 'timur',
    password: 'PASSWORD',
    passwordPlaceholder: '•••••',
    confirmPassword: 'CONFIRM PASSWORD',
    confirmPasswordPlaceholder: '•••••',
    submit: 'Create account',
    pending: 'Creating…',
    haveAccount: 'Already have an account?',
    loginLink: 'Sign in',
    errorEmpty: 'Fill in all fields.',
    errorMismatch: 'Passwords do not match.',
    errorTaken: 'This login is already taken.',
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

const Register = () => {
  const navigate = useNavigate()
  const { loginUser, saveProfile, apiOnline } = useProfile()

  const [fullName, setFullName] = useState('')
  const [loginInput, setLoginInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [confirmInput, setConfirmInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
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

    const name = fullName.trim()
    const login = normalizeLogin(loginInput)
    const password = passwordInput.trim()
    const confirm = confirmInput.trim()

    if (!name || !login || !password || !confirm) {
      showStatus('error', t.errorEmpty)
      return
    }

    if (password !== confirm) {
      showStatus('error', t.errorMismatch)
      return
    }

    setPending(true)

    // json-server o'chirilgani ma'lum bo'lsa, behuda so'rov yubormaymiz.
    const existing = await resolveAccount(login, { offline: apiOnline === false })

    if (existing) {
      setPending(false)
      showStatus('error', t.errorTaken)
      return
    }

    const [firstName, ...rest] = name.split(/\s+/)
    const account = {
      id: `user-${Date.now().toString(36)}`,
      login,
      password,
      name,
      role,
      marsId: `M-${Math.floor(10000 + Math.random() * 90000)}`,
      profileId: 'profile-current',
      avatar: DEFAULT_AVATAR,
      coins: STARTER_COINS,
      xp: 0,
      level: 1,
      createdAt: new Date().toISOString(),
    }

    const saved = await saveRemoteAccount(account, { offline: apiOnline === false })

    // Server o'chirilgan bo'lsa ham hisob brauzerda saqlanadi va keyin kirish ishlaydi.
    upsertRegisteredUser({ ...account, ...saved })

    const session = {
      id: saved.id || account.id,
      login,
      name,
      role,
      marsId: saved.marsId || account.marsId,
      profileId: saved.profileId || account.profileId,
      avatar: saved.avatar || DEFAULT_AVATAR,
      loggedInAt: new Date().toISOString(),
    }

    saveProfile(
      (current) => ({
        ...current,
        nickname: login,
        firstName,
        lastName: rest.join(' '),
        avatar: DEFAULT_AVATAR,
        coins: STARTER_COINS,
        xp: 0,
        level: 1,
        marsId: session.marsId,
        lastActivity: 'Hozir',
      }),
      { sync: apiOnline !== false }
    )

    loginUser(session)
    navigate('/', { replace: true })
  }

  const passwordField = (id, label, value, onChange, visible, toggle, autoComplete, placeholder) => (
    <>
      <label
        htmlFor={id}
        className="mb-1 mt-3 block text-[10px] font-bold tracking-[0.14em] text-[#5a5a5e]"
      >
        {label}
      </label>
      <div className="relative">
        <LuLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8f]" />
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border border-white/60 bg-white pl-10 pr-11 text-sm text-[#2b2b2f] outline-none transition placeholder:text-[#9a9a9f] focus:border-[#2aabee] focus:ring-2 focus:ring-white/50"
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={toggle}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-[#6d6d72] transition hover:bg-black/5 hover:text-[#3a3a3d]"
        >
          {visible ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
        </button>
      </div>
    </>
  )

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

      {/* Forma */}
      <form onSubmit={handleSubmit} noValidate>
        <label
          htmlFor="full-name"
          className="mb-1 mt-4 block text-[10px] font-bold tracking-[0.14em] text-[#5a5a5e]"
        >
          {t.fullName}
        </label>
        <div className="relative">
          <LuUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8f]" />
          <input
            id="full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder={t.fullNamePlaceholder}
            className="h-11 w-full rounded-lg border border-white/60 bg-white pl-10 pr-3 text-sm text-[#2b2b2f] outline-none transition placeholder:text-[#9a9a9f] focus:border-[#2aabee] focus:ring-2 focus:ring-white/50"
          />
        </div>

        <label
          htmlFor="register-login"
          className="mb-1 mt-3 block text-[10px] font-bold tracking-[0.14em] text-[#5a5a5e]"
        >
          {t.login}
        </label>
        <div className="relative">
          <LuAtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8f]" />
          <input
            id="register-login"
            name="login"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck="false"
            value={loginInput}
            onChange={(event) => setLoginInput(event.target.value)}
            placeholder={t.loginPlaceholder}
            className="h-11 w-full rounded-lg border border-white/60 bg-white pl-10 pr-3 text-sm text-[#2b2b2f] outline-none transition placeholder:text-[#9a9a9f] focus:border-[#2aabee] focus:ring-2 focus:ring-white/50"
          />
        </div>

        {passwordField(
          'register-password',
          t.password,
          passwordInput,
          setPasswordInput,
          showPassword,
          () => setShowPassword((value) => !value),
          'new-password',
          t.passwordPlaceholder
        )}

        {passwordField(
          'register-confirm',
          t.confirmPassword,
          confirmInput,
          setConfirmInput,
          showConfirm,
          () => setShowConfirm((value) => !value),
          'new-password',
          t.confirmPasswordPlaceholder
        )}

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
          className="mt-4 h-11 w-full cursor-pointer rounded-lg bg-[#c78a70] text-sm font-semibold text-white transition hover:bg-[#bd7d62] active:scale-[0.995] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? t.pending : t.submit}
        </button>
      </form>

      <p className="mt-3 text-center text-[11px] text-[#55555a]">
        {t.haveAccount}{' '}
        <Link
          to="/login"
          className="font-semibold text-[#2b2b2f] underline underline-offset-2 transition hover:text-black"
        >
          {t.loginLink}
        </Link>
      </p>
    </AuthShell>
  )
}

export default Register
