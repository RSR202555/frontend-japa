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
      {/* Greeting */}
      <div>
        <h1 className="page-title">
          Olá, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="page-subtitle mt-1">
          Veja seu progresso de hoje
        </p>
      </div>

      {/* Subscription Alert */}
      {!sub?.is_active && (
        <div className="rounded-xl bg-warning-light border border-amber-200 p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">Assinatura inativa</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Ative um plano para acessar todos os recursos.
            </p>
          </div>
          <Link href="/aluno/planos" className="btn-primary text-xs px-3 py-1.5 shrink-0">
            Ver planos
          </Link>
        </div>
      )}

      {/* Anamnese Alert */}
      {sub?.is_active && !dashboard?.anamnesis_done && (
        <div className="rounded-xl bg-brand-50 border border-brand-200 p-4 flex items-start gap-3">
          <ClipboardList size={18} className="text-brand-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-brand-800">Complete sua anamnese</p>
            <p className="text-xs text-brand-600 mt-0.5">
              Preencha seus dados para personalizar seu plano.
            </p>
          </div>
          <Link href="/aluno/anamnese" className="btn-primary text-xs px-3 py-1.5 shrink-0">
            Preencher
          </Link>
        </div>
      )}

      {/* Subscription Card */}
      {sub?.is_active && (
        <div className="card p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success-light flex items-center justify-center">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">{sub.plan ?? 'Plano ativo'}</p>
              <p className="text-xs text-neutral-400">
                {sub.expires_at ? `Expira em ${formatDate(sub.expires_at)}` : 'Ativo'}
              </p>
            </div>
          </div>
          <span className="badge-success">Ativo</span>
        </div>
      )}

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
        <h2 className="text-sm font-semibold text-neutral-700 mb-3">Ações rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/aluno/metas', label: 'Nova meta', icon: Target },
            { href: '/aluno/refeicoes', label: 'Registrar refeição', icon: UtensilsCrossed },
            { href: '/aluno/evolucao', label: 'Enviar foto', icon: Camera },
            { href: '/aluno/chat', label: 'Falar com treinador', icon: ClipboardList },
          ].map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.href}
                href={action.href}
                className="card-hover p-4 flex flex-col items-center gap-2 text-center cursor-pointer"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Icon size={20} className="text-brand-500" />
                </div>
                <span className="text-xs font-medium text-neutral-700">{action.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Last Photo */}
      {stats?.last_photo_date && (
        <p className="text-xs text-neutral-400 text-center">
          Última foto de evolução: {formatRelativeTime(stats.last_photo_date)}
        </p>
      )}
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
        <p className="text-xl font-bold text-neutral-900">
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
