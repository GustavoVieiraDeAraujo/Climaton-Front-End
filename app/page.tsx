'use client'

import { DataChatbot } from '@/components/data-chatbot'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { AcaoSection } from '@/components/sections/acao-section'
import { DashboardSection } from '@/components/sections/dashboard-section'
import { HeroSection } from '@/components/sections/hero-section'
import { HistoriaSection } from '@/components/sections/historia-section'
import { InsightsSection } from '@/components/sections/insights-section'
import { MapaSection } from '@/components/sections/mapa-section'
import { TerritorioSection } from '@/components/sections/territorio-section'
import { StoryCloud } from '@/components/story-cloud'
import { useHomeData } from '@/hooks/use-home-data'

// Todo número neste site vem do banco unificado e auditado (dataset_unificado/clima_brasil_climate_scanner.sqlite),
// servido pela API em api/ (FastAPI). Esta página só compõe as 7 seções (components/sections/) - o
// dado compartilhado por várias seções vem de useHomeData(); seções que só usam um recorte próprio
// (scatter de território, comparação Brasil x Mundo, gasto por órgão) se auto-buscam via lib/api.ts.
// Ver LOG_MESTRE.md, Parte H, para a proposta completa e a fonte de cada achado.
export default function Page() {
  const { riskPoints, selectedPoint, setSelectedPoint, selectedInsight, bars, years, gasto, criticos, cobertura } = useHomeData()

  return <main>
    <Header />
    <HeroSection />
    <HistoriaSection />
    <DashboardSection criticos={criticos} gasto={gasto} bars={bars} years={years} />
    <TerritorioSection
      riskPoints={riskPoints}
      selectedPoint={selectedPoint}
      setSelectedPoint={setSelectedPoint}
      selectedInsight={selectedInsight}
    />
    <MapaSection cobertura={cobertura} />
    <InsightsSection gasto={gasto} />
    <AcaoSection />
    <Footer />
    <StoryCloud />
    <DataChatbot />
  </main>
}
