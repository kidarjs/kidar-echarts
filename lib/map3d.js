import { defineConfig } from "./kidar-vue-echarts.es.js";
import { P as Point, p as parseDate, M as Model, g as getLocaleModel, a as getDefaultLocaleModel, e as extend$1, d as defaults, i as isArray, S as SYSTEM_LANG, b as createHashMap, f as each, V as VISUAL_DIMENSIONS, m as map$1, h as makeInner, j as retrieve2, s as shouldRetrieveDataByName, k as isObject$1, l as isString, n as isSourceInstance, o as isArrayLike, D as DefaultDataProvider, q as DataStore, t as SOURCE_FORMAT_TYPED_ARRAY, u as isDataItemOption, v as convertOptionIdName, w as bind, x as keys, y as setCommonECData, z as slice, A as clone, B as SOURCE_FORMAT_ORIGINAL, C as createSourceFromSeriesDataOption, E as CtorInt32Array$1, F as normalizeToArray, G as guessOrdinal, H as BE_ORDINAL, I as enableClassManagement, J as getPrecision, K as nice, L as round, _ as __extends, N as addCommas, O as parsePercent, Q as createRenderPlanner, R as filter, T as quantity, U as isFunction, W as eqNaN, X as parsePercent$1, Y as indexOf, Z as registerPreprocessor, $ as registerProcessor, a0 as registerPostInit, a1 as registerPostUpdate, a2 as registerUpdateLifecycle, a3 as registerAction, a4 as registerCoordinateSystem, a5 as registerLayout, a6 as registerVisual, a7 as registerTransform, a8 as registerLoading, r as registerMap, a9 as PRIORITY, aa as ComponentModel, ab as ComponentView, ac as SeriesModel, ad as ChartView, ae as registerPainter, af as getBoundingRect, ag as getPixelPrecision, ah as linearMap, ai as PathProxy, aj as invert, ak as Path, al as DISPLAY_STATES, am as Polyline, an as SPECIAL_STATES, ao as quadraticProjectPoint, ap as cubicProjectPoint, aq as dist, ar as lerp, as as normalizeRadian, at as BoundingRect, au as Transformable, av as getECData, aw as isElementRemoved, ax as labelInner, ay as initProps, az as updateProps, aA as animateLabelValue, aB as __extends$1, aC as REDRAW_BIT, aD as Eventful, aE as createCanvas, aF as devicePixelRatio, aG as isGradientObject, aH as getCanvasGradient, aI as isImagePatternObject, aJ as createCanvasPattern, aK as brush, aL as brushSingle, aM as requestAnimationFrame, aN as env, aO as merge, aP as logError, aQ as ZRImage, aR as SourceManager, aS as disableTransformOptionMerge, aT as SERIES_LAYOUT_BY_COLUMN, aU as Animator, aV as LRUCache$1, aW as parse, aX as Rect, aY as init, aZ as Text, a_ as createTextStyle, a$ as lift, b0 as getMap, b1 as fixTextCoords, b2 as fixGeoCoords, b3 as parseGeoJSON, b4 as getLayoutRect, b5 as reduce, c as china } from "./geo_china.js";
import { SERIES_TYPE } from "./constant.js";
import "echarts";
var extent = [0, 0];
var extent2 = [0, 0];
var minTv = new Point();
var maxTv = new Point();
var OrientedBoundingRect = function() {
  function OrientedBoundingRect2(rect, transform) {
    this._corners = [];
    this._axes = [];
    this._origin = [0, 0];
    for (var i = 0; i < 4; i++) {
      this._corners[i] = new Point();
    }
    for (var i = 0; i < 2; i++) {
      this._axes[i] = new Point();
    }
    if (rect) {
      this.fromBoundingRect(rect, transform);
    }
  }
  OrientedBoundingRect2.prototype.fromBoundingRect = function(rect, transform) {
    var corners = this._corners;
    var axes = this._axes;
    var x = rect.x;
    var y = rect.y;
    var x2 = x + rect.width;
    var y2 = y + rect.height;
    corners[0].set(x, y);
    corners[1].set(x2, y);
    corners[2].set(x2, y2);
    corners[3].set(x, y2);
    if (transform) {
      for (var i = 0; i < 4; i++) {
        corners[i].transform(transform);
      }
    }
    Point.sub(axes[0], corners[1], corners[0]);
    Point.sub(axes[1], corners[3], corners[0]);
    axes[0].normalize();
    axes[1].normalize();
    for (var i = 0; i < 2; i++) {
      this._origin[i] = axes[i].dot(corners[0]);
    }
  };
  OrientedBoundingRect2.prototype.intersect = function(other, mtv) {
    var overlapped = true;
    var noMtv = !mtv;
    minTv.set(Infinity, Infinity);
    maxTv.set(0, 0);
    if (!this._intersectCheckOneSide(this, other, minTv, maxTv, noMtv, 1)) {
      overlapped = false;
      if (noMtv) {
        return overlapped;
      }
    }
    if (!this._intersectCheckOneSide(other, this, minTv, maxTv, noMtv, -1)) {
      overlapped = false;
      if (noMtv) {
        return overlapped;
      }
    }
    if (!noMtv) {
      Point.copy(mtv, overlapped ? minTv : maxTv);
    }
    return overlapped;
  };
  OrientedBoundingRect2.prototype._intersectCheckOneSide = function(self, other, minTv2, maxTv2, noMtv, inverse) {
    var overlapped = true;
    for (var i = 0; i < 2; i++) {
      var axis = this._axes[i];
      this._getProjMinMaxOnAxis(i, self._corners, extent);
      this._getProjMinMaxOnAxis(i, other._corners, extent2);
      if (extent[1] < extent2[0] || extent[0] > extent2[1]) {
        overlapped = false;
        if (noMtv) {
          return overlapped;
        }
        var dist0 = Math.abs(extent2[0] - extent[1]);
        var dist1 = Math.abs(extent[0] - extent2[1]);
        if (Math.min(dist0, dist1) > maxTv2.len()) {
          if (dist0 < dist1) {
            Point.scale(maxTv2, axis, -dist0 * inverse);
          } else {
            Point.scale(maxTv2, axis, dist1 * inverse);
          }
        }
      } else if (minTv2) {
        var dist0 = Math.abs(extent2[0] - extent[1]);
        var dist1 = Math.abs(extent[0] - extent2[1]);
        if (Math.min(dist0, dist1) < minTv2.len()) {
          if (dist0 < dist1) {
            Point.scale(minTv2, axis, dist0 * inverse);
          } else {
            Point.scale(minTv2, axis, -dist1 * inverse);
          }
        }
      }
    }
    return overlapped;
  };
  OrientedBoundingRect2.prototype._getProjMinMaxOnAxis = function(dim, corners, out) {
    var axis = this._axes[dim];
    var origin = this._origin;
    var proj = corners[0].dot(axis) + origin[dim];
    var min = proj;
    var max = proj;
    for (var i = 1; i < corners.length; i++) {
      var proj_1 = corners[i].dot(axis) + origin[dim];
      min = Math.min(proj_1, min);
      max = Math.max(proj_1, max);
    }
    out[0] = min;
    out[1] = max;
  };
  return OrientedBoundingRect2;
}();
var OrientedBoundingRect$1 = OrientedBoundingRect;
var ONE_SECOND = 1e3;
var ONE_MINUTE = ONE_SECOND * 60;
var ONE_HOUR = ONE_MINUTE * 60;
var ONE_DAY = ONE_HOUR * 24;
var ONE_YEAR = ONE_DAY * 365;
var defaultLeveledFormatter = {
  year: "{yyyy}",
  month: "{MMM}",
  day: "{d}",
  hour: "{HH}:{mm}",
  minute: "{HH}:{mm}",
  second: "{HH}:{mm}:{ss}",
  millisecond: "{HH}:{mm}:{ss} {SSS}",
  none: "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss} {SSS}"
};
var fullDayFormatter = "{yyyy}-{MM}-{dd}";
var fullLeveledFormatter = {
  year: "{yyyy}",
  month: "{yyyy}-{MM}",
  day: fullDayFormatter,
  hour: fullDayFormatter + " " + defaultLeveledFormatter.hour,
  minute: fullDayFormatter + " " + defaultLeveledFormatter.minute,
  second: fullDayFormatter + " " + defaultLeveledFormatter.second,
  millisecond: defaultLeveledFormatter.none
};
var primaryTimeUnits = ["year", "month", "day", "hour", "minute", "second", "millisecond"];
var timeUnits = ["year", "half-year", "quarter", "month", "week", "half-week", "day", "half-day", "quarter-day", "hour", "minute", "second", "millisecond"];
function pad(str, len) {
  str += "";
  return "0000".substr(0, len - str.length) + str;
}
function getPrimaryTimeUnit(timeUnit) {
  switch (timeUnit) {
    case "half-year":
    case "quarter":
      return "month";
    case "week":
    case "half-week":
      return "day";
    case "half-day":
    case "quarter-day":
      return "hour";
    default:
      return timeUnit;
  }
}
function isPrimaryTimeUnit(timeUnit) {
  return timeUnit === getPrimaryTimeUnit(timeUnit);
}
function getDefaultFormatPrecisionOfInterval(timeUnit) {
  switch (timeUnit) {
    case "year":
    case "month":
      return "day";
    case "millisecond":
      return "millisecond";
    default:
      return "second";
  }
}
function format(time, template, isUTC, lang) {
  var date = parseDate(time);
  var y = date[fullYearGetterName(isUTC)]();
  var M = date[monthGetterName(isUTC)]() + 1;
  var q = Math.floor((M - 1) / 4) + 1;
  var d = date[dateGetterName(isUTC)]();
  var e2 = date["get" + (isUTC ? "UTC" : "") + "Day"]();
  var H = date[hoursGetterName(isUTC)]();
  var h = (H - 1) % 12 + 1;
  var m = date[minutesGetterName(isUTC)]();
  var s = date[secondsGetterName(isUTC)]();
  var S = date[millisecondsGetterName(isUTC)]();
  var localeModel = lang instanceof Model ? lang : getLocaleModel(lang || SYSTEM_LANG) || getDefaultLocaleModel();
  var timeModel = localeModel.getModel("time");
  var month = timeModel.get("month");
  var monthAbbr = timeModel.get("monthAbbr");
  var dayOfWeek = timeModel.get("dayOfWeek");
  var dayOfWeekAbbr = timeModel.get("dayOfWeekAbbr");
  return (template || "").replace(/{yyyy}/g, y + "").replace(/{yy}/g, y % 100 + "").replace(/{Q}/g, q + "").replace(/{MMMM}/g, month[M - 1]).replace(/{MMM}/g, monthAbbr[M - 1]).replace(/{MM}/g, pad(M, 2)).replace(/{M}/g, M + "").replace(/{dd}/g, pad(d, 2)).replace(/{d}/g, d + "").replace(/{eeee}/g, dayOfWeek[e2]).replace(/{ee}/g, dayOfWeekAbbr[e2]).replace(/{e}/g, e2 + "").replace(/{HH}/g, pad(H, 2)).replace(/{H}/g, H + "").replace(/{hh}/g, pad(h + "", 2)).replace(/{h}/g, h + "").replace(/{mm}/g, pad(m, 2)).replace(/{m}/g, m + "").replace(/{ss}/g, pad(s, 2)).replace(/{s}/g, s + "").replace(/{SSS}/g, pad(S, 3)).replace(/{S}/g, S + "");
}
function leveledFormat(tick, idx, formatter, lang, isUTC) {
  var template = null;
  if (typeof formatter === "string") {
    template = formatter;
  } else if (typeof formatter === "function") {
    template = formatter(tick.value, idx, {
      level: tick.level
    });
  } else {
    var defaults$1 = extend$1({}, defaultLeveledFormatter);
    if (tick.level > 0) {
      for (var i = 0; i < primaryTimeUnits.length; ++i) {
        defaults$1[primaryTimeUnits[i]] = "{primary|" + defaults$1[primaryTimeUnits[i]] + "}";
      }
    }
    var mergedFormatter = formatter ? formatter.inherit === false ? formatter : defaults(formatter, defaults$1) : defaults$1;
    var unit = getUnitFromValue(tick.value, isUTC);
    if (mergedFormatter[unit]) {
      template = mergedFormatter[unit];
    } else if (mergedFormatter.inherit) {
      var targetId = timeUnits.indexOf(unit);
      for (var i = targetId - 1; i >= 0; --i) {
        if (mergedFormatter[unit]) {
          template = mergedFormatter[unit];
          break;
        }
      }
      template = template || defaults$1.none;
    }
    if (isArray(template)) {
      var levelId = tick.level == null ? 0 : tick.level >= 0 ? tick.level : template.length + tick.level;
      levelId = Math.min(levelId, template.length - 1);
      template = template[levelId];
    }
  }
  return format(new Date(tick.value), template, isUTC, lang);
}
function getUnitFromValue(value, isUTC) {
  var date = parseDate(value);
  var M = date[monthGetterName(isUTC)]() + 1;
  var d = date[dateGetterName(isUTC)]();
  var h = date[hoursGetterName(isUTC)]();
  var m = date[minutesGetterName(isUTC)]();
  var s = date[secondsGetterName(isUTC)]();
  var S = date[millisecondsGetterName(isUTC)]();
  var isSecond = S === 0;
  var isMinute = isSecond && s === 0;
  var isHour = isMinute && m === 0;
  var isDay = isHour && h === 0;
  var isMonth = isDay && d === 1;
  var isYear = isMonth && M === 1;
  if (isYear) {
    return "year";
  } else if (isMonth) {
    return "month";
  } else if (isDay) {
    return "day";
  } else if (isHour) {
    return "hour";
  } else if (isMinute) {
    return "minute";
  } else if (isSecond) {
    return "second";
  } else {
    return "millisecond";
  }
}
function getUnitValue(value, unit, isUTC) {
  var date = typeof value === "number" ? parseDate(value) : value;
  unit = unit || getUnitFromValue(value, isUTC);
  switch (unit) {
    case "year":
      return date[fullYearGetterName(isUTC)]();
    case "half-year":
      return date[monthGetterName(isUTC)]() >= 6 ? 1 : 0;
    case "quarter":
      return Math.floor((date[monthGetterName(isUTC)]() + 1) / 4);
    case "month":
      return date[monthGetterName(isUTC)]();
    case "day":
      return date[dateGetterName(isUTC)]();
    case "half-day":
      return date[hoursGetterName(isUTC)]() / 24;
    case "hour":
      return date[hoursGetterName(isUTC)]();
    case "minute":
      return date[minutesGetterName(isUTC)]();
    case "second":
      return date[secondsGetterName(isUTC)]();
    case "millisecond":
      return date[millisecondsGetterName(isUTC)]();
  }
}
function fullYearGetterName(isUTC) {
  return isUTC ? "getUTCFullYear" : "getFullYear";
}
function monthGetterName(isUTC) {
  return isUTC ? "getUTCMonth" : "getMonth";
}
function dateGetterName(isUTC) {
  return isUTC ? "getUTCDate" : "getDate";
}
function hoursGetterName(isUTC) {
  return isUTC ? "getUTCHours" : "getHours";
}
function minutesGetterName(isUTC) {
  return isUTC ? "getUTCMinutes" : "getMinutes";
}
function secondsGetterName(isUTC) {
  return isUTC ? "getUTCSeconds" : "getSeconds";
}
function millisecondsGetterName(isUTC) {
  return isUTC ? "getUTCMilliseconds" : "getMilliseconds";
}
function fullYearSetterName(isUTC) {
  return isUTC ? "setUTCFullYear" : "setFullYear";
}
function monthSetterName(isUTC) {
  return isUTC ? "setUTCMonth" : "setMonth";
}
function dateSetterName(isUTC) {
  return isUTC ? "setUTCDate" : "setDate";
}
function hoursSetterName(isUTC) {
  return isUTC ? "setUTCHours" : "setHours";
}
function minutesSetterName(isUTC) {
  return isUTC ? "setUTCMinutes" : "setMinutes";
}
function secondsSetterName(isUTC) {
  return isUTC ? "setUTCSeconds" : "setSeconds";
}
function millisecondsSetterName(isUTC) {
  return isUTC ? "setUTCMilliseconds" : "setMilliseconds";
}
function dataIndexMapValueLength(valNumOrArrLengthMoreThan2) {
  return valNumOrArrLengthMoreThan2 == null ? 0 : valNumOrArrLengthMoreThan2.length || 1;
}
function defaultKeyGetter(item) {
  return item;
}
var DataDiffer = function() {
  function DataDiffer2(oldArr, newArr, oldKeyGetter, newKeyGetter, context, diffMode) {
    this._old = oldArr;
    this._new = newArr;
    this._oldKeyGetter = oldKeyGetter || defaultKeyGetter;
    this._newKeyGetter = newKeyGetter || defaultKeyGetter;
    this.context = context;
    this._diffModeMultiple = diffMode === "multiple";
  }
  DataDiffer2.prototype.add = function(func) {
    this._add = func;
    return this;
  };
  DataDiffer2.prototype.update = function(func) {
    this._update = func;
    return this;
  };
  DataDiffer2.prototype.updateManyToOne = function(func) {
    this._updateManyToOne = func;
    return this;
  };
  DataDiffer2.prototype.updateOneToMany = function(func) {
    this._updateOneToMany = func;
    return this;
  };
  DataDiffer2.prototype.updateManyToMany = function(func) {
    this._updateManyToMany = func;
    return this;
  };
  DataDiffer2.prototype.remove = function(func) {
    this._remove = func;
    return this;
  };
  DataDiffer2.prototype.execute = function() {
    this[this._diffModeMultiple ? "_executeMultiple" : "_executeOneToOne"]();
  };
  DataDiffer2.prototype._executeOneToOne = function() {
    var oldArr = this._old;
    var newArr = this._new;
    var newDataIndexMap = {};
    var oldDataKeyArr = new Array(oldArr.length);
    var newDataKeyArr = new Array(newArr.length);
    this._initIndexMap(oldArr, null, oldDataKeyArr, "_oldKeyGetter");
    this._initIndexMap(newArr, newDataIndexMap, newDataKeyArr, "_newKeyGetter");
    for (var i = 0; i < oldArr.length; i++) {
      var oldKey = oldDataKeyArr[i];
      var newIdxMapVal = newDataIndexMap[oldKey];
      var newIdxMapValLen = dataIndexMapValueLength(newIdxMapVal);
      if (newIdxMapValLen > 1) {
        var newIdx = newIdxMapVal.shift();
        if (newIdxMapVal.length === 1) {
          newDataIndexMap[oldKey] = newIdxMapVal[0];
        }
        this._update && this._update(newIdx, i);
      } else if (newIdxMapValLen === 1) {
        newDataIndexMap[oldKey] = null;
        this._update && this._update(newIdxMapVal, i);
      } else {
        this._remove && this._remove(i);
      }
    }
    this._performRestAdd(newDataKeyArr, newDataIndexMap);
  };
  DataDiffer2.prototype._executeMultiple = function() {
    var oldArr = this._old;
    var newArr = this._new;
    var oldDataIndexMap = {};
    var newDataIndexMap = {};
    var oldDataKeyArr = [];
    var newDataKeyArr = [];
    this._initIndexMap(oldArr, oldDataIndexMap, oldDataKeyArr, "_oldKeyGetter");
    this._initIndexMap(newArr, newDataIndexMap, newDataKeyArr, "_newKeyGetter");
    for (var i = 0; i < oldDataKeyArr.length; i++) {
      var oldKey = oldDataKeyArr[i];
      var oldIdxMapVal = oldDataIndexMap[oldKey];
      var newIdxMapVal = newDataIndexMap[oldKey];
      var oldIdxMapValLen = dataIndexMapValueLength(oldIdxMapVal);
      var newIdxMapValLen = dataIndexMapValueLength(newIdxMapVal);
      if (oldIdxMapValLen > 1 && newIdxMapValLen === 1) {
        this._updateManyToOne && this._updateManyToOne(newIdxMapVal, oldIdxMapVal);
        newDataIndexMap[oldKey] = null;
      } else if (oldIdxMapValLen === 1 && newIdxMapValLen > 1) {
        this._updateOneToMany && this._updateOneToMany(newIdxMapVal, oldIdxMapVal);
        newDataIndexMap[oldKey] = null;
      } else if (oldIdxMapValLen === 1 && newIdxMapValLen === 1) {
        this._update && this._update(newIdxMapVal, oldIdxMapVal);
        newDataIndexMap[oldKey] = null;
      } else if (oldIdxMapValLen > 1 && newIdxMapValLen > 1) {
        this._updateManyToMany && this._updateManyToMany(newIdxMapVal, oldIdxMapVal);
        newDataIndexMap[oldKey] = null;
      } else if (oldIdxMapValLen > 1) {
        for (var i_1 = 0; i_1 < oldIdxMapValLen; i_1++) {
          this._remove && this._remove(oldIdxMapVal[i_1]);
        }
      } else {
        this._remove && this._remove(oldIdxMapVal);
      }
    }
    this._performRestAdd(newDataKeyArr, newDataIndexMap);
  };
  DataDiffer2.prototype._performRestAdd = function(newDataKeyArr, newDataIndexMap) {
    for (var i = 0; i < newDataKeyArr.length; i++) {
      var newKey = newDataKeyArr[i];
      var newIdxMapVal = newDataIndexMap[newKey];
      var idxMapValLen = dataIndexMapValueLength(newIdxMapVal);
      if (idxMapValLen > 1) {
        for (var j = 0; j < idxMapValLen; j++) {
          this._add && this._add(newIdxMapVal[j]);
        }
      } else if (idxMapValLen === 1) {
        this._add && this._add(newIdxMapVal);
      }
      newDataIndexMap[newKey] = null;
    }
  };
  DataDiffer2.prototype._initIndexMap = function(arr, map2, keyArr, keyGetterName) {
    var cbModeMultiple = this._diffModeMultiple;
    for (var i = 0; i < arr.length; i++) {
      var key = "_ec_" + this[keyGetterName](arr[i], i);
      if (!cbModeMultiple) {
        keyArr[i] = key;
      }
      if (!map2) {
        continue;
      }
      var idxMapVal = map2[key];
      var idxMapValLen = dataIndexMapValueLength(idxMapVal);
      if (idxMapValLen === 0) {
        map2[key] = i;
        if (cbModeMultiple) {
          keyArr.push(key);
        }
      } else if (idxMapValLen === 1) {
        map2[key] = [idxMapVal, i];
      } else {
        idxMapVal.push(i);
      }
    }
  };
  return DataDiffer2;
}();
var DataDiffer$1 = DataDiffer;
var DimensionUserOuput = function() {
  function DimensionUserOuput2(encode, dimRequest) {
    this._encode = encode;
    this._schema = dimRequest;
  }
  DimensionUserOuput2.prototype.get = function() {
    return {
      fullDimensions: this._getFullDimensionNames(),
      encode: this._encode
    };
  };
  DimensionUserOuput2.prototype._getFullDimensionNames = function() {
    if (!this._cachedDimNames) {
      this._cachedDimNames = this._schema ? this._schema.makeOutputDimensionNames() : [];
    }
    return this._cachedDimNames;
  };
  return DimensionUserOuput2;
}();
function summarizeDimensions(data, schema) {
  var summary = {};
  var encode = summary.encode = {};
  var notExtraCoordDimMap = createHashMap();
  var defaultedLabel = [];
  var defaultedTooltip = [];
  var userOutputEncode = {};
  each(data.dimensions, function(dimName) {
    var dimItem = data.getDimensionInfo(dimName);
    var coordDim = dimItem.coordDim;
    if (coordDim) {
      var coordDimIndex = dimItem.coordDimIndex;
      getOrCreateEncodeArr(encode, coordDim)[coordDimIndex] = dimName;
      if (!dimItem.isExtraCoord) {
        notExtraCoordDimMap.set(coordDim, 1);
        if (mayLabelDimType(dimItem.type)) {
          defaultedLabel[0] = dimName;
        }
        getOrCreateEncodeArr(userOutputEncode, coordDim)[coordDimIndex] = data.getDimensionIndex(dimItem.name);
      }
      if (dimItem.defaultTooltip) {
        defaultedTooltip.push(dimName);
      }
    }
    VISUAL_DIMENSIONS.each(function(v, otherDim) {
      var encodeArr = getOrCreateEncodeArr(encode, otherDim);
      var dimIndex = dimItem.otherDims[otherDim];
      if (dimIndex != null && dimIndex !== false) {
        encodeArr[dimIndex] = dimItem.name;
      }
    });
  });
  var dataDimsOnCoord = [];
  var encodeFirstDimNotExtra = {};
  notExtraCoordDimMap.each(function(v, coordDim) {
    var dimArr = encode[coordDim];
    encodeFirstDimNotExtra[coordDim] = dimArr[0];
    dataDimsOnCoord = dataDimsOnCoord.concat(dimArr);
  });
  summary.dataDimsOnCoord = dataDimsOnCoord;
  summary.dataDimIndicesOnCoord = map$1(dataDimsOnCoord, function(dimName) {
    return data.getDimensionInfo(dimName).storeDimIndex;
  });
  summary.encodeFirstDimNotExtra = encodeFirstDimNotExtra;
  var encodeLabel = encode.label;
  if (encodeLabel && encodeLabel.length) {
    defaultedLabel = encodeLabel.slice();
  }
  var encodeTooltip = encode.tooltip;
  if (encodeTooltip && encodeTooltip.length) {
    defaultedTooltip = encodeTooltip.slice();
  } else if (!defaultedTooltip.length) {
    defaultedTooltip = defaultedLabel.slice();
  }
  encode.defaultedLabel = defaultedLabel;
  encode.defaultedTooltip = defaultedTooltip;
  summary.userOutput = new DimensionUserOuput(userOutputEncode, schema);
  return summary;
}
function getOrCreateEncodeArr(encode, dim) {
  if (!encode.hasOwnProperty(dim)) {
    encode[dim] = [];
  }
  return encode[dim];
}
function mayLabelDimType(dimType) {
  return !(dimType === "ordinal" || dimType === "time");
}
var SeriesDimensionDefine = function() {
  function SeriesDimensionDefine2(opt) {
    this.otherDims = {};
    if (opt != null) {
      extend$1(this, opt);
    }
  }
  return SeriesDimensionDefine2;
}();
var SeriesDimensionDefine$1 = SeriesDimensionDefine;
var inner$1 = makeInner();
var dimTypeShort = {
  float: "f",
  int: "i",
  ordinal: "o",
  number: "n",
  time: "t"
};
var SeriesDataSchema = function() {
  function SeriesDataSchema2(opt) {
    this.dimensions = opt.dimensions;
    this._dimOmitted = opt.dimensionOmitted;
    this.source = opt.source;
    this._fullDimCount = opt.fullDimensionCount;
    this._updateDimOmitted(opt.dimensionOmitted);
  }
  SeriesDataSchema2.prototype.isDimensionOmitted = function() {
    return this._dimOmitted;
  };
  SeriesDataSchema2.prototype._updateDimOmitted = function(dimensionOmitted) {
    this._dimOmitted = dimensionOmitted;
    if (!dimensionOmitted) {
      return;
    }
    if (!this._dimNameMap) {
      this._dimNameMap = ensureSourceDimNameMap(this.source);
    }
  };
  SeriesDataSchema2.prototype.getSourceDimensionIndex = function(dimName) {
    return retrieve2(this._dimNameMap.get(dimName), -1);
  };
  SeriesDataSchema2.prototype.getSourceDimension = function(dimIndex) {
    var dimensionsDefine = this.source.dimensionsDefine;
    if (dimensionsDefine) {
      return dimensionsDefine[dimIndex];
    }
  };
  SeriesDataSchema2.prototype.makeStoreSchema = function() {
    var dimCount = this._fullDimCount;
    var willRetrieveDataByName = shouldRetrieveDataByName(this.source);
    var makeHashStrict = !shouldOmitUnusedDimensions(dimCount);
    var dimHash = "";
    var dims = [];
    for (var fullDimIdx = 0, seriesDimIdx = 0; fullDimIdx < dimCount; fullDimIdx++) {
      var property = void 0;
      var type = void 0;
      var ordinalMeta = void 0;
      var seriesDimDef = this.dimensions[seriesDimIdx];
      if (seriesDimDef && seriesDimDef.storeDimIndex === fullDimIdx) {
        property = willRetrieveDataByName ? seriesDimDef.name : null;
        type = seriesDimDef.type;
        ordinalMeta = seriesDimDef.ordinalMeta;
        seriesDimIdx++;
      } else {
        var sourceDimDef = this.getSourceDimension(fullDimIdx);
        if (sourceDimDef) {
          property = willRetrieveDataByName ? sourceDimDef.name : null;
          type = sourceDimDef.type;
        }
      }
      dims.push({
        property,
        type,
        ordinalMeta
      });
      if (willRetrieveDataByName && property != null && (!seriesDimDef || !seriesDimDef.isCalculationCoord)) {
        dimHash += makeHashStrict ? property.replace(/\`/g, "`1").replace(/\$/g, "`2") : property;
      }
      dimHash += "$";
      dimHash += dimTypeShort[type] || "f";
      if (ordinalMeta) {
        dimHash += ordinalMeta.uid;
      }
      dimHash += "$";
    }
    var source = this.source;
    var hash = [source.seriesLayoutBy, source.startIndex, dimHash].join("$$");
    return {
      dimensions: dims,
      hash
    };
  };
  SeriesDataSchema2.prototype.makeOutputDimensionNames = function() {
    var result = [];
    for (var fullDimIdx = 0, seriesDimIdx = 0; fullDimIdx < this._fullDimCount; fullDimIdx++) {
      var name_1 = void 0;
      var seriesDimDef = this.dimensions[seriesDimIdx];
      if (seriesDimDef && seriesDimDef.storeDimIndex === fullDimIdx) {
        if (!seriesDimDef.isCalculationCoord) {
          name_1 = seriesDimDef.name;
        }
        seriesDimIdx++;
      } else {
        var sourceDimDef = this.getSourceDimension(fullDimIdx);
        if (sourceDimDef) {
          name_1 = sourceDimDef.name;
        }
      }
      result.push(name_1);
    }
    return result;
  };
  SeriesDataSchema2.prototype.appendCalculationDimension = function(dimDef) {
    this.dimensions.push(dimDef);
    dimDef.isCalculationCoord = true;
    this._fullDimCount++;
    this._updateDimOmitted(true);
  };
  return SeriesDataSchema2;
}();
function isSeriesDataSchema(schema) {
  return schema instanceof SeriesDataSchema;
}
function createDimNameMap(dimsDef) {
  var dataDimNameMap = createHashMap();
  for (var i = 0; i < (dimsDef || []).length; i++) {
    var dimDefItemRaw = dimsDef[i];
    var userDimName = isObject$1(dimDefItemRaw) ? dimDefItemRaw.name : dimDefItemRaw;
    if (userDimName != null && dataDimNameMap.get(userDimName) == null) {
      dataDimNameMap.set(userDimName, i);
    }
  }
  return dataDimNameMap;
}
function ensureSourceDimNameMap(source) {
  var innerSource = inner$1(source);
  return innerSource.dimNameMap || (innerSource.dimNameMap = createDimNameMap(source.dimensionsDefine));
}
function shouldOmitUnusedDimensions(dimCount) {
  return dimCount > 30;
}
var isObject = isObject$1;
var map = map$1;
var CtorInt32Array = typeof Int32Array === "undefined" ? Array : Int32Array;
var ID_PREFIX = "e\0\0";
var INDEX_NOT_FOUND = -1;
var TRANSFERABLE_PROPERTIES = ["hasItemOption", "_nameList", "_idList", "_invertedIndicesMap", "_dimSummary", "userOutput", "_rawData", "_dimValueGetter", "_nameDimIdx", "_idDimIdx", "_nameRepeatCount"];
var CLONE_PROPERTIES = ["_approximateExtent"];
var prepareInvertedIndex;
var getId;
var getIdNameFromStore;
var normalizeDimensions;
var transferProperties;
var cloneListForMapAndSample;
var makeIdFromName;
var SeriesData = function() {
  function SeriesData2(dimensionsInput, hostModel) {
    this.type = "list";
    this._dimOmitted = false;
    this._nameList = [];
    this._idList = [];
    this._visual = {};
    this._layout = {};
    this._itemVisuals = [];
    this._itemLayouts = [];
    this._graphicEls = [];
    this._approximateExtent = {};
    this._calculationInfo = {};
    this.hasItemOption = false;
    this.TRANSFERABLE_METHODS = ["cloneShallow", "downSample", "lttbDownSample", "map"];
    this.CHANGABLE_METHODS = ["filterSelf", "selectRange"];
    this.DOWNSAMPLE_METHODS = ["downSample", "lttbDownSample"];
    var dimensions;
    var assignStoreDimIdx = false;
    if (isSeriesDataSchema(dimensionsInput)) {
      dimensions = dimensionsInput.dimensions;
      this._dimOmitted = dimensionsInput.isDimensionOmitted();
      this._schema = dimensionsInput;
    } else {
      assignStoreDimIdx = true;
      dimensions = dimensionsInput;
    }
    dimensions = dimensions || ["x", "y"];
    var dimensionInfos = {};
    var dimensionNames = [];
    var invertedIndicesMap = {};
    var needsHasOwn = false;
    var emptyObj = {};
    for (var i = 0; i < dimensions.length; i++) {
      var dimInfoInput = dimensions[i];
      var dimensionInfo = isString(dimInfoInput) ? new SeriesDimensionDefine$1({
        name: dimInfoInput
      }) : !(dimInfoInput instanceof SeriesDimensionDefine$1) ? new SeriesDimensionDefine$1(dimInfoInput) : dimInfoInput;
      var dimensionName = dimensionInfo.name;
      dimensionInfo.type = dimensionInfo.type || "float";
      if (!dimensionInfo.coordDim) {
        dimensionInfo.coordDim = dimensionName;
        dimensionInfo.coordDimIndex = 0;
      }
      var otherDims = dimensionInfo.otherDims = dimensionInfo.otherDims || {};
      dimensionNames.push(dimensionName);
      dimensionInfos[dimensionName] = dimensionInfo;
      if (emptyObj[dimensionName] != null) {
        needsHasOwn = true;
      }
      if (dimensionInfo.createInvertedIndices) {
        invertedIndicesMap[dimensionName] = [];
      }
      if (otherDims.itemName === 0) {
        this._nameDimIdx = i;
      }
      if (otherDims.itemId === 0) {
        this._idDimIdx = i;
      }
      if (assignStoreDimIdx) {
        dimensionInfo.storeDimIndex = i;
      }
    }
    this.dimensions = dimensionNames;
    this._dimInfos = dimensionInfos;
    this._initGetDimensionInfo(needsHasOwn);
    this.hostModel = hostModel;
    this._invertedIndicesMap = invertedIndicesMap;
    if (this._dimOmitted) {
      var dimIdxToName_1 = this._dimIdxToName = createHashMap();
      each(dimensionNames, function(dimName) {
        dimIdxToName_1.set(dimensionInfos[dimName].storeDimIndex, dimName);
      });
    }
  }
  SeriesData2.prototype.getDimension = function(dim) {
    var dimIdx = this._recognizeDimIndex(dim);
    if (dimIdx == null) {
      return dim;
    }
    dimIdx = dim;
    if (!this._dimOmitted) {
      return this.dimensions[dimIdx];
    }
    var dimName = this._dimIdxToName.get(dimIdx);
    if (dimName != null) {
      return dimName;
    }
    var sourceDimDef = this._schema.getSourceDimension(dimIdx);
    if (sourceDimDef) {
      return sourceDimDef.name;
    }
  };
  SeriesData2.prototype.getDimensionIndex = function(dim) {
    var dimIdx = this._recognizeDimIndex(dim);
    if (dimIdx != null) {
      return dimIdx;
    }
    if (dim == null) {
      return -1;
    }
    var dimInfo = this._getDimInfo(dim);
    return dimInfo ? dimInfo.storeDimIndex : this._dimOmitted ? this._schema.getSourceDimensionIndex(dim) : -1;
  };
  SeriesData2.prototype._recognizeDimIndex = function(dim) {
    if (typeof dim === "number" || dim != null && !isNaN(dim) && !this._getDimInfo(dim) && (!this._dimOmitted || this._schema.getSourceDimensionIndex(dim) < 0)) {
      return +dim;
    }
  };
  SeriesData2.prototype._getStoreDimIndex = function(dim) {
    var dimIdx = this.getDimensionIndex(dim);
    return dimIdx;
  };
  SeriesData2.prototype.getDimensionInfo = function(dim) {
    return this._getDimInfo(this.getDimension(dim));
  };
  SeriesData2.prototype._initGetDimensionInfo = function(needsHasOwn) {
    var dimensionInfos = this._dimInfos;
    this._getDimInfo = needsHasOwn ? function(dimName) {
      return dimensionInfos.hasOwnProperty(dimName) ? dimensionInfos[dimName] : void 0;
    } : function(dimName) {
      return dimensionInfos[dimName];
    };
  };
  SeriesData2.prototype.getDimensionsOnCoord = function() {
    return this._dimSummary.dataDimsOnCoord.slice();
  };
  SeriesData2.prototype.mapDimension = function(coordDim, idx) {
    var dimensionsSummary = this._dimSummary;
    if (idx == null) {
      return dimensionsSummary.encodeFirstDimNotExtra[coordDim];
    }
    var dims = dimensionsSummary.encode[coordDim];
    return dims ? dims[idx] : null;
  };
  SeriesData2.prototype.mapDimensionsAll = function(coordDim) {
    var dimensionsSummary = this._dimSummary;
    var dims = dimensionsSummary.encode[coordDim];
    return (dims || []).slice();
  };
  SeriesData2.prototype.getStore = function() {
    return this._store;
  };
  SeriesData2.prototype.initData = function(data, nameList, dimValueGetter) {
    var _this = this;
    var store;
    if (data instanceof DataStore) {
      store = data;
    }
    if (!store) {
      var dimensions = this.dimensions;
      var provider = isSourceInstance(data) || isArrayLike(data) ? new DefaultDataProvider(data, dimensions.length) : data;
      store = new DataStore();
      var dimensionInfos = map(dimensions, function(dimName) {
        return {
          type: _this._dimInfos[dimName].type,
          property: dimName
        };
      });
      store.initData(provider, dimensionInfos, dimValueGetter);
    }
    this._store = store;
    this._nameList = (nameList || []).slice();
    this._idList = [];
    this._nameRepeatCount = {};
    this._doInit(0, store.count());
    this._dimSummary = summarizeDimensions(this, this._schema);
    this.userOutput = this._dimSummary.userOutput;
  };
  SeriesData2.prototype.appendData = function(data) {
    var range = this._store.appendData(data);
    this._doInit(range[0], range[1]);
  };
  SeriesData2.prototype.appendValues = function(values, names) {
    var _a = this._store.appendValues(values, names.length), start = _a.start, end = _a.end;
    var shouldMakeIdFromName = this._shouldMakeIdFromName();
    this._updateOrdinalMeta();
    if (names) {
      for (var idx = start; idx < end; idx++) {
        var sourceIdx = idx - start;
        this._nameList[idx] = names[sourceIdx];
        if (shouldMakeIdFromName) {
          makeIdFromName(this, idx);
        }
      }
    }
  };
  SeriesData2.prototype._updateOrdinalMeta = function() {
    var store = this._store;
    var dimensions = this.dimensions;
    for (var i = 0; i < dimensions.length; i++) {
      var dimInfo = this._dimInfos[dimensions[i]];
      if (dimInfo.ordinalMeta) {
        store.collectOrdinalMeta(dimInfo.storeDimIndex, dimInfo.ordinalMeta);
      }
    }
  };
  SeriesData2.prototype._shouldMakeIdFromName = function() {
    var provider = this._store.getProvider();
    return this._idDimIdx == null && provider.getSource().sourceFormat !== SOURCE_FORMAT_TYPED_ARRAY && !provider.fillStorage;
  };
  SeriesData2.prototype._doInit = function(start, end) {
    if (start >= end) {
      return;
    }
    var store = this._store;
    var provider = store.getProvider();
    this._updateOrdinalMeta();
    var nameList = this._nameList;
    var idList = this._idList;
    var sourceFormat = provider.getSource().sourceFormat;
    var isFormatOriginal = sourceFormat === SOURCE_FORMAT_ORIGINAL;
    if (isFormatOriginal && !provider.pure) {
      var sharedDataItem = [];
      for (var idx = start; idx < end; idx++) {
        var dataItem = provider.getItem(idx, sharedDataItem);
        if (!this.hasItemOption && isDataItemOption(dataItem)) {
          this.hasItemOption = true;
        }
        if (dataItem) {
          var itemName = dataItem.name;
          if (nameList[idx] == null && itemName != null) {
            nameList[idx] = convertOptionIdName(itemName, null);
          }
          var itemId = dataItem.id;
          if (idList[idx] == null && itemId != null) {
            idList[idx] = convertOptionIdName(itemId, null);
          }
        }
      }
    }
    if (this._shouldMakeIdFromName()) {
      for (var idx = start; idx < end; idx++) {
        makeIdFromName(this, idx);
      }
    }
    prepareInvertedIndex(this);
  };
  SeriesData2.prototype.getApproximateExtent = function(dim) {
    return this._approximateExtent[dim] || this._store.getDataExtent(this._getStoreDimIndex(dim));
  };
  SeriesData2.prototype.setApproximateExtent = function(extent3, dim) {
    dim = this.getDimension(dim);
    this._approximateExtent[dim] = extent3.slice();
  };
  SeriesData2.prototype.getCalculationInfo = function(key) {
    return this._calculationInfo[key];
  };
  SeriesData2.prototype.setCalculationInfo = function(key, value) {
    isObject(key) ? extend$1(this._calculationInfo, key) : this._calculationInfo[key] = value;
  };
  SeriesData2.prototype.getName = function(idx) {
    var rawIndex = this.getRawIndex(idx);
    var name = this._nameList[rawIndex];
    if (name == null && this._nameDimIdx != null) {
      name = getIdNameFromStore(this, this._nameDimIdx, rawIndex);
    }
    if (name == null) {
      name = "";
    }
    return name;
  };
  SeriesData2.prototype._getCategory = function(dimIdx, idx) {
    var ordinal = this._store.get(dimIdx, idx);
    var ordinalMeta = this._store.getOrdinalMeta(dimIdx);
    if (ordinalMeta) {
      return ordinalMeta.categories[ordinal];
    }
    return ordinal;
  };
  SeriesData2.prototype.getId = function(idx) {
    return getId(this, this.getRawIndex(idx));
  };
  SeriesData2.prototype.count = function() {
    return this._store.count();
  };
  SeriesData2.prototype.get = function(dim, idx) {
    var store = this._store;
    var dimInfo = this._dimInfos[dim];
    if (dimInfo) {
      return store.get(dimInfo.storeDimIndex, idx);
    }
  };
  SeriesData2.prototype.getByRawIndex = function(dim, rawIdx) {
    var store = this._store;
    var dimInfo = this._dimInfos[dim];
    if (dimInfo) {
      return store.getByRawIndex(dimInfo.storeDimIndex, rawIdx);
    }
  };
  SeriesData2.prototype.getIndices = function() {
    return this._store.getIndices();
  };
  SeriesData2.prototype.getDataExtent = function(dim) {
    return this._store.getDataExtent(this._getStoreDimIndex(dim));
  };
  SeriesData2.prototype.getSum = function(dim) {
    return this._store.getSum(this._getStoreDimIndex(dim));
  };
  SeriesData2.prototype.getMedian = function(dim) {
    return this._store.getMedian(this._getStoreDimIndex(dim));
  };
  SeriesData2.prototype.getValues = function(dimensions, idx) {
    var _this = this;
    var store = this._store;
    return isArray(dimensions) ? store.getValues(map(dimensions, function(dim) {
      return _this._getStoreDimIndex(dim);
    }), idx) : store.getValues(dimensions);
  };
  SeriesData2.prototype.hasValue = function(idx) {
    var dataDimIndicesOnCoord = this._dimSummary.dataDimIndicesOnCoord;
    for (var i = 0, len = dataDimIndicesOnCoord.length; i < len; i++) {
      if (isNaN(this._store.get(dataDimIndicesOnCoord[i], idx))) {
        return false;
      }
    }
    return true;
  };
  SeriesData2.prototype.indexOfName = function(name) {
    for (var i = 0, len = this._store.count(); i < len; i++) {
      if (this.getName(i) === name) {
        return i;
      }
    }
    return -1;
  };
  SeriesData2.prototype.getRawIndex = function(idx) {
    return this._store.getRawIndex(idx);
  };
  SeriesData2.prototype.indexOfRawIndex = function(rawIndex) {
    return this._store.indexOfRawIndex(rawIndex);
  };
  SeriesData2.prototype.rawIndexOf = function(dim, value) {
    var invertedIndices = dim && this._invertedIndicesMap[dim];
    var rawIndex = invertedIndices[value];
    if (rawIndex == null || isNaN(rawIndex)) {
      return INDEX_NOT_FOUND;
    }
    return rawIndex;
  };
  SeriesData2.prototype.indicesOfNearest = function(dim, value, maxDistance) {
    return this._store.indicesOfNearest(this._getStoreDimIndex(dim), value, maxDistance);
  };
  SeriesData2.prototype.each = function(dims, cb, ctx) {
    if (typeof dims === "function") {
      ctx = cb;
      cb = dims;
      dims = [];
    }
    var fCtx = ctx || this;
    var dimIndices = map(normalizeDimensions(dims), this._getStoreDimIndex, this);
    this._store.each(dimIndices, fCtx ? bind(cb, fCtx) : cb);
  };
  SeriesData2.prototype.filterSelf = function(dims, cb, ctx) {
    if (typeof dims === "function") {
      ctx = cb;
      cb = dims;
      dims = [];
    }
    var fCtx = ctx || this;
    var dimIndices = map(normalizeDimensions(dims), this._getStoreDimIndex, this);
    this._store = this._store.filter(dimIndices, fCtx ? bind(cb, fCtx) : cb);
    return this;
  };
  SeriesData2.prototype.selectRange = function(range) {
    var _this = this;
    var innerRange = {};
    var dims = keys(range);
    each(dims, function(dim) {
      var dimIdx = _this._getStoreDimIndex(dim);
      innerRange[dimIdx] = range[dim];
    });
    this._store = this._store.selectRange(innerRange);
    return this;
  };
  SeriesData2.prototype.mapArray = function(dims, cb, ctx) {
    if (typeof dims === "function") {
      ctx = cb;
      cb = dims;
      dims = [];
    }
    ctx = ctx || this;
    var result = [];
    this.each(dims, function() {
      result.push(cb && cb.apply(this, arguments));
    }, ctx);
    return result;
  };
  SeriesData2.prototype.map = function(dims, cb, ctx, ctxCompat) {
    var fCtx = ctx || ctxCompat || this;
    var dimIndices = map(normalizeDimensions(dims), this._getStoreDimIndex, this);
    var list = cloneListForMapAndSample(this);
    list._store = this._store.map(dimIndices, fCtx ? bind(cb, fCtx) : cb);
    return list;
  };
  SeriesData2.prototype.modify = function(dims, cb, ctx, ctxCompat) {
    var fCtx = ctx || ctxCompat || this;
    var dimIndices = map(normalizeDimensions(dims), this._getStoreDimIndex, this);
    this._store.modify(dimIndices, fCtx ? bind(cb, fCtx) : cb);
  };
  SeriesData2.prototype.downSample = function(dimension, rate, sampleValue, sampleIndex) {
    var list = cloneListForMapAndSample(this);
    list._store = this._store.downSample(this._getStoreDimIndex(dimension), rate, sampleValue, sampleIndex);
    return list;
  };
  SeriesData2.prototype.lttbDownSample = function(valueDimension, rate) {
    var list = cloneListForMapAndSample(this);
    list._store = this._store.lttbDownSample(this._getStoreDimIndex(valueDimension), rate);
    return list;
  };
  SeriesData2.prototype.getRawDataItem = function(idx) {
    return this._store.getRawDataItem(idx);
  };
  SeriesData2.prototype.getItemModel = function(idx) {
    var hostModel = this.hostModel;
    var dataItem = this.getRawDataItem(idx);
    return new Model(dataItem, hostModel, hostModel && hostModel.ecModel);
  };
  SeriesData2.prototype.diff = function(otherList) {
    var thisList = this;
    return new DataDiffer$1(otherList ? otherList.getStore().getIndices() : [], this.getStore().getIndices(), function(idx) {
      return getId(otherList, idx);
    }, function(idx) {
      return getId(thisList, idx);
    });
  };
  SeriesData2.prototype.getVisual = function(key) {
    var visual = this._visual;
    return visual && visual[key];
  };
  SeriesData2.prototype.setVisual = function(kvObj, val) {
    this._visual = this._visual || {};
    if (isObject(kvObj)) {
      extend$1(this._visual, kvObj);
    } else {
      this._visual[kvObj] = val;
    }
  };
  SeriesData2.prototype.getItemVisual = function(idx, key) {
    var itemVisual = this._itemVisuals[idx];
    var val = itemVisual && itemVisual[key];
    if (val == null) {
      return this.getVisual(key);
    }
    return val;
  };
  SeriesData2.prototype.hasItemVisual = function() {
    return this._itemVisuals.length > 0;
  };
  SeriesData2.prototype.ensureUniqueItemVisual = function(idx, key) {
    var itemVisuals = this._itemVisuals;
    var itemVisual = itemVisuals[idx];
    if (!itemVisual) {
      itemVisual = itemVisuals[idx] = {};
    }
    var val = itemVisual[key];
    if (val == null) {
      val = this.getVisual(key);
      if (isArray(val)) {
        val = val.slice();
      } else if (isObject(val)) {
        val = extend$1({}, val);
      }
      itemVisual[key] = val;
    }
    return val;
  };
  SeriesData2.prototype.setItemVisual = function(idx, key, value) {
    var itemVisual = this._itemVisuals[idx] || {};
    this._itemVisuals[idx] = itemVisual;
    if (isObject(key)) {
      extend$1(itemVisual, key);
    } else {
      itemVisual[key] = value;
    }
  };
  SeriesData2.prototype.clearAllVisual = function() {
    this._visual = {};
    this._itemVisuals = [];
  };
  SeriesData2.prototype.setLayout = function(key, val) {
    if (isObject(key)) {
      for (var name_1 in key) {
        if (key.hasOwnProperty(name_1)) {
          this.setLayout(name_1, key[name_1]);
        }
      }
      return;
    }
    this._layout[key] = val;
  };
  SeriesData2.prototype.getLayout = function(key) {
    return this._layout[key];
  };
  SeriesData2.prototype.getItemLayout = function(idx) {
    return this._itemLayouts[idx];
  };
  SeriesData2.prototype.setItemLayout = function(idx, layout, merge2) {
    this._itemLayouts[idx] = merge2 ? extend$1(this._itemLayouts[idx] || {}, layout) : layout;
  };
  SeriesData2.prototype.clearItemLayouts = function() {
    this._itemLayouts.length = 0;
  };
  SeriesData2.prototype.setItemGraphicEl = function(idx, el) {
    var seriesIndex = this.hostModel && this.hostModel.seriesIndex;
    setCommonECData(seriesIndex, this.dataType, idx, el);
    this._graphicEls[idx] = el;
  };
  SeriesData2.prototype.getItemGraphicEl = function(idx) {
    return this._graphicEls[idx];
  };
  SeriesData2.prototype.eachItemGraphicEl = function(cb, context) {
    each(this._graphicEls, function(el, idx) {
      if (el) {
        cb && cb.call(context, el, idx);
      }
    });
  };
  SeriesData2.prototype.cloneShallow = function(list) {
    if (!list) {
      list = new SeriesData2(this._schema ? this._schema : map(this.dimensions, this._getDimInfo, this), this.hostModel);
    }
    transferProperties(list, this);
    list._store = this._store;
    return list;
  };
  SeriesData2.prototype.wrapMethod = function(methodName, injectFunction) {
    var originalMethod = this[methodName];
    if (typeof originalMethod !== "function") {
      return;
    }
    this.__wrappedMethods = this.__wrappedMethods || [];
    this.__wrappedMethods.push(methodName);
    this[methodName] = function() {
      var res = originalMethod.apply(this, arguments);
      return injectFunction.apply(this, [res].concat(slice(arguments)));
    };
  };
  SeriesData2.internalField = function() {
    prepareInvertedIndex = function(data) {
      var invertedIndicesMap = data._invertedIndicesMap;
      each(invertedIndicesMap, function(invertedIndices, dim) {
        var dimInfo = data._dimInfos[dim];
        var ordinalMeta = dimInfo.ordinalMeta;
        var store = data._store;
        if (ordinalMeta) {
          invertedIndices = invertedIndicesMap[dim] = new CtorInt32Array(ordinalMeta.categories.length);
          for (var i = 0; i < invertedIndices.length; i++) {
            invertedIndices[i] = INDEX_NOT_FOUND;
          }
          for (var i = 0; i < store.count(); i++) {
            invertedIndices[store.get(dimInfo.storeDimIndex, i)] = i;
          }
        }
      });
    };
    getIdNameFromStore = function(data, dimIdx, idx) {
      return convertOptionIdName(data._getCategory(dimIdx, idx), null);
    };
    getId = function(data, rawIndex) {
      var id = data._idList[rawIndex];
      if (id == null && data._idDimIdx != null) {
        id = getIdNameFromStore(data, data._idDimIdx, rawIndex);
      }
      if (id == null) {
        id = ID_PREFIX + rawIndex;
      }
      return id;
    };
    normalizeDimensions = function(dimensions) {
      if (!isArray(dimensions)) {
        dimensions = dimensions != null ? [dimensions] : [];
      }
      return dimensions;
    };
    cloneListForMapAndSample = function(original) {
      var list = new SeriesData2(original._schema ? original._schema : map(original.dimensions, original._getDimInfo, original), original.hostModel);
      transferProperties(list, original);
      return list;
    };
    transferProperties = function(target, source) {
      each(TRANSFERABLE_PROPERTIES.concat(source.__wrappedMethods || []), function(propName) {
        if (source.hasOwnProperty(propName)) {
          target[propName] = source[propName];
        }
      });
      target.__wrappedMethods = source.__wrappedMethods;
      each(CLONE_PROPERTIES, function(propName) {
        target[propName] = clone(source[propName]);
      });
      target._calculationInfo = extend$1({}, source._calculationInfo);
    };
    makeIdFromName = function(data, idx) {
      var nameList = data._nameList;
      var idList = data._idList;
      var nameDimIdx = data._nameDimIdx;
      var idDimIdx = data._idDimIdx;
      var name = nameList[idx];
      var id = idList[idx];
      if (name == null && nameDimIdx != null) {
        nameList[idx] = name = getIdNameFromStore(data, nameDimIdx, idx);
      }
      if (id == null && idDimIdx != null) {
        idList[idx] = id = getIdNameFromStore(data, idDimIdx, idx);
      }
      if (id == null && name != null) {
        var nameRepeatCount = data._nameRepeatCount;
        var nmCnt = nameRepeatCount[name] = (nameRepeatCount[name] || 0) + 1;
        id = name;
        if (nmCnt > 1) {
          id += "__ec__" + nmCnt;
        }
        idList[idx] = id;
      }
    };
  }();
  return SeriesData2;
}();
var SeriesData$1 = SeriesData;
function createDimensions(source, opt) {
  return prepareSeriesDataSchema(source, opt).dimensions;
}
function prepareSeriesDataSchema(source, opt) {
  if (!isSourceInstance(source)) {
    source = createSourceFromSeriesDataOption(source);
  }
  opt = opt || {};
  var sysDims = opt.coordDimensions || [];
  var dimsDef = opt.dimensionsDefine || source.dimensionsDefine || [];
  var coordDimNameMap = createHashMap();
  var resultList = [];
  var dimCount = getDimCount(source, sysDims, dimsDef, opt.dimensionsCount);
  var omitUnusedDimensions = opt.canOmitUnusedDimensions && shouldOmitUnusedDimensions(dimCount);
  var isUsingSourceDimensionsDef = dimsDef === source.dimensionsDefine;
  var dataDimNameMap = isUsingSourceDimensionsDef ? ensureSourceDimNameMap(source) : createDimNameMap(dimsDef);
  var encodeDef = opt.encodeDefine;
  if (!encodeDef && opt.encodeDefaulter) {
    encodeDef = opt.encodeDefaulter(source, dimCount);
  }
  var encodeDefMap = createHashMap(encodeDef);
  var indicesMap = new CtorInt32Array$1(dimCount);
  for (var i = 0; i < indicesMap.length; i++) {
    indicesMap[i] = -1;
  }
  function getResultItem(dimIdx) {
    var idx = indicesMap[dimIdx];
    if (idx < 0) {
      var dimDefItemRaw = dimsDef[dimIdx];
      var dimDefItem = isObject$1(dimDefItemRaw) ? dimDefItemRaw : {
        name: dimDefItemRaw
      };
      var resultItem2 = new SeriesDimensionDefine$1();
      var userDimName = dimDefItem.name;
      if (userDimName != null && dataDimNameMap.get(userDimName) != null) {
        resultItem2.name = resultItem2.displayName = userDimName;
      }
      dimDefItem.type != null && (resultItem2.type = dimDefItem.type);
      dimDefItem.displayName != null && (resultItem2.displayName = dimDefItem.displayName);
      var newIdx = resultList.length;
      indicesMap[dimIdx] = newIdx;
      resultItem2.storeDimIndex = dimIdx;
      resultList.push(resultItem2);
      return resultItem2;
    }
    return resultList[idx];
  }
  if (!omitUnusedDimensions) {
    for (var i = 0; i < dimCount; i++) {
      getResultItem(i);
    }
  }
  encodeDefMap.each(function(dataDimsRaw, coordDim2) {
    var dataDims = normalizeToArray(dataDimsRaw).slice();
    if (dataDims.length === 1 && !isString(dataDims[0]) && dataDims[0] < 0) {
      encodeDefMap.set(coordDim2, false);
      return;
    }
    var validDataDims = encodeDefMap.set(coordDim2, []);
    each(dataDims, function(resultDimIdxOrName, idx) {
      var resultDimIdx2 = isString(resultDimIdxOrName) ? dataDimNameMap.get(resultDimIdxOrName) : resultDimIdxOrName;
      if (resultDimIdx2 != null && resultDimIdx2 < dimCount) {
        validDataDims[idx] = resultDimIdx2;
        applyDim(getResultItem(resultDimIdx2), coordDim2, idx);
      }
    });
  });
  var availDimIdx = 0;
  each(sysDims, function(sysDimItemRaw) {
    var coordDim2;
    var sysDimItemDimsDef;
    var sysDimItemOtherDims;
    var sysDimItem;
    if (isString(sysDimItemRaw)) {
      coordDim2 = sysDimItemRaw;
      sysDimItem = {};
    } else {
      sysDimItem = sysDimItemRaw;
      coordDim2 = sysDimItem.name;
      var ordinalMeta = sysDimItem.ordinalMeta;
      sysDimItem.ordinalMeta = null;
      sysDimItem = extend$1({}, sysDimItem);
      sysDimItem.ordinalMeta = ordinalMeta;
      sysDimItemDimsDef = sysDimItem.dimsDef;
      sysDimItemOtherDims = sysDimItem.otherDims;
      sysDimItem.name = sysDimItem.coordDim = sysDimItem.coordDimIndex = sysDimItem.dimsDef = sysDimItem.otherDims = null;
    }
    var dataDims = encodeDefMap.get(coordDim2);
    if (dataDims === false) {
      return;
    }
    dataDims = normalizeToArray(dataDims);
    if (!dataDims.length) {
      for (var i2 = 0; i2 < (sysDimItemDimsDef && sysDimItemDimsDef.length || 1); i2++) {
        while (availDimIdx < dimCount && getResultItem(availDimIdx).coordDim != null) {
          availDimIdx++;
        }
        availDimIdx < dimCount && dataDims.push(availDimIdx++);
      }
    }
    each(dataDims, function(resultDimIdx2, coordDimIndex) {
      var resultItem2 = getResultItem(resultDimIdx2);
      if (isUsingSourceDimensionsDef && sysDimItem.type != null) {
        resultItem2.type = sysDimItem.type;
      }
      applyDim(defaults(resultItem2, sysDimItem), coordDim2, coordDimIndex);
      if (resultItem2.name == null && sysDimItemDimsDef) {
        var sysDimItemDimsDefItem = sysDimItemDimsDef[coordDimIndex];
        !isObject$1(sysDimItemDimsDefItem) && (sysDimItemDimsDefItem = {
          name: sysDimItemDimsDefItem
        });
        resultItem2.name = resultItem2.displayName = sysDimItemDimsDefItem.name;
        resultItem2.defaultTooltip = sysDimItemDimsDefItem.defaultTooltip;
      }
      sysDimItemOtherDims && defaults(resultItem2.otherDims, sysDimItemOtherDims);
    });
  });
  function applyDim(resultItem2, coordDim2, coordDimIndex) {
    if (VISUAL_DIMENSIONS.get(coordDim2) != null) {
      resultItem2.otherDims[coordDim2] = coordDimIndex;
    } else {
      resultItem2.coordDim = coordDim2;
      resultItem2.coordDimIndex = coordDimIndex;
      coordDimNameMap.set(coordDim2, true);
    }
  }
  var generateCoord = opt.generateCoord;
  var generateCoordCount = opt.generateCoordCount;
  var fromZero = generateCoordCount != null;
  generateCoordCount = generateCoord ? generateCoordCount || 1 : 0;
  var extra = generateCoord || "value";
  function ifNoNameFillWithCoordName(resultItem2) {
    if (resultItem2.name == null) {
      resultItem2.name = resultItem2.coordDim;
    }
  }
  if (!omitUnusedDimensions) {
    for (var resultDimIdx = 0; resultDimIdx < dimCount; resultDimIdx++) {
      var resultItem = getResultItem(resultDimIdx);
      var coordDim = resultItem.coordDim;
      if (coordDim == null) {
        resultItem.coordDim = genCoordDimName(extra, coordDimNameMap, fromZero);
        resultItem.coordDimIndex = 0;
        if (!generateCoord || generateCoordCount <= 0) {
          resultItem.isExtraCoord = true;
        }
        generateCoordCount--;
      }
      ifNoNameFillWithCoordName(resultItem);
      if (resultItem.type == null && (guessOrdinal(source, resultDimIdx) === BE_ORDINAL.Must || resultItem.isExtraCoord && (resultItem.otherDims.itemName != null || resultItem.otherDims.seriesName != null))) {
        resultItem.type = "ordinal";
      }
    }
  } else {
    each(resultList, function(resultItem2) {
      ifNoNameFillWithCoordName(resultItem2);
    });
    resultList.sort(function(item0, item1) {
      return item0.storeDimIndex - item1.storeDimIndex;
    });
  }
  removeDuplication(resultList);
  return new SeriesDataSchema({
    source,
    dimensions: resultList,
    fullDimensionCount: dimCount,
    dimensionOmitted: omitUnusedDimensions
  });
}
function removeDuplication(result) {
  var duplicationMap = createHashMap();
  for (var i = 0; i < result.length; i++) {
    var dim = result[i];
    var dimOriginalName = dim.name;
    var count = duplicationMap.get(dimOriginalName) || 0;
    if (count > 0) {
      dim.name = dimOriginalName + (count - 1);
    }
    count++;
    duplicationMap.set(dimOriginalName, count);
  }
}
function getDimCount(source, sysDims, dimsDef, optDimCount) {
  var dimCount = Math.max(source.dimensionsDetectedCount || 1, sysDims.length, dimsDef.length, optDimCount || 0);
  each(sysDims, function(sysDimItem) {
    var sysDimItemDimsDef;
    if (isObject$1(sysDimItem) && (sysDimItemDimsDef = sysDimItem.dimsDef)) {
      dimCount = Math.max(dimCount, sysDimItemDimsDef.length);
    }
  });
  return dimCount;
}
function genCoordDimName(name, map2, fromZero) {
  var mapData = map2.data;
  if (fromZero || mapData.hasOwnProperty(name)) {
    var i = 0;
    while (mapData.hasOwnProperty(name + i)) {
      i++;
    }
    name += i;
  }
  map2.set(name, true);
  return name;
}
var Scale = function() {
  function Scale2(setting) {
    this._setting = setting || {};
    this._extent = [Infinity, -Infinity];
  }
  Scale2.prototype.getSetting = function(name) {
    return this._setting[name];
  };
  Scale2.prototype.unionExtent = function(other) {
    var extent3 = this._extent;
    other[0] < extent3[0] && (extent3[0] = other[0]);
    other[1] > extent3[1] && (extent3[1] = other[1]);
  };
  Scale2.prototype.unionExtentFromData = function(data, dim) {
    this.unionExtent(data.getApproximateExtent(dim));
  };
  Scale2.prototype.getExtent = function() {
    return this._extent.slice();
  };
  Scale2.prototype.setExtent = function(start, end) {
    var thisExtent = this._extent;
    if (!isNaN(start)) {
      thisExtent[0] = start;
    }
    if (!isNaN(end)) {
      thisExtent[1] = end;
    }
  };
  Scale2.prototype.isInExtentRange = function(value) {
    return this._extent[0] <= value && this._extent[1] >= value;
  };
  Scale2.prototype.isBlank = function() {
    return this._isBlank;
  };
  Scale2.prototype.setBlank = function(isBlank) {
    this._isBlank = isBlank;
  };
  return Scale2;
}();
enableClassManagement(Scale);
var Scale$1 = Scale;
var uidBase = 0;
var OrdinalMeta = function() {
  function OrdinalMeta2(opt) {
    this.categories = opt.categories || [];
    this._needCollect = opt.needCollect;
    this._deduplication = opt.deduplication;
    this.uid = ++uidBase;
  }
  OrdinalMeta2.createByAxisModel = function(axisModel) {
    var option = axisModel.option;
    var data = option.data;
    var categories = data && map$1(data, getName);
    return new OrdinalMeta2({
      categories,
      needCollect: !categories,
      deduplication: option.dedplication !== false
    });
  };
  OrdinalMeta2.prototype.getOrdinal = function(category) {
    return this._getOrCreateMap().get(category);
  };
  OrdinalMeta2.prototype.parseAndCollect = function(category) {
    var index;
    var needCollect = this._needCollect;
    if (typeof category !== "string" && !needCollect) {
      return category;
    }
    if (needCollect && !this._deduplication) {
      index = this.categories.length;
      this.categories[index] = category;
      return index;
    }
    var map2 = this._getOrCreateMap();
    index = map2.get(category);
    if (index == null) {
      if (needCollect) {
        index = this.categories.length;
        this.categories[index] = category;
        map2.set(category, index);
      } else {
        index = NaN;
      }
    }
    return index;
  };
  OrdinalMeta2.prototype._getOrCreateMap = function() {
    return this._map || (this._map = createHashMap(this.categories));
  };
  return OrdinalMeta2;
}();
function getName(obj) {
  if (isObject$1(obj) && obj.value != null) {
    return obj.value;
  } else {
    return obj + "";
  }
}
var OrdinalMeta$1 = OrdinalMeta;
var roundNumber$1 = round;
function intervalScaleNiceTicks(extent3, splitNumber, minInterval, maxInterval) {
  var result = {};
  var span = extent3[1] - extent3[0];
  var interval = result.interval = nice(span / splitNumber, true);
  if (minInterval != null && interval < minInterval) {
    interval = result.interval = minInterval;
  }
  if (maxInterval != null && interval > maxInterval) {
    interval = result.interval = maxInterval;
  }
  var precision = result.intervalPrecision = getIntervalPrecision(interval);
  var niceTickExtent = result.niceTickExtent = [roundNumber$1(Math.ceil(extent3[0] / interval) * interval, precision), roundNumber$1(Math.floor(extent3[1] / interval) * interval, precision)];
  fixExtent(niceTickExtent, extent3);
  return result;
}
function getIntervalPrecision(interval) {
  return getPrecision(interval) + 2;
}
function clamp$1(niceTickExtent, idx, extent3) {
  niceTickExtent[idx] = Math.max(Math.min(niceTickExtent[idx], extent3[1]), extent3[0]);
}
function fixExtent(niceTickExtent, extent3) {
  !isFinite(niceTickExtent[0]) && (niceTickExtent[0] = extent3[0]);
  !isFinite(niceTickExtent[1]) && (niceTickExtent[1] = extent3[1]);
  clamp$1(niceTickExtent, 0, extent3);
  clamp$1(niceTickExtent, 1, extent3);
  if (niceTickExtent[0] > niceTickExtent[1]) {
    niceTickExtent[0] = niceTickExtent[1];
  }
}
function contain(val, extent3) {
  return val >= extent3[0] && val <= extent3[1];
}
function normalize$1(val, extent3) {
  if (extent3[1] === extent3[0]) {
    return 0.5;
  }
  return (val - extent3[0]) / (extent3[1] - extent3[0]);
}
function scale(val, extent3) {
  return val * (extent3[1] - extent3[0]) + extent3[0];
}
var OrdinalScale = function(_super) {
  __extends(OrdinalScale2, _super);
  function OrdinalScale2(setting) {
    var _this = _super.call(this, setting) || this;
    _this.type = "ordinal";
    var ordinalMeta = _this.getSetting("ordinalMeta");
    if (!ordinalMeta) {
      ordinalMeta = new OrdinalMeta$1({});
    }
    if (isArray(ordinalMeta)) {
      ordinalMeta = new OrdinalMeta$1({
        categories: map$1(ordinalMeta, function(item) {
          return isObject$1(item) ? item.value : item;
        })
      });
    }
    _this._ordinalMeta = ordinalMeta;
    _this._extent = _this.getSetting("extent") || [0, ordinalMeta.categories.length - 1];
    return _this;
  }
  OrdinalScale2.prototype.parse = function(val) {
    return typeof val === "string" ? this._ordinalMeta.getOrdinal(val) : Math.round(val);
  };
  OrdinalScale2.prototype.contain = function(rank) {
    rank = this.parse(rank);
    return contain(rank, this._extent) && this._ordinalMeta.categories[rank] != null;
  };
  OrdinalScale2.prototype.normalize = function(val) {
    val = this._getTickNumber(this.parse(val));
    return normalize$1(val, this._extent);
  };
  OrdinalScale2.prototype.scale = function(val) {
    val = Math.round(scale(val, this._extent));
    return this.getRawOrdinalNumber(val);
  };
  OrdinalScale2.prototype.getTicks = function() {
    var ticks = [];
    var extent3 = this._extent;
    var rank = extent3[0];
    while (rank <= extent3[1]) {
      ticks.push({
        value: rank
      });
      rank++;
    }
    return ticks;
  };
  OrdinalScale2.prototype.getMinorTicks = function(splitNumber) {
    return;
  };
  OrdinalScale2.prototype.setSortInfo = function(info) {
    if (info == null) {
      this._ordinalNumbersByTick = this._ticksByOrdinalNumber = null;
      return;
    }
    var infoOrdinalNumbers = info.ordinalNumbers;
    var ordinalsByTick = this._ordinalNumbersByTick = [];
    var ticksByOrdinal = this._ticksByOrdinalNumber = [];
    var tickNum = 0;
    var allCategoryLen = this._ordinalMeta.categories.length;
    for (var len = Math.min(allCategoryLen, infoOrdinalNumbers.length); tickNum < len; ++tickNum) {
      var ordinalNumber = infoOrdinalNumbers[tickNum];
      ordinalsByTick[tickNum] = ordinalNumber;
      ticksByOrdinal[ordinalNumber] = tickNum;
    }
    var unusedOrdinal = 0;
    for (; tickNum < allCategoryLen; ++tickNum) {
      while (ticksByOrdinal[unusedOrdinal] != null) {
        unusedOrdinal++;
      }
      ordinalsByTick.push(unusedOrdinal);
      ticksByOrdinal[unusedOrdinal] = tickNum;
    }
  };
  OrdinalScale2.prototype._getTickNumber = function(ordinal) {
    var ticksByOrdinalNumber = this._ticksByOrdinalNumber;
    return ticksByOrdinalNumber && ordinal >= 0 && ordinal < ticksByOrdinalNumber.length ? ticksByOrdinalNumber[ordinal] : ordinal;
  };
  OrdinalScale2.prototype.getRawOrdinalNumber = function(tickNumber) {
    var ordinalNumbersByTick = this._ordinalNumbersByTick;
    return ordinalNumbersByTick && tickNumber >= 0 && tickNumber < ordinalNumbersByTick.length ? ordinalNumbersByTick[tickNumber] : tickNumber;
  };
  OrdinalScale2.prototype.getLabel = function(tick) {
    if (!this.isBlank()) {
      var ordinalNumber = this.getRawOrdinalNumber(tick.value);
      var cateogry = this._ordinalMeta.categories[ordinalNumber];
      return cateogry == null ? "" : cateogry + "";
    }
  };
  OrdinalScale2.prototype.count = function() {
    return this._extent[1] - this._extent[0] + 1;
  };
  OrdinalScale2.prototype.unionExtentFromData = function(data, dim) {
    this.unionExtent(data.getApproximateExtent(dim));
  };
  OrdinalScale2.prototype.isInExtentRange = function(value) {
    value = this._getTickNumber(value);
    return this._extent[0] <= value && this._extent[1] >= value;
  };
  OrdinalScale2.prototype.getOrdinalMeta = function() {
    return this._ordinalMeta;
  };
  OrdinalScale2.prototype.niceTicks = function() {
  };
  OrdinalScale2.prototype.niceExtent = function() {
  };
  OrdinalScale2.type = "ordinal";
  return OrdinalScale2;
}(Scale$1);
Scale$1.registerClass(OrdinalScale);
var OrdinalScale$1 = OrdinalScale;
var roundNumber = round;
var IntervalScale = function(_super) {
  __extends(IntervalScale2, _super);
  function IntervalScale2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.type = "interval";
    _this._interval = 0;
    _this._intervalPrecision = 2;
    return _this;
  }
  IntervalScale2.prototype.parse = function(val) {
    return val;
  };
  IntervalScale2.prototype.contain = function(val) {
    return contain(val, this._extent);
  };
  IntervalScale2.prototype.normalize = function(val) {
    return normalize$1(val, this._extent);
  };
  IntervalScale2.prototype.scale = function(val) {
    return scale(val, this._extent);
  };
  IntervalScale2.prototype.setExtent = function(start, end) {
    var thisExtent = this._extent;
    if (!isNaN(start)) {
      thisExtent[0] = parseFloat(start);
    }
    if (!isNaN(end)) {
      thisExtent[1] = parseFloat(end);
    }
  };
  IntervalScale2.prototype.unionExtent = function(other) {
    var extent3 = this._extent;
    other[0] < extent3[0] && (extent3[0] = other[0]);
    other[1] > extent3[1] && (extent3[1] = other[1]);
    this.setExtent(extent3[0], extent3[1]);
  };
  IntervalScale2.prototype.getInterval = function() {
    return this._interval;
  };
  IntervalScale2.prototype.setInterval = function(interval) {
    this._interval = interval;
    this._niceExtent = this._extent.slice();
    this._intervalPrecision = getIntervalPrecision(interval);
  };
  IntervalScale2.prototype.getTicks = function(expandToNicedExtent) {
    var interval = this._interval;
    var extent3 = this._extent;
    var niceTickExtent = this._niceExtent;
    var intervalPrecision = this._intervalPrecision;
    var ticks = [];
    if (!interval) {
      return ticks;
    }
    var safeLimit = 1e4;
    if (extent3[0] < niceTickExtent[0]) {
      if (expandToNicedExtent) {
        ticks.push({
          value: roundNumber(niceTickExtent[0] - interval, intervalPrecision)
        });
      } else {
        ticks.push({
          value: extent3[0]
        });
      }
    }
    var tick = niceTickExtent[0];
    while (tick <= niceTickExtent[1]) {
      ticks.push({
        value: tick
      });
      tick = roundNumber(tick + interval, intervalPrecision);
      if (tick === ticks[ticks.length - 1].value) {
        break;
      }
      if (ticks.length > safeLimit) {
        return [];
      }
    }
    var lastNiceTick = ticks.length ? ticks[ticks.length - 1].value : niceTickExtent[1];
    if (extent3[1] > lastNiceTick) {
      if (expandToNicedExtent) {
        ticks.push({
          value: roundNumber(lastNiceTick + interval, intervalPrecision)
        });
      } else {
        ticks.push({
          value: extent3[1]
        });
      }
    }
    return ticks;
  };
  IntervalScale2.prototype.getMinorTicks = function(splitNumber) {
    var ticks = this.getTicks(true);
    var minorTicks = [];
    var extent3 = this.getExtent();
    for (var i = 1; i < ticks.length; i++) {
      var nextTick = ticks[i];
      var prevTick = ticks[i - 1];
      var count = 0;
      var minorTicksGroup = [];
      var interval = nextTick.value - prevTick.value;
      var minorInterval = interval / splitNumber;
      while (count < splitNumber - 1) {
        var minorTick = roundNumber(prevTick.value + (count + 1) * minorInterval);
        if (minorTick > extent3[0] && minorTick < extent3[1]) {
          minorTicksGroup.push(minorTick);
        }
        count++;
      }
      minorTicks.push(minorTicksGroup);
    }
    return minorTicks;
  };
  IntervalScale2.prototype.getLabel = function(data, opt) {
    if (data == null) {
      return "";
    }
    var precision = opt && opt.precision;
    if (precision == null) {
      precision = getPrecision(data.value) || 0;
    } else if (precision === "auto") {
      precision = this._intervalPrecision;
    }
    var dataNum = roundNumber(data.value, precision, true);
    return addCommas(dataNum);
  };
  IntervalScale2.prototype.niceTicks = function(splitNumber, minInterval, maxInterval) {
    splitNumber = splitNumber || 5;
    var extent3 = this._extent;
    var span = extent3[1] - extent3[0];
    if (!isFinite(span)) {
      return;
    }
    if (span < 0) {
      span = -span;
      extent3.reverse();
    }
    var result = intervalScaleNiceTicks(extent3, splitNumber, minInterval, maxInterval);
    this._intervalPrecision = result.intervalPrecision;
    this._interval = result.interval;
    this._niceExtent = result.niceTickExtent;
  };
  IntervalScale2.prototype.niceExtent = function(opt) {
    var extent3 = this._extent;
    if (extent3[0] === extent3[1]) {
      if (extent3[0] !== 0) {
        var expandSize = extent3[0];
        if (!opt.fixMax) {
          extent3[1] += expandSize / 2;
          extent3[0] -= expandSize / 2;
        } else {
          extent3[0] -= expandSize / 2;
        }
      } else {
        extent3[1] = 1;
      }
    }
    var span = extent3[1] - extent3[0];
    if (!isFinite(span)) {
      extent3[0] = 0;
      extent3[1] = 1;
    }
    this.niceTicks(opt.splitNumber, opt.minInterval, opt.maxInterval);
    var interval = this._interval;
    if (!opt.fixMin) {
      extent3[0] = roundNumber(Math.floor(extent3[0] / interval) * interval);
    }
    if (!opt.fixMax) {
      extent3[1] = roundNumber(Math.ceil(extent3[1] / interval) * interval);
    }
  };
  IntervalScale2.type = "interval";
  return IntervalScale2;
}(Scale$1);
Scale$1.registerClass(IntervalScale);
var IntervalScale$1 = IntervalScale;
var STACK_PREFIX = "__ec_stack_";
var LARGE_BAR_MIN_WIDTH = 0.5;
var LargeArr = typeof Float32Array !== "undefined" ? Float32Array : Array;
function getSeriesStackId(seriesModel) {
  return seriesModel.get("stack") || STACK_PREFIX + seriesModel.seriesIndex;
}
function getAxisKey(axis) {
  return axis.dim + axis.index;
}
function prepareLayoutBarSeries(seriesType, ecModel) {
  var seriesModels = [];
  ecModel.eachSeriesByType(seriesType, function(seriesModel) {
    if (isOnCartesian(seriesModel) && !isInLargeMode(seriesModel)) {
      seriesModels.push(seriesModel);
    }
  });
  return seriesModels;
}
function getValueAxesMinGaps(barSeries) {
  var axisValues = {};
  each(barSeries, function(seriesModel) {
    var cartesian = seriesModel.coordinateSystem;
    var baseAxis = cartesian.getBaseAxis();
    if (baseAxis.type !== "time" && baseAxis.type !== "value") {
      return;
    }
    var data = seriesModel.getData();
    var key2 = baseAxis.dim + "_" + baseAxis.index;
    var dimIdx = data.getDimensionIndex(data.mapDimension(baseAxis.dim));
    var store = data.getStore();
    for (var i = 0, cnt = store.count(); i < cnt; ++i) {
      var value = store.get(dimIdx, i);
      if (!axisValues[key2]) {
        axisValues[key2] = [value];
      } else {
        axisValues[key2].push(value);
      }
    }
  });
  var axisMinGaps = {};
  for (var key in axisValues) {
    if (axisValues.hasOwnProperty(key)) {
      var valuesInAxis = axisValues[key];
      if (valuesInAxis) {
        valuesInAxis.sort(function(a, b) {
          return a - b;
        });
        var min = null;
        for (var j = 1; j < valuesInAxis.length; ++j) {
          var delta = valuesInAxis[j] - valuesInAxis[j - 1];
          if (delta > 0) {
            min = min === null ? delta : Math.min(min, delta);
          }
        }
        axisMinGaps[key] = min;
      }
    }
  }
  return axisMinGaps;
}
function makeColumnLayout(barSeries) {
  var axisMinGaps = getValueAxesMinGaps(barSeries);
  var seriesInfoList = [];
  each(barSeries, function(seriesModel) {
    var cartesian = seriesModel.coordinateSystem;
    var baseAxis = cartesian.getBaseAxis();
    var axisExtent = baseAxis.getExtent();
    var bandWidth;
    if (baseAxis.type === "category") {
      bandWidth = baseAxis.getBandWidth();
    } else if (baseAxis.type === "value" || baseAxis.type === "time") {
      var key = baseAxis.dim + "_" + baseAxis.index;
      var minGap = axisMinGaps[key];
      var extentSpan = Math.abs(axisExtent[1] - axisExtent[0]);
      var scale2 = baseAxis.scale.getExtent();
      var scaleSpan = Math.abs(scale2[1] - scale2[0]);
      bandWidth = minGap ? extentSpan / scaleSpan * minGap : extentSpan;
    } else {
      var data = seriesModel.getData();
      bandWidth = Math.abs(axisExtent[1] - axisExtent[0]) / data.count();
    }
    var barWidth = parsePercent(seriesModel.get("barWidth"), bandWidth);
    var barMaxWidth = parsePercent(seriesModel.get("barMaxWidth"), bandWidth);
    var barMinWidth = parsePercent(seriesModel.get("barMinWidth") || 1, bandWidth);
    var barGap = seriesModel.get("barGap");
    var barCategoryGap = seriesModel.get("barCategoryGap");
    seriesInfoList.push({
      bandWidth,
      barWidth,
      barMaxWidth,
      barMinWidth,
      barGap,
      barCategoryGap,
      axisKey: getAxisKey(baseAxis),
      stackId: getSeriesStackId(seriesModel)
    });
  });
  return doCalBarWidthAndOffset(seriesInfoList);
}
function doCalBarWidthAndOffset(seriesInfoList) {
  var columnsMap = {};
  each(seriesInfoList, function(seriesInfo, idx) {
    var axisKey = seriesInfo.axisKey;
    var bandWidth = seriesInfo.bandWidth;
    var columnsOnAxis = columnsMap[axisKey] || {
      bandWidth,
      remainedWidth: bandWidth,
      autoWidthCount: 0,
      categoryGap: null,
      gap: "20%",
      stacks: {}
    };
    var stacks = columnsOnAxis.stacks;
    columnsMap[axisKey] = columnsOnAxis;
    var stackId = seriesInfo.stackId;
    if (!stacks[stackId]) {
      columnsOnAxis.autoWidthCount++;
    }
    stacks[stackId] = stacks[stackId] || {
      width: 0,
      maxWidth: 0
    };
    var barWidth = seriesInfo.barWidth;
    if (barWidth && !stacks[stackId].width) {
      stacks[stackId].width = barWidth;
      barWidth = Math.min(columnsOnAxis.remainedWidth, barWidth);
      columnsOnAxis.remainedWidth -= barWidth;
    }
    var barMaxWidth = seriesInfo.barMaxWidth;
    barMaxWidth && (stacks[stackId].maxWidth = barMaxWidth);
    var barMinWidth = seriesInfo.barMinWidth;
    barMinWidth && (stacks[stackId].minWidth = barMinWidth);
    var barGap = seriesInfo.barGap;
    barGap != null && (columnsOnAxis.gap = barGap);
    var barCategoryGap = seriesInfo.barCategoryGap;
    barCategoryGap != null && (columnsOnAxis.categoryGap = barCategoryGap);
  });
  var result = {};
  each(columnsMap, function(columnsOnAxis, coordSysName) {
    result[coordSysName] = {};
    var stacks = columnsOnAxis.stacks;
    var bandWidth = columnsOnAxis.bandWidth;
    var categoryGapPercent = columnsOnAxis.categoryGap;
    if (categoryGapPercent == null) {
      var columnCount = keys(stacks).length;
      categoryGapPercent = Math.max(35 - columnCount * 4, 15) + "%";
    }
    var categoryGap = parsePercent(categoryGapPercent, bandWidth);
    var barGapPercent = parsePercent(columnsOnAxis.gap, 1);
    var remainedWidth = columnsOnAxis.remainedWidth;
    var autoWidthCount = columnsOnAxis.autoWidthCount;
    var autoWidth = (remainedWidth - categoryGap) / (autoWidthCount + (autoWidthCount - 1) * barGapPercent);
    autoWidth = Math.max(autoWidth, 0);
    each(stacks, function(column) {
      var maxWidth = column.maxWidth;
      var minWidth = column.minWidth;
      if (!column.width) {
        var finalWidth = autoWidth;
        if (maxWidth && maxWidth < finalWidth) {
          finalWidth = Math.min(maxWidth, remainedWidth);
        }
        if (minWidth && minWidth > finalWidth) {
          finalWidth = minWidth;
        }
        if (finalWidth !== autoWidth) {
          column.width = finalWidth;
          remainedWidth -= finalWidth + barGapPercent * finalWidth;
          autoWidthCount--;
        }
      } else {
        var finalWidth = column.width;
        if (maxWidth) {
          finalWidth = Math.min(finalWidth, maxWidth);
        }
        if (minWidth) {
          finalWidth = Math.max(finalWidth, minWidth);
        }
        column.width = finalWidth;
        remainedWidth -= finalWidth + barGapPercent * finalWidth;
        autoWidthCount--;
      }
    });
    autoWidth = (remainedWidth - categoryGap) / (autoWidthCount + (autoWidthCount - 1) * barGapPercent);
    autoWidth = Math.max(autoWidth, 0);
    var widthSum = 0;
    var lastColumn;
    each(stacks, function(column, idx) {
      if (!column.width) {
        column.width = autoWidth;
      }
      lastColumn = column;
      widthSum += column.width * (1 + barGapPercent);
    });
    if (lastColumn) {
      widthSum -= lastColumn.width * barGapPercent;
    }
    var offset = -widthSum / 2;
    each(stacks, function(column, stackId) {
      result[coordSysName][stackId] = result[coordSysName][stackId] || {
        bandWidth,
        offset,
        width: column.width
      };
      offset += column.width * (1 + barGapPercent);
    });
  });
  return result;
}
function retrieveColumnLayout(barWidthAndOffset, axis, seriesModel) {
  if (barWidthAndOffset && axis) {
    var result = barWidthAndOffset[getAxisKey(axis)];
    if (result != null && seriesModel != null) {
      return result[getSeriesStackId(seriesModel)];
    }
    return result;
  }
}
({
  seriesType: "bar",
  plan: createRenderPlanner(),
  reset: function(seriesModel) {
    if (!isOnCartesian(seriesModel) || !isInLargeMode(seriesModel)) {
      return;
    }
    var data = seriesModel.getData();
    var cartesian = seriesModel.coordinateSystem;
    var coordLayout = cartesian.master.getRect();
    var baseAxis = cartesian.getBaseAxis();
    var valueAxis = cartesian.getOtherAxis(baseAxis);
    var valueDimI = data.getDimensionIndex(data.mapDimension(valueAxis.dim));
    var baseDimI = data.getDimensionIndex(data.mapDimension(baseAxis.dim));
    var valueAxisHorizontal = valueAxis.isHorizontal();
    var valueDimIdx = valueAxisHorizontal ? 0 : 1;
    var barWidth = retrieveColumnLayout(makeColumnLayout([seriesModel]), baseAxis, seriesModel).width;
    if (!(barWidth > LARGE_BAR_MIN_WIDTH)) {
      barWidth = LARGE_BAR_MIN_WIDTH;
    }
    return {
      progress: function(params, data2) {
        var count = params.count;
        var largePoints = new LargeArr(count * 2);
        var largeBackgroundPoints = new LargeArr(count * 2);
        var largeDataIndices = new LargeArr(count);
        var dataIndex;
        var coord = [];
        var valuePair = [];
        var pointsOffset = 0;
        var idxOffset = 0;
        var store = data2.getStore();
        while ((dataIndex = params.next()) != null) {
          valuePair[valueDimIdx] = store.get(valueDimI, dataIndex);
          valuePair[1 - valueDimIdx] = store.get(baseDimI, dataIndex);
          coord = cartesian.dataToPoint(valuePair, null);
          largeBackgroundPoints[pointsOffset] = valueAxisHorizontal ? coordLayout.x + coordLayout.width : coord[0];
          largePoints[pointsOffset++] = coord[0];
          largeBackgroundPoints[pointsOffset] = valueAxisHorizontal ? coord[1] : coordLayout.y + coordLayout.height;
          largePoints[pointsOffset++] = coord[1];
          largeDataIndices[idxOffset++] = dataIndex;
        }
        data2.setLayout({
          largePoints,
          largeDataIndices,
          largeBackgroundPoints,
          barWidth,
          valueAxisStart: getValueAxisStart(baseAxis, valueAxis),
          backgroundStart: valueAxisHorizontal ? coordLayout.x : coordLayout.y,
          valueAxisHorizontal
        });
      }
    };
  }
});
function isOnCartesian(seriesModel) {
  return seriesModel.coordinateSystem && seriesModel.coordinateSystem.type === "cartesian2d";
}
function isInLargeMode(seriesModel) {
  return seriesModel.pipelineContext && seriesModel.pipelineContext.large;
}
function getValueAxisStart(baseAxis, valueAxis, stacked) {
  return valueAxis.toGlobalCoord(valueAxis.dataToCoord(valueAxis.type === "log" ? 1 : 0));
}
var bisect = function(a, x, lo, hi) {
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (a[mid][1] < x) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
};
var TimeScale = function(_super) {
  __extends(TimeScale2, _super);
  function TimeScale2(settings) {
    var _this = _super.call(this, settings) || this;
    _this.type = "time";
    return _this;
  }
  TimeScale2.prototype.getLabel = function(tick) {
    var useUTC = this.getSetting("useUTC");
    return format(tick.value, fullLeveledFormatter[getDefaultFormatPrecisionOfInterval(getPrimaryTimeUnit(this._minLevelUnit))] || fullLeveledFormatter.second, useUTC, this.getSetting("locale"));
  };
  TimeScale2.prototype.getFormattedLabel = function(tick, idx, labelFormatter) {
    var isUTC = this.getSetting("useUTC");
    var lang = this.getSetting("locale");
    return leveledFormat(tick, idx, labelFormatter, lang, isUTC);
  };
  TimeScale2.prototype.getTicks = function(expandToNicedExtent) {
    var interval = this._interval;
    var extent3 = this._extent;
    var ticks = [];
    if (!interval) {
      return ticks;
    }
    ticks.push({
      value: extent3[0],
      level: 0
    });
    var useUTC = this.getSetting("useUTC");
    var innerTicks = getIntervalTicks(this._minLevelUnit, this._approxInterval, useUTC, extent3);
    ticks = ticks.concat(innerTicks);
    ticks.push({
      value: extent3[1],
      level: 0
    });
    return ticks;
  };
  TimeScale2.prototype.niceExtent = function(opt) {
    var extent3 = this._extent;
    if (extent3[0] === extent3[1]) {
      extent3[0] -= ONE_DAY;
      extent3[1] += ONE_DAY;
    }
    if (extent3[1] === -Infinity && extent3[0] === Infinity) {
      var d = new Date();
      extent3[1] = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
      extent3[0] = extent3[1] - ONE_DAY;
    }
    this.niceTicks(opt.splitNumber, opt.minInterval, opt.maxInterval);
  };
  TimeScale2.prototype.niceTicks = function(approxTickNum, minInterval, maxInterval) {
    approxTickNum = approxTickNum || 10;
    var extent3 = this._extent;
    var span = extent3[1] - extent3[0];
    this._approxInterval = span / approxTickNum;
    if (minInterval != null && this._approxInterval < minInterval) {
      this._approxInterval = minInterval;
    }
    if (maxInterval != null && this._approxInterval > maxInterval) {
      this._approxInterval = maxInterval;
    }
    var scaleIntervalsLen = scaleIntervals.length;
    var idx = Math.min(bisect(scaleIntervals, this._approxInterval, 0, scaleIntervalsLen), scaleIntervalsLen - 1);
    this._interval = scaleIntervals[idx][1];
    this._minLevelUnit = scaleIntervals[Math.max(idx - 1, 0)][0];
  };
  TimeScale2.prototype.parse = function(val) {
    return typeof val === "number" ? val : +parseDate(val);
  };
  TimeScale2.prototype.contain = function(val) {
    return contain(this.parse(val), this._extent);
  };
  TimeScale2.prototype.normalize = function(val) {
    return normalize$1(this.parse(val), this._extent);
  };
  TimeScale2.prototype.scale = function(val) {
    return scale(val, this._extent);
  };
  TimeScale2.type = "time";
  return TimeScale2;
}(IntervalScale$1);
var scaleIntervals = [
  ["second", ONE_SECOND],
  ["minute", ONE_MINUTE],
  ["hour", ONE_HOUR],
  ["quarter-day", ONE_HOUR * 6],
  ["half-day", ONE_HOUR * 12],
  ["day", ONE_DAY * 1.2],
  ["half-week", ONE_DAY * 3.5],
  ["week", ONE_DAY * 7],
  ["month", ONE_DAY * 31],
  ["quarter", ONE_DAY * 95],
  ["half-year", ONE_YEAR / 2],
  ["year", ONE_YEAR]
];
function isUnitValueSame(unit, valueA, valueB, isUTC) {
  var dateA = parseDate(valueA);
  var dateB = parseDate(valueB);
  var isSame = function(unit2) {
    return getUnitValue(dateA, unit2, isUTC) === getUnitValue(dateB, unit2, isUTC);
  };
  var isSameYear = function() {
    return isSame("year");
  };
  var isSameMonth = function() {
    return isSameYear() && isSame("month");
  };
  var isSameDay = function() {
    return isSameMonth() && isSame("day");
  };
  var isSameHour = function() {
    return isSameDay() && isSame("hour");
  };
  var isSameMinute = function() {
    return isSameHour() && isSame("minute");
  };
  var isSameSecond = function() {
    return isSameMinute() && isSame("second");
  };
  var isSameMilliSecond = function() {
    return isSameSecond() && isSame("millisecond");
  };
  switch (unit) {
    case "year":
      return isSameYear();
    case "month":
      return isSameMonth();
    case "day":
      return isSameDay();
    case "hour":
      return isSameHour();
    case "minute":
      return isSameMinute();
    case "second":
      return isSameSecond();
    case "millisecond":
      return isSameMilliSecond();
  }
}
function getDateInterval(approxInterval, daysInMonth) {
  approxInterval /= ONE_DAY;
  return approxInterval > 16 ? 16 : approxInterval > 7.5 ? 7 : approxInterval > 3.5 ? 4 : approxInterval > 1.5 ? 2 : 1;
}
function getMonthInterval(approxInterval) {
  var APPROX_ONE_MONTH = 30 * ONE_DAY;
  approxInterval /= APPROX_ONE_MONTH;
  return approxInterval > 6 ? 6 : approxInterval > 3 ? 3 : approxInterval > 2 ? 2 : 1;
}
function getHourInterval(approxInterval) {
  approxInterval /= ONE_HOUR;
  return approxInterval > 12 ? 12 : approxInterval > 6 ? 6 : approxInterval > 3.5 ? 4 : approxInterval > 2 ? 2 : 1;
}
function getMinutesAndSecondsInterval(approxInterval, isMinutes) {
  approxInterval /= isMinutes ? ONE_MINUTE : ONE_SECOND;
  return approxInterval > 30 ? 30 : approxInterval > 20 ? 20 : approxInterval > 15 ? 15 : approxInterval > 10 ? 10 : approxInterval > 5 ? 5 : approxInterval > 2 ? 2 : 1;
}
function getMillisecondsInterval(approxInterval) {
  return nice(approxInterval, true);
}
function getFirstTimestampOfUnit(date, unitName, isUTC) {
  var outDate = new Date(date);
  switch (getPrimaryTimeUnit(unitName)) {
    case "year":
    case "month":
      outDate[monthSetterName(isUTC)](0);
    case "day":
      outDate[dateSetterName(isUTC)](1);
    case "hour":
      outDate[hoursSetterName(isUTC)](0);
    case "minute":
      outDate[minutesSetterName(isUTC)](0);
    case "second":
      outDate[secondsSetterName(isUTC)](0);
      outDate[millisecondsSetterName(isUTC)](0);
  }
  return outDate.getTime();
}
function getIntervalTicks(bottomUnitName, approxInterval, isUTC, extent3) {
  var safeLimit = 1e4;
  var unitNames = timeUnits;
  var iter = 0;
  function addTicksInSpan(interval, minTimestamp, maxTimestamp, getMethodName, setMethodName, isDate, out) {
    var date = new Date(minTimestamp);
    var dateTime = minTimestamp;
    var d = date[getMethodName]();
    while (dateTime < maxTimestamp && dateTime <= extent3[1]) {
      out.push({
        value: dateTime
      });
      d += interval;
      date[setMethodName](d);
      dateTime = date.getTime();
    }
    out.push({
      value: dateTime,
      notAdd: true
    });
  }
  function addLevelTicks(unitName, lastLevelTicks, levelTicks2) {
    var newAddedTicks = [];
    var isFirstLevel = !lastLevelTicks.length;
    if (isUnitValueSame(getPrimaryTimeUnit(unitName), extent3[0], extent3[1], isUTC)) {
      return;
    }
    if (isFirstLevel) {
      lastLevelTicks = [{
        value: getFirstTimestampOfUnit(new Date(extent3[0]), unitName, isUTC)
      }, {
        value: extent3[1]
      }];
    }
    for (var i2 = 0; i2 < lastLevelTicks.length - 1; i2++) {
      var startTick = lastLevelTicks[i2].value;
      var endTick = lastLevelTicks[i2 + 1].value;
      if (startTick === endTick) {
        continue;
      }
      var interval = void 0;
      var getterName = void 0;
      var setterName = void 0;
      var isDate = false;
      switch (unitName) {
        case "year":
          interval = Math.max(1, Math.round(approxInterval / ONE_DAY / 365));
          getterName = fullYearGetterName(isUTC);
          setterName = fullYearSetterName(isUTC);
          break;
        case "half-year":
        case "quarter":
        case "month":
          interval = getMonthInterval(approxInterval);
          getterName = monthGetterName(isUTC);
          setterName = monthSetterName(isUTC);
          break;
        case "week":
        case "half-week":
        case "day":
          interval = getDateInterval(approxInterval);
          getterName = dateGetterName(isUTC);
          setterName = dateSetterName(isUTC);
          isDate = true;
          break;
        case "half-day":
        case "quarter-day":
        case "hour":
          interval = getHourInterval(approxInterval);
          getterName = hoursGetterName(isUTC);
          setterName = hoursSetterName(isUTC);
          break;
        case "minute":
          interval = getMinutesAndSecondsInterval(approxInterval, true);
          getterName = minutesGetterName(isUTC);
          setterName = minutesSetterName(isUTC);
          break;
        case "second":
          interval = getMinutesAndSecondsInterval(approxInterval, false);
          getterName = secondsGetterName(isUTC);
          setterName = secondsSetterName(isUTC);
          break;
        case "millisecond":
          interval = getMillisecondsInterval(approxInterval);
          getterName = millisecondsGetterName(isUTC);
          setterName = millisecondsSetterName(isUTC);
          break;
      }
      addTicksInSpan(interval, startTick, endTick, getterName, setterName, isDate, newAddedTicks);
      if (unitName === "year" && levelTicks2.length > 1 && i2 === 0) {
        levelTicks2.unshift({
          value: levelTicks2[0].value - interval
        });
      }
    }
    for (var i2 = 0; i2 < newAddedTicks.length; i2++) {
      levelTicks2.push(newAddedTicks[i2]);
    }
    return newAddedTicks;
  }
  var levelsTicks = [];
  var currentLevelTicks = [];
  var tickCount = 0;
  var lastLevelTickCount = 0;
  for (var i = 0; i < unitNames.length && iter++ < safeLimit; ++i) {
    var primaryTimeUnit = getPrimaryTimeUnit(unitNames[i]);
    if (!isPrimaryTimeUnit(unitNames[i])) {
      continue;
    }
    addLevelTicks(unitNames[i], levelsTicks[levelsTicks.length - 1] || [], currentLevelTicks);
    var nextPrimaryTimeUnit = unitNames[i + 1] ? getPrimaryTimeUnit(unitNames[i + 1]) : null;
    if (primaryTimeUnit !== nextPrimaryTimeUnit) {
      if (currentLevelTicks.length) {
        lastLevelTickCount = tickCount;
        currentLevelTicks.sort(function(a, b) {
          return a.value - b.value;
        });
        var levelTicksRemoveDuplicated = [];
        for (var i_1 = 0; i_1 < currentLevelTicks.length; ++i_1) {
          var tickValue = currentLevelTicks[i_1].value;
          if (i_1 === 0 || currentLevelTicks[i_1 - 1].value !== tickValue) {
            levelTicksRemoveDuplicated.push(currentLevelTicks[i_1]);
            if (tickValue >= extent3[0] && tickValue <= extent3[1]) {
              tickCount++;
            }
          }
        }
        var targetTickNum = (extent3[1] - extent3[0]) / approxInterval;
        if (tickCount > targetTickNum * 1.5 && lastLevelTickCount > targetTickNum / 1.5) {
          break;
        }
        levelsTicks.push(levelTicksRemoveDuplicated);
        if (tickCount > targetTickNum || bottomUnitName === unitNames[i]) {
          break;
        }
      }
      currentLevelTicks = [];
    }
  }
  var levelsTicksInExtent = filter(map$1(levelsTicks, function(levelTicks2) {
    return filter(levelTicks2, function(tick) {
      return tick.value >= extent3[0] && tick.value <= extent3[1] && !tick.notAdd;
    });
  }), function(levelTicks2) {
    return levelTicks2.length > 0;
  });
  var ticks = [];
  var maxLevel = levelsTicksInExtent.length - 1;
  for (var i = 0; i < levelsTicksInExtent.length; ++i) {
    var levelTicks = levelsTicksInExtent[i];
    for (var k = 0; k < levelTicks.length; ++k) {
      ticks.push({
        value: levelTicks[k].value,
        level: maxLevel - i
      });
    }
  }
  ticks.sort(function(a, b) {
    return a.value - b.value;
  });
  var result = [];
  for (var i = 0; i < ticks.length; ++i) {
    if (i === 0 || ticks[i].value !== ticks[i - 1].value) {
      result.push(ticks[i]);
    }
  }
  return result;
}
Scale$1.registerClass(TimeScale);
var TimeScale$1 = TimeScale;
var scaleProto = Scale$1.prototype;
var intervalScaleProto = IntervalScale$1.prototype;
var roundingErrorFix = round;
var mathFloor = Math.floor;
var mathCeil = Math.ceil;
var mathPow = Math.pow;
var mathLog = Math.log;
var LogScale = function(_super) {
  __extends(LogScale2, _super);
  function LogScale2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.type = "log";
    _this.base = 10;
    _this._originalScale = new IntervalScale$1();
    _this._interval = 0;
    return _this;
  }
  LogScale2.prototype.getTicks = function(expandToNicedExtent) {
    var originalScale = this._originalScale;
    var extent3 = this._extent;
    var originalExtent = originalScale.getExtent();
    var ticks = intervalScaleProto.getTicks.call(this, expandToNicedExtent);
    return map$1(ticks, function(tick) {
      var val = tick.value;
      var powVal = round(mathPow(this.base, val));
      powVal = val === extent3[0] && this._fixMin ? fixRoundingError(powVal, originalExtent[0]) : powVal;
      powVal = val === extent3[1] && this._fixMax ? fixRoundingError(powVal, originalExtent[1]) : powVal;
      return {
        value: powVal
      };
    }, this);
  };
  LogScale2.prototype.setExtent = function(start, end) {
    var base = this.base;
    start = mathLog(start) / mathLog(base);
    end = mathLog(end) / mathLog(base);
    intervalScaleProto.setExtent.call(this, start, end);
  };
  LogScale2.prototype.getExtent = function() {
    var base = this.base;
    var extent3 = scaleProto.getExtent.call(this);
    extent3[0] = mathPow(base, extent3[0]);
    extent3[1] = mathPow(base, extent3[1]);
    var originalScale = this._originalScale;
    var originalExtent = originalScale.getExtent();
    this._fixMin && (extent3[0] = fixRoundingError(extent3[0], originalExtent[0]));
    this._fixMax && (extent3[1] = fixRoundingError(extent3[1], originalExtent[1]));
    return extent3;
  };
  LogScale2.prototype.unionExtent = function(extent3) {
    this._originalScale.unionExtent(extent3);
    var base = this.base;
    extent3[0] = mathLog(extent3[0]) / mathLog(base);
    extent3[1] = mathLog(extent3[1]) / mathLog(base);
    scaleProto.unionExtent.call(this, extent3);
  };
  LogScale2.prototype.unionExtentFromData = function(data, dim) {
    this.unionExtent(data.getApproximateExtent(dim));
  };
  LogScale2.prototype.niceTicks = function(approxTickNum) {
    approxTickNum = approxTickNum || 10;
    var extent3 = this._extent;
    var span = extent3[1] - extent3[0];
    if (span === Infinity || span <= 0) {
      return;
    }
    var interval = quantity(span);
    var err = approxTickNum / span * interval;
    if (err <= 0.5) {
      interval *= 10;
    }
    while (!isNaN(interval) && Math.abs(interval) < 1 && Math.abs(interval) > 0) {
      interval *= 10;
    }
    var niceExtent = [round(mathCeil(extent3[0] / interval) * interval), round(mathFloor(extent3[1] / interval) * interval)];
    this._interval = interval;
    this._niceExtent = niceExtent;
  };
  LogScale2.prototype.niceExtent = function(opt) {
    intervalScaleProto.niceExtent.call(this, opt);
    this._fixMin = opt.fixMin;
    this._fixMax = opt.fixMax;
  };
  LogScale2.prototype.parse = function(val) {
    return val;
  };
  LogScale2.prototype.contain = function(val) {
    val = mathLog(val) / mathLog(this.base);
    return contain(val, this._extent);
  };
  LogScale2.prototype.normalize = function(val) {
    val = mathLog(val) / mathLog(this.base);
    return normalize$1(val, this._extent);
  };
  LogScale2.prototype.scale = function(val) {
    val = scale(val, this._extent);
    return mathPow(this.base, val);
  };
  LogScale2.type = "log";
  return LogScale2;
}(Scale$1);
var proto$5 = LogScale.prototype;
proto$5.getMinorTicks = intervalScaleProto.getMinorTicks;
proto$5.getLabel = intervalScaleProto.getLabel;
function fixRoundingError(val, originalVal) {
  return roundingErrorFix(val, getPrecision(originalVal));
}
Scale$1.registerClass(LogScale);
var LogScale$1 = LogScale;
var ScaleRawExtentInfo = function() {
  function ScaleRawExtentInfo2(scale2, model, originalExtent) {
    this._prepareParams(scale2, model, originalExtent);
  }
  ScaleRawExtentInfo2.prototype._prepareParams = function(scale2, model, dataExtent) {
    if (dataExtent[1] < dataExtent[0]) {
      dataExtent = [NaN, NaN];
    }
    this._dataMin = dataExtent[0];
    this._dataMax = dataExtent[1];
    var isOrdinal = this._isOrdinal = scale2.type === "ordinal";
    this._needCrossZero = model.getNeedCrossZero && model.getNeedCrossZero();
    var modelMinRaw = this._modelMinRaw = model.get("min", true);
    if (isFunction(modelMinRaw)) {
      this._modelMinNum = parseAxisModelMinMax(scale2, modelMinRaw({
        min: dataExtent[0],
        max: dataExtent[1]
      }));
    } else if (modelMinRaw !== "dataMin") {
      this._modelMinNum = parseAxisModelMinMax(scale2, modelMinRaw);
    }
    var modelMaxRaw = this._modelMaxRaw = model.get("max", true);
    if (isFunction(modelMaxRaw)) {
      this._modelMaxNum = parseAxisModelMinMax(scale2, modelMaxRaw({
        min: dataExtent[0],
        max: dataExtent[1]
      }));
    } else if (modelMaxRaw !== "dataMax") {
      this._modelMaxNum = parseAxisModelMinMax(scale2, modelMaxRaw);
    }
    if (isOrdinal) {
      this._axisDataLen = model.getCategories().length;
    } else {
      var boundaryGap = model.get("boundaryGap");
      var boundaryGapArr = isArray(boundaryGap) ? boundaryGap : [boundaryGap || 0, boundaryGap || 0];
      if (typeof boundaryGapArr[0] === "boolean" || typeof boundaryGapArr[1] === "boolean") {
        this._boundaryGapInner = [0, 0];
      } else {
        this._boundaryGapInner = [parsePercent$1(boundaryGapArr[0], 1), parsePercent$1(boundaryGapArr[1], 1)];
      }
    }
  };
  ScaleRawExtentInfo2.prototype.calculate = function() {
    var isOrdinal = this._isOrdinal;
    var dataMin = this._dataMin;
    var dataMax = this._dataMax;
    var axisDataLen = this._axisDataLen;
    var boundaryGapInner = this._boundaryGapInner;
    var span = !isOrdinal ? dataMax - dataMin || Math.abs(dataMin) : null;
    var min = this._modelMinRaw === "dataMin" ? dataMin : this._modelMinNum;
    var max = this._modelMaxRaw === "dataMax" ? dataMax : this._modelMaxNum;
    var minFixed = min != null;
    var maxFixed = max != null;
    if (min == null) {
      min = isOrdinal ? axisDataLen ? 0 : NaN : dataMin - boundaryGapInner[0] * span;
    }
    if (max == null) {
      max = isOrdinal ? axisDataLen ? axisDataLen - 1 : NaN : dataMax + boundaryGapInner[1] * span;
    }
    (min == null || !isFinite(min)) && (min = NaN);
    (max == null || !isFinite(max)) && (max = NaN);
    if (min > max) {
      min = NaN;
      max = NaN;
    }
    var isBlank = eqNaN(min) || eqNaN(max) || isOrdinal && !axisDataLen;
    if (this._needCrossZero) {
      if (min > 0 && max > 0 && !minFixed) {
        min = 0;
      }
      if (min < 0 && max < 0 && !maxFixed) {
        max = 0;
      }
    }
    var determinedMin = this._determinedMin;
    var determinedMax = this._determinedMax;
    if (determinedMin != null) {
      min = determinedMin;
      minFixed = true;
    }
    if (determinedMax != null) {
      max = determinedMax;
      maxFixed = true;
    }
    return {
      min,
      max,
      minFixed,
      maxFixed,
      isBlank
    };
  };
  ScaleRawExtentInfo2.prototype.modifyDataMinMax = function(minMaxName, val) {
    this[DATA_MIN_MAX_ATTR[minMaxName]] = val;
  };
  ScaleRawExtentInfo2.prototype.setDeterminedMinMax = function(minMaxName, val) {
    var attr = DETERMINED_MIN_MAX_ATTR[minMaxName];
    this[attr] = val;
  };
  ScaleRawExtentInfo2.prototype.freeze = function() {
    this.frozen = true;
  };
  return ScaleRawExtentInfo2;
}();
var DETERMINED_MIN_MAX_ATTR = {
  min: "_determinedMin",
  max: "_determinedMax"
};
var DATA_MIN_MAX_ATTR = {
  min: "_dataMin",
  max: "_dataMax"
};
function ensureScaleRawExtentInfo(scale2, model, originalExtent) {
  var rawExtentInfo = scale2.rawExtentInfo;
  if (rawExtentInfo) {
    return rawExtentInfo;
  }
  rawExtentInfo = new ScaleRawExtentInfo(scale2, model, originalExtent);
  scale2.rawExtentInfo = rawExtentInfo;
  return rawExtentInfo;
}
function parseAxisModelMinMax(scale2, minMax) {
  return minMax == null ? null : eqNaN(minMax) ? NaN : scale2.parse(minMax);
}
function getScaleExtent(scale2, model) {
  var scaleType = scale2.type;
  var rawExtentResult = ensureScaleRawExtentInfo(scale2, model, scale2.getExtent()).calculate();
  scale2.setBlank(rawExtentResult.isBlank);
  var min = rawExtentResult.min;
  var max = rawExtentResult.max;
  var ecModel = model.ecModel;
  if (ecModel && scaleType === "time") {
    var barSeriesModels = prepareLayoutBarSeries("bar", ecModel);
    var isBaseAxisAndHasBarSeries_1 = false;
    each(barSeriesModels, function(seriesModel) {
      isBaseAxisAndHasBarSeries_1 = isBaseAxisAndHasBarSeries_1 || seriesModel.getBaseAxis() === model.axis;
    });
    if (isBaseAxisAndHasBarSeries_1) {
      var barWidthAndOffset = makeColumnLayout(barSeriesModels);
      var adjustedScale = adjustScaleForOverflow(min, max, model, barWidthAndOffset);
      min = adjustedScale.min;
      max = adjustedScale.max;
    }
  }
  return {
    extent: [min, max],
    fixMin: rawExtentResult.minFixed,
    fixMax: rawExtentResult.maxFixed
  };
}
function adjustScaleForOverflow(min, max, model, barWidthAndOffset) {
  var axisExtent = model.axis.getExtent();
  var axisLength = axisExtent[1] - axisExtent[0];
  var barsOnCurrentAxis = retrieveColumnLayout(barWidthAndOffset, model.axis);
  if (barsOnCurrentAxis === void 0) {
    return {
      min,
      max
    };
  }
  var minOverflow = Infinity;
  each(barsOnCurrentAxis, function(item) {
    minOverflow = Math.min(item.offset, minOverflow);
  });
  var maxOverflow = -Infinity;
  each(barsOnCurrentAxis, function(item) {
    maxOverflow = Math.max(item.offset + item.width, maxOverflow);
  });
  minOverflow = Math.abs(minOverflow);
  maxOverflow = Math.abs(maxOverflow);
  var totalOverFlow = minOverflow + maxOverflow;
  var oldRange = max - min;
  var oldRangePercentOfNew = 1 - (minOverflow + maxOverflow) / axisLength;
  var overflowBuffer = oldRange / oldRangePercentOfNew - oldRange;
  max += overflowBuffer * (maxOverflow / totalOverFlow);
  min -= overflowBuffer * (minOverflow / totalOverFlow);
  return {
    min,
    max
  };
}
function niceScaleExtent(scale2, inModel) {
  var model = inModel;
  var extentInfo = getScaleExtent(scale2, model);
  var extent3 = extentInfo.extent;
  var splitNumber = model.get("splitNumber");
  if (scale2 instanceof LogScale$1) {
    scale2.base = model.get("logBase");
  }
  var scaleType = scale2.type;
  scale2.setExtent(extent3[0], extent3[1]);
  scale2.niceExtent({
    splitNumber,
    fixMin: extentInfo.fixMin,
    fixMax: extentInfo.fixMax,
    minInterval: scaleType === "interval" || scaleType === "time" ? model.get("minInterval") : null,
    maxInterval: scaleType === "interval" || scaleType === "time" ? model.get("maxInterval") : null
  });
  var interval = model.get("interval");
  if (interval != null) {
    scale2.setInterval && scale2.setInterval(interval);
  }
}
function createScaleByModel(model, axisType) {
  axisType = axisType || model.get("type");
  if (axisType) {
    switch (axisType) {
      case "category":
        return new OrdinalScale$1({
          ordinalMeta: model.getOrdinalMeta ? model.getOrdinalMeta() : model.getCategories(),
          extent: [Infinity, -Infinity]
        });
      case "time":
        return new TimeScale$1({
          locale: model.ecModel.getLocaleModel(),
          useUTC: model.ecModel.get("useUTC")
        });
      default:
        return new (Scale$1.getClass(axisType) || IntervalScale$1)();
    }
  }
}
function makeLabelFormatter(axis) {
  var labelFormatter = axis.getLabelModel().get("formatter");
  var categoryTickStart = axis.type === "category" ? axis.scale.getExtent()[0] : null;
  if (axis.scale.type === "time") {
    return function(tpl) {
      return function(tick, idx) {
        return axis.scale.getFormattedLabel(tick, idx, tpl);
      };
    }(labelFormatter);
  } else if (typeof labelFormatter === "string") {
    return function(tpl) {
      return function(tick) {
        var label = axis.scale.getLabel(tick);
        var text = tpl.replace("{value}", label != null ? label : "");
        return text;
      };
    }(labelFormatter);
  } else if (typeof labelFormatter === "function") {
    return function(cb) {
      return function(tick, idx) {
        if (categoryTickStart != null) {
          idx = tick.value - categoryTickStart;
        }
        return cb(getAxisRawValue(axis, tick), idx, tick.level != null ? {
          level: tick.level
        } : null);
      };
    }(labelFormatter);
  } else {
    return function(tick) {
      return axis.scale.getLabel(tick);
    };
  }
}
function getAxisRawValue(axis, tick) {
  return axis.type === "category" ? axis.scale.getLabel(tick) : tick.value;
}
function getOptionCategoryInterval(model) {
  var interval = model.get("interval");
  return interval == null ? "auto" : interval;
}
function shouldShowAllLabels(axis) {
  return axis.type === "category" && getOptionCategoryInterval(axis.getLabelModel()) === 0;
}
function createScale(dataExtent, option) {
  var axisModel = option;
  if (!(option instanceof Model)) {
    axisModel = new Model(option);
  }
  var scale2 = createScaleByModel(axisModel);
  scale2.setExtent(dataExtent[0], dataExtent[1]);
  niceScaleExtent(scale2, axisModel);
  return scale2;
}
var extensions = [];
var extensionRegisters = {
  registerPreprocessor,
  registerProcessor,
  registerPostInit,
  registerPostUpdate,
  registerUpdateLifecycle,
  registerAction,
  registerCoordinateSystem,
  registerLayout,
  registerVisual,
  registerTransform,
  registerLoading,
  registerMap,
  PRIORITY,
  ComponentModel,
  ComponentView,
  SeriesModel,
  ChartView,
  registerComponentModel: function(ComponentModelClass) {
    ComponentModel.registerClass(ComponentModelClass);
  },
  registerComponentView: function(ComponentViewClass) {
    ComponentView.registerClass(ComponentViewClass);
  },
  registerSeriesModel: function(SeriesModelClass) {
    SeriesModel.registerClass(SeriesModelClass);
  },
  registerChartView: function(ChartViewClass) {
    ChartView.registerClass(ChartViewClass);
  },
  registerSubTypeDefaulter: function(componentType, defaulter) {
    ComponentModel.registerSubTypeDefaulter(componentType, defaulter);
  },
  registerPainter: function(painterType, PainterCtor) {
    registerPainter(painterType, PainterCtor);
  }
};
function use(ext) {
  if (isArray(ext)) {
    each(ext, function(singleExt) {
      use(singleExt);
    });
    return;
  }
  if (indexOf(extensions, ext) >= 0) {
    return;
  }
  extensions.push(ext);
  if (isFunction(ext)) {
    ext = {
      install: ext
    };
  }
  ext.install(extensionRegisters);
}
var inner = makeInner();
function createAxisLabels(axis) {
  return axis.type === "category" ? makeCategoryLabels(axis) : makeRealNumberLabels(axis);
}
function createAxisTicks(axis, tickModel) {
  return axis.type === "category" ? makeCategoryTicks(axis, tickModel) : {
    ticks: map$1(axis.scale.getTicks(), function(tick) {
      return tick.value;
    })
  };
}
function makeCategoryLabels(axis) {
  var labelModel = axis.getLabelModel();
  var result = makeCategoryLabelsActually(axis, labelModel);
  return !labelModel.get("show") || axis.scale.isBlank() ? {
    labels: [],
    labelCategoryInterval: result.labelCategoryInterval
  } : result;
}
function makeCategoryLabelsActually(axis, labelModel) {
  var labelsCache = getListCache(axis, "labels");
  var optionLabelInterval = getOptionCategoryInterval(labelModel);
  var result = listCacheGet(labelsCache, optionLabelInterval);
  if (result) {
    return result;
  }
  var labels;
  var numericLabelInterval;
  if (isFunction(optionLabelInterval)) {
    labels = makeLabelsByCustomizedCategoryInterval(axis, optionLabelInterval);
  } else {
    numericLabelInterval = optionLabelInterval === "auto" ? makeAutoCategoryInterval(axis) : optionLabelInterval;
    labels = makeLabelsByNumericCategoryInterval(axis, numericLabelInterval);
  }
  return listCacheSet(labelsCache, optionLabelInterval, {
    labels,
    labelCategoryInterval: numericLabelInterval
  });
}
function makeCategoryTicks(axis, tickModel) {
  var ticksCache = getListCache(axis, "ticks");
  var optionTickInterval = getOptionCategoryInterval(tickModel);
  var result = listCacheGet(ticksCache, optionTickInterval);
  if (result) {
    return result;
  }
  var ticks;
  var tickCategoryInterval;
  if (!tickModel.get("show") || axis.scale.isBlank()) {
    ticks = [];
  }
  if (isFunction(optionTickInterval)) {
    ticks = makeLabelsByCustomizedCategoryInterval(axis, optionTickInterval, true);
  } else if (optionTickInterval === "auto") {
    var labelsResult = makeCategoryLabelsActually(axis, axis.getLabelModel());
    tickCategoryInterval = labelsResult.labelCategoryInterval;
    ticks = map$1(labelsResult.labels, function(labelItem) {
      return labelItem.tickValue;
    });
  } else {
    tickCategoryInterval = optionTickInterval;
    ticks = makeLabelsByNumericCategoryInterval(axis, tickCategoryInterval, true);
  }
  return listCacheSet(ticksCache, optionTickInterval, {
    ticks,
    tickCategoryInterval
  });
}
function makeRealNumberLabels(axis) {
  var ticks = axis.scale.getTicks();
  var labelFormatter = makeLabelFormatter(axis);
  return {
    labels: map$1(ticks, function(tick, idx) {
      return {
        level: tick.level,
        formattedLabel: labelFormatter(tick, idx),
        rawLabel: axis.scale.getLabel(tick),
        tickValue: tick.value
      };
    })
  };
}
function getListCache(axis, prop) {
  return inner(axis)[prop] || (inner(axis)[prop] = []);
}
function listCacheGet(cache, key) {
  for (var i = 0; i < cache.length; i++) {
    if (cache[i].key === key) {
      return cache[i].value;
    }
  }
}
function listCacheSet(cache, key, value) {
  cache.push({
    key,
    value
  });
  return value;
}
function makeAutoCategoryInterval(axis) {
  var result = inner(axis).autoInterval;
  return result != null ? result : inner(axis).autoInterval = axis.calculateCategoryInterval();
}
function calculateCategoryInterval(axis) {
  var params = fetchAutoCategoryIntervalCalculationParams(axis);
  var labelFormatter = makeLabelFormatter(axis);
  var rotation = (params.axisRotate - params.labelRotate) / 180 * Math.PI;
  var ordinalScale = axis.scale;
  var ordinalExtent = ordinalScale.getExtent();
  var tickCount = ordinalScale.count();
  if (ordinalExtent[1] - ordinalExtent[0] < 1) {
    return 0;
  }
  var step = 1;
  if (tickCount > 40) {
    step = Math.max(1, Math.floor(tickCount / 40));
  }
  var tickValue = ordinalExtent[0];
  var unitSpan = axis.dataToCoord(tickValue + 1) - axis.dataToCoord(tickValue);
  var unitW = Math.abs(unitSpan * Math.cos(rotation));
  var unitH = Math.abs(unitSpan * Math.sin(rotation));
  var maxW = 0;
  var maxH = 0;
  for (; tickValue <= ordinalExtent[1]; tickValue += step) {
    var width = 0;
    var height = 0;
    var rect = getBoundingRect(labelFormatter({
      value: tickValue
    }), params.font, "center", "top");
    width = rect.width * 1.3;
    height = rect.height * 1.3;
    maxW = Math.max(maxW, width, 7);
    maxH = Math.max(maxH, height, 7);
  }
  var dw = maxW / unitW;
  var dh = maxH / unitH;
  isNaN(dw) && (dw = Infinity);
  isNaN(dh) && (dh = Infinity);
  var interval = Math.max(0, Math.floor(Math.min(dw, dh)));
  var cache = inner(axis.model);
  var axisExtent = axis.getExtent();
  var lastAutoInterval = cache.lastAutoInterval;
  var lastTickCount = cache.lastTickCount;
  if (lastAutoInterval != null && lastTickCount != null && Math.abs(lastAutoInterval - interval) <= 1 && Math.abs(lastTickCount - tickCount) <= 1 && lastAutoInterval > interval && cache.axisExtent0 === axisExtent[0] && cache.axisExtent1 === axisExtent[1]) {
    interval = lastAutoInterval;
  } else {
    cache.lastTickCount = tickCount;
    cache.lastAutoInterval = interval;
    cache.axisExtent0 = axisExtent[0];
    cache.axisExtent1 = axisExtent[1];
  }
  return interval;
}
function fetchAutoCategoryIntervalCalculationParams(axis) {
  var labelModel = axis.getLabelModel();
  return {
    axisRotate: axis.getRotate ? axis.getRotate() : axis.isHorizontal && !axis.isHorizontal() ? 90 : 0,
    labelRotate: labelModel.get("rotate") || 0,
    font: labelModel.getFont()
  };
}
function makeLabelsByNumericCategoryInterval(axis, categoryInterval, onlyTick) {
  var labelFormatter = makeLabelFormatter(axis);
  var ordinalScale = axis.scale;
  var ordinalExtent = ordinalScale.getExtent();
  var labelModel = axis.getLabelModel();
  var result = [];
  var step = Math.max((categoryInterval || 0) + 1, 1);
  var startTick = ordinalExtent[0];
  var tickCount = ordinalScale.count();
  if (startTick !== 0 && step > 1 && tickCount / step > 2) {
    startTick = Math.round(Math.ceil(startTick / step) * step);
  }
  var showAllLabel = shouldShowAllLabels(axis);
  var includeMinLabel = labelModel.get("showMinLabel") || showAllLabel;
  var includeMaxLabel = labelModel.get("showMaxLabel") || showAllLabel;
  if (includeMinLabel && startTick !== ordinalExtent[0]) {
    addItem(ordinalExtent[0]);
  }
  var tickValue = startTick;
  for (; tickValue <= ordinalExtent[1]; tickValue += step) {
    addItem(tickValue);
  }
  if (includeMaxLabel && tickValue - step !== ordinalExtent[1]) {
    addItem(ordinalExtent[1]);
  }
  function addItem(tickValue2) {
    var tickObj = {
      value: tickValue2
    };
    result.push(onlyTick ? tickValue2 : {
      formattedLabel: labelFormatter(tickObj),
      rawLabel: ordinalScale.getLabel(tickObj),
      tickValue: tickValue2
    });
  }
  return result;
}
function makeLabelsByCustomizedCategoryInterval(axis, categoryInterval, onlyTick) {
  var ordinalScale = axis.scale;
  var labelFormatter = makeLabelFormatter(axis);
  var result = [];
  each(ordinalScale.getTicks(), function(tick) {
    var rawLabel = ordinalScale.getLabel(tick);
    var tickValue = tick.value;
    if (categoryInterval(tick.value, rawLabel)) {
      result.push(onlyTick ? tickValue : {
        formattedLabel: labelFormatter(tick),
        rawLabel,
        tickValue
      });
    }
  });
  return result;
}
var NORMALIZED_EXTENT = [0, 1];
var Axis = function() {
  function Axis2(dim, scale2, extent3) {
    this.onBand = false;
    this.inverse = false;
    this.dim = dim;
    this.scale = scale2;
    this._extent = extent3 || [0, 0];
  }
  Axis2.prototype.contain = function(coord) {
    var extent3 = this._extent;
    var min = Math.min(extent3[0], extent3[1]);
    var max = Math.max(extent3[0], extent3[1]);
    return coord >= min && coord <= max;
  };
  Axis2.prototype.containData = function(data) {
    return this.scale.contain(data);
  };
  Axis2.prototype.getExtent = function() {
    return this._extent.slice();
  };
  Axis2.prototype.getPixelPrecision = function(dataExtent) {
    return getPixelPrecision(dataExtent || this.scale.getExtent(), this._extent);
  };
  Axis2.prototype.setExtent = function(start, end) {
    var extent3 = this._extent;
    extent3[0] = start;
    extent3[1] = end;
  };
  Axis2.prototype.dataToCoord = function(data, clamp2) {
    var extent3 = this._extent;
    var scale2 = this.scale;
    data = scale2.normalize(data);
    if (this.onBand && scale2.type === "ordinal") {
      extent3 = extent3.slice();
      fixExtentWithBands(extent3, scale2.count());
    }
    return linearMap(data, NORMALIZED_EXTENT, extent3, clamp2);
  };
  Axis2.prototype.coordToData = function(coord, clamp2) {
    var extent3 = this._extent;
    var scale2 = this.scale;
    if (this.onBand && scale2.type === "ordinal") {
      extent3 = extent3.slice();
      fixExtentWithBands(extent3, scale2.count());
    }
    var t = linearMap(coord, extent3, NORMALIZED_EXTENT, clamp2);
    return this.scale.scale(t);
  };
  Axis2.prototype.pointToData = function(point, clamp2) {
    return;
  };
  Axis2.prototype.getTicksCoords = function(opt) {
    opt = opt || {};
    var tickModel = opt.tickModel || this.getTickModel();
    var result = createAxisTicks(this, tickModel);
    var ticks = result.ticks;
    var ticksCoords = map$1(ticks, function(tickVal) {
      return {
        coord: this.dataToCoord(this.scale.type === "ordinal" ? this.scale.getRawOrdinalNumber(tickVal) : tickVal),
        tickValue: tickVal
      };
    }, this);
    var alignWithLabel = tickModel.get("alignWithLabel");
    fixOnBandTicksCoords(this, ticksCoords, alignWithLabel, opt.clamp);
    return ticksCoords;
  };
  Axis2.prototype.getMinorTicksCoords = function() {
    if (this.scale.type === "ordinal") {
      return [];
    }
    var minorTickModel = this.model.getModel("minorTick");
    var splitNumber = minorTickModel.get("splitNumber");
    if (!(splitNumber > 0 && splitNumber < 100)) {
      splitNumber = 5;
    }
    var minorTicks = this.scale.getMinorTicks(splitNumber);
    var minorTicksCoords = map$1(minorTicks, function(minorTicksGroup) {
      return map$1(minorTicksGroup, function(minorTick) {
        return {
          coord: this.dataToCoord(minorTick),
          tickValue: minorTick
        };
      }, this);
    }, this);
    return minorTicksCoords;
  };
  Axis2.prototype.getViewLabels = function() {
    return createAxisLabels(this).labels;
  };
  Axis2.prototype.getLabelModel = function() {
    return this.model.getModel("axisLabel");
  };
  Axis2.prototype.getTickModel = function() {
    return this.model.getModel("axisTick");
  };
  Axis2.prototype.getBandWidth = function() {
    var axisExtent = this._extent;
    var dataExtent = this.scale.getExtent();
    var len = dataExtent[1] - dataExtent[0] + (this.onBand ? 1 : 0);
    len === 0 && (len = 1);
    var size = Math.abs(axisExtent[1] - axisExtent[0]);
    return Math.abs(size) / len;
  };
  Axis2.prototype.calculateCategoryInterval = function() {
    return calculateCategoryInterval(this);
  };
  return Axis2;
}();
function fixExtentWithBands(extent3, nTick) {
  var size = extent3[1] - extent3[0];
  var len = nTick;
  var margin = size / len / 2;
  extent3[0] += margin;
  extent3[1] -= margin;
}
function fixOnBandTicksCoords(axis, ticksCoords, alignWithLabel, clamp2) {
  var ticksLen = ticksCoords.length;
  if (!axis.onBand || alignWithLabel || !ticksLen) {
    return;
  }
  var axisExtent = axis.getExtent();
  var last;
  var diffSize;
  if (ticksLen === 1) {
    ticksCoords[0].coord = axisExtent[0];
    last = ticksCoords[1] = {
      coord: axisExtent[0]
    };
  } else {
    var crossLen = ticksCoords[ticksLen - 1].tickValue - ticksCoords[0].tickValue;
    var shift_1 = (ticksCoords[ticksLen - 1].coord - ticksCoords[0].coord) / crossLen;
    each(ticksCoords, function(ticksItem) {
      ticksItem.coord -= shift_1 / 2;
    });
    var dataExtent = axis.scale.getExtent();
    diffSize = 1 + dataExtent[1] - ticksCoords[ticksLen - 1].tickValue;
    last = {
      coord: ticksCoords[ticksLen - 1].coord + shift_1 * diffSize
    };
    ticksCoords.push(last);
  }
  var inverse = axisExtent[0] > axisExtent[1];
  if (littleThan(ticksCoords[0].coord, axisExtent[0])) {
    clamp2 ? ticksCoords[0].coord = axisExtent[0] : ticksCoords.shift();
  }
  if (clamp2 && littleThan(axisExtent[0], ticksCoords[0].coord)) {
    ticksCoords.unshift({
      coord: axisExtent[0]
    });
  }
  if (littleThan(axisExtent[1], last.coord)) {
    clamp2 ? last.coord = axisExtent[1] : ticksCoords.pop();
  }
  if (clamp2 && littleThan(last.coord, axisExtent[1])) {
    ticksCoords.push({
      coord: axisExtent[1]
    });
  }
  function littleThan(a, b) {
    a = round(a);
    b = round(b);
    return inverse ? a > b : a < b;
  }
}
var Axis$1 = Axis;
var PI2 = Math.PI * 2;
var CMD = PathProxy.CMD;
var DEFAULT_SEARCH_SPACE = ["top", "right", "bottom", "left"];
function getCandidateAnchor(pos, distance, rect, outPt, outDir) {
  var width = rect.width;
  var height = rect.height;
  switch (pos) {
    case "top":
      outPt.set(rect.x + width / 2, rect.y - distance);
      outDir.set(0, -1);
      break;
    case "bottom":
      outPt.set(rect.x + width / 2, rect.y + height + distance);
      outDir.set(0, 1);
      break;
    case "left":
      outPt.set(rect.x - distance, rect.y + height / 2);
      outDir.set(-1, 0);
      break;
    case "right":
      outPt.set(rect.x + width + distance, rect.y + height / 2);
      outDir.set(1, 0);
      break;
  }
}
function projectPointToArc(cx, cy, r, startAngle, endAngle, anticlockwise, x, y, out) {
  x -= cx;
  y -= cy;
  var d = Math.sqrt(x * x + y * y);
  x /= d;
  y /= d;
  var ox = x * r + cx;
  var oy = y * r + cy;
  if (Math.abs(startAngle - endAngle) % PI2 < 1e-4) {
    out[0] = ox;
    out[1] = oy;
    return d - r;
  }
  if (anticlockwise) {
    var tmp = startAngle;
    startAngle = normalizeRadian(endAngle);
    endAngle = normalizeRadian(tmp);
  } else {
    startAngle = normalizeRadian(startAngle);
    endAngle = normalizeRadian(endAngle);
  }
  if (startAngle > endAngle) {
    endAngle += PI2;
  }
  var angle = Math.atan2(y, x);
  if (angle < 0) {
    angle += PI2;
  }
  if (angle >= startAngle && angle <= endAngle || angle + PI2 >= startAngle && angle + PI2 <= endAngle) {
    out[0] = ox;
    out[1] = oy;
    return d - r;
  }
  var x1 = r * Math.cos(startAngle) + cx;
  var y1 = r * Math.sin(startAngle) + cy;
  var x2 = r * Math.cos(endAngle) + cx;
  var y2 = r * Math.sin(endAngle) + cy;
  var d1 = (x1 - x) * (x1 - x) + (y1 - y) * (y1 - y);
  var d2 = (x2 - x) * (x2 - x) + (y2 - y) * (y2 - y);
  if (d1 < d2) {
    out[0] = x1;
    out[1] = y1;
    return Math.sqrt(d1);
  } else {
    out[0] = x2;
    out[1] = y2;
    return Math.sqrt(d2);
  }
}
function projectPointToLine(x1, y1, x2, y2, x, y, out, limitToEnds) {
  var dx = x - x1;
  var dy = y - y1;
  var dx1 = x2 - x1;
  var dy1 = y2 - y1;
  var lineLen = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  dx1 /= lineLen;
  dy1 /= lineLen;
  var projectedLen = dx * dx1 + dy * dy1;
  var t = projectedLen / lineLen;
  if (limitToEnds) {
    t = Math.min(Math.max(t, 0), 1);
  }
  t *= lineLen;
  var ox = out[0] = x1 + t * dx1;
  var oy = out[1] = y1 + t * dy1;
  return Math.sqrt((ox - x) * (ox - x) + (oy - y) * (oy - y));
}
function projectPointToRect(x1, y1, width, height, x, y, out) {
  if (width < 0) {
    x1 = x1 + width;
    width = -width;
  }
  if (height < 0) {
    y1 = y1 + height;
    height = -height;
  }
  var x2 = x1 + width;
  var y2 = y1 + height;
  var ox = out[0] = Math.min(Math.max(x, x1), x2);
  var oy = out[1] = Math.min(Math.max(y, y1), y2);
  return Math.sqrt((ox - x) * (ox - x) + (oy - y) * (oy - y));
}
var tmpPt = [];
function nearestPointOnRect(pt, rect, out) {
  var dist2 = projectPointToRect(rect.x, rect.y, rect.width, rect.height, pt.x, pt.y, tmpPt);
  out.set(tmpPt[0], tmpPt[1]);
  return dist2;
}
function nearestPointOnPath(pt, path, out) {
  var xi = 0;
  var yi = 0;
  var x0 = 0;
  var y0 = 0;
  var x1;
  var y1;
  var minDist = Infinity;
  var data = path.data;
  var x = pt.x;
  var y = pt.y;
  for (var i = 0; i < data.length; ) {
    var cmd = data[i++];
    if (i === 1) {
      xi = data[i];
      yi = data[i + 1];
      x0 = xi;
      y0 = yi;
    }
    var d = minDist;
    switch (cmd) {
      case CMD.M:
        x0 = data[i++];
        y0 = data[i++];
        xi = x0;
        yi = y0;
        break;
      case CMD.L:
        d = projectPointToLine(xi, yi, data[i], data[i + 1], x, y, tmpPt, true);
        xi = data[i++];
        yi = data[i++];
        break;
      case CMD.C:
        d = cubicProjectPoint(xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1], x, y, tmpPt);
        xi = data[i++];
        yi = data[i++];
        break;
      case CMD.Q:
        d = quadraticProjectPoint(xi, yi, data[i++], data[i++], data[i], data[i + 1], x, y, tmpPt);
        xi = data[i++];
        yi = data[i++];
        break;
      case CMD.A:
        var cx = data[i++];
        var cy = data[i++];
        var rx = data[i++];
        var ry = data[i++];
        var theta = data[i++];
        var dTheta = data[i++];
        i += 1;
        var anticlockwise = !!(1 - data[i++]);
        x1 = Math.cos(theta) * rx + cx;
        y1 = Math.sin(theta) * ry + cy;
        if (i <= 1) {
          x0 = x1;
          y0 = y1;
        }
        var _x = (x - cx) * ry / rx + cx;
        d = projectPointToArc(cx, cy, ry, theta, theta + dTheta, anticlockwise, _x, y, tmpPt);
        xi = Math.cos(theta + dTheta) * rx + cx;
        yi = Math.sin(theta + dTheta) * ry + cy;
        break;
      case CMD.R:
        x0 = xi = data[i++];
        y0 = yi = data[i++];
        var width = data[i++];
        var height = data[i++];
        d = projectPointToRect(x0, y0, width, height, x, y, tmpPt);
        break;
      case CMD.Z:
        d = projectPointToLine(xi, yi, x0, y0, x, y, tmpPt, true);
        xi = x0;
        yi = y0;
        break;
    }
    if (d < minDist) {
      minDist = d;
      out.set(tmpPt[0], tmpPt[1]);
    }
  }
  return minDist;
}
var pt0 = new Point();
var pt1 = new Point();
var pt2 = new Point();
var dir = new Point();
var dir2 = new Point();
function updateLabelLinePoints(target, labelLineModel) {
  if (!target) {
    return;
  }
  var labelLine = target.getTextGuideLine();
  var label = target.getTextContent();
  if (!(label && labelLine)) {
    return;
  }
  var labelGuideConfig = target.textGuideLineConfig || {};
  var points = [[0, 0], [0, 0], [0, 0]];
  var searchSpace = labelGuideConfig.candidates || DEFAULT_SEARCH_SPACE;
  var labelRect = label.getBoundingRect().clone();
  labelRect.applyTransform(label.getComputedTransform());
  var minDist = Infinity;
  var anchorPoint = labelGuideConfig.anchor;
  var targetTransform = target.getComputedTransform();
  var targetInversedTransform = targetTransform && invert([], targetTransform);
  var len = labelLineModel.get("length2") || 0;
  if (anchorPoint) {
    pt2.copy(anchorPoint);
  }
  for (var i = 0; i < searchSpace.length; i++) {
    var candidate = searchSpace[i];
    getCandidateAnchor(candidate, 0, labelRect, pt0, dir);
    Point.scaleAndAdd(pt1, pt0, dir, len);
    pt1.transform(targetInversedTransform);
    var boundingRect = target.getBoundingRect();
    var dist2 = anchorPoint ? anchorPoint.distance(pt1) : target instanceof Path ? nearestPointOnPath(pt1, target.path, pt2) : nearestPointOnRect(pt1, boundingRect, pt2);
    if (dist2 < minDist) {
      minDist = dist2;
      pt1.transform(targetTransform);
      pt2.transform(targetTransform);
      pt2.toArray(points[0]);
      pt1.toArray(points[1]);
      pt0.toArray(points[2]);
    }
  }
  limitTurnAngle(points, labelLineModel.get("minTurnAngle"));
  labelLine.setShape({
    points
  });
}
var tmpArr = [];
var tmpProjPoint = new Point();
function limitTurnAngle(linePoints, minTurnAngle) {
  if (!(minTurnAngle <= 180 && minTurnAngle > 0)) {
    return;
  }
  minTurnAngle = minTurnAngle / 180 * Math.PI;
  pt0.fromArray(linePoints[0]);
  pt1.fromArray(linePoints[1]);
  pt2.fromArray(linePoints[2]);
  Point.sub(dir, pt0, pt1);
  Point.sub(dir2, pt2, pt1);
  var len1 = dir.len();
  var len2 = dir2.len();
  if (len1 < 1e-3 || len2 < 1e-3) {
    return;
  }
  dir.scale(1 / len1);
  dir2.scale(1 / len2);
  var angleCos = dir.dot(dir2);
  var minTurnAngleCos = Math.cos(minTurnAngle);
  if (minTurnAngleCos < angleCos) {
    var d = projectPointToLine(pt1.x, pt1.y, pt2.x, pt2.y, pt0.x, pt0.y, tmpArr, false);
    tmpProjPoint.fromArray(tmpArr);
    tmpProjPoint.scaleAndAdd(dir2, d / Math.tan(Math.PI - minTurnAngle));
    var t = pt2.x !== pt1.x ? (tmpProjPoint.x - pt1.x) / (pt2.x - pt1.x) : (tmpProjPoint.y - pt1.y) / (pt2.y - pt1.y);
    if (isNaN(t)) {
      return;
    }
    if (t < 0) {
      Point.copy(tmpProjPoint, pt1);
    } else if (t > 1) {
      Point.copy(tmpProjPoint, pt2);
    }
    tmpProjPoint.toArray(linePoints[1]);
  }
}
function setLabelLineState(labelLine, ignore, stateName, stateModel) {
  var isNormal = stateName === "normal";
  var stateObj = isNormal ? labelLine : labelLine.ensureState(stateName);
  stateObj.ignore = ignore;
  var smooth = stateModel.get("smooth");
  if (smooth && smooth === true) {
    smooth = 0.3;
  }
  stateObj.shape = stateObj.shape || {};
  if (smooth > 0) {
    stateObj.shape.smooth = smooth;
  }
  var styleObj = stateModel.getModel("lineStyle").getLineStyle();
  isNormal ? labelLine.useStyle(styleObj) : stateObj.style = styleObj;
}
function buildLabelLinePath(path, shape) {
  var smooth = shape.smooth;
  var points = shape.points;
  if (!points) {
    return;
  }
  path.moveTo(points[0][0], points[0][1]);
  if (smooth > 0 && points.length >= 3) {
    var len1 = dist(points[0], points[1]);
    var len2 = dist(points[1], points[2]);
    if (!len1 || !len2) {
      path.lineTo(points[1][0], points[1][1]);
      path.lineTo(points[2][0], points[2][1]);
      return;
    }
    var moveLen = Math.min(len1, len2) * smooth;
    var midPoint0 = lerp([], points[1], points[0], moveLen / len1);
    var midPoint2 = lerp([], points[1], points[2], moveLen / len2);
    var midPoint1 = lerp([], midPoint0, midPoint2, 0.5);
    path.bezierCurveTo(midPoint0[0], midPoint0[1], midPoint0[0], midPoint0[1], midPoint1[0], midPoint1[1]);
    path.bezierCurveTo(midPoint2[0], midPoint2[1], midPoint2[0], midPoint2[1], points[2][0], points[2][1]);
  } else {
    for (var i = 1; i < points.length; i++) {
      path.lineTo(points[i][0], points[i][1]);
    }
  }
}
function setLabelLineStyle(targetEl, statesModels, defaultStyle) {
  var labelLine = targetEl.getTextGuideLine();
  var label = targetEl.getTextContent();
  if (!label) {
    if (labelLine) {
      targetEl.removeTextGuideLine();
    }
    return;
  }
  var normalModel = statesModels.normal;
  var showNormal = normalModel.get("show");
  var labelIgnoreNormal = label.ignore;
  for (var i = 0; i < DISPLAY_STATES.length; i++) {
    var stateName = DISPLAY_STATES[i];
    var stateModel = statesModels[stateName];
    var isNormal = stateName === "normal";
    if (stateModel) {
      var stateShow = stateModel.get("show");
      var isLabelIgnored = isNormal ? labelIgnoreNormal : retrieve2(label.states[stateName] && label.states[stateName].ignore, labelIgnoreNormal);
      if (isLabelIgnored || !retrieve2(stateShow, showNormal)) {
        var stateObj = isNormal ? labelLine : labelLine && labelLine.states.normal;
        if (stateObj) {
          stateObj.ignore = true;
        }
        continue;
      }
      if (!labelLine) {
        labelLine = new Polyline();
        targetEl.setTextGuideLine(labelLine);
        if (!isNormal && (labelIgnoreNormal || !showNormal)) {
          setLabelLineState(labelLine, true, "normal", statesModels.normal);
        }
        if (targetEl.stateProxy) {
          labelLine.stateProxy = targetEl.stateProxy;
        }
      }
      setLabelLineState(labelLine, false, stateName, stateModel);
    }
  }
  if (labelLine) {
    defaults(labelLine.style, defaultStyle);
    labelLine.style.fill = null;
    var showAbove = normalModel.get("showAbove");
    var labelLineConfig = targetEl.textGuideLineConfig = targetEl.textGuideLineConfig || {};
    labelLineConfig.showAbove = showAbove || false;
    labelLine.buildPath = buildLabelLinePath;
  }
}
function getLabelLineStatesModels(itemModel, labelLineName) {
  labelLineName = labelLineName || "labelLine";
  var statesModels = {
    normal: itemModel.getModel(labelLineName)
  };
  for (var i = 0; i < SPECIAL_STATES.length; i++) {
    var stateName = SPECIAL_STATES[i];
    statesModels[stateName] = itemModel.getModel([stateName, labelLineName]);
  }
  return statesModels;
}
function prepareLayoutList(input) {
  var list = [];
  for (var i = 0; i < input.length; i++) {
    var rawItem = input[i];
    if (rawItem.defaultAttr.ignore) {
      continue;
    }
    var label = rawItem.label;
    var transform = label.getComputedTransform();
    var localRect = label.getBoundingRect();
    var isAxisAligned = !transform || transform[1] < 1e-5 && transform[2] < 1e-5;
    var minMargin = label.style.margin || 0;
    var globalRect = localRect.clone();
    globalRect.applyTransform(transform);
    globalRect.x -= minMargin / 2;
    globalRect.y -= minMargin / 2;
    globalRect.width += minMargin;
    globalRect.height += minMargin;
    var obb = isAxisAligned ? new OrientedBoundingRect$1(localRect, transform) : null;
    list.push({
      label,
      labelLine: rawItem.labelLine,
      rect: globalRect,
      localRect,
      obb,
      priority: rawItem.priority,
      defaultAttr: rawItem.defaultAttr,
      layoutOption: rawItem.computedLayoutOption,
      axisAligned: isAxisAligned,
      transform
    });
  }
  return list;
}
function shiftLayout(list, xyDim, sizeDim, minBound, maxBound, balanceShift) {
  var len = list.length;
  if (len < 2) {
    return;
  }
  list.sort(function(a, b) {
    return a.rect[xyDim] - b.rect[xyDim];
  });
  var lastPos = 0;
  var delta;
  var adjusted = false;
  var totalShifts = 0;
  for (var i = 0; i < len; i++) {
    var item = list[i];
    var rect = item.rect;
    delta = rect[xyDim] - lastPos;
    if (delta < 0) {
      rect[xyDim] -= delta;
      item.label[xyDim] -= delta;
      adjusted = true;
    }
    var shift = Math.max(-delta, 0);
    totalShifts += shift;
    lastPos = rect[xyDim] + rect[sizeDim];
  }
  if (totalShifts > 0 && balanceShift) {
    shiftList(-totalShifts / len, 0, len);
  }
  var first = list[0];
  var last = list[len - 1];
  var minGap;
  var maxGap;
  updateMinMaxGap();
  minGap < 0 && squeezeGaps(-minGap, 0.8);
  maxGap < 0 && squeezeGaps(maxGap, 0.8);
  updateMinMaxGap();
  takeBoundsGap(minGap, maxGap, 1);
  takeBoundsGap(maxGap, minGap, -1);
  updateMinMaxGap();
  if (minGap < 0) {
    squeezeWhenBailout(-minGap);
  }
  if (maxGap < 0) {
    squeezeWhenBailout(maxGap);
  }
  function updateMinMaxGap() {
    minGap = first.rect[xyDim] - minBound;
    maxGap = maxBound - last.rect[xyDim] - last.rect[sizeDim];
  }
  function takeBoundsGap(gapThisBound, gapOtherBound, moveDir) {
    if (gapThisBound < 0) {
      var moveFromMaxGap = Math.min(gapOtherBound, -gapThisBound);
      if (moveFromMaxGap > 0) {
        shiftList(moveFromMaxGap * moveDir, 0, len);
        var remained = moveFromMaxGap + gapThisBound;
        if (remained < 0) {
          squeezeGaps(-remained * moveDir, 1);
        }
      } else {
        squeezeGaps(-gapThisBound * moveDir, 1);
      }
    }
  }
  function shiftList(delta2, start, end) {
    if (delta2 !== 0) {
      adjusted = true;
    }
    for (var i2 = start; i2 < end; i2++) {
      var item2 = list[i2];
      var rect2 = item2.rect;
      rect2[xyDim] += delta2;
      item2.label[xyDim] += delta2;
    }
  }
  function squeezeGaps(delta2, maxSqeezePercent) {
    var gaps = [];
    var totalGaps = 0;
    for (var i2 = 1; i2 < len; i2++) {
      var prevItemRect = list[i2 - 1].rect;
      var gap = Math.max(list[i2].rect[xyDim] - prevItemRect[xyDim] - prevItemRect[sizeDim], 0);
      gaps.push(gap);
      totalGaps += gap;
    }
    if (!totalGaps) {
      return;
    }
    var squeezePercent = Math.min(Math.abs(delta2) / totalGaps, maxSqeezePercent);
    if (delta2 > 0) {
      for (var i2 = 0; i2 < len - 1; i2++) {
        var movement = gaps[i2] * squeezePercent;
        shiftList(movement, 0, i2 + 1);
      }
    } else {
      for (var i2 = len - 1; i2 > 0; i2--) {
        var movement = gaps[i2 - 1] * squeezePercent;
        shiftList(-movement, i2, len);
      }
    }
  }
  function squeezeWhenBailout(delta2) {
    var dir3 = delta2 < 0 ? -1 : 1;
    delta2 = Math.abs(delta2);
    var moveForEachLabel = Math.ceil(delta2 / (len - 1));
    for (var i2 = 0; i2 < len - 1; i2++) {
      if (dir3 > 0) {
        shiftList(moveForEachLabel, 0, i2 + 1);
      } else {
        shiftList(-moveForEachLabel, len - i2 - 1, len);
      }
      delta2 -= moveForEachLabel;
      if (delta2 <= 0) {
        return;
      }
    }
  }
  return adjusted;
}
function shiftLayoutOnX(list, leftBound, rightBound, balanceShift) {
  return shiftLayout(list, "x", "width", leftBound, rightBound, balanceShift);
}
function shiftLayoutOnY(list, topBound, bottomBound, balanceShift) {
  return shiftLayout(list, "y", "height", topBound, bottomBound, balanceShift);
}
function hideOverlap(labelList) {
  var displayedLabels = [];
  labelList.sort(function(a, b) {
    return b.priority - a.priority;
  });
  var globalRect = new BoundingRect(0, 0, 0, 0);
  function hideEl(el) {
    if (!el.ignore) {
      var emphasisState = el.ensureState("emphasis");
      if (emphasisState.ignore == null) {
        emphasisState.ignore = false;
      }
    }
    el.ignore = true;
  }
  for (var i = 0; i < labelList.length; i++) {
    var labelItem = labelList[i];
    var isAxisAligned = labelItem.axisAligned;
    var localRect = labelItem.localRect;
    var transform = labelItem.transform;
    var label = labelItem.label;
    var labelLine = labelItem.labelLine;
    globalRect.copy(labelItem.rect);
    globalRect.width -= 0.1;
    globalRect.height -= 0.1;
    globalRect.x += 0.05;
    globalRect.y += 0.05;
    var obb = labelItem.obb;
    var overlapped = false;
    for (var j = 0; j < displayedLabels.length; j++) {
      var existsTextCfg = displayedLabels[j];
      if (!globalRect.intersect(existsTextCfg.rect)) {
        continue;
      }
      if (isAxisAligned && existsTextCfg.axisAligned) {
        overlapped = true;
        break;
      }
      if (!existsTextCfg.obb) {
        existsTextCfg.obb = new OrientedBoundingRect$1(existsTextCfg.localRect, existsTextCfg.transform);
      }
      if (!obb) {
        obb = new OrientedBoundingRect$1(localRect, transform);
      }
      if (obb.intersect(existsTextCfg.obb)) {
        overlapped = true;
        break;
      }
    }
    if (overlapped) {
      hideEl(label);
      labelLine && hideEl(labelLine);
    } else {
      label.attr("ignore", labelItem.defaultAttr.ignore);
      labelLine && labelLine.attr("ignore", labelItem.defaultAttr.labelGuideIgnore);
      displayedLabels.push(labelItem);
    }
  }
}
function cloneArr(points) {
  if (points) {
    var newPoints = [];
    for (var i = 0; i < points.length; i++) {
      newPoints.push(points[i].slice());
    }
    return newPoints;
  }
}
function prepareLayoutCallbackParams(labelItem, hostEl) {
  var label = labelItem.label;
  var labelLine = hostEl && hostEl.getTextGuideLine();
  return {
    dataIndex: labelItem.dataIndex,
    dataType: labelItem.dataType,
    seriesIndex: labelItem.seriesModel.seriesIndex,
    text: labelItem.label.style.text,
    rect: labelItem.hostRect,
    labelRect: labelItem.rect,
    align: label.style.align,
    verticalAlign: label.style.verticalAlign,
    labelLinePoints: cloneArr(labelLine && labelLine.shape.points)
  };
}
var LABEL_OPTION_TO_STYLE_KEYS = ["align", "verticalAlign", "width", "height", "fontSize"];
var dummyTransformable = new Transformable();
var labelLayoutInnerStore = makeInner();
var labelLineAnimationStore = makeInner();
function extendWithKeys(target, source, keys2) {
  for (var i = 0; i < keys2.length; i++) {
    var key = keys2[i];
    if (source[key] != null) {
      target[key] = source[key];
    }
  }
}
var LABEL_LAYOUT_PROPS = ["x", "y", "rotation"];
var LabelManager = function() {
  function LabelManager2() {
    this._labelList = [];
    this._chartViewList = [];
  }
  LabelManager2.prototype.clearLabels = function() {
    this._labelList = [];
    this._chartViewList = [];
  };
  LabelManager2.prototype._addLabel = function(dataIndex, dataType, seriesModel, label, layoutOption) {
    var labelStyle = label.style;
    var hostEl = label.__hostTarget;
    var textConfig = hostEl.textConfig || {};
    var labelTransform = label.getComputedTransform();
    var labelRect = label.getBoundingRect().plain();
    BoundingRect.applyTransform(labelRect, labelRect, labelTransform);
    if (labelTransform) {
      dummyTransformable.setLocalTransform(labelTransform);
    } else {
      dummyTransformable.x = dummyTransformable.y = dummyTransformable.rotation = dummyTransformable.originX = dummyTransformable.originY = 0;
      dummyTransformable.scaleX = dummyTransformable.scaleY = 1;
    }
    var host = label.__hostTarget;
    var hostRect;
    if (host) {
      hostRect = host.getBoundingRect().plain();
      var transform = host.getComputedTransform();
      BoundingRect.applyTransform(hostRect, hostRect, transform);
    }
    var labelGuide = hostRect && host.getTextGuideLine();
    this._labelList.push({
      label,
      labelLine: labelGuide,
      seriesModel,
      dataIndex,
      dataType,
      layoutOption,
      computedLayoutOption: null,
      rect: labelRect,
      hostRect,
      priority: hostRect ? hostRect.width * hostRect.height : 0,
      defaultAttr: {
        ignore: label.ignore,
        labelGuideIgnore: labelGuide && labelGuide.ignore,
        x: dummyTransformable.x,
        y: dummyTransformable.y,
        scaleX: dummyTransformable.scaleX,
        scaleY: dummyTransformable.scaleY,
        rotation: dummyTransformable.rotation,
        style: {
          x: labelStyle.x,
          y: labelStyle.y,
          align: labelStyle.align,
          verticalAlign: labelStyle.verticalAlign,
          width: labelStyle.width,
          height: labelStyle.height,
          fontSize: labelStyle.fontSize
        },
        cursor: label.cursor,
        attachedPos: textConfig.position,
        attachedRot: textConfig.rotation
      }
    });
  };
  LabelManager2.prototype.addLabelsOfSeries = function(chartView) {
    var _this = this;
    this._chartViewList.push(chartView);
    var seriesModel = chartView.__model;
    var layoutOption = seriesModel.get("labelLayout");
    if (!(isFunction(layoutOption) || keys(layoutOption).length)) {
      return;
    }
    chartView.group.traverse(function(child) {
      if (child.ignore) {
        return true;
      }
      var textEl = child.getTextContent();
      var ecData = getECData(child);
      if (textEl && !textEl.disableLabelLayout) {
        _this._addLabel(ecData.dataIndex, ecData.dataType, seriesModel, textEl, layoutOption);
      }
    });
  };
  LabelManager2.prototype.updateLayoutConfig = function(api) {
    var width = api.getWidth();
    var height = api.getHeight();
    function createDragHandler(el, labelLineModel) {
      return function() {
        updateLabelLinePoints(el, labelLineModel);
      };
    }
    for (var i = 0; i < this._labelList.length; i++) {
      var labelItem = this._labelList[i];
      var label = labelItem.label;
      var hostEl = label.__hostTarget;
      var defaultLabelAttr = labelItem.defaultAttr;
      var layoutOption = void 0;
      if (typeof labelItem.layoutOption === "function") {
        layoutOption = labelItem.layoutOption(prepareLayoutCallbackParams(labelItem, hostEl));
      } else {
        layoutOption = labelItem.layoutOption;
      }
      layoutOption = layoutOption || {};
      labelItem.computedLayoutOption = layoutOption;
      var degreeToRadian = Math.PI / 180;
      if (hostEl) {
        hostEl.setTextConfig({
          local: false,
          position: layoutOption.x != null || layoutOption.y != null ? null : defaultLabelAttr.attachedPos,
          rotation: layoutOption.rotate != null ? layoutOption.rotate * degreeToRadian : defaultLabelAttr.attachedRot,
          offset: [layoutOption.dx || 0, layoutOption.dy || 0]
        });
      }
      var needsUpdateLabelLine = false;
      if (layoutOption.x != null) {
        label.x = parsePercent(layoutOption.x, width);
        label.setStyle("x", 0);
        needsUpdateLabelLine = true;
      } else {
        label.x = defaultLabelAttr.x;
        label.setStyle("x", defaultLabelAttr.style.x);
      }
      if (layoutOption.y != null) {
        label.y = parsePercent(layoutOption.y, height);
        label.setStyle("y", 0);
        needsUpdateLabelLine = true;
      } else {
        label.y = defaultLabelAttr.y;
        label.setStyle("y", defaultLabelAttr.style.y);
      }
      if (layoutOption.labelLinePoints) {
        var guideLine = hostEl.getTextGuideLine();
        if (guideLine) {
          guideLine.setShape({
            points: layoutOption.labelLinePoints
          });
          needsUpdateLabelLine = false;
        }
      }
      var labelLayoutStore = labelLayoutInnerStore(label);
      labelLayoutStore.needsUpdateLabelLine = needsUpdateLabelLine;
      label.rotation = layoutOption.rotate != null ? layoutOption.rotate * degreeToRadian : defaultLabelAttr.rotation;
      label.scaleX = defaultLabelAttr.scaleX;
      label.scaleY = defaultLabelAttr.scaleY;
      for (var k = 0; k < LABEL_OPTION_TO_STYLE_KEYS.length; k++) {
        var key = LABEL_OPTION_TO_STYLE_KEYS[k];
        label.setStyle(key, layoutOption[key] != null ? layoutOption[key] : defaultLabelAttr.style[key]);
      }
      if (layoutOption.draggable) {
        label.draggable = true;
        label.cursor = "move";
        if (hostEl) {
          var hostModel = labelItem.seriesModel;
          if (labelItem.dataIndex != null) {
            var data = labelItem.seriesModel.getData(labelItem.dataType);
            hostModel = data.getItemModel(labelItem.dataIndex);
          }
          label.on("drag", createDragHandler(hostEl, hostModel.getModel("labelLine")));
        }
      } else {
        label.off("drag");
        label.cursor = defaultLabelAttr.cursor;
      }
    }
  };
  LabelManager2.prototype.layout = function(api) {
    var width = api.getWidth();
    var height = api.getHeight();
    var labelList = prepareLayoutList(this._labelList);
    var labelsNeedsAdjustOnX = filter(labelList, function(item) {
      return item.layoutOption.moveOverlap === "shiftX";
    });
    var labelsNeedsAdjustOnY = filter(labelList, function(item) {
      return item.layoutOption.moveOverlap === "shiftY";
    });
    shiftLayoutOnX(labelsNeedsAdjustOnX, 0, width);
    shiftLayoutOnY(labelsNeedsAdjustOnY, 0, height);
    var labelsNeedsHideOverlap = filter(labelList, function(item) {
      return item.layoutOption.hideOverlap;
    });
    hideOverlap(labelsNeedsHideOverlap);
  };
  LabelManager2.prototype.processLabelsOverall = function() {
    var _this = this;
    each(this._chartViewList, function(chartView) {
      var seriesModel = chartView.__model;
      var ignoreLabelLineUpdate = chartView.ignoreLabelLineUpdate;
      var animationEnabled = seriesModel.isAnimationEnabled();
      chartView.group.traverse(function(child) {
        if (child.ignore) {
          return true;
        }
        var needsUpdateLabelLine = !ignoreLabelLineUpdate;
        var label = child.getTextContent();
        if (!needsUpdateLabelLine && label) {
          needsUpdateLabelLine = labelLayoutInnerStore(label).needsUpdateLabelLine;
        }
        if (needsUpdateLabelLine) {
          _this._updateLabelLine(child, seriesModel);
        }
        if (animationEnabled) {
          _this._animateLabels(child, seriesModel);
        }
      });
    });
  };
  LabelManager2.prototype._updateLabelLine = function(el, seriesModel) {
    var textEl = el.getTextContent();
    var ecData = getECData(el);
    var dataIndex = ecData.dataIndex;
    if (textEl && dataIndex != null) {
      var data = seriesModel.getData(ecData.dataType);
      var itemModel = data.getItemModel(dataIndex);
      var defaultStyle = {};
      var visualStyle = data.getItemVisual(dataIndex, "style");
      var visualType = data.getVisual("drawType");
      defaultStyle.stroke = visualStyle[visualType];
      var labelLineModel = itemModel.getModel("labelLine");
      setLabelLineStyle(el, getLabelLineStatesModels(itemModel), defaultStyle);
      updateLabelLinePoints(el, labelLineModel);
    }
  };
  LabelManager2.prototype._animateLabels = function(el, seriesModel) {
    var textEl = el.getTextContent();
    var guideLine = el.getTextGuideLine();
    if (textEl && !textEl.ignore && !textEl.invisible && !el.disableLabelAnimation && !isElementRemoved(el)) {
      var layoutStore = labelLayoutInnerStore(textEl);
      var oldLayout = layoutStore.oldLayout;
      var ecData = getECData(el);
      var dataIndex = ecData.dataIndex;
      var newProps = {
        x: textEl.x,
        y: textEl.y,
        rotation: textEl.rotation
      };
      var data = seriesModel.getData(ecData.dataType);
      if (!oldLayout) {
        textEl.attr(newProps);
        if (!labelInner(textEl).valueAnimation) {
          var oldOpacity = retrieve2(textEl.style.opacity, 1);
          textEl.style.opacity = 0;
          initProps(textEl, {
            style: {
              opacity: oldOpacity
            }
          }, seriesModel, dataIndex);
        }
      } else {
        textEl.attr(oldLayout);
        var prevStates = el.prevStates;
        if (prevStates) {
          if (indexOf(prevStates, "select") >= 0) {
            textEl.attr(layoutStore.oldLayoutSelect);
          }
          if (indexOf(prevStates, "emphasis") >= 0) {
            textEl.attr(layoutStore.oldLayoutEmphasis);
          }
        }
        updateProps(textEl, newProps, seriesModel, dataIndex);
      }
      layoutStore.oldLayout = newProps;
      if (textEl.states.select) {
        var layoutSelect = layoutStore.oldLayoutSelect = {};
        extendWithKeys(layoutSelect, newProps, LABEL_LAYOUT_PROPS);
        extendWithKeys(layoutSelect, textEl.states.select, LABEL_LAYOUT_PROPS);
      }
      if (textEl.states.emphasis) {
        var layoutEmphasis = layoutStore.oldLayoutEmphasis = {};
        extendWithKeys(layoutEmphasis, newProps, LABEL_LAYOUT_PROPS);
        extendWithKeys(layoutEmphasis, textEl.states.emphasis, LABEL_LAYOUT_PROPS);
      }
      animateLabelValue(textEl, dataIndex, data, seriesModel, seriesModel);
    }
    if (guideLine && !guideLine.ignore && !guideLine.invisible) {
      var layoutStore = labelLineAnimationStore(guideLine);
      var oldLayout = layoutStore.oldLayout;
      var newLayout = {
        points: guideLine.shape.points
      };
      if (!oldLayout) {
        guideLine.setShape(newLayout);
        guideLine.style.strokePercent = 0;
        initProps(guideLine, {
          style: {
            strokePercent: 1
          }
        }, seriesModel);
      } else {
        guideLine.attr({
          shape: oldLayout
        });
        updateProps(guideLine, {
          shape: newLayout
        }, seriesModel);
      }
      layoutStore.oldLayout = newLayout;
    }
  };
  return LabelManager2;
}();
var LabelManager$1 = LabelManager;
var getLabelManager = makeInner();
function installLabelLayout(registers) {
  registers.registerUpdateLifecycle("series:beforeupdate", function(ecModel, api, params) {
    var labelManager = getLabelManager(api).labelManager;
    if (!labelManager) {
      labelManager = getLabelManager(api).labelManager = new LabelManager$1();
    }
    labelManager.clearLabels();
  });
  registers.registerUpdateLifecycle("series:layoutlabels", function(ecModel, api, params) {
    var labelManager = getLabelManager(api).labelManager;
    params.updatedSeries.forEach(function(series) {
      labelManager.addLabelsOfSeries(api.getViewOfSeriesModel(series));
    });
    labelManager.updateLayoutConfig(api);
    labelManager.layout(api);
    labelManager.processLabelsOverall();
  });
}
function returnFalse() {
  return false;
}
function createDom(id, painter, dpr) {
  var newDom = createCanvas();
  var width = painter.getWidth();
  var height = painter.getHeight();
  var newDomStyle = newDom.style;
  if (newDomStyle) {
    newDomStyle.position = "absolute";
    newDomStyle.left = "0";
    newDomStyle.top = "0";
    newDomStyle.width = width + "px";
    newDomStyle.height = height + "px";
    newDom.setAttribute("data-zr-dom-id", id);
  }
  newDom.width = width * dpr;
  newDom.height = height * dpr;
  return newDom;
}
var Layer = function(_super) {
  __extends$1(Layer2, _super);
  function Layer2(id, painter, dpr) {
    var _this = _super.call(this) || this;
    _this.motionBlur = false;
    _this.lastFrameAlpha = 0.7;
    _this.dpr = 1;
    _this.virtual = false;
    _this.config = {};
    _this.incremental = false;
    _this.zlevel = 0;
    _this.maxRepaintRectCount = 5;
    _this.__dirty = true;
    _this.__firstTimePaint = true;
    _this.__used = false;
    _this.__drawIndex = 0;
    _this.__startIndex = 0;
    _this.__endIndex = 0;
    _this.__prevStartIndex = null;
    _this.__prevEndIndex = null;
    var dom;
    dpr = dpr || devicePixelRatio;
    if (typeof id === "string") {
      dom = createDom(id, painter, dpr);
    } else if (isObject$1(id)) {
      dom = id;
      id = dom.id;
    }
    _this.id = id;
    _this.dom = dom;
    var domStyle = dom.style;
    if (domStyle) {
      dom.onselectstart = returnFalse;
      domStyle.webkitUserSelect = "none";
      domStyle.userSelect = "none";
      domStyle.webkitTapHighlightColor = "rgba(0,0,0,0)";
      domStyle["-webkit-touch-callout"] = "none";
      domStyle.padding = "0";
      domStyle.margin = "0";
      domStyle.borderWidth = "0";
    }
    _this.domBack = null;
    _this.ctxBack = null;
    _this.painter = painter;
    _this.config = null;
    _this.dpr = dpr;
    return _this;
  }
  Layer2.prototype.getElementCount = function() {
    return this.__endIndex - this.__startIndex;
  };
  Layer2.prototype.afterBrush = function() {
    this.__prevStartIndex = this.__startIndex;
    this.__prevEndIndex = this.__endIndex;
  };
  Layer2.prototype.initContext = function() {
    this.ctx = this.dom.getContext("2d");
    this.ctx.dpr = this.dpr;
  };
  Layer2.prototype.setUnpainted = function() {
    this.__firstTimePaint = true;
  };
  Layer2.prototype.createBackBuffer = function() {
    var dpr = this.dpr;
    this.domBack = createDom("back-" + this.id, this.painter, dpr);
    this.ctxBack = this.domBack.getContext("2d");
    if (dpr !== 1) {
      this.ctxBack.scale(dpr, dpr);
    }
  };
  Layer2.prototype.createRepaintRects = function(displayList, prevList, viewWidth, viewHeight) {
    if (this.__firstTimePaint) {
      this.__firstTimePaint = false;
      return null;
    }
    var mergedRepaintRects = [];
    var maxRepaintRectCount = this.maxRepaintRectCount;
    var full = false;
    var pendingRect = new BoundingRect(0, 0, 0, 0);
    function addRectToMergePool(rect) {
      if (!rect.isFinite() || rect.isZero()) {
        return;
      }
      if (mergedRepaintRects.length === 0) {
        var boundingRect = new BoundingRect(0, 0, 0, 0);
        boundingRect.copy(rect);
        mergedRepaintRects.push(boundingRect);
      } else {
        var isMerged = false;
        var minDeltaArea = Infinity;
        var bestRectToMergeIdx = 0;
        for (var i2 = 0; i2 < mergedRepaintRects.length; ++i2) {
          var mergedRect = mergedRepaintRects[i2];
          if (mergedRect.intersect(rect)) {
            var pendingRect_1 = new BoundingRect(0, 0, 0, 0);
            pendingRect_1.copy(mergedRect);
            pendingRect_1.union(rect);
            mergedRepaintRects[i2] = pendingRect_1;
            isMerged = true;
            break;
          } else if (full) {
            pendingRect.copy(rect);
            pendingRect.union(mergedRect);
            var aArea = rect.width * rect.height;
            var bArea = mergedRect.width * mergedRect.height;
            var pendingArea = pendingRect.width * pendingRect.height;
            var deltaArea = pendingArea - aArea - bArea;
            if (deltaArea < minDeltaArea) {
              minDeltaArea = deltaArea;
              bestRectToMergeIdx = i2;
            }
          }
        }
        if (full) {
          mergedRepaintRects[bestRectToMergeIdx].union(rect);
          isMerged = true;
        }
        if (!isMerged) {
          var boundingRect = new BoundingRect(0, 0, 0, 0);
          boundingRect.copy(rect);
          mergedRepaintRects.push(boundingRect);
        }
        if (!full) {
          full = mergedRepaintRects.length >= maxRepaintRectCount;
        }
      }
    }
    for (var i = this.__startIndex; i < this.__endIndex; ++i) {
      var el = displayList[i];
      if (el) {
        var shouldPaint = el.shouldBePainted(viewWidth, viewHeight, true, true);
        var prevRect = el.__isRendered && (el.__dirty & REDRAW_BIT || !shouldPaint) ? el.getPrevPaintRect() : null;
        if (prevRect) {
          addRectToMergePool(prevRect);
        }
        var curRect = shouldPaint && (el.__dirty & REDRAW_BIT || !el.__isRendered) ? el.getPaintRect() : null;
        if (curRect) {
          addRectToMergePool(curRect);
        }
      }
    }
    for (var i = this.__prevStartIndex; i < this.__prevEndIndex; ++i) {
      var el = prevList[i];
      var shouldPaint = el.shouldBePainted(viewWidth, viewHeight, true, true);
      if (el && (!shouldPaint || !el.__zr) && el.__isRendered) {
        var prevRect = el.getPrevPaintRect();
        if (prevRect) {
          addRectToMergePool(prevRect);
        }
      }
    }
    var hasIntersections;
    do {
      hasIntersections = false;
      for (var i = 0; i < mergedRepaintRects.length; ) {
        if (mergedRepaintRects[i].isZero()) {
          mergedRepaintRects.splice(i, 1);
          continue;
        }
        for (var j = i + 1; j < mergedRepaintRects.length; ) {
          if (mergedRepaintRects[i].intersect(mergedRepaintRects[j])) {
            hasIntersections = true;
            mergedRepaintRects[i].union(mergedRepaintRects[j]);
            mergedRepaintRects.splice(j, 1);
          } else {
            j++;
          }
        }
        i++;
      }
    } while (hasIntersections);
    this._paintRects = mergedRepaintRects;
    return mergedRepaintRects;
  };
  Layer2.prototype.debugGetPaintRects = function() {
    return (this._paintRects || []).slice();
  };
  Layer2.prototype.resize = function(width, height) {
    var dpr = this.dpr;
    var dom = this.dom;
    var domStyle = dom.style;
    var domBack = this.domBack;
    if (domStyle) {
      domStyle.width = width + "px";
      domStyle.height = height + "px";
    }
    dom.width = width * dpr;
    dom.height = height * dpr;
    if (domBack) {
      domBack.width = width * dpr;
      domBack.height = height * dpr;
      if (dpr !== 1) {
        this.ctxBack.scale(dpr, dpr);
      }
    }
  };
  Layer2.prototype.clear = function(clearAll, clearColor, repaintRects) {
    var dom = this.dom;
    var ctx = this.ctx;
    var width = dom.width;
    var height = dom.height;
    clearColor = clearColor || this.clearColor;
    var haveMotionBLur = this.motionBlur && !clearAll;
    var lastFrameAlpha = this.lastFrameAlpha;
    var dpr = this.dpr;
    var self = this;
    if (haveMotionBLur) {
      if (!this.domBack) {
        this.createBackBuffer();
      }
      this.ctxBack.globalCompositeOperation = "copy";
      this.ctxBack.drawImage(dom, 0, 0, width / dpr, height / dpr);
    }
    var domBack = this.domBack;
    function doClear(x, y, width2, height2) {
      ctx.clearRect(x, y, width2, height2);
      if (clearColor && clearColor !== "transparent") {
        var clearColorGradientOrPattern = void 0;
        if (isGradientObject(clearColor)) {
          clearColorGradientOrPattern = clearColor.__canvasGradient || getCanvasGradient(ctx, clearColor, {
            x: 0,
            y: 0,
            width: width2,
            height: height2
          });
          clearColor.__canvasGradient = clearColorGradientOrPattern;
        } else if (isImagePatternObject(clearColor)) {
          clearColorGradientOrPattern = createCanvasPattern(ctx, clearColor, {
            dirty: function() {
              self.setUnpainted();
              self.__painter.refresh();
            }
          });
        }
        ctx.save();
        ctx.fillStyle = clearColorGradientOrPattern || clearColor;
        ctx.fillRect(x, y, width2, height2);
        ctx.restore();
      }
      if (haveMotionBLur) {
        ctx.save();
        ctx.globalAlpha = lastFrameAlpha;
        ctx.drawImage(domBack, x, y, width2, height2);
        ctx.restore();
      }
    }
    if (!repaintRects || haveMotionBLur) {
      doClear(0, 0, width, height);
    } else if (repaintRects.length) {
      each(repaintRects, function(rect) {
        doClear(rect.x * dpr, rect.y * dpr, rect.width * dpr, rect.height * dpr);
      });
    }
  };
  return Layer2;
}(Eventful);
var Layer$1 = Layer;
var HOVER_LAYER_ZLEVEL = 1e5;
var CANVAS_ZLEVEL = 314159;
var EL_AFTER_INCREMENTAL_INC = 0.01;
var INCREMENTAL_INC = 1e-3;
function parseInt10(val) {
  return parseInt(val, 10);
}
function isLayerValid(layer) {
  if (!layer) {
    return false;
  }
  if (layer.__builtin__) {
    return true;
  }
  if (typeof layer.resize !== "function" || typeof layer.refresh !== "function") {
    return false;
  }
  return true;
}
function createRoot(width, height) {
  var domRoot = document.createElement("div");
  domRoot.style.cssText = ["position:relative", "width:" + width + "px", "height:" + height + "px", "padding:0", "margin:0", "border-width:0"].join(";") + ";";
  return domRoot;
}
var CanvasPainter = function() {
  function CanvasPainter2(root, storage, opts, id) {
    this.type = "canvas";
    this._zlevelList = [];
    this._prevDisplayList = [];
    this._layers = {};
    this._layerConfig = {};
    this._needsManuallyCompositing = false;
    this.type = "canvas";
    var singleCanvas = !root.nodeName || root.nodeName.toUpperCase() === "CANVAS";
    this._opts = opts = extend$1({}, opts || {});
    this.dpr = opts.devicePixelRatio || devicePixelRatio;
    this._singleCanvas = singleCanvas;
    this.root = root;
    var rootStyle = root.style;
    if (rootStyle) {
      rootStyle.webkitTapHighlightColor = "transparent";
      rootStyle.webkitUserSelect = "none";
      rootStyle.userSelect = "none";
      rootStyle["-webkit-touch-callout"] = "none";
      root.innerHTML = "";
    }
    this.storage = storage;
    var zlevelList = this._zlevelList;
    this._prevDisplayList = [];
    var layers = this._layers;
    if (!singleCanvas) {
      this._width = this._getSize(0);
      this._height = this._getSize(1);
      var domRoot = this._domRoot = createRoot(this._width, this._height);
      root.appendChild(domRoot);
    } else {
      var rootCanvas = root;
      var width = rootCanvas.width;
      var height = rootCanvas.height;
      if (opts.width != null) {
        width = opts.width;
      }
      if (opts.height != null) {
        height = opts.height;
      }
      this.dpr = opts.devicePixelRatio || 1;
      rootCanvas.width = width * this.dpr;
      rootCanvas.height = height * this.dpr;
      this._width = width;
      this._height = height;
      var mainLayer = new Layer$1(rootCanvas, this, this.dpr);
      mainLayer.__builtin__ = true;
      mainLayer.initContext();
      layers[CANVAS_ZLEVEL] = mainLayer;
      mainLayer.zlevel = CANVAS_ZLEVEL;
      zlevelList.push(CANVAS_ZLEVEL);
      this._domRoot = root;
    }
  }
  CanvasPainter2.prototype.getType = function() {
    return "canvas";
  };
  CanvasPainter2.prototype.isSingleCanvas = function() {
    return this._singleCanvas;
  };
  CanvasPainter2.prototype.getViewportRoot = function() {
    return this._domRoot;
  };
  CanvasPainter2.prototype.getViewportRootOffset = function() {
    var viewportRoot = this.getViewportRoot();
    if (viewportRoot) {
      return {
        offsetLeft: viewportRoot.offsetLeft || 0,
        offsetTop: viewportRoot.offsetTop || 0
      };
    }
  };
  CanvasPainter2.prototype.refresh = function(paintAll) {
    var list = this.storage.getDisplayList(true);
    var prevList = this._prevDisplayList;
    var zlevelList = this._zlevelList;
    this._redrawId = Math.random();
    this._paintList(list, prevList, paintAll, this._redrawId);
    for (var i = 0; i < zlevelList.length; i++) {
      var z = zlevelList[i];
      var layer = this._layers[z];
      if (!layer.__builtin__ && layer.refresh) {
        var clearColor = i === 0 ? this._backgroundColor : null;
        layer.refresh(clearColor);
      }
    }
    if (this._opts.useDirtyRect) {
      this._prevDisplayList = list.slice();
    }
    return this;
  };
  CanvasPainter2.prototype.refreshHover = function() {
    this._paintHoverList(this.storage.getDisplayList(false));
  };
  CanvasPainter2.prototype._paintHoverList = function(list) {
    var len = list.length;
    var hoverLayer = this._hoverlayer;
    hoverLayer && hoverLayer.clear();
    if (!len) {
      return;
    }
    var scope = {
      inHover: true,
      viewWidth: this._width,
      viewHeight: this._height
    };
    var ctx;
    for (var i = 0; i < len; i++) {
      var el = list[i];
      if (el.__inHover) {
        if (!hoverLayer) {
          hoverLayer = this._hoverlayer = this.getLayer(HOVER_LAYER_ZLEVEL);
        }
        if (!ctx) {
          ctx = hoverLayer.ctx;
          ctx.save();
        }
        brush(ctx, el, scope, i === len - 1);
      }
    }
    if (ctx) {
      ctx.restore();
    }
  };
  CanvasPainter2.prototype.getHoverLayer = function() {
    return this.getLayer(HOVER_LAYER_ZLEVEL);
  };
  CanvasPainter2.prototype.paintOne = function(ctx, el) {
    brushSingle(ctx, el);
  };
  CanvasPainter2.prototype._paintList = function(list, prevList, paintAll, redrawId) {
    if (this._redrawId !== redrawId) {
      return;
    }
    paintAll = paintAll || false;
    this._updateLayerStatus(list);
    var _a = this._doPaintList(list, prevList, paintAll), finished = _a.finished, needsRefreshHover = _a.needsRefreshHover;
    if (this._needsManuallyCompositing) {
      this._compositeManually();
    }
    if (needsRefreshHover) {
      this._paintHoverList(list);
    }
    if (!finished) {
      var self_1 = this;
      requestAnimationFrame(function() {
        self_1._paintList(list, prevList, paintAll, redrawId);
      });
    } else {
      this.eachLayer(function(layer) {
        layer.afterBrush && layer.afterBrush();
      });
    }
  };
  CanvasPainter2.prototype._compositeManually = function() {
    var ctx = this.getLayer(CANVAS_ZLEVEL).ctx;
    var width = this._domRoot.width;
    var height = this._domRoot.height;
    ctx.clearRect(0, 0, width, height);
    this.eachBuiltinLayer(function(layer) {
      if (layer.virtual) {
        ctx.drawImage(layer.dom, 0, 0, width, height);
      }
    });
  };
  CanvasPainter2.prototype._doPaintList = function(list, prevList, paintAll) {
    var _this = this;
    var layerList = [];
    var useDirtyRect = this._opts.useDirtyRect;
    for (var zi = 0; zi < this._zlevelList.length; zi++) {
      var zlevel = this._zlevelList[zi];
      var layer = this._layers[zlevel];
      if (layer.__builtin__ && layer !== this._hoverlayer && (layer.__dirty || paintAll)) {
        layerList.push(layer);
      }
    }
    var finished = true;
    var needsRefreshHover = false;
    var _loop_1 = function(k2) {
      var layer2 = layerList[k2];
      var ctx = layer2.ctx;
      var repaintRects = useDirtyRect && layer2.createRepaintRects(list, prevList, this_1._width, this_1._height);
      var start = paintAll ? layer2.__startIndex : layer2.__drawIndex;
      var useTimer = !paintAll && layer2.incremental && Date.now;
      var startTime = useTimer && Date.now();
      var clearColor = layer2.zlevel === this_1._zlevelList[0] ? this_1._backgroundColor : null;
      if (layer2.__startIndex === layer2.__endIndex) {
        layer2.clear(false, clearColor, repaintRects);
      } else if (start === layer2.__startIndex) {
        var firstEl = list[start];
        if (!firstEl.incremental || !firstEl.notClear || paintAll) {
          layer2.clear(false, clearColor, repaintRects);
        }
      }
      if (start === -1) {
        console.error("For some unknown reason. drawIndex is -1");
        start = layer2.__startIndex;
      }
      var i;
      var repaint = function(repaintRect) {
        var scope = {
          inHover: false,
          allClipped: false,
          prevEl: null,
          viewWidth: _this._width,
          viewHeight: _this._height
        };
        for (i = start; i < layer2.__endIndex; i++) {
          var el = list[i];
          if (el.__inHover) {
            needsRefreshHover = true;
          }
          _this._doPaintEl(el, layer2, useDirtyRect, repaintRect, scope, i === layer2.__endIndex - 1);
          if (useTimer) {
            var dTime = Date.now() - startTime;
            if (dTime > 15) {
              break;
            }
          }
        }
        if (scope.prevElClipPaths) {
          ctx.restore();
        }
      };
      if (repaintRects) {
        if (repaintRects.length === 0) {
          i = layer2.__endIndex;
        } else {
          var dpr = this_1.dpr;
          for (var r = 0; r < repaintRects.length; ++r) {
            var rect = repaintRects[r];
            ctx.save();
            ctx.beginPath();
            ctx.rect(rect.x * dpr, rect.y * dpr, rect.width * dpr, rect.height * dpr);
            ctx.clip();
            repaint(rect);
            ctx.restore();
          }
        }
      } else {
        ctx.save();
        repaint();
        ctx.restore();
      }
      layer2.__drawIndex = i;
      if (layer2.__drawIndex < layer2.__endIndex) {
        finished = false;
      }
    };
    var this_1 = this;
    for (var k = 0; k < layerList.length; k++) {
      _loop_1(k);
    }
    if (env.wxa) {
      each(this._layers, function(layer2) {
        if (layer2 && layer2.ctx && layer2.ctx.draw) {
          layer2.ctx.draw();
        }
      });
    }
    return {
      finished,
      needsRefreshHover
    };
  };
  CanvasPainter2.prototype._doPaintEl = function(el, currentLayer, useDirtyRect, repaintRect, scope, isLast) {
    var ctx = currentLayer.ctx;
    if (useDirtyRect) {
      var paintRect = el.getPaintRect();
      if (!repaintRect || paintRect && paintRect.intersect(repaintRect)) {
        brush(ctx, el, scope, isLast);
        el.setPrevPaintRect(paintRect);
      }
    } else {
      brush(ctx, el, scope, isLast);
    }
  };
  CanvasPainter2.prototype.getLayer = function(zlevel, virtual) {
    if (this._singleCanvas && !this._needsManuallyCompositing) {
      zlevel = CANVAS_ZLEVEL;
    }
    var layer = this._layers[zlevel];
    if (!layer) {
      layer = new Layer$1("zr_" + zlevel, this, this.dpr);
      layer.zlevel = zlevel;
      layer.__builtin__ = true;
      if (this._layerConfig[zlevel]) {
        merge(layer, this._layerConfig[zlevel], true);
      } else if (this._layerConfig[zlevel - EL_AFTER_INCREMENTAL_INC]) {
        merge(layer, this._layerConfig[zlevel - EL_AFTER_INCREMENTAL_INC], true);
      }
      if (virtual) {
        layer.virtual = virtual;
      }
      this.insertLayer(zlevel, layer);
      layer.initContext();
    }
    return layer;
  };
  CanvasPainter2.prototype.insertLayer = function(zlevel, layer) {
    var layersMap = this._layers;
    var zlevelList = this._zlevelList;
    var len = zlevelList.length;
    var domRoot = this._domRoot;
    var prevLayer = null;
    var i = -1;
    if (layersMap[zlevel]) {
      logError("ZLevel " + zlevel + " has been used already");
      return;
    }
    if (!isLayerValid(layer)) {
      logError("Layer of zlevel " + zlevel + " is not valid");
      return;
    }
    if (len > 0 && zlevel > zlevelList[0]) {
      for (i = 0; i < len - 1; i++) {
        if (zlevelList[i] < zlevel && zlevelList[i + 1] > zlevel) {
          break;
        }
      }
      prevLayer = layersMap[zlevelList[i]];
    }
    zlevelList.splice(i + 1, 0, zlevel);
    layersMap[zlevel] = layer;
    if (!layer.virtual) {
      if (prevLayer) {
        var prevDom = prevLayer.dom;
        if (prevDom.nextSibling) {
          domRoot.insertBefore(layer.dom, prevDom.nextSibling);
        } else {
          domRoot.appendChild(layer.dom);
        }
      } else {
        if (domRoot.firstChild) {
          domRoot.insertBefore(layer.dom, domRoot.firstChild);
        } else {
          domRoot.appendChild(layer.dom);
        }
      }
    }
    layer.__painter = this;
  };
  CanvasPainter2.prototype.eachLayer = function(cb, context) {
    var zlevelList = this._zlevelList;
    for (var i = 0; i < zlevelList.length; i++) {
      var z = zlevelList[i];
      cb.call(context, this._layers[z], z);
    }
  };
  CanvasPainter2.prototype.eachBuiltinLayer = function(cb, context) {
    var zlevelList = this._zlevelList;
    for (var i = 0; i < zlevelList.length; i++) {
      var z = zlevelList[i];
      var layer = this._layers[z];
      if (layer.__builtin__) {
        cb.call(context, layer, z);
      }
    }
  };
  CanvasPainter2.prototype.eachOtherLayer = function(cb, context) {
    var zlevelList = this._zlevelList;
    for (var i = 0; i < zlevelList.length; i++) {
      var z = zlevelList[i];
      var layer = this._layers[z];
      if (!layer.__builtin__) {
        cb.call(context, layer, z);
      }
    }
  };
  CanvasPainter2.prototype.getLayers = function() {
    return this._layers;
  };
  CanvasPainter2.prototype._updateLayerStatus = function(list) {
    this.eachBuiltinLayer(function(layer2, z) {
      layer2.__dirty = layer2.__used = false;
    });
    function updatePrevLayer(idx) {
      if (prevLayer) {
        if (prevLayer.__endIndex !== idx) {
          prevLayer.__dirty = true;
        }
        prevLayer.__endIndex = idx;
      }
    }
    if (this._singleCanvas) {
      for (var i_1 = 1; i_1 < list.length; i_1++) {
        var el = list[i_1];
        if (el.zlevel !== list[i_1 - 1].zlevel || el.incremental) {
          this._needsManuallyCompositing = true;
          break;
        }
      }
    }
    var prevLayer = null;
    var incrementalLayerCount = 0;
    var prevZlevel;
    var i;
    for (i = 0; i < list.length; i++) {
      var el = list[i];
      var zlevel = el.zlevel;
      var layer = void 0;
      if (prevZlevel !== zlevel) {
        prevZlevel = zlevel;
        incrementalLayerCount = 0;
      }
      if (el.incremental) {
        layer = this.getLayer(zlevel + INCREMENTAL_INC, this._needsManuallyCompositing);
        layer.incremental = true;
        incrementalLayerCount = 1;
      } else {
        layer = this.getLayer(zlevel + (incrementalLayerCount > 0 ? EL_AFTER_INCREMENTAL_INC : 0), this._needsManuallyCompositing);
      }
      if (!layer.__builtin__) {
        logError("ZLevel " + zlevel + " has been used by unkown layer " + layer.id);
      }
      if (layer !== prevLayer) {
        layer.__used = true;
        if (layer.__startIndex !== i) {
          layer.__dirty = true;
        }
        layer.__startIndex = i;
        if (!layer.incremental) {
          layer.__drawIndex = i;
        } else {
          layer.__drawIndex = -1;
        }
        updatePrevLayer(i);
        prevLayer = layer;
      }
      if (el.__dirty & REDRAW_BIT && !el.__inHover) {
        layer.__dirty = true;
        if (layer.incremental && layer.__drawIndex < 0) {
          layer.__drawIndex = i;
        }
      }
    }
    updatePrevLayer(i);
    this.eachBuiltinLayer(function(layer2, z) {
      if (!layer2.__used && layer2.getElementCount() > 0) {
        layer2.__dirty = true;
        layer2.__startIndex = layer2.__endIndex = layer2.__drawIndex = 0;
      }
      if (layer2.__dirty && layer2.__drawIndex < 0) {
        layer2.__drawIndex = layer2.__startIndex;
      }
    });
  };
  CanvasPainter2.prototype.clear = function() {
    this.eachBuiltinLayer(this._clearLayer);
    return this;
  };
  CanvasPainter2.prototype._clearLayer = function(layer) {
    layer.clear();
  };
  CanvasPainter2.prototype.setBackgroundColor = function(backgroundColor) {
    this._backgroundColor = backgroundColor;
    each(this._layers, function(layer) {
      layer.setUnpainted();
    });
  };
  CanvasPainter2.prototype.configLayer = function(zlevel, config) {
    if (config) {
      var layerConfig = this._layerConfig;
      if (!layerConfig[zlevel]) {
        layerConfig[zlevel] = config;
      } else {
        merge(layerConfig[zlevel], config, true);
      }
      for (var i = 0; i < this._zlevelList.length; i++) {
        var _zlevel = this._zlevelList[i];
        if (_zlevel === zlevel || _zlevel === zlevel + EL_AFTER_INCREMENTAL_INC) {
          var layer = this._layers[_zlevel];
          merge(layer, layerConfig[zlevel], true);
        }
      }
    }
  };
  CanvasPainter2.prototype.delLayer = function(zlevel) {
    var layers = this._layers;
    var zlevelList = this._zlevelList;
    var layer = layers[zlevel];
    if (!layer) {
      return;
    }
    layer.dom.parentNode.removeChild(layer.dom);
    delete layers[zlevel];
    zlevelList.splice(indexOf(zlevelList, zlevel), 1);
  };
  CanvasPainter2.prototype.resize = function(width, height) {
    if (!this._domRoot.style) {
      if (width == null || height == null) {
        return;
      }
      this._width = width;
      this._height = height;
      this.getLayer(CANVAS_ZLEVEL).resize(width, height);
    } else {
      var domRoot = this._domRoot;
      domRoot.style.display = "none";
      var opts = this._opts;
      width != null && (opts.width = width);
      height != null && (opts.height = height);
      width = this._getSize(0);
      height = this._getSize(1);
      domRoot.style.display = "";
      if (this._width !== width || height !== this._height) {
        domRoot.style.width = width + "px";
        domRoot.style.height = height + "px";
        for (var id in this._layers) {
          if (this._layers.hasOwnProperty(id)) {
            this._layers[id].resize(width, height);
          }
        }
        this.refresh(true);
      }
      this._width = width;
      this._height = height;
    }
    return this;
  };
  CanvasPainter2.prototype.clearLayer = function(zlevel) {
    var layer = this._layers[zlevel];
    if (layer) {
      layer.clear();
    }
  };
  CanvasPainter2.prototype.dispose = function() {
    this.root.innerHTML = "";
    this.root = this.storage = this._domRoot = this._layers = null;
  };
  CanvasPainter2.prototype.getRenderedCanvas = function(opts) {
    opts = opts || {};
    if (this._singleCanvas && !this._compositeManually) {
      return this._layers[CANVAS_ZLEVEL].dom;
    }
    var imageLayer = new Layer$1("image", this, opts.pixelRatio || this.dpr);
    imageLayer.initContext();
    imageLayer.clear(false, opts.backgroundColor || this._backgroundColor);
    var ctx = imageLayer.ctx;
    if (opts.pixelRatio <= this.dpr) {
      this.refresh();
      var width_1 = imageLayer.dom.width;
      var height_1 = imageLayer.dom.height;
      this.eachLayer(function(layer) {
        if (layer.__builtin__) {
          ctx.drawImage(layer.dom, 0, 0, width_1, height_1);
        } else if (layer.renderToCanvas) {
          ctx.save();
          layer.renderToCanvas(ctx);
          ctx.restore();
        }
      });
    } else {
      var scope = {
        inHover: false,
        viewWidth: this._width,
        viewHeight: this._height
      };
      var displayList = this.storage.getDisplayList(true);
      for (var i = 0, len = displayList.length; i < len; i++) {
        var el = displayList[i];
        brush(ctx, el, scope, i === len - 1);
      }
    }
    return imageLayer.dom;
  };
  CanvasPainter2.prototype.getWidth = function() {
    return this._width;
  };
  CanvasPainter2.prototype.getHeight = function() {
    return this._height;
  };
  CanvasPainter2.prototype._getSize = function(whIdx) {
    var opts = this._opts;
    var wh = ["width", "height"][whIdx];
    var cwh = ["clientWidth", "clientHeight"][whIdx];
    var plt = ["paddingLeft", "paddingTop"][whIdx];
    var prb = ["paddingRight", "paddingBottom"][whIdx];
    if (opts[wh] != null && opts[wh] !== "auto") {
      return parseFloat(opts[wh]);
    }
    var root = this.root;
    var stl = document.defaultView.getComputedStyle(root);
    return (root[cwh] || parseInt10(stl[wh]) || parseInt10(root.style[wh])) - (parseInt10(stl[plt]) || 0) - (parseInt10(stl[prb]) || 0) | 0;
  };
  CanvasPainter2.prototype.pathToImage = function(path, dpr) {
    dpr = dpr || this.dpr;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var rect = path.getBoundingRect();
    var style = path.style;
    var shadowBlurSize = style.shadowBlur * dpr;
    var shadowOffsetX = style.shadowOffsetX * dpr;
    var shadowOffsetY = style.shadowOffsetY * dpr;
    var lineWidth = path.hasStroke() ? style.lineWidth : 0;
    var leftMargin = Math.max(lineWidth / 2, -shadowOffsetX + shadowBlurSize);
    var rightMargin = Math.max(lineWidth / 2, shadowOffsetX + shadowBlurSize);
    var topMargin = Math.max(lineWidth / 2, -shadowOffsetY + shadowBlurSize);
    var bottomMargin = Math.max(lineWidth / 2, shadowOffsetY + shadowBlurSize);
    var width = rect.width + leftMargin + rightMargin;
    var height = rect.height + topMargin + bottomMargin;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    ctx.dpr = dpr;
    var pathTransform = {
      x: path.x,
      y: path.y,
      scaleX: path.scaleX,
      scaleY: path.scaleY,
      rotation: path.rotation,
      originX: path.originX,
      originY: path.originY
    };
    path.x = leftMargin - rect.x;
    path.y = topMargin - rect.y;
    path.rotation = 0;
    path.scaleX = 1;
    path.scaleY = 1;
    path.updateTransform();
    if (path) {
      brush(ctx, path, {
        inHover: false,
        viewWidth: this._width,
        viewHeight: this._height
      }, true);
    }
    var imgShape = new ZRImage({
      style: {
        x: 0,
        y: 0,
        image: canvas
      }
    });
    extend$1(path, pathTransform);
    return imgShape;
  };
  return CanvasPainter2;
}();
var CanvasPainter$1 = CanvasPainter;
function install$4(registers) {
  registers.registerPainter("canvas", CanvasPainter$1);
}
var DatasetModel = function(_super) {
  __extends(DatasetModel2, _super);
  function DatasetModel2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.type = "dataset";
    return _this;
  }
  DatasetModel2.prototype.init = function(option, parentModel, ecModel) {
    _super.prototype.init.call(this, option, parentModel, ecModel);
    this._sourceManager = new SourceManager(this);
    disableTransformOptionMerge(this);
  };
  DatasetModel2.prototype.mergeOption = function(newOption, ecModel) {
    _super.prototype.mergeOption.call(this, newOption, ecModel);
    disableTransformOptionMerge(this);
  };
  DatasetModel2.prototype.optionUpdated = function() {
    this._sourceManager.dirty();
  };
  DatasetModel2.prototype.getSourceManager = function() {
    return this._sourceManager;
  };
  DatasetModel2.type = "dataset";
  DatasetModel2.defaultOption = {
    seriesLayoutBy: SERIES_LAYOUT_BY_COLUMN
  };
  return DatasetModel2;
}(ComponentModel);
var DatasetView = function(_super) {
  __extends(DatasetView2, _super);
  function DatasetView2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.type = "dataset";
    return _this;
  }
  DatasetView2.type = "dataset";
  return DatasetView2;
}(ComponentView);
function install$3(registers) {
  registers.registerComponentModel(DatasetModel);
  registers.registerComponentView(DatasetView);
}
use([install$4, install$3]);
use(installLabelLayout);
function derive(makeDefaultOpt, initialize, proto) {
  if (typeof initialize == "object") {
    proto = initialize;
    initialize = null;
  }
  var _super = this;
  var propList;
  if (!(makeDefaultOpt instanceof Function)) {
    propList = [];
    for (var propName in makeDefaultOpt) {
      if (makeDefaultOpt.hasOwnProperty(propName)) {
        propList.push(propName);
      }
    }
  }
  var sub2 = function(options) {
    _super.apply(this, arguments);
    if (makeDefaultOpt instanceof Function) {
      extend(this, makeDefaultOpt.call(this, options));
    } else {
      extendWithPropList(this, makeDefaultOpt, propList);
    }
    if (this.constructor === sub2) {
      var initializers = sub2.__initializers__;
      for (var i = 0; i < initializers.length; i++) {
        initializers[i].apply(this, arguments);
      }
    }
  };
  sub2.__super__ = _super;
  if (!_super.__initializers__) {
    sub2.__initializers__ = [];
  } else {
    sub2.__initializers__ = _super.__initializers__.slice();
  }
  if (initialize) {
    sub2.__initializers__.push(initialize);
  }
  var Ctor = function() {
  };
  Ctor.prototype = _super.prototype;
  sub2.prototype = new Ctor();
  sub2.prototype.constructor = sub2;
  extend(sub2.prototype, proto);
  sub2.extend = _super.extend;
  sub2.derive = _super.extend;
  return sub2;
}
function extend(target, source) {
  if (!source) {
    return;
  }
  for (var name in source) {
    if (source.hasOwnProperty(name)) {
      target[name] = source[name];
    }
  }
}
function extendWithPropList(target, source, propList) {
  for (var i = 0; i < propList.length; i++) {
    var propName = propList[i];
    target[propName] = source[propName];
  }
}
var extendMixin = {
  extend: derive,
  derive
};
function Handler(action, context) {
  this.action = action;
  this.context = context;
}
var notifier = {
  trigger: function(name) {
    if (!this.hasOwnProperty("__handlers__")) {
      return;
    }
    if (!this.__handlers__.hasOwnProperty(name)) {
      return;
    }
    var hdls = this.__handlers__[name];
    var l = hdls.length, i = -1, args = arguments;
    switch (args.length) {
      case 1:
        while (++i < l) {
          hdls[i].action.call(hdls[i].context);
        }
        return;
      case 2:
        while (++i < l) {
          hdls[i].action.call(hdls[i].context, args[1]);
        }
        return;
      case 3:
        while (++i < l) {
          hdls[i].action.call(hdls[i].context, args[1], args[2]);
        }
        return;
      case 4:
        while (++i < l) {
          hdls[i].action.call(hdls[i].context, args[1], args[2], args[3]);
        }
        return;
      case 5:
        while (++i < l) {
          hdls[i].action.call(hdls[i].context, args[1], args[2], args[3], args[4]);
        }
        return;
      default:
        while (++i < l) {
          hdls[i].action.apply(hdls[i].context, Array.prototype.slice.call(args, 1));
        }
        return;
    }
  },
  on: function(name, action, context) {
    if (!name || !action) {
      return;
    }
    var handlers = this.__handlers__ || (this.__handlers__ = {});
    if (!handlers[name]) {
      handlers[name] = [];
    } else {
      if (this.has(name, action)) {
        return;
      }
    }
    var handler = new Handler(action, context || this);
    handlers[name].push(handler);
    return this;
  },
  once: function(name, action, context) {
    if (!name || !action) {
      return;
    }
    var self = this;
    function wrapper() {
      self.off(name, wrapper);
      action.apply(this, arguments);
    }
    return this.on(name, wrapper, context);
  },
  before: function(name, action, context) {
    if (!name || !action) {
      return;
    }
    name = "before" + name;
    return this.on(name, action, context);
  },
  after: function(name, action, context) {
    if (!name || !action) {
      return;
    }
    name = "after" + name;
    return this.on(name, action, context);
  },
  success: function(action, context) {
    return this.once("success", action, context);
  },
  error: function(action, context) {
    return this.once("error", action, context);
  },
  off: function(name, action) {
    var handlers = this.__handlers__ || (this.__handlers__ = {});
    if (!action) {
      handlers[name] = [];
      return;
    }
    if (handlers[name]) {
      var hdls = handlers[name];
      var retains = [];
      for (var i = 0; i < hdls.length; i++) {
        if (action && hdls[i].action !== action) {
          retains.push(hdls[i]);
        }
      }
      handlers[name] = retains;
    }
    return this;
  },
  has: function(name, action) {
    var handlers = this.__handlers__;
    if (!handlers || !handlers[name]) {
      return false;
    }
    var hdls = handlers[name];
    for (var i = 0; i < hdls.length; i++) {
      if (hdls[i].action === action) {
        return true;
      }
    }
  }
};
var notifier$1 = notifier;
var guid = 0;
var ArrayProto = Array.prototype;
var nativeForEach = ArrayProto.forEach;
var util = {
  genGUID: function() {
    return ++guid;
  },
  relative2absolute: function(path, basePath) {
    if (!basePath || path.match(/^\//)) {
      return path;
    }
    var pathParts = path.split("/");
    var basePathParts = basePath.split("/");
    var item = pathParts[0];
    while (item === "." || item === "..") {
      if (item === "..") {
        basePathParts.pop();
      }
      pathParts.shift();
      item = pathParts[0];
    }
    return basePathParts.join("/") + "/" + pathParts.join("/");
  },
  extend: function(target, source) {
    if (source) {
      for (var name in source) {
        if (source.hasOwnProperty(name)) {
          target[name] = source[name];
        }
      }
    }
    return target;
  },
  defaults: function(target, source) {
    if (source) {
      for (var propName in source) {
        if (target[propName] === void 0) {
          target[propName] = source[propName];
        }
      }
    }
    return target;
  },
  extendWithPropList: function(target, source, propList) {
    if (source) {
      for (var i = 0; i < propList.length; i++) {
        var propName = propList[i];
        target[propName] = source[propName];
      }
    }
    return target;
  },
  defaultsWithPropList: function(target, source, propList) {
    if (source) {
      for (var i = 0; i < propList.length; i++) {
        var propName = propList[i];
        if (target[propName] == null) {
          target[propName] = source[propName];
        }
      }
    }
    return target;
  },
  each: function(obj, iterator, context) {
    if (!(obj && iterator)) {
      return;
    }
    if (obj.forEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, len = obj.length; i < len; i++) {
        iterator.call(context, obj[i], i, obj);
      }
    } else {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    }
  },
  isObject: function(obj) {
    return obj === Object(obj);
  },
  isArray: function(obj) {
    return Array.isArray(obj);
  },
  isArrayLike: function(obj) {
    if (!obj) {
      return false;
    } else {
      return obj.length === +obj.length;
    }
  },
  clone: function(obj) {
    if (!util.isObject(obj)) {
      return obj;
    } else if (util.isArray(obj)) {
      return obj.slice();
    } else if (util.isArrayLike(obj)) {
      var ret2 = new obj.constructor(obj.length);
      for (var i = 0; i < obj.length; i++) {
        ret2[i] = obj[i];
      }
      return ret2;
    } else {
      return util.extend({}, obj);
    }
  }
};
var util$1 = util;
var Base = function() {
  this.__uid__ = util$1.genGUID();
};
Base.__initializers__ = [function(opts) {
  util$1.extend(this, opts);
}];
util$1.extend(Base, extendMixin);
util$1.extend(Base.prototype, notifier$1);
var Base$1 = Base;
var EXTENSION_LIST = ["OES_texture_float", "OES_texture_half_float", "OES_texture_float_linear", "OES_texture_half_float_linear", "OES_standard_derivatives", "OES_vertex_array_object", "OES_element_index_uint", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture", "EXT_texture_filter_anisotropic", "EXT_shader_texture_lod", "WEBGL_draw_buffers", "EXT_frag_depth", "EXT_sRGB", "ANGLE_instanced_arrays"];
var PARAMETER_NAMES = ["MAX_TEXTURE_SIZE", "MAX_CUBE_MAP_TEXTURE_SIZE"];
function GLInfo(_gl) {
  var extensions2 = {};
  var parameters = {};
  for (var i = 0; i < EXTENSION_LIST.length; i++) {
    var extName = EXTENSION_LIST[i];
    createExtension(extName);
  }
  for (var i = 0; i < PARAMETER_NAMES.length; i++) {
    var name = PARAMETER_NAMES[i];
    parameters[name] = _gl.getParameter(_gl[name]);
  }
  this.getExtension = function(name2) {
    if (!(name2 in extensions2)) {
      createExtension(name2);
    }
    return extensions2[name2];
  };
  this.getParameter = function(name2) {
    return parameters[name2];
  };
  function createExtension(name2) {
    if (_gl.getExtension) {
      var ext = _gl.getExtension(name2);
      if (!ext) {
        ext = _gl.getExtension("MOZ_" + name2);
      }
      if (!ext) {
        ext = _gl.getExtension("WEBKIT_" + name2);
      }
      extensions2[name2] = ext;
    }
  }
}
var glenum = {
  DEPTH_BUFFER_BIT: 256,
  STENCIL_BUFFER_BIT: 1024,
  COLOR_BUFFER_BIT: 16384,
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6,
  ZERO: 0,
  ONE: 1,
  SRC_COLOR: 768,
  ONE_MINUS_SRC_COLOR: 769,
  SRC_ALPHA: 770,
  ONE_MINUS_SRC_ALPHA: 771,
  DST_ALPHA: 772,
  ONE_MINUS_DST_ALPHA: 773,
  DST_COLOR: 774,
  ONE_MINUS_DST_COLOR: 775,
  SRC_ALPHA_SATURATE: 776,
  FUNC_ADD: 32774,
  BLEND_EQUATION: 32777,
  BLEND_EQUATION_RGB: 32777,
  BLEND_EQUATION_ALPHA: 34877,
  FUNC_SUBTRACT: 32778,
  FUNC_REVERSE_SUBTRACT: 32779,
  BLEND_DST_RGB: 32968,
  BLEND_SRC_RGB: 32969,
  BLEND_DST_ALPHA: 32970,
  BLEND_SRC_ALPHA: 32971,
  CONSTANT_COLOR: 32769,
  ONE_MINUS_CONSTANT_COLOR: 32770,
  CONSTANT_ALPHA: 32771,
  ONE_MINUS_CONSTANT_ALPHA: 32772,
  BLEND_COLOR: 32773,
  ARRAY_BUFFER: 34962,
  ELEMENT_ARRAY_BUFFER: 34963,
  ARRAY_BUFFER_BINDING: 34964,
  ELEMENT_ARRAY_BUFFER_BINDING: 34965,
  STREAM_DRAW: 35040,
  STATIC_DRAW: 35044,
  DYNAMIC_DRAW: 35048,
  BUFFER_SIZE: 34660,
  BUFFER_USAGE: 34661,
  CURRENT_VERTEX_ATTRIB: 34342,
  FRONT: 1028,
  BACK: 1029,
  FRONT_AND_BACK: 1032,
  CULL_FACE: 2884,
  BLEND: 3042,
  DITHER: 3024,
  STENCIL_TEST: 2960,
  DEPTH_TEST: 2929,
  SCISSOR_TEST: 3089,
  POLYGON_OFFSET_FILL: 32823,
  SAMPLE_ALPHA_TO_COVERAGE: 32926,
  SAMPLE_COVERAGE: 32928,
  NO_ERROR: 0,
  INVALID_ENUM: 1280,
  INVALID_VALUE: 1281,
  INVALID_OPERATION: 1282,
  OUT_OF_MEMORY: 1285,
  CW: 2304,
  CCW: 2305,
  LINE_WIDTH: 2849,
  ALIASED_POINT_SIZE_RANGE: 33901,
  ALIASED_LINE_WIDTH_RANGE: 33902,
  CULL_FACE_MODE: 2885,
  FRONT_FACE: 2886,
  DEPTH_RANGE: 2928,
  DEPTH_WRITEMASK: 2930,
  DEPTH_CLEAR_VALUE: 2931,
  DEPTH_FUNC: 2932,
  STENCIL_CLEAR_VALUE: 2961,
  STENCIL_FUNC: 2962,
  STENCIL_FAIL: 2964,
  STENCIL_PASS_DEPTH_FAIL: 2965,
  STENCIL_PASS_DEPTH_PASS: 2966,
  STENCIL_REF: 2967,
  STENCIL_VALUE_MASK: 2963,
  STENCIL_WRITEMASK: 2968,
  STENCIL_BACK_FUNC: 34816,
  STENCIL_BACK_FAIL: 34817,
  STENCIL_BACK_PASS_DEPTH_FAIL: 34818,
  STENCIL_BACK_PASS_DEPTH_PASS: 34819,
  STENCIL_BACK_REF: 36003,
  STENCIL_BACK_VALUE_MASK: 36004,
  STENCIL_BACK_WRITEMASK: 36005,
  VIEWPORT: 2978,
  SCISSOR_BOX: 3088,
  COLOR_CLEAR_VALUE: 3106,
  COLOR_WRITEMASK: 3107,
  UNPACK_ALIGNMENT: 3317,
  PACK_ALIGNMENT: 3333,
  MAX_TEXTURE_SIZE: 3379,
  MAX_VIEWPORT_DIMS: 3386,
  SUBPIXEL_BITS: 3408,
  RED_BITS: 3410,
  GREEN_BITS: 3411,
  BLUE_BITS: 3412,
  ALPHA_BITS: 3413,
  DEPTH_BITS: 3414,
  STENCIL_BITS: 3415,
  POLYGON_OFFSET_UNITS: 10752,
  POLYGON_OFFSET_FACTOR: 32824,
  TEXTURE_BINDING_2D: 32873,
  SAMPLE_BUFFERS: 32936,
  SAMPLES: 32937,
  SAMPLE_COVERAGE_VALUE: 32938,
  SAMPLE_COVERAGE_INVERT: 32939,
  COMPRESSED_TEXTURE_FORMATS: 34467,
  DONT_CARE: 4352,
  FASTEST: 4353,
  NICEST: 4354,
  GENERATE_MIPMAP_HINT: 33170,
  BYTE: 5120,
  UNSIGNED_BYTE: 5121,
  SHORT: 5122,
  UNSIGNED_SHORT: 5123,
  INT: 5124,
  UNSIGNED_INT: 5125,
  FLOAT: 5126,
  DEPTH_COMPONENT: 6402,
  ALPHA: 6406,
  RGB: 6407,
  RGBA: 6408,
  LUMINANCE: 6409,
  LUMINANCE_ALPHA: 6410,
  UNSIGNED_SHORT_4_4_4_4: 32819,
  UNSIGNED_SHORT_5_5_5_1: 32820,
  UNSIGNED_SHORT_5_6_5: 33635,
  FRAGMENT_SHADER: 35632,
  VERTEX_SHADER: 35633,
  MAX_VERTEX_ATTRIBS: 34921,
  MAX_VERTEX_UNIFORM_VECTORS: 36347,
  MAX_VARYING_VECTORS: 36348,
  MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
  MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
  MAX_TEXTURE_IMAGE_UNITS: 34930,
  MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
  SHADER_TYPE: 35663,
  DELETE_STATUS: 35712,
  LINK_STATUS: 35714,
  VALIDATE_STATUS: 35715,
  ATTACHED_SHADERS: 35717,
  ACTIVE_UNIFORMS: 35718,
  ACTIVE_ATTRIBUTES: 35721,
  SHADING_LANGUAGE_VERSION: 35724,
  CURRENT_PROGRAM: 35725,
  NEVER: 512,
  LESS: 513,
  EQUAL: 514,
  LEQUAL: 515,
  GREATER: 516,
  NOTEQUAL: 517,
  GEQUAL: 518,
  ALWAYS: 519,
  KEEP: 7680,
  REPLACE: 7681,
  INCR: 7682,
  DECR: 7683,
  INVERT: 5386,
  INCR_WRAP: 34055,
  DECR_WRAP: 34056,
  VENDOR: 7936,
  RENDERER: 7937,
  VERSION: 7938,
  NEAREST: 9728,
  LINEAR: 9729,
  NEAREST_MIPMAP_NEAREST: 9984,
  LINEAR_MIPMAP_NEAREST: 9985,
  NEAREST_MIPMAP_LINEAR: 9986,
  LINEAR_MIPMAP_LINEAR: 9987,
  TEXTURE_MAG_FILTER: 10240,
  TEXTURE_MIN_FILTER: 10241,
  TEXTURE_WRAP_S: 10242,
  TEXTURE_WRAP_T: 10243,
  TEXTURE_2D: 3553,
  TEXTURE: 5890,
  TEXTURE_CUBE_MAP: 34067,
  TEXTURE_BINDING_CUBE_MAP: 34068,
  TEXTURE_CUBE_MAP_POSITIVE_X: 34069,
  TEXTURE_CUBE_MAP_NEGATIVE_X: 34070,
  TEXTURE_CUBE_MAP_POSITIVE_Y: 34071,
  TEXTURE_CUBE_MAP_NEGATIVE_Y: 34072,
  TEXTURE_CUBE_MAP_POSITIVE_Z: 34073,
  TEXTURE_CUBE_MAP_NEGATIVE_Z: 34074,
  MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
  TEXTURE0: 33984,
  TEXTURE1: 33985,
  TEXTURE2: 33986,
  TEXTURE3: 33987,
  TEXTURE4: 33988,
  TEXTURE5: 33989,
  TEXTURE6: 33990,
  TEXTURE7: 33991,
  TEXTURE8: 33992,
  TEXTURE9: 33993,
  TEXTURE10: 33994,
  TEXTURE11: 33995,
  TEXTURE12: 33996,
  TEXTURE13: 33997,
  TEXTURE14: 33998,
  TEXTURE15: 33999,
  TEXTURE16: 34e3,
  TEXTURE17: 34001,
  TEXTURE18: 34002,
  TEXTURE19: 34003,
  TEXTURE20: 34004,
  TEXTURE21: 34005,
  TEXTURE22: 34006,
  TEXTURE23: 34007,
  TEXTURE24: 34008,
  TEXTURE25: 34009,
  TEXTURE26: 34010,
  TEXTURE27: 34011,
  TEXTURE28: 34012,
  TEXTURE29: 34013,
  TEXTURE30: 34014,
  TEXTURE31: 34015,
  ACTIVE_TEXTURE: 34016,
  REPEAT: 10497,
  CLAMP_TO_EDGE: 33071,
  MIRRORED_REPEAT: 33648,
  FLOAT_VEC2: 35664,
  FLOAT_VEC3: 35665,
  FLOAT_VEC4: 35666,
  INT_VEC2: 35667,
  INT_VEC3: 35668,
  INT_VEC4: 35669,
  BOOL: 35670,
  BOOL_VEC2: 35671,
  BOOL_VEC3: 35672,
  BOOL_VEC4: 35673,
  FLOAT_MAT2: 35674,
  FLOAT_MAT3: 35675,
  FLOAT_MAT4: 35676,
  SAMPLER_2D: 35678,
  SAMPLER_CUBE: 35680,
  VERTEX_ATTRIB_ARRAY_ENABLED: 34338,
  VERTEX_ATTRIB_ARRAY_SIZE: 34339,
  VERTEX_ATTRIB_ARRAY_STRIDE: 34340,
  VERTEX_ATTRIB_ARRAY_TYPE: 34341,
  VERTEX_ATTRIB_ARRAY_NORMALIZED: 34922,
  VERTEX_ATTRIB_ARRAY_POINTER: 34373,
  VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 34975,
  COMPILE_STATUS: 35713,
  LOW_FLOAT: 36336,
  MEDIUM_FLOAT: 36337,
  HIGH_FLOAT: 36338,
  LOW_INT: 36339,
  MEDIUM_INT: 36340,
  HIGH_INT: 36341,
  FRAMEBUFFER: 36160,
  RENDERBUFFER: 36161,
  RGBA4: 32854,
  RGB5_A1: 32855,
  RGB565: 36194,
  DEPTH_COMPONENT16: 33189,
  STENCIL_INDEX: 6401,
  STENCIL_INDEX8: 36168,
  DEPTH_STENCIL: 34041,
  RENDERBUFFER_WIDTH: 36162,
  RENDERBUFFER_HEIGHT: 36163,
  RENDERBUFFER_INTERNAL_FORMAT: 36164,
  RENDERBUFFER_RED_SIZE: 36176,
  RENDERBUFFER_GREEN_SIZE: 36177,
  RENDERBUFFER_BLUE_SIZE: 36178,
  RENDERBUFFER_ALPHA_SIZE: 36179,
  RENDERBUFFER_DEPTH_SIZE: 36180,
  RENDERBUFFER_STENCIL_SIZE: 36181,
  FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 36048,
  FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 36049,
  FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 36050,
  FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 36051,
  COLOR_ATTACHMENT0: 36064,
  DEPTH_ATTACHMENT: 36096,
  STENCIL_ATTACHMENT: 36128,
  DEPTH_STENCIL_ATTACHMENT: 33306,
  NONE: 0,
  FRAMEBUFFER_COMPLETE: 36053,
  FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 36054,
  FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 36055,
  FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 36057,
  FRAMEBUFFER_UNSUPPORTED: 36061,
  FRAMEBUFFER_BINDING: 36006,
  RENDERBUFFER_BINDING: 36007,
  MAX_RENDERBUFFER_SIZE: 34024,
  INVALID_FRAMEBUFFER_OPERATION: 1286,
  UNPACK_FLIP_Y_WEBGL: 37440,
  UNPACK_PREMULTIPLY_ALPHA_WEBGL: 37441,
  CONTEXT_LOST_WEBGL: 37442,
  UNPACK_COLORSPACE_CONVERSION_WEBGL: 37443,
  BROWSER_DEFAULT_WEBGL: 37444
};
function get(options) {
  var xhr = new XMLHttpRequest();
  xhr.open("get", options.url);
  xhr.responseType = options.responseType || "text";
  if (options.onprogress) {
    xhr.onprogress = function(e2) {
      if (e2.lengthComputable) {
        var percent = e2.loaded / e2.total;
        options.onprogress(percent, e2.loaded, e2.total);
      } else {
        options.onprogress(null);
      }
    };
  }
  xhr.onload = function(e2) {
    if (xhr.status >= 400) {
      options.onerror && options.onerror();
    } else {
      options.onload && options.onload(xhr.response);
    }
  };
  if (options.onerror) {
    xhr.onerror = options.onerror;
  }
  xhr.send(null);
}
var request = {
  get
};
var supportWebGL;
var vendor = {};
vendor.supportWebGL = function() {
  if (supportWebGL == null) {
    try {
      var canvas = document.createElement("canvas");
      var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        throw new Error();
      }
    } catch (e2) {
      supportWebGL = false;
    }
  }
  return supportWebGL;
};
vendor.Int8Array = typeof Int8Array === "undefined" ? Array : Int8Array;
vendor.Uint8Array = typeof Uint8Array === "undefined" ? Array : Uint8Array;
vendor.Uint16Array = typeof Uint16Array === "undefined" ? Array : Uint16Array;
vendor.Uint32Array = typeof Uint32Array === "undefined" ? Array : Uint32Array;
vendor.Int16Array = typeof Int16Array === "undefined" ? Array : Int16Array;
vendor.Float32Array = typeof Float32Array === "undefined" ? Array : Float32Array;
vendor.Float64Array = typeof Float64Array === "undefined" ? Array : Float64Array;
var g = {};
if (typeof window !== "undefined") {
  g = window;
} else if (typeof global !== "undefined") {
  g = global;
}
vendor.requestAnimationFrame = g.requestAnimationFrame || g.msRequestAnimationFrame || g.mozRequestAnimationFrame || g.webkitRequestAnimationFrame || function(func) {
  setTimeout(func, 16);
};
vendor.createCanvas = function() {
  return document.createElement("canvas");
};
vendor.createImage = function() {
  return new g.Image();
};
vendor.request = {
  get: request.get
};
vendor.addEventListener = function(dom, type, func, useCapture) {
  dom.addEventListener(type, func, useCapture);
};
vendor.removeEventListener = function(dom, type, func) {
  dom.removeEventListener(type, func);
};
var vendor$1 = vendor;
var LinkedList = function() {
  this.head = null;
  this.tail = null;
  this._length = 0;
};
LinkedList.prototype.insert = function(val) {
  var entry = new LinkedList.Entry(val);
  this.insertEntry(entry);
  return entry;
};
LinkedList.prototype.insertAt = function(idx, val) {
  if (idx < 0) {
    return;
  }
  var next = this.head;
  var cursor = 0;
  while (next && cursor != idx) {
    next = next.next;
    cursor++;
  }
  if (next) {
    var entry = new LinkedList.Entry(val);
    var prev = next.prev;
    if (!prev) {
      this.head = entry;
    } else {
      prev.next = entry;
      entry.prev = prev;
    }
    entry.next = next;
    next.prev = entry;
  } else {
    this.insert(val);
  }
};
LinkedList.prototype.insertBeforeEntry = function(val, next) {
  var entry = new LinkedList.Entry(val);
  var prev = next.prev;
  if (!prev) {
    this.head = entry;
  } else {
    prev.next = entry;
    entry.prev = prev;
  }
  entry.next = next;
  next.prev = entry;
  this._length++;
};
LinkedList.prototype.insertEntry = function(entry) {
  if (!this.head) {
    this.head = this.tail = entry;
  } else {
    this.tail.next = entry;
    entry.prev = this.tail;
    this.tail = entry;
  }
  this._length++;
};
LinkedList.prototype.remove = function(entry) {
  var prev = entry.prev;
  var next = entry.next;
  if (prev) {
    prev.next = next;
  } else {
    this.head = next;
  }
  if (next) {
    next.prev = prev;
  } else {
    this.tail = prev;
  }
  entry.next = entry.prev = null;
  this._length--;
};
LinkedList.prototype.removeAt = function(idx) {
  if (idx < 0) {
    return;
  }
  var curr = this.head;
  var cursor = 0;
  while (curr && cursor != idx) {
    curr = curr.next;
    cursor++;
  }
  if (curr) {
    this.remove(curr);
    return curr.value;
  }
};
LinkedList.prototype.getHead = function() {
  if (this.head) {
    return this.head.value;
  }
};
LinkedList.prototype.getTail = function() {
  if (this.tail) {
    return this.tail.value;
  }
};
LinkedList.prototype.getAt = function(idx) {
  if (idx < 0) {
    return;
  }
  var curr = this.head;
  var cursor = 0;
  while (curr && cursor != idx) {
    curr = curr.next;
    cursor++;
  }
  return curr.value;
};
LinkedList.prototype.indexOf = function(value) {
  var curr = this.head;
  var cursor = 0;
  while (curr) {
    if (curr.value === value) {
      return cursor;
    }
    curr = curr.next;
    cursor++;
  }
};
LinkedList.prototype.length = function() {
  return this._length;
};
LinkedList.prototype.isEmpty = function() {
  return this._length === 0;
};
LinkedList.prototype.forEach = function(cb, context) {
  var curr = this.head;
  var idx = 0;
  var haveContext = typeof context != "undefined";
  while (curr) {
    if (haveContext) {
      cb.call(context, curr.value, idx);
    } else {
      cb(curr.value, idx);
    }
    curr = curr.next;
    idx++;
  }
};
LinkedList.prototype.clear = function() {
  this.tail = this.head = null;
  this._length = 0;
};
LinkedList.Entry = function(val) {
  this.value = val;
  this.next = null;
  this.prev = null;
};
var LinkedList$1 = LinkedList;
var LRU = function(maxSize) {
  this._list = new LinkedList$1();
  this._map = {};
  this._maxSize = maxSize || 10;
};
LRU.prototype.setMaxSize = function(size) {
  this._maxSize = size;
};
LRU.prototype.put = function(key, value) {
  if (!this._map.hasOwnProperty(key)) {
    var len = this._list.length();
    if (len >= this._maxSize && len > 0) {
      var leastUsedEntry = this._list.head;
      this._list.remove(leastUsedEntry);
      delete this._map[leastUsedEntry.key];
    }
    var entry = this._list.insert(value);
    entry.key = key;
    this._map[key] = entry;
  }
};
LRU.prototype.get = function(key) {
  var entry = this._map[key];
  if (this._map.hasOwnProperty(key)) {
    if (entry !== this._list.tail) {
      this._list.remove(entry);
      this._list.insertEntry(entry);
    }
    return entry.value;
  }
};
LRU.prototype.remove = function(key) {
  var entry = this._map[key];
  if (typeof entry !== "undefined") {
    delete this._map[key];
    this._list.remove(entry);
  }
};
LRU.prototype.clear = function() {
  this._list.clear();
  this._map = {};
};
var LRUCache = LRU;
var colorUtil = {};
var kCSSColorTable = {
  "transparent": [0, 0, 0, 0],
  "aliceblue": [240, 248, 255, 1],
  "antiquewhite": [250, 235, 215, 1],
  "aqua": [0, 255, 255, 1],
  "aquamarine": [127, 255, 212, 1],
  "azure": [240, 255, 255, 1],
  "beige": [245, 245, 220, 1],
  "bisque": [255, 228, 196, 1],
  "black": [0, 0, 0, 1],
  "blanchedalmond": [255, 235, 205, 1],
  "blue": [0, 0, 255, 1],
  "blueviolet": [138, 43, 226, 1],
  "brown": [165, 42, 42, 1],
  "burlywood": [222, 184, 135, 1],
  "cadetblue": [95, 158, 160, 1],
  "chartreuse": [127, 255, 0, 1],
  "chocolate": [210, 105, 30, 1],
  "coral": [255, 127, 80, 1],
  "cornflowerblue": [100, 149, 237, 1],
  "cornsilk": [255, 248, 220, 1],
  "crimson": [220, 20, 60, 1],
  "cyan": [0, 255, 255, 1],
  "darkblue": [0, 0, 139, 1],
  "darkcyan": [0, 139, 139, 1],
  "darkgoldenrod": [184, 134, 11, 1],
  "darkgray": [169, 169, 169, 1],
  "darkgreen": [0, 100, 0, 1],
  "darkgrey": [169, 169, 169, 1],
  "darkkhaki": [189, 183, 107, 1],
  "darkmagenta": [139, 0, 139, 1],
  "darkolivegreen": [85, 107, 47, 1],
  "darkorange": [255, 140, 0, 1],
  "darkorchid": [153, 50, 204, 1],
  "darkred": [139, 0, 0, 1],
  "darksalmon": [233, 150, 122, 1],
  "darkseagreen": [143, 188, 143, 1],
  "darkslateblue": [72, 61, 139, 1],
  "darkslategray": [47, 79, 79, 1],
  "darkslategrey": [47, 79, 79, 1],
  "darkturquoise": [0, 206, 209, 1],
  "darkviolet": [148, 0, 211, 1],
  "deeppink": [255, 20, 147, 1],
  "deepskyblue": [0, 191, 255, 1],
  "dimgray": [105, 105, 105, 1],
  "dimgrey": [105, 105, 105, 1],
  "dodgerblue": [30, 144, 255, 1],
  "firebrick": [178, 34, 34, 1],
  "floralwhite": [255, 250, 240, 1],
  "forestgreen": [34, 139, 34, 1],
  "fuchsia": [255, 0, 255, 1],
  "gainsboro": [220, 220, 220, 1],
  "ghostwhite": [248, 248, 255, 1],
  "gold": [255, 215, 0, 1],
  "goldenrod": [218, 165, 32, 1],
  "gray": [128, 128, 128, 1],
  "green": [0, 128, 0, 1],
  "greenyellow": [173, 255, 47, 1],
  "grey": [128, 128, 128, 1],
  "honeydew": [240, 255, 240, 1],
  "hotpink": [255, 105, 180, 1],
  "indianred": [205, 92, 92, 1],
  "indigo": [75, 0, 130, 1],
  "ivory": [255, 255, 240, 1],
  "khaki": [240, 230, 140, 1],
  "lavender": [230, 230, 250, 1],
  "lavenderblush": [255, 240, 245, 1],
  "lawngreen": [124, 252, 0, 1],
  "lemonchiffon": [255, 250, 205, 1],
  "lightblue": [173, 216, 230, 1],
  "lightcoral": [240, 128, 128, 1],
  "lightcyan": [224, 255, 255, 1],
  "lightgoldenrodyellow": [250, 250, 210, 1],
  "lightgray": [211, 211, 211, 1],
  "lightgreen": [144, 238, 144, 1],
  "lightgrey": [211, 211, 211, 1],
  "lightpink": [255, 182, 193, 1],
  "lightsalmon": [255, 160, 122, 1],
  "lightseagreen": [32, 178, 170, 1],
  "lightskyblue": [135, 206, 250, 1],
  "lightslategray": [119, 136, 153, 1],
  "lightslategrey": [119, 136, 153, 1],
  "lightsteelblue": [176, 196, 222, 1],
  "lightyellow": [255, 255, 224, 1],
  "lime": [0, 255, 0, 1],
  "limegreen": [50, 205, 50, 1],
  "linen": [250, 240, 230, 1],
  "magenta": [255, 0, 255, 1],
  "maroon": [128, 0, 0, 1],
  "mediumaquamarine": [102, 205, 170, 1],
  "mediumblue": [0, 0, 205, 1],
  "mediumorchid": [186, 85, 211, 1],
  "mediumpurple": [147, 112, 219, 1],
  "mediumseagreen": [60, 179, 113, 1],
  "mediumslateblue": [123, 104, 238, 1],
  "mediumspringgreen": [0, 250, 154, 1],
  "mediumturquoise": [72, 209, 204, 1],
  "mediumvioletred": [199, 21, 133, 1],
  "midnightblue": [25, 25, 112, 1],
  "mintcream": [245, 255, 250, 1],
  "mistyrose": [255, 228, 225, 1],
  "moccasin": [255, 228, 181, 1],
  "navajowhite": [255, 222, 173, 1],
  "navy": [0, 0, 128, 1],
  "oldlace": [253, 245, 230, 1],
  "olive": [128, 128, 0, 1],
  "olivedrab": [107, 142, 35, 1],
  "orange": [255, 165, 0, 1],
  "orangered": [255, 69, 0, 1],
  "orchid": [218, 112, 214, 1],
  "palegoldenrod": [238, 232, 170, 1],
  "palegreen": [152, 251, 152, 1],
  "paleturquoise": [175, 238, 238, 1],
  "palevioletred": [219, 112, 147, 1],
  "papayawhip": [255, 239, 213, 1],
  "peachpuff": [255, 218, 185, 1],
  "peru": [205, 133, 63, 1],
  "pink": [255, 192, 203, 1],
  "plum": [221, 160, 221, 1],
  "powderblue": [176, 224, 230, 1],
  "purple": [128, 0, 128, 1],
  "red": [255, 0, 0, 1],
  "rosybrown": [188, 143, 143, 1],
  "royalblue": [65, 105, 225, 1],
  "saddlebrown": [139, 69, 19, 1],
  "salmon": [250, 128, 114, 1],
  "sandybrown": [244, 164, 96, 1],
  "seagreen": [46, 139, 87, 1],
  "seashell": [255, 245, 238, 1],
  "sienna": [160, 82, 45, 1],
  "silver": [192, 192, 192, 1],
  "skyblue": [135, 206, 235, 1],
  "slateblue": [106, 90, 205, 1],
  "slategray": [112, 128, 144, 1],
  "slategrey": [112, 128, 144, 1],
  "snow": [255, 250, 250, 1],
  "springgreen": [0, 255, 127, 1],
  "steelblue": [70, 130, 180, 1],
  "tan": [210, 180, 140, 1],
  "teal": [0, 128, 128, 1],
  "thistle": [216, 191, 216, 1],
  "tomato": [255, 99, 71, 1],
  "turquoise": [64, 224, 208, 1],
  "violet": [238, 130, 238, 1],
  "wheat": [245, 222, 179, 1],
  "white": [255, 255, 255, 1],
  "whitesmoke": [245, 245, 245, 1],
  "yellow": [255, 255, 0, 1],
  "yellowgreen": [154, 205, 50, 1]
};
function clampCssByte(i) {
  i = Math.round(i);
  return i < 0 ? 0 : i > 255 ? 255 : i;
}
function clampCssAngle(i) {
  i = Math.round(i);
  return i < 0 ? 0 : i > 360 ? 360 : i;
}
function clampCssFloat(f) {
  return f < 0 ? 0 : f > 1 ? 1 : f;
}
function parseCssInt(str) {
  if (str.length && str.charAt(str.length - 1) === "%") {
    return clampCssByte(parseFloat(str) / 100 * 255);
  }
  return clampCssByte(parseInt(str, 10));
}
function parseCssFloat(str) {
  if (str.length && str.charAt(str.length - 1) === "%") {
    return clampCssFloat(parseFloat(str) / 100);
  }
  return clampCssFloat(parseFloat(str));
}
function cssHueToRgb(m1, m2, h) {
  if (h < 0) {
    h += 1;
  } else if (h > 1) {
    h -= 1;
  }
  if (h * 6 < 1) {
    return m1 + (m2 - m1) * h * 6;
  }
  if (h * 2 < 1) {
    return m2;
  }
  if (h * 3 < 2) {
    return m1 + (m2 - m1) * (2 / 3 - h) * 6;
  }
  return m1;
}
function lerpNumber(a, b, p) {
  return a + (b - a) * p;
}
function setRgba(out, r, g2, b, a) {
  out[0] = r;
  out[1] = g2;
  out[2] = b;
  out[3] = a;
  return out;
}
function copyRgba(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
var colorCache = new LRUCache(20);
var lastRemovedArr = null;
function putToCache(colorStr, rgbaArr) {
  if (lastRemovedArr) {
    copyRgba(lastRemovedArr, rgbaArr);
  }
  lastRemovedArr = colorCache.put(colorStr, lastRemovedArr || rgbaArr.slice());
}
colorUtil.parse = function(colorStr, rgbaArr) {
  if (!colorStr) {
    return;
  }
  rgbaArr = rgbaArr || [];
  var cached = colorCache.get(colorStr);
  if (cached) {
    return copyRgba(rgbaArr, cached);
  }
  colorStr = colorStr + "";
  var str = colorStr.replace(/ /g, "").toLowerCase();
  if (str in kCSSColorTable) {
    copyRgba(rgbaArr, kCSSColorTable[str]);
    putToCache(colorStr, rgbaArr);
    return rgbaArr;
  }
  if (str.charAt(0) === "#") {
    if (str.length === 4) {
      var iv = parseInt(str.substr(1), 16);
      if (!(iv >= 0 && iv <= 4095)) {
        setRgba(rgbaArr, 0, 0, 0, 1);
        return;
      }
      setRgba(rgbaArr, (iv & 3840) >> 4 | (iv & 3840) >> 8, iv & 240 | (iv & 240) >> 4, iv & 15 | (iv & 15) << 4, 1);
      putToCache(colorStr, rgbaArr);
      return rgbaArr;
    } else if (str.length === 7) {
      var iv = parseInt(str.substr(1), 16);
      if (!(iv >= 0 && iv <= 16777215)) {
        setRgba(rgbaArr, 0, 0, 0, 1);
        return;
      }
      setRgba(rgbaArr, (iv & 16711680) >> 16, (iv & 65280) >> 8, iv & 255, 1);
      putToCache(colorStr, rgbaArr);
      return rgbaArr;
    }
    return;
  }
  var op = str.indexOf("("), ep = str.indexOf(")");
  if (op !== -1 && ep + 1 === str.length) {
    var fname = str.substr(0, op);
    var params = str.substr(op + 1, ep - (op + 1)).split(",");
    var alpha = 1;
    switch (fname) {
      case "rgba":
        if (params.length !== 4) {
          setRgba(rgbaArr, 0, 0, 0, 1);
          return;
        }
        alpha = parseCssFloat(params.pop());
      case "rgb":
        if (params.length !== 3) {
          setRgba(rgbaArr, 0, 0, 0, 1);
          return;
        }
        setRgba(rgbaArr, parseCssInt(params[0]), parseCssInt(params[1]), parseCssInt(params[2]), alpha);
        putToCache(colorStr, rgbaArr);
        return rgbaArr;
      case "hsla":
        if (params.length !== 4) {
          setRgba(rgbaArr, 0, 0, 0, 1);
          return;
        }
        params[3] = parseCssFloat(params[3]);
        hsla2rgba(params, rgbaArr);
        putToCache(colorStr, rgbaArr);
        return rgbaArr;
      case "hsl":
        if (params.length !== 3) {
          setRgba(rgbaArr, 0, 0, 0, 1);
          return;
        }
        hsla2rgba(params, rgbaArr);
        putToCache(colorStr, rgbaArr);
        return rgbaArr;
      default:
        return;
    }
  }
  setRgba(rgbaArr, 0, 0, 0, 1);
  return;
};
colorUtil.parseToFloat = function(colorStr, rgbaArr) {
  rgbaArr = colorUtil.parse(colorStr, rgbaArr);
  if (!rgbaArr) {
    return;
  }
  rgbaArr[0] /= 255;
  rgbaArr[1] /= 255;
  rgbaArr[2] /= 255;
  return rgbaArr;
};
function hsla2rgba(hsla, rgba) {
  var h = (parseFloat(hsla[0]) % 360 + 360) % 360 / 360;
  var s = parseCssFloat(hsla[1]);
  var l = parseCssFloat(hsla[2]);
  var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
  var m1 = l * 2 - m2;
  rgba = rgba || [];
  setRgba(rgba, clampCssByte(cssHueToRgb(m1, m2, h + 1 / 3) * 255), clampCssByte(cssHueToRgb(m1, m2, h) * 255), clampCssByte(cssHueToRgb(m1, m2, h - 1 / 3) * 255), 1);
  if (hsla.length === 4) {
    rgba[3] = hsla[3];
  }
  return rgba;
}
function rgba2hsla(rgba) {
  if (!rgba) {
    return;
  }
  var R = rgba[0] / 255;
  var G = rgba[1] / 255;
  var B = rgba[2] / 255;
  var vMin = Math.min(R, G, B);
  var vMax = Math.max(R, G, B);
  var delta = vMax - vMin;
  var L = (vMax + vMin) / 2;
  var H;
  var S;
  if (delta === 0) {
    H = 0;
    S = 0;
  } else {
    if (L < 0.5) {
      S = delta / (vMax + vMin);
    } else {
      S = delta / (2 - vMax - vMin);
    }
    var deltaR = ((vMax - R) / 6 + delta / 2) / delta;
    var deltaG = ((vMax - G) / 6 + delta / 2) / delta;
    var deltaB = ((vMax - B) / 6 + delta / 2) / delta;
    if (R === vMax) {
      H = deltaB - deltaG;
    } else if (G === vMax) {
      H = 1 / 3 + deltaR - deltaB;
    } else if (B === vMax) {
      H = 2 / 3 + deltaG - deltaR;
    }
    if (H < 0) {
      H += 1;
    }
    if (H > 1) {
      H -= 1;
    }
  }
  var hsla = [H * 360, S, L];
  if (rgba[3] != null) {
    hsla.push(rgba[3]);
  }
  return hsla;
}
colorUtil.lift = function(color, level) {
  var colorArr = colorUtil.parse(color);
  if (colorArr) {
    for (var i = 0; i < 3; i++) {
      if (level < 0) {
        colorArr[i] = colorArr[i] * (1 - level) | 0;
      } else {
        colorArr[i] = (255 - colorArr[i]) * level + colorArr[i] | 0;
      }
    }
    return colorUtil.stringify(colorArr, colorArr.length === 4 ? "rgba" : "rgb");
  }
};
colorUtil.toHex = function(color) {
  var colorArr = colorUtil.parse(color);
  if (colorArr) {
    return ((1 << 24) + (colorArr[0] << 16) + (colorArr[1] << 8) + +colorArr[2]).toString(16).slice(1);
  }
};
colorUtil.fastLerp = function(normalizedValue, colors, out) {
  if (!(colors && colors.length) || !(normalizedValue >= 0 && normalizedValue <= 1)) {
    return;
  }
  out = out || [];
  var value = normalizedValue * (colors.length - 1);
  var leftIndex = Math.floor(value);
  var rightIndex = Math.ceil(value);
  var leftColor = colors[leftIndex];
  var rightColor = colors[rightIndex];
  var dv = value - leftIndex;
  out[0] = clampCssByte(lerpNumber(leftColor[0], rightColor[0], dv));
  out[1] = clampCssByte(lerpNumber(leftColor[1], rightColor[1], dv));
  out[2] = clampCssByte(lerpNumber(leftColor[2], rightColor[2], dv));
  out[3] = clampCssFloat(lerpNumber(leftColor[3], rightColor[3], dv));
  return out;
};
colorUtil.fastMapToColor = colorUtil.fastLerp;
colorUtil.lerp = function(normalizedValue, colors, fullOutput) {
  if (!(colors && colors.length) || !(normalizedValue >= 0 && normalizedValue <= 1)) {
    return;
  }
  var value = normalizedValue * (colors.length - 1);
  var leftIndex = Math.floor(value);
  var rightIndex = Math.ceil(value);
  var leftColor = colorUtil.parse(colors[leftIndex]);
  var rightColor = colorUtil.parse(colors[rightIndex]);
  var dv = value - leftIndex;
  var color = colorUtil.stringify([clampCssByte(lerpNumber(leftColor[0], rightColor[0], dv)), clampCssByte(lerpNumber(leftColor[1], rightColor[1], dv)), clampCssByte(lerpNumber(leftColor[2], rightColor[2], dv)), clampCssFloat(lerpNumber(leftColor[3], rightColor[3], dv))], "rgba");
  return fullOutput ? {
    color,
    leftIndex,
    rightIndex,
    value
  } : color;
};
colorUtil.mapToColor = colorUtil.lerp;
colorUtil.modifyHSL = function(color, h, s, l) {
  color = colorUtil.parse(color);
  if (color) {
    color = rgba2hsla(color);
    h != null && (color[0] = clampCssAngle(h));
    s != null && (color[1] = parseCssFloat(s));
    l != null && (color[2] = parseCssFloat(l));
    return colorUtil.stringify(hsla2rgba(color), "rgba");
  }
};
colorUtil.modifyAlpha = function(color, alpha) {
  color = colorUtil.parse(color);
  if (color && alpha != null) {
    color[3] = clampCssFloat(alpha);
    return colorUtil.stringify(color, "rgba");
  }
};
colorUtil.stringify = function(arrColor, type) {
  if (!arrColor || !arrColor.length) {
    return;
  }
  var colorStr = arrColor[0] + "," + arrColor[1] + "," + arrColor[2];
  if (type === "rgba" || type === "hsva" || type === "hsla") {
    colorStr += "," + arrColor[3];
  }
  return type + "(" + colorStr + ")";
};
var colorUtil$1 = colorUtil;
var parseColor = colorUtil$1.parseToFloat;
var programKeyCache$1 = {};
function getDefineCode$1(defines) {
  var defineKeys = Object.keys(defines);
  defineKeys.sort();
  var defineStr = [];
  for (var i = 0; i < defineKeys.length; i++) {
    var key = defineKeys[i];
    var value = defines[key];
    if (value === null) {
      defineStr.push(key);
    } else {
      defineStr.push(key + " " + value.toString());
    }
  }
  return defineStr.join("\n");
}
function getProgramKey$1(vertexDefines, fragmentDefines, enabledTextures) {
  enabledTextures.sort();
  var defineStr = [];
  for (var i = 0; i < enabledTextures.length; i++) {
    var symbol = enabledTextures[i];
    defineStr.push(symbol);
  }
  var key = getDefineCode$1(vertexDefines) + "\n" + getDefineCode$1(fragmentDefines) + "\n" + defineStr.join("\n");
  if (programKeyCache$1[key]) {
    return programKeyCache$1[key];
  }
  var id = util$1.genGUID();
  programKeyCache$1[key] = id;
  return id;
}
var Material = Base$1.extend(function() {
  return {
    name: "",
    depthTest: true,
    depthMask: true,
    transparent: false,
    blend: null,
    autoUpdateTextureStatus: true,
    uniforms: {},
    vertexDefines: {},
    fragmentDefines: {},
    _textureStatus: {},
    _enabledUniforms: null
  };
}, function() {
  if (!this.name) {
    this.name = "MATERIAL_" + this.__uid__;
  }
  if (this.shader) {
    this.attachShader(this.shader, true);
  }
}, {
  precision: "highp",
  setUniform: function(symbol, value) {
    if (value === void 0) {
      console.warn('Uniform value "' + symbol + '" is undefined');
    }
    var uniform = this.uniforms[symbol];
    if (uniform) {
      if (typeof value === "string") {
        value = parseColor(value) || value;
      }
      uniform.value = value;
      if (this.autoUpdateTextureStatus && uniform.type === "t") {
        if (value) {
          this.enableTexture(symbol);
        } else {
          this.disableTexture(symbol);
        }
      }
    }
  },
  setUniforms: function(obj) {
    for (var key in obj) {
      var val = obj[key];
      this.setUniform(key, val);
    }
  },
  isUniformEnabled: function(symbol) {
    return this._enabledUniforms.indexOf(symbol) >= 0;
  },
  getEnabledUniforms: function() {
    return this._enabledUniforms;
  },
  getTextureUniforms: function() {
    return this._textureUniforms;
  },
  set: function(symbol, value) {
    if (typeof symbol === "object") {
      for (var key in symbol) {
        var val = symbol[key];
        this.setUniform(key, val);
      }
    } else {
      this.setUniform(symbol, value);
    }
  },
  get: function(symbol) {
    var uniform = this.uniforms[symbol];
    if (uniform) {
      return uniform.value;
    }
  },
  attachShader: function(shader, keepStatus) {
    var originalUniforms = this.uniforms;
    this.uniforms = shader.createUniforms();
    this.shader = shader;
    var uniforms = this.uniforms;
    this._enabledUniforms = Object.keys(uniforms);
    this._enabledUniforms.sort();
    this._textureUniforms = this._enabledUniforms.filter(function(uniformName) {
      var type = this.uniforms[uniformName].type;
      return type === "t" || type === "tv";
    }, this);
    var originalVertexDefines = this.vertexDefines;
    var originalFragmentDefines = this.fragmentDefines;
    this.vertexDefines = util$1.clone(shader.vertexDefines);
    this.fragmentDefines = util$1.clone(shader.fragmentDefines);
    if (keepStatus) {
      for (var symbol in originalUniforms) {
        if (uniforms[symbol]) {
          uniforms[symbol].value = originalUniforms[symbol].value;
        }
      }
      util$1.defaults(this.vertexDefines, originalVertexDefines);
      util$1.defaults(this.fragmentDefines, originalFragmentDefines);
    }
    var textureStatus = {};
    for (var key in shader.textures) {
      textureStatus[key] = {
        shaderType: shader.textures[key].shaderType,
        type: shader.textures[key].type,
        enabled: keepStatus && this._textureStatus[key] ? this._textureStatus[key].enabled : false
      };
    }
    this._textureStatus = textureStatus;
    this._programKey = "";
  },
  clone: function() {
    var material = new this.constructor({
      name: this.name,
      shader: this.shader
    });
    for (var symbol in this.uniforms) {
      material.uniforms[symbol].value = this.uniforms[symbol].value;
    }
    material.depthTest = this.depthTest;
    material.depthMask = this.depthMask;
    material.transparent = this.transparent;
    material.blend = this.blend;
    material.vertexDefines = util$1.clone(this.vertexDefines);
    material.fragmentDefines = util$1.clone(this.fragmentDefines);
    material.enableTexture(this.getEnabledTextures());
    material.precision = this.precision;
    return material;
  },
  define: function(shaderType, symbol, val) {
    var vertexDefines = this.vertexDefines;
    var fragmentDefines = this.fragmentDefines;
    if (shaderType !== "vertex" && shaderType !== "fragment" && shaderType !== "both" && arguments.length < 3) {
      val = symbol;
      symbol = shaderType;
      shaderType = "both";
    }
    val = val != null ? val : null;
    if (shaderType === "vertex" || shaderType === "both") {
      if (vertexDefines[symbol] !== val) {
        vertexDefines[symbol] = val;
        this._programKey = "";
      }
    }
    if (shaderType === "fragment" || shaderType === "both") {
      if (fragmentDefines[symbol] !== val) {
        fragmentDefines[symbol] = val;
        if (shaderType !== "both") {
          this._programKey = "";
        }
      }
    }
  },
  undefine: function(shaderType, symbol) {
    if (shaderType !== "vertex" && shaderType !== "fragment" && shaderType !== "both" && arguments.length < 2) {
      symbol = shaderType;
      shaderType = "both";
    }
    if (shaderType === "vertex" || shaderType === "both") {
      if (this.isDefined("vertex", symbol)) {
        delete this.vertexDefines[symbol];
        this._programKey = "";
      }
    }
    if (shaderType === "fragment" || shaderType === "both") {
      if (this.isDefined("fragment", symbol)) {
        delete this.fragmentDefines[symbol];
        if (shaderType !== "both") {
          this._programKey = "";
        }
      }
    }
  },
  isDefined: function(shaderType, symbol) {
    switch (shaderType) {
      case "vertex":
        return this.vertexDefines[symbol] !== void 0;
      case "fragment":
        return this.fragmentDefines[symbol] !== void 0;
    }
  },
  getDefine: function(shaderType, symbol) {
    switch (shaderType) {
      case "vertex":
        return this.vertexDefines[symbol];
      case "fragment":
        return this.fragmentDefines[symbol];
    }
  },
  enableTexture: function(symbol) {
    if (Array.isArray(symbol)) {
      for (var i = 0; i < symbol.length; i++) {
        this.enableTexture(symbol[i]);
      }
      return;
    }
    var status = this._textureStatus[symbol];
    if (status) {
      var isEnabled = status.enabled;
      if (!isEnabled) {
        status.enabled = true;
        this._programKey = "";
      }
    }
  },
  enableTexturesAll: function() {
    var textureStatus = this._textureStatus;
    for (var symbol in textureStatus) {
      textureStatus[symbol].enabled = true;
    }
    this._programKey = "";
  },
  disableTexture: function(symbol) {
    if (Array.isArray(symbol)) {
      for (var i = 0; i < symbol.length; i++) {
        this.disableTexture(symbol[i]);
      }
      return;
    }
    var status = this._textureStatus[symbol];
    if (status) {
      var isDisabled = !status.enabled;
      if (!isDisabled) {
        status.enabled = false;
        this._programKey = "";
      }
    }
  },
  disableTexturesAll: function() {
    var textureStatus = this._textureStatus;
    for (var symbol in textureStatus) {
      textureStatus[symbol].enabled = false;
    }
    this._programKey = "";
  },
  isTextureEnabled: function(symbol) {
    var textureStatus = this._textureStatus;
    return !!textureStatus[symbol] && textureStatus[symbol].enabled;
  },
  getEnabledTextures: function() {
    var enabledTextures = [];
    var textureStatus = this._textureStatus;
    for (var symbol in textureStatus) {
      if (textureStatus[symbol].enabled) {
        enabledTextures.push(symbol);
      }
    }
    return enabledTextures;
  },
  dirtyDefines: function() {
    this._programKey = "";
  },
  getProgramKey: function() {
    if (!this._programKey) {
      this._programKey = getProgramKey$1(this.vertexDefines, this.fragmentDefines, this.getEnabledTextures());
    }
    return this._programKey;
  }
});
var Material$1 = Material;
var GLMAT_EPSILON = 1e-6;
var GLMAT_ARRAY_TYPE = Array;
var GLMAT_RANDOM$1 = Math.random;
var vec2$1 = {};
vec2$1.create = function() {
  var out = new GLMAT_ARRAY_TYPE(2);
  out[0] = 0;
  out[1] = 0;
  return out;
};
vec2$1.clone = function(a) {
  var out = new GLMAT_ARRAY_TYPE(2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
};
vec2$1.fromValues = function(x, y) {
  var out = new GLMAT_ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
};
vec2$1.copy = function(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
};
vec2$1.set = function(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
};
vec2$1.add = function(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
};
vec2$1.subtract = function(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
};
vec2$1.sub = vec2$1.subtract;
vec2$1.multiply = function(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
};
vec2$1.mul = vec2$1.multiply;
vec2$1.divide = function(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
};
vec2$1.div = vec2$1.divide;
vec2$1.min = function(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  return out;
};
vec2$1.max = function(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
};
vec2$1.scale = function(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
};
vec2$1.scaleAndAdd = function(out, a, b, scale2) {
  out[0] = a[0] + b[0] * scale2;
  out[1] = a[1] + b[1] * scale2;
  return out;
};
vec2$1.distance = function(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1];
  return Math.sqrt(x * x + y * y);
};
vec2$1.dist = vec2$1.distance;
vec2$1.squaredDistance = function(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1];
  return x * x + y * y;
};
vec2$1.sqrDist = vec2$1.squaredDistance;
vec2$1.length = function(a) {
  var x = a[0], y = a[1];
  return Math.sqrt(x * x + y * y);
};
vec2$1.len = vec2$1.length;
vec2$1.squaredLength = function(a) {
  var x = a[0], y = a[1];
  return x * x + y * y;
};
vec2$1.sqrLen = vec2$1.squaredLength;
vec2$1.negate = function(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
};
vec2$1.inverse = function(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  return out;
};
vec2$1.normalize = function(out, a) {
  var x = a[0], y = a[1];
  var len = x * x + y * y;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
  }
  return out;
};
vec2$1.dot = function(a, b) {
  return a[0] * b[0] + a[1] * b[1];
};
vec2$1.cross = function(out, a, b) {
  var z = a[0] * b[1] - a[1] * b[0];
  out[0] = out[1] = 0;
  out[2] = z;
  return out;
};
vec2$1.lerp = function(out, a, b, t) {
  var ax = a[0], ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
};
vec2$1.random = function(out, scale2) {
  scale2 = scale2 || 1;
  var r = GLMAT_RANDOM() * 2 * Math.PI;
  out[0] = Math.cos(r) * scale2;
  out[1] = Math.sin(r) * scale2;
  return out;
};
vec2$1.transformMat2 = function(out, a, m) {
  var x = a[0], y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
};
vec2$1.transformMat2d = function(out, a, m) {
  var x = a[0], y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
};
vec2$1.transformMat3 = function(out, a, m) {
  var x = a[0], y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
};
vec2$1.transformMat4 = function(out, a, m) {
  var x = a[0], y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
};
vec2$1.forEach = function() {
  var vec = vec2$1.create();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 2;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }
    return a;
  };
}();
var vec2$2 = vec2$1;
var Vector2 = function(x, y) {
  x = x || 0;
  y = y || 0;
  this.array = vec2$2.fromValues(x, y);
  this._dirty = true;
};
Vector2.prototype = {
  constructor: Vector2,
  add: function(b) {
    vec2$2.add(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  set: function(x, y) {
    this.array[0] = x;
    this.array[1] = y;
    this._dirty = true;
    return this;
  },
  setArray: function(arr) {
    this.array[0] = arr[0];
    this.array[1] = arr[1];
    this._dirty = true;
    return this;
  },
  clone: function() {
    return new Vector2(this.x, this.y);
  },
  copy: function(b) {
    vec2$2.copy(this.array, b.array);
    this._dirty = true;
    return this;
  },
  cross: function(out, b) {
    vec2$2.cross(out.array, this.array, b.array);
    out._dirty = true;
    return this;
  },
  dist: function(b) {
    return vec2$2.dist(this.array, b.array);
  },
  distance: function(b) {
    return vec2$2.distance(this.array, b.array);
  },
  div: function(b) {
    vec2$2.div(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  divide: function(b) {
    vec2$2.divide(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  dot: function(b) {
    return vec2$2.dot(this.array, b.array);
  },
  len: function() {
    return vec2$2.len(this.array);
  },
  length: function() {
    return vec2$2.length(this.array);
  },
  lerp: function(a, b, t) {
    vec2$2.lerp(this.array, a.array, b.array, t);
    this._dirty = true;
    return this;
  },
  min: function(b) {
    vec2$2.min(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  max: function(b) {
    vec2$2.max(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  mul: function(b) {
    vec2$2.mul(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  multiply: function(b) {
    vec2$2.multiply(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  negate: function() {
    vec2$2.negate(this.array, this.array);
    this._dirty = true;
    return this;
  },
  normalize: function() {
    vec2$2.normalize(this.array, this.array);
    this._dirty = true;
    return this;
  },
  random: function(scale2) {
    vec2$2.random(this.array, scale2);
    this._dirty = true;
    return this;
  },
  scale: function(s) {
    vec2$2.scale(this.array, this.array, s);
    this._dirty = true;
    return this;
  },
  scaleAndAdd: function(b, s) {
    vec2$2.scaleAndAdd(this.array, this.array, b.array, s);
    this._dirty = true;
    return this;
  },
  sqrDist: function(b) {
    return vec2$2.sqrDist(this.array, b.array);
  },
  squaredDistance: function(b) {
    return vec2$2.squaredDistance(this.array, b.array);
  },
  sqrLen: function() {
    return vec2$2.sqrLen(this.array);
  },
  squaredLength: function() {
    return vec2$2.squaredLength(this.array);
  },
  sub: function(b) {
    vec2$2.sub(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  subtract: function(b) {
    vec2$2.subtract(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  transformMat2: function(m) {
    vec2$2.transformMat2(this.array, this.array, m.array);
    this._dirty = true;
    return this;
  },
  transformMat2d: function(m) {
    vec2$2.transformMat2d(this.array, this.array, m.array);
    this._dirty = true;
    return this;
  },
  transformMat3: function(m) {
    vec2$2.transformMat3(this.array, this.array, m.array);
    this._dirty = true;
    return this;
  },
  transformMat4: function(m) {
    vec2$2.transformMat4(this.array, this.array, m.array);
    this._dirty = true;
    return this;
  },
  toString: function() {
    return "[" + Array.prototype.join.call(this.array, ",") + "]";
  },
  toArray: function() {
    return Array.prototype.slice.call(this.array);
  }
};
if (Object.defineProperty) {
  var proto$4 = Vector2.prototype;
  Object.defineProperty(proto$4, "x", {
    get: function() {
      return this.array[0];
    },
    set: function(value) {
      this.array[0] = value;
      this._dirty = true;
    }
  });
  Object.defineProperty(proto$4, "y", {
    get: function() {
      return this.array[1];
    },
    set: function(value) {
      this.array[1] = value;
      this._dirty = true;
    }
  });
}
Vector2.add = function(out, a, b) {
  vec2$2.add(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector2.set = function(out, x, y) {
  vec2$2.set(out.array, x, y);
  out._dirty = true;
  return out;
};
Vector2.copy = function(out, b) {
  vec2$2.copy(out.array, b.array);
  out._dirty = true;
  return out;
};
Vector2.cross = function(out, a, b) {
  vec2$2.cross(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector2.dist = function(a, b) {
  return vec2$2.distance(a.array, b.array);
};
Vector2.distance = Vector2.dist;
Vector2.div = function(out, a, b) {
  vec2$2.divide(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector2.divide = Vector2.div;
Vector2.dot = function(a, b) {
  return vec2$2.dot(a.array, b.array);
};
Vector2.len = function(b) {
  return vec2$2.length(b.array);
};
Vector2.lerp = function(out, a, b, t) {
  vec2$2.lerp(out.array, a.array, b.array, t);
  out._dirty = true;
  return out;
};
Vector2.min = function(out, a, b) {
  vec2$2.min(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector2.max = function(out, a, b) {
  vec2$2.max(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector2.mul = function(out, a, b) {
  vec2$2.multiply(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector2.multiply = Vector2.mul;
Vector2.negate = function(out, a) {
  vec2$2.negate(out.array, a.array);
  out._dirty = true;
  return out;
};
Vector2.normalize = function(out, a) {
  vec2$2.normalize(out.array, a.array);
  out._dirty = true;
  return out;
};
Vector2.random = function(out, scale2) {
  vec2$2.random(out.array, scale2);
  out._dirty = true;
  return out;
};
Vector2.scale = function(out, a, scale2) {
  vec2$2.scale(out.array, a.array, scale2);
  out._dirty = true;
  return out;
};
Vector2.scaleAndAdd = function(out, a, b, scale2) {
  vec2$2.scaleAndAdd(out.array, a.array, b.array, scale2);
  out._dirty = true;
  return out;
};
Vector2.sqrDist = function(a, b) {
  return vec2$2.sqrDist(a.array, b.array);
};
Vector2.squaredDistance = Vector2.sqrDist;
Vector2.sqrLen = function(a) {
  return vec2$2.sqrLen(a.array);
};
Vector2.squaredLength = Vector2.sqrLen;
Vector2.sub = function(out, a, b) {
  vec2$2.subtract(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector2.subtract = Vector2.sub;
Vector2.transformMat2 = function(out, a, m) {
  vec2$2.transformMat2(out.array, a.array, m.array);
  out._dirty = true;
  return out;
};
Vector2.transformMat2d = function(out, a, m) {
  vec2$2.transformMat2d(out.array, a.array, m.array);
  out._dirty = true;
  return out;
};
Vector2.transformMat3 = function(out, a, m) {
  vec2$2.transformMat3(out.array, a.array, m.array);
  out._dirty = true;
  return out;
};
Vector2.transformMat4 = function(out, a, m) {
  vec2$2.transformMat4(out.array, a.array, m.array);
  out._dirty = true;
  return out;
};
var Vector2$1 = Vector2;
var SHADER_STATE_TO_ENABLE = 1;
var SHADER_STATE_KEEP_ENABLE = 2;
var SHADER_STATE_PENDING = 3;
var enabledAttributeList = {};
function addLineNumbers(string) {
  var chunks = string.split("\n");
  for (var i = 0, il = chunks.length; i < il; i++) {
    chunks[i] = i + 1 + ": " + chunks[i];
  }
  return chunks.join("\n");
}
function checkShaderErrorMsg(_gl, shader, shaderString) {
  if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {
    return [_gl.getShaderInfoLog(shader), addLineNumbers(shaderString)].join("\n");
  }
}
var tmpFloat32Array16 = new vendor$1.Float32Array(16);
var GLProgram = Base$1.extend({
  uniformSemantics: {},
  attributes: {}
}, function() {
  this._locations = {};
  this._textureSlot = 0;
  this._program = null;
}, {
  bind: function(renderer) {
    this._textureSlot = 0;
    renderer.gl.useProgram(this._program);
  },
  hasUniform: function(symbol) {
    var location = this._locations[symbol];
    return location !== null && location !== void 0;
  },
  useTextureSlot: function(renderer, texture, slot) {
    if (texture) {
      renderer.gl.activeTexture(renderer.gl.TEXTURE0 + slot);
      if (texture.isRenderable()) {
        texture.bind(renderer);
      } else {
        texture.unbind(renderer);
      }
    }
  },
  currentTextureSlot: function() {
    return this._textureSlot;
  },
  resetTextureSlot: function(slot) {
    this._textureSlot = slot || 0;
  },
  takeCurrentTextureSlot: function(renderer, texture) {
    var textureSlot = this._textureSlot;
    this.useTextureSlot(renderer, texture, textureSlot);
    this._textureSlot++;
    return textureSlot;
  },
  setUniform: function(_gl, type, symbol, value) {
    var locationMap = this._locations;
    var location = locationMap[symbol];
    if (location === null || location === void 0) {
      return false;
    }
    switch (type) {
      case "m4":
        if (!(value instanceof Float32Array)) {
          for (var i = 0; i < value.length; i++) {
            tmpFloat32Array16[i] = value[i];
          }
          value = tmpFloat32Array16;
        }
        _gl.uniformMatrix4fv(location, false, value);
        break;
      case "2i":
        _gl.uniform2i(location, value[0], value[1]);
        break;
      case "2f":
        _gl.uniform2f(location, value[0], value[1]);
        break;
      case "3i":
        _gl.uniform3i(location, value[0], value[1], value[2]);
        break;
      case "3f":
        _gl.uniform3f(location, value[0], value[1], value[2]);
        break;
      case "4i":
        _gl.uniform4i(location, value[0], value[1], value[2], value[3]);
        break;
      case "4f":
        _gl.uniform4f(location, value[0], value[1], value[2], value[3]);
        break;
      case "1i":
        _gl.uniform1i(location, value);
        break;
      case "1f":
        _gl.uniform1f(location, value);
        break;
      case "1fv":
        _gl.uniform1fv(location, value);
        break;
      case "1iv":
        _gl.uniform1iv(location, value);
        break;
      case "2iv":
        _gl.uniform2iv(location, value);
        break;
      case "2fv":
        _gl.uniform2fv(location, value);
        break;
      case "3iv":
        _gl.uniform3iv(location, value);
        break;
      case "3fv":
        _gl.uniform3fv(location, value);
        break;
      case "4iv":
        _gl.uniform4iv(location, value);
        break;
      case "4fv":
        _gl.uniform4fv(location, value);
        break;
      case "m2":
      case "m2v":
        _gl.uniformMatrix2fv(location, false, value);
        break;
      case "m3":
      case "m3v":
        _gl.uniformMatrix3fv(location, false, value);
        break;
      case "m4v":
        if (Array.isArray(value) && Array.isArray(value[0])) {
          var array = new vendor$1.Float32Array(value.length * 16);
          var cursor = 0;
          for (var i = 0; i < value.length; i++) {
            var item = value[i];
            for (var j = 0; j < 16; j++) {
              array[cursor++] = item[j];
            }
          }
          _gl.uniformMatrix4fv(location, false, array);
        } else {
          _gl.uniformMatrix4fv(location, false, value);
        }
        break;
    }
    return true;
  },
  setUniformOfSemantic: function(_gl, semantic, val) {
    var semanticInfo = this.uniformSemantics[semantic];
    if (semanticInfo) {
      return this.setUniform(_gl, semanticInfo.type, semanticInfo.symbol, val);
    }
    return false;
  },
  enableAttributes: function(renderer, attribList, vao) {
    var _gl = renderer.gl;
    var program = this._program;
    var locationMap = this._locations;
    var enabledAttributeListInContext;
    if (vao) {
      enabledAttributeListInContext = vao.__enabledAttributeList;
    } else {
      enabledAttributeListInContext = enabledAttributeList[renderer.__uid__];
    }
    if (!enabledAttributeListInContext) {
      if (vao) {
        enabledAttributeListInContext = vao.__enabledAttributeList = [];
      } else {
        enabledAttributeListInContext = enabledAttributeList[renderer.__uid__] = [];
      }
    }
    var locationList = [];
    for (var i = 0; i < attribList.length; i++) {
      var symbol = attribList[i];
      if (!this.attributes[symbol]) {
        locationList[i] = -1;
        continue;
      }
      var location = locationMap[symbol];
      if (location == null) {
        location = _gl.getAttribLocation(program, symbol);
        if (location === -1) {
          locationList[i] = -1;
          continue;
        }
        locationMap[symbol] = location;
      }
      locationList[i] = location;
      if (!enabledAttributeListInContext[location]) {
        enabledAttributeListInContext[location] = SHADER_STATE_TO_ENABLE;
      } else {
        enabledAttributeListInContext[location] = SHADER_STATE_KEEP_ENABLE;
      }
    }
    for (var i = 0; i < enabledAttributeListInContext.length; i++) {
      switch (enabledAttributeListInContext[i]) {
        case SHADER_STATE_TO_ENABLE:
          _gl.enableVertexAttribArray(i);
          enabledAttributeListInContext[i] = SHADER_STATE_PENDING;
          break;
        case SHADER_STATE_KEEP_ENABLE:
          enabledAttributeListInContext[i] = SHADER_STATE_PENDING;
          break;
        case SHADER_STATE_PENDING:
          _gl.disableVertexAttribArray(i);
          enabledAttributeListInContext[i] = 0;
          break;
      }
    }
    return locationList;
  },
  getAttribLocation: function(_gl, symbol) {
    var locationMap = this._locations;
    var location = locationMap[symbol];
    if (location == null) {
      location = _gl.getAttribLocation(this._program, symbol);
      locationMap[symbol] = location;
    }
    return location;
  },
  buildProgram: function(_gl, shader, vertexShaderCode, fragmentShaderCode) {
    var vertexShader = _gl.createShader(_gl.VERTEX_SHADER);
    var program = _gl.createProgram();
    _gl.shaderSource(vertexShader, vertexShaderCode);
    _gl.compileShader(vertexShader);
    var fragmentShader = _gl.createShader(_gl.FRAGMENT_SHADER);
    _gl.shaderSource(fragmentShader, fragmentShaderCode);
    _gl.compileShader(fragmentShader);
    var msg = checkShaderErrorMsg(_gl, vertexShader, vertexShaderCode);
    if (msg) {
      return msg;
    }
    msg = checkShaderErrorMsg(_gl, fragmentShader, fragmentShaderCode);
    if (msg) {
      return msg;
    }
    _gl.attachShader(program, vertexShader);
    _gl.attachShader(program, fragmentShader);
    if (shader.attributeSemantics["POSITION"]) {
      _gl.bindAttribLocation(program, 0, shader.attributeSemantics["POSITION"].symbol);
    } else {
      var keys2 = Object.keys(this.attributes);
      _gl.bindAttribLocation(program, 0, keys2[0]);
    }
    _gl.linkProgram(program);
    _gl.deleteShader(vertexShader);
    _gl.deleteShader(fragmentShader);
    this._program = program;
    this.vertexCode = vertexShaderCode;
    this.fragmentCode = fragmentShaderCode;
    if (!_gl.getProgramParameter(program, _gl.LINK_STATUS)) {
      return "Could not link program\n" + _gl.getProgramInfoLog(program);
    }
    for (var i = 0; i < shader.uniforms.length; i++) {
      var uniformSymbol = shader.uniforms[i];
      this._locations[uniformSymbol] = _gl.getUniformLocation(program, uniformSymbol);
    }
  }
});
var GLProgram$1 = GLProgram;
var loopRegex = /for\s*?\(int\s*?_idx_\s*\=\s*([\w-]+)\;\s*_idx_\s*<\s*([\w-]+);\s*_idx_\s*\+\+\s*\)\s*\{\{([\s\S]+?)(?=\}\})\}\}/g;
function unrollLoop(shaderStr, defines, lightsNumbers) {
  function replace(match, start, end, snippet) {
    var unroll = "";
    if (isNaN(start)) {
      if (start in defines) {
        start = defines[start];
      } else {
        start = lightNumberDefines[start];
      }
    }
    if (isNaN(end)) {
      if (end in defines) {
        end = defines[end];
      } else {
        end = lightNumberDefines[end];
      }
    }
    for (var idx = parseInt(start); idx < parseInt(end); idx++) {
      unroll += "{" + snippet.replace(/float\s*\(\s*_idx_\s*\)/g, idx.toFixed(1)).replace(/_idx_/g, idx) + "}";
    }
    return unroll;
  }
  var lightNumberDefines = {};
  for (var lightType in lightsNumbers) {
    lightNumberDefines[lightType + "_COUNT"] = lightsNumbers[lightType];
  }
  return shaderStr.replace(loopRegex, replace);
}
function getDefineCode(defines, lightsNumbers, enabledTextures) {
  var defineStr = [];
  if (lightsNumbers) {
    for (var lightType in lightsNumbers) {
      var count = lightsNumbers[lightType];
      if (count > 0) {
        defineStr.push("#define " + lightType.toUpperCase() + "_COUNT " + count);
      }
    }
  }
  if (enabledTextures) {
    for (var i = 0; i < enabledTextures.length; i++) {
      var symbol = enabledTextures[i];
      defineStr.push("#define " + symbol.toUpperCase() + "_ENABLED");
    }
  }
  for (var symbol in defines) {
    var value = defines[symbol];
    if (value === null) {
      defineStr.push("#define " + symbol);
    } else {
      defineStr.push("#define " + symbol + " " + value.toString());
    }
  }
  return defineStr.join("\n");
}
function getExtensionCode(exts) {
  var extensionStr = [];
  for (var i = 0; i < exts.length; i++) {
    extensionStr.push("#extension GL_" + exts[i] + " : enable");
  }
  return extensionStr.join("\n");
}
function getPrecisionCode(precision) {
  return ["precision", precision, "float"].join(" ") + ";\n" + ["precision", precision, "int"].join(" ") + ";\n" + ["precision", precision, "sampler2D"].join(" ") + ";\n";
}
function ProgramManager(renderer) {
  this._renderer = renderer;
  this._cache = {};
}
ProgramManager.prototype.getProgram = function(renderable, material, scene) {
  var cache = this._cache;
  var isSkinnedMesh = renderable.isSkinnedMesh && renderable.isSkinnedMesh();
  var isInstancedMesh = renderable.isInstancedMesh && renderable.isInstancedMesh();
  var key = "s" + material.shader.shaderID + "m" + material.getProgramKey();
  if (scene) {
    key += "se" + scene.getProgramKey(renderable.lightGroup);
  }
  if (isSkinnedMesh) {
    key += ",sk" + renderable.joints.length;
  }
  if (isInstancedMesh) {
    key += ",is";
  }
  var program = cache[key];
  if (program) {
    return program;
  }
  var lightsNumbers = scene ? scene.getLightsNumbers(renderable.lightGroup) : {};
  var renderer = this._renderer;
  var _gl = renderer.gl;
  var enabledTextures = material.getEnabledTextures();
  var extraDefineCode = "";
  if (isSkinnedMesh) {
    var skinDefines = {
      SKINNING: null,
      JOINT_COUNT: renderable.joints.length
    };
    if (renderable.joints.length > renderer.getMaxJointNumber()) {
      skinDefines.USE_SKIN_MATRICES_TEXTURE = null;
    }
    extraDefineCode += "\n" + getDefineCode(skinDefines) + "\n";
  }
  if (isInstancedMesh) {
    extraDefineCode += "\n#define INSTANCING\n";
  }
  var vertexDefineStr = extraDefineCode + getDefineCode(material.vertexDefines, lightsNumbers, enabledTextures);
  var fragmentDefineStr = extraDefineCode + getDefineCode(material.fragmentDefines, lightsNumbers, enabledTextures);
  var vertexCode = vertexDefineStr + "\n" + material.shader.vertex;
  var extensions2 = ["OES_standard_derivatives", "EXT_shader_texture_lod"].filter(function(ext) {
    return renderer.getGLExtension(ext) != null;
  });
  if (extensions2.indexOf("EXT_shader_texture_lod") >= 0) {
    fragmentDefineStr += "\n#define SUPPORT_TEXTURE_LOD";
  }
  if (extensions2.indexOf("OES_standard_derivatives") >= 0) {
    fragmentDefineStr += "\n#define SUPPORT_STANDARD_DERIVATIVES";
  }
  var fragmentCode = getExtensionCode(extensions2) + "\n" + getPrecisionCode(material.precision) + "\n" + fragmentDefineStr + "\n" + material.shader.fragment;
  var finalVertexCode = unrollLoop(vertexCode, material.vertexDefines, lightsNumbers);
  var finalFragmentCode = unrollLoop(fragmentCode, material.fragmentDefines, lightsNumbers);
  var program = new GLProgram$1();
  program.uniformSemantics = material.shader.uniformSemantics;
  program.attributes = material.shader.attributes;
  var errorMsg = program.buildProgram(_gl, material.shader, finalVertexCode, finalFragmentCode);
  program.__error = errorMsg;
  cache[key] = program;
  return program;
};
var uniformRegex = /uniform\s+(bool|float|int|vec2|vec3|vec4|ivec2|ivec3|ivec4|mat2|mat3|mat4|sampler2D|samplerCube)\s+([\s\S]*?);/g;
var attributeRegex = /attribute\s+(float|int|vec2|vec3|vec4)\s+([\s\S]*?);/g;
var defineRegex = /#define\s+(\w+)?(\s+[\d-.]+)?\s*;?\s*\n/g;
var uniformTypeMap = {
  "bool": "1i",
  "int": "1i",
  "sampler2D": "t",
  "samplerCube": "t",
  "float": "1f",
  "vec2": "2f",
  "vec3": "3f",
  "vec4": "4f",
  "ivec2": "2i",
  "ivec3": "3i",
  "ivec4": "4i",
  "mat2": "m2",
  "mat3": "m3",
  "mat4": "m4"
};
function createZeroArray(len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr[i] = 0;
  }
  return arr;
}
var uniformValueConstructor = {
  "bool": function() {
    return true;
  },
  "int": function() {
    return 0;
  },
  "float": function() {
    return 0;
  },
  "sampler2D": function() {
    return null;
  },
  "samplerCube": function() {
    return null;
  },
  "vec2": function() {
    return createZeroArray(2);
  },
  "vec3": function() {
    return createZeroArray(3);
  },
  "vec4": function() {
    return createZeroArray(4);
  },
  "ivec2": function() {
    return createZeroArray(2);
  },
  "ivec3": function() {
    return createZeroArray(3);
  },
  "ivec4": function() {
    return createZeroArray(4);
  },
  "mat2": function() {
    return createZeroArray(4);
  },
  "mat3": function() {
    return createZeroArray(9);
  },
  "mat4": function() {
    return createZeroArray(16);
  },
  "array": function() {
    return [];
  }
};
var attributeSemantics = [
  "POSITION",
  "NORMAL",
  "BINORMAL",
  "TANGENT",
  "TEXCOORD",
  "TEXCOORD_0",
  "TEXCOORD_1",
  "COLOR",
  "JOINT",
  "WEIGHT"
];
var uniformSemantics = [
  "SKIN_MATRIX",
  "VIEWPORT_SIZE",
  "VIEWPORT",
  "DEVICEPIXELRATIO",
  "WINDOW_SIZE",
  "NEAR",
  "FAR",
  "TIME"
];
var matrixSemantics = ["WORLD", "VIEW", "PROJECTION", "WORLDVIEW", "VIEWPROJECTION", "WORLDVIEWPROJECTION", "WORLDINVERSE", "VIEWINVERSE", "PROJECTIONINVERSE", "WORLDVIEWINVERSE", "VIEWPROJECTIONINVERSE", "WORLDVIEWPROJECTIONINVERSE", "WORLDTRANSPOSE", "VIEWTRANSPOSE", "PROJECTIONTRANSPOSE", "WORLDVIEWTRANSPOSE", "VIEWPROJECTIONTRANSPOSE", "WORLDVIEWPROJECTIONTRANSPOSE", "WORLDINVERSETRANSPOSE", "VIEWINVERSETRANSPOSE", "PROJECTIONINVERSETRANSPOSE", "WORLDVIEWINVERSETRANSPOSE", "VIEWPROJECTIONINVERSETRANSPOSE", "WORLDVIEWPROJECTIONINVERSETRANSPOSE"];
var attributeSizeMap = {
  "vec4": 4,
  "vec3": 3,
  "vec2": 2,
  "float": 1
};
var shaderIDCache = {};
var shaderCodeCache = {};
function getShaderID(vertex, fragment) {
  var key = "vertex:" + vertex + "fragment:" + fragment;
  if (shaderIDCache[key]) {
    return shaderIDCache[key];
  }
  var id = util$1.genGUID();
  shaderIDCache[key] = id;
  shaderCodeCache[id] = {
    vertex,
    fragment
  };
  return id;
}
function removeComment(code) {
  return code.replace(/[ \t]*\/\/.*\n/g, "").replace(/[ \t]*\/\*[\s\S]*?\*\//g, "");
}
function logSyntaxError() {
  console.error("Wrong uniform/attributes syntax");
}
function parseDeclarations(type, line) {
  var speratorsRegexp = /[,=\(\):]/;
  var tokens = line.replace(/:\s*\[\s*(.*)\s*\]/g, "=" + type + "($1)").replace(/\s+/g, "").split(/(?=[,=\(\):])/g);
  var newTokens = [];
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].match(speratorsRegexp)) {
      newTokens.push(tokens[i].charAt(0), tokens[i].slice(1));
    } else {
      newTokens.push(tokens[i]);
    }
  }
  tokens = newTokens;
  var TYPE_SYMBOL = 0;
  var TYPE_ASSIGN = 1;
  var TYPE_VEC = 2;
  var TYPE_ARR = 3;
  var TYPE_SEMANTIC = 4;
  var TYPE_NORMAL = 5;
  var opType = TYPE_SYMBOL;
  var declarations = {};
  var declarationValue = null;
  var currentDeclaration;
  addSymbol(tokens[0]);
  function addSymbol(symbol) {
    if (!symbol) {
      logSyntaxError();
    }
    var arrResult = symbol.match(/\[(.*?)\]/);
    currentDeclaration = symbol.replace(/\[(.*?)\]/, "");
    declarations[currentDeclaration] = {};
    if (arrResult) {
      declarations[currentDeclaration].isArray = true;
      declarations[currentDeclaration].arraySize = arrResult[1];
    }
  }
  for (var i = 1; i < tokens.length; i++) {
    var token = tokens[i];
    if (!token) {
      continue;
    }
    if (token === "=") {
      if (opType !== TYPE_SYMBOL && opType !== TYPE_ARR) {
        logSyntaxError();
        break;
      }
      opType = TYPE_ASSIGN;
      continue;
    } else if (token === ":") {
      opType = TYPE_SEMANTIC;
      continue;
    } else if (token === ",") {
      if (opType === TYPE_VEC) {
        if (!(declarationValue instanceof Array)) {
          logSyntaxError();
          break;
        }
        declarationValue.push(+tokens[++i]);
      } else {
        opType = TYPE_NORMAL;
      }
      continue;
    } else if (token === ")") {
      declarations[currentDeclaration].value = new vendor$1.Float32Array(declarationValue);
      declarationValue = null;
      opType = TYPE_NORMAL;
      continue;
    } else if (token === "(") {
      if (opType !== TYPE_VEC) {
        logSyntaxError();
        break;
      }
      if (!(declarationValue instanceof Array)) {
        logSyntaxError();
        break;
      }
      declarationValue.push(+tokens[++i]);
      continue;
    } else if (token.indexOf("vec") >= 0) {
      if (opType !== TYPE_ASSIGN && opType !== TYPE_SEMANTIC) {
        logSyntaxError();
        break;
      }
      opType = TYPE_VEC;
      declarationValue = [];
      continue;
    } else if (opType === TYPE_ASSIGN) {
      if (type === "bool") {
        declarations[currentDeclaration].value = token === "true";
      } else {
        declarations[currentDeclaration].value = parseFloat(token);
      }
      declarationValue = null;
      continue;
    } else if (opType === TYPE_SEMANTIC) {
      var semantic = token;
      if (attributeSemantics.indexOf(semantic) >= 0 || uniformSemantics.indexOf(semantic) >= 0 || matrixSemantics.indexOf(semantic) >= 0) {
        declarations[currentDeclaration].semantic = semantic;
      } else if (semantic === "ignore" || semantic === "unconfigurable") {
        declarations[currentDeclaration].ignore = true;
      } else {
        if (type === "bool") {
          declarations[currentDeclaration].value = semantic === "true";
        } else {
          declarations[currentDeclaration].value = parseFloat(semantic);
        }
      }
      continue;
    }
    addSymbol(token);
    opType = TYPE_SYMBOL;
  }
  return declarations;
}
function Shader(vertex, fragment) {
  if (typeof vertex === "object") {
    fragment = vertex.fragment;
    vertex = vertex.vertex;
  }
  vertex = removeComment(vertex);
  fragment = removeComment(fragment);
  this._shaderID = getShaderID(vertex, fragment);
  this._vertexCode = Shader.parseImport(vertex);
  this._fragmentCode = Shader.parseImport(fragment);
  this.attributeSemantics = {};
  this.matrixSemantics = {};
  this.uniformSemantics = {};
  this.matrixSemanticKeys = [];
  this.uniformTemplates = {};
  this.attributes = {};
  this.textures = {};
  this.vertexDefines = {};
  this.fragmentDefines = {};
  this._parseAttributes();
  this._parseUniforms();
  this._parseDefines();
}
Shader.prototype = {
  constructor: Shader,
  createUniforms: function() {
    var uniforms = {};
    for (var symbol in this.uniformTemplates) {
      var uniformTpl = this.uniformTemplates[symbol];
      uniforms[symbol] = {
        type: uniformTpl.type,
        value: uniformTpl.value()
      };
    }
    return uniforms;
  },
  _parseImport: function() {
    this._vertexCode = Shader.parseImport(this.vertex);
    this._fragmentCode = Shader.parseImport(this.fragment);
  },
  _addSemanticUniform: function(symbol, uniformType, semantic) {
    if (attributeSemantics.indexOf(semantic) >= 0) {
      this.attributeSemantics[semantic] = {
        symbol,
        type: uniformType
      };
    } else if (matrixSemantics.indexOf(semantic) >= 0) {
      var isTranspose = false;
      var semanticNoTranspose = semantic;
      if (semantic.match(/TRANSPOSE$/)) {
        isTranspose = true;
        semanticNoTranspose = semantic.slice(0, -9);
      }
      this.matrixSemantics[semantic] = {
        symbol,
        type: uniformType,
        isTranspose,
        semanticNoTranspose
      };
    } else if (uniformSemantics.indexOf(semantic) >= 0) {
      this.uniformSemantics[semantic] = {
        symbol,
        type: uniformType
      };
    }
  },
  _addMaterialUniform: function(symbol, type, uniformType, defaultValueFunc, isArray2, materialUniforms) {
    materialUniforms[symbol] = {
      type: uniformType,
      value: isArray2 ? uniformValueConstructor["array"] : defaultValueFunc || uniformValueConstructor[type],
      semantic: null
    };
  },
  _parseUniforms: function() {
    var uniforms = {};
    var self = this;
    var shaderType = "vertex";
    this._uniformList = [];
    this._vertexCode = this._vertexCode.replace(uniformRegex, _uniformParser);
    shaderType = "fragment";
    this._fragmentCode = this._fragmentCode.replace(uniformRegex, _uniformParser);
    self.matrixSemanticKeys = Object.keys(this.matrixSemantics);
    function makeDefaultValueFunc(value) {
      return value != null ? function() {
        return value;
      } : null;
    }
    function _uniformParser(str, type, content) {
      var declaredUniforms = parseDeclarations(type, content);
      var uniformMainStr = [];
      for (var symbol in declaredUniforms) {
        var uniformInfo = declaredUniforms[symbol];
        var semantic = uniformInfo.semantic;
        var tmpStr = symbol;
        var uniformType = uniformTypeMap[type];
        var defaultValueFunc = makeDefaultValueFunc(declaredUniforms[symbol].value);
        if (declaredUniforms[symbol].isArray) {
          tmpStr += "[" + declaredUniforms[symbol].arraySize + "]";
          uniformType += "v";
        }
        uniformMainStr.push(tmpStr);
        self._uniformList.push(symbol);
        if (!uniformInfo.ignore) {
          if (type === "sampler2D" || type === "samplerCube") {
            self.textures[symbol] = {
              shaderType,
              type
            };
          }
          if (semantic) {
            self._addSemanticUniform(symbol, uniformType, semantic);
          } else {
            self._addMaterialUniform(symbol, type, uniformType, defaultValueFunc, declaredUniforms[symbol].isArray, uniforms);
          }
        }
      }
      return uniformMainStr.length > 0 ? "uniform " + type + " " + uniformMainStr.join(",") + ";\n" : "";
    }
    this.uniformTemplates = uniforms;
  },
  _parseAttributes: function() {
    var attributes = {};
    var self = this;
    this._vertexCode = this._vertexCode.replace(attributeRegex, _attributeParser);
    function _attributeParser(str, type, content) {
      var declaredAttributes = parseDeclarations(type, content);
      var size = attributeSizeMap[type] || 1;
      var attributeMainStr = [];
      for (var symbol in declaredAttributes) {
        var semantic = declaredAttributes[symbol].semantic;
        attributes[symbol] = {
          type: "float",
          size,
          semantic: semantic || null
        };
        if (semantic) {
          if (attributeSemantics.indexOf(semantic) < 0) {
            throw new Error('Unkown semantic "' + semantic + '"');
          } else {
            self.attributeSemantics[semantic] = {
              symbol,
              type
            };
          }
        }
        attributeMainStr.push(symbol);
      }
      return "attribute " + type + " " + attributeMainStr.join(",") + ";\n";
    }
    this.attributes = attributes;
  },
  _parseDefines: function() {
    var self = this;
    var shaderType = "vertex";
    this._vertexCode = this._vertexCode.replace(defineRegex, _defineParser);
    shaderType = "fragment";
    this._fragmentCode = this._fragmentCode.replace(defineRegex, _defineParser);
    function _defineParser(str, symbol, value) {
      var defines = shaderType === "vertex" ? self.vertexDefines : self.fragmentDefines;
      if (!defines[symbol]) {
        if (value === "false") {
          defines[symbol] = false;
        } else if (value === "true") {
          defines[symbol] = true;
        } else {
          defines[symbol] = value ? isNaN(parseFloat(value)) ? value.trim() : parseFloat(value) : null;
        }
      }
      return "";
    }
  },
  clone: function() {
    var code = shaderCodeCache[this._shaderID];
    var shader = new Shader(code.vertex, code.fragment);
    return shader;
  }
};
if (Object.defineProperty) {
  Object.defineProperty(Shader.prototype, "shaderID", {
    get: function() {
      return this._shaderID;
    }
  });
  Object.defineProperty(Shader.prototype, "vertex", {
    get: function() {
      return this._vertexCode;
    }
  });
  Object.defineProperty(Shader.prototype, "fragment", {
    get: function() {
      return this._fragmentCode;
    }
  });
  Object.defineProperty(Shader.prototype, "uniforms", {
    get: function() {
      return this._uniformList;
    }
  });
}
var importRegex = /(@import)\s*([0-9a-zA-Z_\-\.]*)/g;
Shader.parseImport = function(shaderStr) {
  shaderStr = shaderStr.replace(importRegex, function(str, importSymbol, importName) {
    var str = Shader.source(importName);
    if (str) {
      return Shader.parseImport(str);
    } else {
      console.error('Shader chunk "' + importName + '" not existed in library');
      return "";
    }
  });
  return shaderStr;
};
var exportRegex = /(@export)\s*([0-9a-zA-Z_\-\.]*)\s*\n([\s\S]*?)@end/g;
Shader["import"] = function(shaderStr) {
  shaderStr.replace(exportRegex, function(str, exportSymbol, exportName, code) {
    var code = code.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+\x24)/g, "");
    if (code) {
      var parts = exportName.split(".");
      var obj = Shader.codes;
      var i = 0;
      var key;
      while (i < parts.length - 1) {
        key = parts[i++];
        if (!obj[key]) {
          obj[key] = {};
        }
        obj = obj[key];
      }
      key = parts[i];
      obj[key] = code;
    }
    return code;
  });
};
Shader.codes = {};
Shader.source = function(name) {
  var parts = name.split(".");
  var obj = Shader.codes;
  var i = 0;
  while (obj && i < parts.length) {
    var key = parts[i++];
    obj = obj[key];
  }
  if (typeof obj !== "string") {
    console.error('Shader "' + name + '" not existed in library');
    return "";
  }
  return obj;
};
var prezGLSL = "@export clay.prez.vertex\nuniform mat4 WVP : WORLDVIEWPROJECTION;\nattribute vec3 pos : POSITION;\nattribute vec2 uv : TEXCOORD_0;\nuniform vec2 uvRepeat : [1.0, 1.0];\nuniform vec2 uvOffset : [0.0, 0.0];\n@import clay.chunk.skinning_header\n@import clay.chunk.instancing_header\nvarying vec2 v_Texcoord;\nvoid main()\n{\n vec4 P = vec4(pos, 1.0);\n#ifdef SKINNING\n @import clay.chunk.skin_matrix\n P = skinMatrixWS * P;\n#endif\n#ifdef INSTANCING\n @import clay.chunk.instancing_matrix\n P = instanceMat * P;\n#endif\n gl_Position = WVP * P;\n v_Texcoord = uv * uvRepeat + uvOffset;\n}\n@end\n@export clay.prez.fragment\nuniform sampler2D alphaMap;\nuniform float alphaCutoff: 0.0;\nvarying vec2 v_Texcoord;\nvoid main()\n{\n if (alphaCutoff > 0.0) {\n if (texture2D(alphaMap, v_Texcoord).a <= alphaCutoff) {\n discard;\n }\n }\n gl_FragColor = vec4(0.0,0.0,0.0,1.0);\n}\n@end";
var mat4$1 = {};
mat4$1.create = function() {
  var out = new GLMAT_ARRAY_TYPE(16);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
};
mat4$1.clone = function(a) {
  var out = new GLMAT_ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
};
mat4$1.copy = function(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
};
mat4$1.identity = function(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
};
mat4$1.transpose = function(out, a) {
  if (out === a) {
    var a01 = a[1], a02 = a[2], a03 = a[3], a12 = a[6], a13 = a[7], a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }
  return out;
};
mat4$1.invert = function(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
};
mat4$1.adjoint = function(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
  return out;
};
mat4$1.determinant = function(a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};
mat4$1.multiply = function(out, a, b) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
};
mat4$1.multiplyAffine = function(out, a, b) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[4], a11 = a[5], a12 = a[6], a20 = a[8], a21 = a[9], a22 = a[10], a30 = a[12], a31 = a[13], a32 = a[14];
  var b0 = b[0], b1 = b[1], b2 = b[2];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + a32;
  return out;
};
mat4$1.mul = mat4$1.multiply;
mat4$1.mulAffine = mat4$1.multiplyAffine;
mat4$1.translate = function(out, a, v) {
  var x = v[0], y = v[1], z = v[2], a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;
  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }
  return out;
};
mat4$1.scale = function(out, a, v) {
  var x = v[0], y = v[1], z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
};
mat4$1.rotate = function(out, a, rad2, axis) {
  var x = axis[0], y = axis[1], z = axis[2], len = Math.sqrt(x * x + y * y + z * z), s, c, t, a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, b00, b01, b02, b10, b11, b12, b20, b21, b22;
  if (Math.abs(len) < GLMAT_EPSILON) {
    return null;
  }
  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad2);
  c = Math.cos(rad2);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];
  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c;
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;
  if (a !== out) {
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
};
mat4$1.rotateX = function(out, a, rad2) {
  var s = Math.sin(rad2), c = Math.cos(rad2), a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  if (a !== out) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
};
mat4$1.rotateY = function(out, a, rad2) {
  var s = Math.sin(rad2), c = Math.cos(rad2), a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  if (a !== out) {
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
};
mat4$1.rotateZ = function(out, a, rad2) {
  var s = Math.sin(rad2), c = Math.cos(rad2), a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  if (a !== out) {
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
};
mat4$1.fromRotationTranslation = function(out, q, v) {
  var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
};
mat4$1.fromQuat = function(out, q) {
  var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, yx = y * x2, yy = y * y2, zx = z * x2, zy = z * y2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
};
mat4$1.frustum = function(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left), tb = 1 / (top - bottom), nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
};
mat4$1.perspective = function(out, fovy, aspect, near, far) {
  var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = 2 * far * near * nf;
  out[15] = 0;
  return out;
};
mat4$1.ortho = function(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
};
mat4$1.lookAt = function(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len, eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2], centerx = center[0], centery = center[1], centerz = center[2];
  if (Math.abs(eyex - centerx) < GLMAT_EPSILON && Math.abs(eyey - centery) < GLMAT_EPSILON && Math.abs(eyez - centerz) < GLMAT_EPSILON) {
    return mat4$1.identity(out);
  }
  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }
  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }
  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
};
mat4$1.frob = function(a) {
  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2));
};
var mat4$2 = mat4$1;
var vec3$7 = {};
vec3$7.create = function() {
  var out = new GLMAT_ARRAY_TYPE(3);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
};
vec3$7.clone = function(a) {
  var out = new GLMAT_ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
};
vec3$7.fromValues = function(x, y, z) {
  var out = new GLMAT_ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
};
vec3$7.copy = function(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
};
vec3$7.set = function(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
};
vec3$7.add = function(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
};
vec3$7.subtract = function(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
};
vec3$7.sub = vec3$7.subtract;
vec3$7.multiply = function(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
};
vec3$7.mul = vec3$7.multiply;
vec3$7.divide = function(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
};
vec3$7.div = vec3$7.divide;
vec3$7.min = function(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
};
vec3$7.max = function(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
};
vec3$7.scale = function(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
};
vec3$7.scaleAndAdd = function(out, a, b, scale2) {
  out[0] = a[0] + b[0] * scale2;
  out[1] = a[1] + b[1] * scale2;
  out[2] = a[2] + b[2] * scale2;
  return out;
};
vec3$7.distance = function(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2];
  return Math.sqrt(x * x + y * y + z * z);
};
vec3$7.dist = vec3$7.distance;
vec3$7.squaredDistance = function(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2];
  return x * x + y * y + z * z;
};
vec3$7.sqrDist = vec3$7.squaredDistance;
vec3$7.length = function(a) {
  var x = a[0], y = a[1], z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
};
vec3$7.len = vec3$7.length;
vec3$7.squaredLength = function(a) {
  var x = a[0], y = a[1], z = a[2];
  return x * x + y * y + z * z;
};
vec3$7.sqrLen = vec3$7.squaredLength;
vec3$7.negate = function(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
};
vec3$7.inverse = function(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  out[2] = 1 / a[2];
  return out;
};
vec3$7.normalize = function(out, a) {
  var x = a[0], y = a[1], z = a[2];
  var len = x * x + y * y + z * z;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
  }
  return out;
};
vec3$7.dot = function(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};
vec3$7.cross = function(out, a, b) {
  var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
};
vec3$7.lerp = function(out, a, b, t) {
  var ax = a[0], ay = a[1], az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
};
vec3$7.random = function(out, scale2) {
  scale2 = scale2 || 1;
  var r = GLMAT_RANDOM$1() * 2 * Math.PI;
  var z = GLMAT_RANDOM$1() * 2 - 1;
  var zScale = Math.sqrt(1 - z * z) * scale2;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale2;
  return out;
};
vec3$7.transformMat4 = function(out, a, m) {
  var x = a[0], y = a[1], z = a[2], w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
};
vec3$7.transformMat3 = function(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
};
vec3$7.transformQuat = function(out, a, q) {
  var x = a[0], y = a[1], z = a[2], qx = q[0], qy = q[1], qz = q[2], qw = q[3], ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  return out;
};
vec3$7.rotateX = function(out, a, b, c) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0];
  r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
  r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
};
vec3$7.rotateY = function(out, a, b, c) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
};
vec3$7.rotateZ = function(out, a, b, c) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
  r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
  r[2] = p[2];
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
};
vec3$7.forEach = function() {
  var vec = vec3$7.create();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 3;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }
    return a;
  };
}();
vec3$7.angle = function(a, b) {
  var tempA = vec3$7.fromValues(a[0], a[1], a[2]);
  var tempB = vec3$7.fromValues(b[0], b[1], b[2]);
  vec3$7.normalize(tempA, tempA);
  vec3$7.normalize(tempB, tempB);
  var cosine = vec3$7.dot(tempA, tempB);
  if (cosine > 1) {
    return 0;
  } else {
    return Math.acos(cosine);
  }
};
var vec3$8 = vec3$7;
Shader["import"](prezGLSL);
var mat4Create = mat4$2.create;
var errorShader = {};
function defaultGetMaterial(renderable) {
  return renderable.material;
}
function defaultGetUniform(renderable, material, symbol) {
  return material.uniforms[symbol].value;
}
function defaultIsMaterialChanged(renderabled, prevRenderable, material, prevMaterial) {
  return material !== prevMaterial;
}
function defaultIfRender(renderable) {
  return true;
}
function noop() {
}
var attributeBufferTypeMap = {
  float: glenum.FLOAT,
  byte: glenum.BYTE,
  ubyte: glenum.UNSIGNED_BYTE,
  short: glenum.SHORT,
  ushort: glenum.UNSIGNED_SHORT
};
function VertexArrayObject(availableAttributes, availableAttributeSymbols, indicesBuffer) {
  this.availableAttributes = availableAttributes;
  this.availableAttributeSymbols = availableAttributeSymbols;
  this.indicesBuffer = indicesBuffer;
  this.vao = null;
}
function PlaceHolderTexture(renderer) {
  var blankCanvas;
  var webglTexture;
  this.bind = function(renderer2) {
    if (!blankCanvas) {
      blankCanvas = vendor$1.createCanvas();
      blankCanvas.width = blankCanvas.height = 1;
      blankCanvas.getContext("2d");
    }
    var gl = renderer2.gl;
    var firstBind = !webglTexture;
    if (firstBind) {
      webglTexture = gl.createTexture();
    }
    gl.bindTexture(gl.TEXTURE_2D, webglTexture);
    if (firstBind) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, blankCanvas);
    }
  };
  this.unbind = function(renderer2) {
    renderer2.gl.bindTexture(renderer2.gl.TEXTURE_2D, null);
  };
  this.isRenderable = function() {
    return true;
  };
}
var Renderer = Base$1.extend(function() {
  return {
    canvas: null,
    _width: 100,
    _height: 100,
    devicePixelRatio: typeof window !== "undefined" && window.devicePixelRatio || 1,
    clearColor: [0, 0, 0, 0],
    clearBit: 17664,
    alpha: true,
    depth: true,
    stencil: false,
    antialias: true,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    throwError: true,
    gl: null,
    viewport: {},
    maxJointNumber: 20,
    __currentFrameBuffer: null,
    _viewportStack: [],
    _clearStack: [],
    _sceneRendering: null
  };
}, function() {
  if (!this.canvas) {
    this.canvas = vendor$1.createCanvas();
  }
  var canvas = this.canvas;
  try {
    var opts = {
      alpha: this.alpha,
      depth: this.depth,
      stencil: this.stencil,
      antialias: this.antialias,
      premultipliedAlpha: this.premultipliedAlpha,
      preserveDrawingBuffer: this.preserveDrawingBuffer
    };
    this.gl = canvas.getContext("webgl", opts) || canvas.getContext("experimental-webgl", opts);
    if (!this.gl) {
      throw new Error();
    }
    this._glinfo = new GLInfo(this.gl);
    if (this.gl.targetRenderer) {
      console.error("Already created a renderer");
    }
    this.gl.targetRenderer = this;
    this.resize();
  } catch (e2) {
    throw "Error creating WebGL Context " + e2;
  }
  this._programMgr = new ProgramManager(this);
  this._placeholderTexture = new PlaceHolderTexture(this);
}, {
  resize: function(width, height) {
    var canvas = this.canvas;
    var dpr = this.devicePixelRatio;
    if (width != null) {
      if (canvas.style) {
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
      }
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      this._width = width;
      this._height = height;
    } else {
      this._width = canvas.width / dpr;
      this._height = canvas.height / dpr;
    }
    this.setViewport(0, 0, this._width, this._height);
  },
  getWidth: function() {
    return this._width;
  },
  getHeight: function() {
    return this._height;
  },
  getViewportAspect: function() {
    var viewport = this.viewport;
    return viewport.width / viewport.height;
  },
  setDevicePixelRatio: function(devicePixelRatio2) {
    this.devicePixelRatio = devicePixelRatio2;
    this.resize(this._width, this._height);
  },
  getDevicePixelRatio: function() {
    return this.devicePixelRatio;
  },
  getGLExtension: function(name) {
    return this._glinfo.getExtension(name);
  },
  getGLParameter: function(name) {
    return this._glinfo.getParameter(name);
  },
  setViewport: function(x, y, width, height, dpr) {
    if (typeof x === "object") {
      var obj = x;
      x = obj.x;
      y = obj.y;
      width = obj.width;
      height = obj.height;
      dpr = obj.devicePixelRatio;
    }
    dpr = dpr || this.devicePixelRatio;
    this.gl.viewport(x * dpr, y * dpr, width * dpr, height * dpr);
    this.viewport = {
      x,
      y,
      width,
      height,
      devicePixelRatio: dpr
    };
  },
  saveViewport: function() {
    this._viewportStack.push(this.viewport);
  },
  restoreViewport: function() {
    if (this._viewportStack.length > 0) {
      this.setViewport(this._viewportStack.pop());
    }
  },
  saveClear: function() {
    this._clearStack.push({
      clearBit: this.clearBit,
      clearColor: this.clearColor
    });
  },
  restoreClear: function() {
    if (this._clearStack.length > 0) {
      var opt = this._clearStack.pop();
      this.clearColor = opt.clearColor;
      this.clearBit = opt.clearBit;
    }
  },
  bindSceneRendering: function(scene) {
    this._sceneRendering = scene;
  },
  render: function(scene, camera2, notUpdateScene, preZ) {
    var _gl = this.gl;
    var clearColor = this.clearColor;
    if (this.clearBit) {
      _gl.colorMask(true, true, true, true);
      _gl.depthMask(true);
      var viewport = this.viewport;
      var needsScissor = false;
      var viewportDpr = viewport.devicePixelRatio;
      if (viewport.width !== this._width || viewport.height !== this._height || viewportDpr && viewportDpr !== this.devicePixelRatio || viewport.x || viewport.y) {
        needsScissor = true;
        _gl.enable(_gl.SCISSOR_TEST);
        _gl.scissor(viewport.x * viewportDpr, viewport.y * viewportDpr, viewport.width * viewportDpr, viewport.height * viewportDpr);
      }
      _gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
      _gl.clear(this.clearBit);
      if (needsScissor) {
        _gl.disable(_gl.SCISSOR_TEST);
      }
    }
    if (!notUpdateScene) {
      scene.update(false);
    }
    scene.updateLights();
    camera2 = camera2 || scene.getMainCamera();
    if (!camera2) {
      console.error("Can't find camera in the scene.");
      return;
    }
    camera2.update();
    var renderList = scene.updateRenderList(camera2, true);
    this._sceneRendering = scene;
    var opaqueList = renderList.opaque;
    var transparentList = renderList.transparent;
    var sceneMaterial = scene.material;
    scene.trigger("beforerender", this, scene, camera2, renderList);
    if (preZ) {
      this.renderPreZ(opaqueList, scene, camera2);
      _gl.depthFunc(_gl.LEQUAL);
    } else {
      _gl.depthFunc(_gl.LESS);
    }
    var worldViewMat = mat4Create();
    var posViewSpace = vec3$8.create();
    for (var i = 0; i < transparentList.length; i++) {
      var renderable = transparentList[i];
      mat4$2.multiplyAffine(worldViewMat, camera2.viewMatrix.array, renderable.worldTransform.array);
      vec3$8.transformMat4(posViewSpace, renderable.position.array, worldViewMat);
      renderable.__depth = posViewSpace[2];
    }
    this.renderPass(opaqueList, camera2, {
      getMaterial: function(renderable2) {
        return sceneMaterial || renderable2.material;
      },
      sortCompare: this.opaqueSortCompare
    });
    this.renderPass(transparentList, camera2, {
      getMaterial: function(renderable2) {
        return sceneMaterial || renderable2.material;
      },
      sortCompare: this.transparentSortCompare
    });
    scene.trigger("afterrender", this, scene, camera2, renderList);
    this._sceneRendering = null;
  },
  getProgram: function(renderable, renderMaterial, scene) {
    renderMaterial = renderMaterial || renderable.material;
    return this._programMgr.getProgram(renderable, renderMaterial, scene);
  },
  validateProgram: function(program) {
    if (program.__error) {
      var errorMsg = program.__error;
      if (errorShader[program.__uid__]) {
        return;
      }
      errorShader[program.__uid__] = true;
      if (this.throwError) {
        throw new Error(errorMsg);
      } else {
        this.trigger("error", errorMsg);
      }
    }
  },
  updatePrograms: function(list, scene, passConfig) {
    var getMaterial = passConfig && passConfig.getMaterial || defaultGetMaterial;
    scene = scene || null;
    for (var i = 0; i < list.length; i++) {
      var renderable = list[i];
      var renderMaterial = getMaterial.call(this, renderable);
      if (i > 0) {
        var prevRenderable = list[i - 1];
        var prevJointsLen = prevRenderable.joints ? prevRenderable.joints.length : 0;
        var jointsLen = renderable.joints ? renderable.joints.length : 0;
        if (jointsLen === prevJointsLen && renderable.material === prevRenderable.material && renderable.lightGroup === prevRenderable.lightGroup) {
          renderable.__program = prevRenderable.__program;
          continue;
        }
      }
      var program = this._programMgr.getProgram(renderable, renderMaterial, scene);
      this.validateProgram(program);
      renderable.__program = program;
    }
  },
  renderPass: function(list, camera2, passConfig) {
    this.trigger("beforerenderpass", this, list, camera2, passConfig);
    passConfig = passConfig || {};
    passConfig.getMaterial = passConfig.getMaterial || defaultGetMaterial;
    passConfig.getUniform = passConfig.getUniform || defaultGetUniform;
    passConfig.isMaterialChanged = passConfig.isMaterialChanged || defaultIsMaterialChanged;
    passConfig.beforeRender = passConfig.beforeRender || noop;
    passConfig.afterRender = passConfig.afterRender || noop;
    var ifRenderObject = passConfig.ifRender || defaultIfRender;
    this.updatePrograms(list, this._sceneRendering, passConfig);
    if (passConfig.sortCompare) {
      list.sort(passConfig.sortCompare);
    }
    var viewport = this.viewport;
    var vDpr = viewport.devicePixelRatio;
    var viewportUniform = [viewport.x * vDpr, viewport.y * vDpr, viewport.width * vDpr, viewport.height * vDpr];
    var windowDpr = this.devicePixelRatio;
    var windowSizeUniform = this.__currentFrameBuffer ? [this.__currentFrameBuffer.getTextureWidth(), this.__currentFrameBuffer.getTextureHeight()] : [this._width * windowDpr, this._height * windowDpr];
    var viewportSizeUniform = [viewportUniform[2], viewportUniform[3]];
    var time = Date.now();
    if (camera2) {
      mat4$2.copy(matrices.VIEW, camera2.viewMatrix.array);
      mat4$2.copy(matrices.PROJECTION, camera2.projectionMatrix.array);
      mat4$2.copy(matrices.VIEWINVERSE, camera2.worldTransform.array);
    } else {
      mat4$2.identity(matrices.VIEW);
      mat4$2.identity(matrices.PROJECTION);
      mat4$2.identity(matrices.VIEWINVERSE);
    }
    mat4$2.multiply(matrices.VIEWPROJECTION, matrices.PROJECTION, matrices.VIEW);
    mat4$2.invert(matrices.PROJECTIONINVERSE, matrices.PROJECTION);
    mat4$2.invert(matrices.VIEWPROJECTIONINVERSE, matrices.VIEWPROJECTION);
    var _gl = this.gl;
    var scene = this._sceneRendering;
    var prevMaterial;
    var prevProgram;
    var prevRenderable;
    var depthTest, depthMask;
    var culling, cullFace, frontFace;
    var transparent;
    var drawID;
    var currentVAO;
    var materialTakesTextureSlot;
    var vaoExt = null;
    for (var i = 0; i < list.length; i++) {
      var renderable = list[i];
      var isSceneNode = renderable.worldTransform != null;
      var worldM;
      if (!ifRenderObject(renderable)) {
        continue;
      }
      if (isSceneNode) {
        worldM = renderable.isSkinnedMesh && renderable.isSkinnedMesh() ? renderable.offsetMatrix ? renderable.offsetMatrix.array : matrices.IDENTITY : renderable.worldTransform.array;
      }
      var geometry = renderable.geometry;
      var material = passConfig.getMaterial.call(this, renderable);
      var program = renderable.__program;
      var shader = material.shader;
      var currentDrawID = geometry.__uid__ + "-" + program.__uid__;
      var drawIDChanged = currentDrawID !== drawID;
      drawID = currentDrawID;
      if (drawIDChanged && vaoExt) {
        vaoExt.bindVertexArrayOES(null);
      }
      if (isSceneNode) {
        mat4$2.copy(matrices.WORLD, worldM);
        mat4$2.multiply(matrices.WORLDVIEWPROJECTION, matrices.VIEWPROJECTION, worldM);
        mat4$2.multiplyAffine(matrices.WORLDVIEW, matrices.VIEW, worldM);
        if (shader.matrixSemantics.WORLDINVERSE || shader.matrixSemantics.WORLDINVERSETRANSPOSE) {
          mat4$2.invert(matrices.WORLDINVERSE, worldM);
        }
        if (shader.matrixSemantics.WORLDVIEWINVERSE || shader.matrixSemantics.WORLDVIEWINVERSETRANSPOSE) {
          mat4$2.invert(matrices.WORLDVIEWINVERSE, matrices.WORLDVIEW);
        }
        if (shader.matrixSemantics.WORLDVIEWPROJECTIONINVERSE || shader.matrixSemantics.WORLDVIEWPROJECTIONINVERSETRANSPOSE) {
          mat4$2.invert(matrices.WORLDVIEWPROJECTIONINVERSE, matrices.WORLDVIEWPROJECTION);
        }
      }
      renderable.beforeRender && renderable.beforeRender(this);
      passConfig.beforeRender.call(this, renderable, material, prevMaterial);
      var programChanged = program !== prevProgram;
      if (programChanged) {
        program.bind(this);
        program.setUniformOfSemantic(_gl, "VIEWPORT", viewportUniform);
        program.setUniformOfSemantic(_gl, "WINDOW_SIZE", windowSizeUniform);
        if (camera2) {
          program.setUniformOfSemantic(_gl, "NEAR", camera2.near);
          program.setUniformOfSemantic(_gl, "FAR", camera2.far);
        }
        program.setUniformOfSemantic(_gl, "DEVICEPIXELRATIO", vDpr);
        program.setUniformOfSemantic(_gl, "TIME", time);
        program.setUniformOfSemantic(_gl, "VIEWPORT_SIZE", viewportSizeUniform);
        if (scene) {
          scene.setLightUniforms(program, renderable.lightGroup, this);
        }
      } else {
        program = prevProgram;
      }
      if (programChanged || passConfig.isMaterialChanged(renderable, prevRenderable, material, prevMaterial)) {
        if (material.depthTest !== depthTest) {
          material.depthTest ? _gl.enable(_gl.DEPTH_TEST) : _gl.disable(_gl.DEPTH_TEST);
          depthTest = material.depthTest;
        }
        if (material.depthMask !== depthMask) {
          _gl.depthMask(material.depthMask);
          depthMask = material.depthMask;
        }
        if (material.transparent !== transparent) {
          material.transparent ? _gl.enable(_gl.BLEND) : _gl.disable(_gl.BLEND);
          transparent = material.transparent;
        }
        if (material.transparent) {
          if (material.blend) {
            material.blend(_gl);
          } else {
            _gl.blendEquationSeparate(_gl.FUNC_ADD, _gl.FUNC_ADD);
            _gl.blendFuncSeparate(_gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA, _gl.ONE, _gl.ONE_MINUS_SRC_ALPHA);
          }
        }
        materialTakesTextureSlot = this._bindMaterial(renderable, material, program, prevRenderable || null, prevMaterial || null, prevProgram || null, passConfig.getUniform);
        prevMaterial = material;
      }
      var matrixSemanticKeys = shader.matrixSemanticKeys;
      if (isSceneNode) {
        for (var k = 0; k < matrixSemanticKeys.length; k++) {
          var semantic = matrixSemanticKeys[k];
          var semanticInfo = shader.matrixSemantics[semantic];
          var matrix = matrices[semantic];
          if (semanticInfo.isTranspose) {
            var matrixNoTranspose = matrices[semanticInfo.semanticNoTranspose];
            mat4$2.transpose(matrix, matrixNoTranspose);
          }
          program.setUniform(_gl, semanticInfo.type, semanticInfo.symbol, matrix);
        }
      }
      if (renderable.cullFace !== cullFace) {
        cullFace = renderable.cullFace;
        _gl.cullFace(cullFace);
      }
      if (renderable.frontFace !== frontFace) {
        frontFace = renderable.frontFace;
        _gl.frontFace(frontFace);
      }
      if (renderable.culling !== culling) {
        culling = renderable.culling;
        culling ? _gl.enable(_gl.CULL_FACE) : _gl.disable(_gl.CULL_FACE);
      }
      this._updateSkeleton(renderable, program, materialTakesTextureSlot);
      if (drawIDChanged) {
        currentVAO = this._bindVAO(vaoExt, shader, geometry, program);
      }
      this._renderObject(renderable, currentVAO, program);
      passConfig.afterRender(this, renderable);
      renderable.afterRender && renderable.afterRender(this);
      prevProgram = program;
      prevRenderable = renderable;
    }
    this.trigger("afterrenderpass", this, list, camera2, passConfig);
  },
  getMaxJointNumber: function() {
    return this.maxJointNumber;
  },
  _updateSkeleton: function(object, program, slot) {
    var _gl = this.gl;
    var skeleton = object.skeleton;
    if (skeleton) {
      skeleton.update();
      if (object.joints.length > this.getMaxJointNumber()) {
        var skinMatricesTexture = skeleton.getSubSkinMatricesTexture(object.__uid__, object.joints);
        program.useTextureSlot(this, skinMatricesTexture, slot);
        program.setUniform(_gl, "1i", "skinMatricesTexture", slot);
        program.setUniform(_gl, "1f", "skinMatricesTextureSize", skinMatricesTexture.width);
      } else {
        var skinMatricesArray = skeleton.getSubSkinMatrices(object.__uid__, object.joints);
        program.setUniformOfSemantic(_gl, "SKIN_MATRIX", skinMatricesArray);
      }
    }
  },
  _renderObject: function(renderable, vao, program) {
    var _gl = this.gl;
    var geometry = renderable.geometry;
    var glDrawMode = renderable.mode;
    if (glDrawMode == null) {
      glDrawMode = 4;
    }
    var ext = null;
    var isInstanced = renderable.isInstancedMesh && renderable.isInstancedMesh();
    if (isInstanced) {
      ext = this.getGLExtension("ANGLE_instanced_arrays");
      if (!ext) {
        console.warn("Device not support ANGLE_instanced_arrays extension");
        return;
      }
    }
    var instancedAttrLocations;
    if (isInstanced) {
      instancedAttrLocations = this._bindInstancedAttributes(renderable, program, ext);
    }
    if (vao.indicesBuffer) {
      var uintExt = this.getGLExtension("OES_element_index_uint");
      var useUintExt = uintExt && geometry.indices instanceof Uint32Array;
      var indicesType = useUintExt ? _gl.UNSIGNED_INT : _gl.UNSIGNED_SHORT;
      if (isInstanced) {
        ext.drawElementsInstancedANGLE(glDrawMode, vao.indicesBuffer.count, indicesType, 0, renderable.getInstanceCount());
      } else {
        _gl.drawElements(glDrawMode, vao.indicesBuffer.count, indicesType, 0);
      }
    } else {
      if (isInstanced) {
        ext.drawArraysInstancedANGLE(glDrawMode, 0, geometry.vertexCount, renderable.getInstanceCount());
      } else {
        _gl.drawArrays(glDrawMode, 0, geometry.vertexCount);
      }
    }
    if (isInstanced) {
      for (var i = 0; i < instancedAttrLocations.length; i++) {
        _gl.disableVertexAttribArray(instancedAttrLocations[i]);
      }
    }
  },
  _bindInstancedAttributes: function(renderable, program, ext) {
    var _gl = this.gl;
    var instancedBuffers = renderable.getInstancedAttributesBuffers(this);
    var locations = [];
    for (var i = 0; i < instancedBuffers.length; i++) {
      var bufferObj = instancedBuffers[i];
      var location = program.getAttribLocation(_gl, bufferObj.symbol);
      if (location < 0) {
        continue;
      }
      var glType = attributeBufferTypeMap[bufferObj.type] || _gl.FLOAT;
      _gl.enableVertexAttribArray(location);
      _gl.bindBuffer(_gl.ARRAY_BUFFER, bufferObj.buffer);
      _gl.vertexAttribPointer(location, bufferObj.size, glType, false, 0, 0);
      ext.vertexAttribDivisorANGLE(location, bufferObj.divisor);
      locations.push(location);
    }
    return locations;
  },
  _bindMaterial: function(renderable, material, program, prevRenderable, prevMaterial, prevProgram, getUniformValue) {
    var _gl = this.gl;
    var sameProgram = prevProgram === program;
    var currentTextureSlot = program.currentTextureSlot();
    var enabledUniforms = material.getEnabledUniforms();
    var textureUniforms = material.getTextureUniforms();
    var placeholderTexture = this._placeholderTexture;
    for (var u = 0; u < textureUniforms.length; u++) {
      var symbol = textureUniforms[u];
      var uniformValue = getUniformValue(renderable, material, symbol);
      var uniformType = material.uniforms[symbol].type;
      if (uniformType === "t" && uniformValue) {
        uniformValue.__slot = -1;
      } else if (uniformType === "tv") {
        for (var i = 0; i < uniformValue.length; i++) {
          if (uniformValue[i]) {
            uniformValue[i].__slot = -1;
          }
        }
      }
    }
    placeholderTexture.__slot = -1;
    for (var u = 0; u < enabledUniforms.length; u++) {
      var symbol = enabledUniforms[u];
      var uniform = material.uniforms[symbol];
      var uniformValue = getUniformValue(renderable, material, symbol);
      var uniformType = uniform.type;
      var isTexture = uniformType === "t";
      if (isTexture) {
        if (!uniformValue || !uniformValue.isRenderable()) {
          uniformValue = placeholderTexture;
        }
      }
      if (prevMaterial && sameProgram) {
        var prevUniformValue = getUniformValue(prevRenderable, prevMaterial, symbol);
        if (isTexture) {
          if (!prevUniformValue || !prevUniformValue.isRenderable()) {
            prevUniformValue = placeholderTexture;
          }
        }
        if (prevUniformValue === uniformValue) {
          if (isTexture) {
            program.takeCurrentTextureSlot(this, null);
          } else if (uniformType === "tv" && uniformValue) {
            for (var i = 0; i < uniformValue.length; i++) {
              program.takeCurrentTextureSlot(this, null);
            }
          }
          continue;
        }
      }
      if (uniformValue == null) {
        continue;
      } else if (isTexture) {
        if (uniformValue.__slot < 0) {
          var slot = program.currentTextureSlot();
          var res = program.setUniform(_gl, "1i", symbol, slot);
          if (res) {
            program.takeCurrentTextureSlot(this, uniformValue);
            uniformValue.__slot = slot;
          }
        } else {
          program.setUniform(_gl, "1i", symbol, uniformValue.__slot);
        }
      } else if (Array.isArray(uniformValue)) {
        if (uniformValue.length === 0) {
          continue;
        }
        if (uniformType === "tv") {
          if (!program.hasUniform(symbol)) {
            continue;
          }
          var arr = [];
          for (var i = 0; i < uniformValue.length; i++) {
            var texture = uniformValue[i];
            if (texture.__slot < 0) {
              var slot = program.currentTextureSlot();
              arr.push(slot);
              program.takeCurrentTextureSlot(this, texture);
              texture.__slot = slot;
            } else {
              arr.push(texture.__slot);
            }
          }
          program.setUniform(_gl, "1iv", symbol, arr);
        } else {
          program.setUniform(_gl, uniform.type, symbol, uniformValue);
        }
      } else {
        program.setUniform(_gl, uniform.type, symbol, uniformValue);
      }
    }
    var newSlot = program.currentTextureSlot();
    program.resetTextureSlot(currentTextureSlot);
    return newSlot;
  },
  _bindVAO: function(vaoExt, shader, geometry, program) {
    var isStatic = !geometry.dynamic;
    var _gl = this.gl;
    var vaoId = this.__uid__ + "-" + program.__uid__;
    var vao = geometry.__vaoCache[vaoId];
    if (!vao) {
      var chunks = geometry.getBufferChunks(this);
      if (!chunks || !chunks.length) {
        return;
      }
      var chunk = chunks[0];
      var attributeBuffers = chunk.attributeBuffers;
      var indicesBuffer = chunk.indicesBuffer;
      var availableAttributes = [];
      var availableAttributeSymbols = [];
      for (var a = 0; a < attributeBuffers.length; a++) {
        var attributeBufferInfo = attributeBuffers[a];
        var name = attributeBufferInfo.name;
        var semantic = attributeBufferInfo.semantic;
        var symbol;
        if (semantic) {
          var semanticInfo = shader.attributeSemantics[semantic];
          symbol = semanticInfo && semanticInfo.symbol;
        } else {
          symbol = name;
        }
        if (symbol && program.attributes[symbol]) {
          availableAttributes.push(attributeBufferInfo);
          availableAttributeSymbols.push(symbol);
        }
      }
      vao = new VertexArrayObject(availableAttributes, availableAttributeSymbols, indicesBuffer);
      if (isStatic) {
        geometry.__vaoCache[vaoId] = vao;
      }
    }
    var needsBindAttributes = true;
    if (vaoExt && isStatic) {
      if (vao.vao == null) {
        vao.vao = vaoExt.createVertexArrayOES();
      } else {
        needsBindAttributes = false;
      }
      vaoExt.bindVertexArrayOES(vao.vao);
    }
    var availableAttributes = vao.availableAttributes;
    var indicesBuffer = vao.indicesBuffer;
    if (needsBindAttributes) {
      var locationList = program.enableAttributes(this, vao.availableAttributeSymbols, vaoExt && isStatic && vao);
      for (var a = 0; a < availableAttributes.length; a++) {
        var location = locationList[a];
        if (location === -1) {
          continue;
        }
        var attributeBufferInfo = availableAttributes[a];
        var buffer = attributeBufferInfo.buffer;
        var size = attributeBufferInfo.size;
        var glType = attributeBufferTypeMap[attributeBufferInfo.type] || _gl.FLOAT;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
        _gl.vertexAttribPointer(location, size, glType, false, 0, 0);
      }
      if (geometry.isUseIndices()) {
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, indicesBuffer.buffer);
      }
    }
    return vao;
  },
  renderPreZ: function(list, scene, camera2) {
    var _gl = this.gl;
    var preZPassMaterial = this._prezMaterial || new Material$1({
      shader: new Shader(Shader.source("clay.prez.vertex"), Shader.source("clay.prez.fragment"))
    });
    this._prezMaterial = preZPassMaterial;
    _gl.colorMask(false, false, false, false);
    _gl.depthMask(true);
    this.renderPass(list, camera2, {
      ifRender: function(renderable) {
        return !renderable.ignorePreZ;
      },
      isMaterialChanged: function(renderable, prevRenderable) {
        var matA = renderable.material;
        var matB = prevRenderable.material;
        return matA.get("diffuseMap") !== matB.get("diffuseMap") || (matA.get("alphaCutoff") || 0) !== (matB.get("alphaCutoff") || 0);
      },
      getUniform: function(renderable, depthMaterial, symbol) {
        if (symbol === "alphaMap") {
          return renderable.material.get("diffuseMap");
        } else if (symbol === "alphaCutoff") {
          if (renderable.material.isDefined("fragment", "ALPHA_TEST") && renderable.material.get("diffuseMap")) {
            var alphaCutoff = renderable.material.get("alphaCutoff");
            return alphaCutoff || 0;
          }
          return 0;
        } else if (symbol === "uvRepeat") {
          return renderable.material.get("uvRepeat");
        } else if (symbol === "uvOffset") {
          return renderable.material.get("uvOffset");
        } else {
          return depthMaterial.get(symbol);
        }
      },
      getMaterial: function() {
        return preZPassMaterial;
      },
      sort: this.opaqueSortCompare
    });
    _gl.colorMask(true, true, true, true);
    _gl.depthMask(true);
  },
  disposeScene: function(scene) {
    this.disposeNode(scene, true, true);
    scene.dispose();
  },
  disposeNode: function(root, disposeGeometry, disposeTexture) {
    if (root.getParent()) {
      root.getParent().remove(root);
    }
    var disposedMap = {};
    root.traverse(function(node) {
      var material = node.material;
      if (node.geometry && disposeGeometry) {
        node.geometry.dispose(this);
      }
      if (disposeTexture && material && !disposedMap[material.__uid__]) {
        var textureUniforms = material.getTextureUniforms();
        for (var u = 0; u < textureUniforms.length; u++) {
          var uniformName = textureUniforms[u];
          var val = material.uniforms[uniformName].value;
          var uniformType = material.uniforms[uniformName].type;
          if (!val) {
            continue;
          }
          if (uniformType === "t") {
            val.dispose && val.dispose(this);
          } else if (uniformType === "tv") {
            for (var k = 0; k < val.length; k++) {
              if (val[k]) {
                val[k].dispose && val[k].dispose(this);
              }
            }
          }
        }
        disposedMap[material.__uid__] = true;
      }
      if (node.dispose) {
        node.dispose(this);
      }
    }, this);
  },
  disposeGeometry: function(geometry) {
    geometry.dispose(this);
  },
  disposeTexture: function(texture) {
    texture.dispose(this);
  },
  disposeFrameBuffer: function(frameBuffer) {
    frameBuffer.dispose(this);
  },
  dispose: function() {
  },
  screenToNDC: function(x, y, out) {
    if (!out) {
      out = new Vector2$1();
    }
    y = this._height - y;
    var viewport = this.viewport;
    var arr = out.array;
    arr[0] = (x - viewport.x) / viewport.width;
    arr[0] = arr[0] * 2 - 1;
    arr[1] = (y - viewport.y) / viewport.height;
    arr[1] = arr[1] * 2 - 1;
    return out;
  }
});
Renderer.opaqueSortCompare = Renderer.prototype.opaqueSortCompare = function(x, y) {
  if (x.renderOrder === y.renderOrder) {
    if (x.__program === y.__program) {
      if (x.material === y.material) {
        return x.geometry.__uid__ - y.geometry.__uid__;
      }
      return x.material.__uid__ - y.material.__uid__;
    }
    if (x.__program && y.__program) {
      return x.__program.__uid__ - y.__program.__uid__;
    }
    return 0;
  }
  return x.renderOrder - y.renderOrder;
};
Renderer.transparentSortCompare = Renderer.prototype.transparentSortCompare = function(x, y) {
  if (x.renderOrder === y.renderOrder) {
    if (x.__depth === y.__depth) {
      if (x.__program === y.__program) {
        if (x.material === y.material) {
          return x.geometry.__uid__ - y.geometry.__uid__;
        }
        return x.material.__uid__ - y.material.__uid__;
      }
      if (x.__program && y.__program) {
        return x.__program.__uid__ - y.__program.__uid__;
      }
      return 0;
    }
    return x.__depth - y.__depth;
  }
  return x.renderOrder - y.renderOrder;
};
var matrices = {
  IDENTITY: mat4Create(),
  WORLD: mat4Create(),
  VIEW: mat4Create(),
  PROJECTION: mat4Create(),
  WORLDVIEW: mat4Create(),
  VIEWPROJECTION: mat4Create(),
  WORLDVIEWPROJECTION: mat4Create(),
  WORLDINVERSE: mat4Create(),
  VIEWINVERSE: mat4Create(),
  PROJECTIONINVERSE: mat4Create(),
  WORLDVIEWINVERSE: mat4Create(),
  VIEWPROJECTIONINVERSE: mat4Create(),
  WORLDVIEWPROJECTIONINVERSE: mat4Create(),
  WORLDTRANSPOSE: mat4Create(),
  VIEWTRANSPOSE: mat4Create(),
  PROJECTIONTRANSPOSE: mat4Create(),
  WORLDVIEWTRANSPOSE: mat4Create(),
  VIEWPROJECTIONTRANSPOSE: mat4Create(),
  WORLDVIEWPROJECTIONTRANSPOSE: mat4Create(),
  WORLDINVERSETRANSPOSE: mat4Create(),
  VIEWINVERSETRANSPOSE: mat4Create(),
  PROJECTIONINVERSETRANSPOSE: mat4Create(),
  WORLDVIEWINVERSETRANSPOSE: mat4Create(),
  VIEWPROJECTIONINVERSETRANSPOSE: mat4Create(),
  WORLDVIEWPROJECTIONINVERSETRANSPOSE: mat4Create()
};
Renderer.COLOR_BUFFER_BIT = glenum.COLOR_BUFFER_BIT;
Renderer.DEPTH_BUFFER_BIT = glenum.DEPTH_BUFFER_BIT;
Renderer.STENCIL_BUFFER_BIT = glenum.STENCIL_BUFFER_BIT;
var Renderer$1 = Renderer;
var Vector3 = function(x, y, z) {
  x = x || 0;
  y = y || 0;
  z = z || 0;
  this.array = vec3$8.fromValues(x, y, z);
  this._dirty = true;
};
Vector3.prototype = {
  constructor: Vector3,
  add: function(b) {
    vec3$8.add(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  set: function(x, y, z) {
    this.array[0] = x;
    this.array[1] = y;
    this.array[2] = z;
    this._dirty = true;
    return this;
  },
  setArray: function(arr) {
    this.array[0] = arr[0];
    this.array[1] = arr[1];
    this.array[2] = arr[2];
    this._dirty = true;
    return this;
  },
  clone: function() {
    return new Vector3(this.x, this.y, this.z);
  },
  copy: function(b) {
    vec3$8.copy(this.array, b.array);
    this._dirty = true;
    return this;
  },
  cross: function(a, b) {
    vec3$8.cross(this.array, a.array, b.array);
    this._dirty = true;
    return this;
  },
  dist: function(b) {
    return vec3$8.dist(this.array, b.array);
  },
  distance: function(b) {
    return vec3$8.distance(this.array, b.array);
  },
  div: function(b) {
    vec3$8.div(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  divide: function(b) {
    vec3$8.divide(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  dot: function(b) {
    return vec3$8.dot(this.array, b.array);
  },
  len: function() {
    return vec3$8.len(this.array);
  },
  length: function() {
    return vec3$8.length(this.array);
  },
  lerp: function(a, b, t) {
    vec3$8.lerp(this.array, a.array, b.array, t);
    this._dirty = true;
    return this;
  },
  min: function(b) {
    vec3$8.min(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  max: function(b) {
    vec3$8.max(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  mul: function(b) {
    vec3$8.mul(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  multiply: function(b) {
    vec3$8.multiply(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  negate: function() {
    vec3$8.negate(this.array, this.array);
    this._dirty = true;
    return this;
  },
  normalize: function() {
    vec3$8.normalize(this.array, this.array);
    this._dirty = true;
    return this;
  },
  random: function(scale2) {
    vec3$8.random(this.array, scale2);
    this._dirty = true;
    return this;
  },
  scale: function(s) {
    vec3$8.scale(this.array, this.array, s);
    this._dirty = true;
    return this;
  },
  scaleAndAdd: function(b, s) {
    vec3$8.scaleAndAdd(this.array, this.array, b.array, s);
    this._dirty = true;
    return this;
  },
  sqrDist: function(b) {
    return vec3$8.sqrDist(this.array, b.array);
  },
  squaredDistance: function(b) {
    return vec3$8.squaredDistance(this.array, b.array);
  },
  sqrLen: function() {
    return vec3$8.sqrLen(this.array);
  },
  squaredLength: function() {
    return vec3$8.squaredLength(this.array);
  },
  sub: function(b) {
    vec3$8.sub(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  subtract: function(b) {
    vec3$8.subtract(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  transformMat3: function(m) {
    vec3$8.transformMat3(this.array, this.array, m.array);
    this._dirty = true;
    return this;
  },
  transformMat4: function(m) {
    vec3$8.transformMat4(this.array, this.array, m.array);
    this._dirty = true;
    return this;
  },
  transformQuat: function(q) {
    vec3$8.transformQuat(this.array, this.array, q.array);
    this._dirty = true;
    return this;
  },
  applyProjection: function(m) {
    var v = this.array;
    m = m.array;
    if (m[15] === 0) {
      var w = -1 / v[2];
      v[0] = m[0] * v[0] * w;
      v[1] = m[5] * v[1] * w;
      v[2] = (m[10] * v[2] + m[14]) * w;
    } else {
      v[0] = m[0] * v[0] + m[12];
      v[1] = m[5] * v[1] + m[13];
      v[2] = m[10] * v[2] + m[14];
    }
    this._dirty = true;
    return this;
  },
  eulerFromQuat: function(q, order) {
    Vector3.eulerFromQuat(this, q, order);
  },
  eulerFromMat3: function(m, order) {
    Vector3.eulerFromMat3(this, m, order);
  },
  toString: function() {
    return "[" + Array.prototype.join.call(this.array, ",") + "]";
  },
  toArray: function() {
    return Array.prototype.slice.call(this.array);
  }
};
var defineProperty$3 = Object.defineProperty;
if (defineProperty$3) {
  var proto$3 = Vector3.prototype;
  defineProperty$3(proto$3, "x", {
    get: function() {
      return this.array[0];
    },
    set: function(value) {
      this.array[0] = value;
      this._dirty = true;
    }
  });
  defineProperty$3(proto$3, "y", {
    get: function() {
      return this.array[1];
    },
    set: function(value) {
      this.array[1] = value;
      this._dirty = true;
    }
  });
  defineProperty$3(proto$3, "z", {
    get: function() {
      return this.array[2];
    },
    set: function(value) {
      this.array[2] = value;
      this._dirty = true;
    }
  });
}
Vector3.add = function(out, a, b) {
  vec3$8.add(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector3.set = function(out, x, y, z) {
  vec3$8.set(out.array, x, y, z);
  out._dirty = true;
};
Vector3.copy = function(out, b) {
  vec3$8.copy(out.array, b.array);
  out._dirty = true;
  return out;
};
Vector3.cross = function(out, a, b) {
  vec3$8.cross(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector3.dist = function(a, b) {
  return vec3$8.distance(a.array, b.array);
};
Vector3.distance = Vector3.dist;
Vector3.div = function(out, a, b) {
  vec3$8.divide(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector3.divide = Vector3.div;
Vector3.dot = function(a, b) {
  return vec3$8.dot(a.array, b.array);
};
Vector3.len = function(b) {
  return vec3$8.length(b.array);
};
Vector3.lerp = function(out, a, b, t) {
  vec3$8.lerp(out.array, a.array, b.array, t);
  out._dirty = true;
  return out;
};
Vector3.min = function(out, a, b) {
  vec3$8.min(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector3.max = function(out, a, b) {
  vec3$8.max(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector3.mul = function(out, a, b) {
  vec3$8.multiply(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector3.multiply = Vector3.mul;
Vector3.negate = function(out, a) {
  vec3$8.negate(out.array, a.array);
  out._dirty = true;
  return out;
};
Vector3.normalize = function(out, a) {
  vec3$8.normalize(out.array, a.array);
  out._dirty = true;
  return out;
};
Vector3.random = function(out, scale2) {
  vec3$8.random(out.array, scale2);
  out._dirty = true;
  return out;
};
Vector3.scale = function(out, a, scale2) {
  vec3$8.scale(out.array, a.array, scale2);
  out._dirty = true;
  return out;
};
Vector3.scaleAndAdd = function(out, a, b, scale2) {
  vec3$8.scaleAndAdd(out.array, a.array, b.array, scale2);
  out._dirty = true;
  return out;
};
Vector3.sqrDist = function(a, b) {
  return vec3$8.sqrDist(a.array, b.array);
};
Vector3.squaredDistance = Vector3.sqrDist;
Vector3.sqrLen = function(a) {
  return vec3$8.sqrLen(a.array);
};
Vector3.squaredLength = Vector3.sqrLen;
Vector3.sub = function(out, a, b) {
  vec3$8.subtract(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector3.subtract = Vector3.sub;
Vector3.transformMat3 = function(out, a, m) {
  vec3$8.transformMat3(out.array, a.array, m.array);
  out._dirty = true;
  return out;
};
Vector3.transformMat4 = function(out, a, m) {
  vec3$8.transformMat4(out.array, a.array, m.array);
  out._dirty = true;
  return out;
};
Vector3.transformQuat = function(out, a, q) {
  vec3$8.transformQuat(out.array, a.array, q.array);
  out._dirty = true;
  return out;
};
function clamp(val, min, max) {
  return val < min ? min : val > max ? max : val;
}
var atan2 = Math.atan2;
var asin$1 = Math.asin;
var abs = Math.abs;
Vector3.eulerFromQuat = function(out, q, order) {
  out._dirty = true;
  q = q.array;
  var target = out.array;
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x * x;
  var y2 = y * y;
  var z2 = z * z;
  var w2 = w * w;
  var order = (order || "XYZ").toUpperCase();
  switch (order) {
    case "XYZ":
      target[0] = atan2(2 * (x * w - y * z), w2 - x2 - y2 + z2);
      target[1] = asin$1(clamp(2 * (x * z + y * w), -1, 1));
      target[2] = atan2(2 * (z * w - x * y), w2 + x2 - y2 - z2);
      break;
    case "YXZ":
      target[0] = asin$1(clamp(2 * (x * w - y * z), -1, 1));
      target[1] = atan2(2 * (x * z + y * w), w2 - x2 - y2 + z2);
      target[2] = atan2(2 * (x * y + z * w), w2 - x2 + y2 - z2);
      break;
    case "ZXY":
      target[0] = asin$1(clamp(2 * (x * w + y * z), -1, 1));
      target[1] = atan2(2 * (y * w - z * x), w2 - x2 - y2 + z2);
      target[2] = atan2(2 * (z * w - x * y), w2 - x2 + y2 - z2);
      break;
    case "ZYX":
      target[0] = atan2(2 * (x * w + z * y), w2 - x2 - y2 + z2);
      target[1] = asin$1(clamp(2 * (y * w - x * z), -1, 1));
      target[2] = atan2(2 * (x * y + z * w), w2 + x2 - y2 - z2);
      break;
    case "YZX":
      target[0] = atan2(2 * (x * w - z * y), w2 - x2 + y2 - z2);
      target[1] = atan2(2 * (y * w - x * z), w2 + x2 - y2 - z2);
      target[2] = asin$1(clamp(2 * (x * y + z * w), -1, 1));
      break;
    case "XZY":
      target[0] = atan2(2 * (x * w + y * z), w2 - x2 + y2 - z2);
      target[1] = atan2(2 * (x * z + y * w), w2 + x2 - y2 - z2);
      target[2] = asin$1(clamp(2 * (z * w - x * y), -1, 1));
      break;
    default:
      console.warn("Unkown order: " + order);
  }
  return out;
};
Vector3.eulerFromMat3 = function(out, m, order) {
  var te = m.array;
  var m11 = te[0], m12 = te[3], m13 = te[6];
  var m21 = te[1], m22 = te[4], m23 = te[7];
  var m31 = te[2], m32 = te[5], m33 = te[8];
  var target = out.array;
  var order = (order || "XYZ").toUpperCase();
  switch (order) {
    case "XYZ":
      target[1] = asin$1(clamp(m13, -1, 1));
      if (abs(m13) < 0.99999) {
        target[0] = atan2(-m23, m33);
        target[2] = atan2(-m12, m11);
      } else {
        target[0] = atan2(m32, m22);
        target[2] = 0;
      }
      break;
    case "YXZ":
      target[0] = asin$1(-clamp(m23, -1, 1));
      if (abs(m23) < 0.99999) {
        target[1] = atan2(m13, m33);
        target[2] = atan2(m21, m22);
      } else {
        target[1] = atan2(-m31, m11);
        target[2] = 0;
      }
      break;
    case "ZXY":
      target[0] = asin$1(clamp(m32, -1, 1));
      if (abs(m32) < 0.99999) {
        target[1] = atan2(-m31, m33);
        target[2] = atan2(-m12, m22);
      } else {
        target[1] = 0;
        target[2] = atan2(m21, m11);
      }
      break;
    case "ZYX":
      target[1] = asin$1(-clamp(m31, -1, 1));
      if (abs(m31) < 0.99999) {
        target[0] = atan2(m32, m33);
        target[2] = atan2(m21, m11);
      } else {
        target[0] = 0;
        target[2] = atan2(-m12, m22);
      }
      break;
    case "YZX":
      target[2] = asin$1(clamp(m21, -1, 1));
      if (abs(m21) < 0.99999) {
        target[0] = atan2(-m23, m22);
        target[1] = atan2(-m31, m11);
      } else {
        target[0] = 0;
        target[1] = atan2(m13, m33);
      }
      break;
    case "XZY":
      target[2] = asin$1(-clamp(m12, -1, 1));
      if (abs(m12) < 0.99999) {
        target[0] = atan2(m32, m22);
        target[1] = atan2(m13, m11);
      } else {
        target[0] = atan2(-m23, m33);
        target[1] = 0;
      }
      break;
    default:
      console.warn("Unkown order: " + order);
  }
  out._dirty = true;
  return out;
};
Object.defineProperties(Vector3, {
  POSITIVE_X: {
    get: function() {
      return new Vector3(1, 0, 0);
    }
  },
  NEGATIVE_X: {
    get: function() {
      return new Vector3(-1, 0, 0);
    }
  },
  POSITIVE_Y: {
    get: function() {
      return new Vector3(0, 1, 0);
    }
  },
  NEGATIVE_Y: {
    get: function() {
      return new Vector3(0, -1, 0);
    }
  },
  POSITIVE_Z: {
    get: function() {
      return new Vector3(0, 0, 1);
    }
  },
  NEGATIVE_Z: {
    get: function() {
      return new Vector3(0, 0, -1);
    }
  },
  UP: {
    get: function() {
      return new Vector3(0, 1, 0);
    }
  },
  ZERO: {
    get: function() {
      return new Vector3();
    }
  }
});
var Vector3$1 = Vector3;
var EPSILON = 1e-5;
var Ray = function(origin, direction) {
  this.origin = origin || new Vector3$1();
  this.direction = direction || new Vector3$1();
};
Ray.prototype = {
  constructor: Ray,
  intersectPlane: function(plane, out) {
    var pn = plane.normal.array;
    var d = plane.distance;
    var ro = this.origin.array;
    var rd = this.direction.array;
    var divider = vec3$8.dot(pn, rd);
    if (divider === 0) {
      return null;
    }
    if (!out) {
      out = new Vector3$1();
    }
    var t = (vec3$8.dot(pn, ro) - d) / divider;
    vec3$8.scaleAndAdd(out.array, ro, rd, -t);
    out._dirty = true;
    return out;
  },
  mirrorAgainstPlane: function(plane) {
    var d = vec3$8.dot(plane.normal.array, this.direction.array);
    vec3$8.scaleAndAdd(this.direction.array, this.direction.array, plane.normal.array, -d * 2);
    this.direction._dirty = true;
  },
  distanceToPoint: function() {
    var v = vec3$8.create();
    return function(point) {
      vec3$8.sub(v, point, this.origin.array);
      var b = vec3$8.dot(v, this.direction.array);
      if (b < 0) {
        return vec3$8.distance(this.origin.array, point);
      }
      var c2 = vec3$8.lenSquared(v);
      return Math.sqrt(c2 - b * b);
    };
  }(),
  intersectSphere: function() {
    var v = vec3$8.create();
    return function(center, radius, out) {
      var origin = this.origin.array;
      var direction = this.direction.array;
      center = center.array;
      vec3$8.sub(v, center, origin);
      var b = vec3$8.dot(v, direction);
      var c2 = vec3$8.squaredLength(v);
      var d2 = c2 - b * b;
      var r2 = radius * radius;
      if (d2 > r2) {
        return;
      }
      var a = Math.sqrt(r2 - d2);
      var t0 = b - a;
      var t1 = b + a;
      if (!out) {
        out = new Vector3$1();
      }
      if (t0 < 0) {
        if (t1 < 0) {
          return null;
        } else {
          vec3$8.scaleAndAdd(out.array, origin, direction, t1);
          return out;
        }
      } else {
        vec3$8.scaleAndAdd(out.array, origin, direction, t0);
        return out;
      }
    };
  }(),
  intersectBoundingBox: function(bbox, out) {
    var dir3 = this.direction.array;
    var origin = this.origin.array;
    var min = bbox.min.array;
    var max = bbox.max.array;
    var invdirx = 1 / dir3[0];
    var invdiry = 1 / dir3[1];
    var invdirz = 1 / dir3[2];
    var tmin, tmax, tymin, tymax, tzmin, tzmax;
    if (invdirx >= 0) {
      tmin = (min[0] - origin[0]) * invdirx;
      tmax = (max[0] - origin[0]) * invdirx;
    } else {
      tmax = (min[0] - origin[0]) * invdirx;
      tmin = (max[0] - origin[0]) * invdirx;
    }
    if (invdiry >= 0) {
      tymin = (min[1] - origin[1]) * invdiry;
      tymax = (max[1] - origin[1]) * invdiry;
    } else {
      tymax = (min[1] - origin[1]) * invdiry;
      tymin = (max[1] - origin[1]) * invdiry;
    }
    if (tmin > tymax || tymin > tmax) {
      return null;
    }
    if (tymin > tmin || tmin !== tmin) {
      tmin = tymin;
    }
    if (tymax < tmax || tmax !== tmax) {
      tmax = tymax;
    }
    if (invdirz >= 0) {
      tzmin = (min[2] - origin[2]) * invdirz;
      tzmax = (max[2] - origin[2]) * invdirz;
    } else {
      tzmax = (min[2] - origin[2]) * invdirz;
      tzmin = (max[2] - origin[2]) * invdirz;
    }
    if (tmin > tzmax || tzmin > tmax) {
      return null;
    }
    if (tzmin > tmin || tmin !== tmin) {
      tmin = tzmin;
    }
    if (tzmax < tmax || tmax !== tmax) {
      tmax = tzmax;
    }
    if (tmax < 0) {
      return null;
    }
    var t = tmin >= 0 ? tmin : tmax;
    if (!out) {
      out = new Vector3$1();
    }
    vec3$8.scaleAndAdd(out.array, origin, dir3, t);
    return out;
  },
  intersectTriangle: function() {
    var eBA = vec3$8.create();
    var eCA = vec3$8.create();
    var AO = vec3$8.create();
    var vCross = vec3$8.create();
    return function(a, b, c, singleSided, out, barycenteric) {
      var dir3 = this.direction.array;
      var origin = this.origin.array;
      a = a.array;
      b = b.array;
      c = c.array;
      vec3$8.sub(eBA, b, a);
      vec3$8.sub(eCA, c, a);
      vec3$8.cross(vCross, eCA, dir3);
      var det = vec3$8.dot(eBA, vCross);
      if (singleSided) {
        if (det > -EPSILON) {
          return null;
        }
      } else {
        if (det > -EPSILON && det < EPSILON) {
          return null;
        }
      }
      vec3$8.sub(AO, origin, a);
      var u = vec3$8.dot(vCross, AO) / det;
      if (u < 0 || u > 1) {
        return null;
      }
      vec3$8.cross(vCross, eBA, AO);
      var v = vec3$8.dot(dir3, vCross) / det;
      if (v < 0 || v > 1 || u + v > 1) {
        return null;
      }
      vec3$8.cross(vCross, eBA, eCA);
      var t = -vec3$8.dot(AO, vCross) / det;
      if (t < 0) {
        return null;
      }
      if (!out) {
        out = new Vector3$1();
      }
      if (barycenteric) {
        Vector3$1.set(barycenteric, 1 - u - v, u, v);
      }
      vec3$8.scaleAndAdd(out.array, origin, dir3, t);
      return out;
    };
  }(),
  applyTransform: function(matrix) {
    Vector3$1.add(this.direction, this.direction, this.origin);
    Vector3$1.transformMat4(this.origin, this.origin, matrix);
    Vector3$1.transformMat4(this.direction, this.direction, matrix);
    Vector3$1.sub(this.direction, this.direction, this.origin);
    Vector3$1.normalize(this.direction, this.direction);
  },
  copy: function(ray) {
    Vector3$1.copy(this.origin, ray.origin);
    Vector3$1.copy(this.direction, ray.direction);
  },
  clone: function() {
    var ray = new Ray();
    ray.copy(this);
    return ray;
  }
};
var Ray$1 = Ray;
var vec4 = {};
vec4.create = function() {
  var out = new GLMAT_ARRAY_TYPE(4);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  return out;
};
vec4.clone = function(a) {
  var out = new GLMAT_ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
};
vec4.fromValues = function(x, y, z, w) {
  var out = new GLMAT_ARRAY_TYPE(4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
};
vec4.copy = function(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
};
vec4.set = function(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
};
vec4.add = function(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
};
vec4.subtract = function(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
};
vec4.sub = vec4.subtract;
vec4.multiply = function(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
};
vec4.mul = vec4.multiply;
vec4.divide = function(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
};
vec4.div = vec4.divide;
vec4.min = function(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  out[3] = Math.min(a[3], b[3]);
  return out;
};
vec4.max = function(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  out[3] = Math.max(a[3], b[3]);
  return out;
};
vec4.scale = function(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
};
vec4.scaleAndAdd = function(out, a, b, scale2) {
  out[0] = a[0] + b[0] * scale2;
  out[1] = a[1] + b[1] * scale2;
  out[2] = a[2] + b[2] * scale2;
  out[3] = a[3] + b[3] * scale2;
  return out;
};
vec4.distance = function(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2], w = b[3] - a[3];
  return Math.sqrt(x * x + y * y + z * z + w * w);
};
vec4.dist = vec4.distance;
vec4.squaredDistance = function(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2], w = b[3] - a[3];
  return x * x + y * y + z * z + w * w;
};
vec4.sqrDist = vec4.squaredDistance;
vec4.length = function(a) {
  var x = a[0], y = a[1], z = a[2], w = a[3];
  return Math.sqrt(x * x + y * y + z * z + w * w);
};
vec4.len = vec4.length;
vec4.squaredLength = function(a) {
  var x = a[0], y = a[1], z = a[2], w = a[3];
  return x * x + y * y + z * z + w * w;
};
vec4.sqrLen = vec4.squaredLength;
vec4.negate = function(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = -a[3];
  return out;
};
vec4.inverse = function(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  out[2] = 1 / a[2];
  out[3] = 1 / a[3];
  return out;
};
vec4.normalize = function(out, a) {
  var x = a[0], y = a[1], z = a[2], w = a[3];
  var len = x * x + y * y + z * z + w * w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    out[3] = a[3] * len;
  }
  return out;
};
vec4.dot = function(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};
vec4.lerp = function(out, a, b, t) {
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
};
vec4.random = function(out, scale2) {
  scale2 = scale2 || 1;
  out[0] = GLMAT_RANDOM$1();
  out[1] = GLMAT_RANDOM$1();
  out[2] = GLMAT_RANDOM$1();
  out[3] = GLMAT_RANDOM$1();
  vec4.normalize(out, out);
  vec4.scale(out, out, scale2);
  return out;
};
vec4.transformMat4 = function(out, a, m) {
  var x = a[0], y = a[1], z = a[2], w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
};
vec4.transformQuat = function(out, a, q) {
  var x = a[0], y = a[1], z = a[2], qx = q[0], qy = q[1], qz = q[2], qw = q[3], ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  return out;
};
vec4.forEach = function() {
  var vec = vec4.create();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 4;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }
    return a;
  };
}();
var vec4$1 = vec4;
var mat3 = {};
mat3.create = function() {
  var out = new GLMAT_ARRAY_TYPE(9);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
};
mat3.fromMat4 = function(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
};
mat3.clone = function(a) {
  var out = new GLMAT_ARRAY_TYPE(9);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
};
mat3.copy = function(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
};
mat3.identity = function(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
};
mat3.transpose = function(out, a) {
  if (out === a) {
    var a01 = a[1], a02 = a[2], a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }
  return out;
};
mat3.invert = function(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20, det = a00 * b01 + a01 * b11 + a02 * b21;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
};
mat3.adjoint = function(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8];
  out[0] = a11 * a22 - a12 * a21;
  out[1] = a02 * a21 - a01 * a22;
  out[2] = a01 * a12 - a02 * a11;
  out[3] = a12 * a20 - a10 * a22;
  out[4] = a00 * a22 - a02 * a20;
  out[5] = a02 * a10 - a00 * a12;
  out[6] = a10 * a21 - a11 * a20;
  out[7] = a01 * a20 - a00 * a21;
  out[8] = a00 * a11 - a01 * a10;
  return out;
};
mat3.determinant = function(a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8];
  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};
mat3.multiply = function(out, a, b) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b00 = b[0], b01 = b[1], b02 = b[2], b10 = b[3], b11 = b[4], b12 = b[5], b20 = b[6], b21 = b[7], b22 = b[8];
  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
};
mat3.mul = mat3.multiply;
mat3.translate = function(out, a, v) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], x = v[0], y = v[1];
  out[0] = a00;
  out[1] = a01;
  out[2] = a02;
  out[3] = a10;
  out[4] = a11;
  out[5] = a12;
  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
};
mat3.rotate = function(out, a, rad2) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], s = Math.sin(rad2), c = Math.cos(rad2);
  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;
  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;
  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
};
mat3.scale = function(out, a, v) {
  var x = v[0], y = v[1];
  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];
  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
};
mat3.fromMat2d = function(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = 0;
  out[3] = a[2];
  out[4] = a[3];
  out[5] = 0;
  out[6] = a[4];
  out[7] = a[5];
  out[8] = 1;
  return out;
};
mat3.fromQuat = function(out, q) {
  var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, yx = y * x2, yy = y * y2, zx = z * x2, zy = z * y2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;
  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;
  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;
  return out;
};
mat3.normalFromMat4 = function(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  return out;
};
mat3.frob = function(a) {
  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2));
};
var mat3$1 = mat3;
var quat = {};
quat.create = function() {
  var out = new GLMAT_ARRAY_TYPE(4);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
};
quat.rotationTo = function() {
  var tmpvec3 = vec3$8.create();
  var xUnitVec3 = vec3$8.fromValues(1, 0, 0);
  var yUnitVec3 = vec3$8.fromValues(0, 1, 0);
  return function(out, a, b) {
    var dot = vec3$8.dot(a, b);
    if (dot < -0.999999) {
      vec3$8.cross(tmpvec3, xUnitVec3, a);
      if (vec3$8.length(tmpvec3) < 1e-6)
        vec3$8.cross(tmpvec3, yUnitVec3, a);
      vec3$8.normalize(tmpvec3, tmpvec3);
      quat.setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      vec3$8.cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return quat.normalize(out, out);
    }
  };
}();
quat.setAxes = function() {
  var matr = mat3$1.create();
  return function(out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return quat.normalize(out, quat.fromMat3(out, matr));
  };
}();
quat.clone = vec4$1.clone;
quat.fromValues = vec4$1.fromValues;
quat.copy = vec4$1.copy;
quat.set = vec4$1.set;
quat.identity = function(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
};
quat.setAxisAngle = function(out, axis, rad2) {
  rad2 = rad2 * 0.5;
  var s = Math.sin(rad2);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad2);
  return out;
};
quat.add = vec4$1.add;
quat.multiply = function(out, a, b) {
  var ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = b[0], by = b[1], bz = b[2], bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
};
quat.mul = quat.multiply;
quat.scale = vec4$1.scale;
quat.rotateX = function(out, a, rad2) {
  rad2 *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = Math.sin(rad2), bw = Math.cos(rad2);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
};
quat.rotateY = function(out, a, rad2) {
  rad2 *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3], by = Math.sin(rad2), bw = Math.cos(rad2);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
};
quat.rotateZ = function(out, a, rad2) {
  rad2 *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3], bz = Math.sin(rad2), bw = Math.cos(rad2);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
};
quat.calculateW = function(out, a) {
  var x = a[0], y = a[1], z = a[2];
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
  return out;
};
quat.dot = vec4$1.dot;
quat.lerp = vec4$1.lerp;
quat.slerp = function(out, a, b, t) {
  var ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = b[0], by = b[1], bz = b[2], bw = b[3];
  var omega, cosom, sinom, scale0, scale1;
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (1 - cosom > 1e-6) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    scale0 = 1 - t;
    scale1 = t;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
};
quat.invert = function(out, a) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3, invDot = dot ? 1 / dot : 0;
  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
};
quat.conjugate = function(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
};
quat.length = vec4$1.length;
quat.len = quat.length;
quat.squaredLength = vec4$1.squaredLength;
quat.sqrLen = quat.squaredLength;
quat.normalize = vec4$1.normalize;
quat.fromMat3 = function(out, m) {
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;
  if (fTrace > 0) {
    fRoot = Math.sqrt(fTrace + 1);
    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    var i = 0;
    if (m[4] > m[0])
      i = 1;
    if (m[8] > m[i * 3 + i])
      i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }
  return out;
};
var quat$1 = quat;
var Matrix4 = function() {
  this._axisX = new Vector3$1();
  this._axisY = new Vector3$1();
  this._axisZ = new Vector3$1();
  this.array = mat4$2.create();
  this._dirty = true;
};
Matrix4.prototype = {
  constructor: Matrix4,
  setArray: function(arr) {
    for (var i = 0; i < this.array.length; i++) {
      this.array[i] = arr[i];
    }
    this._dirty = true;
    return this;
  },
  adjoint: function() {
    mat4$2.adjoint(this.array, this.array);
    this._dirty = true;
    return this;
  },
  clone: function() {
    return new Matrix4().copy(this);
  },
  copy: function(a) {
    mat4$2.copy(this.array, a.array);
    this._dirty = true;
    return this;
  },
  determinant: function() {
    return mat4$2.determinant(this.array);
  },
  fromQuat: function(q) {
    mat4$2.fromQuat(this.array, q.array);
    this._dirty = true;
    return this;
  },
  fromRotationTranslation: function(q, v) {
    mat4$2.fromRotationTranslation(this.array, q.array, v.array);
    this._dirty = true;
    return this;
  },
  fromMat2d: function(m2d) {
    Matrix4.fromMat2d(this, m2d);
    return this;
  },
  frustum: function(left, right, bottom, top, near, far) {
    mat4$2.frustum(this.array, left, right, bottom, top, near, far);
    this._dirty = true;
    return this;
  },
  identity: function() {
    mat4$2.identity(this.array);
    this._dirty = true;
    return this;
  },
  invert: function() {
    mat4$2.invert(this.array, this.array);
    this._dirty = true;
    return this;
  },
  lookAt: function(eye, center, up) {
    mat4$2.lookAt(this.array, eye.array, center.array, up.array);
    this._dirty = true;
    return this;
  },
  mul: function(b) {
    mat4$2.mul(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  mulLeft: function(a) {
    mat4$2.mul(this.array, a.array, this.array);
    this._dirty = true;
    return this;
  },
  multiply: function(b) {
    mat4$2.multiply(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  multiplyLeft: function(a) {
    mat4$2.multiply(this.array, a.array, this.array);
    this._dirty = true;
    return this;
  },
  ortho: function(left, right, bottom, top, near, far) {
    mat4$2.ortho(this.array, left, right, bottom, top, near, far);
    this._dirty = true;
    return this;
  },
  perspective: function(fovy, aspect, near, far) {
    mat4$2.perspective(this.array, fovy, aspect, near, far);
    this._dirty = true;
    return this;
  },
  rotate: function(rad2, axis) {
    mat4$2.rotate(this.array, this.array, rad2, axis.array);
    this._dirty = true;
    return this;
  },
  rotateX: function(rad2) {
    mat4$2.rotateX(this.array, this.array, rad2);
    this._dirty = true;
    return this;
  },
  rotateY: function(rad2) {
    mat4$2.rotateY(this.array, this.array, rad2);
    this._dirty = true;
    return this;
  },
  rotateZ: function(rad2) {
    mat4$2.rotateZ(this.array, this.array, rad2);
    this._dirty = true;
    return this;
  },
  scale: function(v) {
    mat4$2.scale(this.array, this.array, v.array);
    this._dirty = true;
    return this;
  },
  translate: function(v) {
    mat4$2.translate(this.array, this.array, v.array);
    this._dirty = true;
    return this;
  },
  transpose: function() {
    mat4$2.transpose(this.array, this.array);
    this._dirty = true;
    return this;
  },
  decomposeMatrix: function() {
    var x = vec3$8.create();
    var y = vec3$8.create();
    var z = vec3$8.create();
    var m3 = mat3$1.create();
    return function(scale2, rotation, position) {
      var el = this.array;
      vec3$8.set(x, el[0], el[1], el[2]);
      vec3$8.set(y, el[4], el[5], el[6]);
      vec3$8.set(z, el[8], el[9], el[10]);
      var sx = vec3$8.length(x);
      var sy = vec3$8.length(y);
      var sz = vec3$8.length(z);
      var det = this.determinant();
      if (det < 0) {
        sx = -sx;
      }
      if (scale2) {
        scale2.set(sx, sy, sz);
      }
      position.set(el[12], el[13], el[14]);
      mat3$1.fromMat4(m3, el);
      m3[0] /= sx;
      m3[1] /= sx;
      m3[2] /= sx;
      m3[3] /= sy;
      m3[4] /= sy;
      m3[5] /= sy;
      m3[6] /= sz;
      m3[7] /= sz;
      m3[8] /= sz;
      quat$1.fromMat3(rotation.array, m3);
      quat$1.normalize(rotation.array, rotation.array);
      rotation._dirty = true;
      position._dirty = true;
    };
  }(),
  toString: function() {
    return "[" + Array.prototype.join.call(this.array, ",") + "]";
  },
  toArray: function() {
    return Array.prototype.slice.call(this.array);
  }
};
var defineProperty$2 = Object.defineProperty;
if (defineProperty$2) {
  var proto$2 = Matrix4.prototype;
  defineProperty$2(proto$2, "z", {
    get: function() {
      var el = this.array;
      this._axisZ.set(el[8], el[9], el[10]);
      return this._axisZ;
    },
    set: function(v) {
      var el = this.array;
      v = v.array;
      el[8] = v[0];
      el[9] = v[1];
      el[10] = v[2];
      this._dirty = true;
    }
  });
  defineProperty$2(proto$2, "y", {
    get: function() {
      var el = this.array;
      this._axisY.set(el[4], el[5], el[6]);
      return this._axisY;
    },
    set: function(v) {
      var el = this.array;
      v = v.array;
      el[4] = v[0];
      el[5] = v[1];
      el[6] = v[2];
      this._dirty = true;
    }
  });
  defineProperty$2(proto$2, "x", {
    get: function() {
      var el = this.array;
      this._axisX.set(el[0], el[1], el[2]);
      return this._axisX;
    },
    set: function(v) {
      var el = this.array;
      v = v.array;
      el[0] = v[0];
      el[1] = v[1];
      el[2] = v[2];
      this._dirty = true;
    }
  });
}
Matrix4.adjoint = function(out, a) {
  mat4$2.adjoint(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix4.copy = function(out, a) {
  mat4$2.copy(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix4.determinant = function(a) {
  return mat4$2.determinant(a.array);
};
Matrix4.identity = function(out) {
  mat4$2.identity(out.array);
  out._dirty = true;
  return out;
};
Matrix4.ortho = function(out, left, right, bottom, top, near, far) {
  mat4$2.ortho(out.array, left, right, bottom, top, near, far);
  out._dirty = true;
  return out;
};
Matrix4.perspective = function(out, fovy, aspect, near, far) {
  mat4$2.perspective(out.array, fovy, aspect, near, far);
  out._dirty = true;
  return out;
};
Matrix4.lookAt = function(out, eye, center, up) {
  mat4$2.lookAt(out.array, eye.array, center.array, up.array);
  out._dirty = true;
  return out;
};
Matrix4.invert = function(out, a) {
  mat4$2.invert(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix4.mul = function(out, a, b) {
  mat4$2.mul(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Matrix4.multiply = Matrix4.mul;
Matrix4.fromQuat = function(out, q) {
  mat4$2.fromQuat(out.array, q.array);
  out._dirty = true;
  return out;
};
Matrix4.fromRotationTranslation = function(out, q, v) {
  mat4$2.fromRotationTranslation(out.array, q.array, v.array);
  out._dirty = true;
  return out;
};
Matrix4.fromMat2d = function(m4, m2d) {
  m4._dirty = true;
  var m2d = m2d.array;
  var m4 = m4.array;
  m4[0] = m2d[0];
  m4[4] = m2d[2];
  m4[12] = m2d[4];
  m4[1] = m2d[1];
  m4[5] = m2d[3];
  m4[13] = m2d[5];
  return m4;
};
Matrix4.rotate = function(out, a, rad2, axis) {
  mat4$2.rotate(out.array, a.array, rad2, axis.array);
  out._dirty = true;
  return out;
};
Matrix4.rotateX = function(out, a, rad2) {
  mat4$2.rotateX(out.array, a.array, rad2);
  out._dirty = true;
  return out;
};
Matrix4.rotateY = function(out, a, rad2) {
  mat4$2.rotateY(out.array, a.array, rad2);
  out._dirty = true;
  return out;
};
Matrix4.rotateZ = function(out, a, rad2) {
  mat4$2.rotateZ(out.array, a.array, rad2);
  out._dirty = true;
  return out;
};
Matrix4.scale = function(out, a, v) {
  mat4$2.scale(out.array, a.array, v.array);
  out._dirty = true;
  return out;
};
Matrix4.transpose = function(out, a) {
  mat4$2.transpose(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix4.translate = function(out, a, v) {
  mat4$2.translate(out.array, a.array, v.array);
  out._dirty = true;
  return out;
};
var Matrix4$1 = Matrix4;
var Quaternion = function(x, y, z, w) {
  x = x || 0;
  y = y || 0;
  z = z || 0;
  w = w === void 0 ? 1 : w;
  this.array = quat$1.fromValues(x, y, z, w);
  this._dirty = true;
};
Quaternion.prototype = {
  constructor: Quaternion,
  add: function(b) {
    quat$1.add(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  calculateW: function() {
    quat$1.calculateW(this.array, this.array);
    this._dirty = true;
    return this;
  },
  set: function(x, y, z, w) {
    this.array[0] = x;
    this.array[1] = y;
    this.array[2] = z;
    this.array[3] = w;
    this._dirty = true;
    return this;
  },
  setArray: function(arr) {
    this.array[0] = arr[0];
    this.array[1] = arr[1];
    this.array[2] = arr[2];
    this.array[3] = arr[3];
    this._dirty = true;
    return this;
  },
  clone: function() {
    return new Quaternion(this.x, this.y, this.z, this.w);
  },
  conjugate: function() {
    quat$1.conjugate(this.array, this.array);
    this._dirty = true;
    return this;
  },
  copy: function(b) {
    quat$1.copy(this.array, b.array);
    this._dirty = true;
    return this;
  },
  dot: function(b) {
    return quat$1.dot(this.array, b.array);
  },
  fromMat3: function(m) {
    quat$1.fromMat3(this.array, m.array);
    this._dirty = true;
    return this;
  },
  fromMat4: function() {
    var m3 = mat3$1.create();
    return function(m) {
      mat3$1.fromMat4(m3, m.array);
      mat3$1.transpose(m3, m3);
      quat$1.fromMat3(this.array, m3);
      this._dirty = true;
      return this;
    };
  }(),
  identity: function() {
    quat$1.identity(this.array);
    this._dirty = true;
    return this;
  },
  invert: function() {
    quat$1.invert(this.array, this.array);
    this._dirty = true;
    return this;
  },
  len: function() {
    return quat$1.len(this.array);
  },
  length: function() {
    return quat$1.length(this.array);
  },
  lerp: function(a, b, t) {
    quat$1.lerp(this.array, a.array, b.array, t);
    this._dirty = true;
    return this;
  },
  mul: function(b) {
    quat$1.mul(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  mulLeft: function(a) {
    quat$1.multiply(this.array, a.array, this.array);
    this._dirty = true;
    return this;
  },
  multiply: function(b) {
    quat$1.multiply(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  multiplyLeft: function(a) {
    quat$1.multiply(this.array, a.array, this.array);
    this._dirty = true;
    return this;
  },
  normalize: function() {
    quat$1.normalize(this.array, this.array);
    this._dirty = true;
    return this;
  },
  rotateX: function(rad2) {
    quat$1.rotateX(this.array, this.array, rad2);
    this._dirty = true;
    return this;
  },
  rotateY: function(rad2) {
    quat$1.rotateY(this.array, this.array, rad2);
    this._dirty = true;
    return this;
  },
  rotateZ: function(rad2) {
    quat$1.rotateZ(this.array, this.array, rad2);
    this._dirty = true;
    return this;
  },
  rotationTo: function(a, b) {
    quat$1.rotationTo(this.array, a.array, b.array);
    this._dirty = true;
    return this;
  },
  setAxes: function(view, right, up) {
    quat$1.setAxes(this.array, view.array, right.array, up.array);
    this._dirty = true;
    return this;
  },
  setAxisAngle: function(axis, rad2) {
    quat$1.setAxisAngle(this.array, axis.array, rad2);
    this._dirty = true;
    return this;
  },
  slerp: function(a, b, t) {
    quat$1.slerp(this.array, a.array, b.array, t);
    this._dirty = true;
    return this;
  },
  sqrLen: function() {
    return quat$1.sqrLen(this.array);
  },
  squaredLength: function() {
    return quat$1.squaredLength(this.array);
  },
  fromEuler: function(v, order) {
    return Quaternion.fromEuler(this, v, order);
  },
  toString: function() {
    return "[" + Array.prototype.join.call(this.array, ",") + "]";
  },
  toArray: function() {
    return Array.prototype.slice.call(this.array);
  }
};
var defineProperty$1 = Object.defineProperty;
if (defineProperty$1) {
  var proto$1 = Quaternion.prototype;
  defineProperty$1(proto$1, "x", {
    get: function() {
      return this.array[0];
    },
    set: function(value) {
      this.array[0] = value;
      this._dirty = true;
    }
  });
  defineProperty$1(proto$1, "y", {
    get: function() {
      return this.array[1];
    },
    set: function(value) {
      this.array[1] = value;
      this._dirty = true;
    }
  });
  defineProperty$1(proto$1, "z", {
    get: function() {
      return this.array[2];
    },
    set: function(value) {
      this.array[2] = value;
      this._dirty = true;
    }
  });
  defineProperty$1(proto$1, "w", {
    get: function() {
      return this.array[3];
    },
    set: function(value) {
      this.array[3] = value;
      this._dirty = true;
    }
  });
}
Quaternion.add = function(out, a, b) {
  quat$1.add(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Quaternion.set = function(out, x, y, z, w) {
  quat$1.set(out.array, x, y, z, w);
  out._dirty = true;
};
Quaternion.copy = function(out, b) {
  quat$1.copy(out.array, b.array);
  out._dirty = true;
  return out;
};
Quaternion.calculateW = function(out, a) {
  quat$1.calculateW(out.array, a.array);
  out._dirty = true;
  return out;
};
Quaternion.conjugate = function(out, a) {
  quat$1.conjugate(out.array, a.array);
  out._dirty = true;
  return out;
};
Quaternion.identity = function(out) {
  quat$1.identity(out.array);
  out._dirty = true;
  return out;
};
Quaternion.invert = function(out, a) {
  quat$1.invert(out.array, a.array);
  out._dirty = true;
  return out;
};
Quaternion.dot = function(a, b) {
  return quat$1.dot(a.array, b.array);
};
Quaternion.len = function(a) {
  return quat$1.length(a.array);
};
Quaternion.lerp = function(out, a, b, t) {
  quat$1.lerp(out.array, a.array, b.array, t);
  out._dirty = true;
  return out;
};
Quaternion.slerp = function(out, a, b, t) {
  quat$1.slerp(out.array, a.array, b.array, t);
  out._dirty = true;
  return out;
};
Quaternion.mul = function(out, a, b) {
  quat$1.multiply(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Quaternion.multiply = Quaternion.mul;
Quaternion.rotateX = function(out, a, rad2) {
  quat$1.rotateX(out.array, a.array, rad2);
  out._dirty = true;
  return out;
};
Quaternion.rotateY = function(out, a, rad2) {
  quat$1.rotateY(out.array, a.array, rad2);
  out._dirty = true;
  return out;
};
Quaternion.rotateZ = function(out, a, rad2) {
  quat$1.rotateZ(out.array, a.array, rad2);
  out._dirty = true;
  return out;
};
Quaternion.setAxisAngle = function(out, axis, rad2) {
  quat$1.setAxisAngle(out.array, axis.array, rad2);
  out._dirty = true;
  return out;
};
Quaternion.normalize = function(out, a) {
  quat$1.normalize(out.array, a.array);
  out._dirty = true;
  return out;
};
Quaternion.sqrLen = function(a) {
  return quat$1.sqrLen(a.array);
};
Quaternion.squaredLength = Quaternion.sqrLen;
Quaternion.fromMat3 = function(out, m) {
  quat$1.fromMat3(out.array, m.array);
  out._dirty = true;
  return out;
};
Quaternion.setAxes = function(out, view, right, up) {
  quat$1.setAxes(out.array, view.array, right.array, up.array);
  out._dirty = true;
  return out;
};
Quaternion.rotationTo = function(out, a, b) {
  quat$1.rotationTo(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Quaternion.fromEuler = function(out, v, order) {
  out._dirty = true;
  v = v.array;
  var target = out.array;
  var c1 = Math.cos(v[0] / 2);
  var c2 = Math.cos(v[1] / 2);
  var c3 = Math.cos(v[2] / 2);
  var s1 = Math.sin(v[0] / 2);
  var s2 = Math.sin(v[1] / 2);
  var s3 = Math.sin(v[2] / 2);
  var order = (order || "XYZ").toUpperCase();
  switch (order) {
    case "XYZ":
      target[0] = s1 * c2 * c3 + c1 * s2 * s3;
      target[1] = c1 * s2 * c3 - s1 * c2 * s3;
      target[2] = c1 * c2 * s3 + s1 * s2 * c3;
      target[3] = c1 * c2 * c3 - s1 * s2 * s3;
      break;
    case "YXZ":
      target[0] = s1 * c2 * c3 + c1 * s2 * s3;
      target[1] = c1 * s2 * c3 - s1 * c2 * s3;
      target[2] = c1 * c2 * s3 - s1 * s2 * c3;
      target[3] = c1 * c2 * c3 + s1 * s2 * s3;
      break;
    case "ZXY":
      target[0] = s1 * c2 * c3 - c1 * s2 * s3;
      target[1] = c1 * s2 * c3 + s1 * c2 * s3;
      target[2] = c1 * c2 * s3 + s1 * s2 * c3;
      target[3] = c1 * c2 * c3 - s1 * s2 * s3;
      break;
    case "ZYX":
      target[0] = s1 * c2 * c3 - c1 * s2 * s3;
      target[1] = c1 * s2 * c3 + s1 * c2 * s3;
      target[2] = c1 * c2 * s3 - s1 * s2 * c3;
      target[3] = c1 * c2 * c3 + s1 * s2 * s3;
      break;
    case "YZX":
      target[0] = s1 * c2 * c3 + c1 * s2 * s3;
      target[1] = c1 * s2 * c3 + s1 * c2 * s3;
      target[2] = c1 * c2 * s3 - s1 * s2 * c3;
      target[3] = c1 * c2 * c3 - s1 * s2 * s3;
      break;
    case "XZY":
      target[0] = s1 * c2 * c3 - c1 * s2 * s3;
      target[1] = c1 * s2 * c3 - s1 * c2 * s3;
      target[2] = c1 * c2 * s3 + s1 * s2 * c3;
      target[3] = c1 * c2 * c3 + s1 * s2 * s3;
      break;
  }
};
var Quaternion$1 = Quaternion;
var vec3Set$2 = vec3$8.set;
var vec3Copy$1 = vec3$8.copy;
var BoundingBox = function(min, max) {
  this.min = min || new Vector3$1(Infinity, Infinity, Infinity);
  this.max = max || new Vector3$1(-Infinity, -Infinity, -Infinity);
  this.vertices = null;
};
BoundingBox.prototype = {
  constructor: BoundingBox,
  updateFromVertices: function(vertices) {
    if (vertices.length > 0) {
      var min = this.min;
      var max = this.max;
      var minArr = min.array;
      var maxArr = max.array;
      vec3Copy$1(minArr, vertices[0]);
      vec3Copy$1(maxArr, vertices[0]);
      for (var i = 1; i < vertices.length; i++) {
        var vertex = vertices[i];
        if (vertex[0] < minArr[0]) {
          minArr[0] = vertex[0];
        }
        if (vertex[1] < minArr[1]) {
          minArr[1] = vertex[1];
        }
        if (vertex[2] < minArr[2]) {
          minArr[2] = vertex[2];
        }
        if (vertex[0] > maxArr[0]) {
          maxArr[0] = vertex[0];
        }
        if (vertex[1] > maxArr[1]) {
          maxArr[1] = vertex[1];
        }
        if (vertex[2] > maxArr[2]) {
          maxArr[2] = vertex[2];
        }
      }
      min._dirty = true;
      max._dirty = true;
    }
  },
  union: function(bbox) {
    var min = this.min;
    var max = this.max;
    vec3$8.min(min.array, min.array, bbox.min.array);
    vec3$8.max(max.array, max.array, bbox.max.array);
    min._dirty = true;
    max._dirty = true;
    return this;
  },
  intersection: function(bbox) {
    var min = this.min;
    var max = this.max;
    vec3$8.max(min.array, min.array, bbox.min.array);
    vec3$8.min(max.array, max.array, bbox.max.array);
    min._dirty = true;
    max._dirty = true;
    return this;
  },
  intersectBoundingBox: function(bbox) {
    var _min = this.min.array;
    var _max = this.max.array;
    var _min2 = bbox.min.array;
    var _max2 = bbox.max.array;
    return !(_min[0] > _max2[0] || _min[1] > _max2[1] || _min[2] > _max2[2] || _max[0] < _min2[0] || _max[1] < _min2[1] || _max[2] < _min2[2]);
  },
  containBoundingBox: function(bbox) {
    var _min = this.min.array;
    var _max = this.max.array;
    var _min2 = bbox.min.array;
    var _max2 = bbox.max.array;
    return _min[0] <= _min2[0] && _min[1] <= _min2[1] && _min[2] <= _min2[2] && _max[0] >= _max2[0] && _max[1] >= _max2[1] && _max[2] >= _max2[2];
  },
  containPoint: function(p) {
    var _min = this.min.array;
    var _max = this.max.array;
    var _p = p.array;
    return _min[0] <= _p[0] && _min[1] <= _p[1] && _min[2] <= _p[2] && _max[0] >= _p[0] && _max[1] >= _p[1] && _max[2] >= _p[2];
  },
  isFinite: function() {
    var _min = this.min.array;
    var _max = this.max.array;
    return isFinite(_min[0]) && isFinite(_min[1]) && isFinite(_min[2]) && isFinite(_max[0]) && isFinite(_max[1]) && isFinite(_max[2]);
  },
  applyTransform: function(matrix) {
    this.transformFrom(this, matrix);
  },
  transformFrom: function() {
    var xa = vec3$8.create();
    var xb = vec3$8.create();
    var ya = vec3$8.create();
    var yb = vec3$8.create();
    var za = vec3$8.create();
    var zb = vec3$8.create();
    return function(source, matrix) {
      var min = source.min.array;
      var max = source.max.array;
      var m = matrix.array;
      xa[0] = m[0] * min[0];
      xa[1] = m[1] * min[0];
      xa[2] = m[2] * min[0];
      xb[0] = m[0] * max[0];
      xb[1] = m[1] * max[0];
      xb[2] = m[2] * max[0];
      ya[0] = m[4] * min[1];
      ya[1] = m[5] * min[1];
      ya[2] = m[6] * min[1];
      yb[0] = m[4] * max[1];
      yb[1] = m[5] * max[1];
      yb[2] = m[6] * max[1];
      za[0] = m[8] * min[2];
      za[1] = m[9] * min[2];
      za[2] = m[10] * min[2];
      zb[0] = m[8] * max[2];
      zb[1] = m[9] * max[2];
      zb[2] = m[10] * max[2];
      min = this.min.array;
      max = this.max.array;
      min[0] = Math.min(xa[0], xb[0]) + Math.min(ya[0], yb[0]) + Math.min(za[0], zb[0]) + m[12];
      min[1] = Math.min(xa[1], xb[1]) + Math.min(ya[1], yb[1]) + Math.min(za[1], zb[1]) + m[13];
      min[2] = Math.min(xa[2], xb[2]) + Math.min(ya[2], yb[2]) + Math.min(za[2], zb[2]) + m[14];
      max[0] = Math.max(xa[0], xb[0]) + Math.max(ya[0], yb[0]) + Math.max(za[0], zb[0]) + m[12];
      max[1] = Math.max(xa[1], xb[1]) + Math.max(ya[1], yb[1]) + Math.max(za[1], zb[1]) + m[13];
      max[2] = Math.max(xa[2], xb[2]) + Math.max(ya[2], yb[2]) + Math.max(za[2], zb[2]) + m[14];
      this.min._dirty = true;
      this.max._dirty = true;
      return this;
    };
  }(),
  applyProjection: function(matrix) {
    var min = this.min.array;
    var max = this.max.array;
    var m = matrix.array;
    var v10 = min[0];
    var v11 = min[1];
    var v12 = min[2];
    var v20 = max[0];
    var v21 = max[1];
    var v22 = min[2];
    var v30 = max[0];
    var v31 = max[1];
    var v32 = max[2];
    if (m[15] === 1) {
      min[0] = m[0] * v10 + m[12];
      min[1] = m[5] * v11 + m[13];
      max[2] = m[10] * v12 + m[14];
      max[0] = m[0] * v30 + m[12];
      max[1] = m[5] * v31 + m[13];
      min[2] = m[10] * v32 + m[14];
    } else {
      var w = -1 / v12;
      min[0] = m[0] * v10 * w;
      min[1] = m[5] * v11 * w;
      max[2] = (m[10] * v12 + m[14]) * w;
      w = -1 / v22;
      max[0] = m[0] * v20 * w;
      max[1] = m[5] * v21 * w;
      w = -1 / v32;
      min[2] = (m[10] * v32 + m[14]) * w;
    }
    this.min._dirty = true;
    this.max._dirty = true;
    return this;
  },
  updateVertices: function() {
    var vertices = this.vertices;
    if (!vertices) {
      vertices = [];
      for (var i = 0; i < 8; i++) {
        vertices[i] = vec3$8.fromValues(0, 0, 0);
      }
      this.vertices = vertices;
    }
    var min = this.min.array;
    var max = this.max.array;
    vec3Set$2(vertices[0], min[0], min[1], min[2]);
    vec3Set$2(vertices[1], min[0], max[1], min[2]);
    vec3Set$2(vertices[2], max[0], min[1], min[2]);
    vec3Set$2(vertices[3], max[0], max[1], min[2]);
    vec3Set$2(vertices[4], min[0], min[1], max[2]);
    vec3Set$2(vertices[5], min[0], max[1], max[2]);
    vec3Set$2(vertices[6], max[0], min[1], max[2]);
    vec3Set$2(vertices[7], max[0], max[1], max[2]);
    return this;
  },
  copy: function(bbox) {
    var min = this.min;
    var max = this.max;
    vec3Copy$1(min.array, bbox.min.array);
    vec3Copy$1(max.array, bbox.max.array);
    min._dirty = true;
    max._dirty = true;
    return this;
  },
  clone: function() {
    var boundingBox = new BoundingBox();
    boundingBox.copy(this);
    return boundingBox;
  }
};
var BoundingBox$1 = BoundingBox;
var nameId = 0;
var Node$1 = Base$1.extend({
  name: "",
  position: null,
  rotation: null,
  scale: null,
  worldTransform: null,
  localTransform: null,
  autoUpdateLocalTransform: true,
  _parent: null,
  _scene: null,
  _needsUpdateWorldTransform: true,
  _inIterating: false,
  __depth: 0
}, function() {
  if (!this.name) {
    this.name = (this.type || "NODE") + "_" + nameId++;
  }
  if (!this.position) {
    this.position = new Vector3$1();
  }
  if (!this.rotation) {
    this.rotation = new Quaternion$1();
  }
  if (!this.scale) {
    this.scale = new Vector3$1(1, 1, 1);
  }
  this.worldTransform = new Matrix4$1();
  this.localTransform = new Matrix4$1();
  this._children = [];
}, {
  target: null,
  invisible: false,
  isSkinnedMesh: function() {
    return false;
  },
  isRenderable: function() {
    return false;
  },
  setName: function(name) {
    var scene = this._scene;
    if (scene) {
      var nodeRepository = scene._nodeRepository;
      delete nodeRepository[this.name];
      nodeRepository[name] = this;
    }
    this.name = name;
  },
  add: function(node) {
    var originalParent = node._parent;
    if (originalParent === this) {
      return;
    }
    if (originalParent) {
      originalParent.remove(node);
    }
    node._parent = this;
    this._children.push(node);
    var scene = this._scene;
    if (scene && scene !== node.scene) {
      node.traverse(this._addSelfToScene, this);
    }
    node._needsUpdateWorldTransform = true;
  },
  remove: function(node) {
    var children = this._children;
    var idx = children.indexOf(node);
    if (idx < 0) {
      return;
    }
    children.splice(idx, 1);
    node._parent = null;
    if (this._scene) {
      node.traverse(this._removeSelfFromScene, this);
    }
  },
  removeAll: function() {
    var children = this._children;
    for (var idx = 0; idx < children.length; idx++) {
      children[idx]._parent = null;
      if (this._scene) {
        children[idx].traverse(this._removeSelfFromScene, this);
      }
    }
    this._children = [];
  },
  getScene: function() {
    return this._scene;
  },
  getParent: function() {
    return this._parent;
  },
  _removeSelfFromScene: function(descendant) {
    descendant._scene.removeFromScene(descendant);
    descendant._scene = null;
  },
  _addSelfToScene: function(descendant) {
    this._scene.addToScene(descendant);
    descendant._scene = this._scene;
  },
  isAncestor: function(node) {
    var parent = node._parent;
    while (parent) {
      if (parent === this) {
        return true;
      }
      parent = parent._parent;
    }
    return false;
  },
  children: function() {
    return this._children.slice();
  },
  childAt: function(idx) {
    return this._children[idx];
  },
  getChildByName: function(name) {
    var children = this._children;
    for (var i = 0; i < children.length; i++) {
      if (children[i].name === name) {
        return children[i];
      }
    }
  },
  getDescendantByName: function(name) {
    var children = this._children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.name === name) {
        return child;
      } else {
        var res = child.getDescendantByName(name);
        if (res) {
          return res;
        }
      }
    }
  },
  queryNode: function(path) {
    if (!path) {
      return;
    }
    var pathArr = path.split("/");
    var current = this;
    for (var i = 0; i < pathArr.length; i++) {
      var name = pathArr[i];
      if (!name) {
        continue;
      }
      var found = false;
      var children = current._children;
      for (var j = 0; j < children.length; j++) {
        var child = children[j];
        if (child.name === name) {
          current = child;
          found = true;
          break;
        }
      }
      if (!found) {
        return;
      }
    }
    return current;
  },
  getPath: function(rootNode) {
    if (!this._parent) {
      return "/";
    }
    var current = this._parent;
    var path = this.name;
    while (current._parent) {
      path = current.name + "/" + path;
      if (current._parent == rootNode) {
        break;
      }
      current = current._parent;
    }
    if (!current._parent && rootNode) {
      return null;
    }
    return path;
  },
  traverse: function(callback, context) {
    callback.call(context, this);
    var _children = this._children;
    for (var i = 0, len = _children.length; i < len; i++) {
      _children[i].traverse(callback, context);
    }
  },
  eachChild: function(callback, context) {
    var _children = this._children;
    for (var i = 0, len = _children.length; i < len; i++) {
      var child = _children[i];
      callback.call(context, child, i);
    }
  },
  setLocalTransform: function(matrix) {
    mat4$2.copy(this.localTransform.array, matrix.array);
    this.decomposeLocalTransform();
  },
  decomposeLocalTransform: function(keepScale) {
    var scale2 = !keepScale ? this.scale : null;
    this.localTransform.decomposeMatrix(scale2, this.rotation, this.position);
  },
  setWorldTransform: function(matrix) {
    mat4$2.copy(this.worldTransform.array, matrix.array);
    this.decomposeWorldTransform();
  },
  decomposeWorldTransform: function() {
    var tmp = mat4$2.create();
    return function(keepScale) {
      var localTransform = this.localTransform;
      var worldTransform = this.worldTransform;
      if (this._parent) {
        mat4$2.invert(tmp, this._parent.worldTransform.array);
        mat4$2.multiply(localTransform.array, tmp, worldTransform.array);
      } else {
        mat4$2.copy(localTransform.array, worldTransform.array);
      }
      var scale2 = !keepScale ? this.scale : null;
      localTransform.decomposeMatrix(scale2, this.rotation, this.position);
    };
  }(),
  transformNeedsUpdate: function() {
    return this.position._dirty || this.rotation._dirty || this.scale._dirty;
  },
  updateLocalTransform: function() {
    var position = this.position;
    var rotation = this.rotation;
    var scale2 = this.scale;
    if (this.transformNeedsUpdate()) {
      var m = this.localTransform.array;
      mat4$2.fromRotationTranslation(m, rotation.array, position.array);
      mat4$2.scale(m, m, scale2.array);
      rotation._dirty = false;
      scale2._dirty = false;
      position._dirty = false;
      this._needsUpdateWorldTransform = true;
    }
  },
  _updateWorldTransformTopDown: function() {
    var localTransform = this.localTransform.array;
    var worldTransform = this.worldTransform.array;
    if (this._parent) {
      mat4$2.multiplyAffine(worldTransform, this._parent.worldTransform.array, localTransform);
    } else {
      mat4$2.copy(worldTransform, localTransform);
    }
  },
  updateWorldTransform: function() {
    var rootNodeIsDirty = this;
    while (rootNodeIsDirty && rootNodeIsDirty.getParent() && rootNodeIsDirty.getParent().transformNeedsUpdate()) {
      rootNodeIsDirty = rootNodeIsDirty.getParent();
    }
    rootNodeIsDirty.update();
  },
  update: function(forceUpdateWorld) {
    if (this.autoUpdateLocalTransform) {
      this.updateLocalTransform();
    } else {
      forceUpdateWorld = true;
    }
    if (forceUpdateWorld || this._needsUpdateWorldTransform) {
      this._updateWorldTransformTopDown();
      forceUpdateWorld = true;
      this._needsUpdateWorldTransform = false;
    }
    var children = this._children;
    for (var i = 0, len = children.length; i < len; i++) {
      children[i].update(forceUpdateWorld);
    }
  },
  getBoundingBox: function() {
    function defaultFilter(el) {
      return !el.invisible && el.geometry;
    }
    var tmpBBox = new BoundingBox$1();
    var tmpMat4 = new Matrix4$1();
    var invWorldTransform = new Matrix4$1();
    return function(filter2, out) {
      out = out || new BoundingBox$1();
      if (this._parent) {
        Matrix4$1.invert(invWorldTransform, this._parent.worldTransform);
      } else {
        Matrix4$1.identity(invWorldTransform);
      }
      this.traverse(function(mesh2) {
        if (mesh2.geometry && mesh2.geometry.boundingBox) {
          tmpBBox.copy(mesh2.geometry.boundingBox);
          Matrix4$1.multiply(tmpMat4, invWorldTransform, mesh2.worldTransform);
          tmpBBox.applyTransform(tmpMat4);
          out.union(tmpBBox);
        }
      }, this, defaultFilter);
      return out;
    };
  }(),
  getWorldPosition: function(out) {
    if (this.transformNeedsUpdate()) {
      this.updateWorldTransform();
    }
    var m = this.worldTransform.array;
    if (out) {
      var arr = out.array;
      arr[0] = m[12];
      arr[1] = m[13];
      arr[2] = m[14];
      return out;
    } else {
      return new Vector3$1(m[12], m[13], m[14]);
    }
  },
  clone: function() {
    var node = new this.constructor();
    var children = this._children;
    node.setName(this.name);
    node.position.copy(this.position);
    node.rotation.copy(this.rotation);
    node.scale.copy(this.scale);
    for (var i = 0; i < children.length; i++) {
      node.add(children[i].clone());
    }
    return node;
  },
  rotateAround: function() {
    var v = new Vector3$1();
    var RTMatrix = new Matrix4$1();
    return function(point, axis, angle) {
      v.copy(this.position).subtract(point);
      var localTransform = this.localTransform;
      localTransform.identity();
      localTransform.translate(point);
      localTransform.rotate(angle, axis);
      RTMatrix.fromRotationTranslation(this.rotation, v);
      localTransform.multiply(RTMatrix);
      localTransform.scale(this.scale);
      this.decomposeLocalTransform();
      this._needsUpdateWorldTransform = true;
    };
  }(),
  lookAt: function() {
    var m = new Matrix4$1();
    return function(target, up) {
      m.lookAt(this.position, target, up || this.localTransform.y).invert();
      this.setLocalTransform(m);
      this.target = target;
    };
  }()
});
var Node3D = Node$1;
var Renderable = Node3D.extend({
  material: null,
  geometry: null,
  mode: glenum.TRIANGLES,
  _renderInfo: null
}, {
  __program: null,
  lightGroup: 0,
  renderOrder: 0,
  culling: true,
  cullFace: glenum.BACK,
  frontFace: glenum.CCW,
  frustumCulling: true,
  receiveShadow: true,
  castShadow: true,
  ignorePicking: false,
  ignorePreZ: false,
  ignoreGBuffer: false,
  isRenderable: function() {
    return this.geometry && this.material && this.material.shader && !this.invisible && this.geometry.vertexCount > 0;
  },
  beforeRender: function(_gl) {
  },
  afterRender: function(_gl, renderStat) {
  },
  getBoundingBox: function(filter2, out) {
    out = Node3D.prototype.getBoundingBox.call(this, filter2, out);
    if (this.geometry && this.geometry.boundingBox) {
      out.union(this.geometry.boundingBox);
    }
    return out;
  },
  clone: function() {
    var properties = ["castShadow", "receiveShadow", "mode", "culling", "cullFace", "frontFace", "frustumCulling", "renderOrder", "lineWidth", "ignorePicking", "ignorePreZ", "ignoreGBuffer"];
    return function() {
      var renderable = Node3D.prototype.clone.call(this);
      renderable.geometry = this.geometry;
      renderable.material = this.material;
      for (var i = 0; i < properties.length; i++) {
        var name = properties[i];
        if (renderable[name] !== this[name]) {
          renderable[name] = this[name];
        }
      }
      return renderable;
    };
  }()
});
Renderable.POINTS = glenum.POINTS;
Renderable.LINES = glenum.LINES;
Renderable.LINE_LOOP = glenum.LINE_LOOP;
Renderable.LINE_STRIP = glenum.LINE_STRIP;
Renderable.TRIANGLES = glenum.TRIANGLES;
Renderable.TRIANGLE_STRIP = glenum.TRIANGLE_STRIP;
Renderable.TRIANGLE_FAN = glenum.TRIANGLE_FAN;
Renderable.BACK = glenum.BACK;
Renderable.FRONT = glenum.FRONT;
Renderable.FRONT_AND_BACK = glenum.FRONT_AND_BACK;
Renderable.CW = glenum.CW;
Renderable.CCW = glenum.CCW;
var Renderable$1 = Renderable;
var RayPicking = Base$1.extend({
  scene: null,
  camera: null,
  renderer: null
}, function() {
  this._ray = new Ray$1();
  this._ndc = new Vector2$1();
}, {
  pick: function(x, y, forcePickAll) {
    var out = this.pickAll(x, y, [], forcePickAll);
    return out[0] || null;
  },
  pickAll: function(x, y, output, forcePickAll) {
    this.renderer.screenToNDC(x, y, this._ndc);
    this.camera.castRay(this._ndc, this._ray);
    output = output || [];
    this._intersectNode(this.scene, output, forcePickAll || false);
    output.sort(this._intersectionCompareFunc);
    return output;
  },
  _intersectNode: function(node, out, forcePickAll) {
    if (node instanceof Renderable$1 && node.isRenderable()) {
      if ((!node.ignorePicking || forcePickAll) && (node.mode === glenum.TRIANGLES && node.geometry.isUseIndices() || node.geometry.pickByRay || node.geometry.pick)) {
        this._intersectRenderable(node, out);
      }
    }
    for (var i = 0; i < node._children.length; i++) {
      this._intersectNode(node._children[i], out, forcePickAll);
    }
  },
  _intersectRenderable: function() {
    var v1 = new Vector3$1();
    var v2 = new Vector3$1();
    var v3 = new Vector3$1();
    var ray = new Ray$1();
    var worldInverse = new Matrix4$1();
    return function(renderable, out) {
      var isSkinnedMesh = renderable.isSkinnedMesh();
      ray.copy(this._ray);
      Matrix4$1.invert(worldInverse, renderable.worldTransform);
      if (!isSkinnedMesh) {
        ray.applyTransform(worldInverse);
      }
      var geometry = renderable.geometry;
      var bbox = isSkinnedMesh ? renderable.skeleton.boundingBox : geometry.boundingBox;
      if (bbox && !ray.intersectBoundingBox(bbox)) {
        return;
      }
      if (geometry.pick) {
        geometry.pick(this._ndc.x, this._ndc.y, this.renderer, this.camera, renderable, out);
        return;
      } else if (geometry.pickByRay) {
        geometry.pickByRay(ray, renderable, out);
        return;
      }
      var cullBack = renderable.cullFace === glenum.BACK && renderable.frontFace === glenum.CCW || renderable.cullFace === glenum.FRONT && renderable.frontFace === glenum.CW;
      var point;
      var indices = geometry.indices;
      var positionAttr = geometry.attributes.position;
      var weightAttr = geometry.attributes.weight;
      var jointAttr = geometry.attributes.joint;
      var skinMatricesArray;
      var skinMatrices = [];
      if (!positionAttr || !positionAttr.value || !indices) {
        return;
      }
      if (isSkinnedMesh) {
        skinMatricesArray = renderable.skeleton.getSubSkinMatrices(renderable.__uid__, renderable.joints);
        for (var i = 0; i < renderable.joints.length; i++) {
          skinMatrices[i] = skinMatrices[i] || [];
          for (var k = 0; k < 16; k++) {
            skinMatrices[i][k] = skinMatricesArray[i * 16 + k];
          }
        }
        var pos = [];
        var weight = [];
        var joint = [];
        var skinnedPos = [];
        var tmp = [];
        var skinnedPositionAttr = geometry.attributes.skinnedPosition;
        if (!skinnedPositionAttr || !skinnedPositionAttr.value) {
          geometry.createAttribute("skinnedPosition", "f", 3);
          skinnedPositionAttr = geometry.attributes.skinnedPosition;
          skinnedPositionAttr.init(geometry.vertexCount);
        }
        for (var i = 0; i < geometry.vertexCount; i++) {
          positionAttr.get(i, pos);
          weightAttr.get(i, weight);
          jointAttr.get(i, joint);
          weight[3] = 1 - weight[0] - weight[1] - weight[2];
          vec3$8.set(skinnedPos, 0, 0, 0);
          for (var k = 0; k < 4; k++) {
            if (joint[k] >= 0 && weight[k] > 1e-4) {
              vec3$8.transformMat4(tmp, pos, skinMatrices[joint[k]]);
              vec3$8.scaleAndAdd(skinnedPos, skinnedPos, tmp, weight[k]);
            }
          }
          skinnedPositionAttr.set(i, skinnedPos);
        }
      }
      for (var i = 0; i < indices.length; i += 3) {
        var i1 = indices[i];
        var i2 = indices[i + 1];
        var i3 = indices[i + 2];
        var finalPosAttr = isSkinnedMesh ? geometry.attributes.skinnedPosition : positionAttr;
        finalPosAttr.get(i1, v1.array);
        finalPosAttr.get(i2, v2.array);
        finalPosAttr.get(i3, v3.array);
        if (cullBack) {
          point = ray.intersectTriangle(v1, v2, v3, renderable.culling);
        } else {
          point = ray.intersectTriangle(v1, v3, v2, renderable.culling);
        }
        if (point) {
          var pointW = new Vector3$1();
          if (!isSkinnedMesh) {
            Vector3$1.transformMat4(pointW, point, renderable.worldTransform);
          } else {
            Vector3$1.copy(pointW, point);
          }
          out.push(new RayPicking.Intersection(point, pointW, renderable, [i1, i2, i3], i / 3, Vector3$1.dist(pointW, this._ray.origin)));
        }
      }
    };
  }(),
  _intersectionCompareFunc: function(a, b) {
    return a.distance - b.distance;
  }
});
RayPicking.Intersection = function(point, pointWorld, target, triangle, triangleIndex, distance) {
  this.point = point;
  this.pointWorld = pointWorld;
  this.target = target;
  this.triangle = triangle;
  this.triangleIndex = triangleIndex;
  this.distance = distance;
};
var RayPicking$1 = RayPicking;
var DIRTY_PREFIX = "__dt__";
var Cache = function() {
  this._contextId = 0;
  this._caches = [];
  this._context = {};
};
Cache.prototype = {
  use: function(contextId, documentSchema) {
    var caches = this._caches;
    if (!caches[contextId]) {
      caches[contextId] = {};
      if (documentSchema) {
        caches[contextId] = documentSchema();
      }
    }
    this._contextId = contextId;
    this._context = caches[contextId];
  },
  put: function(key, value) {
    this._context[key] = value;
  },
  get: function(key) {
    return this._context[key];
  },
  dirty: function(field) {
    field = field || "";
    var key = DIRTY_PREFIX + field;
    this.put(key, true);
  },
  dirtyAll: function(field) {
    field = field || "";
    var key = DIRTY_PREFIX + field;
    var caches = this._caches;
    for (var i = 0; i < caches.length; i++) {
      if (caches[i]) {
        caches[i][key] = true;
      }
    }
  },
  fresh: function(field) {
    field = field || "";
    var key = DIRTY_PREFIX + field;
    this.put(key, false);
  },
  freshAll: function(field) {
    field = field || "";
    var key = DIRTY_PREFIX + field;
    var caches = this._caches;
    for (var i = 0; i < caches.length; i++) {
      if (caches[i]) {
        caches[i][key] = false;
      }
    }
  },
  isDirty: function(field) {
    field = field || "";
    var key = DIRTY_PREFIX + field;
    var context = this._context;
    return !context.hasOwnProperty(key) || context[key] === true;
  },
  deleteContext: function(contextId) {
    delete this._caches[contextId];
    this._context = {};
  },
  delete: function(key) {
    delete this._context[key];
  },
  clearAll: function() {
    this._caches = {};
  },
  getContext: function() {
    return this._context;
  },
  eachContext: function(cb, context) {
    var keys2 = Object.keys(this._caches);
    keys2.forEach(function(key) {
      cb && cb.call(context, key);
    });
  },
  miss: function(key) {
    return !this._context.hasOwnProperty(key);
  }
};
Cache.prototype.constructor = Cache;
var Cache$1 = Cache;
var Texture = Base$1.extend({
  width: 512,
  height: 512,
  type: glenum.UNSIGNED_BYTE,
  format: glenum.RGBA,
  wrapS: glenum.REPEAT,
  wrapT: glenum.REPEAT,
  minFilter: glenum.LINEAR_MIPMAP_LINEAR,
  magFilter: glenum.LINEAR,
  useMipmap: true,
  anisotropic: 1,
  flipY: true,
  sRGB: true,
  unpackAlignment: 4,
  premultiplyAlpha: false,
  dynamic: false,
  NPOT: false,
  __used: 0
}, function() {
  this._cache = new Cache$1();
}, {
  getWebGLTexture: function(renderer) {
    var _gl = renderer.gl;
    var cache = this._cache;
    cache.use(renderer.__uid__);
    if (cache.miss("webgl_texture")) {
      cache.put("webgl_texture", _gl.createTexture());
    }
    if (this.dynamic) {
      this.update(renderer);
    } else if (cache.isDirty()) {
      this.update(renderer);
      cache.fresh();
    }
    return cache.get("webgl_texture");
  },
  bind: function() {
  },
  unbind: function() {
  },
  dirty: function() {
    if (this._cache) {
      this._cache.dirtyAll();
    }
  },
  update: function(renderer) {
  },
  updateCommon: function(renderer) {
    var _gl = renderer.gl;
    _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
    _gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
    _gl.pixelStorei(_gl.UNPACK_ALIGNMENT, this.unpackAlignment);
    if (this.format === glenum.DEPTH_COMPONENT) {
      this.useMipmap = false;
    }
    var sRGBExt = renderer.getGLExtension("EXT_sRGB");
    if (this.format === Texture.SRGB && !sRGBExt) {
      this.format = Texture.RGB;
    }
    if (this.format === Texture.SRGB_ALPHA && !sRGBExt) {
      this.format = Texture.RGBA;
    }
    this.NPOT = !this.isPowerOfTwo();
  },
  getAvailableWrapS: function() {
    if (this.NPOT) {
      return glenum.CLAMP_TO_EDGE;
    }
    return this.wrapS;
  },
  getAvailableWrapT: function() {
    if (this.NPOT) {
      return glenum.CLAMP_TO_EDGE;
    }
    return this.wrapT;
  },
  getAvailableMinFilter: function() {
    var minFilter = this.minFilter;
    if (this.NPOT || !this.useMipmap) {
      if (minFilter === glenum.NEAREST_MIPMAP_NEAREST || minFilter === glenum.NEAREST_MIPMAP_LINEAR) {
        return glenum.NEAREST;
      } else if (minFilter === glenum.LINEAR_MIPMAP_LINEAR || minFilter === glenum.LINEAR_MIPMAP_NEAREST) {
        return glenum.LINEAR;
      } else {
        return minFilter;
      }
    } else {
      return minFilter;
    }
  },
  getAvailableMagFilter: function() {
    return this.magFilter;
  },
  nextHighestPowerOfTwo: function(x) {
    --x;
    for (var i = 1; i < 32; i <<= 1) {
      x = x | x >> i;
    }
    return x + 1;
  },
  dispose: function(renderer) {
    var cache = this._cache;
    cache.use(renderer.__uid__);
    var webglTexture = cache.get("webgl_texture");
    if (webglTexture) {
      renderer.gl.deleteTexture(webglTexture);
    }
    cache.deleteContext(renderer.__uid__);
  },
  isRenderable: function() {
  },
  isPowerOfTwo: function() {
  }
});
Object.defineProperty(Texture.prototype, "width", {
  get: function() {
    return this._width;
  },
  set: function(value) {
    this._width = value;
  }
});
Object.defineProperty(Texture.prototype, "height", {
  get: function() {
    return this._height;
  },
  set: function(value) {
    this._height = value;
  }
});
Texture.BYTE = glenum.BYTE;
Texture.UNSIGNED_BYTE = glenum.UNSIGNED_BYTE;
Texture.SHORT = glenum.SHORT;
Texture.UNSIGNED_SHORT = glenum.UNSIGNED_SHORT;
Texture.INT = glenum.INT;
Texture.UNSIGNED_INT = glenum.UNSIGNED_INT;
Texture.FLOAT = glenum.FLOAT;
Texture.HALF_FLOAT = 36193;
Texture.UNSIGNED_INT_24_8_WEBGL = 34042;
Texture.DEPTH_COMPONENT = glenum.DEPTH_COMPONENT;
Texture.DEPTH_STENCIL = glenum.DEPTH_STENCIL;
Texture.ALPHA = glenum.ALPHA;
Texture.RGB = glenum.RGB;
Texture.RGBA = glenum.RGBA;
Texture.LUMINANCE = glenum.LUMINANCE;
Texture.LUMINANCE_ALPHA = glenum.LUMINANCE_ALPHA;
Texture.SRGB = 35904;
Texture.SRGB_ALPHA = 35906;
Texture.COMPRESSED_RGB_S3TC_DXT1_EXT = 33776;
Texture.COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777;
Texture.COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778;
Texture.COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779;
Texture.NEAREST = glenum.NEAREST;
Texture.LINEAR = glenum.LINEAR;
Texture.NEAREST_MIPMAP_NEAREST = glenum.NEAREST_MIPMAP_NEAREST;
Texture.LINEAR_MIPMAP_NEAREST = glenum.LINEAR_MIPMAP_NEAREST;
Texture.NEAREST_MIPMAP_LINEAR = glenum.NEAREST_MIPMAP_LINEAR;
Texture.LINEAR_MIPMAP_LINEAR = glenum.LINEAR_MIPMAP_LINEAR;
Texture.REPEAT = glenum.REPEAT;
Texture.CLAMP_TO_EDGE = glenum.CLAMP_TO_EDGE;
Texture.MIRRORED_REPEAT = glenum.MIRRORED_REPEAT;
var Texture$1 = Texture;
var Mesh = Renderable$1.extend({
  skeleton: null,
  joints: null
}, function() {
  if (!this.joints) {
    this.joints = [];
  }
}, {
  offsetMatrix: null,
  isInstancedMesh: function() {
    return false;
  },
  isSkinnedMesh: function() {
    return !!(this.skeleton && this.joints && this.joints.length > 0);
  },
  clone: function() {
    var mesh2 = Renderable$1.prototype.clone.call(this);
    mesh2.skeleton = this.skeleton;
    if (this.joints) {
      mesh2.joints = this.joints.slice();
    }
    return mesh2;
  }
});
Mesh.POINTS = glenum.POINTS;
Mesh.LINES = glenum.LINES;
Mesh.LINE_LOOP = glenum.LINE_LOOP;
Mesh.LINE_STRIP = glenum.LINE_STRIP;
Mesh.TRIANGLES = glenum.TRIANGLES;
Mesh.TRIANGLE_STRIP = glenum.TRIANGLE_STRIP;
Mesh.TRIANGLE_FAN = glenum.TRIANGLE_FAN;
Mesh.BACK = glenum.BACK;
Mesh.FRONT = glenum.FRONT;
Mesh.FRONT_AND_BACK = glenum.FRONT_AND_BACK;
Mesh.CW = glenum.CW;
Mesh.CCW = glenum.CCW;
var Mesh$1 = Mesh;
var mathUtil = {};
mathUtil.isPowerOfTwo = function(value) {
  return (value & value - 1) === 0;
};
mathUtil.nextPowerOfTwo = function(value) {
  value--;
  value |= value >> 1;
  value |= value >> 2;
  value |= value >> 4;
  value |= value >> 8;
  value |= value >> 16;
  value++;
  return value;
};
mathUtil.nearestPowerOfTwo = function(value) {
  return Math.pow(2, Math.round(Math.log(value) / Math.LN2));
};
var mathUtil$1 = mathUtil;
var isPowerOfTwo$2 = mathUtil$1.isPowerOfTwo;
function nearestPowerOfTwo$1(val) {
  return Math.pow(2, Math.round(Math.log(val) / Math.LN2));
}
function convertTextureToPowerOfTwo$1(texture, canvas) {
  var width = nearestPowerOfTwo$1(texture.width);
  var height = nearestPowerOfTwo$1(texture.height);
  canvas = canvas || document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(texture.image, 0, 0, width, height);
  return canvas;
}
var Texture2D = Texture$1.extend(function() {
  return {
    image: null,
    pixels: null,
    mipmaps: [],
    convertToPOT: false
  };
}, {
  textureType: "texture2D",
  update: function(renderer) {
    var _gl = renderer.gl;
    _gl.bindTexture(_gl.TEXTURE_2D, this._cache.get("webgl_texture"));
    this.updateCommon(renderer);
    var glFormat = this.format;
    var glType = this.type;
    var convertToPOT = !!(this.convertToPOT && !this.mipmaps.length && this.image && (this.wrapS === Texture$1.REPEAT || this.wrapT === Texture$1.REPEAT) && this.NPOT);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, convertToPOT ? this.wrapS : this.getAvailableWrapS());
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, convertToPOT ? this.wrapT : this.getAvailableWrapT());
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, convertToPOT ? this.magFilter : this.getAvailableMagFilter());
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, convertToPOT ? this.minFilter : this.getAvailableMinFilter());
    var anisotropicExt = renderer.getGLExtension("EXT_texture_filter_anisotropic");
    if (anisotropicExt && this.anisotropic > 1) {
      _gl.texParameterf(_gl.TEXTURE_2D, anisotropicExt.TEXTURE_MAX_ANISOTROPY_EXT, this.anisotropic);
    }
    if (glType === 36193) {
      var halfFloatExt = renderer.getGLExtension("OES_texture_half_float");
      if (!halfFloatExt) {
        glType = glenum.FLOAT;
      }
    }
    if (this.mipmaps.length) {
      var width = this.width;
      var height = this.height;
      for (var i = 0; i < this.mipmaps.length; i++) {
        var mipmap = this.mipmaps[i];
        this._updateTextureData(_gl, mipmap, i, width, height, glFormat, glType, false);
        width /= 2;
        height /= 2;
      }
    } else {
      this._updateTextureData(_gl, this, 0, this.width, this.height, glFormat, glType, convertToPOT);
      if (this.useMipmap && (!this.NPOT || convertToPOT)) {
        _gl.generateMipmap(_gl.TEXTURE_2D);
      }
    }
    _gl.bindTexture(_gl.TEXTURE_2D, null);
  },
  _updateTextureData: function(_gl, data, level, width, height, glFormat, glType, convertToPOT) {
    if (data.image) {
      var imgData = data.image;
      if (convertToPOT) {
        this._potCanvas = convertTextureToPowerOfTwo$1(this, this._potCanvas);
        imgData = this._potCanvas;
      }
      _gl.texImage2D(_gl.TEXTURE_2D, level, glFormat, glFormat, glType, imgData);
    } else {
      if (glFormat <= Texture$1.COMPRESSED_RGBA_S3TC_DXT5_EXT && glFormat >= Texture$1.COMPRESSED_RGB_S3TC_DXT1_EXT) {
        _gl.compressedTexImage2D(_gl.TEXTURE_2D, level, glFormat, width, height, 0, data.pixels);
      } else {
        _gl.texImage2D(_gl.TEXTURE_2D, level, glFormat, width, height, 0, glFormat, glType, data.pixels);
      }
    }
  },
  generateMipmap: function(renderer) {
    var _gl = renderer.gl;
    if (this.useMipmap && !this.NPOT) {
      _gl.bindTexture(_gl.TEXTURE_2D, this._cache.get("webgl_texture"));
      _gl.generateMipmap(_gl.TEXTURE_2D);
    }
  },
  isPowerOfTwo: function() {
    return isPowerOfTwo$2(this.width) && isPowerOfTwo$2(this.height);
  },
  isRenderable: function() {
    if (this.image) {
      return this.image.width > 0 && this.image.height > 0;
    } else {
      return !!(this.width && this.height);
    }
  },
  bind: function(renderer) {
    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, this.getWebGLTexture(renderer));
  },
  unbind: function(renderer) {
    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, null);
  },
  load: function(src, crossOrigin) {
    var image = vendor$1.createImage();
    if (crossOrigin) {
      image.crossOrigin = crossOrigin;
    }
    var self = this;
    image.onload = function() {
      self.dirty();
      self.trigger("success", self);
    };
    image.onerror = function() {
      self.trigger("error", self);
    };
    image.src = src;
    this.image = image;
    return this;
  }
});
Object.defineProperty(Texture2D.prototype, "width", {
  get: function() {
    if (this.image) {
      return this.image.width;
    }
    return this._width;
  },
  set: function(value) {
    if (this.image) {
      console.warn("Texture from image can't set width");
    } else {
      if (this._width !== value) {
        this.dirty();
      }
      this._width = value;
    }
  }
});
Object.defineProperty(Texture2D.prototype, "height", {
  get: function() {
    if (this.image) {
      return this.image.height;
    }
    return this._height;
  },
  set: function(value) {
    if (this.image) {
      console.warn("Texture from image can't set height");
    } else {
      if (this._height !== value) {
        this.dirty();
      }
      this._height = value;
    }
  }
});
var Texture2D$1 = Texture2D;
function getArrayCtorByType(type) {
  return {
    "byte": vendor$1.Int8Array,
    "ubyte": vendor$1.Uint8Array,
    "short": vendor$1.Int16Array,
    "ushort": vendor$1.Uint16Array
  }[type] || vendor$1.Float32Array;
}
function makeAttrKey(attrName) {
  return "attr_" + attrName;
}
function Attribute$1(name, type, size, semantic) {
  this.name = name;
  this.type = type;
  this.size = size;
  this.semantic = semantic || "";
  this.value = null;
  switch (size) {
    case 1:
      this.get = function(idx) {
        return this.value[idx];
      };
      this.set = function(idx, value) {
        this.value[idx] = value;
      };
      this.copy = function(target, source) {
        this.value[target] = this.value[target];
      };
      break;
    case 2:
      this.get = function(idx, out) {
        var arr = this.value;
        out[0] = arr[idx * 2];
        out[1] = arr[idx * 2 + 1];
        return out;
      };
      this.set = function(idx, val) {
        var arr = this.value;
        arr[idx * 2] = val[0];
        arr[idx * 2 + 1] = val[1];
      };
      this.copy = function(target, source) {
        var arr = this.value;
        source *= 2;
        target *= 2;
        arr[target] = arr[source];
        arr[target + 1] = arr[source + 1];
      };
      break;
    case 3:
      this.get = function(idx, out) {
        var idx3 = idx * 3;
        var arr = this.value;
        out[0] = arr[idx3];
        out[1] = arr[idx3 + 1];
        out[2] = arr[idx3 + 2];
        return out;
      };
      this.set = function(idx, val) {
        var idx3 = idx * 3;
        var arr = this.value;
        arr[idx3] = val[0];
        arr[idx3 + 1] = val[1];
        arr[idx3 + 2] = val[2];
      };
      this.copy = function(target, source) {
        var arr = this.value;
        source *= 3;
        target *= 3;
        arr[target] = arr[source];
        arr[target + 1] = arr[source + 1];
        arr[target + 2] = arr[source + 2];
      };
      break;
    case 4:
      this.get = function(idx, out) {
        var arr = this.value;
        var idx4 = idx * 4;
        out[0] = arr[idx4];
        out[1] = arr[idx4 + 1];
        out[2] = arr[idx4 + 2];
        out[3] = arr[idx4 + 3];
        return out;
      };
      this.set = function(idx, val) {
        var arr = this.value;
        var idx4 = idx * 4;
        arr[idx4] = val[0];
        arr[idx4 + 1] = val[1];
        arr[idx4 + 2] = val[2];
        arr[idx4 + 3] = val[3];
      };
      this.copy = function(target, source) {
        var arr = this.value;
        source *= 4;
        target *= 4;
        arr[target] = arr[source];
        arr[target + 1] = arr[source + 1];
        arr[target + 2] = arr[source + 2];
        arr[target + 3] = arr[source + 3];
      };
  }
}
Attribute$1.prototype.init = function(nVertex) {
  if (!this.value || this.value.length !== nVertex * this.size) {
    var ArrayConstructor = getArrayCtorByType(this.type);
    this.value = new ArrayConstructor(nVertex * this.size);
  }
};
Attribute$1.prototype.fromArray = function(array) {
  var ArrayConstructor = getArrayCtorByType(this.type);
  var value;
  if (array[0] && array[0].length) {
    var n = 0;
    var size = this.size;
    value = new ArrayConstructor(array.length * size);
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < size; j++) {
        value[n++] = array[i][j];
      }
    }
  } else {
    value = new ArrayConstructor(array);
  }
  this.value = value;
};
Attribute$1.prototype.clone = function(copyValue) {
  var ret2 = new Attribute$1(this.name, this.type, this.size, this.semantic);
  if (copyValue) {
    console.warn("todo");
  }
  return ret2;
};
function AttributeBuffer(name, type, buffer, size, semantic) {
  this.name = name;
  this.type = type;
  this.buffer = buffer;
  this.size = size;
  this.semantic = semantic;
  this.symbol = "";
  this.needsRemove = false;
}
function IndicesBuffer(buffer) {
  this.buffer = buffer;
  this.count = 0;
}
var GeometryBase = Base$1.extend(function() {
  return {
    attributes: {},
    indices: null,
    dynamic: true,
    _enabledAttributes: null,
    __used: 0
  };
}, function() {
  this._cache = new Cache$1();
  this._attributeList = Object.keys(this.attributes);
  this.__vaoCache = {};
}, {
  mainAttribute: "",
  pick: null,
  pickByRay: null,
  dirty: function() {
    var enabledAttributes = this.getEnabledAttributes();
    for (var i = 0; i < enabledAttributes.length; i++) {
      this.dirtyAttribute(enabledAttributes[i]);
    }
    this.dirtyIndices();
    this._enabledAttributes = null;
    this._cache.dirty("any");
  },
  dirtyIndices: function() {
    this._cache.dirtyAll("indices");
  },
  dirtyAttribute: function(attrName) {
    this._cache.dirtyAll(makeAttrKey(attrName));
    this._cache.dirtyAll("attributes");
  },
  getTriangleIndices: function(idx, out) {
    if (idx < this.triangleCount && idx >= 0) {
      if (!out) {
        out = [];
      }
      var indices = this.indices;
      out[0] = indices[idx * 3];
      out[1] = indices[idx * 3 + 1];
      out[2] = indices[idx * 3 + 2];
      return out;
    }
  },
  setTriangleIndices: function(idx, arr) {
    var indices = this.indices;
    indices[idx * 3] = arr[0];
    indices[idx * 3 + 1] = arr[1];
    indices[idx * 3 + 2] = arr[2];
  },
  isUseIndices: function() {
    return !!this.indices;
  },
  initIndicesFromArray: function(array) {
    var value;
    var ArrayConstructor = this.vertexCount > 65535 ? vendor$1.Uint32Array : vendor$1.Uint16Array;
    if (array[0] && array[0].length) {
      var n = 0;
      var size = 3;
      value = new ArrayConstructor(array.length * size);
      for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < size; j++) {
          value[n++] = array[i][j];
        }
      }
    } else {
      value = new ArrayConstructor(array);
    }
    this.indices = value;
  },
  createAttribute: function(name, type, size, semantic) {
    var attrib = new Attribute$1(name, type, size, semantic);
    if (this.attributes[name]) {
      this.removeAttribute(name);
    }
    this.attributes[name] = attrib;
    this._attributeList.push(name);
    return attrib;
  },
  removeAttribute: function(name) {
    var attributeList = this._attributeList;
    var idx = attributeList.indexOf(name);
    if (idx >= 0) {
      attributeList.splice(idx, 1);
      delete this.attributes[name];
      return true;
    }
    return false;
  },
  getAttribute: function(name) {
    return this.attributes[name];
  },
  getEnabledAttributes: function() {
    var enabledAttributes = this._enabledAttributes;
    var attributeList = this._attributeList;
    if (enabledAttributes) {
      return enabledAttributes;
    }
    var result = [];
    var nVertex = this.vertexCount;
    for (var i = 0; i < attributeList.length; i++) {
      var name = attributeList[i];
      var attrib = this.attributes[name];
      if (attrib.value) {
        if (attrib.value.length === nVertex * attrib.size) {
          result.push(name);
        }
      }
    }
    this._enabledAttributes = result;
    return result;
  },
  getBufferChunks: function(renderer) {
    var cache = this._cache;
    cache.use(renderer.__uid__);
    var isAttributesDirty = cache.isDirty("attributes");
    var isIndicesDirty = cache.isDirty("indices");
    if (isAttributesDirty || isIndicesDirty) {
      this._updateBuffer(renderer.gl, isAttributesDirty, isIndicesDirty);
      var enabledAttributes = this.getEnabledAttributes();
      for (var i = 0; i < enabledAttributes.length; i++) {
        cache.fresh(makeAttrKey(enabledAttributes[i]));
      }
      cache.fresh("attributes");
      cache.fresh("indices");
    }
    cache.fresh("any");
    return cache.get("chunks");
  },
  _updateBuffer: function(_gl, isAttributesDirty, isIndicesDirty) {
    var cache = this._cache;
    var chunks = cache.get("chunks");
    var firstUpdate = false;
    if (!chunks) {
      chunks = [];
      chunks[0] = {
        attributeBuffers: [],
        indicesBuffer: null
      };
      cache.put("chunks", chunks);
      firstUpdate = true;
    }
    var chunk = chunks[0];
    var attributeBuffers = chunk.attributeBuffers;
    var indicesBuffer = chunk.indicesBuffer;
    if (isAttributesDirty || firstUpdate) {
      var attributeList = this.getEnabledAttributes();
      var attributeBufferMap = {};
      if (!firstUpdate) {
        for (var i = 0; i < attributeBuffers.length; i++) {
          attributeBufferMap[attributeBuffers[i].name] = attributeBuffers[i];
        }
      }
      for (var k = 0; k < attributeList.length; k++) {
        var name = attributeList[k];
        var attribute = this.attributes[name];
        var bufferInfo;
        if (!firstUpdate) {
          bufferInfo = attributeBufferMap[name];
        }
        var buffer;
        if (bufferInfo) {
          buffer = bufferInfo.buffer;
        } else {
          buffer = _gl.createBuffer();
        }
        if (cache.isDirty(makeAttrKey(name))) {
          _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
          _gl.bufferData(_gl.ARRAY_BUFFER, attribute.value, this.dynamic ? _gl.DYNAMIC_DRAW : _gl.STATIC_DRAW);
        }
        attributeBuffers[k] = new AttributeBuffer(name, attribute.type, buffer, attribute.size, attribute.semantic);
      }
      for (var i = k; i < attributeBuffers.length; i++) {
        _gl.deleteBuffer(attributeBuffers[i].buffer);
      }
      attributeBuffers.length = k;
    }
    if (this.isUseIndices() && (isIndicesDirty || firstUpdate)) {
      if (!indicesBuffer) {
        indicesBuffer = new IndicesBuffer(_gl.createBuffer());
        chunk.indicesBuffer = indicesBuffer;
      }
      indicesBuffer.count = this.indices.length;
      _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, indicesBuffer.buffer);
      _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, this.indices, this.dynamic ? _gl.DYNAMIC_DRAW : _gl.STATIC_DRAW);
    }
  },
  dispose: function(renderer) {
    var cache = this._cache;
    cache.use(renderer.__uid__);
    var chunks = cache.get("chunks");
    if (chunks) {
      for (var c = 0; c < chunks.length; c++) {
        var chunk = chunks[c];
        for (var k = 0; k < chunk.attributeBuffers.length; k++) {
          var attribs = chunk.attributeBuffers[k];
          renderer.gl.deleteBuffer(attribs.buffer);
        }
        if (chunk.indicesBuffer) {
          renderer.gl.deleteBuffer(chunk.indicesBuffer.buffer);
        }
      }
    }
    if (this.__vaoCache) {
      var vaoExt = renderer.getGLExtension("OES_vertex_array_object");
      for (var id in this.__vaoCache) {
        var vao = this.__vaoCache[id].vao;
        if (vao) {
          vaoExt.deleteVertexArrayOES(vao);
        }
      }
    }
    this.__vaoCache = {};
    cache.deleteContext(renderer.__uid__);
  }
});
if (Object.defineProperty) {
  Object.defineProperty(GeometryBase.prototype, "vertexCount", {
    enumerable: false,
    get: function() {
      var mainAttribute = this.attributes[this.mainAttribute];
      if (!mainAttribute) {
        mainAttribute = this.attributes[this._attributeList[0]];
      }
      if (!mainAttribute || !mainAttribute.value) {
        return 0;
      }
      return mainAttribute.value.length / mainAttribute.size;
    }
  });
  Object.defineProperty(GeometryBase.prototype, "triangleCount", {
    enumerable: false,
    get: function() {
      var indices = this.indices;
      if (!indices) {
        return 0;
      } else {
        return indices.length / 3;
      }
    }
  });
}
GeometryBase.STATIC_DRAW = glenum.STATIC_DRAW;
GeometryBase.DYNAMIC_DRAW = glenum.DYNAMIC_DRAW;
GeometryBase.STREAM_DRAW = glenum.STREAM_DRAW;
GeometryBase.AttributeBuffer = AttributeBuffer;
GeometryBase.IndicesBuffer = IndicesBuffer;
GeometryBase.Attribute = Attribute$1;
var GeometryBase$1 = GeometryBase;
var vec3Create = vec3$8.create;
var vec3Add = vec3$8.add;
var vec3Set$1 = vec3$8.set;
var Attribute = GeometryBase$1.Attribute;
var Geometry = GeometryBase$1.extend(function() {
  return {
    attributes: {
      position: new Attribute("position", "float", 3, "POSITION"),
      texcoord0: new Attribute("texcoord0", "float", 2, "TEXCOORD_0"),
      texcoord1: new Attribute("texcoord1", "float", 2, "TEXCOORD_1"),
      normal: new Attribute("normal", "float", 3, "NORMAL"),
      tangent: new Attribute("tangent", "float", 4, "TANGENT"),
      color: new Attribute("color", "float", 4, "COLOR"),
      weight: new Attribute("weight", "float", 3, "WEIGHT"),
      joint: new Attribute("joint", "float", 4, "JOINT"),
      barycentric: new Attribute("barycentric", "float", 3, null)
    },
    boundingBox: null
  };
}, {
  mainAttribute: "position",
  updateBoundingBox: function() {
    var bbox = this.boundingBox;
    if (!bbox) {
      bbox = this.boundingBox = new BoundingBox$1();
    }
    var posArr = this.attributes.position.value;
    if (posArr && posArr.length) {
      var min = bbox.min;
      var max = bbox.max;
      var minArr = min.array;
      var maxArr = max.array;
      vec3$8.set(minArr, posArr[0], posArr[1], posArr[2]);
      vec3$8.set(maxArr, posArr[0], posArr[1], posArr[2]);
      for (var i = 3; i < posArr.length; ) {
        var x = posArr[i++];
        var y = posArr[i++];
        var z = posArr[i++];
        if (x < minArr[0]) {
          minArr[0] = x;
        }
        if (y < minArr[1]) {
          minArr[1] = y;
        }
        if (z < minArr[2]) {
          minArr[2] = z;
        }
        if (x > maxArr[0]) {
          maxArr[0] = x;
        }
        if (y > maxArr[1]) {
          maxArr[1] = y;
        }
        if (z > maxArr[2]) {
          maxArr[2] = z;
        }
      }
      min._dirty = true;
      max._dirty = true;
    }
  },
  generateVertexNormals: function() {
    if (!this.vertexCount) {
      return;
    }
    var indices = this.indices;
    var attributes = this.attributes;
    var positions = attributes.position.value;
    var normals = attributes.normal.value;
    if (!normals || normals.length !== positions.length) {
      normals = attributes.normal.value = new vendor$1.Float32Array(positions.length);
    } else {
      for (var i = 0; i < normals.length; i++) {
        normals[i] = 0;
      }
    }
    var p12 = vec3Create();
    var p22 = vec3Create();
    var p3 = vec3Create();
    var v21 = vec3Create();
    var v32 = vec3Create();
    var n = vec3Create();
    var len = indices ? indices.length : this.vertexCount;
    var i1, i2, i3;
    for (var f = 0; f < len; ) {
      if (indices) {
        i1 = indices[f++];
        i2 = indices[f++];
        i3 = indices[f++];
      } else {
        i1 = f++;
        i2 = f++;
        i3 = f++;
      }
      vec3Set$1(p12, positions[i1 * 3], positions[i1 * 3 + 1], positions[i1 * 3 + 2]);
      vec3Set$1(p22, positions[i2 * 3], positions[i2 * 3 + 1], positions[i2 * 3 + 2]);
      vec3Set$1(p3, positions[i3 * 3], positions[i3 * 3 + 1], positions[i3 * 3 + 2]);
      vec3$8.sub(v21, p12, p22);
      vec3$8.sub(v32, p22, p3);
      vec3$8.cross(n, v21, v32);
      for (var i = 0; i < 3; i++) {
        normals[i1 * 3 + i] = normals[i1 * 3 + i] + n[i];
        normals[i2 * 3 + i] = normals[i2 * 3 + i] + n[i];
        normals[i3 * 3 + i] = normals[i3 * 3 + i] + n[i];
      }
    }
    for (var i = 0; i < normals.length; ) {
      vec3Set$1(n, normals[i], normals[i + 1], normals[i + 2]);
      vec3$8.normalize(n, n);
      normals[i++] = n[0];
      normals[i++] = n[1];
      normals[i++] = n[2];
    }
    this.dirty();
  },
  generateFaceNormals: function() {
    if (!this.vertexCount) {
      return;
    }
    if (!this.isUniqueVertex()) {
      this.generateUniqueVertex();
    }
    var indices = this.indices;
    var attributes = this.attributes;
    var positions = attributes.position.value;
    var normals = attributes.normal.value;
    var p12 = vec3Create();
    var p22 = vec3Create();
    var p3 = vec3Create();
    var v21 = vec3Create();
    var v32 = vec3Create();
    var n = vec3Create();
    if (!normals) {
      normals = attributes.normal.value = new Float32Array(positions.length);
    }
    var len = indices ? indices.length : this.vertexCount;
    var i1, i2, i3;
    for (var f = 0; f < len; ) {
      if (indices) {
        i1 = indices[f++];
        i2 = indices[f++];
        i3 = indices[f++];
      } else {
        i1 = f++;
        i2 = f++;
        i3 = f++;
      }
      vec3Set$1(p12, positions[i1 * 3], positions[i1 * 3 + 1], positions[i1 * 3 + 2]);
      vec3Set$1(p22, positions[i2 * 3], positions[i2 * 3 + 1], positions[i2 * 3 + 2]);
      vec3Set$1(p3, positions[i3 * 3], positions[i3 * 3 + 1], positions[i3 * 3 + 2]);
      vec3$8.sub(v21, p12, p22);
      vec3$8.sub(v32, p22, p3);
      vec3$8.cross(n, v21, v32);
      vec3$8.normalize(n, n);
      for (var i = 0; i < 3; i++) {
        normals[i1 * 3 + i] = n[i];
        normals[i2 * 3 + i] = n[i];
        normals[i3 * 3 + i] = n[i];
      }
    }
    this.dirty();
  },
  generateTangents: function() {
    if (!this.vertexCount) {
      return;
    }
    var nVertex = this.vertexCount;
    var attributes = this.attributes;
    if (!attributes.tangent.value) {
      attributes.tangent.value = new Float32Array(nVertex * 4);
    }
    var texcoords = attributes.texcoord0.value;
    var positions = attributes.position.value;
    var tangents = attributes.tangent.value;
    var normals = attributes.normal.value;
    if (!texcoords) {
      console.warn("Geometry without texcoords can't generate tangents.");
      return;
    }
    var tan1 = [];
    var tan2 = [];
    for (var i = 0; i < nVertex; i++) {
      tan1[i] = [0, 0, 0];
      tan2[i] = [0, 0, 0];
    }
    var sdir = [0, 0, 0];
    var tdir = [0, 0, 0];
    var indices = this.indices;
    var len = indices ? indices.length : this.vertexCount;
    var i1, i2, i3;
    for (var i = 0; i < len; ) {
      if (indices) {
        i1 = indices[i++];
        i2 = indices[i++];
        i3 = indices[i++];
      } else {
        i1 = i++;
        i2 = i++;
        i3 = i++;
      }
      var st1s = texcoords[i1 * 2], st2s = texcoords[i2 * 2], st3s = texcoords[i3 * 2], st1t = texcoords[i1 * 2 + 1], st2t = texcoords[i2 * 2 + 1], st3t = texcoords[i3 * 2 + 1], p1x = positions[i1 * 3], p2x = positions[i2 * 3], p3x = positions[i3 * 3], p1y = positions[i1 * 3 + 1], p2y = positions[i2 * 3 + 1], p3y = positions[i3 * 3 + 1], p1z = positions[i1 * 3 + 2], p2z = positions[i2 * 3 + 2], p3z = positions[i3 * 3 + 2];
      var x1 = p2x - p1x, x2 = p3x - p1x, y1 = p2y - p1y, y2 = p3y - p1y, z1 = p2z - p1z, z2 = p3z - p1z;
      var s1 = st2s - st1s, s2 = st3s - st1s, t1 = st2t - st1t, t2 = st3t - st1t;
      var r = 1 / (s1 * t2 - t1 * s2);
      sdir[0] = (t2 * x1 - t1 * x2) * r;
      sdir[1] = (t2 * y1 - t1 * y2) * r;
      sdir[2] = (t2 * z1 - t1 * z2) * r;
      tdir[0] = (s1 * x2 - s2 * x1) * r;
      tdir[1] = (s1 * y2 - s2 * y1) * r;
      tdir[2] = (s1 * z2 - s2 * z1) * r;
      vec3Add(tan1[i1], tan1[i1], sdir);
      vec3Add(tan1[i2], tan1[i2], sdir);
      vec3Add(tan1[i3], tan1[i3], sdir);
      vec3Add(tan2[i1], tan2[i1], tdir);
      vec3Add(tan2[i2], tan2[i2], tdir);
      vec3Add(tan2[i3], tan2[i3], tdir);
    }
    var tmp = vec3Create();
    var nCrossT = vec3Create();
    var n = vec3Create();
    for (var i = 0; i < nVertex; i++) {
      n[0] = normals[i * 3];
      n[1] = normals[i * 3 + 1];
      n[2] = normals[i * 3 + 2];
      var t = tan1[i];
      vec3$8.scale(tmp, n, vec3$8.dot(n, t));
      vec3$8.sub(tmp, t, tmp);
      vec3$8.normalize(tmp, tmp);
      vec3$8.cross(nCrossT, n, t);
      tangents[i * 4] = tmp[0];
      tangents[i * 4 + 1] = tmp[1];
      tangents[i * 4 + 2] = tmp[2];
      tangents[i * 4 + 3] = vec3$8.dot(nCrossT, tan2[i]) < 0 ? -1 : 1;
    }
    this.dirty();
  },
  isUniqueVertex: function() {
    if (this.isUseIndices()) {
      return this.vertexCount === this.indices.length;
    } else {
      return true;
    }
  },
  generateUniqueVertex: function() {
    if (!this.vertexCount || !this.indices) {
      return;
    }
    if (this.indices.length > 65535) {
      this.indices = new vendor$1.Uint32Array(this.indices);
    }
    var attributes = this.attributes;
    var indices = this.indices;
    var attributeNameList = this.getEnabledAttributes();
    var oldAttrValues = {};
    for (var a = 0; a < attributeNameList.length; a++) {
      var name = attributeNameList[a];
      oldAttrValues[name] = attributes[name].value;
      attributes[name].init(this.indices.length);
    }
    var cursor = 0;
    for (var i = 0; i < indices.length; i++) {
      var ii = indices[i];
      for (var a = 0; a < attributeNameList.length; a++) {
        var name = attributeNameList[a];
        var array = attributes[name].value;
        var size = attributes[name].size;
        for (var k = 0; k < size; k++) {
          array[cursor * size + k] = oldAttrValues[name][ii * size + k];
        }
      }
      indices[i] = cursor;
      cursor++;
    }
    this.dirty();
  },
  generateBarycentric: function() {
    if (!this.vertexCount) {
      return;
    }
    if (!this.isUniqueVertex()) {
      this.generateUniqueVertex();
    }
    var attributes = this.attributes;
    var array = attributes.barycentric.value;
    var indices = this.indices;
    if (array && array.length === indices.length * 3) {
      return;
    }
    array = attributes.barycentric.value = new Float32Array(indices.length * 3);
    for (var i = 0; i < (indices ? indices.length : this.vertexCount / 3); ) {
      for (var j = 0; j < 3; j++) {
        var ii = indices ? indices[i++] : i * 3 + j;
        array[ii * 3 + j] = 1;
      }
    }
    this.dirty();
  },
  applyTransform: function(matrix) {
    var attributes = this.attributes;
    var positions = attributes.position.value;
    var normals = attributes.normal.value;
    var tangents = attributes.tangent.value;
    matrix = matrix.array;
    var inverseTransposeMatrix = mat4$2.create();
    mat4$2.invert(inverseTransposeMatrix, matrix);
    mat4$2.transpose(inverseTransposeMatrix, inverseTransposeMatrix);
    var vec3TransformMat4 = vec3$8.transformMat4;
    var vec3ForEach = vec3$8.forEach;
    vec3ForEach(positions, 3, 0, null, vec3TransformMat4, matrix);
    if (normals) {
      vec3ForEach(normals, 3, 0, null, vec3TransformMat4, inverseTransposeMatrix);
    }
    if (tangents) {
      vec3ForEach(tangents, 4, 0, null, vec3TransformMat4, inverseTransposeMatrix);
    }
    if (this.boundingBox) {
      this.updateBoundingBox();
    }
  },
  dispose: function(renderer) {
    var cache = this._cache;
    cache.use(renderer.__uid__);
    var chunks = cache.get("chunks");
    if (chunks) {
      for (var c = 0; c < chunks.length; c++) {
        var chunk = chunks[c];
        for (var k = 0; k < chunk.attributeBuffers.length; k++) {
          var attribs = chunk.attributeBuffers[k];
          renderer.gl.deleteBuffer(attribs.buffer);
        }
        if (chunk.indicesBuffer) {
          renderer.gl.deleteBuffer(chunk.indicesBuffer.buffer);
        }
      }
    }
    if (this.__vaoCache) {
      var vaoExt = renderer.getGLExtension("OES_vertex_array_object");
      for (var id in this.__vaoCache) {
        var vao = this.__vaoCache[id].vao;
        if (vao) {
          vaoExt.deleteVertexArrayOES(vao);
        }
      }
    }
    this.__vaoCache = {};
    cache.deleteContext(renderer.__uid__);
  }
});
Geometry.STATIC_DRAW = GeometryBase$1.STATIC_DRAW;
Geometry.DYNAMIC_DRAW = GeometryBase$1.DYNAMIC_DRAW;
Geometry.STREAM_DRAW = GeometryBase$1.STREAM_DRAW;
Geometry.AttributeBuffer = GeometryBase$1.AttributeBuffer;
Geometry.IndicesBuffer = GeometryBase$1.IndicesBuffer;
Geometry.Attribute = Attribute;
var Geometry$1 = Geometry;
var calcAmbientSHLightEssl = "vec3 calcAmbientSHLight(int idx, vec3 N) {\n int offset = 9 * idx;\n return ambientSHLightCoefficients[0]\n + ambientSHLightCoefficients[1] * N.x\n + ambientSHLightCoefficients[2] * N.y\n + ambientSHLightCoefficients[3] * N.z\n + ambientSHLightCoefficients[4] * N.x * N.z\n + ambientSHLightCoefficients[5] * N.z * N.y\n + ambientSHLightCoefficients[6] * N.y * N.x\n + ambientSHLightCoefficients[7] * (3.0 * N.z * N.z - 1.0)\n + ambientSHLightCoefficients[8] * (N.x * N.x - N.y * N.y);\n}";
var uniformVec3Prefix = "uniform vec3 ";
var uniformFloatPrefix = "uniform float ";
var exportHeaderPrefix = "@export clay.header.";
var exportEnd = "@end";
var unconfigurable = ":unconfigurable;";
var lightShader = [exportHeaderPrefix + "directional_light", uniformVec3Prefix + "directionalLightDirection[DIRECTIONAL_LIGHT_COUNT]" + unconfigurable, uniformVec3Prefix + "directionalLightColor[DIRECTIONAL_LIGHT_COUNT]" + unconfigurable, exportEnd, exportHeaderPrefix + "ambient_light", uniformVec3Prefix + "ambientLightColor[AMBIENT_LIGHT_COUNT]" + unconfigurable, exportEnd, exportHeaderPrefix + "ambient_sh_light", uniformVec3Prefix + "ambientSHLightColor[AMBIENT_SH_LIGHT_COUNT]" + unconfigurable, uniformVec3Prefix + "ambientSHLightCoefficients[AMBIENT_SH_LIGHT_COUNT * 9]" + unconfigurable, calcAmbientSHLightEssl, exportEnd, exportHeaderPrefix + "ambient_cubemap_light", uniformVec3Prefix + "ambientCubemapLightColor[AMBIENT_CUBEMAP_LIGHT_COUNT]" + unconfigurable, "uniform samplerCube ambientCubemapLightCubemap[AMBIENT_CUBEMAP_LIGHT_COUNT]" + unconfigurable, "uniform sampler2D ambientCubemapLightBRDFLookup[AMBIENT_CUBEMAP_LIGHT_COUNT]" + unconfigurable, exportEnd, exportHeaderPrefix + "point_light", uniformVec3Prefix + "pointLightPosition[POINT_LIGHT_COUNT]" + unconfigurable, uniformFloatPrefix + "pointLightRange[POINT_LIGHT_COUNT]" + unconfigurable, uniformVec3Prefix + "pointLightColor[POINT_LIGHT_COUNT]" + unconfigurable, exportEnd, exportHeaderPrefix + "spot_light", uniformVec3Prefix + "spotLightPosition[SPOT_LIGHT_COUNT]" + unconfigurable, uniformVec3Prefix + "spotLightDirection[SPOT_LIGHT_COUNT]" + unconfigurable, uniformFloatPrefix + "spotLightRange[SPOT_LIGHT_COUNT]" + unconfigurable, uniformFloatPrefix + "spotLightUmbraAngleCosine[SPOT_LIGHT_COUNT]" + unconfigurable, uniformFloatPrefix + "spotLightPenumbraAngleCosine[SPOT_LIGHT_COUNT]" + unconfigurable, uniformFloatPrefix + "spotLightFalloffFactor[SPOT_LIGHT_COUNT]" + unconfigurable, uniformVec3Prefix + "spotLightColor[SPOT_LIGHT_COUNT]" + unconfigurable, exportEnd].join("\n");
Shader["import"](lightShader);
var Light = Node3D.extend(function() {
  return {
    color: [1, 1, 1],
    intensity: 1,
    castShadow: true,
    shadowResolution: 512,
    group: 0
  };
}, {
  type: "",
  clone: function() {
    var light = Node3D.prototype.clone.call(this);
    light.color = Array.prototype.slice.call(this.color);
    light.intensity = this.intensity;
    light.castShadow = this.castShadow;
    light.shadowResolution = this.shadowResolution;
    return light;
  }
});
var Light$1 = Light;
var Plane$1 = function(normal2, distance) {
  this.normal = normal2 || new Vector3$1(0, 1, 0);
  this.distance = distance || 0;
};
Plane$1.prototype = {
  constructor: Plane$1,
  distanceToPoint: function(point) {
    return vec3$8.dot(point.array, this.normal.array) - this.distance;
  },
  projectPoint: function(point, out) {
    if (!out) {
      out = new Vector3$1();
    }
    var d = this.distanceToPoint(point);
    vec3$8.scaleAndAdd(out.array, point.array, this.normal.array, -d);
    out._dirty = true;
    return out;
  },
  normalize: function() {
    var invLen = 1 / vec3$8.len(this.normal.array);
    vec3$8.scale(this.normal.array, invLen);
    this.distance *= invLen;
  },
  intersectFrustum: function(frustum) {
    var coords = frustum.vertices;
    var normal2 = this.normal.array;
    var onPlane = vec3$8.dot(coords[0].array, normal2) > this.distance;
    for (var i = 1; i < 8; i++) {
      if (vec3$8.dot(coords[i].array, normal2) > this.distance != onPlane) {
        return true;
      }
    }
  },
  intersectLine: function() {
    var rd = vec3$8.create();
    return function(start, end, out) {
      var d0 = this.distanceToPoint(start);
      var d1 = this.distanceToPoint(end);
      if (d0 > 0 && d1 > 0 || d0 < 0 && d1 < 0) {
        return null;
      }
      var pn = this.normal.array;
      var d = this.distance;
      var ro = start.array;
      vec3$8.sub(rd, end.array, start.array);
      vec3$8.normalize(rd, rd);
      var divider = vec3$8.dot(pn, rd);
      if (divider === 0) {
        return null;
      }
      if (!out) {
        out = new Vector3$1();
      }
      var t = (vec3$8.dot(pn, ro) - d) / divider;
      vec3$8.scaleAndAdd(out.array, ro, rd, -t);
      out._dirty = true;
      return out;
    };
  }(),
  applyTransform: function() {
    var inverseTranspose = mat4$2.create();
    var normalv4 = vec4$1.create();
    var pointv4 = vec4$1.create();
    pointv4[3] = 1;
    return function(m4) {
      m4 = m4.array;
      vec3$8.scale(pointv4, this.normal.array, this.distance);
      vec4$1.transformMat4(pointv4, pointv4, m4);
      this.distance = vec3$8.dot(pointv4, this.normal.array);
      mat4$2.invert(inverseTranspose, m4);
      mat4$2.transpose(inverseTranspose, inverseTranspose);
      normalv4[3] = 0;
      vec3$8.copy(normalv4, this.normal.array);
      vec4$1.transformMat4(normalv4, normalv4, inverseTranspose);
      vec3$8.copy(this.normal.array, normalv4);
    };
  }(),
  copy: function(plane) {
    vec3$8.copy(this.normal.array, plane.normal.array);
    this.normal._dirty = true;
    this.distance = plane.distance;
  },
  clone: function() {
    var plane = new Plane$1();
    plane.copy(this);
    return plane;
  }
};
var Plane$2 = Plane$1;
var vec3Set = vec3$8.set;
var vec3Copy = vec3$8.copy;
var vec3TranformMat4 = vec3$8.transformMat4;
var mathMin = Math.min;
var mathMax = Math.max;
var Frustum = function() {
  this.planes = [];
  for (var i = 0; i < 6; i++) {
    this.planes.push(new Plane$2());
  }
  this.boundingBox = new BoundingBox$1();
  this.vertices = [];
  for (var i = 0; i < 8; i++) {
    this.vertices[i] = vec3$8.fromValues(0, 0, 0);
  }
};
Frustum.prototype = {
  setFromProjection: function(projectionMatrix) {
    var planes = this.planes;
    var m = projectionMatrix.array;
    var m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3];
    var m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7];
    var m8 = m[8], m9 = m[9], m10 = m[10], m11 = m[11];
    var m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15];
    vec3Set(planes[0].normal.array, m3 - m0, m7 - m4, m11 - m8);
    planes[0].distance = -(m15 - m12);
    planes[0].normalize();
    vec3Set(planes[1].normal.array, m3 + m0, m7 + m4, m11 + m8);
    planes[1].distance = -(m15 + m12);
    planes[1].normalize();
    vec3Set(planes[2].normal.array, m3 + m1, m7 + m5, m11 + m9);
    planes[2].distance = -(m15 + m13);
    planes[2].normalize();
    vec3Set(planes[3].normal.array, m3 - m1, m7 - m5, m11 - m9);
    planes[3].distance = -(m15 - m13);
    planes[3].normalize();
    vec3Set(planes[4].normal.array, m3 - m2, m7 - m6, m11 - m10);
    planes[4].distance = -(m15 - m14);
    planes[4].normalize();
    vec3Set(planes[5].normal.array, m3 + m2, m7 + m6, m11 + m10);
    planes[5].distance = -(m15 + m14);
    planes[5].normalize();
    var boundingBox = this.boundingBox;
    var vertices = this.vertices;
    if (m15 === 0) {
      var aspect = m5 / m0;
      var zNear = -m14 / (m10 - 1);
      var zFar = -m14 / (m10 + 1);
      var farY = -zFar / m5;
      var nearY = -zNear / m5;
      boundingBox.min.set(-farY * aspect, -farY, zFar);
      boundingBox.max.set(farY * aspect, farY, zNear);
      vec3Set(vertices[0], -farY * aspect, -farY, zFar);
      vec3Set(vertices[1], -farY * aspect, farY, zFar);
      vec3Set(vertices[2], farY * aspect, -farY, zFar);
      vec3Set(vertices[3], farY * aspect, farY, zFar);
      vec3Set(vertices[4], -nearY * aspect, -nearY, zNear);
      vec3Set(vertices[5], -nearY * aspect, nearY, zNear);
      vec3Set(vertices[6], nearY * aspect, -nearY, zNear);
      vec3Set(vertices[7], nearY * aspect, nearY, zNear);
    } else {
      var left = (-1 - m12) / m0;
      var right = (1 - m12) / m0;
      var top = (1 - m13) / m5;
      var bottom = (-1 - m13) / m5;
      var near = (-1 - m14) / m10;
      var far = (1 - m14) / m10;
      boundingBox.min.set(Math.min(left, right), Math.min(bottom, top), Math.min(far, near));
      boundingBox.max.set(Math.max(right, left), Math.max(top, bottom), Math.max(near, far));
      var min = boundingBox.min.array;
      var max = boundingBox.max.array;
      vec3Set(vertices[0], min[0], min[1], min[2]);
      vec3Set(vertices[1], min[0], max[1], min[2]);
      vec3Set(vertices[2], max[0], min[1], min[2]);
      vec3Set(vertices[3], max[0], max[1], min[2]);
      vec3Set(vertices[4], min[0], min[1], max[2]);
      vec3Set(vertices[5], min[0], max[1], max[2]);
      vec3Set(vertices[6], max[0], min[1], max[2]);
      vec3Set(vertices[7], max[0], max[1], max[2]);
    }
  },
  getTransformedBoundingBox: function() {
    var tmpVec3 = vec3$8.create();
    return function(bbox, matrix) {
      var vertices = this.vertices;
      var m4 = matrix.array;
      var min = bbox.min;
      var max = bbox.max;
      var minArr = min.array;
      var maxArr = max.array;
      var v = vertices[0];
      vec3TranformMat4(tmpVec3, v, m4);
      vec3Copy(minArr, tmpVec3);
      vec3Copy(maxArr, tmpVec3);
      for (var i = 1; i < 8; i++) {
        v = vertices[i];
        vec3TranformMat4(tmpVec3, v, m4);
        minArr[0] = mathMin(tmpVec3[0], minArr[0]);
        minArr[1] = mathMin(tmpVec3[1], minArr[1]);
        minArr[2] = mathMin(tmpVec3[2], minArr[2]);
        maxArr[0] = mathMax(tmpVec3[0], maxArr[0]);
        maxArr[1] = mathMax(tmpVec3[1], maxArr[1]);
        maxArr[2] = mathMax(tmpVec3[2], maxArr[2]);
      }
      min._dirty = true;
      max._dirty = true;
      return bbox;
    };
  }()
};
var Frustum$1 = Frustum;
var Camera = Node3D.extend(function() {
  return {
    projectionMatrix: new Matrix4$1(),
    invProjectionMatrix: new Matrix4$1(),
    viewMatrix: new Matrix4$1(),
    frustum: new Frustum$1()
  };
}, function() {
  this.update(true);
}, {
  update: function(force) {
    Node3D.prototype.update.call(this, force);
    Matrix4$1.invert(this.viewMatrix, this.worldTransform);
    this.updateProjectionMatrix();
    Matrix4$1.invert(this.invProjectionMatrix, this.projectionMatrix);
    this.frustum.setFromProjection(this.projectionMatrix);
  },
  setViewMatrix: function(viewMatrix) {
    Matrix4$1.copy(this.viewMatrix, viewMatrix);
    Matrix4$1.invert(this.worldTransform, viewMatrix);
    this.decomposeWorldTransform();
  },
  decomposeProjectionMatrix: function() {
  },
  setProjectionMatrix: function(projectionMatrix) {
    Matrix4$1.copy(this.projectionMatrix, projectionMatrix);
    Matrix4$1.invert(this.invProjectionMatrix, projectionMatrix);
    this.decomposeProjectionMatrix();
  },
  updateProjectionMatrix: function() {
  },
  castRay: function() {
    var v4 = vec4$1.create();
    return function(ndc2, out) {
      var ray = out !== void 0 ? out : new Ray$1();
      var x = ndc2.array[0];
      var y = ndc2.array[1];
      vec4$1.set(v4, x, y, -1, 1);
      vec4$1.transformMat4(v4, v4, this.invProjectionMatrix.array);
      vec4$1.transformMat4(v4, v4, this.worldTransform.array);
      vec3$8.scale(ray.origin.array, v4, 1 / v4[3]);
      vec4$1.set(v4, x, y, 1, 1);
      vec4$1.transformMat4(v4, v4, this.invProjectionMatrix.array);
      vec4$1.transformMat4(v4, v4, this.worldTransform.array);
      vec3$8.scale(v4, v4, 1 / v4[3]);
      vec3$8.sub(ray.direction.array, v4, ray.origin.array);
      vec3$8.normalize(ray.direction.array, ray.direction.array);
      ray.direction._dirty = true;
      ray.origin._dirty = true;
      return ray;
    };
  }()
});
var Camera$1 = Camera;
var IDENTITY = mat4$2.create();
var WORLDVIEW = mat4$2.create();
var programKeyCache = {};
function getProgramKey(lightNumbers) {
  var defineStr = [];
  var lightTypes = Object.keys(lightNumbers);
  lightTypes.sort();
  for (var i = 0; i < lightTypes.length; i++) {
    var lightType = lightTypes[i];
    defineStr.push(lightType + " " + lightNumbers[lightType]);
  }
  var key = defineStr.join("\n");
  if (programKeyCache[key]) {
    return programKeyCache[key];
  }
  var id = util$1.genGUID();
  programKeyCache[key] = id;
  return id;
}
function RenderList() {
  this.opaque = [];
  this.transparent = [];
  this._opaqueCount = 0;
  this._transparentCount = 0;
}
RenderList.prototype.startCount = function() {
  this._opaqueCount = 0;
  this._transparentCount = 0;
};
RenderList.prototype.add = function(object, isTransparent) {
  if (isTransparent) {
    this.transparent[this._transparentCount++] = object;
  } else {
    this.opaque[this._opaqueCount++] = object;
  }
};
RenderList.prototype.endCount = function() {
  this.transparent.length = this._transparentCount;
  this.opaque.length = this._opaqueCount;
};
var Scene = Node3D.extend(function() {
  return {
    material: null,
    lights: [],
    viewBoundingBoxLastFrame: new BoundingBox$1(),
    shadowUniforms: {},
    _cameraList: [],
    _lightUniforms: {},
    _previousLightNumber: {},
    _lightNumber: {},
    _lightProgramKeys: {},
    _nodeRepository: {},
    _renderLists: new LRUCache(20)
  };
}, function() {
  this._scene = this;
}, {
  addToScene: function(node) {
    if (node instanceof Camera$1) {
      if (this._cameraList.length > 0) {
        console.warn("Found multiple camera in one scene. Use the fist one.");
      }
      this._cameraList.push(node);
    } else if (node instanceof Light$1) {
      this.lights.push(node);
    }
    if (node.name) {
      this._nodeRepository[node.name] = node;
    }
  },
  removeFromScene: function(node) {
    var idx;
    if (node instanceof Camera$1) {
      idx = this._cameraList.indexOf(node);
      if (idx >= 0) {
        this._cameraList.splice(idx, 1);
      }
    } else if (node instanceof Light$1) {
      idx = this.lights.indexOf(node);
      if (idx >= 0) {
        this.lights.splice(idx, 1);
      }
    }
    if (node.name) {
      delete this._nodeRepository[node.name];
    }
  },
  getNode: function(name) {
    return this._nodeRepository[name];
  },
  setMainCamera: function(camera2) {
    var idx = this._cameraList.indexOf(camera2);
    if (idx >= 0) {
      this._cameraList.splice(idx, 1);
    }
    this._cameraList.unshift(camera2);
  },
  getMainCamera: function() {
    return this._cameraList[0];
  },
  getLights: function() {
    return this.lights;
  },
  updateLights: function() {
    var lights = this.lights;
    this._previousLightNumber = this._lightNumber;
    var lightNumber = {};
    for (var i = 0; i < lights.length; i++) {
      var light = lights[i];
      if (light.invisible) {
        continue;
      }
      var group = light.group;
      if (!lightNumber[group]) {
        lightNumber[group] = {};
      }
      lightNumber[group][light.type] = lightNumber[group][light.type] || 0;
      lightNumber[group][light.type]++;
    }
    this._lightNumber = lightNumber;
    for (var groupId in lightNumber) {
      this._lightProgramKeys[groupId] = getProgramKey(lightNumber[groupId]);
    }
    this._updateLightUniforms();
  },
  cloneNode: function(node) {
    var newNode = node.clone();
    var clonedNodesMap = {};
    function buildNodesMap(sNode, tNode) {
      clonedNodesMap[sNode.__uid__] = tNode;
      for (var i = 0; i < sNode._children.length; i++) {
        var sChild = sNode._children[i];
        var tChild = tNode._children[i];
        buildNodesMap(sChild, tChild);
      }
    }
    buildNodesMap(node, newNode);
    newNode.traverse(function(newChild) {
      if (newChild.skeleton) {
        newChild.skeleton = newChild.skeleton.clone(clonedNodesMap);
      }
      if (newChild.material) {
        newChild.material = newChild.material.clone();
      }
    });
    return newNode;
  },
  updateRenderList: function(camera2, updateSceneBoundingBox) {
    var id = camera2.__uid__;
    var renderList = this._renderLists.get(id);
    if (!renderList) {
      renderList = new RenderList();
      this._renderLists.put(id, renderList);
    }
    renderList.startCount();
    if (updateSceneBoundingBox) {
      this.viewBoundingBoxLastFrame.min.set(Infinity, Infinity, Infinity);
      this.viewBoundingBoxLastFrame.max.set(-Infinity, -Infinity, -Infinity);
    }
    var sceneMaterialTransparent = this.material && this.material.transparent || false;
    this._doUpdateRenderList(this, camera2, sceneMaterialTransparent, renderList, updateSceneBoundingBox);
    renderList.endCount();
    return renderList;
  },
  getRenderList: function(camera2) {
    return this._renderLists.get(camera2.__uid__);
  },
  _doUpdateRenderList: function(parent, camera2, sceneMaterialTransparent, renderList, updateSceneBoundingBox) {
    if (parent.invisible) {
      return;
    }
    for (var i = 0; i < parent._children.length; i++) {
      var child = parent._children[i];
      if (child.isRenderable()) {
        var worldM = child.isSkinnedMesh() ? IDENTITY : child.worldTransform.array;
        var geometry = child.geometry;
        mat4$2.multiplyAffine(WORLDVIEW, camera2.viewMatrix.array, worldM);
        if (updateSceneBoundingBox && !geometry.boundingBox || !this.isFrustumCulled(child, camera2, WORLDVIEW)) {
          renderList.add(child, child.material.transparent || sceneMaterialTransparent);
        }
      }
      if (child._children.length > 0) {
        this._doUpdateRenderList(child, camera2, sceneMaterialTransparent, renderList, updateSceneBoundingBox);
      }
    }
  },
  isFrustumCulled: function() {
    var cullingBoundingBox = new BoundingBox$1();
    var cullingMatrix = new Matrix4$1();
    return function(object, camera2, worldViewMat) {
      var geoBBox = object.boundingBox;
      if (!geoBBox) {
        if (object.skeleton && object.skeleton.boundingBox) {
          geoBBox = object.skeleton.boundingBox;
        } else {
          geoBBox = object.geometry.boundingBox;
        }
      }
      if (!geoBBox) {
        return false;
      }
      cullingMatrix.array = worldViewMat;
      cullingBoundingBox.transformFrom(geoBBox, cullingMatrix);
      if (object.castShadow) {
        this.viewBoundingBoxLastFrame.union(cullingBoundingBox);
      }
      if (object.frustumCulling) {
        if (!cullingBoundingBox.intersectBoundingBox(camera2.frustum.boundingBox)) {
          return true;
        }
        cullingMatrix.array = camera2.projectionMatrix.array;
        if (cullingBoundingBox.max.array[2] > 0 && cullingBoundingBox.min.array[2] < 0) {
          cullingBoundingBox.max.array[2] = -1e-20;
        }
        cullingBoundingBox.applyProjection(cullingMatrix);
        var min = cullingBoundingBox.min.array;
        var max = cullingBoundingBox.max.array;
        if (max[0] < -1 || min[0] > 1 || max[1] < -1 || min[1] > 1 || max[2] < -1 || min[2] > 1) {
          return true;
        }
      }
      return false;
    };
  }(),
  _updateLightUniforms: function() {
    var lights = this.lights;
    lights.sort(lightSortFunc);
    var lightUniforms = this._lightUniforms;
    for (var group in lightUniforms) {
      for (var symbol in lightUniforms[group]) {
        lightUniforms[group][symbol].value.length = 0;
      }
    }
    for (var i = 0; i < lights.length; i++) {
      var light = lights[i];
      if (light.invisible) {
        continue;
      }
      var group = light.group;
      for (var symbol in light.uniformTemplates) {
        var uniformTpl = light.uniformTemplates[symbol];
        var value = uniformTpl.value(light);
        if (value == null) {
          continue;
        }
        if (!lightUniforms[group]) {
          lightUniforms[group] = {};
        }
        if (!lightUniforms[group][symbol]) {
          lightUniforms[group][symbol] = {
            type: "",
            value: []
          };
        }
        var lu = lightUniforms[group][symbol];
        lu.type = uniformTpl.type + "v";
        switch (uniformTpl.type) {
          case "1i":
          case "1f":
          case "t":
            lu.value.push(value);
            break;
          case "2f":
          case "3f":
          case "4f":
            for (var j = 0; j < value.length; j++) {
              lu.value.push(value[j]);
            }
            break;
          default:
            console.error("Unkown light uniform type " + uniformTpl.type);
        }
      }
    }
  },
  getLightGroups: function() {
    var lightGroups = [];
    for (var groupId in this._lightNumber) {
      lightGroups.push(groupId);
    }
    return lightGroups;
  },
  getNumberChangedLightGroups: function() {
    var lightGroups = [];
    for (var groupId in this._lightNumber) {
      if (this.isLightNumberChanged(groupId)) {
        lightGroups.push(groupId);
      }
    }
    return lightGroups;
  },
  isLightNumberChanged: function(lightGroup) {
    var prevLightNumber = this._previousLightNumber;
    var currentLightNumber = this._lightNumber;
    for (var type in currentLightNumber[lightGroup]) {
      if (!prevLightNumber[lightGroup]) {
        return true;
      }
      if (currentLightNumber[lightGroup][type] !== prevLightNumber[lightGroup][type]) {
        return true;
      }
    }
    for (var type in prevLightNumber[lightGroup]) {
      if (!currentLightNumber[lightGroup]) {
        return true;
      }
      if (currentLightNumber[lightGroup][type] !== prevLightNumber[lightGroup][type]) {
        return true;
      }
    }
    return false;
  },
  getLightsNumbers: function(lightGroup) {
    return this._lightNumber[lightGroup];
  },
  getProgramKey: function(lightGroup) {
    return this._lightProgramKeys[lightGroup];
  },
  setLightUniforms: function() {
    function setUniforms(uniforms, program, renderer) {
      for (var symbol in uniforms) {
        var lu = uniforms[symbol];
        if (lu.type === "tv") {
          if (!program.hasUniform(symbol)) {
            continue;
          }
          var texSlots = [];
          for (var i = 0; i < lu.value.length; i++) {
            var texture = lu.value[i];
            var slot = program.takeCurrentTextureSlot(renderer, texture);
            texSlots.push(slot);
          }
          program.setUniform(renderer.gl, "1iv", symbol, texSlots);
        } else {
          program.setUniform(renderer.gl, lu.type, symbol, lu.value);
        }
      }
    }
    return function(program, lightGroup, renderer) {
      setUniforms(this._lightUniforms[lightGroup], program, renderer);
      setUniforms(this.shadowUniforms, program, renderer);
    };
  }(),
  dispose: function() {
    this.material = null;
    this._opaqueList = [];
    this._transparentList = [];
    this.lights = [];
    this._lightUniforms = {};
    this._lightNumber = {};
    this._nodeRepository = {};
  }
});
function lightSortFunc(a, b) {
  if (b.castShadow && !a.castShadow) {
    return true;
  }
}
var Scene$1 = Scene;
var isPowerOfTwo$1 = mathUtil$1.isPowerOfTwo;
var targetList = ["px", "nx", "py", "ny", "pz", "nz"];
var TextureCube = Texture$1.extend(function() {
  return {
    image: {
      px: null,
      nx: null,
      py: null,
      ny: null,
      pz: null,
      nz: null
    },
    pixels: {
      px: null,
      nx: null,
      py: null,
      ny: null,
      pz: null,
      nz: null
    },
    mipmaps: []
  };
}, {
  textureType: "textureCube",
  update: function(renderer) {
    var _gl = renderer.gl;
    _gl.bindTexture(_gl.TEXTURE_CUBE_MAP, this._cache.get("webgl_texture"));
    this.updateCommon(renderer);
    var glFormat = this.format;
    var glType = this.type;
    _gl.texParameteri(_gl.TEXTURE_CUBE_MAP, _gl.TEXTURE_WRAP_S, this.getAvailableWrapS());
    _gl.texParameteri(_gl.TEXTURE_CUBE_MAP, _gl.TEXTURE_WRAP_T, this.getAvailableWrapT());
    _gl.texParameteri(_gl.TEXTURE_CUBE_MAP, _gl.TEXTURE_MAG_FILTER, this.getAvailableMagFilter());
    _gl.texParameteri(_gl.TEXTURE_CUBE_MAP, _gl.TEXTURE_MIN_FILTER, this.getAvailableMinFilter());
    var anisotropicExt = renderer.getGLExtension("EXT_texture_filter_anisotropic");
    if (anisotropicExt && this.anisotropic > 1) {
      _gl.texParameterf(_gl.TEXTURE_CUBE_MAP, anisotropicExt.TEXTURE_MAX_ANISOTROPY_EXT, this.anisotropic);
    }
    if (glType === 36193) {
      var halfFloatExt = renderer.getGLExtension("OES_texture_half_float");
      if (!halfFloatExt) {
        glType = glenum.FLOAT;
      }
    }
    if (this.mipmaps.length) {
      var width = this.width;
      var height = this.height;
      for (var i = 0; i < this.mipmaps.length; i++) {
        var mipmap = this.mipmaps[i];
        this._updateTextureData(_gl, mipmap, i, width, height, glFormat, glType);
        width /= 2;
        height /= 2;
      }
    } else {
      this._updateTextureData(_gl, this, 0, this.width, this.height, glFormat, glType);
      if (!this.NPOT && this.useMipmap) {
        _gl.generateMipmap(_gl.TEXTURE_CUBE_MAP);
      }
    }
    _gl.bindTexture(_gl.TEXTURE_CUBE_MAP, null);
  },
  _updateTextureData: function(_gl, data, level, width, height, glFormat, glType) {
    for (var i = 0; i < 6; i++) {
      var target = targetList[i];
      var img = data.image && data.image[target];
      if (img) {
        _gl.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, level, glFormat, glFormat, glType, img);
      } else {
        _gl.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, level, glFormat, width, height, 0, glFormat, glType, data.pixels && data.pixels[target]);
      }
    }
  },
  generateMipmap: function(renderer) {
    var _gl = renderer.gl;
    if (this.useMipmap && !this.NPOT) {
      _gl.bindTexture(_gl.TEXTURE_CUBE_MAP, this._cache.get("webgl_texture"));
      _gl.generateMipmap(_gl.TEXTURE_CUBE_MAP);
    }
  },
  bind: function(renderer) {
    renderer.gl.bindTexture(renderer.gl.TEXTURE_CUBE_MAP, this.getWebGLTexture(renderer));
  },
  unbind: function(renderer) {
    renderer.gl.bindTexture(renderer.gl.TEXTURE_CUBE_MAP, null);
  },
  isPowerOfTwo: function() {
    if (this.image.px) {
      return isPowerOfTwo$1(this.image.px.width) && isPowerOfTwo$1(this.image.px.height);
    } else {
      return isPowerOfTwo$1(this.width) && isPowerOfTwo$1(this.height);
    }
  },
  isRenderable: function() {
    if (this.image.px) {
      return isImageRenderable(this.image.px) && isImageRenderable(this.image.nx) && isImageRenderable(this.image.py) && isImageRenderable(this.image.ny) && isImageRenderable(this.image.pz) && isImageRenderable(this.image.nz);
    } else {
      return !!(this.width && this.height);
    }
  },
  load: function(imageList, crossOrigin) {
    var loading = 0;
    var self = this;
    util$1.each(imageList, function(src, target) {
      var image = vendor$1.createImage();
      if (crossOrigin) {
        image.crossOrigin = crossOrigin;
      }
      image.onload = function() {
        loading--;
        if (loading === 0) {
          self.dirty();
          self.trigger("success", self);
        }
      };
      image.onerror = function() {
        loading--;
      };
      loading++;
      image.src = src;
      self.image[target] = image;
    });
    return this;
  }
});
Object.defineProperty(TextureCube.prototype, "width", {
  get: function() {
    if (this.image && this.image.px) {
      return this.image.px.width;
    }
    return this._width;
  },
  set: function(value) {
    if (this.image && this.image.px) {
      console.warn("Texture from image can't set width");
    } else {
      if (this._width !== value) {
        this.dirty();
      }
      this._width = value;
    }
  }
});
Object.defineProperty(TextureCube.prototype, "height", {
  get: function() {
    if (this.image && this.image.px) {
      return this.image.px.height;
    }
    return this._height;
  },
  set: function(value) {
    if (this.image && this.image.px) {
      console.warn("Texture from image can't set height");
    } else {
      if (this._height !== value) {
        this.dirty();
      }
      this._height = value;
    }
  }
});
function isImageRenderable(image) {
  return image.width > 0 && image.height > 0;
}
var TextureCube$1 = TextureCube;
var Perspective = Camera$1.extend({
  fov: 50,
  aspect: 1,
  near: 0.1,
  far: 2e3
}, {
  updateProjectionMatrix: function() {
    var rad2 = this.fov / 180 * Math.PI;
    this.projectionMatrix.perspective(rad2, this.aspect, this.near, this.far);
  },
  decomposeProjectionMatrix: function() {
    var m = this.projectionMatrix.array;
    var rad2 = Math.atan(1 / m[5]) * 2;
    this.fov = rad2 / Math.PI * 180;
    this.aspect = m[5] / m[0];
    this.near = m[14] / (m[10] - 1);
    this.far = m[14] / (m[10] + 1);
  },
  clone: function() {
    var camera2 = Camera$1.prototype.clone.call(this);
    camera2.fov = this.fov;
    camera2.aspect = this.aspect;
    camera2.near = this.near;
    camera2.far = this.far;
    return camera2;
  }
});
var PerspectiveCamera = Perspective;
var KEY_FRAMEBUFFER = "framebuffer";
var KEY_RENDERBUFFER = "renderbuffer";
var KEY_RENDERBUFFER_WIDTH = KEY_RENDERBUFFER + "_width";
var KEY_RENDERBUFFER_HEIGHT = KEY_RENDERBUFFER + "_height";
var KEY_RENDERBUFFER_ATTACHED = KEY_RENDERBUFFER + "_attached";
var KEY_DEPTHTEXTURE_ATTACHED = "depthtexture_attached";
var GL_FRAMEBUFFER = glenum.FRAMEBUFFER;
var GL_RENDERBUFFER = glenum.RENDERBUFFER;
var GL_DEPTH_ATTACHMENT = glenum.DEPTH_ATTACHMENT;
var GL_COLOR_ATTACHMENT0 = glenum.COLOR_ATTACHMENT0;
var FrameBuffer = Base$1.extend({
  depthBuffer: true,
  viewport: null,
  _width: 0,
  _height: 0,
  _textures: null,
  _boundRenderer: null
}, function() {
  this._cache = new Cache$1();
  this._textures = {};
}, {
  getTextureWidth: function() {
    return this._width;
  },
  getTextureHeight: function() {
    return this._height;
  },
  bind: function(renderer) {
    if (renderer.__currentFrameBuffer) {
      if (renderer.__currentFrameBuffer === this) {
        return;
      }
      console.warn("Renderer already bound with another framebuffer. Unbind it first");
    }
    renderer.__currentFrameBuffer = this;
    var _gl = renderer.gl;
    _gl.bindFramebuffer(GL_FRAMEBUFFER, this._getFrameBufferGL(renderer));
    this._boundRenderer = renderer;
    var cache = this._cache;
    cache.put("viewport", renderer.viewport);
    var hasTextureAttached = false;
    var width;
    var height;
    for (var attachment in this._textures) {
      hasTextureAttached = true;
      var obj = this._textures[attachment];
      if (obj) {
        width = obj.texture.width;
        height = obj.texture.height;
        this._doAttach(renderer, obj.texture, attachment, obj.target);
      }
    }
    this._width = width;
    this._height = height;
    if (!hasTextureAttached && this.depthBuffer) {
      console.error("Must attach texture before bind, or renderbuffer may have incorrect width and height.");
    }
    if (this.viewport) {
      renderer.setViewport(this.viewport);
    } else {
      renderer.setViewport(0, 0, width, height, 1);
    }
    var attachedTextures = cache.get("attached_textures");
    if (attachedTextures) {
      for (var attachment in attachedTextures) {
        if (!this._textures[attachment]) {
          var target = attachedTextures[attachment];
          this._doDetach(_gl, attachment, target);
        }
      }
    }
    if (!cache.get(KEY_DEPTHTEXTURE_ATTACHED) && this.depthBuffer) {
      if (cache.miss(KEY_RENDERBUFFER)) {
        cache.put(KEY_RENDERBUFFER, _gl.createRenderbuffer());
      }
      var renderbuffer = cache.get(KEY_RENDERBUFFER);
      if (width !== cache.get(KEY_RENDERBUFFER_WIDTH) || height !== cache.get(KEY_RENDERBUFFER_HEIGHT)) {
        _gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer);
        _gl.renderbufferStorage(GL_RENDERBUFFER, _gl.DEPTH_COMPONENT16, width, height);
        cache.put(KEY_RENDERBUFFER_WIDTH, width);
        cache.put(KEY_RENDERBUFFER_HEIGHT, height);
        _gl.bindRenderbuffer(GL_RENDERBUFFER, null);
      }
      if (!cache.get(KEY_RENDERBUFFER_ATTACHED)) {
        _gl.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, renderbuffer);
        cache.put(KEY_RENDERBUFFER_ATTACHED, true);
      }
    }
  },
  unbind: function(renderer) {
    renderer.__currentFrameBuffer = null;
    var _gl = renderer.gl;
    _gl.bindFramebuffer(GL_FRAMEBUFFER, null);
    this._boundRenderer = null;
    this._cache.use(renderer.__uid__);
    var viewport = this._cache.get("viewport");
    if (viewport) {
      renderer.setViewport(viewport);
    }
    this.updateMipmap(renderer);
  },
  updateMipmap: function(renderer) {
    var _gl = renderer.gl;
    for (var attachment in this._textures) {
      var obj = this._textures[attachment];
      if (obj) {
        var texture = obj.texture;
        if (!texture.NPOT && texture.useMipmap && texture.minFilter === Texture$1.LINEAR_MIPMAP_LINEAR) {
          var target = texture.textureType === "textureCube" ? glenum.TEXTURE_CUBE_MAP : glenum.TEXTURE_2D;
          _gl.bindTexture(target, texture.getWebGLTexture(renderer));
          _gl.generateMipmap(target);
          _gl.bindTexture(target, null);
        }
      }
    }
  },
  checkStatus: function(_gl) {
    return _gl.checkFramebufferStatus(GL_FRAMEBUFFER);
  },
  _getFrameBufferGL: function(renderer) {
    var cache = this._cache;
    cache.use(renderer.__uid__);
    if (cache.miss(KEY_FRAMEBUFFER)) {
      cache.put(KEY_FRAMEBUFFER, renderer.gl.createFramebuffer());
    }
    return cache.get(KEY_FRAMEBUFFER);
  },
  attach: function(texture, attachment, target) {
    if (!texture.width) {
      throw new Error("The texture attached to color buffer is not a valid.");
    }
    attachment = attachment || GL_COLOR_ATTACHMENT0;
    target = target || glenum.TEXTURE_2D;
    var boundRenderer = this._boundRenderer;
    var _gl = boundRenderer && boundRenderer.gl;
    var attachedTextures;
    if (_gl) {
      var cache = this._cache;
      cache.use(boundRenderer.__uid__);
      attachedTextures = cache.get("attached_textures");
    }
    var previous = this._textures[attachment];
    if (previous && previous.target === target && previous.texture === texture && attachedTextures && attachedTextures[attachment] != null) {
      return;
    }
    var canAttach = true;
    if (boundRenderer) {
      canAttach = this._doAttach(boundRenderer, texture, attachment, target);
      if (!this.viewport) {
        boundRenderer.setViewport(0, 0, texture.width, texture.height, 1);
      }
    }
    if (canAttach) {
      this._textures[attachment] = this._textures[attachment] || {};
      this._textures[attachment].texture = texture;
      this._textures[attachment].target = target;
    }
  },
  _doAttach: function(renderer, texture, attachment, target) {
    var _gl = renderer.gl;
    var webglTexture = texture.getWebGLTexture(renderer);
    var attachedTextures = this._cache.get("attached_textures");
    if (attachedTextures && attachedTextures[attachment]) {
      var obj = attachedTextures[attachment];
      if (obj.texture === texture && obj.target === target) {
        return;
      }
    }
    attachment = +attachment;
    var canAttach = true;
    if (attachment === GL_DEPTH_ATTACHMENT || attachment === glenum.DEPTH_STENCIL_ATTACHMENT) {
      var extension = renderer.getGLExtension("WEBGL_depth_texture");
      if (!extension) {
        console.error("Depth texture is not supported by the browser");
        canAttach = false;
      }
      if (texture.format !== glenum.DEPTH_COMPONENT && texture.format !== glenum.DEPTH_STENCIL) {
        console.error("The texture attached to depth buffer is not a valid.");
        canAttach = false;
      }
      if (canAttach) {
        var renderbuffer = this._cache.get(KEY_RENDERBUFFER);
        if (renderbuffer) {
          _gl.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, null);
          _gl.deleteRenderbuffer(renderbuffer);
          this._cache.put(KEY_RENDERBUFFER, false);
        }
        this._cache.put(KEY_RENDERBUFFER_ATTACHED, false);
        this._cache.put(KEY_DEPTHTEXTURE_ATTACHED, true);
      }
    }
    _gl.framebufferTexture2D(GL_FRAMEBUFFER, attachment, target, webglTexture, 0);
    if (!attachedTextures) {
      attachedTextures = {};
      this._cache.put("attached_textures", attachedTextures);
    }
    attachedTextures[attachment] = attachedTextures[attachment] || {};
    attachedTextures[attachment].texture = texture;
    attachedTextures[attachment].target = target;
    return canAttach;
  },
  _doDetach: function(_gl, attachment, target) {
    _gl.framebufferTexture2D(GL_FRAMEBUFFER, attachment, target, null, 0);
    var attachedTextures = this._cache.get("attached_textures");
    if (attachedTextures && attachedTextures[attachment]) {
      attachedTextures[attachment] = null;
    }
    if (attachment === GL_DEPTH_ATTACHMENT || attachment === glenum.DEPTH_STENCIL_ATTACHMENT) {
      this._cache.put(KEY_DEPTHTEXTURE_ATTACHED, false);
    }
  },
  detach: function(attachment, target) {
    this._textures[attachment] = null;
    if (this._boundRenderer) {
      var cache = this._cache;
      cache.use(this._boundRenderer.__uid__);
      this._doDetach(this._boundRenderer.gl, attachment, target);
    }
  },
  dispose: function(renderer) {
    var _gl = renderer.gl;
    var cache = this._cache;
    cache.use(renderer.__uid__);
    var renderBuffer = cache.get(KEY_RENDERBUFFER);
    if (renderBuffer) {
      _gl.deleteRenderbuffer(renderBuffer);
    }
    var frameBuffer = cache.get(KEY_FRAMEBUFFER);
    if (frameBuffer) {
      _gl.deleteFramebuffer(frameBuffer);
    }
    cache.deleteContext(renderer.__uid__);
    this._textures = {};
  }
});
FrameBuffer.DEPTH_ATTACHMENT = GL_DEPTH_ATTACHMENT;
FrameBuffer.COLOR_ATTACHMENT0 = GL_COLOR_ATTACHMENT0;
FrameBuffer.STENCIL_ATTACHMENT = glenum.STENCIL_ATTACHMENT;
FrameBuffer.DEPTH_STENCIL_ATTACHMENT = glenum.DEPTH_STENCIL_ATTACHMENT;
var FrameBuffer$1 = FrameBuffer;
var targets$3 = ["px", "nx", "py", "ny", "pz", "nz"];
var EnvironmentMapPass = Base$1.extend(function() {
  var ret2 = {
    position: new Vector3$1(),
    far: 1e3,
    near: 0.1,
    texture: null,
    shadowMapPass: null
  };
  var cameras = ret2._cameras = {
    px: new PerspectiveCamera({
      fov: 90
    }),
    nx: new PerspectiveCamera({
      fov: 90
    }),
    py: new PerspectiveCamera({
      fov: 90
    }),
    ny: new PerspectiveCamera({
      fov: 90
    }),
    pz: new PerspectiveCamera({
      fov: 90
    }),
    nz: new PerspectiveCamera({
      fov: 90
    })
  };
  cameras.px.lookAt(Vector3$1.POSITIVE_X, Vector3$1.NEGATIVE_Y);
  cameras.nx.lookAt(Vector3$1.NEGATIVE_X, Vector3$1.NEGATIVE_Y);
  cameras.py.lookAt(Vector3$1.POSITIVE_Y, Vector3$1.POSITIVE_Z);
  cameras.ny.lookAt(Vector3$1.NEGATIVE_Y, Vector3$1.NEGATIVE_Z);
  cameras.pz.lookAt(Vector3$1.POSITIVE_Z, Vector3$1.NEGATIVE_Y);
  cameras.nz.lookAt(Vector3$1.NEGATIVE_Z, Vector3$1.NEGATIVE_Y);
  ret2._frameBuffer = new FrameBuffer$1();
  return ret2;
}, {
  getCamera: function(target) {
    return this._cameras[target];
  },
  render: function(renderer, scene, notUpdateScene) {
    var _gl = renderer.gl;
    if (!notUpdateScene) {
      scene.update();
    }
    var n = this.texture.width;
    var fov = 2 * Math.atan(n / (n - 0.5)) / Math.PI * 180;
    for (var i = 0; i < 6; i++) {
      var target = targets$3[i];
      var camera2 = this._cameras[target];
      Vector3$1.copy(camera2.position, this.position);
      camera2.far = this.far;
      camera2.near = this.near;
      camera2.fov = fov;
      if (this.shadowMapPass) {
        camera2.update();
        var bbox = scene.getBoundingBox();
        bbox.applyTransform(camera2.viewMatrix);
        scene.viewBoundingBoxLastFrame.copy(bbox);
        this.shadowMapPass.render(renderer, scene, camera2, true);
      }
      this._frameBuffer.attach(this.texture, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i);
      this._frameBuffer.bind(renderer);
      renderer.render(scene, camera2, true);
      this._frameBuffer.unbind(renderer);
    }
  },
  dispose: function(renderer) {
    this._frameBuffer.dispose(renderer);
  }
});
var EnvironmentMapPass$1 = EnvironmentMapPass;
var Plane = Geometry$1.extend({
  dynamic: false,
  widthSegments: 1,
  heightSegments: 1
}, function() {
  this.build();
}, {
  build: function() {
    var heightSegments = this.heightSegments;
    var widthSegments = this.widthSegments;
    var attributes = this.attributes;
    var positions = [];
    var texcoords = [];
    var normals = [];
    var faces = [];
    for (var y = 0; y <= heightSegments; y++) {
      var t = y / heightSegments;
      for (var x = 0; x <= widthSegments; x++) {
        var s = x / widthSegments;
        positions.push([2 * s - 1, 2 * t - 1, 0]);
        if (texcoords) {
          texcoords.push([s, t]);
        }
        if (normals) {
          normals.push([0, 0, 1]);
        }
        if (x < widthSegments && y < heightSegments) {
          var i = x + y * (widthSegments + 1);
          faces.push([i, i + 1, i + widthSegments + 1]);
          faces.push([i + widthSegments + 1, i + 1, i + widthSegments + 2]);
        }
      }
    }
    attributes.position.fromArray(positions);
    attributes.texcoord0.fromArray(texcoords);
    attributes.normal.fromArray(normals);
    this.initIndicesFromArray(faces);
    this.boundingBox = new BoundingBox$1();
    this.boundingBox.min.set(-1, -1, 0);
    this.boundingBox.max.set(1, 1, 0);
  }
});
var PlaneGeometry = Plane;
var planeMatrix = new Matrix4$1();
var Cube = Geometry$1.extend({
  dynamic: false,
  widthSegments: 1,
  heightSegments: 1,
  depthSegments: 1,
  inside: false
}, function() {
  this.build();
}, {
  build: function() {
    var planes = {
      "px": createPlane("px", this.depthSegments, this.heightSegments),
      "nx": createPlane("nx", this.depthSegments, this.heightSegments),
      "py": createPlane("py", this.widthSegments, this.depthSegments),
      "ny": createPlane("ny", this.widthSegments, this.depthSegments),
      "pz": createPlane("pz", this.widthSegments, this.heightSegments),
      "nz": createPlane("nz", this.widthSegments, this.heightSegments)
    };
    var attrList = ["position", "texcoord0", "normal"];
    var vertexNumber = 0;
    var faceNumber = 0;
    for (var pos in planes) {
      vertexNumber += planes[pos].vertexCount;
      faceNumber += planes[pos].indices.length;
    }
    for (var k = 0; k < attrList.length; k++) {
      this.attributes[attrList[k]].init(vertexNumber);
    }
    this.indices = new vendor$1.Uint16Array(faceNumber);
    var faceOffset = 0;
    var vertexOffset = 0;
    for (var pos in planes) {
      var plane = planes[pos];
      for (var k = 0; k < attrList.length; k++) {
        var attrName = attrList[k];
        var attrArray = plane.attributes[attrName].value;
        var attrSize = plane.attributes[attrName].size;
        var isNormal = attrName === "normal";
        for (var i = 0; i < attrArray.length; i++) {
          var value = attrArray[i];
          if (this.inside && isNormal) {
            value = -value;
          }
          this.attributes[attrName].value[i + attrSize * vertexOffset] = value;
        }
      }
      var len = plane.indices.length;
      for (var i = 0; i < plane.indices.length; i++) {
        this.indices[i + faceOffset] = vertexOffset + plane.indices[this.inside ? len - i - 1 : i];
      }
      faceOffset += plane.indices.length;
      vertexOffset += plane.vertexCount;
    }
    this.boundingBox = new BoundingBox$1();
    this.boundingBox.max.set(1, 1, 1);
    this.boundingBox.min.set(-1, -1, -1);
  }
});
function createPlane(pos, widthSegments, heightSegments) {
  planeMatrix.identity();
  var plane = new PlaneGeometry({
    widthSegments,
    heightSegments
  });
  switch (pos) {
    case "px":
      Matrix4$1.translate(planeMatrix, planeMatrix, Vector3$1.POSITIVE_X);
      Matrix4$1.rotateY(planeMatrix, planeMatrix, Math.PI / 2);
      break;
    case "nx":
      Matrix4$1.translate(planeMatrix, planeMatrix, Vector3$1.NEGATIVE_X);
      Matrix4$1.rotateY(planeMatrix, planeMatrix, -Math.PI / 2);
      break;
    case "py":
      Matrix4$1.translate(planeMatrix, planeMatrix, Vector3$1.POSITIVE_Y);
      Matrix4$1.rotateX(planeMatrix, planeMatrix, -Math.PI / 2);
      break;
    case "ny":
      Matrix4$1.translate(planeMatrix, planeMatrix, Vector3$1.NEGATIVE_Y);
      Matrix4$1.rotateX(planeMatrix, planeMatrix, Math.PI / 2);
      break;
    case "pz":
      Matrix4$1.translate(planeMatrix, planeMatrix, Vector3$1.POSITIVE_Z);
      break;
    case "nz":
      Matrix4$1.translate(planeMatrix, planeMatrix, Vector3$1.NEGATIVE_Z);
      Matrix4$1.rotateY(planeMatrix, planeMatrix, Math.PI);
      break;
  }
  plane.applyTransform(planeMatrix);
  return plane;
}
var CubeGeometry = Cube;
var skyboxEssl = "@export clay.skybox.vertex\n#define SHADER_NAME skybox\nuniform mat4 world : WORLD;\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\nattribute vec3 position : POSITION;\nvarying vec3 v_WorldPosition;\nvoid main()\n{\n v_WorldPosition = (world * vec4(position, 1.0)).xyz;\n gl_Position = worldViewProjection * vec4(position, 1.0);\n}\n@end\n@export clay.skybox.fragment\n#define PI 3.1415926\nuniform mat4 viewInverse : VIEWINVERSE;\n#ifdef EQUIRECTANGULAR\nuniform sampler2D environmentMap;\n#else\nuniform samplerCube environmentMap;\n#endif\nuniform float lod: 0.0;\nvarying vec3 v_WorldPosition;\n@import clay.util.rgbm\n@import clay.util.srgb\n@import clay.util.ACES\nvoid main()\n{\n vec3 eyePos = viewInverse[3].xyz;\n vec3 V = normalize(v_WorldPosition - eyePos);\n#ifdef EQUIRECTANGULAR\n float phi = acos(V.y);\n float theta = atan(-V.x, V.z) + PI * 0.5;\n vec2 uv = vec2(theta / 2.0 / PI, phi / PI);\n vec4 texel = decodeHDR(texture2D(environmentMap, fract(uv)));\n#else\n #if defined(LOD) || defined(SUPPORT_TEXTURE_LOD)\n vec4 texel = decodeHDR(textureCubeLodEXT(environmentMap, V, lod));\n #else\n vec4 texel = decodeHDR(textureCube(environmentMap, V));\n #endif\n#endif\n#ifdef SRGB_DECODE\n texel = sRGBToLinear(texel);\n#endif\n#ifdef TONEMAPPING\n texel.rgb = ACESToneMapping(texel.rgb);\n#endif\n#ifdef SRGB_ENCODE\n texel = linearTosRGB(texel);\n#endif\n gl_FragColor = encodeHDR(vec4(texel.rgb, 1.0));\n}\n@end";
Shader.import(skyboxEssl);
var Skybox = Mesh$1.extend(function() {
  var skyboxShader = new Shader({
    vertex: Shader.source("clay.skybox.vertex"),
    fragment: Shader.source("clay.skybox.fragment")
  });
  var material = new Material$1({
    shader: skyboxShader,
    depthMask: false
  });
  return {
    scene: null,
    geometry: new CubeGeometry(),
    material,
    environmentMap: null,
    culling: false,
    _dummyCamera: new PerspectiveCamera()
  };
}, function() {
  var scene = this.scene;
  if (scene) {
    this.attachScene(scene);
  }
  if (this.environmentMap) {
    this.setEnvironmentMap(this.environmentMap);
  }
}, {
  attachScene: function(scene) {
    if (this.scene) {
      this.detachScene();
    }
    scene.skybox = this;
    this.scene = scene;
    scene.on("beforerender", this._beforeRenderScene, this);
  },
  detachScene: function() {
    if (this.scene) {
      this.scene.off("beforerender", this._beforeRenderScene);
      this.scene.skybox = null;
    }
    this.scene = null;
  },
  dispose: function(renderer) {
    this.detachScene();
    this.geometry.dispose(renderer);
  },
  setEnvironmentMap: function(envMap) {
    if (envMap.textureType === "texture2D") {
      this.material.define("EQUIRECTANGULAR");
      envMap.minFilter = Texture$1.LINEAR;
    } else {
      this.material.undefine("EQUIRECTANGULAR");
    }
    this.material.set("environmentMap", envMap);
  },
  getEnvironmentMap: function() {
    return this.material.get("environmentMap");
  },
  _beforeRenderScene: function(renderer, scene, camera2) {
    this.renderSkybox(renderer, camera2);
  },
  renderSkybox: function(renderer, camera2) {
    var dummyCamera = this._dummyCamera;
    dummyCamera.aspect = renderer.getViewportAspect();
    dummyCamera.fov = camera2.fov || 50;
    dummyCamera.updateProjectionMatrix();
    Matrix4$1.invert(dummyCamera.invProjectionMatrix, dummyCamera.projectionMatrix);
    dummyCamera.worldTransform.copy(camera2.worldTransform);
    dummyCamera.viewMatrix.copy(camera2.viewMatrix);
    this.position.copy(camera2.getWorldPosition());
    this.update();
    renderer.gl.disable(renderer.gl.BLEND);
    if (this.material.get("lod") > 0) {
      this.material.define("fragment", "LOD");
    } else {
      this.material.undefine("fragment", "LOD");
    }
    renderer.renderPass([this], dummyCamera);
  }
});
var Skybox$1 = Skybox;
var DDS_MAGIC = 542327876;
var DDSD_MIPMAPCOUNT = 131072;
var DDSCAPS2_CUBEMAP = 512;
var DDPF_FOURCC = 4;
function fourCCToInt32(value) {
  return value.charCodeAt(0) + (value.charCodeAt(1) << 8) + (value.charCodeAt(2) << 16) + (value.charCodeAt(3) << 24);
}
var headerLengthInt = 31;
var FOURCC_DXT1 = fourCCToInt32("DXT1");
var FOURCC_DXT3 = fourCCToInt32("DXT3");
var FOURCC_DXT5 = fourCCToInt32("DXT5");
var off_magic = 0;
var off_size = 1;
var off_flags = 2;
var off_height = 3;
var off_width = 4;
var off_mipmapCount = 7;
var off_pfFlags = 20;
var off_pfFourCC = 21;
var off_caps2 = 28;
var ret$1 = {
  parse: function(arrayBuffer, out) {
    var header = new Int32Array(arrayBuffer, 0, headerLengthInt);
    if (header[off_magic] !== DDS_MAGIC) {
      return null;
    }
    if (!header(off_pfFlags) & DDPF_FOURCC) {
      return null;
    }
    var fourCC = header(off_pfFourCC);
    var width = header[off_width];
    var height = header[off_height];
    var isCubeMap = header[off_caps2] & DDSCAPS2_CUBEMAP;
    var hasMipmap = header[off_flags] & DDSD_MIPMAPCOUNT;
    var blockBytes, internalFormat;
    switch (fourCC) {
      case FOURCC_DXT1:
        blockBytes = 8;
        internalFormat = Texture$1.COMPRESSED_RGB_S3TC_DXT1_EXT;
        break;
      case FOURCC_DXT3:
        blockBytes = 16;
        internalFormat = Texture$1.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        break;
      case FOURCC_DXT5:
        blockBytes = 16;
        internalFormat = Texture$1.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        break;
      default:
        return null;
    }
    var dataOffset = header[off_size] + 4;
    var faceNumber = isCubeMap ? 6 : 1;
    var mipmapCount = 1;
    if (hasMipmap) {
      mipmapCount = Math.max(1, header[off_mipmapCount]);
    }
    var textures = [];
    for (var f = 0; f < faceNumber; f++) {
      var _width = width;
      var _height = height;
      textures[f] = new Texture2D$1({
        width: _width,
        height: _height,
        format: internalFormat
      });
      var mipmaps = [];
      for (var i = 0; i < mipmapCount; i++) {
        var dataLength = Math.max(4, _width) / 4 * Math.max(4, _height) / 4 * blockBytes;
        var byteArray = new Uint8Array(arrayBuffer, dataOffset, dataLength);
        dataOffset += dataLength;
        _width *= 0.5;
        _height *= 0.5;
        mipmaps[i] = byteArray;
      }
      textures[f].pixels = mipmaps[0];
      if (hasMipmap) {
        textures[f].mipmaps = mipmaps;
      }
    }
    if (out) {
      out.width = textures[0].width;
      out.height = textures[0].height;
      out.format = textures[0].format;
      out.pixels = textures[0].pixels;
      out.mipmaps = textures[0].mipmaps;
    } else {
      return textures[0];
    }
  }
};
var dds = ret$1;
var toChar = String.fromCharCode;
var MINELEN = 8;
var MAXELEN = 32767;
function rgbe2float(rgbe, buffer, offset, exposure) {
  if (rgbe[3] > 0) {
    var f = Math.pow(2, rgbe[3] - 128 - 8 + exposure);
    buffer[offset + 0] = rgbe[0] * f;
    buffer[offset + 1] = rgbe[1] * f;
    buffer[offset + 2] = rgbe[2] * f;
  } else {
    buffer[offset + 0] = 0;
    buffer[offset + 1] = 0;
    buffer[offset + 2] = 0;
  }
  buffer[offset + 3] = 1;
  return buffer;
}
function uint82string(array, offset, size) {
  var str = "";
  for (var i = offset; i < size; i++) {
    str += toChar(array[i]);
  }
  return str;
}
function copyrgbe(s, t) {
  t[0] = s[0];
  t[1] = s[1];
  t[2] = s[2];
  t[3] = s[3];
}
function oldReadColors(scan, buffer, offset, xmax) {
  var rshift = 0, x = 0, len = xmax;
  while (len > 0) {
    scan[x][0] = buffer[offset++];
    scan[x][1] = buffer[offset++];
    scan[x][2] = buffer[offset++];
    scan[x][3] = buffer[offset++];
    if (scan[x][0] === 1 && scan[x][1] === 1 && scan[x][2] === 1) {
      for (var i = scan[x][3] << rshift >>> 0; i > 0; i--) {
        copyrgbe(scan[x - 1], scan[x]);
        x++;
        len--;
      }
      rshift += 8;
    } else {
      x++;
      len--;
      rshift = 0;
    }
  }
  return offset;
}
function readColors(scan, buffer, offset, xmax) {
  if (xmax < MINELEN | xmax > MAXELEN) {
    return oldReadColors(scan, buffer, offset, xmax);
  }
  var i = buffer[offset++];
  if (i != 2) {
    return oldReadColors(scan, buffer, offset - 1, xmax);
  }
  scan[0][1] = buffer[offset++];
  scan[0][2] = buffer[offset++];
  i = buffer[offset++];
  if ((scan[0][2] << 8 >>> 0 | i) >>> 0 !== xmax) {
    return null;
  }
  for (var i = 0; i < 4; i++) {
    for (var x = 0; x < xmax; ) {
      var code = buffer[offset++];
      if (code > 128) {
        code = (code & 127) >>> 0;
        var val = buffer[offset++];
        while (code--) {
          scan[x++][i] = val;
        }
      } else {
        while (code--) {
          scan[x++][i] = buffer[offset++];
        }
      }
    }
  }
  return offset;
}
var ret = {
  parseRGBE: function(arrayBuffer, texture, exposure) {
    if (exposure == null) {
      exposure = 0;
    }
    var data = new Uint8Array(arrayBuffer);
    var size = data.length;
    if (uint82string(data, 0, 2) !== "#?") {
      return;
    }
    for (var i = 2; i < size; i++) {
      if (toChar(data[i]) === "\n" && toChar(data[i + 1]) === "\n") {
        break;
      }
    }
    if (i >= size) {
      return;
    }
    i += 2;
    var str = "";
    for (; i < size; i++) {
      var _char = toChar(data[i]);
      if (_char === "\n") {
        break;
      }
      str += _char;
    }
    var tmp = str.split(" ");
    var height = parseInt(tmp[1]);
    var width = parseInt(tmp[3]);
    if (!width || !height) {
      return;
    }
    var offset = i + 1;
    var scanline = [];
    for (var x = 0; x < width; x++) {
      scanline[x] = [];
      for (var j = 0; j < 4; j++) {
        scanline[x][j] = 0;
      }
    }
    var pixels = new Float32Array(width * height * 4);
    var offset2 = 0;
    for (var y = 0; y < height; y++) {
      var offset = readColors(scanline, data, offset, width);
      if (!offset) {
        return null;
      }
      for (var x = 0; x < width; x++) {
        rgbe2float(scanline[x], pixels, offset2, exposure);
        offset2 += 4;
      }
    }
    if (!texture) {
      texture = new Texture2D$1();
    }
    texture.width = width;
    texture.height = height;
    texture.pixels = pixels;
    texture.type = Texture$1.FLOAT;
    return texture;
  },
  parseRGBEFromPNG: function(png) {
  }
};
var hdr = ret;
var textureUtil = {
  loadTexture: function(path, option, onsuccess, onerror) {
    var texture;
    if (typeof option === "function") {
      onsuccess = option;
      onerror = onsuccess;
      option = {};
    } else {
      option = option || {};
    }
    if (typeof path === "string") {
      if (path.match(/.hdr$/) || option.fileType === "hdr") {
        texture = new Texture2D$1({
          width: 0,
          height: 0,
          sRGB: false
        });
        textureUtil._fetchTexture(path, function(data) {
          hdr.parseRGBE(data, texture, option.exposure);
          texture.dirty();
          onsuccess && onsuccess(texture);
        }, onerror);
        return texture;
      } else if (path.match(/.dds$/) || option.fileType === "dds") {
        texture = new Texture2D$1({
          width: 0,
          height: 0
        });
        textureUtil._fetchTexture(path, function(data) {
          dds.parse(data, texture);
          texture.dirty();
          onsuccess && onsuccess(texture);
        }, onerror);
      } else {
        texture = new Texture2D$1();
        texture.load(path);
        texture.success(onsuccess);
        texture.error(onerror);
      }
    } else if (typeof path === "object" && typeof path.px !== "undefined") {
      texture = new TextureCube$1();
      texture.load(path);
      texture.success(onsuccess);
      texture.error(onerror);
    }
    return texture;
  },
  loadPanorama: function(renderer, path, cubeMap, option, onsuccess, onerror) {
    var self = this;
    if (typeof option === "function") {
      onsuccess = option;
      onerror = onsuccess;
      option = {};
    } else {
      option = option || {};
    }
    textureUtil.loadTexture(path, option, function(texture) {
      texture.flipY = option.flipY || false;
      self.panoramaToCubeMap(renderer, texture, cubeMap, option);
      texture.dispose(renderer);
      onsuccess && onsuccess(cubeMap);
    }, onerror);
  },
  panoramaToCubeMap: function(renderer, panoramaMap, cubeMap, option) {
    var environmentMapPass = new EnvironmentMapPass$1();
    var skydome = new Skybox$1({
      scene: new Scene$1()
    });
    skydome.setEnvironmentMap(panoramaMap);
    option = option || {};
    if (option.encodeRGBM) {
      skydome.material.define("fragment", "RGBM_ENCODE");
    }
    cubeMap.sRGB = panoramaMap.sRGB;
    environmentMapPass.texture = cubeMap;
    environmentMapPass.render(renderer, skydome.scene);
    environmentMapPass.texture = null;
    environmentMapPass.dispose(renderer);
    return cubeMap;
  },
  heightToNormal: function(image, checkBump) {
    var canvas = document.createElement("canvas");
    var width = canvas.width = image.width;
    var height = canvas.height = image.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, width, height);
    checkBump = checkBump || false;
    var srcData = ctx.getImageData(0, 0, width, height);
    var dstData = ctx.createImageData(width, height);
    for (var i = 0; i < srcData.data.length; i += 4) {
      if (checkBump) {
        var r = srcData.data[i];
        var g2 = srcData.data[i + 1];
        var b = srcData.data[i + 2];
        var diff = Math.abs(r - g2) + Math.abs(g2 - b);
        if (diff > 20) {
          console.warn("Given image is not a height map");
          return image;
        }
      }
      var x1, y1, x2, y2;
      if (i % (width * 4) === 0) {
        x1 = srcData.data[i];
        x2 = srcData.data[i + 4];
      } else if (i % (width * 4) === (width - 1) * 4) {
        x1 = srcData.data[i - 4];
        x2 = srcData.data[i];
      } else {
        x1 = srcData.data[i - 4];
        x2 = srcData.data[i + 4];
      }
      if (i < width * 4) {
        y1 = srcData.data[i];
        y2 = srcData.data[i + width * 4];
      } else if (i > width * (height - 1) * 4) {
        y1 = srcData.data[i - width * 4];
        y2 = srcData.data[i];
      } else {
        y1 = srcData.data[i - width * 4];
        y2 = srcData.data[i + width * 4];
      }
      dstData.data[i] = x1 - x2 + 127;
      dstData.data[i + 1] = y1 - y2 + 127;
      dstData.data[i + 2] = 255;
      dstData.data[i + 3] = 255;
    }
    ctx.putImageData(dstData, 0, 0);
    return canvas;
  },
  isHeightImage: function(img, downScaleSize, threshold) {
    if (!img || !img.width || !img.height) {
      return false;
    }
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var size = downScaleSize || 32;
    threshold = threshold || 20;
    canvas.width = canvas.height = size;
    ctx.drawImage(img, 0, 0, size, size);
    var srcData = ctx.getImageData(0, 0, size, size);
    for (var i = 0; i < srcData.data.length; i += 4) {
      var r = srcData.data[i];
      var g2 = srcData.data[i + 1];
      var b = srcData.data[i + 2];
      var diff = Math.abs(r - g2) + Math.abs(g2 - b);
      if (diff > threshold) {
        return false;
      }
    }
    return true;
  },
  _fetchTexture: function(path, onsuccess, onerror) {
    vendor$1.request.get({
      url: path,
      responseType: "arraybuffer",
      onload: onsuccess,
      onerror
    });
  },
  createChessboard: function(size, unitSize, color1, color2) {
    size = size || 512;
    unitSize = unitSize || 64;
    color1 = color1 || "black";
    color2 = color2 || "white";
    var repeat = Math.ceil(size / unitSize);
    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color2;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = color1;
    for (var i = 0; i < repeat; i++) {
      for (var j = 0; j < repeat; j++) {
        var isFill = j % 2 ? i % 2 : i % 2 - 1;
        if (isFill) {
          ctx.fillRect(i * unitSize, j * unitSize, unitSize, unitSize);
        }
      }
    }
    var texture = new Texture2D$1({
      image: canvas,
      anisotropic: 8
    });
    return texture;
  },
  createBlank: function(color) {
    var canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    var texture = new Texture2D$1({
      image: canvas
    });
    return texture;
  }
};
var textureUtil$1 = textureUtil;
var events = ["mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "click", "dblclick", "contextmenu"];
function makeHandlerName(eventName) {
  return "_on" + eventName;
}
var EChartsSurface = function(chart) {
  var self = this;
  this._texture = new Texture2D$1({
    anisotropic: 32,
    flipY: false,
    surface: this,
    dispose: function(renderer) {
      self.dispose();
      Texture2D$1.prototype.dispose.call(this, renderer);
    }
  });
  events.forEach(function(eventName) {
    this[makeHandlerName(eventName)] = function(eveObj) {
      if (!eveObj.triangle) {
        return;
      }
      this._meshes.forEach(function(mesh2) {
        this.dispatchEvent(eventName, mesh2, eveObj.triangle, eveObj.point);
      }, this);
    };
  }, this);
  this._meshes = [];
  if (chart) {
    this.setECharts(chart);
  }
  this.onupdate = null;
};
EChartsSurface.prototype = {
  constructor: EChartsSurface,
  getTexture: function() {
    return this._texture;
  },
  setECharts: function(chart) {
    this._chart = chart;
    var canvas = chart.getDom();
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error("ECharts must init on canvas if it is used as texture.");
      canvas = document.createElement("canvas");
    } else {
      var self = this;
      var zr = chart.getZr();
      var oldRefreshImmediately = zr.__oldRefreshImmediately || zr.refreshImmediately;
      zr.refreshImmediately = function() {
        oldRefreshImmediately.call(this);
        self._texture.dirty();
        self.onupdate && self.onupdate();
      };
      zr.__oldRefreshImmediately = oldRefreshImmediately;
    }
    this._texture.image = canvas;
    this._texture.dirty();
    this.onupdate && this.onupdate();
  },
  dispatchEvent: function() {
    var p02 = new Vector3$1();
    var p12 = new Vector3$1();
    var p22 = new Vector3$1();
    var uv0 = new Vector2$1();
    var uv1 = new Vector2$1();
    var uv2 = new Vector2$1();
    var uv = new Vector2$1();
    var vCross = new Vector3$1();
    return function(eventName, attachedMesh, triangle, point) {
      var geo = attachedMesh.geometry;
      var position = geo.attributes.position;
      var texcoord = geo.attributes.texcoord0;
      var dot = Vector3$1.dot;
      var cross2 = Vector3$1.cross;
      position.get(triangle[0], p02.array);
      position.get(triangle[1], p12.array);
      position.get(triangle[2], p22.array);
      texcoord.get(triangle[0], uv0.array);
      texcoord.get(triangle[1], uv1.array);
      texcoord.get(triangle[2], uv2.array);
      cross2(vCross, p12, p22);
      var det = dot(p02, vCross);
      var t = dot(point, vCross) / det;
      cross2(vCross, p22, p02);
      var u = dot(point, vCross) / det;
      cross2(vCross, p02, p12);
      var v = dot(point, vCross) / det;
      Vector2$1.scale(uv, uv0, t);
      Vector2$1.scaleAndAdd(uv, uv, uv1, u);
      Vector2$1.scaleAndAdd(uv, uv, uv2, v);
      var x = uv.x * this._chart.getWidth();
      var y = uv.y * this._chart.getHeight();
      this._chart.getZr().handler.dispatch(eventName, {
        zrX: x,
        zrY: y
      });
    };
  }(),
  attachToMesh: function(mesh2) {
    if (this._meshes.indexOf(mesh2) >= 0) {
      return;
    }
    events.forEach(function(eventName) {
      mesh2.on(eventName, this[makeHandlerName(eventName)], this);
    }, this);
    this._meshes.push(mesh2);
  },
  detachFromMesh: function(mesh2) {
    var idx = this._meshes.indexOf(mesh2);
    if (idx >= 0) {
      this._meshes.splice(idx, 1);
    }
    events.forEach(function(eventName) {
      mesh2.off(eventName, this[makeHandlerName(eventName)]);
    }, this);
  },
  dispose: function() {
    this._meshes.forEach(function(mesh2) {
      this.detachFromMesh(mesh2);
    }, this);
  }
};
var EChartsSurface$1 = EChartsSurface;
var Orthographic = Camera$1.extend({
  left: -1,
  right: 1,
  near: -1,
  far: 1,
  top: 1,
  bottom: -1
}, {
  updateProjectionMatrix: function() {
    this.projectionMatrix.ortho(this.left, this.right, this.bottom, this.top, this.near, this.far);
  },
  decomposeProjectionMatrix: function() {
    var m = this.projectionMatrix.array;
    this.left = (-1 - m[12]) / m[0];
    this.right = (1 - m[12]) / m[0];
    this.top = (1 - m[13]) / m[5];
    this.bottom = (-1 - m[13]) / m[5];
    this.near = -(-1 - m[14]) / m[10];
    this.far = -(1 - m[14]) / m[10];
  },
  clone: function() {
    var camera2 = Camera$1.prototype.clone.call(this);
    camera2.left = this.left;
    camera2.right = this.right;
    camera2.near = this.near;
    camera2.far = this.far;
    camera2.top = this.top;
    camera2.bottom = this.bottom;
    return camera2;
  }
});
var OrthoCamera = Orthographic;
var vertexGlsl = "\n@export clay.compositor.vertex\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\nattribute vec3 position : POSITION;\nattribute vec2 texcoord : TEXCOORD_0;\nvarying vec2 v_Texcoord;\nvoid main()\n{\n v_Texcoord = texcoord;\n gl_Position = worldViewProjection * vec4(position, 1.0);\n}\n@end";
Shader["import"](vertexGlsl);
var planeGeo = new PlaneGeometry();
var mesh = new Mesh$1({
  geometry: planeGeo,
  frustumCulling: false
});
var camera = new OrthoCamera();
var Pass = Base$1.extend(function() {
  return {
    fragment: "",
    outputs: null,
    material: null,
    blendWithPrevious: false,
    clearColor: false,
    clearDepth: true
  };
}, function() {
  var shader = new Shader(Shader.source("clay.compositor.vertex"), this.fragment);
  var material = new Material$1({
    shader
  });
  material.enableTexturesAll();
  this.material = material;
}, {
  setUniform: function(name, value) {
    this.material.setUniform(name, value);
  },
  getUniform: function(name) {
    var uniform = this.material.uniforms[name];
    if (uniform) {
      return uniform.value;
    }
  },
  attachOutput: function(texture, attachment) {
    if (!this.outputs) {
      this.outputs = {};
    }
    attachment = attachment || glenum.COLOR_ATTACHMENT0;
    this.outputs[attachment] = texture;
  },
  detachOutput: function(texture) {
    for (var attachment in this.outputs) {
      if (this.outputs[attachment] === texture) {
        this.outputs[attachment] = null;
      }
    }
  },
  bind: function(renderer, frameBuffer) {
    if (this.outputs) {
      for (var attachment in this.outputs) {
        var texture = this.outputs[attachment];
        if (texture) {
          frameBuffer.attach(texture, attachment);
        }
      }
    }
    if (frameBuffer) {
      frameBuffer.bind(renderer);
    }
  },
  unbind: function(renderer, frameBuffer) {
    frameBuffer.unbind(renderer);
  },
  render: function(renderer, frameBuffer) {
    var _gl = renderer.gl;
    if (frameBuffer) {
      this.bind(renderer, frameBuffer);
      var ext = renderer.getGLExtension("EXT_draw_buffers");
      if (ext && this.outputs) {
        var bufs = [];
        for (var attachment in this.outputs) {
          attachment = +attachment;
          if (attachment >= _gl.COLOR_ATTACHMENT0 && attachment <= _gl.COLOR_ATTACHMENT0 + 8) {
            bufs.push(attachment);
          }
        }
        ext.drawBuffersEXT(bufs);
      }
    }
    this.trigger("beforerender", this, renderer);
    var clearBit = this.clearDepth ? _gl.DEPTH_BUFFER_BIT : 0;
    _gl.depthMask(true);
    if (this.clearColor) {
      clearBit = clearBit | _gl.COLOR_BUFFER_BIT;
      _gl.colorMask(true, true, true, true);
      var cc = this.clearColor;
      if (Array.isArray(cc)) {
        _gl.clearColor(cc[0], cc[1], cc[2], cc[3]);
      }
    }
    _gl.clear(clearBit);
    if (this.blendWithPrevious) {
      _gl.enable(_gl.BLEND);
      this.material.transparent = true;
    } else {
      _gl.disable(_gl.BLEND);
      this.material.transparent = false;
    }
    this.renderQuad(renderer);
    this.trigger("afterrender", this, renderer);
    if (frameBuffer) {
      this.unbind(renderer, frameBuffer);
    }
  },
  renderQuad: function(renderer) {
    mesh.material = this.material;
    renderer.renderPass([mesh], camera);
  },
  dispose: function(renderer) {
  }
});
var Pass$1 = Pass;
var integrateBRDFShaderCode = "#define SAMPLE_NUMBER 1024\n#define PI 3.14159265358979\nuniform sampler2D normalDistribution;\nuniform vec2 viewportSize : [512, 256];\nconst vec3 N = vec3(0.0, 0.0, 1.0);\nconst float fSampleNumber = float(SAMPLE_NUMBER);\nvec3 importanceSampleNormal(float i, float roughness, vec3 N) {\n vec3 H = texture2D(normalDistribution, vec2(roughness, i)).rgb;\n vec3 upVector = abs(N.y) > 0.999 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);\n vec3 tangentX = normalize(cross(N, upVector));\n vec3 tangentZ = cross(N, tangentX);\n return normalize(tangentX * H.x + N * H.y + tangentZ * H.z);\n}\nfloat G_Smith(float roughness, float NoV, float NoL) {\n float k = roughness * roughness / 2.0;\n float G1V = NoV / (NoV * (1.0 - k) + k);\n float G1L = NoL / (NoL * (1.0 - k) + k);\n return G1L * G1V;\n}\nvoid main() {\n vec2 uv = gl_FragCoord.xy / viewportSize;\n float NoV = uv.x;\n float roughness = uv.y;\n vec3 V;\n V.x = sqrt(1.0 - NoV * NoV);\n V.y = 0.0;\n V.z = NoV;\n float A = 0.0;\n float B = 0.0;\n for (int i = 0; i < SAMPLE_NUMBER; i++) {\n vec3 H = importanceSampleNormal(float(i) / fSampleNumber, roughness, N);\n vec3 L = reflect(-V, H);\n float NoL = clamp(L.z, 0.0, 1.0);\n float NoH = clamp(H.z, 0.0, 1.0);\n float VoH = clamp(dot(V, H), 0.0, 1.0);\n if (NoL > 0.0) {\n float G = G_Smith(roughness, NoV, NoL);\n float G_Vis = G * VoH / (NoH * NoV);\n float Fc = pow(1.0 - VoH, 5.0);\n A += (1.0 - Fc) * G_Vis;\n B += Fc * G_Vis;\n }\n }\n gl_FragColor = vec4(vec2(A, B) / fSampleNumber, 0.0, 1.0);\n}\n";
var prefilterFragCode = "#define SHADER_NAME prefilter\n#define SAMPLE_NUMBER 1024\n#define PI 3.14159265358979\nuniform mat4 viewInverse : VIEWINVERSE;\nuniform samplerCube environmentMap;\nuniform sampler2D normalDistribution;\nuniform float roughness : 0.5;\nvarying vec2 v_Texcoord;\nvarying vec3 v_WorldPosition;\n@import clay.util.rgbm\nvec3 importanceSampleNormal(float i, float roughness, vec3 N) {\n vec3 H = texture2D(normalDistribution, vec2(roughness, i)).rgb;\n vec3 upVector = abs(N.y) > 0.999 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);\n vec3 tangentX = normalize(cross(N, upVector));\n vec3 tangentZ = cross(N, tangentX);\n return normalize(tangentX * H.x + N * H.y + tangentZ * H.z);\n}\nvoid main() {\n vec3 eyePos = viewInverse[3].xyz;\n vec3 V = normalize(v_WorldPosition - eyePos);\n vec3 N = V;\n vec3 prefilteredColor = vec3(0.0);\n float totalWeight = 0.0;\n float fMaxSampleNumber = float(SAMPLE_NUMBER);\n for (int i = 0; i < SAMPLE_NUMBER; i++) {\n vec3 H = importanceSampleNormal(float(i) / fMaxSampleNumber, roughness, N);\n vec3 L = reflect(-V, H);\n float NoL = clamp(dot(N, L), 0.0, 1.0);\n if (NoL > 0.0) {\n prefilteredColor += decodeHDR(textureCube(environmentMap, L)).rgb * NoL;\n totalWeight += NoL;\n }\n }\n gl_FragColor = encodeHDR(vec4(prefilteredColor / totalWeight, 1.0));\n}\n";
var cubemapUtil = {};
var targets$2 = ["px", "nx", "py", "ny", "pz", "nz"];
cubemapUtil.prefilterEnvironmentMap = function(renderer, envMap, textureOpts, normalDistribution, brdfLookup) {
  if (!brdfLookup || !normalDistribution) {
    normalDistribution = cubemapUtil.generateNormalDistribution();
    brdfLookup = cubemapUtil.integrateBRDF(renderer, normalDistribution);
  }
  textureOpts = textureOpts || {};
  var width = textureOpts.width || 64;
  var height = textureOpts.height || 64;
  var textureType = textureOpts.type || envMap.type;
  var prefilteredCubeMap = new TextureCube$1({
    width,
    height,
    type: textureType,
    flipY: false,
    mipmaps: []
  });
  if (!prefilteredCubeMap.isPowerOfTwo()) {
    console.warn("Width and height must be power of two to enable mipmap.");
  }
  var size = Math.min(width, height);
  var mipmapNum = Math.log(size) / Math.log(2) + 1;
  var prefilterMaterial = new Material$1({
    shader: new Shader({
      vertex: Shader.source("clay.skybox.vertex"),
      fragment: prefilterFragCode
    })
  });
  prefilterMaterial.set("normalDistribution", normalDistribution);
  textureOpts.encodeRGBM && prefilterMaterial.define("fragment", "RGBM_ENCODE");
  textureOpts.decodeRGBM && prefilterMaterial.define("fragment", "RGBM_DECODE");
  var dummyScene = new Scene$1();
  var skyEnv;
  if (envMap.textureType === "texture2D") {
    var envCubemap = new TextureCube$1({
      width,
      height,
      type: textureType === Texture$1.FLOAT ? Texture$1.HALF_FLOAT : textureType
    });
    textureUtil$1.panoramaToCubeMap(renderer, envMap, envCubemap, {
      encodeRGBM: textureOpts.decodeRGBM
    });
    envMap = envCubemap;
  }
  skyEnv = new Skybox$1({
    scene: dummyScene,
    material: prefilterMaterial
  });
  skyEnv.material.set("environmentMap", envMap);
  var envMapPass = new EnvironmentMapPass$1({
    texture: prefilteredCubeMap
  });
  if (textureOpts.encodeRGBM) {
    textureType = prefilteredCubeMap.type = Texture$1.UNSIGNED_BYTE;
  }
  var renderTargetTmp = new Texture2D$1({
    width,
    height,
    type: textureType
  });
  var frameBuffer = new FrameBuffer$1({
    depthBuffer: false
  });
  var ArrayCtor = vendor$1[textureType === Texture$1.UNSIGNED_BYTE ? "Uint8Array" : "Float32Array"];
  for (var i = 0; i < mipmapNum; i++) {
    prefilteredCubeMap.mipmaps[i] = {
      pixels: {}
    };
    skyEnv.material.set("roughness", i / (mipmapNum - 1));
    var n = renderTargetTmp.width;
    var fov = 2 * Math.atan(n / (n - 0.5)) / Math.PI * 180;
    for (var j = 0; j < targets$2.length; j++) {
      var pixels = new ArrayCtor(renderTargetTmp.width * renderTargetTmp.height * 4);
      frameBuffer.attach(renderTargetTmp);
      frameBuffer.bind(renderer);
      var camera2 = envMapPass.getCamera(targets$2[j]);
      camera2.fov = fov;
      renderer.render(dummyScene, camera2);
      renderer.gl.readPixels(0, 0, renderTargetTmp.width, renderTargetTmp.height, Texture$1.RGBA, textureType, pixels);
      frameBuffer.unbind(renderer);
      prefilteredCubeMap.mipmaps[i].pixels[targets$2[j]] = pixels;
    }
    renderTargetTmp.width /= 2;
    renderTargetTmp.height /= 2;
    renderTargetTmp.dirty();
  }
  frameBuffer.dispose(renderer);
  renderTargetTmp.dispose(renderer);
  skyEnv.dispose(renderer);
  normalDistribution.dispose(renderer);
  return {
    environmentMap: prefilteredCubeMap,
    brdfLookup,
    normalDistribution,
    maxMipmapLevel: mipmapNum
  };
};
cubemapUtil.integrateBRDF = function(renderer, normalDistribution) {
  normalDistribution = normalDistribution || cubemapUtil.generateNormalDistribution();
  var framebuffer = new FrameBuffer$1({
    depthBuffer: false
  });
  var pass = new Pass$1({
    fragment: integrateBRDFShaderCode
  });
  var texture = new Texture2D$1({
    width: 512,
    height: 256,
    type: Texture$1.HALF_FLOAT,
    wrapS: Texture$1.CLAMP_TO_EDGE,
    wrapT: Texture$1.CLAMP_TO_EDGE,
    minFilter: Texture$1.NEAREST,
    magFilter: Texture$1.NEAREST,
    useMipmap: false
  });
  pass.setUniform("normalDistribution", normalDistribution);
  pass.setUniform("viewportSize", [512, 256]);
  pass.attachOutput(texture);
  pass.render(renderer, framebuffer);
  framebuffer.dispose(renderer);
  return texture;
};
cubemapUtil.generateNormalDistribution = function(roughnessLevels, sampleSize) {
  var roughnessLevels = roughnessLevels || 256;
  var sampleSize = sampleSize || 1024;
  var normalDistribution = new Texture2D$1({
    width: roughnessLevels,
    height: sampleSize,
    type: Texture$1.FLOAT,
    minFilter: Texture$1.NEAREST,
    magFilter: Texture$1.NEAREST,
    wrapS: Texture$1.CLAMP_TO_EDGE,
    wrapT: Texture$1.CLAMP_TO_EDGE,
    useMipmap: false
  });
  var pixels = new Float32Array(sampleSize * roughnessLevels * 4);
  var tmp = [];
  for (var j = 0; j < roughnessLevels; j++) {
    var roughness = j / roughnessLevels;
    var a = roughness * roughness;
    for (var i = 0; i < sampleSize; i++) {
      var y = (i << 16 | i >>> 16) >>> 0;
      y = ((y & 1431655765) << 1 | (y & 2863311530) >>> 1) >>> 0;
      y = ((y & 858993459) << 2 | (y & 3435973836) >>> 2) >>> 0;
      y = ((y & 252645135) << 4 | (y & 4042322160) >>> 4) >>> 0;
      y = (((y & 16711935) << 8 | (y & 4278255360) >>> 8) >>> 0) / 4294967296;
      var cosTheta = Math.sqrt((1 - y) / (1 + (a * a - 1) * y));
      tmp[i] = cosTheta;
    }
    for (var i = 0; i < sampleSize; i++) {
      var offset = (i * roughnessLevels + j) * 4;
      var cosTheta = tmp[i];
      var sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
      var x = i / sampleSize;
      var phi = 2 * Math.PI * x;
      pixels[offset] = sinTheta * Math.cos(phi);
      pixels[offset + 1] = cosTheta;
      pixels[offset + 2] = sinTheta * Math.sin(phi);
      pixels[offset + 3] = 1;
    }
  }
  normalDistribution.pixels = pixels;
  return normalDistribution;
};
var cubemapUtil$1 = cubemapUtil;
var AmbientCubemapLight = Light$1.extend({
  cubemap: null,
  castShadow: false,
  _normalDistribution: null,
  _brdfLookup: null
}, {
  type: "AMBIENT_CUBEMAP_LIGHT",
  prefilter: function(renderer, size) {
    if (!renderer.getGLExtension("EXT_shader_texture_lod")) {
      console.warn("Device not support textureCubeLodEXT");
      return;
    }
    if (!this._brdfLookup) {
      this._normalDistribution = cubemapUtil$1.generateNormalDistribution();
      this._brdfLookup = cubemapUtil$1.integrateBRDF(renderer, this._normalDistribution);
    }
    var cubemap = this.cubemap;
    if (cubemap.__prefiltered) {
      return;
    }
    var result = cubemapUtil$1.prefilterEnvironmentMap(renderer, cubemap, {
      encodeRGBM: true,
      width: size,
      height: size
    }, this._normalDistribution, this._brdfLookup);
    this.cubemap = result.environmentMap;
    this.cubemap.__prefiltered = true;
    cubemap.dispose(renderer);
  },
  getBRDFLookup: function() {
    return this._brdfLookup;
  },
  uniformTemplates: {
    ambientCubemapLightColor: {
      type: "3f",
      value: function(instance) {
        var color = instance.color;
        var intensity = instance.intensity;
        return [color[0] * intensity, color[1] * intensity, color[2] * intensity];
      }
    },
    ambientCubemapLightCubemap: {
      type: "t",
      value: function(instance) {
        return instance.cubemap;
      }
    },
    ambientCubemapLightBRDFLookup: {
      type: "t",
      value: function(instance) {
        return instance._brdfLookup;
      }
    }
  }
});
var AmbientCubemapLight$1 = AmbientCubemapLight;
var AmbientSHLight = Light$1.extend({
  castShadow: false,
  coefficients: []
}, function() {
  this._coefficientsTmpArr = new vendor$1.Float32Array(9 * 3);
}, {
  type: "AMBIENT_SH_LIGHT",
  uniformTemplates: {
    ambientSHLightColor: {
      type: "3f",
      value: function(instance) {
        var color = instance.color;
        var intensity = instance.intensity;
        return [color[0] * intensity, color[1] * intensity, color[2] * intensity];
      }
    },
    ambientSHLightCoefficients: {
      type: "3f",
      value: function(instance) {
        var coefficientsTmpArr = instance._coefficientsTmpArr;
        for (var i = 0; i < instance.coefficients.length; i++) {
          coefficientsTmpArr[i] = instance.coefficients[i];
        }
        return coefficientsTmpArr;
      }
    }
  }
});
var AmbientSHLight$1 = AmbientSHLight;
var sh = {};
var targets$1 = ["px", "nx", "py", "ny", "pz", "nz"];
function harmonics(normal2, index) {
  var x = normal2[0];
  var y = normal2[1];
  var z = normal2[2];
  if (index === 0) {
    return 1;
  } else if (index === 1) {
    return x;
  } else if (index === 2) {
    return y;
  } else if (index === 3) {
    return z;
  } else if (index === 4) {
    return x * z;
  } else if (index === 5) {
    return y * z;
  } else if (index === 6) {
    return x * y;
  } else if (index === 7) {
    return 3 * z * z - 1;
  } else {
    return x * x - y * y;
  }
}
var normalTransform = {
  px: [2, 1, 0, -1, -1, 1],
  nx: [2, 1, 0, 1, -1, -1],
  py: [0, 2, 1, 1, -1, -1],
  ny: [0, 2, 1, 1, 1, 1],
  pz: [0, 1, 2, -1, -1, -1],
  nz: [0, 1, 2, 1, -1, 1]
};
function projectEnvironmentMapCPU(renderer, cubePixels, width, height) {
  var coeff = new vendor$1.Float32Array(9 * 3);
  var normal2 = vec3$8.create();
  var texel = vec3$8.create();
  var fetchNormal = vec3$8.create();
  for (var m = 0; m < 9; m++) {
    var result = vec3$8.create();
    for (var k = 0; k < targets$1.length; k++) {
      var pixels = cubePixels[targets$1[k]];
      var sideResult = vec3$8.create();
      var divider = 0;
      var i = 0;
      var transform = normalTransform[targets$1[k]];
      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          normal2[0] = x / (width - 1) * 2 - 1;
          normal2[1] = y / (height - 1) * 2 - 1;
          normal2[2] = -1;
          vec3$8.normalize(normal2, normal2);
          fetchNormal[0] = normal2[transform[0]] * transform[3];
          fetchNormal[1] = normal2[transform[1]] * transform[4];
          fetchNormal[2] = normal2[transform[2]] * transform[5];
          texel[0] = pixels[i++] / 255;
          texel[1] = pixels[i++] / 255;
          texel[2] = pixels[i++] / 255;
          var scale2 = pixels[i++] / 255 * 8.12;
          texel[0] *= scale2;
          texel[1] *= scale2;
          texel[2] *= scale2;
          vec3$8.scaleAndAdd(sideResult, sideResult, texel, harmonics(fetchNormal, m) * -normal2[2]);
          divider += -normal2[2];
        }
      }
      vec3$8.scaleAndAdd(result, result, sideResult, 1 / divider);
    }
    coeff[m * 3] = result[0] / 6;
    coeff[m * 3 + 1] = result[1] / 6;
    coeff[m * 3 + 2] = result[2] / 6;
  }
  return coeff;
}
sh.projectEnvironmentMap = function(renderer, envMap, opts) {
  opts = opts || {};
  opts.lod = opts.lod || 0;
  var skybox;
  var dummyScene = new Scene$1();
  var size = 64;
  if (envMap.textureType === "texture2D") {
    skybox = new Skybox$1({
      scene: dummyScene,
      environmentMap: envMap
    });
  } else {
    size = envMap.image && envMap.image.px ? envMap.image.px.width : envMap.width;
    skybox = new Skybox$1({
      scene: dummyScene,
      environmentMap: envMap
    });
  }
  var width = Math.ceil(size / Math.pow(2, opts.lod));
  var height = Math.ceil(size / Math.pow(2, opts.lod));
  var rgbmTexture = new Texture2D$1({
    width,
    height
  });
  var framebuffer = new FrameBuffer$1();
  skybox.material.define("fragment", "RGBM_ENCODE");
  if (opts.decodeRGBM) {
    skybox.material.define("fragment", "RGBM_DECODE");
  }
  skybox.material.set("lod", opts.lod);
  var envMapPass = new EnvironmentMapPass$1({
    texture: rgbmTexture
  });
  var cubePixels = {};
  for (var i = 0; i < targets$1.length; i++) {
    cubePixels[targets$1[i]] = new Uint8Array(width * height * 4);
    var camera2 = envMapPass.getCamera(targets$1[i]);
    camera2.fov = 90;
    framebuffer.attach(rgbmTexture);
    framebuffer.bind(renderer);
    renderer.render(dummyScene, camera2);
    renderer.gl.readPixels(0, 0, width, height, Texture$1.RGBA, Texture$1.UNSIGNED_BYTE, cubePixels[targets$1[i]]);
    framebuffer.unbind(renderer);
  }
  skybox.dispose(renderer);
  framebuffer.dispose(renderer);
  rgbmTexture.dispose(renderer);
  return projectEnvironmentMapCPU(renderer, cubePixels, width, height);
};
var shUtil = sh;
var retrieve = {
  firstNotNull: function() {
    for (var i = 0, len = arguments.length; i < len; i++) {
      if (arguments[i] != null) {
        return arguments[i];
      }
    }
  },
  queryDataIndex: function(data, payload) {
    if (payload.dataIndexInside != null) {
      return payload.dataIndexInside;
    } else if (payload.dataIndex != null) {
      return isArray(payload.dataIndex) ? map$1(payload.dataIndex, function(value) {
        return data.indexOfRawIndex(value);
      }) : data.indexOfRawIndex(payload.dataIndex);
    } else if (payload.name != null) {
      return isArray(payload.name) ? map$1(payload.name, function(value) {
        return data.indexOfName(value);
      }) : data.indexOfName(payload.name);
    }
  }
};
var retrieve$1 = retrieve;
var Sphere = Geometry$1.extend({
  dynamic: false,
  widthSegments: 40,
  heightSegments: 20,
  phiStart: 0,
  phiLength: Math.PI * 2,
  thetaStart: 0,
  thetaLength: Math.PI,
  radius: 1
}, function() {
  this.build();
}, {
  build: function() {
    var heightSegments = this.heightSegments;
    var widthSegments = this.widthSegments;
    var positionAttr = this.attributes.position;
    var texcoordAttr = this.attributes.texcoord0;
    var normalAttr = this.attributes.normal;
    var vertexCount = (widthSegments + 1) * (heightSegments + 1);
    positionAttr.init(vertexCount);
    texcoordAttr.init(vertexCount);
    normalAttr.init(vertexCount);
    var IndicesCtor = vertexCount > 65535 ? Uint32Array : Uint16Array;
    var indices = this.indices = new IndicesCtor(widthSegments * heightSegments * 6);
    var x, y, z, u, v, i, j;
    var radius = this.radius;
    var phiStart = this.phiStart;
    var phiLength = this.phiLength;
    var thetaStart = this.thetaStart;
    var thetaLength = this.thetaLength;
    var radius = this.radius;
    var pos = [];
    var uv = [];
    var offset = 0;
    var divider = 1 / radius;
    for (j = 0; j <= heightSegments; j++) {
      for (i = 0; i <= widthSegments; i++) {
        u = i / widthSegments;
        v = j / heightSegments;
        x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
        y = radius * Math.cos(thetaStart + v * thetaLength);
        z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
        pos[0] = x;
        pos[1] = y;
        pos[2] = z;
        uv[0] = u;
        uv[1] = v;
        positionAttr.set(offset, pos);
        texcoordAttr.set(offset, uv);
        pos[0] *= divider;
        pos[1] *= divider;
        pos[2] *= divider;
        normalAttr.set(offset, pos);
        offset++;
      }
    }
    var i1, i2, i3, i4;
    var len = widthSegments + 1;
    var n = 0;
    for (j = 0; j < heightSegments; j++) {
      for (i = 0; i < widthSegments; i++) {
        i2 = j * len + i;
        i1 = j * len + i + 1;
        i4 = (j + 1) * len + i + 1;
        i3 = (j + 1) * len + i;
        indices[n++] = i1;
        indices[n++] = i2;
        indices[n++] = i4;
        indices[n++] = i2;
        indices[n++] = i3;
        indices[n++] = i4;
      }
    }
    this.boundingBox = new BoundingBox$1();
    this.boundingBox.max.set(radius, radius, radius);
    this.boundingBox.min.set(-radius, -radius, -radius);
  }
});
var SphereGeometry = Sphere;
var AmbientLight = Light$1.extend({
  castShadow: false
}, {
  type: "AMBIENT_LIGHT",
  uniformTemplates: {
    ambientLightColor: {
      type: "3f",
      value: function(instance) {
        var color = instance.color;
        var intensity = instance.intensity;
        return [color[0] * intensity, color[1] * intensity, color[2] * intensity];
      }
    }
  }
});
var AmbientLight$1 = AmbientLight;
var DirectionalLight = Light$1.extend({
  shadowBias: 1e-3,
  shadowSlopeScale: 2,
  shadowCascade: 1,
  cascadeSplitLogFactor: 0.2
}, {
  type: "DIRECTIONAL_LIGHT",
  uniformTemplates: {
    directionalLightDirection: {
      type: "3f",
      value: function(instance) {
        instance.__dir = instance.__dir || new Vector3$1();
        return instance.__dir.copy(instance.worldTransform.z).normalize().negate().array;
      }
    },
    directionalLightColor: {
      type: "3f",
      value: function(instance) {
        var color = instance.color;
        var intensity = instance.intensity;
        return [color[0] * intensity, color[1] * intensity, color[2] * intensity];
      }
    }
  },
  clone: function() {
    var light = Light$1.prototype.clone.call(this);
    light.shadowBias = this.shadowBias;
    light.shadowSlopeScale = this.shadowSlopeScale;
    return light;
  }
});
var DirectionalLight$1 = DirectionalLight;
var PointLight = Light$1.extend({
  range: 100,
  castShadow: false
}, {
  type: "POINT_LIGHT",
  uniformTemplates: {
    pointLightPosition: {
      type: "3f",
      value: function(instance) {
        return instance.getWorldPosition().array;
      }
    },
    pointLightRange: {
      type: "1f",
      value: function(instance) {
        return instance.range;
      }
    },
    pointLightColor: {
      type: "3f",
      value: function(instance) {
        var color = instance.color;
        var intensity = instance.intensity;
        return [color[0] * intensity, color[1] * intensity, color[2] * intensity];
      }
    }
  },
  clone: function() {
    var light = Light$1.prototype.clone.call(this);
    light.range = this.range;
    return light;
  }
});
var PointLight$1 = PointLight;
var SpotLight = Light$1.extend({
  range: 20,
  umbraAngle: 30,
  penumbraAngle: 45,
  falloffFactor: 2,
  shadowBias: 1e-3,
  shadowSlopeScale: 2
}, {
  type: "SPOT_LIGHT",
  uniformTemplates: {
    spotLightPosition: {
      type: "3f",
      value: function(instance) {
        return instance.getWorldPosition().array;
      }
    },
    spotLightRange: {
      type: "1f",
      value: function(instance) {
        return instance.range;
      }
    },
    spotLightUmbraAngleCosine: {
      type: "1f",
      value: function(instance) {
        return Math.cos(instance.umbraAngle * Math.PI / 180);
      }
    },
    spotLightPenumbraAngleCosine: {
      type: "1f",
      value: function(instance) {
        return Math.cos(instance.penumbraAngle * Math.PI / 180);
      }
    },
    spotLightFalloffFactor: {
      type: "1f",
      value: function(instance) {
        return instance.falloffFactor;
      }
    },
    spotLightDirection: {
      type: "3f",
      value: function(instance) {
        instance.__dir = instance.__dir || new Vector3$1();
        return instance.__dir.copy(instance.worldTransform.z).negate().array;
      }
    },
    spotLightColor: {
      type: "3f",
      value: function(instance) {
        var color = instance.color;
        var intensity = instance.intensity;
        return [color[0] * intensity, color[1] * intensity, color[2] * intensity];
      }
    }
  },
  clone: function() {
    var light = Light$1.prototype.clone.call(this);
    light.range = this.range;
    light.umbraAngle = this.umbraAngle;
    light.penumbraAngle = this.penumbraAngle;
    light.falloffFactor = this.falloffFactor;
    light.shadowBias = this.shadowBias;
    light.shadowSlopeScale = this.shadowSlopeScale;
    return light;
  }
});
var SpotLight$1 = SpotLight;
var Vector4 = function(x, y, z, w) {
  x = x || 0;
  y = y || 0;
  z = z || 0;
  w = w || 0;
  this.array = vec4$1.fromValues(x, y, z, w);
  this._dirty = true;
};
Vector4.prototype = {
  constructor: Vector4,
  add: function(b) {
    vec4$1.add(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  set: function(x, y, z, w) {
    this.array[0] = x;
    this.array[1] = y;
    this.array[2] = z;
    this.array[3] = w;
    this._dirty = true;
    return this;
  },
  setArray: function(arr) {
    this.array[0] = arr[0];
    this.array[1] = arr[1];
    this.array[2] = arr[2];
    this.array[3] = arr[3];
    this._dirty = true;
    return this;
  },
  clone: function() {
    return new Vector4(this.x, this.y, this.z, this.w);
  },
  copy: function(b) {
    vec4$1.copy(this.array, b.array);
    this._dirty = true;
    return this;
  },
  dist: function(b) {
    return vec4$1.dist(this.array, b.array);
  },
  distance: function(b) {
    return vec4$1.distance(this.array, b.array);
  },
  div: function(b) {
    vec4$1.div(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  divide: function(b) {
    vec4$1.divide(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  dot: function(b) {
    return vec4$1.dot(this.array, b.array);
  },
  len: function() {
    return vec4$1.len(this.array);
  },
  length: function() {
    return vec4$1.length(this.array);
  },
  lerp: function(a, b, t) {
    vec4$1.lerp(this.array, a.array, b.array, t);
    this._dirty = true;
    return this;
  },
  min: function(b) {
    vec4$1.min(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  max: function(b) {
    vec4$1.max(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  mul: function(b) {
    vec4$1.mul(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  multiply: function(b) {
    vec4$1.multiply(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  negate: function() {
    vec4$1.negate(this.array, this.array);
    this._dirty = true;
    return this;
  },
  normalize: function() {
    vec4$1.normalize(this.array, this.array);
    this._dirty = true;
    return this;
  },
  random: function(scale2) {
    vec4$1.random(this.array, scale2);
    this._dirty = true;
    return this;
  },
  scale: function(s) {
    vec4$1.scale(this.array, this.array, s);
    this._dirty = true;
    return this;
  },
  scaleAndAdd: function(b, s) {
    vec4$1.scaleAndAdd(this.array, this.array, b.array, s);
    this._dirty = true;
    return this;
  },
  sqrDist: function(b) {
    return vec4$1.sqrDist(this.array, b.array);
  },
  squaredDistance: function(b) {
    return vec4$1.squaredDistance(this.array, b.array);
  },
  sqrLen: function() {
    return vec4$1.sqrLen(this.array);
  },
  squaredLength: function() {
    return vec4$1.squaredLength(this.array);
  },
  sub: function(b) {
    vec4$1.sub(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  subtract: function(b) {
    vec4$1.subtract(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  transformMat4: function(m) {
    vec4$1.transformMat4(this.array, this.array, m.array);
    this._dirty = true;
    return this;
  },
  transformQuat: function(q) {
    vec4$1.transformQuat(this.array, this.array, q.array);
    this._dirty = true;
    return this;
  },
  toString: function() {
    return "[" + Array.prototype.join.call(this.array, ",") + "]";
  },
  toArray: function() {
    return Array.prototype.slice.call(this.array);
  }
};
var defineProperty = Object.defineProperty;
if (defineProperty) {
  var proto = Vector4.prototype;
  defineProperty(proto, "x", {
    get: function() {
      return this.array[0];
    },
    set: function(value) {
      this.array[0] = value;
      this._dirty = true;
    }
  });
  defineProperty(proto, "y", {
    get: function() {
      return this.array[1];
    },
    set: function(value) {
      this.array[1] = value;
      this._dirty = true;
    }
  });
  defineProperty(proto, "z", {
    get: function() {
      return this.array[2];
    },
    set: function(value) {
      this.array[2] = value;
      this._dirty = true;
    }
  });
  defineProperty(proto, "w", {
    get: function() {
      return this.array[3];
    },
    set: function(value) {
      this.array[3] = value;
      this._dirty = true;
    }
  });
}
Vector4.add = function(out, a, b) {
  vec4$1.add(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector4.set = function(out, x, y, z, w) {
  vec4$1.set(out.array, x, y, z, w);
  out._dirty = true;
};
Vector4.copy = function(out, b) {
  vec4$1.copy(out.array, b.array);
  out._dirty = true;
  return out;
};
Vector4.dist = function(a, b) {
  return vec4$1.distance(a.array, b.array);
};
Vector4.distance = Vector4.dist;
Vector4.div = function(out, a, b) {
  vec4$1.divide(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector4.divide = Vector4.div;
Vector4.dot = function(a, b) {
  return vec4$1.dot(a.array, b.array);
};
Vector4.len = function(b) {
  return vec4$1.length(b.array);
};
Vector4.lerp = function(out, a, b, t) {
  vec4$1.lerp(out.array, a.array, b.array, t);
  out._dirty = true;
  return out;
};
Vector4.min = function(out, a, b) {
  vec4$1.min(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector4.max = function(out, a, b) {
  vec4$1.max(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector4.mul = function(out, a, b) {
  vec4$1.multiply(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector4.multiply = Vector4.mul;
Vector4.negate = function(out, a) {
  vec4$1.negate(out.array, a.array);
  out._dirty = true;
  return out;
};
Vector4.normalize = function(out, a) {
  vec4$1.normalize(out.array, a.array);
  out._dirty = true;
  return out;
};
Vector4.random = function(out, scale2) {
  vec4$1.random(out.array, scale2);
  out._dirty = true;
  return out;
};
Vector4.scale = function(out, a, scale2) {
  vec4$1.scale(out.array, a.array, scale2);
  out._dirty = true;
  return out;
};
Vector4.scaleAndAdd = function(out, a, b, scale2) {
  vec4$1.scaleAndAdd(out.array, a.array, b.array, scale2);
  out._dirty = true;
  return out;
};
Vector4.sqrDist = function(a, b) {
  return vec4$1.sqrDist(a.array, b.array);
};
Vector4.squaredDistance = Vector4.sqrDist;
Vector4.sqrLen = function(a) {
  return vec4$1.sqrLen(a.array);
};
Vector4.squaredLength = Vector4.sqrLen;
Vector4.sub = function(out, a, b) {
  vec4$1.subtract(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Vector4.subtract = Vector4.sub;
Vector4.transformMat4 = function(out, a, m) {
  vec4$1.transformMat4(out.array, a.array, m.array);
  out._dirty = true;
  return out;
};
Vector4.transformQuat = function(out, a, q) {
  vec4$1.transformQuat(out.array, a.array, q.array);
  out._dirty = true;
  return out;
};
var Vector4$1 = Vector4;
var mat2 = {};
mat2.create = function() {
  var out = new GLMAT_ARRAY_TYPE(4);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
};
mat2.clone = function(a) {
  var out = new GLMAT_ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
};
mat2.copy = function(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
};
mat2.identity = function(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
};
mat2.transpose = function(out, a) {
  if (out === a) {
    var a1 = a[1];
    out[1] = a[2];
    out[2] = a1;
  } else {
    out[0] = a[0];
    out[1] = a[2];
    out[2] = a[1];
    out[3] = a[3];
  }
  return out;
};
mat2.invert = function(out, a) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], det = a0 * a3 - a2 * a1;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = a3 * det;
  out[1] = -a1 * det;
  out[2] = -a2 * det;
  out[3] = a0 * det;
  return out;
};
mat2.adjoint = function(out, a) {
  var a0 = a[0];
  out[0] = a[3];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a0;
  return out;
};
mat2.determinant = function(a) {
  return a[0] * a[3] - a[2] * a[1];
};
mat2.multiply = function(out, a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  return out;
};
mat2.mul = mat2.multiply;
mat2.rotate = function(out, a, rad2) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], s = Math.sin(rad2), c = Math.cos(rad2);
  out[0] = a0 * c + a2 * s;
  out[1] = a1 * c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  return out;
};
mat2.scale = function(out, a, v) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], v0 = v[0], v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  return out;
};
mat2.frob = function(a) {
  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2));
};
mat2.LDU = function(L, D, U, a) {
  L[2] = a[2] / a[0];
  U[0] = a[0];
  U[1] = a[1];
  U[3] = a[3] - L[2] * U[1];
  return [L, D, U];
};
var mat2$1 = mat2;
var Matrix2 = function() {
  this.array = mat2$1.create();
  this._dirty = true;
};
Matrix2.prototype = {
  constructor: Matrix2,
  setArray: function(arr) {
    for (var i = 0; i < this.array.length; i++) {
      this.array[i] = arr[i];
    }
    this._dirty = true;
    return this;
  },
  clone: function() {
    return new Matrix2().copy(this);
  },
  copy: function(b) {
    mat2$1.copy(this.array, b.array);
    this._dirty = true;
    return this;
  },
  adjoint: function() {
    mat2$1.adjoint(this.array, this.array);
    this._dirty = true;
    return this;
  },
  determinant: function() {
    return mat2$1.determinant(this.array);
  },
  identity: function() {
    mat2$1.identity(this.array);
    this._dirty = true;
    return this;
  },
  invert: function() {
    mat2$1.invert(this.array, this.array);
    this._dirty = true;
    return this;
  },
  mul: function(b) {
    mat2$1.mul(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  mulLeft: function(a) {
    mat2$1.mul(this.array, a.array, this.array);
    this._dirty = true;
    return this;
  },
  multiply: function(b) {
    mat2$1.multiply(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  multiplyLeft: function(a) {
    mat2$1.multiply(this.array, a.array, this.array);
    this._dirty = true;
    return this;
  },
  rotate: function(rad2) {
    mat2$1.rotate(this.array, this.array, rad2);
    this._dirty = true;
    return this;
  },
  scale: function(v) {
    mat2$1.scale(this.array, this.array, v.array);
    this._dirty = true;
    return this;
  },
  transpose: function() {
    mat2$1.transpose(this.array, this.array);
    this._dirty = true;
    return this;
  },
  toString: function() {
    return "[" + Array.prototype.join.call(this.array, ",") + "]";
  },
  toArray: function() {
    return Array.prototype.slice.call(this.array);
  }
};
Matrix2.adjoint = function(out, a) {
  mat2$1.adjoint(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix2.copy = function(out, a) {
  mat2$1.copy(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix2.determinant = function(a) {
  return mat2$1.determinant(a.array);
};
Matrix2.identity = function(out) {
  mat2$1.identity(out.array);
  out._dirty = true;
  return out;
};
Matrix2.invert = function(out, a) {
  mat2$1.invert(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix2.mul = function(out, a, b) {
  mat2$1.mul(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Matrix2.multiply = Matrix2.mul;
Matrix2.rotate = function(out, a, rad2) {
  mat2$1.rotate(out.array, a.array, rad2);
  out._dirty = true;
  return out;
};
Matrix2.scale = function(out, a, v) {
  mat2$1.scale(out.array, a.array, v.array);
  out._dirty = true;
  return out;
};
Matrix2.transpose = function(out, a) {
  mat2$1.transpose(out.array, a.array);
  out._dirty = true;
  return out;
};
var Matrix2$1 = Matrix2;
var mat2d = {};
mat2d.create = function() {
  var out = new GLMAT_ARRAY_TYPE(6);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
};
mat2d.clone = function(a) {
  var out = new GLMAT_ARRAY_TYPE(6);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
};
mat2d.copy = function(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
};
mat2d.identity = function(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
};
mat2d.invert = function(out, a) {
  var aa = a[0], ab = a[1], ac = a[2], ad = a[3], atx = a[4], aty = a[5];
  var det = aa * ad - ab * ac;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = ad * det;
  out[1] = -ab * det;
  out[2] = -ac * det;
  out[3] = aa * det;
  out[4] = (ac * aty - ad * atx) * det;
  out[5] = (ab * atx - aa * aty) * det;
  return out;
};
mat2d.determinant = function(a) {
  return a[0] * a[3] - a[1] * a[2];
};
mat2d.multiply = function(out, a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  out[4] = a0 * b4 + a2 * b5 + a4;
  out[5] = a1 * b4 + a3 * b5 + a5;
  return out;
};
mat2d.mul = mat2d.multiply;
mat2d.rotate = function(out, a, rad2) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], s = Math.sin(rad2), c = Math.cos(rad2);
  out[0] = a0 * c + a2 * s;
  out[1] = a1 * c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  out[4] = a4;
  out[5] = a5;
  return out;
};
mat2d.scale = function(out, a, v) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], v0 = v[0], v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  out[4] = a4;
  out[5] = a5;
  return out;
};
mat2d.translate = function(out, a, v) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], v0 = v[0], v1 = v[1];
  out[0] = a0;
  out[1] = a1;
  out[2] = a2;
  out[3] = a3;
  out[4] = a0 * v0 + a2 * v1 + a4;
  out[5] = a1 * v0 + a3 * v1 + a5;
  return out;
};
mat2d.frob = function(a) {
  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1);
};
var mat2d$1 = mat2d;
var Matrix2d = function() {
  this.array = mat2d$1.create();
  this._dirty = true;
};
Matrix2d.prototype = {
  constructor: Matrix2d,
  setArray: function(arr) {
    for (var i = 0; i < this.array.length; i++) {
      this.array[i] = arr[i];
    }
    this._dirty = true;
    return this;
  },
  clone: function() {
    return new Matrix2d().copy(this);
  },
  copy: function(b) {
    mat2d$1.copy(this.array, b.array);
    this._dirty = true;
    return this;
  },
  determinant: function() {
    return mat2d$1.determinant(this.array);
  },
  identity: function() {
    mat2d$1.identity(this.array);
    this._dirty = true;
    return this;
  },
  invert: function() {
    mat2d$1.invert(this.array, this.array);
    this._dirty = true;
    return this;
  },
  mul: function(b) {
    mat2d$1.mul(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  mulLeft: function(b) {
    mat2d$1.mul(this.array, b.array, this.array);
    this._dirty = true;
    return this;
  },
  multiply: function(b) {
    mat2d$1.multiply(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  multiplyLeft: function(b) {
    mat2d$1.multiply(this.array, b.array, this.array);
    this._dirty = true;
    return this;
  },
  rotate: function(rad2) {
    mat2d$1.rotate(this.array, this.array, rad2);
    this._dirty = true;
    return this;
  },
  scale: function(s) {
    mat2d$1.scale(this.array, this.array, s.array);
    this._dirty = true;
    return this;
  },
  translate: function(v) {
    mat2d$1.translate(this.array, this.array, v.array);
    this._dirty = true;
    return this;
  },
  toString: function() {
    return "[" + Array.prototype.join.call(this.array, ",") + "]";
  },
  toArray: function() {
    return Array.prototype.slice.call(this.array);
  }
};
Matrix2d.copy = function(out, a) {
  mat2d$1.copy(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix2d.determinant = function(a) {
  return mat2d$1.determinant(a.array);
};
Matrix2d.identity = function(out) {
  mat2d$1.identity(out.array);
  out._dirty = true;
  return out;
};
Matrix2d.invert = function(out, a) {
  mat2d$1.invert(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix2d.mul = function(out, a, b) {
  mat2d$1.mul(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Matrix2d.multiply = Matrix2d.mul;
Matrix2d.rotate = function(out, a, rad2) {
  mat2d$1.rotate(out.array, a.array, rad2);
  out._dirty = true;
  return out;
};
Matrix2d.scale = function(out, a, v) {
  mat2d$1.scale(out.array, a.array, v.array);
  out._dirty = true;
  return out;
};
Matrix2d.translate = function(out, a, v) {
  mat2d$1.translate(out.array, a.array, v.array);
  out._dirty = true;
  return out;
};
var Matrix2d$1 = Matrix2d;
var Matrix3 = function() {
  this.array = mat3$1.create();
  this._dirty = true;
};
Matrix3.prototype = {
  constructor: Matrix3,
  setArray: function(arr) {
    for (var i = 0; i < this.array.length; i++) {
      this.array[i] = arr[i];
    }
    this._dirty = true;
    return this;
  },
  adjoint: function() {
    mat3$1.adjoint(this.array, this.array);
    this._dirty = true;
    return this;
  },
  clone: function() {
    return new Matrix3().copy(this);
  },
  copy: function(b) {
    mat3$1.copy(this.array, b.array);
    this._dirty = true;
    return this;
  },
  determinant: function() {
    return mat3$1.determinant(this.array);
  },
  fromMat2d: function(a) {
    mat3$1.fromMat2d(this.array, a.array);
    this._dirty = true;
    return this;
  },
  fromMat4: function(a) {
    mat3$1.fromMat4(this.array, a.array);
    this._dirty = true;
    return this;
  },
  fromQuat: function(q) {
    mat3$1.fromQuat(this.array, q.array);
    this._dirty = true;
    return this;
  },
  identity: function() {
    mat3$1.identity(this.array);
    this._dirty = true;
    return this;
  },
  invert: function() {
    mat3$1.invert(this.array, this.array);
    this._dirty = true;
    return this;
  },
  mul: function(b) {
    mat3$1.mul(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  mulLeft: function(a) {
    mat3$1.mul(this.array, a.array, this.array);
    this._dirty = true;
    return this;
  },
  multiply: function(b) {
    mat3$1.multiply(this.array, this.array, b.array);
    this._dirty = true;
    return this;
  },
  multiplyLeft: function(a) {
    mat3$1.multiply(this.array, a.array, this.array);
    this._dirty = true;
    return this;
  },
  rotate: function(rad2) {
    mat3$1.rotate(this.array, this.array, rad2);
    this._dirty = true;
    return this;
  },
  scale: function(v) {
    mat3$1.scale(this.array, this.array, v.array);
    this._dirty = true;
    return this;
  },
  translate: function(v) {
    mat3$1.translate(this.array, this.array, v.array);
    this._dirty = true;
    return this;
  },
  normalFromMat4: function(a) {
    mat3$1.normalFromMat4(this.array, a.array);
    this._dirty = true;
    return this;
  },
  transpose: function() {
    mat3$1.transpose(this.array, this.array);
    this._dirty = true;
    return this;
  },
  toString: function() {
    return "[" + Array.prototype.join.call(this.array, ",") + "]";
  },
  toArray: function() {
    return Array.prototype.slice.call(this.array);
  }
};
Matrix3.adjoint = function(out, a) {
  mat3$1.adjoint(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix3.copy = function(out, a) {
  mat3$1.copy(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix3.determinant = function(a) {
  return mat3$1.determinant(a.array);
};
Matrix3.identity = function(out) {
  mat3$1.identity(out.array);
  out._dirty = true;
  return out;
};
Matrix3.invert = function(out, a) {
  mat3$1.invert(out.array, a.array);
  return out;
};
Matrix3.mul = function(out, a, b) {
  mat3$1.mul(out.array, a.array, b.array);
  out._dirty = true;
  return out;
};
Matrix3.multiply = Matrix3.mul;
Matrix3.fromMat2d = function(out, a) {
  mat3$1.fromMat2d(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix3.fromMat4 = function(out, a) {
  mat3$1.fromMat4(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix3.fromQuat = function(out, q) {
  mat3$1.fromQuat(out.array, q.array);
  out._dirty = true;
  return out;
};
Matrix3.normalFromMat4 = function(out, a) {
  mat3$1.normalFromMat4(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix3.rotate = function(out, a, rad2) {
  mat3$1.rotate(out.array, a.array, rad2);
  out._dirty = true;
  return out;
};
Matrix3.scale = function(out, a, v) {
  mat3$1.scale(out.array, a.array, v.array);
  out._dirty = true;
  return out;
};
Matrix3.transpose = function(out, a) {
  mat3$1.transpose(out.array, a.array);
  out._dirty = true;
  return out;
};
Matrix3.translate = function(out, a, v) {
  mat3$1.translate(out.array, a.array, v.array);
  out._dirty = true;
  return out;
};
var Matrix3$1 = Matrix3;
var animatableMixin = {
  _animators: null,
  getAnimators: function() {
    this._animators = this._animators || [];
    return this._animators;
  },
  animate: function(path, opts) {
    this._animators = this._animators || [];
    var el = this;
    var target;
    if (path) {
      var pathSplitted = path.split(".");
      var prop = el;
      for (var i = 0, l = pathSplitted.length; i < l; i++) {
        if (!prop) {
          continue;
        }
        prop = prop[pathSplitted[i]];
      }
      if (prop) {
        target = prop;
      }
    } else {
      target = el;
    }
    if (target == null) {
      throw new Error("Target " + path + " not exists");
    }
    var animators = this._animators;
    var animator = new Animator(target, opts);
    var self = this;
    animator.during(function() {
      if (self.__zr) {
        self.__zr.refresh();
      }
    }).done(function() {
      var idx = animators.indexOf(animator);
      if (idx >= 0) {
        animators.splice(idx, 1);
      }
    });
    animators.push(animator);
    if (this.__zr) {
      this.__zr.animation.addAnimator(animator);
    }
    return animator;
  },
  stopAnimation: function(forwardToLast) {
    this._animators = this._animators || [];
    var animators = this._animators;
    var len = animators.length;
    for (var i = 0; i < len; i++) {
      animators[i].stop(forwardToLast);
    }
    animators.length = 0;
    return this;
  },
  addAnimatorsToZr: function(zr) {
    if (this._animators) {
      for (var i = 0; i < this._animators.length; i++) {
        zr.animation.addAnimator(this._animators[i]);
      }
    }
  },
  removeAnimatorsFromZr: function(zr) {
    if (this._animators) {
      for (var i = 0; i < this._animators.length; i++) {
        zr.animation.removeAnimator(this._animators[i]);
      }
    }
  }
};
var animatableMixin$1 = animatableMixin;
var utilShaderCode = "\n@export clay.util.rand\nhighp float rand(vec2 uv) {\n const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n highp float dt = dot(uv.xy, vec2(a,b)), sn = mod(dt, 3.141592653589793);\n return fract(sin(sn) * c);\n}\n@end\n@export clay.util.calculate_attenuation\nuniform float attenuationFactor : 5.0;\nfloat lightAttenuation(float dist, float range)\n{\n float attenuation = 1.0;\n attenuation = dist*dist/(range*range+1.0);\n float att_s = attenuationFactor;\n attenuation = 1.0/(attenuation*att_s+1.0);\n att_s = 1.0/(att_s+1.0);\n attenuation = attenuation - att_s;\n attenuation /= 1.0 - att_s;\n return clamp(attenuation, 0.0, 1.0);\n}\n@end\n@export clay.util.edge_factor\n#ifdef SUPPORT_STANDARD_DERIVATIVES\nfloat edgeFactor(float width)\n{\n vec3 d = fwidth(v_Barycentric);\n vec3 a3 = smoothstep(vec3(0.0), d * width, v_Barycentric);\n return min(min(a3.x, a3.y), a3.z);\n}\n#else\nfloat edgeFactor(float width)\n{\n return 1.0;\n}\n#endif\n@end\n@export clay.util.encode_float\nvec4 encodeFloat(const in float depth)\n{\n const vec4 bitShifts = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);\n const vec4 bit_mask = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);\n vec4 res = fract(depth * bitShifts);\n res -= res.xxyz * bit_mask;\n return res;\n}\n@end\n@export clay.util.decode_float\nfloat decodeFloat(const in vec4 color)\n{\n const vec4 bitShifts = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);\n return dot(color, bitShifts);\n}\n@end\n@export clay.util.float\n@import clay.util.encode_float\n@import clay.util.decode_float\n@end\n@export clay.util.rgbm_decode\nvec3 RGBMDecode(vec4 rgbm, float range) {\n return range * rgbm.rgb * rgbm.a;\n}\n@end\n@export clay.util.rgbm_encode\nvec4 RGBMEncode(vec3 color, float range) {\n if (dot(color, color) == 0.0) {\n return vec4(0.0);\n }\n vec4 rgbm;\n color /= range;\n rgbm.a = clamp(max(max(color.r, color.g), max(color.b, 1e-6)), 0.0, 1.0);\n rgbm.a = ceil(rgbm.a * 255.0) / 255.0;\n rgbm.rgb = color / rgbm.a;\n return rgbm;\n}\n@end\n@export clay.util.rgbm\n@import clay.util.rgbm_decode\n@import clay.util.rgbm_encode\nvec4 decodeHDR(vec4 color)\n{\n#if defined(RGBM_DECODE) || defined(RGBM)\n return vec4(RGBMDecode(color, 8.12), 1.0);\n#else\n return color;\n#endif\n}\nvec4 encodeHDR(vec4 color)\n{\n#if defined(RGBM_ENCODE) || defined(RGBM)\n return RGBMEncode(color.xyz, 8.12);\n#else\n return color;\n#endif\n}\n@end\n@export clay.util.srgb\nvec4 sRGBToLinear(in vec4 value) {\n return vec4(mix(pow(value.rgb * 0.9478672986 + vec3(0.0521327014), vec3(2.4)), value.rgb * 0.0773993808, vec3(lessThanEqual(value.rgb, vec3(0.04045)))), value.w);\n}\nvec4 linearTosRGB(in vec4 value) {\n return vec4(mix(pow(value.rgb, vec3(0.41666)) * 1.055 - vec3(0.055), value.rgb * 12.92, vec3(lessThanEqual(value.rgb, vec3(0.0031308)))), value.w);\n}\n@end\n@export clay.chunk.skinning_header\n#ifdef SKINNING\nattribute vec3 weight : WEIGHT;\nattribute vec4 joint : JOINT;\n#ifdef USE_SKIN_MATRICES_TEXTURE\nuniform sampler2D skinMatricesTexture : ignore;\nuniform float skinMatricesTextureSize: ignore;\nmat4 getSkinMatrix(sampler2D tex, float idx) {\n float j = idx * 4.0;\n float x = mod(j, skinMatricesTextureSize);\n float y = floor(j / skinMatricesTextureSize) + 0.5;\n vec2 scale = vec2(skinMatricesTextureSize);\n return mat4(\n texture2D(tex, vec2(x + 0.5, y) / scale),\n texture2D(tex, vec2(x + 1.5, y) / scale),\n texture2D(tex, vec2(x + 2.5, y) / scale),\n texture2D(tex, vec2(x + 3.5, y) / scale)\n );\n}\nmat4 getSkinMatrix(float idx) {\n return getSkinMatrix(skinMatricesTexture, idx);\n}\n#else\nuniform mat4 skinMatrix[JOINT_COUNT] : SKIN_MATRIX;\nmat4 getSkinMatrix(float idx) {\n return skinMatrix[int(idx)];\n}\n#endif\n#endif\n@end\n@export clay.chunk.skin_matrix\nmat4 skinMatrixWS = getSkinMatrix(joint.x) * weight.x;\nif (weight.y > 1e-4)\n{\n skinMatrixWS += getSkinMatrix(joint.y) * weight.y;\n}\nif (weight.z > 1e-4)\n{\n skinMatrixWS += getSkinMatrix(joint.z) * weight.z;\n}\nfloat weightW = 1.0-weight.x-weight.y-weight.z;\nif (weightW > 1e-4)\n{\n skinMatrixWS += getSkinMatrix(joint.w) * weightW;\n}\n@end\n@export clay.chunk.instancing_header\n#ifdef INSTANCING\nattribute vec4 instanceMat1;\nattribute vec4 instanceMat2;\nattribute vec4 instanceMat3;\n#endif\n@end\n@export clay.chunk.instancing_matrix\nmat4 instanceMat = mat4(\n vec4(instanceMat1.xyz, 0.0),\n vec4(instanceMat2.xyz, 0.0),\n vec4(instanceMat3.xyz, 0.0),\n vec4(instanceMat1.w, instanceMat2.w, instanceMat3.w, 1.0)\n);\n@end\n@export clay.util.parallax_correct\nvec3 parallaxCorrect(in vec3 dir, in vec3 pos, in vec3 boxMin, in vec3 boxMax) {\n vec3 first = (boxMax - pos) / dir;\n vec3 second = (boxMin - pos) / dir;\n vec3 further = max(first, second);\n float dist = min(further.x, min(further.y, further.z));\n vec3 fixedPos = pos + dir * dist;\n vec3 boxCenter = (boxMax + boxMin) * 0.5;\n return normalize(fixedPos - boxCenter);\n}\n@end\n@export clay.util.clamp_sample\nvec4 clampSample(const in sampler2D texture, const in vec2 coord)\n{\n#ifdef STEREO\n float eye = step(0.5, coord.x) * 0.5;\n vec2 coordClamped = clamp(coord, vec2(eye, 0.0), vec2(0.5 + eye, 1.0));\n#else\n vec2 coordClamped = clamp(coord, vec2(0.0), vec2(1.0));\n#endif\n return texture2D(texture, coordClamped);\n}\n@end\n@export clay.util.ACES\nvec3 ACESToneMapping(vec3 color)\n{\n const float A = 2.51;\n const float B = 0.03;\n const float C = 2.43;\n const float D = 0.59;\n const float E = 0.14;\n return (color * (A * color + B)) / (color * (C * color + D) + E);\n}\n@end";
var commonGLSL = "\n@export ecgl.common.transformUniforms\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\nuniform mat4 worldInverseTranspose : WORLDINVERSETRANSPOSE;\nuniform mat4 world : WORLD;\n@end\n\n@export ecgl.common.attributes\nattribute vec3 position : POSITION;\nattribute vec2 texcoord : TEXCOORD_0;\nattribute vec3 normal : NORMAL;\n@end\n\n@export ecgl.common.uv.header\nuniform vec2 uvRepeat : [1.0, 1.0];\nuniform vec2 uvOffset : [0.0, 0.0];\nuniform vec2 detailUvRepeat : [1.0, 1.0];\nuniform vec2 detailUvOffset : [0.0, 0.0];\n\nvarying vec2 v_Texcoord;\nvarying vec2 v_DetailTexcoord;\n@end\n\n@export ecgl.common.uv.main\nv_Texcoord = texcoord * uvRepeat + uvOffset;\nv_DetailTexcoord = texcoord * detailUvRepeat + detailUvOffset;\n@end\n\n@export ecgl.common.uv.fragmentHeader\nvarying vec2 v_Texcoord;\nvarying vec2 v_DetailTexcoord;\n@end\n\n\n@export ecgl.common.albedo.main\n\n vec4 albedoTexel = vec4(1.0);\n#ifdef DIFFUSEMAP_ENABLED\n albedoTexel = texture2D(diffuseMap, v_Texcoord);\n #ifdef SRGB_DECODE\n albedoTexel = sRGBToLinear(albedoTexel);\n #endif\n#endif\n\n#ifdef DETAILMAP_ENABLED\n vec4 detailTexel = texture2D(detailMap, v_DetailTexcoord);\n #ifdef SRGB_DECODE\n detailTexel = sRGBToLinear(detailTexel);\n #endif\n albedoTexel.rgb = mix(albedoTexel.rgb, detailTexel.rgb, detailTexel.a);\n albedoTexel.a = detailTexel.a + (1.0 - detailTexel.a) * albedoTexel.a;\n#endif\n\n@end\n\n@export ecgl.common.wireframe.vertexHeader\n\n#ifdef WIREFRAME_QUAD\nattribute vec4 barycentric;\nvarying vec4 v_Barycentric;\n#elif defined(WIREFRAME_TRIANGLE)\nattribute vec3 barycentric;\nvarying vec3 v_Barycentric;\n#endif\n\n@end\n\n@export ecgl.common.wireframe.vertexMain\n\n#if defined(WIREFRAME_QUAD) || defined(WIREFRAME_TRIANGLE)\n v_Barycentric = barycentric;\n#endif\n\n@end\n\n\n@export ecgl.common.wireframe.fragmentHeader\n\nuniform float wireframeLineWidth : 1;\nuniform vec4 wireframeLineColor: [0, 0, 0, 0.5];\n\n#ifdef WIREFRAME_QUAD\nvarying vec4 v_Barycentric;\nfloat edgeFactor () {\n vec4 d = fwidth(v_Barycentric);\n vec4 a4 = smoothstep(vec4(0.0), d * wireframeLineWidth, v_Barycentric);\n return min(min(min(a4.x, a4.y), a4.z), a4.w);\n}\n#elif defined(WIREFRAME_TRIANGLE)\nvarying vec3 v_Barycentric;\nfloat edgeFactor () {\n vec3 d = fwidth(v_Barycentric);\n vec3 a3 = smoothstep(vec3(0.0), d * wireframeLineWidth, v_Barycentric);\n return min(min(a3.x, a3.y), a3.z);\n}\n#endif\n\n@end\n\n\n@export ecgl.common.wireframe.fragmentMain\n\n#if defined(WIREFRAME_QUAD) || defined(WIREFRAME_TRIANGLE)\n if (wireframeLineWidth > 0.) {\n vec4 lineColor = wireframeLineColor;\n#ifdef SRGB_DECODE\n lineColor = sRGBToLinear(lineColor);\n#endif\n\n gl_FragColor.rgb = mix(gl_FragColor.rgb, lineColor.rgb, (1.0 - edgeFactor()) * lineColor.a);\n }\n#endif\n@end\n\n\n\n\n@export ecgl.common.bumpMap.header\n\n#ifdef BUMPMAP_ENABLED\nuniform sampler2D bumpMap;\nuniform float bumpScale : 1.0;\n\n\nvec3 bumpNormal(vec3 surfPos, vec3 surfNormal, vec3 baseNormal)\n{\n vec2 dSTdx = dFdx(v_Texcoord);\n vec2 dSTdy = dFdy(v_Texcoord);\n\n float Hll = bumpScale * texture2D(bumpMap, v_Texcoord).x;\n float dHx = bumpScale * texture2D(bumpMap, v_Texcoord + dSTdx).x - Hll;\n float dHy = bumpScale * texture2D(bumpMap, v_Texcoord + dSTdy).x - Hll;\n\n vec3 vSigmaX = dFdx(surfPos);\n vec3 vSigmaY = dFdy(surfPos);\n vec3 vN = surfNormal;\n\n vec3 R1 = cross(vSigmaY, vN);\n vec3 R2 = cross(vN, vSigmaX);\n\n float fDet = dot(vSigmaX, R1);\n\n vec3 vGrad = sign(fDet) * (dHx * R1 + dHy * R2);\n return normalize(abs(fDet) * baseNormal - vGrad);\n\n}\n#endif\n\n@end\n\n@export ecgl.common.normalMap.vertexHeader\n\n#ifdef NORMALMAP_ENABLED\nattribute vec4 tangent : TANGENT;\nvarying vec3 v_Tangent;\nvarying vec3 v_Bitangent;\n#endif\n\n@end\n\n@export ecgl.common.normalMap.vertexMain\n\n#ifdef NORMALMAP_ENABLED\n if (dot(tangent, tangent) > 0.0) {\n v_Tangent = normalize((worldInverseTranspose * vec4(tangent.xyz, 0.0)).xyz);\n v_Bitangent = normalize(cross(v_Normal, v_Tangent) * tangent.w);\n }\n#endif\n\n@end\n\n\n@export ecgl.common.normalMap.fragmentHeader\n\n#ifdef NORMALMAP_ENABLED\nuniform sampler2D normalMap;\nvarying vec3 v_Tangent;\nvarying vec3 v_Bitangent;\n#endif\n\n@end\n\n@export ecgl.common.normalMap.fragmentMain\n#ifdef NORMALMAP_ENABLED\n if (dot(v_Tangent, v_Tangent) > 0.0) {\n vec3 normalTexel = texture2D(normalMap, v_DetailTexcoord).xyz;\n if (dot(normalTexel, normalTexel) > 0.0) { N = normalTexel * 2.0 - 1.0;\n mat3 tbn = mat3(v_Tangent, v_Bitangent, v_Normal);\n N = normalize(tbn * N);\n }\n }\n#endif\n@end\n\n\n\n@export ecgl.common.vertexAnimation.header\n\n#ifdef VERTEX_ANIMATION\nattribute vec3 prevPosition;\nattribute vec3 prevNormal;\nuniform float percent;\n#endif\n\n@end\n\n@export ecgl.common.vertexAnimation.main\n\n#ifdef VERTEX_ANIMATION\n vec3 pos = mix(prevPosition, position, percent);\n vec3 norm = mix(prevNormal, normal, percent);\n#else\n vec3 pos = position;\n vec3 norm = normal;\n#endif\n\n@end\n\n\n@export ecgl.common.ssaoMap.header\n#ifdef SSAOMAP_ENABLED\nuniform sampler2D ssaoMap;\nuniform vec4 viewport : VIEWPORT;\n#endif\n@end\n\n@export ecgl.common.ssaoMap.main\n float ao = 1.0;\n#ifdef SSAOMAP_ENABLED\n ao = texture2D(ssaoMap, (gl_FragCoord.xy - viewport.xy) / viewport.zw).r;\n#endif\n@end\n\n\n\n\n@export ecgl.common.diffuseLayer.header\n\n#if (LAYER_DIFFUSEMAP_COUNT > 0)\nuniform float layerDiffuseIntensity[LAYER_DIFFUSEMAP_COUNT];\nuniform sampler2D layerDiffuseMap[LAYER_DIFFUSEMAP_COUNT];\n#endif\n\n@end\n\n@export ecgl.common.emissiveLayer.header\n\n#if (LAYER_EMISSIVEMAP_COUNT > 0)\nuniform float layerEmissionIntensity[LAYER_EMISSIVEMAP_COUNT];\nuniform sampler2D layerEmissiveMap[LAYER_EMISSIVEMAP_COUNT];\n#endif\n\n@end\n\n@export ecgl.common.layers.header\n@import ecgl.common.diffuseLayer.header\n@import ecgl.common.emissiveLayer.header\n@end\n\n@export ecgl.common.diffuseLayer.main\n\n#if (LAYER_DIFFUSEMAP_COUNT > 0)\n for (int _idx_ = 0; _idx_ < LAYER_DIFFUSEMAP_COUNT; _idx_++) {{\n float intensity = layerDiffuseIntensity[_idx_];\n vec4 texel2 = texture2D(layerDiffuseMap[_idx_], v_Texcoord);\n #ifdef SRGB_DECODE\n texel2 = sRGBToLinear(texel2);\n #endif\n albedoTexel.rgb = mix(albedoTexel.rgb, texel2.rgb * intensity, texel2.a);\n albedoTexel.a = texel2.a + (1.0 - texel2.a) * albedoTexel.a;\n }}\n#endif\n\n@end\n\n@export ecgl.common.emissiveLayer.main\n\n#if (LAYER_EMISSIVEMAP_COUNT > 0)\n for (int _idx_ = 0; _idx_ < LAYER_EMISSIVEMAP_COUNT; _idx_++)\n {{\n vec4 texel2 = texture2D(layerEmissiveMap[_idx_], v_Texcoord) * layerEmissionIntensity[_idx_];\n #ifdef SRGB_DECODE\n texel2 = sRGBToLinear(texel2);\n #endif\n float intensity = layerEmissionIntensity[_idx_];\n gl_FragColor.rgb += texel2.rgb * texel2.a * intensity;\n }}\n#endif\n\n@end\n";
var colorGLSL = "@export ecgl.color.vertex\n\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\n\n@import ecgl.common.uv.header\n\nattribute vec2 texcoord : TEXCOORD_0;\nattribute vec3 position: POSITION;\n\n@import ecgl.common.wireframe.vertexHeader\n\n#ifdef VERTEX_COLOR\nattribute vec4 a_Color : COLOR;\nvarying vec4 v_Color;\n#endif\n\n#ifdef VERTEX_ANIMATION\nattribute vec3 prevPosition;\nuniform float percent : 1.0;\n#endif\n\n#ifdef ATMOSPHERE_ENABLED\nattribute vec3 normal: NORMAL;\nuniform mat4 worldInverseTranspose : WORLDINVERSETRANSPOSE;\nvarying vec3 v_Normal;\n#endif\n\nvoid main()\n{\n#ifdef VERTEX_ANIMATION\n vec3 pos = mix(prevPosition, position, percent);\n#else\n vec3 pos = position;\n#endif\n\n gl_Position = worldViewProjection * vec4(pos, 1.0);\n\n @import ecgl.common.uv.main\n\n#ifdef VERTEX_COLOR\n v_Color = a_Color;\n#endif\n\n#ifdef ATMOSPHERE_ENABLED\n v_Normal = normalize((worldInverseTranspose * vec4(normal, 0.0)).xyz);\n#endif\n\n @import ecgl.common.wireframe.vertexMain\n\n}\n\n@end\n\n@export ecgl.color.fragment\n\n#define LAYER_DIFFUSEMAP_COUNT 0\n#define LAYER_EMISSIVEMAP_COUNT 0\n\nuniform sampler2D diffuseMap;\nuniform sampler2D detailMap;\n\nuniform vec4 color : [1.0, 1.0, 1.0, 1.0];\n\n#ifdef ATMOSPHERE_ENABLED\nuniform mat4 viewTranspose: VIEWTRANSPOSE;\nuniform vec3 glowColor;\nuniform float glowPower;\nvarying vec3 v_Normal;\n#endif\n\n#ifdef VERTEX_COLOR\nvarying vec4 v_Color;\n#endif\n\n@import ecgl.common.layers.header\n\n@import ecgl.common.uv.fragmentHeader\n\n@import ecgl.common.wireframe.fragmentHeader\n\n@import clay.util.srgb\n\nvoid main()\n{\n#ifdef SRGB_DECODE\n gl_FragColor = sRGBToLinear(color);\n#else\n gl_FragColor = color;\n#endif\n\n#ifdef VERTEX_COLOR\n gl_FragColor *= v_Color;\n#endif\n\n @import ecgl.common.albedo.main\n\n @import ecgl.common.diffuseLayer.main\n\n gl_FragColor *= albedoTexel;\n\n#ifdef ATMOSPHERE_ENABLED\n float atmoIntensity = pow(1.0 - dot(v_Normal, (viewTranspose * vec4(0.0, 0.0, 1.0, 0.0)).xyz), glowPower);\n gl_FragColor.rgb += glowColor * atmoIntensity;\n#endif\n\n @import ecgl.common.emissiveLayer.main\n\n @import ecgl.common.wireframe.fragmentMain\n\n}\n@end";
var lambertGLSL = "/**\n * http: */\n\n@export ecgl.lambert.vertex\n\n@import ecgl.common.transformUniforms\n\n@import ecgl.common.uv.header\n\n\n@import ecgl.common.attributes\n\n@import ecgl.common.wireframe.vertexHeader\n\n#ifdef VERTEX_COLOR\nattribute vec4 a_Color : COLOR;\nvarying vec4 v_Color;\n#endif\n\n\n@import ecgl.common.vertexAnimation.header\n\n\nvarying vec3 v_Normal;\nvarying vec3 v_WorldPosition;\n\nvoid main()\n{\n @import ecgl.common.uv.main\n\n @import ecgl.common.vertexAnimation.main\n\n\n gl_Position = worldViewProjection * vec4(pos, 1.0);\n\n v_Normal = normalize((worldInverseTranspose * vec4(norm, 0.0)).xyz);\n v_WorldPosition = (world * vec4(pos, 1.0)).xyz;\n\n#ifdef VERTEX_COLOR\n v_Color = a_Color;\n#endif\n\n @import ecgl.common.wireframe.vertexMain\n}\n\n@end\n\n\n@export ecgl.lambert.fragment\n\n#define LAYER_DIFFUSEMAP_COUNT 0\n#define LAYER_EMISSIVEMAP_COUNT 0\n\n#define NORMAL_UP_AXIS 1\n#define NORMAL_FRONT_AXIS 2\n\n@import ecgl.common.uv.fragmentHeader\n\nvarying vec3 v_Normal;\nvarying vec3 v_WorldPosition;\n\nuniform sampler2D diffuseMap;\nuniform sampler2D detailMap;\n\n@import ecgl.common.layers.header\n\nuniform float emissionIntensity: 1.0;\n\nuniform vec4 color : [1.0, 1.0, 1.0, 1.0];\n\nuniform mat4 viewInverse : VIEWINVERSE;\n\n#ifdef ATMOSPHERE_ENABLED\nuniform mat4 viewTranspose: VIEWTRANSPOSE;\nuniform vec3 glowColor;\nuniform float glowPower;\n#endif\n\n#ifdef AMBIENT_LIGHT_COUNT\n@import clay.header.ambient_light\n#endif\n#ifdef AMBIENT_SH_LIGHT_COUNT\n@import clay.header.ambient_sh_light\n#endif\n\n#ifdef DIRECTIONAL_LIGHT_COUNT\n@import clay.header.directional_light\n#endif\n\n#ifdef VERTEX_COLOR\nvarying vec4 v_Color;\n#endif\n\n\n@import ecgl.common.ssaoMap.header\n\n@import ecgl.common.bumpMap.header\n\n@import clay.util.srgb\n\n@import ecgl.common.wireframe.fragmentHeader\n\n@import clay.plugin.compute_shadow_map\n\nvoid main()\n{\n#ifdef SRGB_DECODE\n gl_FragColor = sRGBToLinear(color);\n#else\n gl_FragColor = color;\n#endif\n\n#ifdef VERTEX_COLOR\n #ifdef SRGB_DECODE\n gl_FragColor *= sRGBToLinear(v_Color);\n #else\n gl_FragColor *= v_Color;\n #endif\n#endif\n\n @import ecgl.common.albedo.main\n\n @import ecgl.common.diffuseLayer.main\n\n gl_FragColor *= albedoTexel;\n\n vec3 N = v_Normal;\n#ifdef DOUBLE_SIDED\n vec3 eyePos = viewInverse[3].xyz;\n vec3 V = normalize(eyePos - v_WorldPosition);\n\n if (dot(N, V) < 0.0) {\n N = -N;\n }\n#endif\n\n float ambientFactor = 1.0;\n\n#ifdef BUMPMAP_ENABLED\n N = bumpNormal(v_WorldPosition, v_Normal, N);\n ambientFactor = dot(v_Normal, N);\n#endif\n\n vec3 N2 = vec3(N.x, N[NORMAL_UP_AXIS], N[NORMAL_FRONT_AXIS]);\n\n vec3 diffuseColor = vec3(0.0, 0.0, 0.0);\n\n @import ecgl.common.ssaoMap.main\n\n#ifdef AMBIENT_LIGHT_COUNT\n for(int i = 0; i < AMBIENT_LIGHT_COUNT; i++)\n {\n diffuseColor += ambientLightColor[i] * ambientFactor * ao;\n }\n#endif\n#ifdef AMBIENT_SH_LIGHT_COUNT\n for(int _idx_ = 0; _idx_ < AMBIENT_SH_LIGHT_COUNT; _idx_++)\n {{\n diffuseColor += calcAmbientSHLight(_idx_, N2) * ambientSHLightColor[_idx_] * ao;\n }}\n#endif\n#ifdef DIRECTIONAL_LIGHT_COUNT\n#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)\n float shadowContribsDir[DIRECTIONAL_LIGHT_COUNT];\n if(shadowEnabled)\n {\n computeShadowOfDirectionalLights(v_WorldPosition, shadowContribsDir);\n }\n#endif\n for(int i = 0; i < DIRECTIONAL_LIGHT_COUNT; i++)\n {\n vec3 lightDirection = -directionalLightDirection[i];\n vec3 lightColor = directionalLightColor[i];\n\n float shadowContrib = 1.0;\n#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)\n if (shadowEnabled)\n {\n shadowContrib = shadowContribsDir[i];\n }\n#endif\n\n float ndl = dot(N, normalize(lightDirection)) * shadowContrib;\n\n diffuseColor += lightColor * clamp(ndl, 0.0, 1.0);\n }\n#endif\n\n gl_FragColor.rgb *= diffuseColor;\n\n#ifdef ATMOSPHERE_ENABLED\n float atmoIntensity = pow(1.0 - dot(v_Normal, (viewTranspose * vec4(0.0, 0.0, 1.0, 0.0)).xyz), glowPower);\n gl_FragColor.rgb += glowColor * atmoIntensity;\n#endif\n\n @import ecgl.common.emissiveLayer.main\n\n @import ecgl.common.wireframe.fragmentMain\n}\n\n@end";
var realisticGLSL = "@export ecgl.realistic.vertex\n\n@import ecgl.common.transformUniforms\n\n@import ecgl.common.uv.header\n\n@import ecgl.common.attributes\n\n\n@import ecgl.common.wireframe.vertexHeader\n\n#ifdef VERTEX_COLOR\nattribute vec4 a_Color : COLOR;\nvarying vec4 v_Color;\n#endif\n\n#ifdef NORMALMAP_ENABLED\nattribute vec4 tangent : TANGENT;\nvarying vec3 v_Tangent;\nvarying vec3 v_Bitangent;\n#endif\n\n@import ecgl.common.vertexAnimation.header\n\nvarying vec3 v_Normal;\nvarying vec3 v_WorldPosition;\n\nvoid main()\n{\n\n @import ecgl.common.uv.main\n\n @import ecgl.common.vertexAnimation.main\n\n gl_Position = worldViewProjection * vec4(pos, 1.0);\n\n v_Normal = normalize((worldInverseTranspose * vec4(norm, 0.0)).xyz);\n v_WorldPosition = (world * vec4(pos, 1.0)).xyz;\n\n#ifdef VERTEX_COLOR\n v_Color = a_Color;\n#endif\n\n#ifdef NORMALMAP_ENABLED\n v_Tangent = normalize((worldInverseTranspose * vec4(tangent.xyz, 0.0)).xyz);\n v_Bitangent = normalize(cross(v_Normal, v_Tangent) * tangent.w);\n#endif\n\n @import ecgl.common.wireframe.vertexMain\n\n}\n\n@end\n\n\n\n@export ecgl.realistic.fragment\n\n#define LAYER_DIFFUSEMAP_COUNT 0\n#define LAYER_EMISSIVEMAP_COUNT 0\n#define PI 3.14159265358979\n#define ROUGHNESS_CHANEL 0\n#define METALNESS_CHANEL 1\n\n#define NORMAL_UP_AXIS 1\n#define NORMAL_FRONT_AXIS 2\n\n#ifdef VERTEX_COLOR\nvarying vec4 v_Color;\n#endif\n\n@import ecgl.common.uv.fragmentHeader\n\nvarying vec3 v_Normal;\nvarying vec3 v_WorldPosition;\n\nuniform sampler2D diffuseMap;\n\nuniform sampler2D detailMap;\nuniform sampler2D metalnessMap;\nuniform sampler2D roughnessMap;\n\n@import ecgl.common.layers.header\n\nuniform float emissionIntensity: 1.0;\n\nuniform vec4 color : [1.0, 1.0, 1.0, 1.0];\n\nuniform float metalness : 0.0;\nuniform float roughness : 0.5;\n\nuniform mat4 viewInverse : VIEWINVERSE;\n\n#ifdef ATMOSPHERE_ENABLED\nuniform mat4 viewTranspose: VIEWTRANSPOSE;\nuniform vec3 glowColor;\nuniform float glowPower;\n#endif\n\n#ifdef AMBIENT_LIGHT_COUNT\n@import clay.header.ambient_light\n#endif\n\n#ifdef AMBIENT_SH_LIGHT_COUNT\n@import clay.header.ambient_sh_light\n#endif\n\n#ifdef AMBIENT_CUBEMAP_LIGHT_COUNT\n@import clay.header.ambient_cubemap_light\n#endif\n\n#ifdef DIRECTIONAL_LIGHT_COUNT\n@import clay.header.directional_light\n#endif\n\n@import ecgl.common.normalMap.fragmentHeader\n\n@import ecgl.common.ssaoMap.header\n\n@import ecgl.common.bumpMap.header\n\n@import clay.util.srgb\n\n@import clay.util.rgbm\n\n@import ecgl.common.wireframe.fragmentHeader\n\n@import clay.plugin.compute_shadow_map\n\nvec3 F_Schlick(float ndv, vec3 spec) {\n return spec + (1.0 - spec) * pow(1.0 - ndv, 5.0);\n}\n\nfloat D_Phong(float g, float ndh) {\n float a = pow(8192.0, g);\n return (a + 2.0) / 8.0 * pow(ndh, a);\n}\n\nvoid main()\n{\n vec4 albedoColor = color;\n\n vec3 eyePos = viewInverse[3].xyz;\n vec3 V = normalize(eyePos - v_WorldPosition);\n#ifdef VERTEX_COLOR\n #ifdef SRGB_DECODE\n albedoColor *= sRGBToLinear(v_Color);\n #else\n albedoColor *= v_Color;\n #endif\n#endif\n\n @import ecgl.common.albedo.main\n\n @import ecgl.common.diffuseLayer.main\n\n albedoColor *= albedoTexel;\n\n float m = metalness;\n\n#ifdef METALNESSMAP_ENABLED\n float m2 = texture2D(metalnessMap, v_DetailTexcoord)[METALNESS_CHANEL];\n m = clamp(m2 + (m - 0.5) * 2.0, 0.0, 1.0);\n#endif\n\n vec3 baseColor = albedoColor.rgb;\n albedoColor.rgb = baseColor * (1.0 - m);\n vec3 specFactor = mix(vec3(0.04), baseColor, m);\n\n float g = 1.0 - roughness;\n\n#ifdef ROUGHNESSMAP_ENABLED\n float g2 = 1.0 - texture2D(roughnessMap, v_DetailTexcoord)[ROUGHNESS_CHANEL];\n g = clamp(g2 + (g - 0.5) * 2.0, 0.0, 1.0);\n#endif\n\n vec3 N = v_Normal;\n\n#ifdef DOUBLE_SIDED\n if (dot(N, V) < 0.0) {\n N = -N;\n }\n#endif\n\n float ambientFactor = 1.0;\n\n#ifdef BUMPMAP_ENABLED\n N = bumpNormal(v_WorldPosition, v_Normal, N);\n ambientFactor = dot(v_Normal, N);\n#endif\n\n@import ecgl.common.normalMap.fragmentMain\n\n vec3 N2 = vec3(N.x, N[NORMAL_UP_AXIS], N[NORMAL_FRONT_AXIS]);\n\n vec3 diffuseTerm = vec3(0.0);\n vec3 specularTerm = vec3(0.0);\n\n float ndv = clamp(dot(N, V), 0.0, 1.0);\n vec3 fresnelTerm = F_Schlick(ndv, specFactor);\n\n @import ecgl.common.ssaoMap.main\n\n#ifdef AMBIENT_LIGHT_COUNT\n for(int _idx_ = 0; _idx_ < AMBIENT_LIGHT_COUNT; _idx_++)\n {{\n diffuseTerm += ambientLightColor[_idx_] * ambientFactor * ao;\n }}\n#endif\n\n#ifdef AMBIENT_SH_LIGHT_COUNT\n for(int _idx_ = 0; _idx_ < AMBIENT_SH_LIGHT_COUNT; _idx_++)\n {{\n diffuseTerm += calcAmbientSHLight(_idx_, N2) * ambientSHLightColor[_idx_] * ao;\n }}\n#endif\n\n#ifdef DIRECTIONAL_LIGHT_COUNT\n#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)\n float shadowContribsDir[DIRECTIONAL_LIGHT_COUNT];\n if(shadowEnabled)\n {\n computeShadowOfDirectionalLights(v_WorldPosition, shadowContribsDir);\n }\n#endif\n for(int _idx_ = 0; _idx_ < DIRECTIONAL_LIGHT_COUNT; _idx_++)\n {{\n vec3 L = -directionalLightDirection[_idx_];\n vec3 lc = directionalLightColor[_idx_];\n\n vec3 H = normalize(L + V);\n float ndl = clamp(dot(N, normalize(L)), 0.0, 1.0);\n float ndh = clamp(dot(N, H), 0.0, 1.0);\n\n float shadowContrib = 1.0;\n#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)\n if (shadowEnabled)\n {\n shadowContrib = shadowContribsDir[_idx_];\n }\n#endif\n\n vec3 li = lc * ndl * shadowContrib;\n\n diffuseTerm += li;\n specularTerm += li * fresnelTerm * D_Phong(g, ndh);\n }}\n#endif\n\n\n#ifdef AMBIENT_CUBEMAP_LIGHT_COUNT\n vec3 L = reflect(-V, N);\n L = vec3(L.x, L[NORMAL_UP_AXIS], L[NORMAL_FRONT_AXIS]);\n float rough2 = clamp(1.0 - g, 0.0, 1.0);\n float bias2 = rough2 * 5.0;\n vec2 brdfParam2 = texture2D(ambientCubemapLightBRDFLookup[0], vec2(rough2, ndv)).xy;\n vec3 envWeight2 = specFactor * brdfParam2.x + brdfParam2.y;\n vec3 envTexel2;\n for(int _idx_ = 0; _idx_ < AMBIENT_CUBEMAP_LIGHT_COUNT; _idx_++)\n {{\n envTexel2 = RGBMDecode(textureCubeLodEXT(ambientCubemapLightCubemap[_idx_], L, bias2), 8.12);\n specularTerm += ambientCubemapLightColor[_idx_] * envTexel2 * envWeight2 * ao;\n }}\n#endif\n\n gl_FragColor.rgb = albedoColor.rgb * diffuseTerm + specularTerm;\n gl_FragColor.a = albedoColor.a;\n\n#ifdef ATMOSPHERE_ENABLED\n float atmoIntensity = pow(1.0 - dot(v_Normal, (viewTranspose * vec4(0.0, 0.0, 1.0, 0.0)).xyz), glowPower);\n gl_FragColor.rgb += glowColor * atmoIntensity;\n#endif\n\n#ifdef SRGB_ENCODE\n gl_FragColor = linearTosRGB(gl_FragColor);\n#endif\n\n @import ecgl.common.emissiveLayer.main\n\n @import ecgl.common.wireframe.fragmentMain\n}\n\n@end";
var hatchingGLSL = "@export ecgl.hatching.vertex\n\n@import ecgl.realistic.vertex\n\n@end\n\n\n@export ecgl.hatching.fragment\n\n#define NORMAL_UP_AXIS 1\n#define NORMAL_FRONT_AXIS 2\n\n@import ecgl.common.uv.fragmentHeader\n\nvarying vec3 v_Normal;\nvarying vec3 v_WorldPosition;\n\nuniform vec4 color : [0.0, 0.0, 0.0, 1.0];\nuniform vec4 paperColor : [1.0, 1.0, 1.0, 1.0];\n\nuniform mat4 viewInverse : VIEWINVERSE;\n\n#ifdef AMBIENT_LIGHT_COUNT\n@import clay.header.ambient_light\n#endif\n#ifdef AMBIENT_SH_LIGHT_COUNT\n@import clay.header.ambient_sh_light\n#endif\n\n#ifdef DIRECTIONAL_LIGHT_COUNT\n@import clay.header.directional_light\n#endif\n\n#ifdef VERTEX_COLOR\nvarying vec4 v_Color;\n#endif\n\n\n@import ecgl.common.ssaoMap.header\n\n@import ecgl.common.bumpMap.header\n\n@import clay.util.srgb\n\n@import ecgl.common.wireframe.fragmentHeader\n\n@import clay.plugin.compute_shadow_map\n\nuniform sampler2D hatch1;\nuniform sampler2D hatch2;\nuniform sampler2D hatch3;\nuniform sampler2D hatch4;\nuniform sampler2D hatch5;\nuniform sampler2D hatch6;\n\nfloat shade(in float tone) {\n vec4 c = vec4(1. ,1., 1., 1.);\n float step = 1. / 6.;\n vec2 uv = v_DetailTexcoord;\n if (tone <= step / 2.0) {\n c = mix(vec4(0.), texture2D(hatch6, uv), 12. * tone);\n }\n else if (tone <= step) {\n c = mix(texture2D(hatch6, uv), texture2D(hatch5, uv), 6. * tone);\n }\n if(tone > step && tone <= 2. * step){\n c = mix(texture2D(hatch5, uv), texture2D(hatch4, uv) , 6. * (tone - step));\n }\n if(tone > 2. * step && tone <= 3. * step){\n c = mix(texture2D(hatch4, uv), texture2D(hatch3, uv), 6. * (tone - 2. * step));\n }\n if(tone > 3. * step && tone <= 4. * step){\n c = mix(texture2D(hatch3, uv), texture2D(hatch2, uv), 6. * (tone - 3. * step));\n }\n if(tone > 4. * step && tone <= 5. * step){\n c = mix(texture2D(hatch2, uv), texture2D(hatch1, uv), 6. * (tone - 4. * step));\n }\n if(tone > 5. * step){\n c = mix(texture2D(hatch1, uv), vec4(1.), 6. * (tone - 5. * step));\n }\n\n return c.r;\n}\n\nconst vec3 w = vec3(0.2125, 0.7154, 0.0721);\n\nvoid main()\n{\n#ifdef SRGB_DECODE\n vec4 inkColor = sRGBToLinear(color);\n#else\n vec4 inkColor = color;\n#endif\n\n#ifdef VERTEX_COLOR\n #ifdef SRGB_DECODE\n inkColor *= sRGBToLinear(v_Color);\n #else\n inkColor *= v_Color;\n #endif\n#endif\n\n vec3 N = v_Normal;\n#ifdef DOUBLE_SIDED\n vec3 eyePos = viewInverse[3].xyz;\n vec3 V = normalize(eyePos - v_WorldPosition);\n\n if (dot(N, V) < 0.0) {\n N = -N;\n }\n#endif\n\n float tone = 0.0;\n\n float ambientFactor = 1.0;\n\n#ifdef BUMPMAP_ENABLED\n N = bumpNormal(v_WorldPosition, v_Normal, N);\n ambientFactor = dot(v_Normal, N);\n#endif\n\n vec3 N2 = vec3(N.x, N[NORMAL_UP_AXIS], N[NORMAL_FRONT_AXIS]);\n\n @import ecgl.common.ssaoMap.main\n\n#ifdef AMBIENT_LIGHT_COUNT\n for(int i = 0; i < AMBIENT_LIGHT_COUNT; i++)\n {\n tone += dot(ambientLightColor[i], w) * ambientFactor * ao;\n }\n#endif\n#ifdef AMBIENT_SH_LIGHT_COUNT\n for(int _idx_ = 0; _idx_ < AMBIENT_SH_LIGHT_COUNT; _idx_++)\n {{\n tone += dot(calcAmbientSHLight(_idx_, N2) * ambientSHLightColor[_idx_], w) * ao;\n }}\n#endif\n#ifdef DIRECTIONAL_LIGHT_COUNT\n#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)\n float shadowContribsDir[DIRECTIONAL_LIGHT_COUNT];\n if(shadowEnabled)\n {\n computeShadowOfDirectionalLights(v_WorldPosition, shadowContribsDir);\n }\n#endif\n for(int i = 0; i < DIRECTIONAL_LIGHT_COUNT; i++)\n {\n vec3 lightDirection = -directionalLightDirection[i];\n float lightTone = dot(directionalLightColor[i], w);\n\n float shadowContrib = 1.0;\n#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)\n if (shadowEnabled)\n {\n shadowContrib = shadowContribsDir[i];\n }\n#endif\n\n float ndl = dot(N, normalize(lightDirection)) * shadowContrib;\n\n tone += lightTone * clamp(ndl, 0.0, 1.0);\n }\n#endif\n\n gl_FragColor = mix(inkColor, paperColor, shade(clamp(tone, 0.0, 1.0)));\n }\n@end\n";
var shadowGLSL = "@export ecgl.sm.depth.vertex\n\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\n\nattribute vec3 position : POSITION;\nattribute vec2 texcoord : TEXCOORD_0;\n\n#ifdef VERTEX_ANIMATION\nattribute vec3 prevPosition;\nuniform float percent : 1.0;\n#endif\n\nvarying vec4 v_ViewPosition;\nvarying vec2 v_Texcoord;\n\nvoid main(){\n\n#ifdef VERTEX_ANIMATION\n vec3 pos = mix(prevPosition, position, percent);\n#else\n vec3 pos = position;\n#endif\n\n v_ViewPosition = worldViewProjection * vec4(pos, 1.0);\n gl_Position = v_ViewPosition;\n\n v_Texcoord = texcoord;\n\n}\n@end\n\n\n\n@export ecgl.sm.depth.fragment\n\n@import clay.sm.depth.fragment\n\n@end";
Object.assign(Node3D.prototype, animatableMixin$1);
Shader.import(utilShaderCode);
Shader.import(prezGLSL);
Shader.import(commonGLSL);
Shader.import(colorGLSL);
Shader.import(lambertGLSL);
Shader.import(realisticGLSL);
Shader.import(hatchingGLSL);
Shader.import(shadowGLSL);
function isValueNone(value) {
  return !value || value === "none";
}
function isValueImage(value) {
  return value instanceof HTMLCanvasElement || value instanceof HTMLImageElement || value instanceof Image;
}
function isECharts(value) {
  return value.getZr && value.setOption;
}
var oldAddToScene = Scene$1.prototype.addToScene;
var oldRemoveFromScene = Scene$1.prototype.removeFromScene;
Scene$1.prototype.addToScene = function(node) {
  oldAddToScene.call(this, node);
  if (this.__zr) {
    var zr = this.__zr;
    node.traverse(function(child) {
      child.__zr = zr;
      if (child.addAnimatorsToZr) {
        child.addAnimatorsToZr(zr);
      }
    });
  }
};
Scene$1.prototype.removeFromScene = function(node) {
  oldRemoveFromScene.call(this, node);
  node.traverse(function(child) {
    var zr = child.__zr;
    child.__zr = null;
    if (zr && child.removeAnimatorsFromZr) {
      child.removeAnimatorsFromZr(zr);
    }
  });
};
Material$1.prototype.setTextureImage = function(textureName, imgValue, api, textureOpts) {
  if (!this.shader) {
    return;
  }
  var zr = api.getZr();
  var material = this;
  var texture;
  material.autoUpdateTextureStatus = false;
  material.disableTexture(textureName);
  if (!isValueNone(imgValue)) {
    texture = graphicGL.loadTexture(imgValue, api, textureOpts, function(texture2) {
      material.enableTexture(textureName);
      zr && zr.refresh();
    });
    material.set(textureName, texture);
  }
  return texture;
};
var graphicGL = {};
graphicGL.Renderer = Renderer$1;
graphicGL.Node = Node3D;
graphicGL.Mesh = Mesh$1;
graphicGL.Shader = Shader;
graphicGL.Material = Material$1;
graphicGL.Texture = Texture$1;
graphicGL.Texture2D = Texture2D$1;
graphicGL.Geometry = Geometry$1;
graphicGL.SphereGeometry = SphereGeometry;
graphicGL.PlaneGeometry = PlaneGeometry;
graphicGL.CubeGeometry = CubeGeometry;
graphicGL.AmbientLight = AmbientLight$1;
graphicGL.DirectionalLight = DirectionalLight$1;
graphicGL.PointLight = PointLight$1;
graphicGL.SpotLight = SpotLight$1;
graphicGL.PerspectiveCamera = PerspectiveCamera;
graphicGL.OrthographicCamera = OrthoCamera;
graphicGL.Vector2 = Vector2$1;
graphicGL.Vector3 = Vector3$1;
graphicGL.Vector4 = Vector4$1;
graphicGL.Quaternion = Quaternion$1;
graphicGL.Matrix2 = Matrix2$1;
graphicGL.Matrix2d = Matrix2d$1;
graphicGL.Matrix3 = Matrix3$1;
graphicGL.Matrix4 = Matrix4$1;
graphicGL.Plane = Plane$2;
graphicGL.Ray = Ray$1;
graphicGL.BoundingBox = BoundingBox$1;
graphicGL.Frustum = Frustum$1;
var blankImage = null;
function getBlankImage() {
  if (blankImage !== null) {
    return blankImage;
  }
  blankImage = textureUtil$1.createBlank("rgba(255,255,255,0)").image;
  return blankImage;
}
function nearestPowerOfTwo(val) {
  return Math.pow(2, Math.round(Math.log(val) / Math.LN2));
}
function convertTextureToPowerOfTwo(texture) {
  if ((texture.wrapS === Texture$1.REPEAT || texture.wrapT === Texture$1.REPEAT) && texture.image) {
    var width = nearestPowerOfTwo(texture.width);
    var height = nearestPowerOfTwo(texture.height);
    if (width !== texture.width || height !== texture.height) {
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(texture.image, 0, 0, width, height);
      texture.image = canvas;
    }
  }
}
graphicGL.loadTexture = function(imgValue, api, textureOpts, cb) {
  if (typeof textureOpts === "function") {
    cb = textureOpts;
    textureOpts = {};
  }
  textureOpts = textureOpts || {};
  var keys2 = Object.keys(textureOpts).sort();
  var prefix = "";
  for (var i = 0; i < keys2.length; i++) {
    prefix += keys2[i] + "_" + textureOpts[keys2[i]] + "_";
  }
  var textureCache = api.__textureCache = api.__textureCache || new LRUCache$1(20);
  if (isECharts(imgValue)) {
    var id = imgValue.__textureid__;
    var textureObj = textureCache.get(prefix + id);
    if (!textureObj) {
      var surface = new EChartsSurface$1(imgValue);
      surface.onupdate = function() {
        api.getZr().refresh();
      };
      textureObj = {
        texture: surface.getTexture()
      };
      for (var i = 0; i < keys2.length; i++) {
        textureObj.texture[keys2[i]] = textureOpts[keys2[i]];
      }
      id = imgValue.__textureid__ || "__ecgl_ec__" + textureObj.texture.__uid__;
      imgValue.__textureid__ = id;
      textureCache.put(prefix + id, textureObj);
      cb && cb(textureObj.texture);
    } else {
      textureObj.texture.surface.setECharts(imgValue);
      cb && cb(textureObj.texture);
    }
    return textureObj.texture;
  } else if (isValueImage(imgValue)) {
    var id = imgValue.__textureid__;
    var textureObj = textureCache.get(prefix + id);
    if (!textureObj) {
      textureObj = {
        texture: new graphicGL.Texture2D({
          image: imgValue
        })
      };
      for (var i = 0; i < keys2.length; i++) {
        textureObj.texture[keys2[i]] = textureOpts[keys2[i]];
      }
      id = imgValue.__textureid__ || "__ecgl_image__" + textureObj.texture.__uid__;
      imgValue.__textureid__ = id;
      textureCache.put(prefix + id, textureObj);
      convertTextureToPowerOfTwo(textureObj.texture);
      cb && cb(textureObj.texture);
    }
    return textureObj.texture;
  } else {
    var textureObj = textureCache.get(prefix + imgValue);
    if (textureObj) {
      if (textureObj.callbacks) {
        textureObj.callbacks.push(cb);
      } else {
        cb && cb(textureObj.texture);
      }
    } else {
      if (imgValue.match(/.hdr$|^data:application\/octet-stream/)) {
        textureObj = {
          callbacks: [cb]
        };
        var texture = textureUtil$1.loadTexture(imgValue, {
          exposure: textureOpts.exposure,
          fileType: "hdr"
        }, function() {
          texture.dirty();
          textureObj.callbacks.forEach(function(cb2) {
            cb2 && cb2(texture);
          });
          textureObj.callbacks = null;
        });
        textureObj.texture = texture;
        textureCache.put(prefix + imgValue, textureObj);
      } else {
        var texture = new graphicGL.Texture2D({
          image: new Image()
        });
        for (var i = 0; i < keys2.length; i++) {
          texture[keys2[i]] = textureOpts[keys2[i]];
        }
        textureObj = {
          texture,
          callbacks: [cb]
        };
        var originalImage = texture.image;
        originalImage.onload = function() {
          texture.image = originalImage;
          convertTextureToPowerOfTwo(texture);
          texture.dirty();
          textureObj.callbacks.forEach(function(cb2) {
            cb2 && cb2(texture);
          });
          textureObj.callbacks = null;
        };
        originalImage.crossOrigin = "Anonymous";
        originalImage.src = imgValue;
        texture.image = getBlankImage();
        textureCache.put(prefix + imgValue, textureObj);
      }
    }
    return textureObj.texture;
  }
};
graphicGL.createAmbientCubemap = function(opt, renderer, api, cb) {
  opt = opt || {};
  var textureUrl = opt.texture;
  var exposure = retrieve$1.firstNotNull(opt.exposure, 1);
  var ambientCubemap = new AmbientCubemapLight$1({
    intensity: retrieve$1.firstNotNull(opt.specularIntensity, 1)
  });
  var ambientSH = new AmbientSHLight$1({
    intensity: retrieve$1.firstNotNull(opt.diffuseIntensity, 1),
    coefficients: [0.844, 0.712, 0.691, -0.037, 0.083, 0.167, 0.343, 0.288, 0.299, -0.041, -0.021, -9e-3, -3e-3, -0.041, -0.064, -0.011, -7e-3, -4e-3, -0.031, 0.034, 0.081, -0.06, -0.049, -0.06, 0.046, 0.056, 0.05]
  });
  ambientCubemap.cubemap = graphicGL.loadTexture(textureUrl, api, {
    exposure
  }, function() {
    ambientCubemap.cubemap.flipY = false;
    ambientCubemap.prefilter(renderer, 32);
    ambientSH.coefficients = shUtil.projectEnvironmentMap(renderer, ambientCubemap.cubemap, {
      lod: 1
    });
    cb && cb();
  });
  return {
    specular: ambientCubemap,
    diffuse: ambientSH
  };
};
graphicGL.createBlankTexture = textureUtil$1.createBlank;
graphicGL.isImage = isValueImage;
graphicGL.additiveBlend = function(gl) {
  gl.blendEquation(gl.FUNC_ADD);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
};
graphicGL.parseColor = function(colorStr, rgba) {
  if (colorStr instanceof Array) {
    if (!rgba) {
      rgba = [];
    }
    rgba[0] = colorStr[0];
    rgba[1] = colorStr[1];
    rgba[2] = colorStr[2];
    if (colorStr.length > 3) {
      rgba[3] = colorStr[3];
    } else {
      rgba[3] = 1;
    }
    return rgba;
  }
  rgba = parse(colorStr || "#000", rgba) || [0, 0, 0, 0];
  rgba[0] /= 255;
  rgba[1] /= 255;
  rgba[2] /= 255;
  return rgba;
};
graphicGL.directionFromAlphaBeta = function(alpha, beta) {
  var theta = alpha / 180 * Math.PI + Math.PI / 2;
  var phi = -beta / 180 * Math.PI + Math.PI / 2;
  var dir3 = [];
  var r = Math.sin(theta);
  dir3[0] = r * Math.cos(phi);
  dir3[1] = -Math.cos(theta);
  dir3[2] = r * Math.sin(phi);
  return dir3;
};
graphicGL.getShadowResolution = function(shadowQuality) {
  var shadowResolution = 1024;
  switch (shadowQuality) {
    case "low":
      shadowResolution = 512;
      break;
    case "medium":
      break;
    case "high":
      shadowResolution = 2048;
      break;
    case "ultra":
      shadowResolution = 4096;
      break;
  }
  return shadowResolution;
};
graphicGL.COMMON_SHADERS = ["lambert", "color", "realistic", "hatching", "shadow"];
graphicGL.createShader = function(prefix) {
  if (prefix === "ecgl.shadow") {
    prefix = "ecgl.displayShadow";
  }
  var vertexShaderStr = Shader.source(prefix + ".vertex");
  var fragmentShaderStr = Shader.source(prefix + ".fragment");
  if (!vertexShaderStr) {
    console.error("Vertex shader of '%s' not exits", prefix);
  }
  if (!fragmentShaderStr) {
    console.error("Fragment shader of '%s' not exits", prefix);
  }
  var shader = new Shader(vertexShaderStr, fragmentShaderStr);
  shader.name = prefix;
  return shader;
};
graphicGL.createMaterial = function(prefix, defines) {
  if (!(defines instanceof Array)) {
    defines = [defines];
  }
  var shader = graphicGL.createShader(prefix);
  var material = new Material$1({
    shader
  });
  defines.forEach(function(defineName) {
    if (typeof defineName === "string") {
      material.define(defineName);
    }
  });
  return material;
};
graphicGL.setMaterialFromModel = function(shading, material, model, api) {
  material.autoUpdateTextureStatus = false;
  var materialModel = model.getModel(shading + "Material");
  var detailTexture = materialModel.get("detailTexture");
  var uvRepeat = retrieve$1.firstNotNull(materialModel.get("textureTiling"), 1);
  var uvOffset = retrieve$1.firstNotNull(materialModel.get("textureOffset"), 0);
  if (typeof uvRepeat === "number") {
    uvRepeat = [uvRepeat, uvRepeat];
  }
  if (typeof uvOffset === "number") {
    uvOffset = [uvOffset, uvOffset];
  }
  var repeatParam = uvRepeat[0] > 1 || uvRepeat[1] > 1 ? graphicGL.Texture.REPEAT : graphicGL.Texture.CLAMP_TO_EDGE;
  var textureOpt = {
    anisotropic: 8,
    wrapS: repeatParam,
    wrapT: repeatParam
  };
  if (shading === "realistic") {
    var roughness = materialModel.get("roughness");
    var metalness = materialModel.get("metalness");
    if (metalness != null) {
      if (isNaN(metalness)) {
        material.setTextureImage("metalnessMap", metalness, api, textureOpt);
        metalness = retrieve$1.firstNotNull(materialModel.get("metalnessAdjust"), 0.5);
      }
    } else {
      metalness = 0;
    }
    if (roughness != null) {
      if (isNaN(roughness)) {
        material.setTextureImage("roughnessMap", roughness, api, textureOpt);
        roughness = retrieve$1.firstNotNull(materialModel.get("roughnessAdjust"), 0.5);
      }
    } else {
      roughness = 0.5;
    }
    var normalTextureVal = materialModel.get("normalTexture");
    material.setTextureImage("detailMap", detailTexture, api, textureOpt);
    material.setTextureImage("normalMap", normalTextureVal, api, textureOpt);
    material.set({
      roughness,
      metalness,
      detailUvRepeat: uvRepeat,
      detailUvOffset: uvOffset
    });
  } else if (shading === "lambert") {
    material.setTextureImage("detailMap", detailTexture, api, textureOpt);
    material.set({
      detailUvRepeat: uvRepeat,
      detailUvOffset: uvOffset
    });
  } else if (shading === "color") {
    material.setTextureImage("detailMap", detailTexture, api, textureOpt);
    material.set({
      detailUvRepeat: uvRepeat,
      detailUvOffset: uvOffset
    });
  } else if (shading === "hatching") {
    var tams = materialModel.get("hatchingTextures") || [];
    if (tams.length < 6)
      ;
    for (var i = 0; i < 6; i++) {
      material.setTextureImage("hatch" + (i + 1), tams[i], api, {
        anisotropic: 8,
        wrapS: graphicGL.Texture.REPEAT,
        wrapT: graphicGL.Texture.REPEAT
      });
    }
    material.set({
      detailUvRepeat: uvRepeat,
      detailUvOffset: uvOffset
    });
  }
};
graphicGL.updateVertexAnimation = function(mappingAttributes, previousMesh, currentMesh, seriesModel) {
  var enableAnimation = seriesModel.get("animation");
  var duration = seriesModel.get("animationDurationUpdate");
  var easing = seriesModel.get("animationEasingUpdate");
  var shadowDepthMaterial = currentMesh.shadowDepthMaterial;
  if (enableAnimation && previousMesh && duration > 0 && previousMesh.geometry.vertexCount === currentMesh.geometry.vertexCount) {
    currentMesh.material.define("vertex", "VERTEX_ANIMATION");
    currentMesh.ignorePreZ = true;
    if (shadowDepthMaterial) {
      shadowDepthMaterial.define("vertex", "VERTEX_ANIMATION");
    }
    for (var i = 0; i < mappingAttributes.length; i++) {
      currentMesh.geometry.attributes[mappingAttributes[i][0]].value = previousMesh.geometry.attributes[mappingAttributes[i][1]].value;
    }
    currentMesh.geometry.dirty();
    currentMesh.__percent = 0;
    currentMesh.material.set("percent", 0);
    currentMesh.stopAnimation();
    currentMesh.animate().when(duration, {
      __percent: 1
    }).during(function() {
      currentMesh.material.set("percent", currentMesh.__percent);
      if (shadowDepthMaterial) {
        shadowDepthMaterial.set("percent", currentMesh.__percent);
      }
    }).done(function() {
      currentMesh.ignorePreZ = false;
      currentMesh.material.undefine("vertex", "VERTEX_ANIMATION");
      if (shadowDepthMaterial) {
        shadowDepthMaterial.undefine("vertex", "VERTEX_ANIMATION");
      }
    }).start(easing);
  } else {
    currentMesh.material.undefine("vertex", "VERTEX_ANIMATION");
    if (shadowDepthMaterial) {
      shadowDepthMaterial.undefine("vertex", "VERTEX_ANIMATION");
    }
  }
};
var graphicGL$1 = graphicGL;
var LayerGL = function(id, zr) {
  this.id = id;
  this.zr = zr;
  try {
    this.renderer = new Renderer$1({
      clearBit: 0,
      devicePixelRatio: zr.painter.dpr,
      preserveDrawingBuffer: true,
      premultipliedAlpha: true
    });
    this.renderer.resize(zr.painter.getWidth(), zr.painter.getHeight());
  } catch (e2) {
    this.renderer = null;
    this.dom = document.createElement("div");
    this.dom.style.cssText = "position:absolute; left: 0; top: 0; right: 0; bottom: 0;";
    this.dom.className = "ecgl-nowebgl";
    this.dom.innerHTML = "Sorry, your browser does not support WebGL";
    console.error(e2);
    return;
  }
  this.onglobalout = this.onglobalout.bind(this);
  zr.on("globalout", this.onglobalout);
  this.dom = this.renderer.canvas;
  var style = this.dom.style;
  style.position = "absolute";
  style.left = "0";
  style.top = "0";
  this.views = [];
  this._picking = new RayPicking$1({
    renderer: this.renderer
  });
  this._viewsToDispose = [];
  this._accumulatingId = 0;
  this._zrEventProxy = new Rect({
    shape: {
      x: -1,
      y: -1,
      width: 2,
      height: 2
    },
    __isGLToZRProxy: true
  });
  this._backgroundColor = null;
  this._disposed = false;
};
LayerGL.prototype.setUnpainted = function() {
};
LayerGL.prototype.addView = function(view) {
  if (view.layer === this) {
    return;
  }
  var idx = this._viewsToDispose.indexOf(view);
  if (idx >= 0) {
    this._viewsToDispose.splice(idx, 1);
  }
  this.views.push(view);
  view.layer = this;
  var zr = this.zr;
  view.scene.traverse(function(node) {
    node.__zr = zr;
    if (node.addAnimatorsToZr) {
      node.addAnimatorsToZr(zr);
    }
  });
};
function removeFromZr(node) {
  var zr = node.__zr;
  node.__zr = null;
  if (zr && node.removeAnimatorsFromZr) {
    node.removeAnimatorsFromZr(zr);
  }
}
LayerGL.prototype.removeView = function(view) {
  if (view.layer !== this) {
    return;
  }
  var idx = this.views.indexOf(view);
  if (idx >= 0) {
    this.views.splice(idx, 1);
    view.scene.traverse(removeFromZr, this);
    view.layer = null;
    this._viewsToDispose.push(view);
  }
};
LayerGL.prototype.removeViewsAll = function() {
  this.views.forEach(function(view) {
    view.scene.traverse(removeFromZr, this);
    view.layer = null;
    this._viewsToDispose.push(view);
  }, this);
  this.views.length = 0;
};
LayerGL.prototype.resize = function(width, height) {
  var renderer = this.renderer;
  renderer.resize(width, height);
};
LayerGL.prototype.clear = function() {
  var gl = this.renderer.gl;
  var clearColor = this._backgroundColor || [0, 0, 0, 0];
  gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
  gl.depthMask(true);
  gl.colorMask(true, true, true, true);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
};
LayerGL.prototype.clearDepth = function() {
  var gl = this.renderer.gl;
  gl.clear(gl.DEPTH_BUFFER_BIT);
};
LayerGL.prototype.clearColor = function() {
  var gl = this.renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
};
LayerGL.prototype.needsRefresh = function() {
  this.zr.refresh();
};
LayerGL.prototype.refresh = function(bgColor) {
  this._backgroundColor = bgColor ? graphicGL$1.parseColor(bgColor) : [0, 0, 0, 0];
  this.renderer.clearColor = this._backgroundColor;
  for (var i = 0; i < this.views.length; i++) {
    this.views[i].prepareRender(this.renderer);
  }
  this._doRender(false);
  this._trackAndClean();
  for (var i = 0; i < this._viewsToDispose.length; i++) {
    this._viewsToDispose[i].dispose(this.renderer);
  }
  this._viewsToDispose.length = 0;
  this._startAccumulating();
};
LayerGL.prototype.renderToCanvas = function(ctx) {
  this._startAccumulating(true);
  ctx.drawImage(this.dom, 0, 0, ctx.canvas.width, ctx.canvas.height);
};
LayerGL.prototype._doRender = function(accumulating) {
  this.clear();
  this.renderer.saveViewport();
  for (var i = 0; i < this.views.length; i++) {
    this.views[i].render(this.renderer, accumulating);
  }
  this.renderer.restoreViewport();
};
LayerGL.prototype._stopAccumulating = function() {
  this._accumulatingId = 0;
  clearTimeout(this._accumulatingTimeout);
};
var accumulatingId = 1;
LayerGL.prototype._startAccumulating = function(immediate) {
  var self = this;
  this._stopAccumulating();
  var needsAccumulate = false;
  for (var i = 0; i < this.views.length; i++) {
    needsAccumulate = this.views[i].needsAccumulate() || needsAccumulate;
  }
  if (!needsAccumulate) {
    return;
  }
  function accumulate(id) {
    if (!self._accumulatingId || id !== self._accumulatingId) {
      return;
    }
    var isFinished = true;
    for (var i2 = 0; i2 < self.views.length; i2++) {
      isFinished = self.views[i2].isAccumulateFinished() && needsAccumulate;
    }
    if (!isFinished) {
      self._doRender(true);
      if (immediate) {
        accumulate(id);
      } else {
        requestAnimationFrame(function() {
          accumulate(id);
        });
      }
    }
  }
  this._accumulatingId = accumulatingId++;
  if (immediate) {
    accumulate(self._accumulatingId);
  } else {
    this._accumulatingTimeout = setTimeout(function() {
      accumulate(self._accumulatingId);
    }, 50);
  }
};
LayerGL.prototype._trackAndClean = function() {
  var textureList = [];
  var geometriesList = [];
  if (this._textureList) {
    markUnused(this._textureList);
    markUnused(this._geometriesList);
  }
  for (var i = 0; i < this.views.length; i++) {
    collectResources(this.views[i].scene, textureList, geometriesList);
  }
  if (this._textureList) {
    checkAndDispose(this.renderer, this._textureList);
    checkAndDispose(this.renderer, this._geometriesList);
  }
  this._textureList = textureList;
  this._geometriesList = geometriesList;
};
function markUnused(resourceList) {
  for (var i = 0; i < resourceList.length; i++) {
    resourceList[i].__used__ = 0;
  }
}
function checkAndDispose(renderer, resourceList) {
  for (var i = 0; i < resourceList.length; i++) {
    if (!resourceList[i].__used__) {
      resourceList[i].dispose(renderer);
    }
  }
}
function updateUsed(resource, list) {
  resource.__used__ = resource.__used__ || 0;
  resource.__used__++;
  if (resource.__used__ === 1) {
    list.push(resource);
  }
}
function collectResources(scene, textureResourceList, geometryResourceList) {
  var prevMaterial;
  var prevGeometry;
  scene.traverse(function(renderable) {
    if (renderable.isRenderable()) {
      var geometry = renderable.geometry;
      var material = renderable.material;
      if (material !== prevMaterial) {
        var textureUniforms = material.getTextureUniforms();
        for (var u = 0; u < textureUniforms.length; u++) {
          var uniformName = textureUniforms[u];
          var val = material.uniforms[uniformName].value;
          if (!val) {
            continue;
          }
          if (val instanceof Texture$1) {
            updateUsed(val, textureResourceList);
          } else if (val instanceof Array) {
            for (var k2 = 0; k2 < val.length; k2++) {
              if (val[k2] instanceof Texture$1) {
                updateUsed(val[k2], textureResourceList);
              }
            }
          }
        }
      }
      if (geometry !== prevGeometry) {
        updateUsed(geometry, geometryResourceList);
      }
      prevMaterial = material;
      prevGeometry = geometry;
    }
  });
  for (var k = 0; k < scene.lights.length; k++) {
    if (scene.lights[k].cubemap) {
      updateUsed(scene.lights[k].cubemap, textureResourceList);
    }
  }
}
LayerGL.prototype.dispose = function() {
  if (this._disposed) {
    return;
  }
  this._stopAccumulating();
  if (this._textureList) {
    markUnused(this._textureList);
    markUnused(this._geometriesList);
    checkAndDispose(this.renderer, this._textureList);
    checkAndDispose(this.renderer, this._geometriesList);
  }
  this.zr.off("globalout", this.onglobalout);
  this._disposed = true;
};
LayerGL.prototype.onmousedown = function(e2) {
  if (e2.target && e2.target.__isGLToZRProxy) {
    return;
  }
  e2 = e2.event;
  var obj = this.pickObject(e2.offsetX, e2.offsetY);
  if (obj) {
    this._dispatchEvent("mousedown", e2, obj);
    this._dispatchDataEvent("mousedown", e2, obj);
  }
  this._downX = e2.offsetX;
  this._downY = e2.offsetY;
};
LayerGL.prototype.onmousemove = function(e2) {
  if (e2.target && e2.target.__isGLToZRProxy) {
    return;
  }
  e2 = e2.event;
  var obj = this.pickObject(e2.offsetX, e2.offsetY);
  var target = obj && obj.target;
  var lastHovered = this._hovered;
  this._hovered = obj;
  if (lastHovered && target !== lastHovered.target) {
    lastHovered.relatedTarget = target;
    this._dispatchEvent("mouseout", e2, lastHovered);
    this.zr.setCursorStyle("default");
  }
  this._dispatchEvent("mousemove", e2, obj);
  if (obj) {
    this.zr.setCursorStyle("pointer");
    if (!lastHovered || target !== lastHovered.target) {
      this._dispatchEvent("mouseover", e2, obj);
    }
  }
  this._dispatchDataEvent("mousemove", e2, obj);
};
LayerGL.prototype.onmouseup = function(e2) {
  if (e2.target && e2.target.__isGLToZRProxy) {
    return;
  }
  e2 = e2.event;
  var obj = this.pickObject(e2.offsetX, e2.offsetY);
  if (obj) {
    this._dispatchEvent("mouseup", e2, obj);
    this._dispatchDataEvent("mouseup", e2, obj);
  }
  this._upX = e2.offsetX;
  this._upY = e2.offsetY;
};
LayerGL.prototype.onclick = LayerGL.prototype.dblclick = function(e2) {
  if (e2.target && e2.target.__isGLToZRProxy) {
    return;
  }
  var dx = this._upX - this._downX;
  var dy = this._upY - this._downY;
  if (Math.sqrt(dx * dx + dy * dy) > 20) {
    return;
  }
  e2 = e2.event;
  var obj = this.pickObject(e2.offsetX, e2.offsetY);
  if (obj) {
    this._dispatchEvent(e2.type, e2, obj);
    this._dispatchDataEvent(e2.type, e2, obj);
  }
  var result = this._clickToSetFocusPoint(e2);
  if (result) {
    var success = result.view.setDOFFocusOnPoint(result.distance);
    if (success) {
      this.zr.refresh();
    }
  }
};
LayerGL.prototype._clickToSetFocusPoint = function(e2) {
  var renderer = this.renderer;
  var oldViewport = renderer.viewport;
  for (var i = this.views.length - 1; i >= 0; i--) {
    var viewGL = this.views[i];
    if (viewGL.hasDOF() && viewGL.containPoint(e2.offsetX, e2.offsetY)) {
      this._picking.scene = viewGL.scene;
      this._picking.camera = viewGL.camera;
      renderer.viewport = viewGL.viewport;
      var result = this._picking.pick(e2.offsetX, e2.offsetY, true);
      if (result) {
        result.view = viewGL;
        return result;
      }
    }
  }
  renderer.viewport = oldViewport;
};
LayerGL.prototype.onglobalout = function(e2) {
  var lastHovered = this._hovered;
  if (lastHovered) {
    this._dispatchEvent("mouseout", e2, {
      target: lastHovered.target
    });
  }
};
LayerGL.prototype.pickObject = function(x, y) {
  var output = [];
  var renderer = this.renderer;
  var oldViewport = renderer.viewport;
  for (var i = 0; i < this.views.length; i++) {
    var viewGL = this.views[i];
    if (viewGL.containPoint(x, y)) {
      this._picking.scene = viewGL.scene;
      this._picking.camera = viewGL.camera;
      renderer.viewport = viewGL.viewport;
      this._picking.pickAll(x, y, output);
    }
  }
  renderer.viewport = oldViewport;
  output.sort(function(a, b) {
    return a.distance - b.distance;
  });
  return output[0];
};
LayerGL.prototype._dispatchEvent = function(eveName, originalEvent, newEvent) {
  if (!newEvent) {
    newEvent = {};
  }
  var current = newEvent.target;
  newEvent.cancelBubble = false;
  newEvent.event = originalEvent;
  newEvent.type = eveName;
  newEvent.offsetX = originalEvent.offsetX;
  newEvent.offsetY = originalEvent.offsetY;
  while (current) {
    current.trigger(eveName, newEvent);
    current = current.getParent();
    if (newEvent.cancelBubble) {
      break;
    }
  }
  this._dispatchToView(eveName, newEvent);
};
LayerGL.prototype._dispatchDataEvent = function(eveName, originalEvent, newEvent) {
  var mesh2 = newEvent && newEvent.target;
  var dataIndex = mesh2 && mesh2.dataIndex;
  var seriesIndex = mesh2 && mesh2.seriesIndex;
  var eventData = mesh2 && mesh2.eventData;
  var elChangedInMouseMove = false;
  var eventProxy = this._zrEventProxy;
  eventProxy.x = originalEvent.offsetX;
  eventProxy.y = originalEvent.offsetY;
  eventProxy.update();
  var targetInfo = {
    target: eventProxy
  };
  const ecData = getECData(eventProxy);
  if (eveName === "mousemove") {
    if (dataIndex != null) {
      if (dataIndex !== this._lastDataIndex) {
        if (parseInt(this._lastDataIndex, 10) >= 0) {
          ecData.dataIndex = this._lastDataIndex;
          ecData.seriesIndex = this._lastSeriesIndex;
          this.zr.handler.dispatchToElement(targetInfo, "mouseout", originalEvent);
        }
        elChangedInMouseMove = true;
      }
    } else if (eventData != null) {
      if (eventData !== this._lastEventData) {
        if (this._lastEventData != null) {
          ecData.eventData = this._lastEventData;
          this.zr.handler.dispatchToElement(targetInfo, "mouseout", originalEvent);
        }
        elChangedInMouseMove = true;
      }
    }
    this._lastEventData = eventData;
    this._lastDataIndex = dataIndex;
    this._lastSeriesIndex = seriesIndex;
  }
  ecData.eventData = eventData;
  ecData.dataIndex = dataIndex;
  ecData.seriesIndex = seriesIndex;
  if (eventData != null || parseInt(dataIndex, 10) >= 0 && parseInt(seriesIndex, 10) >= 0) {
    this.zr.handler.dispatchToElement(targetInfo, eveName, originalEvent);
    if (elChangedInMouseMove) {
      this.zr.handler.dispatchToElement(targetInfo, "mouseover", originalEvent);
    }
  }
};
LayerGL.prototype._dispatchToView = function(eventName, e2) {
  for (var i = 0; i < this.views.length; i++) {
    if (this.views[i].containPoint(e2.offsetX, e2.offsetY)) {
      this.views[i].trigger(eventName, e2);
    }
  }
};
Object.assign(LayerGL.prototype, notifier$1);
var LayerGL$1 = LayerGL;
var GL_SERIES = ["bar3D", "line3D", "map3D", "scatter3D", "surface", "lines3D", "scatterGL", "scatter3D"];
function convertNormalEmphasis(option, optType) {
  if (option && option[optType] && (option[optType].normal || option[optType].emphasis)) {
    var normalOpt = option[optType].normal;
    var emphasisOpt = option[optType].emphasis;
    if (normalOpt) {
      option[optType] = normalOpt;
    }
    if (emphasisOpt) {
      option.emphasis = option.emphasis || {};
      option.emphasis[optType] = emphasisOpt;
    }
  }
}
function convertNormalEmphasisForEach(option) {
  convertNormalEmphasis(option, "itemStyle");
  convertNormalEmphasis(option, "lineStyle");
  convertNormalEmphasis(option, "areaStyle");
  convertNormalEmphasis(option, "label");
}
function removeTextStyleInAxis(axesOpt) {
  if (!axesOpt) {
    return;
  }
  if (!(axesOpt instanceof Array)) {
    axesOpt = [axesOpt];
  }
  each(axesOpt, function(axisOpt) {
    if (axisOpt.axisLabel) {
      var labelOpt = axisOpt.axisLabel;
      Object.assign(labelOpt, labelOpt.textStyle);
      labelOpt.textStyle = null;
    }
  });
}
function backwardCompat(option) {
  each(option.series, function(series) {
    if (indexOf(GL_SERIES, series.type) >= 0) {
      convertNormalEmphasisForEach(series);
      if (series.coordinateSystem === "mapbox") {
        series.coordinateSystem = "mapbox3D";
        option.mapbox3D = option.mapbox;
      }
    }
  });
  removeTextStyleInAxis(option.xAxis3D);
  removeTextStyleInAxis(option.yAxis3D);
  removeTextStyleInAxis(option.zAxis3D);
  removeTextStyleInAxis(option.grid3D);
  convertNormalEmphasis(option.geo3D);
}
function EChartsGL(zr) {
  this._layers = {};
  this._zr = zr;
}
EChartsGL.prototype.update = function(ecModel, api) {
  var self = this;
  var zr = api.getZr();
  if (!zr.getWidth() || !zr.getHeight()) {
    console.warn("Dom has no width or height");
    return;
  }
  function getLayerGL(model) {
    zr.setSleepAfterStill(0);
    var zlevel2;
    if (model.coordinateSystem && model.coordinateSystem.model) {
      zlevel2 = model.get("zlevel");
    } else {
      zlevel2 = model.get("zlevel");
    }
    var layers = self._layers;
    var layerGL = layers[zlevel2];
    if (!layerGL) {
      layerGL = layers[zlevel2] = new LayerGL$1("gl-" + zlevel2, zr);
      if (zr.painter.isSingleCanvas()) {
        layerGL.virtual = true;
        var img = new ZRImage({
          z: 1e4,
          style: {
            image: layerGL.renderer.canvas
          },
          silent: true
        });
        layerGL.__hostImage = img;
        zr.add(img);
      }
      zr.painter.insertLayer(zlevel2, layerGL);
    }
    if (layerGL.__hostImage) {
      layerGL.__hostImage.setStyle({
        width: layerGL.renderer.getWidth(),
        height: layerGL.renderer.getHeight()
      });
    }
    return layerGL;
  }
  function setSilent(groupGL, silent) {
    if (groupGL) {
      groupGL.traverse(function(mesh2) {
        if (mesh2.isRenderable && mesh2.isRenderable()) {
          mesh2.ignorePicking = mesh2.$ignorePicking != null ? mesh2.$ignorePicking : silent;
        }
      });
    }
  }
  for (var zlevel in this._layers) {
    this._layers[zlevel].removeViewsAll();
  }
  ecModel.eachComponent(function(componentType, componentModel) {
    if (componentType !== "series") {
      var view = api.getViewOfComponentModel(componentModel);
      var coordSys = componentModel.coordinateSystem;
      if (view.__ecgl__) {
        var viewGL;
        if (coordSys) {
          if (!coordSys.viewGL) {
            console.error("Can't find viewGL in coordinateSystem of component " + componentModel.id);
            return;
          }
          viewGL = coordSys.viewGL;
        } else {
          if (!componentModel.viewGL) {
            console.error("Can't find viewGL of component " + componentModel.id);
            return;
          }
          viewGL = coordSys.viewGL;
        }
        var viewGL = coordSys.viewGL;
        var layerGL = getLayerGL(componentModel);
        layerGL.addView(viewGL);
        view.afterRender && view.afterRender(componentModel, ecModel, api, layerGL);
        setSilent(view.groupGL, componentModel.get("silent"));
      }
    }
  });
  ecModel.eachSeries(function(seriesModel) {
    var chartView = api.getViewOfSeriesModel(seriesModel);
    var coordSys = seriesModel.coordinateSystem;
    if (chartView.__ecgl__) {
      if (coordSys && !coordSys.viewGL && !chartView.viewGL) {
        console.error("Can't find viewGL of series " + chartView.id);
        return;
      }
      var viewGL = coordSys && coordSys.viewGL || chartView.viewGL;
      var layerGL = getLayerGL(seriesModel);
      layerGL.addView(viewGL);
      chartView.afterRender && chartView.afterRender(seriesModel, ecModel, api, layerGL);
      setSilent(chartView.groupGL, seriesModel.get("silent"));
    }
  });
};
registerPostInit(function(chart) {
  var zr = chart.getZr();
  var oldDispose = zr.painter.dispose;
  zr.painter.dispose = function() {
    this.eachOtherLayer(function(layer) {
      if (layer instanceof LayerGL$1) {
        layer.dispose();
      }
    });
    oldDispose.call(this);
  };
  zr.painter.getRenderedCanvas = function(opts) {
    opts = opts || {};
    if (this._singleCanvas) {
      return this._layers[0].dom;
    }
    var canvas = document.createElement("canvas");
    var dpr = opts.pixelRatio || this.dpr;
    canvas.width = this.getWidth() * dpr;
    canvas.height = this.getHeight() * dpr;
    var ctx = canvas.getContext("2d");
    ctx.dpr = dpr;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (opts.backgroundColor) {
      ctx.fillStyle = opts.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    var displayList = this.storage.getDisplayList(true);
    var scope = {};
    var zlevel;
    var self = this;
    function findAndDrawOtherLayer(smaller, larger) {
      var zlevelList = self._zlevelList;
      if (smaller == null) {
        smaller = -Infinity;
      }
      var intermediateLayer;
      for (var i2 = 0; i2 < zlevelList.length; i2++) {
        var z = zlevelList[i2];
        var layer2 = self._layers[z];
        if (!layer2.__builtin__ && z > smaller && z < larger) {
          intermediateLayer = layer2;
          break;
        }
      }
      if (intermediateLayer && intermediateLayer.renderToCanvas) {
        ctx.save();
        intermediateLayer.renderToCanvas(ctx);
        ctx.restore();
      }
    }
    var layer = {
      ctx
    };
    for (var i = 0; i < displayList.length; i++) {
      var el = displayList[i];
      if (el.zlevel !== zlevel) {
        findAndDrawOtherLayer(zlevel, el.zlevel);
        zlevel = el.zlevel;
      }
      this._doPaintEl(el, layer, true, null, scope);
    }
    findAndDrawOtherLayer(zlevel, Infinity);
    return canvas;
  };
});
registerPostUpdate(function(ecModel, api) {
  var zr = api.getZr();
  var egl = zr.__egl = zr.__egl || new EChartsGL(zr);
  egl.update(ecModel, api);
});
registerPreprocessor(backwardCompat);
var glmatrix = {
  vec2: vec2$2,
  vec3: vec3$8,
  vec4: vec4$1,
  mat2: mat2$1,
  mat2d: mat2d$1,
  mat3: mat3$1,
  mat4: mat4$2,
  quat: quat$1
};
var componentShadingMixin = {
  defaultOption: {
    shading: null,
    realisticMaterial: {
      textureTiling: 1,
      textureOffset: 0,
      detailTexture: null
    },
    lambertMaterial: {
      textureTiling: 1,
      textureOffset: 0,
      detailTexture: null
    },
    colorMaterial: {
      textureTiling: 1,
      textureOffset: 0,
      detailTexture: null
    },
    hatchingMaterial: {
      textureTiling: 1,
      textureOffset: 0,
      paperColor: "#fff"
    }
  }
};
function getItemVisualColor(data, idx) {
  const style = data.getItemVisual(idx, "style");
  if (style) {
    const drawType = data.getVisual("drawType");
    return style[drawType];
  }
}
function getItemVisualOpacity(data, idx) {
  const style = data.getItemVisual(idx, "style");
  return style && style.opacity;
}
var dynamicConvertMixin = {
  convertToDynamicArray: function(clear) {
    if (clear) {
      this.resetOffset();
    }
    var attributes = this.attributes;
    for (var name in attributes) {
      if (clear || !attributes[name].value) {
        attributes[name].value = [];
      } else {
        attributes[name].value = Array.prototype.slice.call(attributes[name].value);
      }
    }
    if (clear || !this.indices) {
      this.indices = [];
    } else {
      this.indices = Array.prototype.slice.call(this.indices);
    }
  },
  convertToTypedArray: function() {
    var attributes = this.attributes;
    for (var name in attributes) {
      if (attributes[name].value && attributes[name].value.length > 0) {
        attributes[name].value = new Float32Array(attributes[name].value);
      } else {
        attributes[name].value = null;
      }
    }
    if (this.indices && this.indices.length > 0) {
      this.indices = this.vertexCount > 65535 ? new Uint32Array(this.indices) : new Uint16Array(this.indices);
    }
    this.dirty();
  }
};
function swap(arr, a, b) {
  var tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
}
function partition(arr, pivot, left, right, compare) {
  var storeIndex = left;
  var pivotValue = arr[pivot];
  swap(arr, pivot, right);
  for (var v = left; v < right; v++) {
    if (compare(arr[v], pivotValue) < 0) {
      swap(arr, v, storeIndex);
      storeIndex++;
    }
  }
  swap(arr, right, storeIndex);
  return storeIndex;
}
function quickSort(array, compare, left, right) {
  if (left < right) {
    var pivot = Math.floor((left + right) / 2);
    var newPivot = partition(array, pivot, left, right, compare);
    quickSort(array, compare, left, newPivot - 1);
    quickSort(array, compare, newPivot + 1, right);
  }
}
function ProgressiveQuickSort() {
  this._parts = [];
}
ProgressiveQuickSort.prototype.step = function(arr, compare, frame) {
  var len = arr.length;
  if (frame === 0) {
    this._parts = [];
    this._sorted = false;
    var pivot = Math.floor(len / 2);
    this._parts.push({
      pivot,
      left: 0,
      right: len - 1
    });
    this._currentSortPartIdx = 0;
  }
  if (this._sorted) {
    return;
  }
  var parts = this._parts;
  if (parts.length === 0) {
    this._sorted = true;
    return true;
  } else if (parts.length < 512) {
    for (var i = 0; i < parts.length; i++) {
      parts[i].pivot = partition(arr, parts[i].pivot, parts[i].left, parts[i].right, compare);
    }
    var subdividedParts = [];
    for (var i = 0; i < parts.length; i++) {
      var left = parts[i].left;
      var right = parts[i].pivot - 1;
      if (right > left) {
        subdividedParts.push({
          pivot: Math.floor((right + left) / 2),
          left,
          right
        });
      }
      var left = parts[i].pivot + 1;
      var right = parts[i].right;
      if (right > left) {
        subdividedParts.push({
          pivot: Math.floor((right + left) / 2),
          left,
          right
        });
      }
    }
    parts = this._parts = subdividedParts;
  } else {
    for (var i = 0; i < Math.floor(parts.length / 10); i++) {
      var idx = parts.length - 1 - this._currentSortPartIdx;
      quickSort(arr, compare, parts[idx].left, parts[idx].right);
      this._currentSortPartIdx++;
      if (this._currentSortPartIdx === parts.length) {
        this._sorted = true;
        return true;
      }
    }
  }
  return false;
};
ProgressiveQuickSort.sort = quickSort;
var vec3$6 = glmatrix.vec3;
var p0 = vec3$6.create();
var p1 = vec3$6.create();
var p2 = vec3$6.create();
var trianglesSortMixin = {
  needsSortTriangles: function() {
    return this.indices && this.sortTriangles;
  },
  needsSortTrianglesProgressively: function() {
    return this.needsSortTriangles() && this.triangleCount >= 2e4;
  },
  doSortTriangles: function(cameraPos, frame) {
    var indices = this.indices;
    if (frame === 0) {
      var posAttr = this.attributes.position;
      var cameraPos = cameraPos.array;
      if (!this._triangleZList || this._triangleZList.length !== this.triangleCount) {
        this._triangleZList = new Float32Array(this.triangleCount);
        this._sortedTriangleIndices = new Uint32Array(this.triangleCount);
        this._indicesTmp = new indices.constructor(indices.length);
        this._triangleZListTmp = new Float32Array(this.triangleCount);
      }
      var cursor = 0;
      var firstZ;
      for (var i = 0; i < indices.length; ) {
        posAttr.get(indices[i++], p0);
        posAttr.get(indices[i++], p1);
        posAttr.get(indices[i++], p2);
        var z0 = vec3$6.sqrDist(p0, cameraPos);
        var z1 = vec3$6.sqrDist(p1, cameraPos);
        var z2 = vec3$6.sqrDist(p2, cameraPos);
        var zMax = Math.min(z0, z1);
        zMax = Math.min(zMax, z2);
        if (i === 3) {
          firstZ = zMax;
          zMax = 0;
        } else {
          zMax = zMax - firstZ;
        }
        this._triangleZList[cursor++] = zMax;
      }
    }
    var sortedTriangleIndices = this._sortedTriangleIndices;
    for (var i = 0; i < sortedTriangleIndices.length; i++) {
      sortedTriangleIndices[i] = i;
    }
    if (this.triangleCount < 2e4) {
      if (frame === 0) {
        this._simpleSort(true);
      }
    } else {
      for (var i = 0; i < 3; i++) {
        this._progressiveQuickSort(frame * 3 + i);
      }
    }
    var targetIndices = this._indicesTmp;
    var targetTriangleZList = this._triangleZListTmp;
    var faceZList = this._triangleZList;
    for (var i = 0; i < this.triangleCount; i++) {
      var fromIdx3 = sortedTriangleIndices[i] * 3;
      var toIdx3 = i * 3;
      targetIndices[toIdx3++] = indices[fromIdx3++];
      targetIndices[toIdx3++] = indices[fromIdx3++];
      targetIndices[toIdx3] = indices[fromIdx3];
      targetTriangleZList[i] = faceZList[sortedTriangleIndices[i]];
    }
    var tmp = this._indicesTmp;
    this._indicesTmp = this.indices;
    this.indices = tmp;
    var tmp = this._triangleZListTmp;
    this._triangleZListTmp = this._triangleZList;
    this._triangleZList = tmp;
    this.dirtyIndices();
  },
  _simpleSort: function(useNativeQuickSort) {
    var faceZList = this._triangleZList;
    var sortedTriangleIndices = this._sortedTriangleIndices;
    function compare(a, b) {
      return faceZList[b] - faceZList[a];
    }
    if (useNativeQuickSort) {
      Array.prototype.sort.call(sortedTriangleIndices, compare);
    } else {
      ProgressiveQuickSort.sort(sortedTriangleIndices, compare, 0, sortedTriangleIndices.length - 1);
    }
  },
  _progressiveQuickSort: function(frame) {
    var faceZList = this._triangleZList;
    var sortedTriangleIndices = this._sortedTriangleIndices;
    this._quickSort = this._quickSort || new ProgressiveQuickSort();
    this._quickSort.step(sortedTriangleIndices, function(a, b) {
      return faceZList[b] - faceZList[a];
    }, frame);
  }
};
function ZRTextureAtlasSurfaceNode(zr, offsetX, offsetY, width, height, gap, dpr) {
  this._zr = zr;
  this._x = 0;
  this._y = 0;
  this._rowHeight = 0;
  this.width = width;
  this.height = height;
  this.offsetX = offsetX;
  this.offsetY = offsetY;
  this.dpr = dpr;
  this.gap = gap;
}
ZRTextureAtlasSurfaceNode.prototype = {
  constructor: ZRTextureAtlasSurfaceNode,
  clear: function() {
    this._x = 0;
    this._y = 0;
    this._rowHeight = 0;
  },
  add: function(el, width, height) {
    var rect = el.getBoundingRect();
    if (width == null) {
      width = rect.width;
    }
    if (height == null) {
      height = rect.height;
    }
    width *= this.dpr;
    height *= this.dpr;
    this._fitElement(el, width, height);
    var x = this._x;
    var y = this._y;
    var canvasWidth = this.width * this.dpr;
    var canvasHeight = this.height * this.dpr;
    var gap = this.gap;
    if (x + width + gap > canvasWidth) {
      x = this._x = 0;
      y += this._rowHeight + gap;
      this._y = y;
      this._rowHeight = 0;
    }
    this._x += width + gap;
    this._rowHeight = Math.max(this._rowHeight, height);
    if (y + height + gap > canvasHeight) {
      return null;
    }
    el.x += this.offsetX * this.dpr + x;
    el.y += this.offsetY * this.dpr + y;
    this._zr.add(el);
    var coordsOffset = [this.offsetX / this.width, this.offsetY / this.height];
    var coords = [[x / canvasWidth + coordsOffset[0], y / canvasHeight + coordsOffset[1]], [(x + width) / canvasWidth + coordsOffset[0], (y + height) / canvasHeight + coordsOffset[1]]];
    return coords;
  },
  _fitElement: function(el, spriteWidth, spriteHeight) {
    var rect = el.getBoundingRect();
    var scaleX = spriteWidth / rect.width;
    var scaleY = spriteHeight / rect.height;
    el.x = -rect.x * scaleX;
    el.y = -rect.y * scaleY;
    el.scaleX = scaleX;
    el.scaleY = scaleY;
    el.update();
  }
};
function ZRTextureAtlasSurface(opt) {
  opt = opt || {};
  opt.width = opt.width || 512;
  opt.height = opt.height || 512;
  opt.devicePixelRatio = opt.devicePixelRatio || 1;
  opt.gap = opt.gap == null ? 2 : opt.gap;
  var canvas = document.createElement("canvas");
  canvas.width = opt.width * opt.devicePixelRatio;
  canvas.height = opt.height * opt.devicePixelRatio;
  this._canvas = canvas;
  this._texture = new Texture2D$1({
    image: canvas,
    flipY: false
  });
  var self = this;
  this._zr = init(canvas);
  var oldRefreshImmediately = this._zr.refreshImmediately;
  this._zr.refreshImmediately = function() {
    oldRefreshImmediately.call(this);
    self._texture.dirty();
    self.onupdate && self.onupdate();
  };
  this._dpr = opt.devicePixelRatio;
  this._coords = {};
  this.onupdate = opt.onupdate;
  this._gap = opt.gap;
  this._textureAtlasNodes = [new ZRTextureAtlasSurfaceNode(this._zr, 0, 0, opt.width, opt.height, this._gap, this._dpr)];
  this._nodeWidth = opt.width;
  this._nodeHeight = opt.height;
  this._currentNodeIdx = 0;
}
ZRTextureAtlasSurface.prototype = {
  clear: function() {
    for (var i = 0; i < this._textureAtlasNodes.length; i++) {
      this._textureAtlasNodes[i].clear();
    }
    this._currentNodeIdx = 0;
    this._zr.clear();
    this._coords = {};
  },
  getWidth: function() {
    return this._width;
  },
  getHeight: function() {
    return this._height;
  },
  getTexture: function() {
    return this._texture;
  },
  getDevicePixelRatio: function() {
    return this._dpr;
  },
  getZr: function() {
    return this._zr;
  },
  _getCurrentNode: function() {
    return this._textureAtlasNodes[this._currentNodeIdx];
  },
  _expand: function() {
    this._currentNodeIdx++;
    if (this._textureAtlasNodes[this._currentNodeIdx]) {
      return this._textureAtlasNodes[this._currentNodeIdx];
    }
    var maxSize = 4096 / this._dpr;
    var textureAtlasNodes = this._textureAtlasNodes;
    var nodeLen = textureAtlasNodes.length;
    var offsetX = nodeLen * this._nodeWidth % maxSize;
    var offsetY = Math.floor(nodeLen * this._nodeWidth / maxSize) * this._nodeHeight;
    if (offsetY >= maxSize) {
      return;
    }
    var width = (offsetX + this._nodeWidth) * this._dpr;
    var height = (offsetY + this._nodeHeight) * this._dpr;
    try {
      this._zr.resize({
        width,
        height
      });
    } catch (e2) {
      this._canvas.width = width;
      this._canvas.height = height;
    }
    var newNode = new ZRTextureAtlasSurfaceNode(this._zr, offsetX, offsetY, this._nodeWidth, this._nodeHeight, this._gap, this._dpr);
    this._textureAtlasNodes.push(newNode);
    return newNode;
  },
  add: function(el, width, height) {
    if (this._coords[el.id]) {
      return this._coords[el.id];
    }
    var coords = this._getCurrentNode().add(el, width, height);
    if (!coords) {
      var newNode = this._expand();
      if (!newNode) {
        return;
      }
      coords = newNode.add(el, width, height);
    }
    this._coords[el.id] = coords;
    return coords;
  },
  getCoordsScale: function() {
    var dpr = this._dpr;
    return [this._nodeWidth / this._canvas.width * dpr, this._nodeHeight / this._canvas.height * dpr];
  },
  getCoords: function(id) {
    return this._coords[id];
  },
  dispose: function() {
    this._zr.dispose();
  }
};
var squareTriangles = [0, 1, 2, 0, 2, 3];
var SpritesGeometry = Geometry$1.extend(function() {
  return {
    attributes: {
      position: new Geometry$1.Attribute("position", "float", 3, "POSITION"),
      texcoord: new Geometry$1.Attribute("texcoord", "float", 2, "TEXCOORD_0"),
      offset: new Geometry$1.Attribute("offset", "float", 2),
      color: new Geometry$1.Attribute("color", "float", 4, "COLOR")
    }
  };
}, {
  resetOffset: function() {
    this._vertexOffset = 0;
    this._faceOffset = 0;
  },
  setSpriteCount: function(spriteCount) {
    this._spriteCount = spriteCount;
    var vertexCount = spriteCount * 4;
    var triangleCount = spriteCount * 2;
    if (this.vertexCount !== vertexCount) {
      this.attributes.position.init(vertexCount);
      this.attributes.offset.init(vertexCount);
      this.attributes.color.init(vertexCount);
    }
    if (this.triangleCount !== triangleCount) {
      this.indices = vertexCount > 65535 ? new Uint32Array(triangleCount * 3) : new Uint16Array(triangleCount * 3);
    }
  },
  setSpriteAlign: function(spriteOffset, size, align, verticalAlign, margin) {
    if (align == null) {
      align = "left";
    }
    if (verticalAlign == null) {
      verticalAlign = "top";
    }
    var leftOffset, topOffset, rightOffset, bottomOffset;
    margin = margin || 0;
    switch (align) {
      case "left":
        leftOffset = margin;
        rightOffset = size[0] + margin;
        break;
      case "center":
      case "middle":
        leftOffset = -size[0] / 2;
        rightOffset = size[0] / 2;
        break;
      case "right":
        leftOffset = -size[0] - margin;
        rightOffset = -margin;
        break;
    }
    switch (verticalAlign) {
      case "bottom":
        topOffset = margin;
        bottomOffset = size[1] + margin;
        break;
      case "middle":
        topOffset = -size[1] / 2;
        bottomOffset = size[1] / 2;
        break;
      case "top":
        topOffset = -size[1] - margin;
        bottomOffset = -margin;
        break;
    }
    var vertexOffset = spriteOffset * 4;
    var offsetAttr = this.attributes.offset;
    offsetAttr.set(vertexOffset, [leftOffset, bottomOffset]);
    offsetAttr.set(vertexOffset + 1, [rightOffset, bottomOffset]);
    offsetAttr.set(vertexOffset + 2, [rightOffset, topOffset]);
    offsetAttr.set(vertexOffset + 3, [leftOffset, topOffset]);
  },
  addSprite: function(position, size, coords, align, verticalAlign, screenMargin) {
    var vertexOffset = this._vertexOffset;
    this.setSprite(this._vertexOffset / 4, position, size, coords, align, verticalAlign, screenMargin);
    for (var i = 0; i < squareTriangles.length; i++) {
      this.indices[this._faceOffset * 3 + i] = squareTriangles[i] + vertexOffset;
    }
    this._faceOffset += 2;
    this._vertexOffset += 4;
    return vertexOffset / 4;
  },
  setSprite: function(spriteOffset, position, size, coords, align, verticalAlign, screenMargin) {
    var vertexOffset = spriteOffset * 4;
    var attributes = this.attributes;
    for (var i = 0; i < 4; i++) {
      attributes.position.set(vertexOffset + i, position);
    }
    var texcoordAttr = attributes.texcoord;
    texcoordAttr.set(vertexOffset, [coords[0][0], coords[0][1]]);
    texcoordAttr.set(vertexOffset + 1, [coords[1][0], coords[0][1]]);
    texcoordAttr.set(vertexOffset + 2, [coords[1][0], coords[1][1]]);
    texcoordAttr.set(vertexOffset + 3, [coords[0][0], coords[1][1]]);
    this.setSpriteAlign(spriteOffset, size, align, verticalAlign, screenMargin);
  }
});
defaults(SpritesGeometry.prototype, dynamicConvertMixin);
var SpritesGeometry$1 = SpritesGeometry;
var labelsGLSL = "@export ecgl.labels.vertex\n\nattribute vec3 position: POSITION;\nattribute vec2 texcoord: TEXCOORD_0;\nattribute vec2 offset;\n#ifdef VERTEX_COLOR\nattribute vec4 a_Color : COLOR;\nvarying vec4 v_Color;\n#endif\n\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\nuniform vec4 viewport : VIEWPORT;\n\nvarying vec2 v_Texcoord;\n\nvoid main()\n{\n vec4 proj = worldViewProjection * vec4(position, 1.0);\n\n vec2 screen = (proj.xy / abs(proj.w) + 1.0) * 0.5 * viewport.zw;\n\n screen += offset;\n\n proj.xy = (screen / viewport.zw - 0.5) * 2.0 * abs(proj.w);\n gl_Position = proj;\n#ifdef VERTEX_COLOR\n v_Color = a_Color;\n#endif\n v_Texcoord = texcoord;\n}\n@end\n\n\n@export ecgl.labels.fragment\n\nuniform vec3 color : [1.0, 1.0, 1.0];\nuniform float alpha : 1.0;\nuniform sampler2D textureAtlas;\nuniform vec2 uvScale: [1.0, 1.0];\n\n#ifdef VERTEX_COLOR\nvarying vec4 v_Color;\n#endif\nvarying float v_Miter;\n\nvarying vec2 v_Texcoord;\n\nvoid main()\n{\n gl_FragColor = vec4(color, alpha) * texture2D(textureAtlas, v_Texcoord * uvScale);\n#ifdef VERTEX_COLOR\n gl_FragColor *= v_Color;\n#endif\n}\n\n@end";
graphicGL$1.Shader.import(labelsGLSL);
var LabelsMesh = graphicGL$1.Mesh.extend(function() {
  var geometry = new SpritesGeometry$1({
    dynamic: true
  });
  var material = new graphicGL$1.Material({
    shader: graphicGL$1.createShader("ecgl.labels"),
    transparent: true,
    depthMask: false
  });
  return {
    geometry,
    material,
    culling: false,
    castShadow: false,
    ignorePicking: true
  };
});
var LABEL_NORMAL_SHOW_BIT = 1;
var LABEL_EMPHASIS_SHOW_BIT = 2;
function LabelsBuilder(width, height, api) {
  this._labelsMesh = new LabelsMesh();
  this._labelTextureSurface = new ZRTextureAtlasSurface({
    width: 512,
    height: 512,
    devicePixelRatio: api.getDevicePixelRatio(),
    onupdate: function() {
      api.getZr().refresh();
    }
  });
  this._api = api;
  this._labelsMesh.material.set("textureAtlas", this._labelTextureSurface.getTexture());
}
LabelsBuilder.prototype.getLabelPosition = function(dataIndex, positionDesc, distance) {
  return [0, 0, 0];
};
LabelsBuilder.prototype.getLabelDistance = function(dataIndex, positionDesc, distance) {
  return 0;
};
LabelsBuilder.prototype.getMesh = function() {
  return this._labelsMesh;
};
LabelsBuilder.prototype.updateData = function(data, start, end) {
  if (start == null) {
    start = 0;
  }
  if (end == null) {
    end = data.count();
  }
  if (!this._labelsVisibilitiesBits || this._labelsVisibilitiesBits.length !== end - start) {
    this._labelsVisibilitiesBits = new Uint8Array(end - start);
  }
  var normalLabelVisibilityQuery = ["label", "show"];
  var emphasisLabelVisibilityQuery = ["emphasis", "label", "show"];
  for (var idx = start; idx < end; idx++) {
    var itemModel = data.getItemModel(idx);
    var normalVisibility = itemModel.get(normalLabelVisibilityQuery);
    var emphasisVisibility = itemModel.get(emphasisLabelVisibilityQuery);
    if (emphasisVisibility == null) {
      emphasisVisibility = normalVisibility;
    }
    var bit = (normalVisibility ? LABEL_NORMAL_SHOW_BIT : 0) | (emphasisVisibility ? LABEL_EMPHASIS_SHOW_BIT : 0);
    this._labelsVisibilitiesBits[idx - start] = bit;
  }
  this._start = start;
  this._end = end;
  this._data = data;
};
LabelsBuilder.prototype.updateLabels = function(highlightDataIndices) {
  if (!this._data) {
    return;
  }
  highlightDataIndices = highlightDataIndices || [];
  var hasHighlightData = highlightDataIndices.length > 0;
  var highlightDataIndicesMap = {};
  for (var i = 0; i < highlightDataIndices.length; i++) {
    highlightDataIndicesMap[highlightDataIndices[i]] = true;
  }
  this._labelsMesh.geometry.convertToDynamicArray(true);
  this._labelTextureSurface.clear();
  var normalLabelQuery = ["label"];
  var emphasisLabelQuery = ["emphasis", "label"];
  var seriesModel = this._data.hostModel;
  var data = this._data;
  var seriesLabelModel = seriesModel.getModel(normalLabelQuery);
  var seriesLabelEmphasisModel = seriesModel.getModel(emphasisLabelQuery, seriesLabelModel);
  var textAlignMap = {
    left: "right",
    right: "left",
    top: "center",
    bottom: "center"
  };
  var textVerticalAlignMap = {
    left: "middle",
    right: "middle",
    top: "bottom",
    bottom: "top"
  };
  for (var dataIndex = this._start; dataIndex < this._end; dataIndex++) {
    var isEmphasis = false;
    if (hasHighlightData && highlightDataIndicesMap[dataIndex]) {
      isEmphasis = true;
    }
    var ifShow = this._labelsVisibilitiesBits[dataIndex - this._start] & (isEmphasis ? LABEL_EMPHASIS_SHOW_BIT : LABEL_NORMAL_SHOW_BIT);
    if (!ifShow) {
      continue;
    }
    var itemModel = data.getItemModel(dataIndex);
    var labelModel = itemModel.getModel(isEmphasis ? emphasisLabelQuery : normalLabelQuery, isEmphasis ? seriesLabelEmphasisModel : seriesLabelModel);
    var distance = labelModel.get("distance") || 0;
    var position = labelModel.get("position");
    var dpr = this._api.getDevicePixelRatio();
    var text = seriesModel.getFormattedLabel(dataIndex, isEmphasis ? "emphasis" : "normal");
    if (text == null || text === "") {
      return;
    }
    var textEl = new Text({
      style: createTextStyle(labelModel, {
        text,
        fill: labelModel.get("color") || getItemVisualColor(data, dataIndex) || "#000",
        align: "left",
        verticalAlign: "top",
        opacity: retrieve$1.firstNotNull(labelModel.get("opacity"), getItemVisualOpacity(data, dataIndex), 1)
      })
    });
    var rect = textEl.getBoundingRect();
    var lineHeight = 1.2;
    rect.height *= lineHeight;
    var coords = this._labelTextureSurface.add(textEl);
    var textAlign = textAlignMap[position] || "center";
    var textVerticalAlign = textVerticalAlignMap[position] || "bottom";
    this._labelsMesh.geometry.addSprite(this.getLabelPosition(dataIndex, position, distance), [rect.width * dpr, rect.height * dpr], coords, textAlign, textVerticalAlign, this.getLabelDistance(dataIndex, position, distance) * dpr);
  }
  this._labelsMesh.material.set("uvScale", this._labelTextureSurface.getCoordsScale());
  this._labelTextureSurface.getZr().refreshImmediately();
  this._labelsMesh.geometry.convertToTypedArray();
  this._labelsMesh.geometry.dirty();
};
LabelsBuilder.prototype.dispose = function() {
  this._labelTextureSurface.dispose();
};
var vec3$5 = glmatrix.vec3;
var sampleLinePoints = [[0, 0], [1, 1]];
var LinesGeometry = Geometry$1.extend(function() {
  return {
    segmentScale: 1,
    dynamic: true,
    useNativeLine: true,
    attributes: {
      position: new Geometry$1.Attribute("position", "float", 3, "POSITION"),
      positionPrev: new Geometry$1.Attribute("positionPrev", "float", 3),
      positionNext: new Geometry$1.Attribute("positionNext", "float", 3),
      prevPositionPrev: new Geometry$1.Attribute("prevPositionPrev", "float", 3),
      prevPosition: new Geometry$1.Attribute("prevPosition", "float", 3),
      prevPositionNext: new Geometry$1.Attribute("prevPositionNext", "float", 3),
      offset: new Geometry$1.Attribute("offset", "float", 1),
      color: new Geometry$1.Attribute("color", "float", 4, "COLOR")
    }
  };
}, {
  resetOffset: function() {
    this._vertexOffset = 0;
    this._triangleOffset = 0;
    this._itemVertexOffsets = [];
  },
  setVertexCount: function(nVertex) {
    var attributes = this.attributes;
    if (this.vertexCount !== nVertex) {
      attributes.position.init(nVertex);
      attributes.color.init(nVertex);
      if (!this.useNativeLine) {
        attributes.positionPrev.init(nVertex);
        attributes.positionNext.init(nVertex);
        attributes.offset.init(nVertex);
      }
      if (nVertex > 65535) {
        if (this.indices instanceof Uint16Array) {
          this.indices = new Uint32Array(this.indices);
        }
      } else {
        if (this.indices instanceof Uint32Array) {
          this.indices = new Uint16Array(this.indices);
        }
      }
    }
  },
  setTriangleCount: function(nTriangle) {
    if (this.triangleCount !== nTriangle) {
      if (nTriangle === 0) {
        this.indices = null;
      } else {
        this.indices = this.vertexCount > 65535 ? new Uint32Array(nTriangle * 3) : new Uint16Array(nTriangle * 3);
      }
    }
  },
  _getCubicCurveApproxStep: function(p02, p12, p22, p3) {
    var len = vec3$5.dist(p02, p12) + vec3$5.dist(p22, p12) + vec3$5.dist(p3, p22);
    var step = 1 / (len + 1) * this.segmentScale;
    return step;
  },
  getCubicCurveVertexCount: function(p02, p12, p22, p3) {
    var step = this._getCubicCurveApproxStep(p02, p12, p22, p3);
    var segCount = Math.ceil(1 / step);
    if (!this.useNativeLine) {
      return segCount * 2 + 2;
    } else {
      return segCount * 2;
    }
  },
  getCubicCurveTriangleCount: function(p02, p12, p22, p3) {
    var step = this._getCubicCurveApproxStep(p02, p12, p22, p3);
    var segCount = Math.ceil(1 / step);
    if (!this.useNativeLine) {
      return segCount * 2;
    } else {
      return 0;
    }
  },
  getLineVertexCount: function() {
    return this.getPolylineVertexCount(sampleLinePoints);
  },
  getLineTriangleCount: function() {
    return this.getPolylineTriangleCount(sampleLinePoints);
  },
  getPolylineVertexCount: function(points) {
    var pointsLen;
    if (typeof points === "number") {
      pointsLen = points;
    } else {
      var is2DArray = typeof points[0] !== "number";
      pointsLen = is2DArray ? points.length : points.length / 3;
    }
    return !this.useNativeLine ? (pointsLen - 1) * 2 + 2 : (pointsLen - 1) * 2;
  },
  getPolylineTriangleCount: function(points) {
    var pointsLen;
    if (typeof points === "number") {
      pointsLen = points;
    } else {
      var is2DArray = typeof points[0] !== "number";
      pointsLen = is2DArray ? points.length : points.length / 3;
    }
    return !this.useNativeLine ? Math.max(pointsLen - 1, 0) * 2 : 0;
  },
  addCubicCurve: function(p02, p12, p22, p3, color, lineWidth) {
    if (lineWidth == null) {
      lineWidth = 1;
    }
    var x0 = p02[0], y0 = p02[1], z0 = p02[2];
    var x1 = p12[0], y1 = p12[1], z1 = p12[2];
    var x2 = p22[0], y2 = p22[1], z2 = p22[2];
    var x3 = p3[0], y3 = p3[1], z3 = p3[2];
    var step = this._getCubicCurveApproxStep(p02, p12, p22, p3);
    var step2 = step * step;
    var step3 = step2 * step;
    var pre1 = 3 * step;
    var pre2 = 3 * step2;
    var pre4 = 6 * step2;
    var pre5 = 6 * step3;
    var tmp1x = x0 - x1 * 2 + x2;
    var tmp1y = y0 - y1 * 2 + y2;
    var tmp1z = z0 - z1 * 2 + z2;
    var tmp2x = (x1 - x2) * 3 - x0 + x3;
    var tmp2y = (y1 - y2) * 3 - y0 + y3;
    var tmp2z = (z1 - z2) * 3 - z0 + z3;
    var fx = x0;
    var fy = y0;
    var fz = z0;
    var dfx = (x1 - x0) * pre1 + tmp1x * pre2 + tmp2x * step3;
    var dfy = (y1 - y0) * pre1 + tmp1y * pre2 + tmp2y * step3;
    var dfz = (z1 - z0) * pre1 + tmp1z * pre2 + tmp2z * step3;
    var ddfx = tmp1x * pre4 + tmp2x * pre5;
    var ddfy = tmp1y * pre4 + tmp2y * pre5;
    var ddfz = tmp1z * pre4 + tmp2z * pre5;
    var dddfx = tmp2x * pre5;
    var dddfy = tmp2y * pre5;
    var dddfz = tmp2z * pre5;
    var t = 0;
    var k = 0;
    var segCount = Math.ceil(1 / step);
    var points = new Float32Array((segCount + 1) * 3);
    var points = [];
    var offset = 0;
    for (var k = 0; k < segCount + 1; k++) {
      points[offset++] = fx;
      points[offset++] = fy;
      points[offset++] = fz;
      fx += dfx;
      fy += dfy;
      fz += dfz;
      dfx += ddfx;
      dfy += ddfy;
      dfz += ddfz;
      ddfx += dddfx;
      ddfy += dddfy;
      ddfz += dddfz;
      t += step;
      if (t > 1) {
        fx = dfx > 0 ? Math.min(fx, x3) : Math.max(fx, x3);
        fy = dfy > 0 ? Math.min(fy, y3) : Math.max(fy, y3);
        fz = dfz > 0 ? Math.min(fz, z3) : Math.max(fz, z3);
      }
    }
    return this.addPolyline(points, color, lineWidth);
  },
  addLine: function(p02, p12, color, lineWidth) {
    return this.addPolyline([p02, p12], color, lineWidth);
  },
  addPolyline: function(points, color, lineWidth, startOffset, pointsCount) {
    if (!points.length) {
      return;
    }
    var is2DArray = typeof points[0] !== "number";
    if (pointsCount == null) {
      pointsCount = is2DArray ? points.length : points.length / 3;
    }
    if (pointsCount < 2) {
      return;
    }
    if (startOffset == null) {
      startOffset = 0;
    }
    if (lineWidth == null) {
      lineWidth = 1;
    }
    this._itemVertexOffsets.push(this._vertexOffset);
    var is2DArray = typeof points[0] !== "number";
    var notSharingColor = is2DArray ? typeof color[0] !== "number" : color.length / 4 === pointsCount;
    var positionAttr = this.attributes.position;
    var positionPrevAttr = this.attributes.positionPrev;
    var positionNextAttr = this.attributes.positionNext;
    var colorAttr = this.attributes.color;
    var offsetAttr = this.attributes.offset;
    var indices = this.indices;
    var vertexOffset = this._vertexOffset;
    var point;
    var pointColor;
    lineWidth = Math.max(lineWidth, 0.01);
    for (var k = startOffset; k < pointsCount; k++) {
      if (is2DArray) {
        point = points[k];
        if (notSharingColor) {
          pointColor = color[k];
        } else {
          pointColor = color;
        }
      } else {
        var k3 = k * 3;
        point = point || [];
        point[0] = points[k3];
        point[1] = points[k3 + 1];
        point[2] = points[k3 + 2];
        if (notSharingColor) {
          var k4 = k * 4;
          pointColor = pointColor || [];
          pointColor[0] = color[k4];
          pointColor[1] = color[k4 + 1];
          pointColor[2] = color[k4 + 2];
          pointColor[3] = color[k4 + 3];
        } else {
          pointColor = color;
        }
      }
      if (!this.useNativeLine) {
        if (k < pointsCount - 1) {
          positionPrevAttr.set(vertexOffset + 2, point);
          positionPrevAttr.set(vertexOffset + 3, point);
        }
        if (k > 0) {
          positionNextAttr.set(vertexOffset - 2, point);
          positionNextAttr.set(vertexOffset - 1, point);
        }
        positionAttr.set(vertexOffset, point);
        positionAttr.set(vertexOffset + 1, point);
        colorAttr.set(vertexOffset, pointColor);
        colorAttr.set(vertexOffset + 1, pointColor);
        offsetAttr.set(vertexOffset, lineWidth / 2);
        offsetAttr.set(vertexOffset + 1, -lineWidth / 2);
        vertexOffset += 2;
      } else {
        if (k > 1) {
          positionAttr.copy(vertexOffset, vertexOffset - 1);
          colorAttr.copy(vertexOffset, vertexOffset - 1);
          vertexOffset++;
        }
      }
      if (!this.useNativeLine) {
        if (k > 0) {
          var idx3 = this._triangleOffset * 3;
          var indices = this.indices;
          indices[idx3] = vertexOffset - 4;
          indices[idx3 + 1] = vertexOffset - 3;
          indices[idx3 + 2] = vertexOffset - 2;
          indices[idx3 + 3] = vertexOffset - 3;
          indices[idx3 + 4] = vertexOffset - 1;
          indices[idx3 + 5] = vertexOffset - 2;
          this._triangleOffset += 2;
        }
      } else {
        colorAttr.set(vertexOffset, pointColor);
        positionAttr.set(vertexOffset, point);
        vertexOffset++;
      }
    }
    if (!this.useNativeLine) {
      var start = this._vertexOffset;
      var end = this._vertexOffset + pointsCount * 2;
      positionPrevAttr.copy(start, start + 2);
      positionPrevAttr.copy(start + 1, start + 3);
      positionNextAttr.copy(end - 1, end - 3);
      positionNextAttr.copy(end - 2, end - 4);
    }
    this._vertexOffset = vertexOffset;
    return this._vertexOffset;
  },
  setItemColor: function(idx, color) {
    var startOffset = this._itemVertexOffsets[idx];
    var endOffset = idx < this._itemVertexOffsets.length - 1 ? this._itemVertexOffsets[idx + 1] : this._vertexOffset;
    for (var i = startOffset; i < endOffset; i++) {
      this.attributes.color.set(i, color);
    }
    this.dirty("color");
  },
  currentTriangleOffset: function() {
    return this._triangleOffset;
  },
  currentVertexOffset: function() {
    return this._vertexOffset;
  }
});
defaults(LinesGeometry.prototype, dynamicConvertMixin);
var Lines3DGeometry = LinesGeometry;
var lines3DGLSL = "@export ecgl.lines3D.vertex\n\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\n\nattribute vec3 position: POSITION;\nattribute vec4 a_Color : COLOR;\nvarying vec4 v_Color;\n\nvoid main()\n{\n gl_Position = worldViewProjection * vec4(position, 1.0);\n v_Color = a_Color;\n}\n\n@end\n\n@export ecgl.lines3D.fragment\n\nuniform vec4 color : [1.0, 1.0, 1.0, 1.0];\n\nvarying vec4 v_Color;\n\n@import clay.util.srgb\n\nvoid main()\n{\n#ifdef SRGB_DECODE\n gl_FragColor = sRGBToLinear(color * v_Color);\n#else\n gl_FragColor = color * v_Color;\n#endif\n}\n@end\n\n\n\n@export ecgl.lines3D.clipNear\n\nvec4 clipNear(vec4 p1, vec4 p2) {\n float n = (p1.w - near) / (p1.w - p2.w);\n return vec4(mix(p1.xy, p2.xy, n), -near, near);\n}\n\n@end\n\n@export ecgl.lines3D.expandLine\n#ifdef VERTEX_ANIMATION\n vec4 prevProj = worldViewProjection * vec4(mix(prevPositionPrev, positionPrev, percent), 1.0);\n vec4 currProj = worldViewProjection * vec4(mix(prevPosition, position, percent), 1.0);\n vec4 nextProj = worldViewProjection * vec4(mix(prevPositionNext, positionNext, percent), 1.0);\n#else\n vec4 prevProj = worldViewProjection * vec4(positionPrev, 1.0);\n vec4 currProj = worldViewProjection * vec4(position, 1.0);\n vec4 nextProj = worldViewProjection * vec4(positionNext, 1.0);\n#endif\n\n if (currProj.w < 0.0) {\n if (nextProj.w > 0.0) {\n currProj = clipNear(currProj, nextProj);\n }\n else if (prevProj.w > 0.0) {\n currProj = clipNear(currProj, prevProj);\n }\n }\n\n vec2 prevScreen = (prevProj.xy / abs(prevProj.w) + 1.0) * 0.5 * viewport.zw;\n vec2 currScreen = (currProj.xy / abs(currProj.w) + 1.0) * 0.5 * viewport.zw;\n vec2 nextScreen = (nextProj.xy / abs(nextProj.w) + 1.0) * 0.5 * viewport.zw;\n\n vec2 dir;\n float len = offset;\n if (position == positionPrev) {\n dir = normalize(nextScreen - currScreen);\n }\n else if (position == positionNext) {\n dir = normalize(currScreen - prevScreen);\n }\n else {\n vec2 dirA = normalize(currScreen - prevScreen);\n vec2 dirB = normalize(nextScreen - currScreen);\n\n vec2 tanget = normalize(dirA + dirB);\n\n float miter = 1.0 / max(dot(tanget, dirA), 0.5);\n len *= miter;\n dir = tanget;\n }\n\n dir = vec2(-dir.y, dir.x) * len;\n currScreen += dir;\n\n currProj.xy = (currScreen / viewport.zw - 0.5) * 2.0 * abs(currProj.w);\n@end\n\n\n@export ecgl.meshLines3D.vertex\n\nattribute vec3 position: POSITION;\nattribute vec3 positionPrev;\nattribute vec3 positionNext;\nattribute float offset;\nattribute vec4 a_Color : COLOR;\n\n#ifdef VERTEX_ANIMATION\nattribute vec3 prevPosition;\nattribute vec3 prevPositionPrev;\nattribute vec3 prevPositionNext;\nuniform float percent : 1.0;\n#endif\n\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\nuniform vec4 viewport : VIEWPORT;\nuniform float near : NEAR;\n\nvarying vec4 v_Color;\n\n@import ecgl.common.wireframe.vertexHeader\n\n@import ecgl.lines3D.clipNear\n\nvoid main()\n{\n @import ecgl.lines3D.expandLine\n\n gl_Position = currProj;\n\n v_Color = a_Color;\n\n @import ecgl.common.wireframe.vertexMain\n}\n@end\n\n\n@export ecgl.meshLines3D.fragment\n\nuniform vec4 color : [1.0, 1.0, 1.0, 1.0];\n\nvarying vec4 v_Color;\n\n@import ecgl.common.wireframe.fragmentHeader\n\n@import clay.util.srgb\n\nvoid main()\n{\n#ifdef SRGB_DECODE\n gl_FragColor = sRGBToLinear(color * v_Color);\n#else\n gl_FragColor = color * v_Color;\n#endif\n\n @import ecgl.common.wireframe.fragmentMain\n}\n\n@end";
var vec3$4 = glmatrix.vec3;
var vec2 = glmatrix.vec2;
var normalize = vec3$4.normalize;
var cross = vec3$4.cross;
var sub = vec3$4.sub;
var add = vec3$4.add;
var create = vec3$4.create;
var normal = create();
var tangent = create();
var bitangent = create();
var halfVector = create();
var coord0 = [];
var coord1 = [];
function getCubicPointsOnGlobe(coords, coordSys) {
  vec2.copy(coord0, coords[0]);
  vec2.copy(coord1, coords[1]);
  var pts = [];
  var p02 = pts[0] = create();
  var p12 = pts[1] = create();
  var p22 = pts[2] = create();
  var p3 = pts[3] = create();
  coordSys.dataToPoint(coord0, p02);
  coordSys.dataToPoint(coord1, p3);
  normalize(normal, p02);
  sub(tangent, p3, p02);
  normalize(tangent, tangent);
  cross(bitangent, tangent, normal);
  normalize(bitangent, bitangent);
  cross(tangent, normal, bitangent);
  add(p12, normal, tangent);
  normalize(p12, p12);
  normalize(normal, p3);
  sub(tangent, p02, p3);
  normalize(tangent, tangent);
  cross(bitangent, tangent, normal);
  normalize(bitangent, bitangent);
  cross(tangent, normal, bitangent);
  add(p22, normal, tangent);
  normalize(p22, p22);
  add(halfVector, p02, p3);
  normalize(halfVector, halfVector);
  var projDist = vec3$4.dot(p02, halfVector);
  var cosTheta = vec3$4.dot(halfVector, p12);
  var len = (Math.max(vec3$4.len(p02), vec3$4.len(p3)) - projDist) / cosTheta * 2;
  vec3$4.scaleAndAdd(p12, p02, p12, len);
  vec3$4.scaleAndAdd(p22, p3, p22, len);
  return pts;
}
function getCubicPointsOnPlane(coords, coordSys, up) {
  var pts = [];
  var p02 = pts[0] = vec3$4.create();
  var p12 = pts[1] = vec3$4.create();
  var p22 = pts[2] = vec3$4.create();
  var p3 = pts[3] = vec3$4.create();
  coordSys.dataToPoint(coords[0], p02);
  coordSys.dataToPoint(coords[1], p3);
  var len = vec3$4.dist(p02, p3);
  vec3$4.lerp(p12, p02, p3, 0.3);
  vec3$4.lerp(p22, p02, p3, 0.3);
  vec3$4.scaleAndAdd(p12, p12, up, Math.min(len * 0.1, 10));
  vec3$4.scaleAndAdd(p22, p22, up, Math.min(len * 0.1, 10));
  return pts;
}
function getPolylinePoints(coords, coordSys) {
  var pts = new Float32Array(coords.length * 3);
  var off = 0;
  var pt = [];
  for (var i = 0; i < coords.length; i++) {
    coordSys.dataToPoint(coords[i], pt);
    pts[off++] = pt[0];
    pts[off++] = pt[1];
    pts[off++] = pt[2];
  }
  return pts;
}
function prepareCoords(data) {
  var coordsList = [];
  data.each(function(idx) {
    var itemModel = data.getItemModel(idx);
    var coords = itemModel.option instanceof Array ? itemModel.option : itemModel.getShallow("coords", true);
    coordsList.push(coords);
  });
  return {
    coordsList
  };
}
function layoutGlobe(seriesModel, coordSys) {
  var data = seriesModel.getData();
  var isPolyline = seriesModel.get("polyline");
  data.setLayout("lineType", isPolyline ? "polyline" : "cubicBezier");
  var res = prepareCoords(data);
  data.each(function(idx) {
    var coords = res.coordsList[idx];
    var getPointsMethod = isPolyline ? getPolylinePoints : getCubicPointsOnGlobe;
    data.setItemLayout(idx, getPointsMethod(coords, coordSys));
  });
}
function layoutOnPlane(seriesModel, coordSys, normal2) {
  var data = seriesModel.getData();
  var isPolyline = seriesModel.get("polyline");
  var res = prepareCoords(data);
  data.setLayout("lineType", isPolyline ? "polyline" : "cubicBezier");
  data.each(function(idx) {
    var coords = res.coordsList[idx];
    var pts = isPolyline ? getPolylinePoints(coords, coordSys) : getCubicPointsOnPlane(coords, coordSys, normal2);
    data.setItemLayout(idx, pts);
  });
}
function lines3DLayout(ecModel, api) {
  ecModel.eachSeriesByType("lines3D", function(seriesModel) {
    var coordSys = seriesModel.coordinateSystem;
    if (coordSys.type === "globe") {
      layoutGlobe(seriesModel, coordSys);
    } else if (coordSys.type === "geo3D") {
      layoutOnPlane(seriesModel, coordSys, [0, 1, 0]);
    } else if (coordSys.type === "mapbox3D" || coordSys.type === "maptalks3D") {
      layoutOnPlane(seriesModel, coordSys, [0, 0, 1]);
    }
  });
}
var Lines3DSeries = SeriesModel.extend({
  type: "series.lines3D",
  dependencies: ["globe"],
  visualStyleAccessPath: "lineStyle",
  visualDrawType: "stroke",
  getInitialData: function(option, ecModel) {
    var lineData = new SeriesData$1(["value"], this);
    lineData.hasItemOption = false;
    lineData.initData(option.data, [], function(dataItem, dimName, dataIndex, dimIndex) {
      if (dataItem instanceof Array) {
        return NaN;
      } else {
        lineData.hasItemOption = true;
        var value = dataItem.value;
        if (value != null) {
          return value instanceof Array ? value[dimIndex] : value;
        }
      }
    });
    return lineData;
  },
  defaultOption: {
    coordinateSystem: "globe",
    globeIndex: 0,
    geo3DIndex: 0,
    zlevel: -10,
    polyline: false,
    effect: {
      show: false,
      period: 4,
      trailWidth: 4,
      trailLength: 0.2,
      spotIntensity: 6
    },
    silent: true,
    blendMode: "source-over",
    lineStyle: {
      width: 1,
      opacity: 0.5
    }
  }
});
var trail2GLSL = "@export ecgl.trail2.vertex\nattribute vec3 position: POSITION;\nattribute vec3 positionPrev;\nattribute vec3 positionNext;\nattribute float offset;\nattribute float dist;\nattribute float distAll;\nattribute float start;\n\nattribute vec4 a_Color : COLOR;\n\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\nuniform vec4 viewport : VIEWPORT;\nuniform float near : NEAR;\n\nuniform float speed : 0;\nuniform float trailLength: 0.3;\nuniform float time;\nuniform float period: 1000;\n\nuniform float spotSize: 1;\n\nvarying vec4 v_Color;\nvarying float v_Percent;\nvarying float v_SpotPercent;\n\n@import ecgl.common.wireframe.vertexHeader\n\n@import ecgl.lines3D.clipNear\n\nvoid main()\n{\n @import ecgl.lines3D.expandLine\n\n gl_Position = currProj;\n\n v_Color = a_Color;\n\n @import ecgl.common.wireframe.vertexMain\n\n#ifdef CONSTANT_SPEED\n float t = mod((speed * time + start) / distAll, 1. + trailLength) - trailLength;\n#else\n float t = mod((time + start) / period, 1. + trailLength) - trailLength;\n#endif\n\n float trailLen = distAll * trailLength;\n\n v_Percent = (dist - t * distAll) / trailLen;\n\n v_SpotPercent = spotSize / distAll;\n\n }\n@end\n\n\n@export ecgl.trail2.fragment\n\nuniform vec4 color : [1.0, 1.0, 1.0, 1.0];\nuniform float spotIntensity: 5;\n\nvarying vec4 v_Color;\nvarying float v_Percent;\nvarying float v_SpotPercent;\n\n@import ecgl.common.wireframe.fragmentHeader\n\n@import clay.util.srgb\n\nvoid main()\n{\n if (v_Percent > 1.0 || v_Percent < 0.0) {\n discard;\n }\n\n float fade = v_Percent;\n\n#ifdef SRGB_DECODE\n gl_FragColor = sRGBToLinear(color * v_Color);\n#else\n gl_FragColor = color * v_Color;\n#endif\n\n @import ecgl.common.wireframe.fragmentMain\n\n if (v_Percent > (1.0 - v_SpotPercent)) {\n gl_FragColor.rgb *= spotIntensity;\n }\n\n gl_FragColor.a *= fade;\n}\n\n@end";
var vec3$3 = glmatrix.vec3;
function sign(a) {
  return a > 0 ? 1 : -1;
}
graphicGL$1.Shader.import(trail2GLSL);
var TrailMesh2 = graphicGL$1.Mesh.extend(function() {
  var material = new graphicGL$1.Material({
    shader: new graphicGL$1.Shader(graphicGL$1.Shader.source("ecgl.trail2.vertex"), graphicGL$1.Shader.source("ecgl.trail2.fragment")),
    transparent: true,
    depthMask: false
  });
  var geometry = new Lines3DGeometry({
    dynamic: true
  });
  geometry.createAttribute("dist", "float", 1);
  geometry.createAttribute("distAll", "float", 1);
  geometry.createAttribute("start", "float", 1);
  return {
    geometry,
    material,
    culling: false,
    $ignorePicking: true
  };
}, {
  updateData: function(data, api, lines3DGeometry) {
    var seriesModel = data.hostModel;
    var geometry = this.geometry;
    var effectModel = seriesModel.getModel("effect");
    var size = effectModel.get("trailWidth") * api.getDevicePixelRatio();
    var trailLength = effectModel.get("trailLength");
    var speed = seriesModel.get("effect.constantSpeed");
    var period = seriesModel.get("effect.period") * 1e3;
    var useConstantSpeed = speed != null;
    useConstantSpeed ? this.material.set("speed", speed / 1e3) : this.material.set("period", period);
    this.material[useConstantSpeed ? "define" : "undefine"]("vertex", "CONSTANT_SPEED");
    var isPolyline = seriesModel.get("polyline");
    geometry.trailLength = trailLength;
    this.material.set("trailLength", trailLength);
    geometry.resetOffset();
    ["position", "positionPrev", "positionNext"].forEach(function(attrName) {
      geometry.attributes[attrName].value = lines3DGeometry.attributes[attrName].value;
    });
    var extraAttrs = ["dist", "distAll", "start", "offset", "color"];
    extraAttrs.forEach(function(attrName) {
      geometry.attributes[attrName].init(geometry.vertexCount);
    });
    geometry.indices = lines3DGeometry.indices;
    var colorArr = [];
    var effectColor = effectModel.get("trailColor");
    var effectOpacity = effectModel.get("trailOpacity");
    var hasEffectColor = effectColor != null;
    var hasEffectOpacity = effectOpacity != null;
    this.updateWorldTransform();
    var xScale = this.worldTransform.x.len();
    var yScale = this.worldTransform.y.len();
    var zScale = this.worldTransform.z.len();
    var vertexOffset = 0;
    var maxDistance = 0;
    data.each(function(idx) {
      var pts = data.getItemLayout(idx);
      var opacity = hasEffectOpacity ? effectOpacity : getItemVisualOpacity(data, idx);
      var color = getItemVisualColor(data, idx);
      if (opacity == null) {
        opacity = 1;
      }
      colorArr = graphicGL$1.parseColor(hasEffectColor ? effectColor : color, colorArr);
      colorArr[3] *= opacity;
      var vertexCount = isPolyline ? lines3DGeometry.getPolylineVertexCount(pts) : lines3DGeometry.getCubicCurveVertexCount(pts[0], pts[1], pts[2], pts[3]);
      var dist2 = 0;
      var pos = [];
      var posPrev = [];
      for (var i = vertexOffset; i < vertexOffset + vertexCount; i++) {
        geometry.attributes.position.get(i, pos);
        pos[0] *= xScale;
        pos[1] *= yScale;
        pos[2] *= zScale;
        if (i > vertexOffset) {
          dist2 += vec3$3.dist(pos, posPrev);
        }
        geometry.attributes.dist.set(i, dist2);
        vec3$3.copy(posPrev, pos);
      }
      maxDistance = Math.max(maxDistance, dist2);
      var randomStart = Math.random() * (useConstantSpeed ? dist2 : period);
      for (var i = vertexOffset; i < vertexOffset + vertexCount; i++) {
        geometry.attributes.distAll.set(i, dist2);
        geometry.attributes.start.set(i, randomStart);
        geometry.attributes.offset.set(i, sign(lines3DGeometry.attributes.offset.get(i)) * size / 2);
        geometry.attributes.color.set(i, colorArr);
      }
      vertexOffset += vertexCount;
    });
    this.material.set("spotSize", maxDistance * 0.1 * trailLength);
    this.material.set("spotIntensity", effectModel.get("spotIntensity"));
    geometry.dirty();
  },
  setAnimationTime: function(time) {
    this.material.set("time", time);
  }
});
graphicGL$1.Shader.import(lines3DGLSL);
function getCoordSysSize(coordSys) {
  if (coordSys.radius != null) {
    return coordSys.radius;
  }
  if (coordSys.size != null) {
    return Math.max(coordSys.size[0], coordSys.size[1], coordSys.size[2]);
  } else {
    return 100;
  }
}
var Lines3DView = ChartView.extend({
  type: "lines3D",
  __ecgl__: true,
  init: function(ecModel, api) {
    this.groupGL = new graphicGL$1.Node();
    this._meshLinesMaterial = new graphicGL$1.Material({
      shader: graphicGL$1.createShader("ecgl.meshLines3D"),
      transparent: true,
      depthMask: false
    });
    this._linesMesh = new graphicGL$1.Mesh({
      geometry: new Lines3DGeometry(),
      material: this._meshLinesMaterial,
      $ignorePicking: true
    });
    this._trailMesh = new TrailMesh2();
  },
  render: function(seriesModel, ecModel, api) {
    this.groupGL.add(this._linesMesh);
    var coordSys = seriesModel.coordinateSystem;
    var data = seriesModel.getData();
    if (coordSys && coordSys.viewGL) {
      var viewGL = coordSys.viewGL;
      viewGL.add(this.groupGL);
      this._updateLines(seriesModel, ecModel, api);
      var methodName = coordSys.viewGL.isLinearSpace() ? "define" : "undefine";
      this._linesMesh.material[methodName]("fragment", "SRGB_DECODE");
      this._trailMesh.material[methodName]("fragment", "SRGB_DECODE");
    }
    var trailMesh = this._trailMesh;
    trailMesh.stopAnimation();
    if (seriesModel.get("effect.show")) {
      this.groupGL.add(trailMesh);
      trailMesh.updateData(data, api, this._linesMesh.geometry);
      trailMesh.__time = trailMesh.__time || 0;
      var time = 3600 * 1e3;
      this._curveEffectsAnimator = trailMesh.animate("", {
        loop: true
      }).when(time, {
        __time: time
      }).during(function() {
        trailMesh.setAnimationTime(trailMesh.__time);
      }).start();
    } else {
      this.groupGL.remove(trailMesh);
      this._curveEffectsAnimator = null;
    }
    this._linesMesh.material.blend = this._trailMesh.material.blend = seriesModel.get("blendMode") === "lighter" ? graphicGL$1.additiveBlend : null;
  },
  pauseEffect: function() {
    if (this._curveEffectsAnimator) {
      this._curveEffectsAnimator.pause();
    }
  },
  resumeEffect: function() {
    if (this._curveEffectsAnimator) {
      this._curveEffectsAnimator.resume();
    }
  },
  toggleEffect: function() {
    var animator = this._curveEffectsAnimator;
    if (animator) {
      animator.isPaused() ? animator.resume() : animator.pause();
    }
  },
  _updateLines: function(seriesModel, ecModel, api) {
    var data = seriesModel.getData();
    var coordSys = seriesModel.coordinateSystem;
    var geometry = this._linesMesh.geometry;
    var isPolyline = seriesModel.get("polyline");
    geometry.expandLine = true;
    var size = getCoordSysSize(coordSys);
    geometry.segmentScale = size / 20;
    var lineWidthQueryPath = "lineStyle.width".split(".");
    var dpr = api.getDevicePixelRatio();
    data.each(function(idx) {
      var itemModel = data.getItemModel(idx);
      var lineWidth = itemModel.get(lineWidthQueryPath);
      if (lineWidth == null) {
        lineWidth = 1;
      }
      data.setItemVisual(idx, "lineWidth", lineWidth);
    });
    geometry.useNativeLine = false;
    var nVertex = 0;
    var nTriangle = 0;
    data.each(function(idx) {
      var pts = data.getItemLayout(idx);
      if (isPolyline) {
        nVertex += geometry.getPolylineVertexCount(pts);
        nTriangle += geometry.getPolylineTriangleCount(pts);
      } else {
        nVertex += geometry.getCubicCurveVertexCount(pts[0], pts[1], pts[2], pts[3]);
        nTriangle += geometry.getCubicCurveTriangleCount(pts[0], pts[1], pts[2], pts[3]);
      }
    });
    geometry.setVertexCount(nVertex);
    geometry.setTriangleCount(nTriangle);
    geometry.resetOffset();
    var colorArr = [];
    data.each(function(idx) {
      var pts = data.getItemLayout(idx);
      var color = getItemVisualColor(data, idx);
      var opacity = getItemVisualOpacity(data, idx);
      var lineWidth = data.getItemVisual(idx, "lineWidth") * dpr;
      if (opacity == null) {
        opacity = 1;
      }
      colorArr = graphicGL$1.parseColor(color, colorArr);
      colorArr[3] *= opacity;
      if (isPolyline) {
        geometry.addPolyline(pts, colorArr, lineWidth);
      } else {
        geometry.addCubicCurve(pts[0], pts[1], pts[2], pts[3], colorArr, lineWidth);
      }
    });
    geometry.dirty();
  },
  remove: function() {
    this.groupGL.removeAll();
  },
  dispose: function() {
    this.groupGL.removeAll();
  }
});
function install$2(registers) {
  registers.registerChartView(Lines3DView);
  registers.registerSeriesModel(Lines3DSeries);
  registers.registerLayout(lines3DLayout);
  registers.registerAction({
    type: "lines3DPauseEffect",
    event: "lines3deffectpaused",
    update: "series.lines3D:pauseEffect"
  }, function() {
  });
  registers.registerAction({
    type: "lines3DResumeEffect",
    event: "lines3deffectresumed",
    update: "series.lines3D:resumeEffect"
  }, function() {
  });
  registers.registerAction({
    type: "lines3DToggleEffect",
    event: "lines3deffectchanged",
    update: "series.lines3D:toggleEffect"
  }, function() {
  });
}
function earcut(data, holeIndices, dim) {
  dim = dim || 2;
  var hasHoles = holeIndices && holeIndices.length, outerLen = hasHoles ? holeIndices[0] * dim : data.length, outerNode = linkedList(data, 0, outerLen, dim, true), triangles = [];
  if (!outerNode)
    return triangles;
  var minX, minY, maxX, maxY, x, y, size;
  if (hasHoles)
    outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
  if (data.length > 80 * dim) {
    minX = maxX = data[0];
    minY = maxY = data[1];
    for (var i = dim; i < outerLen; i += dim) {
      x = data[i];
      y = data[i + 1];
      if (x < minX)
        minX = x;
      if (y < minY)
        minY = y;
      if (x > maxX)
        maxX = x;
      if (y > maxY)
        maxY = y;
    }
    size = Math.max(maxX - minX, maxY - minY);
  }
  earcutLinked(outerNode, triangles, dim, minX, minY, size);
  return triangles;
}
function linkedList(data, start, end, dim, clockwise) {
  var i, last;
  if (clockwise === signedArea(data, start, end, dim) > 0) {
    for (i = start; i < end; i += dim)
      last = insertNode(i, data[i], data[i + 1], last);
  } else {
    for (i = end - dim; i >= start; i -= dim)
      last = insertNode(i, data[i], data[i + 1], last);
  }
  if (last && equals(last, last.next)) {
    removeNode(last);
    last = last.next;
  }
  return last;
}
function filterPoints(start, end) {
  if (!start)
    return start;
  if (!end)
    end = start;
  var p = start, again;
  do {
    again = false;
    if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
      removeNode(p);
      p = end = p.prev;
      if (p === p.next)
        return null;
      again = true;
    } else {
      p = p.next;
    }
  } while (again || p !== end);
  return end;
}
function earcutLinked(ear, triangles, dim, minX, minY, size, pass) {
  if (!ear)
    return;
  if (!pass && size)
    indexCurve(ear, minX, minY, size);
  var stop = ear, prev, next;
  while (ear.prev !== ear.next) {
    prev = ear.prev;
    next = ear.next;
    if (size ? isEarHashed(ear, minX, minY, size) : isEar(ear)) {
      triangles.push(prev.i / dim);
      triangles.push(ear.i / dim);
      triangles.push(next.i / dim);
      removeNode(ear);
      ear = next.next;
      stop = next.next;
      continue;
    }
    ear = next;
    if (ear === stop) {
      if (!pass) {
        earcutLinked(filterPoints(ear), triangles, dim, minX, minY, size, 1);
      } else if (pass === 1) {
        ear = cureLocalIntersections(ear, triangles, dim);
        earcutLinked(ear, triangles, dim, minX, minY, size, 2);
      } else if (pass === 2) {
        splitEarcut(ear, triangles, dim, minX, minY, size);
      }
      break;
    }
  }
}
function isEar(ear) {
  var a = ear.prev, b = ear, c = ear.next;
  if (area(a, b, c) >= 0)
    return false;
  var p = ear.next.next;
  while (p !== ear.prev) {
    if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0)
      return false;
    p = p.next;
  }
  return true;
}
function isEarHashed(ear, minX, minY, size) {
  var a = ear.prev, b = ear, c = ear.next;
  if (area(a, b, c) >= 0)
    return false;
  var minTX = a.x < b.x ? a.x < c.x ? a.x : c.x : b.x < c.x ? b.x : c.x, minTY = a.y < b.y ? a.y < c.y ? a.y : c.y : b.y < c.y ? b.y : c.y, maxTX = a.x > b.x ? a.x > c.x ? a.x : c.x : b.x > c.x ? b.x : c.x, maxTY = a.y > b.y ? a.y > c.y ? a.y : c.y : b.y > c.y ? b.y : c.y;
  var minZ = zOrder(minTX, minTY, minX, minY, size), maxZ = zOrder(maxTX, maxTY, minX, minY, size);
  var p = ear.nextZ;
  while (p && p.z <= maxZ) {
    if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0)
      return false;
    p = p.nextZ;
  }
  p = ear.prevZ;
  while (p && p.z >= minZ) {
    if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0)
      return false;
    p = p.prevZ;
  }
  return true;
}
function cureLocalIntersections(start, triangles, dim) {
  var p = start;
  do {
    var a = p.prev, b = p.next.next;
    if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
      triangles.push(a.i / dim);
      triangles.push(p.i / dim);
      triangles.push(b.i / dim);
      removeNode(p);
      removeNode(p.next);
      p = start = b;
    }
    p = p.next;
  } while (p !== start);
  return p;
}
function splitEarcut(start, triangles, dim, minX, minY, size) {
  var a = start;
  do {
    var b = a.next.next;
    while (b !== a.prev) {
      if (a.i !== b.i && isValidDiagonal(a, b)) {
        var c = splitPolygon(a, b);
        a = filterPoints(a, a.next);
        c = filterPoints(c, c.next);
        earcutLinked(a, triangles, dim, minX, minY, size);
        earcutLinked(c, triangles, dim, minX, minY, size);
        return;
      }
      b = b.next;
    }
    a = a.next;
  } while (a !== start);
}
function eliminateHoles(data, holeIndices, outerNode, dim) {
  var queue = [], i, len, start, end, list;
  for (i = 0, len = holeIndices.length; i < len; i++) {
    start = holeIndices[i] * dim;
    end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
    list = linkedList(data, start, end, dim, false);
    if (list === list.next)
      list.steiner = true;
    queue.push(getLeftmost(list));
  }
  queue.sort(compareX);
  for (i = 0; i < queue.length; i++) {
    eliminateHole(queue[i], outerNode);
    outerNode = filterPoints(outerNode, outerNode.next);
  }
  return outerNode;
}
function compareX(a, b) {
  return a.x - b.x;
}
function eliminateHole(hole, outerNode) {
  outerNode = findHoleBridge(hole, outerNode);
  if (outerNode) {
    var b = splitPolygon(outerNode, hole);
    filterPoints(b, b.next);
  }
}
function findHoleBridge(hole, outerNode) {
  var p = outerNode, hx = hole.x, hy = hole.y, qx = -Infinity, m;
  do {
    if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
      var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
      if (x <= hx && x > qx) {
        qx = x;
        if (x === hx) {
          if (hy === p.y)
            return p;
          if (hy === p.next.y)
            return p.next;
        }
        m = p.x < p.next.x ? p : p.next;
      }
    }
    p = p.next;
  } while (p !== outerNode);
  if (!m)
    return null;
  if (hx === qx)
    return m.prev;
  var stop = m, mx = m.x, my = m.y, tanMin = Infinity, tan2;
  p = m.next;
  while (p !== stop) {
    if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
      tan2 = Math.abs(hy - p.y) / (hx - p.x);
      if ((tan2 < tanMin || tan2 === tanMin && p.x > m.x) && locallyInside(p, hole)) {
        m = p;
        tanMin = tan2;
      }
    }
    p = p.next;
  }
  return m;
}
function indexCurve(start, minX, minY, size) {
  var p = start;
  do {
    if (p.z === null)
      p.z = zOrder(p.x, p.y, minX, minY, size);
    p.prevZ = p.prev;
    p.nextZ = p.next;
    p = p.next;
  } while (p !== start);
  p.prevZ.nextZ = null;
  p.prevZ = null;
  sortLinked(p);
}
function sortLinked(list) {
  var i, p, q, e2, tail, numMerges, pSize, qSize, inSize = 1;
  do {
    p = list;
    list = null;
    tail = null;
    numMerges = 0;
    while (p) {
      numMerges++;
      q = p;
      pSize = 0;
      for (i = 0; i < inSize; i++) {
        pSize++;
        q = q.nextZ;
        if (!q)
          break;
      }
      qSize = inSize;
      while (pSize > 0 || qSize > 0 && q) {
        if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
          e2 = p;
          p = p.nextZ;
          pSize--;
        } else {
          e2 = q;
          q = q.nextZ;
          qSize--;
        }
        if (tail)
          tail.nextZ = e2;
        else
          list = e2;
        e2.prevZ = tail;
        tail = e2;
      }
      p = q;
    }
    tail.nextZ = null;
    inSize *= 2;
  } while (numMerges > 1);
  return list;
}
function zOrder(x, y, minX, minY, size) {
  x = 32767 * (x - minX) / size;
  y = 32767 * (y - minY) / size;
  x = (x | x << 8) & 16711935;
  x = (x | x << 4) & 252645135;
  x = (x | x << 2) & 858993459;
  x = (x | x << 1) & 1431655765;
  y = (y | y << 8) & 16711935;
  y = (y | y << 4) & 252645135;
  y = (y | y << 2) & 858993459;
  y = (y | y << 1) & 1431655765;
  return x | y << 1;
}
function getLeftmost(start) {
  var p = start, leftmost = start;
  do {
    if (p.x < leftmost.x)
      leftmost = p;
    p = p.next;
  } while (p !== start);
  return leftmost;
}
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
  return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 && (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 && (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}
function isValidDiagonal(a, b) {
  return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
}
function area(p, q, r) {
  return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}
function equals(p12, p22) {
  return p12.x === p22.x && p12.y === p22.y;
}
function intersects(p12, q1, p22, q2) {
  if (equals(p12, q1) && equals(p22, q2) || equals(p12, q2) && equals(p22, q1))
    return true;
  return area(p12, q1, p22) > 0 !== area(p12, q1, q2) > 0 && area(p22, q2, p12) > 0 !== area(p22, q2, q1) > 0;
}
function intersectsPolygon(a, b) {
  var p = a;
  do {
    if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b))
      return true;
    p = p.next;
  } while (p !== a);
  return false;
}
function locallyInside(a, b) {
  return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}
function middleInside(a, b) {
  var p = a, inside = false, px = (a.x + b.x) / 2, py = (a.y + b.y) / 2;
  do {
    if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x)
      inside = !inside;
    p = p.next;
  } while (p !== a);
  return inside;
}
function splitPolygon(a, b) {
  var a2 = new Node(a.i, a.x, a.y), b2 = new Node(b.i, b.x, b.y), an = a.next, bp = b.prev;
  a.next = b;
  b.prev = a;
  a2.next = an;
  an.prev = a2;
  b2.next = a2;
  a2.prev = b2;
  bp.next = b2;
  b2.prev = bp;
  return b2;
}
function insertNode(i, x, y, last) {
  var p = new Node(i, x, y);
  if (!last) {
    p.prev = p;
    p.next = p;
  } else {
    p.next = last.next;
    p.prev = last;
    last.next.prev = p;
    last.next = p;
  }
  return p;
}
function removeNode(p) {
  p.next.prev = p.prev;
  p.prev.next = p.next;
  if (p.prevZ)
    p.prevZ.nextZ = p.nextZ;
  if (p.nextZ)
    p.nextZ.prevZ = p.prevZ;
}
function Node(i, x, y) {
  this.i = i;
  this.x = x;
  this.y = y;
  this.prev = null;
  this.next = null;
  this.z = null;
  this.prevZ = null;
  this.nextZ = null;
  this.steiner = false;
}
earcut.deviation = function(data, holeIndices, dim, triangles) {
  var hasHoles = holeIndices && holeIndices.length;
  var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
  var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
  if (hasHoles) {
    for (var i = 0, len = holeIndices.length; i < len; i++) {
      var start = holeIndices[i] * dim;
      var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
      polygonArea -= Math.abs(signedArea(data, start, end, dim));
    }
  }
  var trianglesArea = 0;
  for (i = 0; i < triangles.length; i += 3) {
    var a = triangles[i] * dim;
    var b = triangles[i + 1] * dim;
    var c = triangles[i + 2] * dim;
    trianglesArea += Math.abs((data[a] - data[c]) * (data[b + 1] - data[a + 1]) - (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
  }
  return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
};
function signedArea(data, start, end, dim) {
  var sum = 0;
  for (var i = start, j = end - dim; i < end; i += dim) {
    sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
    j = i;
  }
  return sum;
}
var vec3$2 = glmatrix.vec3;
graphicGL$1.Shader.import(lines3DGLSL);
function Geo3DBuilder(api) {
  this.rootNode = new graphicGL$1.Node();
  this._triangulationResults = {};
  this._shadersMap = graphicGL$1.COMMON_SHADERS.filter(function(shaderName) {
    return shaderName !== "shadow";
  }).reduce(function(obj, shaderName) {
    obj[shaderName] = graphicGL$1.createShader("ecgl." + shaderName);
    return obj;
  }, {});
  this._linesShader = graphicGL$1.createShader("ecgl.meshLines3D");
  var groundMaterials = {};
  graphicGL$1.COMMON_SHADERS.forEach(function(shading) {
    groundMaterials[shading] = new graphicGL$1.Material({
      shader: graphicGL$1.createShader("ecgl." + shading)
    });
  });
  this._groundMaterials = groundMaterials;
  this._groundMesh = new graphicGL$1.Mesh({
    geometry: new graphicGL$1.PlaneGeometry({
      dynamic: true
    }),
    castShadow: false,
    renderNormal: true,
    $ignorePicking: true
  });
  this._groundMesh.rotation.rotateX(-Math.PI / 2);
  this._labelsBuilder = new LabelsBuilder(512, 512, api);
  this._labelsBuilder.getMesh().renderOrder = 100;
  this._labelsBuilder.getMesh().material.depthTest = false;
  this.rootNode.add(this._labelsBuilder.getMesh());
  this._initMeshes();
  this._api = api;
}
Geo3DBuilder.prototype = {
  constructor: Geo3DBuilder,
  extrudeY: true,
  update: function(componentModel, ecModel, api, start, end) {
    var data = componentModel.getData();
    if (start == null) {
      start = 0;
    }
    if (end == null) {
      end = data.count();
    }
    this._startIndex = start;
    this._endIndex = end - 1;
    this._triangulation(componentModel, start, end);
    var shader = this._getShader(componentModel.get("shading"));
    this._prepareMesh(componentModel, shader, api, start, end);
    this.rootNode.updateWorldTransform();
    this._updateRegionMesh(componentModel, api, start, end);
    var coordSys = componentModel.coordinateSystem;
    if (coordSys.type === "geo3D") {
      this._updateGroundPlane(componentModel, coordSys, api);
    }
    var self = this;
    this._labelsBuilder.updateData(data, start, end);
    this._labelsBuilder.getLabelPosition = function(dataIndex, positionDesc, distance) {
      var name = data.getName(dataIndex);
      var center;
      var height = distance;
      if (coordSys.type === "geo3D") {
        var region = coordSys.getRegion(name);
        if (!region) {
          return [NaN, NaN, NaN];
        }
        center = region.getCenter();
        var pos = coordSys.dataToPoint([center[0], center[1], height]);
        return pos;
      } else {
        var tmp = self._triangulationResults[dataIndex - self._startIndex];
        var center = self.extrudeY ? [(tmp.max[0] + tmp.min[0]) / 2, tmp.max[1] + height, (tmp.max[2] + tmp.min[2]) / 2] : [(tmp.max[0] + tmp.min[0]) / 2, (tmp.max[1] + tmp.min[1]) / 2, tmp.max[2] + height];
      }
    };
    this._data = data;
    this._labelsBuilder.updateLabels();
    this._updateDebugWireframe(componentModel);
    this._lastHoverDataIndex = 0;
  },
  _initMeshes: function() {
    var self = this;
    function createPolygonMesh() {
      var mesh2 = new graphicGL$1.Mesh({
        name: "Polygon",
        material: new graphicGL$1.Material({
          shader: self._shadersMap.lambert
        }),
        geometry: new graphicGL$1.Geometry({
          sortTriangles: true,
          dynamic: true
        }),
        culling: false,
        ignorePicking: true,
        renderNormal: true
      });
      Object.assign(mesh2.geometry, trianglesSortMixin);
      return mesh2;
    }
    var polygonMesh = createPolygonMesh();
    var linesMesh = new graphicGL$1.Mesh({
      material: new graphicGL$1.Material({
        shader: this._linesShader
      }),
      castShadow: false,
      ignorePicking: true,
      $ignorePicking: true,
      geometry: new Lines3DGeometry({
        useNativeLine: false
      })
    });
    this.rootNode.add(polygonMesh);
    this.rootNode.add(linesMesh);
    polygonMesh.material.define("both", "VERTEX_COLOR");
    polygonMesh.material.define("fragment", "DOUBLE_SIDED");
    this._polygonMesh = polygonMesh;
    this._linesMesh = linesMesh;
    this.rootNode.add(this._groundMesh);
  },
  _getShader: function(shading) {
    var shader = this._shadersMap[shading];
    if (!shader) {
      shader = this._shadersMap.lambert;
    }
    shader.__shading = shading;
    return shader;
  },
  _prepareMesh: function(componentModel, shader, api, start, end) {
    var polygonVertexCount = 0;
    var polygonTriangleCount = 0;
    var linesVertexCount = 0;
    var linesTriangleCount = 0;
    for (var idx = start; idx < end; idx++) {
      var polyInfo = this._getRegionPolygonInfo(idx);
      var lineInfo = this._getRegionLinesInfo(idx, componentModel, this._linesMesh.geometry);
      polygonVertexCount += polyInfo.vertexCount;
      polygonTriangleCount += polyInfo.triangleCount;
      linesVertexCount += lineInfo.vertexCount;
      linesTriangleCount += lineInfo.triangleCount;
    }
    var polygonMesh = this._polygonMesh;
    var polygonGeo = polygonMesh.geometry;
    ["position", "normal", "texcoord0", "color"].forEach(function(attrName) {
      polygonGeo.attributes[attrName].init(polygonVertexCount);
    });
    polygonGeo.indices = polygonVertexCount > 65535 ? new Uint32Array(polygonTriangleCount * 3) : new Uint16Array(polygonTriangleCount * 3);
    if (polygonMesh.material.shader !== shader) {
      polygonMesh.material.attachShader(shader, true);
    }
    graphicGL$1.setMaterialFromModel(shader.__shading, polygonMesh.material, componentModel, api);
    if (linesVertexCount > 0) {
      this._linesMesh.geometry.resetOffset();
      this._linesMesh.geometry.setVertexCount(linesVertexCount);
      this._linesMesh.geometry.setTriangleCount(linesTriangleCount);
    }
    this._dataIndexOfVertex = new Uint32Array(polygonVertexCount);
    this._vertexRangeOfDataIndex = new Uint32Array((end - start) * 2);
  },
  _updateRegionMesh: function(componentModel, api, start, end) {
    var data = componentModel.getData();
    var vertexOffset = 0;
    var triangleOffset = 0;
    var hasTranparentRegion = false;
    var polygonMesh = this._polygonMesh;
    var linesMesh = this._linesMesh;
    for (var dataIndex = start; dataIndex < end; dataIndex++) {
      var regionModel = componentModel.getRegionModel(dataIndex);
      var itemStyleModel = regionModel.getModel("itemStyle");
      var color = retrieve$1.firstNotNull(getItemVisualColor(data, dataIndex), itemStyleModel.get("color"), "#fff");
      var opacity = retrieve$1.firstNotNull(getItemVisualOpacity(data, dataIndex), 1);
      var colorArr = graphicGL$1.parseColor(color);
      var borderColorArr = graphicGL$1.parseColor(itemStyleModel.get("borderColor"));
      colorArr[3] *= opacity;
      borderColorArr[3] *= opacity;
      var isTransparent = colorArr[3] < 0.99;
      polygonMesh.material.set("color", [1, 1, 1, 1]);
      hasTranparentRegion = hasTranparentRegion || isTransparent;
      var regionHeight = retrieve$1.firstNotNull(regionModel.get("height", true), componentModel.get("regionHeight"));
      var newOffsets = this._updatePolygonGeometry(componentModel, polygonMesh.geometry, dataIndex, regionHeight, vertexOffset, triangleOffset, colorArr);
      for (var i = vertexOffset; i < newOffsets.vertexOffset; i++) {
        this._dataIndexOfVertex[i] = dataIndex;
      }
      this._vertexRangeOfDataIndex[(dataIndex - start) * 2] = vertexOffset;
      this._vertexRangeOfDataIndex[(dataIndex - start) * 2 + 1] = newOffsets.vertexOffset;
      vertexOffset = newOffsets.vertexOffset;
      triangleOffset = newOffsets.triangleOffset;
      var lineWidth = itemStyleModel.get("borderWidth");
      var hasLine = lineWidth > 0;
      if (hasLine) {
        lineWidth *= api.getDevicePixelRatio();
        this._updateLinesGeometry(linesMesh.geometry, componentModel, dataIndex, regionHeight, lineWidth, componentModel.coordinateSystem.transform);
      }
      linesMesh.invisible = !hasLine;
      linesMesh.material.set({
        color: borderColorArr
      });
    }
    var polygonMesh = this._polygonMesh;
    polygonMesh.material.transparent = hasTranparentRegion;
    polygonMesh.material.depthMask = !hasTranparentRegion;
    polygonMesh.geometry.updateBoundingBox();
    polygonMesh.frontFace = this.extrudeY ? graphicGL$1.Mesh.CCW : graphicGL$1.Mesh.CW;
    if (polygonMesh.material.get("normalMap")) {
      polygonMesh.geometry.generateTangents();
    }
    polygonMesh.seriesIndex = componentModel.seriesIndex;
    polygonMesh.on("mousemove", this._onmousemove, this);
    polygonMesh.on("mouseout", this._onmouseout, this);
  },
  _updateDebugWireframe: function(componentModel) {
    var debugWireframeModel = componentModel.getModel("debug.wireframe");
    if (debugWireframeModel.get("show")) {
      var color = graphicGL$1.parseColor(debugWireframeModel.get("lineStyle.color") || "rgba(0,0,0,0.5)");
      var width = retrieve$1.firstNotNull(debugWireframeModel.get("lineStyle.width"), 1);
      var mesh2 = this._polygonMesh;
      mesh2.geometry.generateBarycentric();
      mesh2.material.define("both", "WIREFRAME_TRIANGLE");
      mesh2.material.set("wireframeLineColor", color);
      mesh2.material.set("wireframeLineWidth", width);
    }
  },
  _onmousemove: function(e2) {
    var dataIndex = this._dataIndexOfVertex[e2.triangle[0]];
    if (dataIndex == null) {
      dataIndex = -1;
    }
    if (dataIndex !== this._lastHoverDataIndex) {
      this.downplay(this._lastHoverDataIndex);
      this.highlight(dataIndex);
      this._labelsBuilder.updateLabels([dataIndex]);
    }
    this._lastHoverDataIndex = dataIndex;
    this._polygonMesh.dataIndex = dataIndex;
  },
  _onmouseout: function(e2) {
    if (e2.target) {
      this.downplay(this._lastHoverDataIndex);
      this._lastHoverDataIndex = -1;
      this._polygonMesh.dataIndex = -1;
    }
    this._labelsBuilder.updateLabels([]);
  },
  _updateGroundPlane: function(componentModel, geo3D, api) {
    var groundModel = componentModel.getModel("groundPlane", componentModel);
    this._groundMesh.invisible = !groundModel.get("show", true);
    if (this._groundMesh.invisible) {
      return;
    }
    var shading = componentModel.get("shading");
    var material = this._groundMaterials[shading];
    if (!material) {
      material = this._groundMaterials.lambert;
    }
    graphicGL$1.setMaterialFromModel(shading, material, groundModel, api);
    if (material.get("normalMap")) {
      this._groundMesh.geometry.generateTangents();
    }
    this._groundMesh.material = material;
    this._groundMesh.material.set("color", graphicGL$1.parseColor(groundModel.get("color")));
    this._groundMesh.scale.set(geo3D.size[0], geo3D.size[2], 1);
  },
  _triangulation: function(componentModel, start, end) {
    this._triangulationResults = [];
    var minAll = [Infinity, Infinity, Infinity];
    var maxAll = [-Infinity, -Infinity, -Infinity];
    var coordSys = componentModel.coordinateSystem;
    for (var idx = start; idx < end; idx++) {
      var polygons = [];
      var polygonCoords = componentModel.getRegionPolygonCoords(idx);
      for (var i = 0; i < polygonCoords.length; i++) {
        var exterior = polygonCoords[i].exterior;
        var interiors = polygonCoords[i].interiors;
        var points = [];
        var holes = [];
        if (exterior.length < 3) {
          continue;
        }
        var offset = 0;
        for (var j = 0; j < exterior.length; j++) {
          var p = exterior[j];
          points[offset++] = p[0];
          points[offset++] = p[1];
        }
        for (var j = 0; j < interiors.length; j++) {
          if (interiors[j].length < 3) {
            continue;
          }
          var startIdx = points.length / 2;
          for (var k = 0; k < interiors[j].length; k++) {
            var p = interiors[j][k];
            points.push(p[0]);
            points.push(p[1]);
          }
          holes.push(startIdx);
        }
        var triangles = earcut(points, holes);
        var points3 = new Float64Array(points.length / 2 * 3);
        var pos = [];
        var min = [Infinity, Infinity, Infinity];
        var max = [-Infinity, -Infinity, -Infinity];
        var off3 = 0;
        for (var j = 0; j < points.length; ) {
          vec3$2.set(pos, points[j++], 0, points[j++]);
          if (coordSys && coordSys.transform) {
            vec3$2.transformMat4(pos, pos, coordSys.transform);
          }
          vec3$2.min(min, min, pos);
          vec3$2.max(max, max, pos);
          points3[off3++] = pos[0];
          points3[off3++] = pos[1];
          points3[off3++] = pos[2];
        }
        vec3$2.min(minAll, minAll, min);
        vec3$2.max(maxAll, maxAll, max);
        polygons.push({
          points: points3,
          indices: triangles,
          min,
          max
        });
      }
      this._triangulationResults.push(polygons);
    }
    this._geoBoundingBox = [minAll, maxAll];
  },
  _getRegionPolygonInfo: function(idx) {
    var polygons = this._triangulationResults[idx - this._startIndex];
    var sideVertexCount = 0;
    var sideTriangleCount = 0;
    for (var i = 0; i < polygons.length; i++) {
      sideVertexCount += polygons[i].points.length / 3;
      sideTriangleCount += polygons[i].indices.length / 3;
    }
    var vertexCount = sideVertexCount * 2 + sideVertexCount * 4;
    var triangleCount = sideTriangleCount * 2 + sideVertexCount * 2;
    return {
      vertexCount,
      triangleCount
    };
  },
  _updatePolygonGeometry: function(componentModel, geometry, dataIndex, regionHeight, vertexOffset, triangleOffset, color) {
    var projectUVOnGround = componentModel.get("projectUVOnGround");
    var positionAttr = geometry.attributes.position;
    var normalAttr = geometry.attributes.normal;
    var texcoordAttr = geometry.attributes.texcoord0;
    var colorAttr = geometry.attributes.color;
    var polygons = this._triangulationResults[dataIndex - this._startIndex];
    var hasColor = colorAttr.value && color;
    var indices = geometry.indices;
    var extrudeCoordIndex = this.extrudeY ? 1 : 2;
    var sideCoordIndex = this.extrudeY ? 2 : 1;
    var scale2 = [this.rootNode.worldTransform.x.len(), this.rootNode.worldTransform.y.len(), this.rootNode.worldTransform.z.len()];
    var min = vec3$2.mul([], this._geoBoundingBox[0], scale2);
    var max = vec3$2.mul([], this._geoBoundingBox[1], scale2);
    var maxDimSize = Math.max(max[0] - min[0], max[2] - min[2]);
    function addVertices(polygon2, y, insideOffset) {
      var points = polygon2.points;
      var pointsLen = points.length;
      var currentPosition = [];
      var uv2 = [];
      for (var k2 = 0; k2 < pointsLen; k2 += 3) {
        currentPosition[0] = points[k2];
        currentPosition[extrudeCoordIndex] = y;
        currentPosition[sideCoordIndex] = points[k2 + 2];
        uv2[0] = (points[k2] * scale2[0] - min[0]) / maxDimSize;
        uv2[1] = (points[k2 + 2] * scale2[sideCoordIndex] - min[2]) / maxDimSize;
        positionAttr.set(vertexOffset, currentPosition);
        if (hasColor) {
          colorAttr.set(vertexOffset, color);
        }
        texcoordAttr.set(vertexOffset++, uv2);
      }
    }
    function buildTopBottom(polygon2, y, insideOffset) {
      var startVertexOffset2 = vertexOffset;
      addVertices(polygon2, y);
      var len2 = polygon2.indices.length;
      for (var k2 = 0; k2 < len2; k2++) {
        indices[triangleOffset * 3 + k2] = polygon2.indices[k2] + startVertexOffset2;
      }
      triangleOffset += polygon2.indices.length / 3;
    }
    var normalTop = this.extrudeY ? [0, 1, 0] : [0, 0, 1];
    var normalBottom = vec3$2.negate([], normalTop);
    for (var p = 0; p < polygons.length; p++) {
      var startVertexOffset = vertexOffset;
      var polygon = polygons[p];
      buildTopBottom(polygon, 0);
      buildTopBottom(polygon, regionHeight);
      var ringVertexCount = polygon.points.length / 3;
      for (var v = 0; v < ringVertexCount; v++) {
        normalAttr.set(startVertexOffset + v, normalBottom);
        normalAttr.set(startVertexOffset + v + ringVertexCount, normalTop);
      }
      var quadToTriangle = [0, 3, 1, 1, 3, 2];
      var quadPos = [[], [], [], []];
      var a = [];
      var b = [];
      var normal2 = [];
      var uv = [];
      var len = 0;
      for (var v = 0; v < ringVertexCount; v++) {
        var next = (v + 1) % ringVertexCount;
        var dx = (polygon.points[next * 3] - polygon.points[v * 3]) * scale2[0];
        var dy = (polygon.points[next * 3 + 2] - polygon.points[v * 3 + 2]) * scale2[sideCoordIndex];
        var sideLen = Math.sqrt(dx * dx + dy * dy);
        for (var k = 0; k < 4; k++) {
          var isCurrent = k === 0 || k === 3;
          var idx3 = (isCurrent ? v : next) * 3;
          quadPos[k][0] = polygon.points[idx3];
          quadPos[k][extrudeCoordIndex] = k > 1 ? regionHeight : 0;
          quadPos[k][sideCoordIndex] = polygon.points[idx3 + 2];
          positionAttr.set(vertexOffset + k, quadPos[k]);
          if (projectUVOnGround) {
            uv[0] = (polygon.points[idx3] * scale2[0] - min[0]) / maxDimSize;
            uv[1] = (polygon.points[idx3 + 2] * scale2[sideCoordIndex] - min[sideCoordIndex]) / maxDimSize;
          } else {
            uv[0] = (isCurrent ? len : len + sideLen) / maxDimSize;
            uv[1] = (quadPos[k][extrudeCoordIndex] * scale2[extrudeCoordIndex] - min[extrudeCoordIndex]) / maxDimSize;
          }
          texcoordAttr.set(vertexOffset + k, uv);
        }
        vec3$2.sub(a, quadPos[1], quadPos[0]);
        vec3$2.sub(b, quadPos[3], quadPos[0]);
        vec3$2.cross(normal2, a, b);
        vec3$2.normalize(normal2, normal2);
        for (var k = 0; k < 4; k++) {
          normalAttr.set(vertexOffset + k, normal2);
          if (hasColor) {
            colorAttr.set(vertexOffset + k, color);
          }
        }
        for (var k = 0; k < 6; k++) {
          indices[triangleOffset * 3 + k] = quadToTriangle[k] + vertexOffset;
        }
        vertexOffset += 4;
        triangleOffset += 2;
        len += sideLen;
      }
    }
    geometry.dirty();
    return {
      vertexOffset,
      triangleOffset
    };
  },
  _getRegionLinesInfo: function(idx, componentModel, geometry) {
    var vertexCount = 0;
    var triangleCount = 0;
    var regionModel = componentModel.getRegionModel(idx);
    var itemStyleModel = regionModel.getModel("itemStyle");
    var lineWidth = itemStyleModel.get("borderWidth");
    if (lineWidth > 0) {
      var polygonCoords = componentModel.getRegionPolygonCoords(idx);
      polygonCoords.forEach(function(coords) {
        var exterior = coords.exterior;
        var interiors = coords.interiors;
        vertexCount += geometry.getPolylineVertexCount(exterior);
        triangleCount += geometry.getPolylineTriangleCount(exterior);
        for (var i = 0; i < interiors.length; i++) {
          vertexCount += geometry.getPolylineVertexCount(interiors[i]);
          triangleCount += geometry.getPolylineTriangleCount(interiors[i]);
        }
      }, this);
    }
    return {
      vertexCount,
      triangleCount
    };
  },
  _updateLinesGeometry: function(geometry, componentModel, dataIndex, regionHeight, lineWidth, transform) {
    function convertToPoints3(polygon) {
      var points = new Float64Array(polygon.length * 3);
      var offset = 0;
      var pos = [];
      for (var i = 0; i < polygon.length; i++) {
        pos[0] = polygon[i][0];
        pos[1] = regionHeight + 0.1;
        pos[2] = polygon[i][1];
        if (transform) {
          vec3$2.transformMat4(pos, pos, transform);
        }
        points[offset++] = pos[0];
        points[offset++] = pos[1];
        points[offset++] = pos[2];
      }
      return points;
    }
    var whiteColor = [1, 1, 1, 1];
    var coords = componentModel.getRegionPolygonCoords(dataIndex);
    coords.forEach(function(geo) {
      var exterior = geo.exterior;
      var interiors = geo.interiors;
      geometry.addPolyline(convertToPoints3(exterior), whiteColor, lineWidth);
      for (var i = 0; i < interiors.length; i++) {
        geometry.addPolyline(convertToPoints3(interiors[i]), whiteColor, lineWidth);
      }
    });
  },
  highlight: function(dataIndex) {
    var data = this._data;
    if (!data) {
      return;
    }
    var itemModel = data.getItemModel(dataIndex);
    var emphasisItemStyleModel = itemModel.getModel(["emphasis", "itemStyle"]);
    var emphasisColor = emphasisItemStyleModel.get("color");
    var emphasisOpacity = retrieve$1.firstNotNull(emphasisItemStyleModel.get("opacity"), getItemVisualOpacity(data, dataIndex), 1);
    if (emphasisColor == null) {
      var color = getItemVisualColor(data, dataIndex);
      emphasisColor = lift(color, -0.4);
    }
    if (emphasisOpacity == null) {
      emphasisOpacity = getItemVisualOpacity(data, dataIndex);
    }
    var colorArr = graphicGL$1.parseColor(emphasisColor);
    colorArr[3] *= emphasisOpacity;
    this._setColorOfDataIndex(data, dataIndex, colorArr);
  },
  downplay: function(dataIndex) {
    var data = this._data;
    if (!data) {
      return;
    }
    var color = retrieve$1.firstNotNull(getItemVisualColor(data, dataIndex), data.getItemModel(dataIndex).get(["itemStyle", "color"]), "#fff");
    var opacity = retrieve$1.firstNotNull(getItemVisualOpacity(data, dataIndex), 1);
    var colorArr = graphicGL$1.parseColor(color);
    colorArr[3] *= opacity;
    this._setColorOfDataIndex(data, dataIndex, colorArr);
  },
  dispose: function() {
    this._labelsBuilder.dispose();
  },
  _setColorOfDataIndex: function(data, dataIndex, colorArr) {
    if (dataIndex < this._startIndex && dataIndex > this._endIndex) {
      return;
    }
    dataIndex -= this._startIndex;
    for (var i = this._vertexRangeOfDataIndex[dataIndex * 2]; i < this._vertexRangeOfDataIndex[dataIndex * 2 + 1]; i++) {
      this._polygonMesh.geometry.attributes.color.set(i, colorArr);
    }
    this._polygonMesh.geometry.dirty();
    this._api.getZr().refresh();
  }
};
var componentViewControlMixin = {
  defaultOption: {
    viewControl: {
      projection: "perspective",
      autoRotate: false,
      autoRotateDirection: "cw",
      autoRotateSpeed: 10,
      autoRotateAfterStill: 3,
      damping: 0.8,
      rotateSensitivity: 1,
      zoomSensitivity: 1,
      panSensitivity: 1,
      panMouseButton: "middle",
      rotateMouseButton: "left",
      distance: 150,
      minDistance: 40,
      maxDistance: 400,
      orthographicSize: 150,
      maxOrthographicSize: 400,
      minOrthographicSize: 20,
      center: [0, 0, 0],
      alpha: 0,
      beta: 0,
      minAlpha: -90,
      maxAlpha: 90
    }
  },
  setView: function(opts) {
    opts = opts || {};
    this.option.viewControl = this.option.viewControl || {};
    if (opts.alpha != null) {
      this.option.viewControl.alpha = opts.alpha;
    }
    if (opts.beta != null) {
      this.option.viewControl.beta = opts.beta;
    }
    if (opts.distance != null) {
      this.option.viewControl.distance = opts.distance;
    }
    if (opts.center != null) {
      this.option.viewControl.center = opts.center;
    }
  }
};
var componentPostEffectMixin = {
  defaultOption: {
    postEffect: {
      enable: false,
      bloom: {
        enable: true,
        intensity: 0.1
      },
      depthOfField: {
        enable: false,
        focalRange: 20,
        focalDistance: 50,
        blurRadius: 10,
        fstop: 2.8,
        quality: "medium"
      },
      screenSpaceAmbientOcclusion: {
        enable: false,
        radius: 2,
        quality: "medium",
        intensity: 1
      },
      screenSpaceReflection: {
        enable: false,
        quality: "medium",
        maxRoughness: 0.8
      },
      colorCorrection: {
        enable: true,
        exposure: 0,
        brightness: 0,
        contrast: 1,
        saturation: 1,
        lookupTexture: ""
      },
      edge: {
        enable: false
      },
      FXAA: {
        enable: false
      }
    },
    temporalSuperSampling: {
      enable: "auto"
    }
  }
};
var componentLightMixin = {
  defaultOption: {
    light: {
      main: {
        shadow: false,
        shadowQuality: "high",
        color: "#fff",
        intensity: 1,
        alpha: 0,
        beta: 0
      },
      ambient: {
        color: "#fff",
        intensity: 0.2
      },
      ambientCubemap: {
        texture: null,
        exposure: 1,
        diffuseIntensity: 0.5,
        specularIntensity: 0.5
      }
    }
  }
};
var geo3DModelMixin = {
  getFilledRegions: function(regions, mapData) {
    var regionsArr = (regions || []).slice();
    var geoJson;
    if (typeof mapData === "string") {
      mapData = getMap(mapData);
      geoJson = mapData && mapData.geoJson;
    } else {
      if (mapData && mapData.features) {
        geoJson = mapData;
      }
    }
    if (!geoJson) {
      return [];
    }
    var dataNameMap = {};
    var features = geoJson.features;
    for (var i = 0; i < regionsArr.length; i++) {
      dataNameMap[regionsArr[i].name] = regionsArr[i];
    }
    for (var i = 0; i < features.length; i++) {
      var name = features[i].properties.name;
      if (!dataNameMap[name]) {
        regionsArr.push({
          name
        });
      }
    }
    return regionsArr;
  },
  defaultOption: {
    show: true,
    zlevel: -10,
    map: "",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    boxWidth: 100,
    boxHeight: 10,
    boxDepth: "auto",
    regionHeight: 3,
    environment: "auto",
    groundPlane: {
      show: false,
      color: "#aaa"
    },
    shading: "lambert",
    light: {
      main: {
        alpha: 40,
        beta: 30
      }
    },
    viewControl: {
      alpha: 40,
      beta: 0,
      distance: 100,
      orthographicSize: 60,
      minAlpha: 5,
      minBeta: -80,
      maxBeta: 80
    },
    label: {
      show: false,
      distance: 2,
      textStyle: {
        fontSize: 20,
        color: "#000",
        backgroundColor: "rgba(255,255,255,0.7)",
        padding: 3,
        borderRadius: 4
      }
    },
    itemStyle: {
      color: "#fff",
      borderWidth: 0,
      borderColor: "#333"
    },
    emphasis: {
      itemStyle: {
        color: "#639fc0"
      },
      label: {
        show: true
      }
    }
  }
};
var vec3$1 = glmatrix.vec3;
var mat4 = glmatrix.mat4;
var geoFixFuncs = [fixTextCoords, fixGeoCoords];
function Geo3D(name, map2, geoJson, specialAreas, nameMap) {
  this.name = name;
  this.map = map2;
  this.regionHeight = 0;
  this.regions = [];
  this._nameCoordMap = {};
  this.loadGeoJson(geoJson, specialAreas, nameMap);
  this.transform = mat4.identity(new Float64Array(16));
  this.invTransform = mat4.identity(new Float64Array(16));
  this.extrudeY = true;
  this.altitudeAxis;
}
Geo3D.prototype = {
  constructor: Geo3D,
  type: "geo3D",
  dimensions: ["lng", "lat", "alt"],
  containPoint: function() {
  },
  loadGeoJson: function(geoJson, specialAreas, nameMap) {
    var parseGeoJSON$1 = parseGeoJSON || parseGeoJSON;
    try {
      this.regions = geoJson ? parseGeoJSON$1(geoJson) : [];
    } catch (e2) {
      throw "Invalid geoJson format\n" + e2;
    }
    specialAreas = specialAreas || {};
    nameMap = nameMap || {};
    var regions = this.regions;
    var regionsMap = {};
    for (var i = 0; i < regions.length; i++) {
      var regionName = regions[i].name;
      regionName = nameMap[regionName] || regionName;
      regions[i].name = regionName;
      regionsMap[regionName] = regions[i];
      this.addGeoCoord(regionName, regions[i].getCenter());
      var specialArea = specialAreas[regionName];
      if (specialArea) {
        regions[i].transformTo(specialArea.left, specialArea.top, specialArea.width, specialArea.height);
      }
    }
    this._regionsMap = regionsMap;
    this._geoRect = null;
    geoFixFuncs.forEach(function(fixFunc) {
      fixFunc(this);
    }, this);
  },
  getGeoBoundingRect: function() {
    if (this._geoRect) {
      return this._geoRect;
    }
    var rect;
    var regions = this.regions;
    for (var i = 0; i < regions.length; i++) {
      var regionRect = regions[i].getBoundingRect();
      rect = rect || regionRect.clone();
      rect.union(regionRect);
    }
    return this._geoRect = rect || new BoundingRect(0, 0, 0, 0);
  },
  addGeoCoord: function(name, geoCoord) {
    this._nameCoordMap[name] = geoCoord;
  },
  getRegion: function(name) {
    return this._regionsMap[name];
  },
  getRegionByCoord: function(coord) {
    var regions = this.regions;
    for (var i = 0; i < regions.length; i++) {
      if (regions[i].contain(coord)) {
        return regions[i];
      }
    }
  },
  setSize: function(width, height, depth) {
    this.size = [width, height, depth];
    var rect = this.getGeoBoundingRect();
    var scaleX = width / rect.width;
    var scaleZ = -depth / rect.height;
    var translateX = -width / 2 - rect.x * scaleX;
    var translateZ = depth / 2 - rect.y * scaleZ;
    var position = this.extrudeY ? [translateX, 0, translateZ] : [translateX, translateZ, 0];
    var scale2 = this.extrudeY ? [scaleX, 1, scaleZ] : [scaleX, scaleZ, 1];
    var m = this.transform;
    mat4.identity(m);
    mat4.translate(m, m, position);
    mat4.scale(m, m, scale2);
    mat4.invert(this.invTransform, m);
  },
  dataToPoint: function(data, out) {
    out = out || [];
    var extrudeCoordIndex = this.extrudeY ? 1 : 2;
    var sideCoordIndex = this.extrudeY ? 2 : 1;
    var altitudeVal = data[2];
    if (isNaN(altitudeVal)) {
      altitudeVal = 0;
    }
    out[0] = data[0];
    out[sideCoordIndex] = data[1];
    if (this.altitudeAxis) {
      out[extrudeCoordIndex] = this.altitudeAxis.dataToCoord(altitudeVal);
    } else {
      out[extrudeCoordIndex] = 0;
    }
    out[extrudeCoordIndex] += this.regionHeight;
    vec3$1.transformMat4(out, out, this.transform);
    return out;
  },
  pointToData: function(point, out) {
  }
};
var TexturePool = function() {
  this._pool = {};
  this._allocatedTextures = [];
};
TexturePool.prototype = {
  constructor: TexturePool,
  get: function(parameters) {
    var key = generateKey(parameters);
    if (!this._pool.hasOwnProperty(key)) {
      this._pool[key] = [];
    }
    var list = this._pool[key];
    if (!list.length) {
      var texture = new Texture2D$1(parameters);
      this._allocatedTextures.push(texture);
      return texture;
    }
    return list.pop();
  },
  put: function(texture) {
    var key = generateKey(texture);
    if (!this._pool.hasOwnProperty(key)) {
      this._pool[key] = [];
    }
    var list = this._pool[key];
    list.push(texture);
  },
  clear: function(renderer) {
    for (var i = 0; i < this._allocatedTextures.length; i++) {
      this._allocatedTextures[i].dispose(renderer);
    }
    this._pool = {};
    this._allocatedTextures = [];
  }
};
var defaultParams = {
  width: 512,
  height: 512,
  type: glenum.UNSIGNED_BYTE,
  format: glenum.RGBA,
  wrapS: glenum.CLAMP_TO_EDGE,
  wrapT: glenum.CLAMP_TO_EDGE,
  minFilter: glenum.LINEAR_MIPMAP_LINEAR,
  magFilter: glenum.LINEAR,
  useMipmap: true,
  anisotropic: 1,
  flipY: true,
  unpackAlignment: 4,
  premultiplyAlpha: false
};
var defaultParamPropList = Object.keys(defaultParams);
function generateKey(parameters) {
  util$1.defaultsWithPropList(parameters, defaultParams, defaultParamPropList);
  fallBack(parameters);
  var key = "";
  for (var i = 0; i < defaultParamPropList.length; i++) {
    var name = defaultParamPropList[i];
    var chunk = parameters[name].toString();
    key += chunk;
  }
  return key;
}
function fallBack(target) {
  var IPOT = isPowerOfTwo(target.width, target.height);
  if (target.format === glenum.DEPTH_COMPONENT) {
    target.useMipmap = false;
  }
  if (!IPOT || !target.useMipmap) {
    if (target.minFilter == glenum.NEAREST_MIPMAP_NEAREST || target.minFilter == glenum.NEAREST_MIPMAP_LINEAR) {
      target.minFilter = glenum.NEAREST;
    } else if (target.minFilter == glenum.LINEAR_MIPMAP_LINEAR || target.minFilter == glenum.LINEAR_MIPMAP_NEAREST) {
      target.minFilter = glenum.LINEAR;
    }
  }
  if (!IPOT) {
    target.wrapS = glenum.CLAMP_TO_EDGE;
    target.wrapT = glenum.CLAMP_TO_EDGE;
  }
}
function isPowerOfTwo(width, height) {
  return (width & width - 1) === 0 && (height & height - 1) === 0;
}
var TexturePool$1 = TexturePool;
var shadowmapEssl = "@export clay.sm.depth.vertex\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\nattribute vec3 position : POSITION;\nattribute vec2 texcoord : TEXCOORD_0;\nuniform vec2 uvRepeat = vec2(1.0, 1.0);\nuniform vec2 uvOffset = vec2(0.0, 0.0);\n@import clay.chunk.skinning_header\n@import clay.chunk.instancing_header\nvarying vec4 v_ViewPosition;\nvarying vec2 v_Texcoord;\nvoid main(){\n vec4 P = vec4(position, 1.0);\n#ifdef SKINNING\n @import clay.chunk.skin_matrix\n P = skinMatrixWS * P;\n#endif\n#ifdef INSTANCING\n @import clay.chunk.instancing_matrix\n P = instanceMat * P;\n#endif\n v_ViewPosition = worldViewProjection * P;\n gl_Position = v_ViewPosition;\n v_Texcoord = texcoord * uvRepeat + uvOffset;\n}\n@end\n@export clay.sm.depth.fragment\nvarying vec4 v_ViewPosition;\nvarying vec2 v_Texcoord;\nuniform float bias : 0.001;\nuniform float slopeScale : 1.0;\nuniform sampler2D alphaMap;\nuniform float alphaCutoff: 0.0;\n@import clay.util.encode_float\nvoid main(){\n float depth = v_ViewPosition.z / v_ViewPosition.w;\n if (alphaCutoff > 0.0) {\n if (texture2D(alphaMap, v_Texcoord).a <= alphaCutoff) {\n discard;\n }\n }\n#ifdef USE_VSM\n depth = depth * 0.5 + 0.5;\n float moment1 = depth;\n float moment2 = depth * depth;\n #ifdef SUPPORT_STANDARD_DERIVATIVES\n float dx = dFdx(depth);\n float dy = dFdy(depth);\n moment2 += 0.25*(dx*dx+dy*dy);\n #endif\n gl_FragColor = vec4(moment1, moment2, 0.0, 1.0);\n#else\n #ifdef SUPPORT_STANDARD_DERIVATIVES\n float dx = dFdx(depth);\n float dy = dFdy(depth);\n depth += sqrt(dx*dx + dy*dy) * slopeScale + bias;\n #else\n depth += bias;\n #endif\n gl_FragColor = encodeFloat(depth * 0.5 + 0.5);\n#endif\n}\n@end\n@export clay.sm.debug_depth\nuniform sampler2D depthMap;\nvarying vec2 v_Texcoord;\n@import clay.util.decode_float\nvoid main() {\n vec4 tex = texture2D(depthMap, v_Texcoord);\n#ifdef USE_VSM\n gl_FragColor = vec4(tex.rgb, 1.0);\n#else\n float depth = decodeFloat(tex);\n gl_FragColor = vec4(depth, depth, depth, 1.0);\n#endif\n}\n@end\n@export clay.sm.distance.vertex\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\nuniform mat4 world : WORLD;\nattribute vec3 position : POSITION;\n@import clay.chunk.skinning_header\nvarying vec3 v_WorldPosition;\nvoid main (){\n vec4 P = vec4(position, 1.0);\n#ifdef SKINNING\n @import clay.chunk.skin_matrix\n P = skinMatrixWS * P;\n#endif\n#ifdef INSTANCING\n @import clay.chunk.instancing_matrix\n P = instanceMat * P;\n#endif\n gl_Position = worldViewProjection * P;\n v_WorldPosition = (world * P).xyz;\n}\n@end\n@export clay.sm.distance.fragment\nuniform vec3 lightPosition;\nuniform float range : 100;\nvarying vec3 v_WorldPosition;\n@import clay.util.encode_float\nvoid main(){\n float dist = distance(lightPosition, v_WorldPosition);\n#ifdef USE_VSM\n gl_FragColor = vec4(dist, dist * dist, 0.0, 0.0);\n#else\n dist = dist / range;\n gl_FragColor = encodeFloat(dist);\n#endif\n}\n@end\n@export clay.plugin.shadow_map_common\n@import clay.util.decode_float\nfloat tapShadowMap(sampler2D map, vec2 uv, float z){\n vec4 tex = texture2D(map, uv);\n return step(z, decodeFloat(tex) * 2.0 - 1.0);\n}\nfloat pcf(sampler2D map, vec2 uv, float z, float textureSize, vec2 scale) {\n float shadowContrib = tapShadowMap(map, uv, z);\n vec2 offset = vec2(1.0 / textureSize) * scale;\n#ifdef PCF_KERNEL_SIZE\n for (int _idx_ = 0; _idx_ < PCF_KERNEL_SIZE; _idx_++) {{\n shadowContrib += tapShadowMap(map, uv + offset * pcfKernel[_idx_], z);\n }}\n return shadowContrib / float(PCF_KERNEL_SIZE + 1);\n#else\n shadowContrib += tapShadowMap(map, uv+vec2(offset.x, 0.0), z);\n shadowContrib += tapShadowMap(map, uv+vec2(offset.x, offset.y), z);\n shadowContrib += tapShadowMap(map, uv+vec2(-offset.x, offset.y), z);\n shadowContrib += tapShadowMap(map, uv+vec2(0.0, offset.y), z);\n shadowContrib += tapShadowMap(map, uv+vec2(-offset.x, 0.0), z);\n shadowContrib += tapShadowMap(map, uv+vec2(-offset.x, -offset.y), z);\n shadowContrib += tapShadowMap(map, uv+vec2(offset.x, -offset.y), z);\n shadowContrib += tapShadowMap(map, uv+vec2(0.0, -offset.y), z);\n return shadowContrib / 9.0;\n#endif\n}\nfloat pcf(sampler2D map, vec2 uv, float z, float textureSize) {\n return pcf(map, uv, z, textureSize, vec2(1.0));\n}\nfloat chebyshevUpperBound(vec2 moments, float z){\n float p = 0.0;\n z = z * 0.5 + 0.5;\n if (z <= moments.x) {\n p = 1.0;\n }\n float variance = moments.y - moments.x * moments.x;\n variance = max(variance, 0.0000001);\n float mD = moments.x - z;\n float pMax = variance / (variance + mD * mD);\n pMax = clamp((pMax-0.4)/(1.0-0.4), 0.0, 1.0);\n return max(p, pMax);\n}\nfloat computeShadowContrib(\n sampler2D map, mat4 lightVPM, vec3 position, float textureSize, vec2 scale, vec2 offset\n) {\n vec4 posInLightSpace = lightVPM * vec4(position, 1.0);\n posInLightSpace.xyz /= posInLightSpace.w;\n float z = posInLightSpace.z;\n if(all(greaterThan(posInLightSpace.xyz, vec3(-0.99, -0.99, -1.0))) &&\n all(lessThan(posInLightSpace.xyz, vec3(0.99, 0.99, 1.0)))){\n vec2 uv = (posInLightSpace.xy+1.0) / 2.0;\n #ifdef USE_VSM\n vec2 moments = texture2D(map, uv * scale + offset).xy;\n return chebyshevUpperBound(moments, z);\n #else\n return pcf(map, uv * scale + offset, z, textureSize, scale);\n #endif\n }\n return 1.0;\n}\nfloat computeShadowContrib(sampler2D map, mat4 lightVPM, vec3 position, float textureSize) {\n return computeShadowContrib(map, lightVPM, position, textureSize, vec2(1.0), vec2(0.0));\n}\nfloat computeShadowContribOmni(samplerCube map, vec3 direction, float range)\n{\n float dist = length(direction);\n vec4 shadowTex = textureCube(map, direction);\n#ifdef USE_VSM\n vec2 moments = shadowTex.xy;\n float variance = moments.y - moments.x * moments.x;\n float mD = moments.x - dist;\n float p = variance / (variance + mD * mD);\n if(moments.x + 0.001 < dist){\n return clamp(p, 0.0, 1.0);\n }else{\n return 1.0;\n }\n#else\n return step(dist, (decodeFloat(shadowTex) + 0.0002) * range);\n#endif\n}\n@end\n@export clay.plugin.compute_shadow_map\n#if defined(SPOT_LIGHT_SHADOWMAP_COUNT) || defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT) || defined(POINT_LIGHT_SHADOWMAP_COUNT)\n#ifdef SPOT_LIGHT_SHADOWMAP_COUNT\nuniform sampler2D spotLightShadowMaps[SPOT_LIGHT_SHADOWMAP_COUNT]:unconfigurable;\nuniform mat4 spotLightMatrices[SPOT_LIGHT_SHADOWMAP_COUNT]:unconfigurable;\nuniform float spotLightShadowMapSizes[SPOT_LIGHT_SHADOWMAP_COUNT]:unconfigurable;\n#endif\n#ifdef DIRECTIONAL_LIGHT_SHADOWMAP_COUNT\n#if defined(SHADOW_CASCADE)\nuniform sampler2D directionalLightShadowMaps[1]:unconfigurable;\nuniform mat4 directionalLightMatrices[SHADOW_CASCADE]:unconfigurable;\nuniform float directionalLightShadowMapSizes[1]:unconfigurable;\nuniform float shadowCascadeClipsNear[SHADOW_CASCADE]:unconfigurable;\nuniform float shadowCascadeClipsFar[SHADOW_CASCADE]:unconfigurable;\n#else\nuniform sampler2D directionalLightShadowMaps[DIRECTIONAL_LIGHT_SHADOWMAP_COUNT]:unconfigurable;\nuniform mat4 directionalLightMatrices[DIRECTIONAL_LIGHT_SHADOWMAP_COUNT]:unconfigurable;\nuniform float directionalLightShadowMapSizes[DIRECTIONAL_LIGHT_SHADOWMAP_COUNT]:unconfigurable;\n#endif\n#endif\n#ifdef POINT_LIGHT_SHADOWMAP_COUNT\nuniform samplerCube pointLightShadowMaps[POINT_LIGHT_SHADOWMAP_COUNT]:unconfigurable;\n#endif\nuniform bool shadowEnabled : true;\n#ifdef PCF_KERNEL_SIZE\nuniform vec2 pcfKernel[PCF_KERNEL_SIZE];\n#endif\n@import clay.plugin.shadow_map_common\n#if defined(SPOT_LIGHT_SHADOWMAP_COUNT)\nvoid computeShadowOfSpotLights(vec3 position, inout float shadowContribs[SPOT_LIGHT_COUNT] ) {\n float shadowContrib;\n for(int _idx_ = 0; _idx_ < SPOT_LIGHT_SHADOWMAP_COUNT; _idx_++) {{\n shadowContrib = computeShadowContrib(\n spotLightShadowMaps[_idx_], spotLightMatrices[_idx_], position,\n spotLightShadowMapSizes[_idx_]\n );\n shadowContribs[_idx_] = shadowContrib;\n }}\n for(int _idx_ = SPOT_LIGHT_SHADOWMAP_COUNT; _idx_ < SPOT_LIGHT_COUNT; _idx_++){{\n shadowContribs[_idx_] = 1.0;\n }}\n}\n#endif\n#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)\n#ifdef SHADOW_CASCADE\nvoid computeShadowOfDirectionalLights(vec3 position, inout float shadowContribs[DIRECTIONAL_LIGHT_COUNT]){\n float depth = (2.0 * gl_FragCoord.z - gl_DepthRange.near - gl_DepthRange.far)\n / (gl_DepthRange.far - gl_DepthRange.near);\n float shadowContrib;\n shadowContribs[0] = 1.0;\n for (int _idx_ = 0; _idx_ < SHADOW_CASCADE; _idx_++) {{\n if (\n depth >= shadowCascadeClipsNear[_idx_] &&\n depth <= shadowCascadeClipsFar[_idx_]\n ) {\n shadowContrib = computeShadowContrib(\n directionalLightShadowMaps[0], directionalLightMatrices[_idx_], position,\n directionalLightShadowMapSizes[0],\n vec2(1.0 / float(SHADOW_CASCADE), 1.0),\n vec2(float(_idx_) / float(SHADOW_CASCADE), 0.0)\n );\n shadowContribs[0] = shadowContrib;\n }\n }}\n for(int _idx_ = DIRECTIONAL_LIGHT_SHADOWMAP_COUNT; _idx_ < DIRECTIONAL_LIGHT_COUNT; _idx_++) {{\n shadowContribs[_idx_] = 1.0;\n }}\n}\n#else\nvoid computeShadowOfDirectionalLights(vec3 position, inout float shadowContribs[DIRECTIONAL_LIGHT_COUNT]){\n float shadowContrib;\n for(int _idx_ = 0; _idx_ < DIRECTIONAL_LIGHT_SHADOWMAP_COUNT; _idx_++) {{\n shadowContrib = computeShadowContrib(\n directionalLightShadowMaps[_idx_], directionalLightMatrices[_idx_], position,\n directionalLightShadowMapSizes[_idx_]\n );\n shadowContribs[_idx_] = shadowContrib;\n }}\n for(int _idx_ = DIRECTIONAL_LIGHT_SHADOWMAP_COUNT; _idx_ < DIRECTIONAL_LIGHT_COUNT; _idx_++) {{\n shadowContribs[_idx_] = 1.0;\n }}\n}\n#endif\n#endif\n#if defined(POINT_LIGHT_SHADOWMAP_COUNT)\nvoid computeShadowOfPointLights(vec3 position, inout float shadowContribs[POINT_LIGHT_COUNT] ){\n vec3 lightPosition;\n vec3 direction;\n for(int _idx_ = 0; _idx_ < POINT_LIGHT_SHADOWMAP_COUNT; _idx_++) {{\n lightPosition = pointLightPosition[_idx_];\n direction = position - lightPosition;\n shadowContribs[_idx_] = computeShadowContribOmni(pointLightShadowMaps[_idx_], direction, pointLightRange[_idx_]);\n }}\n for(int _idx_ = POINT_LIGHT_SHADOWMAP_COUNT; _idx_ < POINT_LIGHT_COUNT; _idx_++) {{\n shadowContribs[_idx_] = 1.0;\n }}\n}\n#endif\n#endif\n@end";
var targets = ["px", "nx", "py", "ny", "pz", "nz"];
Shader["import"](shadowmapEssl);
function getDepthMaterialUniform(renderable, depthMaterial, symbol) {
  if (symbol === "alphaMap") {
    return renderable.material.get("diffuseMap");
  } else if (symbol === "alphaCutoff") {
    if (renderable.material.isDefined("fragment", "ALPHA_TEST") && renderable.material.get("diffuseMap")) {
      var alphaCutoff = renderable.material.get("alphaCutoff");
      return alphaCutoff || 0;
    }
    return 0;
  } else if (symbol === "uvRepeat") {
    return renderable.material.get("uvRepeat");
  } else if (symbol === "uvOffset") {
    return renderable.material.get("uvOffset");
  } else {
    return depthMaterial.get(symbol);
  }
}
function isDepthMaterialChanged(renderable, prevRenderable) {
  var matA = renderable.material;
  var matB = prevRenderable.material;
  return matA.get("diffuseMap") !== matB.get("diffuseMap") || (matA.get("alphaCutoff") || 0) !== (matB.get("alphaCutoff") || 0);
}
var ShadowMapPass = Base$1.extend(function() {
  return {
    softShadow: ShadowMapPass.PCF,
    shadowBlur: 1,
    lightFrustumBias: "auto",
    kernelPCF: new Float32Array([1, 0, 1, 1, -1, 1, 0, 1, -1, 0, -1, -1, 1, -1, 0, -1]),
    precision: "highp",
    _lastRenderNotCastShadow: false,
    _frameBuffer: new FrameBuffer$1(),
    _textures: {},
    _shadowMapNumber: {
      "POINT_LIGHT": 0,
      "DIRECTIONAL_LIGHT": 0,
      "SPOT_LIGHT": 0
    },
    _depthMaterials: {},
    _distanceMaterials: {},
    _receivers: [],
    _lightsCastShadow: [],
    _lightCameras: {},
    _lightMaterials: {},
    _texturePool: new TexturePool$1()
  };
}, function() {
  this._gaussianPassH = new Pass$1({
    fragment: Shader.source("clay.compositor.gaussian_blur")
  });
  this._gaussianPassV = new Pass$1({
    fragment: Shader.source("clay.compositor.gaussian_blur")
  });
  this._gaussianPassH.setUniform("blurSize", this.shadowBlur);
  this._gaussianPassH.setUniform("blurDir", 0);
  this._gaussianPassV.setUniform("blurSize", this.shadowBlur);
  this._gaussianPassV.setUniform("blurDir", 1);
  this._outputDepthPass = new Pass$1({
    fragment: Shader.source("clay.sm.debug_depth")
  });
}, {
  render: function(renderer, scene, sceneCamera, notUpdateScene) {
    if (!sceneCamera) {
      sceneCamera = scene.getMainCamera();
    }
    this.trigger("beforerender", this, renderer, scene, sceneCamera);
    this._renderShadowPass(renderer, scene, sceneCamera, notUpdateScene);
    this.trigger("afterrender", this, renderer, scene, sceneCamera);
  },
  renderDebug: function(renderer, size) {
    renderer.saveClear();
    var viewport = renderer.viewport;
    var x = 0, y = 0;
    var width = size || viewport.width / 4;
    var height = width;
    if (this.softShadow === ShadowMapPass.VSM) {
      this._outputDepthPass.material.define("fragment", "USE_VSM");
    } else {
      this._outputDepthPass.material.undefine("fragment", "USE_VSM");
    }
    for (var name in this._textures) {
      var texture = this._textures[name];
      renderer.setViewport(x, y, width * texture.width / texture.height, height);
      this._outputDepthPass.setUniform("depthMap", texture);
      this._outputDepthPass.render(renderer);
      x += width * texture.width / texture.height;
    }
    renderer.setViewport(viewport);
    renderer.restoreClear();
  },
  _updateReceivers: function(renderer, mesh2) {
    if (mesh2.receiveShadow) {
      this._receivers.push(mesh2);
      mesh2.material.set("shadowEnabled", 1);
      mesh2.material.set("pcfKernel", this.kernelPCF);
    } else {
      mesh2.material.set("shadowEnabled", 0);
    }
    if (this.softShadow === ShadowMapPass.VSM) {
      mesh2.material.define("fragment", "USE_VSM");
      mesh2.material.undefine("fragment", "PCF_KERNEL_SIZE");
    } else {
      mesh2.material.undefine("fragment", "USE_VSM");
      var kernelPCF = this.kernelPCF;
      if (kernelPCF && kernelPCF.length) {
        mesh2.material.define("fragment", "PCF_KERNEL_SIZE", kernelPCF.length / 2);
      } else {
        mesh2.material.undefine("fragment", "PCF_KERNEL_SIZE");
      }
    }
  },
  _update: function(renderer, scene) {
    var self = this;
    scene.traverse(function(renderable) {
      if (renderable.isRenderable()) {
        self._updateReceivers(renderer, renderable);
      }
    });
    for (var i = 0; i < scene.lights.length; i++) {
      var light = scene.lights[i];
      if (light.castShadow && !light.invisible) {
        this._lightsCastShadow.push(light);
      }
    }
  },
  _renderShadowPass: function(renderer, scene, sceneCamera, notUpdateScene) {
    for (var name in this._shadowMapNumber) {
      this._shadowMapNumber[name] = 0;
    }
    this._lightsCastShadow.length = 0;
    this._receivers.length = 0;
    var _gl = renderer.gl;
    if (!notUpdateScene) {
      scene.update();
    }
    if (sceneCamera) {
      sceneCamera.update();
    }
    scene.updateLights();
    this._update(renderer, scene);
    if (!this._lightsCastShadow.length && this._lastRenderNotCastShadow) {
      return;
    }
    this._lastRenderNotCastShadow = this._lightsCastShadow === 0;
    _gl.enable(_gl.DEPTH_TEST);
    _gl.depthMask(true);
    _gl.disable(_gl.BLEND);
    _gl.clearColor(1, 1, 1, 1);
    var spotLightShadowMaps = [];
    var spotLightMatrices = [];
    var directionalLightShadowMaps = [];
    var directionalLightMatrices = [];
    var shadowCascadeClips = [];
    var pointLightShadowMaps = [];
    var dirLightHasCascade;
    for (var i = 0; i < this._lightsCastShadow.length; i++) {
      var light = this._lightsCastShadow[i];
      if (light.type === "DIRECTIONAL_LIGHT") {
        if (dirLightHasCascade) {
          console.warn("Only one direectional light supported with shadow cascade");
          continue;
        }
        if (light.shadowCascade > 4) {
          console.warn("Support at most 4 cascade");
          continue;
        }
        if (light.shadowCascade > 1) {
          dirLightHasCascade = light;
        }
        this.renderDirectionalLightShadow(renderer, scene, sceneCamera, light, shadowCascadeClips, directionalLightMatrices, directionalLightShadowMaps);
      } else if (light.type === "SPOT_LIGHT") {
        this.renderSpotLightShadow(renderer, scene, light, spotLightMatrices, spotLightShadowMaps);
      } else if (light.type === "POINT_LIGHT") {
        this.renderPointLightShadow(renderer, scene, light, pointLightShadowMaps);
      }
      this._shadowMapNumber[light.type]++;
    }
    for (var lightType in this._shadowMapNumber) {
      var number = this._shadowMapNumber[lightType];
      var key = lightType + "_SHADOWMAP_COUNT";
      for (var i = 0; i < this._receivers.length; i++) {
        var mesh2 = this._receivers[i];
        var material = mesh2.material;
        if (material.fragmentDefines[key] !== number) {
          if (number > 0) {
            material.define("fragment", key, number);
          } else if (material.isDefined("fragment", key)) {
            material.undefine("fragment", key);
          }
        }
      }
    }
    for (var i = 0; i < this._receivers.length; i++) {
      var mesh2 = this._receivers[i];
      var material = mesh2.material;
      if (dirLightHasCascade) {
        material.define("fragment", "SHADOW_CASCADE", dirLightHasCascade.shadowCascade);
      } else {
        material.undefine("fragment", "SHADOW_CASCADE");
      }
    }
    var shadowUniforms = scene.shadowUniforms;
    function getSize(texture) {
      return texture.height;
    }
    if (directionalLightShadowMaps.length > 0) {
      var directionalLightShadowMapSizes = directionalLightShadowMaps.map(getSize);
      shadowUniforms.directionalLightShadowMaps = {
        value: directionalLightShadowMaps,
        type: "tv"
      };
      shadowUniforms.directionalLightMatrices = {
        value: directionalLightMatrices,
        type: "m4v"
      };
      shadowUniforms.directionalLightShadowMapSizes = {
        value: directionalLightShadowMapSizes,
        type: "1fv"
      };
      if (dirLightHasCascade) {
        var shadowCascadeClipsNear = shadowCascadeClips.slice();
        var shadowCascadeClipsFar = shadowCascadeClips.slice();
        shadowCascadeClipsNear.pop();
        shadowCascadeClipsFar.shift();
        shadowCascadeClipsNear.reverse();
        shadowCascadeClipsFar.reverse();
        directionalLightMatrices.reverse();
        shadowUniforms.shadowCascadeClipsNear = {
          value: shadowCascadeClipsNear,
          type: "1fv"
        };
        shadowUniforms.shadowCascadeClipsFar = {
          value: shadowCascadeClipsFar,
          type: "1fv"
        };
      }
    }
    if (spotLightShadowMaps.length > 0) {
      var spotLightShadowMapSizes = spotLightShadowMaps.map(getSize);
      var shadowUniforms = scene.shadowUniforms;
      shadowUniforms.spotLightShadowMaps = {
        value: spotLightShadowMaps,
        type: "tv"
      };
      shadowUniforms.spotLightMatrices = {
        value: spotLightMatrices,
        type: "m4v"
      };
      shadowUniforms.spotLightShadowMapSizes = {
        value: spotLightShadowMapSizes,
        type: "1fv"
      };
    }
    if (pointLightShadowMaps.length > 0) {
      shadowUniforms.pointLightShadowMaps = {
        value: pointLightShadowMaps,
        type: "tv"
      };
    }
  },
  renderDirectionalLightShadow: function() {
    var splitFrustum = new Frustum$1();
    var splitProjMatrix = new Matrix4$1();
    var cropBBox = new BoundingBox$1();
    var cropMatrix = new Matrix4$1();
    var lightViewMatrix = new Matrix4$1();
    var lightViewProjMatrix = new Matrix4$1();
    var lightProjMatrix = new Matrix4$1();
    return function(renderer, scene, sceneCamera, light, shadowCascadeClips, directionalLightMatrices, directionalLightShadowMaps) {
      var defaultShadowMaterial = this._getDepthMaterial(light);
      var passConfig = {
        getMaterial: function(renderable) {
          return renderable.shadowDepthMaterial || defaultShadowMaterial;
        },
        isMaterialChanged: isDepthMaterialChanged,
        getUniform: getDepthMaterialUniform,
        ifRender: function(renderable) {
          return renderable.castShadow;
        },
        sortCompare: Renderer$1.opaqueSortCompare
      };
      if (!scene.viewBoundingBoxLastFrame.isFinite()) {
        var boundingBox = scene.getBoundingBox();
        scene.viewBoundingBoxLastFrame.copy(boundingBox).applyTransform(sceneCamera.viewMatrix);
      }
      var clippedFar = Math.min(-scene.viewBoundingBoxLastFrame.min.z, sceneCamera.far);
      var clippedNear = Math.max(-scene.viewBoundingBoxLastFrame.max.z, sceneCamera.near);
      var lightCamera = this._getDirectionalLightCamera(light, scene, sceneCamera);
      var lvpMat4Arr = lightViewProjMatrix.array;
      lightProjMatrix.copy(lightCamera.projectionMatrix);
      mat4$2.invert(lightViewMatrix.array, lightCamera.worldTransform.array);
      mat4$2.multiply(lightViewMatrix.array, lightViewMatrix.array, sceneCamera.worldTransform.array);
      mat4$2.multiply(lvpMat4Arr, lightProjMatrix.array, lightViewMatrix.array);
      var clipPlanes = [];
      var isPerspective = sceneCamera instanceof PerspectiveCamera;
      var scaleZ = (sceneCamera.near + sceneCamera.far) / (sceneCamera.near - sceneCamera.far);
      var offsetZ = 2 * sceneCamera.near * sceneCamera.far / (sceneCamera.near - sceneCamera.far);
      for (var i = 0; i <= light.shadowCascade; i++) {
        var clog = clippedNear * Math.pow(clippedFar / clippedNear, i / light.shadowCascade);
        var cuni = clippedNear + (clippedFar - clippedNear) * i / light.shadowCascade;
        var c = clog * light.cascadeSplitLogFactor + cuni * (1 - light.cascadeSplitLogFactor);
        clipPlanes.push(c);
        shadowCascadeClips.push(-(-c * scaleZ + offsetZ) / -c);
      }
      var texture = this._getTexture(light, light.shadowCascade);
      directionalLightShadowMaps.push(texture);
      var viewport = renderer.viewport;
      var _gl = renderer.gl;
      this._frameBuffer.attach(texture);
      this._frameBuffer.bind(renderer);
      _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);
      for (var i = 0; i < light.shadowCascade; i++) {
        var nearPlane = clipPlanes[i];
        var farPlane = clipPlanes[i + 1];
        if (isPerspective) {
          mat4$2.perspective(splitProjMatrix.array, sceneCamera.fov / 180 * Math.PI, sceneCamera.aspect, nearPlane, farPlane);
        } else {
          mat4$2.ortho(splitProjMatrix.array, sceneCamera.left, sceneCamera.right, sceneCamera.bottom, sceneCamera.top, nearPlane, farPlane);
        }
        splitFrustum.setFromProjection(splitProjMatrix);
        splitFrustum.getTransformedBoundingBox(cropBBox, lightViewMatrix);
        cropBBox.applyProjection(lightProjMatrix);
        var _min = cropBBox.min.array;
        var _max = cropBBox.max.array;
        _min[0] = Math.max(_min[0], -1);
        _min[1] = Math.max(_min[1], -1);
        _max[0] = Math.min(_max[0], 1);
        _max[1] = Math.min(_max[1], 1);
        cropMatrix.ortho(_min[0], _max[0], _min[1], _max[1], 1, -1);
        lightCamera.projectionMatrix.multiplyLeft(cropMatrix);
        var shadowSize = light.shadowResolution || 512;
        renderer.setViewport((light.shadowCascade - i - 1) * shadowSize, 0, shadowSize, shadowSize, 1);
        var renderList = scene.updateRenderList(lightCamera);
        renderer.renderPass(renderList.opaque, lightCamera, passConfig);
        if (this.softShadow === ShadowMapPass.VSM) {
          this._gaussianFilter(renderer, texture, texture.width);
        }
        var matrix = new Matrix4$1();
        matrix.copy(lightCamera.viewMatrix).multiplyLeft(lightCamera.projectionMatrix);
        directionalLightMatrices.push(matrix.array);
        lightCamera.projectionMatrix.copy(lightProjMatrix);
      }
      this._frameBuffer.unbind(renderer);
      renderer.setViewport(viewport);
    };
  }(),
  renderSpotLightShadow: function(renderer, scene, light, spotLightMatrices, spotLightShadowMaps) {
    var texture = this._getTexture(light);
    var lightCamera = this._getSpotLightCamera(light);
    var _gl = renderer.gl;
    this._frameBuffer.attach(texture);
    this._frameBuffer.bind(renderer);
    _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);
    var defaultShadowMaterial = this._getDepthMaterial(light);
    var passConfig = {
      getMaterial: function(renderable) {
        return renderable.shadowDepthMaterial || defaultShadowMaterial;
      },
      isMaterialChanged: isDepthMaterialChanged,
      getUniform: getDepthMaterialUniform,
      ifRender: function(renderable) {
        return renderable.castShadow;
      },
      sortCompare: Renderer$1.opaqueSortCompare
    };
    var renderList = scene.updateRenderList(lightCamera);
    renderer.renderPass(renderList.opaque, lightCamera, passConfig);
    this._frameBuffer.unbind(renderer);
    if (this.softShadow === ShadowMapPass.VSM) {
      this._gaussianFilter(renderer, texture, texture.width);
    }
    var matrix = new Matrix4$1();
    matrix.copy(lightCamera.worldTransform).invert().multiplyLeft(lightCamera.projectionMatrix);
    spotLightShadowMaps.push(texture);
    spotLightMatrices.push(matrix.array);
  },
  renderPointLightShadow: function(renderer, scene, light, pointLightShadowMaps) {
    var texture = this._getTexture(light);
    var _gl = renderer.gl;
    pointLightShadowMaps.push(texture);
    var defaultShadowMaterial = this._getDepthMaterial(light);
    var passConfig = {
      getMaterial: function(renderable) {
        return renderable.shadowDepthMaterial || defaultShadowMaterial;
      },
      getUniform: getDepthMaterialUniform,
      sortCompare: Renderer$1.opaqueSortCompare
    };
    var renderListEachSide = {
      px: [],
      py: [],
      pz: [],
      nx: [],
      ny: [],
      nz: []
    };
    var bbox = new BoundingBox$1();
    var lightWorldPosition = light.getWorldPosition().array;
    var lightBBox = new BoundingBox$1();
    var range = light.range;
    lightBBox.min.setArray(lightWorldPosition);
    lightBBox.max.setArray(lightWorldPosition);
    var extent3 = new Vector3$1(range, range, range);
    lightBBox.max.add(extent3);
    lightBBox.min.sub(extent3);
    var targetsNeedRender = {
      px: false,
      py: false,
      pz: false,
      nx: false,
      ny: false,
      nz: false
    };
    scene.traverse(function(renderable) {
      if (renderable.isRenderable() && renderable.castShadow) {
        var geometry = renderable.geometry;
        if (!geometry.boundingBox) {
          for (var i2 = 0; i2 < targets.length; i2++) {
            renderListEachSide[targets[i2]].push(renderable);
          }
          return;
        }
        bbox.transformFrom(geometry.boundingBox, renderable.worldTransform);
        if (!bbox.intersectBoundingBox(lightBBox)) {
          return;
        }
        bbox.updateVertices();
        for (var i2 = 0; i2 < targets.length; i2++) {
          targetsNeedRender[targets[i2]] = false;
        }
        for (var i2 = 0; i2 < 8; i2++) {
          var vtx = bbox.vertices[i2];
          var x = vtx[0] - lightWorldPosition[0];
          var y = vtx[1] - lightWorldPosition[1];
          var z = vtx[2] - lightWorldPosition[2];
          var absx = Math.abs(x);
          var absy = Math.abs(y);
          var absz = Math.abs(z);
          if (absx > absy) {
            if (absx > absz) {
              targetsNeedRender[x > 0 ? "px" : "nx"] = true;
            } else {
              targetsNeedRender[z > 0 ? "pz" : "nz"] = true;
            }
          } else {
            if (absy > absz) {
              targetsNeedRender[y > 0 ? "py" : "ny"] = true;
            } else {
              targetsNeedRender[z > 0 ? "pz" : "nz"] = true;
            }
          }
        }
        for (var i2 = 0; i2 < targets.length; i2++) {
          if (targetsNeedRender[targets[i2]]) {
            renderListEachSide[targets[i2]].push(renderable);
          }
        }
      }
    });
    for (var i = 0; i < 6; i++) {
      var target = targets[i];
      var camera2 = this._getPointLightCamera(light, target);
      this._frameBuffer.attach(texture, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i);
      this._frameBuffer.bind(renderer);
      _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);
      renderer.renderPass(renderListEachSide[target], camera2, passConfig);
    }
    this._frameBuffer.unbind(renderer);
  },
  _getDepthMaterial: function(light) {
    var shadowMaterial = this._lightMaterials[light.__uid__];
    var isPointLight = light.type === "POINT_LIGHT";
    if (!shadowMaterial) {
      var shaderPrefix = isPointLight ? "clay.sm.distance." : "clay.sm.depth.";
      shadowMaterial = new Material$1({
        precision: this.precision,
        shader: new Shader(Shader.source(shaderPrefix + "vertex"), Shader.source(shaderPrefix + "fragment"))
      });
      this._lightMaterials[light.__uid__] = shadowMaterial;
    }
    if (light.shadowSlopeScale != null) {
      shadowMaterial.setUniform("slopeScale", light.shadowSlopeScale);
    }
    if (light.shadowBias != null) {
      shadowMaterial.setUniform("bias", light.shadowBias);
    }
    if (this.softShadow === ShadowMapPass.VSM) {
      shadowMaterial.define("fragment", "USE_VSM");
    } else {
      shadowMaterial.undefine("fragment", "USE_VSM");
    }
    if (isPointLight) {
      shadowMaterial.set("lightPosition", light.getWorldPosition().array);
      shadowMaterial.set("range", light.range);
    }
    return shadowMaterial;
  },
  _gaussianFilter: function(renderer, texture, size) {
    var parameter = {
      width: size,
      height: size,
      type: Texture$1.FLOAT
    };
    var tmpTexture = this._texturePool.get(parameter);
    this._frameBuffer.attach(tmpTexture);
    this._frameBuffer.bind(renderer);
    this._gaussianPassH.setUniform("texture", texture);
    this._gaussianPassH.setUniform("textureWidth", size);
    this._gaussianPassH.render(renderer);
    this._frameBuffer.attach(texture);
    this._gaussianPassV.setUniform("texture", tmpTexture);
    this._gaussianPassV.setUniform("textureHeight", size);
    this._gaussianPassV.render(renderer);
    this._frameBuffer.unbind(renderer);
    this._texturePool.put(tmpTexture);
  },
  _getTexture: function(light, cascade) {
    var key = light.__uid__;
    var texture = this._textures[key];
    var resolution = light.shadowResolution || 512;
    cascade = cascade || 1;
    if (!texture) {
      if (light.type === "POINT_LIGHT") {
        texture = new TextureCube$1();
      } else {
        texture = new Texture2D$1();
      }
      texture.width = resolution * cascade;
      texture.height = resolution;
      if (this.softShadow === ShadowMapPass.VSM) {
        texture.type = Texture$1.FLOAT;
        texture.anisotropic = 4;
      } else {
        texture.minFilter = glenum.NEAREST;
        texture.magFilter = glenum.NEAREST;
        texture.useMipmap = false;
      }
      this._textures[key] = texture;
    }
    return texture;
  },
  _getPointLightCamera: function(light, target) {
    if (!this._lightCameras.point) {
      this._lightCameras.point = {
        px: new PerspectiveCamera(),
        nx: new PerspectiveCamera(),
        py: new PerspectiveCamera(),
        ny: new PerspectiveCamera(),
        pz: new PerspectiveCamera(),
        nz: new PerspectiveCamera()
      };
    }
    var camera2 = this._lightCameras.point[target];
    camera2.far = light.range;
    camera2.fov = 90;
    camera2.position.set(0, 0, 0);
    switch (target) {
      case "px":
        camera2.lookAt(Vector3$1.POSITIVE_X, Vector3$1.NEGATIVE_Y);
        break;
      case "nx":
        camera2.lookAt(Vector3$1.NEGATIVE_X, Vector3$1.NEGATIVE_Y);
        break;
      case "py":
        camera2.lookAt(Vector3$1.POSITIVE_Y, Vector3$1.POSITIVE_Z);
        break;
      case "ny":
        camera2.lookAt(Vector3$1.NEGATIVE_Y, Vector3$1.NEGATIVE_Z);
        break;
      case "pz":
        camera2.lookAt(Vector3$1.POSITIVE_Z, Vector3$1.NEGATIVE_Y);
        break;
      case "nz":
        camera2.lookAt(Vector3$1.NEGATIVE_Z, Vector3$1.NEGATIVE_Y);
        break;
    }
    light.getWorldPosition(camera2.position);
    camera2.update();
    return camera2;
  },
  _getDirectionalLightCamera: function() {
    var lightViewMatrix = new Matrix4$1();
    var sceneViewBoundingBox = new BoundingBox$1();
    var lightViewBBox = new BoundingBox$1();
    return function(light, scene, sceneCamera) {
      if (!this._lightCameras.directional) {
        this._lightCameras.directional = new OrthoCamera();
      }
      var camera2 = this._lightCameras.directional;
      sceneViewBoundingBox.copy(scene.viewBoundingBoxLastFrame);
      sceneViewBoundingBox.intersection(sceneCamera.frustum.boundingBox);
      camera2.position.copy(sceneViewBoundingBox.min).add(sceneViewBoundingBox.max).scale(0.5).transformMat4(sceneCamera.worldTransform);
      camera2.rotation.copy(light.rotation);
      camera2.scale.copy(light.scale);
      camera2.updateWorldTransform();
      Matrix4$1.invert(lightViewMatrix, camera2.worldTransform);
      Matrix4$1.multiply(lightViewMatrix, lightViewMatrix, sceneCamera.worldTransform);
      lightViewBBox.copy(sceneViewBoundingBox).applyTransform(lightViewMatrix);
      var min = lightViewBBox.min.array;
      var max = lightViewBBox.max.array;
      camera2.position.set((min[0] + max[0]) / 2, (min[1] + max[1]) / 2, max[2]).transformMat4(camera2.worldTransform);
      camera2.near = 0;
      camera2.far = -min[2] + max[2];
      if (isNaN(this.lightFrustumBias)) {
        camera2.far *= 4;
      } else {
        camera2.far += this.lightFrustumBias;
      }
      camera2.left = min[0];
      camera2.right = max[0];
      camera2.top = max[1];
      camera2.bottom = min[1];
      camera2.update(true);
      return camera2;
    };
  }(),
  _getSpotLightCamera: function(light) {
    if (!this._lightCameras.spot) {
      this._lightCameras.spot = new PerspectiveCamera();
    }
    var camera2 = this._lightCameras.spot;
    camera2.fov = light.penumbraAngle * 2;
    camera2.far = light.range;
    camera2.worldTransform.copy(light.worldTransform);
    camera2.updateProjectionMatrix();
    mat4$2.invert(camera2.viewMatrix.array, camera2.worldTransform.array);
    return camera2;
  },
  dispose: function(renderer) {
    var _gl = renderer.gl || renderer;
    if (this._frameBuffer) {
      this._frameBuffer.dispose(_gl);
    }
    for (var name in this._textures) {
      this._textures[name].dispose(_gl);
    }
    this._texturePool.clear(renderer.gl);
    this._depthMaterials = {};
    this._distanceMaterials = {};
    this._textures = {};
    this._lightCameras = {};
    this._shadowMapNumber = {
      "POINT_LIGHT": 0,
      "DIRECTIONAL_LIGHT": 0,
      "SPOT_LIGHT": 0
    };
    this._meshMaterials = {};
    for (var i = 0; i < this._receivers.length; i++) {
      var mesh2 = this._receivers[i];
      if (mesh2.material) {
        var material = mesh2.material;
        material.undefine("fragment", "POINT_LIGHT_SHADOW_COUNT");
        material.undefine("fragment", "DIRECTIONAL_LIGHT_SHADOW_COUNT");
        material.undefine("fragment", "AMBIENT_LIGHT_SHADOW_COUNT");
        material.set("shadowEnabled", 0);
      }
    }
    this._receivers = [];
    this._lightsCastShadow = [];
  }
});
ShadowMapPass.VSM = 1;
ShadowMapPass.PCF = 2;
var ShadowMapPass$1 = ShadowMapPass;
var CompositorNode = Base$1.extend(function() {
  return {
    name: "",
    inputLinks: {},
    outputLinks: {},
    _prevOutputTextures: {},
    _outputTextures: {},
    _outputReferences: {},
    _rendering: false,
    _rendered: false,
    _compositor: null
  };
}, {
  updateParameter: function(outputName, renderer) {
    var outputInfo = this.outputs[outputName];
    var parameters = outputInfo.parameters;
    var parametersCopy = outputInfo._parametersCopy;
    if (!parametersCopy) {
      parametersCopy = outputInfo._parametersCopy = {};
    }
    if (parameters) {
      for (var key in parameters) {
        if (key !== "width" && key !== "height") {
          parametersCopy[key] = parameters[key];
        }
      }
    }
    var width, height;
    if (parameters.width instanceof Function) {
      width = parameters.width.call(this, renderer);
    } else {
      width = parameters.width;
    }
    if (parameters.height instanceof Function) {
      height = parameters.height.call(this, renderer);
    } else {
      height = parameters.height;
    }
    if (parametersCopy.width !== width || parametersCopy.height !== height) {
      if (this._outputTextures[outputName]) {
        this._outputTextures[outputName].dispose(renderer.gl);
      }
    }
    parametersCopy.width = width;
    parametersCopy.height = height;
    return parametersCopy;
  },
  setParameter: function(name, value) {
  },
  getParameter: function(name) {
  },
  setParameters: function(obj) {
    for (var name in obj) {
      this.setParameter(name, obj[name]);
    }
  },
  render: function() {
  },
  getOutput: function(renderer, name) {
    if (name == null) {
      name = renderer;
      return this._outputTextures[name];
    }
    var outputInfo = this.outputs[name];
    if (!outputInfo) {
      return;
    }
    if (this._rendered) {
      if (outputInfo.outputLastFrame) {
        return this._prevOutputTextures[name];
      } else {
        return this._outputTextures[name];
      }
    } else if (this._rendering) {
      if (!this._prevOutputTextures[name]) {
        this._prevOutputTextures[name] = this._compositor.allocateTexture(outputInfo.parameters || {});
      }
      return this._prevOutputTextures[name];
    }
    this.render(renderer);
    return this._outputTextures[name];
  },
  removeReference: function(outputName) {
    this._outputReferences[outputName]--;
    if (this._outputReferences[outputName] === 0) {
      var outputInfo = this.outputs[outputName];
      if (outputInfo.keepLastFrame) {
        if (this._prevOutputTextures[outputName]) {
          this._compositor.releaseTexture(this._prevOutputTextures[outputName]);
        }
        this._prevOutputTextures[outputName] = this._outputTextures[outputName];
      } else {
        this._compositor.releaseTexture(this._outputTextures[outputName]);
      }
    }
  },
  link: function(inputPinName, fromNode, fromPinName) {
    this.inputLinks[inputPinName] = {
      node: fromNode,
      pin: fromPinName
    };
    if (!fromNode.outputLinks[fromPinName]) {
      fromNode.outputLinks[fromPinName] = [];
    }
    fromNode.outputLinks[fromPinName].push({
      node: this,
      pin: inputPinName
    });
    this.pass.material.enableTexture(inputPinName);
  },
  clear: function() {
    this.inputLinks = {};
    this.outputLinks = {};
  },
  updateReference: function(outputName) {
    if (!this._rendering) {
      this._rendering = true;
      for (var inputName in this.inputLinks) {
        var link = this.inputLinks[inputName];
        link.node.updateReference(link.pin);
      }
      this._rendering = false;
    }
    if (outputName) {
      this._outputReferences[outputName]++;
    }
  },
  beforeFrame: function() {
    this._rendered = false;
    for (var name in this.outputLinks) {
      this._outputReferences[name] = 0;
    }
  },
  afterFrame: function() {
    for (var name in this.outputLinks) {
      if (this._outputReferences[name] > 0) {
        var outputInfo = this.outputs[name];
        if (outputInfo.keepLastFrame) {
          if (this._prevOutputTextures[name]) {
            this._compositor.releaseTexture(this._prevOutputTextures[name]);
          }
          this._prevOutputTextures[name] = this._outputTextures[name];
        } else {
          this._compositor.releaseTexture(this._outputTextures[name]);
        }
      }
    }
  }
});
var CompositorNode$1 = CompositorNode;
var Graph = Base$1.extend(function() {
  return {
    nodes: []
  };
}, {
  dirty: function() {
    this._dirty = true;
  },
  addNode: function(node) {
    if (this.nodes.indexOf(node) >= 0) {
      return;
    }
    this.nodes.push(node);
    this._dirty = true;
  },
  removeNode: function(node) {
    if (typeof node === "string") {
      node = this.getNodeByName(node);
    }
    var idx = this.nodes.indexOf(node);
    if (idx >= 0) {
      this.nodes.splice(idx, 1);
      this._dirty = true;
    }
  },
  getNodeByName: function(name) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].name === name) {
        return this.nodes[i];
      }
    }
  },
  update: function() {
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].clear();
    }
    for (var i = 0; i < this.nodes.length; i++) {
      var node = this.nodes[i];
      if (!node.inputs) {
        continue;
      }
      for (var inputName in node.inputs) {
        if (!node.inputs[inputName]) {
          continue;
        }
        if (node.pass && !node.pass.material.isUniformEnabled(inputName)) {
          console.warn("Pin " + node.name + "." + inputName + " not used.");
          continue;
        }
        var fromPinInfo = node.inputs[inputName];
        var fromPin = this.findPin(fromPinInfo);
        if (fromPin) {
          node.link(inputName, fromPin.node, fromPin.pin);
        } else {
          if (typeof fromPinInfo === "string") {
            console.warn("Node " + fromPinInfo + " not exist");
          } else {
            console.warn("Pin of " + fromPinInfo.node + "." + fromPinInfo.pin + " not exist");
          }
        }
      }
    }
  },
  findPin: function(input) {
    var node;
    if (typeof input === "string" || input instanceof CompositorNode$1) {
      input = {
        node: input
      };
    }
    if (typeof input.node === "string") {
      for (var i = 0; i < this.nodes.length; i++) {
        var tmp = this.nodes[i];
        if (tmp.name === input.node) {
          node = tmp;
        }
      }
    } else {
      node = input.node;
    }
    if (node) {
      var inputPin = input.pin;
      if (!inputPin) {
        if (node.outputs) {
          inputPin = Object.keys(node.outputs)[0];
        }
      }
      if (node.outputs[inputPin]) {
        return {
          node,
          pin: inputPin
        };
      }
    }
  }
});
var Graph$1 = Graph;
var Compositor = Graph$1.extend(function() {
  return {
    _outputs: [],
    _texturePool: new TexturePool$1(),
    _frameBuffer: new FrameBuffer$1({
      depthBuffer: false
    })
  };
}, {
  addNode: function(node) {
    Graph$1.prototype.addNode.call(this, node);
    node._compositor = this;
  },
  render: function(renderer, frameBuffer) {
    if (this._dirty) {
      this.update();
      this._dirty = false;
      this._outputs.length = 0;
      for (var i = 0; i < this.nodes.length; i++) {
        if (!this.nodes[i].outputs) {
          this._outputs.push(this.nodes[i]);
        }
      }
    }
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].beforeFrame();
    }
    for (var i = 0; i < this._outputs.length; i++) {
      this._outputs[i].updateReference();
    }
    for (var i = 0; i < this._outputs.length; i++) {
      this._outputs[i].render(renderer, frameBuffer);
    }
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].afterFrame();
    }
  },
  allocateTexture: function(parameters) {
    return this._texturePool.get(parameters);
  },
  releaseTexture: function(parameters) {
    this._texturePool.put(parameters);
  },
  getFrameBuffer: function() {
    return this._frameBuffer;
  },
  dispose: function(renderer) {
    this._texturePool.clear(renderer);
  }
});
var Compositor$1 = Compositor;
var SceneNode = CompositorNode$1.extend({
  name: "scene",
  scene: null,
  camera: null,
  autoUpdateScene: true,
  preZ: false
}, function() {
  this.frameBuffer = new FrameBuffer$1();
}, {
  render: function(renderer) {
    this._rendering = true;
    var _gl = renderer.gl;
    this.trigger("beforerender");
    var renderInfo;
    if (!this.outputs) {
      renderInfo = renderer.render(this.scene, this.camera, !this.autoUpdateScene, this.preZ);
    } else {
      var frameBuffer = this.frameBuffer;
      for (var name in this.outputs) {
        var parameters = this.updateParameter(name, renderer);
        var outputInfo = this.outputs[name];
        var texture = this._compositor.allocateTexture(parameters);
        this._outputTextures[name] = texture;
        var attachment = outputInfo.attachment || _gl.COLOR_ATTACHMENT0;
        if (typeof attachment == "string") {
          attachment = _gl[attachment];
        }
        frameBuffer.attach(texture, attachment);
      }
      frameBuffer.bind(renderer);
      var ext = renderer.getGLExtension("EXT_draw_buffers");
      if (ext) {
        var bufs = [];
        for (var attachment in this.outputs) {
          attachment = parseInt(attachment);
          if (attachment >= _gl.COLOR_ATTACHMENT0 && attachment <= _gl.COLOR_ATTACHMENT0 + 8) {
            bufs.push(attachment);
          }
        }
        ext.drawBuffersEXT(bufs);
      }
      renderer.saveClear();
      renderer.clearBit = glenum.DEPTH_BUFFER_BIT | glenum.COLOR_BUFFER_BIT;
      renderInfo = renderer.render(this.scene, this.camera, !this.autoUpdateScene, this.preZ);
      renderer.restoreClear();
      frameBuffer.unbind(renderer);
    }
    this.trigger("afterrender", renderInfo);
    this._rendering = false;
    this._rendered = true;
  }
});
var CompoSceneNode = SceneNode;
var TextureNode = CompositorNode$1.extend(function() {
  return {
    texture: null,
    outputs: {
      color: {}
    }
  };
}, function() {
}, {
  getOutput: function(renderer, name) {
    return this.texture;
  },
  beforeFrame: function() {
  },
  afterFrame: function() {
  }
});
var CompoTextureNode = TextureNode;
var FilterNode = CompositorNode$1.extend(function() {
  return {
    name: "",
    inputs: {},
    outputs: null,
    shader: "",
    inputLinks: {},
    outputLinks: {},
    pass: null,
    _prevOutputTextures: {},
    _outputTextures: {},
    _outputReferences: {},
    _rendering: false,
    _rendered: false,
    _compositor: null
  };
}, function() {
  var pass = new Pass$1({
    fragment: this.shader
  });
  this.pass = pass;
}, {
  render: function(renderer, frameBuffer) {
    this.trigger("beforerender", renderer);
    this._rendering = true;
    var _gl = renderer.gl;
    for (var inputName in this.inputLinks) {
      var link = this.inputLinks[inputName];
      var inputTexture = link.node.getOutput(renderer, link.pin);
      this.pass.setUniform(inputName, inputTexture);
    }
    if (!this.outputs) {
      this.pass.outputs = null;
      this._compositor.getFrameBuffer().unbind(renderer);
      this.pass.render(renderer, frameBuffer);
    } else {
      this.pass.outputs = {};
      var attachedTextures = {};
      for (var name in this.outputs) {
        var parameters = this.updateParameter(name, renderer);
        if (isNaN(parameters.width)) {
          this.updateParameter(name, renderer);
        }
        var outputInfo = this.outputs[name];
        var texture = this._compositor.allocateTexture(parameters);
        this._outputTextures[name] = texture;
        var attachment = outputInfo.attachment || _gl.COLOR_ATTACHMENT0;
        if (typeof attachment === "string") {
          attachment = _gl[attachment];
        }
        attachedTextures[attachment] = texture;
      }
      this._compositor.getFrameBuffer().bind(renderer);
      for (var attachment in attachedTextures) {
        this._compositor.getFrameBuffer().attach(attachedTextures[attachment], attachment);
      }
      this.pass.render(renderer);
      this._compositor.getFrameBuffer().updateMipmap(renderer);
    }
    for (var inputName in this.inputLinks) {
      var link = this.inputLinks[inputName];
      link.node.removeReference(link.pin);
    }
    this._rendering = false;
    this._rendered = true;
    this.trigger("afterrender", renderer);
  },
  updateParameter: function(outputName, renderer) {
    var outputInfo = this.outputs[outputName];
    var parameters = outputInfo.parameters;
    var parametersCopy = outputInfo._parametersCopy;
    if (!parametersCopy) {
      parametersCopy = outputInfo._parametersCopy = {};
    }
    if (parameters) {
      for (var key in parameters) {
        if (key !== "width" && key !== "height") {
          parametersCopy[key] = parameters[key];
        }
      }
    }
    var width, height;
    if (typeof parameters.width === "function") {
      width = parameters.width.call(this, renderer);
    } else {
      width = parameters.width;
    }
    if (typeof parameters.height === "function") {
      height = parameters.height.call(this, renderer);
    } else {
      height = parameters.height;
    }
    width = Math.ceil(width);
    height = Math.ceil(height);
    if (parametersCopy.width !== width || parametersCopy.height !== height) {
      if (this._outputTextures[outputName]) {
        this._outputTextures[outputName].dispose(renderer);
      }
    }
    parametersCopy.width = width;
    parametersCopy.height = height;
    return parametersCopy;
  },
  setParameter: function(name, value) {
    this.pass.setUniform(name, value);
  },
  getParameter: function(name) {
    return this.pass.getUniform(name);
  },
  setParameters: function(obj) {
    for (var name in obj) {
      this.setParameter(name, obj[name]);
    }
  },
  define: function(symbol, val) {
    this.pass.material.define("fragment", symbol, val);
  },
  undefine: function(symbol) {
    this.pass.material.undefine("fragment", symbol);
  },
  removeReference: function(outputName) {
    this._outputReferences[outputName]--;
    if (this._outputReferences[outputName] === 0) {
      var outputInfo = this.outputs[outputName];
      if (outputInfo.keepLastFrame) {
        if (this._prevOutputTextures[outputName]) {
          this._compositor.releaseTexture(this._prevOutputTextures[outputName]);
        }
        this._prevOutputTextures[outputName] = this._outputTextures[outputName];
      } else {
        this._compositor.releaseTexture(this._outputTextures[outputName]);
      }
    }
  },
  clear: function() {
    CompositorNode$1.prototype.clear.call(this);
    this.pass.material.disableTexturesAll();
  }
});
var CompoFilterNode = FilterNode;
var coloradjustEssl = "@export clay.compositor.coloradjust\nvarying vec2 v_Texcoord;\nuniform sampler2D texture;\nuniform float brightness : 0.0;\nuniform float contrast : 1.0;\nuniform float exposure : 0.0;\nuniform float gamma : 1.0;\nuniform float saturation : 1.0;\nconst vec3 w = vec3(0.2125, 0.7154, 0.0721);\nvoid main()\n{\n vec4 tex = texture2D( texture, v_Texcoord);\n vec3 color = clamp(tex.rgb + vec3(brightness), 0.0, 1.0);\n color = clamp( (color-vec3(0.5))*contrast+vec3(0.5), 0.0, 1.0);\n color = clamp( color * pow(2.0, exposure), 0.0, 1.0);\n color = clamp( pow(color, vec3(gamma)), 0.0, 1.0);\n float luminance = dot( color, w );\n color = mix(vec3(luminance), color, saturation);\n gl_FragColor = vec4(color, tex.a);\n}\n@end\n@export clay.compositor.brightness\nvarying vec2 v_Texcoord;\nuniform sampler2D texture;\nuniform float brightness : 0.0;\nvoid main()\n{\n vec4 tex = texture2D( texture, v_Texcoord);\n vec3 color = tex.rgb + vec3(brightness);\n gl_FragColor = vec4(color, tex.a);\n}\n@end\n@export clay.compositor.contrast\nvarying vec2 v_Texcoord;\nuniform sampler2D texture;\nuniform float contrast : 1.0;\nvoid main()\n{\n vec4 tex = texture2D( texture, v_Texcoord);\n vec3 color = (tex.rgb-vec3(0.5))*contrast+vec3(0.5);\n gl_FragColor = vec4(color, tex.a);\n}\n@end\n@export clay.compositor.exposure\nvarying vec2 v_Texcoord;\nuniform sampler2D texture;\nuniform float exposure : 0.0;\nvoid main()\n{\n vec4 tex = texture2D(texture, v_Texcoord);\n vec3 color = tex.rgb * pow(2.0, exposure);\n gl_FragColor = vec4(color, tex.a);\n}\n@end\n@export clay.compositor.gamma\nvarying vec2 v_Texcoord;\nuniform sampler2D texture;\nuniform float gamma : 1.0;\nvoid main()\n{\n vec4 tex = texture2D(texture, v_Texcoord);\n vec3 color = pow(tex.rgb, vec3(gamma));\n gl_FragColor = vec4(color, tex.a);\n}\n@end\n@export clay.compositor.saturation\nvarying vec2 v_Texcoord;\nuniform sampler2D texture;\nuniform float saturation : 1.0;\nconst vec3 w = vec3(0.2125, 0.7154, 0.0721);\nvoid main()\n{\n vec4 tex = texture2D(texture, v_Texcoord);\n vec3 color = tex.rgb;\n float luminance = dot(color, w);\n color = mix(vec3(luminance), color, saturation);\n gl_FragColor = vec4(color, tex.a);\n}\n@end";
var blurCode = "@export clay.compositor.kernel.gaussian_9\nfloat gaussianKernel[9];\ngaussianKernel[0] = 0.07;\ngaussianKernel[1] = 0.09;\ngaussianKernel[2] = 0.12;\ngaussianKernel[3] = 0.14;\ngaussianKernel[4] = 0.16;\ngaussianKernel[5] = 0.14;\ngaussianKernel[6] = 0.12;\ngaussianKernel[7] = 0.09;\ngaussianKernel[8] = 0.07;\n@end\n@export clay.compositor.kernel.gaussian_13\nfloat gaussianKernel[13];\ngaussianKernel[0] = 0.02;\ngaussianKernel[1] = 0.03;\ngaussianKernel[2] = 0.06;\ngaussianKernel[3] = 0.08;\ngaussianKernel[4] = 0.11;\ngaussianKernel[5] = 0.13;\ngaussianKernel[6] = 0.14;\ngaussianKernel[7] = 0.13;\ngaussianKernel[8] = 0.11;\ngaussianKernel[9] = 0.08;\ngaussianKernel[10] = 0.06;\ngaussianKernel[11] = 0.03;\ngaussianKernel[12] = 0.02;\n@end\n@export clay.compositor.gaussian_blur\n#define SHADER_NAME gaussian_blur\nuniform sampler2D texture;varying vec2 v_Texcoord;\nuniform float blurSize : 2.0;\nuniform vec2 textureSize : [512.0, 512.0];\nuniform float blurDir : 0.0;\n@import clay.util.rgbm\n@import clay.util.clamp_sample\nvoid main (void)\n{\n @import clay.compositor.kernel.gaussian_9\n vec2 off = blurSize / textureSize;\n off *= vec2(1.0 - blurDir, blurDir);\n vec4 sum = vec4(0.0);\n float weightAll = 0.0;\n for (int i = 0; i < 9; i++) {\n float w = gaussianKernel[i];\n vec4 texel = decodeHDR(clampSample(texture, v_Texcoord + float(i - 4) * off));\n sum += texel * w;\n weightAll += w;\n }\n gl_FragColor = encodeHDR(sum / max(weightAll, 0.01));\n}\n@end\n";
var lumEssl = "@export clay.compositor.hdr.log_lum\nvarying vec2 v_Texcoord;\nuniform sampler2D texture;\nconst vec3 w = vec3(0.2125, 0.7154, 0.0721);\n@import clay.util.rgbm\nvoid main()\n{\n vec4 tex = decodeHDR(texture2D(texture, v_Texcoord));\n float luminance = dot(tex.rgb, w);\n luminance = log(luminance + 0.001);\n gl_FragColor = encodeHDR(vec4(vec3(luminance), 1.0));\n}\n@end\n@export clay.compositor.hdr.lum_adaption\nvarying vec2 v_Texcoord;\nuniform sampler2D adaptedLum;\nuniform sampler2D currentLum;\nuniform float frameTime : 0.02;\n@import clay.util.rgbm\nvoid main()\n{\n float fAdaptedLum = decodeHDR(texture2D(adaptedLum, vec2(0.5, 0.5))).r;\n float fCurrentLum = exp(encodeHDR(texture2D(currentLum, vec2(0.5, 0.5))).r);\n fAdaptedLum += (fCurrentLum - fAdaptedLum) * (1.0 - pow(0.98, 30.0 * frameTime));\n gl_FragColor = encodeHDR(vec4(vec3(fAdaptedLum), 1.0));\n}\n@end\n@export clay.compositor.lum\nvarying vec2 v_Texcoord;\nuniform sampler2D texture;\nconst vec3 w = vec3(0.2125, 0.7154, 0.0721);\nvoid main()\n{\n vec4 tex = texture2D( texture, v_Texcoord );\n float luminance = dot(tex.rgb, w);\n gl_FragColor = vec4(vec3(luminance), 1.0);\n}\n@end";
var lutCode = "\n@export clay.compositor.lut\nvarying vec2 v_Texcoord;\nuniform sampler2D texture;\nuniform sampler2D lookup;\nvoid main()\n{\n vec4 tex = texture2D(texture, v_Texcoord);\n float blueColor = tex.b * 63.0;\n vec2 quad1;\n quad1.y = floor(floor(blueColor) / 8.0);\n quad1.x = floor(blueColor) - (quad1.y * 8.0);\n vec2 quad2;\n quad2.y = floor(ceil(blueColor) / 8.0);\n quad2.x = ceil(blueColor) - (quad2.y * 8.0);\n vec2 texPos1;\n texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * tex.r);\n texPos1.y = (quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * tex.g);\n vec2 texPos2;\n texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * tex.r);\n texPos2.y = (quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * tex.g);\n vec4 newColor1 = texture2D(lookup, texPos1);\n vec4 newColor2 = texture2D(lookup, texPos2);\n vec4 newColor = mix(newColor1, newColor2, fract(blueColor));\n gl_FragColor = vec4(newColor.rgb, tex.w);\n}\n@end";
var vigentteEssl = "@export clay.compositor.vignette\n#define OUTPUT_ALPHA\nvarying vec2 v_Texcoord;\nuniform sampler2D texture;\nuniform float darkness: 1;\nuniform float offset: 1;\n@import clay.util.rgbm\nvoid main()\n{\n vec4 texel = decodeHDR(texture2D(texture, v_Texcoord));\n gl_FragColor.rgb = texel.rgb;\n vec2 uv = (v_Texcoord - vec2(0.5)) * vec2(offset);\n gl_FragColor = encodeHDR(vec4(mix(texel.rgb, vec3(1.0 - darkness), dot(uv, uv)), texel.a));\n}\n@end";
var outputCode = "@export clay.compositor.output\n#define OUTPUT_ALPHA\nvarying vec2 v_Texcoord;\nuniform sampler2D texture;\n@import clay.util.rgbm\nvoid main()\n{\n vec4 tex = decodeHDR(texture2D(texture, v_Texcoord));\n gl_FragColor.rgb = tex.rgb;\n#ifdef OUTPUT_ALPHA\n gl_FragColor.a = tex.a;\n#else\n gl_FragColor.a = 1.0;\n#endif\n gl_FragColor = encodeHDR(gl_FragColor);\n#ifdef PREMULTIPLY_ALPHA\n gl_FragColor.rgb *= gl_FragColor.a;\n#endif\n}\n@end";
var brightCode = "@export clay.compositor.bright\nuniform sampler2D texture;\nuniform float threshold : 1;\nuniform float scale : 1.0;\nuniform vec2 textureSize: [512, 512];\nvarying vec2 v_Texcoord;\nconst vec3 lumWeight = vec3(0.2125, 0.7154, 0.0721);\n@import clay.util.rgbm\nvec4 median(vec4 a, vec4 b, vec4 c)\n{\n return a + b + c - min(min(a, b), c) - max(max(a, b), c);\n}\nvoid main()\n{\n vec4 texel = decodeHDR(texture2D(texture, v_Texcoord));\n#ifdef ANTI_FLICKER\n vec3 d = 1.0 / textureSize.xyx * vec3(1.0, 1.0, 0.0);\n vec4 s1 = decodeHDR(texture2D(texture, v_Texcoord - d.xz));\n vec4 s2 = decodeHDR(texture2D(texture, v_Texcoord + d.xz));\n vec4 s3 = decodeHDR(texture2D(texture, v_Texcoord - d.zy));\n vec4 s4 = decodeHDR(texture2D(texture, v_Texcoord + d.zy));\n texel = median(median(texel, s1, s2), s3, s4);\n#endif\n float lum = dot(texel.rgb , lumWeight);\n vec4 color;\n if (lum > threshold && texel.a > 0.0)\n {\n color = vec4(texel.rgb * scale, texel.a * scale);\n }\n else\n {\n color = vec4(0.0);\n }\n gl_FragColor = encodeHDR(color);\n}\n@end\n";
var downsampleCode = "@export clay.compositor.downsample\nuniform sampler2D texture;\nuniform vec2 textureSize : [512, 512];\nvarying vec2 v_Texcoord;\n@import clay.util.rgbm\nfloat brightness(vec3 c)\n{\n return max(max(c.r, c.g), c.b);\n}\n@import clay.util.clamp_sample\nvoid main()\n{\n vec4 d = vec4(-1.0, -1.0, 1.0, 1.0) / textureSize.xyxy;\n#ifdef ANTI_FLICKER\n vec3 s1 = decodeHDR(clampSample(texture, v_Texcoord + d.xy)).rgb;\n vec3 s2 = decodeHDR(clampSample(texture, v_Texcoord + d.zy)).rgb;\n vec3 s3 = decodeHDR(clampSample(texture, v_Texcoord + d.xw)).rgb;\n vec3 s4 = decodeHDR(clampSample(texture, v_Texcoord + d.zw)).rgb;\n float s1w = 1.0 / (brightness(s1) + 1.0);\n float s2w = 1.0 / (brightness(s2) + 1.0);\n float s3w = 1.0 / (brightness(s3) + 1.0);\n float s4w = 1.0 / (brightness(s4) + 1.0);\n float oneDivideSum = 1.0 / (s1w + s2w + s3w + s4w);\n vec4 color = vec4(\n (s1 * s1w + s2 * s2w + s3 * s3w + s4 * s4w) * oneDivideSum,\n 1.0\n );\n#else\n vec4 color = decodeHDR(clampSample(texture, v_Texcoord + d.xy));\n color += decodeHDR(clampSample(texture, v_Texcoord + d.zy));\n color += decodeHDR(clampSample(texture, v_Texcoord + d.xw));\n color += decodeHDR(clampSample(texture, v_Texcoord + d.zw));\n color *= 0.25;\n#endif\n gl_FragColor = encodeHDR(color);\n}\n@end";
var upsampleCode = "\n@export clay.compositor.upsample\n#define HIGH_QUALITY\nuniform sampler2D texture;\nuniform vec2 textureSize : [512, 512];\nuniform float sampleScale: 0.5;\nvarying vec2 v_Texcoord;\n@import clay.util.rgbm\n@import clay.util.clamp_sample\nvoid main()\n{\n#ifdef HIGH_QUALITY\n vec4 d = vec4(1.0, 1.0, -1.0, 0.0) / textureSize.xyxy * sampleScale;\n vec4 s;\n s = decodeHDR(clampSample(texture, v_Texcoord - d.xy));\n s += decodeHDR(clampSample(texture, v_Texcoord - d.wy)) * 2.0;\n s += decodeHDR(clampSample(texture, v_Texcoord - d.zy));\n s += decodeHDR(clampSample(texture, v_Texcoord + d.zw)) * 2.0;\n s += decodeHDR(clampSample(texture, v_Texcoord )) * 4.0;\n s += decodeHDR(clampSample(texture, v_Texcoord + d.xw)) * 2.0;\n s += decodeHDR(clampSample(texture, v_Texcoord + d.zy));\n s += decodeHDR(clampSample(texture, v_Texcoord + d.wy)) * 2.0;\n s += decodeHDR(clampSample(texture, v_Texcoord + d.xy));\n gl_FragColor = encodeHDR(s / 16.0);\n#else\n vec4 d = vec4(-1.0, -1.0, +1.0, +1.0) / textureSize.xyxy;\n vec4 s;\n s = decodeHDR(clampSample(texture, v_Texcoord + d.xy));\n s += decodeHDR(clampSample(texture, v_Texcoord + d.zy));\n s += decodeHDR(clampSample(texture, v_Texcoord + d.xw));\n s += decodeHDR(clampSample(texture, v_Texcoord + d.zw));\n gl_FragColor = encodeHDR(s / 4.0);\n#endif\n}\n@end";
var hdrCode = "@export clay.compositor.hdr.composite\n#define TONEMAPPING\nuniform sampler2D texture;\n#ifdef BLOOM_ENABLED\nuniform sampler2D bloom;\n#endif\n#ifdef LENSFLARE_ENABLED\nuniform sampler2D lensflare;\nuniform sampler2D lensdirt;\n#endif\n#ifdef LUM_ENABLED\nuniform sampler2D lum;\n#endif\n#ifdef LUT_ENABLED\nuniform sampler2D lut;\n#endif\n#ifdef COLOR_CORRECTION\nuniform float brightness : 0.0;\nuniform float contrast : 1.0;\nuniform float saturation : 1.0;\n#endif\n#ifdef VIGNETTE\nuniform float vignetteDarkness: 1.0;\nuniform float vignetteOffset: 1.0;\n#endif\nuniform float exposure : 1.0;\nuniform float bloomIntensity : 0.25;\nuniform float lensflareIntensity : 1;\nvarying vec2 v_Texcoord;\n@import clay.util.srgb\nvec3 ACESToneMapping(vec3 color)\n{\n const float A = 2.51;\n const float B = 0.03;\n const float C = 2.43;\n const float D = 0.59;\n const float E = 0.14;\n return (color * (A * color + B)) / (color * (C * color + D) + E);\n}\nfloat eyeAdaption(float fLum)\n{\n return mix(0.2, fLum, 0.5);\n}\n#ifdef LUT_ENABLED\nvec3 lutTransform(vec3 color) {\n float blueColor = color.b * 63.0;\n vec2 quad1;\n quad1.y = floor(floor(blueColor) / 8.0);\n quad1.x = floor(blueColor) - (quad1.y * 8.0);\n vec2 quad2;\n quad2.y = floor(ceil(blueColor) / 8.0);\n quad2.x = ceil(blueColor) - (quad2.y * 8.0);\n vec2 texPos1;\n texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * color.r);\n texPos1.y = (quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * color.g);\n vec2 texPos2;\n texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * color.r);\n texPos2.y = (quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * color.g);\n vec4 newColor1 = texture2D(lut, texPos1);\n vec4 newColor2 = texture2D(lut, texPos2);\n vec4 newColor = mix(newColor1, newColor2, fract(blueColor));\n return newColor.rgb;\n}\n#endif\n@import clay.util.rgbm\nvoid main()\n{\n vec4 texel = vec4(0.0);\n vec4 originalTexel = vec4(0.0);\n#ifdef TEXTURE_ENABLED\n texel = decodeHDR(texture2D(texture, v_Texcoord));\n originalTexel = texel;\n#endif\n#ifdef BLOOM_ENABLED\n vec4 bloomTexel = decodeHDR(texture2D(bloom, v_Texcoord));\n texel.rgb += bloomTexel.rgb * bloomIntensity;\n texel.a += bloomTexel.a * bloomIntensity;\n#endif\n#ifdef LENSFLARE_ENABLED\n texel += decodeHDR(texture2D(lensflare, v_Texcoord)) * texture2D(lensdirt, v_Texcoord) * lensflareIntensity;\n#endif\n texel.a = min(texel.a, 1.0);\n#ifdef LUM_ENABLED\n float fLum = texture2D(lum, vec2(0.5, 0.5)).r;\n float adaptedLumDest = 3.0 / (max(0.1, 1.0 + 10.0*eyeAdaption(fLum)));\n float exposureBias = adaptedLumDest * exposure;\n#else\n float exposureBias = exposure;\n#endif\n#ifdef TONEMAPPING\n texel.rgb *= exposureBias;\n texel.rgb = ACESToneMapping(texel.rgb);\n#endif\n texel = linearTosRGB(texel);\n#ifdef LUT_ENABLED\n texel.rgb = lutTransform(clamp(texel.rgb,vec3(0.0),vec3(1.0)));\n#endif\n#ifdef COLOR_CORRECTION\n texel.rgb = clamp(texel.rgb + vec3(brightness), 0.0, 1.0);\n texel.rgb = clamp((texel.rgb - vec3(0.5))*contrast+vec3(0.5), 0.0, 1.0);\n float lum = dot(texel.rgb, vec3(0.2125, 0.7154, 0.0721));\n texel.rgb = mix(vec3(lum), texel.rgb, saturation);\n#endif\n#ifdef VIGNETTE\n vec2 uv = (v_Texcoord - vec2(0.5)) * vec2(vignetteOffset);\n texel.rgb = mix(texel.rgb, vec3(1.0 - vignetteDarkness), dot(uv, uv));\n#endif\n gl_FragColor = encodeHDR(texel);\n#ifdef DEBUG\n #if DEBUG == 1\n gl_FragColor = encodeHDR(decodeHDR(texture2D(texture, v_Texcoord)));\n #elif DEBUG == 2\n gl_FragColor = encodeHDR(decodeHDR(texture2D(bloom, v_Texcoord)) * bloomIntensity);\n #elif DEBUG == 3\n gl_FragColor = encodeHDR(decodeHDR(texture2D(lensflare, v_Texcoord) * lensflareIntensity));\n #endif\n#endif\n if (originalTexel.a <= 0.01 && gl_FragColor.a > 1e-5) {\n gl_FragColor.a = dot(gl_FragColor.rgb, vec3(0.2125, 0.7154, 0.0721));\n }\n#ifdef PREMULTIPLY_ALPHA\n gl_FragColor.rgb *= gl_FragColor.a;\n#endif\n}\n@end";
var lensflareEssl = "@export clay.compositor.lensflare\n#define SAMPLE_NUMBER 8\nuniform sampler2D texture;\nuniform sampler2D lenscolor;\nuniform vec2 textureSize : [512, 512];\nuniform float dispersal : 0.3;\nuniform float haloWidth : 0.4;\nuniform float distortion : 1.0;\nvarying vec2 v_Texcoord;\n@import clay.util.rgbm\nvec4 textureDistorted(\n in vec2 texcoord,\n in vec2 direction,\n in vec3 distortion\n) {\n return vec4(\n decodeHDR(texture2D(texture, texcoord + direction * distortion.r)).r,\n decodeHDR(texture2D(texture, texcoord + direction * distortion.g)).g,\n decodeHDR(texture2D(texture, texcoord + direction * distortion.b)).b,\n 1.0\n );\n}\nvoid main()\n{\n vec2 texcoord = -v_Texcoord + vec2(1.0); vec2 textureOffset = 1.0 / textureSize;\n vec2 ghostVec = (vec2(0.5) - texcoord) * dispersal;\n vec2 haloVec = normalize(ghostVec) * haloWidth;\n vec3 distortion = vec3(-textureOffset.x * distortion, 0.0, textureOffset.x * distortion);\n vec4 result = vec4(0.0);\n for (int i = 0; i < SAMPLE_NUMBER; i++)\n {\n vec2 offset = fract(texcoord + ghostVec * float(i));\n float weight = length(vec2(0.5) - offset) / length(vec2(0.5));\n weight = pow(1.0 - weight, 10.0);\n result += textureDistorted(offset, normalize(ghostVec), distortion) * weight;\n }\n result *= texture2D(lenscolor, vec2(length(vec2(0.5) - texcoord)) / length(vec2(0.5)));\n float weight = length(vec2(0.5) - fract(texcoord + haloVec)) / length(vec2(0.5));\n weight = pow(1.0 - weight, 10.0);\n vec2 offset = fract(texcoord + haloVec);\n result += textureDistorted(offset, normalize(ghostVec), distortion) * weight;\n gl_FragColor = result;\n}\n@end";
var blendCode = "@export clay.compositor.blend\n#define SHADER_NAME blend\n#ifdef TEXTURE1_ENABLED\nuniform sampler2D texture1;\nuniform float weight1 : 1.0;\n#endif\n#ifdef TEXTURE2_ENABLED\nuniform sampler2D texture2;\nuniform float weight2 : 1.0;\n#endif\n#ifdef TEXTURE3_ENABLED\nuniform sampler2D texture3;\nuniform float weight3 : 1.0;\n#endif\n#ifdef TEXTURE4_ENABLED\nuniform sampler2D texture4;\nuniform float weight4 : 1.0;\n#endif\n#ifdef TEXTURE5_ENABLED\nuniform sampler2D texture5;\nuniform float weight5 : 1.0;\n#endif\n#ifdef TEXTURE6_ENABLED\nuniform sampler2D texture6;\nuniform float weight6 : 1.0;\n#endif\nvarying vec2 v_Texcoord;\n@import clay.util.rgbm\nvoid main()\n{\n vec4 tex = vec4(0.0);\n#ifdef TEXTURE1_ENABLED\n tex += decodeHDR(texture2D(texture1, v_Texcoord)) * weight1;\n#endif\n#ifdef TEXTURE2_ENABLED\n tex += decodeHDR(texture2D(texture2, v_Texcoord)) * weight2;\n#endif\n#ifdef TEXTURE3_ENABLED\n tex += decodeHDR(texture2D(texture3, v_Texcoord)) * weight3;\n#endif\n#ifdef TEXTURE4_ENABLED\n tex += decodeHDR(texture2D(texture4, v_Texcoord)) * weight4;\n#endif\n#ifdef TEXTURE5_ENABLED\n tex += decodeHDR(texture2D(texture5, v_Texcoord)) * weight5;\n#endif\n#ifdef TEXTURE6_ENABLED\n tex += decodeHDR(texture2D(texture6, v_Texcoord)) * weight6;\n#endif\n gl_FragColor = encodeHDR(tex);\n}\n@end";
var fxaaCode = "@export clay.compositor.fxaa\nuniform sampler2D texture;\nuniform vec4 viewport : VIEWPORT;\nvarying vec2 v_Texcoord;\n#define FXAA_REDUCE_MIN (1.0/128.0)\n#define FXAA_REDUCE_MUL (1.0/8.0)\n#define FXAA_SPAN_MAX 8.0\n@import clay.util.rgbm\nvoid main()\n{\n vec2 resolution = 1.0 / viewport.zw;\n vec3 rgbNW = decodeHDR( texture2D( texture, ( gl_FragCoord.xy + vec2( -1.0, -1.0 ) ) * resolution ) ).xyz;\n vec3 rgbNE = decodeHDR( texture2D( texture, ( gl_FragCoord.xy + vec2( 1.0, -1.0 ) ) * resolution ) ).xyz;\n vec3 rgbSW = decodeHDR( texture2D( texture, ( gl_FragCoord.xy + vec2( -1.0, 1.0 ) ) * resolution ) ).xyz;\n vec3 rgbSE = decodeHDR( texture2D( texture, ( gl_FragCoord.xy + vec2( 1.0, 1.0 ) ) * resolution ) ).xyz;\n vec4 rgbaM = decodeHDR( texture2D( texture, gl_FragCoord.xy * resolution ) );\n vec3 rgbM = rgbaM.xyz;\n float opacity = rgbaM.w;\n vec3 luma = vec3( 0.299, 0.587, 0.114 );\n float lumaNW = dot( rgbNW, luma );\n float lumaNE = dot( rgbNE, luma );\n float lumaSW = dot( rgbSW, luma );\n float lumaSE = dot( rgbSE, luma );\n float lumaM = dot( rgbM, luma );\n float lumaMin = min( lumaM, min( min( lumaNW, lumaNE ), min( lumaSW, lumaSE ) ) );\n float lumaMax = max( lumaM, max( max( lumaNW, lumaNE) , max( lumaSW, lumaSE ) ) );\n vec2 dir;\n dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n dir.y = ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n float dirReduce = max( ( lumaNW + lumaNE + lumaSW + lumaSE ) * ( 0.25 * FXAA_REDUCE_MUL ), FXAA_REDUCE_MIN );\n float rcpDirMin = 1.0 / ( min( abs( dir.x ), abs( dir.y ) ) + dirReduce );\n dir = min( vec2( FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n max( vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n dir * rcpDirMin)) * resolution;\n vec3 rgbA = decodeHDR( texture2D( texture, gl_FragCoord.xy * resolution + dir * ( 1.0 / 3.0 - 0.5 ) ) ).xyz;\n rgbA += decodeHDR( texture2D( texture, gl_FragCoord.xy * resolution + dir * ( 2.0 / 3.0 - 0.5 ) ) ).xyz;\n rgbA *= 0.5;\n vec3 rgbB = decodeHDR( texture2D( texture, gl_FragCoord.xy * resolution + dir * -0.5 ) ).xyz;\n rgbB += decodeHDR( texture2D( texture, gl_FragCoord.xy * resolution + dir * 0.5 ) ).xyz;\n rgbB *= 0.25;\n rgbB += rgbA * 0.5;\n float lumaB = dot( rgbB, luma );\n if ( ( lumaB < lumaMin ) || ( lumaB > lumaMax ) )\n {\n gl_FragColor = vec4( rgbA, opacity );\n }\n else {\n gl_FragColor = vec4( rgbB, opacity );\n }\n}\n@end";
function register(Shader2) {
  Shader2["import"](coloradjustEssl);
  Shader2["import"](blurCode);
  Shader2["import"](lumEssl);
  Shader2["import"](lutCode);
  Shader2["import"](vigentteEssl);
  Shader2["import"](outputCode);
  Shader2["import"](brightCode);
  Shader2["import"](downsampleCode);
  Shader2["import"](upsampleCode);
  Shader2["import"](hdrCode);
  Shader2["import"](lensflareEssl);
  Shader2["import"](blendCode);
  Shader2["import"](fxaaCode);
}
register(Shader);
var shaderSourceReg = /^#source\((.*?)\)/;
function createCompositor(json, opts) {
  var compositor = new Compositor$1();
  opts = opts || {};
  var lib = {
    textures: {},
    parameters: {}
  };
  var afterLoad = function(shaderLib, textureLib) {
    for (var i = 0; i < json.nodes.length; i++) {
      var nodeInfo = json.nodes[i];
      var node = createNode(nodeInfo, lib, opts);
      if (node) {
        compositor.addNode(node);
      }
    }
  };
  for (var name in json.parameters) {
    var paramInfo = json.parameters[name];
    lib.parameters[name] = convertParameter(paramInfo);
  }
  loadTextures(json, lib, opts, function(textureLib) {
    lib.textures = textureLib;
    afterLoad();
  });
  return compositor;
}
function createNode(nodeInfo, lib, opts) {
  var type = nodeInfo.type || "filter";
  var shaderSource;
  var inputs;
  var outputs;
  if (type === "filter") {
    var shaderExp = nodeInfo.shader.trim();
    var res = shaderSourceReg.exec(shaderExp);
    if (res) {
      shaderSource = Shader.source(res[1].trim());
    } else if (shaderExp.charAt(0) === "#") {
      shaderSource = lib.shaders[shaderExp.substr(1)];
    }
    if (!shaderSource) {
      shaderSource = shaderExp;
    }
    if (!shaderSource) {
      return;
    }
  }
  if (nodeInfo.inputs) {
    inputs = {};
    for (var name in nodeInfo.inputs) {
      if (typeof nodeInfo.inputs[name] === "string") {
        inputs[name] = nodeInfo.inputs[name];
      } else {
        inputs[name] = {
          node: nodeInfo.inputs[name].node,
          pin: nodeInfo.inputs[name].pin
        };
      }
    }
  }
  if (nodeInfo.outputs) {
    outputs = {};
    for (var name in nodeInfo.outputs) {
      var outputInfo = nodeInfo.outputs[name];
      outputs[name] = {};
      if (outputInfo.attachment != null) {
        outputs[name].attachment = outputInfo.attachment;
      }
      if (outputInfo.keepLastFrame != null) {
        outputs[name].keepLastFrame = outputInfo.keepLastFrame;
      }
      if (outputInfo.outputLastFrame != null) {
        outputs[name].outputLastFrame = outputInfo.outputLastFrame;
      }
      if (outputInfo.parameters) {
        outputs[name].parameters = convertParameter(outputInfo.parameters);
      }
    }
  }
  var node;
  if (type === "scene") {
    node = new CompoSceneNode({
      name: nodeInfo.name,
      scene: opts.scene,
      camera: opts.camera,
      outputs
    });
  } else if (type === "texture") {
    node = new CompoTextureNode({
      name: nodeInfo.name,
      outputs
    });
  } else {
    node = new CompoFilterNode({
      name: nodeInfo.name,
      shader: shaderSource,
      inputs,
      outputs
    });
  }
  if (node) {
    if (nodeInfo.parameters) {
      for (var name in nodeInfo.parameters) {
        var val = nodeInfo.parameters[name];
        if (typeof val === "string") {
          val = val.trim();
          if (val.charAt(0) === "#") {
            val = lib.textures[val.substr(1)];
          } else {
            node.on("beforerender", createSizeSetHandler(name, tryConvertExpr(val)));
          }
        } else if (typeof val === "function") {
          node.on("beforerender", val);
        }
        node.setParameter(name, val);
      }
    }
    if (nodeInfo.defines && node.pass) {
      for (var name in nodeInfo.defines) {
        var val = nodeInfo.defines[name];
        node.pass.material.define("fragment", name, val);
      }
    }
  }
  return node;
}
function defaultWidthFunc(width, height) {
  return width;
}
function defaultHeightFunc(width, height) {
  return height;
}
function convertParameter(paramInfo) {
  var param = {};
  if (!paramInfo) {
    return param;
  }
  ["type", "minFilter", "magFilter", "wrapS", "wrapT", "flipY", "useMipmap"].forEach(function(name) {
    var val = paramInfo[name];
    if (val != null) {
      if (typeof val === "string") {
        val = Texture$1[val];
      }
      param[name] = val;
    }
  });
  var sizeScale = paramInfo.scale || 1;
  ["width", "height"].forEach(function(name) {
    if (paramInfo[name] != null) {
      var val = paramInfo[name];
      if (typeof val === "string") {
        val = val.trim();
        param[name] = createSizeParser(name, tryConvertExpr(val), sizeScale);
      } else {
        param[name] = val;
      }
    }
  });
  if (!param.width) {
    param.width = defaultWidthFunc;
  }
  if (!param.height) {
    param.height = defaultHeightFunc;
  }
  if (paramInfo.useMipmap != null) {
    param.useMipmap = paramInfo.useMipmap;
  }
  return param;
}
function loadTextures(json, lib, opts, callback) {
  if (!json.textures) {
    callback({});
    return;
  }
  var textures = {};
  var loading = 0;
  var cbd = false;
  var textureRootPath = opts.textureRootPath;
  util$1.each(json.textures, function(textureInfo, name) {
    var texture;
    var path = textureInfo.path;
    var parameters = convertParameter(textureInfo.parameters);
    if (Array.isArray(path) && path.length === 6) {
      if (textureRootPath) {
        path = path.map(function(item) {
          return util$1.relative2absolute(item, textureRootPath);
        });
      }
      texture = new TextureCube$1(parameters);
    } else if (typeof path === "string") {
      if (textureRootPath) {
        path = util$1.relative2absolute(path, textureRootPath);
      }
      texture = new Texture2D$1(parameters);
    } else {
      return;
    }
    texture.load(path);
    loading++;
    texture.once("success", function() {
      textures[name] = texture;
      loading--;
      if (loading === 0) {
        callback(textures);
        cbd = true;
      }
    });
  });
  if (loading === 0 && !cbd) {
    callback(textures);
  }
}
function createSizeSetHandler(name, exprFunc) {
  return function(renderer) {
    var dpr = renderer.getDevicePixelRatio();
    var width = renderer.getWidth();
    var height = renderer.getHeight();
    var result = exprFunc(width, height, dpr);
    this.setParameter(name, result);
  };
}
function createSizeParser(name, exprFunc, scale2) {
  scale2 = scale2 || 1;
  return function(renderer) {
    var dpr = renderer.getDevicePixelRatio();
    var width = renderer.getWidth() * scale2;
    var height = renderer.getHeight() * scale2;
    return exprFunc(width, height, dpr);
  };
}
function tryConvertExpr(string) {
  var exprRes = /^expr\((.*)\)$/.exec(string);
  if (exprRes) {
    try {
      var func = new Function("width", "height", "dpr", "return " + exprRes[1]);
      func(1, 1);
      return func;
    } catch (e2) {
      throw new Error("Invalid expression.");
    }
  }
}
function halton(index, base) {
  var result = 0;
  var f = 1 / base;
  var i = index;
  while (i > 0) {
    result = result + f * (i % base);
    i = Math.floor(i / base);
    f = f / base;
  }
  return result;
}
var SSAOGLSL = "@export ecgl.ssao.estimate\n\nuniform sampler2D depthTex;\n\nuniform sampler2D normalTex;\n\nuniform sampler2D noiseTex;\n\nuniform vec2 depthTexSize;\n\nuniform vec2 noiseTexSize;\n\nuniform mat4 projection;\n\nuniform mat4 projectionInv;\n\nuniform mat4 viewInverseTranspose;\n\nuniform vec3 kernel[KERNEL_SIZE];\n\nuniform float radius : 1;\n\nuniform float power : 1;\n\nuniform float bias: 1e-2;\n\nuniform float intensity: 1.0;\n\nvarying vec2 v_Texcoord;\n\nfloat ssaoEstimator(in vec3 originPos, in mat3 kernelBasis) {\n float occlusion = 0.0;\n\n for (int i = 0; i < KERNEL_SIZE; i++) {\n vec3 samplePos = kernel[i];\n#ifdef NORMALTEX_ENABLED\n samplePos = kernelBasis * samplePos;\n#endif\n samplePos = samplePos * radius + originPos;\n\n vec4 texCoord = projection * vec4(samplePos, 1.0);\n texCoord.xy /= texCoord.w;\n\n vec4 depthTexel = texture2D(depthTex, texCoord.xy * 0.5 + 0.5);\n\n float sampleDepth = depthTexel.r * 2.0 - 1.0;\n if (projection[3][3] == 0.0) {\n sampleDepth = projection[3][2] / (sampleDepth * projection[2][3] - projection[2][2]);\n }\n else {\n sampleDepth = (sampleDepth - projection[3][2]) / projection[2][2];\n }\n \n float rangeCheck = smoothstep(0.0, 1.0, radius / abs(originPos.z - sampleDepth));\n occlusion += rangeCheck * step(samplePos.z, sampleDepth - bias);\n }\n#ifdef NORMALTEX_ENABLED\n occlusion = 1.0 - occlusion / float(KERNEL_SIZE);\n#else\n occlusion = 1.0 - clamp((occlusion / float(KERNEL_SIZE) - 0.6) * 2.5, 0.0, 1.0);\n#endif\n return pow(occlusion, power);\n}\n\nvoid main()\n{\n\n vec4 depthTexel = texture2D(depthTex, v_Texcoord);\n\n#ifdef NORMALTEX_ENABLED\n vec4 tex = texture2D(normalTex, v_Texcoord);\n if (dot(tex.rgb, tex.rgb) == 0.0) {\n gl_FragColor = vec4(1.0);\n return;\n }\n vec3 N = tex.rgb * 2.0 - 1.0;\n N = (viewInverseTranspose * vec4(N, 0.0)).xyz;\n\n vec2 noiseTexCoord = depthTexSize / vec2(noiseTexSize) * v_Texcoord;\n vec3 rvec = texture2D(noiseTex, noiseTexCoord).rgb * 2.0 - 1.0;\n vec3 T = normalize(rvec - N * dot(rvec, N));\n vec3 BT = normalize(cross(N, T));\n mat3 kernelBasis = mat3(T, BT, N);\n#else\n if (depthTexel.r > 0.99999) {\n gl_FragColor = vec4(1.0);\n return;\n }\n mat3 kernelBasis;\n#endif\n\n float z = depthTexel.r * 2.0 - 1.0;\n\n vec4 projectedPos = vec4(v_Texcoord * 2.0 - 1.0, z, 1.0);\n vec4 p4 = projectionInv * projectedPos;\n\n vec3 position = p4.xyz / p4.w;\n\n float ao = ssaoEstimator(position, kernelBasis);\n ao = clamp(1.0 - (1.0 - ao) * intensity, 0.0, 1.0);\n gl_FragColor = vec4(vec3(ao), 1.0);\n}\n\n@end\n\n\n@export ecgl.ssao.blur\n#define SHADER_NAME SSAO_BLUR\n\nuniform sampler2D ssaoTexture;\n\n#ifdef NORMALTEX_ENABLED\nuniform sampler2D normalTex;\n#endif\n\nvarying vec2 v_Texcoord;\n\nuniform vec2 textureSize;\nuniform float blurSize : 1.0;\n\nuniform int direction: 0.0;\n\n#ifdef DEPTHTEX_ENABLED\nuniform sampler2D depthTex;\nuniform mat4 projection;\nuniform float depthRange : 0.5;\n\nfloat getLinearDepth(vec2 coord)\n{\n float depth = texture2D(depthTex, coord).r * 2.0 - 1.0;\n return projection[3][2] / (depth * projection[2][3] - projection[2][2]);\n}\n#endif\n\nvoid main()\n{\n float kernel[5];\n kernel[0] = 0.122581;\n kernel[1] = 0.233062;\n kernel[2] = 0.288713;\n kernel[3] = 0.233062;\n kernel[4] = 0.122581;\n\n vec2 off = vec2(0.0);\n if (direction == 0) {\n off[0] = blurSize / textureSize.x;\n }\n else {\n off[1] = blurSize / textureSize.y;\n }\n\n vec2 coord = v_Texcoord;\n\n float sum = 0.0;\n float weightAll = 0.0;\n\n#ifdef NORMALTEX_ENABLED\n vec3 centerNormal = texture2D(normalTex, v_Texcoord).rgb * 2.0 - 1.0;\n#endif\n#if defined(DEPTHTEX_ENABLED)\n float centerDepth = getLinearDepth(v_Texcoord);\n#endif\n\n for (int i = 0; i < 5; i++) {\n vec2 coord = clamp(v_Texcoord + vec2(float(i) - 2.0) * off, vec2(0.0), vec2(1.0));\n\n float w = kernel[i];\n#ifdef NORMALTEX_ENABLED\n vec3 normal = texture2D(normalTex, coord).rgb * 2.0 - 1.0;\n w *= clamp(dot(normal, centerNormal), 0.0, 1.0);\n#endif\n#ifdef DEPTHTEX_ENABLED\n float d = getLinearDepth(coord);\n w *= (1.0 - smoothstep(abs(centerDepth - d) / depthRange, 0.0, 1.0));\n#endif\n\n weightAll += w;\n sum += texture2D(ssaoTexture, coord).r * w;\n }\n\n gl_FragColor = vec4(vec3(sum / weightAll), 1.0);\n}\n\n@end\n";
Shader.import(SSAOGLSL);
function generateNoiseData(size) {
  var data = new Uint8Array(size * size * 4);
  var n = 0;
  var v3 = new Vector3$1();
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      v3.set(Math.random() * 2 - 1, Math.random() * 2 - 1, 0).normalize();
      data[n++] = (v3.x * 0.5 + 0.5) * 255;
      data[n++] = (v3.y * 0.5 + 0.5) * 255;
      data[n++] = 0;
      data[n++] = 255;
    }
  }
  return data;
}
function generateNoiseTexture(size) {
  return new Texture2D$1({
    pixels: generateNoiseData(size),
    wrapS: Texture$1.REPEAT,
    wrapT: Texture$1.REPEAT,
    width: size,
    height: size
  });
}
function generateKernel(size, offset, hemisphere) {
  var kernel = new Float32Array(size * 3);
  offset = offset || 0;
  for (var i = 0; i < size; i++) {
    var phi = halton(i + offset, 2) * (hemisphere ? 1 : 2) * Math.PI;
    var theta = halton(i + offset, 3) * Math.PI;
    var r = Math.random();
    var x = Math.cos(phi) * Math.sin(theta) * r;
    var y = Math.cos(theta) * r;
    var z = Math.sin(phi) * Math.sin(theta) * r;
    kernel[i * 3] = x;
    kernel[i * 3 + 1] = y;
    kernel[i * 3 + 2] = z;
  }
  return kernel;
}
function SSAOPass(opt) {
  opt = opt || {};
  this._ssaoPass = new Pass$1({
    fragment: Shader.source("ecgl.ssao.estimate")
  });
  this._blurPass = new Pass$1({
    fragment: Shader.source("ecgl.ssao.blur")
  });
  this._framebuffer = new FrameBuffer$1({
    depthBuffer: false
  });
  this._ssaoTexture = new Texture2D$1();
  this._blurTexture = new Texture2D$1();
  this._blurTexture2 = new Texture2D$1();
  this._depthTex = opt.depthTexture;
  this._normalTex = opt.normalTexture;
  this.setNoiseSize(4);
  this.setKernelSize(opt.kernelSize || 12);
  if (opt.radius != null) {
    this.setParameter("radius", opt.radius);
  }
  if (opt.power != null) {
    this.setParameter("power", opt.power);
  }
  if (!this._normalTex) {
    this._ssaoPass.material.disableTexture("normalTex");
    this._blurPass.material.disableTexture("normalTex");
  }
  if (!this._depthTex) {
    this._blurPass.material.disableTexture("depthTex");
  }
  this._blurPass.material.setUniform("normalTex", this._normalTex);
  this._blurPass.material.setUniform("depthTex", this._depthTex);
}
SSAOPass.prototype.setDepthTexture = function(depthTex) {
  this._depthTex = depthTex;
};
SSAOPass.prototype.setNormalTexture = function(normalTex) {
  this._normalTex = normalTex;
  this._ssaoPass.material[normalTex ? "enableTexture" : "disableTexture"]("normalTex");
  this.setKernelSize(this._kernelSize);
};
SSAOPass.prototype.update = function(renderer, camera2, frame) {
  var width = renderer.getWidth();
  var height = renderer.getHeight();
  var ssaoPass = this._ssaoPass;
  var blurPass = this._blurPass;
  ssaoPass.setUniform("kernel", this._kernels[frame % this._kernels.length]);
  ssaoPass.setUniform("depthTex", this._depthTex);
  if (this._normalTex != null) {
    ssaoPass.setUniform("normalTex", this._normalTex);
  }
  ssaoPass.setUniform("depthTexSize", [this._depthTex.width, this._depthTex.height]);
  var viewInverseTranspose = new Matrix4$1();
  Matrix4$1.transpose(viewInverseTranspose, camera2.worldTransform);
  ssaoPass.setUniform("projection", camera2.projectionMatrix.array);
  ssaoPass.setUniform("projectionInv", camera2.invProjectionMatrix.array);
  ssaoPass.setUniform("viewInverseTranspose", viewInverseTranspose.array);
  var ssaoTexture = this._ssaoTexture;
  var blurTexture = this._blurTexture;
  var blurTexture2 = this._blurTexture2;
  ssaoTexture.width = width / 2;
  ssaoTexture.height = height / 2;
  blurTexture.width = width;
  blurTexture.height = height;
  blurTexture2.width = width;
  blurTexture2.height = height;
  this._framebuffer.attach(ssaoTexture);
  this._framebuffer.bind(renderer);
  renderer.gl.clearColor(1, 1, 1, 1);
  renderer.gl.clear(renderer.gl.COLOR_BUFFER_BIT);
  ssaoPass.render(renderer);
  blurPass.setUniform("textureSize", [width / 2, height / 2]);
  blurPass.setUniform("projection", camera2.projectionMatrix.array);
  this._framebuffer.attach(blurTexture);
  blurPass.setUniform("direction", 0);
  blurPass.setUniform("ssaoTexture", ssaoTexture);
  blurPass.render(renderer);
  this._framebuffer.attach(blurTexture2);
  blurPass.setUniform("textureSize", [width, height]);
  blurPass.setUniform("direction", 1);
  blurPass.setUniform("ssaoTexture", blurTexture);
  blurPass.render(renderer);
  this._framebuffer.unbind(renderer);
  var clearColor = renderer.clearColor;
  renderer.gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
};
SSAOPass.prototype.getTargetTexture = function() {
  return this._blurTexture2;
};
SSAOPass.prototype.setParameter = function(name, val) {
  if (name === "noiseTexSize") {
    this.setNoiseSize(val);
  } else if (name === "kernelSize") {
    this.setKernelSize(val);
  } else if (name === "intensity") {
    this._ssaoPass.material.set("intensity", val);
  } else {
    this._ssaoPass.setUniform(name, val);
  }
};
SSAOPass.prototype.setKernelSize = function(size) {
  this._kernelSize = size;
  this._ssaoPass.material.define("fragment", "KERNEL_SIZE", size);
  this._kernels = this._kernels || [];
  for (var i = 0; i < 30; i++) {
    this._kernels[i] = generateKernel(size, i * size, !!this._normalTex);
  }
};
SSAOPass.prototype.setNoiseSize = function(size) {
  var texture = this._ssaoPass.getUniform("noiseTex");
  if (!texture) {
    texture = generateNoiseTexture(size);
    this._ssaoPass.setUniform("noiseTex", generateNoiseTexture(size));
  } else {
    texture.data = generateNoiseData(size);
    texture.width = texture.height = size;
    texture.dirty();
  }
  this._ssaoPass.setUniform("noiseTexSize", [size, size]);
};
SSAOPass.prototype.dispose = function(renderer) {
  this._blurTexture.dispose(renderer);
  this._ssaoTexture.dispose(renderer);
  this._blurTexture2.dispose(renderer);
};
var SSRGLSLCode = "@export ecgl.ssr.main\n\n#define SHADER_NAME SSR\n#define MAX_ITERATION 20;\n#define SAMPLE_PER_FRAME 5;\n#define TOTAL_SAMPLES 128;\n\nuniform sampler2D sourceTexture;\nuniform sampler2D gBufferTexture1;\nuniform sampler2D gBufferTexture2;\nuniform sampler2D gBufferTexture3;\nuniform samplerCube specularCubemap;\nuniform float specularIntensity: 1;\n\nuniform mat4 projection;\nuniform mat4 projectionInv;\nuniform mat4 toViewSpace;\nuniform mat4 toWorldSpace;\n\nuniform float maxRayDistance: 200;\n\nuniform float pixelStride: 16;\nuniform float pixelStrideZCutoff: 50; \nuniform float screenEdgeFadeStart: 0.9; \nuniform float eyeFadeStart : 0.2; uniform float eyeFadeEnd: 0.8; \nuniform float minGlossiness: 0.2; uniform float zThicknessThreshold: 1;\n\nuniform float nearZ;\nuniform vec2 viewportSize : VIEWPORT_SIZE;\n\nuniform float jitterOffset: 0;\n\nvarying vec2 v_Texcoord;\n\n#ifdef DEPTH_DECODE\n@import clay.util.decode_float\n#endif\n\n#ifdef PHYSICALLY_CORRECT\nuniform sampler2D normalDistribution;\nuniform float sampleOffset: 0;\nuniform vec2 normalDistributionSize;\n\nvec3 transformNormal(vec3 H, vec3 N) {\n vec3 upVector = N.y > 0.999 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);\n vec3 tangentX = normalize(cross(N, upVector));\n vec3 tangentZ = cross(N, tangentX);\n return normalize(tangentX * H.x + N * H.y + tangentZ * H.z);\n}\nvec3 importanceSampleNormalGGX(float i, float roughness, vec3 N) {\n float p = fract((i + sampleOffset) / float(TOTAL_SAMPLES));\n vec3 H = texture2D(normalDistribution,vec2(roughness, p)).rgb;\n return transformNormal(H, N);\n}\nfloat G_Smith(float g, float ndv, float ndl) {\n float roughness = 1.0 - g;\n float k = roughness * roughness / 2.0;\n float G1V = ndv / (ndv * (1.0 - k) + k);\n float G1L = ndl / (ndl * (1.0 - k) + k);\n return G1L * G1V;\n}\nvec3 F_Schlick(float ndv, vec3 spec) {\n return spec + (1.0 - spec) * pow(1.0 - ndv, 5.0);\n}\n#endif\n\nfloat fetchDepth(sampler2D depthTexture, vec2 uv)\n{\n vec4 depthTexel = texture2D(depthTexture, uv);\n return depthTexel.r * 2.0 - 1.0;\n}\n\nfloat linearDepth(float depth)\n{\n if (projection[3][3] == 0.0) {\n return projection[3][2] / (depth * projection[2][3] - projection[2][2]);\n }\n else {\n return (depth - projection[3][2]) / projection[2][2];\n }\n}\n\nbool rayIntersectDepth(float rayZNear, float rayZFar, vec2 hitPixel)\n{\n if (rayZFar > rayZNear)\n {\n float t = rayZFar; rayZFar = rayZNear; rayZNear = t;\n }\n float cameraZ = linearDepth(fetchDepth(gBufferTexture2, hitPixel));\n return rayZFar <= cameraZ && rayZNear >= cameraZ - zThicknessThreshold;\n}\n\n\nbool traceScreenSpaceRay(\n vec3 rayOrigin, vec3 rayDir, float jitter,\n out vec2 hitPixel, out vec3 hitPoint, out float iterationCount\n)\n{\n float rayLength = ((rayOrigin.z + rayDir.z * maxRayDistance) > -nearZ)\n ? (-nearZ - rayOrigin.z) / rayDir.z : maxRayDistance;\n\n vec3 rayEnd = rayOrigin + rayDir * rayLength;\n\n vec4 H0 = projection * vec4(rayOrigin, 1.0);\n vec4 H1 = projection * vec4(rayEnd, 1.0);\n\n float k0 = 1.0 / H0.w, k1 = 1.0 / H1.w;\n\n vec3 Q0 = rayOrigin * k0, Q1 = rayEnd * k1;\n\n vec2 P0 = (H0.xy * k0 * 0.5 + 0.5) * viewportSize;\n vec2 P1 = (H1.xy * k1 * 0.5 + 0.5) * viewportSize;\n\n P1 += dot(P1 - P0, P1 - P0) < 0.0001 ? 0.01 : 0.0;\n vec2 delta = P1 - P0;\n\n bool permute = false;\n if (abs(delta.x) < abs(delta.y)) {\n permute = true;\n delta = delta.yx;\n P0 = P0.yx;\n P1 = P1.yx;\n }\n float stepDir = sign(delta.x);\n float invdx = stepDir / delta.x;\n\n vec3 dQ = (Q1 - Q0) * invdx;\n float dk = (k1 - k0) * invdx;\n\n vec2 dP = vec2(stepDir, delta.y * invdx);\n\n float strideScaler = 1.0 - min(1.0, -rayOrigin.z / pixelStrideZCutoff);\n float pixStride = 1.0 + strideScaler * pixelStride;\n\n dP *= pixStride; dQ *= pixStride; dk *= pixStride;\n\n vec4 pqk = vec4(P0, Q0.z, k0);\n vec4 dPQK = vec4(dP, dQ.z, dk);\n\n pqk += dPQK * jitter;\n float rayZFar = (dPQK.z * 0.5 + pqk.z) / (dPQK.w * 0.5 + pqk.w);\n float rayZNear;\n\n bool intersect = false;\n\n vec2 texelSize = 1.0 / viewportSize;\n\n iterationCount = 0.0;\n\n for (int i = 0; i < MAX_ITERATION; i++)\n {\n pqk += dPQK;\n\n rayZNear = rayZFar;\n rayZFar = (dPQK.z * 0.5 + pqk.z) / (dPQK.w * 0.5 + pqk.w);\n\n hitPixel = permute ? pqk.yx : pqk.xy;\n hitPixel *= texelSize;\n\n intersect = rayIntersectDepth(rayZNear, rayZFar, hitPixel);\n\n iterationCount += 1.0;\n\n dPQK *= 1.2;\n\n if (intersect) {\n break;\n }\n }\n\n Q0.xy += dQ.xy * iterationCount;\n Q0.z = pqk.z;\n hitPoint = Q0 / pqk.w;\n\n return intersect;\n}\n\nfloat calculateAlpha(\n float iterationCount, float reflectivity,\n vec2 hitPixel, vec3 hitPoint, float dist, vec3 rayDir\n)\n{\n float alpha = clamp(reflectivity, 0.0, 1.0);\n alpha *= 1.0 - (iterationCount / float(MAX_ITERATION));\n vec2 hitPixelNDC = hitPixel * 2.0 - 1.0;\n float maxDimension = min(1.0, max(abs(hitPixelNDC.x), abs(hitPixelNDC.y)));\n alpha *= 1.0 - max(0.0, maxDimension - screenEdgeFadeStart) / (1.0 - screenEdgeFadeStart);\n\n float _eyeFadeStart = eyeFadeStart;\n float _eyeFadeEnd = eyeFadeEnd;\n if (_eyeFadeStart > _eyeFadeEnd) {\n float tmp = _eyeFadeEnd;\n _eyeFadeEnd = _eyeFadeStart;\n _eyeFadeStart = tmp;\n }\n\n float eyeDir = clamp(rayDir.z, _eyeFadeStart, _eyeFadeEnd);\n alpha *= 1.0 - (eyeDir - _eyeFadeStart) / (_eyeFadeEnd - _eyeFadeStart);\n\n alpha *= 1.0 - clamp(dist / maxRayDistance, 0.0, 1.0);\n\n return alpha;\n}\n\n@import clay.util.rand\n\n@import clay.util.rgbm\n\nvoid main()\n{\n vec4 normalAndGloss = texture2D(gBufferTexture1, v_Texcoord);\n\n if (dot(normalAndGloss.rgb, vec3(1.0)) == 0.0) {\n discard;\n }\n\n float g = normalAndGloss.a;\n#if !defined(PHYSICALLY_CORRECT)\n if (g <= minGlossiness) {\n discard;\n }\n#endif\n\n float reflectivity = (g - minGlossiness) / (1.0 - minGlossiness);\n\n vec3 N = normalize(normalAndGloss.rgb * 2.0 - 1.0);\n N = normalize((toViewSpace * vec4(N, 0.0)).xyz);\n\n vec4 projectedPos = vec4(v_Texcoord * 2.0 - 1.0, fetchDepth(gBufferTexture2, v_Texcoord), 1.0);\n vec4 pos = projectionInv * projectedPos;\n vec3 rayOrigin = pos.xyz / pos.w;\n vec3 V = -normalize(rayOrigin);\n\n float ndv = clamp(dot(N, V), 0.0, 1.0);\n float iterationCount;\n float jitter = rand(fract(v_Texcoord + jitterOffset));\n\n#ifdef PHYSICALLY_CORRECT\n vec4 color = vec4(vec3(0.0), 1.0);\n vec4 albedoMetalness = texture2D(gBufferTexture3, v_Texcoord);\n vec3 albedo = albedoMetalness.rgb;\n float m = albedoMetalness.a;\n vec3 diffuseColor = albedo * (1.0 - m);\n vec3 spec = mix(vec3(0.04), albedo, m);\n\n float jitter2 = rand(fract(v_Texcoord)) * float(TOTAL_SAMPLES);\n\n for (int i = 0; i < SAMPLE_PER_FRAME; i++) {\n vec3 H = importanceSampleNormalGGX(float(i) + jitter2, 1.0 - g, N);\n vec3 rayDir = normalize(reflect(-V, H));\n#else\n vec3 rayDir = normalize(reflect(-V, N));\n#endif\n vec2 hitPixel;\n vec3 hitPoint;\n\n bool intersect = traceScreenSpaceRay(rayOrigin, rayDir, jitter, hitPixel, hitPoint, iterationCount);\n\n float dist = distance(rayOrigin, hitPoint);\n\n vec3 hitNormal = texture2D(gBufferTexture1, hitPixel).rgb * 2.0 - 1.0;\n hitNormal = normalize((toViewSpace * vec4(hitNormal, 0.0)).xyz);\n#ifdef PHYSICALLY_CORRECT\n float ndl = clamp(dot(N, rayDir), 0.0, 1.0);\n float vdh = clamp(dot(V, H), 0.0, 1.0);\n float ndh = clamp(dot(N, H), 0.0, 1.0);\n vec3 litTexel = vec3(0.0);\n if (dot(hitNormal, rayDir) < 0.0 && intersect) {\n litTexel = texture2D(sourceTexture, hitPixel).rgb;\n litTexel *= pow(clamp(1.0 - dist / 200.0, 0.0, 1.0), 3.0);\n\n }\n else {\n #ifdef SPECULARCUBEMAP_ENABLED\n vec3 rayDirW = normalize(toWorldSpace * vec4(rayDir, 0.0)).rgb;\n litTexel = RGBMDecode(textureCubeLodEXT(specularCubemap, rayDirW, 0.0), 8.12).rgb * specularIntensity;\n#endif\n }\n color.rgb += ndl * litTexel * (\n F_Schlick(ndl, spec) * G_Smith(g, ndv, ndl) * vdh / (ndh * ndv + 0.001)\n );\n }\n color.rgb /= float(SAMPLE_PER_FRAME);\n#else\n #if !defined(SPECULARCUBEMAP_ENABLED)\n if (dot(hitNormal, rayDir) >= 0.0) {\n discard;\n }\n if (!intersect) {\n discard;\n }\n#endif\n float alpha = clamp(calculateAlpha(iterationCount, reflectivity, hitPixel, hitPoint, dist, rayDir), 0.0, 1.0);\n vec4 color = texture2D(sourceTexture, hitPixel);\n color.rgb *= alpha;\n\n#ifdef SPECULARCUBEMAP_ENABLED\n vec3 rayDirW = normalize(toWorldSpace * vec4(rayDir, 0.0)).rgb;\n alpha = alpha * (intersect ? 1.0 : 0.0);\n float bias = (1.0 -g) * 5.0;\n color.rgb += (1.0 - alpha)\n * RGBMDecode(textureCubeLodEXT(specularCubemap, rayDirW, bias), 8.12).rgb\n * specularIntensity;\n#endif\n\n#endif\n\n gl_FragColor = encodeHDR(color);\n}\n@end\n\n@export ecgl.ssr.blur\n\nuniform sampler2D texture;\nuniform sampler2D gBufferTexture1;\nuniform sampler2D gBufferTexture2;\nuniform mat4 projection;\nuniform float depthRange : 0.05;\n\nvarying vec2 v_Texcoord;\n\nuniform vec2 textureSize;\nuniform float blurSize : 1.0;\n\n#ifdef BLEND\n #ifdef SSAOTEX_ENABLED\nuniform sampler2D ssaoTex;\n #endif\nuniform sampler2D sourceTexture;\n#endif\n\nfloat getLinearDepth(vec2 coord)\n{\n float depth = texture2D(gBufferTexture2, coord).r * 2.0 - 1.0;\n return projection[3][2] / (depth * projection[2][3] - projection[2][2]);\n}\n\n@import clay.util.rgbm\n\n\nvoid main()\n{\n @import clay.compositor.kernel.gaussian_9\n\n vec4 centerNTexel = texture2D(gBufferTexture1, v_Texcoord);\n float g = centerNTexel.a;\n float maxBlurSize = clamp(1.0 - g, 0.0, 1.0) * blurSize;\n#ifdef VERTICAL\n vec2 off = vec2(0.0, maxBlurSize / textureSize.y);\n#else\n vec2 off = vec2(maxBlurSize / textureSize.x, 0.0);\n#endif\n\n vec2 coord = v_Texcoord;\n\n vec4 sum = vec4(0.0);\n float weightAll = 0.0;\n\n vec3 cN = centerNTexel.rgb * 2.0 - 1.0;\n float cD = getLinearDepth(v_Texcoord);\n for (int i = 0; i < 9; i++) {\n vec2 coord = clamp((float(i) - 4.0) * off + v_Texcoord, vec2(0.0), vec2(1.0));\n float w = gaussianKernel[i]\n * clamp(dot(cN, texture2D(gBufferTexture1, coord).rgb * 2.0 - 1.0), 0.0, 1.0);\n float d = getLinearDepth(coord);\n w *= (1.0 - smoothstep(abs(cD - d) / depthRange, 0.0, 1.0));\n\n weightAll += w;\n sum += decodeHDR(texture2D(texture, coord)) * w;\n }\n\n#ifdef BLEND\n float aoFactor = 1.0;\n #ifdef SSAOTEX_ENABLED\n aoFactor = texture2D(ssaoTex, v_Texcoord).r;\n #endif\n gl_FragColor = encodeHDR(\n sum / weightAll * aoFactor + decodeHDR(texture2D(sourceTexture, v_Texcoord))\n );\n#else\n gl_FragColor = encodeHDR(sum / weightAll);\n#endif\n}\n\n@end";
Shader.import(SSRGLSLCode);
function SSRPass(opt) {
  opt = opt || {};
  this._ssrPass = new Pass$1({
    fragment: Shader.source("ecgl.ssr.main"),
    clearColor: [0, 0, 0, 0]
  });
  this._blurPass1 = new Pass$1({
    fragment: Shader.source("ecgl.ssr.blur"),
    clearColor: [0, 0, 0, 0]
  });
  this._blurPass2 = new Pass$1({
    fragment: Shader.source("ecgl.ssr.blur"),
    clearColor: [0, 0, 0, 0]
  });
  this._blendPass = new Pass$1({
    fragment: Shader.source("clay.compositor.blend")
  });
  this._blendPass.material.disableTexturesAll();
  this._blendPass.material.enableTexture(["texture1", "texture2"]);
  this._ssrPass.setUniform("gBufferTexture1", opt.normalTexture);
  this._ssrPass.setUniform("gBufferTexture2", opt.depthTexture);
  this._blurPass1.setUniform("gBufferTexture1", opt.normalTexture);
  this._blurPass1.setUniform("gBufferTexture2", opt.depthTexture);
  this._blurPass2.setUniform("gBufferTexture1", opt.normalTexture);
  this._blurPass2.setUniform("gBufferTexture2", opt.depthTexture);
  this._blurPass2.material.define("fragment", "VERTICAL");
  this._blurPass2.material.define("fragment", "BLEND");
  this._ssrTexture = new Texture2D$1({
    type: Texture$1.HALF_FLOAT
  });
  this._texture2 = new Texture2D$1({
    type: Texture$1.HALF_FLOAT
  });
  this._texture3 = new Texture2D$1({
    type: Texture$1.HALF_FLOAT
  });
  this._prevTexture = new Texture2D$1({
    type: Texture$1.HALF_FLOAT
  });
  this._currentTexture = new Texture2D$1({
    type: Texture$1.HALF_FLOAT
  });
  this._frameBuffer = new FrameBuffer$1({
    depthBuffer: false
  });
  this._normalDistribution = null;
  this._totalSamples = 256;
  this._samplePerFrame = 4;
  this._ssrPass.material.define("fragment", "SAMPLE_PER_FRAME", this._samplePerFrame);
  this._ssrPass.material.define("fragment", "TOTAL_SAMPLES", this._totalSamples);
  this._downScale = 1;
}
SSRPass.prototype.setAmbientCubemap = function(specularCubemap, specularIntensity) {
  this._ssrPass.material.set("specularCubemap", specularCubemap);
  this._ssrPass.material.set("specularIntensity", specularIntensity);
  var enableSpecularMap = specularCubemap && specularIntensity;
  this._ssrPass.material[enableSpecularMap ? "enableTexture" : "disableTexture"]("specularCubemap");
};
SSRPass.prototype.update = function(renderer, camera2, sourceTexture, frame) {
  var width = renderer.getWidth();
  var height = renderer.getHeight();
  var ssrTexture = this._ssrTexture;
  var texture2 = this._texture2;
  var texture3 = this._texture3;
  ssrTexture.width = this._prevTexture.width = this._currentTexture.width = width / this._downScale;
  ssrTexture.height = this._prevTexture.height = this._currentTexture.height = height / this._downScale;
  texture2.width = texture3.width = width;
  texture2.height = texture3.height = height;
  var frameBuffer = this._frameBuffer;
  var ssrPass = this._ssrPass;
  var blurPass1 = this._blurPass1;
  var blurPass2 = this._blurPass2;
  var blendPass = this._blendPass;
  var toViewSpace = new Matrix4$1();
  var toWorldSpace = new Matrix4$1();
  Matrix4$1.transpose(toViewSpace, camera2.worldTransform);
  Matrix4$1.transpose(toWorldSpace, camera2.viewMatrix);
  ssrPass.setUniform("sourceTexture", sourceTexture);
  ssrPass.setUniform("projection", camera2.projectionMatrix.array);
  ssrPass.setUniform("projectionInv", camera2.invProjectionMatrix.array);
  ssrPass.setUniform("toViewSpace", toViewSpace.array);
  ssrPass.setUniform("toWorldSpace", toWorldSpace.array);
  ssrPass.setUniform("nearZ", camera2.near);
  var percent = frame / this._totalSamples * this._samplePerFrame;
  ssrPass.setUniform("jitterOffset", percent);
  ssrPass.setUniform("sampleOffset", frame * this._samplePerFrame);
  blurPass1.setUniform("textureSize", [ssrTexture.width, ssrTexture.height]);
  blurPass2.setUniform("textureSize", [width, height]);
  blurPass2.setUniform("sourceTexture", sourceTexture);
  blurPass1.setUniform("projection", camera2.projectionMatrix.array);
  blurPass2.setUniform("projection", camera2.projectionMatrix.array);
  frameBuffer.attach(ssrTexture);
  frameBuffer.bind(renderer);
  ssrPass.render(renderer);
  if (this._physicallyCorrect) {
    frameBuffer.attach(this._currentTexture);
    blendPass.setUniform("texture1", this._prevTexture);
    blendPass.setUniform("texture2", ssrTexture);
    blendPass.material.set({
      "weight1": frame >= 1 ? 0.95 : 0,
      "weight2": frame >= 1 ? 0.05 : 1
    });
    blendPass.render(renderer);
  }
  frameBuffer.attach(texture2);
  blurPass1.setUniform("texture", this._physicallyCorrect ? this._currentTexture : ssrTexture);
  blurPass1.render(renderer);
  frameBuffer.attach(texture3);
  blurPass2.setUniform("texture", texture2);
  blurPass2.render(renderer);
  frameBuffer.unbind(renderer);
  if (this._physicallyCorrect) {
    var tmp = this._prevTexture;
    this._prevTexture = this._currentTexture;
    this._currentTexture = tmp;
  }
};
SSRPass.prototype.getTargetTexture = function() {
  return this._texture3;
};
SSRPass.prototype.setParameter = function(name, val) {
  if (name === "maxIteration") {
    this._ssrPass.material.define("fragment", "MAX_ITERATION", val);
  } else {
    this._ssrPass.setUniform(name, val);
  }
};
SSRPass.prototype.setPhysicallyCorrect = function(isPhysicallyCorrect) {
  if (isPhysicallyCorrect) {
    if (!this._normalDistribution) {
      this._normalDistribution = cubemapUtil$1.generateNormalDistribution(64, this._totalSamples);
    }
    this._ssrPass.material.define("fragment", "PHYSICALLY_CORRECT");
    this._ssrPass.material.set("normalDistribution", this._normalDistribution);
    this._ssrPass.material.set("normalDistributionSize", [64, this._totalSamples]);
  } else {
    this._ssrPass.material.undefine("fragment", "PHYSICALLY_CORRECT");
  }
  this._physicallyCorrect = isPhysicallyCorrect;
};
SSRPass.prototype.setSSAOTexture = function(texture) {
  var blendPass = this._blurPass2;
  if (texture) {
    blendPass.material.enableTexture("ssaoTex");
    blendPass.material.set("ssaoTex", texture);
  } else {
    blendPass.material.disableTexture("ssaoTex");
  }
};
SSRPass.prototype.isFinished = function(frame) {
  if (this._physicallyCorrect) {
    return frame > this._totalSamples / this._samplePerFrame;
  } else {
    return true;
  }
};
SSRPass.prototype.dispose = function(renderer) {
  this._ssrTexture.dispose(renderer);
  this._texture2.dispose(renderer);
  this._texture3.dispose(renderer);
  this._prevTexture.dispose(renderer);
  this._currentTexture.dispose(renderer);
  this._frameBuffer.dispose(renderer);
};
var poissonKernel = [0, 0, -0.321585265978, -0.154972575841, 0.458126042375, 0.188473391593, 0.842080129861, 0.527766490688, 0.147304551086, -0.659453822776, -0.331943915203, -0.940619700594, 0.0479226680259, 0.54812163202, 0.701581552186, -0.709825561388, -0.295436780218, 0.940589268233, -0.901489676764, 0.237713156085, 0.973570876096, -0.109899459384, -0.866792314779, -0.451805525005, 0.330975007087, 0.800048655954, -0.344275183665, 0.381779221166, -0.386139432542, -0.437418421534, -0.576478634965, -0.0148463392551, 0.385798197415, -0.262426961053, -0.666302061145, 0.682427250835, -0.628010632582, -0.732836215494, 0.10163141741, -0.987658134403, 0.711995289051, -0.320024291314, 0.0296005138058, 0.950296523438, 0.0130612307608, -0.351024443122, -0.879596633704, -0.10478487883, 0.435712737232, 0.504254490347, 0.779203817497, 0.206477676721, 0.388264289969, -0.896736162545, -0.153106280781, -0.629203242522, -0.245517550697, 0.657969239148, 0.126830499058, 0.26862328493, -0.634888119007, -0.302301223431, 0.617074219636, 0.779817204925];
var normalGLSL = "@export ecgl.normal.vertex\n\n@import ecgl.common.transformUniforms\n\n@import ecgl.common.uv.header\n\n@import ecgl.common.attributes\n\nvarying vec3 v_Normal;\nvarying vec3 v_WorldPosition;\n\n@import ecgl.common.normalMap.vertexHeader\n\n@import ecgl.common.vertexAnimation.header\n\nvoid main()\n{\n\n @import ecgl.common.vertexAnimation.main\n\n @import ecgl.common.uv.main\n\n v_Normal = normalize((worldInverseTranspose * vec4(normal, 0.0)).xyz);\n v_WorldPosition = (world * vec4(pos, 1.0)).xyz;\n\n @import ecgl.common.normalMap.vertexMain\n\n gl_Position = worldViewProjection * vec4(pos, 1.0);\n\n}\n\n\n@end\n\n\n@export ecgl.normal.fragment\n\n#define ROUGHNESS_CHANEL 0\n\nuniform bool useBumpMap;\nuniform bool useRoughnessMap;\nuniform bool doubleSide;\nuniform float roughness;\n\n@import ecgl.common.uv.fragmentHeader\n\nvarying vec3 v_Normal;\nvarying vec3 v_WorldPosition;\n\nuniform mat4 viewInverse : VIEWINVERSE;\n\n@import ecgl.common.normalMap.fragmentHeader\n@import ecgl.common.bumpMap.header\n\nuniform sampler2D roughnessMap;\n\nvoid main()\n{\n vec3 N = v_Normal;\n \n bool flipNormal = false;\n if (doubleSide) {\n vec3 eyePos = viewInverse[3].xyz;\n vec3 V = normalize(eyePos - v_WorldPosition);\n\n if (dot(N, V) < 0.0) {\n flipNormal = true;\n }\n }\n\n @import ecgl.common.normalMap.fragmentMain\n\n if (useBumpMap) {\n N = bumpNormal(v_WorldPosition, v_Normal, N);\n }\n\n float g = 1.0 - roughness;\n\n if (useRoughnessMap) {\n float g2 = 1.0 - texture2D(roughnessMap, v_DetailTexcoord)[ROUGHNESS_CHANEL];\n g = clamp(g2 + (g - 0.5) * 2.0, 0.0, 1.0);\n }\n\n if (flipNormal) {\n N = -N;\n }\n\n gl_FragColor.rgb = (N.xyz + 1.0) * 0.5;\n gl_FragColor.a = g;\n}\n@end";
Shader.import(normalGLSL);
function attachTextureToSlot(renderer, program, symbol, texture, slot) {
  var gl = renderer.gl;
  program.setUniform(gl, "1i", symbol, slot);
  gl.activeTexture(gl.TEXTURE0 + slot);
  if (texture.isRenderable()) {
    texture.bind(renderer);
  } else {
    texture.unbind(renderer);
  }
}
function getBeforeRenderHook(renderer, defaultNormalMap, defaultBumpMap, defaultRoughnessMap, normalMaterial) {
  var previousNormalMap;
  var previousBumpMap;
  var previousRoughnessMap;
  var previousRenderable;
  var gl = renderer.gl;
  return function(renderable, normalMaterial2, prevNormalMaterial) {
    if (previousRenderable && previousRenderable.material === renderable.material) {
      return;
    }
    var material = renderable.material;
    var program = renderable.__program;
    var roughness = material.get("roughness");
    if (roughness == null) {
      roughness = 1;
    }
    var normalMap = material.get("normalMap") || defaultNormalMap;
    var roughnessMap = material.get("roughnessMap");
    var bumpMap = material.get("bumpMap");
    var uvRepeat = material.get("uvRepeat");
    var uvOffset = material.get("uvOffset");
    var detailUvRepeat = material.get("detailUvRepeat");
    var detailUvOffset = material.get("detailUvOffset");
    var useBumpMap = !!bumpMap && material.isTextureEnabled("bumpMap");
    var useRoughnessMap = !!roughnessMap && material.isTextureEnabled("roughnessMap");
    var doubleSide = material.isDefined("fragment", "DOUBLE_SIDED");
    bumpMap = bumpMap || defaultBumpMap;
    roughnessMap = roughnessMap || defaultRoughnessMap;
    if (prevNormalMaterial !== normalMaterial2) {
      normalMaterial2.set("normalMap", normalMap);
      normalMaterial2.set("bumpMap", bumpMap);
      normalMaterial2.set("roughnessMap", roughnessMap);
      normalMaterial2.set("useBumpMap", useBumpMap);
      normalMaterial2.set("useRoughnessMap", useRoughnessMap);
      normalMaterial2.set("doubleSide", doubleSide);
      uvRepeat != null && normalMaterial2.set("uvRepeat", uvRepeat);
      uvOffset != null && normalMaterial2.set("uvOffset", uvOffset);
      detailUvRepeat != null && normalMaterial2.set("detailUvRepeat", detailUvRepeat);
      detailUvOffset != null && normalMaterial2.set("detailUvOffset", detailUvOffset);
      normalMaterial2.set("roughness", roughness);
    } else {
      program.setUniform(gl, "1f", "roughness", roughness);
      if (previousNormalMap !== normalMap) {
        attachTextureToSlot(renderer, program, "normalMap", normalMap, 0);
      }
      if (previousBumpMap !== bumpMap && bumpMap) {
        attachTextureToSlot(renderer, program, "bumpMap", bumpMap, 1);
      }
      if (previousRoughnessMap !== roughnessMap && roughnessMap) {
        attachTextureToSlot(renderer, program, "roughnessMap", roughnessMap, 2);
      }
      if (uvRepeat != null) {
        program.setUniform(gl, "2f", "uvRepeat", uvRepeat);
      }
      if (uvOffset != null) {
        program.setUniform(gl, "2f", "uvOffset", uvOffset);
      }
      if (detailUvRepeat != null) {
        program.setUniform(gl, "2f", "detailUvRepeat", detailUvRepeat);
      }
      if (detailUvOffset != null) {
        program.setUniform(gl, "2f", "detailUvOffset", detailUvOffset);
      }
      program.setUniform(gl, "1i", "useBumpMap", +useBumpMap);
      program.setUniform(gl, "1i", "useRoughnessMap", +useRoughnessMap);
      program.setUniform(gl, "1i", "doubleSide", +doubleSide);
    }
    previousNormalMap = normalMap;
    previousBumpMap = bumpMap;
    previousRoughnessMap = roughnessMap;
    previousRenderable = renderable;
  };
}
function NormalPass(opt) {
  this._depthTex = new Texture2D$1({
    format: Texture$1.DEPTH_COMPONENT,
    type: Texture$1.UNSIGNED_INT
  });
  this._normalTex = new Texture2D$1({
    type: Texture$1.HALF_FLOAT
  });
  this._framebuffer = new FrameBuffer$1();
  this._framebuffer.attach(this._normalTex);
  this._framebuffer.attach(this._depthTex, FrameBuffer$1.DEPTH_ATTACHMENT);
  this._normalMaterial = new Material$1({
    shader: new Shader(Shader.source("ecgl.normal.vertex"), Shader.source("ecgl.normal.fragment"))
  });
  this._normalMaterial.enableTexture(["normalMap", "bumpMap", "roughnessMap"]);
  this._defaultNormalMap = textureUtil$1.createBlank("#000");
  this._defaultBumpMap = textureUtil$1.createBlank("#000");
  this._defaultRoughessMap = textureUtil$1.createBlank("#000");
  this._debugPass = new Pass$1({
    fragment: Shader.source("clay.compositor.output")
  });
  this._debugPass.setUniform("texture", this._normalTex);
  this._debugPass.material.undefine("fragment", "OUTPUT_ALPHA");
}
NormalPass.prototype.getDepthTexture = function() {
  return this._depthTex;
};
NormalPass.prototype.getNormalTexture = function() {
  return this._normalTex;
};
NormalPass.prototype.update = function(renderer, scene, camera2) {
  var width = renderer.getWidth();
  var height = renderer.getHeight();
  var depthTexture = this._depthTex;
  var normalTexture = this._normalTex;
  var normalMaterial = this._normalMaterial;
  depthTexture.width = width;
  depthTexture.height = height;
  normalTexture.width = width;
  normalTexture.height = height;
  var opaqueList = scene.getRenderList(camera2).opaque;
  this._framebuffer.bind(renderer);
  renderer.gl.clearColor(0, 0, 0, 0);
  renderer.gl.clear(renderer.gl.COLOR_BUFFER_BIT | renderer.gl.DEPTH_BUFFER_BIT);
  renderer.gl.disable(renderer.gl.BLEND);
  renderer.renderPass(opaqueList, camera2, {
    getMaterial: function() {
      return normalMaterial;
    },
    ifRender: function(object) {
      return object.renderNormal;
    },
    beforeRender: getBeforeRenderHook(renderer, this._defaultNormalMap, this._defaultBumpMap, this._defaultRoughessMap, this._normalMaterial),
    sort: renderer.opaqueSortCompare
  });
  this._framebuffer.unbind(renderer);
};
NormalPass.prototype.renderDebug = function(renderer) {
  this._debugPass.render(renderer);
};
NormalPass.prototype.dispose = function(renderer) {
  this._depthTex.dispose(renderer);
  this._normalTex.dispose(renderer);
};
function EdgePass(opt) {
  opt = opt || {};
  this._edgePass = new Pass$1({
    fragment: Shader.source("ecgl.edge")
  });
  this._edgePass.setUniform("normalTexture", opt.normalTexture);
  this._edgePass.setUniform("depthTexture", opt.depthTexture);
  this._targetTexture = new Texture2D$1({
    type: Texture$1.HALF_FLOAT
  });
  this._frameBuffer = new FrameBuffer$1();
  this._frameBuffer.attach(this._targetTexture);
}
EdgePass.prototype.update = function(renderer, camera2, sourceTexture, frame) {
  var width = renderer.getWidth();
  var height = renderer.getHeight();
  var texture = this._targetTexture;
  texture.width = width;
  texture.height = height;
  var frameBuffer = this._frameBuffer;
  frameBuffer.bind(renderer);
  this._edgePass.setUniform("projectionInv", camera2.invProjectionMatrix.array);
  this._edgePass.setUniform("textureSize", [width, height]);
  this._edgePass.setUniform("texture", sourceTexture);
  this._edgePass.render(renderer);
  frameBuffer.unbind(renderer);
};
EdgePass.prototype.getTargetTexture = function() {
  return this._targetTexture;
};
EdgePass.prototype.setParameter = function(name, val) {
  this._edgePass.setUniform(name, val);
};
EdgePass.prototype.dispose = function(renderer) {
  this._targetTexture.dispose(renderer);
  this._frameBuffer.dispose(renderer);
};
var effectJson = {
  "type": "compositor",
  "nodes": [{
    "name": "source",
    "type": "texture",
    "outputs": {
      "color": {}
    }
  }, {
    "name": "source_half",
    "shader": "#source(clay.compositor.downsample)",
    "inputs": {
      "texture": "source"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 2)",
          "height": "expr(height * 1.0 / 2)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "textureSize": "expr( [width * 1.0, height * 1.0] )"
    }
  }, {
    "name": "bright",
    "shader": "#source(clay.compositor.bright)",
    "inputs": {
      "texture": "source_half"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 2)",
          "height": "expr(height * 1.0 / 2)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "threshold": 2,
      "scale": 4,
      "textureSize": "expr([width * 1.0 / 2, height / 2])"
    }
  }, {
    "name": "bright_downsample_4",
    "shader": "#source(clay.compositor.downsample)",
    "inputs": {
      "texture": "bright"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 4)",
          "height": "expr(height * 1.0 / 4)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "textureSize": "expr( [width * 1.0 / 2, height / 2] )"
    }
  }, {
    "name": "bright_downsample_8",
    "shader": "#source(clay.compositor.downsample)",
    "inputs": {
      "texture": "bright_downsample_4"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 8)",
          "height": "expr(height * 1.0 / 8)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "textureSize": "expr( [width * 1.0 / 4, height / 4] )"
    }
  }, {
    "name": "bright_downsample_16",
    "shader": "#source(clay.compositor.downsample)",
    "inputs": {
      "texture": "bright_downsample_8"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 16)",
          "height": "expr(height * 1.0 / 16)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "textureSize": "expr( [width * 1.0 / 8, height / 8] )"
    }
  }, {
    "name": "bright_downsample_32",
    "shader": "#source(clay.compositor.downsample)",
    "inputs": {
      "texture": "bright_downsample_16"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 32)",
          "height": "expr(height * 1.0 / 32)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "textureSize": "expr( [width * 1.0 / 16, height / 16] )"
    }
  }, {
    "name": "bright_upsample_16_blur_h",
    "shader": "#source(clay.compositor.gaussian_blur)",
    "inputs": {
      "texture": "bright_downsample_32"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 16)",
          "height": "expr(height * 1.0 / 16)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "blurSize": 1,
      "blurDir": 0,
      "textureSize": "expr( [width * 1.0 / 32, height / 32] )"
    }
  }, {
    "name": "bright_upsample_16_blur_v",
    "shader": "#source(clay.compositor.gaussian_blur)",
    "inputs": {
      "texture": "bright_upsample_16_blur_h"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 16)",
          "height": "expr(height * 1.0 / 16)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "blurSize": 1,
      "blurDir": 1,
      "textureSize": "expr( [width * 1.0 / 16, height * 1.0 / 16] )"
    }
  }, {
    "name": "bright_upsample_8_blur_h",
    "shader": "#source(clay.compositor.gaussian_blur)",
    "inputs": {
      "texture": "bright_downsample_16"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 8)",
          "height": "expr(height * 1.0 / 8)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "blurSize": 1,
      "blurDir": 0,
      "textureSize": "expr( [width * 1.0 / 16, height * 1.0 / 16] )"
    }
  }, {
    "name": "bright_upsample_8_blur_v",
    "shader": "#source(clay.compositor.gaussian_blur)",
    "inputs": {
      "texture": "bright_upsample_8_blur_h"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 8)",
          "height": "expr(height * 1.0 / 8)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "blurSize": 1,
      "blurDir": 1,
      "textureSize": "expr( [width * 1.0 / 8, height * 1.0 / 8] )"
    }
  }, {
    "name": "bright_upsample_8_blend",
    "shader": "#source(clay.compositor.blend)",
    "inputs": {
      "texture1": "bright_upsample_8_blur_v",
      "texture2": "bright_upsample_16_blur_v"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 8)",
          "height": "expr(height * 1.0 / 8)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "weight1": 0.3,
      "weight2": 0.7
    }
  }, {
    "name": "bright_upsample_4_blur_h",
    "shader": "#source(clay.compositor.gaussian_blur)",
    "inputs": {
      "texture": "bright_downsample_8"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 4)",
          "height": "expr(height * 1.0 / 4)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "blurSize": 1,
      "blurDir": 0,
      "textureSize": "expr( [width * 1.0 / 8, height * 1.0 / 8] )"
    }
  }, {
    "name": "bright_upsample_4_blur_v",
    "shader": "#source(clay.compositor.gaussian_blur)",
    "inputs": {
      "texture": "bright_upsample_4_blur_h"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 4)",
          "height": "expr(height * 1.0 / 4)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "blurSize": 1,
      "blurDir": 1,
      "textureSize": "expr( [width * 1.0 / 4, height * 1.0 / 4] )"
    }
  }, {
    "name": "bright_upsample_4_blend",
    "shader": "#source(clay.compositor.blend)",
    "inputs": {
      "texture1": "bright_upsample_4_blur_v",
      "texture2": "bright_upsample_8_blend"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 4)",
          "height": "expr(height * 1.0 / 4)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "weight1": 0.3,
      "weight2": 0.7
    }
  }, {
    "name": "bright_upsample_2_blur_h",
    "shader": "#source(clay.compositor.gaussian_blur)",
    "inputs": {
      "texture": "bright_downsample_4"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 2)",
          "height": "expr(height * 1.0 / 2)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "blurSize": 1,
      "blurDir": 0,
      "textureSize": "expr( [width * 1.0 / 4, height * 1.0 / 4] )"
    }
  }, {
    "name": "bright_upsample_2_blur_v",
    "shader": "#source(clay.compositor.gaussian_blur)",
    "inputs": {
      "texture": "bright_upsample_2_blur_h"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 2)",
          "height": "expr(height * 1.0 / 2)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "blurSize": 1,
      "blurDir": 1,
      "textureSize": "expr( [width * 1.0 / 2, height * 1.0 / 2] )"
    }
  }, {
    "name": "bright_upsample_2_blend",
    "shader": "#source(clay.compositor.blend)",
    "inputs": {
      "texture1": "bright_upsample_2_blur_v",
      "texture2": "bright_upsample_4_blend"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0 / 2)",
          "height": "expr(height * 1.0 / 2)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "weight1": 0.3,
      "weight2": 0.7
    }
  }, {
    "name": "bright_upsample_full_blur_h",
    "shader": "#source(clay.compositor.gaussian_blur)",
    "inputs": {
      "texture": "bright"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0)",
          "height": "expr(height * 1.0)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "blurSize": 1,
      "blurDir": 0,
      "textureSize": "expr( [width * 1.0 / 2, height * 1.0 / 2] )"
    }
  }, {
    "name": "bright_upsample_full_blur_v",
    "shader": "#source(clay.compositor.gaussian_blur)",
    "inputs": {
      "texture": "bright_upsample_full_blur_h"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0)",
          "height": "expr(height * 1.0)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "blurSize": 1,
      "blurDir": 1,
      "textureSize": "expr( [width * 1.0, height * 1.0] )"
    }
  }, {
    "name": "bloom_composite",
    "shader": "#source(clay.compositor.blend)",
    "inputs": {
      "texture1": "bright_upsample_full_blur_v",
      "texture2": "bright_upsample_2_blend"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0)",
          "height": "expr(height * 1.0)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "weight1": 0.3,
      "weight2": 0.7
    }
  }, {
    "name": "coc",
    "shader": "#source(ecgl.dof.coc)",
    "outputs": {
      "color": {
        "parameters": {
          "minFilter": "NEAREST",
          "magFilter": "NEAREST",
          "width": "expr(width * 1.0)",
          "height": "expr(height * 1.0)"
        }
      }
    },
    "parameters": {
      "focalDist": 50,
      "focalRange": 30
    }
  }, {
    "name": "dof_far_blur",
    "shader": "#source(ecgl.dof.diskBlur)",
    "inputs": {
      "texture": "source",
      "coc": "coc"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0)",
          "height": "expr(height * 1.0)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "textureSize": "expr( [width * 1.0, height * 1.0] )"
    }
  }, {
    "name": "dof_near_blur",
    "shader": "#source(ecgl.dof.diskBlur)",
    "inputs": {
      "texture": "source",
      "coc": "coc"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0)",
          "height": "expr(height * 1.0)",
          "type": "HALF_FLOAT"
        }
      }
    },
    "parameters": {
      "textureSize": "expr( [width * 1.0, height * 1.0] )"
    },
    "defines": {
      "BLUR_NEARFIELD": null
    }
  }, {
    "name": "dof_coc_blur",
    "shader": "#source(ecgl.dof.diskBlur)",
    "inputs": {
      "texture": "coc"
    },
    "outputs": {
      "color": {
        "parameters": {
          "minFilter": "NEAREST",
          "magFilter": "NEAREST",
          "width": "expr(width * 1.0)",
          "height": "expr(height * 1.0)"
        }
      }
    },
    "parameters": {
      "textureSize": "expr( [width * 1.0, height * 1.0] )"
    },
    "defines": {
      "BLUR_COC": null
    }
  }, {
    "name": "dof_composite",
    "shader": "#source(ecgl.dof.composite)",
    "inputs": {
      "original": "source",
      "blurred": "dof_far_blur",
      "nearfield": "dof_near_blur",
      "coc": "coc",
      "nearcoc": "dof_coc_blur"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0)",
          "height": "expr(height * 1.0)",
          "type": "HALF_FLOAT"
        }
      }
    }
  }, {
    "name": "composite",
    "shader": "#source(clay.compositor.hdr.composite)",
    "inputs": {
      "texture": "source",
      "bloom": "bloom_composite"
    },
    "outputs": {
      "color": {
        "parameters": {
          "width": "expr(width * 1.0)",
          "height": "expr(height * 1.0)"
        }
      }
    },
    "defines": {}
  }, {
    "name": "FXAA",
    "shader": "#source(clay.compositor.fxaa)",
    "inputs": {
      "texture": "composite"
    }
  }]
};
var DOFCode = "@export ecgl.dof.coc\n\nuniform sampler2D depth;\n\nuniform float zNear: 0.1;\nuniform float zFar: 2000;\n\nuniform float focalDistance: 3;\nuniform float focalRange: 1;\nuniform float focalLength: 30;\nuniform float fstop: 2.8;\n\nvarying vec2 v_Texcoord;\n\n@import clay.util.encode_float\n\nvoid main()\n{\n float z = texture2D(depth, v_Texcoord).r * 2.0 - 1.0;\n\n float dist = 2.0 * zNear * zFar / (zFar + zNear - z * (zFar - zNear));\n\n float aperture = focalLength / fstop;\n\n float coc;\n\n float uppper = focalDistance + focalRange;\n float lower = focalDistance - focalRange;\n if (dist <= uppper && dist >= lower) {\n coc = 0.5;\n }\n else {\n float focalAdjusted = dist > uppper ? uppper : lower;\n\n coc = abs(aperture * (focalLength * (dist - focalAdjusted)) / (dist * (focalAdjusted - focalLength)));\n coc = clamp(coc, 0.0, 2.0) / 2.00001;\n\n if (dist < lower) {\n coc = -coc;\n }\n coc = coc * 0.5 + 0.5;\n }\n\n gl_FragColor = encodeFloat(coc);\n}\n@end\n\n\n@export ecgl.dof.composite\n\n#define DEBUG 0\n\nuniform sampler2D original;\nuniform sampler2D blurred;\nuniform sampler2D nearfield;\nuniform sampler2D coc;\nuniform sampler2D nearcoc;\nvarying vec2 v_Texcoord;\n\n@import clay.util.rgbm\n@import clay.util.float\n\nvoid main()\n{\n vec4 blurredColor = texture2D(blurred, v_Texcoord);\n vec4 originalColor = texture2D(original, v_Texcoord);\n\n float fCoc = decodeFloat(texture2D(coc, v_Texcoord));\n\n fCoc = abs(fCoc * 2.0 - 1.0);\n\n float weight = smoothstep(0.0, 1.0, fCoc);\n \n#ifdef NEARFIELD_ENABLED\n vec4 nearfieldColor = texture2D(nearfield, v_Texcoord);\n float fNearCoc = decodeFloat(texture2D(nearcoc, v_Texcoord));\n fNearCoc = abs(fNearCoc * 2.0 - 1.0);\n\n gl_FragColor = encodeHDR(\n mix(\n nearfieldColor, mix(originalColor, blurredColor, weight),\n pow(1.0 - fNearCoc, 4.0)\n )\n );\n#else\n gl_FragColor = encodeHDR(mix(originalColor, blurredColor, weight));\n#endif\n\n}\n\n@end\n\n\n\n@export ecgl.dof.diskBlur\n\n#define POISSON_KERNEL_SIZE 16;\n\nuniform sampler2D texture;\nuniform sampler2D coc;\nvarying vec2 v_Texcoord;\n\nuniform float blurRadius : 10.0;\nuniform vec2 textureSize : [512.0, 512.0];\n\nuniform vec2 poissonKernel[POISSON_KERNEL_SIZE];\n\nuniform float percent;\n\nfloat nrand(const in vec2 n) {\n return fract(sin(dot(n.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\n@import clay.util.rgbm\n@import clay.util.float\n\n\nvoid main()\n{\n vec2 offset = blurRadius / textureSize;\n\n float rnd = 6.28318 * nrand(v_Texcoord + 0.07 * percent );\n float cosa = cos(rnd);\n float sina = sin(rnd);\n vec4 basis = vec4(cosa, -sina, sina, cosa);\n\n#if !defined(BLUR_NEARFIELD) && !defined(BLUR_COC)\n offset *= abs(decodeFloat(texture2D(coc, v_Texcoord)) * 2.0 - 1.0);\n#endif\n\n#ifdef BLUR_COC\n float cocSum = 0.0;\n#else\n vec4 color = vec4(0.0);\n#endif\n\n\n float weightSum = 0.0;\n\n for (int i = 0; i < POISSON_KERNEL_SIZE; i++) {\n vec2 ofs = poissonKernel[i];\n\n ofs = vec2(dot(ofs, basis.xy), dot(ofs, basis.zw));\n\n vec2 uv = v_Texcoord + ofs * offset;\n vec4 texel = texture2D(texture, uv);\n\n float w = 1.0;\n#ifdef BLUR_COC\n float fCoc = decodeFloat(texel) * 2.0 - 1.0;\n cocSum += clamp(fCoc, -1.0, 0.0) * w;\n#else\n texel = texel;\n #if !defined(BLUR_NEARFIELD)\n float fCoc = decodeFloat(texture2D(coc, uv)) * 2.0 - 1.0;\n w *= abs(fCoc);\n #endif\n texel.rgb *= texel.a;\n color += texel * w;\n#endif\n\n weightSum += w;\n }\n\n#ifdef BLUR_COC\n gl_FragColor = encodeFloat(clamp(cocSum / weightSum, -1.0, 0.0) * 0.5 + 0.5);\n#else\n color /= weightSum;\n color.rgb /= (color.a + 0.0001);\n gl_FragColor = color;\n#endif\n}\n\n@end";
var edgeCode = "@export ecgl.edge\n\nuniform sampler2D texture;\n\nuniform sampler2D normalTexture;\nuniform sampler2D depthTexture;\n\nuniform mat4 projectionInv;\n\nuniform vec2 textureSize;\n\nuniform vec4 edgeColor: [0,0,0,0.8];\n\nvarying vec2 v_Texcoord;\n\nvec3 packColor(vec2 coord) {\n float z = texture2D(depthTexture, coord).r * 2.0 - 1.0;\n vec4 p = vec4(v_Texcoord * 2.0 - 1.0, z, 1.0);\n vec4 p4 = projectionInv * p;\n\n return vec3(\n texture2D(normalTexture, coord).rg,\n -p4.z / p4.w / 5.0\n );\n}\n\nvoid main() {\n vec2 cc = v_Texcoord;\n vec3 center = packColor(cc);\n\n float size = clamp(1.0 - (center.z - 10.0) / 100.0, 0.0, 1.0) * 0.5;\n float dx = size / textureSize.x;\n float dy = size / textureSize.y;\n\n vec2 coord;\n vec3 topLeft = packColor(cc+vec2(-dx, -dy));\n vec3 top = packColor(cc+vec2(0.0, -dy));\n vec3 topRight = packColor(cc+vec2(dx, -dy));\n vec3 left = packColor(cc+vec2(-dx, 0.0));\n vec3 right = packColor(cc+vec2(dx, 0.0));\n vec3 bottomLeft = packColor(cc+vec2(-dx, dy));\n vec3 bottom = packColor(cc+vec2(0.0, dy));\n vec3 bottomRight = packColor(cc+vec2(dx, dy));\n\n vec3 v = -topLeft-2.0*top-topRight+bottomLeft+2.0*bottom+bottomRight;\n vec3 h = -bottomLeft-2.0*left-topLeft+bottomRight+2.0*right+topRight;\n\n float edge = sqrt(dot(h, h) + dot(v, v));\n\n edge = smoothstep(0.8, 1.0, edge);\n\n gl_FragColor = mix(texture2D(texture, v_Texcoord), vec4(edgeColor.rgb, 1.0), edgeColor.a * edge);\n}\n@end";
Shader["import"](blurCode);
Shader["import"](lutCode);
Shader["import"](outputCode);
Shader["import"](brightCode);
Shader["import"](downsampleCode);
Shader["import"](upsampleCode);
Shader["import"](hdrCode);
Shader["import"](blendCode);
Shader["import"](fxaaCode);
Shader["import"](DOFCode);
Shader["import"](edgeCode);
function makeCommonOutputs(getWidth, getHeight) {
  return {
    color: {
      parameters: {
        width: getWidth,
        height: getHeight
      }
    }
  };
}
var FINAL_NODES_CHAIN = ["composite", "FXAA"];
function EffectCompositor() {
  this._width;
  this._height;
  this._dpr;
  this._sourceTexture = new Texture2D$1({
    type: Texture$1.HALF_FLOAT
  });
  this._depthTexture = new Texture2D$1({
    format: Texture$1.DEPTH_COMPONENT,
    type: Texture$1.UNSIGNED_INT
  });
  this._framebuffer = new FrameBuffer$1();
  this._framebuffer.attach(this._sourceTexture);
  this._framebuffer.attach(this._depthTexture, FrameBuffer$1.DEPTH_ATTACHMENT);
  this._normalPass = new NormalPass();
  this._compositor = createCompositor(effectJson);
  var sourceNode = this._compositor.getNodeByName("source");
  sourceNode.texture = this._sourceTexture;
  var cocNode = this._compositor.getNodeByName("coc");
  this._sourceNode = sourceNode;
  this._cocNode = cocNode;
  this._compositeNode = this._compositor.getNodeByName("composite");
  this._fxaaNode = this._compositor.getNodeByName("FXAA");
  this._dofBlurNodes = ["dof_far_blur", "dof_near_blur", "dof_coc_blur"].map(function(name) {
    return this._compositor.getNodeByName(name);
  }, this);
  this._dofBlurKernel = 0;
  this._dofBlurKernelSize = new Float32Array(0);
  this._finalNodesChain = FINAL_NODES_CHAIN.map(function(name) {
    return this._compositor.getNodeByName(name);
  }, this);
  var gBufferObj = {
    normalTexture: this._normalPass.getNormalTexture(),
    depthTexture: this._normalPass.getDepthTexture()
  };
  this._ssaoPass = new SSAOPass(gBufferObj);
  this._ssrPass = new SSRPass(gBufferObj);
  this._edgePass = new EdgePass(gBufferObj);
}
EffectCompositor.prototype.resize = function(width, height, dpr) {
  dpr = dpr || 1;
  var width = width * dpr;
  var height = height * dpr;
  var sourceTexture = this._sourceTexture;
  var depthTexture = this._depthTexture;
  sourceTexture.width = width;
  sourceTexture.height = height;
  depthTexture.width = width;
  depthTexture.height = height;
  var rendererMock = {
    getWidth: function() {
      return width;
    },
    getHeight: function() {
      return height;
    },
    getDevicePixelRatio: function() {
      return dpr;
    }
  };
  function wrapCallback(obj, key) {
    if (typeof obj[key] === "function") {
      var oldFunc = obj[key].__original || obj[key];
      obj[key] = function(renderer) {
        return oldFunc.call(this, rendererMock);
      };
      obj[key].__original = oldFunc;
    }
  }
  this._compositor.nodes.forEach(function(node) {
    for (var outKey in node.outputs) {
      var parameters = node.outputs[outKey].parameters;
      if (parameters) {
        wrapCallback(parameters, "width");
        wrapCallback(parameters, "height");
      }
    }
    for (var paramKey in node.parameters) {
      wrapCallback(node.parameters, paramKey);
    }
  });
  this._width = width;
  this._height = height;
  this._dpr = dpr;
};
EffectCompositor.prototype.getWidth = function() {
  return this._width;
};
EffectCompositor.prototype.getHeight = function() {
  return this._height;
};
EffectCompositor.prototype._ifRenderNormalPass = function() {
  return this._enableSSAO || this._enableEdge || this._enableSSR;
};
EffectCompositor.prototype._getPrevNode = function(node) {
  var idx = FINAL_NODES_CHAIN.indexOf(node.name) - 1;
  var prevNode = this._finalNodesChain[idx];
  while (prevNode && !this._compositor.getNodeByName(prevNode.name)) {
    idx -= 1;
    prevNode = this._finalNodesChain[idx];
  }
  return prevNode;
};
EffectCompositor.prototype._getNextNode = function(node) {
  var idx = FINAL_NODES_CHAIN.indexOf(node.name) + 1;
  var nextNode = this._finalNodesChain[idx];
  while (nextNode && !this._compositor.getNodeByName(nextNode.name)) {
    idx += 1;
    nextNode = this._finalNodesChain[idx];
  }
  return nextNode;
};
EffectCompositor.prototype._addChainNode = function(node) {
  var prevNode = this._getPrevNode(node);
  var nextNode = this._getNextNode(node);
  if (!prevNode) {
    return;
  }
  node.inputs.texture = prevNode.name;
  if (nextNode) {
    node.outputs = makeCommonOutputs(this.getWidth.bind(this), this.getHeight.bind(this));
    nextNode.inputs.texture = node.name;
  } else {
    node.outputs = null;
  }
  this._compositor.addNode(node);
};
EffectCompositor.prototype._removeChainNode = function(node) {
  var prevNode = this._getPrevNode(node);
  var nextNode = this._getNextNode(node);
  if (!prevNode) {
    return;
  }
  if (nextNode) {
    prevNode.outputs = makeCommonOutputs(this.getWidth.bind(this), this.getHeight.bind(this));
    nextNode.inputs.texture = prevNode.name;
  } else {
    prevNode.outputs = null;
  }
  this._compositor.removeNode(node);
};
EffectCompositor.prototype.updateNormal = function(renderer, scene, camera2, frame) {
  if (this._ifRenderNormalPass()) {
    this._normalPass.update(renderer, scene, camera2);
  }
};
EffectCompositor.prototype.updateSSAO = function(renderer, scene, camera2, frame) {
  this._ssaoPass.update(renderer, camera2, frame);
};
EffectCompositor.prototype.enableSSAO = function() {
  this._enableSSAO = true;
};
EffectCompositor.prototype.disableSSAO = function() {
  this._enableSSAO = false;
};
EffectCompositor.prototype.enableSSR = function() {
  this._enableSSR = true;
};
EffectCompositor.prototype.disableSSR = function() {
  this._enableSSR = false;
};
EffectCompositor.prototype.getSSAOTexture = function() {
  return this._ssaoPass.getTargetTexture();
};
EffectCompositor.prototype.getSourceFrameBuffer = function() {
  return this._framebuffer;
};
EffectCompositor.prototype.getSourceTexture = function() {
  return this._sourceTexture;
};
EffectCompositor.prototype.disableFXAA = function() {
  this._removeChainNode(this._fxaaNode);
};
EffectCompositor.prototype.enableFXAA = function() {
  this._addChainNode(this._fxaaNode);
};
EffectCompositor.prototype.enableBloom = function() {
  this._compositeNode.inputs.bloom = "bloom_composite";
  this._compositor.dirty();
};
EffectCompositor.prototype.disableBloom = function() {
  this._compositeNode.inputs.bloom = null;
  this._compositor.dirty();
};
EffectCompositor.prototype.enableDOF = function() {
  this._compositeNode.inputs.texture = "dof_composite";
  this._compositor.dirty();
};
EffectCompositor.prototype.disableDOF = function() {
  this._compositeNode.inputs.texture = "source";
  this._compositor.dirty();
};
EffectCompositor.prototype.enableColorCorrection = function() {
  this._compositeNode.define("COLOR_CORRECTION");
  this._enableColorCorrection = true;
};
EffectCompositor.prototype.disableColorCorrection = function() {
  this._compositeNode.undefine("COLOR_CORRECTION");
  this._enableColorCorrection = false;
};
EffectCompositor.prototype.enableEdge = function() {
  this._enableEdge = true;
};
EffectCompositor.prototype.disableEdge = function() {
  this._enableEdge = false;
};
EffectCompositor.prototype.setBloomIntensity = function(value) {
  this._compositeNode.setParameter("bloomIntensity", value);
};
EffectCompositor.prototype.setSSAOParameter = function(name, value) {
  switch (name) {
    case "quality":
      var kernelSize = {
        low: 6,
        medium: 12,
        high: 32,
        ultra: 62
      }[value] || 12;
      this._ssaoPass.setParameter("kernelSize", kernelSize);
      break;
    case "radius":
      this._ssaoPass.setParameter(name, value);
      this._ssaoPass.setParameter("bias", value / 200);
      break;
    case "intensity":
      this._ssaoPass.setParameter(name, value);
      break;
  }
};
EffectCompositor.prototype.setDOFParameter = function(name, value) {
  switch (name) {
    case "focalDistance":
    case "focalRange":
    case "fstop":
      this._cocNode.setParameter(name, value);
      break;
    case "blurRadius":
      for (var i = 0; i < this._dofBlurNodes.length; i++) {
        this._dofBlurNodes[i].setParameter("blurRadius", value);
      }
      break;
    case "quality":
      var kernelSize = {
        low: 4,
        medium: 8,
        high: 16,
        ultra: 32
      }[value] || 8;
      this._dofBlurKernelSize = kernelSize;
      for (var i = 0; i < this._dofBlurNodes.length; i++) {
        this._dofBlurNodes[i].pass.material.define("POISSON_KERNEL_SIZE", kernelSize);
      }
      this._dofBlurKernel = new Float32Array(kernelSize * 2);
      break;
  }
};
EffectCompositor.prototype.setSSRParameter = function(name, value) {
  if (value == null) {
    return;
  }
  switch (name) {
    case "quality":
      var maxIteration = {
        low: 10,
        medium: 15,
        high: 30,
        ultra: 80
      }[value] || 20;
      var pixelStride = {
        low: 32,
        medium: 16,
        high: 8,
        ultra: 4
      }[value] || 16;
      this._ssrPass.setParameter("maxIteration", maxIteration);
      this._ssrPass.setParameter("pixelStride", pixelStride);
      break;
    case "maxRoughness":
      this._ssrPass.setParameter("minGlossiness", Math.max(Math.min(1 - value, 1), 0));
      break;
    case "physical":
      this.setPhysicallyCorrectSSR(value);
      break;
    default:
      console.warn("Unkown SSR parameter " + name);
  }
};
EffectCompositor.prototype.setPhysicallyCorrectSSR = function(physical) {
  this._ssrPass.setPhysicallyCorrect(physical);
};
EffectCompositor.prototype.setEdgeColor = function(value) {
  var color = graphicGL$1.parseColor(value);
  this._edgePass.setParameter("edgeColor", color);
};
EffectCompositor.prototype.setExposure = function(value) {
  this._compositeNode.setParameter("exposure", Math.pow(2, value));
};
EffectCompositor.prototype.setColorLookupTexture = function(image, api) {
  this._compositeNode.pass.material.setTextureImage("lut", this._enableColorCorrection ? image : "none", api, {
    minFilter: graphicGL$1.Texture.NEAREST,
    magFilter: graphicGL$1.Texture.NEAREST,
    flipY: false
  });
};
EffectCompositor.prototype.setColorCorrection = function(type, value) {
  this._compositeNode.setParameter(type, value);
};
EffectCompositor.prototype.isSSREnabled = function() {
  return this._enableSSR;
};
EffectCompositor.prototype.composite = function(renderer, scene, camera2, framebuffer, frame) {
  var sourceTexture = this._sourceTexture;
  var targetTexture = sourceTexture;
  if (this._enableEdge) {
    this._edgePass.update(renderer, camera2, sourceTexture, frame);
    sourceTexture = targetTexture = this._edgePass.getTargetTexture();
  }
  if (this._enableSSR) {
    this._ssrPass.update(renderer, camera2, sourceTexture, frame);
    targetTexture = this._ssrPass.getTargetTexture();
    this._ssrPass.setSSAOTexture(this._enableSSAO ? this._ssaoPass.getTargetTexture() : null);
  }
  this._sourceNode.texture = targetTexture;
  this._cocNode.setParameter("depth", this._depthTexture);
  var blurKernel = this._dofBlurKernel;
  var blurKernelSize = this._dofBlurKernelSize;
  var frameAll = Math.floor(poissonKernel.length / 2 / blurKernelSize);
  var kernelOffset = frame % frameAll;
  for (var i = 0; i < blurKernelSize * 2; i++) {
    blurKernel[i] = poissonKernel[i + kernelOffset * blurKernelSize * 2];
  }
  for (var i = 0; i < this._dofBlurNodes.length; i++) {
    this._dofBlurNodes[i].setParameter("percent", frame / 30);
    this._dofBlurNodes[i].setParameter("poissonKernel", blurKernel);
  }
  this._cocNode.setParameter("zNear", camera2.near);
  this._cocNode.setParameter("zFar", camera2.far);
  this._compositor.render(renderer, framebuffer);
};
EffectCompositor.prototype.dispose = function(renderer) {
  this._sourceTexture.dispose(renderer);
  this._depthTexture.dispose(renderer);
  this._framebuffer.dispose(renderer);
  this._compositor.dispose(renderer);
  this._normalPass.dispose(renderer);
  this._ssaoPass.dispose(renderer);
};
function TemporalSuperSampling(frames) {
  var haltonSequence = [];
  for (var i = 0; i < 30; i++) {
    haltonSequence.push([halton(i, 2), halton(i, 3)]);
  }
  this._haltonSequence = haltonSequence;
  this._frame = 0;
  this._sourceTex = new Texture2D$1();
  this._sourceFb = new FrameBuffer$1();
  this._sourceFb.attach(this._sourceTex);
  this._prevFrameTex = new Texture2D$1();
  this._outputTex = new Texture2D$1();
  var blendPass = this._blendPass = new Pass$1({
    fragment: Shader.source("clay.compositor.blend")
  });
  blendPass.material.disableTexturesAll();
  blendPass.material.enableTexture(["texture1", "texture2"]);
  this._blendFb = new FrameBuffer$1({
    depthBuffer: false
  });
  this._outputPass = new Pass$1({
    fragment: Shader.source("clay.compositor.output"),
    blendWithPrevious: true
  });
  this._outputPass.material.define("fragment", "OUTPUT_ALPHA");
  this._outputPass.material.blend = function(_gl) {
    _gl.blendEquationSeparate(_gl.FUNC_ADD, _gl.FUNC_ADD);
    _gl.blendFuncSeparate(_gl.ONE, _gl.ONE_MINUS_SRC_ALPHA, _gl.ONE, _gl.ONE_MINUS_SRC_ALPHA);
  };
}
TemporalSuperSampling.prototype = {
  constructor: TemporalSuperSampling,
  jitterProjection: function(renderer, camera2) {
    var viewport = renderer.viewport;
    var dpr = viewport.devicePixelRatio || renderer.getDevicePixelRatio();
    var width = viewport.width * dpr;
    var height = viewport.height * dpr;
    var offset = this._haltonSequence[this._frame % this._haltonSequence.length];
    var translationMat = new Matrix4$1();
    translationMat.array[12] = (offset[0] * 2 - 1) / width;
    translationMat.array[13] = (offset[1] * 2 - 1) / height;
    Matrix4$1.mul(camera2.projectionMatrix, translationMat, camera2.projectionMatrix);
    Matrix4$1.invert(camera2.invProjectionMatrix, camera2.projectionMatrix);
  },
  resetFrame: function() {
    this._frame = 0;
  },
  getFrame: function() {
    return this._frame;
  },
  getSourceFrameBuffer: function() {
    return this._sourceFb;
  },
  getOutputTexture: function() {
    return this._outputTex;
  },
  resize: function(width, height) {
    this._prevFrameTex.width = width;
    this._prevFrameTex.height = height;
    this._outputTex.width = width;
    this._outputTex.height = height;
    this._sourceTex.width = width;
    this._sourceTex.height = height;
    this._prevFrameTex.dirty();
    this._outputTex.dirty();
    this._sourceTex.dirty();
  },
  isFinished: function() {
    return this._frame >= this._haltonSequence.length;
  },
  render: function(renderer, sourceTex, notOutput) {
    var blendPass = this._blendPass;
    if (this._frame === 0) {
      blendPass.setUniform("weight1", 0);
      blendPass.setUniform("weight2", 1);
    } else {
      blendPass.setUniform("weight1", 0.9);
      blendPass.setUniform("weight2", 0.1);
    }
    blendPass.setUniform("texture1", this._prevFrameTex);
    blendPass.setUniform("texture2", sourceTex || this._sourceTex);
    this._blendFb.attach(this._outputTex);
    this._blendFb.bind(renderer);
    blendPass.render(renderer);
    this._blendFb.unbind(renderer);
    if (!notOutput) {
      this._outputPass.setUniform("texture", this._outputTex);
      this._outputPass.render(renderer);
    }
    var tmp = this._prevFrameTex;
    this._prevFrameTex = this._outputTex;
    this._outputTex = tmp;
    this._frame++;
  },
  dispose: function(renderer) {
    this._sourceFb.dispose(renderer);
    this._blendFb.dispose(renderer);
    this._prevFrameTex.dispose(renderer);
    this._outputTex.dispose(renderer);
    this._sourceTex.dispose(renderer);
    this._outputPass.dispose(renderer);
    this._blendPass.dispose(renderer);
  }
};
function ViewGL(projection) {
  projection = projection || "perspective";
  this.layer = null;
  this.scene = new Scene$1();
  this.rootNode = this.scene;
  this.viewport = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  this.setProjection(projection);
  this._compositor = new EffectCompositor();
  this._temporalSS = new TemporalSuperSampling();
  this._shadowMapPass = new ShadowMapPass$1();
  var pcfKernels = [];
  var off = 0;
  for (var i = 0; i < 30; i++) {
    var pcfKernel = [];
    for (var k = 0; k < 6; k++) {
      pcfKernel.push(halton(off, 2) * 4 - 2);
      pcfKernel.push(halton(off, 3) * 4 - 2);
      off++;
    }
    pcfKernels.push(pcfKernel);
  }
  this._pcfKernels = pcfKernels;
  this.scene.on("beforerender", function(renderer, scene, camera2) {
    if (this.needsTemporalSS()) {
      this._temporalSS.jitterProjection(renderer, camera2);
    }
  }, this);
}
ViewGL.prototype.setProjection = function(projection) {
  var oldCamera = this.camera;
  oldCamera && oldCamera.update();
  if (projection === "perspective") {
    if (!(this.camera instanceof PerspectiveCamera)) {
      this.camera = new PerspectiveCamera();
      if (oldCamera) {
        this.camera.setLocalTransform(oldCamera.localTransform);
      }
    }
  } else {
    if (!(this.camera instanceof OrthoCamera)) {
      this.camera = new OrthoCamera();
      if (oldCamera) {
        this.camera.setLocalTransform(oldCamera.localTransform);
      }
    }
  }
  this.camera.near = 0.1;
  this.camera.far = 2e3;
};
ViewGL.prototype.setViewport = function(x, y, width, height, dpr) {
  if (this.camera instanceof PerspectiveCamera) {
    this.camera.aspect = width / height;
  }
  dpr = dpr || 1;
  this.viewport.x = x;
  this.viewport.y = y;
  this.viewport.width = width;
  this.viewport.height = height;
  this.viewport.devicePixelRatio = dpr;
  this._compositor.resize(width * dpr, height * dpr);
  this._temporalSS.resize(width * dpr, height * dpr);
};
ViewGL.prototype.containPoint = function(x, y) {
  var viewport = this.viewport;
  var height = this.layer.renderer.getHeight();
  y = height - y;
  return x >= viewport.x && y >= viewport.y && x <= viewport.x + viewport.width && y <= viewport.y + viewport.height;
};
var ndc = new Vector2$1();
ViewGL.prototype.castRay = function(x, y, out) {
  var renderer = this.layer.renderer;
  var oldViewport = renderer.viewport;
  renderer.viewport = this.viewport;
  renderer.screenToNDC(x, y, ndc);
  this.camera.castRay(ndc, out);
  renderer.viewport = oldViewport;
  return out;
};
ViewGL.prototype.prepareRender = function() {
  this.scene.update();
  this.camera.update();
  this.scene.updateLights();
  var renderList = this.scene.updateRenderList(this.camera);
  this._needsSortProgressively = false;
  for (var i = 0; i < renderList.transparent.length; i++) {
    var renderable = renderList.transparent[i];
    var geometry = renderable.geometry;
    if (geometry.needsSortVerticesProgressively && geometry.needsSortVerticesProgressively()) {
      this._needsSortProgressively = true;
    }
    if (geometry.needsSortTrianglesProgressively && geometry.needsSortTrianglesProgressively()) {
      this._needsSortProgressively = true;
    }
  }
  this._frame = 0;
  this._temporalSS.resetFrame();
};
ViewGL.prototype.render = function(renderer, accumulating) {
  this._doRender(renderer, accumulating, this._frame);
  this._frame++;
};
ViewGL.prototype.needsAccumulate = function() {
  return this.needsTemporalSS() || this._needsSortProgressively;
};
ViewGL.prototype.needsTemporalSS = function() {
  var enableTemporalSS = this._enableTemporalSS;
  if (enableTemporalSS === "auto") {
    enableTemporalSS = this._enablePostEffect;
  }
  return enableTemporalSS;
};
ViewGL.prototype.hasDOF = function() {
  return this._enableDOF;
};
ViewGL.prototype.isAccumulateFinished = function() {
  return this.needsTemporalSS() ? this._temporalSS.isFinished() : this._frame > 30;
};
ViewGL.prototype._doRender = function(renderer, accumulating, accumFrame) {
  var scene = this.scene;
  var camera2 = this.camera;
  accumFrame = accumFrame || 0;
  this._updateTransparent(renderer, scene, camera2, accumFrame);
  if (!accumulating) {
    this._shadowMapPass.kernelPCF = this._pcfKernels[0];
    this._shadowMapPass.render(renderer, scene, camera2, true);
  }
  this._updateShadowPCFKernel(accumFrame);
  var bgColor = renderer.clearColor;
  renderer.gl.clearColor(bgColor[0], bgColor[1], bgColor[2], bgColor[3]);
  if (this._enablePostEffect) {
    if (this.needsTemporalSS()) {
      this._temporalSS.jitterProjection(renderer, camera2);
    }
    this._compositor.updateNormal(renderer, scene, camera2, this._temporalSS.getFrame());
  }
  this._updateSSAO(renderer, scene, camera2, this._temporalSS.getFrame());
  if (this._enablePostEffect) {
    var frameBuffer = this._compositor.getSourceFrameBuffer();
    frameBuffer.bind(renderer);
    renderer.gl.clear(renderer.gl.DEPTH_BUFFER_BIT | renderer.gl.COLOR_BUFFER_BIT);
    renderer.render(scene, camera2, true, true);
    frameBuffer.unbind(renderer);
    if (this.needsTemporalSS() && accumulating) {
      this._compositor.composite(renderer, scene, camera2, this._temporalSS.getSourceFrameBuffer(), this._temporalSS.getFrame());
      renderer.setViewport(this.viewport);
      this._temporalSS.render(renderer);
    } else {
      renderer.setViewport(this.viewport);
      this._compositor.composite(renderer, scene, camera2, null, 0);
    }
  } else {
    if (this.needsTemporalSS() && accumulating) {
      var frameBuffer = this._temporalSS.getSourceFrameBuffer();
      frameBuffer.bind(renderer);
      renderer.saveClear();
      renderer.clearBit = renderer.gl.DEPTH_BUFFER_BIT | renderer.gl.COLOR_BUFFER_BIT;
      renderer.render(scene, camera2, true, true);
      renderer.restoreClear();
      frameBuffer.unbind(renderer);
      renderer.setViewport(this.viewport);
      this._temporalSS.render(renderer);
    } else {
      renderer.setViewport(this.viewport);
      renderer.render(scene, camera2, true, true);
    }
  }
};
ViewGL.prototype._updateTransparent = function(renderer, scene, camera2, frame) {
  var v3 = new Vector3$1();
  var invWorldTransform = new Matrix4$1();
  var cameraWorldPosition = camera2.getWorldPosition();
  var transparentList = scene.getRenderList(camera2).transparent;
  for (var i = 0; i < transparentList.length; i++) {
    var renderable = transparentList[i];
    var geometry = renderable.geometry;
    Matrix4$1.invert(invWorldTransform, renderable.worldTransform);
    Vector3$1.transformMat4(v3, cameraWorldPosition, invWorldTransform);
    if (geometry.needsSortTriangles && geometry.needsSortTriangles()) {
      geometry.doSortTriangles(v3, frame);
    }
    if (geometry.needsSortVertices && geometry.needsSortVertices()) {
      geometry.doSortVertices(v3, frame);
    }
  }
};
ViewGL.prototype._updateSSAO = function(renderer, scene, camera2) {
  var ifEnableSSAO = this._enableSSAO && this._enablePostEffect;
  if (ifEnableSSAO) {
    this._compositor.updateSSAO(renderer, scene, camera2, this._temporalSS.getFrame());
  }
  var renderList = scene.getRenderList(camera2);
  for (var i = 0; i < renderList.opaque.length; i++) {
    var renderable = renderList.opaque[i];
    if (renderable.renderNormal) {
      renderable.material[ifEnableSSAO ? "enableTexture" : "disableTexture"]("ssaoMap");
    }
    if (ifEnableSSAO) {
      renderable.material.set("ssaoMap", this._compositor.getSSAOTexture());
    }
  }
};
ViewGL.prototype._updateShadowPCFKernel = function(frame) {
  var pcfKernel = this._pcfKernels[frame % this._pcfKernels.length];
  var renderList = this.scene.getRenderList(this.camera);
  var opaqueList = renderList.opaque;
  for (var i = 0; i < opaqueList.length; i++) {
    if (opaqueList[i].receiveShadow) {
      opaqueList[i].material.set("pcfKernel", pcfKernel);
      opaqueList[i].material.define("fragment", "PCF_KERNEL_SIZE", pcfKernel.length / 2);
    }
  }
};
ViewGL.prototype.dispose = function(renderer) {
  this._compositor.dispose(renderer.gl);
  this._temporalSS.dispose(renderer.gl);
  this._shadowMapPass.dispose(renderer);
};
ViewGL.prototype.setPostEffect = function(postEffectModel, api) {
  var compositor = this._compositor;
  this._enablePostEffect = postEffectModel.get("enable");
  var bloomModel = postEffectModel.getModel("bloom");
  var edgeModel = postEffectModel.getModel("edge");
  var dofModel = postEffectModel.getModel("DOF", postEffectModel.getModel("depthOfField"));
  var ssaoModel = postEffectModel.getModel("SSAO", postEffectModel.getModel("screenSpaceAmbientOcclusion"));
  var ssrModel = postEffectModel.getModel("SSR", postEffectModel.getModel("screenSpaceReflection"));
  var fxaaModel = postEffectModel.getModel("FXAA");
  var colorCorrModel = postEffectModel.getModel("colorCorrection");
  bloomModel.get("enable") ? compositor.enableBloom() : compositor.disableBloom();
  dofModel.get("enable") ? compositor.enableDOF() : compositor.disableDOF();
  ssrModel.get("enable") ? compositor.enableSSR() : compositor.disableSSR();
  colorCorrModel.get("enable") ? compositor.enableColorCorrection() : compositor.disableColorCorrection();
  edgeModel.get("enable") ? compositor.enableEdge() : compositor.disableEdge();
  fxaaModel.get("enable") ? compositor.enableFXAA() : compositor.disableFXAA();
  this._enableDOF = dofModel.get("enable");
  this._enableSSAO = ssaoModel.get("enable");
  this._enableSSAO ? compositor.enableSSAO() : compositor.disableSSAO();
  compositor.setBloomIntensity(bloomModel.get("intensity"));
  compositor.setEdgeColor(edgeModel.get("color"));
  compositor.setColorLookupTexture(colorCorrModel.get("lookupTexture"), api);
  compositor.setExposure(colorCorrModel.get("exposure"));
  ["radius", "quality", "intensity"].forEach(function(name) {
    compositor.setSSAOParameter(name, ssaoModel.get(name));
  });
  ["quality", "maxRoughness", "physical"].forEach(function(name) {
    compositor.setSSRParameter(name, ssrModel.get(name));
  });
  ["quality", "focalDistance", "focalRange", "blurRadius", "fstop"].forEach(function(name) {
    compositor.setDOFParameter(name, dofModel.get(name));
  });
  ["brightness", "contrast", "saturation"].forEach(function(name) {
    compositor.setColorCorrection(name, colorCorrModel.get(name));
  });
};
ViewGL.prototype.setDOFFocusOnPoint = function(depth) {
  if (this._enablePostEffect) {
    if (depth > this.camera.far || depth < this.camera.near) {
      return;
    }
    this._compositor.setDOFParameter("focalDistance", depth);
    return true;
  }
};
ViewGL.prototype.setTemporalSuperSampling = function(temporalSuperSamplingModel) {
  this._enableTemporalSS = temporalSuperSamplingModel.get("enable");
};
ViewGL.prototype.isLinearSpace = function() {
  return this._enablePostEffect;
};
ViewGL.prototype.setRootNode = function(rootNode) {
  if (this.rootNode === rootNode) {
    return;
  }
  var children = this.rootNode.children();
  for (var i = 0; i < children.length; i++) {
    rootNode.add(children[i]);
  }
  if (rootNode !== this.scene) {
    this.scene.add(rootNode);
  }
  this.rootNode = rootNode;
};
ViewGL.prototype.add = function(node3D) {
  this.rootNode.add(node3D);
};
ViewGL.prototype.remove = function(node3D) {
  this.rootNode.remove(node3D);
};
ViewGL.prototype.removeAll = function(node3D) {
  this.rootNode.removeAll(node3D);
};
Object.assign(ViewGL.prototype, notifier$1);
function resizeGeo3D(geo3DModel, api) {
  var boxLayoutOption = geo3DModel.getBoxLayoutParams();
  var viewport = getLayoutRect(boxLayoutOption, {
    width: api.getWidth(),
    height: api.getHeight()
  });
  viewport.y = api.getHeight() - viewport.y - viewport.height;
  this.viewGL.setViewport(viewport.x, viewport.y, viewport.width, viewport.height, api.getDevicePixelRatio());
  var geoRect = this.getGeoBoundingRect();
  var aspect = geoRect.width / geoRect.height * (geo3DModel.get("aspectScale") || 0.75);
  var width = geo3DModel.get("boxWidth");
  var depth = geo3DModel.get("boxDepth");
  var height = geo3DModel.get("boxHeight");
  if (height == null) {
    height = 5;
  }
  if (isNaN(width) && isNaN(depth)) {
    width = 100;
  }
  if (isNaN(depth)) {
    depth = width / aspect;
  } else if (isNaN(width)) {
    width = depth / aspect;
  }
  this.setSize(width, height, depth);
  this.regionHeight = geo3DModel.get("regionHeight");
  if (this.altitudeAxis) {
    this.altitudeAxis.setExtent(0, Math.max(height - this.regionHeight, 0));
  }
}
function updateGeo3D(ecModel, api) {
  var altitudeDataExtent = [Infinity, -Infinity];
  ecModel.eachSeries(function(seriesModel) {
    if (seriesModel.coordinateSystem !== this) {
      return;
    }
    if (seriesModel.type === "series.map3D") {
      return;
    }
    var data = seriesModel.getData();
    var altDims = seriesModel.coordDimToDataDim("alt");
    var altDim = altDims && altDims[0];
    if (altDim) {
      var dataExtent = data.getDataExtent(altDim, true);
      altitudeDataExtent[0] = Math.min(altitudeDataExtent[0], dataExtent[0]);
      altitudeDataExtent[1] = Math.max(altitudeDataExtent[1], dataExtent[1]);
    }
  }, this);
  if (altitudeDataExtent && isFinite(altitudeDataExtent[1] - altitudeDataExtent[0])) {
    var scale2 = createScale(altitudeDataExtent, {
      type: "value",
      min: "dataMin",
      max: "dataMax"
    });
    this.altitudeAxis = new Axis$1("altitude", scale2);
    this.resize(this.model, api);
  }
}
var idStart = 0;
var geo3DCreator = {
  dimensions: Geo3D.prototype.dimensions,
  create: function(ecModel, api) {
    var geo3DList = [];
    if (!getMap) {
      throw new Error("geo3D component depends on geo component");
    }
    function createGeo3D(componentModel, idx) {
      var geo3D = geo3DCreator.createGeo3D(componentModel);
      componentModel.__viewGL = componentModel.__viewGL || new ViewGL();
      geo3D.viewGL = componentModel.__viewGL;
      componentModel.coordinateSystem = geo3D;
      geo3D.model = componentModel;
      geo3DList.push(geo3D);
      geo3D.resize = resizeGeo3D;
      geo3D.resize(componentModel, api);
      geo3D.update = updateGeo3D;
    }
    ecModel.eachComponent("geo3D", function(geo3DModel, idx) {
      createGeo3D(geo3DModel);
    });
    ecModel.eachSeriesByType("map3D", function(map3DModel, idx) {
      var coordSys = map3DModel.get("coordinateSystem");
      if (coordSys == null) {
        coordSys = "geo3D";
      }
      if (coordSys === "geo3D") {
        createGeo3D(map3DModel);
      }
    });
    ecModel.eachSeries(function(seriesModel) {
      if (seriesModel.get("coordinateSystem") === "geo3D") {
        if (seriesModel.type === "series.map3D") {
          return;
        }
        var geo3DModel = seriesModel.getReferringComponents("geo3D").models[0];
        if (!geo3DModel) {
          geo3DModel = ecModel.getComponent("geo3D");
        }
        if (!geo3DModel) {
          throw new Error('geo "' + retrieve$1.firstNotNull(seriesModel.get("geo3DIndex"), seriesModel.get("geo3DId"), 0) + '" not found');
        }
        seriesModel.coordinateSystem = geo3DModel.coordinateSystem;
      }
    });
    return geo3DList;
  },
  createGeo3D: function(componentModel) {
    var mapData = componentModel.get("map");
    var name;
    if (typeof mapData === "string") {
      name = mapData;
      mapData = getMap(mapData);
    } else {
      if (mapData && mapData.features) {
        mapData = {
          geoJson: mapData
        };
      }
    }
    if (name == null) {
      name = "GEO_ANONYMOUS_" + idStart++;
    }
    return new Geo3D(name + idStart++, name, mapData && mapData.geoJson, mapData && mapData.specialAreas, componentModel.get("nameMap"));
  }
};
var geo3DCreator$1 = geo3DCreator;
var firstNotNull = retrieve$1.firstNotNull;
var MOUSE_BUTTON_KEY_MAP = {
  left: 0,
  middle: 1,
  right: 2
};
function convertToArray(val) {
  if (!(val instanceof Array)) {
    val = [val, val];
  }
  return val;
}
var OrbitControl = Base$1.extend(function() {
  return {
    zr: null,
    viewGL: null,
    _center: new Vector3$1(),
    minDistance: 0.5,
    maxDistance: 1.5,
    maxOrthographicSize: 300,
    minOrthographicSize: 30,
    minAlpha: -90,
    maxAlpha: 90,
    minBeta: -Infinity,
    maxBeta: Infinity,
    autoRotateAfterStill: 0,
    autoRotateDirection: "cw",
    autoRotateSpeed: 60,
    damping: 0.8,
    rotateSensitivity: 1,
    zoomSensitivity: 1,
    panSensitivity: 1,
    panMouseButton: "middle",
    rotateMouseButton: "left",
    _mode: "rotate",
    _camera: null,
    _needsUpdate: false,
    _rotating: false,
    _phi: 0,
    _theta: 0,
    _mouseX: 0,
    _mouseY: 0,
    _rotateVelocity: new Vector2$1(),
    _panVelocity: new Vector2$1(),
    _distance: 500,
    _zoomSpeed: 0,
    _stillTimeout: 0,
    _animators: []
  };
}, function() {
  ["_mouseDownHandler", "_mouseWheelHandler", "_mouseMoveHandler", "_mouseUpHandler", "_pinchHandler", "_contextMenuHandler", "_update"].forEach(function(hdlName) {
    this[hdlName] = this[hdlName].bind(this);
  }, this);
}, {
  init: function() {
    var zr = this.zr;
    if (zr) {
      zr.on("mousedown", this._mouseDownHandler);
      zr.on("globalout", this._mouseUpHandler);
      zr.on("mousewheel", this._mouseWheelHandler);
      zr.on("pinch", this._pinchHandler);
      zr.animation.on("frame", this._update);
      zr.dom.addEventListener("contextmenu", this._contextMenuHandler);
    }
  },
  dispose: function() {
    var zr = this.zr;
    if (zr) {
      zr.off("mousedown", this._mouseDownHandler);
      zr.off("mousemove", this._mouseMoveHandler);
      zr.off("mouseup", this._mouseUpHandler);
      zr.off("mousewheel", this._mouseWheelHandler);
      zr.off("pinch", this._pinchHandler);
      zr.off("globalout", this._mouseUpHandler);
      zr.dom.removeEventListener("contextmenu", this._contextMenuHandler);
      zr.animation.off("frame", this._update);
    }
    this.stopAllAnimation();
  },
  getDistance: function() {
    return this._distance;
  },
  setDistance: function(distance) {
    this._distance = distance;
    this._needsUpdate = true;
  },
  getOrthographicSize: function() {
    return this._orthoSize;
  },
  setOrthographicSize: function(size) {
    this._orthoSize = size;
    this._needsUpdate = true;
  },
  getAlpha: function() {
    return this._theta / Math.PI * 180;
  },
  getBeta: function() {
    return -this._phi / Math.PI * 180;
  },
  getCenter: function() {
    return this._center.toArray();
  },
  setAlpha: function(alpha) {
    alpha = Math.max(Math.min(this.maxAlpha, alpha), this.minAlpha);
    this._theta = alpha / 180 * Math.PI;
    this._needsUpdate = true;
  },
  setBeta: function(beta) {
    beta = Math.max(Math.min(this.maxBeta, beta), this.minBeta);
    this._phi = -beta / 180 * Math.PI;
    this._needsUpdate = true;
  },
  setCenter: function(centerArr) {
    this._center.setArray(centerArr);
  },
  setViewGL: function(viewGL) {
    this.viewGL = viewGL;
  },
  getCamera: function() {
    return this.viewGL.camera;
  },
  setFromViewControlModel: function(viewControlModel, extraOpts) {
    extraOpts = extraOpts || {};
    var baseDistance = extraOpts.baseDistance || 0;
    var baseOrthoSize = extraOpts.baseOrthoSize || 1;
    var projection = viewControlModel.get("projection");
    if (projection !== "perspective" && projection !== "orthographic" && projection !== "isometric") {
      projection = "perspective";
    }
    this._projection = projection;
    this.viewGL.setProjection(projection);
    var targetDistance = viewControlModel.get("distance") + baseDistance;
    var targetOrthographicSize = viewControlModel.get("orthographicSize") + baseOrthoSize;
    [["damping", 0.8], ["autoRotate", false], ["autoRotateAfterStill", 3], ["autoRotateDirection", "cw"], ["autoRotateSpeed", 10], ["minDistance", 30], ["maxDistance", 400], ["minOrthographicSize", 30], ["maxOrthographicSize", 300], ["minAlpha", -90], ["maxAlpha", 90], ["minBeta", -Infinity], ["maxBeta", Infinity], ["rotateSensitivity", 1], ["zoomSensitivity", 1], ["panSensitivity", 1], ["panMouseButton", "left"], ["rotateMouseButton", "middle"]].forEach(function(prop) {
      this[prop[0]] = firstNotNull(viewControlModel.get(prop[0]), prop[1]);
    }, this);
    this.minDistance += baseDistance;
    this.maxDistance += baseDistance;
    this.minOrthographicSize += baseOrthoSize, this.maxOrthographicSize += baseOrthoSize;
    var ecModel = viewControlModel.ecModel;
    var animationOpts = {};
    ["animation", "animationDurationUpdate", "animationEasingUpdate"].forEach(function(key) {
      animationOpts[key] = firstNotNull(viewControlModel.get(key), ecModel && ecModel.get(key));
    });
    var alpha = firstNotNull(extraOpts.alpha, viewControlModel.get("alpha")) || 0;
    var beta = firstNotNull(extraOpts.beta, viewControlModel.get("beta")) || 0;
    var center = firstNotNull(extraOpts.center, viewControlModel.get("center")) || [0, 0, 0];
    if (animationOpts.animation && animationOpts.animationDurationUpdate > 0 && this._notFirst) {
      this.animateTo({
        alpha,
        beta,
        center,
        distance: targetDistance,
        orthographicSize: targetOrthographicSize,
        easing: animationOpts.animationEasingUpdate,
        duration: animationOpts.animationDurationUpdate
      });
    } else {
      this.setDistance(targetDistance);
      this.setAlpha(alpha);
      this.setBeta(beta);
      this.setCenter(center);
      this.setOrthographicSize(targetOrthographicSize);
    }
    this._notFirst = true;
    this._validateProperties();
  },
  _validateProperties: function() {
  },
  animateTo: function(opts) {
    var zr = this.zr;
    var self = this;
    var obj = {};
    var target = {};
    if (opts.distance != null) {
      obj.distance = this.getDistance();
      target.distance = opts.distance;
    }
    if (opts.orthographicSize != null) {
      obj.orthographicSize = this.getOrthographicSize();
      target.orthographicSize = opts.orthographicSize;
    }
    if (opts.alpha != null) {
      obj.alpha = this.getAlpha();
      target.alpha = opts.alpha;
    }
    if (opts.beta != null) {
      obj.beta = this.getBeta();
      target.beta = opts.beta;
    }
    if (opts.center != null) {
      obj.center = this.getCenter();
      target.center = opts.center;
    }
    return this._addAnimator(zr.animation.animate(obj).when(opts.duration || 1e3, target).during(function() {
      if (obj.alpha != null) {
        self.setAlpha(obj.alpha);
      }
      if (obj.beta != null) {
        self.setBeta(obj.beta);
      }
      if (obj.distance != null) {
        self.setDistance(obj.distance);
      }
      if (obj.center != null) {
        self.setCenter(obj.center);
      }
      if (obj.orthographicSize != null) {
        self.setOrthographicSize(obj.orthographicSize);
      }
      self._needsUpdate = true;
    })).start(opts.easing || "linear");
  },
  stopAllAnimation: function() {
    for (var i = 0; i < this._animators.length; i++) {
      this._animators[i].stop();
    }
    this._animators.length = 0;
  },
  update: function() {
    this._needsUpdate = true;
    this._update(20);
  },
  _isAnimating: function() {
    return this._animators.length > 0;
  },
  _update: function(deltaTime) {
    if (this._rotating) {
      var radian = (this.autoRotateDirection === "cw" ? 1 : -1) * this.autoRotateSpeed / 180 * Math.PI;
      this._phi -= radian * deltaTime / 1e3;
      this._needsUpdate = true;
    } else if (this._rotateVelocity.len() > 0) {
      this._needsUpdate = true;
    }
    if (Math.abs(this._zoomSpeed) > 0.1 || this._panVelocity.len() > 0) {
      this._needsUpdate = true;
    }
    if (!this._needsUpdate) {
      return;
    }
    deltaTime = Math.min(deltaTime, 50);
    this._updateDistanceOrSize(deltaTime);
    this._updatePan(deltaTime);
    this._updateRotate(deltaTime);
    this._updateTransform();
    this.getCamera().update();
    this.zr && this.zr.refresh();
    this.trigger("update");
    this._needsUpdate = false;
  },
  _updateRotate: function(deltaTime) {
    var velocity = this._rotateVelocity;
    this._phi = velocity.y * deltaTime / 20 + this._phi;
    this._theta = velocity.x * deltaTime / 20 + this._theta;
    this.setAlpha(this.getAlpha());
    this.setBeta(this.getBeta());
    this._vectorDamping(velocity, Math.pow(this.damping, deltaTime / 16));
  },
  _updateDistanceOrSize: function(deltaTime) {
    if (this._projection === "perspective") {
      this._setDistance(this._distance + this._zoomSpeed * deltaTime / 20);
    } else {
      this._setOrthoSize(this._orthoSize + this._zoomSpeed * deltaTime / 20);
    }
    this._zoomSpeed *= Math.pow(this.damping, deltaTime / 16);
  },
  _setDistance: function(distance) {
    this._distance = Math.max(Math.min(distance, this.maxDistance), this.minDistance);
  },
  _setOrthoSize: function(size) {
    this._orthoSize = Math.max(Math.min(size, this.maxOrthographicSize), this.minOrthographicSize);
    var camera2 = this.getCamera();
    var cameraHeight = this._orthoSize;
    var cameraWidth = cameraHeight / this.viewGL.viewport.height * this.viewGL.viewport.width;
    camera2.left = -cameraWidth / 2;
    camera2.right = cameraWidth / 2;
    camera2.top = cameraHeight / 2;
    camera2.bottom = -cameraHeight / 2;
  },
  _updatePan: function(deltaTime) {
    var velocity = this._panVelocity;
    var len = this._distance;
    var target = this.getCamera();
    var yAxis = target.worldTransform.y;
    var xAxis = target.worldTransform.x;
    this._center.scaleAndAdd(xAxis, -velocity.x * len / 200).scaleAndAdd(yAxis, -velocity.y * len / 200);
    this._vectorDamping(velocity, 0);
  },
  _updateTransform: function() {
    var camera2 = this.getCamera();
    var dir3 = new Vector3$1();
    var theta = this._theta + Math.PI / 2;
    var phi = this._phi + Math.PI / 2;
    var r = Math.sin(theta);
    dir3.x = r * Math.cos(phi);
    dir3.y = -Math.cos(theta);
    dir3.z = r * Math.sin(phi);
    camera2.position.copy(this._center).scaleAndAdd(dir3, this._distance);
    camera2.rotation.identity().rotateY(-this._phi).rotateX(-this._theta);
  },
  _startCountingStill: function() {
    clearTimeout(this._stillTimeout);
    var time = this.autoRotateAfterStill;
    var self = this;
    if (!isNaN(time) && time > 0) {
      this._stillTimeout = setTimeout(function() {
        self._rotating = true;
      }, time * 1e3);
    }
  },
  _vectorDamping: function(v, damping) {
    var speed = v.len();
    speed = speed * damping;
    if (speed < 1e-4) {
      speed = 0;
    }
    v.normalize().scale(speed);
  },
  _decomposeTransform: function() {
    if (!this.getCamera()) {
      return;
    }
    this.getCamera().updateWorldTransform();
    var forward = this.getCamera().worldTransform.z;
    var alpha = Math.asin(forward.y);
    var beta = Math.atan2(forward.x, forward.z);
    this._theta = alpha;
    this._phi = -beta;
    this.setBeta(this.getBeta());
    this.setAlpha(this.getAlpha());
    if (this.getCamera().aspect) {
      this._setDistance(this.getCamera().position.dist(this._center));
    } else {
      this._setOrthoSize(this.getCamera().top - this.getCamera().bottom);
    }
  },
  _mouseDownHandler: function(e2) {
    if (e2.target) {
      return;
    }
    if (this._isAnimating()) {
      return;
    }
    var x = e2.offsetX;
    var y = e2.offsetY;
    if (this.viewGL && !this.viewGL.containPoint(x, y)) {
      return;
    }
    this.zr.on("mousemove", this._mouseMoveHandler);
    this.zr.on("mouseup", this._mouseUpHandler);
    if (e2.event.targetTouches) {
      if (e2.event.targetTouches.length === 1) {
        this._mode = "rotate";
      }
    } else {
      if (e2.event.button === MOUSE_BUTTON_KEY_MAP[this.rotateMouseButton]) {
        this._mode = "rotate";
      } else if (e2.event.button === MOUSE_BUTTON_KEY_MAP[this.panMouseButton]) {
        this._mode = "pan";
      } else {
        this._mode = "";
      }
    }
    this._rotateVelocity.set(0, 0);
    this._rotating = false;
    if (this.autoRotate) {
      this._startCountingStill();
    }
    this._mouseX = e2.offsetX;
    this._mouseY = e2.offsetY;
  },
  _mouseMoveHandler: function(e2) {
    if (e2.target && e2.target.__isGLToZRProxy) {
      return;
    }
    if (this._isAnimating()) {
      return;
    }
    var panSensitivity = convertToArray(this.panSensitivity);
    var rotateSensitivity = convertToArray(this.rotateSensitivity);
    if (this._mode === "rotate") {
      this._rotateVelocity.y = (e2.offsetX - this._mouseX) / this.zr.getHeight() * 2 * rotateSensitivity[0];
      this._rotateVelocity.x = (e2.offsetY - this._mouseY) / this.zr.getWidth() * 2 * rotateSensitivity[1];
    } else if (this._mode === "pan") {
      this._panVelocity.x = (e2.offsetX - this._mouseX) / this.zr.getWidth() * panSensitivity[0] * 400;
      this._panVelocity.y = (-e2.offsetY + this._mouseY) / this.zr.getHeight() * panSensitivity[1] * 400;
    }
    this._mouseX = e2.offsetX;
    this._mouseY = e2.offsetY;
    e2.event.preventDefault();
  },
  _mouseWheelHandler: function(e2) {
    if (this._isAnimating()) {
      return;
    }
    var delta = e2.event.wheelDelta || -e2.event.detail;
    this._zoomHandler(e2, delta);
  },
  _pinchHandler: function(e2) {
    if (this._isAnimating()) {
      return;
    }
    this._zoomHandler(e2, e2.pinchScale > 1 ? 1 : -1);
    this._mode = "";
  },
  _zoomHandler: function(e2, delta) {
    if (delta === 0) {
      return;
    }
    var x = e2.offsetX;
    var y = e2.offsetY;
    if (this.viewGL && !this.viewGL.containPoint(x, y)) {
      return;
    }
    var speed;
    if (this._projection === "perspective") {
      speed = Math.max(Math.max(Math.min(this._distance - this.minDistance, this.maxDistance - this._distance)) / 20, 0.5);
    } else {
      speed = Math.max(Math.max(Math.min(this._orthoSize - this.minOrthographicSize, this.maxOrthographicSize - this._orthoSize)) / 20, 0.5);
    }
    this._zoomSpeed = (delta > 0 ? -1 : 1) * speed * this.zoomSensitivity;
    this._rotating = false;
    if (this.autoRotate && this._mode === "rotate") {
      this._startCountingStill();
    }
    e2.event.preventDefault();
  },
  _mouseUpHandler: function() {
    this.zr.off("mousemove", this._mouseMoveHandler);
    this.zr.off("mouseup", this._mouseUpHandler);
  },
  _isRightMouseButtonUsed: function() {
    return this.rotateMouseButton === "right" || this.panMouseButton === "right";
  },
  _contextMenuHandler: function(e2) {
    if (this._isRightMouseButtonUsed()) {
      e2.preventDefault();
    }
  },
  _addAnimator: function(animator) {
    var animators = this._animators;
    animators.push(animator);
    animator.done(function() {
      var idx = animators.indexOf(animator);
      if (idx >= 0) {
        animators.splice(idx, 1);
      }
    });
    return animator;
  }
});
Object.defineProperty(OrbitControl.prototype, "autoRotate", {
  get: function(val) {
    return this._autoRotate;
  },
  set: function(val) {
    this._autoRotate = val;
    this._rotating = val;
  }
});
var OrbitControl$1 = OrbitControl;
function SceneHelper() {
}
SceneHelper.prototype = {
  constructor: SceneHelper,
  setScene: function(scene) {
    this._scene = scene;
    if (this._skybox) {
      this._skybox.attachScene(this._scene);
    }
  },
  initLight: function(rootNode) {
    this._lightRoot = rootNode;
    this.mainLight = new graphicGL$1.DirectionalLight({
      shadowBias: 5e-3
    });
    this.ambientLight = new graphicGL$1.AmbientLight();
    rootNode.add(this.mainLight);
    rootNode.add(this.ambientLight);
  },
  dispose: function() {
    if (this._lightRoot) {
      this._lightRoot.remove(this.mainLight);
      this._lightRoot.remove(this.ambientLight);
    }
  },
  updateLight: function(componentModel) {
    var mainLight = this.mainLight;
    var ambientLight = this.ambientLight;
    var lightModel = componentModel.getModel("light");
    var mainLightModel = lightModel.getModel("main");
    var ambientLightModel = lightModel.getModel("ambient");
    mainLight.intensity = mainLightModel.get("intensity");
    ambientLight.intensity = ambientLightModel.get("intensity");
    mainLight.color = graphicGL$1.parseColor(mainLightModel.get("color")).slice(0, 3);
    ambientLight.color = graphicGL$1.parseColor(ambientLightModel.get("color")).slice(0, 3);
    var alpha = mainLightModel.get("alpha") || 0;
    var beta = mainLightModel.get("beta") || 0;
    mainLight.position.setArray(graphicGL$1.directionFromAlphaBeta(alpha, beta));
    mainLight.lookAt(graphicGL$1.Vector3.ZERO);
    mainLight.castShadow = mainLightModel.get("shadow");
    mainLight.shadowResolution = graphicGL$1.getShadowResolution(mainLightModel.get("shadowQuality"));
  },
  updateAmbientCubemap: function(renderer, componentModel, api) {
    var ambientCubemapModel = componentModel.getModel("light.ambientCubemap");
    var textureUrl = ambientCubemapModel.get("texture");
    if (textureUrl) {
      this._cubemapLightsCache = this._cubemapLightsCache || {};
      var lights = this._cubemapLightsCache[textureUrl];
      if (!lights) {
        var self = this;
        lights = this._cubemapLightsCache[textureUrl] = graphicGL$1.createAmbientCubemap(ambientCubemapModel.option, renderer, api, function() {
          if (self._isSkyboxFromAmbientCubemap) {
            self._skybox.setEnvironmentMap(lights.specular.cubemap);
          }
          api.getZr().refresh();
        });
      }
      this._lightRoot.add(lights.diffuse);
      this._lightRoot.add(lights.specular);
      this._currentCubemapLights = lights;
    } else if (this._currentCubemapLights) {
      this._lightRoot.remove(this._currentCubemapLights.diffuse);
      this._lightRoot.remove(this._currentCubemapLights.specular);
      this._currentCubemapLights = null;
    }
  },
  updateSkybox: function(renderer, componentModel, api) {
    var environmentUrl = componentModel.get("environment");
    var self = this;
    function getSkybox() {
      self._skybox = self._skybox || new Skybox$1();
      return self._skybox;
    }
    var skybox = getSkybox();
    if (environmentUrl && environmentUrl !== "none") {
      if (environmentUrl === "auto") {
        this._isSkyboxFromAmbientCubemap = true;
        if (this._currentCubemapLights) {
          var cubemap = this._currentCubemapLights.specular.cubemap;
          skybox.setEnvironmentMap(cubemap);
          if (this._scene) {
            skybox.attachScene(this._scene);
          }
          skybox.material.set("lod", 3);
        } else if (this._skybox) {
          this._skybox.detachScene();
        }
      } else if (typeof environmentUrl === "object" && environmentUrl.colorStops || typeof environmentUrl === "string" && parse(environmentUrl)) {
        this._isSkyboxFromAmbientCubemap = false;
        var texture = new graphicGL$1.Texture2D({
          anisotropic: 8,
          flipY: false
        });
        skybox.setEnvironmentMap(texture);
        var canvas = texture.image = document.createElement("canvas");
        canvas.width = canvas.height = 16;
        var ctx = canvas.getContext("2d");
        var rect = new Rect({
          shape: {
            x: 0,
            y: 0,
            width: 16,
            height: 16
          },
          style: {
            fill: environmentUrl
          }
        });
        brushSingle(ctx, rect);
        skybox.attachScene(this._scene);
      } else {
        this._isSkyboxFromAmbientCubemap = false;
        var texture = graphicGL$1.loadTexture(environmentUrl, api, {
          anisotropic: 8,
          flipY: false
        });
        skybox.setEnvironmentMap(texture);
        skybox.attachScene(this._scene);
      }
    } else {
      if (this._skybox) {
        this._skybox.detachScene(this._scene);
      }
      this._skybox = null;
    }
    var coordSys = componentModel.coordinateSystem;
    if (this._skybox) {
      if (coordSys && coordSys.viewGL && environmentUrl !== "auto" && !(environmentUrl.match && environmentUrl.match(/.hdr$/))) {
        var srgbDefineMethod = coordSys.viewGL.isLinearSpace() ? "define" : "undefine";
        this._skybox.material[srgbDefineMethod]("fragment", "SRGB_DECODE");
      } else {
        this._skybox.material.undefine("fragment", "SRGB_DECODE");
      }
    }
  }
};
var Geo3DModel = ComponentModel.extend({
  type: "geo3D",
  layoutMode: "box",
  coordinateSystem: null,
  optionUpdated: function() {
    var option = this.option;
    option.regions = this.getFilledRegions(option.regions, option.map);
    var dimensions = createDimensions(option.data || [], {
      coordDimensions: ["value"],
      encodeDefine: this.get("encode"),
      dimensionsDefine: this.get("dimensions")
    });
    var list = new SeriesData$1(dimensions, this);
    list.initData(option.regions);
    var regionModelMap = {};
    list.each(function(idx) {
      var name = list.getName(idx);
      var itemModel = list.getItemModel(idx);
      regionModelMap[name] = itemModel;
    });
    this._regionModelMap = regionModelMap;
    this._data = list;
  },
  getData: function() {
    return this._data;
  },
  getRegionModel: function(idx) {
    var name = this.getData().getName(idx);
    return this._regionModelMap[name] || new Model(null, this);
  },
  getRegionPolygonCoords: function(idx) {
    var name = this.getData().getName(idx);
    var region = this.coordinateSystem.getRegion(name);
    return region ? region.geometries : [];
  },
  getFormattedLabel: function(dataIndex, status) {
    var name = this._data.getName(dataIndex);
    var regionModel = this.getRegionModel(dataIndex);
    var formatter = regionModel.get(status === "normal" ? ["label", "formatter"] : ["emphasis", "label", "formatter"]);
    if (formatter == null) {
      formatter = regionModel.get(["label", "formatter"]);
    }
    var params = {
      name
    };
    if (typeof formatter === "function") {
      params.status = status;
      return formatter(params);
    } else if (typeof formatter === "string") {
      var serName = params.seriesName;
      return formatter.replace("{a}", serName != null ? serName : "");
    } else {
      return name;
    }
  },
  defaultOption: {
    regions: []
  }
});
merge(Geo3DModel.prototype, geo3DModelMixin);
merge(Geo3DModel.prototype, componentViewControlMixin);
merge(Geo3DModel.prototype, componentPostEffectMixin);
merge(Geo3DModel.prototype, componentLightMixin);
merge(Geo3DModel.prototype, componentShadingMixin);
var Geo3DModel$1 = Geo3DModel;
var Geo3DView = ComponentView.extend({
  type: "geo3D",
  __ecgl__: true,
  init: function(ecModel, api) {
    this._geo3DBuilder = new Geo3DBuilder(api);
    this.groupGL = new graphicGL$1.Node();
    this._lightRoot = new graphicGL$1.Node();
    this._sceneHelper = new SceneHelper(this._lightRoot);
    this._sceneHelper.initLight(this._lightRoot);
    this._control = new OrbitControl$1({
      zr: api.getZr()
    });
    this._control.init();
  },
  render: function(geo3DModel, ecModel, api) {
    this.groupGL.add(this._geo3DBuilder.rootNode);
    var geo3D = geo3DModel.coordinateSystem;
    if (!geo3D || !geo3D.viewGL) {
      return;
    }
    geo3D.viewGL.add(this._lightRoot);
    if (geo3DModel.get("show")) {
      geo3D.viewGL.add(this.groupGL);
    } else {
      geo3D.viewGL.remove(this.groupGL);
    }
    var control = this._control;
    control.setViewGL(geo3D.viewGL);
    var viewControlModel = geo3DModel.getModel("viewControl");
    control.setFromViewControlModel(viewControlModel, 0);
    this._sceneHelper.setScene(geo3D.viewGL.scene);
    this._sceneHelper.updateLight(geo3DModel);
    geo3D.viewGL.setPostEffect(geo3DModel.getModel("postEffect"), api);
    geo3D.viewGL.setTemporalSuperSampling(geo3DModel.getModel("temporalSuperSampling"));
    this._geo3DBuilder.update(geo3DModel, ecModel, api, 0, geo3DModel.getData().count());
    var srgbDefineMethod = geo3D.viewGL.isLinearSpace() ? "define" : "undefine";
    this._geo3DBuilder.rootNode.traverse(function(mesh2) {
      if (mesh2.material) {
        mesh2.material[srgbDefineMethod]("fragment", "SRGB_DECODE");
      }
    });
    control.off("update");
    control.on("update", function() {
      api.dispatchAction({
        type: "geo3DChangeCamera",
        alpha: control.getAlpha(),
        beta: control.getBeta(),
        distance: control.getDistance(),
        center: control.getCenter(),
        from: this.uid,
        geo3DId: geo3DModel.id
      });
    });
    control.update();
  },
  afterRender: function(geo3DModel, ecModel, api, layerGL) {
    var renderer = layerGL.renderer;
    this._sceneHelper.updateAmbientCubemap(renderer, geo3DModel, api);
    this._sceneHelper.updateSkybox(renderer, geo3DModel, api);
  },
  dispose: function() {
    this._control.dispose();
    this._geo3DBuilder.dispose();
  }
});
function install$1(registers) {
  registers.registerComponentModel(Geo3DModel$1);
  registers.registerComponentView(Geo3DView);
  registers.registerAction({
    type: "geo3DChangeCamera",
    event: "geo3dcamerachanged",
    update: "series:updateCamera"
  }, function(payload, ecModel) {
    ecModel.eachComponent({
      mainType: "geo3D",
      query: payload
    }, function(componentModel) {
      componentModel.setView(payload);
    });
  });
  registers.registerCoordinateSystem("geo3D", geo3DCreator$1);
}
function defaultId(option, idx) {
  option.id = option.id || option.name || idx + "";
}
var GlobeModel = ComponentModel.extend({
  type: "globe",
  layoutMode: "box",
  coordinateSystem: null,
  init: function() {
    GlobeModel.superApply(this, "init", arguments);
    each(this.option.layers, function(layerOption, idx) {
      merge(layerOption, this.defaultLayerOption);
      defaultId(layerOption, idx);
    }, this);
  },
  mergeOption: function(option) {
    var oldLayers = this.option.layers;
    this.option.layers = null;
    GlobeModel.superApply(this, "mergeOption", arguments);
    function createLayerMap(layers) {
      return reduce(layers, function(obj, layerOption, idx) {
        defaultId(layerOption, idx);
        obj[layerOption.id] = layerOption;
        return obj;
      }, {});
    }
    if (oldLayers && oldLayers.length) {
      var newLayerMap = createLayerMap(option.layers);
      var oldLayerMap = createLayerMap(oldLayers);
      for (var id in newLayerMap) {
        if (oldLayerMap[id]) {
          merge(oldLayerMap[id], newLayerMap[id], true);
        } else {
          oldLayers.push(option.layers[id]);
        }
      }
      this.option.layers = oldLayers;
    }
    each(this.option.layers, function(layerOption) {
      merge(layerOption, this.defaultLayerOption);
    }, this);
  },
  optionUpdated: function() {
    this.updateDisplacementHash();
  },
  defaultLayerOption: {
    show: true,
    type: "overlay"
  },
  defaultOption: {
    show: true,
    zlevel: -10,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    environment: "auto",
    baseColor: "#fff",
    baseTexture: "",
    heightTexture: "",
    displacementTexture: "",
    displacementScale: 0,
    displacementQuality: "medium",
    globeRadius: 100,
    globeOuterRadius: 150,
    shading: "lambert",
    light: {
      main: {
        time: ""
      }
    },
    atmosphere: {
      show: false,
      offset: 5,
      color: "#ffffff",
      glowPower: 6,
      innerGlowPower: 2
    },
    viewControl: {
      autoRotate: true,
      panSensitivity: 0,
      targetCoord: null
    },
    layers: []
  },
  setDisplacementData: function(data, width, height) {
    this.displacementData = data;
    this.displacementWidth = width;
    this.displacementHeight = height;
  },
  getDisplacementTexture: function() {
    return this.get("displacementTexture") || this.get("heightTexture");
  },
  getDisplacemenScale: function() {
    var displacementTexture = this.getDisplacementTexture();
    var displacementScale = this.get("displacementScale");
    if (!displacementTexture || displacementTexture === "none") {
      displacementScale = 0;
    }
    return displacementScale;
  },
  hasDisplacement: function() {
    return this.getDisplacemenScale() > 0;
  },
  _displacementChanged: true,
  _displacementScale: 0,
  updateDisplacementHash: function() {
    var displacementTexture = this.getDisplacementTexture();
    var displacementScale = this.getDisplacemenScale();
    this._displacementChanged = this._displacementTexture !== displacementTexture || this._displacementScale !== displacementScale;
    this._displacementTexture = displacementTexture;
    this._displacementScale = displacementScale;
  },
  isDisplacementChanged: function() {
    return this._displacementChanged;
  }
});
merge(GlobeModel.prototype, componentViewControlMixin);
merge(GlobeModel.prototype, componentPostEffectMixin);
merge(GlobeModel.prototype, componentLightMixin);
merge(GlobeModel.prototype, componentShadingMixin);
var GlobeModel$1 = GlobeModel;
var PI = Math.PI, sin = Math.sin, cos = Math.cos, tan = Math.tan, asin = Math.asin, atan = Math.atan2, rad = PI / 180;
var dayMs = 1e3 * 60 * 60 * 24, J1970 = 2440588, J2000 = 2451545;
function toJulian(date) {
  return date.valueOf() / dayMs - 0.5 + J1970;
}
function toDays(date) {
  return toJulian(date) - J2000;
}
var e = rad * 23.4397;
function rightAscension(l, b) {
  return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l));
}
function declination(l, b) {
  return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));
}
function azimuth(H, phi, dec) {
  return atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi));
}
function altitude(H, phi, dec) {
  return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
}
function siderealTime(d, lw) {
  return rad * (280.16 + 360.9856235 * d) - lw;
}
function solarMeanAnomaly(d) {
  return rad * (357.5291 + 0.98560028 * d);
}
function eclipticLongitude(M) {
  var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 3e-4 * sin(3 * M)), P = rad * 102.9372;
  return M + C + P + PI;
}
function sunCoords(d) {
  var M = solarMeanAnomaly(d), L = eclipticLongitude(M);
  return {
    dec: declination(L, 0),
    ra: rightAscension(L, 0)
  };
}
var SunCalc = {};
SunCalc.getPosition = function(date, lat, lng) {
  var lw = rad * -lng, phi = rad * lat, d = toDays(date), c = sunCoords(d), H = siderealTime(d, lw) - c.ra;
  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: altitude(H, phi, c.dec)
  };
};
var sunCalc = SunCalc;
var atmosphereShaderCode = "@export ecgl.atmosphere.vertex\nattribute vec3 position: POSITION;\nattribute vec3 normal : NORMAL;\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\nuniform mat4 normalMatrix : WORLDINVERSETRANSPOSE;\n\nvarying vec3 v_Normal;\n\nvoid main() {\n v_Normal = normalize((normalMatrix * vec4(normal, 0.0)).xyz);\n gl_Position = worldViewProjection * vec4(position, 1.0);\n}\n@end\n\n\n@export ecgl.atmosphere.fragment\nuniform mat4 viewTranspose: VIEWTRANSPOSE;\nuniform float glowPower;\nuniform vec3 glowColor;\n\nvarying vec3 v_Normal;\n\nvoid main() {\n float intensity = pow(1.0 - dot(v_Normal, (viewTranspose * vec4(0.0, 0.0, 1.0, 0.0)).xyz), glowPower);\n gl_FragColor = vec4(glowColor, intensity * intensity);\n}\n@end";
graphicGL$1.Shader["import"](utilShaderCode);
graphicGL$1.Shader["import"](atmosphereShaderCode);
var GlobeView = ComponentView.extend({
  type: "globe",
  __ecgl__: true,
  _displacementScale: 0,
  init: function(ecModel, api) {
    this.groupGL = new graphicGL$1.Node();
    this._sphereGeometry = new graphicGL$1.SphereGeometry({
      widthSegments: 200,
      heightSegments: 100,
      dynamic: true
    });
    this._overlayGeometry = new graphicGL$1.SphereGeometry({
      widthSegments: 80,
      heightSegments: 40
    });
    this._planeGeometry = new graphicGL$1.PlaneGeometry();
    this._earthMesh = new graphicGL$1.Mesh({
      renderNormal: true
    });
    this._atmosphereMesh = new graphicGL$1.Mesh();
    this._atmosphereGeometry = new graphicGL$1.SphereGeometry({
      widthSegments: 80,
      heightSegments: 40
    });
    this._atmosphereMaterial = new graphicGL$1.Material({
      shader: new graphicGL$1.Shader(graphicGL$1.Shader.source("ecgl.atmosphere.vertex"), graphicGL$1.Shader.source("ecgl.atmosphere.fragment")),
      transparent: true
    });
    this._atmosphereMesh.geometry = this._atmosphereGeometry;
    this._atmosphereMesh.material = this._atmosphereMaterial;
    this._atmosphereMesh.frontFace = graphicGL$1.Mesh.CW;
    this._lightRoot = new graphicGL$1.Node();
    this._sceneHelper = new SceneHelper();
    this._sceneHelper.initLight(this._lightRoot);
    this.groupGL.add(this._atmosphereMesh);
    this.groupGL.add(this._earthMesh);
    this._control = new OrbitControl$1({
      zr: api.getZr()
    });
    this._control.init();
    this._layerMeshes = {};
  },
  render: function(globeModel, ecModel, api) {
    var coordSys = globeModel.coordinateSystem;
    var shading = globeModel.get("shading");
    coordSys.viewGL.add(this._lightRoot);
    if (globeModel.get("show")) {
      coordSys.viewGL.add(this.groupGL);
    } else {
      coordSys.viewGL.remove(this.groupGL);
    }
    this._sceneHelper.setScene(coordSys.viewGL.scene);
    coordSys.viewGL.setPostEffect(globeModel.getModel("postEffect"), api);
    coordSys.viewGL.setTemporalSuperSampling(globeModel.getModel("temporalSuperSampling"));
    var earthMesh = this._earthMesh;
    earthMesh.geometry = this._sphereGeometry;
    var shadingPrefix = "ecgl." + shading;
    if (!earthMesh.material || earthMesh.material.shader.name !== shadingPrefix) {
      earthMesh.material = graphicGL$1.createMaterial(shadingPrefix);
    }
    graphicGL$1.setMaterialFromModel(shading, earthMesh.material, globeModel, api);
    ["roughnessMap", "metalnessMap", "detailMap", "normalMap"].forEach(function(texName) {
      var texture = earthMesh.material.get(texName);
      if (texture) {
        texture.flipY = false;
      }
    });
    earthMesh.material.set("color", graphicGL$1.parseColor(globeModel.get("baseColor")));
    var scale2 = coordSys.radius * 0.99;
    earthMesh.scale.set(scale2, scale2, scale2);
    if (globeModel.get("atmosphere.show")) {
      earthMesh.material.define("both", "ATMOSPHERE_ENABLED");
      this._atmosphereMesh.invisible = false;
      this._atmosphereMaterial.setUniforms({
        glowPower: globeModel.get("atmosphere.glowPower") || 6,
        glowColor: globeModel.get("atmosphere.color") || "#ffffff"
      });
      earthMesh.material.setUniforms({
        glowPower: globeModel.get("atmosphere.innerGlowPower") || 2,
        glowColor: globeModel.get("atmosphere.color") || "#ffffff"
      });
      var offset = globeModel.get("atmosphere.offset") || 5;
      this._atmosphereMesh.scale.set(scale2 + offset, scale2 + offset, scale2 + offset);
    } else {
      earthMesh.material.undefine("both", "ATMOSPHERE_ENABLED");
      this._atmosphereMesh.invisible = true;
    }
    var diffuseTexture = earthMesh.material.setTextureImage("diffuseMap", globeModel.get("baseTexture"), api, {
      flipY: false,
      anisotropic: 8
    });
    if (diffuseTexture && diffuseTexture.surface) {
      diffuseTexture.surface.attachToMesh(earthMesh);
    }
    var bumpTexture = earthMesh.material.setTextureImage("bumpMap", globeModel.get("heightTexture"), api, {
      flipY: false,
      anisotropic: 8
    });
    if (bumpTexture && bumpTexture.surface) {
      bumpTexture.surface.attachToMesh(earthMesh);
    }
    earthMesh.material[globeModel.get("postEffect.enable") ? "define" : "undefine"]("fragment", "SRGB_DECODE");
    this._updateLight(globeModel, api);
    this._displaceVertices(globeModel, api);
    this._updateViewControl(globeModel, api);
    this._updateLayers(globeModel, api);
  },
  afterRender: function(globeModel, ecModel, api, layerGL) {
    var renderer = layerGL.renderer;
    this._sceneHelper.updateAmbientCubemap(renderer, globeModel, api);
    this._sceneHelper.updateSkybox(renderer, globeModel, api);
  },
  _updateLayers: function(globeModel, api) {
    var coordSys = globeModel.coordinateSystem;
    var layers = globeModel.get("layers");
    var lastDistance = coordSys.radius;
    var layerDiffuseTextures = [];
    var layerDiffuseIntensity = [];
    var layerEmissiveTextures = [];
    var layerEmissionIntensity = [];
    each(layers, function(layerOption) {
      var layerModel = new Model(layerOption);
      var layerType = layerModel.get("type");
      var texture = graphicGL$1.loadTexture(layerModel.get("texture"), api, {
        flipY: false,
        anisotropic: 8
      });
      if (texture.surface) {
        texture.surface.attachToMesh(this._earthMesh);
      }
      if (layerType === "blend") {
        var blendTo = layerModel.get("blendTo");
        var intensity = retrieve$1.firstNotNull(layerModel.get("intensity"), 1);
        if (blendTo === "emission") {
          layerEmissiveTextures.push(texture);
          layerEmissionIntensity.push(intensity);
        } else {
          layerDiffuseTextures.push(texture);
          layerDiffuseIntensity.push(intensity);
        }
      } else {
        var id = layerModel.get("id");
        var overlayMesh = this._layerMeshes[id];
        if (!overlayMesh) {
          overlayMesh = this._layerMeshes[id] = new graphicGL$1.Mesh({
            geometry: this._overlayGeometry,
            castShadow: false,
            ignorePicking: true
          });
        }
        var shading = layerModel.get("shading");
        if (shading === "lambert") {
          overlayMesh.material = overlayMesh.__lambertMaterial || new graphicGL$1.Material({
            autoUpdateTextureStatus: false,
            shader: graphicGL$1.createShader("ecgl.lambert"),
            transparent: true,
            depthMask: false
          });
          overlayMesh.__lambertMaterial = overlayMesh.material;
        } else {
          overlayMesh.material = overlayMesh.__colorMaterial || new graphicGL$1.Material({
            autoUpdateTextureStatus: false,
            shader: graphicGL$1.createShader("ecgl.color"),
            transparent: true,
            depthMask: false
          });
          overlayMesh.__colorMaterial = overlayMesh.material;
        }
        overlayMesh.material.enableTexture("diffuseMap");
        var distance = layerModel.get("distance");
        var radius = lastDistance + (distance == null ? coordSys.radius / 100 : distance);
        overlayMesh.scale.set(radius, radius, radius);
        lastDistance = radius;
        var blankTexture = this._blankTexture || (this._blankTexture = graphicGL$1.createBlankTexture("rgba(255, 255, 255, 0)"));
        overlayMesh.material.set("diffuseMap", blankTexture);
        graphicGL$1.loadTexture(layerModel.get("texture"), api, {
          flipY: false,
          anisotropic: 8
        }, function(texture2) {
          if (texture2.surface) {
            texture2.surface.attachToMesh(overlayMesh);
          }
          overlayMesh.material.set("diffuseMap", texture2);
          api.getZr().refresh();
        });
        layerModel.get("show") ? this.groupGL.add(overlayMesh) : this.groupGL.remove(overlayMesh);
      }
    }, this);
    var earthMaterial = this._earthMesh.material;
    earthMaterial.define("fragment", "LAYER_DIFFUSEMAP_COUNT", layerDiffuseTextures.length);
    earthMaterial.define("fragment", "LAYER_EMISSIVEMAP_COUNT", layerEmissiveTextures.length);
    earthMaterial.set("layerDiffuseMap", layerDiffuseTextures);
    earthMaterial.set("layerDiffuseIntensity", layerDiffuseIntensity);
    earthMaterial.set("layerEmissiveMap", layerEmissiveTextures);
    earthMaterial.set("layerEmissionIntensity", layerEmissionIntensity);
    var debugWireframeModel = globeModel.getModel("debug.wireframe");
    if (debugWireframeModel.get("show")) {
      earthMaterial.define("both", "WIREFRAME_TRIANGLE");
      var color = graphicGL$1.parseColor(debugWireframeModel.get("lineStyle.color") || "rgba(0,0,0,0.5)");
      var width = retrieve$1.firstNotNull(debugWireframeModel.get("lineStyle.width"), 1);
      earthMaterial.set("wireframeLineWidth", width);
      earthMaterial.set("wireframeLineColor", color);
    } else {
      earthMaterial.undefine("both", "WIREFRAME_TRIANGLE");
    }
  },
  _updateViewControl: function(globeModel, api) {
    var coordSys = globeModel.coordinateSystem;
    var viewControlModel = globeModel.getModel("viewControl");
    coordSys.viewGL.camera;
    var self = this;
    function makeAction() {
      return {
        type: "globeChangeCamera",
        alpha: control.getAlpha(),
        beta: control.getBeta(),
        distance: control.getDistance() - coordSys.radius,
        center: control.getCenter(),
        from: self.uid,
        globeId: globeModel.id
      };
    }
    var control = this._control;
    control.setViewGL(coordSys.viewGL);
    var coord = viewControlModel.get("targetCoord");
    var alpha, beta;
    if (coord != null) {
      beta = coord[0] + 90;
      alpha = coord[1];
    }
    control.setFromViewControlModel(viewControlModel, {
      baseDistance: coordSys.radius,
      alpha,
      beta
    });
    control.off("update");
    control.on("update", function() {
      api.dispatchAction(makeAction());
    });
  },
  _displaceVertices: function(globeModel, api) {
    var displacementQuality = globeModel.get("displacementQuality");
    var showDebugWireframe = globeModel.get("debug.wireframe.show");
    var globe = globeModel.coordinateSystem;
    if (!globeModel.isDisplacementChanged() && displacementQuality === this._displacementQuality && showDebugWireframe === this._showDebugWireframe) {
      return;
    }
    this._displacementQuality = displacementQuality;
    this._showDebugWireframe = showDebugWireframe;
    var geometry = this._sphereGeometry;
    var widthSegments = {
      low: 100,
      medium: 200,
      high: 400,
      ultra: 800
    }[displacementQuality] || 200;
    var heightSegments = widthSegments / 2;
    if (geometry.widthSegments !== widthSegments || showDebugWireframe) {
      geometry.widthSegments = widthSegments;
      geometry.heightSegments = heightSegments;
      geometry.build();
    }
    this._doDisplaceVertices(geometry, globe);
    if (showDebugWireframe) {
      geometry.generateBarycentric();
    }
  },
  _doDisplaceVertices: function(geometry, globe) {
    var positionArr = geometry.attributes.position.value;
    var uvArr = geometry.attributes.texcoord0.value;
    var originalPositionArr = geometry.__originalPosition;
    if (!originalPositionArr || originalPositionArr.length !== positionArr.length) {
      originalPositionArr = new Float32Array(positionArr.length);
      originalPositionArr.set(positionArr);
      geometry.__originalPosition = originalPositionArr;
    }
    var width = globe.displacementWidth;
    var height = globe.displacementHeight;
    var data = globe.displacementData;
    for (var i = 0; i < geometry.vertexCount; i++) {
      var i3 = i * 3;
      var i2 = i * 2;
      var x = originalPositionArr[i3 + 1];
      var y = originalPositionArr[i3 + 2];
      var z = originalPositionArr[i3 + 3];
      var u = uvArr[i2++];
      var v = uvArr[i2++];
      var j = Math.round(u * (width - 1));
      var k = Math.round(v * (height - 1));
      var idx = k * width + j;
      var scale2 = data ? data[idx] : 0;
      positionArr[i3 + 1] = x + x * scale2;
      positionArr[i3 + 2] = y + y * scale2;
      positionArr[i3 + 3] = z + z * scale2;
    }
    geometry.generateVertexNormals();
    geometry.dirty();
    geometry.updateBoundingBox();
  },
  _updateLight: function(globeModel, api) {
    var earthMesh = this._earthMesh;
    this._sceneHelper.updateLight(globeModel);
    var mainLight = this._sceneHelper.mainLight;
    var time = globeModel.get("light.main.time") || new Date();
    var pos = sunCalc.getPosition(parseDate(time), 0, 0);
    var r0 = Math.cos(pos.altitude);
    mainLight.position.y = -r0 * Math.cos(pos.azimuth);
    mainLight.position.x = Math.sin(pos.altitude);
    mainLight.position.z = r0 * Math.sin(pos.azimuth);
    mainLight.lookAt(earthMesh.getWorldPosition());
  },
  dispose: function(ecModel, api) {
    this.groupGL.removeAll();
    this._control.dispose();
  }
});
var vec3 = glmatrix.vec3;
function Globe(radius) {
  this.radius = radius;
  this.viewGL = null;
  this.altitudeAxis;
  this.displacementData = null;
  this.displacementWidth;
  this.displacementHeight;
}
Globe.prototype = {
  constructor: Globe,
  dimensions: ["lng", "lat", "alt"],
  type: "globe",
  containPoint: function() {
  },
  setDisplacementData: function(data, width, height) {
    this.displacementData = data;
    this.displacementWidth = width;
    this.displacementHeight = height;
  },
  _getDisplacementScale: function(lng, lat) {
    var i = (lng + 180) / 360 * (this.displacementWidth - 1);
    var j = (90 - lat) / 180 * (this.displacementHeight - 1);
    var idx = Math.round(i) + Math.round(j) * this.displacementWidth;
    return this.displacementData[idx];
  },
  dataToPoint: function(data, out) {
    var lng = data[0];
    var lat = data[1];
    var altVal = data[2] || 0;
    var r = this.radius;
    if (this.displacementData) {
      r *= 1 + this._getDisplacementScale(lng, lat);
    }
    if (this.altitudeAxis) {
      r += this.altitudeAxis.dataToCoord(altVal);
    }
    lng = lng * Math.PI / 180;
    lat = lat * Math.PI / 180;
    var r0 = Math.cos(lat) * r;
    out = out || [];
    out[0] = -r0 * Math.cos(lng + Math.PI);
    out[1] = Math.sin(lat) * r;
    out[2] = r0 * Math.sin(lng + Math.PI);
    return out;
  },
  pointToData: function(point, out) {
    var x = point[0];
    var y = point[1];
    var z = point[2];
    var len = vec3.len(point);
    x /= len;
    y /= len;
    z /= len;
    var theta = Math.asin(y);
    var phi = Math.atan2(z, -x);
    if (phi < 0) {
      phi = Math.PI * 2 + phi;
    }
    var lat = theta * 180 / Math.PI;
    var lng = phi * 180 / Math.PI - 180;
    out = out || [];
    out[0] = lng;
    out[1] = lat;
    out[2] = len - this.radius;
    if (this.altitudeAxis) {
      out[2] = this.altitudeAxis.coordToData(out[2]);
    }
    return out;
  }
};
function getDisplacementData(img, displacementScale) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var width = img.width;
  var height = img.height;
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  var rgbaArr = ctx.getImageData(0, 0, width, height).data;
  var displacementArr = new Float32Array(rgbaArr.length / 4);
  for (var i = 0; i < rgbaArr.length / 4; i++) {
    var x = rgbaArr[i * 4];
    displacementArr[i] = x / 255 * displacementScale;
  }
  return {
    data: displacementArr,
    width,
    height
  };
}
function resizeGlobe(globeModel, api) {
  var boxLayoutOption = globeModel.getBoxLayoutParams();
  var viewport = getLayoutRect(boxLayoutOption, {
    width: api.getWidth(),
    height: api.getHeight()
  });
  viewport.y = api.getHeight() - viewport.y - viewport.height;
  this.viewGL.setViewport(viewport.x, viewport.y, viewport.width, viewport.height, api.getDevicePixelRatio());
  this.radius = globeModel.get("globeRadius");
  var outerRadius = globeModel.get("globeOuterRadius");
  if (this.altitudeAxis) {
    this.altitudeAxis.setExtent(0, outerRadius - this.radius);
  }
}
function updateGlobe(ecModel, api) {
  var altitudeDataExtent = [Infinity, -Infinity];
  ecModel.eachSeries(function(seriesModel) {
    if (seriesModel.coordinateSystem !== this) {
      return;
    }
    var data = seriesModel.getData();
    var altDims = seriesModel.coordDimToDataDim("alt");
    var altDim = altDims && altDims[0];
    if (altDim) {
      var dataExtent = data.getDataExtent(altDim, true);
      altitudeDataExtent[0] = Math.min(altitudeDataExtent[0], dataExtent[0]);
      altitudeDataExtent[1] = Math.max(altitudeDataExtent[1], dataExtent[1]);
    }
  }, this);
  if (altitudeDataExtent && isFinite(altitudeDataExtent[1] - altitudeDataExtent[0])) {
    var scale2 = createScale(altitudeDataExtent, {
      type: "value",
      min: "dataMin",
      max: "dataMax"
    });
    this.altitudeAxis = new Axis$1("altitude", scale2);
    this.resize(this.model, api);
  }
}
var globeCreator = {
  dimensions: Globe.prototype.dimensions,
  create: function(ecModel, api) {
    var globeList = [];
    ecModel.eachComponent("globe", function(globeModel) {
      globeModel.__viewGL = globeModel.__viewGL || new ViewGL();
      var globe = new Globe();
      globe.viewGL = globeModel.__viewGL;
      globeModel.coordinateSystem = globe;
      globe.model = globeModel;
      globeList.push(globe);
      globe.resize = resizeGlobe;
      globe.resize(globeModel, api);
      globe.update = updateGlobe;
    });
    ecModel.eachSeries(function(seriesModel) {
      if (seriesModel.get("coordinateSystem") === "globe") {
        var globeModel = seriesModel.getReferringComponents("globe").models[0];
        if (!globeModel) {
          globeModel = ecModel.getComponent("globe");
        }
        if (!globeModel) {
          throw new Error('globe "' + retrieve$1.firstNotNull(seriesModel.get("globe3DIndex"), seriesModel.get("globe3DId"), 0) + '" not found');
        }
        var coordSys = globeModel.coordinateSystem;
        seriesModel.coordinateSystem = coordSys;
      }
    });
    ecModel.eachComponent("globe", function(globeModel, idx) {
      var globe = globeModel.coordinateSystem;
      var displacementTextureValue = globeModel.getDisplacementTexture();
      var displacementScale = globeModel.getDisplacemenScale();
      if (globeModel.isDisplacementChanged()) {
        if (globeModel.hasDisplacement()) {
          var immediateLoaded = true;
          graphicGL$1.loadTexture(displacementTextureValue, api, function(texture) {
            var img = texture.image;
            var displacementData = getDisplacementData(img, displacementScale);
            globeModel.setDisplacementData(displacementData.data, displacementData.width, displacementData.height);
            if (!immediateLoaded) {
              api.dispatchAction({
                type: "globeUpdateDisplacment"
              });
            }
          });
          immediateLoaded = false;
        } else {
          globe.setDisplacementData(null, 0, 0);
        }
        globe.setDisplacementData(globeModel.displacementData, globeModel.displacementWidth, globeModel.displacementHeight);
      }
    });
    return globeList;
  }
};
var globeCreator$1 = globeCreator;
function install(registers) {
  registers.registerComponentModel(GlobeModel$1);
  registers.registerComponentView(GlobeView);
  registers.registerCoordinateSystem("globe", globeCreator$1);
  registers.registerAction({
    type: "globeChangeCamera",
    event: "globecamerachanged",
    update: "series:updateCamera"
  }, function(payload, ecModel) {
    ecModel.eachComponent({
      mainType: "globe",
      query: payload
    }, function(componentModel) {
      componentModel.setView(payload);
    });
  });
  registers.registerAction({
    type: "globeUpdateDisplacment",
    event: "globedisplacementupdated",
    update: "update"
  }, function(payload, ecModel) {
  });
}
use([install$2, install, install$1]);
registerMap("china", { geoJSON: china, specialAreas: { china: { left: 0, top: 0 } } });
var map3d = defineConfig({
  name: "map",
  resetOption(cols, data, ctx) {
    ctx.chart.dispose();
    ctx.init();
    const option = {
      geo3D: {
        map: "china",
        viewControl: {
          rotateSensitivity: 0
        }
      },
      series: [
        {
          type: SERIES_TYPE.lines3D,
          coordinateSystem: "geo3D",
          geo3DIndex: 0,
          data: [
            [[104.06, 30.67, 1], [111, 35.02, 2]],
            [[114.06, 30.67, 5], [111, 35.02, 3]],
            [[104.06, 32.67, 2], [111, 35.02, 5]],
            [[124.06, 50.67, 4], [111, 35.02, 1]]
          ],
          effect: {
            show: true,
            trailColor: "#1890ff",
            trailOpacity: 0.8
          },
          blendMode: "source-over",
          lineStyle: {
            width: 2,
            color: "#1890ff",
            opacity: 0.2
          }
        }
      ]
    };
    return option;
  }
});
export { map3d as default };
