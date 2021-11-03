import { defineConfig } from "./kidar-vue-echarts.es.js";
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
          type: "pie",
          radius: ["35%", "45%"],
          data
        }
      ]
    };
  }
});
export { ring as default };
