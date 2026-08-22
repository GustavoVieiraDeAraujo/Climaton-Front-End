import type { GastoDesastres, GastoDesastresAno } from '@/lib/api'

// Fallback com os mesmos números reais já confirmados via API (não é placeholder) - usado só
// enquanto a chamada ao back-end não responde.
const FALLBACK_SERIE: GastoDesastresAno[] = [
  { ano: 2010, recuperacao: 5329256038.64, prevencao: 2277135589.4 },
  { ano: 2011, recuperacao: 2606548937.83, prevencao: 1897609678.35 },
  { ano: 2012, recuperacao: 4043893015.05, prevencao: 1939406126.69 },
  { ano: 2013, recuperacao: 5500318491.2, prevencao: 4715966424.11 },
  { ano: 2014, recuperacao: 4410831097.59, prevencao: 2890043902.23 },
  { ano: 2015, recuperacao: 2334967372.57, prevencao: 1316771981.99 },
  { ano: 2016, recuperacao: 2733868725.98, prevencao: 1031470379.36 },
  { ano: 2017, recuperacao: 2343813839.93, prevencao: 892527278.02 },
  { ano: 2018, recuperacao: 1612637043.73, prevencao: 1087333732.23 },
  { ano: 2019, recuperacao: 1359579142.25, prevencao: 942651114.57 },
  { ano: 2020, recuperacao: 1593732456.2, prevencao: 1206852716.68 },
  { ano: 2021, recuperacao: 1005166788.26, prevencao: 795054786.86 },
  { ano: 2022, recuperacao: 1212244160.22, prevencao: 688817619.84 },
  { ano: 2023, recuperacao: 1322033557.25, prevencao: 785663033.89 },
]

function HeatmapGastos({ serie }: { serie: GastoDesastresAno[] }) {
  const max = Math.max(...serie.flatMap((s) => [s.recuperacao, s.prevencao]))
  const cor = (v: number, tom: 'r' | 'p') => {
    const t = 0.12 + (v / max) * 0.88
    return tom === 'r' ? `rgba(224,87,74,${t})` : `rgba(63,157,118,${t})`
  }
  const bi = (v: number) => `R$${(v / 1e9).toFixed(1).replace('.', ',')}bi`

  return <div className="gastos-heatmap">
    <div className="heatmap-row">
      <span className="heatmap-label">Recuperação</span>
      {serie.map((s) => (
        <span key={s.ano} className="heatmap-cell" style={{ background: cor(s.recuperacao, 'r') }} title={`${s.ano}: ${bi(s.recuperacao)} em resposta e recuperação`} />
      ))}
    </div>
    <div className="heatmap-row">
      <span className="heatmap-label">Prevenção</span>
      {serie.map((s) => (
        <span key={s.ano} className="heatmap-cell" style={{ background: cor(s.prevencao, 'p') }} title={`${s.ano}: ${bi(s.prevencao)} em prevenção real`} />
      ))}
    </div>
    <div className="heatmap-row heatmap-years">
      <span className="heatmap-label" />
      {serie.map((s) => <span key={s.ano} className="heatmap-year">{String(s.ano).slice(2)}</span>)}
    </div>
    <p className="heatmap-note">Cada célula é um ano; quanto mais escura, maior o gasto. Vermelho mais escuro que verde em quase todo ano: mais dinheiro pra remediar desastres do que pra evitá-los.</p>
  </div>
}

export function HistoriaSection({ gastoDesastres }: { gastoDesastres: GastoDesastres | null }) {
  const recuperacaoBi = gastoDesastres ? (gastoDesastres.resposta_recuperacao / 1e9).toFixed(1).replace('.', ',') : '37,4'
  const prevencaoBi = gastoDesastres ? (gastoDesastres.prevencao_total / 1e9).toFixed(1).replace('.', ',') : '22,5'
  const razao = gastoDesastres?.razao_recuperacao_por_prevencao ? gastoDesastres.razao_recuperacao_por_prevencao.toFixed(2).replace('.', ',') : '1,67'
  const serie = gastoDesastres?.serie_anual?.length ? gastoDesastres.serie_anual : FALLBACK_SERIE

  return <section id="historia" data-story="historia" className="story section-wrap">
    <div className="section-kicker">01 - A HISTÓRIA</div>
    <div className="story-grid">
      <div><h2>O futuro não chega de uma vez.<br /><span>Ele se acumula.</span></h2></div>
      <div className="story-copy">
        <p>O Painel ClimaBrasil avalia 26 estados, o Distrito Federal e 24 capitais em três eixos - governança, políticas públicas e financiamento climático - 45 itens, aplicados por auditores de tribunais de contas de todo o país.</p>
        <p>Das enchentes que devastaram o Rio Grande do Sul em 2024 aos deslizamentos de Petrópolis em 2022 e às secas recordes na Amazônia, o padrão financeiro se repete: o dinheiro público chega depois do estrago, para reconstruir - raramente antes, para evitar.</p>
      </div>
    </div>
    <div className="stat-band">
      <div><strong>R${recuperacaoBi}bi</strong><small>em resposta e recuperação de<br />desastres (2010-2023)</small></div>
      <div><strong>R${prevencaoBi}bi</strong><small>em prevenção real - sem o crédito<br />agrícola que infla o número bruto</small></div>
      <div><strong>{razao}<span>×</span></strong><small>mais gasto remediando desastres<br />do que evitando-os</small></div>
    </div>
    <HeatmapGastos serie={serie} />
  </section>
}
