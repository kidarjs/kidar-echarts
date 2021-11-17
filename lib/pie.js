import { defineConfig } from "./kidar-echarts.es.js";
import "vue-demi";
import "echarts";
var pie = defineConfig({
  name: "pie",
  resetOption(cols, data, ctx) {
    return {
      legend: {
        data: cols.map((t) => t.name)
      },
      series: [
        {
          type: "pie",
          radius: [0, "45%"],
          data,
          id: ctx.chartId,
          animationDurationUpdate: 1e3,
          universalTransition: true
        }
      ]
    };
  }
});
export { pie as default };
