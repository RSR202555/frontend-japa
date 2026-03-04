'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, ExternalLink, Loader2, Lock, Shield } from 'lucide-react'
import api from '@/lib/api'
import { formatCurrency, cn } from '@/lib/utils'
import type { Plan } from '@/types'
import type { AxiosError } from 'axios'

const checkoutSchema = z.object({
  name:    z.string().min(3, 'Nome deve ter ao menos 3 caracteres').max(255),
  email:   z.string().email('E-mail inválido'),
  phone:   z.string().optional(),
  plan_id: z.coerce.number().positive('Selecione um plano'),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

function CheckoutContent() {
  const searchParams = useSearchParams()
  const [plans, setPlans]             = useState<Plan[]>([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [apiError, setApiError]        = useState<string | null>(null)

  const planIdFromUrl = searchParams.get('plan')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { plan_id: planIdFromUrl ? Number(planIdFromUrl) : undefined },
  })

  const watchedPlanId = watch('plan_id')

  useEffect(() => {
    api.get<Plan[]>('/plans')
      .then((res) => {
        setPlans(res.data)
        const initial = res.data.find((p) => p.id === Number(planIdFromUrl)) ?? res.data[0] ?? null
        if (initial) { setSelectedPlan(initial); setValue('plan_id', initial.id) }
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
      if (redirect) { window.location.href = redirect; return }
      const msg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()[0]
        : error.response?.data?.message ?? 'Erro ao processar. Tente novamente.'
      setApiError(msg ?? null)
    }
  }

  return (
    <main style={{ minHeight: '100dvh', background: '#0A0A0A', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 960, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, background: '#5B8CF5', textDecoration: 'none', marginBottom: 20 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', letterSpacing: '0.05em' }}>JT</span>
          </Link>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#5B8CF5', marginBottom: 10 }}>
            Checkout
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,42px)', color: '#F5F0E8', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>
            Começar minha transformação
          </h1>
          <p style={{ fontSize: 14, color: '#555', marginTop: 10, fontFamily: 'var(--font-sans)' }}>
            Escolha seu plano e realize o pagamento para criar sua conta
          </p>
        </div>

        {/* ── Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24, alignItems: 'start' }}>

          {/* ── Coluna esquerda: planos ── */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555', marginBottom: 16, fontFamily: 'var(--font-sans)' }}>
              Escolha o plano
            </div>

            {loadingPlans ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <Loader2 size={22} style={{ color: '#5B8CF5', animation: 'spin 0.7s linear infinite' }} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plans.map((plan) => {
                  const active = selectedPlan?.id === plan.id
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setValue('plan_id', plan.id)}
                      style={{
                        width:       '100%',
                        textAlign:   'left',
                        background:  active ? 'rgba(91,140,245,0.06)' : '#111',
                        border:      active ? '1px solid #5B8CF5' : '1px solid #1e1e1e',
                        padding:     '18px 20px',
                        cursor:      'pointer',
                        transition:  'all 0.15s',
                        outline:     'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        {/* Radio indicator */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                          <div style={{
                            width:        20,
                            height:       20,
                            borderRadius: '50%',
                            border:       active ? '2px solid #5B8CF5' : '2px solid #333',
                            background:   active ? '#5B8CF5' : 'transparent',
                            display:      'flex',
                            alignItems:   'center',
                            justifyContent: 'center',
                            flexShrink:   0,
                            transition:   'all 0.15s',
                          }}>
                            {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: active ? '#5B8CF5' : '#F5F0E8', letterSpacing: '0.04em', lineHeight: 1 }}>
                              {plan.name}
                            </div>
                            {plan.description && (
                              <div style={{ fontSize: 12, color: '#555', marginTop: 3, fontFamily: 'var(--font-sans)' }}>
                                {plan.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: active ? '#5B8CF5' : '#F5F0E8', letterSpacing: '0.02em' }}>
                            {formatCurrency(plan.price)}
                          </div>
                          <div style={{ fontSize: 11, color: '#444', fontFamily: 'var(--font-sans)' }}>
                            {plan.duration_days} dias
                          </div>
                        </div>
                      </div>

                      {/* Features expandidas quando ativo */}
                      {active && plan.features && plan.features.length > 0 && (
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(91,140,245,0.15)' }}>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {plan.features.map((f, i) => (
                              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#999', fontFamily: 'var(--font-sans)' }}>
                                <Check size={13} style={{ color: '#5B8CF5', flexShrink: 0 }} />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {errors.plan_id && (
              <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6, fontFamily: 'var(--font-sans)' }}>{errors.plan_id.message}</p>
            )}

            {/* Trust signals */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: Lock,   text: 'Pagamento 100% seguro via InfinityPay' },
                { icon: Shield, text: 'Cancele quando quiser, sem multa' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#444', fontFamily: 'var(--font-sans)' }}>
                  <Icon size={13} style={{ color: '#5B8CF5', flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Coluna direita: formulário ── */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: '36px 32px' }}>

            {/* Section label */}
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555', marginBottom: 24, fontFamily: 'var(--font-sans)' }}>
              Seus dados
            </div>

            {apiError && (
              <div style={{ marginBottom: 20, padding: '12px 16px', border: '1px solid #7f1d1d', background: 'rgba(127,29,29,0.15)', color: '#fca5a5', fontSize: 13, fontFamily: 'var(--font-sans)' }}>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              <div>
                <label htmlFor="name" className="label">Nome completo</label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  className={cn('input', errors.name && 'border-danger')}
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
                  className={cn('input', errors.email && 'border-danger')}
                  {...register('email')}
                />
                {errors.email && <p className="error-message">{errors.email.message}</p>}
                <p style={{ fontSize: 11, color: '#444', marginTop: 5, fontFamily: 'var(--font-sans)' }}>
                  Você receberá um e-mail para ativar sua conta após o pagamento.
                </p>
              </div>

              <div>
                <label htmlFor="phone" className="label">
                  WhatsApp{' '}
                  <span style={{ color: '#444', fontWeight: 400 }}>(opcional)</span>
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

              {/* Resumo do pedido */}
              {selectedPlan && (
                <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', padding: '20px 20px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#444', marginBottom: 14, fontFamily: 'var(--font-sans)' }}>
                    Resumo do pedido
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontFamily: 'var(--font-sans)' }}>
                      <span style={{ color: '#666' }}>Plano</span>
                      <span style={{ color: '#F5F0E8', fontWeight: 500 }}>{selectedPlan.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontFamily: 'var(--font-sans)' }}>
                      <span style={{ color: '#666' }}>Duração</span>
                      <span style={{ color: '#F5F0E8' }}>{selectedPlan.duration_days} dias</span>
                    </div>
                    <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 12, marginTop: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>Total</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#5B8CF5', letterSpacing: '0.02em', lineHeight: 1 }}>
                        {formatCurrency(selectedPlan.price)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedPlan}
                style={{
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  gap:             10,
                  padding:         '15px 20px',
                  background:      isSubmitting || !selectedPlan ? '#2a2a2a' : '#5B8CF5',
                  border:          'none',
                  color:           isSubmitting || !selectedPlan ? '#555' : '#fff',
                  fontSize:        15,
                  fontWeight:      700,
                  fontFamily:      'var(--font-sans)',
                  cursor:          isSubmitting || !selectedPlan ? 'not-allowed' : 'pointer',
                  transition:      'background 0.2s',
                  letterSpacing:   '0.02em',
                  marginTop:       4,
                }}
              >
                {isSubmitting ? (
                  <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} />Processando...</>
                ) : (
                  <><ExternalLink size={16} />Ir para o pagamento</>
                )}
              </button>

              <p style={{ textAlign: 'center', fontSize: 11, color: '#333', fontFamily: 'var(--font-sans)', letterSpacing: '0.02em' }}>
                Pagamento seguro via InfinityPay · Conta criada após confirmação
              </p>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#444', marginTop: 20, fontFamily: 'var(--font-sans)' }}>
              Já tem conta?{' '}
              <Link href="/login" style={{ color: '#5B8CF5', textDecoration: 'none', fontWeight: 500 }}>
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
      <main style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
        <div className="spinner-accent" style={{ width: 24, height: 24 }} />
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
