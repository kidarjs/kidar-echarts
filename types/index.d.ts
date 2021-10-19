import { VueConstructor } from 'vue'
import { EChartsCoreOption, EChartsOption } from 'echarts'

export type SFCWithInstall<T> = T & {
  install(vue: VueConstructor): void
  plugins?: { [key: string]: EchartsPlugin }
  addPlugin?(plugin: EchartsPlugin): this
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
  resetOption<T>(cols: Column[], data: Array<T & BaseData>): EChartsCoreOption,
  resetOption<T>(cols: Column[], data: Array<T & BaseData>): EChartsOption
}