import DefaultTheme from 'vitepress/theme'
import 'vitepress-theme-demoblock/theme/styles/index.css'
import { registerComponents } from './register-components'
import { Dark, Light } from '@kidar/echarts-theme'
import * as echarts from 'echarts'
import { KidarEcharts, addKidarEchartsPlugin } from '@kidar/echarts-vue'
import { LineBarX, ChinaMap, TreeMap, Pie, Graph, AreaLine } from '@kidar/echarts-plugins'

echarts.registerTheme('light', Light)
echarts.registerTheme('dark', Dark)
addKidarEchartsPlugin('line-bar-x', LineBarX)
addKidarEchartsPlugin('area-line', AreaLine)
addKidarEchartsPlugin('pie', Pie)
addKidarEchartsPlugin('china-map', ChinaMap)
addKidarEchartsPlugin('tree-map', TreeMap)
addKidarEchartsPlugin('graph', Graph)

export default {
  ...DefaultTheme,
  enhanceApp ({ app }) {
    app.component('KidarEcharts', KidarEcharts)
    registerComponents(app)
  }
}