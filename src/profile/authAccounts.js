import dbData from '../../db.json'
import { readRegisteredUsers } from './profileStore.js'

export const AUTH_API = import.meta.env.VITE_PROFILE_API || 'http://localhost:3000'

export const FALLBACK_ACCOUNT = {
  id: 'user-timur',
  login: 'timur',
  password: '12345',
  name: 'Timur',
  role: 'student',
  marsId: 'M-31710',
  profileId: 'profile-current',
  avatar: '/avatar-default.jpg',
}

export const normalizeLogin = (value) => String(value || '').trim().toLowerCase()

const requestWithTimeout = async (url, options = {}, timeout = 1500) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export const fetchRemoteAccount = async (login) => {
  try {
    const response = await requestWithTimeout(
      `${AUTH_API}/users?login=${encodeURIComponent(login)}`
    )
    if (!response.ok) return null

    const rows = await response.json()
    if (!Array.isArray(rows)) return null

    return rows.find((user) => normalizeLogin(user.login) === login) || null
  } catch {
    // json-server o'chirilgan bo'lsa, lokal hisoblar bilan davom etamiz.
    return null
  }
}

export const findLocalAccount = (login) => {
  const users = [
    ...readRegisteredUsers(),
    ...(Array.isArray(dbData.users) ? dbData.users : []),
  ]

  return users.find((user) => normalizeLogin(user.login) === login) || null
}

export const resolveAccount = async (login, { offline = false } = {}) => {
  const remote = offline ? null : await fetchRemoteAccount(login)
  return remote || findLocalAccount(login) || (login === FALLBACK_ACCOUNT.login ? FALLBACK_ACCOUNT : null)
}

export const saveRemoteAccount = async (account, { offline = false } = {}) => {
  if (offline) return { ...account, synced: false }

  try {
    const response = await requestWithTimeout(
      `${AUTH_API}/users`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account),
      },
      3000
    )

    if (!response.ok) return { ...account, synced: false }
    return { ...account, ...(await response.json()), synced: true }
  } catch {
    return { ...account, synced: false }
  }
}
