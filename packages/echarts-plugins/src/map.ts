import { defineConfig } from '@kidar/echarts-helper'
import * as echarts from 'echarts'
import china from '../geojson/china.json'
import { SERIES_TYPE } from './constant'
import citiesIngLat from '../asset/json/cities_lng_lat.json'
import { isNull, setTitle } from './utils'

echarts.registerMap('china', { geoJSON: china as any, specialAreas: { china: { left: 0, top: 0 } } })

declare class CitiesPoints {
  [key: string]: number[]
}
declare class LinesItem {
  coords: Array<Array<any>>
  lineStyle?: {
    color?: echarts.Color
  }
}

declare class ScatterItem {
  value: Array<any>
  itemStyle?: {
    color?: echarts.Color
  }
}

interface MapDataItem {
  name: string
  value: number
  lng?: number
  lat?: number
  tos?: MapDataItem
}

export default defineConfig({
  resetOption(cols, data: MapDataItem[], ctx) {
    const title = setTitle(ctx)
    let themeColor = ctx.chart.getOption().color
    const colors = Array.isArray(themeColor) ? themeColor : [themeColor]
    const symbolSizeMax = Math.min(ctx.chart.getHeight(), ctx.chart.getWidth()) / 15
    const scatterData: ScatterItem[] = []
    const linesData: LinesItem[] = []
    const cities = citiesIngLat as CitiesPoints
    let max = 0
    let min = 0
    let i = 0
    data.forEach(d => {
      let { name, value, lng, lat, tos } = d
      max = Math.max(max, value)
      min = Math.min(min, value)
      if (isNull(lng) || isNull(lat)) {
        [lng, lat] = cities[name.replace(/(市|县|地区)/g, '')] || []
      }
      let curP = [lng, lat, value, name, d]
      scatterData.push({ value: curP, itemStyle: { color: colors[i] } })

      if (Array.isArray(tos) && tos.length > 0) {
        tos.forEach(t => {
          let [tolng, tolat] = cities[t.name.replace(/(市|县|地区)/g, '')] || []
          let toP = [tolng, tolat, t.value, t.name, t]
          linesData.push({ coords: [curP, toP], lineStyle: { color: colors[i] } })
        })
      }

      i++
    })

    return {
      title,
      legend: {
        show: false
      },
      colorBy: 'data',
      tooltip: {
        show: true,
        formatter: (params: any) => {
          switch (params.componentSubType) {
            case 'lines':
              let [from, to] = params.data.coords || []
              return `${from[3]}(${from[2]}) --> ${to[3]}(${to[2]}) <br>${from[2] - to[2]}`
            case 'effectScatter':
              const [lng, lat, value, name] = params.value
              return `${name}: ${value}`
          }
        }
      },
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      geo: {
        roam: true,
        zoom: 1.1,
        aspectScale: 0.75, //长宽比
        layoutSize: '100%',
        selectedMode: false,
        map: 'china',
        coordinateSystem: 'geo'
      },
      series: [
        {
          id: ctx.chartId,
          universalTransition: true,
          type: SERIES_TYPE.effectScatter,
          coordinateSystem: 'geo',
          geoIndex: 0,
          symbolSize: (val: Array<number>) => {
            let size = (val[2] / (max * 2 - min)) * symbolSizeMax
            return size
          },
          data: scatterData
        },
        {
          type: 'lines',
          zlevel: 2,
          effect: {
            show: true,
            period: 4, //箭头指向速度，值越小速度越快
            trailLength: 0.4, //特效尾迹长度[0,1]值越大，尾迹越长重
            symbol: 'arrow', //箭头图标
            symbolSize: 7, //图标大小
          },
          data: linesData
        }
      ]
    }
  }
})
