import { defineConfig } from '../index'

export default defineConfig({
  name: 'pie',
  resetOption(cols, data, ctx) {
    return {
      legend: {
        data: cols.map(t => t.name)
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
