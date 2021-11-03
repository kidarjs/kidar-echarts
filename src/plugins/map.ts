import { defineConfig } from '../index'
import * as echarts from 'echarts/core'
import china from '../geojson/geo_china.json'
import { SELECTED_MODE, SERIES_TYPE } from './constant'

echarts.registerMap('china', { geoJSON: china as any, specialAreas: { china: { left: 0, top: 0 } } })

export default defineConfig({
  name: 'map',
  resetOption(cols, data, ctx) {
    const option = {
      legend: {
        data: cols.map(t => t.name)
      },
      colorBy: 'data',
      tooltip: {
        show: true,
        formatter: (params: any) => {
          const [lng, lat, name, value] = params.value
          return `${name}: ${value}`
        }
      },
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      geo: {
        roam: true,
        center: [111.0, 35.02],
        layoutCenter: ['50%', '50%'],
        layoutSize: '100%',
        selectedMode: SELECTED_MODE.single,
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
            let size = val[3] / 10

            size < 5 && (size = 5)
            size > 20 && (size = 20)

            return size
          },
          data: [
            [121.48, 31.22, '上海', 77],
            [121.39, 37.52, '连云港', 780],
            [104.06, 30.67, '成都', 455],
            [113.3, 40.12, '大同', 150],
            [111.0, 35.02, '运城', 700],
          ]
        }
      ]
    }

    return option
  }
})
