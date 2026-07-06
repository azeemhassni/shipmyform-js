import type { Client } from './client'
import type { SubmitError, SubmitOptions } from './types'

export interface EnhanceOptions extends SubmitOptions {
  onSuccess?: () => void
  onError?: (error: SubmitError) => void
  resetOnSuccess?: boolean
}

export function enhance(
  form: HTMLFormElement,
  client: Client,
  options: EnhanceOptions = {},
): () => void {
  const handler = async (event: SubmitEvent) => {
    event.preventDefault()
    const result = await client.submit(form, options)
    if (result.ok) {
      if (options.resetOnSuccess !== false) form.reset()
      options.onSuccess?.()
    } else {
      options.onError?.(result)
    }
  }

  form.addEventListener('submit', handler)
  return () => form.removeEventListener('submit', handler)
}
