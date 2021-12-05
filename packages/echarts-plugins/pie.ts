import { defineConfig, KidarEchartsContext } from '@kidar/echarts-helper'
import { setTitle } from './utils'

interface PieExtra {
  radius?: string | number | (string | number)[]
}

export default defineConfig({
  resetOption(cols, data, ctx: KidarEchartsContext & { extra?: PieExtra }) {
    const { extra } = ctx
    const { radius } = extra || {}
    const title = setTitle(ctx)
    return {
      title,
      legend: {
        type: 'scroll',
        bottom: 20,
        left: 'center',
        padding: [5, 16],
        data: data.map(t => t.name)
      },
      series: [
        {
          id: ctx.chartId,
          animationDurationUpdate: 1000,
          universalTransition: true,
          type: 'pie',
          radius: radius ? radius : ['35%', '50%'],
          data: data
        }
      ]
    }
  }
})
