# Frontend Redesign — Design Document
**Data:** 2026-03-04
**Projeto:** Japa Treinador — frontend-japa-main
**Escopo:** Redesign completo do frontend (landing, auth, app interno aluno/admin)
**Direção estética:** Editorial Esportivo Premium (Nike Training, Whoop, Centr)

---

## 1. Design System

### Paleta de Cores
Substituição completa do sistema `brand-*` azul atual por tokens dark + lime.

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0A0A0A` | Fundo principal |
| `--bg-card` | `#141414` | Cards, inputs, sidebar |
| `--bg-card-alt` | `#1a1a1a` | Hover state, cards secundários |
| `--text` | `#F5F0E8` | Texto primário |
| `--text-muted` | `#888888` | Texto secundário, placeholders |
| `--accent` | `#D4FF00` | CTA, destaque, ícones ativos, bordas de foco |
| `--accent-hover` | `#BFFF00` | Hover do accent |
| `--border` | `#222222` | Bordas sutis |
| `--border-mid` | `#333333` | Bordas médias |
| `--danger` | `#FF4D4D` | Erros, alertas críticos |
| `--success` | `#22C55E` | Confirmações, status ativo |
| `--warning` | `#F59E0B` | Avisos, estrelas |

### Tipografia
- **Display / Títulos:** `Bebas Neue` (Google Fonts) — h1, h2, h3, números grandes, labels de seção
- **Corpo / UI:** `DM Sans` (Google Fonts) — parágrafos, inputs, botões, badges, navegação
- **Remover:** Inter (atualmente em `layout.tsx`)

### Componentes Base (`globals.css`)

#### Botões
```css
.btn-primary   → bg #D4FF00, color #0A0A0A, border-radius 8px, DM Sans bold
.btn-secondary → bg transparent, border 1px #444, color #F5F0E8, border-radius 8px
.btn-ghost     → bg transparent, color #666, hover bg #141414
.btn-danger    → bg #FF4D4D, color #fff, border-radius 8px
```

#### Cards
```css
.card          → bg #141414, border 1px #222, border-radius 4px
.card-hover    → card + hover:border-color #333, hover:bg #1a1a1a
.stat-card     → card + padding 24px, flex col gap 8px
```

#### Inputs / Forms
```css
.input         → bg #141414, border 1px #333, color #F5F0E8,
                 placeholder #555, focus:border #D4FF00, focus:ring rgba(212,255,0,0.12)
.label         → DM Sans 12px, uppercase, letter-spacing 0.08em, color #888
.error-message → color #FF4D4D, font-size 12px
```

#### Badges
```css
.badge         → inline-flex, border-radius 4px (não pill), font-size 10px, uppercase
.badge-success → border 1px #22C55E, color #22C55E, bg rgba(34,197,94,0.08)
.badge-warning → border 1px #F59E0B, color #F59E0B, bg rgba(245,158,11,0.08)
.badge-danger  → border 1px #FF4D4D, color #FF4D4D, bg rgba(255,77,77,0.08)
.badge-brand   → border 1px #D4FF00, color #D4FF00, bg rgba(212,255,0,0.08)
.badge-neutral → border 1px #333, color #888, bg transparent
```

#### Utilidades
```css
.page-title    → Bebas Neue, clamp(28px,4vw,40px), color #F5F0E8, letter-spacing 0.02em
.page-subtitle → DM Sans 14px, color #888
.section-label → DM Sans 11px, uppercase, letter-spacing 0.15em, color #D4FF00
```

### Tailwind Config
- Extender `colors` com `brand.*` → tokens dark
- Adicionar `fontFamily`: `display: ['Bebas Neue']`, `sans: ['DM Sans']`
- Remover `rounded-2xl` como padrão de card — usar `rounded` (4px)
- Adicionar keyframes: `fadeUp`, `slideIn`, `pulse-accent`

---

## 2. Layout & Navegação

