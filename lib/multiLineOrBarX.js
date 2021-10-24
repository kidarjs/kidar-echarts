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
import { defineConfig } from "./kidar-vue-echarts.es.js";
import "echarts";
var multiLineOrBarX = defineConfig({
  name: "multiLineOrBarX",
  resetOption(cols, data) {
    const series = [];
    cols.forEach((col) => {
      let item = {};
      if (col.type === "bar") {
        item.type = "bar";
      } else {
        item.type = "line";
      }
      item.itemStyle = {
        color: col.color
      };
      item.data = data.map((t) => __spreadProps(__spreadValues({}, t), {
        value: t[col.prop || col.name]
      }));
      series.push(item);
    });
    return {
      legend: {
        data: cols.map((t) => t.name)
      },
      yAxis: [
        {
          type: "value"
        }
      ],
      xAxis: [{
        type: "category",
        data: data.map((t) => t.name)
      }],
      series
    };
  }
});
export { multiLineOrBarX as default };
