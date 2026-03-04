'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Target,
  UtensilsCrossed,
  Camera,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Flame,
  CalendarDays,
  Image as ImageIcon,
  MessageSquare,
} from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils'
import type { StudentDashboard } from '@/types'

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<StudentDashboard>('/student/dashboard')
      .then((res) => setDashboard(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  const sub = dashboard?.subscription
  const stats = dashboard?.stats

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Olá, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle mt-1">Veja seu progresso de hoje</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
          <CalendarDays size={14} />
          <span>
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
            })}
          </span>
        </div>
      </div>

      {/* Subscription Alert */}
      {!sub?.is_active && (
        <div className="card p-4 flex items-start gap-3" style={{ background: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
          <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-neutral-100">Assinatura inativa</p>
            <p className="text-xs text-neutral-300 mt-0.5">Ative um plano para liberar treino, evolução e chat.</p>
          </div>
          <Link href="/aluno/planos" className="btn-primary text-xs px-3 py-1.5 shrink-0">
            Ver planos
          </Link>
        </div>
      )}

      {/* Anamnese Alert */}
      {sub?.is_active && !dashboard?.anamnesis_done && (
        <div className="card p-4 flex items-start gap-3" style={{ background: 'rgba(91, 140, 245, 0.10)', borderColor: 'rgba(91, 140, 245, 0.25)' }}>
          <ClipboardList size={18} className="text-brand-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-neutral-100">Complete sua anamnese</p>
            <p className="text-xs text-neutral-300 mt-0.5">Isso ajuda o treinador a ajustar treino e dieta para você.</p>
          </div>
          <Link href="/aluno/anamnese" className="btn-primary text-xs px-3 py-1.5 shrink-0">
            Preencher
          </Link>
        </div>
      )}

      {/* Subscription Card */}
      {sub?.is_active && (
        <div className="card p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success-light flex items-center justify-center">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-100">{sub.plan ?? 'Plano ativo'}</p>
              <p className="text-xs text-neutral-400">{sub.expires_at ? `Expira em ${formatDate(sub.expires_at)}` : 'Ativo'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-success">Ativo</span>
            <Link href="/aluno/planos" className="btn-ghost text-xs px-3 py-1.5">Gerenciar</Link>
          </div>
        </div>
      )}

      {/* Today Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <p className="section-label">HOJE</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="card p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-400">Refeições</p>
                <UtensilsCrossed size={16} className="text-neutral-500" />
              </div>
              <p className="mt-2 text-2xl font-bold text-neutral-100">{stats?.meals_today ?? 0}</p>
              <p className="text-xs text-neutral-500 mt-1">registradas</p>
            </div>

            <div className="card p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-400">Calorias</p>
                <Flame size={16} className="text-neutral-500" />
              </div>
              <p className="mt-2 text-2xl font-bold text-neutral-100">{Math.round(stats?.calories_today ?? 0)}</p>
              <p className="text-xs text-neutral-500 mt-1">kcal</p>
            </div>

            <div className="card p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-400">Evolução</p>
                <ImageIcon size={16} className="text-neutral-500" />
              </div>
              <p className="mt-2 text-2xl font-bold text-neutral-100">{stats?.total_photos ?? 0}</p>
              <p className="text-xs text-neutral-500 mt-1">fotos enviadas</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-neutral-400">
              {stats?.last_photo_date
                ? `Última foto: ${formatRelativeTime(stats.last_photo_date)}`
                : 'Você ainda não enviou foto de evolução.'}
            </p>
            <div className="flex items-center gap-2">
              <Link href="/aluno/evolucao" className="btn-secondary text-xs px-3 py-1.5">Enviar foto</Link>
              <Link href="/aluno/refeicoes" className="btn-ghost text-xs px-3 py-1.5">Registrar refeição</Link>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <p className="section-label">PRÓXIMOS PASSOS</p>
          <div className="mt-4 space-y-3">
            <Link href="/aluno/treino" className="card-hover p-4">
              <p className="text-sm font-semibold text-neutral-100">Ver meu treino</p>
              <p className="text-xs text-neutral-400 mt-1">Acesse o protocolo atualizado.</p>
            </Link>
            <Link href="/aluno/chat" className="card-hover p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-100">Falar com treinador</p>
                <MessageSquare size={16} className="text-neutral-500" />
              </div>
              <p className="text-xs text-neutral-400 mt-1">Tire dúvidas sem depender do WhatsApp.</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Metas ativas"
          value={stats?.active_goals ?? 0}
          icon={Target}
          color="brand"
        />
        <StatCard
          label="Conquistas"
          value={stats?.achieved_goals ?? 0}
          icon={TrendingUp}
          color="success"
        />
        <StatCard
          label="Refeições hoje"
          value={stats?.meals_today ?? 0}
          icon={UtensilsCrossed}
          color="warning"
        />
        <StatCard
          label="Kcal hoje"
          value={Math.round(stats?.calories_today ?? 0)}
          suffix="kcal"
          icon={Flame}
          color="danger"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-end justify-between gap-4 mb-3">
          <h2 className="text-sm font-semibold text-neutral-200">Ações rápidas</h2>
          <p className="text-xs text-neutral-500 hidden sm:block">Atalhos para registrar seu dia.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/aluno/metas', label: 'Nova meta', icon: Target },
            { href: '/aluno/refeicoes', label: 'Registrar refeição', icon: UtensilsCrossed },
            { href: '/aluno/evolucao', label: 'Enviar foto', icon: Camera },
            { href: '/aluno/chat', label: 'Falar com treinador', icon: MessageSquare },
          ].map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.href}
                href={action.href}
                className="card-hover p-4 flex flex-col items-center gap-2 text-center cursor-pointer"
              >
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(91, 140, 245, 0.10)' }}>
                  <Icon size={20} className="text-brand-500" />
                </div>
                <span className="text-xs font-medium text-neutral-200">{action.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  suffix?: string
  icon: React.ElementType
  color: 'brand' | 'success' | 'warning' | 'danger'
}) {
  const colors = {
    brand:   'bg-brand-50 text-brand-500',
    success: 'bg-success-light text-green-600',
    warning: 'bg-warning-light text-amber-600',
    danger:  'bg-danger-light text-red-500',
  }

  return (
    <div className="stat-card">
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xl font-bold text-neutral-100">
          {value.toLocaleString('pt-BR')}
          {suffix && <span className="text-sm font-medium text-neutral-400 ml-1">{suffix}</span>}
        </p>
        <p className="text-xs text-neutral-400">{label}</p>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-neutral-200 rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6 h-28 bg-neutral-100" />
        ))}
      </div>
    </div>
  )
}
