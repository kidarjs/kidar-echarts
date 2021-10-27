import { CONST_V, defineConfig } from '../index'
import * as echarts from 'echarts/core'
import { world } from '../geojson/world'

echarts.registerMap('world', { svg: world })

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
        center: [115.97, 29.71],
        // layoutCenter: ['50%', '50%'],
        // layoutSize: '100%',
        selectedMode: 'single',
        map: 'world',
        coordinateSystem: 'geo',
        left: 0, top: 0, right: 0, bottom: 0,
        boundingCoords: [
          // 定位左上角经纬度
          [-180, 90],
          // 定位右下角经纬度
          [180, -90]
        ]
      },
      series: [
        {
          type: CONST_V.scatter,
          coordinateSystem: 'geo',
          geoIndex: 0,
          data: [
            [121.48, 31.22]
          ]
        }
      ]
    }

    return option
  }
})
