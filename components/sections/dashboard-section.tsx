'use client'

import { useState } from 'react'
import { ArrowUpRight, BarChart3 } from 'lucide-react'
import { AiInsight } from '@/components/ai-insight'
import { EixoCards } from '@/components/eixo-cards'
import { GastoPorOrgao } from '@/components/gasto-por-orgao'
import { Kpis } from '@/components/kpis'
import type { GastoResumo, Territorio } from '@/lib/api'

type Props = { criticos: Territorio[]; gasto: GastoResumo | null; bars: number[]; years: number[] }

export function DashboardSection({ criticos, gasto, bars, years }: Props) {
  const [activeBar, setActiveBar] = useState(3)
  const totalBi = gasto ? (gasto.total_positivo / 1e9).toFixed(1).replace('.', ',') : '—'
  const pctPrincipal = gasto ? gasto.pct_principal.toFixed(2).replace('.', ',') : '—'
  return (
    <section id="dashboard" className="bg-[var(--dark)] py-24 text-[var(--paper)] lg:py-36">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-12 px-6 md:px-10 lg:px-16">
        <div className="flex flex-col justify-between gap-8 border-b border-white/15 pb-12 lg:flex-row lg:items-end"><div><p className="font-mono text-xs tracking-[0.22em] text-[var(--lime)]">02 · PANORAMA DOS DADOS</p><h2 className="mt-6 max-w-3xl text-balance text-5xl font-semibold tracking-[-0.06em] md:text-7xl">Uma visão para <em className="not-italic text-[var(--lime)]">decidir melhor.</em></h2></div><p className="max-w-md text-base leading-7 text-white/60">Gasto, risco e capacidade institucional cruzados. Cada número vem do banco unificado e auditado.</p></div>
        <Kpis criticos={criticos.length} gasto={gasto} />
        <div className="grid gap-4 md:grid-cols-3"><a href="#territorio" className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"><p className="font-mono text-xs text-white/50">PAINEL 01 · EXPOSIÇÃO</p><h3 className="mt-10 text-2xl font-semibold">Onde o risco é maior?</h3><p className="mt-3 text-sm leading-6 text-white/60">Os territórios avaliados e sua prioridade declarada.</p><span className="mt-8 flex items-center gap-2 text-sm text-[var(--lime)]">Abrir painel <ArrowUpRight /></span></a><a href="#insights" className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"><p className="font-mono text-xs text-white/50">PAINEL 02 · RECURSOS</p><h3 className="mt-10 text-2xl font-semibold">Pra onde vai o dinheiro?</h3><p className="mt-3 text-sm leading-6 text-white/60">R${totalBi} bi em 14 anos; {pctPrincipal}% com propósito climático principal.</p><span className="mt-8 flex items-center gap-2 text-sm text-[var(--lime)]">Abrir painel <ArrowUpRight /></span></a><a href="#mapa" className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"><p className="font-mono text-xs text-white/50">PAINEL 03 · PRIORIDADE</p><h3 className="mt-10 text-2xl font-semibold">Onde agir primeiro?</h3><p className="mt-3 text-sm leading-6 text-white/60">Risco × capacidade para orientar decisões mais justas.</p><span className="mt-8 flex items-center gap-2 text-sm text-[var(--lime)]">Abrir painel <ArrowUpRight /></span></a></div>
        <section className="rounded-3xl bg-[var(--paper)] p-6 text-[var(--ink)] md:p-10"><div className="flex flex-col justify-between gap-5 border-b border-[var(--line)] pb-7 md:flex-row md:items-end"><div><p className="font-mono text-xs tracking-[0.2em] text-[var(--green)]">03 · EXPLORAÇÃO</p><h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Os três eixos do Painel ClimaBrasil</h3></div><p className="max-w-sm text-sm leading-6 text-[var(--muted)]">Passe o mouse pelos cards para entender a pergunta de cada recorte.</p></div><div className="mt-8"><EixoCards /></div></section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-10"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-start"><div><p className="font-mono text-xs tracking-[0.2em] text-white/50">04 · SÉRIE HISTÓRICA</p><h3 className="mt-3 text-3xl font-semibold">O ritmo do gasto climático</h3><p className="mt-2 max-w-xl text-sm leading-6 text-white/60">A série anual ajuda a localizar ciclos de investimento e pontos de inflexão.</p></div><BarChart3 className="size-7 text-[var(--lime)]" aria-hidden="true" /></div><div className="mt-12 flex h-64 items-end gap-2 border-b border-white/15 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_63px,rgba(255,255,255,.07)_64px)] px-2">{bars.map((height, index) => <button key={years[index]} type="button" aria-label={`Ano ${years[index]}, ${height}% do pico`} onClick={() => setActiveBar(index)} className={`group relative min-w-0 flex-1 rounded-t-sm transition-all hover:bg-[var(--lime)] ${index === activeBar ? 'bg-[var(--lime)]' : 'bg-white/25'}`} style={{ height: `${height}%` }}><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-[var(--lime)] opacity-0 group-hover:opacity-100">{height}%</span></button>)}</div><div className="mt-3 flex justify-between font-mono text-[10px] text-white/40"><span>{years[0]}</span><span>{years.at(-1)}</span></div><AiInsight secao="dashboard" /></section>
        <GastoPorOrgao />
      </div>
    </section>
  )
}
