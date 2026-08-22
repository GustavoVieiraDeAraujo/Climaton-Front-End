'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts'
import { BrandLogo } from '@/components/brand-logo'
import { api, type EixoComponente, type EixoTerritorio, type EixoDistribuicaoLinha, type EixoSlug } from '@/lib/api'

const EIXO_META: Record<string, { nome: string; intro: string }> = {
  'governanca': {
    nome: 'Governança',
    intro: 'Quadro legal, estrutura institucional, gestão de riscos, coordenação entre níveis de governo, engajamento social, justiça climática e fiscalização - 7 componentes (G1-G7), o eixo com mais itens do Painel ClimaBrasil.',
  },
  'politicas-publicas': {
    nome: 'Políticas Públicas',
    intro: 'Estratégias de mitigação e adaptação, políticas setoriais e defesa civil - 5 componentes (P1-P5) que medem se o plano de ação climática existe formalmente, não se ele já reduziu emissões ou risco.',
  },
  'financiamento': {
    nome: 'Financiamento',
    intro: 'Finanças e gastos públicos dedicados, captação de recursos externos e mobilização de investimento privado - 3 componentes (F1-F3), historicamente o eixo com as menores notas dos três.',
  },
}

const STAGE_ORDER = ['Sem progresso', 'Estágio inicial', 'Estágio intermediário', 'Estágio avançado', 'Não avaliado']
const STAGE_COLOR: Record<string, string> = {
  'Sem progresso': '#b3392b',
  'Estágio inicial': '#c06a1e',
  'Estágio intermediário': '#a6801c',
  'Estágio avançado': '#1d6b4d',
  'Não avaliado': '#9aa39c',
}
const BAR_COLOR = ['#1d6b4d', '#2c7d5b', '#3a8e6a', '#4d8a6e', '#5f9c7f', '#71ae90', '#83c0a1']

