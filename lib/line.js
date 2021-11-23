import { defineConfig } from "./kidar-echarts.es.js";
import { s as setTitle, o as omitNum } from "./common.js";
import { AXIS_TYPE, SERIES_TYPE } from "./constant.js";
import "vue-demi";
import "echarts";
var line = defineConfig({
  name: "line",
  resetOption(cols, data, ctx) {
    const title = setTitle(ctx);
    return {
      title,
      grid: {
        left: 60,
        right: 60,
        bottom: 100
      },
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
