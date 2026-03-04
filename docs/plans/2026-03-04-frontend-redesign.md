# Frontend Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign completo do frontend Japa Treinador com tema dark editorial premium (#0A0A0A + #D4FF00), tipografia Bebas Neue + DM Sans, aplicado a landing, auth e todo o app interno.

**Architecture:** Design system first — atualizar tailwind.config + globals.css para propagar dark theme automaticamente via classes Tailwind. Depois atualizar cada arquivo para remover classes hard-coded de cor clara.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 3, Lucide React, DM Sans + Bebas Neue (Google Fonts)

**Dev command:** `npm run dev` (em `frontend-japa-main/`)

**Design reference:** `d:/RIAN/japa/landing.html` (protótipo HTML completo já criado)

---

## Task 1: Tailwind Config — novos tokens de cor e fonte

**Files:**
- Modify: `tailwind.config.ts`

**Step 1: Reescrever tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark premium palette
        bg: {
          DEFAULT: '#0A0A0A',
          card:    '#141414',
          alt:     '#1a1a1a',
        },
        surface: '#F5F0E8',
        muted:   '#888888',
        accent: {
          DEFAULT: '#D4FF00',
          hover:   '#BFFF00',
        },
        'border-subtle': '#222222',
        'border-mid':    '#333333',
        // Keep semantic colors
        brand: {
          '50':  '#f0f7ff',
          '100': '#e0effe',
          '500': '#0d90e7',
          '600': '#0171c3',
          '700': '#025a9e',
        },
        neutral: {
          '50':  '#f8fafc',
          '100': '#f1f5f9',
          '200': '#e2e8f0',
          '400': '#94a3b8',
          '500': '#64748b',
          '600': '#475569',
          '800': '#1e293b',
          '900': '#0f172a',
        },
        success: { DEFAULT: '#22c55e', light: '#dcfce7' },
        warning: { DEFAULT: '#f59e0b', light: '#fef3c7' },
        danger:  { DEFAULT: '#ef4444', light: '#fee2e2' },
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgb(0 0 0 / 0.4)',
        'card-hover':'0 4px 12px 0 rgb(0 0 0 / 0.5)',
        'accent-glow': '0 0 20px rgba(212, 255, 0, 0.15)',
      },
      borderRadius: {
        DEFAULT: '4px',
        sm:  '2px',
        md:  '4px',
        lg:  '8px',
        xl:  '8px',
        '2xl': '8px',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'fade-up':    'fadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeUp:  { 'to': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

**Step 2: Verificar**

```bash
cd frontend-japa-main && npm run build 2>&1 | head -30
```
Expected: sem erros de TypeScript no config.

**Step 3: Commit**

```bash
git add src/ tailwind.config.ts
git commit -m "feat: update tailwind config with dark premium tokens"
```

---

## Task 2: globals.css — design system dark completo

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Reescrever globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg:           #0A0A0A;
    --bg-card:      #141414;
    --bg-card-alt:  #1a1a1a;
    --text:         #F5F0E8;
    --text-muted:   #888888;
    --accent:       #D4FF00;
    --accent-hover: #BFFF00;
    --border:       #222222;
    --border-mid:   #333333;
    --danger:       #ef4444;
    --success:      #22c55e;
    --warning:      #f59e0b;
    --radius:       4px;
  }

  *, *::before, *::after { box-sizing: border-box; }

  html {
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', system-ui, sans-serif;
    min-height: 100dvh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--accent);
  }
  :focus:not(:focus-visible) { outline: none; }

  /* Headings use display font */
  h1, h2, h3 {
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.02em;
    line-height: 1;
  }
}

