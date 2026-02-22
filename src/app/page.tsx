import Link from 'next/link'
import {
  CheckCircle2,
  Dumbbell,
  Utensils,
  MessageCircle,
  Camera,
  BarChart3,
  ClipboardList,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Clock,
  Users,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'
import MobileMenu from '@/components/landing/MobileMenu'

const stats = [
  { value: '500+', label: 'Alunos transformados' },
  { value: '98%', label: 'Taxa de satisfação' },
  { value: '5+', label: 'Anos de experiência' },
  { value: '12k+', label: 'Treinos entregues' },
]

const features = [
  {
    icon: Dumbbell,
    title: 'Treino 100% personalizado',
    desc: 'Planilha de treino montada de acordo com seu objetivo, nível e disponibilidade de tempo.',
  },
  {
    icon: Utensils,
    title: 'Plano alimentar',
    desc: 'Dieta elaborada com base na sua anamnese e preferências alimentares, sem sofrimento.',
  },
  {
    icon: MessageCircle,
    title: 'Suporte direto via chat',
    desc: 'Tire dúvidas, receba ajustes e mantenha o foco com suporte exclusivo dentro da plataforma.',
  },
  {
    icon: Camera,
    title: 'Acompanhamento de evolução',
    desc: 'Envie fotos e medidas periodicamente para monitorarmos seu progresso e ajustar a estratégia.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard de resultados',
    desc: 'Visualize sua evolução em gráficos de peso, gordura corporal e performance ao longo do tempo.',
  },
  {
    icon: ClipboardList,
    title: 'Anamnese detalhada',
    desc: 'Avaliação física e de saúde completa para garantir um protocolo seguro e eficiente.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Escolha seu plano',
    desc: 'Selecione o plano ideal, preencha seus dados e realize o pagamento de forma segura pela InfinityPay.',
  },
  {
    number: '02',
    title: 'Ative sua conta',
    desc: 'Após a confirmação do pagamento, você recebe um e-mail para criar sua senha e acessar a plataforma.',
  },
  {
    number: '03',
    title: 'Receba e execute',
    desc: 'Treino, dieta e suporte completo. Execute o protocolo e acompanhe sua evolução em tempo real.',
  },
]

const plans = [
  {
    name: 'Starter',
    price: 'R$ 149',
    period: '/mês',
    desc: 'Ideal para quem está começando a jornada fitness.',
    highlight: false,
    features: [
      'Planilha de treino personalizada',
      'Plano alimentar básico',
      'Suporte via chat (48h)',
      'Avaliação mensal',
      'Acesso à plataforma',
    ],
  },
  {
    name: 'Pro',
    price: 'R$ 249',
    period: '/mês',
    desc: 'O mais escolhido para resultados consistentes.',
    highlight: true,
    features: [
      'Treino + dieta avançados',
      'Suporte prioritário (24h)',
      'Avaliação quinzenal',
      'Ajustes semanais de protocolo',
      'Acompanhamento de fotos',
      'Dashboard de evolução',
    ],
  },
  {
    name: 'Elite',
    price: 'R$ 399',
    period: '/mês',
    desc: 'Para quem quer o máximo de atenção e resultado.',
    highlight: false,
    features: [
      'Tudo do Pro',
      'Suporte ilimitado (resposta em horas)',
      'Avaliações semanais',
      'Videochamada mensal',
      'Protocolo de suplementação',
      'Acesso vitalício às gravações',
    ],
  },
]

const testimonials = [
  {
    name: 'Ana Carolina S.',
    role: 'Perdeu 18 kg em 6 meses',
    text: 'Tentei emagrecer sozinha por anos. Com o acompanhamento do Japa, em 6 meses perdi 18 kg e finalmente aprendi a comer de forma saudável sem deixar de viver.',
    stars: 5,
  },
  {
    name: 'Rodrigo M.',
    role: 'Ganhou 8 kg de massa em 4 meses',
    text: 'Meu treino era aleatório e sem resultado. Depois da consultoria, ganhei 8 kg de massa magra em 4 meses com uma dieta que cabe no meu orçamento. Incrível!',
    stars: 5,
  },
  {
    name: 'Fernanda L.',
    role: 'Definição corporal em 3 meses',
    text: 'O suporte pelo chat faz toda a diferença. Qualquer dúvida, qualquer ajuste — resposta rápida e certeira. Me sinto acompanhada em cada passo da minha jornada.',
    stars: 5,
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
      ))}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-white">

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-xl bg-brand-gradient flex items-center justify-center">
              <span className="text-white font-bold text-xs">JT</span>
            </div>
            <span className="font-bold text-neutral-900 text-sm">Japa Treinador</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: '#como-funciona', label: 'Como funciona' },
              { href: '#beneficios', label: 'Benefícios' },
              { href: '#planos', label: 'Planos' },
              { href: '#depoimentos', label: 'Depoimentos' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm text-neutral-600 hover:text-brand-600 font-medium rounded-lg hover:bg-brand-50 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:inline-flex btn-ghost text-sm py-1.5 px-3">
              Entrar
            </Link>
            <Link href="/checkout" className="btn-primary text-sm py-1.5 px-4">
              Começar agora
              <ChevronRight size={14} />
            </Link>
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-soft pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-100 rounded-full opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-50 rounded-full opacity-40 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
            <Zap size={12} className="fill-brand-500 text-brand-500" />
            Consultoria online personalizada
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 text-balance leading-tight mb-6">
            Transforme seu corpo com<br />
            <span className="text-brand-500">acompanhamento profissional</span>
          </h1>

          <p className="text-lg text-neutral-500 max-w-2xl mx-auto mb-10 text-balance">
            Treino, dieta e suporte personalizados direto na sua tela. Resultados reais,
            sem academias lotadas e no seu ritmo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/checkout" className="btn-primary text-base px-8 py-3">
              Quero começar agora
              <ArrowRight size={18} />
            </Link>
            <a href="#como-funciona" className="btn-secondary text-base px-8 py-3">
              Como funciona
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-neutral-500">
            {[
              { icon: Shield, label: 'Sem fidelidade' },
              { icon: Clock, label: 'Início imediato' },
              { icon: Users, label: '+500 alunos ativos' },
              { icon: TrendingUp, label: '98% de satisfação' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon size={14} className="text-brand-500" /> {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-500 mb-1">{stat.value}</div>
                <div className="text-sm text-neutral-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-brand-600 font-semibold text-sm mb-2">Simples e eficaz</p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Como funciona</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Em 3 passos simples você começa a transformar seu corpo com suporte profissional completo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-gradient shadow-lg mb-6 mx-auto">
                  <span className="text-white font-bold text-2xl">{step.number}</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-sm text-neutral-500 max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/checkout" className="btn-primary px-8 py-3 text-base">
              Escolher meu plano
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="beneficios" className="py-20 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-brand-600 font-semibold text-sm mb-2">Tudo que você precisa</p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              O que está incluso na consultoria
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Uma solução completa para alcançar seus objetivos com segurança, suporte e resultados reais.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="card p-6 hover:shadow-card-hover transition-shadow">
                  <div className="h-11 w-11 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                    <Icon size={22} className="text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-brand-600 font-semibold text-sm mb-2">Sem surpresas</p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Planos transparentes</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Escolha o plano que melhor se encaixa no seu momento. Sem contratos longos, cancele quando quiser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 flex flex-col gap-5 ${
                  plan.highlight
                    ? 'bg-brand-gradient border-transparent shadow-xl'
                    : 'bg-white border-neutral-200 shadow-card'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                      Mais popular
                    </span>
                  </div>
                )}

                <div>
                  <h3 className={`font-bold text-lg mb-1 ${plan.highlight ? 'text-white' : 'text-neutral-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.highlight ? 'text-brand-200' : 'text-neutral-500'}`}>
                    {plan.desc}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-brand-600'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlight ? 'text-brand-200' : 'text-neutral-400'}`}>
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        size={16}
                        className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-white/80' : 'text-brand-500'}`}
                      />
                      <span className={plan.highlight ? 'text-white/90' : 'text-neutral-600'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/checkout"
                  className={`mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    plan.highlight
                      ? 'bg-white text-brand-700 hover:bg-brand-50'
                      : 'btn-primary'
                  }`}
                >
                  Começar com {plan.name}
                  <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-neutral-400 mt-8">
            Preços ilustrativos. Os valores finais são exibidos após o cadastro na plataforma.
          </p>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="py-20 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-brand-600 font-semibold text-sm mb-2">Resultados reais</p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">O que nossos alunos dizem</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6 flex flex-col gap-4">
                <StarRating count={t.stars} />
                <p className="text-sm text-neutral-600 leading-relaxed flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-neutral-900 text-sm">{t.name}</div>
                  <div className="text-xs text-brand-600 font-medium mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-brand-gradient">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
            Pronto para começar sua transformação?
          </h2>
          <p className="text-brand-200 mb-10 text-lg">
            Mais de 500 pessoas já mudaram de vida com a consultoria do Japa. Agora é a sua vez.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-50 transition-colors text-base"
            >
              Começar agora
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/20 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-white/30 transition-colors text-base"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-brand-gradient flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs">JT</span>
              </div>
              <div>
                <div className="font-bold text-white text-sm">Japa Treinador</div>
                <div className="text-xs text-neutral-500">Consultoria Online Fitness</div>
              </div>
            </div>

            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
              <a href="#beneficios" className="hover:text-white transition-colors">Benefícios</a>
              <a href="#planos" className="hover:text-white transition-colors">Planos</a>
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
              <Link href="/checkout" className="hover:text-white transition-colors">Começar</Link>
            </nav>

            <p className="text-xs text-neutral-600 text-center">
              © {new Date().getFullYear()} Japa Treinador. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
