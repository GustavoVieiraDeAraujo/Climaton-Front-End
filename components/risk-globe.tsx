'use client'

import dynamic from 'next/dynamic'
import { useCallback, useMemo, useRef } from 'react'

type RiskPoint = {
  name: string
  lat: number
  lng: number
  risk: number
  label: string
  insight: string
}

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

// Vista travada no Brasil: centro geográfico aproximado do território, altitude fixa que
// enquadra bem os 5 pontos críticos (todos no Norte/Nordeste). Zoom desabilitado (enableZoom
// false) e rotação limitada a poucos graus em torno desse centro - dá pra "sentir" que é um
// globo 3D sem sair da região do Brasil.
const BRAZIL_VIEW = { lat: -14, lng: -53, altitude: 1.45 }
const ROTATION_LIMIT = 0.35 // radianos (~20°) de folga em cada eixo

export function RiskGlobe({ points, selected, onSelect }: { points: RiskPoint[]; selected: string; onSelect: (point: RiskPoint) => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null)
  const rings = useMemo(() => points.filter((point) => point.name === selected), [points, selected])

  // onGlobeReady dispara quando o objeto three.js já existe de verdade - um useEffect comum
  // rodava antes disso (dynamic import + WebGL init são assíncronos) e a ref chegava nula.
  const handleGlobeReady = useCallback(() => {
    const globe = globeRef.current
    if (!globe) return
    const controls = globe.controls()
    controls.autoRotate = false
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.12

    // globe.gl reafirma sua própria posição inicial em pelo menos um frame depois de
    // onGlobeReady - aplicar pointOfView uma vez só perde essa corrida. Reaplica por meio
    // segundo e só trava os limites de rotação depois de tudo se estabilizar.
    let frames = 0
    const settle = () => {
      globe.pointOfView(BRAZIL_VIEW, 0)
      frames += 1
      if (frames < 30) {
        requestAnimationFrame(settle)
        return
      }
      const centerAzimuth = controls.getAzimuthalAngle()
      const centerPolar = controls.getPolarAngle()
      controls.minAzimuthAngle = centerAzimuth - ROTATION_LIMIT
      controls.maxAzimuthAngle = centerAzimuth + ROTATION_LIMIT
      controls.minPolarAngle = Math.max(0.1, centerPolar - ROTATION_LIMIT)
      controls.maxPolarAngle = Math.min(Math.PI - 0.1, centerPolar + ROTATION_LIMIT)
      controls.update()
    }
    requestAnimationFrame(settle)
  }, [])

  return (
    <div className="globe-shell" aria-label="Globo interativo com pontos de risco climático no Brasil">
      <Globe
        ref={globeRef}
        width={650}
        height={520}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#1d6b4d"
        atmosphereAltitude={0.08}
        showAtmosphere
        enablePointerInteraction
        onGlobeReady={handleGlobeReady}
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor={(point: object) => ((point as RiskPoint).risk > 80 ? '#d6e85c' : '#75b89a')}
        pointRadius={(point: object) => ((point as RiskPoint).risk / 100) * 0.6}
        pointAltitude={0.04}
        pointLabel={(point: object) => `${(point as RiskPoint).name}: ${(point as RiskPoint).risk}% de risco`}
        onPointClick={(point: object) => onSelect(point as RiskPoint)}
        ringsData={rings}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => '#d6e85c'}
        ringMaxRadius={2.5}
        ringPropagationSpeed={1.5}
        ringRepeatPeriod={900}
      />
      <p className="globe-note">Arraste um pouco pra explorar - a vista fica travada na região do Brasil.</p>
    </div>
  )
}

export type { RiskPoint }
