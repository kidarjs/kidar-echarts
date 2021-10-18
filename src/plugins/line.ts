import { defineConfig } from '../index'

export default defineConfig({
  name: 'line',
  resetOption(cols, data) {
    const option = {
      legend: {
        data: cols.map(t => t.name)
      },
      yAxis: [
        {
          type: 'value'
        }
      ],
      xAxis: [{
        type: "category",
        data: data.map(t => t.name)
      }],
      series: [
        {
          type: 'line',
          data: data
        }
      ]
    }

    return option
  }
})
