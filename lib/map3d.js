import { defineConfig } from "./kidar-echarts.es.js";
import * as echarts from "echarts";
import { c as china } from "./china.js";
import { SERIES_TYPE } from "./constant.js";
import "vue-demi";
echarts.registerMap("china", { geoJSON: china, specialAreas: { china: { left: 0, top: 0.75 } } });
var map3d = defineConfig({
  name: "map3d",
  resetOption(cols, data, ctx) {
    const { theme } = ctx;
    const isDark = theme === "dark";
    const itemStyle = {
      borderColor: isDark ? "#00f8fb" : "#92e1ff",
      borderWidth: 1,
      areaColor: {
        type: "radial",
        x: 0.5,
        y: 0.5,
        r: 0.8,
        colorStops: [{
          offset: 0,
          color: isDark ? "#09234c" : "#eee"
        }, {
          offset: 1,
          color: isDark ? "#274d68" : "#ffffff"
        }],
        globalCoord: true
      }
    };
    const option = {
      colorBy: "data",
      tooltip: {
        show: true
      },
      geo: {
        map: "china",
        aspectScale: 0.75,
        zoom: 1.1,
        roam: false,
        itemStyle,
        regions: [{
          name: "\u5357\u6D77\u8BF8\u5C9B",
          itemStyle: {
            areaColor: "#09234c",
            borderColor: "#09234c",
            opacity: 0,
            label: {
              show: false,
              color: "#009cc9"
            }
          }
        }]
      },
      series: [
        {
          type: "map",
          roam: false,
          label: {
            show: false,
            color: "#1DE9B6"
          },
          emphasis: {
            itemStyle: {
              areaColor: isDark ? "#00f8fb" : "#92e1ff",
              borderWidth: 0.1
            },
            label: {
              color: "#f87d5a"
            }
          },
          itemStyle,
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
