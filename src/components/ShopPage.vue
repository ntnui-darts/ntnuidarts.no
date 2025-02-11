<template>
  <h2>Products</h2>

  <div style="display: flex; flex-direction: column; gap: 2em">
    <template v-for="product in products">
      <div class="box" style="display: flex; flex-direction: column; gap: 1em">
        <div
          style="
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <div>
            <h4>{{ product.name }}</h4>
            <span>{{ product.price }} NOK</span>
          </div>
        </div>
        <div
          style="
            background-color: white;
            min-width: 200px;
            padding: 1em;
            border-radius: 6px;
          "
        >
          <img :src="product.image" alt="" />
        </div>

        <div style="display: flex">
          <div v-if="product.options.length > 0">
            <select
              name="model"
              :id="`select-${product.id}`"
              @input="(e) => {
              product.option = product.options.find(p => p.value == (e.target as HTMLSelectElement).value) ?? { text: '', value: null}
            }"
            >
              <option v-for="option in product.options" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>

          <div style="flex: 1"></div>

          <button
            :class="{
              'btn-primary': !cart.find(
                (p) => p.id == product.id && p.option == product.option.value
              ),
            }"
            @click="() => addToCart(product)"
          >
            {{
              cart.find(
                (p) => p.id == product.id && p.option == product.option.value
              )
                ? 'View cart'
                : 'Add to cart'
            }}
          </button>
        </div>
      </div>
    </template>
  </div>

  <h2 id="h2-cart" style="display: flex; justify-content: space-between">
    Cart
    <span v-if="cart.length > 0">
      NOK
      {{ totalPrice }},-
    </span>
  </h2>

  <div style="display: flex; flex-direction: column; gap: 1em">
    <template v-for="(product, i) in cart">
      <div
        class="box"
        style="display: flex; justify-content: space-between; flex-wrap: wrap"
      >
        <div style="width: max-content; margin-bottom: 1em">
          <h4>
            {{ product.name }}. {{ product.count }} x NOK {{ product.price }},-
          </h4>
        </div>
        <div
          style="
            flex: 1;
            display: flex;
            gap: 1em;
            justify-content: end;
            align-items: center;
          "
        >
          <input
            type="number"
            min="1"
            max="99"
            step="1"
            v-model="product.count"
            :disabled="orderLoading"
          />

          <button
            :disabled="orderLoading"
            @click="
              () => {
                cart.splice(i, 1)
              }
            "
          >
            Delete
          </button>
        </div>
      </div>
    </template>
    <p v-if="cart.length == 0" class="box">Your cart is empty.</p>
    <div
      class="box"
      style="display: flex; flex-direction: column; gap: 1em"
      v-if="cart.length > 0"
    >
      <input
        type="text"
        name="name"
        autocomplete="name"
        placeholder="Full name"
        v-model="name"
        :disabled="orderLoading"
      />
      <input
        type="text"
        name="email"
        autocomplete="email"
        placeholder="Email"
        v-model="email"
        :disabled="orderLoading"
      />

      <span v-if="numberOfFreeStickers > 0">
        You get
        {{ numberOfFreeStickers }} sticker(s) for free with your order!
      </span>

      <button
        v-if="orderValid"
        class="btn-primary"
        @click="onOrder"
        :disabled="orderLoading"
      >
        {{ orderLoading ? 'Loading..' : 'Submit order' }}
      </button>
    </div>
  </div>
  <p v-if="apiResponseText.length > 0" class="box">{{ apiResponseText }}</p>
</template>

<script lang="ts" setup>
import { computed, ref, toRaw } from 'vue'
import { ProductInCart, productsRaw, ProductWithOption } from './products'

const cart = ref<ProductInCart[]>([])
const products = ref<ProductWithOption[]>(
  structuredClone(productsRaw).map(
    (p) =>
      ({
        ...p,
        option: p.options.at(0) ?? { text: '', value: null },
      } satisfies ProductWithOption)
  )
)
const name = ref('')
const email = ref('')
const apiResponseText = ref('')
const orderLoading = ref(false)

const isValidEmail = (email: string) => {
  var re = /\S+@\S+\.\S+/
  return re.test(email)
}

const totalPrice = computed(() => {
  return cart.value
    .map((p) => p.count * (productsRaw.find((pr) => pr.id == p.id)?.price ?? 0))
    .reduce((a, b) => (a ?? 0) + (b ?? 0), 0)
})

const orderValid = computed(() => {
  if (name.value.length < 3) return false
  if (!isValidEmail(email.value)) return false
  if (cart.value.length == 0) return false
  return true
})

const numberOfFreeStickers = computed(() => {
  return cart.value
    .filter((p) => p.price >= 50)
    .map((p) => p.count)
    .reduce((a, b) => a + b, 0)
})

const addToCart = (product: ProductWithOption) => {
  apiResponseText.value = ''

  const existing = cart.value.find(
    (p) => p.id == product.id && p.option == product.option.value
  )
  if (existing) {
    scrollToCart()
  } else {
    cart.value.push({
      id: product.id,
      name:
        product.name +
        (product.option.value ? ` (${product.option.text})` : ''),
      option: product.option.value,
      price: productsRaw.find((pr) => pr.id == product.id)?.price ?? 0,
      count: 1,
    })
  }
}

const scrollToCart = () => {
  const cartH2 = document.querySelector('#h2-cart')
  if (cartH2) {
    cartH2.scrollIntoView({ behavior: 'smooth' })
  }
}

const appsScriptApiUrl =
  'https://script.google.com/macros/s/AKfycbyxsQAP-49TlNQpKfUv7ylEbSbBmylREakvUgU-fnGTp57PhmhDJe__e3WzCQd4xoLdww/exec'

export type Order = {
  orderId: string
  name: string
  email: string
  products: ProductInCart[]
  totalPrice: number
}

const onOrder = async () => {
  if (!orderValid.value) return
  orderLoading.value = true
  const finalProducts = structuredClone(toRaw(cart.value))

  const order: Order = {
    orderId: crypto.randomUUID().substring(0, 6),
    email: email.value,
    name: name.value,
    products: finalProducts,
    totalPrice: totalPrice.value,
  }
  finalProducts.push({
    id: 'sticker',
    name: 'Sticker',
    option: null,
    price: 0,
    count: numberOfFreeStickers.value,
  })
  try {
    const response = await fetch(appsScriptApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // fixes CORS issue
      },
      body: JSON.stringify(order),
    })
    apiResponseText.value = `Success! To complete your purchase, send NOK ${order.totalPrice},- to Vipps #954519 (https://qr.vipps.no/28/2/05/031/FgKHKVPrM) and include order ID ${order.orderId} in the message field. Further details have been sent to you email inbox.`
    cart.value = []
  } catch (err) {
    apiResponseText.value = `Something failed. Report the following error to darts-it@ntnui.no: ${err}`
  }
  orderLoading.value = false
}
</script>

<style>
.box {
  background-color: var(--vp-c-gray-3);
  border-radius: 6px;
  padding: 1em;
}

button {
  /* TODO: DRY */
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
  /* TODO: DRY */
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
  /* TODO: DRY */
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
