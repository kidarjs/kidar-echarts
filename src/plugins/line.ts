import { CONST_V, defineConfig } from '../index'

export default defineConfig({
  name: 'line',
  resetOption(cols, data) {
    const option = {
      legend: {
        data: cols.map(t => t.name)
      },
      yAxis: [
        {
          type: CONST_V.value
        }
      ],
      xAxis: [{
        type: CONST_V.category,
        data: data.map(t => t.name)
      }],
      series: [
        {
          type: CONST_V.line,
          data: data
        }
      ]
    }

    return option
  }
})
