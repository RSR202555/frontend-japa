'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UserCheck, UserX, ClipboardList, Calendar, Mail, Phone, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { cn, formatDate } from '@/lib/utils'
import type { User } from '@/types'

interface Protocol {
  id: number
  title: string
  type: string
  content: unknown
}

interface Assignment {
  id: number
  notes: string | null
  assigned_at: string
  protocol: Protocol
}

interface StudentDetail {
  user: User
  protocol_assignment: Assignment | null
}

interface ProtocolTemplate {
  id: number
  title: string
  type: string
  created_at: string
}

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<StudentDetail | null>(null)
  const [protocols, setProtocols] = useState<ProtocolTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [showAssignForm, setShowAssignForm] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<StudentDetail>(`/admin/users/${id}`),
      api.get<ProtocolTemplate[]>('/admin/protocolos'),
    ])
      .then(([studentRes, protocolsRes]) => {
        setData(studentRes.data)
        setProtocols(protocolsRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  async function handleToggleActive() {
    if (!data) return
    await api.patch(`/admin/users/${id}/toggle-active`)
    setData((prev) =>
      prev ? { ...prev, user: { ...prev.user, is_active: !prev.user.is_active } } : prev
    )
  }

  async function handleAssignProtocol() {
    if (!selectedProtocol) return
    setAssigning(true)
    try {
      await api.post(`/admin/users/${id}/protocolo`, {
        protocol_id: selectedProtocol,
        notes,
      })
      const res = await api.get<StudentDetail>(`/admin/users/${id}`)
      setData(res.data)
      setShowAssignForm(false)
      setSelectedProtocol(null)
      setNotes('')
    } catch (err) {
      console.error(err)
      alert('Erro ao atribuir protocolo.')
    } finally {
      setAssigning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={24} className="animate-spin text-neutral-300" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-16 text-neutral-400">
        Aluno não encontrado.{' '}
        <Link href="/admin/alunos" className="text-brand-600">Voltar</Link>
      </div>
    )
  }

  const { user, protocol_assignment } = data
  const typeLabel = { treino: 'Treino', dieta: 'Dieta', full: 'Treino + Dieta' }

  return (
    <div className="space-y-6 animate-slide-up max-w-3xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title">{user.name}</h1>
          <p className="page-subtitle">Detalhes do aluno</p>
        </div>
      </div>

      {/* Info do aluno */}
      <div className="card p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">Informações</h2>
          <button
            onClick={handleToggleActive}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              user.is_active
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            )}
          >
            {user.is_active ? <><UserX size={14} /> Desativar</> : <><UserCheck size={14} /> Ativar</>}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-neutral-600">
            <Mail size={15} className="text-neutral-400" />
            {user.email}
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 text-neutral-600">
              <Phone size={15} className="text-neutral-400" />
              {user.phone}
            </div>
          )}
          <div className="flex items-center gap-2 text-neutral-600">
            <Calendar size={15} className="text-neutral-400" />
            Cadastrado em {formatDate(user.created_at)}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <span className={cn('badge', user.is_active ? 'badge-success' : 'badge-neutral')}>
            {user.is_active ? 'Conta ativa' : 'Conta inativa'}
          </span>
          {user.subscription?.is_active ? (
            <span className="badge-success">Assinatura ativa — {user.subscription.plan?.name}</span>
          ) : (
            <span className="badge-neutral">Sem assinatura ativa</span>
          )}
        </div>
      </div>

      {/* Protocolo atual */}
      <div className="card p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">Protocolo atual</h2>
          <button
            onClick={() => setShowAssignForm(!showAssignForm)}
            className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
          >
            <ClipboardList size={14} />
            {protocol_assignment ? 'Trocar protocolo' : 'Atribuir protocolo'}
          </button>
        </div>

        {protocol_assignment ? (
          <div className="bg-brand-50 rounded-xl p-4 space-y-1">
            <p className="font-semibold text-neutral-900">{protocol_assignment.protocol.title}</p>
            <p className="text-xs text-neutral-500">
              {typeLabel[protocol_assignment.protocol.type as keyof typeof typeLabel] ?? protocol_assignment.protocol.type}
              {' · '}Atribuído em {formatDate(protocol_assignment.assigned_at)}
            </p>
            {protocol_assignment.notes && (
              <p className="text-sm text-neutral-600 mt-2">{protocol_assignment.notes}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-neutral-400">Nenhum protocolo atribuído.</p>
        )}

        {/* Formulário de atribuição */}
        {showAssignForm && (
          <div className="border border-neutral-200 rounded-xl p-4 space-y-3 bg-neutral-50">
            <p className="text-sm font-medium text-neutral-700">Selecionar protocolo</p>
            {protocols.length === 0 ? (
              <p className="text-sm text-neutral-400">
                Nenhum protocolo criado ainda.{' '}
                <Link href="/admin/protocolos" className="text-brand-600">Criar agora</Link>
              </p>
            ) : (
              <>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {protocols.map((p) => (
                    <label
                      key={p.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                        selectedProtocol === p.id
                          ? 'border-brand-400 bg-brand-50'
                          : 'border-neutral-200 hover:bg-white'
                      )}
                    >
                      <input
                        type="radio"
                        name="protocol"
                        value={p.id}
                        checked={selectedProtocol === p.id}
                        onChange={() => setSelectedProtocol(p.id)}
                        className="accent-brand-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{p.title}</p>
                        <p className="text-xs text-neutral-400">
                          {typeLabel[p.type as keyof typeof typeLabel] ?? p.type}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                <div>
                  <label className="label text-xs">Observações (opcional)</label>
                  <textarea
                    className="input resize-none text-sm"
                    rows={2}
                    placeholder="Observações para o aluno..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAssignProtocol}
                    disabled={!selectedProtocol || assigning}
                    className="btn-primary text-sm flex items-center gap-2"
                  >
                    {assigning && <Loader2 size={14} className="animate-spin" />}
                    Confirmar
                  </button>
                  <button
                    onClick={() => setShowAssignForm(false)}
                    className="btn-ghost text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
