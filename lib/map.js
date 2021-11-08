import { defineConfig } from "./kidar-echarts.es.js";
import { r as registerMap, c as china } from "./geo_china.js";
import { SELECTED_MODE, SERIES_TYPE } from "./constant.js";
import "echarts";
registerMap("china", { geoJSON: china, specialAreas: { china: { left: 0, top: 0 } } });
var map = defineConfig({
  name: "map",
  resetOption(cols, data, ctx) {
    const option = {
      legend: {
        data: cols.map((t) => t.name)
      },
      colorBy: "data",
      tooltip: {
        show: true,
        formatter: (params) => {
          const [lng, lat, name, value] = params.value;
          return `${name}: ${value}`;
        }
      },
      dataZoom: [
        {
          type: "inside"
        }
      ],
      geo: {
        roam: true,
        center: [111, 35.02],
        layoutCenter: ["50%", "50%"],
        layoutSize: "100%",
        selectedMode: SELECTED_MODE.single,
        map: "china",
        coordinateSystem: "geo"
      },
      series: [
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
export { map as default };
