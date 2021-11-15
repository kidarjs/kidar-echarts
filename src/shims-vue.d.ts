declare module "*.vue" {
  import { App } from 'vue-demi'
  const component: App
  export default component;
}

declare module 'echarts-gl/charts'

declare module 'echarts-gl/components'

declare module 'rollup-plugin-babel';