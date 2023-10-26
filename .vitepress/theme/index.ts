// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import YouTubeMobile from './YouTubeMobile.vue'
import YouTubeDesktop from './YouTubeDesktop.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    const isDesktop = window.matchMedia('(min-width: 1200px)').matches

    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'home-hero-image': isDesktop ? () => h(YouTubeDesktop) : undefined,
      'home-hero-before': !isDesktop ? () => h(YouTubeMobile) : undefined,
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  },
} satisfies Theme
