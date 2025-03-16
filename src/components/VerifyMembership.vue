<template>
  <h2>Verify Membership</h2>
  <div
    v-if="apiResponse.state == ApiState.unknown"
    class="box"
    style="display: flex; flex-direction: column; gap: 1em"
  >
    <label for="input-name">Name</label>
    <input
      type="text"
      id="input-name"
      name="name"
      autocomplete="name"
      placeholder="..."
      v-model="name"
      :disabled="verificationLoading"
    />
    <label for="input-email">Email</label>
    <input
      type="text"
      id="input-email"
      name="email"
      autocomplete="email"
      placeholder="..."
      v-model="email"
      :disabled="verificationLoading"
    />

    <button
      v-if="credentialsValid"
      class="btn-primary"
      @click="onVerify"
      :disabled="verificationLoading"
    >
      {{ verificationLoading ? 'Loading..' : 'Verify membership' }}
    </button>
  </div>

  <p
    v-if="apiResponse.state != ApiState.unknown"
    class="box"
    style="display: flex; justify-content: space-between"
  >
    <span v-if="apiResponse.state == ApiState.success">
      Success! ✅ <br />
      Training fee details has been sent to your email, along with a Slack
      invitation link.
    </span>
    <span v-if="apiResponse.state == ApiState.error">{{
      apiResponse.response
    }}</span>
    <button
      v-if="apiResponse.state == ApiState.error"
      @click="
        () => {
          name = ''
          email = ''
          apiResponse = {
            state: ApiState.unknown,
            response: '',
          }
        }
      "
    >
      Try again
    </button>
  </p>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ApiState, isValidEmail } from './types'

const name = ref('')
const email = ref('')
const apiResponse = ref({
  state: ApiState.unknown,
  response: '',
})
const verificationLoading = ref(false)

const credentialsValid = computed(() => {
  if (name.value.length < 3) return false
  if (!isValidEmail(email.value)) return false
  return true
})

const onVerify = async () => {
  if (!credentialsValid.value) return
  verificationLoading.value = true

  const credentials = {
    email: email.value,
    name: name.value,
  }

  try {
    const response = await fetch(appsScriptApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // fixes CORS issue
      },
      body: JSON.stringify(credentials),
    })
    apiResponse.value = {
      state: ApiState.success,
      response: await response.text(),
    }
  } catch (err) {
    apiResponse.value = {
      state: ApiState.error,
      response: `Failed to verify: ${err}`,
    }
  }
  verificationLoading.value = false
}

const appsScriptApiUrl =
  'https://script.google.com/macros/s/AKfycbz5v_jWzUpiJxDX_kdD4nVfl7vwk23uQGK7podOjOmkRK2HzQ5wl6YK8ZsMZ2vkx4tk/exec'
</script>

<style>
/* TODO: DRY */
.box {
  background-color: var(--vp-c-gray-3);
  border-radius: 6px;
  padding: 1em;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 0.8em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: white;
  background-color: #1a1a1a;
  cursor: pointer;
}

input {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 0.8em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: white;
  background-color: #1a1a1a;
  cursor: pointer;
}

select {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 0.8em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: white;
  background-color: #1a1a1a;
  cursor: pointer;
}

.btn-primary {
  background-color: rgb(19, 221, 97);
  color: black;
}
button:disabled {
  background-color: #1a1a1a;
  color: gray;
}
</style>
