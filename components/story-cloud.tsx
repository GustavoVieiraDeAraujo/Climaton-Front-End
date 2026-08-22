'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const MascotRive = dynamic(() => import('./mascot-rive').then((mod) => mod.MascotRive), { ssr: false })

// Uma expressão por capítulo, escolhida pelo tom real do que está sendo contado (conferido
// visualmente nos 6 artboards do mascot.riv - ver mascot-rive.tsx): 1 impressionada/curiosa,
// 2 chocada, 3 confiante, 4 feliz, 5 chorando/triste, 6 comemorando.
const CHAPTER_ARTBOARD = ['2', '3', '5', '4', '1', '2', '4', '3', '2', '5', '6']

// Um capítulo por seção real do site (11 no total), amarrados no mesmo fio condutor: o Brasil
// gasta mais remediando desastres do que evitando-os. Cada texto cruza esse achado central com
// o dado específico que a seção mostra - nada de texto genérico solto. Toda afirmação aqui foi
// conferida direto no banco antes de entrar (ver app/routers/gastos.py::desastres-prevencao-vs-
// recuperacao e climate_gap_prioridade) - inclusive um erro pego nessa checagem: "São Paulo" é
// dois registros diferentes no banco (estado x município-capital, perfis opostos), por isso o
// capítulo 4 especifica "os estados de".
// Fonte: dataset_unificado/clima_brasil_climate_scanner.sqlite.
const chapters = [
  ['A história', 'O Brasil gastou R$37,4 bilhões reconstruindo depois de desastres e só R$22,5 bilhões evitando-os, em 14 anos - 1,67 vez mais remediando do que prevenindo. As enchentes do Rio Grande do Sul em 2024 são só o capítulo mais recente desse padrão.'],
  ['Os três eixos', 'Governança, políticas públicas e financiamento são as engrenagens que decidem isso: um estado com plano de redução de risco pronto reage diferente de um que só descobre o problema depois da enchente.'],
  ['O território', 'Macapá tem risco alto e capacidade zero: sem plano de redução de risco, sem alerta, sem plano de recuperação pós-desastre. No globo das 27 capitais, o vermelho marca quem mais precisa de prevenção - e é onde ela menos existe.'],
  ['A prioridade', '51 territórios, risco de um lado, capacidade do outro. Os estados de São Paulo, Minas Gerais e Rio Grande do Norte mostram que capacidade máxima é possível - a pergunta é por que não é a regra pros outros 48.'],
  ['O mapa', 'Espalhado de norte a sul, o padrão se repete: risco físico real (AdaptaBrasil) cruzado com capacidade institucional declarada (Painel ClimaBrasil) - juntos, mostram onde o próximo desastre vai doer mais.'],
  ['Os relatos', 'Um protótipo: moradores relatando rachadura, erosão, nível de água subindo - sinais de que algo pode estar a caminho, no momento em que ainda dá pra agir. Dado simulado, mas a ideia é real: prevenção também é ouvir quem percebe primeiro.'],
  ['A rede de apoio', 'Outro protótipo: e se cada sinal relatado seguisse um caminho até quem pode agir - defesa civil municipal, órgão estadual, auditoria federal? Fictício, mas mostra que o relato não precisa parar na reclamação. Pode virar processo.'],
  ['A cobertura', 'Nem tudo está nos 24: Goiânia e Aracaju têm risco físico real medido, mas ficaram fora da amostra institucional - por isso não entram na conta de prioridade. Mostrar o buraco no dado também é prevenção.'],
  ['Os insights', 'Só 4 das 24 capitais avaliadas sabem formalmente quem sofre primeiro com o clima; 7 nem começaram a descobrir. Saber quem é mais vulnerável é o primeiro passo de qualquer prevenção - e é o que mais falta.'],
  ['Brasil x mundo', 'Lá fora, o Brasil tira nota 1,0 em fiscalização climática. Aqui dentro, a média real dos 51 territórios é 0,456 - menos da metade. A nota que o mundo vê não é a nota que o território vive.'],
  ['A ação', 'O padrão não é destino. Cada número aqui tem fonte e pergunta pronta pra virar cobrança - trocar reconstrução recorrente por prevenção de verdade, antes do próximo Rio Grande do Sul.'],
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
    const ids = ['historia', 'dashboard', 'territorio', 'prioridades', 'mapa', 'relatos', 'rede-apoio', 'cobertura', 'insights', 'comparacao', 'acao']
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
      const ids = ['historia', 'dashboard', 'territorio', 'prioridades', 'mapa', 'relatos', 'rede-apoio', 'cobertura', 'insights', 'comparacao', 'acao']
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
    <button className="story-cloud-reopen" data-open={!open} onClick={() => setOpen(true)} aria-label="Abrir narrador" tabIndex={open ? -1 : 0}>
      <svg className="reopen-icon" viewBox="0 0 48 30" width="30" height="19" fill="currentColor" aria-hidden="true">
        <rect x="6" y="14" width="36" height="13" rx="6.5" />
        <circle cx="16" cy="14" r="9" />
        <circle cx="27" cy="10" r="10.5" />
        <circle cx="37" cy="15" r="7" />
      </svg>
    </button>
    <aside className={`story-cloud${typing ? ' is-speaking' : ''}`} data-open={open} aria-label="Mascote narrador">
      <div className="cloud-character" aria-label="Nuvem narradora animada"><MascotRive artboard={CHAPTER_ARTBOARD[chapter]} /></div>
      <div className="cloud-content"><span className="cloud-kicker">NARRADOR · {chapter + 1}/{chapters.length}</span><strong>{title}</strong><p className={typing ? 'typing' : ''}>{visibleText}</p><div className="cloud-actions"><button onClick={() => setPaused(!paused)} tabIndex={open ? 0 : -1}>{paused ? 'Continuar' : 'Pausar'}</button><button onClick={() => setPresenting(!presenting)} tabIndex={open ? 0 : -1}>{presenting ? 'Parar tour' : 'Iniciar tour'}</button><button onClick={() => goToChapter(chapter + 1)} aria-label="Próxima seção" tabIndex={open ? 0 : -1}>Próxima</button><button onClick={() => setOpen(false)} aria-label="Ocultar narrador" tabIndex={open ? 0 : -1}>Ocultar</button></div></div>
    </aside>
  </>
}
