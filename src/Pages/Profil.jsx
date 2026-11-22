import { useEffect, useState } from 'react'
import {
  LuActivity,
  LuArrowRight,
  LuAward,
  LuBadgeCheck,
  LuCheck,
  LuChevronRight,
  LuClock,
  LuCoins,
  LuFlame,
  LuHistory,
  LuImage,
  LuLoader,
  LuLock,
  LuMedal,
  LuPencil,
  LuRocket,
  LuShare2,
  LuShirt,
  LuShoppingBag,
  LuSparkles,
  LuTarget,
  LuTrophy,
  LuUpload,
  LuUser,
  LuX,
} from 'react-icons/lu'
import {
  DEFAULT_AVATAR,
  LEVEL_XP,
  safeArray,
  useProfile,
} from '../profile/ProfileContext.js'

const formatDateTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const withHistory = (nextProfile, title, description) => {
  const date = new Date()
  const entry = {
    id: `hist-${date.getTime()}`,
    title,
    description,
    date: date.toISOString(),
  }

  return {
    ...nextProfile,
    lastActivity: `${title} · ${formatDateTime(entry.date)}`,
    history: [entry, ...safeArray(nextProfile.history)].slice(0, 20),
  }
}

const badgeIcon = (icon) => {
  if (icon === 'exam') return <LuAward aria-hidden="true" />
  if (icon === 'streak') return <LuFlame aria-hidden="true" />
  if (icon === 'battle') return <LuTrophy aria-hidden="true" />
  return <LuTarget aria-hidden="true" />
}

