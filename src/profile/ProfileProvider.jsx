import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { setCoinBalance } from '../coinBalance.jsx'
import { ProfileContext } from './ProfileContext.js'
import {
  COSMETICS,
  FALLBACK_PROFILE,
  clearAuthUser,
  readAuthUser,
  writeAuthUser,
  LEVEL_XP,
  PROFILE_API,
  PROFILE_ID,
  SYNC_RETRY_MS,
  normalizeProfile,
  readCachedProfile,
  readPending,
  request,
  safeArray,
  writeCachedProfile,
  writePending,
} from './profileStore.js'

const cacheProfile = (profile) => {
  writeCachedProfile(profile)
  setCoinBalance(profile.coins)
}

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => readCachedProfile() || FALLBACK_PROFILE)
  const [apiOnline, setApiOnline] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncError, setSyncError] = useState('')
  const [retryNonce, setRetryNonce] = useState(0)
  const [authUser, setAuthUser] = useState(() => readAuthUser())

  const loginUser = useCallback((user) => {
    writeAuthUser(user)
    setAuthUser(user)
    return user
  }, [])

  const logoutUser = useCallback(() => {
    clearAuthUser()
    setAuthUser(null)
  }, [])

  const profileRef = useRef(profile)
  const revisionRef = useRef(0)
  const mountedRef = useRef(true)

  const commitProfile = useCallback((value, { fromServer = false } = {}) => {
    const normalized = normalizeProfile(value)
    profileRef.current = normalized

    if (!fromServer) revisionRef.current += 1
    setProfile(normalized)
    cacheProfile(normalized)
    if (!fromServer) writePending(true)

    return normalized
  }, [])

  const patchServer = useCallback(async (nextProfile) => {
    let response = await request(`${PROFILE_API}/profiles/${PROFILE_ID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextProfile),
    })

    if (response.status === 404) {
      response = await request(`${PROFILE_API}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextProfile),
      })
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response
  }, [])

  const pushProfile = useCallback(
    async (nextProfile, revision) => {
      try {
        const response = await patchServer(nextProfile)

        if (!mountedRef.current) return true

        setApiOnline(true)
        setSyncError('')

        if (revision === revisionRef.current) {
          writePending(false)
          try {
            const saved = normalizeProfile(await response.json())
            profileRef.current = saved
            setProfile(saved)
            cacheProfile(saved)
          } catch {
            cacheProfile(nextProfile)
          }
        }

        return true
      } catch {
        if (!mountedRef.current) return false

        setApiOnline(false)
        setSyncError(
          "json-server ishlamayapti. O'zgarishlar brauzerda saqlandi va server yoqilganda avtomatik yuboriladi."
        )
        return false
      }
    },
    [patchServer]
  )

  const refreshProfile = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true)

      try {
        if (readPending()) {
          const saved = await pushProfile(profileRef.current, revisionRef.current)
          if (!saved) throw new Error('sync failed')
          return true
        }

        const revision = revisionRef.current
        const response = await request(`${PROFILE_API}/profiles/${PROFILE_ID}`)

        if (response.status === 404) {
          const created = await pushProfile(profileRef.current, revision)
          if (!created) throw new Error('create failed')
          return true
        }

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const remote = normalizeProfile(await response.json())

        if (!mountedRef.current) return true

        // Foydalanuvchi yuklash davomida tahrir qilgan bo'lsa, serverdagi eski
        // nusxa uning o'zgarishlarini bosib ketmasligi kerak.
        if (readPending() || revision !== revisionRef.current) {
          await pushProfile(profileRef.current, revisionRef.current)
        } else {
          profileRef.current = remote
          setProfile(remote)
          cacheProfile(remote)
        }

        setApiOnline(true)
        setSyncError('')
        return true
      } catch {
        if (!mountedRef.current) return false

        setApiOnline(false)
        setSyncError(
          "json-server ishlamayapti. O'zgarishlar brauzerda saqlanadi. Serverni ishga tushirish: npm run server"
        )
        return false
      } finally {
        if (mountedRef.current && !silent) setLoading(false)
      }
    },
    [pushProfile]
  )

  useEffect(() => {
    mountedRef.current = true
    const timer = setTimeout(() => refreshProfile(), 0)

    return () => {
      mountedRef.current = false
      clearTimeout(timer)
    }
  }, [refreshProfile, retryNonce])

  // Server keyinroq yoqilsa, local o'zgarishlar avtomatik yuboriladi.
  useEffect(() => {
    if (apiOnline !== false) return undefined

    const retry = () => refreshProfile({ silent: true })
    const timer = setInterval(retry, SYNC_RETRY_MS)

    window.addEventListener('online', retry)
    window.addEventListener('focus', retry)

    return () => {
      clearInterval(timer)
      window.removeEventListener('online', retry)
      window.removeEventListener('focus', retry)
    }
  }, [apiOnline, refreshProfile])

  const saveProfile = useCallback(
    async (updater, { sync = true } = {}) => {
      const current = profileRef.current
      const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater }
      const normalized = commitProfile(next)

      if (!sync) return true
      return pushProfile(normalized, revisionRef.current)
    },
    [commitProfile, pushProfile]
  )

  const retrySync = useCallback(() => {
    setRetryNonce((value) => value + 1)
  }, [])

  const fullName = useMemo(
    () =>
      [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim() ||
      "Mars o'quvchisi",
    [profile.firstName, profile.lastName]
  )

  const backgrounds = useMemo(
    () => COSMETICS.filter((item) => item.type === 'background'),
    []
  )
  const outfits = useMemo(() => COSMETICS.filter((item) => item.type === 'outfit'), [])

  const selectedBackground = useMemo(
    () =>
      backgrounds.find((item) => item.id === profile.selectedBackground) ||
      backgrounds[0] || { name: 'Kosmos', preview: 'midnight' },
    [backgrounds, profile.selectedBackground]
  )

  const selectedOutfit = useMemo(
    () =>
      outfits.find((item) => item.id === profile.selectedOutfit) || outfits[0] || null,
    [outfits, profile.selectedOutfit]
  )

  const level = Math.max(1, Math.floor((Number(profile.xp) || 0) / LEVEL_XP) + 1)
  const xp = Number(profile.xp) || 0
  const coins = Number(profile.coins) || 0

  const isOwned = useCallback(
    (item) => {
      const key = item.type === 'background' ? 'backgrounds' : 'outfits'
      return safeArray(profile.inventory?.[key]).includes(item.id)
    },
    [profile.inventory]
  )

  const value = useMemo(
    () => ({
      profile,
      authUser,
      loginUser,
      logoutUser,
      fullName,
      level,
      xp,
      coins,
      apiOnline,
      loading,
      syncError,
      retrySync,
      refreshProfile,
      saveProfile,
      cosmetics: COSMETICS,
      backgrounds,
      outfits,
      selectedBackground,
      selectedOutfit,
      isOwned,
    }),
    [
      profile,
      authUser,
      loginUser,
      logoutUser,
      fullName,
      level,
      xp,
      coins,
      apiOnline,
      loading,
      syncError,
      retrySync,
      refreshProfile,
      saveProfile,
      backgrounds,
      outfits,
      selectedBackground,
      selectedOutfit,
      isOwned,
    ]
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}
