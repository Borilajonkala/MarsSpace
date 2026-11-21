import { useEffect, useRef, useState } from 'react'
import { LuChevronDown, LuGlobe, LuX } from 'react-icons/lu'

const LANGUAGES = [
  { code: 'ru', label: 'Рус' },
  { code: 'uz', label: "O'z" },
  { code: 'en', label: 'Eng' },
]

const LETTERS = {
  m: ['11011', '10101', '10101', '10001', '10001', '10001', '10001'],
  a: ['00000', '01110', '00001', '01111', '10001', '01111', '00000'],
  r: ['00000', '10110', '11001', '10000', '10000', '10000', '00000'],
  s: ['00000', '01111', '10000', '01110', '00001', '11110', '00000'],
}

const PIXEL_COLORS = [
  '#a9f3c0',
  '#a9f3c0',
  '#8fe9b0',
  '#c8ffdd',
  '#a9f3c0',
  '#f4b3d2',
]

const pixelColor = (row, col) => PIXEL_COLORS[(row * 7 + col * 3) % PIXEL_COLORS.length]

const MarsPixelLogo = () => (
  <div className="flex items-center gap-1 sm:gap-2">
    <div className="flex items-end gap-[3px]">
      {Object.entries(LETTERS).map(([letter, rows]) => (
        <div key={letter} className="flex flex-col gap-[2px]">
          {rows.map((row, rowIndex) => (
            <div key={`${letter}-${rowIndex}`} className="flex gap-[2px]">
              {row.split('').map((cell, colIndex) => (
                <span
                  key={`${letter}-${rowIndex}-${colIndex}`}
                  className="h-[7px] w-[7px] sm:h-2 sm:w-2"
                  style={{
                    backgroundColor: cell === '1' ? pixelColor(rowIndex, colIndex) : 'transparent',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
    <span className="mb-3 ml-1 inline-block h-8 w-8 rounded-full border-[4px] border-[#ff7a18] shadow-[0_0_22px_rgba(255,122,24,0.45)] sm:mb-4 sm:h-10 sm:w-10 sm:border-[5px]" />
  </div>
)

const CodeRain = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const glyphs = [
      ...'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン',
      ...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      ...'*+=<>/{}\\/[]#%$&@',
    ]
    const colors = ['#f0a9c9', '#a9e7bb', '#e6e6e6', '#cf8fb0', '#8fd9ae']
    const fontSize = 13
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0
    let columns = []
    let frame = 0
    let last = 0

    const setup = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = '#050506'
      ctx.fillRect(0, 0, width, height)

      const step = fontSize * 1.35
      columns = Array.from({ length: Math.ceil(width / step) + 1 }, (_, index) => ({
        x: index * step + step / 2,
        y: Math.random() * height,
        speed: 0.35 + Math.random() * 1.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    }

    const draw = (time) => {
      frame = requestAnimationFrame(draw)
      if (time - last < 60) return
      last = time

      ctx.fillStyle = 'rgba(5, 5, 6, 0.16)'
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${fontSize}px "Courier New", monospace`

      for (const column of columns) {
        const glyph = glyphs[Math.floor(Math.random() * glyphs.length)]
        ctx.fillStyle = column.color
        ctx.globalAlpha = 0.32 + Math.random() * 0.45
        ctx.fillText(glyph, column.x, column.y)
        column.y += fontSize * column.speed

        if (column.y > height + 80) {
          column.y = -Math.random() * height * 0.6
          column.speed = 0.35 + Math.random() * 1.1
          column.color = colors[Math.floor(Math.random() * colors.length)]
        }
      }

      ctx.globalAlpha = 1
    }

    setup()
    frame = requestAnimationFrame(draw)
    window.addEventListener('resize', setup)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', setup)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}

export const LanguageSwitcher = ({ lang, onChange }) => {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex cursor-pointer items-center gap-1.5 rounded-full bg-white/85 py-1 pl-2 pr-2.5 text-[11px] font-medium text-[#2b2b2f] shadow-sm transition hover:bg-white"
      >
        <LuGlobe className="h-3.5 w-3.5" />
        {LANGUAGES.find((item) => item.code === lang)?.label}
        <LuChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1.5 w-24 overflow-hidden rounded-xl border border-black/10 bg-white py-1 shadow-xl"
        >
          {LANGUAGES.map((item) => (
            <button
              key={item.code}
              type="button"
              role="menuitemradio"
              aria-checked={lang === item.code}
              onClick={() => {
                onChange(item.code)
                setOpen(false)
              }}
              className={`flex w-full cursor-pointer items-center justify-between px-3 py-1.5 text-left text-[11px] transition hover:bg-[#ececec] ${
                lang === item.code ? 'font-semibold text-[#1f1f22]' : 'text-[#5b5b5f]'
              }`}
            >
              {item.label}
              {lang === item.code && <span className="h-1.5 w-1.5 rounded-full bg-[#c78a70]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const AuthShell = ({ children, closeLabel = 'Hide' }) => {
  const [badgeVisible, setBadgeVisible] = useState(true)

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-[#050506] px-3 pb-16 pt-6 font-sans text-[#2b2b2f] sm:pt-10">
      <CodeRain />

      <div className="relative z-10 flex w-full flex-col items-center">
        <MarsPixelLogo />

        <div className="mt-6 w-full max-w-[378px] rounded-[26px] border border-white/30 bg-[#a7a7a7]/95 px-5 pb-5 pt-4 shadow-[0_30px_90px_-25px_rgba(0,0,0,0.95)] backdrop-blur-sm sm:px-6 sm:pb-6">
          {children}
        </div>
      </div>

      {badgeVisible && (
        <div className="fixed bottom-4 right-4 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-[#0d1317]/90 py-1.5 pl-3 pr-1.5 text-[11px] font-medium text-white/85 shadow-lg backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span>Code Rain · Mars Team</span>
          <button
            type="button"
            title={closeLabel}
            aria-label={closeLabel}
            onClick={() => setBadgeVisible(false)}
            className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <LuX className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  )
}

export default AuthShell
