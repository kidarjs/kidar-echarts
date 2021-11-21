import { defineConfig } from '../index'
import { setTitle } from './common'

export default defineConfig({
  name: 'pie',
  resetOption(cols, data, ctx) {
    const title = setTitle(ctx)
    return {
      title,
      legend: {
        data: data.map(t => t.name),
        type: 'scroll',
        bottom: 20,
        left: 16,
        right: 16
      },
      series: [
        {
          type: 'pie',
          radius: [0, '45%'],
          data: data,
          id: ctx.chartId,
          animationDurationUpdate: 1000,
          universalTransition: true,
        }
      ]
    }
  }
})
