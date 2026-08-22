'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const MascotRive = dynamic(() => import('./mascot-rive').then((mod) => mod.MascotRive), { ssr: false })

// Uma expressão por capítulo, seguindo o tom de cada um - ver nota completa em mascot-rive.tsx.
const CHAPTER_ARTBOARD = ['1', '3', '5', '5', '2', '6']

// Narração ancorada nos achados reais e auditados do banco unificado - não é texto genérico.
// Fonte: dataset_unificado/clima_brasil_climate_scanner.sqlite (ver LOG_MESTRE.md, Parte H).
const chapters = [
  ['A história', '"A distância entre informação disponível e ação possível" - é assim que o próprio ClimatonBrasil descreve o problema. Role para ver o que os dados do Painel ClimaBrasil têm a dizer sobre isso.'],
  ['Os dados', 'R$ 421,32 bilhões foram classificados como gasto climático em 14 anos - mas só 3,88% teve o clima como propósito principal desde o início.'],
  ['O território', '5 territórios estão em prioridade Crítica agora: risco climático alto e capacidade institucional declarada baixa, ao mesmo tempo.'],
  ['O mapa', 'Macapá lidera a lista: risco alto, capacidade zero. O próprio parecer oficial confirma - sem plano de risco, sem alerta, sem recuperação pós-desastre.'],
  ['Os insights', 'Só 4 das 24 capitais avaliadas identificaram formalmente quem sofre primeiro com o clima. 7 nem começaram.'],
  ['A ação', 'O Brasil tira nota 1,0 em fiscalização climática no ranking global - mas a média real dos territórios por dentro é 0,456. Hora de cobrar essa distância.'],
]

export function StoryCloud() {
  const [open, setOpen] = useState(true)
  const [paused, setPaused] = useState(false)
  const [chapter, setChapter] = useState(0)
  const [visibleText, setVisibleText] = useState('')
  const [typing, setTyping] = useState(true)
  const [presenting, setPresenting] = useState(false)
  const [title, text] = chapters[chapter]

  useEffect(() => {
    setVisibleText('')
    setTyping(true)
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setVisibleText(text.slice(0, index))
      if (index >= text.length) { window.clearInterval(timer); setTyping(false) }
    }, 24)
    return () => window.clearInterval(timer)
  }, [chapter, text])

  const goToChapter = (next: number) => {
    const index = (next + chapters.length) % chapters.length
    setChapter(index)
    const ids = ['historia', 'dashboard', 'territorio', 'mapa', 'insights', 'acao']
    document.getElementById(ids[index])?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => {
      document.querySelector(`[data-story="${ids[index]}"]`)?.classList.add('story-focus')
      window.setTimeout(() => document.querySelector(`[data-story="${ids[index]}"]`)?.classList.remove('story-focus'), 2200)
    }, 500)
  }

  useEffect(() => {
    if (paused || !presenting) return
    const timer = window.setInterval(() => goToChapter(chapter + 1), typing ? 12000 : 7000)
    return () => window.clearInterval(timer)
  }, [paused, presenting, chapter, typing])

  useEffect(() => {
    if (paused) return
    const update = () => {
      const ids = ['historia', 'dashboard', 'territorio', 'mapa', 'insights', 'acao']
      const current = ids.reduce((selected, id, index) => {
        const element = document.getElementById(id)
        return element && element.getBoundingClientRect().top <= window.innerHeight * 0.45 ? index : selected
      }, 0)
      setChapter(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [paused])

  // Os dois ficam sempre montados; a troca é só de classe CSS (transição suave de opacidade/
  // escala), em vez de um unmount/mount instantâneo - ver `.story-cloud`/`.story-cloud-reopen`
  // com `[data-open]` no globals.css.
  return <>
    <button className="story-cloud-reopen" data-open={!open} onClick={() => setOpen(true)} aria-label="Abrir narrador" tabIndex={open ? -1 : 0}><span className="reopen-icon">☁</span></button>
    <aside className={`story-cloud${typing ? ' is-speaking' : ''}`} data-open={open} aria-label="Mascote narrador">
      <div className="cloud-character" aria-label="Nuvem narradora animada"><MascotRive artboard={CHAPTER_ARTBOARD[chapter]} /></div>
      <div className="cloud-content"><span className="cloud-kicker">NARRADOR · {chapter + 1}/6</span><strong>{title}</strong><p className={typing ? 'typing' : ''}>{visibleText}</p><div className="cloud-actions"><button onClick={() => setPaused(!paused)} tabIndex={open ? 0 : -1}>{paused ? 'Continuar' : 'Pausar'}</button><button onClick={() => setPresenting(!presenting)} tabIndex={open ? 0 : -1}>{presenting ? 'Parar tour' : 'Iniciar tour'}</button><button onClick={() => goToChapter(chapter + 1)} aria-label="Próxima seção" tabIndex={open ? 0 : -1}>Próxima</button><button onClick={() => setOpen(false)} aria-label="Ocultar narrador" tabIndex={open ? 0 : -1}>Ocultar</button></div></div>
    </aside>
  </>
}
