import { VueConstructor } from 'vue'
import { EChartsCoreOption, EChartsOption } from 'echarts'

export declare class Column {
  name: string
  prop?: string
  type?: string
  color?: string
  stack?: string
}
export declare class BaseData {
  name: string
  [key: string | 'value']: number
  [key: string]: any?
}

export interface EchartsPlugin {
  name: string,
  resetOption<T>(cols: Column[], data: Array<T & BaseData>): EChartsCoreOption,
  resetOption<T>(cols: Column[], data: Array<T & BaseData>): EChartsOption
}

export function defineConfig(config: EchartsPlugin): EchartsPlugin

export class KiEchartsPlus extends Vue {
  static plugins: { [key: string]: EchartsPlugin }
  static install(vue: VueConstructor): void
  static addPlugin(plugin: EchartsPlugin): this
}