import { VueConstructor } from 'vue'
import { EChartsCoreOption, EChartsOption, EChartsType } from 'echarts'
export declare class Column {
  name: string
  prop?: string
  type?: string
  color?: string
  stack?: string
  itemStyle?: Object
}
export declare class BaseData {
  name: string
  [key: string | 'value']: number
  [key: string]: unknown
}

export interface EchartsPlugin {
  name: string
  isDynamic: boolean
  resetOption<T>(cols: Column[], data: Array<T & BaseData>, ctx: KiEchartsPlus): EChartsCoreOption
  resetOption<T>(cols: Column[], data: Array<T & BaseData>, ctx: KiEchartsPlus): EChartsOption
}

export function defineConfig(config: EchartsPlugin): EchartsPlugin

export declare class KiEchartsPlus extends Vue {
  static plugins: { [key: string]: EchartsPlugin }
  static install(vue: VueConstructor): void
  static addPlugin(plugin: EchartsPlugin): this

  type: string
  cols: Column[]
  data: BaseData[]
  rotate: number
  zoomNum: number
  theme: string | Object
  locale: string
  renderer: 'canvas' | 'svg'
  omit: number
  isDynamic: boolean
  useDirtyRect: boolean
  devicePixelRatio: number

  /**
   * echarts 的实例对象
   */
  chart: EChartsType

}