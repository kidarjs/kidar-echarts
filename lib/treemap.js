import { defineConfig } from "./kidar-echarts.es.js";
import { SERIES_TYPE } from "./constant.js";
import "vue-demi";
import "echarts";
var treemap = defineConfig({
  name: "treemap",
  resetOption(cols, data, ctx) {
    return {
      series: [
        {
          id: ctx.chartId,
          type: SERIES_TYPE.treemap,
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
