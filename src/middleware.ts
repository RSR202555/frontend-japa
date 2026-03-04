/**
 * Middleware Next.js.
 *
 * Proteção de rotas é feita inteiramente no client-side (layouts),
 * pois o token fica em localStorage — inacessível no edge server.
 * A segurança real é sempre validada pelo backend em cada request.
 */

import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // Redirecionar /cadastro → /checkout (fluxo pay-first)
  if (pathname === '/cadastro') {
    return NextResponse.redirect(new URL('/checkout', request.url))
  }

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
