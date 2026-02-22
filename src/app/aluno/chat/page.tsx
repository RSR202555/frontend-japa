'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { cn, formatRelativeTime } from '@/lib/utils'
import type { ChatMessage, PaginatedResponse } from '@/types'

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function loadMessages() {
    const res = await api.get<PaginatedResponse<ChatMessage>>('/student/chat')
    setMessages([...res.data.data].reverse()) // mais antigos primeiro
    setLoading(false)
  }

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 10000) // polling a cada 10s
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    const text = content.trim()
    setContent('')
    setSending(true)

    try {
      await api.post('/student/chat/send', { content: text })
      await loadMessages()
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] lg:h-[calc(100dvh-6rem)] animate-fade-in">
      <div className="mb-4">
        <h1 className="page-title">Chat com o Treinador</h1>
        <p className="page-subtitle">Tire suas dúvidas diretamente</p>
      </div>

      <div className="card flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin text-neutral-300" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <p className="text-sm text-neutral-400">Nenhuma mensagem ainda</p>
              <p className="text-xs text-neutral-300">Inicie uma conversa com seu treinador</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.sender_id === user?.id
              return (
                <div
                  key={msg.id}
                  className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-2.5',
                      isOwn
                        ? 'bg-brand-500 text-white rounded-br-sm'
                        : 'bg-neutral-100 text-neutral-800 rounded-bl-sm'
                    )}
                  >
                    <p className="text-sm break-words">{msg.content}</p>
                    <p className={cn('text-xs mt-1', isOwn ? 'text-brand-200' : 'text-neutral-400')}>
                      {formatRelativeTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-neutral-100 p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="input flex-1"
              maxLength={1000}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !content.trim()}
              className="btn-primary px-4"
              aria-label="Enviar mensagem"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
