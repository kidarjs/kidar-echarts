import { defineConfig } from "./kidar-vue-echarts.es.js";
import "echarts";
var line = defineConfig({
  name: "line",
  resetOption(cols, data) {
    const option = {
      legend: {
        data: cols.map((t) => t.name)
      },
      yAxis: [
        {
          type: "value"
        }
      ],
      xAxis: [{
        type: "category",
        data: data.map((t) => t.name)
      }],
      series: [
        {
          type: "line",
          data
        }
      ]
    };
    return option;
  }
});
export { line as default };
