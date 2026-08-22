import { AiInsight } from '@/components/ai-insight'
import { RiskGlobe, type RiskPoint } from '@/components/risk-globe'
import { TerritoriosScatter } from '@/components/territorios-scatter'

type Props = {
  riskPoints: RiskPoint[]
  selectedPoint: RiskPoint
  setSelectedPoint: (point: RiskPoint) => void
  selectedInsight: RiskPoint
}

export function TerritorioSection({ riskPoints, selectedPoint, setSelectedPoint, selectedInsight }: Props) {
  return <section id="territorio" data-story="territorio" className="territory section-wrap">
    <div className="section-kicker">03 - TERRITÓRIO</div>
    <div className="territory-heading">
      <h2>5 territórios em<br /><em>prioridade crítica.</em></h2>
      <p>Risco climático real (AdaptaBrasil) cruzado com capacidade institucional declarada (Painel ClimaBrasil) - matriz de prioridade, não subtração de escalas diferentes. Explore os pontos.</p>
    </div>
    <div className="interpretation">
      <span>COMO LER ESTES DADOS</span>
      <p>Cada ponto é um território real, com nome e dado auditado. O tamanho e a cor representam o risco; a prioridade vem do cruzamento com a capacidade institucional.</p>
    </div>
    <div className="territory-layout">
      <RiskGlobe points={riskPoints} selected={selectedPoint.name} onSelect={setSelectedPoint} />
      <aside className="territory-insight">
        <span className="insight-number">{selectedPoint.risk}%</span>
        <span className="panel-label">RISCO CLIMÁTICO REAL · {selectedPoint.name.toUpperCase()}</span>
        <h3>{selectedPoint.label}</h3>
        <p>{selectedInsight.insight}</p>
        <div className="risk-legend"><span><i className="dot high" /> prioridade crítica</span><span><i className="dot medium" /> risco elevado</span></div>
      </aside>
    </div>
    <TerritoriosScatter />
    <AiInsight secao="territorio" />
  </section>
}
