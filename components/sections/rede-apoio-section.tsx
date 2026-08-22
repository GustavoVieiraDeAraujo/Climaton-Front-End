'use client'

import { useMemo, useState } from 'react'

// Rede fictícia (não existe fluxo oficial assim hoje) mostrando como um sinal relatado por um
// morador poderia escalar até virar objeto de auditoria: cidade -> defesa civil municipal ->
// órgão estadual -> TCU. Reaproveita as 6 cidades da seção Relatos (06) de propósito - é a
// continuação visual daquele feed, não um dado novo desconectado. Cada coluna já diz o que a
// etapa é (RELATO / DEFESA CIVIL MUNICIPAL / ÓRGÃO ESTADUAL / AUDITORIA), então cada nó só
// precisa do nome da cidade ou a sigla do estado.
//
// Além do escalonamento vertical (cidade -> município -> estado -> federal), 3 das 6 cidades
// (Fortaleza/CE, São Luís/MA, Maceió/AL) são vizinhas de região Nordeste - por isso ganham
// conexões horizontais entre si nas camadas de relato e de órgão estadual, inspiradas na
// coordenação regional real do Sistema Nacional de Proteção e Defesa Civil (SINPDEC). Macapá,
// Rio de Janeiro e Porto Alegre não têm par de região nesta amostra de 6, então ficam sem
// conexão horizontal - só o caminho vertical direto. Ao clicar, o grafo mostra TODOS os
// caminhos possíveis daquela cidade até o TCU, não só um.
const CIDADES = [
  { nome: 'Macapá', uf: 'AP' },
  { nome: 'Fortaleza', uf: 'CE' },
  { nome: 'São Luís', uf: 'MA' },
  { nome: 'Maceió', uf: 'AL' },
  { nome: 'Rio de Janeiro', uf: 'RJ' },
  { nome: 'Porto Alegre', uf: 'RS' },
]

const REGIAO_NORDESTE = ['CE', 'MA', 'AL']
const PARES_REGIONAIS: [string, string][] = [['CE', 'MA'], ['MA', 'AL'], ['AL', 'CE']]

const W = 820
const H = 420
const TOPO = 56
const COLX = [140, 380, 600, 760]
const COL_LABEL = ['RELATO', 'DEFESA CIVIL MUNICIPAL', 'ÓRGÃO ESTADUAL', 'AUDITORIA']

function linhaY(i: number, n: number) {
  return TOPO + (i + 0.5) * ((H - TOPO - 24) / n)
}

type No = { id: string; x: number; y: number; label: string; tier: number; uf: string | null }
type Aresta = { from: string; to: string; tipo: 'vertical' | 'regional' }

