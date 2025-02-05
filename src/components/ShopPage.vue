<template>
  <h2>Products</h2>

  <div style="display: flex; flex-direction: column; gap: 2em">
    <template v-for="product in products">
      <div
        class="product"
        style="display: flex; flex-direction: column; gap: 1em"
      >
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
              product.option = product.options.find(p => p.value == (e.target as HTMLSelectElement).value) ?? null
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
                (p) =>
                  p.id == product.id && p.option?.value == product.option?.value
              ),
            }"
            @click="
              () => {
                const existing = cart.find(
                  (p) =>
                    p.id == product.id &&
                    p.option?.value == product.option?.value
                )
                if (existing) {
                  scrollToCart()
                } else {
                  cart.push({
                    id: product.id,
                    option: product.option,
                    count: 1,
                  })
                }
              }
            "
          >
            {{
              cart.find(
                (p) =>
                  p.id == product.id && p.option?.value == product.option?.value
              )
                ? 'View cart'
                : 'Add to cart'
            }}
          </button>
        </div>
      </div>
    </template>
  </div>

  <h2 id="h2-cart">
    Cart
    <template v-if="cart.length > 0">
      :
      {{
        cart
          .map(
            (p) =>
              p.count * (productsRaw.find((pr) => pr.id == p.id)?.price ?? 0)
          )
          .reduce((a, b) => (a ?? 0) + (b ?? 0), 0)
      }},- NOK
    </template>
  </h2>

  <div style="display: flex; flex-direction: column; gap: 1em">
    <template v-for="(product, i) in cart">
      <div
        class="product"
        style="display: flex; justify-content: space-between; flex-wrap: wrap"
      >
        <div style="width: max-content; margin-bottom: 1em">
          <h4>
            {{ productsRaw.find((p) => p.id == product.id)?.name }} :
            {{ productsRaw.find((pr) => pr.id == product.id)?.price }},- NOK x
            {{ product.count }}
          </h4>
          <span>{{ product.option?.text }}</span>
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
          />

          <button
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
    <template v-if="cart.length == 0">Your cart is empty.</template>
    <div
      style="display: flex; justify-content: space-between; align-items: end"
      v-if="cart.length > 0"
    >
      <p>
        Get {{ cart.map((p) => p.count).reduce((a, b) => a + b, 0) }} stickers
        for free with your order!
      </p>

      <button class="btn-primary">Order now [not yet available]</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ProductInCart, productsRaw, ProductWithOption } from './products'

const cart = ref<ProductInCart[]>([])
const products = ref<ProductWithOption[]>(
  structuredClone(productsRaw).map(
    (p) =>
      ({
        ...p,
        option: p.options.at(0) ?? null,
      } satisfies ProductWithOption)
  )
)

const scrollToCart = () => {
  const cartH2 = document.querySelector('#h2-cart')
  if (cartH2) {
    cartH2.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style>
.product {
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
</style>
