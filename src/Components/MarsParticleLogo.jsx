import { useEffect, useRef } from 'react'

const LETTER_COLORS = ['#f8fff9', '#dff8ea', '#ffffff', '#c7f3d8', '#ead0dc', '#b9efd0']
const RING_COLORS = ['#ff7a18', '#ff932e', '#ff5d00', '#ffc06a']

const cssSize = (canvas) => {
  const rect = canvas.getBoundingClientRect()
  return { width: Math.max(1, rect.width), height: Math.max(1, rect.height) }
}

const hash = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const buildParticles = (width, height) => {
  const off = document.createElement('canvas')
  off.width = Math.ceil(width)
  off.height = Math.ceil(height)
  const paint = off.getContext('2d', { willReadFrequently: true })
  if (!paint) return { particles: [], groups: [] }

  const fontSize = Math.round(height * 0.5)
  paint.font = `800 ${fontSize}px "Arial Black", Impact, "Segoe UI", sans-serif`
  paint.textBaseline = 'middle'
  paint.textAlign = 'left'
  paint.fillStyle = '#ffffff'

  const glyphs = ['M', 'A', 'R', 'S']
  const tracking = fontSize * 0.05
  const widths = glyphs.map((glyph) => paint.measureText(glyph).width)
  const ringReserve = fontSize * 0.62
  const contentW = widths.reduce((sum, value) => sum + value, 0) + tracking * 3 + ringReserve
  let cursorX = (width - contentW) / 2
  const baseline = height * 0.56
  const bounds = []

  glyphs.forEach((glyph, index) => {
    paint.fillText(glyph, cursorX, baseline)
    bounds.push({
      index,
      x0: cursorX,
      x1: cursorX + widths[index],
      y0: baseline - fontSize * 0.52,
      y1: baseline + fontSize * 0.48,
      cx: cursorX + widths[index] / 2,
      cy: baseline - fontSize * 0.04,
    })
    cursorX += widths[index] + tracking
  })

  const ringX = cursorX + fontSize * 0.18
  const ringY = baseline - fontSize * 0.22
  const ringR = fontSize * 0.155
  paint.strokeStyle = '#ffffff'
  paint.lineWidth = Math.max(3.2, fontSize * 0.072)
  paint.beginPath()
  paint.arc(ringX, ringY, ringR, 0, Math.PI * 2)
  paint.stroke()

  const pixels = paint.getImageData(0, 0, off.width, off.height).data
  const particles = []
  const step = 3
  let seed = 0

  for (let py = 0; py < off.height; py += step) {
    for (let px = 0; px < off.width; px += step) {
      const alpha = pixels[(py * off.width + px) * 4 + 3]
      if (alpha < 90) continue
      seed += 1
      if (hash(seed) < 0.1) continue

      const toRing = Math.hypot(px - ringX, py - ringY)
      const isRing = Math.abs(toRing - ringR) < paint.lineWidth * 1.15
      let group = 4
      if (!isRing) {
        const match = bounds.find((box) => px >= box.x0 - 1 && px <= box.x1 + 1)
        group = match ? match.index : 0
      }

      const jitter = 0.55
      particles.push({
        hx: px + (hash(seed + 2) - 0.5) * jitter,
        hy: py + (hash(seed + 6) - 0.5) * jitter,
        x: px,
        y: py,
        vx: 0,
        vy: 0,
        group,
        size: isRing ? 1.7 + hash(seed + 8) * 0.7 : 1.35 + hash(seed + 8) * 0.7,
        color: isRing
          ? RING_COLORS[Math.floor(hash(seed + 11) * RING_COLORS.length)]
          : LETTER_COLORS[Math.floor(hash(seed + 13) * LETTER_COLORS.length)],
        twinkle: hash(seed + 21),
        // unique random phase/seed for wave displacement
        wavePhase: hash(seed + 31) * Math.PI * 2,
        waveSeed: hash(seed + 37),
        // random outward direction for dispersal
        dirAngle: Math.atan2(py - (isRing ? ringY : (bounds[group]?.cy ?? baseline)),
                             px - (isRing ? ringX : (bounds[group]?.cx ?? width / 2)))
                  + (hash(seed + 44) - 0.5) * 1.2,
      })
    }
  }

  const groups = [0, 1, 2, 3, 4].map((index) => {
    const members = particles.filter((particle) => particle.group === index)
    if (!members.length) {
      return index === 4
        ? { cx: ringX, cy: ringY }
        : { cx: bounds[index]?.cx ?? width / 2, cy: bounds[index]?.cy ?? height / 2 }
    }
    return {
      cx: members.reduce((sum, particle) => sum + particle.hx, 0) / members.length,
      cy: members.reduce((sum, particle) => sum + particle.hy, 0) / members.length,
    }
  })

  return { particles, groups }
}

