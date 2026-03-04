'use client'

import { MessageSquare } from 'lucide-react'

export default function AdminChatPage() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="page-title">Mensagens</h1>
        <p className="page-subtitle">Chat com alunos</p>
      </div>

      <div className="card p-12 flex flex-col items-center justify-center text-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center">
          <MessageSquare size={28} className="text-brand-400" />
        </div>
        <div>
          <p className="font-semibold text-neutral-700">Chat em desenvolvimento</p>
          <p className="text-sm text-neutral-400 mt-1">
            O módulo de mensagens em tempo real estará disponível em breve.
          </p>
        </div>
      </div>
    </div>
  )
}
