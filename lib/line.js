import { defineConfig } from "./kidar-echarts.es.js";
import { omitNum } from "./common.js";
import { AXIS_TYPE, SERIES_TYPE } from "./constant.js";
import "vue-demi";
import "echarts";
var line = defineConfig({
  name: "line",
  resetOption(cols, data, ctx) {
    return {
      legend: {
        show: false
      },
      tooltip: {
        show: true,
        trigger: "axis"
      },
      yAxis: [
        {
          type: AXIS_TYPE.value,
          axisLabel: {
            formatter: omitNum
          }
        }
      ],
      xAxis: [{
        type: AXIS_TYPE.category,
        data: data.map((t) => t.name)
      }],
      series: [
        {
          id: ctx.chartId,
          animationDurationUpdate: 1e3,
          universalTransition: true,
          type: SERIES_TYPE.line,
          data
        }
      ]
    };
  }
});
export { line as default };
