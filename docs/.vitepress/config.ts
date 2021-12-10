import { nav, sidebar } from './router'

module.exports = {
  title: 'KidarEcharts',
  description: 'A simpler echarts component',
  base: '/kidar-echarts/',
  lang: 'zh-cn',
  head: [
    // 改变title的图标 图片放在public文件夹下
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  themeConfig: {
    smoothScroll: true,
    repo: 'https://github.com/kidarjs/kidar-echarts',
    repoLabel: 'GITHUB',
    darkMode: true,
    toggleSidebar: '护眼',
    editLink: false,
    nav,
    sidebar
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            echarts: ['echarts'],
          }
        }
      }
    }
  },
  markdown: {
    anchor: {
      renderPermalink: require('./plugins/render-perma-link')
    },
    config: md => {
      md.use(require('./plugins/markdown-it-custom-anchor'))

      const { demoBlockPlugin } = require('vitepress-theme-demoblock')
      md.use(demoBlockPlugin, {
        cssPreprocessor: 'less'
      })
    }
  }
}