'use client'

import { useEffect, useState } from 'react'
import { Users, TrendingUp, CreditCard, AlertCircle } from 'lucide-react'
import api from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { AdminDashboard } from '@/types'

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<AdminDashboard>('/admin/dashboard')
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-neutral-200 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="card h-28 bg-neutral-100" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="page-title">Painel Administrativo</h1>
        <p className="page-subtitle">Visão geral da plataforma</p>
      </div>

      {/* Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminStatCard
          label="Receita este mês"
          value={formatCurrency(data?.revenue.this_month ?? 0)}
          icon={CreditCard}
          color="success"
        />
        <AdminStatCard
          label="Receita mês anterior"
          value={formatCurrency(data?.revenue.last_month ?? 0)}
          icon={TrendingUp}
          color="brand"
        />
        <AdminStatCard
          label="Receita total"
          value={formatCurrency(data?.revenue.total ?? 0)}
          icon={TrendingUp}
          color="brand"
        />
      </div>

      {/* Students */}
      <div>
        <h2 className="text-base font-semibold text-neutral-800 mb-4">Alunos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminStatCard label="Total de alunos" value={data?.students.total ?? 0} icon={Users} color="brand" />
          <AdminStatCard label="Alunos ativos" value={data?.students.active ?? 0} icon={Users} color="success" />
          <AdminStatCard label="Novos este mês" value={data?.students.new_this_month ?? 0} icon={Users} color="warning" />
        </div>
      </div>

      {/* Subscriptions */}
      <div>
        <h2 className="text-base font-semibold text-neutral-800 mb-4">Assinaturas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SubscriptionCard label="Ativas" value={data?.subscriptions.active ?? 0} color="success" />
          <SubscriptionCard label="Pendentes" value={data?.subscriptions.pending ?? 0} color="warning" />
          <SubscriptionCard label="Expiradas" value={data?.subscriptions.expired ?? 0} color="neutral" />
          <SubscriptionCard label="Canceladas" value={data?.subscriptions.cancelled ?? 0} color="danger" />
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-base font-semibold text-neutral-800 mb-4">Últimas transações</h2>
        <div className="card overflow-hidden">
          {data?.recent_transactions.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-400">Nenhuma transação registrada</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-neutral-600">Aluno</th>
                    <th className="text-right px-4 py-3 font-medium text-neutral-600">Valor</th>
                    <th className="text-center px-4 py-3 font-medium text-neutral-600">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-neutral-600">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {data?.recent_transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 text-neutral-700">{tx.user_id}</td>
                      <td className="px-4 py-3 text-right font-medium text-neutral-800">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {tx.status === 'paid' ? (
                          <span className="badge-success">Pago</span>
                        ) : tx.status === 'failed' ? (
                          <span className="badge-danger">Falhou</span>
                        ) : (
                          <span className="badge-neutral">{tx.status}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-400 text-xs">
                        {tx.paid_at ? formatDate(tx.paid_at) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminStatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
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
        <p className="text-xl font-bold text-neutral-900">{value}</p>
        <p className="text-xs text-neutral-400">{label}</p>
      </div>
    </div>
  )
}

function SubscriptionCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: 'success' | 'warning' | 'neutral' | 'danger'
}) {
  const colors = {
    success: 'border-l-4 border-l-green-400',
    warning: 'border-l-4 border-l-amber-400',
    neutral: 'border-l-4 border-l-neutral-300',
    danger:  'border-l-4 border-l-red-400',
  }

  return (
    <div className={`card p-4 ${colors[color]}`}>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      <p className="text-xs text-neutral-400 mt-1">{label}</p>
    </div>
  )
}
