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

export interface ECharts3DSeriesOption {
  type: 'lines3D' | '' | ''
  coordinateSystem?: unknown
  [key: string]: any
}
export interface ECharts3DOption {
  series: ECharts3DSeriesOption[]
  geo3D?: unknown
  [key: string]: any
}

export interface EchartsPlugin {
  name: string
  isDynamic?: boolean
  resetOption<T>(cols: Column[], data: Array<T & BaseData>, ctx: KidarEcharts): EChartsOption | ECharts3DOption | EChartsCoreOption | false
}

export declare function defineConfig(config: EchartsPlugin): EchartsPlugin

export declare class KidarEcharts extends Vue {
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

  // echarts 的实例对象
  chart: EChartsType
  chartId: string

  // methods
  init: Function

}