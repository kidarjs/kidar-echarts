import { defineConfig, CONST_CATEGORY } from '../index'

export default defineConfig({
  name: 'dybar',
  isDynamic: true,
  resetOption(cols, data) {
    const option = {
      dataZoom: {
        show: false
      },
      legend: {
        data: cols.map(t => t.name)
      },
      yAxis: [
        {
          type: CONST_CATEGORY,
          data: data.map(t => t.name),
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300
        }
      ],
      xAxis: [{
        type: 'value' as 'value',
        max: 'dataMax' as 'dataMax'
      }],
      series: [
        {
          type: 'bar' as 'bar',
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
      animationEasing: (k: number) => k,
      animationEasingUpdate: (k: number) => k
    }

    return option
  }
})
