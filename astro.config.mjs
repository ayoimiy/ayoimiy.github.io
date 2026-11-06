import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import wrapTables from './src/plugins/wrap-tables.mjs';

export default defineConfig({
  markdown: {
    processor: satteri({
      hastPlugins: [wrapTables],
    }),
  },
  integrations: [
    starlight({
      title: 'Noita 知识库',
      description: 'Noita Mod 制作手册、机制研究与实验记录。写给愿意把游戏拆开看的人。',
      defaultLocale: 'zh-CN',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },
      favicon: '/favicon.svg',
      customCss: ['@fontsource/silkscreen/latin-400.css', './src/styles/custom.css'],
      components: {
        SiteTitle: './src/components/SiteTitle.astro',
        PageTitle: './src/components/PageTitle.astro',
        ThemeProvider: './src/components/ThemeProvider.astro',
      },
      sidebar: [
        {
          label: '开始',
          items: [{ label: '知识库导览', slug: 'start-here' }],
        },
        {
          label: '日志',
          link: '/log/',
        },
        {
          label: 'Mod 制作',
          items: [
            { label: '开发环境与项目骨架', slug: 'modding/getting-started' },
            { label: 'Lua 脚本入门', slug: 'modding/lua-basics' },
            { label: 'Yoita项目' , slug: 'research/yoita'},
            { label: 'LuaAPI' , slug: 'research/lua_api'},
          ],
        },
        {
          label: 'Noita 研究',
          items: [
            { label: '组件机制研究', slug: 'research/components' },
            { label: '魔杖机制研究', slug: 'research/wand-mechanics' },
            { label: '炼金实验记录', slug: 'research/alchemy-notes' },
          ],
        },
        {
          label: '资料库',
          items: [{ label: '法术索引（建设中）', slug: 'reference/spells' }],
        },
        {
          label: '关于',
          items: [{ label: '关于本站', slug: 'about' }],
        },
      ],
      credits: false,
      expressiveCode: {
        themes: ['github-dark-dimmed'],
      },
      head: [
        {
          tag: 'meta',
          attrs: { name: 'theme-color', content: '#080a08' },
        },
      ],
    }),
  ],
});
