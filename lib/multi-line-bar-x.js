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
import { setZoom } from "./common.js";
import "vue-demi";
import "echarts";
function setLineSeries(item) {
  item.type = "line";
}
function setBarSeries(item) {
  item.type = "bar";
  item.barMaxWidth = 20;
}
function setScatterSeries(item) {
  item.type = "scatter";
}
var multiLineBarX = defineConfig({
  name: "multi-line-bar-x",
  resetOption(cols, data, ctx) {
    const series = [];
    const { rotate, omit } = ctx;
    let barWidthCount = 1;
    let barWidth = 25;
    let stackSet = new Set();
    cols.forEach((col) => {
      const { name, prop, color, stack, itemStyle } = col;
      let item = {
        name,
        stack,
        itemStyle: __spreadValues({
          color
        }, itemStyle)
      };
      switch (col.type) {
        case "bar":
          setBarSeries(item);
          break;
        case "scatter":
          setScatterSeries(item);
          break;
        default:
          setLineSeries(item);
          break;
      }
      if (col.type === "bar" && !stackSet.has(stack)) {
        barWidthCount++;
        stackSet.add(stack);
      }
      item.data = data.map((t) => __spreadProps(__spreadValues({}, t), {
        value: t[prop || name]
      }));
      series.push(item);
    });
    const xLabelWidth = rotate === 0 ? barWidth * barWidthCount : barWidth * barWidthCount * Math.abs(90 / rotate);
    const dataZoom = setZoom(barWidth * barWidthCount, ctx);
    const option = {
      legend: {
        data: cols.map((t) => t.name)
      },
      dataZoom,
      yAxis: [
        {
          type: "value"
        }
      ],
      xAxis: [{
        type: "category",
        data: data.map((t) => t.name),
        axisLabel: {
          rotate,
          interval: omit ? "auto" : 0,
          width: xLabelWidth,
          overflow: "truncate"
        }
      }],
      series
    };
    return option;
  }
});
export { multiLineBarX as default };
