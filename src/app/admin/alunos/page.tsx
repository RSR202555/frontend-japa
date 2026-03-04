'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Search, UserCheck, UserX, ChevronRight, UserPlus } from 'lucide-react'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { User, PaginatedResponse } from '@/types'
import NovoAlunoModal from '@/components/admin/NovoAlunoModal'

function badgeStyle(color: string): React.CSSProperties {
  return {
    display:       'inline-flex',
    alignItems:    'center',
    padding:       '3px 10px',
    fontSize:      10,
    fontWeight:    700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color,
    border:        `1px solid ${color}`,
    background:    `${color}18`,
    fontFamily:    'var(--font-sans)',
  }
}

export default function StudentsPage() {
  const [users, setUsers]                     = useState<User[]>([])
  const [loading, setLoading]                 = useState(true)
  const [search, setSearch]                   = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [modalOpen, setModalOpen]             = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timeout)
  }, [search])

  const loadUsers = useCallback((searchTerm: string) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    api.get<{ data: User[]; meta: PaginatedResponse<User>['meta'] }>(`/admin/users?${params}`)
      .then((res) => setUsers(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadUsers(debouncedSearch)
  }, [debouncedSearch, loadUsers])

  async function toggleActive(user: User) {
    await api.patch(`/admin/users/${user.id}/toggle-active`)
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, is_active: !u.is_active } : u))
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,32px)', color: '#F5F0E8', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>
            Alunos
          </h1>
          <p style={{ fontSize: 13, color: '#555', marginTop: 4, fontFamily: 'var(--font-sans)' }}>
            {users.length} aluno{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
            background: '#5B8CF5', border: 'none', color: '#fff',
            fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)',
            cursor: 'pointer', letterSpacing: '0.03em', transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#4A7CF3')}
          onMouseLeave={e => (e.currentTarget.style.background = '#5B8CF5')}
        >
          <UserPlus size={15} /> Novo aluno
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 360 }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#444', pointerEvents: 'none' }} />
        <input
          type="search"
          placeholder="Buscar por nome ou e-mail..."
          className="input"
          style={{ paddingLeft: 38 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#111', border: '1px solid #1e1e1e', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
            <div className="spinner-accent" />
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', fontSize: 13, color: '#444', fontFamily: 'var(--font-sans)' }}>
            Nenhum aluno encontrado
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  {['Aluno', 'Plano', 'Assinatura', 'Conta', 'Desde', ''].map((h, i) => (
                    <th key={i} style={{
                      padding:       '12px 20px',
                      textAlign:     i === 3 ? 'center' : i === 4 || i === 5 ? 'right' : 'left',
                      fontSize:      10,
                      fontWeight:    600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color:         '#444',
                      fontFamily:    'var(--font-sans)',
                      background:    '#0d0d0d',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr
                    key={user.id}
                    style={{ borderBottom: i < users.length - 1 ? '1px solid #161616' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#141414'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                  >
                    {/* Aluno */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: '#555', fontFamily: 'var(--font-sans)', marginTop: 2 }}>{user.email}</div>
                    </td>

                    {/* Plano */}
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#888', fontFamily: 'var(--font-sans)' }}>
                      {user.subscription?.plan?.name ?? <span style={{ color: '#333' }}>—</span>}
                    </td>

                    {/* Status assinatura */}
                    <td style={{ padding: '14px 20px' }}>
                      {user.subscription?.is_active
                        ? <span style={badgeStyle('#22c55e')}>Ativa</span>
                        : user.subscription?.status === 'pending'
                          ? <span style={badgeStyle('#f59e0b')}>Pendente</span>
                          : <span style={badgeStyle('#444')}>Inativa</span>
                      }
                    </td>

                    {/* Toggle conta */}
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <button
                        onClick={() => toggleActive(user)}
                        title={user.is_active ? 'Desativar conta' : 'Ativar conta'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'inline-flex', color: user.is_active ? '#22c55e' : '#333', transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = user.is_active ? '#16a34a' : '#5B8CF5')}
                        onMouseLeave={e => (e.currentTarget.style.color = user.is_active ? '#22c55e' : '#333')}
                      >
                        {user.is_active ? <UserCheck size={16} /> : <UserX size={16} />}
                      </button>
                    </td>

                    {/* Data */}
                    <td style={{ padding: '14px 20px', fontSize: 12, color: '#444', fontFamily: 'var(--font-sans)', textAlign: 'right' }}>
                      {formatDate(user.created_at)}
                    </td>

                    {/* Link detalhe */}
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <Link
                        href={`/admin/alunos/${user.id}`}
                        style={{ display: 'inline-flex', padding: 6, color: '#333', transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#5B8CF5')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#333')}
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

      {/* Modal */}
      <NovoAlunoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => loadUsers('')}
      />
    </div>
  )
}
