'use client'

import dynamic from 'next/dynamic'
import { useCallback, useMemo, useRef } from 'react'

type RiskPoint = {
  name: string
  lat: number
  lng: number
  risk: number
  capacidade?: number
  prioridade?: string | null
  label: string
  insight: string
}

const PRIORIDADE_COR: Record<string, string> = {
  'Crítico': '#e0574a', 'Alto': '#d98a3f', 'Médio': '#d6e85c', 'Baixo': '#3f9d76',
}
const PRIORIDADE_RAIO: Record<string, number> = {
  'Crítico': 0.5, 'Alto': 0.36, 'Médio': 0.24, 'Baixo': 0.15,
}

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

// Vista travada no Brasil: centro geográfico aproximado do território, altitude fixa que
// enquadra bem as 27 capitais (todo o território nacional). Zoom desabilitado (enableZoom
// false) e rotação limitada a poucos graus em torno desse centro - dá pra "sentir" que é um
// globo 3D sem sair da região do Brasil.
const BRAZIL_VIEW = { lat: -14, lng: -53, altitude: 1.45 }
const ROTATION_LIMIT = 0.35 // radianos (~20°) de folga em cada eixo

// Única perspectiva do globo: panorama nacional (27 capitais, coloridas por prioridade real -
// risco físico x capacidade institucional). Substituiu o toggle risco/capacidade dos 5
// territórios críticos - essa visão ampla já cobre os 5 críticos (estão entre os pontos) sem
// duplicar a mesma informação em 3 modos diferentes.
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
    <div className="globe-shell" aria-label="Globo interativo com as 27 capitais do Brasil, coloridas por prioridade climática">
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
        pointColor={(point: object) => {
          const p = point as RiskPoint
          return p.prioridade ? PRIORIDADE_COR[p.prioridade] : '#5a6b62'
        }}
        pointRadius={(point: object) => {
          const p = point as RiskPoint
          return p.prioridade ? PRIORIDADE_RAIO[p.prioridade] : 0.08
        }}
        pointAltitude={0.04}
        pointLabel={(point: object) => (point as RiskPoint).label}
        onPointClick={(point: object) => {
          const p = point as RiskPoint
          if (p.risk < 0) return // sem avaliação institucional - nada pra mostrar no painel
          onSelect(p)
        }}
        ringsData={rings}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => '#d6e85c'}
        ringMaxRadius={2.5}
        ringPropagationSpeed={1.5}
        ringRepeatPeriod={900}
      />
    </div>
  )
}

export type { RiskPoint }
