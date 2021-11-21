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
import { baseSerie, setZoom, approximateNum, omitNum } from "./common.js";
import "vue-demi";
import "echarts";
function setLineSeries(item) {
  item.type = "line";
}
function setBarSeries(item) {
  item.type = "bar";
  item.barMaxWidth = 20;
}
function setPictorialBarSeries(item, col) {
  item.type = "pictorialBar";
  item.symbol = col.symbol || "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z";
}
function calculateDoubleYAxisInterval(cols, data, splitNum) {
  let y0Max = 0;
  let y1Max = 0;
  const stackY0 = new Map();
  const stackY1 = new Map();
  cols.forEach((c) => {
    const { y1, stack, name, prop } = c;
    data.forEach((d) => {
      let k = stack ? d.name + "-" + stack : Symbol();
      let val = d[prop || name];
      if (y1) {
        stack ? stackY1.has(k) ? stackY1.set(k, (stackY1.get(k) || 0) + val) : stackY1.set(k, val) : stackY1.set(k, val);
      } else {
        stack ? stackY0.has(k) ? stackY0.set(k, (stackY0.get(k) || 0) + val) : stackY0.set(k, val) : stackY0.set(k, val);
      }
    });
  });
  stackY1.forEach((v) => {
    y1Max = Math.max(v, y1Max);
  });
  stackY0.forEach((v) => {
    y0Max = Math.max(v, y0Max);
  });
  let y0Interval = approximateNum(y0Max / splitNum);
  let y1Interval = approximateNum(y1Max / splitNum);
  return { y0Interval, y1Interval };
}
const baseYAxis = {
  type: "value",
  axisLabel: {
    formatter: omitNum
  }
};
var lineBarX = defineConfig({
  name: "line-bar-x",
  resetOption(cols, data, ctx) {
    const series = [];
    const yAxis = [];
    const { rotate, omit, splitNumber } = ctx;
    let barWidthCount = 1;
    let barWidth = 30;
    const stackSet = new Set();
    let isDouble = false;
    cols.forEach((col) => {
      const { name, prop, color, stack, itemStyle, y1 } = col;
      !isDouble && (isDouble = y1 ? true : false);
      let yAxisIndex = y1 ? 1 : 0;
      let item = __spreadProps(__spreadValues({}, baseSerie), {
        name,
        stack,
        id: name || prop,
        yAxisIndex,
        itemStyle: __spreadProps(__spreadValues({}, itemStyle), {
          color
        })
      });
      switch (col.type) {
        case "bar":
          setBarSeries(item);
          break;
        case "pictorialBar":
          setPictorialBarSeries(item, col);
          break;
        default:
          setLineSeries(item);
          break;
      }
      if (col.type && ["bar", "pictorialBar"].includes(col.type) && !stackSet.has(stack)) {
        barWidthCount++;
        stackSet.add(stack);
      }
      item.data = data.map((t) => {
        let val = t[prop || name];
        return {
          item: __spreadValues({}, t),
          col: __spreadValues({}, col),
          name: t.name,
          value: val
        };
      });
      series.push(item);
    });
    if (isDouble) {
      let splitNum = splitNumber || 5;
      const { y0Interval, y1Interval } = calculateDoubleYAxisInterval(cols, data, splitNum);
      yAxis.push(__spreadProps(__spreadValues({}, baseYAxis), { interval: y0Interval, max: y0Interval * splitNum }));
      yAxis.push(__spreadProps(__spreadValues({}, baseYAxis), { interval: y1Interval, max: y1Interval * splitNum }));
    } else {
      yAxis.push(__spreadValues({}, baseYAxis));
    }
    barWidthCount === 1 && (barWidthCount = 2);
    const xLabelWidth = !rotate || rotate === 0 ? barWidth * barWidthCount : barWidth * barWidthCount * Math.abs(90 / rotate);
    const dataZoom = setZoom(barWidth * barWidthCount, ctx);
    if (dataZoom.show) {
      dataZoom.bottom = 60;
    }
    return {
      title: {
        show: true,
        text: ctx.title,
        left: "center",
        top: "20",
        textStyle: { color: "#fff" }
      },
      grid: {
        left: 60,
        right: 60,
        bottom: 100
      },
      legend: {
        show: true,
        type: "scroll",
        bottom: 20
      },
      tooltip: {
        show: true,
        trigger: "axis"
      },
      dataZoom,
      yAxis,
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
  }
});
export { lineBarX as default };
