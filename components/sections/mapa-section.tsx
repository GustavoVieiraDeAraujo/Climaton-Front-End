import { AiInsight } from '@/components/ai-insight'
import { BrazilMap } from '@/components/brazil-map'
import type { Cobertura } from '@/lib/api'

const FALLBACK_EXPLICACAO = 'Goiânia e Aracaju não constam na tabela de avaliações do Painel ClimaBrasil (fonte bruta painel-climabrasil-raw.csv) - não há avaliação de nenhum dos 45 itens para essas duas capitais no arquivo que baixamos. Não encontramos, nas fontes públicas que auditamos, uma nota oficial do Painel explicando por que essas duas faltam especificamente; o próprio painel se rotula como avaliação de "27 estados e 24 municípios" sem detalhar o critério de amostragem dos municípios. Por isso não afirmamos um motivo - só o fato, auditável, de que a avaliação institucional não existe para essas duas capitais.'
const FALLBACK_RISCO_FISICO = 'Goiânia e Aracaju TÊM risco físico real medido pelo AdaptaBrasil (mesma fonte usada para as outras 24) - só falta a metade institucional do cruzamento, por isso não é possível calcular prioridade pra elas.'
const FALLBACK_FONTE = 'entidades (tipo=Município) vs. adaptabrasil_risco - dataset_unificado/clima_brasil_climate_scanner.sqlite'

export function MapaSection({ cobertura }: { cobertura: Cobertura | null }) {
  return <section id="mapa" data-story="mapa" className="map-section section-wrap">
    <div className="section-kicker">04 - MAPA DO BRASIL</div>
    <div className="territory-heading">
      <h2>Cada estado<br /><em>conta uma parte.</em></h2>
      <p>27 capitais, risco real do AdaptaBrasil. As 24 avaliadas pelo Painel ClimaBrasil (+ DF) também mostram a prioridade calculada; Aracaju e Goiânia têm risco real, mas ainda sem avaliação institucional na amostra.</p>
    </div>
    <BrazilMap />
    <div className="coverage-panel">
      <h4>Por que 25 territórios-capital avaliados, e não 27?</h4>
      <p>{cobertura?.explicacao ?? FALLBACK_EXPLICACAO}</p>
      <p><b>{cobertura?.risco_fisico_disponivel ?? FALLBACK_RISCO_FISICO}</b></p>
      <div className="coverage-stats">
        <div><strong>27</strong><span>CAPITAIS NO UNIVERSO<br />26 ESTADUAIS + BRASÍLIA</span></div>
        <div><strong>25</strong><span>AVALIADAS PELO PAINEL<br />24 MUNICÍPIOS + DF</span></div>
        <div><strong>2</strong><span>AUSENTES DA AMOSTRA<br />GOIÂNIA E ARACAJU</span></div>
      </div>
      <span className="ai-insight-note">fonte: {cobertura?.fonte ?? FALLBACK_FONTE}</span>
    </div>
    <AiInsight secao="mapa" />
  </section>
}
