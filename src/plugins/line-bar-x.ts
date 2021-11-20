import { BarSeriesOption, LineSeriesOption, ScatterSeriesOption } from 'echarts'
import { BaseData, Column, KidarEchartsContext } from 'types'
import { defineConfig } from '../index'
import { omitNum, setZoom, approximateNum, baseSerie } from './common'


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

function calculateDoubleYAxisInterval<T>(cols: Column[], data: Array<T & BaseData>, splitNum: number) {
  let y0Max = 0
  let y1Max = 0
  const stackY0 = new Map<string, number>()
  const stackY1 = new Map<string, number>()
  cols.forEach(c => {
    const { y1, stack, name, prop } = c
    data.forEach(d => {
      let k = d.name + '-' + stack
      let val = d[prop || name]
      if (y1) {
        stack && stackY1.has(k) ? stackY1.set(k, (stackY1.get(k) || 0) + val) : stackY1.set(k, val)
      } else {
        stack && stackY0.has(k) ? stackY0.set(k, (stackY0.get(k) || 0) + val) : stackY0.set(k, val)
      }
    })
  })

  stackY1.forEach(v => {
    y1Max = Math.max(v, y1Max)
  })
  stackY0.forEach(v => {
    y0Max = Math.max(v, y0Max)
  })

  let y0Interval = approximateNum(y0Max / splitNum)
  let y1Interval = approximateNum(y1Max / splitNum)
  return { y0Interval, y1Interval }
}

const baseYAxis = {
  type: 'value',
  axisLabel: {
    formatter: omitNum
  }
}

export default defineConfig({
  name: 'line-bar-x',
  resetOption(cols, data, ctx) {
    const series: (LineSeriesOption | BarSeriesOption | ScatterSeriesOption)[] = []
    const yAxis = []
    const { rotate, omit, splitNumber } = ctx
    let barWidthCount = 1
    let barWidth = 30
    const stackSet = new Set()
    let isDouble = false

    cols.forEach(col => {
      const { name, prop, color, stack, itemStyle, y1 } = col
      !isDouble && (isDouble = y1 ? true : false)
      let yAxisIndex = y1 ? 1 : 0
      let item: LineSeriesOption | BarSeriesOption | ScatterSeriesOption = {
        ...baseSerie, name, stack, id: prop || name, yAxisIndex, itemStyle: {
          ...itemStyle,
          color: color
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
        return {
          item: { ...t },
          col: { ...col },
          name: t.name,
          value: val
        }
      })

      series.push(item)
    })


    if (isDouble) {
      let splitNum = splitNumber || 5
      const { y0Interval, y1Interval } = calculateDoubleYAxisInterval(cols, data, splitNum)
      yAxis.push({ ...baseYAxis, interval: y0Interval, max: y0Interval * splitNum })
      yAxis.push({ ...baseYAxis, interval: y1Interval, max: y1Interval * splitNum })
    } else {
      yAxis.push({ ...baseYAxis })
    }

    barWidthCount === 1 && (barWidthCount = 2)
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
