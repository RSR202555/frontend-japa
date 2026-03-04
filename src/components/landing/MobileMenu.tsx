'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#beneficios',    label: 'Benefícios' },
  { href: '#planos',        label: 'Planos' },
  { href: '#depoimentos',   label: 'Depoimentos' },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden"
        aria-label="Abrir menu"
        style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: 8, cursor: 'pointer', background: 'none', border: 'none' }}
      >
        {[0, 1, 2].map(i => (
          <span key={i} style={{ display: 'block', width: 22, height: 1.5, background: '#F5F0E8', borderRadius: 1 }} />
        ))}
      </button>

      {/* Fullscreen overlay */}
      {open && (
        <div
          style={{
            position:       'fixed',
            inset:          0,
            background:     '#0A0A0A',
            zIndex:         900,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            8,
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            style={{
              position:   'absolute',
              top:        24,
              right:      24,
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              color:      '#F5F0E8',
              lineHeight: 1,
            }}
          >
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          {/* Nav links */}
          {NAV_LINKS.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily:     'var(--font-display)',
                fontSize:       52,
                lineHeight:     1.1,
                color:          '#F5F0E8',
                textDecoration: 'none',
                textTransform:  'uppercase',
                letterSpacing:  '0.02em',
                transition:     'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#5B8CF5')}
              onMouseLeave={e => (e.currentTarget.style.color = '#F5F0E8')}
            >
              {item.label}
            </a>
          ))}

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32, width: '80%', maxWidth: 280 }}>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              style={{
                display:        'block',
                textAlign:      'center',
                padding:        '14px 0',
                border:         '1px solid #444',
                color:          '#F5F0E8',
                textDecoration: 'none',
                fontFamily:     'var(--font-sans)',
                fontSize:       14,
                fontWeight:     500,
                letterSpacing:  '0.05em',
                textTransform:  'uppercase',
                transition:     'border-color 0.15s',
              }}
            >
              Entrar
            </Link>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              style={{
                display:        'block',
                textAlign:      'center',
                padding:        '14px 0',
                background:     '#5B8CF5',
                color:          '#fff',
                textDecoration: 'none',
                fontFamily:     'var(--font-sans)',
                fontSize:       14,
                fontWeight:     700,
                letterSpacing:  '0.05em',
                textTransform:  'uppercase',
              }}
            >
              Começar agora
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
