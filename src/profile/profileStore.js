import dbData from '../../db.json'

export const PROFILE_API = import.meta.env.VITE_PROFILE_API || 'http://localhost:3000'
export const PROFILE_ID = 'profile-current'
export const PROFILE_CACHE_KEY = 'mars_profile_cache'
export const PROFILE_PENDING_KEY = 'mars_profile_pending'
export const AUTH_STORAGE_KEY = 'mars_auth_user'
export const AUTH_TOKEN_KEY = 'token'
export const AUTH_ID_TOKEN_KEY = 'mars_id_token'
export const REGISTERED_USERS_KEY = 'mars_registered_users'
export const DEFAULT_AVATAR = '/avatar-default.jpg'
export const LEVEL_XP = 700
export const SYNC_RETRY_MS = 12000

export const safeArray = (value) => (Array.isArray(value) ? value : [])

// Eski kiyim id'lari yangi qahramonlar id'lariga ko'chiriladi.
export const OUTFIT_ALIASES = {
  'outfit-cosmonaut': 'outfit-wahlberg',
  'outfit-navigator': 'outfit-laid',
  'outfit-cadet': 'outfit-lachowski',
}

const mapOutfitId = (id) => OUTFIT_ALIASES[id] || id

const REQUEST_TIMEOUT = 3800

export const request = async (url, options = {}, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

const cleanAvatar = (value, fallback = DEFAULT_AVATAR) => {
  const avatar = typeof value === 'string' ? value.trim() : ''

  // Eski dicebear "dinozavr" avatarlari yangi odam fotografiyasiga almashtiriladi.
  if (!avatar || avatar.includes('dicebear.com/7.x/bottts')) return fallback
  return avatar
}

export const normalizeProfile = (value, base) => {
  const raw = value && typeof value === 'object' ? value : {}
  const fallback = base || FALLBACK_PROFILE
  const inventory = raw.inventory && typeof raw.inventory === 'object' ? raw.inventory : {}
  const baseInventory = fallback.inventory || {}
  const xp = Number.isFinite(Number(raw.xp)) ? Number(raw.xp) : Number(fallback.xp) || 0
  const levelFromXp = Math.floor(xp / LEVEL_XP) + 1

  return {
    ...fallback,
    ...raw,
    id: PROFILE_ID,
    nickname: String(raw.nickname || fallback.nickname || 'mars_user').replace(/^@+/, ''),
    firstName: raw.firstName || fallback.firstName || '',
    lastName: raw.lastName || fallback.lastName || '',
    bio: typeof raw.bio === 'string' ? raw.bio : fallback.bio || '',
    avatar: cleanAvatar(raw.avatar, fallback.avatar || DEFAULT_AVATAR),
    level: Math.max(1, Number(raw.level) || Number(fallback.level) || 1, levelFromXp),
    xp,
    coins: Number.isFinite(Number(raw.coins)) ? Number(raw.coins) : Number(fallback.coins) || 0,
    lastActivity: raw.lastActivity || fallback.lastActivity || "Ma'lum emas",
    selectedBackground: raw.selectedBackground || fallback.selectedBackground || 'bg-desert',
    selectedOutfit: mapOutfitId(
      raw.selectedOutfit || fallback.selectedOutfit || 'outfit-wahlberg'
    ),
    inventory: {
      backgrounds: Array.isArray(inventory.backgrounds)
        ? inventory.backgrounds
        : safeArray(baseInventory.backgrounds),
      outfits: safeArray(
        Array.isArray(inventory.outfits) ? inventory.outfits : baseInventory.outfits
      ).map(mapOutfitId),
    },
    certificates: Array.isArray(raw.certificates)
      ? raw.certificates
      : safeArray(fallback.certificates),
    badges: Array.isArray(raw.badges) ? raw.badges : safeArray(fallback.badges),
    history: Array.isArray(raw.history) ? raw.history : safeArray(fallback.history),
  }
}

const currentUser = dbData.currentUser || {}
const dbProfile = safeArray(dbData.profiles)[0] || {}

const BASE_PROFILE = {
  id: PROFILE_ID,
  userId: currentUser.id || 'std-current',
  marsId: currentUser.marsId || 'M-31710',
  groupCode: currentUser.groupCode || 'YB-3171',
  nickname: 'siz_mars',
  firstName: currentUser.fullName || 'Siz',
  lastName: '',
  bio: '',
  avatar: DEFAULT_AVATAR,
  level: 1,
  xp: Number(currentUser.xp) || 0,
  coins: Number(currentUser.coins) || 0,
  lastActivity: "Ma'lum emas",
  selectedBackground: 'bg-desert',
  selectedOutfit: 'outfit-wahlberg',
  inventory: { backgrounds: ['bg-desert'], outfits: ['outfit-wahlberg'] },
  certificates: [],
  badges: [],
  history: [],
}

export const FALLBACK_PROFILE = normalizeProfile(
  {
    ...BASE_PROFILE,
    ...dbProfile,
    avatar: cleanAvatar(dbProfile.avatar),
  },
  BASE_PROFILE
)

const FALLBACK_COSMETICS = [
  {
    id: 'bg-desert',
    type: 'background',
    name: "Cho'l gorizonti",
    priceCoins: 0,
    preview: 'desert',
  },
  {
    id: 'outfit-wahlberg',
    type: 'outfit',
    name: 'Mark Wahlberg',
    priceCoins: 0,
    preview: '/outfits/wahlberg.jpg',
  },
]

export const COSMETICS =
  safeArray(dbData.cosmetics).length > 0 ? dbData.cosmetics : FALLBACK_COSMETICS

export const readCachedProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY)
    return raw ? normalizeProfile(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export const writeCachedProfile = (profile) => {
  try {
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile))
  } catch {
    // Xotira yopilgan yoki to'lgan bo'lsa, interfeys ishlashda davom etadi.
  }
}

