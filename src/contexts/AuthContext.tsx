'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@/types'
import { clearToken, setToken } from '@/lib/api'
import { getMe, isAdmin, logout as authLogout } from '@/lib/auth'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (token: string, user: User) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = useCallback((token: string, userData: User) => {
    setToken(token)
    setUser(userData)
    // Definir cookie não-sensível para o middleware verificar sessão ativa
    document.cookie = 'session_active=1; path=/; samesite=strict; secure'
  }, [])

  const logout = useCallback(async () => {
    await authLogout()
    setUser(null)
    clearToken()
    // Remover cookie de sessão
    document.cookie = 'session_active=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const userData = await getMe()
      setUser(userData)
    } catch {
      setUser(null)
    }
  }, [])

  // Não tenta restaurar sessão automaticamente — token fica em memória
  // O usuário precisa fazer login a cada sessão (seguro)
  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        isAdmin: isAdmin(user),
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return ctx
}