### Navbar (landing)
- `position: sticky`, `bg: rgba(10,10,10,0.85)`, `backdrop-filter: blur(12px)`
- Borda inferior `1px #222`
- Logo: quadrado `#D4FF00` 30×30 com "JT" em Bebas Neue + "JAPA TREINADOR" Bebas Neue 20px
- Links nav: DM Sans 11px, uppercase, `letter-spacing: 0.1em`, cor `#666` → hover `#F5F0E8`
- Botões: `btn-ghost-nav` + `btn-primary`
- Mobile: hamburger → overlay fullscreen com links em Bebas Neue 52px

### Sidebar do App Interno
- Largura: 240px desktop, 0 (drawer) mobile
- Fundo: `#0A0A0A`, borda direita `1px #222`
- Logo no topo (igual navbar)
- Links: ícone stroke 18px + DM Sans 13px, cor `#666`
- Estado ativo: fundo `#141414`, texto `#F5F0E8`, marcador `3px solid #D4FF00` na esquerda
- Hover: fundo `#141414`, texto `#aaa`
- Avatar/usuário no rodapé da sidebar

### Header do App Interno
- `bg: rgba(10,10,10,0.85)` + blur + borda inferior `1px #222`
- Título da página: Bebas Neue, `#F5F0E8`
- Breadcrumb em DM Sans `#555`
- Avatar circular no canto direito, fundo `#141414`

---

## 3. Landing Page (`src/app/page.tsx`)

Migração fiel do `landing.html` (já criado como protótipo) para Next.js/TSX.

### Mudanças técnicas
- Remover Lucide icons → SVGs inline como componentes React
- Grain noise: `<GrainOverlay />` component com SVG `feTurbulence` no `layout.tsx`
- Cursor custom: `<CustomCursor />` client component com `useEffect`, só em `pointer: fine`
- Animações: CSS puro (`animation-delay` staggerado via `style` prop), sem framer-motion

### Estrutura de seções
1. `<HeroSection />` — blob lime, badge industrial, Bebas Neue headline 2 linhas, stats horizontais
2. `<StatsBar />` — 4 números em Bebas Neue `#D4FF00`, separados por `1px #222`
3. `<HowItWorksSection />` — grid 3 colunas com gap `1px` editorial, números fantasma
4. `<FeaturesSection />` — grid 3×2 editorial, ícones stroke `#D4FF00`
5. `<PlansSection />` — 3 cards, Pro com borda `#D4FF00` e fundo `#101207`
6. `<TestimonialsSection />` — 3 cards dark
7. `<FinalCTA />` — fundo `#0d0d0d`, Bebas Neue grande
8. `<Footer />` — logo + nav links + copyright

---

## 4. Auth Pages

### Login (`src/app/(auth)/login/page.tsx`)
- Fundo: `#0A0A0A` + grain + blob lime sutil no canto superior direito
- Card central: `#141414`, borda `1px #333`, `border-radius: 4px`, max-width 420px
- Logo: marca `#D4FF00` + "JAPA TREINADOR" Bebas Neue
- Subtítulo: DM Sans `#888`
- Inputs: dark com focus `#D4FF00`
- Botão submit: `.btn-primary` (lime)
- Link "não tem conta": cor `#D4FF00`

### Cadastro (`src/app/(auth)/cadastro/page.tsx`)
- Mesmo padrão do login
- Multi-step ou single page — manter estrutura atual, só trocar visual

### Layout Auth (`src/app/(auth)/layout.tsx`)
- Remover `bg-brand-soft` → `bg: #0A0A0A`

---

## 5. App Interior

### Dashboard Aluno (`src/app/aluno/dashboard/page.tsx`)
- Greeting: "OLÁ, [NOME]" em Bebas Neue grande, subtítulo DM Sans `#888`
- `StatCard`: número em Bebas Neue 36px `#D4FF00`, label DM Sans `#888`, ícone stroke `#D4FF00`
- Cards de ação rápida: fundo `#141414`, hover `#1a1a1a`, borda `1px #222`
- Alertas: borda `1px` colorida, fundo `rgba` sutil (sem fundo sólido)
- Badge "Ativo": `.badge-success` industrial