const Modal = ({ title, subtitle, wide = false, onClose, children }) => (
  <div className="pfx-overlay" onClick={onClose} role="presentation">
    <div
      className={`pfx-modal${wide ? ' wide' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => event.stopPropagation()}
    >
      <header className="pfx-modal-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <button type="button" className="pfx-icon-btn" onClick={onClose} aria-label="Yopish">
          <LuX aria-hidden="true" />
        </button>
      </header>
      <div className="pfx-modal-body">{children}</div>
    </div>
  </div>
)

const Profil = () => {
  const {
    profile,
    fullName,
    level,
    xp,
    coins,
    apiOnline,
    loading,
    syncError,
    retrySync,
    saveProfile,
    cosmetics,
    backgrounds,
    outfits,
    selectedBackground,
    selectedOutfit,
    isOwned,
  } = useProfile()

  const [modal, setModal] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [editError, setEditError] = useState('')
  const [saving, setSaving] = useState('')
  const [shopMessage, setShopMessage] = useState(null)
  const [shared, setShared] = useState(false)

  const xpInLevel = Math.max(0, xp - (level - 1) * LEVEL_XP)
  const levelPct = Math.min(100, Math.round((xpInLevel / LEVEL_XP) * 100))
  const certificates = safeArray(profile.certificates)
  const badges = safeArray(profile.badges)
  const history = safeArray(profile.history)
  const doneCertificates = certificates.filter((item) => item.status === 'done').length
  const outfitTone = (selectedOutfit?.id || 'outfit-wahlberg').replace('outfit-', '')

  // Modal Escape bilan yopiladi.
  useEffect(() => {
    if (!modal) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setModal(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [modal])

  // "Ulashildi" holati avtomatik qaytadi.
  useEffect(() => {
    if (!shared) return undefined
    const timer = setTimeout(() => setShared(false), 2400)
    return () => clearTimeout(timer)
  }, [shared])

  const openEdit = () => {
    setEditError('')
    setEditForm({
      nickname: profile.nickname || '',
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      bio: profile.bio || '',
      avatar: profile.avatar || DEFAULT_AVATAR,
    })
    setModal('edit')
  }

  const handleAvatarFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setEditError('Faqat rasm fayllarini yuklash mumkin.')
      return
    }

    if (file.size > 512 * 1024) {
      setEditError('Rasm hajmi 512 KB dan oshmasligi kerak.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setEditForm((current) =>
        current ? { ...current, avatar: String(reader.result) } : current
      )
      setEditError('')
    }
    reader.onerror = () => setEditError("Rasmni o'qib bo'lmadi. Boshqa faylni tanlang.")
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async (event) => {
    event.preventDefault()
    if (!editForm || saving) return

    const nickname = editForm.nickname.trim().replace(/^@+/, '')
    if (!nickname) {
      setEditError('Nikni kiriting.')
      return
    }

    const nextProfile = withHistory(
      {
        ...profile,
        nickname,
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        bio: editForm.bio.trim(),
        avatar: editForm.avatar.trim() || profile.avatar,
      },
      'Profil tahrirlandi',
      'Ism, nik va biografiya yangilandi.'
    )

    setSaving('edit')
    await saveProfile(nextProfile)
    setSaving('')
    setModal(null)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/profile`
    const shareData = {
      title: `${fullName} · Mars Space`,
      text: "Mars Space'dagi profilim bilan tanishing.",
      url,
    }

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(url)
      }
    } catch (error) {
      if (error?.name === 'AbortError') return

      const area = document.createElement('textarea')
      area.value = url
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }

    setShared(true)
  }

  const applyCosmetic = async (item) => {
    if (!isOwned(item) || saving) return

    const nextProfile = withHistory(
      {
        ...profile,
        selectedBackground:
          item.type === 'background' ? item.id : profile.selectedBackground,
        selectedOutfit: item.type === 'outfit' ? item.id : profile.selectedOutfit,
      },
      item.type === 'background' ? "Fon o'zgartirildi" : "Kiyim o'zgartirildi",
      item.name
    )

    setSaving(`apply-${item.id}`)
    await saveProfile(nextProfile)
    setSaving('')
    setModal(null)
  }

  const applyAvatar = async (item) => {
    if (!isOwned(item) || saving) return

    const nextProfile = withHistory(
      { ...profile, avatar: item.preview },
      'Avatar yangilandi',
      `${item.name} surati avatarga qo'yildi.`
    )

    setSaving(`avatar-${item.id}`)
    const savedToDb = await saveProfile(nextProfile)
    setSaving('')
    setShopMessage({
      type: savedToDb ? 'success' : 'info',
      text: savedToDb
        ? "Surat avatarga qo'yildi va db.json'ga saqlandi."
        : "Surat avatarga qo'yildi, lekin faqat brauzerda saqlandi.",
    })
  }

  const buyCosmetic = async (item) => {
    if (isOwned(item) || saving) return

    const price = Number(item.priceCoins) || 0
    if (coins < price) {
      setShopMessage({ type: 'error', text: 'Coin yetarli emas.' })
      return
    }

    const key = item.type === 'background' ? 'backgrounds' : 'outfits'
    const nextProfile = withHistory(
      {
        ...profile,
        coins: coins - price,
        inventory: {
          ...profile.inventory,
          [key]: [...safeArray(profile.inventory?.[key]), item.id],
        },
        selectedBackground:
          item.type === 'background' ? item.id : profile.selectedBackground,
        selectedOutfit: item.type === 'outfit' ? item.id : profile.selectedOutfit,
      },
      'Yangi buyum',
      `${item.name} sotib olindi va qo'llanildi.`
    )

    setSaving(`buy-${item.id}`)
    const savedToDb = await saveProfile(nextProfile)
    setSaving('')
    setShopMessage({
      type: savedToDb ? 'success' : 'info',
      text: savedToDb
        ? "Xarid amalga oshirildi va db.json'ga saqlandi."
        : "Xarid brauzerda saqlandi. json-server yoqilmagan.",
    })
  }

  const openShop = () => {
    setShopMessage(null)
    setModal('shop')
  }

  const openBackgrounds = () => {
    setShopMessage(null)
    setModal('backgrounds')
  }

  const openOutfits = () => {
    setShopMessage(null)
    setModal('outfits')
  }

  return (
    <div className="pfx-page">
      <div className="pfx-cosmos" aria-hidden="true">
        <span className="pfx-stars" />
        <span className="pfx-nebula one" />
        <span className="pfx-nebula two" />
        <span className="pfx-planet" />
      </div>

      <div className="pfx-shell">
        {(loading || syncError) && (
          <div className={`pfx-banner${syncError ? ' warning' : ''}`} role="status">
            <span>
              {syncError ||
                "Profil ma'lumotlari yuklanmoqda. json-server ishlayotganiga ishonch hosil qiling."}
            </span>
            {syncError && (
              <button type="button" onClick={retrySync}>
                <LuLoader aria-hidden="true" />
                Qayta urinish
              </button>
            )}
          </div>
        )}

        {/* Yuqori qator: profil va daraja */}
        <section className="pfx-top">
          <article className="pfx-card pfx-profile-card">
            <div className="pfx-avatar">
              <img
                src={profile.avatar || DEFAULT_AVATAR}
                alt={`${fullName} avatari`}
                onError={(event) => {
                  event.currentTarget.src = DEFAULT_AVATAR
                }}
              />
              <span className="pfx-avatar-check" aria-hidden="true">
                <LuCheck />
              </span>
            </div>

            <div className="pfx-profile-info">
              <span className="pfx-nickname">@{profile.nickname || 'mars_user'}</span>
              <h1>{fullName}</h1>
              <p className={`pfx-bio${profile.bio ? '' : ' empty'}`}>
                {profile.bio ||
                  "Bu yerda o'quvchi haqida qisqacha ma'lumot (bio) bo'ladi..."}
              </p>
              <div className="pfx-profile-meta">
                <span>
                  <LuUser aria-hidden="true" />
                  {profile.marsId || 'M-31710'}
                </span>
                <span>
                  <LuMedal aria-hidden="true" />
                  {profile.groupCode || 'YB-3171'}
                </span>
              </div>
            </div>
          </article>

          <aside className="pfx-card pfx-side-card">
            <div className="pfx-side-head">
              <span className="pfx-mini-badge" aria-label="Mars profili">
                <LuSparkles aria-hidden="true" />
              </span>
              <button type="button" className="pfx-edit-btn" onClick={openEdit}>
                <LuPencil aria-hidden="true" />
                Tahrirlash
              </button>
            </div>

            <div className="pfx-level-row">
              <span className="pfx-level-badge">
                <LuRocket aria-hidden="true" />
                {level} Level
              </span>
              <span className="pfx-level-xp">
                {xpInLevel} / {LEVEL_XP} XP
              </span>
            </div>

            <div className="pfx-progress" aria-hidden="true">
              <span style={{ width: `${levelPct}%` }} />
            </div>

            <div className="pfx-side-meta">
              <span className="pfx-coin">
                <LuCoins aria-hidden="true" />
                {coins.toLocaleString('en-US')} coin
              </span>
              <span className={`pfx-status-dot${apiOnline === false ? ' offline' : ''}`}>
                {apiOnline === false ? 'Ofline' : 'Faol'}
              </span>
            </div>
          </aside>
        </section>

        {/* O'rta qator: sertifikatlar va oxirgi faollik */}
        <section className="pfx-middle">
          <button
            type="button"
            className="pfx-card pfx-link-card"
            onClick={() => setModal('certificates')}
          >
            <span className="pfx-icon-box">
              <LuBadgeCheck aria-hidden="true" />
            </span>
            <span className="pfx-link-text">
              <b>Sertifikatlar</b>
              <small>Mars IT School tomonidan berilgan sertifikatlar</small>
            </span>
            <span className="pfx-count">{doneCertificates}</span>
            <LuArrowRight className="pfx-link-arrow" aria-hidden="true" />
          </button>

          <div className="pfx-card pfx-link-card static">
            <span className="pfx-icon-box accent">
              <LuActivity aria-hidden="true" />
            </span>
            <span className="pfx-link-text">
              <b>Oxirgi faollik</b>
              <small>{profile.lastActivity || "Ma'lum emas"}</small>
            </span>
            <span className="pfx-activity-pulse" aria-hidden="true" />
          </div>
        </section>

        {/* Asosiy qator: sahna va belgilar */}
        <section className="pfx-main">
          <div className="pfx-card pfx-scene-card">
            <div className={`pfx-scene pfx-bg-${selectedBackground.preview || 'midnight'}`}>
              <span className="pfx-scene-stars" aria-hidden="true" />
              <div className="pfx-scene-chips">
                <span className="pfx-scene-chip">
                  <LuImage aria-hidden="true" />
                  {selectedBackground.name}
                </span>
                <span className="pfx-scene-chip outfit">
                  <LuShirt aria-hidden="true" />
                  {selectedOutfit?.name || 'Kiyim tanlanmagan'}
                </span>
              </div>

              <div className={`pfx-character pfx-outfit-${outfitTone}`}>
                <img
                  src={profile.avatar || DEFAULT_AVATAR}
                  alt={`${fullName} avatari`}
                  onError={(event) => {
                    event.currentTarget.src = DEFAULT_AVATAR
                  }}
                />
                <span className="pfx-character-shadow" aria-hidden="true" />
              </div>

              <div className="pfx-scene-actions">
                <button type="button" onClick={openBackgrounds}>
                  <LuImage aria-hidden="true" />
                  <span>Fon</span>
                </button>
                <button type="button" onClick={openOutfits}>
                  <LuShirt aria-hidden="true" />
                  <span>Kiyim</span>
                </button>
                <button type="button" onClick={openShop}>
                  <LuShoppingBag aria-hidden="true" />
                  <span>Do&apos;kon</span>
                </button>
                <button type="button" onClick={handleShare}>
                  {shared ? <LuCheck aria-hidden="true" /> : <LuShare2 aria-hidden="true" />}
                  <span>{shared ? 'Nusxalandi' : 'Ulashish'}</span>
                </button>
              </div>
            </div>
          </div>

          <aside className="pfx-card pfx-badges-card">
            <header className="pfx-card-head">
              <div>
                <h2>Belgilar</h2>
                <p>{badges.length} ta yutuq</p>
              </div>
              <button type="button" className="pfx-ghost-btn" onClick={() => setModal('badges')}>
                Yutuqlar
                <LuArrowRight aria-hidden="true" />
              </button>
            </header>

            <div className="pfx-badge-grid">
              {badges.slice(0, 6).map((badge) => (
                <div key={badge.id || `${badge.title}-${badge.count}`} className="pfx-badge">
                  <span className="pfx-badge-icon" aria-hidden="true">
                    {badgeIcon(badge.icon)}
                  </span>
                  <b>
                    {badge.count || 1}x {badge.title}
                  </b>
                  <small>{badge.icon === 'streak' ? 'Faollik seriyasi' : 'Topshiriq'}</small>
                </div>
              ))}
              {badges.length === 0 && (
                <p className="pfx-empty">Hozircha belgilar yo'q.</p>
              )}
            </div>

            <button type="button" className="pfx-all-link" onClick={() => setModal('badges')}>
              Barcha belgilar
              <LuChevronRight aria-hidden="true" />
            </button>
          </aside>
        </section>

        {/* Pastki qator: tarix */}
        <section className="pfx-card pfx-history-card">
          <header className="pfx-card-head">
            <div>
              <h2>Tarix</h2>
              <p>Profil va o'quv faoliyati bo'yicha yozuvlar</p>
            </div>
            <span className="pfx-count">{history.length}</span>
          </header>

          {history.length > 0 ? (
            <ol className="pfx-timeline">
              {history.slice(0, 6).map((entry) => (
                <li key={entry.id || `${entry.title}-${entry.date}`}>
                  <span className="pfx-timeline-icon" aria-hidden="true">
                    <LuHistory />
                  </span>
                  <div>
                    <b>{entry.title}</b>
                    {entry.description && <p>{entry.description}</p>}
                  </div>
                  <time dateTime={entry.date}>
                    <LuClock aria-hidden="true" />
                    {formatDateTime(entry.date)}
                  </time>
                </li>
              ))}
            </ol>
          ) : (
            <p className="pfx-empty">Hozircha tarix yozuvlari yo'q.</p>
          )}
        </section>
      </div>

      {/* ------------------------------- Modallar ------------------------------- */}
      {modal === 'edit' && editForm && (
        <Modal
          title="Profilni tahrirlash"
          subtitle="O'zgarishlar darhol saqlanadi: db.json yoki brauzer xotirasi"
          onClose={() => setModal(null)}
          wide
        >
          <form className="pfx-form" onSubmit={handleSaveProfile}>
            <div className="pfx-edit-avatar">
              <img
                src={editForm.avatar || DEFAULT_AVATAR}
                alt="Avatar ko'rinishi"
                onError={(event) => {
                  event.currentTarget.src = DEFAULT_AVATAR
                }}
              />
              <div>
                <label className="pfx-upload-btn">
                  <LuUpload aria-hidden="true" />
                  Rasm yuklash
                  <input type="file" accept="image/*" onChange={handleAvatarFile} />
                </label>
                <p>JPG, PNG yoki SVG. Maksimal hajm 512 KB.</p>
              </div>
            </div>

            <label>
              Avatar URL
              <input
                type="url"
                value={editForm.avatar.startsWith('data:') ? '' : editForm.avatar}
                onChange={(event) =>
                  setEditForm((current) =>
                    current ? { ...current, avatar: event.target.value } : current
                  )
                }
                placeholder={
                  editForm.avatar.startsWith('data:')
                    ? 'Fayl yuklandi. Yangi URL kiritishingiz mumkin.'
                    : 'https://...'
                }
              />
            </label>

            <label>
              Nik
              <input
                type="text"
                value={editForm.nickname}
                onChange={(event) =>
                  setEditForm((current) =>
                    current ? { ...current, nickname: event.target.value } : current
                  )
                }
                placeholder="@mars_user"
                maxLength={32}
              />
            </label>

            <div className="pfx-form-row">
              <label>
                Ism
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(event) =>
                    setEditForm((current) =>
                      current ? { ...current, firstName: event.target.value } : current
                    )
                  }
                  placeholder="Ism"
                  maxLength={60}
                />
              </label>
              <label>
                Familiya
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(event) =>
                    setEditForm((current) =>
                      current ? { ...current, lastName: event.target.value } : current
                    )
                  }
                  placeholder="Familiya"
                  maxLength={60}
                />
              </label>
            </div>

            <label>
              Biografiya
              <textarea
                value={editForm.bio}
                onChange={(event) =>
                  setEditForm((current) =>
                    current ? { ...current, bio: event.target.value } : current
                  )
                }
                placeholder="Bu yerda o'quvchi haqida qisqacha ma'lumot (bio) bo'ladi..."
                rows={4}
                maxLength={320}
              />
            </label>

            {editError && <p className="pfx-form-error">{editError}</p>}

            <div className="pfx-form-actions">
              <button type="button" className="pfx-btn ghost" onClick={() => setModal(null)}>
                Bekor qilish
              </button>
              <button type="submit" className="pfx-btn primary" disabled={saving === 'edit'}>
                {saving === 'edit' ? (
                  <>
                    <LuLoader className="pfx-spin" aria-hidden="true" />
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <LuCheck aria-hidden="true" />
                    Saqlash
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'certificates' && (
        <Modal
          title="Sertifikatlar"
          subtitle="Mars IT School tomonidan berilgan sertifikatlar"
          onClose={() => setModal(null)}
          wide
        >
          <ul className="pfx-list">
            {certificates.map((certificate) => (
              <li key={certificate.id || certificate.title}>
                <span className="pfx-list-icon">
                  <LuBadgeCheck aria-hidden="true" />
                </span>
                <span className="pfx-list-text">
                  <b>{certificate.title}</b>
                  <small>
                    {certificate.issuer || 'Mars IT School'} · {certificate.module} ·{' '}
                    {certificate.date}
                  </small>
                </span>
                <span
                  className={`pfx-status${
                    certificate.status === 'done' ? ' done' : ''
                  }`}
                >
                  {certificate.status === 'done' ? 'OLINGAN' : 'JARAYONDA'}
                </span>
              </li>
            ))}
            {certificates.length === 0 && <p className="pfx-empty">Sertifikatlar hali yo'q.</p>}
          </ul>
        </Modal>
      )}

      {modal === 'badges' && (
        <Modal
          title="Yutuqlar"
          subtitle="Barcha olingan va kutilayotgan belgilar"
          onClose={() => setModal(null)}
          wide
        >
          <div className="pfx-achievement-grid">
            {badges.map((badge) => (
              <div key={badge.id || `${badge.title}-${badge.count}`} className="pfx-achievement">
                <span className="pfx-badge-icon" aria-hidden="true">
                  {badgeIcon(badge.icon)}
                </span>
                <div>
                  <b>
                    {badge.count || 1}x {badge.title}
                  </b>
                  <small>
                    {badge.icon === 'exam'
                      ? 'Imtihondan muvaffaqiyatli o‘tildi'
                      : badge.icon === 'streak'
                        ? 'Ketma-ket faol kunlar'
                        : 'Vazifa muvaffaqiyatli bajarildi'}
                  </small>
                </div>
              </div>
            ))}
            {badges.length === 0 && <p className="pfx-empty">Hozircha belgilar yo'q.</p>}
          </div>
        </Modal>
      )}

      {modal === 'backgrounds' && (
        <Modal
          title="Fon tanlash"
          subtitle="Sahna uchun mavjud fonlardan birini tanlang"
          onClose={() => setModal(null)}
          wide
        >
          <div className="pfx-shop-balance">
            <LuCoins aria-hidden="true" />
            Balans: <b>{coins.toLocaleString('en-US')}</b> coin
          </div>

          {shopMessage && (
            <p className={`pfx-shop-message ${shopMessage.type}`}>{shopMessage.text}</p>
          )}

          <div className="pfx-cosmetic-grid">
            {backgrounds.map((item) => {
              const owned = isOwned(item)
              const active = profile.selectedBackground === item.id
              const price = Number(item.priceCoins) || 0
              const isBuying = saving === `buy-${item.id}`
              return (
                <div
                  key={item.id}
                  className={`pfx-cosmetic${active ? ' active' : ''}${owned ? '' : ' locked'}`}
                >
                  <button
                    type="button"
                    className="pfx-cosmetic-select"
                    onClick={() => applyCosmetic(item)}
                    disabled={!owned || Boolean(saving)}
                    aria-label={owned ? `${item.name} fonini tanlash` : item.name}
                  >
                    <span className={`pfx-cosmetic-preview pfx-bg-${item.preview}`}>
                      {active && (
                        <span className="pfx-selected-mark">
                          <LuCheck aria-hidden="true" />
                        </span>
                      )}
                      {!owned && (
                        <span className="pfx-lock">
                          <LuLock aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <span className="pfx-cosmetic-text">
                      <b>{item.name}</b>
                      <small>
                        {owned
                          ? active
                            ? 'Tanlangan'
                            : 'Tanlash'
                          : `${price.toLocaleString('en-US')} coin`}
                      </small>
                    </span>
                  </button>

                  {!owned && (
                    <button
                      type="button"
                      className="pfx-buy-btn pfx-cosmetic-buy"
                      onClick={() => buyCosmetic(item)}
                      disabled={Boolean(saving)}
                      title={price > coins ? 'Coin yetarli emas' : 'Sotib olish'}
                    >
                      {isBuying ? (
                        <LuLoader className="pfx-spin" aria-hidden="true" />
                      ) : (
                        <LuShoppingBag aria-hidden="true" />
                      )}
                      {isBuying ? 'Sotib olinmoqda...' : 'Sotib olish'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </Modal>
      )}

      {modal === 'outfits' && (
        <Modal
          title="Kiyim tanlash"
          subtitle="Mashhur qahramonlar suratini tanlang yoki uni avatarga qo'ying"
          onClose={() => setModal(null)}
          wide
        >
          {shopMessage && (
            <p className={`pfx-shop-message ${shopMessage.type}`}>{shopMessage.text}</p>
          )}

          <div className="pfx-cosmetic-grid">
            {outfits.map((item) => {
              const owned = isOwned(item)
              const active = profile.selectedOutfit === item.id
              const isAvatar = profile.avatar === item.preview
              const isApplyingAvatar = saving === `avatar-${item.id}`
              return (
                <div
                  key={item.id}
                  className={`pfx-cosmetic${active ? ' active' : ''}${owned ? '' : ' locked'}`}
                >
                  <button
                    type="button"
                    className="pfx-cosmetic-select"
                    onClick={() => owned && applyCosmetic(item)}
                    disabled={!owned || Boolean(saving)}
                    aria-label={owned ? `${item.name} kiyimini tanlash` : item.name}
                  >
                    <span className="pfx-cosmetic-preview outfit">
                      <img src={item.preview} alt={item.name} />
                      {active && (
                        <span className="pfx-selected-mark">
                          <LuCheck aria-hidden="true" />
                        </span>
                      )}
                      {!owned && (
                        <span className="pfx-lock">
                          <LuLock aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <span className="pfx-cosmetic-text">
                      <b>{item.name}</b>
                      <small>
                        {owned ? (active ? 'Tanlangan' : 'Tanlash') : `${item.priceCoins} coin`}
                      </small>
                    </span>
                  </button>

                  {owned && (
                    <button
                      type="button"
                      className={`pfx-avatar-btn${isAvatar ? ' applied' : ''}`}
                      onClick={() => applyAvatar(item)}
                      disabled={Boolean(saving) || isAvatar}
                    >
                      {isApplyingAvatar ? (
                        <LuLoader className="pfx-spin" aria-hidden="true" />
                      ) : (
                        <LuUser aria-hidden="true" />
                      )}
                      {isAvatar ? 'Avatarda' : "Avatarga qo'yish"}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </Modal>
      )}

      {modal === 'shop' && (
        <Modal
          title="Do'kon"
          subtitle="Fon va kiyimlarni Mars Coin evaziga sotib oling"
          onClose={() => setModal(null)}
          wide
        >
          <div className="pfx-shop-balance">
            <LuCoins aria-hidden="true" />
            Balans: <b>{coins.toLocaleString('en-US')}</b> coin
          </div>

          {shopMessage && (
            <p className={`pfx-shop-message ${shopMessage.type}`}>{shopMessage.text}</p>
          )}

          <div className="pfx-shop-list">
            {cosmetics.map((item) => {
              const owned = isOwned(item)
              const isBuying = saving === `buy-${item.id}`
              return (
                <div key={item.id} className="pfx-shop-row">
                  {item.type === 'outfit' ? (
                    <span className="pfx-shop-preview outfit">
                      <img src={item.preview} alt="" />
                    </span>
                  ) : (
                    <span className={`pfx-shop-preview pfx-bg-${item.preview}`} />
                  )}

                  <span className="pfx-shop-text">
                    <b>{item.name}</b>
                    <small>
                      {item.type === 'background' ? 'Fon' : 'Kiyim'} · {item.description}
                    </small>
                  </span>

                  {owned ? (
                    <span className="pfx-owned">
                      <LuCheck aria-hidden="true" />
                      Sizda bor
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="pfx-buy-btn"
                      onClick={() => buyCosmetic(item)}
                      disabled={Boolean(saving) || coins < Number(item.priceCoins)}
                    >
                      {isBuying ? (
                        <LuLoader className="pfx-spin" aria-hidden="true" />
                      ) : (
                        <LuCoins aria-hidden="true" />
                      )}
                      {Number(item.priceCoins).toLocaleString('en-US')}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </Modal>
      )}

      <style>{css}</style>
    </div>
  )
}

const css = `
.pfx-page{
  --pfx-text:#eef3ff;
  --pfx-muted:#9aa8d4;
  --pfx-border:rgba(126,155,255,.22);
  position:relative;
  min-height:calc(100vh - 64px);
  padding:28px 18px 56px;
  color:var(--pfx-text);
  font-family:'Nunito','Segoe UI',system-ui,sans-serif;
  overflow:hidden;
  background:#050a1f;
  isolation:isolate;
}
.pfx-cosmos{position:absolute;inset:0;z-index:0;overflow:hidden;background:
  radial-gradient(ellipse at 12% 4%,rgba(45,74,166,.58),transparent 56%),
  radial-gradient(ellipse at 86% 0%,rgba(83,54,168,.45),transparent 52%),
  radial-gradient(ellipse at 50% 112%,rgba(12,46,118,.72),transparent 62%),
  linear-gradient(180deg,#050a1f 0%,#071130 46%,#04081a 100%)}
.pfx-stars{position:absolute;inset:0;opacity:.72;background-image:
  radial-gradient(1.5px 1.5px at 28px 36px,rgba(255,255,255,.92),transparent),
  radial-gradient(1px 1px at 142px 88px,rgba(198,218,255,.78),transparent),
  radial-gradient(1px 1px at 84px 156px,rgba(255,255,255,.55),transparent),
  radial-gradient(1.4px 1.4px at 212px 42px,rgba(255,255,255,.72),transparent),
  radial-gradient(1px 1px at 176px 196px,rgba(168,196,255,.6),transparent),
  radial-gradient(1px 1px at 246px 152px,rgba(255,255,255,.45),transparent);
  background-size:280px 240px}
.pfx-nebula{position:absolute;border-radius:50%;filter:blur(70px);opacity:.42;pointer-events:none}
.pfx-nebula.one{width:520px;height:360px;left:-140px;top:-120px;background:radial-gradient(circle,#3552c9,transparent 68%)}
.pfx-nebula.two{width:620px;height:420px;right:-180px;top:18%;background:radial-gradient(circle,#5a3bb5,transparent 68%)}
.pfx-planet{position:absolute;width:280px;height:280px;right:8%;bottom:-150px;border-radius:50%;
  background:radial-gradient(circle at 32% 28%,#4a6bd8,#1a2d72 52%,#070d2c 76%);
  box-shadow:0 0 80px rgba(84,126,255,.28);opacity:.5}
.pfx-shell{position:relative;z-index:1;max-width:1180px;margin:0 auto;display:flex;flex-direction:column;gap:18px}
.pfx-banner{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 16px;border-radius:14px;
  border:1px solid rgba(112,146,255,.28);background:rgba(35,58,126,.35);color:#cbdcff;font-size:12.5px;line-height:1.5}
.pfx-banner.warning{border-color:rgba(240,196,92,.35);background:rgba(110,82,26,.28);color:#ffe6ad}
.pfx-banner button{display:inline-flex;align-items:center;gap:7px;flex:none;border:1px solid rgba(255,255,255,.2);
  background:rgba(255,255,255,.08);color:inherit;border-radius:10px;padding:7px 11px;font:inherit;font-weight:800;cursor:pointer}
.pfx-banner button:hover{background:rgba(255,255,255,.16)}
.pfx-card{position:relative;background:linear-gradient(180deg,rgba(19,33,78,.86),rgba(9,17,43,.8));
  border:1px solid var(--pfx-border);border-radius:22px;
  box-shadow:0 24px 60px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.05);
  backdrop-filter:blur(14px)}
.pfx-top{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:18px}
.pfx-profile-card{display:flex;align-items:center;gap:20px;padding:24px}
.pfx-avatar{position:relative;flex:none;width:104px;height:104px;border-radius:50%;padding:4px;
  background:linear-gradient(145deg,rgba(126,166,255,.9),rgba(90,62,190,.35));box-shadow:0 16px 38px rgba(34,70,180,.35)}
.pfx-avatar img{width:100%;height:100%;border-radius:50%;object-fit:cover;background:#0b1233;display:block}
.pfx-avatar-check{position:absolute;right:2px;bottom:4px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;
  background:linear-gradient(145deg,#71e6b2,#25a877);color:#04160f;border:3px solid #0b1233;font-size:13px}
.pfx-profile-info{min-width:0;flex:1}
.pfx-nickname{display:inline-block;font-size:11.5px;font-weight:800;letter-spacing:.08em;color:#8fb3ff;text-transform:lowercase}
.pfx-profile-info h1{margin:4px 0 8px;font-size:clamp(24px,2.4vw,32px);line-height:1.15;font-weight:900;letter-spacing:-.01em}
.pfx-bio{margin:0;max-width:560px;font-size:13px;line-height:1.65;color:#b7c2e6}
.pfx-bio.empty{color:#7482ae;font-style:italic}
.pfx-profile-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.pfx-profile-meta span{display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(255,255,255,.1);
  background:rgba(255,255,255,.05);border-radius:20px;padding:5px 10px;font-size:11px;font-weight:700;color:#c8d3f5}
.pfx-profile-meta svg{color:#8fb3ff}
.pfx-side-card{padding:20px;display:flex;flex-direction:column;gap:14px}
.pfx-side-head{display:flex;align-items:center;justify-content:space-between;gap:10px}
.pfx-mini-badge{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:18px;
  color:#a8c1ff;background:linear-gradient(145deg,rgba(75,111,230,.36),rgba(32,48,112,.35));border:1px solid rgba(132,166,255,.32)}
.pfx-edit-btn{display:inline-flex;align-items:center;gap:7px;border:1px solid rgba(255,255,255,.18);
  background:rgba(255,255,255,.07);color:#eaf0ff;border-radius:11px;padding:9px 13px;font:inherit;font-size:12px;font-weight:800;cursor:pointer;
  transition:background .18s,transform .18s}
.pfx-edit-btn:hover{background:rgba(255,255,255,.15);transform:translateY(-1px)}
.pfx-level-row{display:flex;align-items:center;justify-content:space-between;gap:10px}
.pfx-level-badge{display:inline-flex;align-items:center;gap:7px;border-radius:20px;padding:7px 12px;
  font-size:12.5px;font-weight:900;color:#241a09;background:linear-gradient(140deg,#ffd57e,#eda53d);
  box-shadow:0 8px 20px rgba(237,165,61,.2)}
.pfx-level-xp{font-size:11.5px;font-weight:800;color:#9fadd8}
.pfx-progress{height:8px;border-radius:8px;background:rgba(255,255,255,.09);overflow:hidden}
.pfx-progress span{display:block;height:100%;border-radius:8px;background:linear-gradient(90deg,#5d8bff,#a878ff);transition:width .3s}
.pfx-side-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid rgba(255,255,255,.08);padding-top:12px}
.pfx-coin{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:800;color:#ffe6a3}
.pfx-status-dot{display:inline-flex;align-items:center;gap:6px;font-size:10.5px;font-weight:800;letter-spacing:.08em;color:#8ae9bb;text-transform:uppercase}
.pfx-status-dot::before{content:'';width:6px;height:6px;border-radius:50%;background:#4bdd9a;box-shadow:0 0 10px rgba(75,221,154,.8)}
.pfx-status-dot.offline{color:#ffd386}
.pfx-status-dot.offline::before{background:#f0ba4f;box-shadow:0 0 10px rgba(240,186,79,.65)}
.pfx-middle{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.pfx-link-card{display:flex;align-items:center;gap:14px;padding:18px 20px;text-align:left;font:inherit;color:inherit;cursor:pointer;
  transition:border-color .18s,transform .18s,background .18s}
button.pfx-link-card:hover{border-color:rgba(146,174,255,.45);background:linear-gradient(180deg,rgba(28,46,102,.9),rgba(12,22,54,.84));transform:translateY(-2px)}
.pfx-link-card.static{cursor:default}
.pfx-icon-box{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;font-size:21px;
  color:#a8c1ff;background:rgba(86,124,240,.18);border:1px solid rgba(132,166,255,.28)}
.pfx-icon-box.accent{color:#9be9c7;background:rgba(56,196,148,.14);border-color:rgba(84,210,166,.28)}
.pfx-link-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.pfx-link-text b{font-size:14.5px;font-weight:800}
.pfx-link-text small{font-size:11.5px;color:var(--pfx-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}
.pfx-count{flex:none;min-width:28px;height:28px;padding:0 8px;border-radius:9px;display:grid;place-items:center;
  font-size:11px;font-weight:900;color:#dce6ff;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1)}
.pfx-link-arrow{flex:none;font-size:18px;color:#8fb3ff}
.pfx-activity-pulse{flex:none;width:10px;height:10px;border-radius:50%;background:#4bdd9a;box-shadow:0 0 0 5px rgba(75,221,154,.13)}
.pfx-main{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:18px}
.pfx-scene-card{padding:12px;overflow:hidden}
.pfx-scene{position:relative;min-height:430px;border-radius:16px;overflow:hidden;padding:18px;display:flex;flex-direction:column;
  border:1px solid rgba(255,255,255,.08)}
.pfx-bg-desert{background:
  radial-gradient(circle at 76% 16%,rgba(255,220,170,.5),transparent 25%),
  radial-gradient(ellipse at 24% 104%,#c97a44 0 31%,transparent 32%),
  radial-gradient(ellipse at 78% 112%,#8e4a2e 0 43%,transparent 44%),
  radial-gradient(ellipse at 50% 118%,#5e2d22 0 56%,transparent 57%),
  linear-gradient(180deg,#101a44 0%,#29315f 36%,#5f4a70 56%,#b06a44 74%,#6d3624 100%)}
.pfx-bg-nebula{background:
  radial-gradient(ellipse at 72% 20%,rgba(133,118,255,.62),transparent 55%),
  radial-gradient(ellipse at 18% 78%,rgba(34,122,196,.45),transparent 58%),
  radial-gradient(ellipse at 50% 108%,rgba(16,30,86,.9),transparent 60%),
  linear-gradient(180deg,#070c26 0%,#171c55 55%,#050617 100%)}
.pfx-bg-mars{background:
  radial-gradient(circle at 80% 14%,rgba(255,178,136,.42),transparent 28%),
  radial-gradient(ellipse at 22% 104%,#96523a 0 32%,transparent 33%),
  radial-gradient(ellipse at 80% 112%,#5b2b2a 0 44%,transparent 45%),
  linear-gradient(180deg,#0a1230 0%,#2b1c41 48%,#7d3a2c 73%,#361a24 100%)}
.pfx-bg-midnight{background:
  radial-gradient(ellipse at 28% 8%,rgba(62,102,224,.46),transparent 56%),
  radial-gradient(ellipse at 82% 84%,rgba(40,64,150,.4),transparent 55%),
  linear-gradient(180deg,#060b24 0%,#0b173d 58%,#050817 100%)}
.pfx-scene-stars{position:absolute;inset:0;pointer-events:none;opacity:.8;background-image:
  radial-gradient(1.4px 1.4px at 30px 50px,rgba(255,255,255,.9),transparent),
  radial-gradient(1px 1px at 120px 110px,rgba(255,255,255,.6),transparent),
  radial-gradient(1px 1px at 70px 180px,rgba(255,255,255,.5),transparent),
  radial-gradient(1.2px 1.2px at 190px 70px,rgba(255,255,255,.7),transparent);
  background-size:220px 210px}
.pfx-scene-chips{position:relative;z-index:2;display:flex;flex-wrap:wrap;gap:8px}
.pfx-scene-chip{position:relative;z-index:2;align-self:flex-start;display:inline-flex;align-items:center;gap:7px;
  border-radius:20px;padding:6px 11px;font-size:11px;font-weight:800;color:#e8efff;
  background:rgba(9,15,40,.52);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(8px)}
.pfx-scene-chip.outfit{border-color:rgba(240,186,79,.32);background:rgba(52,38,12,.48);color:#ffe6a3}
.pfx-character{position:absolute;inset:44px 0 92px;display:grid;place-items:center;z-index:1}
.pfx-character img{width:min(58%,230px);height:min(58%,230px);object-fit:cover;border-radius:50%;
  border:4px solid rgba(143,179,255,.55);background:#0b1233;
  box-shadow:0 0 0 10px rgba(93,139,255,.15),0 26px 40px rgba(0,0,0,.48);
  animation:pfx-float 6s ease-in-out infinite}
.pfx-outfit-wahlberg img{border-color:rgba(143,179,255,.65);box-shadow:0 0 0 10px rgba(93,139,255,.16),0 0 44px rgba(93,139,255,.28),0 26px 40px rgba(0,0,0,.48)}
.pfx-outfit-laid img{border-color:rgba(111,226,200,.65);box-shadow:0 0 0 10px rgba(75,221,154,.14),0 0 44px rgba(75,221,154,.23),0 26px 40px rgba(0,0,0,.48)}
.pfx-outfit-lachowski img{border-color:rgba(255,213,126,.7);box-shadow:0 0 0 10px rgba(240,186,79,.15),0 0 44px rgba(240,186,79,.22),0 26px 40px rgba(0,0,0,.48)}
.pfx-outfit-pitt img{border-color:rgba(255,168,190,.7);box-shadow:0 0 0 10px rgba(236,114,152,.14),0 0 44px rgba(236,114,152,.22),0 26px 40px rgba(0,0,0,.48)}
.pfx-character-shadow{position:absolute;bottom:14%;width:180px;height:26px;border-radius:50%;
  background:rgba(0,0,0,.38);filter:blur(9px)}
@keyframes pfx-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.pfx-scene-actions{position:relative;z-index:2;margin-top:auto;display:grid;grid-template-columns:repeat(4,1fr);gap:9px;
  background:rgba(6,11,32,.58);border:1px solid rgba(255,255,255,.12);border-radius:15px;padding:9px;backdrop-filter:blur(12px)}
.pfx-scene-actions button{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 4px;border-radius:11px;
  border:1px solid transparent;background:rgba(255,255,255,.06);color:#e8efff;font:inherit;font-size:10.5px;font-weight:800;cursor:pointer;
  transition:background .18s,transform .18s,border-color .18s}
.pfx-scene-actions button:hover{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.16);transform:translateY(-2px)}
.pfx-scene-actions svg{font-size:18px;color:#a9c3ff}
.pfx-badges-card{padding:20px;display:flex;flex-direction:column}
.pfx-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px}
.pfx-card-head h2{margin:0 0 3px;font-size:15.5px;font-weight:900}
.pfx-card-head p{margin:0;font-size:11.5px;color:var(--pfx-muted)}
.pfx-ghost-btn{display:inline-flex;align-items:center;gap:5px;flex:none;border:1px solid rgba(255,255,255,.14);
  background:rgba(255,255,255,.05);color:#cdd8fb;border-radius:9px;padding:7px 9px;font:inherit;font-size:10.5px;font-weight:800;cursor:pointer}
.pfx-ghost-btn:hover{background:rgba(255,255,255,.13);color:#fff}
.pfx-badge-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;flex:1;align-content:start}
.pfx-badge{display:flex;flex-direction:column;align-items:center;gap:3px;text-align:center;padding:14px 8px;border-radius:15px;
  background:linear-gradient(180deg,rgba(79,108,210,.18),rgba(27,39,88,.2));border:1px solid rgba(126,155,255,.18)}
.pfx-badge-icon{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;font-size:18px;color:#ffdc92;
  background:rgba(240,186,79,.12);border:1px solid rgba(240,186,79,.25);margin-bottom:4px}
.pfx-badge b{font-size:11.5px;font-weight:800;line-height:1.3}
.pfx-badge small{font-size:9.5px;color:var(--pfx-muted)}
.pfx-all-link{display:inline-flex;align-items:center;justify-content:center;gap:5px;margin-top:14px;border:0;background:transparent;
  color:#9db8ff;font:inherit;font-size:11.5px;font-weight:800;cursor:pointer;padding:6px}
.pfx-all-link:hover{color:#cfddff}
.pfx-history-card{padding:22px}
.pfx-timeline{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
.pfx-timeline li{position:relative;display:flex;align-items:flex-start;gap:13px;padding:11px 0 11px 2px}
.pfx-timeline li:not(:last-child)::after{content:'';position:absolute;left:18px;top:50px;bottom:-4px;width:1px;
  background:linear-gradient(180deg,rgba(126,155,255,.32),rgba(126,155,255,.04))}
.pfx-timeline-icon{flex:none;width:36px;height:36px;border-radius:11px;display:grid;place-items:center;font-size:16px;color:#a9c3ff;
  background:rgba(86,124,240,.16);border:1px solid rgba(132,166,255,.25)}
.pfx-timeline li > div{flex:1;min-width:0}
.pfx-timeline b{font-size:12.5px;font-weight:800}
.pfx-timeline p{margin:3px 0 0;font-size:11.5px;line-height:1.5;color:var(--pfx-muted)}
.pfx-timeline time{flex:none;display:inline-flex;align-items:center;gap:5px;font-size:10.5px;color:#7f8dba;white-space:nowrap;padding-top:3px}
.pfx-empty{margin:6px 0;padding:18px;text-align:center;font-size:12px;color:var(--pfx-muted);border:1px dashed rgba(255,255,255,.13);border-radius:12px}
.pfx-overlay{position:fixed;inset:0;z-index:80;display:grid;place-items:center;padding:18px;background:rgba(3,6,20,.76);backdrop-filter:blur(8px)}
.pfx-modal{width:100%;max-width:520px;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;
  background:linear-gradient(180deg,#131f49,#0a1230);border:1px solid rgba(140,170,255,.28);border-radius:22px;
  box-shadow:0 34px 90px rgba(0,0,0,.6)}
.pfx-modal.wide{max-width:680px}
.pfx-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:20px 22px 14px;
  border-bottom:1px solid rgba(255,255,255,.07)}
.pfx-modal-head h2{margin:0 0 4px;font-size:16px;font-weight:900}
.pfx-modal-head p{margin:0;font-size:11.5px;color:var(--pfx-muted)}
.pfx-icon-btn{flex:none;width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font-size:15px;
  border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#eaf0ff;cursor:pointer}
.pfx-icon-btn:hover{background:rgba(255,255,255,.14)}
.pfx-modal-body{padding:18px 22px 22px;overflow:auto}
.pfx-form{display:flex;flex-direction:column;gap:13px}
.pfx-form label{display:flex;flex-direction:column;gap:6px;font-size:11px;font-weight:800;letter-spacing:.05em;color:#aebbe0}
.pfx-form input[type=text],.pfx-form input[type=url],.pfx-form textarea{
  width:100%;box-sizing:border-box;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:12px;
  padding:11px 12px;color:#eef3ff;font-size:13px;font-family:inherit;outline:none;resize:vertical}
.pfx-form input:focus,.pfx-form textarea:focus{border-color:rgba(146,174,255,.65);box-shadow:0 0 0 3px rgba(93,139,255,.16)}
.pfx-form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.pfx-edit-avatar{display:flex;align-items:center;gap:15px;padding:12px;border-radius:14px;background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08)}
.pfx-edit-avatar > img{width:72px;height:72px;border-radius:50%;object-fit:cover;background:#0b1233;border:2px solid rgba(146,174,255,.35)}
.pfx-edit-avatar > div{flex:1;min-width:0}
.pfx-edit-avatar p{margin:7px 0 0;font-size:10px;color:var(--pfx-muted)}
.pfx-upload-btn{display:inline-flex!important;flex-direction:row!important;align-items:center;gap:7px;width:max-content;
  border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);border-radius:10px;padding:8px 11px;
  font-size:11px;font-weight:800;color:#eaf0ff;cursor:pointer;letter-spacing:0}
.pfx-upload-btn:hover{background:rgba(255,255,255,.15)}
.pfx-upload-btn input{display:none}
.pfx-form-error{margin:0;padding:10px 12px;border-radius:10px;font-size:11.5px;color:#ffc6c6;
  background:rgba(180,48,63,.18);border:1px solid rgba(255,120,132,.3)}
.pfx-form-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:4px}
.pfx-btn{display:inline-flex;align-items:center;gap:7px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);
  color:#eaf0ff;border-radius:11px;padding:10px 16px;font:inherit;font-size:12px;font-weight:800;cursor:pointer}
.pfx-btn:hover{background:rgba(255,255,255,.13)}
.pfx-btn.primary{border:0;color:#1b2450;background:linear-gradient(140deg,#a8c3ff,#6d90ff)}
.pfx-btn.primary:hover{filter:brightness(1.06)}
.pfx-btn:disabled{opacity:.65;cursor:not-allowed}
.pfx-spin{animation:pfx-spin 1s linear infinite}
@keyframes pfx-spin{to{transform:rotate(360deg)}}
.pfx-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.pfx-list li{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:13px;background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08)}
.pfx-list-icon{flex:none;width:36px;height:36px;border-radius:10px;display:grid;place-items:center;font-size:17px;color:#ffdc92;
  background:rgba(240,186,79,.12)}
.pfx-list-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.pfx-list-text b{font-size:12.5px;font-weight:800}
.pfx-list-text small{font-size:10.5px;color:var(--pfx-muted)}
.pfx-status{flex:none;font-size:8.5px;font-weight:900;letter-spacing:.08em;color:#aab6d8;border:1px solid rgba(255,255,255,.16);
  border-radius:20px;padding:4px 8px;white-space:nowrap}
.pfx-status.done{color:#bff0d5;border-color:rgba(75,221,154,.38);background:rgba(75,221,154,.12)}
.pfx-achievement-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pfx-achievement{display:flex;align-items:center;gap:11px;padding:12px;border-radius:13px;background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08)}
.pfx-achievement .pfx-badge-icon{margin:0;flex:none}
.pfx-achievement b{display:block;font-size:12px;font-weight:800}
.pfx-achievement small{display:block;margin-top:2px;font-size:10px;color:var(--pfx-muted);line-height:1.4}
.pfx-cosmetic-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.pfx-cosmetic{display:flex;flex-direction:column;gap:9px;padding:9px;border-radius:14px;border:1px solid rgba(255,255,255,.1);
  background:rgba(255,255,255,.04);color:inherit;font:inherit;text-align:left;transition:border-color .18s,transform .18s}
.pfx-cosmetic:hover{border-color:rgba(146,174,255,.5);transform:translateY(-2px)}
.pfx-cosmetic.active{border-color:rgba(146,174,255,.6);box-shadow:0 0 0 2px rgba(93,139,255,.18)}
.pfx-cosmetic-select{display:flex;flex-direction:column;gap:9px;padding:0;border:0;background:none;color:inherit;
  width:100%;font:inherit;text-align:left;cursor:pointer}
.pfx-cosmetic-select:disabled{cursor:not-allowed}
.pfx-cosmetic.locked .pfx-cosmetic-select{opacity:.72}
.pfx-cosmetic-buy{width:100%;justify-content:center}
.pfx-cosmetic-preview{position:relative;display:block;height:92px;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,.1)}
.pfx-cosmetic-preview.outfit{display:block;background:#0b1233}
.pfx-cosmetic-preview.outfit img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
.pfx-avatar-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;width:100%;border:1px solid rgba(255,255,255,.16);
  background:rgba(255,255,255,.07);color:#e8efff;border-radius:9px;padding:8px 10px;font:inherit;font-size:10.5px;font-weight:800;cursor:pointer;
  transition:background .18s,border-color .18s}
.pfx-avatar-btn:hover:not(:disabled){background:rgba(255,255,255,.15);border-color:rgba(146,174,255,.45)}
.pfx-avatar-btn.applied,.pfx-avatar-btn:disabled{opacity:.55;cursor:not-allowed}
.pfx-avatar-btn.applied{color:#bff0d5;border-color:rgba(75,221,154,.35);background:rgba(75,221,154,.12)}
.pfx-selected-mark{position:absolute;right:7px;top:7px;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;
  font-size:11px;color:#062014;background:#62dfa4;border:2px solid rgba(5,20,45,.55)}
.pfx-lock{position:absolute;right:7px;top:7px;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;
  font-size:11px;color:#eaf0ff;background:rgba(5,10,28,.72);border:1px solid rgba(255,255,255,.2)}
.pfx-cosmetic-text{display:flex;flex-direction:column;gap:2px}
.pfx-cosmetic-text b{font-size:11.5px;font-weight:800}
.pfx-cosmetic-text small{font-size:10px;color:var(--pfx-muted)}
.pfx-shop-balance{display:inline-flex;align-items:center;gap:7px;border-radius:11px;padding:8px 12px;margin-bottom:12px;
  background:rgba(240,186,79,.1);border:1px solid rgba(240,186,79,.28);color:#ffe6a3;font-size:12px}
.pfx-shop-balance b{font-size:13px}
.pfx-shop-message{margin:0 0 10px;padding:10px 12px;border-radius:10px;font-size:11.5px;
  border:1px solid rgba(146,174,255,.28);background:rgba(93,139,255,.12);color:#cfddff}
.pfx-shop-message.success{border-color:rgba(75,221,154,.35);background:rgba(75,221,154,.12);color:#bff0d5}
.pfx-shop-message.info{border-color:rgba(240,186,79,.3);background:rgba(240,186,79,.1);color:#ffe6ad}
.pfx-shop-list{display:flex;flex-direction:column;gap:8px}
.pfx-shop-row{display:flex;align-items:center;gap:12px;padding:9px;border-radius:13px;background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08)}
.pfx-shop-preview{flex:none;width:58px;height:58px;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,.1)}
.pfx-shop-preview.outfit{display:block;background:#0b1233}
.pfx-shop-preview.outfit img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
.pfx-shop-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.pfx-shop-text b{font-size:12px;font-weight:800}
.pfx-shop-text small{font-size:10px;color:var(--pfx-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pfx-owned{flex:none;display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:800;color:#9fdcc0}
.pfx-buy-btn{flex:none;display:inline-flex;align-items:center;gap:5px;border:0;border-radius:9px;padding:8px 11px;
  background:linear-gradient(140deg,#ffd57e,#eda53d);color:#241a09;font:inherit;font-size:11.5px;font-weight:900;cursor:pointer}
.pfx-buy-btn:hover{filter:brightness(1.06)}
.pfx-buy-btn:disabled{opacity:.5;cursor:not-allowed;filter:none}
@media(max-width:1000px){
  .pfx-top{grid-template-columns:1fr}
  .pfx-main{grid-template-columns:1fr}
  .pfx-scene{min-height:400px}
}
@media(max-width:720px){
  .pfx-page{padding:16px 12px 40px}
  .pfx-profile-card{flex-direction:column;align-items:flex-start;gap:16px;padding:20px}
  .pfx-avatar{width:86px;height:86px}
  .pfx-middle{grid-template-columns:1fr}
  .pfx-form-row{grid-template-columns:1fr}
  .pfx-achievement-grid{grid-template-columns:1fr}
  .pfx-cosmetic-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:520px){
  .pfx-scene{min-height:380px;padding:12px}
  .pfx-scene-actions{grid-template-columns:1fr 1fr}
  .pfx-character img{width:190px;height:190px}
  .pfx-badge-grid{grid-template-columns:1fr 1fr}
  .pfx-cosmetic-grid{grid-template-columns:1fr}
  .pfx-timeline li{flex-wrap:wrap}
  .pfx-timeline time{width:100%;padding-left:49px}
  .pfx-modal-body{padding:16px}
  .pfx-modal-head{padding:16px 16px 12px}
  .pfx-level-row{flex-wrap:wrap}
}
@media(prefers-reduced-motion:reduce){
  .pfx-character img{animation:none}
  .pfx-spin{animation:none}
}
`

export default Profil
