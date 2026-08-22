'use client'

import Link from 'next/link'

// Os 3 eixos reais do Painel ClimaBrasil (não uma categorização nossa — é a estrutura oficial
// do framework: componentes.eixo no banco). Cada card leva pra uma página de drill-down própria
// (/eixo/[slug]) com o detalhamento OLAP daquele eixo: por componente, por território, por
// estágio de avaliação.
const EIXOS = [
  {
    slug: 'governanca',
    nome: 'Governança',
    codigo: 'G1-G7',
    descricao: 'Quadro legal, estrutura institucional, gestão de riscos, coordenação, justiça climática e fiscalização — 7 componentes, o eixo com mais itens do Painel.',
  },
  {
    slug: 'politicas-publicas',
    nome: 'Políticas Públicas',
    codigo: 'P1-P5',
    descricao: 'Estratégias de mitigação e adaptação, políticas setoriais e defesa civil — 5 componentes que medem se o plano existe no papel.',
  },
  {
    slug: 'financiamento',
    nome: 'Financiamento',
    codigo: 'F1-F3',
    descricao: 'Finanças e gastos públicos, captação de recursos e mobilização de investimento privado — o eixo historicamente mais baixo dos três.',
  },
] as const

export function EixoCards() {
  return <div className="eixo-cards">
    {EIXOS.map((e) => (
      <Link key={e.slug} href={`/eixo/${e.slug}`} className="eixo-card">
        <span className="eixo-card-code">{e.codigo}</span>
        <strong>{e.nome}</strong>
        <p>{e.descricao}</p>
        <span className="eixo-card-cta">Explorar o eixo <span>↗</span></span>
      </Link>
    ))}
  </div>
}
