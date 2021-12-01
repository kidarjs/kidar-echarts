var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a2, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    }
  return a2;
};
var __spreadProps = (a2, b2) => __defProps(a2, __getOwnPropDescs(b2));
import { install, defineComponent, ref, toRefs, computed, onUnmounted, onMounted, nextTick, watch, watchEffect, h as h$1 } from "vue-demi";
import * as echarts from "echarts";
var r = function() {
  if (typeof Map != "undefined")
    return Map;
  function t2(t3, e) {
    var n = -1;
    return t3.some(function(t4, r2) {
      return t4[0] === e && (n = r2, true);
    }), n;
  }
  return function() {
    function e() {
      this.__entries__ = [];
    }
    return Object.defineProperty(e.prototype, "size", {
      get: function() {
        return this.__entries__.length;
      },
      enumerable: true,
      configurable: true
    }), e.prototype.get = function(e2) {
      var n = t2(this.__entries__, e2), r2 = this.__entries__[n];
      return r2 && r2[1];
    }, e.prototype.set = function(e2, n) {
      var r2 = t2(this.__entries__, e2);
      ~r2 ? this.__entries__[r2][1] = n : this.__entries__.push([e2, n]);
    }, e.prototype.delete = function(e2) {
      var n = this.__entries__, r2 = t2(n, e2);
      ~r2 && n.splice(r2, 1);
    }, e.prototype.has = function(e2) {
      return !!~t2(this.__entries__, e2);
    }, e.prototype.clear = function() {
      this.__entries__.splice(0);
    }, e.prototype.forEach = function(t3, e2) {
      e2 === void 0 && (e2 = null);
      for (var n = 0, r2 = this.__entries__; n < r2.length; n++) {
        var i2 = r2[n];
        t3.call(e2, i2[1], i2[0]);
      }
    }, e;
  }();
}(), i = typeof window != "undefined" && typeof document != "undefined" && window.document === document, o = typeof global != "undefined" && global.Math === Math ? global : typeof self != "undefined" && self.Math === Math ? self : typeof window != "undefined" && window.Math === Math ? window : Function("return this")(), s = typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(o) : function(t2) {
  return setTimeout(function() {
    return t2(Date.now());
  }, 1e3 / 60);
};
var a = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], u = typeof MutationObserver != "undefined", c = function() {
  function t2() {
    this.connected_ = false, this.mutationEventsAdded_ = false, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = function(t3, e) {
      var n = false, r2 = false, i2 = 0;
      function o2() {
        n && (n = false, t3()), r2 && u2();
      }
      function a2() {
        s(o2);
      }
      function u2() {
        var t4 = Date.now();
        if (n) {
          if (t4 - i2 < 2)
            return;
          r2 = true;
        } else
          n = true, r2 = false, setTimeout(a2, e);
        i2 = t4;
      }
      return u2;
    }(this.refresh.bind(this), 20);
  }
  return t2.prototype.addObserver = function(t3) {
    ~this.observers_.indexOf(t3) || this.observers_.push(t3), this.connected_ || this.connect_();
  }, t2.prototype.removeObserver = function(t3) {
    var e = this.observers_, n = e.indexOf(t3);
    ~n && e.splice(n, 1), !e.length && this.connected_ && this.disconnect_();
  }, t2.prototype.refresh = function() {
    this.updateObservers_() && this.refresh();
  }, t2.prototype.updateObservers_ = function() {
    var t3 = this.observers_.filter(function(t4) {
      return t4.gatherActive(), t4.hasActive();
    });
    return t3.forEach(function(t4) {
      return t4.broadcastActive();
    }), t3.length > 0;
  }, t2.prototype.connect_ = function() {
    i && !this.connected_ && (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), u ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = true), this.connected_ = true);
  }, t2.prototype.disconnect_ = function() {
    i && this.connected_ && (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = false, this.connected_ = false);
  }, t2.prototype.onTransitionEnd_ = function(t3) {
    var e = t3.propertyName, n = e === void 0 ? "" : e;
    a.some(function(t4) {
      return !!~n.indexOf(t4);
    }) && this.refresh();
  }, t2.getInstance = function() {
    return this.instance_ || (this.instance_ = new t2()), this.instance_;
  }, t2.instance_ = null, t2;
}(), f = function(t2, e) {
  for (var n = 0, r2 = Object.keys(e); n < r2.length; n++) {
    var i2 = r2[n];
    Object.defineProperty(t2, i2, {
      value: e[i2],
      enumerable: false,
      writable: false,
      configurable: true
    });
  }
  return t2;
}, h = function(t2) {
  return t2 && t2.ownerDocument && t2.ownerDocument.defaultView || o;
}, l = _(0, 0, 0, 0);
function d(t2) {
  return parseFloat(t2) || 0;
}
function p(t2) {
  for (var e = [], n = 1; n < arguments.length; n++)
    e[n - 1] = arguments[n];
  return e.reduce(function(e2, n2) {
    return e2 + d(t2["border-" + n2 + "-width"]);
  }, 0);
}
function v(t2) {
  var e = t2.clientWidth, n = t2.clientHeight;
  if (!e && !n)
    return l;
  var r2 = h(t2).getComputedStyle(t2), i2 = function(t3) {
    for (var e2 = {}, n2 = 0, r3 = ["top", "right", "bottom", "left"]; n2 < r3.length; n2++) {
      var i3 = r3[n2], o3 = t3["padding-" + i3];
      e2[i3] = d(o3);
    }
    return e2;
  }(r2), o2 = i2.left + i2.right, s2 = i2.top + i2.bottom, a2 = d(r2.width), u2 = d(r2.height);
  if (r2.boxSizing === "border-box" && (Math.round(a2 + o2) !== e && (a2 -= p(r2, "left", "right") + o2), Math.round(u2 + s2) !== n && (u2 -= p(r2, "top", "bottom") + s2)), !function(t3) {
    return t3 === h(t3).document.documentElement;
  }(t2)) {
    var c2 = Math.round(a2 + o2) - e, f2 = Math.round(u2 + s2) - n;
    Math.abs(c2) !== 1 && (a2 -= c2), Math.abs(f2) !== 1 && (u2 -= f2);
  }
  return _(i2.left, i2.top, a2, u2);
}
var b = typeof SVGGraphicsElement != "undefined" ? function(t2) {
  return t2 instanceof h(t2).SVGGraphicsElement;
} : function(t2) {
  return t2 instanceof h(t2).SVGElement && typeof t2.getBBox == "function";
};
function g(t2) {
  return i ? b(t2) ? function(t3) {
    var e = t3.getBBox();
    return _(0, 0, e.width, e.height);
  }(t2) : v(t2) : l;
}
function _(t2, e, n, r2) {
  return {
    x: t2,
    y: e,
    width: n,
    height: r2
  };
}
var m = function() {
  function t2(t3) {
    this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = _(0, 0, 0, 0), this.target = t3;
  }
  return t2.prototype.isActive = function() {
    var t3 = g(this.target);
    return this.contentRect_ = t3, t3.width !== this.broadcastWidth || t3.height !== this.broadcastHeight;
  }, t2.prototype.broadcastRect = function() {
    var t3 = this.contentRect_;
    return this.broadcastWidth = t3.width, this.broadcastHeight = t3.height, t3;
  }, t2;
}(), y = function(t2, e) {
  var n, r2, i2, o2, s2, a2, u2, c2 = (r2 = (n = e).x, i2 = n.y, o2 = n.width, s2 = n.height, a2 = typeof DOMRectReadOnly != "undefined" ? DOMRectReadOnly : Object, u2 = Object.create(a2.prototype), f(u2, {
    x: r2,
    y: i2,
    width: o2,
    height: s2,
    top: i2,
    right: r2 + o2,
    bottom: s2 + i2,
    left: r2
  }), u2);
  f(this, {
    target: t2,
    contentRect: c2
  });
}, w = function() {
  function t2(t3, e, n) {
    if (this.activeObservations_ = [], this.observations_ = new r(), typeof t3 != "function")
      throw new TypeError("The callback provided as parameter 1 is not a function.");
    this.callback_ = t3, this.controller_ = e, this.callbackCtx_ = n;
  }
  return t2.prototype.observe = function(t3) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element != "undefined" && Element instanceof Object) {
      if (!(t3 instanceof h(t3).Element))
        throw new TypeError('parameter 1 is not of type "Element".');
      var e = this.observations_;
      e.has(t3) || (e.set(t3, new m(t3)), this.controller_.addObserver(this), this.controller_.refresh());
    }
  }, t2.prototype.unobserve = function(t3) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element != "undefined" && Element instanceof Object) {
      if (!(t3 instanceof h(t3).Element))
        throw new TypeError('parameter 1 is not of type "Element".');
      var e = this.observations_;
      e.has(t3) && (e.delete(t3), e.size || this.controller_.removeObserver(this));
    }
  }, t2.prototype.disconnect = function() {
    this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
  }, t2.prototype.gatherActive = function() {
    var t3 = this;
    this.clearActive(), this.observations_.forEach(function(e) {
      e.isActive() && t3.activeObservations_.push(e);
    });
  }, t2.prototype.broadcastActive = function() {
    if (this.hasActive()) {
      var t3 = this.callbackCtx_, e = this.activeObservations_.map(function(t4) {
        return new y(t4.target, t4.broadcastRect());
      });
      this.callback_.call(t3, e, t3), this.clearActive();
    }
  }, t2.prototype.clearActive = function() {
    this.activeObservations_.splice(0);
  }, t2.prototype.hasActive = function() {
    return this.activeObservations_.length > 0;
  }, t2;
}(), O = typeof WeakMap != "undefined" ? new WeakMap() : new r(), E = function t(e) {
  if (!(this instanceof t))
    throw new TypeError("Cannot call a class as a function.");
  if (!arguments.length)
    throw new TypeError("1 argument required, but only 0 present.");
  var n = c.getInstance(), r2 = new w(e, n, this);
  O.set(this, r2);
};
["observe", "unobserve", "disconnect"].forEach(function(t2) {
  E.prototype[t2] = function() {
    var e;
    return (e = O.get(this))[t2].apply(e, arguments);
  };
});
var T = o.ResizeObserver !== void 0 ? o.ResizeObserver : E, x = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : {};
var M = function(t2) {
  var e = typeof t2;
  return t2 != null && (e == "object" || e == "function");
}, A = typeof x == "object" && x && x.Object === Object && x, j = typeof self == "object" && self && self.Object === Object && self, $ = A || j || Function("return this")(), N = $, S = function() {
  return N.Date.now();
}, R = /\s/;
var D = function(t2) {
  for (var e = t2.length; e-- && R.test(t2.charAt(e)); )
    ;
  return e;
}, W = /^\s+/;
var k = function(t2) {
  return t2 ? t2.slice(0, D(t2) + 1).replace(W, "") : t2;
}, z = $.Symbol, F = z, L = Object.prototype, I = L.hasOwnProperty, q = L.toString, C = F ? F.toStringTag : void 0;
var G = function(t2) {
  var e = I.call(t2, C), n = t2[C];
  try {
    t2[C] = void 0;
    var r2 = true;
  } catch (o2) {
  }
  var i2 = q.call(t2);
  return r2 && (e ? t2[C] = n : delete t2[C]), i2;
}, B = Object.prototype.toString;
var H = G, V = function(t2) {
  return B.call(t2);
}, P = z ? z.toStringTag : void 0;
var U = function(t2) {
  return t2 == null ? t2 === void 0 ? "[object Undefined]" : "[object Null]" : P && P in Object(t2) ? H(t2) : V(t2);
}, J = function(t2) {
  return t2 != null && typeof t2 == "object";
};
var K = k, Q = M, X = function(t2) {
  return typeof t2 == "symbol" || J(t2) && U(t2) == "[object Symbol]";
}, Y = /^[-+]0x[0-9a-f]+$/i, Z = /^0b[01]+$/i, tt = /^0o[0-7]+$/i, et = parseInt;
var nt = M, rt = S, it = function(t2) {
  if (typeof t2 == "number")
    return t2;
  if (X(t2))
    return NaN;
  if (Q(t2)) {
    var e = typeof t2.valueOf == "function" ? t2.valueOf() : t2;
    t2 = Q(e) ? e + "" : e;
  }
  if (typeof t2 != "string")
    return t2 === 0 ? t2 : +t2;
  t2 = K(t2);
  var n = Z.test(t2);
  return n || tt.test(t2) ? et(t2.slice(2), n ? 2 : 8) : Y.test(t2) ? NaN : +t2;
}, ot = Math.max, st = Math.min;
var at = function(t2, e, n) {
  var r2, i2, o2, s2, a2, u2, c2 = 0, f2 = false, h2 = false, l2 = true;
  if (typeof t2 != "function")
    throw new TypeError("Expected a function");
  function d2(e2) {
    var n2 = r2, o3 = i2;
    return r2 = i2 = void 0, c2 = e2, s2 = t2.apply(o3, n2);
  }
  function p2(t3) {
    return c2 = t3, a2 = setTimeout(b2, e), f2 ? d2(t3) : s2;
  }
  function v2(t3) {
    var n2 = t3 - u2;
    return u2 === void 0 || n2 >= e || n2 < 0 || h2 && t3 - c2 >= o2;
  }
  function b2() {
    var t3 = rt();
    if (v2(t3))
      return g2(t3);
    a2 = setTimeout(b2, function(t4) {
      var n2 = e - (t4 - u2);
      return h2 ? st(n2, o2 - (t4 - c2)) : n2;
    }(t3));
  }
  function g2(t3) {
    return a2 = void 0, l2 && r2 ? d2(t3) : (r2 = i2 = void 0, s2);
  }
  function _2() {
    var t3 = rt(), n2 = v2(t3);
    if (r2 = arguments, i2 = this, u2 = t3, n2) {
      if (a2 === void 0)
        return p2(u2);
      if (h2)
        return clearTimeout(a2), a2 = setTimeout(b2, e), d2(u2);
    }
    return a2 === void 0 && (a2 = setTimeout(b2, e)), s2;
  }
  return e = it(e) || 0, nt(n) && (f2 = !!n.leading, o2 = (h2 = "maxWait" in n) ? ot(it(n.maxWait) || 0, e) : o2, l2 = "trailing" in n ? !!n.trailing : l2), _2.cancel = function() {
    a2 !== void 0 && clearTimeout(a2), c2 = 0, r2 = u2 = i2 = a2 = void 0;
  }, _2.flush = function() {
    return a2 === void 0 ? s2 : g2(rt());
  }, _2;
}, ut = M;
var ct = function(t2, e, n) {
  var r2 = true, i2 = true;
  if (typeof t2 != "function")
    throw new TypeError("Expected a function");
  return ut(n) && (r2 = "leading" in n ? !!n.leading : r2, i2 = "trailing" in n ? !!n.trailing : i2), at(t2, e, {
    leading: r2,
    maxWait: e,
    trailing: i2
  });
};
const ft = new Map();
let ht = null;
const lt = (t2, e) => {
  ht === null && (ht = new T((t3) => {
    for (const e2 of t3)
      ft.get(e2.target)(e2);
  })), e instanceof Function ? (ft.set(t2, ct(e, 100)), ht.observe(t2)) : (ft.delete(t2), ht.unobserve(t2));
};
function dt(t2, e) {
  lt(t2, e);
}
function pt(t2) {
  lt(t2);
}
install();
const PLUGINS = new Map();
const KidarEcharts = defineComponent({
  template: `<div ref="KidarEchartsEl"></div>`,
  props: {
    extra: { type: Object },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    tooltip: { type: Function },
    click: { type: Function },
    label: { type: Function },
    type: { type: String, require: true, default: "" },
    cols: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    theme: { type: [String, Object] },
    locale: { type: String, default: "zh-cn" },
    renderer: { type: String, default: "canvas" },
    useDirtyRect: { type: Boolean, default: false },
    devicePixelRatio: { type: Number }
  },
  setup(props, { emit, attrs }) {
    const KidarEchartsEl = ref();
    const { theme, type, cols, data } = toRefs(props);
    let chart = null;
    const opts = computed(() => {
      return {
        locale: props.locale,
        renderer: props.renderer,
        devicePixelRatio: props.devicePixelRatio,
        useDirtyRect: props.useDirtyRect
      };
    });
    const init = () => {
      chart = echarts.getInstanceByDom(KidarEchartsEl.value) || echarts.init(KidarEchartsEl.value, theme ? theme.value : "", opts.value);
      dt(KidarEchartsEl.value, () => {
        resetOption();
      });
      resetOption();
    };
    onUnmounted(() => {
      KidarEchartsEl.value && pt(KidarEchartsEl.value);
      chart && chart.dispose();
    });
    onMounted(() => {
      KidarEchartsEl.value ? init() : nextTick(() => init());
    });
    const resetOption = () => {
      if (!chart || chart.isDisposed() || !type.value)
        return;
      if (!PLUGINS.has(type.value)) {
        return;
      }
      chart.setOption({}, false);
      if (PLUGINS.get(type.value)) {
        const option = PLUGINS.get(type.value).resetOption(props.cols || [], data.value, __spreadProps(__spreadValues({}, props), { chart, init }));
        try {
          option && chart.setOption(option, true);
        } catch (error) {
          if (error.message && error.message.indexOf("not be called during main process") > 0) {
            chart.dispose();
            option && chart.setOption(option, true);
          } else {
            throw new Error(error);
          }
        }
      }
      chart.resize();
    };
    watch([type, cols, data], resetOption, { deep: true });
    watchEffect(() => {
      if (props.click) {
        chart && chart.on("click", (p2) => props.click(p2));
      }
    });
    watch([theme], () => {
      chart && chart.dispose();
      init();
    });
    return {
      KidarEchartsEl
    };
  },
  render: () => h$1("div", { style: "overflow:hidden !important;" }, [
    h$1("div", { ref: "KidarEchartsEl", style: "height: 100%; width: 100%;" })
  ])
});
const addKidarEchartsPlugin = (pluginName, plugin) => {
  if (PLUGINS.has(pluginName))
    ;
  PLUGINS.set(pluginName, plugin);
};
const installKidarEcharts = (app) => {
  app.component("KidarEcharts", KidarEcharts);
};
export { KidarEcharts, addKidarEchartsPlugin, installKidarEcharts as install };
