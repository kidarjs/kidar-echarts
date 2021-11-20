import { defineConfig } from '../index'

export default defineConfig({
  name: 'ring',
  resetOption(cols, data, ctx) {
    return {
      legend: {
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
