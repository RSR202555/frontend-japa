'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, ExternalLink } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency } from '@/lib/utils'
import type { Plan } from '@/types'

export default function PlansPage() {
  const { user, refreshUser } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<number | null>(null)

  useEffect(() => {
    api.get<Plan[]>('/plans')
      .then((res) => setPlans(res.data))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubscribe(planId: number) {
    setSubscribing(planId)
    try {
      const res = await api.post<{ payment_url: string }>('/student/subscribe', { plan_id: planId })
      // Redirecionar para a URL de pagamento da Infinity Pay
      window.location.href = res.data.payment_url
    } catch (err) {
      console.error(err)
      alert('Erro ao processar. Tente novamente.')
    } finally {
      setSubscribing(null)
    }
  }

  const hasActive = user?.subscription?.is_active

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="page-title">Planos</h1>
        <p className="page-subtitle">Escolha o plano ideal para sua jornada</p>
      </div>

      {hasActive && (
        <div className="rounded-xl bg-success-light border border-green-200 p-4 flex items-center gap-3 text-sm text-green-700">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>
            Você já possui o plano <strong>{user?.subscription?.plan?.name}</strong> ativo.
          </span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin text-neutral-300" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="card p-6 flex flex-col gap-4 hover:shadow-card-hover transition-shadow"
            >
              <div>
                <h2 className="text-lg font-bold text-neutral-900">{plan.name}</h2>
                {plan.description && (
                  <p className="text-sm text-neutral-500 mt-1">{plan.description}</p>
                )}
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-brand-600">{formatCurrency(plan.price)}</span>
                <span className="text-sm text-neutral-400">/{plan.duration_days} dias</span>
              </div>

              {plan.features && plan.features.length > 0 && (
                <ul className="space-y-2 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                      <CheckCircle2 size={15} className="text-brand-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribing === plan.id || hasActive}
                className="btn-primary w-full mt-2"
              >
                {subscribing === plan.id ? (
                  <><Loader2 size={16} className="animate-spin" />Processando...</>
                ) : hasActive ? (
                  'Plano ativo'
                ) : (
                  <><ExternalLink size={16} />Assinar agora</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
