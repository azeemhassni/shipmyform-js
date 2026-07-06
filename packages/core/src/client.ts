import { serialize } from './serialize'
import type {
  ClientOptions,
  SubmitData,
  SubmitErrorCode,
  SubmitOptions,
  SubmitResult,
} from './types'

const DEFAULT_ENDPOINT = 'https://shipmyform.com'
const DEFAULT_TIMEOUT = 10_000

const KNOWN_ERRORS = new Set<string>([
  'rate_limited',
  'origin',
  'turnstile',
  'too_large',
  'empty',
  'not_found',
  'unavailable',
])

export interface Client {
  submit(data: SubmitData, options?: SubmitOptions): Promise<SubmitResult>
  readonly url: string
}

export function createClient(options: ClientOptions): Client {
  const endpoint = (options.endpoint ?? DEFAULT_ENDPOINT).replace(/\/+$/, '')
  const url = `${endpoint}/f/${encodeURIComponent(options.formId)}`

  async function submit(data: SubmitData, opts: SubmitOptions = {}): Promise<SubmitResult> {
    const token = await options.tokenProvider?.()
    const { body, headers } = serialize(data, {
      turnstileToken: opts.turnstileToken,
      subject: opts.subject,
      redirect: opts.redirect,
      token,
    })

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), options.timeout ?? DEFAULT_TIMEOUT)
    opts.signal?.addEventListener('abort', () => controller.abort(), { once: true })

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { Accept: 'application/json', ...headers, ...options.headers },
        body,
        signal: controller.signal,
      })
      return await read(response)
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === 'AbortError'
      return {
        ok: false,
        error: timedOut ? 'timeout' : 'network',
        message: error instanceof Error ? error.message : 'Request failed',
        status: 0,
      }
    } finally {
      clearTimeout(timer)
    }
  }

  return { submit, url }
}

async function read(response: Response): Promise<SubmitResult> {
  if (response.ok) return { ok: true }

  let error: SubmitErrorCode = 'unknown'
  let message = response.statusText
  try {
    const body = (await response.json()) as { error?: string; message?: string }
    if (body.error && KNOWN_ERRORS.has(body.error)) error = body.error as SubmitErrorCode
    if (body.message) message = body.message
  } catch {
    // Non-JSON error body — keep the status text.
  }
  return { ok: false, error, message, status: response.status }
}
