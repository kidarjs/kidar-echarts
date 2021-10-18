import { defineConfig } from '../index'

export default defineConfig({
  name: 'line',
  resetOption(cols, data) {
    const option = {
      legend: {
        data: cols.map(t => t.name)
      },
      xAsix: [
        {
          type: 'category',
          data: data.map(t => t.name)
        }
      ],
      series: [
        {
          type: 'pilinee',
          data: data
        }
      ]
    }

    return option
  }
})
