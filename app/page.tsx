'use client'

import { DataChatbot } from '@/components/data-chatbot'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { AcaoSection } from '@/components/sections/acao-section'
import { DashboardSection } from '@/components/sections/dashboard-section'
import { HeroSection } from '@/components/sections/hero-section'
import { HistoriaSection } from '@/components/sections/historia-section'
import { StoryCloud } from '@/components/story-cloud'

export default function Page() {
  return <>
    <Header />
    <main id="conteudo-principal" tabIndex={-1}>
      <HeroSection />
      <HistoriaSection />
      <DashboardSection />
      <AcaoSection />
    </main>
    <Footer />
    <StoryCloud />
    <DataChatbot />
  </>
}