@layer components {
  /* ── BUTTONS ── */
  .btn {
    @apply inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
           transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
  }

  .btn-primary {
    @apply btn;
    background: var(--accent);
    color: var(--bg);
    font-weight: 700;
  }
  .btn-primary:hover { background: var(--accent-hover); transform: scale(1.02); }

  .btn-secondary {
    @apply btn;
    background: transparent;
    color: var(--text);
    border: 1px solid #444;
  }
  .btn-secondary:hover { border-color: var(--text); }

  .btn-ghost {
    @apply btn;
    background: transparent;
    color: var(--text-muted);
  }
  .btn-ghost:hover { background: var(--bg-card); color: var(--text); }

  .btn-danger {
    @apply btn;
    background: var(--danger);
    color: #fff;
  }
  .btn-danger:hover { background: #dc2626; }

  /* ── CARDS ── */
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  .card-hover {
    @apply card;
    transition: border-color 0.2s, background 0.2s;
  }
  .card-hover:hover { border-color: var(--border-mid); background: var(--bg-card-alt); }

  .stat-card {
    @apply card;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* ── INPUTS ── */
  .input {
    width: 100%;
    border-radius: var(--radius);
    border: 1px solid var(--border-mid);
    background: var(--bg-card);
    padding: 10px 16px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .input::placeholder { color: #555; }
  .input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(212, 255, 0, 0.1);
    outline: none;
  }
  .input:disabled { background: var(--bg-card-alt); color: #555; }

  .label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-bottom: 6px;
    font-family: 'DM Sans', sans-serif;
  }

  .error-message {
    font-size: 12px;
    color: var(--danger);
    margin-top: 4px;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── BADGES ── */
  .badge {
    display: inline-flex;
    align-items: center;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: 'DM Sans', sans-serif;
  }

  .badge-success { @apply badge; border: 1px solid #22c55e; color: #22c55e; background: rgba(34,197,94,0.08); }
  .badge-warning { @apply badge; border: 1px solid #f59e0b; color: #f59e0b; background: rgba(245,158,11,0.08); }
  .badge-danger  { @apply badge; border: 1px solid #ef4444; color: #ef4444; background: rgba(239,68,68,0.08); }
  .badge-brand   { @apply badge; border: 1px solid var(--accent); color: var(--accent); background: rgba(212,255,0,0.08); }
  .badge-neutral { @apply badge; border: 1px solid var(--border-mid); color: var(--text-muted); background: transparent; }

  /* ── TYPOGRAPHY ── */
  .page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(28px, 4vw, 40px);
    color: var(--text);
    letter-spacing: 0.02em;
    line-height: 1;
    text-transform: uppercase;
  }

  .page-subtitle {
    font-size: 14px;
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
  }

  .section-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--accent);
    font-family: 'DM Sans', sans-serif;
  }
}

@layer utilities {
  .text-balance { text-wrap: balance; }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar { display: none; }

  /* Gradient utilities — mantém compatibilidade */
  .bg-brand-gradient { background: linear-gradient(135deg, #D4FF00 0%, #BFFF00 100%); }
  .bg-brand-soft     { background: var(--bg); }

  /* Accent spin loader */
  .spinner-accent {
    border: 2px solid var(--border-mid);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Grain overlay */
  .grain-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9998;
    width: 100%;
    height: 100%;
  }
}
```

**Step 2: Iniciar dev e verificar no browser**

```bash
cd frontend-japa-main && npm run dev
```
Abrir `http://localhost:3000`. O body deve aparecer dark. Botões devem ser lime. Cards devem ser `#141414`.

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: rewrite globals.css with dark editorial design system"
```

---

## Task 3: Root Layout — fontes Google + grain + cursor

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/ui/GrainOverlay.tsx`
- Create: `src/components/ui/CustomCursor.tsx`

**Step 1: Criar GrainOverlay component**

```tsx
// src/components/ui/GrainOverlay.tsx
export function GrainOverlay() {
  return (
    <svg
      className="grain-overlay"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <filter id="grain-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.68"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter)" opacity="0.038" />
    </svg>
  )
}
```

**Step 2: Criar CustomCursor component**

```tsx
// src/components/ui/CustomCursor.tsx
'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Só ativar em dispositivos com mouse
    if (window.matchMedia('(pointer: coarse)').matches) return

    const move = (e: MouseEvent) => {
      cursor.style.left    = e.clientX + 'px'
      cursor.style.top     = e.clientY + 'px'
      cursor.style.opacity = '1'
    }
    const leave = () => { cursor.style.opacity = '0' }

    const enterInteractive = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.8)'
      cursor.style.opacity   = '0.7'
    }
    const leaveInteractive = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)'
      cursor.style.opacity   = '1'
    }

    document.addEventListener('mousemove',  move)
    document.addEventListener('mouseleave', leave)

    const interactives = document.querySelectorAll('a, button')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', enterInteractive)
      el.addEventListener('mouseleave', leaveInteractive)
    })

    return () => {
      document.removeEventListener('mousemove',  move)
      document.removeEventListener('mouseleave', leave)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', enterInteractive)
        el.removeEventListener('mouseleave', leaveInteractive)
      })
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      style={{
        position:       'fixed',
        width:          '12px',
        height:         '12px',
        borderRadius:   '50%',
        background:     '#D4FF00',
        pointerEvents:  'none',
        zIndex:         99999,
        transform:      'translate(-50%, -50%)',
        transition:     'transform 0.12s ease, opacity 0.2s ease',
        opacity:        0,
        mixBlendMode:   'difference',
      }}
    />
  )
}
```

**Step 3: Atualizar layout.tsx**

```tsx
// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { CustomCursor } from '@/components/ui/CustomCursor'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default:  'Japa Treinador',
    template: '%s | Japa Treinador',
  },
  description: 'Plataforma de Consultoria Online Fitness personalizada.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable:         true,
    statusBarStyle:  'black-translucent',
    title:           'Japa Treinador',
  },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor:   '#0A0A0A',
  width:        'device-width',
  initialScale:  1,
  maximumScale:  1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${bebasNeue.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body suppressHydrationWarning style={{ fontFamily: 'var(--font-sans)' }}>
        <GrainOverlay />
        <CustomCursor />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

**Step 4: Atualizar globals.css — adicionar variáveis de fonte**

No `:root` do globals.css, adicionar:
```css
font-family: var(--font-sans, 'DM Sans', sans-serif);
```
E nos seletores de heading (`h1, h2, h3`):
```css
font-family: var(--font-display, 'Bebas Neue', sans-serif);
```

**Step 5: Verificar no browser**
- `http://localhost:3000` — body deve usar DM Sans
- Inspecionar elemento `h1` — deve mostrar Bebas Neue
- Grain sutil visível sobre o fundo dark

**Step 6: Commit**

```bash
git add src/app/layout.tsx src/components/ui/GrainOverlay.tsx src/components/ui/CustomCursor.tsx
git commit -m "feat: add Bebas Neue + DM Sans fonts, grain overlay, custom cursor"
```

---

## Task 4: Landing Page — migrar landing.html para page.tsx + MobileMenu

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/landing/MobileMenu.tsx`

**Nota:** O arquivo `d:/RIAN/japa/landing.html` é o protótipo visual completo. Portá-lo para React/Next.js, mantendo toda a estrutura HTML e CSS como classes Tailwind + estilos inline onde necessário.

**Step 1: Criar SVG icon helpers no topo do arquivo**

No `page.tsx`, remover todos os imports do `lucide-react` e substituir por funções SVG inline:

```tsx
// SVG icon components — sem dependência de lib
function IconArrow({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}
function IconShield({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}
function IconClock({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
function IconUsers({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}
function IconTrend({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  )
}
function IconCheck({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="#D4FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
function IconStar() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}
```

**Step 2: Reescrever o componente LandingPage**

Estrutura completa do JSX seguindo `landing.html`. Usar `style` prop para animações staggeradas:

```tsx
export default function LandingPage() {
  return (
    <div style={{ background: '#0A0A0A', minHeight: '100dvh' }}>

      {/* NAVBAR */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 500,
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #222',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, gap: 24 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{ width: 30, height: 30, background: '#D4FF00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#0A0A0A', letterSpacing: '0.05em' }}>JT</span>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#F5F0E8', letterSpacing: '0.06em' }}>
                Japa Treinador
              </span>
            </Link>

            <nav className="hidden lg:flex">
              <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
                {[
                  { href: '#como-funciona', label: 'Como funciona' },
                  { href: '#beneficios',    label: 'Benefícios' },
                  { href: '#planos',        label: 'Planos' },
                  { href: '#depoimentos',   label: 'Depoimentos' },
                ].map(item => (
                  <li key={item.href}>
                    <a href={item.href} style={{
                      display: 'block', padding: '6px 14px',
                      fontSize: 11, fontWeight: 500,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      color: '#666', textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F5F0E8')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#666')}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link href="/login" className="hidden sm:block btn-ghost" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Entrar
              </Link>
              <Link href="/checkout" className="btn-primary" style={{ fontSize: 13 }}>
                Começar agora
              </Link>
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '110px 0 96px', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        {/* Lime blob */}
        <div style={{
          position: 'absolute', top: -180, right: -220,
          width: 760, height: 760, pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(212,255,0,0.13) 0%, rgba(212,255,0,0.05) 38%, transparent 68%)',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <div style={{ maxWidth: 820 }}>

            {/* Badge */}
            <div className="fade-up-item" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '1px solid #D4FF00', color: '#D4FF00',
              fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em',
              padding: '6px 14px', borderRadius: 4, marginBottom: 28,
              animationDelay: '0.08s',
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#D4FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Consultoria online personalizada
            </div>

            {/* Headline */}
            <h1 className="fade-up-item" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(64px, 9vw, 120px)',
              lineHeight: 0.93, letterSpacing: '0.025em',
              textTransform: 'uppercase', marginBottom: 24,
              animationDelay: '0.22s',
            }}>
              <span style={{ display: 'block', color: '#F5F0E8' }}>Transforme</span>
              <span style={{ display: 'block', color: '#D4FF00' }}>seu corpo</span>
            </h1>

            {/* Subtitle */}
            <p className="fade-up-item" style={{
              fontSize: 18, color: '#888', lineHeight: 1.72,
              maxWidth: 500, marginBottom: 44,
              animationDelay: '0.38s',
            }}>
              Treino, dieta e suporte personalizados direto na sua tela. Resultados reais,
              sem academias lotadas e no seu ritmo.
            </p>

            {/* CTAs */}
            <div className="fade-up-item" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 52, animationDelay: '0.52s' }}>
              <Link href="/checkout" className="btn-primary" style={{ fontSize: 15, padding: '15px 30px' }}>
                Quero começar agora <IconArrow />
              </Link>
              <a href="#como-funciona" className="btn-secondary" style={{ fontSize: 15, padding: '15px 30px' }}>
                Como funciona
              </a>
            </div>

            {/* Stats */}
            <div className="fade-up-item" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', animationDelay: '0.68s' }}>
              {[
                { icon: <IconShield />, label: 'Sem fidelidade' },
                { icon: <IconClock />,  label: 'Início imediato' },
                { icon: <IconUsers />, label: '+500 alunos ativos' },
                { icon: <IconTrend />, label: '98% de satisfação' },
              ].map((s, i, arr) => (
                <div key={s.label} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  fontSize: 13, color: '#5a5a5a',
                  padding: '0 20px',
                  paddingLeft: i === 0 ? 0 : undefined,
                  borderRight: i < arr.length - 1 ? '1px solid #2a2a2a' : 'none',
                }}>
                  {s.icon} {s.label}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ borderTop: '1px solid #222', borderBottom: '1px solid #222', padding: '52px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                textAlign: 'center', padding: '0 20px',
                borderRight: i < stats.length - 1 ? '1px solid #222' : 'none',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 58, lineHeight: 1, color: '#D4FF00', letterSpacing: '0.02em' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 8 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Simples e eficaz</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px,5vw,58px)', color: '#F5F0E8', marginBottom: 18 }}>
              Como funciona
            </h2>
            <p style={{ fontSize: 15, color: '#888', maxWidth: 460, margin: '0 auto', lineHeight: 1.75 }}>
              Em 3 passos simples você começa a transformar seu corpo com suporte profissional completo.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#222', border: '1px solid #222' }}>
            {steps.map(step => (
              <div key={step.number} style={{ background: '#141414', padding: '40px 36px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 88, lineHeight: 0.8, color: 'rgba(212,255,0,0.09)', marginBottom: 24 }}>
                  {step.number}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#F5F0E8', marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.75, fontFamily: 'DM Sans, sans-serif' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 52 }}>
            <Link href="/checkout" className="btn-primary" style={{ fontSize: 15, padding: '15px 30px' }}>
              Escolher meu plano <IconArrow />
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="beneficios" style={{ background: '#0d0d0d', paddingBottom: 0, paddingTop: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Tudo que você precisa</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px,5vw,58px)', color: '#F5F0E8', marginBottom: 18 }}>
              O que está incluso
            </h2>
            <p style={{ fontSize: 15, color: '#888', maxWidth: 460, margin: '0 auto', lineHeight: 1.75 }}>
              Uma solução completa para alcançar seus objetivos com segurança, suporte e resultados reais.
            </p>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#222', border: '1px solid #222' }}>
            {features.map(f => {
              const Icon = f.icon
              return (
                <div key={f.title} style={{ background: '#0A0A0A', padding: '40px 36px' }}>
                  <div style={{ width: 38, height: 38, marginBottom: 20, color: '#D4FF00' }}>
                    <Icon size={38} strokeWidth={1.5} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#F5F0E8', marginBottom: 10 }}>{f.title}</div>
                  <p style={{ fontSize: 14, color: '#666', lineHeight: 1.75 }}>{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Sem surpresas</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px,5vw,58px)', color: '#F5F0E8', marginBottom: 18 }}>
              Planos transparentes
            </h2>
            <p style={{ fontSize: 15, color: '#888', maxWidth: 460, margin: '0 auto', lineHeight: 1.75 }}>
              Escolha o plano que melhor se encaixa no seu momento. Sem contratos longos, cancele quando quiser.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }}>
            {plans.map(plan => (
              <div key={plan.name} style={{
                padding: '36px 32px',
                border: plan.highlight ? '1px solid #D4FF00' : '1px solid #333',
                background: plan.highlight ? '#101207' : '#141414',
                position: 'relative', display: 'flex', flexDirection: 'column', gap: 26,
              }}>
                {plan.highlight && (
                  <div style={{
                    position: 'absolute', top: -1, left: 32,
                    background: '#D4FF00', color: '#0A0A0A',
                    fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
                    padding: '4px 10px',
                  }}>
                    Mais popular
                  </div>
                )}
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: plan.highlight ? '#D4FF00' : '#F5F0E8', letterSpacing: '0.05em' }}>
                    {plan.name}
                  </div>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{plan.desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 54, lineHeight: 1, color: plan.highlight ? '#D4FF00' : '#F5F0E8' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 14, color: '#555' }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 13, flex: 1 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#999' }}>
                      <IconCheck /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/checkout" style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '13px 20px', borderRadius: 8,
                  border: plan.highlight ? '1px solid #D4FF00' : '1px solid #383838',
                  background: plan.highlight ? '#D4FF00' : 'transparent',
                  color: plan.highlight ? '#0A0A0A' : '#F5F0E8',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700,
                  textDecoration: 'none',
                }}>
                  Começar com {plan.name} <IconArrow size={14} />
                </Link>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#444', marginTop: 24, letterSpacing: '0.04em' }}>
            Preços ilustrativos. Os valores finais são exibidos após o cadastro na plataforma.
          </p>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" style={{ background: '#080808', padding: '100px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Resultados reais</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px,5vw,58px)', color: '#F5F0E8' }}>
              O que nossos alunos dizem
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ padding: '36px 32px', border: '1px solid #222', background: '#141414', display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: t.stars }).map((_, i) => <IconStar key={i} />)}
                </div>
                <p style={{ fontSize: 14, color: '#777', lineHeight: 1.8, flex: 1, fontStyle: 'italic' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F0E8' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#D4FF00', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <div style={{ background: '#0d0d0d', borderTop: '1px solid #222', padding: '120px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Próximo passo</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(42px,6vw,82px)', lineHeight: 0.96, textTransform: 'uppercase', color: '#F5F0E8', marginBottom: 20, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
            Pronto para começar sua transformação?
          </h2>
          <p style={{ fontSize: 17, color: '#666', marginBottom: 48, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.75 }}>
            Mais de 500 pessoas já mudaram de vida com a consultoria do Japa. Agora é a sua vez.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link href="/checkout" className="btn-primary" style={{ fontSize: 15, padding: '15px 30px' }}>
              Começar agora <IconArrow />
            </Link>
            <Link href="/login" className="btn-secondary" style={{ fontSize: 15, padding: '15px 30px' }}>
              Já tenho conta
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#0A0A0A', borderTop: '1px solid #222', padding: '44px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{ width: 30, height: 30, background: '#D4FF00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#0A0A0A' }}>JT</span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: '#F5F0E8' }}>Japa Treinador</div>
                <div style={{ fontSize: 10, color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 1 }}>
                  Consultoria Online Fitness
                </div>
              </div>
            </Link>
            <nav style={{ display: 'flex', flexWrap: 'wrap' }}>
              {['#como-funciona','#beneficios','#planos'].map(href => (
                <a key={href} href={href} style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#444', textDecoration: 'none', padding: '4px 14px', borderRight: '1px solid #222' }}>
                  {href.replace('#','')}
                </a>
              ))}
              <Link href="/login" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#444', textDecoration: 'none', padding: '4px 14px', borderRight: '1px solid #222' }}>Login</Link>
              <Link href="/checkout" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#444', textDecoration: 'none', padding: '4px 14px' }}>Começar</Link>
            </nav>
            <div style={{ fontSize: 11, color: '#333', letterSpacing: '0.04em' }}>
              © {new Date().getFullYear()} Japa Treinador. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
```

**Step 3: Adicionar CSS de animação no globals.css (ao final do @layer utilities)**

```css
/* Hero fade-up stagger */
.fade-up-item {
  opacity: 0;
  transform: translateY(22px);
  animation: fadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

**Step 4: Atualizar MobileMenu.tsx**

```tsx
// src/components/landing/MobileMenu.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden"
        aria-label="Abrir menu"
        style={{ display: 'flex', flexDirection: 'column', gap: 5, background: 'none', border: 'none', padding: 4 }}
      >
        {[0,1,2].map(i => (
          <span key={i} style={{ display: 'block', width: 22, height: 1.5, background: '#F5F0E8' }} />
        ))}
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, background: '#0A0A0A', zIndex: 900,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
        }}>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', color: '#555', fontSize: 36, lineHeight: 1 }}
          >
            ×
          </button>
          {[
            { href: '#como-funciona', label: 'Como funciona' },
            { href: '#beneficios',    label: 'Benefícios' },
            { href: '#planos',        label: 'Planos' },
            { href: '#depoimentos',   label: 'Depoimentos' },
          ].map(item => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}
              style={{ fontFamily: 'var(--font-display)', fontSize: 52, color: '#F5F0E8', textDecoration: 'none', letterSpacing: '0.04em' }}>
              {item.label}
            </a>
          ))}
          <Link href="/checkout" onClick={() => setOpen(false)}
            style={{ fontFamily: 'var(--font-display)', fontSize: 52, color: '#D4FF00', textDecoration: 'none' }}>
            Começar agora →
          </Link>
        </div>
      )}
    </>
  )
}
```

**Step 5: Verificar landing no browser**
- `http://localhost:3000` — hero dark, headline Bebas Neue, blob lime, badge industrial
- Stats bar com números em #D4FF00
- Seção "Como funciona" com grid editorial
- Cards de planos dark, Pro com borda lime
- Mobile: hamburger → overlay fullscreen

**Step 6: Commit**

```bash
git add src/app/page.tsx src/components/landing/MobileMenu.tsx
git commit -m "feat: migrate landing page to dark editorial design"
```

---

## Task 5: Auth — layout + login

**Files:**
- Modify: `src/app/(auth)/layout.tsx`
- Modify: `src/app/(auth)/login/page.tsx`

**Step 1: Atualizar (auth)/layout.tsx**

Remover `bg-brand-soft` e qualquer classe de cor clara:

```tsx
// Apenas trocar: className="min-h-dvh flex items-center justify-center bg-brand-soft px-4 py-12"
// Para style prop:
// style={{ minHeight: '100dvh', background: '#0A0A0A' }}
```

Se o arquivo não tiver conteúdo próprio (só passa children), verificar e remover qualquer `bg-*` da classe body.

**Step 2: Atualizar login/page.tsx**

Substituir todas as classes de cor clara por versões dark. Padrão de substituição:
- `bg-brand-soft` → remover (body já é dark)
- `card p-8` → manter `.card` (já atualizado no globals.css para dark)
- `bg-brand-gradient` no logo → `style={{ background: '#D4FF00' }}`
- `text-white font-bold text-xl` no "JT" → `style={{ color: '#0A0A0A', fontFamily: 'var(--font-display)', fontSize: 21 }}`
- `text-neutral-900` → `style={{ color: '#F5F0E8' }}`
- `text-neutral-500` → `style={{ color: '#888' }}`
- `text-brand-600 hover:text-brand-700` (link) → `style={{ color: '#D4FF00' }}`
- Spinner: substituir `border-brand-500` → `spinner-accent` class

**Step 3: Verificar**
- `http://localhost:3000/login` — card dark, logo com mark #D4FF00 + Bebas Neue, inputs dark, botão lime

**Step 4: Commit**

```bash
git add src/app/(auth)/
git commit -m "feat: dark auth pages — login"
```

---

## Task 6: Auth — cadastro

**Files:**
- Modify: `src/app/(auth)/cadastro/page.tsx`

**Step 1:** Aplicar o mesmo padrão de substituição do Task 5 no arquivo de cadastro.

Classes específicas para substituir no cadastro:
- Todos os `bg-brand-*`, `text-brand-*` → tokens dark
- `rounded-2xl` em cards → remover (já é 4px via variável `--radius`)
- `border-neutral-200` → `border: '1px solid #333'`

**Step 2: Verificar**
- `http://localhost:3000/cadastro` — mesmo visual do login

**Step 3: Commit**

```bash
git add src/app/(auth)/cadastro/page.tsx
git commit -m "feat: dark auth — cadastro page"
```

---

## Task 7: Aluno Layout — sidebar dark

**Files:**
- Modify: `src/app/aluno/layout.tsx`

**Step 1: Substituições no layout.tsx do aluno**

```tsx
// Loading spinner: de
<div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
// Para:
<div className="spinner-accent" style={{ width: 32, height: 32 }} />

// Container: de
<div className="min-h-dvh flex bg-neutral-50">
// Para:
<div style={{ minHeight: '100dvh', display: 'flex', background: '#0A0A0A' }}>

// Sidebar desktop: de
<aside className="hidden lg:flex lg:w-64 flex-col bg-white border-r border-neutral-200 fixed h-full z-20">
// Para:
<aside className="hidden lg:flex lg:w-64 flex-col fixed h-full z-20"
  style={{ background: '#0A0A0A', borderRight: '1px solid #222' }}>

// Mobile overlay backdrop: de
<div className="absolute inset-0 bg-neutral-900/50" />
// Para:
<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />

// Mobile sidebar: de
<aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
// Para:
<aside style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: 256, background: '#0A0A0A', borderRight: '1px solid #222' }}>

// Mobile header: de
<header className="lg:hidden sticky top-0 z-10 bg-white border-b border-neutral-200 ...">
// Para:
<header className="lg:hidden sticky top-0 z-10" style={{ background: 'rgba(10,10,10,0.9)', borderBottom: '1px solid #222', ... }}>

// "Japa Treinador" text in mobile header:
<span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#F5F0E8', letterSpacing: '0.05em' }}>
  Japa Treinador
</span>
```

**Step 2: Atualizar SidebarContent**

```tsx
function SidebarContent(...) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 16 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 24px' }}>
        <div style={{ width: 30, height: 30, background: '#D4FF00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#0A0A0A' }}>JT</span>
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#F5F0E8', letterSpacing: '0.05em' }}>
          Japa Treinador
        </span>
        {onClose && (
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#555', fontSize: 20 }}>×</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {navItems.map(item => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', marginBottom: 2,
                borderLeft: active ? '3px solid #D4FF00' : '3px solid transparent',
                background: active ? '#141414' : 'transparent',
                color: active ? '#F5F0E8' : '#666',
                textDecoration: 'none',
                fontSize: 13, fontWeight: 500,
                transition: 'all 0.15s',
              }}
            >
              <Icon size={18} color={active ? '#D4FF00' : '#555'} strokeWidth={1.5} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div style={{ borderTop: '1px solid #222', paddingTop: 16, marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 8px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {user?.avatar_url
              ? <img src={user.avatar_url} alt="" style={{ width: 32, height: 32, objectFit: 'cover' }} />
              : <User size={16} color="#666" />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#F5F0E8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
            <p style={{ fontSize: 11, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={onLogout} className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 10, fontSize: 13 }}>
          <LogOut size={16} /> Sair
        </button>
      </div>
    </div>
  )
}
```

**Step 3: Verificar**
- Login como aluno → sidebar dark com marcador lime no item ativo
- Mobile: hamburger → drawer dark

**Step 4: Commit**

```bash
git add src/app/aluno/layout.tsx
git commit -m "feat: dark sidebar for aluno app"
```

---

## Task 8: Admin Layout — sidebar dark

**Files:**
- Modify: `src/app/admin/layout.tsx`

**Step 1:** Aplicar mesmo padrão do Task 7:
- `bg-neutral-50` → `background: '#0A0A0A'`
- `bg-white border-r border-neutral-200` na aside → `background: '#0A0A0A', borderRight: '1px solid #222'`
- Logo: marca `#D4FF00` + Bebas Neue
- Nav links: mesmo padrão (active = `#141414` + `3px solid #D4FF00` esquerda)
- "Administrador" badge: `.badge-neutral`
- Spinner: `spinner-accent`
- `ml-64 p-8` no main → manter `ml-64`, trocar `bg` implícito

**Step 2: Verificar**
- Login como admin → sidebar dark, mesmo visual do aluno

**Step 3: Commit**

```bash
git add src/app/admin/layout.tsx
git commit -m "feat: dark sidebar for admin app"
```

---

## Task 9: Aluno Dashboard

**Files:**
- Modify: `src/app/aluno/dashboard/page.tsx`

**Step 1: Atualizar StatCard component**

```tsx
function StatCard({ label, value, suffix, icon: Icon, color }) {
  const iconColors = {
    brand:   '#D4FF00',
    success: '#22c55e',
    warning: '#f59e0b',
    danger:  '#ef4444',
  }

  return (
    <div className="stat-card">
      <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a', borderRadius: 4 }}>
        <Icon size={18} color={iconColors[color]} strokeWidth={1.5} />
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1, color: '#D4FF00', letterSpacing: '0.02em' }}>
          {value.toLocaleString('pt-BR')}
          {suffix && <span style={{ fontSize: 14, fontWeight: 500, color: '#555', marginLeft: 4 }}>{suffix}</span>}
        </p>
        <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{label}</p>
      </div>
    </div>
  )
}
```

**Step 2: Atualizar greeting e alertas**

```tsx
// Greeting
<div>
  <h1 className="page-title">Olá, {user?.name?.split(' ')[0]}</h1>
  <p className="page-subtitle" style={{ marginTop: 4 }}>Veja seu progresso de hoje</p>
</div>

// Alerta assinatura inativa
<div style={{ borderRadius: 4, border: '1px solid #f59e0b', background: 'rgba(245,158,11,0.06)', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
  <AlertCircle size={18} color="#f59e0b" style={{ marginTop: 2, flexShrink: 0 }} />
  ...
</div>

// Alerta anamnese
<div style={{ borderRadius: 4, border: '1px solid #D4FF00', background: 'rgba(212,255,0,0.06)', padding: '12px 16px', ... }}>

// Subscription card ativo
<div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
```

**Step 3: Atualizar Quick Actions**

```tsx
<Link href={action.href} className="card-hover" style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', textDecoration: 'none' }}>
  <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a', borderRadius: 4 }}>
    <Icon size={20} color="#D4FF00" strokeWidth={1.5} />
  </div>
  <span style={{ fontSize: 12, fontWeight: 500, color: '#888' }}>{action.label}</span>
</Link>
```

**Step 4: Atualizar DashboardSkeleton**

```tsx
function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ height: 32, width: 192, background: '#1a1a1a', borderRadius: 4, animation: 'pulse 2s infinite' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card" style={{ height: 112, background: '#141414' }} />
        ))}
      </div>
    </div>
  )
}
```

**Step 5: Verificar**
- Dashboard carregado: greeting em Bebas Neue, stats com números #D4FF00, quick actions com ícones lime

**Step 6: Commit**

```bash
git add src/app/aluno/dashboard/page.tsx
git commit -m "feat: dark aluno dashboard"
```

---

## Task 10: Aluno — treino, anamnese, planos

**Files:**
- Modify: `src/app/aluno/treino/page.tsx`
- Modify: `src/app/aluno/anamnese/page.tsx`
- Modify: `src/app/aluno/planos/page.tsx`

**Step 1:** Para cada arquivo, aplicar substituições padrão:
- `bg-white` / `bg-neutral-*` → remover (herda `#0A0A0A` do body)
- `.card` → já dark via globals.css
- `text-neutral-900` → `color: '#F5F0E8'`
- `text-neutral-500/600` → `color: '#888'`
- `text-brand-*` → `color: '#D4FF00'`
- `bg-brand-gradient` → `background: '#D4FF00'`; texto dentro: `color: '#0A0A0A'`
- `border-neutral-*` → `border-color: '#222'` ou `'#333'`
- `rounded-2xl` → `borderRadius: 4`
- Botões: `.btn-primary` / `.btn-secondary` já dark
- Inputs: `.input` já dark
- `page-title` / `page-subtitle` já dark

Em `treino/page.tsx`, números de série e repetição usar Bebas Neue:
```tsx
<span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#D4FF00' }}>
  {exercicio.series}×{exercicio.reps}
</span>
```

**Step 2: Verificar cada página individualmente**

**Step 3: Commit**

```bash
git add src/app/aluno/treino/page.tsx src/app/aluno/anamnese/page.tsx src/app/aluno/planos/page.tsx
git commit -m "feat: dark aluno treino, anamnese, planos pages"
```

---

## Task 11: Aluno — metas, refeições

**Files:**
- Modify: `src/app/aluno/metas/page.tsx`
- Modify: `src/app/aluno/refeicoes/page.tsx`

**Step 1:** Aplicar substituições padrão (Task 10).

Em `metas/page.tsx`, progress bars:
```tsx
{/* Track */}
<div style={{ background: '#222', height: 6, borderRadius: 2, overflow: 'hidden' }}>
  {/* Fill */}
  <div style={{ background: '#D4FF00', height: '100%', width: `${progresso}%`, borderRadius: 2, transition: 'width 0.3s' }} />
</div>
```

Em `refeicoes/page.tsx`, calorias com Bebas Neue:
```tsx
<span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#D4FF00' }}>{kcal}</span>
```

**Step 2: Verificar**

**Step 3: Commit**

```bash
git add src/app/aluno/metas/page.tsx src/app/aluno/refeicoes/page.tsx
git commit -m "feat: dark aluno metas, refeicoes pages"
```

---

## Task 12: Aluno — chat, evolução

**Files:**
- Modify: `src/app/aluno/chat/page.tsx`
- Modify: `src/app/aluno/evolucao/page.tsx`

**Step 1: Chat — bolhas de mensagem**

```tsx
// Bolha do aluno (própria)
<div style={{
  maxWidth: '80%', padding: '10px 14px',
  background: '#1a1a1a', borderRadius: '4px 4px 4px 0',
  border: '1px solid #2a2a2a',
  color: '#F5F0E8', fontSize: 14, lineHeight: 1.6,
}}>
  {msg.content}
</div>

// Bolha do treinador
<div style={{
  maxWidth: '80%', padding: '10px 14px',
  background: '#D4FF00', borderRadius: '4px 4px 0 4px',
  color: '#0A0A0A', fontSize: 14, lineHeight: 1.6,
  fontWeight: 500,
}}>
  {msg.content}
</div>

// Input de mensagem — já dark via .input
```

**Step 2: Evolução — upload zone**

```tsx
<div style={{
  border: '2px dashed #333', borderRadius: 4,
  padding: '48px 24px', textAlign: 'center',
  transition: 'border-color 0.2s',
  cursor: 'pointer',
}}
onMouseEnter={e => (e.currentTarget.style.borderColor = '#D4FF00')}
onMouseLeave={e => (e.currentTarget.style.borderColor = '#333')}
>
  <p style={{ color: '#555', fontSize: 14 }}>Clique ou arraste uma foto aqui</p>
  <p style={{ color: '#D4FF00', fontSize: 12, marginTop: 8 }}>JPG, PNG até 10MB</p>
</div>
```

Grid de fotos: cards `#141414` com borda `1px #222`.

**Step 3: Verificar**

**Step 4: Commit**

```bash
git add src/app/aluno/chat/page.tsx src/app/aluno/evolucao/page.tsx
git commit -m "feat: dark aluno chat (lime bubbles) and evolucao pages"
```

---

## Task 13: Admin Dashboard + Alunos

**Files:**
- Modify: `src/app/admin/dashboard/page.tsx`
- Modify: `src/app/admin/alunos/page.tsx`
- Modify: `src/app/admin/alunos/[id]/page.tsx`

**Step 1:** Aplicar substituições padrão em todos.

Em `admin/dashboard/page.tsx`, stat numbers em Bebas Neue + lime (mesmo padrão StatCard do aluno).

**Tabelas dark:**
```tsx
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
  <thead>
    <tr style={{ borderBottom: '1px solid #222' }}>
      <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', fontWeight: 500 }}>
        Nome
      </th>
      {/* ... */}
    </tr>
  </thead>
  <tbody>
    {alunos.map(aluno => (
      <tr key={aluno.id} style={{ borderBottom: '1px solid #1a1a1a', transition: 'background 0.15s' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#141414')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <td style={{ padding: '12px 16px', fontSize: 14, color: '#F5F0E8' }}>{aluno.name}</td>
        {/* ... */}
      </tr>
    ))}
  </tbody>
</table>
```

**Step 2: Verificar**

**Step 3: Commit**

```bash
git add src/app/admin/dashboard/page.tsx src/app/admin/alunos/
git commit -m "feat: dark admin dashboard and alunos pages"
```

---

## Task 14: Admin — planos, protocolos, chat

**Files:**
- Modify: `src/app/admin/planos/page.tsx`
- Modify: `src/app/admin/protocolos/page.tsx`
- Modify: `src/app/admin/chat/page.tsx`

**Step 1:** Aplicar padrão dark em cada arquivo.
- Planos: cards dark com preço em Bebas Neue
- Protocolos: lista com separadores `1px #222`
- Chat admin: mesmo padrão de bolhas do chat aluno (invertido — admin é o treinador, usa bolha `#D4FF00`)

**Step 2: Verificar**

**Step 3: Commit**

```bash
git add src/app/admin/planos/page.tsx src/app/admin/protocolos/page.tsx src/app/admin/chat/page.tsx
git commit -m "feat: dark admin planos, protocolos, chat pages"
```

---

## Task 15: Páginas restantes

**Files:**
- Modify: `src/app/checkout/page.tsx`
- Modify: `src/app/aguardando-pagamento/page.tsx`
- Modify: `src/app/ativar-conta/[token]/page.tsx`

**Step 1:** Aplicar padrão dark em cada arquivo.

`checkout/page.tsx`: formulário dark, resumo de plano em card `#141414`, botão de pagamento `.btn-primary` lime.

`aguardando-pagamento/page.tsx`: card central dark, ícone de status em #D4FF00 ou amber.

`ativar-conta/[token]/page.tsx`: card dark, feedback de sucesso/erro com badges industriais.

**Step 2: Verificar todas as rotas**

**Step 3: Commit final**

```bash
git add src/app/checkout/page.tsx src/app/aguardando-pagamento/page.tsx src/app/ativar-conta/
git commit -m "feat: dark checkout, aguardando-pagamento, ativar-conta pages"
```

---

## Checklist de Verificação Final

Antes de encerrar, verificar no browser:

- [ ] `http://localhost:3000` — landing dark, hero Bebas Neue, blob lime, animações stagger
- [ ] `http://localhost:3000/login` — card dark, inputs dark, botão lime
- [ ] `http://localhost:3000/cadastro` — mesmo padrão do login
- [ ] App aluno (após login): sidebar dark, link ativo com marcador lime
- [ ] Dashboard: stats em Bebas Neue #D4FF00
- [ ] Chat: bolhas aluno dark / treinador lime
- [ ] App admin: tabelas dark, stats Bebas Neue
- [ ] Mobile (375px): sidebar → drawer, landing → responsive dark
- [ ] `npm run build` — zero erros de TypeScript

```bash
cd frontend-japa-main && npm run build && npm run type-check
```
