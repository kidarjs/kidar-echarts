import { CONST_V, defineConfig } from '../index'
import * as echarts from 'echarts/core'
import { svg } from '../geojson/china'

echarts.registerMap('china', { svg: svg })

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
      series: [
        {
          type: CONST_V.map,
          map: 'china',
          nameMap: {
            'Beijing': '北京'
          },
          roam: true,
          layoutCenter: ['50%', '50%'],
          layoutSize: '100%',
          data: data
        }
      ]
    }

    return option
  }
})
