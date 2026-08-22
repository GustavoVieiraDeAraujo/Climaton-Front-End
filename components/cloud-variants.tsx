'use client'

import { useState } from 'react'

type Variant = { name: string; description: string; body: string; accent: string; face: 'classic' | 'friendly' | 'editorial' | 'sky' }

const variants: Variant[] = [
  { name: 'Clássica', description: 'Contorno limpo, óculos e sorriso discreto.', body: 'M13 61C5 59 2 51 4 43c2-8 9-13 19-12C25 20 35 11 48 12c12 0 21 7 24 17 11-3 22 4 24 15 2 10-6 20-18 20H19c-2 0-4-1-6-3Z', accent: '#79b9e8', face: 'classic' },
  { name: 'Amigável', description: 'Olhos maiores e expressão mais calorosa.', body: 'M12 60C4 57 3 48 7 40c4-7 11-10 19-8C30 18 41 10 53 13c9 2 15 8 17 17 12-2 22 6 22 16 0 10-8 17-19 17H19c-3 0-5-1-7-3Z', accent: '#8ccbed', face: 'friendly' },
  { name: 'Editorial', description: 'Mais próximo de uma ilustração de dados.', body: 'M10 58C3 55 2 47 6 40c4-7 11-9 18-8C28 20 37 14 48 14c10 0 18 5 22 14 10-2 21 4 23 14 2 10-5 19-17 20H18c-3 0-6-1-8-4Z', accent: '#6aa9d9', face: 'editorial' },
  { name: 'Céu aberto', description: 'Forma leve, azul e com presença de personagem.', body: 'M14 60C6 58 3 51 5 43c2-8 9-12 18-11C27 20 37 11 49 12c12 0 21 7 24 17 11-4 23 3 24 14 2 11-6 20-18 20H20c-2 0-4-1-6-2Z', accent: '#9bd5f3', face: 'sky' },
]

function Preview({ variant }: { variant: Variant }) {
  const mouth = variant.face === 'friendly' ? 'M41 54 Q53 70 66 54 Q53 65 41 54 Z' : variant.face === 'editorial' ? 'M47 56 Q53 59 59 56' : variant.face === 'sky' ? 'M44 55 Q53 64 62 55 Q53 61 44 55 Z' : 'M45 55 Q53 66 62 55 Q53 61 45 55 Z'
  const eyeRadius = variant.face === 'friendly' ? 5.5 : variant.face === 'editorial' ? 2 : variant.face === 'sky' ? 4.2 : 3.5
  const glasses = variant.face !== 'friendly'
  return <svg className={`variant-svg variant-${variant.face}`} viewBox="0 0 100 82" aria-label={`Prévia da versão ${variant.name}`} role="img"><path d={variant.body} fill={variant.accent} stroke="#1e5275" strokeWidth={variant.face === 'editorial' ? 1.8 : 2.8}/>{glasses && <g fill="rgba(245,245,240,.42)" stroke="#1e5275" strokeWidth={variant.face === 'editorial' ? 1.5 : 2.4}><circle cx="38" cy="42" r="12"/><circle cx="68" cy="42" r="12"/><path d="M50 42h6M26 39l-7-4M80 39l7-4"/></g>}<circle cx="39" cy="42" r={eyeRadius} fill="#1e5275"/><circle cx="67" cy="42" r={eyeRadius} fill="#1e5275"/><path d={mouth} fill="#1e5275" stroke="#1e5275" strokeWidth="1.2" strokeLinecap="round"/></svg>
}

export function CloudVariants() {
  const [selected, setSelected] = useState(0)
  return <section className="cloud-variants section-wrap" aria-labelledby="cloud-variants-title"><div className="section-kicker">TESTE DE PERSONAGEM</div><div className="variants-heading"><div><h2 id="cloud-variants-title">Qual nuvem conta<br /><em>melhor a história?</em></h2><p>Estas são quatro direções visuais para o mascote narrador. Clique em uma delas para testar a presença no site.</p></div><span className="variant-counter">{String(selected + 1).padStart(2, '0')} / 04</span></div><div className="variant-grid">{variants.map((variant, index) => <button type="button" className={`variant-card${selected === index ? ' selected' : ''}`} onClick={() => setSelected(index)} key={variant.name}><Preview variant={variant} /><span>{variant.name}</span><small>{variant.description}</small></button>)}</div><div className="selected-variant"><span>VERSÃO EM TESTE</span><strong>{variants[selected].name}</strong><p>{variants[selected].description} Esta seleção é apenas uma prévia: o narrador fixo continua usando a versão atual até você escolher uma direção.</p></div></section>
}

export default CloudVariants

