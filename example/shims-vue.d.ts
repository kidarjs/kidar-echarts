declare module "*.vue" {
  import { App } from 'vue-demi'
  const component: App
  export default component;
}

/// <reference types="vite/client" />

declare module 'echarts-gl/charts'

declare module 'echarts-gl/components'

declare module 'rollup-plugin-babel';