export default function EixoPage() {
  const params = useParams()
  const slug = (Array.isArray(params.slug) ? params.slug[0] : params.slug) as EixoSlug
  const meta = EIXO_META[slug]

  const [componentes, setComponentes] = useState<EixoComponente[]>([])
  const [territorios, setTerritorios] = useState<EixoTerritorio[]>([])
  const [distribuicao, setDistribuicao] = useState<EixoDistribuicaoLinha[]>([])
  const [fontes, setFontes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!meta) return
    setLoading(true)
    Promise.all([
      api.eixoComponentes(slug),
      api.eixoTerritorios(slug),
      api.eixoDistribuicao(slug),
    ]).then(([c, t, d]) => {
      setComponentes(c.dados)
      setTerritorios(t.dados)
      setDistribuicao(d.dados)
      setFontes([c.fonte, t.fonte, d.fonte])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug, meta])

  const distribuicaoPorComponente = useMemo(() => {
    const byCode: Record<string, Record<string, number>> = {}
    distribuicao.forEach((row) => {
      byCode[row.codigo] = byCode[row.codigo] || {}
      byCode[row.codigo][row.estagio] = row.n
    })
    return Object.entries(byCode).map(([codigo, stages]) => ({ codigo, ...stages }))
  }, [distribuicao])

  const top10 = territorios.slice(0, 10)
  const bottom5 = territorios.slice(-5).reverse()

  if (!meta) {
    return <main className="eixo-page"><p className="eixo-notfound">Eixo não encontrado. <Link href="/">Voltar ao início</Link></p></main>
  }

  return <main className="eixo-page">
    <header className="site-header"><Link className="brand" href="/" aria-label="Clima em Ação, início"><BrandLogo size={40} /> CLIMA<span className="brand-muted">EM AÇÃO</span></Link><Link href="/#dashboard" className="header-link">← Voltar ao dashboard</Link></header>

    <section className="eixo-hero section-wrap">
      <span className="section-kicker">EIXO · PAINEL CLIMABRASIL</span>
      <h1>{meta.nome}</h1>
      <p className="eixo-intro">{meta.intro}</p>
      {loading && <p className="eixo-loading">Consultando a API...</p>}
    </section>

    {!loading && <>
      <section className="eixo-section section-wrap">
        <div className="bi-panel-head"><h3>Média por componente</h3><small>0 a 1, todos os 51 territórios e itens avaliados</small></div>
        <div className="eixo-chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={componentes} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6dc" vertical={false} />
              <XAxis dataKey="codigo" tick={{ fontSize: 12, fill: '#6f7770' }} axisLine={{ stroke: '#d8ddd5' }} tickLine={false} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: '#6f7770' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`${Math.round(Number(value) * 100)}%`, 'média']}
                labelFormatter={(codigo) => componentes.find((c) => c.codigo === codigo)?.nome ?? codigo}
                contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #d8ddd5' }}
              />
              <Bar dataKey="media" radius={[4, 4, 0, 0]}>
                {componentes.map((c, i) => <Cell key={c.codigo} fill={BAR_COLOR[i % BAR_COLOR.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <span className="bi-fonte">fonte: {fontes[0]}</span>
      </section>

      <section className="eixo-section section-wrap on-dark-section">
        <div className="bi-panel-head"><h3>Estágio de avaliação por componente</h3><small>quantas das 51 avaliações caíram em cada estágio, por componente</small></div>
        <div className="eixo-chart-wrap">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={distribuicaoPorComponente} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e3f36" vertical={false} />
              <XAxis dataKey="codigo" tick={{ fontSize: 12, fill: '#94a49a' }} axisLine={{ stroke: '#405249' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a49a' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, background: '#1c2b23', border: '1px solid #405249', color: '#f5f5f0' }} />
              {STAGE_ORDER.map((stage) => (
                <Bar key={stage} dataKey={stage} stackId="a" fill={STAGE_COLOR[stage]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bi-legend on-dark">
          {STAGE_ORDER.map((s) => <span key={s}><i style={{ background: STAGE_COLOR[s] }} /> {s}</span>)}
        </div>
        <span className="bi-fonte on-dark">fonte: {fontes[2]}</span>
      </section>

      <section className="eixo-section section-wrap">
        <div className="bi-panel-head"><h3>Territórios, do melhor ao pior neste eixo</h3><small>média dos componentes do eixo, por território (51 no total)</small></div>
        <div className="eixo-ranking-grid">
          <div>
            <span className="panel-label">TOP 10</span>
            <div className="hbar-list">
              {top10.map((t) => (
                <div className="hbar-row" key={t.territorio}>
                  <span className="hbar-label">{t.territorio} <small>({t.tipo})</small></span>
                  <span className="hbar-track"><span className="hbar-fill" style={{ width: `${t.media * 100}%`, background: 'linear-gradient(90deg, #1d6b4d, #4d8a6e)' }} /></span>
                  <span className="hbar-value" style={{ color: '#1d6b4d' }}>{Math.round(t.media * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="panel-label">5 ÚLTIMOS</span>
            <div className="hbar-list">
              {bottom5.map((t) => (
                <div className="hbar-row" key={t.territorio}>
                  <span className="hbar-label">{t.territorio} <small>({t.tipo})</small></span>
                  <span className="hbar-track"><span className="hbar-fill" style={{ width: `${t.media * 100}%`, background: '#b3392b' }} /></span>
                  <span className="hbar-value" style={{ color: '#b3392b' }}>{Math.round(t.media * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <span className="bi-fonte">fonte: {fontes[1]}</span>
      </section>
    </>}

    <footer className="footer section-wrap"><div className="brand"><BrandLogo /> CLIMA<span className="brand-muted">EM AÇÃO</span></div><span>Dado real e auditado · dataset_unificado/clima_brasil_climate_scanner.sqlite</span><span>ClimatonBrasil 2026 · TCU</span></footer>
  </main>
}
