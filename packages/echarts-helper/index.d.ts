import { EChartsCoreOption, EChartsOption } from 'echarts'

export declare interface Column {
  name: string
  prop?: string
  type?: string
  color?: string
  stack?: string
  itemStyle?: Object
  y1?: boolean
  symbol?: string
}
export declare interface BaseData {
  name: string
  value: number
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

export declare interface KidarEchartsContext {
  init: () => void
  tooltip?: (params: unknown) => string
  label?: (params: unknown) => string
  click?: (params: unknown) => void

  chart: echarts.ECharts
  type: string
  cols?: Column[]
  data: BaseData[]
  extra?: Object
  title?: string
  subtitle?: string
  theme?: string | Object
  locale?: string
  renderer?: 'canvas' | 'svg'
  useDirtyRect?: boolean
  devicePixelRatio?: number
  chartId?: string
}

export interface EchartsPlugin {
  resetOption<T>(cols: Column[], data: Array<BaseData & T>, ctx: KidarEchartsContext): EChartsOption | ECharts3DOption | EChartsCoreOption | false
}

export const defineConfig = (config: EchartsPlugin) => { return config }