import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'NTNUI Darts',
  description: 'Information and news about NTNUI Darts',
  outDir: './docs',
  srcDir: './src',
  base: '/web',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Join', link: '/join' },
      { text: 'News', link: '/news' },
      { text: 'Upcoming Events', link: '/events' },
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
      { icon: 'instagram', link: 'https://github.com/ntnui-darts' },
    ],
  },
});
