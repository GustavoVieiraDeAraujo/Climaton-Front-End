import { ComparacaoBrasilMundo } from '@/components/comparacao-brasil-mundo'

export function ComparacaoSection() {
  return <section id="comparacao" data-story="comparacao" className="insights-section">
    <div className="section-wrap">
      <div className="section-kicker light">10 - BRASIL x MUNDO</div>
      <div className="data-heading">
        <h2>Nota lá fora,<br /><em>nota aqui dentro.</em></h2>
        <p>Todo componente do Painel ClimaBrasil tem um equivalente no ranking global do ClimateScanner - às vezes a distância entre os dois é grande.</p>
      </div>
      <ComparacaoBrasilMundo />
    </div>
  </section>
}
