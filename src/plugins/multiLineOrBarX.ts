import { BarSeriesOption, LineSeriesOption } from 'echarts'
import { defineConfig } from '../index'

export default defineConfig({
  name: 'multiLineOrBarX',
  resetOption(cols, data) {
    const series: (LineSeriesOption | BarSeriesOption)[] = []
    cols.forEach(col => {
      let item: LineSeriesOption | BarSeriesOption = {}
      if (col.type === 'bar') {
        item.type = 'bar'
      } else {
        item.type = 'line'
      }
      item.itemStyle = {
        color: col.color
      }
      item.data = data.map(t => ({
        ...t,
        value: t[col.prop || col.name]
      }))

      series.push(item)
    })

    return {
      legend: {
        data: cols.map(t => t.name)
      },
      yAxis: [
        {
          type: 'value'
        }
      ],
      xAxis: [{
        type: 'category',
        data: data.map(t => t.name)
      }],
      series: series
    }
  }
})
