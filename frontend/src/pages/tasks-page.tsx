import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { AlertCircleIcon } from 'lucide-react'
import * as api from '@/lib/api'
import { ApiError } from '@/lib/api'
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type Task,
  type TaskStatus,
} from '@/lib/types'
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

const FIELDS = ['title'] as const

const errorMessage = (error: unknown) =>
  error instanceof ApiError
    ? error.message
    : 'Algo ha ido mal. Inténtalo de nuevo.'

export function TasksPage() {
  const { token } = useAuth()
  const { isSubmitting, formError, fieldErrors, submit, failWith } =
    useAuthForm(FIELDS)
  // `null` mientras se carga la primera vez.
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [title, setTitle] = useState('')

  const load = useCallback(() => {
    if (!token) return
    setLoadError(null)
    api
      .getTasks(token)
      .then(setTasks)
      .catch((error: unknown) => setLoadError(errorMessage(error)))
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault()
    if (!token) return

    // Un título en blanco no es título: se avisa junto al campo sin ir al servidor.
    if (!title.trim()) {
      failWith('title', 'Escribe un título para la tarea.')
      return
    }

    return submit(async () => {
      const created = await api.createTask(token, title)
      setTasks((current) => [...(current ?? []), created])
      setTitle('')
    })
  }

  const handleStatus = async (task: Task, status: TaskStatus) => {
    if (!token || task.status === status) return
    setActionError(null)

    try {
      const updated = await api.updateTask(token, task.id, { status })
      setTasks((current) =>
        (current ?? []).map((item) =>
          item.id === updated.id ? updated : item,
        ),
      )
    } catch (error) {
      // La fila conserva el estado anterior: solo se avisa del fallo.
      setActionError(errorMessage(error))
    }
  }

  if (tasks === null && !loadError) return <FullScreenLoader />

  return (
    <div className="bg-muted/40 flex min-h-svh justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">FlowSync</h1>
          <Link
            to="/profile"
            className="text-foreground text-sm font-medium underline"
          >
            Mi perfil
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tareas del equipo</CardTitle>
            <CardDescription>
              Una sola lista para todo el equipo: quién lleva cada tarea y en
              qué estado está.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <form onSubmit={handleCreate} className="grid gap-2" noValidate>
              {formError && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <Label htmlFor="title">Nueva tarea</Label>
              <div className="flex gap-2">
                <Input
                  id="title"
                  name="title"
                  placeholder="¿Qué hay que hacer?"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  aria-invalid={Boolean(fieldErrors.title)}
                  aria-describedby={
                    fieldErrors.title ? 'title-error' : undefined
                  }
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creando…' : 'Crear tarea'}
                </Button>
              </div>
              <FieldError id="title-error" message={fieldErrors.title} />
            </form>

            {loadError && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertDescription>
                  {loadError}{' '}
                  <button type="button" className="underline" onClick={load}>
                    Reintentar
                  </button>
                </AlertDescription>
              </Alert>
            )}

            {actionError && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertDescription>{actionError}</AlertDescription>
              </Alert>
            )}

            {tasks && tasks.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Todavía no hay tareas. Esta es la lista compartida del equipo,
                donde todos ven en qué anda cada persona. Crea la primera con el
                formulario de arriba.
              </p>
            )}

            {tasks && tasks.length > 0 && (
              <ul className="grid gap-3">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{task.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {task.assignee.fullName ?? 'Sin nombre'}
                      </p>
                    </div>
                    <div
                      className="flex gap-1"
                      role="group"
                      aria-label={`Estado de ${task.title}`}
                    >
                      {TASK_STATUSES.map((status) => (
                        <Button
                          key={status}
                          type="button"
                          size="sm"
                          variant={
                            task.status === status ? 'default' : 'outline'
                          }
                          aria-pressed={task.status === status}
                          onClick={() => handleStatus(task, status)}
                        >
                          {TASK_STATUS_LABELS[status]}
                        </Button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
