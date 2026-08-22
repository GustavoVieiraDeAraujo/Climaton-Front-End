import { RiskGlobe, type RiskPoint } from '@/components/risk-globe'

type Props = {
  selectedPoint: RiskPoint
  setSelectedPoint: (point: RiskPoint) => void
  selectedInsight: RiskPoint
  allPoints: RiskPoint[]
}

export function TerritorioSection({ selectedPoint, setSelectedPoint, selectedInsight, allPoints }: Props) {
  return <section id="territorio" data-story="territorio" className="territory section-wrap">
    <div className="section-kicker">03 - TERRITÓRIO</div>
    <div className="territory-heading">
      <h2>As 27 capitais,<br /><em>prioridade por prioridade.</em></h2>
      <p>Risco climático real (AdaptaBrasil) cruzado com capacidade institucional declarada (Painel ClimaBrasil) - a cor de cada capital é a prioridade resultante desse cruzamento. Explore os pontos.</p>
    </div>
    <div className="territory-layout">
      <RiskGlobe points={allPoints} selected={selectedPoint.name} onSelect={setSelectedPoint} />
      <aside className="territory-insight">
        <span className="insight-number">{selectedPoint.risk}%</span>
        <span className="panel-label">RISCO CLIMÁTICO REAL · {selectedPoint.name.toUpperCase()}</span>
        <h3>{selectedPoint.label}</h3>
        <p>{selectedInsight.insight}</p>
        <div className="risk-legend">
          <span><i className="dot" style={{ background: '#e0574a' }} /> crítico</span>
          <span><i className="dot" style={{ background: '#d98a3f' }} /> alto</span>
          <span><i className="dot" style={{ background: '#d6e85c' }} /> médio</span>
          <span><i className="dot" style={{ background: '#3f9d76' }} /> baixo</span>
        </div>
        <span className="ai-insight-note">Arraste um pouco pra explorar - a vista fica travada na região do Brasil.</span>
      </aside>
    </div>
  </section>
}
