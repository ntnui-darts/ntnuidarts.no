<script setup>
  import ShopPage from './components/ShopPage.vue'
  import { onMounted, ref } from 'vue'
  
  const daysSince = ref(0)
  
  onMounted(() => {
    const lastOrderDate = new Date('2025-02-24')
    const currentDate = new Date()
    daysSince.value = Math.ceil((currentDate - lastOrderDate) / (24 * 60 * 60 * 1000))
  })
</script>

# Shop

Welcome to our store! Order some nice merch, pay with Vipps and collect your items at a darts training session.

::: warning
We ordered merch **{{ daysSince }}** days ago. We aim to order merch once every semester.
:::

::: info
Not sure what size to choose? Have a look at the [product measurements](./public/product-measurements.pdf).
:::

<ShopPage></ShopPage>
