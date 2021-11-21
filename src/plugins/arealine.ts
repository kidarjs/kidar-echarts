import { LineSeriesOption } from 'echarts'
import { defineConfig } from '../index'
import { getLinearColor, omitNum, setTitle, setZoom } from '../utils/common'
import { AXIS_TYPE, SERIES_TYPE } from './constant'

const baseSerie = {
  animationDurationUpdate: 1000,
  universalTransition: true,
  type: SERIES_TYPE.line,
  symbolSize: 2
}



export default defineConfig({
  name: 'arealine',
  resetOption(cols, data, ctx) {
    const title = setTitle(ctx)
    let startColor = 'rgba(25,163,223,.3)'
    let endColor = 'rgba(25,163,223,0)'

    const itemStyle = {
      borderWidth: 0
    }

    const series: LineSeriesOption[] = []

    cols.forEach(c => {
      const { name, prop, stack } = c
      startColor = c.color + 'bb' || startColor
      endColor = c.color + '00' || endColor
      let serie: LineSeriesOption = {
        ...baseSerie, name: name, id: prop || name, stack,
        itemStyle: { ...itemStyle, color: c.color }, areaStyle: getLinearColor(startColor, endColor)
      }

      serie.data = data.map(t => {
        return { item: { ...t }, col: { ...c }, name: t.name, value: t[prop || name] }
      })
      series.push(serie)
    })

    const dataZoom = setZoom(30, ctx)
    if (dataZoom.show) {
      dataZoom.bottom = 60
    }

    return {
      title,
      dataZoom: dataZoom,
      grid: {
        left: 60,
        right: 60,
        bottom: 100
      },
      legend: {
        show: true,
        type: "scroll",
        bottom: 20,
        icon: 'circle',
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
        boundaryGap: false,
        data: data.map(t => t.name)
      }],
      series: series
    }
  }
})
