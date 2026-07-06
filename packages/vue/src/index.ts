import {
  type ClientOptions,
  type SubmitData,
  type SubmitError,
  type SubmitOptions,
  createClient,
} from '@shipmyform/core'
import { readonly, ref } from 'vue'

export function useSubmit(options: ClientOptions) {
  const client = createClient(options)
  const submitting = ref(false)
  const succeeded = ref(false)
  const error = ref<SubmitError | null>(null)

  async function submit(data: SubmitData, opts?: SubmitOptions) {
    submitting.value = true
    error.value = null
    const result = await client.submit(data, opts)
    submitting.value = false
    if (result.ok) succeeded.value = true
    else error.value = result
    return result
  }

  function reset() {
    submitting.value = false
    succeeded.value = false
    error.value = null
  }

  return {
    submit,
    reset,
    submitting: readonly(submitting),
    succeeded: readonly(succeeded),
    error: readonly(error),
  }
}
