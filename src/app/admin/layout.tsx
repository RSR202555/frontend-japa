'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  LogOut,
  ClipboardList,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const adminNav = [
  { href: '/admin/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/alunos',     label: 'Alunos',      icon: Users },
  { href: '/admin/protocolos', label: 'Protocolos',  icon: ClipboardList },
  { href: '/admin/planos',     label: 'Planos',      icon: CreditCard },
  { href: '/admin/chat',       label: 'Mensagens',   icon: MessageSquare },
]

const SIDEBAR_W = 240

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isAdmin, user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Limpa o cookie de sessão para evitar loop com o middleware
        document.cookie = 'session_active=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        router.replace('/login')
      } else if (!isAdmin) {
        router.replace('/aluno/dashboard')
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

  if (isLoading) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
        <div className="spinner-accent" />
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) return null

  async function handleLogout() {
    await logout()
    router.replace('/login')
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', background: '#0A0A0A' }}>

      {/* Sidebar */}
      <aside style={{
        width:       SIDEBAR_W,
        flexShrink:  0,
        background:  '#0D0D0D',
        borderRight: '1px solid #1a1a1a',
        position:    'fixed',
        top:         0,
        left:        0,
        height:      '100%',
        zIndex:      20,
        display:     'flex',
        flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#5B8CF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#0A0A0A', letterSpacing: '0.05em' }}>JT</span>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#F5F0E8', letterSpacing: '0.08em', margin: 0 }}>JAPA TREINADOR</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: '#5B8CF5', margin: 0, marginTop: 2 }}>Administrador</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {adminNav.map((item) => {
            const Icon = item.icon
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  gap:            10,
                  padding:        '10px 12px',
                  textDecoration: 'none',
                  fontSize:       13,
                  fontFamily:     'var(--font-sans)',
                  fontWeight:     active ? 600 : 400,
                  color:          active ? '#5B8CF5' : '#888',
                  background:     active ? 'rgba(212,255,0,0.06)' : 'transparent',
                  borderLeft:     active ? '2px solid #5B8CF5' : '2px solid transparent',
                  transition:     'all 0.15s',
                }}
              >
                <Icon size={16} style={{ color: active ? '#5B8CF5' : '#555', flexShrink: 0 }} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 12px', borderTop: '1px solid #1a1a1a' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#555', padding: '4px 12px', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name}
          </p>
          <button
            onClick={handleLogout}
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        8,
              padding:    '10px 12px',
              width:      '100%',
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              color:      '#555',
              fontSize:   13,
              fontFamily: 'var(--font-sans)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F5F0E8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#555')}
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: SIDEBAR_W, padding: 32 }}>
        {children}
      </main>
    </div>
  )
}
