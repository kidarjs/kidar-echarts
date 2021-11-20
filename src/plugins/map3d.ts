import { defineConfig } from '../index'
import * as echarts from 'echarts'
import china from '../geojson/china.json'
import { SELECTED_MODE, SERIES_TYPE } from './constant'

echarts.registerMap('china', { geoJSON: china as any, specialAreas: { china: { left: 0, top: 0.75 } } })

export default defineConfig({
  name: 'map3d',
  resetOption(cols, data, ctx) {
    const { theme } = ctx
    const isDark = theme === 'dark'
    const itemStyle = {
      borderColor: isDark ? '#00f8fb' : '#92e1ff',
      borderWidth: 1,
      areaColor: {
        type: 'radial',
        x: 0.5,
        y: 0.5,
        r: 0.8,
        colorStops: [{
          offset: 0,
          color: isDark ? '#09234c' : '#eee' // 0% 处的颜色
        }, {
          offset: 1,
          color: isDark ? '#274d68' : '#ffffff'  // 100% 处的颜色
        }],
        globalCoord: true // 缺省为 false
      }
    }

    const option = {
      colorBy: 'data',
      tooltip: {
        show: true
      },
      geo: {
        map: 'china',
        aspectScale: 0.75, //长宽比
        zoom: 1.1,
        roam: false,
        itemStyle: itemStyle,
        regions: [{
          name: '南海诸岛',
          itemStyle: {
            areaColor: '#09234c',
            borderColor: '#09234c',
            opacity: 0,
            label: {
              show: false,
              color: "#009cc9",
            }
          }
        }],
      },
      series: [
        {
          type: 'map',
          roam: false,
          label: {
            show: false,
            color: '#1DE9B6'
          },
          emphasis: {
            itemStyle: {
              areaColor: isDark ? '#00f8fb' : '#92e1ff',
              borderWidth: 0.1
            },
            label: {
              color: '#f87d5a'
            }
          },
          itemStyle: itemStyle,
          zoom: 1.1,
          map: 'china' //使用
        },
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
