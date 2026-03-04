'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { login } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import type { AxiosError } from 'axios'

const loginSchema = z.object({
  email:    z.string().email('E-mail inválido').min(1, 'E-mail obrigatório'),
  password: z.string().min(1, 'Senha obrigatória').max(128),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login: authLogin } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError]         = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginForm) {
    setApiError(null)
    try {
      const result = await login(data)
      authLogin(result.token, result.user)
      const roles = result.user?.roles ?? []
      router.replace(roles.includes('admin') ? '/admin/dashboard' : '/aluno/dashboard')
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
    <main style={{
      minHeight:  '100dvh',
      display:    'flex',
      background: '#0A0A0A',
      position:   'relative',
      overflow:   'hidden',
    }}>

      {/* Background glow */}
      <div style={{
        position:      'absolute',
        top:           '30%',
        left:          '50%',
        transform:     'translate(-50%, -50%)',
        width:         700,
        height:        600,
        background:    'radial-gradient(ellipse at center, rgba(91,140,245,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* ── Left panel — branding ── */}
      <div
        className="login-left-panel"
        style={{
          flex:           '0 0 44%',
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'space-between',
          padding:        '48px 56px',
          borderRight:    '1px solid #141414',
          position:       'relative',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{ width: 38, height: 38, background: '#5B8CF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#fff', letterSpacing: '0.05em' }}>JT</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: '#F5F0E8', letterSpacing: '0.08em' }}>JAPA TREINADOR</span>
        </Link>

        {/* Center copy */}
        <div>
          <div style={{
            fontFamily:    'var(--font-display)',
            fontSize:      'clamp(36px, 3.5vw, 54px)',
            color:         '#F5F0E8',
            lineHeight:    0.95,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            marginBottom:  24,
          }}>
            Sua jornada<br />
            <span style={{ color: '#5B8CF5' }}>começa aqui.</span>
          </div>
          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.75, maxWidth: 320, fontFamily: 'var(--font-sans)' }}>
            Acesse sua conta e continue evoluindo com treino, dieta e suporte personalizado.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
            {[
              { value: '+500', label: 'Alunos ativos' },
              { value: '98%',  label: 'Satisfação' },
              { value: '24h',  label: 'Suporte' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: '#F5F0E8', letterSpacing: '0.04em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4, fontFamily: 'var(--font-sans)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ fontSize: 11, color: '#222', fontFamily: 'var(--font-sans)', letterSpacing: '0.04em' }}>
          © {new Date().getFullYear()} Japa Treinador · Consultoria Online Fitness
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{
        flex:           1,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '48px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Mobile logo (hidden on desktop via CSS) */}
          <div className="login-mobile-header" style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, background: '#5B8CF5', marginBottom: 14 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', letterSpacing: '0.05em' }}>JT</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#F5F0E8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Japa Treinador
            </div>
          </div>

          {/* Form header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{
              fontFamily:    'var(--font-display)',
              fontSize:      34,
              color:         '#F5F0E8',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              margin:        0,
              lineHeight:    1,
            }}>
              Entrar
            </h1>
            <p style={{ fontSize: 13, color: '#555', marginTop: 8, fontFamily: 'var(--font-sans)' }}>
              Bem-vindo de volta. Insira suas credenciais.
            </p>
          </div>

          {/* Error */}
          {apiError && (
            <div style={{ marginBottom: 20, padding: '12px 16px', border: '1px solid #7f1d1d', background: 'rgba(127,29,29,0.15)', color: '#fca5a5', fontSize: 13, fontFamily: 'var(--font-sans)' }}>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

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
              <label htmlFor="password" className="label">Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  className={cn('input', errors.password && 'border-danger')}
                  style={{ paddingRight: 44 }}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#444', display: 'flex', alignItems: 'center', padding: 4, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#888')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#444')}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            10,
                padding:        '14px 20px',
                marginTop:      6,
                background:     '#5B8CF5',
                border:         'none',
                color:          '#fff',
                fontSize:       15,
                fontWeight:     700,
                fontFamily:     'var(--font-sans)',
                cursor:         isSubmitting ? 'not-allowed' : 'pointer',
                transition:     'background 0.2s, transform 0.15s',
                letterSpacing:  '0.02em',
                width:          '100%',
                opacity:        isSubmitting ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!isSubmitting) { (e.currentTarget as HTMLButtonElement).style.background = '#4A7CF3'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.01)' }}}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#5B8CF5'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
            >
              {isSubmitting
                ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} />Entrando...</>
                : <>Entrar <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #141414', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#444', fontFamily: 'var(--font-sans)' }}>
              Não tem conta?{' '}
              <Link href="/checkout" style={{ color: '#5B8CF5', textDecoration: 'none', fontWeight: 600 }}>
                Assinar um plano
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-left-panel    { display: none !important; }
          .login-mobile-header { display: block !important; }
        }
        @media (min-width: 769px) {
          .login-mobile-header { display: none !important; }
        }
      `}</style>
    </main>
  )
}
