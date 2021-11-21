import { defineConfig } from '../index'
import { setTitle } from '../utils/common'
import { AXIS_TYPE, CONST_V, POSITION, SERIES_TYPE } from './constant'

export default defineConfig({
  name: 'dybar',
  resetOption(cols, data, ctx) {
    const title = setTitle(ctx)
    let max = Math.floor(ctx.chart.getHeight() / 25)
    if (max > data.length) {
      max = data.length
    }

    const option = {
      title,
      dataZoom: {
        show: false
      },
      legend: {
        show: false
      },
      yAxis: [
        {
          type: AXIS_TYPE.category,
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
        type: AXIS_TYPE.value,
        max: CONST_V.dataMax
      }],
      series: [
        {
          type: SERIES_TYPE.bar,
          realtimeSort: true,
          data: data,
          label: {
            show: true,
            position: POSITION.right,
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
