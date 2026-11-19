// Xakaton sahifasi uchun statik ma'lumotlar

export const TABS = [
    { id: 'home', label: 'Bosh sahifa' },
    { id: 'preparation', label: 'Tayyorgarlik' },
    { id: 'my-team', label: 'Mening jamoam' },
    { id: 'teams', label: 'Jamolar' },
    { id: 'topics', label: 'Mavzular' },
    { id: 'submit', label: 'Ishni topshirish' },
    { id: 'gallery', label: 'Galereya' },
    { id: 'results', label: 'Natijalar' },
    { id: 'certificates', label: 'Sertifikatlar' },
]

export const STEPS = [
    {
        id: 1,
        title: "Jamoa yig'ing",
        hint: '2-4 kishidan iborat jamoa tuzing yoki mavjud jamoaga qo\'shiling',
        tab: 'my-team',
    },
    {
        id: 2,
        title: 'Mavzu tanlang',
        hint: 'Taqdim etilgan mavzulardan birini tanlang yoki o\'z g\'oyangizni taklif qiling',
        tab: 'topics',
    },
    {
        id: 3,
        title: 'Ishni topshiring',
        hint: 'Loyihangizni GitHub va demo havolasi bilan yuboring',
        tab: 'submit',
    },
]

// Ikonkalar QuickActions komponentida id bo'yicha tanlanadi
export const QUICK_ACTIONS = [
    { id: 'create-team', label: 'Jamoa tuzish', tab: 'my-team', dark: true },
    { id: 'suggestions', label: 'Takliflar', tab: 'preparation', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
    { id: 'solo', label: 'Yakka ishtirokchilar', tab: 'teams', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
    { id: 'gallery', label: 'Galereya', tab: 'gallery', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
]

export const PREPARATION_ITEMS = [
    { id: 'p1', title: 'GitHub hisobini tayyorlash', hint: 'Barcha jamoa a\'zolari uchun hisob oching' },
    { id: 'p2', title: 'Jamoa a\'zolarini ro\'yxatdan o\'tkazish', hint: 'Mars ID orqali jamoani tasdiqlang' },
    { id: 'p3', title: 'Mavzuni yakuniy tanlash', hint: 'Mavzu tanlangach o\'zgartirish uchun mentor ruxsati kerak' },
    { id: 'p4', title: 'Loyiha rejasini yozish', hint: 'Bosqichlar, texnologiyalar va vaqt taqsimoti' },
    { id: 'p5', title: 'Demo video tayyorlash', hint: 'Maksimum 3 daqiqa, loyiha ishlashini ko\'rsating' },
    { id: 'p6', title: 'Loyihani topshirish formasi', hint: 'Havolalar va tavsifni to\'ldiring' },
]

export const RESOURCES = [
    { id: 'r1', title: 'Xakaton qoidalari (PDF)', meta: '1.2 MB · O\'zbek tilida' },
    { id: 'r2', title: 'Baholash mezonlari', meta: 'Dizayn 30% · Texnika 40% · Taqdimot 30%' },
    { id: 'r3', title: 'Loyiha shabloni (GitHub)', meta: 'React + Vite starter' },
    { id: 'r4', title: 'Mentorlar bilan aloqa', meta: 'Ish kunlari 10:00 - 19:00' },
]

export const TOPICS = [
    {
        id: 'topic-ai',
        title: 'AI yordamchi chatbot',
        category: 'AI / ML',
        level: "O'rta",
        emoji: '🤖',
        description: "O'quvchilarga dars mavzularini tushuntiruvchi va testlar tuzuvchi aqlli yordamchi.",
        teamSize: '3-4 kishi',
        spots: 12,
    },
    {
        id: 'topic-eduverse',
        title: 'Eduverse platformasi',
        category: 'Web',
        level: 'Oson',
        emoji: '🎓',
        description: "Dars jadvali, uy vazifalari va reytingni bir joyda ko'rsatuvchi ta'lim platformasi.",
        teamSize: '2-3 kishi',
        spots: 20,
    },
    {
        id: 'topic-eco',
        title: 'EcoTrack — ekologik ilova',
        category: 'Mobile',
        level: "O'rta",
        emoji: '🌱',
        description: "Shahar chiqindilarini saralash va qayta ishlash punktlarini xaritada ko'rsatish.",
        teamSize: '3-4 kishi',
        spots: 8,
    },
    {
        id: 'topic-translit',
        title: 'Kirill–lotin konverteri',
        category: 'Utility',
        level: 'Oson',
        emoji: '🔤',
        description: "Matn va hujjatlarni kirill alifbosidan lotin alifbosiga o'giruvchi tezkor vosita.",
        teamSize: '1-2 kishi',
        spots: 25,
    },
    {
        id: 'topic-shop',
        title: 'Mars Shop marketplace',
        category: 'E-commerce',
        level: 'Qiyin',
        emoji: '🛒',
        description: "Mars coinlar evaziga mahsulot xarid qilish va savat bilan ishlash tizimi.",
        teamSize: '3-5 kishi',
        spots: 6,
    },
    {
        id: 'topic-game',
        title: "O'yin: Space Runner",
        category: 'Game Dev',
        level: "O'rta",
        emoji: '🚀',
        description: "Brauzerda ishlaydigan, to'siqlardan qochishga asoslangan 2D o'yin.",
        teamSize: '2-4 kishi',
        spots: 10,
    },
]

export const TEAMS = [
    {
        id: 'team-nova',
        name: 'Nova Coders',
        project: 'AI yordamchi chatbot',
        branch: 'Chilonzor',
        max: 4,
        members: ['Islomov H.', 'Hasanov A.', 'Erkinova M.'],
    },
    {
        id: 'team-pixel',
        name: 'Pixel Squad',
        project: 'Mars Shop marketplace',
        branch: 'Yunusobod',
        max: 4,
        members: ['Toshmatov D.', 'Karimov J.', 'Saidova N.', 'Yusupov U.'],
    },
    {
        id: 'team-orbit',
        name: 'Orbit Lab',
        project: 'EcoTrack — ekologik ilova',
        branch: 'Beruniy',
        max: 3,
        members: ['Rahimov S.', 'Qodirova L.'],
    },
    {
        id: 'team-bytes',
        name: 'Byte Busters',
        project: "O'yin: Space Runner",
        branch: 'Sergeli',
        max: 4,
        members: ['Nazarov B.', 'Aliyeva D.', 'Tursunov M.'],
    },
]

export const GALLERY = [
    { id: 'g1', title: 'Ochilish marosimi', url: 'https://picsum.photos/seed/mars-hack-open/800/600' },
    { id: 'g2', title: 'Jamoa ish jarayonida', url: 'https://picsum.photos/seed/mars-hack-work/800/600' },
    { id: 'g3', title: 'Mentorlar maslahati', url: 'https://picsum.photos/seed/mars-hack-mentor/800/600' },
    { id: 'g4', title: 'Taqdimot kuni', url: 'https://picsum.photos/seed/mars-hack-demo/800/600' },
    { id: 'g5', title: "G'oliblar", url: 'https://picsum.photos/seed/mars-hack-win/800/600' },
    { id: 'g6', title: 'Yakuniy foto', url: 'https://picsum.photos/seed/mars-hack-final/800/600' },
]

export const RESULTS = [
    { place: 1, team: 'Nova Coders', project: 'AI yordamchi chatbot', score: 96, prize: '🥇 MacBook Air M3' },
    { place: 2, team: 'Pixel Squad', project: 'Mars Shop marketplace', score: 91, prize: '🥈 iPhone 16' },
    { place: 3, team: 'Orbit Lab', project: 'EcoTrack — ekologik ilova', score: 87, prize: '🥉 AirPods Pro' },
    { place: 4, team: 'Byte Busters', project: "O'yin: Space Runner", score: 82, prize: 'Mars coinlar' },
]

export const CERTIFICATES = [
    { id: 'c1', title: 'Ishtirok sertifikati', subtitle: 'Mars Online Hackathon 2026', code: 'MH26-PART-1042' },
    { id: 'c2', title: 'Mentor minnatdorchiligi', subtitle: 'Jamoa rahbari sifatida', code: 'MH26-MENT-0317' },
    { id: 'c3', title: 'Top 10 jamoa', subtitle: 'Natijalar bo\'yicha', code: 'MH26-TOP10-0088' },
]

export const WORK_STORAGE_KEY = 'mars_hackathon_work'
export const TOPIC_STORAGE_KEY = 'mars_hackathon_topic'
export const PREP_STORAGE_KEY = 'mars_hackathon_prep'
export const TEAM_STORAGE_KEY = 'mars_hackathon_team'
export const MEMBERSHIP_STORAGE_KEY = 'mars_hackathon_memberships'

export const loadJSON = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch {
        return fallback
    }
}

export const saveJSON = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {
        // localStorage yopiq bo'lsa sahifa baribir ishlaydi
    }
}
