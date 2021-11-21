import { defineConfig } from "./kidar-echarts.es.js";
import { setTitle } from "./common.js";
import "vue-demi";
import "echarts";
var pie = defineConfig({
  name: "pie",
  resetOption(cols, data, ctx) {
    const title = setTitle(ctx);
    return {
      title,
      legend: {
        data: data.map((t) => t.name),
        type: "scroll",
        bottom: 20,
        left: "center",
        padding: [5, 16]
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
