import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dbData from '../../db.json'
import { useProfile } from '../profile/ProfileContext.js'

// Barcha summalar, to'lov usullari va boshlang'ich tarix db.json dan olinadi
const PAYMENT_CONFIG = dbData.payment
const QUICK_AMOUNTS = PAYMENT_CONFIG.quickAmounts
const INITIAL_PAYMENTS = PAYMENT_CONFIG.history

// Logotiplar usul id si bo'yicha tanlanadi
const METHOD_LOGOS = {
    payme: (
        <div className="flex flex-col items-center justify-center leading-none">
            <span className="text-lg font-black text-[#35b8ec] tracking-tight">Pay</span>
            <span className="text-lg font-black text-[#35b8ec] tracking-tight -mt-1">me</span>
        </div>
    ),
    click: (
        <div className="w-12 h-12 rounded-2xl bg-[#0d1b3e] flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-[6px] border-[#00a8e8]" />
        </div>
    ),
    uzum: (
        <div className="w-12 h-12 rounded-2xl bg-[#6b2bf5] flex items-center justify-center">
            <span className="text-white font-black text-2xl leading-none">U</span>
        </div>
    )
}

const PAYMENT_METHODS = PAYMENT_CONFIG.methods.map((method) => ({
    ...method,
    logo: METHOD_LOGOS[method.id] ?? null
}))

// Har bir to'lov JSON ko'rinishida localStorage ga yoziladi
const HISTORY_STORAGE_KEY = 'mars_payments_history'

const loadStoredPayments = () => {
    try {
        const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
        const parsed = raw ? JSON.parse(raw) : []
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

const saveStoredPayments = (items) => {
    try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items))
    } catch {
        // localStorage yopiq bo'lsa sahifa baribir ishlaydi
    }
}

const formatSum = (value) => Number(value || 0).toLocaleString('ru-RU').replace(/,/g, ' ')

const nowString = () => {
    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const Payment = () => {
    const navigate = useNavigate()

    const { profile, fullName } = useProfile()

    const [amount, setAmount] = useState(PAYMENT_CONFIG.defaultAmount)
    const [history, setHistory] = useState(() => [...loadStoredPayments(), ...INITIAL_PAYMENTS])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const numericAmount = Number(String(amount).replace(/\D/g, '')) || 0

    const handleAmountChange = (e) => {
        const digits = e.target.value.replace(/\D/g, '')
        setAmount(digits ? Number(digits) : '')
    }

    const openModal = () => {
        if (numericAmount <= 0) return
        setSelectedMethod(null)
        setIsModalOpen(true)
    }

    const confirmPayment = () => {
        if (!selectedMethod || numericAmount <= 0) return
        setIsSubmitting(true)

        // To'lov tizimiga yuborilgandek kichik kechikish
        setTimeout(() => {
            const newPayment = {
                id: Date.now(),
                amount: numericAmount,
                date: nowString(),
                status: 'Kutilmoqda',
                method: PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name
            }

            // Yangi to'lov JSON tarixiga qo'shilib saqlanadi
            const stored = [newPayment, ...loadStoredPayments()]
            saveStoredPayments(stored)

            setHistory([...stored, ...INITIAL_PAYMENTS])
            setIsSubmitting(false)
            setIsModalOpen(false)
            setSelectedMethod(null)
        }, 600)
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Sarlavha va orqaga qaytish */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2 rounded-2xl transition cursor-pointer"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Ortga
                </button>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">To'lov</h1>
            </div>

            {/* Asosiy 1:1 ustunlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Chap ustun: To'lov ma'lumotlari */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between min-h-[300px]">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-5">To'lov ma'lumotlari</h2>

                        <div className="space-y-4 text-sm">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-gray-500 font-medium">O'quvchi</span>
                                <span className="text-gray-900 font-bold text-right">
                                    {fullName}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-gray-500 font-medium">Filial</span>
                                <span className="text-gray-900 font-bold text-right uppercase">
                                    {profile.branch || profile.groupCode || 'YUNUSABAD'}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-5" />

                        <div className="flex items-center justify-between gap-4">
                            <span className="text-gray-600 font-medium text-sm">To'lov uchun</span>
                            <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                {formatSum(numericAmount)} so'm
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                        Hisobingiz bo'yicha qarzdorlik yo'q
                    </div>
                </div>

                {/* O'ng ustun: Summani kiritish */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-5">Summani kiriting</h2>

                    <div className="relative">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={numericAmount ? formatSum(numericAmount) : ''}
                            onChange={handleAmountChange}
                            placeholder="0"
                            className="w-full bg-white border border-gray-200 focus:border-[#3f882f] focus:ring-4 focus:ring-[#3f882f]/10 rounded-2xl pl-5 pr-16 py-4 text-xl font-bold text-gray-900 outline-none transition"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                            so'm
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {QUICK_AMOUNTS.map((value) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setAmount(value)}
                                className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer ${
                                    numericAmount === value
                                        ? 'border-[#3f882f] bg-[#eefbe8] text-[#3f882f]'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {formatSum(value)} so'm
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={openModal}
                        disabled={numericAmount <= 0}
                        className="w-full mt-6 bg-[#3f882f] hover:bg-[#367527] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base rounded-2xl py-4 flex items-center justify-center gap-2 transition shadow-lg shadow-[#3f882f]/20 cursor-pointer"
                    >
                        To'lov qilish {formatSum(numericAmount)} so'm
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    <p className="text-center text-xs text-gray-400 font-medium mt-4">
                        To'lov xavfsiz kanallar orqali amalga oshiriladi
                    </p>
                </div>
            </div>

            {/* To'lov tarixi */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">To'lov tarixi</h2>

                <div className="divide-y divide-gray-100">
                    {history.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                            <div>
                                <p className="text-base font-bold text-gray-900">
                                    {formatSum(item.amount)} so'm
                                </p>
                                <p className="text-xs text-gray-400 font-medium mt-1">
                                    {item.date}
                                    {item.method && (
                                        <span className="ml-2 text-gray-500">· {item.method}</span>
                                    )}
                                </p>
                            </div>
                            <span className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-700 text-xs font-bold whitespace-nowrap">
                                {item.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* To'lov usulini tanlash modali */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center p-4"
                    onClick={() => !isSubmitting && setIsModalOpen(false)}
                >
                    <div
                        className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900">To'lov usulini tanlang</h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition cursor-pointer"
                                aria-label="Yopish"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" x2="6" y1="6" y2="18" />
                                    <line x1="6" x2="18" y1="6" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {PAYMENT_METHODS.map((method) => {
                                const active = selectedMethod === method.id
                                return (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 py-5 px-3 transition cursor-pointer ${
                                            active
                                                ? 'border-[#3f882f] bg-[#eefbe8]'
                                                : 'border-transparent bg-[#eaf4fb] hover:bg-[#ddeef9]'
                                        }`}
                                    >
                                        <div className="h-12 flex items-center justify-center">{method.logo}</div>
                                        <span className="text-sm font-semibold text-gray-800">{method.name}</span>
                                    </button>
                                )
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={confirmPayment}
                            disabled={!selectedMethod || isSubmitting}
                            className="w-full mt-6 bg-[#8fd17a] hover:bg-[#7fc86a] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base rounded-2xl py-4 flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                            {isSubmitting ? 'Yuborilmoqda...' : 'Tasdiqlash'}
                            {!isSubmitting && (
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Payment
