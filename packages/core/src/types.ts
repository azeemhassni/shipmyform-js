export interface ClientOptions {
  formId: string
  endpoint?: string
  timeout?: number
  headers?: Record<string, string>
  tokenProvider?: () => string | Promise<string>
}

export type SubmitData = Record<string, unknown> | FormData | HTMLFormElement

export interface SubmitOptions {
  turnstileToken?: string
  subject?: string
  redirect?: string
  signal?: AbortSignal
}

export type SubmitErrorCode =
  | 'rate_limited'
  | 'origin'
  | 'turnstile'
  | 'too_large'
  | 'empty'
  | 'not_found'
  | 'unavailable'
  | 'network'
  | 'timeout'
  | 'unknown'

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: SubmitErrorCode; message: string; status: number }

export type SubmitError = Extract<SubmitResult, { ok: false }>
