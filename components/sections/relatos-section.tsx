'use client'

import { useMemo, useState } from 'react'

// Protótipo de uma camada de relato cidadão (não existe ainda em nenhum canal oficial) - não
// são incidentes que já aconteceram, são SINAIS de que um pode estar a caminho (rachadura,
// erosão avançando, nível de água subindo) - o momento em que dá pra agir antes do desastre,
// não depois. Os 10 relatos abaixo são escritos pra essa demonstração, não são reais. Cidades
// batem propositalmente com os territórios em prioridade Crítica (Território, seção 03) -
// reforça o mesmo achado, não é coincidência.
const RELATOS = [
  { cidade: 'Macapá', uf: 'AP', bairro: 'Zona Norte', tipo: 'Rachadura em encosta', ha: 'há 2 dias', texto: 'Rachadura grande se abrindo numa encosta perto de casas - moradores dizem que está crescendo a cada chuva.' },
  { cidade: 'Macapá', uf: 'AP', bairro: 'Beirol', tipo: 'Erosão avançando', ha: 'há 6 dias', texto: 'Barranco do rio perdendo terreno rápido, árvores da margem já estão caindo.' },
  { cidade: 'Fortaleza', uf: 'CE', bairro: 'Praia de Iracema', tipo: 'Avanço do mar', ha: 'há 4 dias', texto: 'Água chegando mais perto das casas a cada maré alta - ninguém veio medir até agora.' },
  { cidade: 'Fortaleza', uf: 'CE', bairro: 'Barra do Ceará', tipo: 'Drenagem entupida', ha: 'há 1 dia', texto: 'Bueiro cheio de lixo há semanas - primeira chuva forte alaga a rua de novo.' },
  { cidade: 'São Luís', uf: 'MA', bairro: 'Vila Palmeira', tipo: 'Encosta instável', ha: 'há 3 dias', texto: 'Terra escorregando aos poucos atrás de casa, ninguém veio olhar ainda.' },
  { cidade: 'São Luís', uf: 'MA', bairro: 'Anjo da Guarda', tipo: 'Maré subindo', ha: 'há 5 dias', texto: 'Água chegando mais alto que no ano passado, na mesma maré de sempre.' },
  { cidade: 'Maceió', uf: 'AL', bairro: 'Jacintinho', tipo: 'Rio acima do normal', ha: 'há 2 dias', texto: 'Rio mais cheio que o normal pra essa época do ano, sem obra de contenção à vista.' },
  { cidade: 'Maceió', uf: 'AL', bairro: 'Bebedouro', tipo: 'Rachadura em muro', ha: 'há 7 dias', texto: 'Muro de contenção perto da escola com rachadura visível - área ainda não foi isolada.' },
  { cidade: 'Rio de Janeiro', uf: 'RJ', bairro: 'Rocinha', tipo: 'Trinca em barreira', ha: 'há 3 dias', texto: 'Trinca crescendo na barreira de contenção - moradores já avisaram e esperam resposta.' },
  { cidade: 'Porto Alegre', uf: 'RS', bairro: 'Sarandi', tipo: 'Nível do rio subindo', ha: 'há 4 dias', texto: 'Guaíba subindo de novo, na mesma velocidade do início de 2024.' },
]

export function RelatosSection() {
  const [filtro, setFiltro] = useState<string | null>(null)

  const ranking = useMemo(() => {
    const contagem = new Map<string, number>()
    for (const r of RELATOS) contagem.set(r.cidade, (contagem.get(r.cidade) ?? 0) + 1)
    return [...contagem.entries()].sort((a, b) => b[1] - a[1])
  }, [])

  const visiveis = filtro ? RELATOS.filter((r) => r.cidade === filtro) : RELATOS

  return <section id="relatos" data-story="relatos" className="territory section-wrap">
    <div className="section-kicker">06 - RELATOS DA COMUNIDADE</div>
    <div className="territory-heading">
      <h2>Os sinais antes<br /><em>do desastre.</em></h2>
      <p>Protótipo de uma funcionalidade futura: moradores relatando sinais de que algo pode estar a caminho - rachadura, erosão, nível de água subindo - no momento em que ainda dá pra agir, antes de virar manchete.</p>
    </div>
    <div className="relatos-disclaimer">
      <span>DADOS SIMULADOS - NÃO SÃO RELATOS REAIS</span>
      <p>Os sinais abaixo foram escritos pra esta demonstração e não vêm de nenhum canal de denúncia existente. Mostram como uma camada de alerta cidadão poderia complementar o dado oficial e auditado do resto deste painel - por isso as cidades coincidem com os territórios já em prioridade Crítica.</p>
    </div>
    <div className="relatos-layout">
      <div className="relatos-feed">
        {visiveis.map((r, i) => (
          <article className="relato-card" key={i}>
            <div className="relato-head">
              <span className="relato-local">{r.cidade}/{r.uf} · {r.bairro}</span>
              <span className="relato-tempo">{r.ha}</span>
            </div>
            <span className="relato-tipo">{r.tipo}</span>
            <p>{r.texto}</p>
          </article>
        ))}
      </div>
      <aside className="relatos-ranking">
        <span className="panel-label">MAIS SINAIS (SIMULADO)</span>
        {ranking.map(([cidade, n]) => (
          <button key={cidade} className={filtro === cidade ? 'active' : ''} onClick={() => setFiltro(filtro === cidade ? null : cidade)}>
            <span>{cidade}</span>
            <i>{n}</i>
          </button>
        ))}
      </aside>
    </div>
  </section>
}
