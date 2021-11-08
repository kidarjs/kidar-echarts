import { VueConstructor, PluginObject } from 'vue'
import KidarEcharts from './KidarEcharts.vue'
import { EchartsPlugin } from '../types/index'

KidarEcharts.install = (vue: VueConstructor) => {
  vue.component(KidarEcharts.name, KidarEcharts)
}

export function defineConfig(config: EchartsPlugin) {
  return config
}

KidarEcharts.addPlugin = <EchartsPlugin>(plugin: PluginObject<EchartsPlugin>) => {
  if (plugin.name in KidarEcharts.plugins) {
    throw Error(`pluginName is exist ${plugin.name} 该插件名已存在`)
  }
  KidarEcharts.plugins[plugin.name] = plugin
  return KidarEcharts
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  KidarEcharts.install(window.Vue)
}

export { KidarEcharts }
