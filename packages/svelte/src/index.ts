import {
  type ClientOptions,
  type EnhanceOptions,
  type SubmitData,
  type SubmitError,
  type SubmitOptions,
  createClient,
  enhance,
} from '@shipmyform/core'
import { writable } from 'svelte/store'

export function createSubmit(options: ClientOptions) {
  const client = createClient(options)
  const submitting = writable(false)
  const succeeded = writable(false)
  const error = writable<SubmitError | null>(null)

  async function submit(data: SubmitData, opts?: SubmitOptions) {
    submitting.set(true)
    error.set(null)
    const result = await client.submit(data, opts)
    submitting.set(false)
    if (result.ok) succeeded.set(true)
    else error.set(result)
    return result
  }

  return { submit, submitting, succeeded, error }
}

type ActionParams = ClientOptions & EnhanceOptions

export function shipmyform(node: HTMLFormElement, params: ActionParams) {
  let dispose = attach(node, params)
  return {
    update(next: ActionParams) {
      dispose()
      dispose = attach(node, next)
    },
    destroy() {
      dispose()
    },
  }
}

function attach(node: HTMLFormElement, params: ActionParams) {
  const { formId, endpoint, timeout, headers, tokenProvider, ...rest } = params
  const client = createClient({ formId, endpoint, timeout, headers, tokenProvider })
  return enhance(node, client, rest)
}
