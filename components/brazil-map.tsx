'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const ComposableMap = dynamic(() => import('react-simple-maps').then((mod) => mod.ComposableMap), { ssr: false })
const Geographies = dynamic(() => import('react-simple-maps').then((mod) => mod.Geographies), { ssr: false })
const Geography = dynamic(() => import('react-simple-maps').then((mod) => mod.Geography), { ssr: false })
const Marker = dynamic(() => import('react-simple-maps').then((mod) => mod.Marker), { ssr: false })

const geoUrl = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson'

// Risco real (AdaptaBrasil, setor "desastres_geo_hidrologicos", ano-base 2020) e prioridade real
// (matriz risco x capacidade, view climate_gap_prioridade) para as 24 capitais avaliadas pelo
// Painel ClimaBrasil + DF. Aracaju e Goiânia têm risco real do AdaptaBrasil mas não têm avaliação
// do ClimaBrasil (não entraram na amostra) - por isso "prioridade: null" para essas duas, em vez
// de inventar uma classificação que a fonte não sustenta.
// Fonte: dataset_unificado/clima_brasil_climate_scanner.sqlite, view climate_gap_prioridade.
// Usado como fallback instantâneo enquanto a API (api/main.py, GET /capitais) responde, ou se
// estiver fora do ar - os valores já são os mesmos números reais, não um placeholder.
export const fallbackCapitals = [
  ['Rio Branco','AC',-9.97,-67.81,25,'Baixo'],
  ['Maceió','AL',-9.66,-35.73,65,'Crítico'],
  ['Macapá','AP',0.03,-51.07,65,'Crítico'],
  ['Manaus','AM',-3.1,-60.02,76,'Alto'],
  ['Salvador','BA',-12.97,-38.5,83,'Alto'],
  ['Fortaleza','CE',-3.73,-38.52,61,'Crítico'],
  ['Brasília','DF',-15.79,-47.88,50,'Médio'],
  ['Vitória','ES',-20.32,-40.34,0,'Baixo'],
  ['Goiânia','GO',-16.68,-49.25,77,null],
  ['São Luís','MA',-2.53,-44.3,63,'Crítico'],
  ['Cuiabá','MT',-15.6,-56.1,16,'Baixo'],
  ['Campo Grande','MS',-20.47,-54.62,19,'Médio'],
  ['Belo Horizonte','MG',-19.92,-43.94,0,'Baixo'],
  ['Belém','PA',-1.45,-48.5,74,'Alto'],
  ['João Pessoa','PB',-7.12,-34.86,54,'Médio'],
  ['Curitiba','PR',-25.43,-49.27,0,'Baixo'],
  ['Recife','PE',-8.05,-34.9,52,'Baixo'],
  ['Teresina','PI',-5.09,-42.8,70,'Alto'],
  ['Rio de Janeiro','RJ',-22.9,-43.17,62,'Médio'],
  ['Natal','RN',-5.79,-35.2,68,'Médio'],
  ['Porto Alegre','RS',-30.03,-51.23,72,'Alto'],
  ['Porto Velho','RO',-8.76,-63.9,37,'Médio'],
  ['Boa Vista','RR',2.82,-60.67,35,'Médio'],
  ['Florianópolis','SC',-27.59,-48.55,0,'Baixo'],
  ['São Paulo','SP',-23.55,-46.63,55,'Alto'],
  ['Aracaju','SE',-10.91,-37.07,59,null],
  ['Palmas','TO',-10.18,-48.33,26,'Baixo'],
].map(([name, uf, lat, lng, risk, prioridade]) => ({
  name: String(name), uf: String(uf), lat: Number(lat), lng: Number(lng),
  risk: Number(risk), prioridade: prioridade as string | null,
}))

const priorityColor: Record<string, string> = {
  'Crítico': '#b3392b',
  'Alto': '#c06a1e',
  'Médio': '#a6801c',
  'Baixo': '#1d6b4d',
}

