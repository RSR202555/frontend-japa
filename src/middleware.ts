/**
 * Middleware Next.js — Proteção de rotas.
 *
 * IMPORTANTE: Este middleware apenas verifica a presença do token em cookie.
 * A autorização real é sempre feita no backend.
 * Aqui fazemos apenas redirect para UX — nunca para segurança real.
 */

import { NextRequest, NextResponse } from 'next/server'

// Rotas que requerem autenticação
const PROTECTED_ROUTES = ['/admin', '/aluno', '/perfil']

// Rotas apenas para não autenticados (redireciona para dashboard se já logado)
const AUTH_ROUTES = ['/login']

// Rotas apenas para admin (verificação adicional de role via cookie)
const ADMIN_ROUTES = ['/admin']

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // Verificar presença de token (auth simplificada no edge)
  // O token real fica em memória JS — aqui apenas verificamos um cookie de sessão não-sensível
  const sessionActive = request.cookies.has('session_active')

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Redirecionar /cadastro → /checkout (fluxo pay-first)
  if (pathname === '/cadastro') {
    return NextResponse.redirect(new URL('/checkout', request.url))
  }

  // Redirecionar para login se não autenticado
  if (isProtectedRoute && !sessionActive) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirecionar para dashboard se já autenticado tentando acessar login
  if (isAuthRoute && sessionActive) {
    return NextResponse.redirect(new URL('/aluno/dashboard', request.url))
  }

  // Headers de segurança adicionais
  const response = NextResponse.next()
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')

  return response
}

export const config = {
  matcher: [
    /*
     * Aplica middleware em todas as rotas exceto:
     * - arquivos estáticos
     * - API routes internas do Next
     * - health check
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|api/).*)',
  ],
}