### Treino (`src/app/aluno/treino/page.tsx`)
- Layout editorial, exercícios em lista com separadores `1px #222`
- Números de série/repetição em Bebas Neue `#D4FF00`

### Refeições (`src/app/aluno/refeicoes/page.tsx`)
- Cards de refeição: fundo `#141414`, borda `1px #222`
- Calorias em Bebas Neue `#D4FF00`

### Chat (`src/app/aluno/chat/page.tsx`)
- Fundo `#0A0A0A`
- Bolha aluno: fundo `#1a1a1a`, texto `#F5F0E8`
- Bolha treinador: fundo `#D4FF00`, texto `#0A0A0A`
- Input de mensagem: `.input` dark

### Evolução (`src/app/aluno/evolucao/page.tsx`)
- Upload zone: borda `2px dashed #333`, hover `#D4FF00`
- Grid de fotos com cards `#141414`

### Metas (`src/app/aluno/metas/page.tsx`)
- Progress bars: track `#222`, fill `#D4FF00`
- Status badges: industrial style

### Admin Dashboard (`src/app/admin/dashboard/page.tsx`)
- Stats em Bebas Neue, grid editorial
- Tabelas: header DM Sans uppercase `#555`, linhas `1px #222`, hover `#141414`

### Admin Alunos/Planos/Protocolos
- Tabelas dark, filtros com inputs dark
- Badges de status industrial

---

## 6. Arquivos a Modificar

| Arquivo | Tipo de mudança |
|---|---|
| `src/app/layout.tsx` | Trocar Inter → Bebas Neue + DM Sans, grain overlay, cursor |
| `src/app/globals.css` | Reescrever design system completo |
| `tailwind.config.*` | Novos tokens de cor e fonte |
| `src/app/page.tsx` | Redesign completo (landing) |
| `src/components/landing/MobileMenu.tsx` | Dark + Bebas Neue |
| `src/app/(auth)/layout.tsx` | Fundo dark |
| `src/app/(auth)/login/page.tsx` | Dark card, inputs lime |
| `src/app/(auth)/cadastro/page.tsx` | Dark card, inputs lime |
| `src/app/aluno/layout.tsx` | Nova sidebar dark |
| `src/app/aluno/dashboard/page.tsx` | StatCards dark, greeting |
| `src/app/aluno/treino/page.tsx` | Editorial dark |
| `src/app/aluno/refeicoes/page.tsx` | Cards dark |
| `src/app/aluno/chat/page.tsx` | Bolhas dark + lime |
| `src/app/aluno/evolucao/page.tsx` | Upload zone dark |
| `src/app/aluno/metas/page.tsx` | Progress bars lime |
| `src/app/aluno/anamnese/page.tsx` | Form dark |
| `src/app/aluno/planos/page.tsx` | Cards dark |
| `src/app/admin/layout.tsx` | Sidebar dark admin |
| `src/app/admin/dashboard/page.tsx` | Stats + tabelas dark |
| `src/app/admin/alunos/page.tsx` | Tabela dark |
| `src/app/admin/alunos/[id]/page.tsx` | Perfil dark |
| `src/app/admin/planos/page.tsx` | Cards dark |
| `src/app/admin/protocolos/page.tsx` | Lista dark |
| `src/app/admin/chat/page.tsx` | Chat dark |
| `src/app/checkout/page.tsx` | Form dark |
| `src/app/aguardando-pagamento/page.tsx` | Dark |

---

## 7. Decisões de Não-Escopo

- Sem framer-motion — animações CSS puras para evitar bundle overhead
- Sem mudanças na lógica de negócio, API calls, autenticação
- Sem novos componentes de terceiros — apenas redesign dos existentes
- Sem mudança na estrutura de rotas
