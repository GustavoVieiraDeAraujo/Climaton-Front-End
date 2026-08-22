'use client'

import { useEffect, useState } from 'react'
import { Accessibility, Contrast, Moon, Plus, RotateCcw, Sun, Type, X } from 'lucide-react'
import { VlibrasWidget } from '@/components/vlibras-widget'

type TextSize = 'normal' | 'large' | 'xlarge'
type ContrastMode = 'normal' | 'high'
type ThemeMode = 'light' | 'dark'

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false)
  const [textSize, setTextSize] = useState<TextSize>('normal')
  const [contrast, setContrast] = useState<ContrastMode>('normal')
  const [theme, setTheme] = useState<ThemeMode>('light')

  // De propósito, SEM detecção de tema do sistema operacional - o site sempre abre em
  // Padrão/Padrão/Claro, não importa a preferência do SO do visitante. Só muda se a
  // pessoa escolher outra opção aqui no painel.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.textSize = textSize
    root.dataset.contrast = contrast
    root.dataset.theme = theme
  }, [textSize, contrast, theme])

  function reset() {
    setTextSize('normal')
    setContrast('normal')
    setTheme('light')
  }

  return (
    <>
      <button className="accessibility-trigger" type="button" aria-label="Abrir opções de acessibilidade" aria-expanded={open} aria-controls="accessibility-panel" onClick={() => setOpen((value) => !value)}>
        <Accessibility aria-hidden="true" />
        <span>Acessibilidade</span>
      </button>
      {open && (
        <aside id="accessibility-panel" className="accessibility-panel" aria-label="Opções de acessibilidade">
          <div className="accessibility-panel-head">
            <strong>Opções de acessibilidade</strong>
            <button type="button" className="accessibility-close" aria-label="Fechar opções de acessibilidade" onClick={() => setOpen(false)}><X aria-hidden="true" /></button>
          </div>
          <div className="accessibility-group">
            <span className="accessibility-label"><Type aria-hidden="true" /> Tamanho do texto</span>
            <div className="accessibility-options" role="group" aria-label="Tamanho do texto">
              {(['normal', 'large', 'xlarge'] as TextSize[]).map((size) => <button key={size} type="button" aria-pressed={textSize === size} onClick={() => setTextSize(size)}>{size === 'normal' ? 'Padrão' : size === 'large' ? 'Grande' : 'Muito grande'}</button>)}
            </div>
          </div>
          <div className="accessibility-group">
            <span className="accessibility-label"><Contrast aria-hidden="true" /> Contraste</span>
            <div className="accessibility-options" role="group" aria-label="Contraste">
              <button type="button" aria-pressed={contrast === 'normal'} onClick={() => setContrast('normal')}>Padrão</button>
              <button type="button" aria-pressed={contrast === 'high'} onClick={() => setContrast('high')}>Alto contraste</button>
            </div>
          </div>
          <div className="accessibility-group">
            <span className="accessibility-label">Tema</span>
            <div className="accessibility-options" role="group" aria-label="Tema de cores">
              <button type="button" aria-pressed={theme === 'light'} onClick={() => setTheme('light')}><Sun aria-hidden="true" /> Claro</button>
              <button type="button" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}><Moon aria-hidden="true" /> Escuro</button>
            </div>
          </div>
          <button type="button" className="accessibility-reset" onClick={reset}><RotateCcw aria-hidden="true" /> Restaurar padrão</button>
          <p className="accessibility-note"><Plus aria-hidden="true" /> As preferências se aplicam imediatamente a esta página.</p>
        </aside>
      )}
      <VlibrasWidget />
    </>
  )
}
