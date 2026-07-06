import {
  type ClientOptions,
  type SubmitData,
  type SubmitError,
  type SubmitOptions,
  createClient,
} from '@shipmyform/core'
import { createSignal } from 'solid-js'

export function createSubmit(options: ClientOptions) {
  const client = createClient(options)
  const [submitting, setSubmitting] = createSignal(false)
  const [succeeded, setSucceeded] = createSignal(false)
  const [error, setError] = createSignal<SubmitError | null>(null)

  async function submit(data: SubmitData, opts?: SubmitOptions) {
    setSubmitting(true)
    setError(null)
    const result = await client.submit(data, opts)
    setSubmitting(false)
    if (result.ok) setSucceeded(true)
    else setError(result)
    return result
  }

  function reset() {
    setSubmitting(false)
    setSucceeded(false)
    setError(null)
  }

  return { submit, reset, submitting, succeeded, error }
}
