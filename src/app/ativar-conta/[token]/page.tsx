'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import type { AxiosError } from 'axios'
import type { AuthResponse } from '@/types'

const activateSchema = z.object({
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres').max(128),
  password_confirmation: z.string().min(1, 'Confirmação de senha obrigatória'),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'As senhas não coincidem',
  path: ['password_confirmation'],
})

type ActivateForm = z.infer<typeof activateSchema>

export default function ActivateAccountPage() {
  const params = useParams()
  const router = useRouter()
  const { login: authLogin } = useAuth()
  const token = params.token as string

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ActivateForm>({
    resolver: zodResolver(activateSchema),
  })

  async function onSubmit(data: ActivateForm) {
    setApiError(null)
    try {
      const res = await api.post<AuthResponse>('/auth/activate-account', {
        token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      })

      // Autenticar automaticamente após ativação
      authLogin(res.data.token, res.data.user)
      setSuccess(true)

      // Redirecionar para o dashboard após 2s
      setTimeout(() => {
        router.replace('/aluno/dashboard')
      }, 2000)
    } catch (err) {
      const error = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>
      const msg =
        error.response?.data?.errors
          ? Object.values(error.response.data.errors).flat()[0]
          : error.response?.data?.message ?? 'Erro ao ativar conta. Tente novamente.'
      setApiError(msg ?? null)
    }
  }

  if (success) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-brand-soft px-4 py-12">
        <div className="w-full max-w-md text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Conta ativada!</h1>
          <p className="text-neutral-500 text-sm">Bem-vindo(a) ao Japa Treinador. Redirecionando para seu dashboard...</p>
          <div className="mt-6 flex justify-center">
            <Loader2 size={20} className="animate-spin text-brand-500" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-brand-soft px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-lg mb-4">
            <span className="text-white font-bold text-xl">JT</span>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Ativar minha conta</h1>
          <p className="text-sm text-neutral-500 mt-1">Defina sua senha para começar</p>
        </div>

        <div className="card p-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">Crie sua senha</h2>
          <p className="text-sm text-neutral-500 mb-6">
            Seu pagamento foi confirmado! Agora crie uma senha segura para acessar a plataforma.
          </p>

          {apiError && (
            <div className="mb-4 rounded-xl bg-danger-light border border-red-200 px-4 py-3 text-sm text-red-700">
              {apiError}
              {apiError.toLowerCase().includes('expirado') && (
                <p className="mt-1">
                  <Link href="/checkout" className="underline font-medium">
                    Iniciar novo checkout
                  </Link>
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label htmlFor="password" className="label">Senha</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
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

            <div>
              <label htmlFor="password_confirmation" className="label">Confirmar senha</label>
              <div className="relative">
                <input
                  id="password_confirmation"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repita a senha"
                  className={cn('input pr-10', errors.password_confirmation && 'border-danger focus:border-danger focus:ring-red-100')}
                  {...register('password_confirmation')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="error-message">{errors.password_confirmation.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full mt-2"
            >
              {isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" />Ativando conta...</>
              ) : (
                'Ativar conta e entrar'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-neutral-500 mt-4">
          Já tem conta?{' '}
          <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
