'use client'

import { useEffect, useState } from 'react'
import { api, type Resumo } from '@/lib/api'

// Slot de leitura automática ao lado de cada gráfico/mapa/painel. Busca o resumo na API
// (endpoint /resumo/{secao}) - hoje é texto gerado por template a partir do banco, não por
// um LLM real (sem chave configurada nesta fase); o campo `nota` da própria API já avisa isso,
// e mostramos essa proveniência na tela em vez de fingir que é algo que não é.
export function AiInsight({ secao }: { secao: string }) {
  const [resumo, setResumo] = useState<Resumo | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    api.resumo(secao).then((r) => active && setResumo(r)).catch(() => active && setError(true))
    return () => { active = false }
  }, [secao])

  return <div className="ai-insight">
    <span className="ai-insight-badge">LEITURA AUTOMÁTICA</span>
    {error && <p className="ai-insight-text">API indisponível - rode a API em <code>api/</code> (<code>uvicorn main:app --port 8000</code>) para ver este resumo ao vivo.</p>}
    {!error && !resumo && <p className="ai-insight-text ai-insight-loading">Consultando o banco…</p>}
    {resumo && <>
      <p className="ai-insight-text">{resumo.texto}</p>
      <span className="ai-insight-note">{resumo.nota}</span>
    </>}
  </div>
}
