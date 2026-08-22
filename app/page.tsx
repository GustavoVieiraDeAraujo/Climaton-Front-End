'use client'

import { useEffect, useMemo, useState } from 'react'
import { RiskGlobe, type RiskPoint } from '@/components/risk-globe'
import { BrazilMap } from '@/components/brazil-map'
import { DataChatbot } from '@/components/data-chatbot'
import { StoryCloud } from '@/components/story-cloud'
import { AiInsight } from '@/components/ai-insight'
import { BrandLogo } from '@/components/brand-logo'
import { TerritoriosScatter } from '@/components/territorios-scatter'
import { ComparacaoBrasilMundo } from '@/components/comparacao-brasil-mundo'
import { GastoPorOrgao } from '@/components/gasto-por-orgao'
import { HeroScene } from '@/components/hero-scene'
import { api, type Cobertura, type GastoResumo, type Territorio } from '@/lib/api'

// Todo número nesta página vem do banco unificado e auditado (dataset_unificado/clima_brasil_climate_scanner.sqlite),
// hoje servido pela API em api/ (FastAPI, ver api/main.py). Cada seção busca seu próprio recorte
// ao carregar; os valores abaixo são o mesmo dado real como fallback instantâneo enquanto a API
// responde (ou caso ela esteja fora do ar) - nunca um placeholder inventado.
// Ver LOG_MESTRE.md, Parte H, para a proposta completa e a fonte de cada achado.

const regions = ['Brasil', 'Amazônia', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

const CRITICO_COORDS: Record<string, [number, number]> = {
  'Macapá': [0.03, -51.07], 'Fortaleza': [-3.73, -38.52], 'São Luís': [-2.53, -44.30],
  'Pernambuco': [-8.30, -37.90], 'Maceió': [-9.66, -35.73],
}
const CRITICO_COPY: Record<string, { label: string; insight: string }> = {
  'Macapá': { label: 'Risco alto, capacidade zero', insight: 'O parecer oficial do Painel ClimaBrasil confirma: sem plano de redução de risco, sem sistema de alerta, sem plano de recuperação pós-desastre.' },
  'Fortaleza': { label: 'Estresse hídrico e capacidade baixa', insight: 'Risco climático alto cruzado com baixa capacidade institucional declarada - mesmo padrão de Macapá, em outro bioma.' },
  'São Luís': { label: 'Risco alto, resposta ainda incipiente', insight: 'A capacidade institucional avança, mas não na velocidade do risco físico medido pelo AdaptaBrasil.' },
  'Pernambuco': { label: 'Primeiro estado a aparecer na lista', insight: 'Antes de cruzar o risco estadual real, os 26 estados ficavam sem essa camada - Pernambuco só apareceu depois de fechar essa lacuna nos dados.' },
  'Maceió': { label: 'Litoral sob risco alto', insight: 'Mesmo padrão de descompasso entre risco climático e capacidade institucional declarada ao Painel ClimaBrasil.' },
}

const fallbackRiskPoints: RiskPoint[] = Object.entries(CRITICO_COORDS).map(([name, [lat, lng]]) => ({
  name, lat, lng, risk: { 'Macapá': 65, 'Fortaleza': 61, 'São Luís': 63, 'Pernambuco': 60, 'Maceió': 65 }[name] ?? 60,
  label: CRITICO_COPY[name].label, insight: CRITICO_COPY[name].insight,
}))

const fallbackBars = [92, 80, 85, 100, 91, 94, 77, 59, 47, 45, 45, 37, 49, 60]
const fallbackYears = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]

function Header() {
  return <header className="site-header"><a className="brand" href="#inicio" aria-label="Clima em Ação, início"><BrandLogo size={40} /> CLIMA<span className="brand-muted">EM AÇÃO</span></a><nav aria-label="Navegação principal"><a href="#historia">01 - História</a><a href="#dashboard">02 - Dados</a><a href="#territorio">03 - Território</a><a href="#mapa">04 - Mapa</a><a href="#insights">05 - Insights</a><a href="#acao">06 - Ação</a><a href="#inicio">07 - Sobre o Projeto</a></nav></header>
}

