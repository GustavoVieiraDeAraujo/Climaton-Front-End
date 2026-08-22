'use client'

import { useEffect, useState } from 'react'
import { api, type Fonte } from '@/lib/api'

const CLASSIFICACAO_COR: Record<string, string> = {
  'boa': '#3f9d76', 'atencao': '#d98a3f', 'critica': '#e0574a',
}
const CLASSIFICACAO_LABEL: Record<string, string> = {
  'boa': 'boa', 'atencao': 'atenção', 'critica': 'crítica',
}

// Toda seção do site cita fonte inline (view/tabela/query) - essa seção reúne as 6 bases de
// dados originais por trás de tudo isso, com crédito a quem produziu cada uma e as ressalvas
// de qualidade já documentadas na tabela qualidade_fontes (não maquiamos limitação nenhuma).
export function FontesSection() {
  const [fontes, setFontes] = useState<Fonte[]>([])

  useEffect(() => {
    api.fontes().then((r) => setFontes(r.dados)).catch(() => {})
  }, [])

  return <section id="fontes" data-story="fontes" className="fontes-section section-wrap">
    <div className="section-kicker">12 - FONTES E CRÉDITOS</div>
    <div className="territory-heading">
      <h2>Seis bases,<br /><em>um banco só.</em></h2>
      <p>Todo número deste site vem de uma dessas seis fontes originais, cruzadas no banco unificado. Crédito a quem produziu o dado - e a ressalva de qualidade de cada uma, sem esconder limitação.</p>
    </div>
    <div className="fontes-grid">
      {fontes.map((f) => (
        <article key={f.codigo} className="fonte-card">
          <h3>{f.nome}</h3>
          <p>{f.descricao}</p>
          <span className="fonte-arquivo">{f.arquivo_origem}</span>
          {f.qualidade.length > 0 && (
            <ul className="fonte-qualidade">
              {f.qualidade.map((q) => (
                <li key={q.dimensao}>
                  <span className="fonte-badge" style={{ color: CLASSIFICACAO_COR[q.classificacao] }}>
                    <i style={{ background: CLASSIFICACAO_COR[q.classificacao] }} />
                    {q.dimensao}: {CLASSIFICACAO_LABEL[q.classificacao] ?? q.classificacao}
                  </span>
                  <p>{q.resumo}</p>
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  </section>
}
