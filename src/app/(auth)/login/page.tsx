'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { login } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import type { AxiosError } from 'axios'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'E-mail obrigatório'),
  password: z.string().min(1, 'Senha obrigatória').max(128),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login: authLogin } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    setApiError(null)
    try {
      const result = await login(data)
      authLogin(result.token, result.user)

      // Redirecionar baseado na role
      const roles = result.user?.roles ?? []
      if (roles.includes('admin')) {
        router.replace('/admin/dashboard')
      } else {
        router.replace('/aluno/dashboard')
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>
      const msg =
        error.response?.data?.errors?.email?.[0] ??
        error.response?.data?.message ??
        'Erro ao fazer login. Tente novamente.'
      setApiError(msg)
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-brand-soft px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-lg mb-4">
            <span className="text-white font-bold text-xl">JT</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Japa Treinador</h1>
          <p className="text-sm text-neutral-500 mt-1">Consultoria Online Fitness</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-6">Entrar na plataforma</h2>

          {apiError && (
            <div className="mb-4 rounded-xl bg-danger-light border border-red-200 px-4 py-3 text-sm text-red-700">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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
            </div>

            <div>
              <label htmlFor="password" className="label">Senha</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  className={cn('input pr-10', errors.password && 'border-danger focus:border-danger focus:ring-red-100')}
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Não tem conta?{' '}
            <Link href="/checkout" className="text-brand-600 hover:text-brand-700 font-medium">
              Assinar um plano
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
