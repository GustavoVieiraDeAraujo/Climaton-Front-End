import { HeroScene } from '@/components/hero-scene'

export function HeroSection() {
  return <section id="inicio" className="hero section-wrap">
    <HeroScene />
    <div className="eyebrow"><span className="eyebrow-dot" /> CLIMA EM AÇÃO · DATA STORY</div>
    <h1>A distância entre<br /><em>saber e agir.</em></h1>
    <div className="hero-bottom">
      <p>&quot;O problema não é a falta de dados. É a distância entre informação disponível e ação possível&quot; - é a própria organização do ClimatonBrasil quem diz isso. Esta leitura cruza o Painel ClimaBrasil, o AdaptaBrasil e o orçamento público pra mostrar essa distância com número real, território por território.</p>
    </div>
  </section>
}
