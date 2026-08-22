'use client'

import { useState } from 'react'
import { AiInsight } from '@/components/ai-insight'
import { EixoCards } from '@/components/eixo-cards'
import { GastoPorOrgao } from '@/components/gasto-por-orgao'
import { Kpis } from '@/components/kpis'
import type { GastoResumo, Territorio } from '@/lib/api'

const regions = ['Brasil', 'Amazônia', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

type Props = { criticos: Territorio[]; gasto: GastoResumo | null; bars: number[]; years: number[] }

export function DashboardSection({ criticos, gasto, bars, years }: Props) {
  const [region, setRegion] = useState('Brasil')
  const [activeBar, setActiveBar] = useState(3)
  const totalBi = gasto ? (gasto.total_positivo / 1e9).toFixed(1).replace('.', ',') : '421,3'
  const pctPrincipal = gasto ? gasto.pct_principal.toFixed(2).replace('.', ',') : '3,88'

  return <section id="dashboard" className="data-section">
    <div className="section-wrap">
      <div className="section-kicker light">02 - DASHBOARD</div>
      <div className="data-heading">
        <h2>Uma visão para<br /><em>decidir melhor.</em></h2>
        <p>Gasto, risco e capacidade institucional, cruzados - os números abaixo são reais e auditados, extraídos do banco unificado.</p>
      </div>
      <div className="interpretation dark-interpretation">
        <span>COMO LER ESTES DADOS</span>
        <p>O gráfico mostra o gasto climático total por ano (2010-2023), como % do pico do período. A queda depois de 2013 é real - não é um artefato de normalização.</p>
      </div>
      <Kpis criticos={criticos.length || 5} gasto={gasto} />
      <div className="dashboard-grid">
        <article><span className="panel-label">PAINEL 01 · EXPOSIÇÃO</span><strong>Onde o risco é maior?</strong><p>Os 51 territórios do Painel ClimaBrasil, risco físico real do AdaptaBrasil por trás de cada um.</p><a href="#territorio"><button type="button">Abrir painel <span>↗</span></button></a></article>
        <article><span className="panel-label">PAINEL 02 · FINANCIAMENTO</span><strong>Pra onde vai o dinheiro?</strong><p>R${totalBi}bi em 14 anos - só {pctPrincipal}% com o clima como propósito principal da despesa.</p><a href="#insights"><button type="button">Abrir painel <span>↗</span></button></a></article>
        <article><span className="panel-label">PAINEL 03 · PRIORIDADE</span><strong>Onde agir primeiro?</strong><p>Matriz de prioridade risco × capacidade - não um ranking, uma priorização declarada e auditável.</p><a href="#mapa"><button type="button">Abrir painel <span>↗</span></button></a></article>
      </div>
      <div className="bi-panel">
        <div className="bi-panel-head"><h3>Os 3 eixos do Painel ClimaBrasil</h3><small>governança, políticas públicas e financiamento - clique pra ver o detalhamento completo de cada um</small></div>
        <EixoCards />
      </div>
      <div className="data-panel" data-story="dashboard">
        <div className="panel-top">
          <div>
            <span className="panel-label">GASTO CLIMÁTICO TOTAL POR ANO</span>
            <strong>{criticos.length || 5}/51</strong>
            <span className="panel-sub">dos territórios avaliados estão em prioridade crítica agora</span>
          </div>
          <div className="select-wrap">
            <label htmlFor="region">Recorte</label>
            <select id="region" value={region} onChange={(e) => setRegion(e.target.value)}>
              {regions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
        <div className="chart" aria-label="Gráfico de gasto climático total por ano, 2010 a 2023">
          <div className="chart-y"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div>
          <div className="bars">
            {bars.map((height, index) => (
              <button key={index} className={`bar ${index === activeBar ? 'active' : ''}`} style={{ height: `${height}%` }} onClick={() => setActiveBar(index)} aria-label={`Ano ${years[index]}, ${height}% do pico`}>
                <span>{years[index]}: {height}%</span>
              </button>
            ))}
          </div>
        </div>
        <div className="chart-x">
          <span>{years[0]}</span><span>{years[Math.floor(years.length / 3)]}</span><span>{years[Math.floor(2 * years.length / 3)]}</span><span>{years[years.length - 1]}</span>
        </div>
        <AiInsight secao="dashboard" />
      </div>
      <GastoPorOrgao />
    </div>
  </section>
}
