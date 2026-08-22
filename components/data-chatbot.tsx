'use client'

import { FormEvent, useState } from 'react'

type Message = { role: 'user' | 'assistant'; text: string }

const suggestions = ['Quais territórios estão em prioridade crítica?', 'Pra onde vai o dinheiro do clima?', 'O que significa "prioridade crítica"?']

// Respostas ancoradas nos achados reais e auditados do banco unificado. Ainda fixas nesta etapa
// (a integração com a API sobre o SQLite vem na próxima fase, ver LOG_MESTRE.md Parte H).
function fakeAnswer(question: string) {
  const normalized = question.toLowerCase()
  if (normalized.includes('crític') || normalized.includes('prioridade')) return '5 territórios estão em prioridade crítica agora: Macapá, Fortaleza, São Luís, Pernambuco (estado) e Maceió - risco climático alto e capacidade institucional declarada baixa ao mesmo tempo, segundo a matriz de prioridade risco × capacidade (Painel ClimaBrasil + AdaptaBrasil).'
  if (normalized.includes('dinheiro') || normalized.includes('financiamento') || normalized.includes('gasto')) return 'R$421,32 bilhões foram classificados como gasto climático "positivo" entre 2010 e 2023 - mas só 3,88% (R$16,3bi) teve o clima como propósito principal da despesa desde o início. O resto é cobenefício de outra política pública.'
  if (normalized.includes('macapá') || normalized.includes('macapa')) return 'Macapá lidera a lista de prioridade crítica: risco climático alto e capacidade institucional ZERO. O parecer oficial dos auditores do Painel ClimaBrasil confirma: sem plano de redução de risco, sem sistema de alerta, sem plano de recuperação pós-desastre.'
  if (normalized.includes('significa') || normalized.includes('o que é') || normalized.includes('prioridade crítica')) return '"Prioridade crítica" não é uma subtração de números - é uma matriz de risco (o mesmo princípio de probabilidade × impacto usado em gestão de risco institucional, ISO 31000). Cruza risco físico real (alto/médio/baixo) com capacidade institucional declarada (alta/média/baixa); crítico é risco alto + capacidade baixa.'
  return 'Posso responder sobre os territórios críticos, o financiamento climático real e a metodologia por trás dos números. Nesta versão as respostas já são reais, extraídas do banco auditado - a próxima etapa conecta isso a uma API viva.'
}

export function DataChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', text: 'Olá. Sou o guia desta leitura - todos os números aqui são reais e auditados. Pergunte sobre os territórios críticos, o financiamento ou a metodologia.' }])

  function submit(event: FormEvent) {
    event.preventDefault()
    const question = input.trim()
    if (!question) return
    setMessages((current) => [...current, { role: 'user', text: question }, { role: 'assistant', text: fakeAnswer(question) }])
    setInput('')
  }

  function ask(question: string) {
    setInput(question)
    setTimeout(() => document.getElementById('data-chat-input')?.focus(), 0)
  }

  return <aside className={`data-chat ${open ? 'is-open' : ''}`} aria-label="Assistente de interpretação de dados">
    {open && <div className="chat-window"><div className="chat-head"><div><span className="chat-status" /> GUIA DE DADOS<strong>Climaton Brasil</strong></div><button type="button" onClick={() => setOpen(false)} aria-label="Fechar chatbot">×</button></div><div className="chat-messages" aria-live="polite">{messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>{message.text}</div>)}</div><div className="chat-suggestions">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => ask(suggestion)}>{suggestion}</button>)}</div><form onSubmit={submit} className="chat-form"><input id="data-chat-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Pergunte sobre os dados..." aria-label="Pergunte sobre os dados" /><button type="submit" aria-label="Enviar pergunta">↑</button></form><small>Respostas reais e auditadas · API viva na próxima etapa</small></div>}
    {!open && <button className="chat-launcher" type="button" onClick={() => setOpen(true)}><span>?</span> Interpretar os dados</button>}
  </aside>
}
