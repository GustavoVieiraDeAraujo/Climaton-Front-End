'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, BarChart3, Database, Info, MapPinned } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { GastoPorOrgao } from '@/components/gasto-por-orgao'
import {
  api,
  type EixoComponente,
  type EixoTerritorio,
  type EixoDistribuicaoLinha,
  type EixoRegiaoLinha,
  type EixoSlug,
  type GastoDesastres,
} from '@/lib/api'

const META: Record<string, { nome: string; intro: string; pergunta: string; leitura: string }> = {
  governanca: {
    nome: 'Governança',
    intro: 'As instituições que coordenam a resposta climática: regras, capacidades, justiça e fiscalização.',
    pergunta: 'As estruturas estão prontas para transformar compromisso em ação?',
    leitura: 'A Justiça Climática (G6) é o item mais atrasado do eixo: só 4 das 24 capitais avaliadas identificaram formalmente quem sofre primeiro com o clima. E é também onde a distância entre discurso e prática mais aparece - o Brasil-país tira nota 1,0 em Fiscalização e Litígio Climático (G7) no ranking global, mas a média real dos 51 territórios é 0,456, menos da metade.',
  },
  'politicas-publicas': {
    nome: 'Políticas Públicas',
    intro: 'Planos de mitigação, adaptação, políticas setoriais e defesa civil em perspectiva comparável.',
    pergunta: 'O planejamento climático já aparece nas políticas do território?',
    leitura: 'Mitigação (P1) está sistematicamente mais avançada que adaptação (P2) nos 51 territórios: o planejamento climático ainda pensa mais em reduzir emissões no futuro do que em se preparar para os impactos que já estão acontecendo agora - o mesmo padrão de "prevenção chega depois" que aparece no financiamento.',
  },
  financiamento: {
    nome: 'Financiamento',
    intro: 'Gastos, captação e investimento privado: os recursos que sustentam a transição climática.',
    pergunta: 'Há recursos suficientes e bem direcionados para agir?',
    leitura: 'Mobilização de investimentos privados (F3) é o componente mais fraco dos três - o financiamento climático ainda depende quase só de recurso público, e mesmo esse é majoritariamente indireto: apenas 3,88% do gasto climático "positivo" teve o clima como propósito principal da despesa desde o desenho. O resto é efeito colateral de outra política.',
  },
}
const STAGES = ['Sem progresso', 'Estágio inicial', 'Estágio intermediário', 'Estágio avançado', 'Não avaliado']
const STAGE_COLORS = ['#b3392b', '#c06a1e', '#a6801c', '#1d6b4d', '#9aa39c']

type LinhaEstagio = { codigo: string; valores: Record<string, number> }

