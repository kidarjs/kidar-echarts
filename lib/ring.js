import { defineConfig } from "./kidar-echarts.es.js";
import { setTitle } from "./common.js";
import "vue-demi";
import "echarts";
var ring = defineConfig({
  name: "ring",
  resetOption(cols, data, ctx) {
    const title = setTitle(ctx);
    return {
      title,
      legend: {
        type: "scroll",
        bottom: 20,
        left: 16,
        right: 16,
        data: data.map((t) => t.name)
      },
      series: [
        {
          id: ctx.chartId,
          animationDurationUpdate: 1e3,
          universalTransition: true,
          type: "pie",
          radius: ["35%", "50%"],
          data
        }
      ]
    };
  }
});
export { ring as default };
