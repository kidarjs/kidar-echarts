function setTitle(ctx) {
  return {
    show: !!(ctx.title || ctx.subtitle),
    text: ctx.title,
    subtext: ctx.subtitle,
    left: "center",
    top: "20"
  };
}
const setZoom = (barsWidth, ctx) => {
  const zoom = {};
  const { chart, data } = ctx;
  let interval = 15;
  const end = chart.getWidth() / (barsWidth + interval);
  zoom.show = end < data.length - 1;
  zoom.startValue = 0;
  zoom.endValue = end;
  zoom.zoomLock = true;
  zoom.height = 10;
  return zoom;
};
function omitNum(val) {
  if (!Number(val)) {
    return 0;
  }
  let res = "";
  let unit = "";
  if (val >= 1e8) {
    res = Number.prototype.toFixed.call(val / 1e8, 1);
    unit = "\u4EBF";
  } else if (val >= 1e4) {
    res = Number.prototype.toFixed.call(val / 1e4, 1);
    unit = "\u4E07";
  } else {
    res = val.toString();
  }
  if (res.indexOf(".") > 0 && Number(res.split(".")[1]) === 0) {
    res = res.split(".")[0];
  }
  return res + unit;
}
function approximateNum(val) {
  if (!Number(val)) {
    return 0;
  }
  let res = val;
  let strNum = val.toString();
  const [num, dnum] = strNum.split(".");
  if (num.length > 1) {
    if (Number(num[1]) > 4) {
      res = Math.ceil(Number(num.substring(0, 2)) / 10) * Math.pow(10, num.length - 1);
    } else {
      res = Number(num[0] + 5) * Math.pow(10, num.length - 2);
    }
  } else if (num !== "0") {
    res = Number(num) + Number(dnum[0]) > 4 ? 1 : 0.5;
  }
  return res;
}
function getLinearColor(startColor, endColor) {
  const areaStyle = {
    color: {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0,
        color: startColor
      }, {
        offset: 1,
        color: endColor
      }],
      global: false
    }
  };
  return areaStyle;
}
const baseSerie = {
  animationDurationUpdate: 1e3,
  universalTransition: true
};
export { setZoom as a, baseSerie as b, approximateNum as c, getLinearColor as g, omitNum as o, setTitle as s };
