const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api/v1'

export type User = {
  id: number
  fullName: string | null
  email: string
  initials: string
}

export type FieldErrors = Record<string, string>

export class ApiError extends Error {
  status: number
  fieldErrors: FieldErrors

  constructor(message: string, status: number, fieldErrors: FieldErrors = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

type ErrorBody = {
  errors?: { message: string; field?: string }[]
  message?: string
}

function toApiError(status: number, body: ErrorBody | null): ApiError {
  const fieldErrors: FieldErrors = {}
  for (const error of body?.errors ?? []) {
    if (error.field && !fieldErrors[error.field]) {
      fieldErrors[error.field] = error.message
    }
  }

  if (status === 422 && fieldErrors.email?.includes('already been taken')) {
    return new ApiError('Este correo ya está registrado.', status, {
      email: 'Este correo ya está registrado.',
    })
  }
  if (status === 400 || status === 401) {
    return new ApiError('Correo o contraseña incorrectos.', status)
  }
  if (status === 422) {
    return new ApiError(
      'Revisa los datos del formulario e inténtalo de nuevo.',
      status,
      fieldErrors,
    )
  }
  return new ApiError(
    'Ocurrió un error inesperado. Inténtalo más tarde.',
    status,
  )
}

export async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor.', 0)
  }

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw toApiError(response.status, body)
  }
  return body as T
}

type AuthResponse = { data: { user: User; token: string } }

export const authApi = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  signup: (input: {
    fullName: string | null
    email: string
    password: string
    passwordConfirmation: string
  }) => request<AuthResponse>('/auth/signup', { method: 'POST', body: input }),
  profile: (token: string) =>
    request<{ data: User }>('/account/profile', { token }),
  logout: (token: string) =>
    request<{ message: string }>('/account/logout', { method: 'POST', token }),
}
