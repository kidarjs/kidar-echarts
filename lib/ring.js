import { defineConfig } from "./kidar-echarts.es.js";
import "vue";
import "echarts";
var ring = defineConfig({
  name: "ring",
  resetOption(cols, data, ctx) {
    return {
      legend: {
        data: cols.map((t) => t.name)
      },
      series: [
        {
          id: ctx.chartId,
          animationDurationUpdate: 1e3,
          universalTransition: true,
          type: "pie",
          radius: ["35%", "45%"],
          data
        }
      ]
    };
  }
});
export { ring as default };
