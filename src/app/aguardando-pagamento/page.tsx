'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Clock, Mail, ExternalLink } from 'lucide-react'

export default function AguardandoPagamentoPage() {
  const searchParams = useSearchParams()

  const receiptUrl = searchParams.get('receipt_url')
  const orderNsu = searchParams.get('order_nsu')
  const slug = searchParams.get('slug')
  const captureMethod = searchParams.get('capture_method')
  const transactionNsu = searchParams.get('transaction_nsu')

  const details = useMemo(() => {
    const parts: Array<{ label: string; value: string }> = []
    if (orderNsu) parts.push({ label: 'Pedido', value: orderNsu })
    if (captureMethod) parts.push({ label: 'Método', value: captureMethod })
    if (slug) parts.push({ label: 'Fatura', value: slug })
    if (transactionNsu) parts.push({ label: 'Transação', value: transactionNsu })
    return parts
  }, [orderNsu, captureMethod, slug, transactionNsu])

  return (
    <main className="min-h-dvh flex items-center justify-center bg-brand-soft px-4 py-12">
      <div className="w-full max-w-md animate-fade-in text-center">

        {/* Logo */}
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-lg mb-6">
          <span className="text-white font-bold text-xl">JT</span>
        </div>

        {/* Ícone de status */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
            <Clock size={36} className="text-amber-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Aguardando pagamento</h1>
        <p className="text-neutral-500 text-sm mb-6">
          Se você já finalizou o pagamento, aguarde alguns instantes para a confirmação automática.
        </p>

        {(receiptUrl || details.length > 0) && (
          <div className="card p-4 text-left space-y-3 mb-6">
            <p className="text-sm font-semibold text-neutral-800">Detalhes do pagamento</p>
            {details.length > 0 && (
              <div className="space-y-2">
                {details.map((d) => (
                  <div key={d.label} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-neutral-500">{d.label}</span>
                    <span className="text-xs text-neutral-700 font-medium truncate max-w-[220px]">{d.value}</span>
                  </div>
                ))}
              </div>
            )}
            {receiptUrl && (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary w-full justify-center"
              >
                <ExternalLink size={16} />
                Ver comprovante
              </a>
            )}
          </div>
        )}

        <div className="card p-6 text-left space-y-4 mb-6">
          <h2 className="font-semibold text-neutral-800">O que acontece após o pagamento?</h2>

          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-brand-700">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700">Confirmação automática</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                O pagamento é confirmado instantaneamente pela InfinityPay.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-brand-700">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700">E-mail de ativação</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Você receberá um e-mail para definir sua senha e ativar a conta (verifique o spam).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-brand-700">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700">Acesso liberado</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Após definir sua senha, sua conta estará ativa e você pode começar.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-green-50 border border-green-200 p-4 flex items-start gap-3 text-left mb-6">
          <Mail size={18} className="text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">
            <strong>Verifique sua caixa de entrada</strong> após concluir o pagamento.
            O link de ativação expira em 48 horas.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/aluno/dashboard" className="btn-primary w-full justify-center">
            Ir para o dashboard
          </Link>
          <Link href="/aluno/planos" className="btn-ghost w-full justify-center">
            Ver planos
          </Link>
          <Link href="/login" className="text-sm text-neutral-500 hover:text-neutral-700">
            Já ativei minha conta — Entrar
          </Link>
        </div>

        <p className="mt-8 text-xs text-neutral-400">
          Problemas? Entre em contato pelo WhatsApp ou e-mail do suporte.
        </p>
      </div>
    </main>
  )
}
