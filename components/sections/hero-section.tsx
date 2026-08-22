import { HeroScene } from '@/components/hero-scene'

export function HeroSection() {
  return <section id="inicio" className="hero section-wrap">
    <div className="hero-top">
      <div>
        <div className="eyebrow"><span className="eyebrow-dot" /> CLIMA EM AÇÃO · DATA STORY</div>
        <h1>A distância entre<br /><em>saber e agir.</em></h1>
      </div>
      <HeroScene />
    </div>
    <div className="hero-bottom">
      <strong className="hero-tagline">Não falta informação. Falta quem cobre com ela.</strong>
      <p>O Brasil não sofre por falta de dado climático - sofre pela distância entre o que já foi medido e o que ainda não foi cobrado. Esta leitura cruza o Painel ClimaBrasil, o AdaptaBrasil e o orçamento público pra fechar essa distância: 51 territórios (26 estados + Distrito Federal + 24 capitais-município), número real, prontos pra virar pergunta.</p>
    </div>
  </section>
}
