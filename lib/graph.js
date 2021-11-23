import { defineConfig } from "./kidar-echarts.es.js";
import { s as setTitle } from "./common.js";
import { SERIES_TYPE } from "./constant.js";
import "vue-demi";
import "echarts";
const light = ["#00f8fb", "#00fe65", "#fbd161", "#fc5051", "#f87d5a", "#7b2cff", "#92e1ff", "#2ca1ff", "#ea7ccc"];
const dark = ["#009db2", "#00f8fb", "#b8860b", "#ff00ff", "#ff6347", "#4705b5", "#00fe65", "#0780cf", "#f5616f"];
var graph = defineConfig({
  name: "graph",
  resetOption(cols, data, ctx) {
    const title = setTitle(ctx);
    const { theme } = ctx;
    const colors = theme === "dark" ? light : dark;
    const seriesData = [];
    let max = 0;
    let min = 0;
    let i = 0;
    data.forEach((d) => {
      const { name, value } = d;
      max = Math.max(max, value);
      min = Math.min(min, value);
      if (i >= colors.length) {
        i = 0;
      }
      const item = {
        name,
        value,
        draggable: true,
        itemStyle: {
          shadowBlur: 100,
          shadowColor: colors[i],
          color: colors[i++]
        }
      };
      seriesData.push(item);
    });
    return {
      title,
      legend: {
        show: false
      },
      tooltip: {
        show: true
      },
      series: [
        {
          id: ctx.chartId,
          animationDurationUpdate: 1e3,
          universalTransition: true,
          type: SERIES_TYPE.graph,
          layout: "force",
          colorBy: "data",
          force: {
            repulsion: 200,
            edgeLength: 10
          },
          roam: true,
          label: {
            show: true
          },
          symbolSize: (val) => {
            return Math.ceil(val / (max * 2 - min) * 150);
          },
          data: seriesData
        }
      ],
      animationDurationUpdate: function(idx) {
        return idx * 100;
      },
      animationEasingUpdate: "bounceIn"
    };
  }
});
export { graph as default };