export function RedeApoioSection() {
  const [selecionado, setSelecionado] = useState<string | null>(null)

  const nos = useMemo<No[]>(() => {
    const n = CIDADES.length
    const relato = CIDADES.map((c, i) => ({ id: `relato-${c.uf}`, x: COLX[0], y: linhaY(i, n), label: c.nome, tier: 0, uf: c.uf }))
    const municipal = CIDADES.map((c, i) => ({ id: `municipal-${c.uf}`, x: COLX[1], y: linhaY(i, n), label: c.nome, tier: 1, uf: c.uf }))
    const estadual = CIDADES.map((c, i) => ({ id: `estadual-${c.uf}`, x: COLX[2], y: linhaY(i, n), label: c.uf, tier: 2, uf: c.uf }))
    const federal: No[] = [{ id: 'federal', x: COLX[3], y: H / 2, label: 'TCU', tier: 3, uf: null }]
    return [...relato, ...municipal, ...estadual, ...federal]
  }, [])

  const arestas = useMemo<Aresta[]>(() => {
    const vertical: Aresta[] = CIDADES.flatMap((c) => [
      { from: `relato-${c.uf}`, to: `municipal-${c.uf}`, tipo: 'vertical' as const },
      { from: `municipal-${c.uf}`, to: `estadual-${c.uf}`, tipo: 'vertical' as const },
      { from: `estadual-${c.uf}`, to: 'federal', tipo: 'vertical' as const },
    ])
    const regional: Aresta[] = PARES_REGIONAIS.flatMap(([a, b]) => [
      { from: `relato-${a}`, to: `relato-${b}`, tipo: 'regional' as const },
      { from: `estadual-${a}`, to: `estadual-${b}`, tipo: 'regional' as const },
    ])
    return [...vertical, ...regional]
  }, [])

  // Caminhos possíveis: a partir da cidade clicada, percorre o grafo (não-direcionado) inteiro
  // por BFS e marca toda aresta alcançável - não só a subida vertical. É assim que uma cidade
  // com par regional (CE/MA/AL) acende também os caminhos das vizinhas até o TCU.
  const alcancaveis = useMemo(() => {
    if (!selecionado) return null
    const adj = new Map<string, string[]>()
    for (const e of arestas) {
      adj.set(e.from, [...(adj.get(e.from) ?? []), e.to])
      adj.set(e.to, [...(adj.get(e.to) ?? []), e.from])
    }
    const visitados = new Set<string>([`relato-${selecionado}`])
    const fila = [`relato-${selecionado}`]
    while (fila.length) {
      const atual = fila.shift()!
      if (atual === 'federal') continue // nó federal é destino, não ponte pra outros ramos
      for (const vizinho of adj.get(atual) ?? []) {
        if (!visitados.has(vizinho)) { visitados.add(vizinho); fila.push(vizinho) }
      }
    }
    return visitados
  }, [selecionado, arestas])

  const porId = useMemo(() => new Map(nos.map((n) => [n.id, n])), [nos])
  const cidadesEnvolvidas = useMemo(() => {
    if (!alcancaveis) return []
    return CIDADES.filter((c) => alcancaveis.has(`relato-${c.uf}`))
  }, [alcancaveis])

  return <section id="rede-apoio" data-story="rede-apoio" className="territory section-wrap">
    <div className="section-kicker">07 - REDE DE APOIO</div>
    <div className="territory-heading">
      <h2>Do relato<br /><em>até a auditoria.</em></h2>
      <p>Protótipo: como um sinal relatado por um morador poderia escalar até virar objeto de auditoria - defesa civil municipal, órgão estadual, TCU - e como cidades vizinhas de região (linhas pontilhadas) multiplicam os caminhos possíveis. Clique numa cidade pra ver todos.</p>
    </div>
    <div className="relatos-disclaimer">
      <span>DADOS FICTÍCIOS - REDE ILUSTRATIVA</span>
      <p>Os nós e conexões abaixo foram desenhados pra esta demonstração e não representam um fluxo oficial de encaminhamento existente hoje. As conexões regionais (Fortaleza, São Luís, Maceió) se inspiram na coordenação real do Sistema Nacional de Proteção e Defesa Civil (SINPDEC) entre vizinhos - as demais cidades da amostra não têm par de região aqui, por isso ficam sem essa conexão extra.</p>
    </div>
    <div className="rede-panel">
      <svg viewBox={`0 0 ${W} ${H}`} className="rede-svg" role="img" aria-label="Rede de apoio do relato cidadão até a auditoria federal, com conexões regionais">
        {COL_LABEL.map((label, i) => (
          <text key={label} x={COLX[i]} y={26} fontSize="11.5" fontWeight={600} fill="#c1d0c3" textAnchor="middle" letterSpacing="0.06em">{label}</text>
        ))}
        {arestas.map((e) => {
          const a = porId.get(e.from)!
          const b = porId.get(e.to)!
          const ativo = !!alcancaveis && alcancaveis.has(e.from) && alcancaveis.has(e.to)
          return <line
            key={`${e.from}-${e.to}`}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={ativo ? '#d6e85c' : '#5a6f63'}
            strokeWidth={ativo ? (e.tipo === 'regional' ? 2.2 : 3) : 1.4}
            strokeDasharray={e.tipo === 'regional' ? '5 4' : undefined}
            opacity={alcancaveis && !ativo ? 0.18 : 1}
            style={{ transition: 'opacity .2s ease, stroke .2s ease' }}
          />
        })}
        {nos.map((n) => {
          const ativo = n.tier === 3 ? !!alcancaveis : !!alcancaveis && alcancaveis.has(n.id)
          const clicavel = n.tier === 0
          const temPar = n.uf && REGIAO_NORDESTE.includes(n.uf)
          return (
            <g
              key={n.id}
              onClick={clicavel ? () => setSelecionado(selecionado === n.uf ? null : n.uf) : undefined}
              style={{ cursor: clicavel ? 'pointer' : 'default' }}
              opacity={alcancaveis && !ativo ? 0.3 : 1}
            >
              <circle
                cx={n.x} cy={n.y}
                r={n.tier === 3 ? 13 : clicavel ? 8 : 6}
                fill={ativo ? '#d6e85c' : n.tier === 3 ? '#75b89a' : '#4d8a6e'}
                stroke={clicavel ? '#eef1ea' : temPar ? '#8fbfa0' : 'none'}
                strokeWidth={clicavel || temPar ? 1.5 : 0}
                style={{ transition: 'fill .2s ease' }}
              />
              <text
                x={n.tier === 0 ? n.x - 16 : n.x}
                y={n.tier === 0 ? n.y + 4.5 : n.tier === 3 ? n.y + 30 : n.y - 14}
                fontSize="13"
                fontWeight={n.tier === 0 || n.tier === 3 ? 600 : 400}
                fill={ativo ? '#f5f5f0' : '#e4ebe4'}
                textAnchor={n.tier === 0 ? 'end' : 'middle'}
              >
                {n.label}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="rede-nota">
        {cidadesEnvolvidas.length > 1
          ? `${cidadesEnvolvidas.length} caminhos possíveis até o TCU: ${cidadesEnvolvidas.map((c) => c.nome).join(', ')} - conectadas pela rede regional.`
          : cidadesEnvolvidas.length === 1
            ? `1 caminho possível: ${cidadesEnvolvidas[0].nome} não tem par de região nesta amostra, então segue direto até o TCU.`
            : 'Clique num ponto de cidade (coluna Relato) pra ver os caminhos possíveis até a auditoria.'}
      </p>
    </div>
  </section>
}
