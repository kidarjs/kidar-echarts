import { defineConfig } from "./kidar-vue-echarts.es.js";
import { AXIS_TYPE, SERIES_TYPE } from "./constant.js";
import "echarts";
var line = defineConfig({
  name: "line",
  resetOption(cols, data, ctx) {
    const option = {
      legend: {
        data: cols.map((t) => t.name)
      },
      yAxis: [
        {
          type: AXIS_TYPE.value
        }
      ],
      xAxis: [{
        type: AXIS_TYPE.category,
        data: data.map((t) => t.name)
      }],
      series: [
        {
          type: SERIES_TYPE.line,
          data
        }
      ]
    };
    return option;
  }
});
export { line as default };