function Kpis({ criticos, gasto }: { criticos: number; gasto: GastoResumo | null }) {
  const totalBi = gasto ? (gasto.total_positivo / 1e9).toFixed(1).replace('.', ',') : '421,3'
  const pctPrincipal = gasto ? gasto.pct_principal.toFixed(2).replace('.', ',') : '3,88'
  return <div className="kpi-grid">
    <div><span>Territórios em prioridade crítica</span><strong>{criticos}</strong><small>de 51 avaliados pelo Painel ClimaBrasil</small></div>
    <div><span>Gasto climático total (2010-2023)</span><strong>R${totalBi}bi</strong><small>Painel de Gastos Climáticos, dado real</small></div>
    <div><span>Com clima como propósito principal</span><strong>{pctPrincipal}%</strong><small>o resto é cobenefício de outra despesa</small></div>
  </div>
}

export default function Page() {
  const [region, setRegion] = useState('Brasil')
  const [activeBar, setActiveBar] = useState(3)
  const [riskPoints, setRiskPoints] = useState<RiskPoint[]>(fallbackRiskPoints)
  const [selectedPoint, setSelectedPoint] = useState<RiskPoint>(fallbackRiskPoints[0])
  const [bars, setBars] = useState(fallbackBars)
  const [years, setYears] = useState(fallbackYears)
  const [gasto, setGasto] = useState<GastoResumo | null>(null)
  const [criticos, setCriticos] = useState<Territorio[]>([])
  const [cobertura, setCobertura] = useState<Cobertura | null>(null)

  useEffect(() => {
    api.territoriosCriticos().then((r) => {
      setCriticos(r.dados)
      const points = r.dados
        .filter((t) => CRITICO_COORDS[t.territorio])
        .map((t) => ({
          name: t.territorio, lat: CRITICO_COORDS[t.territorio][0], lng: CRITICO_COORDS[t.territorio][1],
          risk: Math.round(t.risco * 100),
          label: CRITICO_COPY[t.territorio]?.label ?? `Risco ${t.faixa_risco.toLowerCase()}, capacidade ${t.faixa_capacidade.toLowerCase()}`,
          insight: CRITICO_COPY[t.territorio]?.insight ?? `Cruzando risco físico real (AdaptaBrasil) com capacidade institucional declarada (Painel ClimaBrasil): prioridade Crítica.`,
        }))
      if (points.length) { setRiskPoints(points); setSelectedPoint(points[0]) }
    }).catch(() => {})
    api.gastosResumo().then(setGasto).catch(() => {})
    api.gastosSerieAnual().then((r) => {
      const pico = Math.max(...r.dados.map((d) => d.pct_do_pico))
      setBars(r.dados.map((d) => Math.round(d.pct_do_pico)))
      setYears(r.dados.map((d) => d.ano))
      void pico
    }).catch(() => {})
    api.cobertura().then(setCobertura).catch(() => {})
  }, [])

  const selectedInsight = useMemo(() => selectedPoint || riskPoints[0], [selectedPoint, riskPoints])

  return <main>
    <Header />
    <section id="inicio" className="hero section-wrap"><HeroScene /><div className="eyebrow"><span className="eyebrow-dot" /> CLIMA EM AÇÃO · DATA STORY</div><h1>A distância entre<br /><em>saber e agir.</em></h1><div className="hero-bottom"><p>&quot;O problema não é a falta de dados. É a distância entre informação disponível e ação possível&quot; - é a própria organização do ClimatonBrasil quem diz isso. Esta leitura cruza o Painel ClimaBrasil, o AdaptaBrasil e o orçamento público pra mostrar essa distância com número real, território por território.</p><div className="hero-lead-group"><p className="hero-lead">&quot;Avaliamos mecanismos, não resultados&quot; - é a própria ressalva metodológica do Painel ClimaBrasil sobre a nota que ele mesmo aplica. O parecer oficial sobre Macapá é ainda mais direto: sem plano de redução de risco, sem sistema de alerta, sem plano de recuperação pós-desastre - e o risco físico medido pelo AdaptaBrasil ali é alto.</p><p className="hero-lead">O Brasil tira nota 1,0 em Fiscalização e Litígio Climático no ranking global. É verdade - e a média real dos 51 territórios por dentro do país nesse mesmo componente é 0,456, menos da metade. As duas notas são reais; só contam histórias diferentes.</p></div></div></section>

    <section id="historia" data-story="historia" className="story section-wrap"><div className="section-kicker">01 - A HISTÓRIA</div><div className="story-grid"><div><h2>O futuro não chega de uma vez.<br /><span>Ele se acumula.</span></h2></div><div className="story-copy"><p>O Painel ClimaBrasil avalia 26 estados, o Distrito Federal e 24 capitais em três eixos: governança, políticas públicas e financiamento climático - 45 itens, aplicados por auditores de tribunais de contas de todo o país.</p><p>Cruzando essa capacidade institucional declarada com o risco físico real (AdaptaBrasil) e o dinheiro que de fato chega (orçamento público), a distância entre discurso e execução deixa de ser abstrata: vira uma lista nomeada de territórios, com evidência auditável atrás de cada número.</p></div></div><div className="interpretation"><span>COMO LER ESTES DADOS</span><p>O Painel ClimaBrasil mede se o mecanismo institucional existe - não se ele funciona. &quot;Avaliamos mecanismos, não resultados&quot; é a própria ressalva metodológica oficial do painel.</p></div><div className="stat-band"><div><strong>51</strong><small>territórios avaliados -<br />26 estados + DF + 24 capitais</small></div><div><strong>5</strong><small>estão em prioridade crítica<br />agora: risco alto, capacidade baixa</small></div><div><strong>4<span>/24</span></strong><small>capitais já identificaram<br />formalmente quem sofre primeiro</small></div></div><AiInsight secao="historia" /></section>

    <section id="dashboard" className="data-section"><div className="section-wrap"><div className="section-kicker light">02 - DASHBOARD</div><div className="data-heading"><h2>Uma visão para<br /><em>decidir melhor.</em></h2><p>Gasto, risco e capacidade institucional, cruzados - os números abaixo são reais e auditados, extraídos do banco unificado.</p></div><div className="interpretation dark-interpretation"><span>COMO LER ESTES DADOS</span><p>O gráfico mostra o gasto climático total por ano (2010-2023), como % do pico do período. A queda depois de 2013 é real - não é um artefato de normalização.</p></div><Kpis criticos={criticos.length || 5} gasto={gasto} /><div className="dashboard-grid"><article><span className="panel-label">PAINEL 01 · EXPOSIÇÃO</span><strong>Onde o risco é maior?</strong><p>Os 51 territórios do Painel ClimaBrasil, risco físico real do AdaptaBrasil por trás de cada um.</p><a href="#territorio"><button type="button">Abrir painel <span>↗</span></button></a></article><article><span className="panel-label">PAINEL 02 · FINANCIAMENTO</span><strong>Pra onde vai o dinheiro?</strong><p>R${gasto ? (gasto.total_positivo / 1e9).toFixed(1).replace('.', ',') : '421,3'}bi em 14 anos - só {gasto ? gasto.pct_principal.toFixed(2).replace('.', ',') : '3,88'}% com o clima como propósito principal da despesa.</p><a href="#insights"><button type="button">Abrir painel <span>↗</span></button></a></article><article><span className="panel-label">PAINEL 03 · PRIORIDADE</span><strong>Onde agir primeiro?</strong><p>Matriz de prioridade risco × capacidade - não um ranking, uma priorização declarada e auditável.</p><a href="#mapa"><button type="button">Abrir painel <span>↗</span></button></a></article></div><div className="data-panel" data-story="dashboard"><div className="panel-top"><div><span className="panel-label">GASTO CLIMÁTICO TOTAL POR ANO</span><strong>{criticos.length || 5}/51</strong><span className="panel-sub">dos territórios avaliados estão em prioridade crítica agora</span></div><div className="select-wrap"><label htmlFor="region">Recorte</label><select id="region" value={region} onChange={(e) => setRegion(e.target.value)}>{regions.map((item) => <option key={item}>{item}</option>)}</select></div></div><div className="chart" aria-label="Gráfico de gasto climático total por ano, 2010 a 2023"><div className="chart-y"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="bars">{bars.map((height, index) => <button key={index} className={`bar ${index === activeBar ? 'active' : ''}`} style={{ height: `${height}%` }} onClick={() => setActiveBar(index)} aria-label={`Ano ${years[index]}, ${height}% do pico`}><span>{years[index]}: {height}%</span></button>)}</div></div><div className="chart-x"><span>{years[0]}</span><span>{years[Math.floor(years.length / 3)]}</span><span>{years[Math.floor(2 * years.length / 3)]}</span><span>{years[years.length - 1]}</span></div><AiInsight secao="dashboard" /></div><GastoPorOrgao /></div></section>

    <section id="territorio" data-story="territorio" className="territory section-wrap"><div className="section-kicker">03 - TERRITÓRIO</div><div className="territory-heading"><h2>5 territórios em<br /><em>prioridade crítica.</em></h2><p>Risco climático real (AdaptaBrasil) cruzado com capacidade institucional declarada (Painel ClimaBrasil) - matriz de prioridade, não subtração de escalas diferentes. Explore os pontos.</p></div><div className="interpretation"><span>COMO LER ESTES DADOS</span><p>Cada ponto é um território real, com nome e dado auditado. O tamanho e a cor representam o risco; a prioridade vem do cruzamento com a capacidade institucional.</p></div><div className="territory-layout"><RiskGlobe points={riskPoints} selected={selectedPoint.name} onSelect={setSelectedPoint} /><aside className="territory-insight"><span className="insight-number">{selectedPoint.risk}%</span><span className="panel-label">RISCO CLIMÁTICO REAL · {selectedPoint.name.toUpperCase()}</span><h3>{selectedPoint.label}</h3><p>{selectedInsight.insight}</p><div className="risk-legend"><span><i className="dot high" /> prioridade crítica</span><span><i className="dot medium" /> risco elevado</span></div></aside></div><TerritoriosScatter /><AiInsight secao="territorio" /></section>

    <section id="mapa" data-story="mapa" className="map-section section-wrap"><div className="section-kicker">04 - MAPA DO BRASIL</div><div className="territory-heading"><h2>Cada estado<br /><em>conta uma parte.</em></h2><p>27 capitais, risco real do AdaptaBrasil. As 24 avaliadas pelo Painel ClimaBrasil (+ DF) também mostram a prioridade calculada; Aracaju e Goiânia têm risco real, mas ainda sem avaliação institucional na amostra.</p></div><BrazilMap /><div className="coverage-panel"><h4>Por que 25 territórios-capital avaliados, e não 27?</h4><p>{cobertura?.explicacao ?? 'Goiânia e Aracaju não constam na tabela de avaliações do Painel ClimaBrasil (fonte bruta painel-climabrasil-raw.csv) - não há avaliação de nenhum dos 45 itens para essas duas capitais no arquivo que baixamos. Não encontramos, nas fontes públicas que auditamos, uma nota oficial do Painel explicando por que essas duas faltam especificamente; o próprio painel se rotula como avaliação de "27 estados e 24 municípios" sem detalhar o critério de amostragem dos municípios. Por isso não afirmamos um motivo - só o fato, auditável, de que a avaliação institucional não existe para essas duas capitais.'}</p><p><b>{cobertura?.risco_fisico_disponivel ?? 'Goiânia e Aracaju TÊM risco físico real medido pelo AdaptaBrasil (mesma fonte usada para as outras 24) - só falta a metade institucional do cruzamento, por isso não é possível calcular prioridade pra elas.'}</b></p><div className="coverage-stats"><div><strong>27</strong><span>CAPITAIS NO UNIVERSO<br />26 ESTADUAIS + BRASÍLIA</span></div><div><strong>25</strong><span>AVALIADAS PELO PAINEL<br />24 MUNICÍPIOS + DF</span></div><div><strong>2</strong><span>AUSENTES DA AMOSTRA<br />GOIÂNIA E ARACAJU</span></div></div><span className="ai-insight-note">fonte: {cobertura?.fonte ?? 'entidades (tipo=Município) vs. adaptabrasil_risco - dataset_unificado/clima_brasil_climate_scanner.sqlite'}</span></div><AiInsight secao="mapa" /></section>

    <section id="insights" data-story="insights" className="insights-section"><div className="section-wrap"><div className="section-kicker light">05 - INSIGHTS</div><div className="data-heading"><h2>O que a leitura<br /><em>revela.</em></h2><p>Três achados reais, auditados, prontos pra virar pergunta de cobrança.</p></div><div className="interpretation dark-interpretation"><span>COMO LER ESTES DADOS</span><p>Cada insight abaixo tem uma query e uma fonte específica no banco unificado - nenhum número aqui é estimativa solta.</p></div><div className="insight-grid"><article><span>01</span><h3>Quase tudo é cobenefício</h3><p>Dos R${gasto ? (gasto.total_positivo / 1e9).toFixed(1).replace('.', ',') : '421,3'}bi de gasto climático &quot;positivo&quot; em 14 anos, só {gasto ? gasto.pct_principal.toFixed(2).replace('.', ',') : '3,88'}% teve o clima como propósito principal desde o desenho da despesa - o resto é efeito secundário de outra política. <small>fonte: view gasto_ambiental_serie_anual, Painel de Gastos Climáticos (Tesouro/MF)</small></p></article><article><span>02</span><h3>Só 4 de 24 sabem quem sofre primeiro</h3><p>Das capitais avaliadas em Justiça Climática, apenas Fortaleza, Porto Alegre, Rio de Janeiro e Salvador identificaram formalmente os grupos mais vulneráveis. 7 estão em &quot;sem progresso&quot; total. <small>fonte: avaliacoes, componente BR_G6 item A, Painel ClimaBrasil</small></p></article><article><span>03</span><h3>Nota 1,0 lá fora, 0,456 aqui dentro</h3><p>O Brasil-país tira nota máxima em Fiscalização e Litígio Climático no ranking global do ClimateScanner - mas a média real dos 51 territórios subnacionais é menos da metade disso. <small>fonte: view comparacao_brasil_vs_mundo, componente G7 ↔ GL_G10</small></p></article></div><ComparacaoBrasilMundo /><AiInsight secao="insights" /></div></section>

    <section id="acao" data-story="acao" className="action section-wrap"><div className="section-kicker">06 - A AÇÃO</div><h2>Dados mostram o caminho.<br /><em>A escolha é nossa.</em></h2><div className="action-grid"><p>Este protótipo já roda sobre dado real e auditado. Qualquer visitante, cidadão, gestor ou auditor pode ir do diagnóstico à cobrança sabendo exatamente de onde cada número veio.</p><a className="primary-cta" href="https://sites.tcu.gov.br/climatonbrasil/" target="_blank" rel="noreferrer">Conheça o ClimatonBrasil 2026 <span>↗</span></a></div><AiInsight secao="acao" /></section><footer className="footer section-wrap"><div className="brand"><BrandLogo /> CLIMA<span className="brand-muted">EM AÇÃO</span></div><span>Dado real e auditado · dataset_unificado/clima_brasil_climate_scanner.sqlite</span><span>ClimatonBrasil 2026 · TCU</span></footer>
    <StoryCloud />
    <DataChatbot />
  </main>
}
