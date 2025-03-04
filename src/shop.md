<script setup>
  import ShopPage from './components/ShopPage.vue'
  
  const lastOrderDate = new Date("2025-02-24"); //endre denne til dato til siste ordre
  const currentDate = new Date();
  
  document.getElementById("days-since").textContent = Math.ceil((currentDate - lastOrderDate) / (24*60*60*1000));
</script>

# Shop

Welcome to our store! Order some nice merch, pay with Vipps and collect your items at a darts training session.

::: warning
We ordered merch **<span id="days-since"></span>** days ago. We aim to order merch once every semester.
:::

::: info
Not sure what size to choose? Have a look at the [product measurements](public/product-sizes.pdf).
:::

<ShopPage></ShopPage>
