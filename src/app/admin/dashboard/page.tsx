'use client'

import { useEffect, useState } from 'react'
import { Users, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import api from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { AdminDashboard } from '@/types'

export default function AdminDashboardPage() {
  const [data, setData]       = useState<AdminDashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<AdminDashboard>('/admin/dashboard')
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ height: 32, width: 220, background: '#1a1a1a', borderRadius: 4 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ height: 110, background: '#111', border: '1px solid #1e1e1e' }} />
          ))}
        </div>
      </div>
    )
  }

  const revenueChange = data
    ? data.revenue.last_month > 0
      ? ((data.revenue.this_month - data.revenue.last_month) / data.revenue.last_month) * 100
      : 0
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#5B8CF5', marginBottom: 8, fontFamily: 'var(--font-sans)' }}>
          Visão geral
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3vw,36px)', color: '#F5F0E8', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>
          Painel Administrativo
        </h1>
      </div>

      {/* ── RECEITA ── */}
      <div>
        <SectionLabel>Receita</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>

          {/* Receita este mês — destaque */}
          <div style={{
            background:  '#0c1120',
            border:      '1px solid rgba(91,140,245,0.3)',
            padding:     '28px 28px',
            gridColumn:  'span 1',
            position:    'relative',
            overflow:    'hidden',
          }}>
            {/* Glow */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'radial-gradient(circle, rgba(91,140,245,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, background: 'rgba(91,140,245,0.15)', border: '1px solid rgba(91,140,245,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={18} style={{ color: '#5B8CF5' }} />
              </div>
              {revenueChange !== 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: 'var(--font-sans)', color: revenueChange > 0 ? '#22c55e' : '#ef4444' }}>
                  {revenueChange > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(revenueChange).toFixed(1)}%
                </div>
              )}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: '#5B8CF5', letterSpacing: '0.02em', lineHeight: 1, marginBottom: 6 }}>
              {formatCurrency(data?.revenue.this_month ?? 0)}
            </div>
            <div style={{ fontSize: 12, color: '#555', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Receita este mês
            </div>
          </div>

          <StatCard
            label="Receita mês anterior"
            value={formatCurrency(data?.revenue.last_month ?? 0)}
            icon={TrendingUp}
            accent="#888"
          />
          <StatCard
            label="Receita total acumulada"
            value={formatCurrency(data?.revenue.total ?? 0)}
            icon={TrendingUp}
            accent="#F5F0E8"
          />
        </div>
      </div>

      {/* ── ALUNOS ── */}
      <div>
        <SectionLabel>Alunos</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          <StatCard label="Total de alunos"  value={data?.students.total ?? 0}          icon={Users} accent="#888" />
          <StatCard label="Alunos ativos"    value={data?.students.active ?? 0}         icon={Users} accent="#22c55e" />
          <StatCard label="Novos este mês"   value={data?.students.new_this_month ?? 0} icon={Users} accent="#f59e0b" />
        </div>
      </div>

      {/* ── ASSINATURAS ── */}
      <div>
        <SectionLabel>Assinaturas</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          <SubCard label="Ativas"    value={data?.subscriptions.active    ?? 0} color="#22c55e" />
          <SubCard label="Pendentes" value={data?.subscriptions.pending   ?? 0} color="#f59e0b" />
          <SubCard label="Expiradas" value={data?.subscriptions.expired   ?? 0} color="#444" />
          <SubCard label="Canceladas" value={data?.subscriptions.cancelled ?? 0} color="#ef4444" />
        </div>
      </div>

      {/* ── ÚLTIMAS TRANSAÇÕES ── */}
      <div>
        <SectionLabel>Últimas transações</SectionLabel>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', overflow: 'hidden' }}>
          {!data?.recent_transactions.length ? (
            <div style={{ padding: '40px', textAlign: 'center', fontSize: 13, color: '#444', fontFamily: 'var(--font-sans)' }}>
              Nenhuma transação registrada
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                    {['Aluno', 'Valor', 'Status', 'Data'].map((h, i) => (
                      <th key={h} style={{
                        padding:       '13px 20px',
                        textAlign:     i === 0 ? 'left' : i === 3 ? 'right' : 'center',
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
                  {data?.recent_transactions.map((tx, i) => (
                    <tr
                      key={tx.id}
                      style={{ borderBottom: i < (data.recent_transactions.length - 1) ? '1px solid #161616' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#141414'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#bbb', fontFamily: 'var(--font-sans)' }}>
                        {tx.user_id}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#F5F0E8', fontFamily: 'var(--font-display)', letterSpacing: '0.02em', textAlign: 'center' }}>
                        {formatCurrency(tx.amount)}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                        {tx.status === 'paid' ? (
                          <span style={badgeStyle('#22c55e')}>Pago</span>
                        ) : tx.status === 'failed' ? (
                          <span style={badgeStyle('#ef4444')}>Falhou</span>
                        ) : (
                          <span style={badgeStyle('#444')}>{ tx.status}</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 12, color: '#444', fontFamily: 'var(--font-sans)', textAlign: 'right' }}>
                        {tx.paid_at ? formatDate(tx.paid_at) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

/* ── Helpers ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#444', marginBottom: 14, fontFamily: 'var(--font-sans)' }}>
      {children}
    </div>
  )
}

function StatCard({ label, value, icon: Icon, accent }: {
  label:  string
  value:  string | number
  icon:   React.ElementType
  accent: string
}) {
  return (
    <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 38, height: 38, background: '#161616', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={17} style={{ color: accent }} />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#F5F0E8', letterSpacing: '0.02em', lineHeight: 1, marginBottom: 5 }}>
          {value}
        </div>
        <div style={{ fontSize: 11, color: '#444', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </div>
      </div>
    </div>
  )
}

function SubCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background:  '#111',
      border:      '1px solid #1e1e1e',
      borderTop:   `2px solid ${color}`,
      padding:     '22px 22px',
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#F5F0E8', letterSpacing: '0.02em', lineHeight: 1, marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: '#555', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </div>
    </div>
  )
}

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
