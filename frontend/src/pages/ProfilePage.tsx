import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ApiError, authApi, type User } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { AuthLayout } from '@/pages/AuthLayout'

export function ProfilePage() {
  const { token, logout, clearSession } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    authApi
      .profile(token)
      .then(({ data }) => {
        if (!cancelled) setUser(data)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) clearSession()
        else setError('No se pudo cargar tu perfil.')
      })
    return () => {
      cancelled = true
    }
  }, [token, clearSession])

  if (!token) return <Navigate to="/login" replace />

  return (
    <AuthLayout title="Mi perfil" description="Datos de tu cuenta">
      <div className="grid gap-4">
        {error && (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {user && (
          <dl className="grid gap-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Nombre</dt>
              <dd>{user.fullName ?? 'Sin nombre'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Correo</dt>
              <dd>{user.email}</dd>
            </div>
          </dl>
        )}
        <Button variant="outline" onClick={() => void logout()}>
          Cerrar sesión
        </Button>
      </div>
    </AuthLayout>
  )
}
