import { EixoCards } from '@/components/eixo-cards'

export function DashboardSection() {
  return <section id="dashboard" className="bg-[var(--dark)] py-8 text-[var(--paper)]">
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col justify-center gap-8 px-6 md:px-10 lg:px-16">
      <div className="border-b border-white/15 pb-6">
        <p className="font-mono text-xs tracking-[0.22em] text-[var(--lime)]">02 · EIXOS</p>
        <h2 className="mt-3 max-w-4xl text-balance text-4xl font-semibold tracking-[-0.06em] md:text-6xl">O que precisa estar pronto <em className="not-italic text-[var(--lime)]">para agir?</em></h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.6fr] lg:items-stretch">
        <div className="flex flex-col justify-center gap-6">
          <p className="max-w-md text-2xl leading-9 text-white/80">Governança, políticas públicas e financiamento: as três engrenagens que decidem se um estado se prepara antes do desastre - ou reconstrói depois dele, como o Rio Grande do Sul fez em 2024. Nenhuma funciona sozinha: sem financiamento, um plano de redução de risco fica no papel; sem governança, mesmo o financiamento certo se perde no caminho.</p>
        </div>
        <div className="rounded-3xl bg-[var(--paper)] p-4 text-[var(--ink)] md:p-6"><div className="mb-6 flex flex-col gap-2 px-2 md:flex-row md:items-end md:justify-between"><div><p className="font-mono text-xs tracking-[0.2em] text-[var(--green)]">OS TRÊS EIXOS</p><h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Três lentes para a mesma história</h3></div><p className="max-w-xs text-sm leading-6 text-[var(--muted)]">Passe o mouse, leia o verso e abra o painel quando quiser aprofundar.</p></div><EixoCards /></div>
      </div>
    </div>
  </section>
}
