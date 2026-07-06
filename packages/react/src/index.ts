import {
  type ClientOptions,
  type SubmitData,
  type SubmitError,
  type SubmitOptions,
  type SubmitResult,
  createClient,
} from '@shipmyform/core'
import { useCallback, useMemo, useState } from 'react'

export interface UseSubmit {
  submit: (data: SubmitData, options?: SubmitOptions) => Promise<SubmitResult>
  submitting: boolean
  succeeded: boolean
  error: SubmitError | null
  reset: () => void
}

export function useSubmit(options: ClientOptions): UseSubmit {
  const { formId, endpoint, timeout, headers, tokenProvider } = options
  const client = useMemo(
    () => createClient({ formId, endpoint, timeout, headers, tokenProvider }),
    [formId, endpoint, timeout, headers, tokenProvider],
  )
  const [submitting, setSubmitting] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState<SubmitError | null>(null)

  const submit = useCallback(
    async (data: SubmitData, opts?: SubmitOptions) => {
      setSubmitting(true)
      setError(null)
      const result = await client.submit(data, opts)
      setSubmitting(false)
      if (result.ok) setSucceeded(true)
      else setError(result)
      return result
    },
    [client],
  )

  const reset = useCallback(() => {
    setSubmitting(false)
    setSucceeded(false)
    setError(null)
  }, [])

  return { submit, submitting, succeeded, error, reset }
}
