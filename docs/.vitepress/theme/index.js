import DefaultTheme from 'vitepress/theme'
import { KidarEcharts } from '../../../src/index'

export default {
  ...DefaultTheme,
  nav: [
    { text: '介绍', link: '/guide' },
  ],
  enhanceApp ({ app }) {
    app.component('KidarEcharts', KidarEcharts)
  }
}