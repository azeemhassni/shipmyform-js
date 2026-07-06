# @shipmyform/vue

Vue 3 composable for [ShipMyForm](https://shipmyform.com).

```sh
npm i @shipmyform/vue
```

```vue
<script setup lang="ts">
import { useSubmit } from '@shipmyform/vue'

const { submit, submitting, succeeded, error } = useSubmit({ formId: 'YOUR_FORM_ID' })
</script>

<template>
  <p v-if="succeeded">Thanks!</p>
  <form v-else @submit.prevent="submit($event.target as HTMLFormElement)">
    <input name="email" type="email" required />
    <textarea name="message" required />
    <button :disabled="submitting">Send</button>
    <p v-if="error" role="alert">{{ error.message }}</p>
  </form>
</template>
```

See [`@shipmyform/core`](../core) for options and result types.
