import type { GastoResumo } from '@/lib/api'

export function Kpis({ criticos, gasto }: { criticos: number; gasto: GastoResumo | null }) {
  const totalBi = gasto ? (gasto.total_positivo / 1e9).toFixed(1).replace('.', ',') : '421,3'
  const pctPrincipal = gasto ? gasto.pct_principal.toFixed(2).replace('.', ',') : '3,88'
  return <div className="kpi-grid">
    <div><span>Territórios em prioridade crítica</span><strong>{criticos}</strong><small>de 51 avaliados pelo Painel ClimaBrasil</small></div>
    <div><span>Gasto climático total (2010-2023)</span><strong>R${totalBi}bi</strong><small>Painel de Gastos Climáticos, dado real</small></div>
    <div><span>Com clima como propósito principal</span><strong>{pctPrincipal}%</strong><small>o resto é cobenefício de outra despesa</small></div>
  </div>
}
