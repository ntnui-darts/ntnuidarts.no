import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'NTNUI Darts',
  description: 'Information and news about NTNUI Darts',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/ntnui-darts.png' }],
  ],
  srcDir: './src',
  themeConfig: {
    logo: '/ntnui-darts.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Join', link: '/join' },
      { text: 'News', link: '/news' },
      { text: 'Events', link: '/events' },
      { text: 'Shop', link: '/shop' },
      { text: 'About', link: '/about' },
      { text: 'darts.quest', link: '/darts-quest' },
    ],

    sidebar: [
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/api-examples' }
      //   ]
      // }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ntnui-darts' },
      // TODO: Create and link instagram account
      { icon: 'instagram', link: 'https://instagram.com/ntnuidarts' },
    ],
  },
});
