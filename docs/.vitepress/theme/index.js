import DefaultTheme from 'vitepress/theme'
import 'vitepress-theme-demoblock/theme/styles/index.css'
import { registerComponents } from './register-components'

import { KidarEcharts, addKidarEchartsPlugin } from '../../../lib/kidar-echarts.es.js'
import { LineBarX, ChinaMap, TreeMap, Pie, Graph } from 'kidar-echarts-plugins'
addKidarEchartsPlugin('line-bar-x', LineBarX)
addKidarEchartsPlugin('pie', Pie)
addKidarEchartsPlugin('china-map', ChinaMap)
addKidarEchartsPlugin('treeMap', TreeMap)
addKidarEchartsPlugin('graph', Graph)

export default {
  ...DefaultTheme,
  enhanceApp ({ app }) {
    app.component('KidarEcharts', KidarEcharts)
    registerComponents(app)
  }
}