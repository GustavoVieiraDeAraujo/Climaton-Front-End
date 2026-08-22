import { TerritoriosScatter } from '@/components/territorios-scatter'

export function PrioridadesSection() {
  return <section id="prioridades" data-story="prioridades" className="territory section-wrap">
    <div className="section-kicker">04 - PRIORIDADES</div>
    <div className="territory-heading">
      <h2>Os 51 territórios,<br /><em>numa matriz só.</em></h2>
      <p>26 estados + Distrito Federal + 24 capitais-município - o universo subnacional avaliado pelo Painel ClimaBrasil. Cada ponto cruza capacidade institucional (eixo horizontal) com risco físico real (eixo vertical). Quanto mais acima e mais à esquerda, maior a prioridade.</p>
    </div>
    <TerritoriosScatter />
  </section>
}
