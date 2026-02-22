'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 text-neutral-600 hover:text-brand-600"
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-neutral-900/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <span className="font-bold text-neutral-900">Menu</span>
              <button onClick={() => setOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-600">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4 flex-1">
              {[
                { href: '#como-funciona', label: 'Como funciona' },
                { href: '#beneficios', label: 'Benefícios' },
                { href: '#planos', label: 'Planos' },
                { href: '#depoimentos', label: 'Depoimentos' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="p-4 border-t border-neutral-100 flex flex-col gap-2">
              <Link href="/login" className="btn-ghost w-full justify-center">
                Entrar
              </Link>
              <Link href="/checkout" className="btn-primary w-full justify-center">
                Começar agora
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
