import { defineConfig } from '../index'
import { omitNum, setTitle } from '../utils/common'
import { AXIS_TYPE, SERIES_TYPE } from './constant'


export default defineConfig({
  name: 'line',
  resetOption(cols, data, ctx) {
    const title = setTitle(ctx)
    return {
      title,
      grid: {
        left: 60,
        right: 60,
        bottom: 100
      },
      legend: {
        show: false
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      yAxis: [
        {
          type: AXIS_TYPE.value,
          axisLabel: {
            formatter: omitNum
          }
        }
      ],
      xAxis: [{
        type: AXIS_TYPE.category,
        data: data.map(t => t.name)
      }],
      series: [
        {
          id: ctx.chartId,
          animationDurationUpdate: 1000,
          universalTransition: true,
          type: SERIES_TYPE.line,
          data: data
        }
      ]
    }
  }
})
