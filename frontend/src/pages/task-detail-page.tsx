import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { AlertCircleIcon, ClockAlertIcon } from 'lucide-react'
import * as api from '@/lib/api'
import { ApiError } from '@/lib/api'
import type { Task } from '@/lib/types'
import { useAuth } from '@/auth/use-auth'
import { useAuthForm } from '@/auth/use-auth-form'
import { FieldError } from '@/components/field-error'
import { FullScreenLoader } from '@/components/full-screen-loader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const FIELDS = ['dueDate'] as const

const BackToList = () => (
  <Link to="/tasks" className="text-foreground text-sm font-medium underline">
    Volver a la lista
  </Link>
)

export function TaskDetailPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const { isSubmitting, formError, fieldErrors, submit, failWith } =
    useAuthForm(FIELDS)
  // `null` mientras se carga la primera vez.
  const [task, setTask] = useState<Task | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!token || !id) return
    api
      .getTask(token, id)
      .then(setTask)
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 404) {
          setNotFound(true)
        } else {
          setLoadError(
            error instanceof ApiError
              ? error.message
              : 'Algo ha ido mal. Inténtalo de nuevo.',
          )
        }
      })
  }, [token, id])

  const saveDueDate = (dueDate: string | null) => {
    if (!token || !task) return

    return submit(async () => {
      // El estado local solo cambia con la respuesta, que trae el `isOverdue` nuevo.
      setTask(await api.updateTask(token, task.id, { dueDate }))
    })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, validity } = event.target

    // Fecha a medias o imposible: se avisa y no se envía nada, así que el
    // servidor conserva la fecha anterior.
    if (validity.badInput) {
      failWith('dueDate', 'Esa fecha está incompleta o no existe.')
      return
    }

    return saveDueDate(value === '' ? null : value)
  }

  if (notFound) {
    return (
      <Shell>
        <Card>
          <CardHeader>
            <CardTitle>No se encontró la tarea</CardTitle>
            <CardDescription>
              Puede que se haya eliminado o que el enlace no sea correcto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BackToList />
          </CardContent>
        </Card>
      </Shell>
    )
  }

  if (loadError) {
    return (
      <Shell>
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertDescription>
            {loadError} <BackToList />
          </AlertDescription>
        </Alert>
      </Shell>
    )
  }

  if (!task) return <FullScreenLoader />

  return (
    <Shell>
      <Card>
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
          <CardDescription>
            <BackToList />
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {task.isOverdue && (
            <Alert variant="destructive">
              <ClockAlertIcon />
              <AlertDescription>Vencida</AlertDescription>
            </Alert>
          )}

          {formError && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="dueDate">Fecha de vencimiento</Label>
            <div className="flex gap-2">
              {/* Sin controlar: una fecha a medias no se debe pisar mientras se escribe. */}
              <Input
                key={task.dueDate ?? 'sin-fecha'}
                id="dueDate"
                name="dueDate"
                type="date"
                defaultValue={task.dueDate ?? ''}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.dueDate)}
                aria-describedby={
                  fieldErrors.dueDate ? 'dueDate-error' : undefined
                }
              />
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting || task.dueDate === null}
                onClick={() => saveDueDate(null)}
              >
                Quitar fecha
              </Button>
            </div>
            <FieldError id="dueDate-error" message={fieldErrors.dueDate} />
          </div>
        </CardContent>
      </Card>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/40 flex min-h-svh justify-center p-6">
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  )
}
