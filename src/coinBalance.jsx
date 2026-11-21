export const COIN_BALANCE_STORAGE_KEY = 'mars_coins_balance'

export const setCoinBalance = (coins) => {
  try {
    localStorage.setItem(COIN_BALANCE_STORAGE_KEY, String(coins))
  } catch {
    // Xotira yopilgan bo'lsa, profil holati baribir kontekstda saqlanadi.
  }
}