const MarsParticleLogo = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0
    let particles = []
    let groups = []
    let frame = 0
    let mouseX = -9999
    let mouseY = -9999
    let hovering = false
    const start = performance.now()

    const setup = () => {
      const size = cssSize(canvas)
      width = size.width
      height = size.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const built = buildParticles(width, height)
      particles = built.particles
      groups = built.groups
    }

    const localPoint = (event) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }

    const onMove = (event) => {
      const point = localPoint(event)
      mouseX = point.x
      mouseY = point.y
      hovering = true
    }

    const onLeave = () => {
      hovering = false
      mouseX = -9999
      mouseY = -9999
    }

    // Wave configuration - multiple overlapping waves for organic feel
    // Each wave has: speed, spatial frequency, group delay, max displacement
    const waves = [
      { speed: 0.0008, spatialFreq: 0.025, groupDelay: 0.7, maxDisp: 18, vertBias: 0.3 },
      { speed: 0.0013, spatialFreq: 0.018, groupDelay: 1.1, maxDisp: 12, vertBias: -0.2 },
      { speed: 0.0005, spatialFreq: 0.032, groupDelay: 0.5, maxDisp: 8, vertBias: 0.5 },
    ]

    const draw = (time) => {
      frame = requestAnimationFrame(draw)
      const now = time - start
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i]

        if (!reduced) {
          // Calculate wave-based displacement
          let totalDispX = 0
          let totalDispY = 0

          for (let w = 0; w < waves.length; w += 1) {
            const wave = waves[w]
            // Spatial position along a direction (diagonal wave front)
            const spatialPos = p.hx * wave.spatialFreq + p.hy * wave.spatialFreq * wave.vertBias
            // Group-based phase delay so different letters animate at different times
            const groupPhase = p.group * wave.groupDelay
            // Per-particle phase for organic variation
            const particlePhase = p.wavePhase * 0.5

            // Sin wave: creates smooth cyclic gather/disperse
            // The wave value goes from -1 to 1
            const waveVal = Math.sin(now * wave.speed + spatialPos + groupPhase + particlePhase)

            // Only disperse when waveVal > 0 (half the cycle = gathered, half = dispersed)
            // Use a smoothstep-like curve for more pleasing motion
            const disperseAmount = Math.max(0, waveVal)
            // Cube it for sharper transitions (more time gathered, quick disperse)
            const strength = disperseAmount * disperseAmount * wave.maxDisp

            // Displace outward from home position along the particle's unique direction
            // Plus some tangential movement for swirl
            const angle = p.dirAngle + Math.sin(now * 0.001 + p.waveSeed * 10) * 0.4
            totalDispX += Math.cos(angle) * strength * (0.7 + p.waveSeed * 0.6)
            totalDispY += Math.sin(angle) * strength * (0.7 + p.waveSeed * 0.6)
          }

          // Target position = home + wave displacement
          const targetX = p.hx + totalDispX
          const targetY = p.hy + totalDispY

          // Smooth spring towards target
          const dx = targetX - p.x
          const dy = targetY - p.y
          p.vx += dx * 0.08
          p.vy += dy * 0.08
          p.vx *= 0.82
          p.vy *= 0.82

          // Mouse repulsion
          if (hovering) {
            const mx = p.x - mouseX
            const my = p.y - mouseY
            const md = Math.hypot(mx, my) || 0.001
            if (md < 42) {
              const push = ((42 - md) / 42) * 0.7
              p.vx += (mx / md) * push
              p.vy += (my / md) * push
            }
          }

          p.x += p.vx
          p.y += p.vy
        }

        const speed = Math.hypot(p.vx, p.vy)

        // Twinkle alpha - more noticeable when dispersed
        const dispDist = Math.hypot(p.x - p.hx, p.y - p.hy)
        const disperseFactor = Math.min(1, dispDist / 15)
        const baseAlpha = 0.75 + Math.sin(now * 0.007 + p.twinkle * 14) * 0.2
        // Particles sparkle more when flying outward
        const sparkle = disperseFactor * Math.sin(now * 0.015 + p.waveSeed * 20) * 0.25
        ctx.globalAlpha = reduced ? 0.94 : Math.max(0.3, Math.min(1, baseAlpha + sparkle))
        ctx.fillStyle = p.color
        ctx.strokeStyle = p.color

        if (speed > 0.45) {
          // Draw as a streak when moving fast
          const streakLen = Math.min(speed * 2.6, 8)
          ctx.lineWidth = p.size * (0.7 + disperseFactor * 0.3)
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x - p.vx / speed * streakLen, p.y - p.vy / speed * streakLen)
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 0.78, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
    }

    setup()
    frame = requestAnimationFrame(draw)
    window.addEventListener('resize', setup)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', setup)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className="relative flex h-[72px] w-[300px] items-center justify-center sm:h-[84px] sm:w-[380px]">
      <canvas
        ref={canvasRef}
        aria-label="MARS"
        className="absolute left-1/2 top-1/2 h-[120px] w-[420px] -translate-x-1/2 -translate-y-1/2 cursor-pointer sm:h-[132px] sm:w-[470px]"
      />
    </div>
  )
}

export default MarsParticleLogo
