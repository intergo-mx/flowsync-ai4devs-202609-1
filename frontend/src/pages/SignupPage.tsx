import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ApiError, type FieldErrors } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { AuthLayout } from '@/pages/AuthLayout'

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null
}

export function SignupPage() {
  const { token, signup } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  if (token) return <Navigate to="/" replace />

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = String(form.get('password'))
    const fullName = String(form.get('fullName')).trim()
    setError(null)
    setFieldErrors({})

    if (password !== form.get('passwordConfirmation')) {
      setFieldErrors({ passwordConfirmation: 'Las contraseñas no coinciden.' })
      return
    }

    setSubmitting(true)
    try {
      await signup({
        fullName: fullName || null,
        email: String(form.get('email')),
        password,
        passwordConfirmation: password,
      })
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        setFieldErrors(err.fieldErrors)
      } else {
        setError('Error inesperado.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Crear cuenta" description="Regístrate en FlowSync">
      <form onSubmit={onSubmit} className="grid gap-4">
        {error && (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-2">
          <Label htmlFor="fullName">Nombre (opcional)</Label>
          <Input id="fullName" name="fullName" autoComplete="name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
          <FieldError message={fieldErrors.email} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={32}
            autoComplete="new-password"
          />
          <FieldError message={fieldErrors.password} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="passwordConfirmation">Confirmar contraseña</Label>
          <Input
            id="passwordConfirmation"
            name="passwordConfirmation"
            type="password"
            required
            autoComplete="new-password"
          />
          <FieldError message={fieldErrors.passwordConfirmation} />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
