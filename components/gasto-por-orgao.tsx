'use client'

import { useEffect, useMemo, useState } from 'react'
import { api, type OrgaoGasto } from '@/lib/api'

type Dimensao = 'gasto_clima' | 'gasto_desastres' | 'gasto_biodiversidade'
const DIMENSOES: { key: Dimensao; label: string }[] = [
  { key: 'gasto_clima', label: 'Mudança climática' },
  { key: 'gasto_desastres', label: 'Desastres' },
  { key: 'gasto_biodiversidade', label: 'Biodiversidade' },
]

// Ranking horizontal clicável: alterna qual das 3 dimensões paralelas do Painel de Gastos
// Climáticos ordena e dimensiona as barras. Objetivo (um clique, uma pergunta: "por órgão,
// quem gasta mais em quê") em vez de mais uma tabela estática.
export function GastoPorOrgao() {
  const [rows, setRows] = useState<OrgaoGasto[]>([])
  const [fonte, setFonte] = useState('')
  const [dimensao, setDimensao] = useState<Dimensao>('gasto_clima')

  useEffect(() => {
    api.gastosPorOrgao(8).then((r) => { setRows(r.dados); setFonte(r.fonte) }).catch(() => {})
  }, [])

  const sorted = useMemo(() => [...rows].sort((a, b) => b[dimensao] - a[dimensao]), [rows, dimensao])
  const max = sorted[0]?.[dimensao] || 1

  return <div className="bi-panel">
    <div className="bi-panel-head">
      <h3>Quem gasta mais, por órgão</h3>
      <small>top 8 órgãos orçamentários, 2010-2023, valores brutos por dimensão</small>
    </div>
    <div className="dim-toggle">
      {DIMENSOES.map((d) => (
        <button key={d.key} className={dimensao === d.key ? 'active' : ''} onClick={() => setDimensao(d.key)}>{d.label}</button>
      ))}
    </div>
    <div className="hbar-list">
      {sorted.map((o) => (
        <div className="hbar-row" key={o.orgao}>
          <span className="hbar-label">{o.orgao.replace(/^\d+ - /, '')}</span>
          <span className="hbar-track"><span className="hbar-fill" style={{ width: `${(o[dimensao] / max) * 100}%` }} /></span>
          <span className="hbar-value">R${(o[dimensao] / 1e9).toFixed(1)}bi</span>
        </div>
      ))}
      {rows.length === 0 && <span className="bi-fonte on-dark">Carregando da API…</span>}
    </div>
    {fonte && <span className="bi-fonte on-dark">fonte: {fonte}</span>}
  </div>
}
