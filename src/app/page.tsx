'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Dumbbell,
  Utensils,
  MessageCircle,
  Camera,
  BarChart3,
  ClipboardList,
} from 'lucide-react'
import MobileMenu from '@/components/landing/MobileMenu'

// ── SVG icons ────────────────────────────────────────────────
function IconArrow({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
function IconShield() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function IconTrend() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="#5B8CF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, marginTop: 2 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function IconStar() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

// ── Data ─────────────────────────────────────────────────────
const stats = [
  { value: '500+', label: 'Alunos transformados' },
  { value: '98%',  label: 'Taxa de satisfação' },
  { value: '5+',   label: 'Anos de experiência' },
  { value: '12k+', label: 'Treinos entregues' },
]

const features = [
  { icon: Dumbbell,      title: 'Treino 100% personalizado',  desc: 'Planilha de treino montada de acordo com seu objetivo, nível e disponibilidade de tempo.' },
  { icon: Utensils,      title: 'Plano alimentar',            desc: 'Dieta elaborada com base na sua anamnese e preferências alimentares, sem sofrimento.' },
  { icon: MessageCircle, title: 'Suporte direto via chat',    desc: 'Tire dúvidas, receba ajustes e mantenha o foco com suporte exclusivo dentro da plataforma.' },
  { icon: Camera,        title: 'Acompanhamento de evolução', desc: 'Envie fotos e medidas periodicamente para monitorarmos seu progresso e ajustar a estratégia.' },
  { icon: BarChart3,     title: 'Dashboard de resultados',    desc: 'Visualize sua evolução em gráficos de peso, gordura corporal e performance ao longo do tempo.' },
  { icon: ClipboardList, title: 'Anamnese detalhada',         desc: 'Avaliação física e de saúde completa para garantir um protocolo seguro e eficiente.' },
]

const steps = [
  { number: '01', title: 'Escolha seu plano', desc: 'Selecione o plano ideal, preencha seus dados e realize o pagamento de forma segura pela InfinityPay.' },
  { number: '02', title: 'Ative sua conta',   desc: 'Após a confirmação do pagamento, você recebe um e-mail para criar sua senha e acessar a plataforma.' },
  { number: '03', title: 'Receba e execute',  desc: 'Treino, dieta e suporte completo. Execute o protocolo e acompanhe sua evolução em tempo real.' },
]

const plans = [
  {
    name: 'Starter', price: 'R$ 149', period: '/mês',
    desc: 'Ideal para quem está começando a jornada fitness.',
    highlight: false,
    features: ['Planilha de treino personalizada', 'Plano alimentar básico', 'Suporte via chat (48h)', 'Avaliação mensal', 'Acesso à plataforma'],
  },
  {
    name: 'Pro', price: 'R$ 249', period: '/mês',
    desc: 'O mais escolhido para resultados consistentes.',
    highlight: true,
    features: ['Treino + dieta avançados', 'Suporte prioritário (24h)', 'Avaliação quinzenal', 'Ajustes semanais de protocolo', 'Acompanhamento de fotos', 'Dashboard de evolução'],
  },
  {
    name: 'Elite', price: 'R$ 399', period: '/mês',
    desc: 'Para quem quer o máximo de atenção e resultado.',
    highlight: false,
    features: ['Tudo do Pro', 'Suporte ilimitado (resposta em horas)', 'Avaliações semanais', 'Videochamada mensal', 'Protocolo de suplementação', 'Acesso vitalício às gravações'],
  },
]

const testimonials = [
  { name: 'Ana Carolina S.', role: 'Perdeu 18 kg em 6 meses',       stars: 5, text: 'Tentei emagrecer sozinha por anos. Com o acompanhamento do Japa, em 6 meses perdi 18 kg e finalmente aprendi a comer de forma saudável sem deixar de viver.' },
  { name: 'Rodrigo M.',       role: 'Ganhou 8 kg de massa em 4 meses', stars: 5, text: 'Meu treino era aleatório e sem resultado. Depois da consultoria, ganhei 8 kg de massa magra em 4 meses com uma dieta que cabe no meu orçamento. Incrível!' },
  { name: 'Fernanda L.',      role: 'Definição corporal em 3 meses',  stars: 5, text: 'O suporte pelo chat faz toda a diferença. Qualquer dúvida, qualquer ajuste — resposta rápida e certeira. Me sinto acompanhada em cada passo da minha jornada.' },
]

// ── Shared styles ─────────────────────────────────────────────
const C = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' } as React.CSSProperties
const LOGO_MARK = { width: 30, height: 30, background: '#5B8CF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as React.CSSProperties
const SEC_LBL   = { fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#5B8CF5', marginBottom: 12 }
const SEC_TITLE = { fontFamily: 'var(--font-display)', fontSize: 'clamp(38px,5vw,58px)' as string, color: '#F5F0E8', marginBottom: 18, lineHeight: 1 } as React.CSSProperties
const SEC_DESC  = { fontSize: 15, color: '#888', maxWidth: 460, margin: '0 auto', lineHeight: 1.75 } as React.CSSProperties

// ── Page ─────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ background: '#0A0A0A', minHeight: '100dvh' }}>

      {/* ── NAVBAR ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 500,
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #222',
      }}>
        <div style={C}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, gap: 24 }}>

            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={LOGO_MARK}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#0A0A0A', letterSpacing: '0.05em' }}>JT</span>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#F5F0E8', letterSpacing: '0.06em' }}>Japa Treinador</span>
            </Link>

            <nav className="hidden lg:block">
              <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
                {[
                  { href: '#como-funciona', label: 'Como funciona' },
                  { href: '#beneficios',    label: 'Benefícios' },
                  { href: '#planos',        label: 'Planos' },
                  { href: '#depoimentos',   label: 'Depoimentos' },
                ].map(item => (
                  <li key={item.href}>
                    <a href={item.href} style={{ display: 'block', padding: '6px 14px', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#F5F0E8')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#666')}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <Link href="/login" className="hidden sm:block btn-ghost" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Entrar</Link>
              <Link href="/checkout" className="btn-primary" style={{ fontSize: 13 }}>Começar agora</Link>
              <MobileMenu />
            </div>

          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        <div style={C}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, alignItems: 'center', minHeight: '92vh' }}>

            {/* Left — Text */}
            <div className="hero-text" style={{ padding: '100px 0 80px', paddingRight: 40 }}>
              <div className="fade-up-item" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #5B8CF5', color: '#5B8CF5', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', padding: '6px 14px', borderRadius: 4, marginBottom: 28, animationDelay: '0.08s' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5B8CF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                Consultoria online personalizada
              </div>

              <h1 className="fade-up-item" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(60px, 7vw, 110px)', lineHeight: 0.93, letterSpacing: '0.025em', textTransform: 'uppercase', marginBottom: 24, animationDelay: '0.22s' }}>
                <span style={{ display: 'block', color: '#F5F0E8' }}>Transforme</span>
                <span style={{ display: 'block', color: '#5B8CF5' }}>seu corpo</span>
              </h1>

              <p className="fade-up-item" style={{ fontSize: 17, color: '#888', lineHeight: 1.72, maxWidth: 460, marginBottom: 40, animationDelay: '0.38s' }}>
                Treino, dieta e suporte personalizados direto na sua tela. Resultados reais, sem academias lotadas e no seu ritmo.
              </p>

              <div className="fade-up-item" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 44, animationDelay: '0.52s' }}>
                <Link href="/checkout" className="btn-primary" style={{ fontSize: 15, padding: '15px 28px' }}>Quero começar agora <IconArrow /></Link>
                <a href="#como-funciona" className="btn-secondary" style={{ fontSize: 15, padding: '15px 28px' }}>Como funciona</a>
              </div>

              <div className="fade-up-item" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', animationDelay: '0.68s' }}>
                {[
                  { icon: <IconShield />, label: 'Sem fidelidade' },
                  { icon: <IconClock />,  label: 'Início imediato' },
                  { icon: <IconUsers />,  label: '+500 alunos' },
                  { icon: <IconTrend />,  label: '98% satisfação' },
                ].map((s, i, arr) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#5a5a5a', padding: '0 16px', paddingLeft: i === 0 ? 0 : undefined, borderRight: i < arr.length - 1 ? '1px solid #2a2a2a' : 'none' }}>
                    {s.icon} {s.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Trainer photo */}
            <div className="hero-photo" style={{ position: 'relative', height: '92vh', overflow: 'hidden' }}>
              <Image
                src="/japatreinador.jpeg"
                alt="Japa Treinador"
                fill
                priority
                style={{ objectFit: 'cover', objectPosition: '50% 25%' }}
              />
              {/* Gradient fade left into background */}
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0A0A0A 0%, transparent 28%)' }} />
              {/* Gradient fade bottom */}
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0A0A0A 0%, transparent 20%)' }} />
              {/* Gradient fade top */}
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0A0A0A 0%, transparent 18%)' }} />
              {/* Subtle blue tint overlay */}
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(91,140,245,0.04)' }} />
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ borderTop: '1px solid #222', borderBottom: '1px solid #222', padding: '52px 0' }}>
        <div style={C}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '0 20px', borderRight: i < stats.length - 1 ? '1px solid #222' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 58, lineHeight: 1, color: '#5B8CF5', letterSpacing: '0.02em' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" style={{ padding: '100px 0' }}>
        <div style={C}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={SEC_LBL}>Simples e eficaz</div>
            <h2 style={SEC_TITLE}>Como funciona</h2>
            <p style={SEC_DESC}>Em 3 passos simples você começa a transformar seu corpo com suporte profissional completo.</p>
          </div>

          {/* Steps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, position: 'relative' }}>

            {/* Connecting line */}
            <div aria-hidden="true" style={{ position: 'absolute', top: 36, left: '16.6%', right: '16.6%', height: 1, background: 'linear-gradient(to right, transparent, #5B8CF5 20%, #5B8CF5 80%, transparent)', pointerEvents: 'none' }} />

            {steps.map((step, i) => (
              <div key={step.number} style={{ padding: '0 32px 0', textAlign: 'center', position: 'relative' }}>

                {/* Number circle */}
                <div style={{
                  width: 72, height: 72,
                  borderRadius: '50%',
                  border: '2px solid #5B8CF5',
                  background: 'rgba(91,140,245,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 32px',
                  position: 'relative', zIndex: 1,
                  boxShadow: '0 0 24px rgba(91,140,245,0.2)',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#5B8CF5', letterSpacing: '0.05em' }}>{step.number}</span>
                </div>

                {/* Card */}
                <div style={{
                  background: '#141414',
                  border: '1px solid #222',
                  borderTop: '2px solid #5B8CF5',
                  padding: '32px 28px 36px',
                }}>
                  {/* Step label */}
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#5B8CF5', marginBottom: 12, fontFamily: 'var(--font-sans)' }}>
                    Passo {step.number}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#F5F0E8', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1, marginBottom: 14 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Link href="/checkout" className="btn-primary" style={{ fontSize: 15, padding: '15px 32px' }}>Escolher meu plano <IconArrow /></Link>
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ── */}
      <section id="beneficios" style={{ background: '#0d0d0d', padding: '100px 0' }}>
        <div style={C}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={SEC_LBL}>Tudo que você precisa</div>
            <h2 style={SEC_TITLE}>O que está incluso</h2>
            <p style={SEC_DESC}>Uma solução completa para alcançar seus objetivos com segurança, suporte e resultados reais.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  style={{
                    background: '#111',
                    border: '1px solid #1e1e1e',
                    padding: '36px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                    transition: 'border-color 0.2s, background 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = '#5B8CF5'
                    el.style.background = '#0f1520'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = '#1e1e1e'
                    el.style.background = '#111'
                  }}
                >
                  {/* Icon box */}
                  <div style={{
                    width: 52,
                    height: 52,
                    background: 'rgba(91,140,245,0.1)',
                    border: '1px solid rgba(91,140,245,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={24} strokeWidth={1.5} style={{ color: '#5B8CF5' }} />
                  </div>

                  {/* Text */}
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      color: '#F5F0E8',
                      letterSpacing: '0.04em',
                      lineHeight: 1,
                      marginBottom: 10,
                      textTransform: 'uppercase',
                    }}>{f.title}</div>
                    <p style={{ fontSize: 14, color: '#777', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                  </div>

                  {/* Bottom accent line */}
                  <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #1e1e1e' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#5B8CF5' }}>
                      {['Treino', 'Nutrição', 'Suporte', 'Evolução', 'Análise', 'Avaliação'][i]}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PLANOS ── */}
      <section id="planos" style={{ padding: '100px 0', background: '#080808' }}>
        <div style={C}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={SEC_LBL}>Sem surpresas</div>
            <h2 style={SEC_TITLE}>Planos transparentes</h2>
            <p style={SEC_DESC}>Escolha o plano que melhor se encaixa no seu momento. Sem contratos longos, cancele quando quiser.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, alignItems: 'stretch' }}>
            {plans.map(plan => (
              <div
                key={plan.name}
                style={{
                  border:     plan.highlight ? '1px solid #5B8CF5' : '1px solid #1e1e1e',
                  background: plan.highlight ? '#0c1120' : '#111',
                  position:   'relative',
                  display:    'flex',
                  flexDirection: 'column',
                  overflow:   'hidden',
                }}
              >
                {/* Top accent bar for highlight */}
                {plan.highlight && (
                  <div style={{ height: 3, background: 'linear-gradient(90deg, #5B8CF5, #4A7CF3)', width: '100%' }} />
                )}

                <div style={{ padding: '36px 36px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 38,
                      letterSpacing: '0.06em',
                      lineHeight: 1,
                      color: plan.highlight ? '#5B8CF5' : '#F5F0E8',
                    }}>{plan.name}</div>
                    {plan.highlight && (
                      <div style={{
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: '#5B8CF5',
                        background: 'rgba(91,140,245,0.12)',
                        border: '1px solid rgba(91,140,245,0.3)',
                        padding: '4px 10px',
                        alignSelf: 'center',
                      }}>Mais popular</div>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: '#555', marginBottom: 28, fontFamily: 'var(--font-sans)' }}>{plan.desc}</div>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 32, paddingBottom: 28, borderBottom: '1px solid #1e1e1e' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 56, lineHeight: 1, color: plan.highlight ? '#5B8CF5' : '#F5F0E8', letterSpacing: '-0.01em' }}>{plan.price}</span>
                    <span style={{ fontSize: 13, color: '#444' }}>{plan.period}</span>
                  </div>

                  {/* Features */}
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, flex: 1, marginBottom: 32 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: '#aaa', lineHeight: 1.4 }}>
                        <span style={{ color: plan.highlight ? '#5B8CF5' : '#444', flexShrink: 0, marginTop: 1 }}>
                          <IconCheck />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div style={{ padding: '0 36px 36px' }}>
                  <Link
                    href="/checkout"
                    style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      gap:            8,
                      padding:        '14px 20px',
                      background:     plan.highlight ? '#5B8CF5' : 'transparent',
                      border:         plan.highlight ? '1px solid #5B8CF5' : '1px solid #2a2a2a',
                      color:          plan.highlight ? '#fff' : '#888',
                      fontSize:       14,
                      fontWeight:     700,
                      textDecoration: 'none',
                      letterSpacing:  '0.04em',
                      transition:     'all 0.2s',
                      fontFamily:     'var(--font-sans)',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLAnchorElement
                      if (!plan.highlight) {
                        el.style.borderColor = '#5B8CF5'
                        el.style.color = '#F5F0E8'
                      } else {
                        el.style.background = '#4A7CF3'
                      }
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLAnchorElement
                      if (!plan.highlight) {
                        el.style.borderColor = '#2a2a2a'
                        el.style.color = '#888'
                      } else {
                        el.style.background = '#5B8CF5'
                      }
                    }}
                  >
                    Começar com {plan.name} <IconArrow size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#333', marginTop: 28, letterSpacing: '0.04em' }}>
            Preços ilustrativos. Os valores finais são exibidos após o cadastro na plataforma.
          </p>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section id="depoimentos" style={{ background: '#0A0A0A', padding: '100px 0' }}>
        <div style={C}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={SEC_LBL}>Resultados reais</div>
            <h2 style={SEC_TITLE}>O que nossos alunos dizem</h2>
            {/* Rating summary */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 20, padding: '10px 20px', border: '1px solid #1e1e1e', background: '#111' }}>
              <div style={{ display: 'flex', gap: 3 }}>{Array.from({ length: 5 }).map((_, i) => <IconStar key={i} />)}</div>
              <span style={{ fontSize: 13, color: '#888', fontFamily: 'var(--font-sans)' }}>
                <span style={{ color: '#F5F0E8', fontWeight: 600 }}>5.0</span> · Mais de 500 alunos transformados
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                style={{
                  border:        '1px solid #1a1a1a',
                  background:    '#111',
                  display:       'flex',
                  flexDirection: 'column',
                  gap:           0,
                  overflow:      'hidden',
                  position:      'relative',
                }}
              >
                {/* Large quote mark */}
                <div style={{
                  position:   'absolute',
                  top:        16,
                  right:      24,
                  fontFamily: 'var(--font-display)',
                  fontSize:   120,
                  lineHeight: 1,
                  color:      'rgba(91,140,245,0.06)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}>"</div>

                <div style={{ padding: '36px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: t.stars }).map((_, j) => <IconStar key={j} />)}
                  </div>

                  {/* Quote */}
                  <p style={{
                    fontSize:   15,
                    color:      '#bbb',
                    lineHeight: 1.75,
                    flex:       1,
                    margin:     0,
                    fontStyle:  'italic',
                  }}>&ldquo;{t.text}&rdquo;</p>
                </div>

                {/* Author footer */}
                <div style={{
                  padding:    '20px 32px',
                  borderTop:  '1px solid #1a1a1a',
                  background: '#0d0d0d',
                  display:    'flex',
                  alignItems: 'center',
                  gap:        14,
                }}>
                  {/* Avatar initials */}
                  <div style={{
                    width:           40,
                    height:          40,
                    background:      'rgba(91,140,245,0.12)',
                    border:          '1px solid rgba(91,140,245,0.25)',
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    flexShrink:      0,
                    fontFamily:      'var(--font-display)',
                    fontSize:        16,
                    color:           '#5B8CF5',
                    letterSpacing:   '0.04em',
                  }}>
                    {t.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F0E8', fontFamily: 'var(--font-sans)' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#5B8CF5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2, fontFamily: 'var(--font-sans)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <div style={{ background: '#0A0A0A', borderTop: '1px solid #1a1a1a', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{
          position:     'absolute',
          top:          '50%',
          left:         '50%',
          transform:    'translate(-50%, -50%)',
          width:        700,
          height:       400,
          background:   'radial-gradient(ellipse at center, rgba(91,140,245,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ ...C, position: 'relative', zIndex: 1 }}>
          {/* Border box */}
          <div style={{
            border:   '1px solid #1e1e1e',
            background: '#0d0d0d',
            padding:  'clamp(48px, 7vw, 80px) clamp(32px, 6vw, 80px)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Corner accents */}
            <div style={{ position: 'absolute', top: 0,    left: 0,  width: 40, height: 2, background: '#5B8CF5' }} />
            <div style={{ position: 'absolute', top: 0,    left: 0,  width: 2,  height: 40, background: '#5B8CF5' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 40, height: 2, background: '#5B8CF5' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 2,  height: 40, background: '#5B8CF5' }} />

            <div style={SEC_LBL}>Próximo passo</div>

            <h2 style={{
              fontFamily:    'var(--font-display)',
              fontSize:      'clamp(46px, 6.5vw, 88px)',
              lineHeight:    0.95,
              textTransform: 'uppercase',
              color:         '#F5F0E8',
              margin:        '16px auto 24px',
              maxWidth:      760,
              letterSpacing: '0.02em',
            }}>
              Pronto para começar sua transformação?
            </h2>

            <p style={{ fontSize: 16, color: '#666', marginBottom: 48, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.75 }}>
              Mais de 500 pessoas já mudaram de vida com a consultoria do Japa. Agora é a sua vez.
            </p>

            {/* Social proof pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
              {[
                { label: '+500 alunos' },
                { label: 'Suporte 24h' },
                { label: 'Cancele quando quiser' },
                { label: 'Resultado garantido' },
              ].map(item => (
                <div key={item.label} style={{
                  display:     'flex',
                  alignItems:  'center',
                  gap:         7,
                  padding:     '7px 14px',
                  border:      '1px solid #1e1e1e',
                  background:  '#111',
                  fontSize:    12,
                  color:       '#888',
                  fontFamily:  'var(--font-sans)',
                  letterSpacing: '0.03em',
                }}>
                  <span style={{ color: '#5B8CF5', fontSize: 14, lineHeight: 1 }}>✓</span>
                  {item.label}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              <Link
                href="/checkout"
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  gap:            10,
                  padding:        '16px 36px',
                  background:     '#5B8CF5',
                  border:         '1px solid #5B8CF5',
                  color:          '#fff',
                  fontSize:       15,
                  fontWeight:     700,
                  textDecoration: 'none',
                  fontFamily:     'var(--font-sans)',
                  letterSpacing:  '0.02em',
                  transition:     'background 0.2s, transform 0.15s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = '#4A7CF3'
                  el.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = '#5B8CF5'
                  el.style.transform = 'scale(1)'
                }}
              >
                Começar agora <IconArrow />
              </Link>
              <Link
                href="/login"
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  gap:            10,
                  padding:        '16px 36px',
                  background:     'transparent',
                  border:         '1px solid #2a2a2a',
                  color:          '#888',
                  fontSize:       15,
                  fontWeight:     600,
                  textDecoration: 'none',
                  fontFamily:     'var(--font-sans)',
                  transition:     'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = '#5B8CF5'
                  el.style.color = '#F5F0E8'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = '#2a2a2a'
                  el.style.color = '#888'
                }}
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0A0A0A', borderTop: '1px solid #222', padding: '44px 0' }}>
        <div style={C}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={LOGO_MARK}><span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#0A0A0A' }}>JT</span></div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: '#F5F0E8' }}>Japa Treinador</div>
                <div style={{ fontSize: 10, color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 1 }}>Consultoria Online Fitness</div>
              </div>
            </Link>
            <nav style={{ display: 'flex', flexWrap: 'wrap' }}>
              {[
                { href: '#como-funciona', label: 'Como funciona' },
                { href: '#beneficios',    label: 'Benefícios' },
                { href: '#planos',        label: 'Planos' },
              ].map(item => (
                <a key={item.href} href={item.href} style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#444', textDecoration: 'none', padding: '4px 14px', borderRight: '1px solid #222', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F5F0E8')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#444')}>
                  {item.label}
                </a>
              ))}
              <Link href="/login"    style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#444', textDecoration: 'none', padding: '4px 14px', borderRight: '1px solid #222' }}>Login</Link>
              <Link href="/checkout" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#444', textDecoration: 'none', padding: '4px 14px' }}>Começar</Link>
            </nav>
            <div style={{ fontSize: 11, color: '#333', letterSpacing: '0.04em' }}>© {new Date().getFullYear()} Japa Treinador. Todos os direitos reservados.</div>
          </div>
        </div>
      </footer>

    </div>
  )
}
