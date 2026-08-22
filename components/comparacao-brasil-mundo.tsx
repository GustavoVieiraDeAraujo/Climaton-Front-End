'use client'

import { useEffect, useMemo, useState } from 'react'
import { api, type ComparacaoLinha } from '@/lib/api'

// Dumbbell chart: cada componente é uma linha ligando a média subnacional real (verde) à
// média mundial (bege), com a nota do Brasil-país marcada em cima (losango lima) - o mesmo
// desenho que expõe visualmente o achado do G7 (Brasil-país 1,0 vs. subnacional 0,456)
// se repete (ou não) nos outros 13 componentes. Ordenado pelo maior hiato subnacional↔mundo,
// clicável pra fixar o detalhe.
export function ComparacaoBrasilMundo() {
  const [rows, setRows] = useState<ComparacaoLinha[]>([])
  const [active, setActive] = useState<ComparacaoLinha | null>(null)

  useEffect(() => {
    api.comparacaoBrasilMundo().then((r) => setRows(r.dados)).catch(() => {})
  }, [])

  const sorted = useMemo(
    () => [...rows].sort((a, b) => (b.media_mundial - b.media_brasil_subnacional) - (a.media_mundial - a.media_brasil_subnacional)),
    [rows],
  )

  return <div className="bi-panel">
    <div className="bi-panel-head">
      <h3>Brasil por dentro vs. Brasil lá fora, os 14 componentes</h3>
      <small>ordenado pelo maior hiato entre a média real e a média mundial</small>
    </div>
    <div className="bi-legend">
      <span><i style={{ background: '#4d8a6e' }} /> média subnacional (51 territórios reais)</span>
      <span><i style={{ background: '#d6e85c', borderRadius: '50%' }} /> Brasil como país (ClimateScanner Global)</span>
      <span><i style={{ background: '#c1d0c3' }} /> média mundial (101 países)</span>
    </div>
    <div className="dumbbell-list">
      {sorted.map((r) => {
        const isActive = active?.componente_brasil === r.componente_brasil
        const lo = Math.min(r.media_brasil_subnacional, r.media_mundial) * 100
        const hi = Math.max(r.media_brasil_subnacional, r.media_mundial) * 100
        return (
          <button key={r.componente_brasil} className={`dumbbell-row${isActive ? ' active' : ''}`} onClick={() => setActive(isActive ? null : r)}>
            <span className="dumbbell-label">{r.componente_brasil} <small>{r.nome_componente}</small></span>
            <span className="dumbbell-track">
              <span className="dumbbell-bar" style={{ left: `${lo}%`, width: `${hi - lo}%` }} />
              <span className="dumbbell-dot subnacional" style={{ left: `${r.media_brasil_subnacional * 100}%` }} />
              <span className="dumbbell-dot mundo" style={{ left: `${r.media_mundial * 100}%` }} />
              <span className="dumbbell-diamond" style={{ left: `${r.media_brasil_como_pais_no_global * 100}%` }} />
            </span>
            <span className="dumbbell-value">{Math.round(r.media_brasil_subnacional * 100)}%</span>
          </button>
        )
      })}
      {rows.length === 0 && <span className="bi-fonte on-dark">Carregando da API…</span>}
    </div>
    {active && <div className="dumbbell-detail">
      <strong>{active.componente_brasil} · {active.nome_componente}</strong>
      <p>Subnacional real: {Math.round(active.media_brasil_subnacional * 100)}% · Brasil-país: {Math.round(active.media_brasil_como_pais_no_global * 100)}% · Mundo: {Math.round(active.media_mundial * 100)}%</p>
    </div>}
  </div>
}
