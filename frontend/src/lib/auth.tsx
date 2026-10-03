import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authApi } from '@/lib/api'

const TOKEN_KEY = 'flowsync.token'

type AuthContextValue = {
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (input: Parameters<typeof authApi.signup>[0]) => Promise<void>
  logout: () => Promise<void>
  clearSession: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function writeToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // almacenamiento no disponible: la sesión vive solo en memoria
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken)

  const setSession = useCallback((value: string | null) => {
    writeToken(value)
    setToken(value)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      login: async (email, password) => {
        const { data } = await authApi.login(email, password)
        setSession(data.token)
      },
      signup: async (input) => {
        const { data } = await authApi.signup(input)
        setSession(data.token)
      },
      logout: async () => {
        if (token) await authApi.logout(token).catch(() => undefined)
        setSession(null)
      },
      clearSession: () => setSession(null),
    }),
    [token, setSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
