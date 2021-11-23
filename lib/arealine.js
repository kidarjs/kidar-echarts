var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { defineConfig } from "./kidar-echarts.es.js";
import { s as setTitle, g as getLinearColor, a as setZoom, o as omitNum } from "./common.js";
import { AXIS_TYPE, SERIES_TYPE } from "./constant.js";
import "vue-demi";
import "echarts";
const baseSerie = {
  animationDurationUpdate: 1e3,
  universalTransition: true,
  type: SERIES_TYPE.line,
  symbolSize: 2
};
var arealine = defineConfig({
  name: "arealine",
  resetOption(cols, data, ctx) {
    const title = setTitle(ctx);
    let startColor = "rgba(25,163,223,.3)";
    let endColor = "rgba(25,163,223,0)";
    const itemStyle = {
      borderWidth: 0
    };
    const series = [];
    cols.forEach((c) => {
      const { name, prop, stack } = c;
      startColor = c.color + "bb" || startColor;
      endColor = c.color + "00" || endColor;
      let serie = __spreadProps(__spreadValues({}, baseSerie), {
        name,
        id: prop || name,
        stack,
        itemStyle: __spreadProps(__spreadValues({}, itemStyle), { color: c.color }),
        areaStyle: getLinearColor(startColor, endColor)
      });
      serie.data = data.map((t) => {
        return { item: __spreadValues({}, t), col: __spreadValues({}, c), name: t.name, value: t[prop || name] };
      });
      series.push(serie);
    });
    const dataZoom = setZoom(30, ctx);
    if (dataZoom.show) {
      dataZoom.bottom = 60;
    }
    return {
      title,
      dataZoom,
      grid: {
        left: 60,
        right: 60,
        bottom: 100
      },
      legend: {
        show: true,
        type: "scroll",
        bottom: 20,
        icon: "circle",
        data: cols.map((t) => t.name)
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
        boundaryGap: false,
        data: data.map((t) => t.name)
      }],
      series
    };
  }
});
export { arealine as default };
