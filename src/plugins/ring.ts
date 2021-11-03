import { defineConfig } from '../index'

export default defineConfig({
  name: 'ring',
  resetOption(cols, data, ctx) {
    return {
      legend: {
        data: cols.map(t => t.name)
      },
      series: [
        {
          type: 'pie',
          radius: ['35%', '45%'],
          data: data
        }
      ]
    }
  }
})
