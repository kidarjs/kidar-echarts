import Vue, { VueConstructor, PluginObject } from 'vue'
import { EChartsCoreOption } from 'echarts'
import EchartsPlus from './KiEchartsPlus.vue'

EchartsPlus.install = (vue: Vue & VueConstructor) => {
  vue.component(EchartsPlus.name, EchartsPlus)
}

export declare class Column {
  name: string
  color?: string
}
export declare class BaseData {
  name: string
  value: number
}

export interface EchartsPlugin {
  name: string,
  resetOption<T>(cols: Column[], data: Array<T & BaseData>): EChartsCoreOption
}

export function defineConfig(config: EchartsPlugin) {
  return config
}

EchartsPlus.use = <EchartsPlugin>(plugin: PluginObject<EchartsPlugin>) => {
  if (plugin.name in EchartsPlus.plugins) {
    throw Error(`pluginName is exist ${plugin.name} 该插件名已存在`)
  }
  EchartsPlus.plugins[plugin.name] = plugin
  return EchartsPlus
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  EchartsPlus.install(window.Vue)
}

export default EchartsPlus
