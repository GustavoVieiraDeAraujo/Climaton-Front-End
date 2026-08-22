// Cliente da API do Climaton Brasil (pasta api/ na raiz do projeto - FastAPI sobre o banco
// unificado e auditado). Base URL configurável via NEXT_PUBLIC_API_URL (ver site/.env.local).

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`API ${path} respondeu ${res.status}`)
  return res.json() as Promise<T>
}

export type Territorio = {
  territorio: string
  tipo: string
  ibge_id: string
  risco: number
  faixa_risco: string
  capacidade_p5: number
  faixa_capacidade: string
  gap: number
  prioridade: 'Crítico' | 'Alto' | 'Médio' | 'Baixo'
}

export type Capital = {
  nome: string
  uf: string
  lat: number
  lng: number
  risco: number | null
  faixa_risco: string | null
  capacidade: number | null
  prioridade: string | null
  avaliada_painel_climabrasil: boolean
}

export type Cobertura = {
  universo_total: number
  universo_definicao: string
  avaliadas_painel_climabrasil: number
  avaliadas_detalhe: string
  ausentes: string[]
  explicacao: string
  risco_fisico_disponivel: string
  fonte: string
}

export type GastoSerieItem = { ano: number; valor: number; pct_do_pico: number }

export type GastoResumo = {
  total_positivo: number
  principal: number
  secundario_positivo: number
  pct_principal: number
  pct_secundario: number
  alerta: string
  fonte: string
}

export type JusticaClimatica = {
  total_capitais: number
  grupos: Record<'avançado' | 'intermediário' | 'inicial' | 'sem progresso', string[]>
  fonte: string
}

export type Resumo = { secao: string; texto: string; gerado_por: string; nota: string }

export type ComparacaoLinha = {
  componente_brasil: string
  nome_componente: string
  eixo: string
  media_brasil_subnacional: number
  media_brasil_como_pais_no_global: number
  media_mundial: number
}

export type OrgaoGasto = {
  orgao: string
  gasto_clima: number
  gasto_desastres: number
  gasto_biodiversidade: number
}

export type EixoSlug = 'governanca' | 'politicas-publicas' | 'financiamento'

export type EixoComponente = { codigo: string; nome: string; media: number; n_avaliacoes: number }
export type EixoTerritorio = { territorio: string; tipo: string; media: number }
export type EixoDistribuicaoLinha = { codigo: string; estagio: string; n: number }

export const api = {
  territorios: () => get<{ dados: Territorio[]; total: number; fonte: string }>('/territorios'),
  territoriosCriticos: () => get<{ dados: Territorio[]; total: number; fonte: string }>('/territorios/criticos'),
  capitais: () => get<{ dados: Capital[]; total: number; avaliadas_painel_climabrasil: number; fonte: string }>('/capitais'),
  cobertura: () => get<Cobertura>('/cobertura'),
  gastosSerieAnual: () => get<{ dados: GastoSerieItem[]; fonte: string }>('/gastos/serie-anual'),
  gastosResumo: () => get<GastoResumo>('/gastos/resumo'),
  justicaClimatica: () => get<JusticaClimatica>('/justica-climatica'),
  comparacaoBrasilMundo: () => get<{ dados: ComparacaoLinha[]; fonte: string }>('/comparacao-brasil-mundo'),
  gastosPorOrgao: (limit = 8) => get<{ dados: OrgaoGasto[]; fonte: string }>(`/gastos/por-orgao?limit=${limit}`),
  resumo: (secao: string) => get<Resumo>(`/resumo/${secao}`),
  eixoComponentes: (slug: EixoSlug) => get<{ eixo: string; dados: EixoComponente[]; fonte: string }>(`/eixo/${slug}/componentes`),
  eixoTerritorios: (slug: EixoSlug) => get<{ eixo: string; dados: EixoTerritorio[]; total: number; fonte: string }>(`/eixo/${slug}/territorios`),
  eixoDistribuicao: (slug: EixoSlug) => get<{ eixo: string; dados: EixoDistribuicaoLinha[]; fonte: string }>(`/eixo/${slug}/distribuicao`),
}
