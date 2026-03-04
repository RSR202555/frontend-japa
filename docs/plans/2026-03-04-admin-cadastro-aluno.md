# Admin: Cadastro Manual de Aluno — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Adicionar modal de 2 passos na página de alunos do admin para criar alunos manualmente com credenciais e plano vinculado.

**Architecture:** Novo componente `NovoAlunoModal` com estado interno de steps, validação via zod + react-hook-form. A página `admin/alunos/page.tsx` recebe botão "Novo aluno" e renderiza o modal. Ao sucesso, recarrega a lista.

**Tech Stack:** Next.js 15, React 19, TypeScript, zod, react-hook-form, Lucide icons, inline styles (design system dark existente)

---

### Task 1: Criar componente `NovoAlunoModal`

**Files:**
- Create: `src/components/admin/NovoAlunoModal.tsx`

**Step 1: Criar o arquivo com estrutura base e tipos**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, X, ChevronRight, ChevronLeft, Loader2, RefreshCw, Check } from 'lucide-react'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Plan } from '@/types'

const step1Schema = z.object({
  name:     z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  phone:    z.string().optional(),
})

const step2Schema = z.object({
  plan_id:                z.coerce.number().positive('Selecione um plano').optional(),
  subscription_status:    z.enum(['active', 'pending']).default('active'),
  subscription_starts_at: z.string().min(1, 'Informe a data de início'),
})

type Step1Form = z.infer<typeof step1Schema>
type Step2Form = z.infer<typeof step2Schema>

