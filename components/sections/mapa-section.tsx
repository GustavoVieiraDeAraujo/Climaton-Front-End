import { BrazilMap } from '@/components/brazil-map'

export function MapaSection() {
  return <section id="mapa" data-story="mapa" className="map-section section-wrap">
    <div className="section-kicker">05 - MAPA DO BRASIL</div>
    <div className="territory-heading">
      <h2>Cada estado<br /><em>conta uma parte.</em></h2>
      <p>27 capitais, risco real do AdaptaBrasil. As 24 avaliadas pelo Painel ClimaBrasil (+ DF) também mostram a prioridade calculada; Aracaju e Goiânia têm risco real, mas ainda sem avaliação institucional na amostra.</p>
    </div>
    <BrazilMap />
  </section>
}
