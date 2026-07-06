# @shipmyform/astro

Astro component for [ShipMyForm](https://shipmyform.com). Renders a native form that posts without JavaScript and upgrades to `fetch` on the client.

```sh
npm i @shipmyform/astro
```

```astro
---
import ShipMyForm from '@shipmyform/astro/ShipMyForm.astro'
---

<ShipMyForm formId="YOUR_FORM_ID">
  <input name="email" type="email" required />
  <textarea name="message" required />
  <button>Send</button>
</ShipMyForm>

<script>
  document.addEventListener('shipmyform:success', () => alert('Thanks!'))
  document.addEventListener('shipmyform:error', (e) => console.error(e.detail))
</script>
```

Props: `formId` (required), `endpoint`, `class`.
