import { ArrowDown } from 'lucide-react'
import { EixoCards } from '@/components/eixo-cards'

export function DashboardSection() {
  return <section id="dashboard" className="bg-[var(--dark)] py-24 text-[var(--paper)] lg:py-36">
    <div className="mx-auto flex min-h-[70vh] w-full max-w-screen-2xl flex-col justify-center gap-14 px-6 md:px-10 lg:px-16">
      <div className="flex flex-col justify-between gap-8 border-b border-white/15 pb-12 lg:flex-row lg:items-end">
        <div>
          <p className="font-mono text-xs tracking-[0.22em] text-[var(--lime)]">02 · A PERGUNTA</p>
          <h2 className="mt-6 max-w-4xl text-balance text-5xl font-semibold tracking-[-0.06em] md:text-7xl">O que precisa estar pronto <em className="not-italic text-[var(--lime)]">para agir?</em></h2>
        </div>
        <p className="max-w-md text-base leading-7 text-white/60">Uma história de dados começa antes do gráfico: começa escolhendo as perguntas que ajudam a enxergar o país com mais clareza.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.6fr] lg:items-end">
        <div className="flex flex-col gap-6">
          <p className="max-w-md text-xl leading-8 text-white/80">O ClimatonBrasil organiza essa leitura em três eixos. Cada um revela uma parte da distância entre o risco que existe e a resposta que conseguimos construir.</p>
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--lime)]"><ArrowDown aria-hidden="true" /> escolha um caminho para continuar</div>
        </div>
        <div className="rounded-3xl bg-[var(--paper)] p-4 text-[var(--ink)] md:p-6"><div className="mb-6 flex flex-col gap-2 px-2 md:flex-row md:items-end md:justify-between"><div><p className="font-mono text-xs tracking-[0.2em] text-[var(--green)]">03 · OS TRÊS EIXOS</p><h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Três lentes para a mesma história</h3></div><p className="max-w-xs text-sm leading-6 text-[var(--muted)]">Passe o mouse, leia o verso e abra o painel quando quiser aprofundar.</p></div><EixoCards /></div>
      </div>
    </div>
  </section>
}
