declare module "*.vue" {
  import { KiEchartsPlus } from '../types/index'
  const component: KiEchartsPlus
  export default component;
}

declare module 'echarts-gl/charts'

declare module 'echarts-gl/components'