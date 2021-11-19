import { BarSeriesOption, LineSeriesOption, ScatterSeriesOption } from 'echarts'
import { defineConfig } from '../index'
import { omitNum, setZoom, approximateNum } from './common'


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

const baseYAxis = {
  type: 'value',
  axisLabel: {
    formatter: omitNum
  }
}

export default defineConfig({
  name: 'multi-line-bar-x',
  resetOption(cols, data, ctx) {
    const series: (LineSeriesOption | BarSeriesOption | ScatterSeriesOption)[] = []
    const yAxis = []
    const { rotate, omit, splitNumber } = ctx
    let barWidthCount = 1
    let barWidth = 30
    const stackSet = new Set()
    let y0Max = 0
    let y1Max = 0
    let isDouble = false
    const stackY0Max = new Map<string, number>()
    const stackY1Max = new Map<string, number>()

    cols.forEach(col => {
      const { name, prop, color, stack, itemStyle, y1 } = col
      !isDouble && (isDouble = y1 ? true : false)
      let yAxisIndex = y1 ? 1 : 0
      let item: LineSeriesOption | BarSeriesOption | ScatterSeriesOption = {
        name,
        stack,
        yAxisIndex,
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

      item.data = data.map(t => {
        let val = t[prop || name]
        let k = stack || 'default'
        if (y1) {
          stackY1Max.set(k, Math.max(stackY1Max.get(k) || 0, val))
        } else {
          stackY0Max.set(k, Math.max(stackY0Max.get(k) || 0, val))
        }

        return {
          data: { ...t },
          name: t.name,
          value: val
        }
      })

      series.push(item)
    })


    if (isDouble) {
      let splitNum = splitNumber || 5
      stackY0Max.forEach(v => {
        y0Max = Math.max(y0Max, v)
      })
      stackY1Max.forEach(v => {
        y1Max = Math.max(y1Max, v)
      })
      let y0Interval = approximateNum(y0Max / splitNum)
      let y1Interval = approximateNum(y1Max / splitNum)
      yAxis.push({ ...baseYAxis, interval: y0Interval, max: y0Interval * splitNum })
      yAxis.push({ ...baseYAxis, interval: y1Interval, max: y1Interval * splitNum })
    } else {
      yAxis.push({ ...baseYAxis })
    }

    const xLabelWidth = !rotate || rotate === 0 ? barWidth * barWidthCount : barWidth * barWidthCount * Math.abs(90 / rotate)

    const dataZoom = setZoom(barWidth * barWidthCount, ctx)

    return {
      legend: {
        show: true
      },
      tooltip: {
        show: true,
        trigger: 'axis',

      },
      dataZoom: dataZoom,
      yAxis: yAxis,
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
  }
})
