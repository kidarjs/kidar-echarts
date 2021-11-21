import { defineConfig } from '../index'
import { setTitle } from './common'

export default defineConfig({
  name: 'ring',
  resetOption(cols, data, ctx) {
    const title = setTitle(ctx)
    return {
      title,
      legend: {
        type: 'scroll',
        bottom: 20,
        left: 16,
        right: 16,
        data: data.map(t => t.name)
      },
      series: [
        {
          id: ctx.chartId,
          animationDurationUpdate: 1000,
          universalTransition: true,
          type: 'pie',
          radius: ['35%', '50%'],
          data: data
        }
      ]
    }
  }
})
