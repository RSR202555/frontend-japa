'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Eye, EyeOff, X, ChevronRight, ChevronLeft,
  Loader2, RefreshCw, Check,
} from 'lucide-react'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Plan } from '@/types'

// ── Schemas ──────────────────────────────────────────────────
const step1Schema = z.object({
  name:     z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  phone:    z.string().optional(),
})

const step2Schema = z.object({
  plan_id:                z.coerce.number().optional(),
  subscription_status:    z.enum(['active', 'pending']).default('active'),
  subscription_starts_at: z.string().min(1, 'Informe a data'),
})

type Step1Form = z.infer<typeof step1Schema>
type Step2Form = z.infer<typeof step2Schema>

interface Props {
  open:      boolean
  onClose:   () => void
  onSuccess: () => void
}

// ── Component ─────────────────────────────────────────────────
export default function NovoAlunoModal({ open, onClose, onSuccess }: Props) {
  const [step, setStep]               = useState<1 | 2>(1)
  const [plans, setPlans]             = useState<Plan[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError]       = useState<string | null>(null)
  const [submitting, setSubmitting]   = useState(false)
  const [step1Data, setStep1Data]     = useState<Step1Form | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const form1 = useForm<Step1Form>({ resolver: zodResolver(step1Schema) })
  const form2 = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
    defaultValues: { subscription_status: 'active', subscription_starts_at: today },
  })

  const watchedPlanId = form2.watch('plan_id')

  // Carregar planos ao abrir
  useEffect(() => {
    if (open) {
      api.get<Plan[]>('/plans').then(res => setPlans(res.data)).catch(console.error)
    }
  }, [open])

  // Resetar ao fechar
  useEffect(() => {
    if (!open) {
      setStep(1)
      setApiError(null)
      setStep1Data(null)
      setShowPassword(false)
      form1.reset()
      form2.reset({ subscription_status: 'active', subscription_starts_at: today })
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  function generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!'
    const pwd = Array.from({ length: 12 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('')
    form1.setValue('password', pwd, { shouldValidate: true })
    setShowPassword(true)
  }

  function handleStep1Submit(data: Step1Form) {
    setStep1Data(data)
    setStep(2)
  }

  async function handleStep2Submit(data: Step2Form) {
    if (!step1Data) return
    setSubmitting(true)
    setApiError(null)
    try {
      await api.post('/admin/users', {
        ...step1Data,
        plan_id:                data.plan_id || null,
        subscription_status:    data.subscription_status,
        subscription_starts_at: data.subscription_starts_at,
      })
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
      const msg = e.response?.data?.errors
        ? Object.values(e.response.data.errors).flat()[0]
        : e.response?.data?.message ?? 'Erro ao criar aluno.'
      setApiError(msg ?? 'Erro ao criar aluno.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position:       'fixed',
          inset:          0,
          zIndex:         900,
          background:     'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position:   'fixed',
        top:        '50%',
        left:       '50%',
        transform:  'translate(-50%, -50%)',
        zIndex:     901,
        width:      '100%',
        maxWidth:   520,
        background: '#111',
        border:     '1px solid #1e1e1e',
        padding:    '32px',
        maxHeight:  '92dvh',
        overflowY:  'auto',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#5B8CF5', marginBottom: 6, fontFamily: 'var(--font-sans)' }}>
              Administrador
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#F5F0E8', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>
              Novo aluno
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', padding: 4, display: 'flex', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#888')}
            onMouseLeave={e => (e.currentTarget.style.color = '#444')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
          {([
            { n: 1 as const, label: 'Dados pessoais' },
            { n: 2 as const, label: 'Plano' },
          ]).map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i === 0 ? 'none' : 1 }}>
              {i > 0 && (
                <div style={{ height: 1, flex: 1, background: step >= s.n ? '#5B8CF5' : '#1e1e1e', margin: '0 10px', transition: 'background 0.3s' }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: step >= s.n ? '#5B8CF5' : '#1a1a1a',
                  border: `1px solid ${step >= s.n ? '#5B8CF5' : '#2a2a2a'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {step > s.n
                    ? <Check size={13} style={{ color: '#fff' }} />
                    : <span style={{ fontSize: 11, fontWeight: 700, color: step === s.n ? '#fff' : '#444', fontFamily: 'var(--font-sans)' }}>{s.n}</span>
                  }
                </div>
                <span style={{ fontSize: 12, color: step >= s.n ? '#F5F0E8' : '#444', fontFamily: 'var(--font-sans)', fontWeight: step === s.n ? 600 : 400 }}>
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── STEP 1: Dados pessoais ── */}
        {step === 1 && (
          <form onSubmit={form1.handleSubmit(handleStep1Submit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">Nome completo</label>
              <input
                type="text"
                placeholder="João da Silva"
                className={cn('input', form1.formState.errors.name && 'border-danger')}
                {...form1.register('name')}
              />
              {form1.formState.errors.name && <p className="error-message">{form1.formState.errors.name.message}</p>}
            </div>

            <div>
              <label className="label">E-mail</label>
              <input
                type="email"
                placeholder="aluno@email.com"
                className={cn('input', form1.formState.errors.email && 'border-danger')}
                {...form1.register('email')}
              />
              {form1.formState.errors.email && <p className="error-message">{form1.formState.errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Senha de acesso</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    className={cn('input', form1.formState.errors.password && 'border-danger')}
                    style={{ paddingRight: 40 }}
                    {...form1.register('password')}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#444', cursor: 'pointer', display: 'flex', padding: 2 }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={generatePassword}
                  title="Gerar senha automática"
                  style={{ padding: '0 14px', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'var(--font-sans)', transition: 'all 0.15s', flexShrink: 0, whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#5B8CF5'; (e.currentTarget as HTMLButtonElement).style.color = '#5B8CF5' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = '#666' }}
                >
                  <RefreshCw size={13} /> Gerar
                </button>
              </div>
              {form1.formState.errors.password && <p className="error-message">{form1.formState.errors.password.message}</p>}
              <p style={{ fontSize: 11, color: '#444', marginTop: 5, fontFamily: 'var(--font-sans)' }}>
                O aluno usará esse e-mail e senha para acessar a plataforma.
              </p>
            </div>

            <div>
              <label className="label">
                WhatsApp <span style={{ color: '#444', fontWeight: 400 }}>(opcional)</span>
              </label>
              <input type="tel" placeholder="(11) 99999-9999" className="input" {...form1.register('phone')} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4, paddingTop: 16, borderTop: '1px solid #1a1a1a' }}>
              <button
                type="submit"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#5B8CF5', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-sans)', cursor: 'pointer', letterSpacing: '0.02em', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#4A7CF3')}
                onMouseLeave={e => (e.currentTarget.style.background = '#5B8CF5')}
              >
                Próximo <ChevronRight size={15} />
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 2: Plano ── */}
        {step === 2 && (
          <form onSubmit={form2.handleSubmit(handleStep2Submit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {apiError && (
              <div style={{ padding: '12px 16px', border: '1px solid #7f1d1d', background: 'rgba(127,29,29,0.15)', color: '#fca5a5', fontSize: 13, fontFamily: 'var(--font-sans)' }}>
                {apiError}
              </div>
            )}

            {/* Resumo do aluno */}
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', padding: '14px 16px', marginBottom: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#444', marginBottom: 8, fontFamily: 'var(--font-sans)' }}>Aluno</div>
              <div style={{ fontSize: 14, color: '#F5F0E8', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{step1Data?.name}</div>
              <div style={{ fontSize: 12, color: '#555', fontFamily: 'var(--font-sans)', marginTop: 2 }}>{step1Data?.email}</div>
            </div>

            {/* Seleção de plano */}
            <div>
              <label className="label">
                Plano <span style={{ color: '#444', fontWeight: 400 }}>(opcional)</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plans.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#555', fontFamily: 'var(--font-sans)' }}>Nenhum plano cadastrado.</p>
                ) : (
                  plans.map(plan => {
                    const selected = Number(watchedPlanId) === plan.id
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => form2.setValue('plan_id', plan.id)}
                        style={{
                          textAlign:   'left',
                          padding:     '14px 16px',
                          background:  selected ? 'rgba(91,140,245,0.06)' : '#0d0d0d',
                          border:      `1px solid ${selected ? '#5B8CF5' : '#1e1e1e'}`,
                          cursor:      'pointer',
                          transition:  'all 0.15s',
                          display:     'flex',
                          alignItems:  'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 18, height: 18, borderRadius: '50%',
                            border: `2px solid ${selected ? '#5B8CF5' : '#333'}`,
                            background: selected ? '#5B8CF5' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, transition: 'all 0.15s',
                          }}>
                            {selected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                          </div>
                          <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: selected ? '#5B8CF5' : '#F5F0E8', letterSpacing: '0.04em', lineHeight: 1 }}>
                              {plan.name}
                            </div>
                            <div style={{ fontSize: 11, color: '#555', fontFamily: 'var(--font-sans)', marginTop: 2 }}>
                              {plan.duration_days} dias
                            </div>
                          </div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: selected ? '#5B8CF5' : '#888', letterSpacing: '0.02em' }}>
                          R$ {(plan.price / 100).toFixed(2).replace('.', ',')}
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Data e status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="label">Data de início</label>
                <input type="date" className="input" {...form2.register('subscription_starts_at')} />
                {form2.formState.errors.subscription_starts_at && (
                  <p className="error-message">{form2.formState.errors.subscription_starts_at.message}</p>
                )}
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" {...form2.register('subscription_status')} style={{ cursor: 'pointer' }}>
                  <option value="active">Ativa</option>
                  <option value="pending">Pendente</option>
                </select>
              </div>
            </div>

            {/* Ações */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 16, borderTop: '1px solid #1a1a1a' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 20px', background: 'transparent', border: '1px solid #2a2a2a', color: '#666', fontSize: 14, fontFamily: 'var(--font-sans)', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#5B8CF5'; (e.currentTarget as HTMLButtonElement).style.color = '#F5F0E8' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = '#666' }}
              >
                <ChevronLeft size={15} /> Voltar
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                  background: submitting ? '#2a2a2a' : '#5B8CF5', border: 'none',
                  color: submitting ? '#555' : '#fff', fontSize: 14, fontWeight: 700,
                  fontFamily: 'var(--font-sans)', cursor: submitting ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.02em', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = '#4A7CF3' }}
                onMouseLeave={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = '#5B8CF5' }}
              >
                {submitting
                  ? <><Loader2 size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> Criando...</>
                  : <><Check size={15} /> Criar aluno</>
                }
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
