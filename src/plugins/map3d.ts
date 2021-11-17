import { defineConfig } from '../index'
import * as echarts from 'echarts'
import china from '../geojson/china.json'
import { SELECTED_MODE, SERIES_TYPE } from './constant'

echarts.registerMap('china', { geoJSON: china as any, specialAreas: { china: { left: 0, top: 0.75 } } })

export default defineConfig({
  name: 'map3d',
  resetOption(cols, data, ctx) {
    const option = {
      backgroundColor: '#013954',
      legend: {
        data: cols.map(t => t.name)
      },
      colorBy: 'data',
      tooltip: {
        show: true
      },
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      geo: {
        map: 'china',
        aspectScale: 0.75, //长宽比
        zoom: 1.1,
        roam: false,
        itemStyle: {
          normal: {
            areaColor: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [{
                offset: 0,
                color: '#09132c' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#274d68'  // 100% 处的颜色
              }],
              globalCoord: true // 缺省为 false
            },
            shadowColor: 'rgb(58,115,192)',
            shadowOffsetX: 10,
            shadowOffsetY: 11
          },
          emphasis: {
            areaColor: '#2AB8FF',
            borderWidth: 0,
            color: 'green',
            label: {
              show: false
            }
          }
        },
        regions: [{
          name: '南海诸岛',
          itemStyle: {
            areaColor: 'rgba(0, 10, 52, 1)',

            borderColor: 'rgba(0, 10, 52, 1)',
            normal: {
              opacity: 0,
              label: {
                show: false,
                color: "#009cc9",
              }
            }
          },


        }],
      },
      series: [
        {
          type: 'map',
          roam: false,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#1DE9B6'
              }
            },
            emphasis: {
              textStyle: {
                color: 'rgb(183,185,14)'
              }
            }
          },

          itemStyle: {
            normal: {
              borderColor: 'rgb(147, 235, 248)',
              borderWidth: 1,
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [{
                  offset: 0,
                  color: '#09132c' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#274d68'  // 100% 处的颜色
                }],
                globalCoord: true // 缺省为 false
              },
            },
            emphasis: {
              areaColor: 'rgb(46,229,206)',
              borderWidth: 0.1
            }
          },
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
