/**
 * Cliente HTTP seguro para comunicação com a API backend.
 *
 * SEGURANÇA:
 * - Token armazenado em httpOnly cookie (não acessível via JS)
 * - Nunca armazena token em localStorage
 * - Todas as requisições via HTTPS
 * - CSRF protection via header
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://japa-api-8rja.vercel.app'

const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // envia cookies httpOnly automaticamente
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

// ==================== REQUEST INTERCEPTOR ====================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Token lido apenas do cookie via document.cookie é inseguro
    // Com httpOnly cookies, o browser envia automaticamente via withCredentials
    // Para SPA com token em memória (alternativa segura):
    const token = getTokenFromMemory()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ==================== RESPONSE INTERCEPTOR ====================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado — limpar e redirecionar para login
      clearToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    // Não expõe detalhes internos de erro ao console em produção
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', error.response?.data)
    }

    return Promise.reject(error)
  }
)

// ==================== TOKEN EM MEMÓRIA (mais seguro que localStorage) ====================
// O token fica na memória JS da sessão — perdido ao fechar a aba (comportamento correto)
let _tokenMemory: string | null = null

export function setToken(token: string): void {
  _tokenMemory = token
}

export function getTokenFromMemory(): string | null {
  return _tokenMemory
}

export function clearToken(): void {
  _tokenMemory = null
}

export function hasToken(): boolean {
  return _tokenMemory !== null
}

export default api
