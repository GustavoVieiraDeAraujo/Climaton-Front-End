'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    VLibras?: { Widget: new (url: string) => unknown }
  }
}

export function VlibrasWidget() {
  useEffect(() => {
    const existing = document.querySelector('script[data-vlibras]')
    if (existing) return
    const script = document.createElement('script')
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'
    script.async = true
    script.dataset.vlibras = 'true'
    script.onload = () => {
      if (window.VLibras?.Widget) new window.VLibras.Widget('https://vlibras.gov.br/app')
    }
    document.body.appendChild(script)
  }, [])

  return (
    <div vw="true" className="enabled" aria-label="Tradutor de Libras VLibras">
      <div vw-access-button="true" className="active" />
      <div vw-plugin-wrapper="true"><div className="vw-plugin-top-wrapper" /></div>
    </div>
  )
}
