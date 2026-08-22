import { AiInsight } from '@/components/ai-insight'
import { ComparacaoBrasilMundo } from '@/components/comparacao-brasil-mundo'
import type { GastoResumo } from '@/lib/api'

export function InsightsSection({ gasto }: { gasto: GastoResumo | null }) {
  const totalBi = gasto ? (gasto.total_positivo / 1e9).toFixed(1).replace('.', ',') : '421,3'
  const pctPrincipal = gasto ? gasto.pct_principal.toFixed(2).replace('.', ',') : '3,88'

  return <section id="insights" data-story="insights" className="insights-section">
    <div className="section-wrap">
      <div className="section-kicker light">05 - INSIGHTS</div>
      <div className="data-heading">
        <h2>O que a leitura<br /><em>revela.</em></h2>
        <p>Três achados reais, auditados, prontos pra virar pergunta de cobrança.</p>
      </div>
      <div className="interpretation dark-interpretation">
        <span>COMO LER ESTES DADOS</span>
        <p>Cada insight abaixo tem uma query e uma fonte específica no banco unificado - nenhum número aqui é estimativa solta.</p>
      </div>
      <div className="insight-grid">
        <article><span>01</span><h3>Quase tudo é cobenefício</h3><p>Dos R${totalBi}bi de gasto climático &quot;positivo&quot; em 14 anos, só {pctPrincipal}% teve o clima como propósito principal desde o desenho da despesa - o resto é efeito secundário de outra política. <small>fonte: view gasto_ambiental_serie_anual, Painel de Gastos Climáticos (Tesouro/MF)</small></p></article>
        <article><span>02</span><h3>Só 4 de 24 sabem quem sofre primeiro</h3><p>Das capitais avaliadas em Justiça Climática, apenas Fortaleza, Porto Alegre, Rio de Janeiro e Salvador identificaram formalmente os grupos mais vulneráveis. 7 estão em &quot;sem progresso&quot; total. <small>fonte: avaliacoes, componente BR_G6 item A, Painel ClimaBrasil</small></p></article>
        <article><span>03</span><h3>Nota 1,0 lá fora, 0,456 aqui dentro</h3><p>O Brasil-país tira nota máxima em Fiscalização e Litígio Climático no ranking global do ClimateScanner - mas a média real dos 51 territórios subnacionais é menos da metade disso. <small>fonte: view comparacao_brasil_vs_mundo, componente G7 ↔ GL_G10</small></p></article>
      </div>
      <ComparacaoBrasilMundo />
      <AiInsight secao="insights" />
    </div>
  </section>
}
