'use client'

import { useEffect, useMemo, useState } from 'react'
import { api, type Territorio } from '@/lib/api'

const priorityColor: Record<string, string> = {
  'Crítico': '#e0574a',
  'Alto': '#d98a3f',
  'Médio': '#c9a83f',
  'Baixo': '#3f9d76',
}

const W = 620
const H = 420
const PAD = 44

// A matriz de prioridade do Climate Gap, visualizada de verdade: cada um dos 51 territórios
// é um ponto (capacidade institucional × risco físico), não uma linha de tabela. As linhas-
// guia marcam os cortes de faixa usados na view (capacidade em 0,333/0,667; risco nas faixas
// do AdaptaBrasil colapsadas). Clique num ponto pra fixar o painel de detalhe; passe o mouse
// pra pré-visualizar sem clicar.
export function TerritoriosScatter() {
  const [rows, setRows] = useState<Territorio[]>([])
  const [fonte, setFonte] = useState('')
  const [hover, setHover] = useState<Territorio | null>(null)
  const [pinned, setPinned] = useState<Territorio | null>(null)

  useEffect(() => {
    api.territorios().then((r) => { setRows(r.dados); setFonte(r.fonte) }).catch(() => {})
  }, [])

  const active = hover || pinned
  const x = (cap: number) => PAD + cap * (W - PAD * 1.4)
  const y = (risco: number) => H - PAD - risco * (H - PAD * 1.6)

  const sorted = useMemo(() => [...rows].sort((a, b) => b.gap - a.gap), [rows])

  return <div className="bi-panel">
    <div className="bi-panel-head">
      <h3>A matriz de prioridade, os 51 pontos</h3>
      <small>eixo X: capacidade institucional (P5) · eixo Y: risco físico real (AdaptaBrasil)</small>
    </div>
    <div className="scatter-layout">
      <svg viewBox={`0 0 ${W} ${H}`} className="scatter-svg" role="img" aria-label="Dispersão risco por capacidade dos 51 territórios">
        <line x1={PAD} y1={H - PAD} x2={W - PAD * 0.4} y2={H - PAD} stroke="#405249" strokeWidth={1} />
        <line x1={PAD} y1={PAD * 0.6} x2={PAD} y2={H - PAD} stroke="#405249" strokeWidth={1} />
        {[0.333, 0.667].map((cut) => (
          <line key={`vx${cut}`} x1={x(cut)} y1={PAD * 0.6} x2={x(cut)} y2={H - PAD} stroke="#2e3f36" strokeDasharray="3 4" />
        ))}
        <line x1={PAD} y1={y(0.5)} x2={W - PAD * 0.4} y2={y(0.5)} stroke="#2e3f36" strokeDasharray="3 4" />
        <text x={PAD} y={H - PAD + 18} fontSize="9" fill="#94a49a">baixa capacidade</text>
        <text x={W - PAD * 0.4} y={H - PAD + 18} fontSize="9" fill="#94a49a" textAnchor="end">alta capacidade</text>
        <text x={PAD - 8} y={PAD * 0.6 + 8} fontSize="9" fill="#94a49a" textAnchor="end">risco alto</text>
        <text x={PAD - 8} y={H - PAD} fontSize="9" fill="#94a49a" textAnchor="end">risco baixo</text>
        {rows.map((t) => {
          const isActive = active?.territorio === t.territorio && active?.tipo === t.tipo
          return (
            <circle
              key={`${t.territorio}-${t.tipo}`}
              cx={x(t.capacidade_p5)}
              cy={y(t.risco)}
              r={isActive ? 8 : 5}
              fill={priorityColor[t.prioridade]}
              fillOpacity={isActive ? 1 : 0.75}
              stroke={isActive ? '#f5f5f0' : 'none'}
              strokeWidth={isActive ? 2 : 0}
              style={{ cursor: 'pointer', transition: 'r .15s ease' }}
              onMouseEnter={() => setHover(t)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setPinned(pinned?.territorio === t.territorio && pinned?.tipo === t.tipo ? null : t)}
            />
          )
        })}
      </svg>
      <aside className="scatter-detail">
        {active ? <>
          <span className="panel-label">{pinned ? 'FIXADO · CLIQUE PRA SOLTAR' : 'PASSANDO O MOUSE'} · {active.tipo.toUpperCase()}</span>
          <strong>{active.territorio}</strong>
          <span className="map-uf" style={{ color: priorityColor[active.prioridade] }}>prioridade {active.prioridade.toLowerCase()}</span>
          <p>risco {Math.round(active.risco * 100)}% ({active.faixa_risco}) · capacidade {Math.round(active.capacidade_p5 * 100)}% ({active.faixa_capacidade}) · gap {active.gap >= 0 ? '+' : ''}{Math.round(active.gap * 100)}%</p>
        </> : <>
          <span className="panel-label">PASSE O MOUSE OU CLIQUE NUM PONTO</span>
          <p>Cada ponto é um dos 51 territórios avaliados. Os 5 em prioridade Crítica (vermelho) têm risco alto e capacidade baixa ao mesmo tempo.</p>
          <div className="scatter-top5">
            <span className="panel-label">MAIORES GAPS</span>
            {sorted.slice(0, 5).map((t) => (
              <button key={`${t.territorio}-${t.tipo}`} onClick={() => setPinned(t)}>
                <i style={{ background: priorityColor[t.prioridade] }} /> {t.territorio}
              </button>
            ))}
          </div>
        </>}
      </aside>
    </div>
    {fonte && <span className="bi-fonte">fonte: {fonte}</span>}
  </div>
}