interface Props {
  open:      boolean
  onClose:   () => void
  onSuccess: () => void
}
```

**Step 2: Implementar estado e lógica do modal**

```tsx
export default function NovoAlunoModal({ open, onClose, onSuccess }: Props) {
  const [step, setStep]             = useState<1 | 2>(1)
  const [plans, setPlans]           = useState<Plan[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError]     = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [step1Data, setStep1Data]   = useState<Step1Form | null>(null)

  const form1 = useForm<Step1Form>({ resolver: zodResolver(step1Schema) })
  const form2 = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      subscription_status:    'active',
      subscription_starts_at: new Date().toISOString().split('T')[0],
    },
  })

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
      form1.reset()
      form2.reset({
        subscription_status: 'active',
        subscription_starts_at: new Date().toISOString().split('T')[0],
      })
    }
  }, [open])

  function generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!'
    const pwd = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    form1.setValue('password', pwd, { shouldValidate: true })
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
```

**Step 3: Implementar o JSX do modal**

```tsx
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 900,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position:  'fixed',
        top:       '50%',
        left:      '50%',
        transform: 'translate(-50%, -50%)',
        zIndex:    901,
        width:     '100%',
        maxWidth:  520,
        background: '#111',
        border:    '1px solid #1e1e1e',
        padding:   '32px',
        maxHeight: '90dvh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#5B8CF5', marginBottom: 6, fontFamily: 'var(--font-sans)' }}>
              Admin
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#F5F0E8', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>
              Novo aluno
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', padding: 4, display: 'flex' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#888')}
            onMouseLeave={e => (e.currentTarget.style.color = '#444')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
          {[
            { n: 1, label: 'Dados pessoais' },
            { n: 2, label: 'Plano' },
          ].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i === 0 ? 'none' : 1 }}>
              {i > 0 && (
                <div style={{ height: 1, flex: 1, background: step >= s.n ? '#5B8CF5' : '#1e1e1e', margin: '0 8px', transition: 'background 0.2s' }} />
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
                <span style={{ fontSize: 12, color: step >= s.n ? '#F5F0E8' : '#444', fontFamily: 'var(--font-sans)', fontWeight: step === s.n ? 600 : 400 }}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <form onSubmit={form1.handleSubmit(handleStep1Submit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">Nome completo</label>
              <input type="text" placeholder="João da Silva" className={cn('input', form1.formState.errors.name && 'border-danger')} {...form1.register('name')} />
              {form1.formState.errors.name && <p className="error-message">{form1.formState.errors.name.message}</p>}
            </div>
            <div>
              <label className="label">E-mail</label>
              <input type="email" placeholder="aluno@email.com" className={cn('input', form1.formState.errors.email && 'border-danger')} {...form1.register('email')} />
              {form1.formState.errors.email && <p className="error-message">{form1.formState.errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Senha de acesso</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input type={showPassword ? 'text' : 'password'} placeholder="Mínimo 8 caracteres"
                    className={cn('input', form1.formState.errors.password && 'border-danger')}
                    style={{ paddingRight: 40 }}
                    {...form1.register('password')}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#444', cursor: 'pointer', display: 'flex', padding: 2 }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <button type="button" onClick={generatePassword}
                  title="Gerar senha automática"
                  style={{ padding: '0 12px', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'var(--font-sans)', transition: 'all 0.15s', flexShrink: 0 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#5B8CF5'; (e.currentTarget as HTMLButtonElement).style.color = '#5B8CF5' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = '#666' }}
                >
                  <RefreshCw size={13} /> Gerar
                </button>
              </div>
              {form1.formState.errors.password && <p className="error-message">{form1.formState.errors.password.message}</p>}
            </div>
            <div>
              <label className="label">WhatsApp <span style={{ color: '#444', fontWeight: 400 }}>(opcional)</span></label>
              <input type="tel" placeholder="(11) 99999-9999" className="input" {...form1.register('phone')} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="submit" style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                background: '#5B8CF5', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
                fontFamily: 'var(--font-sans)', cursor: 'pointer', letterSpacing: '0.02em',
              }}>
                Próximo <ChevronRight size={15} />
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <form onSubmit={form2.handleSubmit(handleStep2Submit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {apiError && (
              <div style={{ padding: '12px 16px', border: '1px solid #7f1d1d', background: 'rgba(127,29,29,0.15)', color: '#fca5a5', fontSize: 13, fontFamily: 'var(--font-sans)' }}>
                {apiError}
              </div>
            )}

            <div>
              <label className="label">Plano <span style={{ color: '#444', fontWeight: 400 }}>(opcional)</span></label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plans.length === 0
                  ? <p style={{ fontSize: 13, color: '#555', fontFamily: 'var(--font-sans)' }}>Nenhum plano cadastrado.</p>
                  : plans.map(plan => {
                    const selected = Number(form2.watch('plan_id')) === plan.id
                    return (
                      <button key={plan.id} type="button"
                        onClick={() => form2.setValue('plan_id', plan.id)}
                        style={{
                          textAlign: 'left', padding: '14px 16px',
                          background: selected ? 'rgba(91,140,245,0.06)' : '#0d0d0d',
                          border: `1px solid ${selected ? '#5B8CF5' : '#1e1e1e'}`,
                          cursor: 'pointer', transition: 'all 0.15s',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 18, height: 18, borderRadius: '50%',
                            border: `2px solid ${selected ? '#5B8CF5' : '#333'}`,
                            background: selected ? '#5B8CF5' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s',
                          }}>
                            {selected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                          </div>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: selected ? '#5B8CF5' : '#F5F0E8', letterSpacing: '0.04em' }}>{plan.name}</span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: selected ? '#5B8CF5' : '#888' }}>
                          R$ {(plan.price / 100).toFixed(2).replace('.', ',')}
                        </span>
                      </button>
                    )
                  })
                }
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="label">Data de início</label>
                <input type="date" className="input" {...form2.register('subscription_starts_at')} />
                {form2.formState.errors.subscription_starts_at && (
                  <p className="error-message">{form2.formState.errors.subscription_starts_at.message}</p>
                )}
              </div>
              <div>
                <label className="label">Status da assinatura</label>
                <select className="input" {...form2.register('subscription_status')}
                  style={{ appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="active">Ativa</option>
                  <option value="pending">Pendente</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <button type="button" onClick={() => setStep(1)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 20px', background: 'transparent', border: '1px solid #2a2a2a', color: '#666', fontSize: 14, fontFamily: 'var(--font-sans)', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#5B8CF5'; (e.currentTarget as HTMLButtonElement).style.color = '#F5F0E8' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLButtonElement).style.color = '#666' }}
              >
                <ChevronLeft size={15} /> Voltar
              </button>
              <button type="submit" disabled={submitting}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                  background: submitting ? '#2a2a2a' : '#5B8CF5', border: 'none',
                  color: submitting ? '#555' : '#fff', fontSize: 14, fontWeight: 700,
                  fontFamily: 'var(--font-sans)', cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? <><Loader2 size={15} style={{ animation: 'spin 0.7s linear infinite' }} />Criando...</> : <>Criar aluno <Check size={15} /></>}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
```

**Step 4: Verificar se o arquivo compila sem erros TypeScript**

```bash
cd d:/RIAN/japa/frontend-japa-main
npx tsc --noEmit 2>&1 | head -30
```

**Step 5: Commit**

```bash
git add src/components/admin/NovoAlunoModal.tsx
git commit -m "feat: add NovoAlunoModal component with 2-step form"
```

---

### Task 2: Atualizar página `admin/alunos/page.tsx`

**Files:**
- Modify: `src/app/admin/alunos/page.tsx`

**Step 1: Adicionar botão "Novo aluno" e integrar o modal**

Substituir o bloco do header e adicionar estado + modal:

```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, UserCheck, UserX, ChevronRight, UserPlus } from 'lucide-react'
import api from '@/lib/api'
import { cn, formatDate } from '@/lib/utils'
import type { User, PaginatedResponse } from '@/types'
import NovoAlunoModal from '@/components/admin/NovoAlunoModal'

export default function StudentsPage() {
  const [users, setUsers]               = useState<User[]>([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [modalOpen, setModalOpen]       = useState(false)

  // ... (manter useEffects e toggleActive existentes)

  function loadUsers(searchTerm = debouncedSearch) {
    setLoading(true)
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    api.get<{ data: User[]; meta: PaginatedResponse<User>['meta'] }>(`/admin/users?${params}`)
      .then((res) => setUsers(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }
```

No JSX, substituir o header:

```tsx
{/* Header com botão Novo aluno */}
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,32px)', color: '#F5F0E8', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>
      Alunos
    </h1>
    <p style={{ fontSize: 13, color: '#555', marginTop: 4, fontFamily: 'var(--font-sans)' }}>
      {users.length} aluno{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}
    </p>
  </div>
  <button
    onClick={() => setModalOpen(true)}
    style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
      background: '#5B8CF5', border: 'none', color: '#fff', fontSize: 13,
      fontWeight: 700, fontFamily: 'var(--font-sans)', cursor: 'pointer',
      letterSpacing: '0.03em', transition: 'background 0.2s',
    }}
    onMouseEnter={e => (e.currentTarget.style.background = '#4A7CF3')}
    onMouseLeave={e => (e.currentTarget.style.background = '#5B8CF5')}
  >
    <UserPlus size={15} /> Novo aluno
  </button>
</div>

{/* Modal */}
<NovoAlunoModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  onSuccess={() => loadUsers('')}
/>
```

**Step 2: Reescrever a página completa no padrão dark**

A tabela ainda usa classes antigas (`bg-neutral-50`, `text-neutral-600`). Reescrever no mesmo padrão do admin/dashboard.

Substituir toda a tabela por implementação com `style` inline igual ao dashboard:
- Header da tabela: `background: '#0d0d0d'`, labels uppercase `#444`
- Linhas: hover `#141414`
- Badges inline com `badgeStyle()` igual ao dashboard

**Step 3: Commit**

```bash
git add src/app/admin/alunos/page.tsx
git commit -m "feat: integrate NovoAlunoModal and update alunos page dark theme"
```

---

### Task 3: Push final

**Step 1: Verificar build**

```bash
cd d:/RIAN/japa/frontend-japa-main
npx tsc --noEmit 2>&1
```

**Step 2: Push**

```bash
git push
```
