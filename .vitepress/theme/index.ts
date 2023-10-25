// .vitepress/theme/index.js
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import BackgroundVideo from '../../src/components/BackgroundVideo.vue'
import './style.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('BackgroundVideo', BackgroundVideo)
  },
}