export default function EixoPage() {
  const params = useParams()
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) as EixoSlug
  const meta = META[slug]

  const [componentes, setComponentes] = useState<EixoComponente[]>([])
  const [territorios, setTerritorios] = useState<EixoTerritorio[]>([])
  const [distribuicao, setDistribuicao] = useState<EixoDistribuicaoLinha[]>([])
  const [regioes, setRegioes] = useState<EixoRegiaoLinha[]>([])
  const [gastoDesastres, setGastoDesastres] = useState<GastoDesastres | null>(null)
  const [fontes, setFontes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarTodos, setMostrarTodos] = useState(false)

  useEffect(() => {
    if (!meta) return
    setLoading(true)
    Promise.all([
      api.eixoComponentes(slug),
      api.eixoTerritorios(slug),
      api.eixoDistribuicao(slug),
      api.eixoRegioes(slug),
    ]).then(([c, t, d, r]) => {
      setComponentes(c.dados); setTerritorios(t.dados); setDistribuicao(d.dados); setRegioes(r.dados)
      setFontes([c.fonte, t.fonte, d.fonte, r.fonte])
    }).finally(() => setLoading(false))
    if (slug === 'financiamento') api.gastosDesastres().then(setGastoDesastres).catch(() => {})
  }, [slug, meta])

  const stages = useMemo<LinhaEstagio[]>(() => {
    const grouped = new Map<string, Record<string, number>>()
    distribuicao.forEach((row) => {
      if (!grouped.has(row.codigo)) grouped.set(row.codigo, {})
      grouped.get(row.codigo)![row.estagio] = row.n
    })
    return [...grouped.entries()].map(([codigo, valores]) => ({ codigo, valores }))
  }, [distribuicao])

  const maxRegiao = useMemo(() => Math.max(...regioes.map((r) => r.media), 0.01), [regioes])
  const territoriosVisiveis = mostrarTodos ? territorios : territorios.slice(0, 10)

  if (!meta) {
    return <main className="grid min-h-screen place-items-center p-6"><p>Eixo não encontrado. <Link className="text-primary underline" href="/">Voltar ao início</Link></p></main>
  }

  return <main className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 px-6 backdrop-blur md:px-10">
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-sm font-bold tracking-[0.12em]"><BrandLogo size={36} /> CLIMA<span className="font-normal text-muted-foreground">EM AÇÃO</span></Link>
        <Link href="/#dashboard" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"><ArrowLeft aria-hidden="true" /> Voltar ao panorama</Link>
      </div>
    </header>

    <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-6 py-12 md:px-10 lg:px-16 lg:py-20">
      <section className="grid gap-8 border-b border-border pb-14 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
        <div>
          <p className="font-mono text-xs tracking-[0.22em] text-primary">EIXO · PAINEL CLIMABRASIL</p>
          <h1 className="mt-6 text-balance text-6xl font-semibold tracking-[-0.07em] md:text-8xl">{meta.nome}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{meta.intro}</p>
        </div>
        <aside className="border-l-2 border-primary pl-5">
          <p className="font-mono text-xs tracking-wider text-muted-foreground">PERGUNTA-GUIA</p>
          <p className="mt-3 text-xl font-medium leading-7">{meta.pergunta}</p>
        </aside>
      </section>

      {loading ? <div className="grid min-h-96 place-items-center rounded-3xl border border-dashed border-border"><p className="text-muted-foreground">Consultando dados auditados...</p></div> : <>
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
            <p className="font-mono text-xs opacity-70">COMPONENTES</p>
            <strong className="mt-5 block text-5xl">{componentes.length}</strong>
            <p className="mt-2 text-sm opacity-80">dimensões avaliadas</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="font-mono text-xs text-muted-foreground">TERRITÓRIOS</p>
            <strong className="mt-5 block text-5xl text-primary">{territorios.length}</strong>
            <p className="mt-2 text-sm text-muted-foreground">com dados comparáveis</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="font-mono text-xs text-muted-foreground">LEITURA</p>
            <strong className="mt-5 block text-3xl">0–100%</strong>
            <p className="mt-2 text-sm text-muted-foreground">média por componente</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
          <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs tracking-wider text-primary">01 · COMPONENTES</p>
                <h2 className="mt-3 text-2xl font-semibold">Onde estão as maiores lacunas?</h2>
                <p className="mt-2 text-sm text-muted-foreground">Média das avaliações nos {territorios.length} territórios.</p>
              </div>
              <BarChart3 className="text-primary" aria-hidden="true" />
            </div>
            <div className="mt-10 flex h-64 items-stretch gap-3 border-b border-border">
              {componentes.map((c) => (
                <div key={c.codigo} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">{Math.round(c.media * 100)}%</span>
                  <div className="w-full rounded-t-md bg-primary/80 transition-all group-hover:bg-primary" style={{ height: `${Math.max(c.media * 100, 3)}%` }} title={`${c.nome}: ${Math.round(c.media * 100)}%`} />
                  <span className="font-mono text-xs text-muted-foreground">{c.codigo}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted-foreground">Fonte: {fontes[0]}</p>
          </article>

          <aside className="rounded-3xl bg-muted/50 p-6 md:p-8">
            <Info className="text-primary" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold">O que estes dados mostram</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{meta.leitura}</p>
            <div className="mt-8 border-t border-border pt-5">
              <p className="font-mono text-xs tracking-wider text-muted-foreground">PRÓXIMA LEITURA</p>
              <p className="mt-2 text-sm font-medium">Compare a distribuição por estágio, por região e o ranking dos territórios.</p>
            </div>
          </aside>
        </section>

        <section className="rounded-3xl bg-[var(--dark)] p-6 text-[var(--paper)] md:p-8">
          <p className="font-mono text-xs tracking-wider text-[var(--lime)]">02 · ESTÁGIOS</p>
          <h2 className="mt-3 text-2xl font-semibold">O estágio de avaliação por componente</h2>
          <div className="mt-8 flex flex-col gap-5">
            {stages.map((row) => (
              <div key={row.codigo} className="grid gap-2 md:grid-cols-[4rem_1fr]">
                <span className="font-mono text-sm text-white/60">{row.codigo}</span>
                <div className="flex h-9 overflow-hidden rounded-md bg-white/10">
                  {STAGES.map((stage, i) => row.valores[stage] ? (
                    <div key={stage} className="flex items-center justify-center text-[10px] font-semibold text-white" style={{ width: `${(row.valores[stage] / 51) * 100}%`, backgroundColor: STAGE_COLORS[i] }} title={`${stage}: ${row.valores[stage]}`}>
                      {row.valores[stage] > 3 ? row.valores[stage] : ''}
                    </div>
                  ) : null)}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/50">Fonte: {fontes[2]}</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
          <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs tracking-wider text-primary">03 · REGIÕES</p>
                <h2 className="mt-3 text-2xl font-semibold">Quem está mais atrás, por região</h2>
                <p className="mt-2 text-sm text-muted-foreground">Média do eixo, agrupada pelas 5 macrorregiões do IBGE.</p>
              </div>
              <MapPinned className="text-primary" aria-hidden="true" />
            </div>
            <div className="mt-8 flex flex-col gap-4">
              {regioes.map((r) => (
                <div key={r.regiao} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-sm font-medium">{r.regiao}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(r.media / maxRegiao) * 100}%` }} />
                  </div>
                  <span className="w-12 shrink-0 text-right text-xs font-semibold text-primary">{Math.round(r.media * 100)}%</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs text-muted-foreground">{regioes.length > 0 && `${regioes[0].regiao} tem a pior média (${Math.round(regioes[0].media * 100)}%), ${regioes.length} regiões comparadas. `}Fonte: {fontes[3]}</p>
          </article>

          <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs tracking-wider text-primary">04 · TERRITÓRIOS</p>
                <h2 className="mt-3 text-2xl font-semibold">Quem está na frente?</h2>
              </div>
              <Database className="text-primary" aria-hidden="true" />
            </div>
            <div className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
              {territoriosVisiveis.map((t, i) => (
                <div key={`${t.territorio}-${t.tipo}`} className="flex items-center gap-3">
                  <span className="w-6 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0 flex-1 truncate text-sm">{t.territorio} <span className="text-[10px] font-mono text-muted-foreground">{t.tipo === 'Estado' ? '· UF' : t.tipo === 'Distrito Federal' ? '· DF' : '· capital'}</span></span>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${t.media * 100}%` }} /></div>
                  <span className="w-10 text-right text-xs font-semibold text-primary">{Math.round(t.media * 100)}%</span>
                </div>
              ))}
            </div>
            {territorios.length > 10 && (
              <button type="button" onClick={() => setMostrarTodos(!mostrarTodos)} className="mt-6 text-xs font-semibold text-primary hover:underline">
                {mostrarTodos ? 'Mostrar só os 10 primeiros' : `Ver todos os ${territorios.length} territórios`}
              </button>
            )}
            <p className="mt-8 text-xs text-muted-foreground">Fonte: {fontes[1]}</p>
          </article>
        </section>

        {slug === 'financiamento' && (
          <section className="rounded-3xl bg-[var(--dark)] p-6 text-[var(--paper)] md:p-8 on-dark">
            <p className="font-mono text-xs tracking-wider text-[var(--lime)]">05 · PARA ONDE VAI O DINHEIRO</p>
            <h2 className="mt-3 text-2xl font-semibold">Recuperação de desastres ainda pesa mais que prevenção</h2>
            {gastoDesastres && (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 p-4">
                  <strong className="block text-3xl text-[var(--lime)]">R${(gastoDesastres.resposta_recuperacao / 1e9).toFixed(1).replace('.', ',')}bi</strong>
                  <span className="mt-1 block text-xs text-white/60">em resposta e recuperação (2010-2023)</span>
                </div>
                <div className="rounded-2xl border border-white/15 p-4">
                  <strong className="block text-3xl text-[var(--lime)]">R${(gastoDesastres.prevencao_total / 1e9).toFixed(1).replace('.', ',')}bi</strong>
                  <span className="mt-1 block text-xs text-white/60">em prevenção real, sem o crédito agrícola que infla o bruto</span>
                </div>
                <div className="rounded-2xl border border-white/15 p-4">
                  <strong className="block text-3xl text-[var(--lime)]">{gastoDesastres.razao_recuperacao_por_prevencao?.toFixed(2).replace('.', ',')}×</strong>
                  <span className="mt-1 block text-xs text-white/60">mais gasto remediando do que evitando</span>
                </div>
              </div>
            )}
            <div className="mt-10">
              <GastoPorOrgao />
            </div>
          </section>
        )}
      </>}
    </div>

    <footer className="border-t border-border px-6 py-8 text-xs text-muted-foreground md:px-10">
      <div className="mx-auto flex max-w-screen-2xl flex-col justify-between gap-3 md:flex-row">
        <span>Dados reais e auditados · ClimatonBrasil 2026</span>
        <Link href="/#dashboard" className="flex items-center gap-2 text-primary">Explorar outros eixos <ArrowUpRight /></Link>
      </div>
    </footer>
  </main>
}
