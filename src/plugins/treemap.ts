import { defineConfig } from '../index'
import { SERIES_TYPE } from './constant'

export default defineConfig({
  name: 'treemap',
  resetOption(cols, data, ctx) {

    return {
      series: [
        {
          id: ctx.chartId,
          type: SERIES_TYPE.treemap,
          animationDurationUpdate: 1000,
          roam: false,
          nodeClick: undefined,
          data: data,
          universalTransition: true,
          label: {
            show: true
          },
          breadcrumb: {
            show: false
          }
        }
      ]
    }
  }
})