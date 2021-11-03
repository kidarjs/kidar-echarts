import { defineConfig } from "./kidar-vue-echarts.es.js";
import { SERIES_TYPE } from "./constant.js";
import "echarts";
var treemap = defineConfig({
  name: "treemap",
  resetOption(cols, data) {
    return {
      series: [
        {
          type: SERIES_TYPE.treemap,
          id: "echarts-package-size",
          animationDurationUpdate: 1e3,
          roam: false,
          nodeClick: void 0,
          data,
          universalTransition: true,
          label: {
            show: true
          },
          breadcrumb: {
            show: false
          }
        }
      ]
    };
  }
});
export { treemap as default };
