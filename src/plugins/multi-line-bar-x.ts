import { BarSeriesOption, LineSeriesOption, ScatterSeriesOption } from 'echarts'
import { defineConfig } from '../index'
import { setZoom } from './common'
import { getTextWidth } from 'nkxrb-tools'

function setLineSeries(item: LineSeriesOption) {
  item.type = 'line'
  item.smooth = true
}

function setBarSeries(item: BarSeriesOption) {
  item.type = 'bar'
  item.barMaxWidth = 20
}

function setScatterSeries(item: ScatterSeriesOption) {
  item.type = 'scatter'
}

export default defineConfig({
  name: 'multiLineOrBarX',
  resetOption(cols, data, ctx) {
    const series: (LineSeriesOption | BarSeriesOption | ScatterSeriesOption)[] = []
    const { rotate, omit } = ctx
    // let itemWidthMap: Object = {}
    cols.forEach(col => {
      // itemWidthMap
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

      item.data = data.map(t => ({
        ...t,
        value: t[prop || name]
      }))

      series.push(item)
    })

    const dataZoom = setZoom(cols, data, ctx)

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
          formatter: (value: string, index?: number) => value
        }
      }],
      series: series
    }

    option.xAxis[0].axisLabel.formatter = (value) => {
      if (getTextWidth(value)) {

      }
      return value
    }

    return option
  }
})
