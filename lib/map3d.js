import { defineConfig } from "./kidar-echarts.es.js";
import * as echarts from "echarts";
import { c as china } from "./china.js";
import { SERIES_TYPE } from "./constant.js";
import "vue-demi";
echarts.registerMap("china", { geoJSON: china, specialAreas: { china: { left: 0, top: 0.75 } } });
var map3d = defineConfig({
  name: "map3d",
  resetOption(cols, data, ctx) {
    const option = {
      backgroundColor: "#013954",
      legend: {
        data: cols.map((t) => t.name)
      },
      colorBy: "data",
      tooltip: {
        show: true
      },
      dataZoom: [
        {
          type: "inside"
        }
      ],
      geo: {
        map: "china",
        aspectScale: 0.75,
        zoom: 1.1,
        roam: false,
        itemStyle: {
          normal: {
            areaColor: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [{
                offset: 0,
                color: "#09132c"
              }, {
                offset: 1,
                color: "#274d68"
              }],
              globalCoord: true
            },
            shadowColor: "rgb(58,115,192)",
            shadowOffsetX: 10,
            shadowOffsetY: 11
          },
          emphasis: {
            areaColor: "#2AB8FF",
            borderWidth: 0,
            color: "green",
            label: {
              show: false
            }
          }
        },
        regions: [{
          name: "\u5357\u6D77\u8BF8\u5C9B",
          itemStyle: {
            areaColor: "rgba(0, 10, 52, 1)",
            borderColor: "rgba(0, 10, 52, 1)",
            normal: {
              opacity: 0,
              label: {
                show: false,
                color: "#009cc9"
              }
            }
          }
        }]
      },
      series: [
        {
          type: "map",
          roam: false,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: "#1DE9B6"
              }
            },
            emphasis: {
              textStyle: {
                color: "rgb(183,185,14)"
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: "rgb(147, 235, 248)",
              borderWidth: 1,
              areaColor: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [{
                  offset: 0,
                  color: "#09132c"
                }, {
                  offset: 1,
                  color: "#274d68"
                }],
                globalCoord: true
              }
            },
            emphasis: {
              areaColor: "rgb(46,229,206)",
              borderWidth: 0.1
            }
          },
          zoom: 1.1,
          map: "china"
        },
        {
          id: ctx.chartId,
          universalTransition: true,
          type: SERIES_TYPE.effectScatter,
          coordinateSystem: "geo",
          geoIndex: 0,
          symbolSize: (val) => {
            let size = val[3] / 10;
            size < 5 && (size = 5);
            size > 20 && (size = 20);
            return size;
          },
          data: [
            [121.48, 31.22, "\u4E0A\u6D77", 77],
            [121.39, 37.52, "\u8FDE\u4E91\u6E2F", 780],
            [104.06, 30.67, "\u6210\u90FD", 455],
            [113.3, 40.12, "\u5927\u540C", 150],
            [111, 35.02, "\u8FD0\u57CE", 700]
          ]
        }
      ]
    };
    return option;
  }
});
export { map3d as default };
