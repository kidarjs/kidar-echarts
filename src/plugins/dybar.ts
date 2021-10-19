import { defineConfig } from '../index'

export default defineConfig({
  name: 'dybar',
  resetOption(cols, data) {
    const option = {
      legend: {
        data: cols.map(t => t.name)
      },
      yAxis: [
        {
          type: "category",
          data: data.map(t => t.name),
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300
        }
      ],
      xAxis: [{
        type: 'value',
        max: 'dataMax'
      }],
      series: [
        {
          type: 'bar',
          realtimeSort: true,
          data: data,
          label: {
            show: true,
            position: 'right',
            valueAnimation: true
          }
        }
      ],
      animationDuration: 0,
      animationDurationUpdate: 3000,
      animationEasing: 'linear',
      animationEasingUpdate: 'linear'
    }

    return option
  }
})
