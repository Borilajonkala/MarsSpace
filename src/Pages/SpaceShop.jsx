import { useEffect, useState } from 'react'
import dbData from '../../db.json'
import { getCoinBalance, setCoinBalance } from '../coinBalance'

const API_URL = 'http://localhost:3000'
const SHOP_STATE_KEY = 'mars_space_shop_state'
const localShopItems = Array.isArray(dbData.shopItems) ? dbData.shopItems : []
const mergeShopItems = (catalogItems, overrides = []) => {
  const overridesById = new Map(overrides.map((item) => [String(item.id), item]))
  const catalogIds = new Set(catalogItems.map((item) => String(item.id)))

  return [
    ...catalogItems.map((item) => ({
      ...item,
      ...overridesById.get(String(item.id)),
    })),
    ...overrides.filter((item) => !catalogIds.has(String(item.id))),
  ]
}

const readSavedShopState = () => {
  try {
    const savedState = JSON.parse(localStorage.getItem(SHOP_STATE_KEY) || 'null')
    return savedState &&
      Array.isArray(savedState.items) &&
      Array.isArray(savedState.orders) &&
      savedState.user
      ? savedState
      : null
  } catch (error) {
    console.error('Ошибка чтения сохранённого состояния магазина:', error)
    return null
  }
}

const readAuthenticatedUser = () => {
  try {
    const storedUser = localStorage.getItem('mars_auth_user') || localStorage.getItem('token')
    return storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    console.error('Ошибка чтения данных пользователя:', error)
    return null
  }
}

