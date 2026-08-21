import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const orbits = [
  {
    id: 'orbit1',
    rx: 190, ry: 105,
    rotate: -15,
    color: 'rgba(0,212,255,0.38)',
    innerRx: 165, innerRy: 85,
    planets: [
      { id: 'foxy', name: 'Foxy', image: '/planet_foxy.png',  angle: 220 },
      { id: 'ava',  name: 'AVA',  image: '/plantet_ava.png',  angle: 320 },
    ],
  },
  {
    id: 'orbit2',
    rx: 260, ry: 138,
    rotate: -15,
    color: 'rgba(0,160,255,0.28)',
    innerRx: 232, innerRy: 115,
    planets: [
      { id: 'obs',    name: 'Observatorios', image: '/planet_obs.png',      angle: 50  },
      { id: 'fichas', name: 'Fichas CU',     image: '/planet_fichascu.png', angle: 105 },
      { id: '360r',   name: '360resumen',    image: '/planet_360r.png',     angle: 160 },
    ],
  },
]

// Grados por segundo
const ORBIT_SPEED: Record<string, number> = {
  orbit1: 1.8,
  orbit2: 1.2,
}

const getMobileOrbit = (o: typeof orbits[0]) => ({
  ...o,
  rx: o.ry,
  ry: o.rx,
  rotate: o.rotate + 90,
  innerRx: o.innerRy,
  innerRy: o.innerRx,
})

const ellipsePoint = (
  angleDeg: number,
  rx: number,
  ry: number,
  rotateDeg: number,
  cx: number,
  cy: number
) => {
  const a = (angleDeg * Math.PI) / 180
  const r = (rotateDeg * Math.PI) / 180
  const ex = rx * Math.cos(a)
  const ey = ry * Math.sin(a)
  return {
    x: cx + ex * Math.cos(r) - ey * Math.sin(r),
    y: cy + ex * Math.sin(r) + ey * Math.cos(r),
  }
}

const OrbitSystem = () => {
  const [isMobile, setIsMobile] = useState(false)

  // Refs para acceder al DOM de cada planeta directamente
  const planetRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 600px)').matches
    const SIZE = mobile ? 340 : 520
    const CX = SIZE / 2
    const CY = SIZE / 2
    const PLANET_SIZE = mobile ? 90 : 130
    const scale = mobile ? 0.72 : 1
    const activeOrbits = mobile ? orbits.map(getMobileOrbit) : orbits

    const offsets: Record<string, number> = { orbit1: 0, orbit2: 0 }
    let lastTime: number | null = null
    let raf: number

    const tick = (now: number) => {
      const delta = lastTime !== null ? (now - lastTime) / 1000 : 0
      lastTime = now

      activeOrbits.forEach(orbit => {
        offsets[orbit.id] = (offsets[orbit.id] + ORBIT_SPEED[orbit.id] * delta) % 360

        orbit.planets.forEach(planet => {
          const el = planetRefs.current[planet.id]
          if (!el) return
          const pos = ellipsePoint(
            planet.angle + offsets[orbit.id],
            orbit.innerRx * scale,
            orbit.innerRy * scale,
            orbit.rotate,
            CX, CY
          )
          // Mover directo por transform para evitar reflows
          el.style.transform = `translate(${pos.x - PLANET_SIZE / 2}px, ${pos.y - PLANET_SIZE / 2}px)`
        })
      })

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isMobile])

  const SIZE = isMobile ? 340 : 520
  const CX = SIZE / 2
  const CY = SIZE / 2
  const PLANET_SIZE = isMobile ? 90 : 130
  const CENTER_SIZE = isMobile ? 120 : 170
  const scale = isMobile ? 0.72 : 1
  const activeOrbits = isMobile ? orbits.map(getMobileOrbit) : orbits

  // Posición inicial para render estático (antes de que el RAF tome control)
  const initialPos = (orbit: typeof orbits[0], planet: { angle: number }) =>
    ellipsePoint(planet.angle, orbit.innerRx * scale, orbit.innerRy * scale, orbit.rotate, CX, CY)

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: SIZE, height: SIZE }}>

        {/* Rings SVG */}
        <svg
          width={SIZE}
          height={SIZE}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <defs>
            {activeOrbits.map(o => (
              <filter key={o.id} id={`glow-${o.id}`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>

          <circle cx={CX} cy={CY} r={100 * scale} fill="rgba(0,180,255,0.05)" />
          <circle cx={CX} cy={CY} r={60 * scale}  fill="rgba(0,212,255,0.08)" />

          {activeOrbits.map(o => (
            <ellipse
              key={o.id}
              cx={CX} cy={CY}
              rx={o.rx * scale} ry={o.ry * scale}
              fill="none"
              stroke={o.color}
              strokeWidth="1.5"
              transform={`rotate(${o.rotate}, ${CX}, ${CY})`}
              filter={`url(#glow-${o.id})`}
            />
          ))}
        </svg>

        {/* Centro 360 */}
        <div
          style={{
            position: 'absolute',
            top: CY, left: CX,
            width: CENTER_SIZE, height: CENTER_SIZE,
            marginLeft: -CENTER_SIZE / 2, marginTop: -CENTER_SIZE / 2,
            zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <motion.img
            src="/360.png"
            alt="360"
            style={{
              width: CENTER_SIZE, height: CENTER_SIZE,
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 28px rgba(0,212,255,0.7)) drop-shadow(0 0 8px rgba(0,150,255,0.45))',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Planetas — posición inicial via inline style, luego RAF toma control por transform */}
        {activeOrbits.map((orbit) =>
          orbit.planets.map((planet) => {
            const pos = initialPos(orbit, planet)
            return (
              <div
                key={planet.id}
                ref={el => { planetRefs.current[planet.id] = el }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: PLANET_SIZE,
                  height: PLANET_SIZE,
                  transform: `translate(${pos.x - PLANET_SIZE / 2}px, ${pos.y - PLANET_SIZE / 2}px)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: 6,
                  willChange: 'transform',
                }}
                onMouseEnter={e => (e.currentTarget.style.scale = '1.12')}
                onMouseLeave={e => (e.currentTarget.style.scale = '1')}
              >
                <img
                  src={planet.image}
                  alt={planet.name}
                  style={{
                    width: PLANET_SIZE,
                    height: PLANET_SIZE,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 10px rgba(0,160,255,0.6))',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: isMobile ? '0.55rem' : '0.62rem',
                    fontWeight: 600,
                    color: '#cce8ff',
                    textShadow: '0 0 8px rgba(0,212,255,0.7)',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.04em',
                    marginTop: 3,
                  }}
                >
                  {planet.name}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default OrbitSystem