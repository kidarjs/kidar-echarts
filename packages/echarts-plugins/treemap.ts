import { defineConfig } from '@kidar/echarts-helper'
import { setTitle } from './utils'
import { SERIES_TYPE } from './constant'

export default defineConfig({
  resetOption(cols, data, ctx) {
    const title = setTitle(ctx)
    return {
      title,
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