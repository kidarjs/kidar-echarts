declare module "*.vue" {
  import { KidarEcharts } from '../types/index'
  const component: KidarEcharts
  export default component;
}

declare module 'echarts-gl/charts'

declare module 'echarts-gl/components'

declare module 'rollup-plugin-babel';