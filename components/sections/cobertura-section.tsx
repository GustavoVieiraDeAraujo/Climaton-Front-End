import type { Cobertura } from '@/lib/api'

const FALLBACK_EXPLICACAO = 'Goiânia e Aracaju não constam na tabela de avaliações do Painel ClimaBrasil (fonte bruta painel-climabrasil-raw.csv) - não há avaliação de nenhum dos 45 itens para essas duas capitais no arquivo que baixamos. Não encontramos, nas fontes públicas que auditamos, uma nota oficial do Painel explicando por que essas duas faltam especificamente; o próprio painel se rotula como avaliação de "27 estados e 24 municípios" sem detalhar o critério de amostragem dos municípios. Por isso não afirmamos um motivo - só o fato, auditável, de que a avaliação institucional não existe para essas duas capitais.'
const FALLBACK_RISCO_FISICO = 'Goiânia e Aracaju TÊM risco físico real medido pelo AdaptaBrasil (mesma fonte usada para as outras 24) - só falta a metade institucional do cruzamento, por isso não é possível calcular prioridade pra elas.'

export function CoberturaSection({ cobertura }: { cobertura: Cobertura | null }) {
  return <section id="cobertura" data-story="cobertura" className="map-section section-wrap">
    <div className="section-kicker">08 - COBERTURA DA AMOSTRA</div>
    <div className="coverage-panel">
      <h4>Os 51 territórios têm três formatos diferentes</h4>
      <p>26 <b>estados</b>, avaliados como unidade federativa - governo estadual, orçamento próprio, competências constitucionais de estado. 24 <b>capitais-município</b>, avaliadas como prefeitura - governo municipal, competências de município. E 1 <b>Distrito Federal</b>, avaliado à parte dos outros dois grupos.</p>
      <p><b>Brasília não é nem um nem outro.</b> A Constituição de 1988 criou o Distrito Federal como uma unidade federativa própria - ele não é um estado (não tem os 26 estados como pares) e não é um município (não é dividido em prefeituras, e sim em regiões administrativas). Por isso o Painel ClimaBrasil - e este site - trata o DF como sua própria categoria, nem somado aos 26 estados nem aos 24 municípios.</p>
      <div className="coverage-stats">
        <div><strong>26</strong><span>ESTADOS<br />UNIDADE FEDERATIVA</span></div>
        <div><strong>1</strong><span>DISTRITO FEDERAL<br />CATEGORIA PRÓPRIA</span></div>
        <div><strong>24</strong><span>CAPITAIS-MUNICÍPIO<br />UNIDADE MUNICIPAL</span></div>
      </div>
    </div>
    <div className="coverage-panel">
      <h4>Por que 25 territórios-capital avaliados, e não 27?</h4>
      <p>{cobertura?.explicacao ?? FALLBACK_EXPLICACAO}</p>
      <p><b>{cobertura?.risco_fisico_disponivel ?? FALLBACK_RISCO_FISICO}</b></p>
      <div className="coverage-stats">
        <div><strong>27</strong><span>CAPITAIS<br />26 ESTADUAIS + BRASÍLIA</span></div>
        <div><strong>25</strong><span>AVALIADAS PELO PAINEL<br />24 MUNICÍPIOS + DF</span></div>
        <div><strong>2</strong><span>AUSENTES DA AMOSTRA<br />GOIÂNIA E ARACAJU</span></div>
      </div>
    </div>
  </section>
}
