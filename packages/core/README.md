# @shipmyform/core

Framework-agnostic client for [ShipMyForm](https://shipmyform.com).

```sh
npm i @shipmyform/core
```

## Submit data

```ts
import { createClient } from '@shipmyform/core'

const form = createClient({ formId: 'YOUR_FORM_ID' })

const result = await form.submit({ email: 'hi@example.com', message: 'Hello' })
if (result.ok) {
  // done
} else {
  console.error(result.error, result.message)
}
```

`submit` accepts a plain object, a `FormData`, or an `HTMLFormElement`. Files (`File`/`Blob`) switch the request to `multipart/form-data` automatically.

## Enhance an existing form

Keeps the native `<form>` working without JavaScript and upgrades it to `fetch` when available.

```ts
import { createClient, enhance } from '@shipmyform/core'

const form = document.querySelector('form')
const client = createClient({ formId: 'YOUR_FORM_ID' })

enhance(form, client, {
  onSuccess: () => form.replaceWith('Thanks!'),
  onError: (e) => alert(e.message),
})
```

## Options

```ts
createClient({
  formId: 'YOUR_FORM_ID',
  endpoint: 'https://forms.acme.dev', // custom domain or self-host
  timeout: 10_000,
  tokenProvider: async () => fetchTimeToken(), // optional time-trap token
})
```

`submit(data, options)` takes `turnstileToken`, `subject`, `redirect`, and an `AbortSignal`.

## Result

```ts
type SubmitResult =
  | { ok: true }
  | { ok: false; error: SubmitErrorCode; message: string; status: number }
```

`error` is one of `rate_limited`, `origin`, `turnstile`, `too_large`, `empty`, `not_found`, `unavailable`, `network`, `timeout`, `unknown`.
