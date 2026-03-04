'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Target,
  UtensilsCrossed,
  Camera,
  MessageSquare,
  ClipboardList,
  Dumbbell,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { href: '/aluno/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/aluno/treino',    label: 'Meu Treino',  icon: Dumbbell },
  { href: '/aluno/anamnese',  label: 'Anamnese',    icon: ClipboardList },
  { href: '/aluno/metas',     label: 'Metas',       icon: Target },
  { href: '/aluno/refeicoes', label: 'Refeições',   icon: UtensilsCrossed },
  { href: '/aluno/evolucao',  label: 'Evolução',    icon: Camera },
  { href: '/aluno/chat',      label: 'Chat',        icon: MessageSquare },
]

const SIDEBAR_W = 240

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login')
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
        <div className="spinner-accent" />
      </div>
    )
  }

  async function handleLogout() {
    await logout()
    router.replace('/login')
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', background: '#0A0A0A' }}>

      {/* Sidebar — Desktop */}
      <aside style={{
        display:       'none',
        width:         SIDEBAR_W,
        flexShrink:    0,
        flexDirection: 'column',
        background:    '#0D0D0D',
        borderRight:   '1px solid #1a1a1a',
        position:      'fixed',
        top:           0,
        left:          0,
        height:        '100%',
        zIndex:        20,
      }}
        className="lg-sidebar"
      >
        <SidebarContent navItems={navItems} pathname={pathname} user={user} onLogout={handleLogout} />
      </aside>

      {/* Sidebar — Mobile Overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 30 }}
          onClick={() => setSidebarOpen(false)}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
          <aside
            style={{
              position:    'absolute',
              left:        0,
              top:         0,
              height:      '100%',
              width:       SIDEBAR_W,
              background:  '#0D0D0D',
              borderRight: '1px solid #1a1a1a',
              zIndex:      1,
            }}
            onClick={e => e.stopPropagation()}
          >
            <SidebarContent navItems={navItems} pathname={pathname} user={user} onLogout={handleLogout} onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100dvh' }} className="main-with-sidebar">

        {/* Mobile Header */}
        <header style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '0 16px',
          height:         56,
          background:     '#0D0D0D',
          borderBottom:   '1px solid #1a1a1a',
          position:       'sticky',
          top:            0,
          zIndex:         10,
        }} className="mobile-header">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F5F0E8', display: 'flex', alignItems: 'center', padding: 8 }}
          >
            <Menu size={20} />
          </button>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#F5F0E8', letterSpacing: '0.06em' }}>
            JAPA TREINADOR
          </span>
          <div style={{ width: 36 }} />
        </header>

        <div style={{ flex: 1, padding: '24px 16px' }} className="page-content">
          {children}
        </div>
      </main>

      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar { display: flex !important; }
          .main-with-sidebar { margin-left: ${SIDEBAR_W}px; }
          .mobile-header { display: none !important; }
          .page-content { padding: 32px !important; }
        }
      `}</style>
    </div>
  )
}

interface SidebarContentProps {
  navItems: typeof navItems
  pathname: string
  user: ReturnType<typeof useAuth>['user']
  onLogout: () => void
  onClose?: () => void
}

function SidebarContent({ navItems, pathname, user, onLogout, onClose }: SidebarContentProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 16 }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px', marginBottom: 24 }}>
        <div style={{ width: 36, height: 36, background: '#5B8CF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#0A0A0A', letterSpacing: '0.05em' }}>JT</span>
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#F5F0E8', letterSpacing: '0.08em', flex: 1 }}>
          JAPA TREINADOR
        </span>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 4, display: 'flex' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
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
                background:     active ? 'rgba(91,140,245,0.06)' : 'transparent',
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

      {/* User Footer */}
      <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 16, marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, background: '#1a1a1a', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
            {user?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar_url} alt="" style={{ width: 32, height: 32, objectFit: 'cover' }} />
            ) : (
              <User size={14} style={{ color: '#666' }} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#F5F0E8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)' }}>
              {user?.name}
            </p>
            <p style={{ fontSize: 11, color: '#555', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)' }}>
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            display:     'flex',
            alignItems:  'center',
            gap:         8,
            padding:     '10px 12px',
            width:       '100%',
            background:  'none',
            border:      'none',
            cursor:      'pointer',
            color:       '#555',
            fontSize:    13,
            fontFamily:  'var(--font-sans)',
            transition:  'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#F5F0E8')}
          onMouseLeave={e => (e.currentTarget.style.color = '#555')}
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </div>
  )
}
