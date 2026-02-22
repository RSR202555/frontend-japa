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
  Settings,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const adminNav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/alunos', label: 'Alunos', icon: Users },
  { href: '/admin/planos', label: 'Planos', icon: CreditCard },
  { href: '/admin/chat', label: 'Mensagens', icon: MessageSquare },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isAdmin, user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login')
      } else if (!isAdmin) {
        router.replace('/aluno/dashboard')
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

  if (isLoading || !isAuthenticated || !isAdmin) {
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
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 fixed h-full z-20 flex flex-col">
        <div className="p-6 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow">
              <span className="text-white font-bold text-sm">JT</span>
            </div>
            <div>
              <p className="font-semibold text-neutral-900 text-sm">Japa Treinador</p>
              <p className="text-xs text-neutral-400">Administrador</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
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

        <div className="p-4 border-t border-neutral-100">
          <p className="text-xs font-medium text-neutral-500 truncate px-2 mb-2">{user?.name}</p>
          <button onClick={handleLogout} className="btn-ghost w-full justify-start gap-3 text-neutral-500 text-sm">
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 animate-fade-in">
        {children}
      </main>
    </div>
  )
}
