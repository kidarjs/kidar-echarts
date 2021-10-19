import { VueConstructor, PluginObject } from 'vue'
import KiEchartsPlus from './KiEchartsPlus.vue'
import { EchartsPlugin, SFCWithInstall } from '../types/index'

const _KiEchartsPlus: SFCWithInstall<typeof KiEchartsPlus> = KiEchartsPlus

_KiEchartsPlus.install = (vue: VueConstructor) => {
  vue.component(_KiEchartsPlus.name, _KiEchartsPlus)
}

export function defineConfig(config: EchartsPlugin) {
  return config
}

_KiEchartsPlus.addPlugin = <EchartsPlugin>(plugin: PluginObject<EchartsPlugin>) => {
  if (plugin.name in _KiEchartsPlus.plugins) {
    throw Error(`pluginName is exist ${plugin.name} 该插件名已存在`)
  }
  _KiEchartsPlus.plugins[plugin.name] = plugin
  return _KiEchartsPlus
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  _KiEchartsPlus.install(window.Vue)
}

export default _KiEchartsPlus
