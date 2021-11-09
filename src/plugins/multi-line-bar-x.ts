import { BarSeriesOption, LineSeriesOption, ScatterSeriesOption } from 'echarts'
import { defineConfig } from '../index'
import { setZoom } from './common'


function setLineSeries(item: LineSeriesOption) {
  item.type = 'line'
}

function setBarSeries(item: BarSeriesOption) {
  item.type = 'bar'
  item.barMaxWidth = 20
}

function setScatterSeries(item: ScatterSeriesOption) {
  item.type = 'scatter'
}

export default defineConfig({
  name: 'multi-line-bar-x',
  resetOption(cols, data, ctx) {
    const series: (LineSeriesOption | BarSeriesOption | ScatterSeriesOption)[] = []
    const { rotate, omit } = ctx
    let barWidthCount = 1
    let barWidth = 25
    let stackSet = new Set()
    cols.forEach(col => {
      const { name, prop, color, stack, itemStyle } = col

      let item: LineSeriesOption | BarSeriesOption | ScatterSeriesOption = {
        name, stack,
        itemStyle: {
          color: color,
          ...itemStyle
        }
      }

      switch (col.type) {
        case 'bar': setBarSeries(item as BarSeriesOption); break
        case 'scatter': setScatterSeries(item as ScatterSeriesOption); break
        default: setLineSeries(item as LineSeriesOption); break
      }

      if (col.type === 'bar' && !stackSet.has(stack)) {
        barWidthCount++
        stackSet.add(stack)
      }

      item.data = data.map(t => ({
        ...t,
        value: t[prop || name]
      }))

      series.push(item)
    })

    const xLabelWidth = rotate === 0 ? barWidth * barWidthCount : barWidth * barWidthCount * Math.abs(90 / rotate)

    const dataZoom = setZoom(barWidth * barWidthCount, ctx)

    const option = {
      legend: {
        data: cols.map(t => t.name)
      },
      dataZoom: dataZoom,
      yAxis: [
        {
          type: 'value' as 'value'
        }
      ],
      xAxis: [{
        type: 'category' as 'category',
        data: data.map(t => t.name),
        axisLabel: {
          rotate: rotate,
          interval: omit ? 'auto' : 0,
          width: xLabelWidth,
          overflow: 'truncate'
        }
      }],
      series: series
    }

    return option
  }
})
