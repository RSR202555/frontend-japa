'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Target,
  UtensilsCrossed,
  Camera,
  MessageSquare,
  ClipboardList,
  LogOut,
  User,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/aluno/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/aluno/anamnese', label: 'Anamnese', icon: ClipboardList },
  { href: '/aluno/metas', label: 'Metas', icon: Target },
  { href: '/aluno/refeicoes', label: 'Refeições', icon: UtensilsCrossed },
  { href: '/aluno/evolucao', label: 'Evolução', icon: Camera },
  { href: '/aluno/chat', label: 'Chat', icon: MessageSquare },
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-neutral-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  async function handleLogout() {
    await logout()
    router.replace('/login')
  }

  return (
    <div className="min-h-dvh flex bg-neutral-50">
      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex lg:w-64 flex-col bg-white border-r border-neutral-200 fixed h-full z-20">
        <SidebarContent
          navItems={navItems}
          pathname={pathname}
          user={user}
          onLogout={handleLogout}
        />
      </aside>

      {/* Sidebar — Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-neutral-900/50" />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <SidebarContent
              navItems={navItems}
              pathname={pathname}
              user={user}
              onLogout={handleLogout}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-dvh">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold text-neutral-900">Japa Treinador</span>
          <div className="w-9" />
        </header>

        <div className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
          {children}
        </div>
      </main>
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
    <div className="flex flex-col h-full p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 py-3 mb-6">
        <div className="h-9 w-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow">
          <span className="text-white font-bold text-sm">JT</span>
        </div>
        <span className="font-semibold text-neutral-900">Japa Treinador</span>
        {onClose && (
          <button onClick={onClose} className="ml-auto p-1 rounded hover:bg-neutral-100 text-neutral-400">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              )}
            >
              <Icon size={18} className={cn(active ? 'text-brand-500' : 'text-neutral-400')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-neutral-100 pt-4 mt-4">
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
            {user?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <User size={16} className="text-brand-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">{user?.name}</p>
            <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="btn-ghost w-full justify-start gap-3 text-neutral-500"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </div>
  )
}