export const readAuthUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_TOKEN_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const writeAuthUser = (user) => {
  try {
    const payload = JSON.stringify(user)
    localStorage.setItem(AUTH_STORAGE_KEY, payload)
    // Eski PrivateRouter va sahifalar `token` kalitini tekshiradi.
    localStorage.setItem(AUTH_TOKEN_KEY, payload)
  } catch {
    // Xotira yopilgan bo'lsa, sessiya faqat kontekstda saqlanadi.
  }
}

export const readAuthToken = () => {
  try {
    return localStorage.getItem(AUTH_ID_TOKEN_KEY)
  } catch {
    return null
  }
}

export const writeAuthToken = (token) => {
  try {
    if (token) localStorage.setItem(AUTH_ID_TOKEN_KEY, String(token))
    else localStorage.removeItem(AUTH_ID_TOKEN_KEY)
  } catch {
    // Xotira yopilgan bo'lsa, token faqat joriy sessiyada saqlanadi.
  }
}

export const clearAuthUser = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_ID_TOKEN_KEY)
  } catch {
    // Xotira mavjud bo'lmasa, tozalash shart emas.
  }
}

export const readRegisteredUsers = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const upsertRegisteredUser = (user) => {
  if (!user || !user.login) return

  try {
    const login = String(user.login).trim().toLowerCase()
    const users = readRegisteredUsers().filter(
      (item) => String(item.login || '').trim().toLowerCase() !== login
    )
    users.push(user)
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users))
  } catch {
    // Xotira yopilgan bo'lsa, hisob faqat joriy sessiyada ishlaydi.
  }
}

export const readPending = () => {
  try {
    return localStorage.getItem(PROFILE_PENDING_KEY) === '1'
  } catch {
    return false
  }
}

export const writePending = (value) => {
  try {
    if (value) localStorage.setItem(PROFILE_PENDING_KEY, '1')
    else localStorage.removeItem(PROFILE_PENDING_KEY)
  } catch {
    // Xotira mavjud bo'lmasa, keyingi urinishda server bilan solishtiriladi.
  }
}
