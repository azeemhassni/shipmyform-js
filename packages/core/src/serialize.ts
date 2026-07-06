import { REDIRECT, SUBJECT, TIME_TOKEN, TURNSTILE } from './fields'
import type { SubmitData } from './types'

interface Reserved {
  turnstileToken?: string
  subject?: string
  redirect?: string
  token?: string
}

export interface Serialized {
  body: BodyInit
  headers: Record<string, string>
}

export function serialize(data: SubmitData, reserved: Reserved): Serialized {
  const fields: Record<string, string | undefined> = {
    [TURNSTILE]: reserved.turnstileToken,
    [SUBJECT]: reserved.subject,
    [REDIRECT]: reserved.redirect,
    [TIME_TOKEN]: reserved.token,
  }

  const input = isFormElement(data) ? new FormData(data) : data

  if (input instanceof FormData) {
    apply(input, fields)
    return { body: input, headers: {} }
  }

  if (containsFile(input)) {
    const form = new FormData()
    for (const [key, value] of Object.entries(input)) append(form, key, value)
    apply(form, fields)
    return { body: form, headers: {} }
  }

  const json: Record<string, unknown> = { ...input }
  for (const [key, value] of Object.entries(fields)) if (value != null) json[key] = value
  return { body: JSON.stringify(json), headers: { 'Content-Type': 'application/json' } }
}

function apply(form: FormData, fields: Record<string, string | undefined>): void {
  for (const [key, value] of Object.entries(fields)) if (value != null) form.set(key, value)
}

function append(form: FormData, key: string, value: unknown): void {
  if (value == null) return
  if (Array.isArray(value)) {
    for (const item of value) append(form, key, item)
  } else if (value instanceof Blob) {
    form.append(key, value)
  } else {
    form.append(key, String(value))
  }
}

function isFormElement(data: SubmitData): data is HTMLFormElement {
  return typeof HTMLFormElement !== 'undefined' && data instanceof HTMLFormElement
}

function containsFile(data: Record<string, unknown>): boolean {
  return Object.values(data).some((v) => typeof Blob !== 'undefined' && v instanceof Blob)
}
