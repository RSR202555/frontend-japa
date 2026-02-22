'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, UserCheck, UserX, ChevronRight } from 'lucide-react'
import api from '@/lib/api'
import { cn, formatDate } from '@/lib/utils'
import type { User, PaginatedResponse } from '@/types'

export default function StudentsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)

    api.get<{ data: User[]; meta: PaginatedResponse<User>['meta'] }>(`/admin/users?${params}`)
      .then((res) => setUsers(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [debouncedSearch])

  async function toggleActive(user: User) {
    await api.patch(`/admin/users/${user.id}/toggle-active`)
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, is_active: !u.is_active } : u))
    )
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="page-title">Alunos</h1>
        <p className="page-subtitle">{users.length} aluno{users.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          placeholder="Buscar por nome ou e-mail..."
          className="input pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-400">Nenhum aluno encontrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Aluno</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Plano</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Status assinatura</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-600">Conta</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">Desde</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-neutral-800">{user.name}</p>
                        <p className="text-xs text-neutral-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {user.subscription?.plan?.name ?? <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {user.subscription?.is_active ? (
                        <span className="badge-success">Ativa</span>
                      ) : user.subscription?.status === 'pending' ? (
                        <span className="badge-warning">Pendente</span>
                      ) : (
                        <span className="badge-neutral">Inativa</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(user)}
                        className={cn(
                          'p-1.5 rounded-lg transition-colors',
                          user.is_active
                            ? 'text-green-500 hover:bg-green-50'
                            : 'text-neutral-300 hover:bg-neutral-100'
                        )}
                        title={user.is_active ? 'Desativar' : 'Ativar'}
                      >
                        {user.is_active ? <UserCheck size={16} /> : <UserX size={16} />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-neutral-400">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/alunos/${user.id}`}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 inline-flex"
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
