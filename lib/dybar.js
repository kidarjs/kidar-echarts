import { defineConfig } from "./kidar-echarts.es.js";
import { AXIS_TYPE, CONST_V, SERIES_TYPE, POSITION } from "./constant.js";
import "echarts";
var dybar = defineConfig({
  name: "dybar",
  isDynamic: true,
  resetOption(cols, data, ctx) {
    let max = 10;
    max = Math.floor(ctx.chart.getHeight() / 25);
    const option = {
      dataZoom: {
        show: false
      },
      legend: {
        data: cols.map((t) => t.name)
      },
      yAxis: [
        {
          type: AXIS_TYPE.category,
          boundaryGap: true,
          data: data.map((t) => t.name),
          axisLabel: {
            interval: 0
          },
          min: 0,
          max,
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300
        }
      ],
      xAxis: [{
        type: AXIS_TYPE.value,
        max: CONST_V.dataMax
      }],
      series: [
        {
          type: SERIES_TYPE.bar,
          realtimeSort: true,
          data,
          label: {
            show: true,
            position: POSITION.right,
            valueAnimation: true
          }
        }
      ],
      animationDuration: 0,
      animationDurationUpdate: 3e3,
      animationEasing: (k) => k,
      animationEasingUpdate: (k) => k
    };
    return option;
  }
});
export { dybar as default };
