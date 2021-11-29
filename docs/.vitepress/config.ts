module.exports = {
  title: 'KidarEcharts',
  description: 'A simpler echarts component',
  base: '/kidar-echarts/',
  lang: 'zh-cn',
  head: [
    // 改变title的图标
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico',//图片放在public文件夹下
      },
    ],
  ],
  themeConfig: {
    smoothScroll: true,
    nav: [
      { text: '介绍', link: '/guide/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          link: '',
          children: [
            { text: '介绍', link: '/guide/' },
            { text: '基础', link: '/guide/why' }
          ],
          sidebarDepth: 3
        }
      ]
    }
  }
}