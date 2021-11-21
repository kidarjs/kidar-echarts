import { EChartsCoreOption, EChartsOption, EChartsType } from 'echarts'
export { KidarEcharts } from '../src/index'
export declare class Column {
  name: string
  prop?: string
  type?: string
  color?: string
  stack?: string
  itemStyle?: Object
  y1?: boolean
  symbol: string
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

export declare class KidarEchartsContext {
  init: () => void
  chart: echarts.ECharts
  title: string
  type: string
  cols: Column[]
  data: BaseData[]
  rotate?: number
  zoomNum?: number
  theme?: string | Object
  locale?: string
  renderer?: 'canvas' | 'svg'
  omit?: number
  useDirtyRect?: boolean
  devicePixelRatio?: number
  chartId?: string

  //仅适用于双Y轴，确定分割数量
  splitNumber?: number = 5
}

export interface EchartsPlugin {
  name: string
  resetOption<T>(cols: Column[], data: Array<T & BaseData>, ctx: KidarEchartsContext): EChartsOption | ECharts3DOption | EChartsCoreOption | false
}

export declare function defineConfig(config: EchartsPlugin): EchartsPlugin
