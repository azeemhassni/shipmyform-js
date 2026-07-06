import { afterEach, describe, expect, it, vi } from 'vitest'
import { createClient } from '../src/index'

function stubFetch(status: number, body: unknown = {}) {
  const fetchMock = vi.fn(
    async () => new Response(status === 200 ? null : JSON.stringify(body), { status }),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('createClient', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('posts JSON to the form endpoint and resolves ok', async () => {
    const fetchMock = stubFetch(200)
    const result = await createClient({ formId: 'abc' }).submit({ email: 'a@b.com' })

    expect(result).toEqual({ ok: true })
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://shipmyform.com/f/abc')
    expect((init.headers as Record<string, string>).Accept).toBe('application/json')
    expect(JSON.parse(init.body as string)).toEqual({ email: 'a@b.com' })
  })

  it('targets a custom endpoint', async () => {
    const fetchMock = stubFetch(200)
    await createClient({ formId: 'abc', endpoint: 'https://forms.acme.dev/' }).submit({ a: 1 })
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://forms.acme.dev/f/abc')
  })

  it('maps a known error code', async () => {
    stubFetch(429, { error: 'rate_limited', message: 'slow down' })
    const result = await createClient({ formId: 'abc' }).submit({ a: 1 })
    expect(result).toEqual({ ok: false, error: 'rate_limited', message: 'slow down', status: 429 })
  })

  it('falls back to unknown for an unrecognized code', async () => {
    stubFetch(400, { error: 'weird' })
    const result = await createClient({ formId: 'abc' }).submit({ a: 1 })
    expect(result).toMatchObject({ ok: false, error: 'unknown', status: 400 })
  })

  it('reports a network error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline')
      }),
    )
    const result = await createClient({ formId: 'abc' }).submit({ a: 1 })
    expect(result).toMatchObject({ ok: false, error: 'network' })
  })

  it('sends reserved fields from options', async () => {
    const fetchMock = stubFetch(200)
    await createClient({ formId: 'abc' }).submit({ a: 1 }, { subject: 'Hi', turnstileToken: 't' })
    const body = JSON.parse((fetchMock.mock.calls[0]?.[1] as RequestInit).body as string)
    expect(body._subject).toBe('Hi')
    expect(body['cf-turnstile-response']).toBe('t')
  })
})
