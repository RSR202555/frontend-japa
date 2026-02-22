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
    <main className="min-h-dvh flex items-center justify-center bg-brand-soft px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-lg mb-4">
            <span className="text-white font-bold text-xl">JT</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Criar conta</h1>
          <p className="text-sm text-neutral-500 mt-1">Comece sua transformação hoje</p>
        </div>

        <div className="card p-8">
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
                Telefone <span className="text-neutral-400 font-normal">(opcional)</span>
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  className={cn('input pr-10', errors.password && 'border-danger')}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
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

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
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

          <p className="text-center text-sm text-neutral-500 mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
