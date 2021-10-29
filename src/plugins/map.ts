import { defineConfig } from '../index'
import * as echarts from 'echarts/core'
import china from '../geojson/geo_china.json'
import { SERIES_TYPE } from './constant'

echarts.registerMap('china', { geoJSON: china as any, specialAreas: { china: { left: 0, top: 0 } } })

export default defineConfig({
  name: 'map',
  resetOption(cols, data) {
    const option = {
      legend: {
        data: cols.map(t => t.name)
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
        selectedMode: 'single',
        map: 'china',
        coordinateSystem: 'geo'
      },
      series: [
        {
          type: SERIES_TYPE.effectScatter,
          coordinateSystem: 'geo',
          geoIndex: 0,
          data: [
            [121.48, 31.22],
            [121.39, 37.52],
            [104.06, 30.67, '成都', 455],
            [113.3, 40.12, '大同'],
            [111.0, 35.02, '运城'],
          ]
        }
      ]
    }

    return option
  }
})
