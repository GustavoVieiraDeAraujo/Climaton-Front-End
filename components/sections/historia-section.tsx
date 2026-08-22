import { AiInsight } from '@/components/ai-insight'

export function HistoriaSection() {
  return <section id="historia" data-story="historia" className="story section-wrap">
    <div className="section-kicker">01 - A HISTÓRIA</div>
    <div className="story-grid">
      <div><h2>O futuro não chega de uma vez.<br /><span>Ele se acumula.</span></h2></div>
      <div className="story-copy">
        <p>O Painel ClimaBrasil avalia 26 estados, o Distrito Federal e 24 capitais em três eixos: governança, políticas públicas e financiamento climático - 45 itens, aplicados por auditores de tribunais de contas de todo o país.</p>
        <p>Cruzando essa capacidade institucional declarada com o risco físico real (AdaptaBrasil) e o dinheiro que de fato chega (orçamento público), a distância entre discurso e execução deixa de ser abstrata: vira uma lista nomeada de territórios, com evidência auditável atrás de cada número.</p>
      </div>
    </div>
    <div className="interpretation">
      <span>COMO LER ESTES DADOS</span>
      <p>O Painel ClimaBrasil mede se o mecanismo institucional existe - não se ele funciona. &quot;Avaliamos mecanismos, não resultados&quot; é a própria ressalva metodológica oficial do painel.</p>
    </div>
    <div className="stat-band">
      <div><strong>51</strong><small>territórios avaliados -<br />26 estados + DF + 24 capitais</small></div>
      <div><strong>5</strong><small>estão em prioridade crítica<br />agora: risco alto, capacidade baixa</small></div>
      <div><strong>4<span>/24</span></strong><small>capitais já identificaram<br />formalmente quem sofre primeiro</small></div>
    </div>
    <AiInsight secao="historia" />
  </section>
}
