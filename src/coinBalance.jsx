export const COIN_BALANCE_STORAGE_KEY = 'mars_coins_balance'
export const COIN_BALANCE_EVENT = 'mars:coins-updated'
export const DEFAULT_COIN_BALANCE = 239

export const getCoinBalance = (user) => {
  const storedCoins = localStorage.getItem(COIN_BALANCE_STORAGE_KEY)
  if (storedCoins !== null && storedCoins.trim() !== '') {
    const parsedCoins = Number(storedCoins)
    if (Number.isFinite(parsedCoins)) return parsedCoins
  }

  return Number.isFinite(user?.coins) ? user.coins : DEFAULT_COIN_BALANCE
}

export const setCoinBalance = (coins) => {
  localStorage.setItem(COIN_BALANCE_STORAGE_KEY, String(coins))
  window.dispatchEvent(new Event(COIN_BALANCE_EVENT))
}
