'use client'

import { DataChatbot } from '@/components/data-chatbot'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { AcaoSection } from '@/components/sections/acao-section'
import { ComparacaoSection } from '@/components/sections/comparacao-section'
import { CoberturaSection } from '@/components/sections/cobertura-section'
import { DashboardSection } from '@/components/sections/dashboard-section'
import { FontesSection } from '@/components/sections/fontes-section'
import { HeroSection } from '@/components/sections/hero-section'
import { HistoriaSection } from '@/components/sections/historia-section'
import { InsightsSection } from '@/components/sections/insights-section'
import { MapaSection } from '@/components/sections/mapa-section'
import { PrioridadesSection } from '@/components/sections/prioridades-section'
import { RedeApoioSection } from '@/components/sections/rede-apoio-section'
import { RelatosSection } from '@/components/sections/relatos-section'
import { TerritorioSection } from '@/components/sections/territorio-section'
import { StoryCloud } from '@/components/story-cloud'
import { useHomeData } from '@/hooks/use-home-data'

// Todo número neste site vem do banco unificado e auditado (dataset/clima_brasil_climate_scanner.sqlite),
// servido pela API em Climaton-Back-End (FastAPI) - EXCETO Relatos (06) e Rede de Apoio (07), que são
// protótipos com dados simulados/fictícios, marcados como tal. Ordem narrativa: Hero -> Historia (01) ->
// Dashboard/Eixos (02) -> Território (03, globo) -> Prioridades (04) -> Mapa (05) -> Relatos (06,
// simulado) -> Rede de Apoio (07, fictício) -> Cobertura (08) -> Insights (09) -> Comparação Brasil x
// Mundo (10) -> Ação (11) -> Fontes e Créditos (12, por último).
export default function Page() {
  const { selectedPoint, setSelectedPoint, selectedInsight, gasto, cobertura, allPoints, gastoDesastres } = useHomeData()

  return <>
    <Header />
    <main id="conteudo-principal" tabIndex={-1}>
      <HeroSection />
      <HistoriaSection gastoDesastres={gastoDesastres} />
      <DashboardSection />
      <TerritorioSection
        selectedPoint={selectedPoint}
        setSelectedPoint={setSelectedPoint}
        selectedInsight={selectedInsight}
        allPoints={allPoints}
      />
      <PrioridadesSection />
      <MapaSection />
      <RelatosSection />
      <RedeApoioSection />
      <CoberturaSection cobertura={cobertura} />
      <InsightsSection gasto={gasto} />
      <ComparacaoSection />
      <AcaoSection />
      <FontesSection />
    </main>
    <Footer />
    <StoryCloud />
    <DataChatbot />
  </>
}
