import { defineConfig } from "./kidar-vue-echarts.es.js";
import "echarts";
var dybar = defineConfig({
  name: "dybar",
  resetOption(cols, data) {
    const option = {
      legend: {
        data: cols.map((t) => t.name)
      },
      yAxis: [
        {
          type: "category",
          data: data.map((t) => t.name),
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300
        }
      ],
      xAxis: [{
        type: "value",
        max: "dataMax"
      }],
      series: [
        {
          type: "bar",
          realtimeSort: true,
          data,
          label: {
            show: true,
            position: "right",
            valueAnimation: true
          }
        }
      ],
      animationDuration: 0,
      animationDurationUpdate: 3e3,
      animationEasing: "linear",
      animationEasingUpdate: "linear"
    };
    return option;
  }
});
export { dybar as default };
