import { defineConfig } from '../index'
import * as echarts from 'echarts/core'
import china from '../geojson/geo_china.json'
import { SERIES_TYPE } from './constant'
import { Lines3DChart } from 'echarts-gl/charts'
import { GlobeComponent, Geo3DComponent } from 'echarts-gl/components'

echarts.use([Lines3DChart, GlobeComponent, Geo3DComponent])

echarts.registerMap('china', { geoJSON: china as any, specialAreas: { china: { left: 0, top: 0 } } })

export default defineConfig({
  name: 'map',
  resetOption(cols, data, ctx) {
    ctx.chart.dispose()
    ctx.init()
    const option = {
      geo3D: {
        map: 'china',
        viewControl: {
          rotateSensitivity: 0
        }
      },
      series: [
        {
          type: SERIES_TYPE.lines3D,
          coordinateSystem: 'geo3D',
          geo3DIndex: 0,
          data: [
            [[104.06, 30.67, 1], [111.0, 35.02, 2]],
            [[114.06, 30.67, 5], [111.0, 35.02, 3]],
            [[104.06, 32.67, 2], [111.0, 35.02, 5]],
            [[124.06, 50.67, 4], [111.0, 35.02, 1]]
          ],
          effect: {
            show: true,
            trailColor: '#1890ff',
            trailOpacity: 0.8
          },
          blendMode: 'source-over',
          lineStyle: {
            width: 2,
            color: '#1890ff',
            opacity: 0.2
          },
        }
      ]
    }

    return option
  }
})
