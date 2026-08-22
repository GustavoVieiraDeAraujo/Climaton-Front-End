import { useEffect, useMemo, useState } from 'react'
import type { RiskPoint } from '@/components/risk-globe'
import { api, type Cobertura, type GastoDesastres, type GastoResumo, type Territorio } from '@/lib/api'

// Os 5 territórios em prioridade Crítica (view climate_gap_prioridade) e a narrativa curada
// pra cada um - usados como fallback instantâneo enquanto a API responde, e como mapa pra
// enriquecer o dado real que a API devolve com coordenadas + texto editorial.
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
  prioridade: 'Crítico', label: CRITICO_COPY[name].label, insight: CRITICO_COPY[name].insight,
}))

const fallbackBars = [92, 80, 85, 100, 91, 94, 77, 59, 47, 45, 45, 37, 49, 60]
const fallbackYears = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]

// Busca tudo que as seções da home precisam de uma vez só, na montagem da página. Seções
// que só precisam de UM recorte específico (scatter de território, comparação Brasil x
// Mundo, gasto por órgão) se auto-buscam direto via lib/api.ts em vez de passar por aqui -
// esse hook é só pro dado que é reaproveitado por várias seções ao mesmo tempo.
export function useHomeData() {
  const [riskPoints, setRiskPoints] = useState<RiskPoint[]>(fallbackRiskPoints)
  const [selectedPoint, setSelectedPoint] = useState<RiskPoint>(fallbackRiskPoints[0])
  const [bars, setBars] = useState(fallbackBars)
  const [years, setYears] = useState(fallbackYears)
  const [gasto, setGasto] = useState<GastoResumo | null>(null)
  const [criticos, setCriticos] = useState<Territorio[]>([])
  const [cobertura, setCobertura] = useState<Cobertura | null>(null)
  const [allPoints, setAllPoints] = useState<RiskPoint[]>(fallbackRiskPoints)
  const [gastoDesastres, setGastoDesastres] = useState<GastoDesastres | null>(null)

  useEffect(() => {
    api.territoriosCriticos().then((r) => {
      setCriticos(r.dados)
      const points = r.dados
        .filter((t) => CRITICO_COORDS[t.territorio])
        .map((t) => ({
          name: t.territorio, lat: CRITICO_COORDS[t.territorio][0], lng: CRITICO_COORDS[t.territorio][1],
          risk: Math.round(t.risco * 100),
          capacidade: Math.round(t.capacidade_p5 * 100),
          label: CRITICO_COPY[t.territorio]?.label ?? `Risco ${t.faixa_risco.toLowerCase()}, capacidade ${t.faixa_capacidade.toLowerCase()}`,
          insight: CRITICO_COPY[t.territorio]?.insight ?? `Cruzando risco físico real (AdaptaBrasil) com capacidade institucional declarada (Painel ClimaBrasil): prioridade Crítica.`,
        }))
      if (points.length) { setRiskPoints(points); setSelectedPoint(points[0]) }
    }).catch(() => {})
    api.gastosResumo().then(setGasto).catch(() => {})
    api.gastosDesastres().then(setGastoDesastres).catch(() => {})
    api.gastosSerieAnual().then((r) => {
      setBars(r.dados.map((d) => Math.round(d.pct_do_pico)))
      setYears(r.dados.map((d) => d.ano))
    }).catch(() => {})
    api.cobertura().then(setCobertura).catch(() => {})
    // As 27 capitais (26 estaduais + DF) com coordenada real (sede do município, IBGE) -
    // é o dado que o globo renderiza (panorama nacional, colorido por prioridade real).
    api.capitais().then((r) => {
      setAllPoints(r.dados.map((c) => ({
        name: c.nome, lat: c.lat, lng: c.lng,
        risk: c.risco ?? -1, // sentinela: nunca exibido - painel nacional não usa risk/capacidade, só prioridade
        prioridade: c.prioridade,
        label: c.avaliada_painel_climabrasil ? `${c.uf} · prioridade ${(c.prioridade ?? '').toLowerCase()}` : `${c.uf} · fora da amostra do Painel ClimaBrasil`,
        insight: c.avaliada_painel_climabrasil
          ? `Risco físico ${c.faixa_risco?.toLowerCase()}, capacidade institucional ${(c.capacidade ? Math.round(c.capacidade * 100) : 0)}% - prioridade ${(c.prioridade ?? '').toLowerCase()} no cruzamento do Painel ClimaBrasil.`
          : 'Tem risco físico real medido pelo AdaptaBrasil, mas falta a metade institucional do cruzamento - por isso não recebe uma prioridade calculada.',
      })))
    }).catch(() => {})
  }, [])

  const selectedInsight = useMemo(() => selectedPoint || riskPoints[0], [selectedPoint, riskPoints])

  return { riskPoints, selectedPoint, setSelectedPoint, selectedInsight, bars, years, gasto, criticos, cobertura, allPoints, gastoDesastres }
}