export function BrazilMap() {
  const [capitals, setCapitals] = useState(fallbackCapitals)
  const [selected, setSelected] = useState(fallbackCapitals[3])
  const [live, setLive] = useState(false)

  useEffect(() => {
    api.capitais().then((r) => {
      const mapped = r.dados.map((c) => ({
        name: c.nome, uf: c.uf, lat: c.lat, lng: c.lng,
        risk: c.risco !== null ? Math.round(c.risco * 100) : 0,
        prioridade: c.prioridade,
      }))
      setCapitals(mapped)
      setSelected(mapped.find((c) => c.uf === 'AM') ?? mapped[3])
      setLive(true)
    }).catch(() => {})
  }, [])

  const color = selected.prioridade ? priorityColor[selected.prioridade] : '#9aa39c'
  return <div className="brazil-map-wrap">
    <div className="map-visual">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 680, center: [-54, -15] }} width={620} height={510}>
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: any[] }) => geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} style={{ default: { fill: '#9db2a0', outline: 'none', stroke: '#eef1ea', strokeWidth: 0.8 }, hover: { fill: '#7fa085', outline: 'none' }, pressed: { fill: '#6f8f75' } }} />
          ))}
        </Geographies>
        {capitals.map((capital) => {
          const isActive = selected.uf === capital.uf
          const dotColor = capital.prioridade ? priorityColor[capital.prioridade] : '#9aa39c'
          return (
            <Marker key={capital.uf} coordinates={[capital.lng, capital.lat]} onClick={() => setSelected(capital)}>
              <circle
                r={isActive ? 7 : 4.5}
                fill={dotColor}
                stroke="#f5f5f0"
                strokeWidth={isActive ? 2 : 1}
                className={isActive ? 'capital-marker active' : 'capital-marker'}
                style={{ cursor: 'pointer' }}
              />
            </Marker>
          )
        })}
      </ComposableMap>
      <span className="map-caption">27 capitais (24 avaliadas pelo Painel ClimaBrasil + DF) · clique em um ponto para explorar {live ? '· dado ao vivo da API' : '· último dado real conhecido'}</span>
    </div>
    <aside className="map-insight">
      <span className="panel-label">CAPITAL SELECIONADA · {selected.uf}</span>
      <strong>{selected.name}</strong>
      <span className="map-uf" style={{ color }}>risco climático {selected.risk}% {selected.prioridade ? `· prioridade ${selected.prioridade}` : '· sem avaliação do Painel ClimaBrasil'}</span>
      <p>
        {selected.prioridade
          ? `Cruzando risco climático real (AdaptaBrasil) com a capacidade institucional declarada ao Painel ClimaBrasil, ${selected.name} está em prioridade ${selected.prioridade.toLowerCase()}.`
          : `${selected.name} tem risco climático real medido pelo AdaptaBrasil, mas não faz parte da amostra de 24 capitais avaliadas pelo Painel ClimaBrasil - por isso não é possível calcular a capacidade institucional aqui.`}
      </p>
      <div className="risk-legend">
        <span><i className="dot" style={{ background: priorityColor['Crítico'] }} /> crítico</span>
        <span><i className="dot" style={{ background: priorityColor['Alto'] }} /> alto</span>
        <span><i className="dot" style={{ background: priorityColor['Médio'] }} /> médio</span>
        <span><i className="dot" style={{ background: priorityColor['Baixo'] }} /> baixo</span>
        <span><i className="dot" style={{ background: '#9aa39c' }} /> sem avaliação</span>
      </div>
      <span className="ai-insight-note">fonte: risco - AdaptaBrasil (MCTI); prioridade - view climate_gap_prioridade, dataset_unificado/clima_brasil_climate_scanner.sqlite, servida por api/main.py</span>
    </aside>
  </div>
}

export { fallbackCapitals as brazilRiskData }
