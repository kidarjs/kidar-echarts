import { defineConfig } from '../index'
import { omitNum } from './common'
import { AXIS_TYPE, SERIES_TYPE } from './constant'


export default defineConfig({
  name: 'line',
  resetOption(cols, data, ctx) {
    return {
      legend: {
        data: cols.map(t => t.name)
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
