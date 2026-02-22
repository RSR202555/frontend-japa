'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, ExternalLink, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { formatCurrency, cn } from '@/lib/utils'
import type { Plan } from '@/types'
import type { AxiosError } from 'axios'

const checkoutSchema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres').max(255),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  plan_id: z.coerce.number().positive('Selecione um plano'),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

function CheckoutContent() {
  const searchParams = useSearchParams()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const planIdFromUrl = searchParams.get('plan')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      plan_id: planIdFromUrl ? Number(planIdFromUrl) : undefined,
    },
  })

  const watchedPlanId = watch('plan_id')

  useEffect(() => {
    api.get<Plan[]>('/plans')
      .then((res) => {
        setPlans(res.data)
        const initial = res.data.find((p) => p.id === Number(planIdFromUrl)) ?? res.data[0] ?? null
        if (initial) {
          setSelectedPlan(initial)
          setValue('plan_id', initial.id)
        }
      })
      .finally(() => setLoadingPlans(false))
  }, [planIdFromUrl, setValue])

  useEffect(() => {
    const found = plans.find((p) => p.id === Number(watchedPlanId))
    setSelectedPlan(found ?? null)
  }, [watchedPlanId, plans])

  async function onSubmit(data: CheckoutForm) {
    setApiError(null)
    try {
      const res = await api.post<{ payment_url: string; message: string }>('/checkout', data)
      window.location.href = res.data.payment_url
    } catch (err) {
      const error = err as AxiosError<{ message?: string; errors?: Record<string, string[]>; redirect?: string }>
      const redirect = error.response?.data?.redirect
      if (redirect) {
        window.location.href = redirect
        return
      }
      const msg =
        error.response?.data?.errors
          ? Object.values(error.response.data.errors).flat()[0]
          : error.response?.data?.message ?? 'Erro ao processar. Tente novamente.'
      setApiError(msg ?? null)
    }
  }

  return (
    <main className="min-h-dvh bg-brand-soft px-4 py-12">
      <div className="w-full max-w-4xl mx-auto animate-fade-in">

        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-lg mb-4">
            <span className="text-white font-bold text-xl">JT</span>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Começar minha transformação</h1>
          <p className="text-sm text-neutral-500 mt-1">Escolha seu plano e realize o pagamento para criar sua conta</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Plans selection */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-4">Escolha o plano</h2>
            {loadingPlans ? (
              <div className="flex justify-center py-8">
                <Loader2 size={24} className="animate-spin text-neutral-300" />
              </div>
            ) : (
              plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setValue('plan_id', plan.id)}
                  className={cn(
                    'w-full text-left rounded-xl border-2 p-4 transition-all',
                    selectedPlan?.id === plan.id
                      ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                      : 'border-neutral-200 bg-white hover:border-brand-300'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-neutral-900">{plan.name}</p>
                      {plan.description && (
                        <p className="text-xs text-neutral-500 mt-0.5">{plan.description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-bold text-brand-600">{formatCurrency(plan.price)}</p>
                      <p className="text-xs text-neutral-400">{plan.duration_days} dias</p>
                    </div>
                  </div>
                  {selectedPlan?.id === plan.id && plan.features && plan.features.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-neutral-600">
                          <CheckCircle2 size={12} className="text-brand-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              ))
            )}
            {errors.plan_id && <p className="error-message">{errors.plan_id.message}</p>}
          </div>

          {/* Checkout form */}
          <div className="lg:col-span-3">
            <div className="card p-8">
              <h2 className="text-lg font-semibold text-neutral-800 mb-6">Seus dados</h2>

              {apiError && (
                <div className="mb-4 rounded-xl bg-danger-light border border-red-200 px-4 py-3 text-sm text-red-700">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label htmlFor="name" className="label">Nome completo</label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Seu nome completo"
                    className={cn('input', errors.name && 'border-danger focus:border-danger focus:ring-red-100')}
                    {...register('name')}
                  />
                  {errors.name && <p className="error-message">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="label">E-mail</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="seu@email.com"
                    className={cn('input', errors.email && 'border-danger focus:border-danger focus:ring-red-100')}
                    {...register('email')}
                  />
                  {errors.email && <p className="error-message">{errors.email.message}</p>}
                  <p className="mt-1 text-xs text-neutral-400">
                    Você receberá um e-mail para ativar sua conta após o pagamento.
                  </p>
                </div>

                <div>
                  <label htmlFor="phone" className="label">
                    WhatsApp <span className="text-neutral-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(11) 99999-9999"
                    className="input"
                    {...register('phone')}
                  />
                </div>

                {/* Resumo */}
                {selectedPlan && (
                  <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Plano selecionado</span>
                      <span className="font-semibold text-neutral-900">{selectedPlan.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-neutral-600">Duração</span>
                      <span className="text-neutral-700">{selectedPlan.duration_days} dias</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-200">
                      <span className="font-semibold text-neutral-900">Total</span>
                      <span className="text-xl font-bold text-brand-600">{formatCurrency(selectedPlan.price)}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedPlan}
                  className="btn-primary w-full mt-2"
                >
                  {isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" />Processando...</>
                  ) : (
                    <><ExternalLink size={16} />Ir para o pagamento</>
                  )}
                </button>

                <p className="text-xs text-center text-neutral-400 mt-2">
                  Pagamento seguro via InfinityPay · Sua conta é criada após a confirmação do pagamento
                </p>
              </form>
            </div>

            <p className="text-center text-sm text-neutral-500 mt-4">
              Já tem conta?{' '}
              <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-dvh flex items-center justify-center bg-brand-soft">
        <Loader2 size={24} className="animate-spin text-neutral-300" />
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
