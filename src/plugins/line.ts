import { defineConfig } from '../index'
import { AXIS_TYPE, SERIES_TYPE } from './constant'

export default defineConfig({
  name: 'line',
  resetOption(cols, data) {
    const option = {
      legend: {
        data: cols.map(t => t.name)
      },
      yAxis: [
        {
          type: AXIS_TYPE.value
        }
      ],
      xAxis: [{
        type: AXIS_TYPE.category,
        data: data.map(t => t.name)
      }],
      series: [
        {
          type: SERIES_TYPE.line,
          data: data
        }
      ]
    }

    return option
  }
})
