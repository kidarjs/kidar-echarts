import { defineConfig, CONST_V } from '../index'

export default defineConfig({
  name: 'dybar',
  isDynamic: true,
  resetOption(cols, data, ctx) {
    let max = 10
    let interval = 25
    max = Math.floor(ctx.chart.getHeight() / 25)

    const option = {
      dataZoom: {
        show: false
      },
      legend: {
        data: cols.map(t => t.name)
      },
      yAxis: [
        {
          type: CONST_V.category,
          boundaryGap: true,
          data: data.map(t => t.name),
          axisLabel: {
            interval: 0
          },
          min: 0,
          max: max,
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300
        }
      ],
      xAxis: [{
        type: CONST_V.value,
        max: CONST_V.dataMax
      }],
      series: [
        {
          type: CONST_V.bar,
          realtimeSort: true,
          data: data,
          label: {
            show: true,
            position: CONST_V.right,
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