const SpaceShop = () => {
  const [savedShopState] = useState(readSavedShopState)
  const [authUser] = useState(readAuthenticatedUser)
  const [active, setActive] = useState('HERO') // 'HERO' | 'SPACE' | 'DIGITAL' | 'HISTORY'
  const [items, setItems] = useState(() =>
    mergeShopItems(localShopItems, savedShopState?.items || [])
  )
  const [user, setUser] = useState(() => ({
    ...(savedShopState?.user || authUser || dbData.currentUser || {}),
    coins: getCoinBalance(authUser),
  }))
  const [orders, setOrders] = useState(
    savedShopState?.orders || (Array.isArray(dbData.orders) ? dbData.orders : [])
  )
  const [buyingId, setBuyingId] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [pendingItem, setPendingItem] = useState(null)
  const [passwordInput, setPasswordInput] = useState('')
  const [purchaseError, setPurchaseError] = useState('')

  useEffect(() => {
    if (savedShopState) return

    fetch(`${API_URL}/shopItems`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load shopItems')
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) setItems(mergeShopItems(localShopItems, data))
      })
      .catch((err) => {
        console.error('Ошибка загрузки shopItems:', err)
        setErrorMsg('Сервер магазина недоступен. Используется локальный каталог.')
      })

    fetch(`${API_URL}/orders`)
      .then((res) => {
        if (!res.ok) return null
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) setOrders(data)
      })
      .catch((err) => console.error('Ошибка загрузки orders:', err))
  }, [savedShopState])

  const handleBuy = (item) => {
    setPendingItem(item)
    setPasswordInput('')
    setPurchaseError('')
    setSuccessMsg('')
  }

  const handleConfirmPurchase = async (event) => {
    event.preventDefault()
    if (!pendingItem || buyingId) return

    if (!authUser?.password) {
      setPurchaseError('Сначала войдите в аккаунт.')
      return
    }

    if (passwordInput !== authUser.password) {
      setPurchaseError('Некорректный пароль')
      return
    }

    const item = items.find((currentItem) => currentItem.id === pendingItem.id)
    const currentCoins = Number(user?.coins)
    if (!item || item.inStock <= 0) {
      setPurchaseError('Товар закончился.')
      return
    }
    if (!Number.isFinite(currentCoins) || currentCoins < item.priceCoins) {
      setPurchaseError('Недостаточно коинов.')
      return
    }

    setBuyingId(item.id)
    setErrorMsg('')
    setPurchaseError('')

    const nextStock = item.inStock - 1
    const nextCoins = currentCoins - item.priceCoins
    const nextItems = items.map((currentItem) =>
      currentItem.id === item.id ? { ...currentItem, inStock: nextStock } : currentItem
    )
    const nextUser = { ...user, coins: nextCoins }
    const order = {
      id: `order-${Date.now()}`,
      itemId: item.id,
      title: item.titleUz || item.name,
      priceCoins: item.priceCoins,
      tab: active,
      purchasedAt: new Date().toISOString(),
    }
    const nextOrders = [order, ...orders]

    try {
      localStorage.setItem(
        SHOP_STATE_KEY,
        JSON.stringify({ items: nextItems, user: nextUser, orders: nextOrders })
      )
      setCoinBalance(nextCoins)

      setItems(nextItems)
      setUser(nextUser)
      setOrders(nextOrders)
      setPendingItem(null)
      setPasswordInput('')

      let savedToServer = true
      let stockUpdated = false
      let coinsUpdated = false
      try {
        const stockRes = await fetch(`${API_URL}/shopItems/${item.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inStock: nextStock }),
        })
        if (!stockRes.ok) throw new Error('Failed to update stock')
        stockUpdated = true

        const userRes = await fetch(`${API_URL}/currentUser`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ coins: nextCoins }),
        })
        if (!userRes.ok) throw new Error('Failed to update coins')
        coinsUpdated = true

        const orderRes = await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        })
        if (!orderRes.ok) throw new Error('Failed to save order')
      } catch (error) {
        savedToServer = false
        console.error('Не удалось синхронизировать покупку с сервером:', error)
        if (coinsUpdated) {
          try {
            const rollbackUserRes = await fetch(`${API_URL}/currentUser`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ coins: currentCoins }),
            })
            if (!rollbackUserRes.ok) throw new Error('Failed to restore coins')
          } catch (rollbackError) {
            console.error('Не удалось отменить списание коинов на сервере:', rollbackError)
          }
        }
        if (stockUpdated) {
          try {
            const rollbackStockRes = await fetch(`${API_URL}/shopItems/${item.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ inStock: item.inStock }),
            })
            if (!rollbackStockRes.ok) throw new Error('Failed to restore stock')
          } catch (rollbackError) {
            console.error('Не удалось восстановить остаток товара на сервере:', rollbackError)
          }
        }
      }

      setSuccessMsg(
        savedToServer
          ? 'Покупка успешно оформлена.'
          : 'Покупка сохранена в этом браузере; сервер магазина недоступен.'
      )
    } catch (error) {
      console.error('Ошибка сохранения покупки:', error)
      setPurchaseError('Не удалось сохранить покупку в этом браузере.')
    } finally {
      setBuyingId(null)
    }
  }

  const filteredItems = items.filter((item) => {
    if (active === 'HERO') {
      return item.category === 'Kiyimlar' || item.category === 'Elektronika'
    }
    if (active === 'SPACE') {
      return item.category === 'Aksessuarlar' || item.category === 'Stickerlar'
    }
    if (active === 'DIGITAL') {
      return !['Kiyimlar', 'Elektronika', 'Aksessuarlar', 'Stickerlar'].includes(item.category)
    }
    return false
  })

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm px-4">
        <div className="navbar-start">
          <div className="dropdown"></div>
        </div>

        <div className="navbar-center flex gap-2">
          <button
            type="button"
            onClick={() => setActive('HERO')}
            className={`btn btn-ghost text-xl ${active === 'HERO' ? 'btn-active' : ''}`}
          >
            HERO SHOP
          </button>
          <button
            type="button"
            onClick={() => setActive('SPACE')}
            className={`btn btn-ghost text-xl ${active === 'SPACE' ? 'btn-active' : ''}`}
          >
            SPACE SHOP
          </button>
          <button
            type="button"
            onClick={() => setActive('DIGITAL')}
            className={`btn btn-ghost text-xl ${active === 'DIGITAL' ? 'btn-active' : ''}`}
          >
            DIGITAL
          </button>
        </div>

        <div className="navbar-end gap-3">
          <ul className="menu menu-horizontal px-1">
            <li>
              <button
                type="button"
                onClick={() => setActive('HISTORY')}
                className={active === 'HISTORY' ? 'active font-bold' : 'font-medium'}
              >
                История покупок
              </button>
            </li>
          </ul>
        </div>
      </div>

      {errorMsg && (
        <div className="max-w-5xl mx-auto px-6 pt-4">
          <div className="alert alert-error text-sm">
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="max-w-5xl mx-auto px-6 pt-4">
          <div className="alert alert-success text-sm">
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      {pendingItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="purchase-dialog-title"
            onSubmit={handleConfirmPurchase}
            className="w-full max-w-sm space-y-4 rounded-2xl bg-base-100 p-6 shadow-2xl"
          >
            <div>
              <h2 id="purchase-dialog-title" className="text-lg font-bold">
                Подтвердите покупку
              </h2>
              <p className="mt-1 text-sm text-base-content/70">
                {pendingItem.titleUz || pendingItem.name} · {pendingItem.priceCoins} 🪙
              </p>
            </div>

            {purchaseError && (
              <p role="alert" className="text-sm font-medium text-error">
                {purchaseError}
              </p>
            )}

            <label className="form-control w-full">
              <span className="label-text mb-2">Введите пароль аккаунта</span>
              <input
                type="password"
                autoComplete="current-password"
                autoFocus
                required
                value={passwordInput}
                onChange={(event) => {
                  setPasswordInput(event.target.value)
                  setPurchaseError('')
                }}
                className="input input-bordered w-full"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={Boolean(buyingId)}
                onClick={() => setPendingItem(null)}
                className="btn btn-ghost"
              >
                Отмена
              </button>
              <button type="submit" disabled={Boolean(buyingId)} className="btn btn-primary">
                {buyingId ? 'Оформление...' : 'Подтвердить'}
              </button>
            </div>
          </form>
        </div>
      )}

      {active !== 'HISTORY' && (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {filteredItems.map((item) => {

const isBuying = buyingId === item.id

            return (
              <div
                key={item.id}
                className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold">{item.titleUz || item.name}</h3>
                  <p className="text-sm text-base-content/70 mt-1 flex items-center gap-1.5">
                    <span className="font-bold text-base-content">{item.priceCoins}</span>
                    <span>🪙</span>
                    <span className="text-base-content/40">|</span>
                    <span>{item.inStock} шт осталось</span>
                  </p>
                </div>

                <button
                  type="button"
                  disabled={item.inStock <= 0 || isBuying}
                  onClick={() => handleBuy(item)}
                  className="text-info font-semibold text-sm flex items-center justify-center gap-1 hover:underline disabled:opacity-40 cursor-pointer"
                >
                  <span>
                    {isBuying
                      ? 'Покупка...'
                      : item.inStock <= 0
                      ? 'Закончилось'
                      : 'Купить'}
                  </span>
                  <span>&gt;</span>
                </button>
              </div>
            )
          })}
        </div>
      )}

      {active === 'HISTORY' && (
        <div className="p-6 max-w-3xl mx-auto">
          <div className="bg-base-100 rounded-2xl border border-base-300 p-5">
            {orders.length === 0 ? (
              <p className="text-base-content/60 text-sm">Покупок пока нет.</p>
            ) : (
              <ul className="divide-y divide-base-300">
                {orders.map((order) => (
                  <li key={order.id} className="py-3 flex justify-between items-center text-sm">
                    <span className="font-semibold">{order.title}</span>
                    <span>
                      {order.priceCoins} 🪙 · {order.tab}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SpaceShop