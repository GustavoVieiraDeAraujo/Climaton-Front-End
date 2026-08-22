'use client'

import { FormEvent, useState } from 'react'
import { api, type ChatMensagem } from '@/lib/api'

type Message = { role: 'user' | 'assistant'; text: string; fontes?: string[] }

const suggestions = ['Quais territórios estão em prioridade crítica?', 'Pra onde vai o dinheiro do clima?', 'Me leva pro mapa']

function executarAcoes(actions: { type: string; target: string }[]) {
  for (const action of actions) {
    if (action.type === 'scroll_to_section') {
      document.getElementById(action.target)?.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

export function DataChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', text: 'Olá, sou a Ekina. Todos os números aqui são reais e auditados. Pergunte sobre os territórios críticos, o financiamento, a metodologia, ou peça pra eu te levar até uma seção.' }])

  async function enviar(question: string) {
    const historico: ChatMensagem[] = messages.map((m) => ({ role: m.role, text: m.text }))
    setMessages((current) => [...current, { role: 'user', text: question }])
    setLoading(true)
    try {
      const resposta = await api.chat(question, historico)
      setMessages((current) => [...current, { role: 'assistant', text: resposta.reply, fontes: resposta.fontes }])
      if (resposta.actions?.length) executarAcoes(resposta.actions)
    } catch (err) {
      const mensagemErro = err instanceof Error ? err.message : 'Erro desconhecido'
      setMessages((current) => [...current, { role: 'assistant', text: `Não consegui responder agora (${mensagemErro}). Tenta de novo em instantes.` }])
    } finally {
      setLoading(false)
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const question = input.trim()
    if (!question || loading) return
    setInput('')
    enviar(question)
  }

  function ask(question: string) {
    if (loading) return
    setInput('')
    enviar(question)
  }

  return <aside className={`data-chat ${open ? 'is-open' : ''}`} aria-label="Assistente de interpretação de dados">
    {open && <div className="chat-window"><div className="chat-head"><div><span className="chat-status" /> AI COPILOT<strong>Assistente Ekina</strong></div><button type="button" onClick={() => setOpen(false)} aria-label="Fechar chatbot">×</button></div><div className="chat-messages" aria-live="polite">{messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>{message.text}{message.fontes && message.fontes.length > 0 && <small className="chat-fonte">{message.fontes.join(' · ')}</small>}</div>)}{loading && <div className="chat-message assistant">Pensando...</div>}</div><div className="chat-suggestions">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => ask(suggestion)} disabled={loading}>{suggestion}</button>)}</div><form onSubmit={submit} className="chat-form"><input id="data-chat-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Pergunte sobre os dados..." aria-label="Pergunte sobre os dados" disabled={loading} /><button type="submit" aria-label="Enviar pergunta" disabled={loading}>↑</button></form><small>Respostas reais, auditadas e geradas por IA (OpenRouter) · fonte citada em cada resposta com dado</small></div>}
    {!open && <button className="chat-launcher" type="button" onClick={() => setOpen(true)}><span>?</span> Assistente Ekina</button>}
  </aside>
}
