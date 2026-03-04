'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { register as authRegister } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import type { AxiosError } from 'axios'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/

const registerSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
    email: z.string().email('E-mail inválido'),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .max(128)
      .regex(passwordRegex, 'Deve conter maiúscula, minúscula, número e símbolo'),
    password_confirmation: z.string().min(1, 'Confirme sua senha'),
    phone: z.string().max(20).optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'As senhas não coincidem',
    path: ['password_confirmation'],
  })

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { login: authLogin } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterForm) {
    setApiError(null)
    try {
      const result = await authRegister(data)
      authLogin(result.token, result.user)
      router.replace('/aluno/dashboard')
    } catch (err) {
      const error = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>
      const firstError = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : null
      setApiError(firstError ?? error.response?.data?.message ?? 'Erro ao criar conta.')
    }
  }

  return (
    <main style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display:        'inline-flex',
            alignItems:     'center',
            justifyContent: 'center',
            width:          52,
            height:         52,
            background:     '#5B8CF5',
            marginBottom:   16,
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', letterSpacing: '0.05em' }}>JT</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#F5F0E8', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0 }}>
            Criar conta
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#666', marginTop: 6 }}>Comece sua transformação hoje</p>
        </div>

        {/* Card */}
        <div style={{ background: '#141414', border: '1px solid #222', padding: '36px 32px' }}>

          {apiError && (
            <div style={{ marginBottom: 20, padding: '12px 16px', border: '1px solid #7f1d1d', background: 'rgba(127,29,29,0.15)', color: '#fca5a5', fontSize: 13, fontFamily: 'var(--font-sans)' }}>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="name" className="label">Nome completo</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
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
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Telefone{' '}
                <span style={{ color: '#555', fontWeight: 400 }}>(opcional)</span>
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

            <div>
              <label htmlFor="password" className="label">Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  className={cn('input', errors.password && 'border-danger')}
                  style={{ paddingRight: 40 }}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="label">Confirmar senha</label>
              <input
                id="password_confirmation"
                type="password"
                autoComplete="new-password"
                placeholder="Repita sua senha"
                className={cn('input', errors.password_confirmation && 'border-danger')}
                {...register('password_confirmation')}
              />
              {errors.password_confirmation && (
                <p className="error-message">{errors.password_confirmation.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#666', marginTop: 24, fontFamily: 'var(--font-sans)' }}>
            Já tem conta?{' '}
            <Link href="/login" style={{ color: '#5B8CF5', textDecoration: 'none', fontWeight: 500 }}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
