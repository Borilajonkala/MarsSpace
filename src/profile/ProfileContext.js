import { createContext, useContext } from 'react'

export {
  AUTH_ID_TOKEN_KEY,
  AUTH_STORAGE_KEY,
  COSMETICS,
  DEFAULT_AVATAR,
  FALLBACK_PROFILE,
  LEVEL_XP,
  PROFILE_API,
  PROFILE_CACHE_KEY,
  PROFILE_ID,
  PROFILE_PENDING_KEY,
  clearAuthUser,
  normalizeProfile,
  readAuthToken,
  readAuthUser,
  writeAuthToken,
  writeAuthUser,
  safeArray,
} from './profileStore.js'

export const ProfileContext = createContext(null)

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) throw new Error('useProfile faqat ProfileProvider ichida ishlatiladi.')
  return context
}
