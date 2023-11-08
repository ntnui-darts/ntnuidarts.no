---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: NTNUI Darts
  # text: 'Information and news'
  tagline: Information and news
  actions:
    - theme: brand
      text: Join us!
      link: /join
  image:
    src: /ntnui-darts-512.png
    alt: NTNUI Darts
    # - theme: alt
    #   text: API Examples
    #   link: /api-examples

features:
  - title: News
    icon: 📰
    details: What's going on with NTNUI Darts
    link: /news
  - title: Upcoming Events
    icon: 📆
    details: Don't miss our next tournament
    link: /events
  - title: Shop
    icon: 🛍️
    details: Get our coolest merch
    link: /shop
  - title: About
    icon: 🧭
    details: General information, links and board members
    link: /about
  - title: darts.quest
    icon: 📱
    details: Our handcrafted darts-tracking app
    link: /darts-quest
---

<script setup>
  import GamesChart from './components/GamesChart.vue'
</script>

<GamesChart/>
