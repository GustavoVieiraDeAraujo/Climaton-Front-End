'use client'

import Link from 'next/link'
import { ArrowUpRight, BarChart3, Landmark, Scale, Wallet } from 'lucide-react'

const EIXOS = [
  { slug: 'governanca', nome: 'Governança', codigo: 'G1–G7', descricao: 'Instituições, coordenação e justiça climática: as regras e capacidades que transformam compromisso em ação.', detalhe: 'Leia a estrutura institucional, o estágio dos componentes e a distribuição territorial.', icon: Landmark },
  { slug: 'politicas-publicas', nome: 'Políticas Públicas', codigo: 'P1–P5', descricao: 'Planos de mitigação, adaptação, políticas setoriais e defesa civil em perspectiva comparável.', detalhe: 'Entenda onde existem políticas formais e onde ainda há espaço para avançar.', icon: Scale },
  { slug: 'financiamento', nome: 'Financiamento', codigo: 'F1–F3', descricao: 'Gastos, captação e investimento privado: o fluxo de recursos que sustenta a transição climática.', detalhe: 'Explore a capacidade de financiar respostas climáticas nos territórios.', icon: Wallet },
] as const

export function EixoCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {EIXOS.map(({ icon: Icon, ...e }) => (
        <article key={e.slug} className="group [perspective:1200px]" tabIndex={0} aria-label={`${e.nome}: passe o mouse ou use foco para ver detalhes`}>
          <div className="relative min-h-72 transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)]">
            <div className="absolute inset-0 flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-sm [backface-visibility:hidden]">
              <div className="flex items-start justify-between"><span className="font-mono text-xs tracking-[0.2em] text-primary">{e.codigo}</span><Icon aria-hidden="true" className="size-5 text-primary" /></div>
              <div className="mt-auto"><h3 className="text-2xl font-semibold tracking-tight">{e.nome}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{e.descricao}</p></div>
              <span className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">Explorar dados <ArrowUpRight aria-hidden="true" /></span>
            </div>
            <div className="absolute inset-0 flex flex-col rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]"><span className="font-mono text-xs tracking-[0.2em] text-primary-foreground/70">COMO LER</span><h3 className="mt-6 text-2xl font-semibold">{e.nome}</h3><p className="mt-3 text-sm leading-6 text-primary-foreground/80">{e.detalhe}</p><Link href={`/eixo/${e.slug}`} className="mt-auto inline-flex items-center justify-between rounded-xl bg-primary-foreground px-4 py-3 text-sm font-semibold text-primary transition-opacity hover:opacity-90">Abrir dashboard <BarChart3 aria-hidden="true" /></Link></div>
          </div>
        </article>
      ))}
    </div>
  )
}
