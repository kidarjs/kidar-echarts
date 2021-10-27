import { VueConstructor, PluginObject } from 'vue'
import KiEchartsPlus from './KiEchartsPlus.vue'
import { EchartsPlugin } from '../types/index'

export const CONST_V = {
  category: "category" as "category",
  value: "value" as "value",
  dataMax: "dataMax" as "dataMax",
  bar: "bar" as "bar",
  line: "line" as "line",
  pie: "pie" as "pie",
  map: "map" as "map",
  right: "right" as "right",
  left: "left" as "left",
}

KiEchartsPlus.install = (vue: VueConstructor) => {
  vue.component(KiEchartsPlus.name, KiEchartsPlus)
}

export function defineConfig(config: EchartsPlugin) {
  return config
}

KiEchartsPlus.addPlugin = <EchartsPlugin>(plugin: PluginObject<EchartsPlugin>) => {
  if (plugin.name in KiEchartsPlus.plugins) {
    throw Error(`pluginName is exist ${plugin.name} 该插件名已存在`)
  }
  KiEchartsPlus.plugins[plugin.name] = plugin
  return KiEchartsPlus
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  KiEchartsPlus.install(window.Vue)
}

export { KiEchartsPlus }
