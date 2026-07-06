# @shipmyform/solid

Solid primitive for [ShipMyForm](https://shipmyform.com).

```sh
npm i @shipmyform/solid
```

```tsx
import { createSubmit } from '@shipmyform/solid'

export function Contact() {
  const { submit, submitting, succeeded, error } = createSubmit({ formId: 'YOUR_FORM_ID' })

  return (
    <Show when={!succeeded()} fallback={<p>Thanks!</p>}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(e.currentTarget)
        }}
      >
        <input name="email" type="email" required />
        <button disabled={submitting()}>Send</button>
        <Show when={error()}>{(e) => <p role="alert">{e().message}</p>}</Show>
      </form>
    </Show>
  )
}
```

See [`@shipmyform/core`](../core) for options and result types.
