import { GraphSeriesOption } from 'echarts'
import { defineConfig } from '../index'
import { omitNum } from './common'
import { AXIS_TYPE, SERIES_TYPE } from './constant'

export default defineConfig({
  name: 'graph',
  resetOption(cols, data, ctx) {
    let res = data.sort((a, b) => b.value - a.value)
    const seriesData: GraphSeriesOption[] = []
    let max = 0
    let min = 0
    res.forEach(d => {
      const { name, value } = d
      max = Math.max(max, value)
      min = Math.min(min, value)
      const item = { name, value, draggable: true, }
      seriesData.push(item)
    })


    return {
      legend: {
        show: false
      },
      tooltip: {
        show: true
      },
      series: [
        {
          id: ctx.chartId,
          animationDurationUpdate: 1000,
          universalTransition: true,
          type: SERIES_TYPE.graph,
          layout: 'force',
          colorBy: 'data',
          force: {
            repulsion: 200,
            edgeLength: 10
          },
          roam: true,
          label: {
            show: true
          },
          symbolSize: (val) => {
            return Math.ceil(val / (max * 2 - min) * 150)
          },
          data: seriesData
        }
      ],
      animationDurationUpdate: function (idx) {
        // 越往后的数据延迟越大
        return idx * 100;
      },
      animationEasingUpdate: 'bounceIn',
    }
  }
})
