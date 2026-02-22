/**
 * Funções de autenticação do frontend.
 *
 * SEGURANÇA:
 * - Lógica de auth no servidor quando possível
 * - Token nunca exposto em localStorage
 * - Validação de roles no cliente é apenas UX — backend valida sempre
 */

import type { User } from '@/types'
import api, { clearToken, setToken } from './api'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  date_of_birth?: string
}

interface AuthResult {
  user: User
  token: string
  message: string
}

export async function login(credentials: LoginCredentials): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>('/auth/login', credentials)
  setToken(data.token)
  return data
}

export async function register(userData: RegisterData): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>('/auth/register', userData)
  setToken(data.token)
  return data
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } finally {
    clearToken()
  }
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<{ user: User }>('/auth/me')
  return data.user
}

export async function refreshToken(): Promise<string> {
  const { data } = await api.post<{ token: string }>('/auth/refresh')
  setToken(data.token)
  return data.token
}

// Helpers de roles — apenas para UX, NUNCA para controle de acesso real
export function isAdmin(user: User | null): boolean {
  return user?.roles?.includes('admin') ?? false
}

export function isStudent(user: User | null): boolean {
  return user?.roles?.includes('aluno') ?? false
}

export function hasActiveSubscription(user: User | null): boolean {
  return user?.subscription?.is_active ?? false
}
