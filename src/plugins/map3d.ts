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
  resetOption(cols, data) {
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
          geoIndex: 0,
          data: [
            [[104.06, 30.67], [111.0, 35.02]],
            [[114.06, 30.67], [111.0, 35.02]],
            [[124.06, 30.67], [111.0, 35.02]],
            [[134.06, 30.67], [111.0, 35.02]]
          ],
          effect: {
            show: true,
            trailWidth: 2,
            trailLength: 0.2
          },
          blendMode: 'lighter',
          lineStyle: {
            width: 1,
            color: 'rgb(50, 50, 150)',
            opacity: 0.8
          },
        }
      ]
    }

    return option
  }
})
