const guide = [
  { text: '为什么选择KidarEcharts', link: '/guide/why' },
  { text: '开始使用', link: '/guide/' }
]

const component = [
  { text: 'KidarEcharts', link: '/component/' }
]

const plugin = [
  { text: 'kidar-echarts-plugins', link: '/plugin/' }
]

const sidebars = [
  { text: '开始使用', children: guide },
  { text: '组件', children: component },
  { text: '插件', children: plugin }
]

export const nav = [
  { text: '指南', link: '/guide/' },
  { text: '组件', link: '/component/' },
  { text: '插件', link: '/plugin/' },
]

export const sidebar = {
  '/guide/': sidebars,
  '/component/': sidebars,
  '/plugin/': sidebars
}