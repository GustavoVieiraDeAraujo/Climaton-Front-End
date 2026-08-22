import { AiInsight } from '@/components/ai-insight'

export function AcaoSection() {
  return <section id="acao" data-story="acao" className="action section-wrap">
    <div className="section-kicker">06 - A AÇÃO</div>
    <h2>Dados mostram o caminho.<br /><em>A escolha é nossa.</em></h2>
    <div className="action-grid">
      <p>Este protótipo já roda sobre dado real e auditado. Qualquer visitante, cidadão, gestor ou auditor pode ir do diagnóstico à cobrança sabendo exatamente de onde cada número veio.</p>
      <a className="primary-cta" href="https://sites.tcu.gov.br/climatonbrasil/" target="_blank" rel="noreferrer">Conheça o ClimatonBrasil 2026 <span>↗</span></a>
    </div>
    <AiInsight secao="acao" />
  </section>
}
