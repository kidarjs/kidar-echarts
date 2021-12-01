import DefaultTheme from 'vitepress/theme'
import 'vitepress-theme-demoblock/theme/styles/index.css'
import { registerComponents } from './register-components'
import kidarLightTheme from 'kidar-echarts-plugins/theme/light'
import kidarDarkTheme from 'kidar-echarts-plugins/theme/dark'
import * as echarts from 'echarts'
import { KidarEcharts, addKidarEchartsPlugin } from '../../../src/index'
import { LineBarX, ChinaMap, TreeMap, Pie, Graph, AreaLine } from 'kidar-echarts-plugins'

echarts.registerTheme('light', kidarLightTheme)
echarts.registerTheme('dark', kidarDarkTheme)
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