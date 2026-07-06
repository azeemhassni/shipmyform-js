# shipmyform-js

Client libraries for submitting forms to [ShipMyForm](https://shipmyform.com) over `fetch`, with typed results and framework bindings.

| Package | Use |
| --- | --- |
| [`@shipmyform/core`](packages/core) | Framework-agnostic client and progressive enhancement |
| [`@shipmyform/react`](packages/react) | `useSubmit` hook |
| [`@shipmyform/vue`](packages/vue) | `useSubmit` composable |
| [`@shipmyform/svelte`](packages/svelte) | store and `use:shipmyform` action |
| [`@shipmyform/solid`](packages/solid) | `createSubmit` primitive |
| [`@shipmyform/astro`](packages/astro) | `<ShipMyForm>` component |

## Quick start

```ts
import { createClient } from '@shipmyform/core'

const form = createClient({ formId: 'YOUR_FORM_ID' })
const result = await form.submit({ email: 'hi@example.com', message: 'Hello' })

if (!result.ok) console.error(result.error, result.message)
```

React:

```tsx
import { useSubmit } from '@shipmyform/react'

function Contact() {
  const { submit, submitting, succeeded, error } = useSubmit({ formId: 'YOUR_FORM_ID' })

  if (succeeded) return <p>Thanks!</p>

  return (
    <form onSubmit={(e) => (e.preventDefault(), submit(e.currentTarget))}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button disabled={submitting}>Send</button>
      {error && <p>{error.message}</p>}
    </form>
  )
}
```

## Abuse protection

ShipMyForm's endpoint is public and cross-origin, so there is no CSRF token to fetch. Requests are screened by an origin allowlist, a honeypot field (`_gotcha`), an optional Cloudflare Turnstile token, and rate limiting. The client keeps the honeypot empty, forwards a Turnstile token when you pass one, and can fetch a signed time-trap token through an optional `tokenProvider`.

## Releasing

Published with [Changesets](https://github.com/changesets/changesets). Include one in your PR:

```sh
pnpm changeset
```

Merging to `main` opens a "Version Packages" PR; merging that bumps versions and publishes to npm.

## License

MIT
