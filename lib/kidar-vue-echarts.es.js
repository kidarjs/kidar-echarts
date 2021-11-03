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
var a = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], c = typeof MutationObserver != "undefined", u = function() {
  function t2() {
    this.connected_ = false, this.mutationEventsAdded_ = false, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = function(t3, e) {
      var n = false, r2 = false, i2 = 0;
      function o2() {
        n && (n = false, t3()), r2 && c2();
      }
      function a2() {
        s(o2);
      }
      function c2() {
        var t4 = Date.now();
        if (n) {
          if (t4 - i2 < 2)
            return;
          r2 = true;
        } else
          n = true, r2 = false, setTimeout(a2, e);
        i2 = t4;
      }
      return c2;
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
    i && !this.connected_ && (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), c ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
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
}, d = y(0, 0, 0, 0);
function l(t2) {
  return parseFloat(t2) || 0;
}
function v(t2) {
  for (var e = [], n = 1; n < arguments.length; n++)
    e[n - 1] = arguments[n];
  return e.reduce(function(e2, n2) {
    return e2 + l(t2["border-" + n2 + "-width"]);
  }, 0);
}
function p(t2) {
  var e = t2.clientWidth, n = t2.clientHeight;
  if (!e && !n)
    return d;
  var r2 = h(t2).getComputedStyle(t2), i2 = function(t3) {
    for (var e2 = {}, n2 = 0, r3 = ["top", "right", "bottom", "left"]; n2 < r3.length; n2++) {
      var i3 = r3[n2], o3 = t3["padding-" + i3];
      e2[i3] = l(o3);
    }
    return e2;
  }(r2), o2 = i2.left + i2.right, s2 = i2.top + i2.bottom, a2 = l(r2.width), c2 = l(r2.height);
  if (r2.boxSizing === "border-box" && (Math.round(a2 + o2) !== e && (a2 -= v(r2, "left", "right") + o2), Math.round(c2 + s2) !== n && (c2 -= v(r2, "top", "bottom") + s2)), !function(t3) {
    return t3 === h(t3).document.documentElement;
  }(t2)) {
    var u2 = Math.round(a2 + o2) - e, f2 = Math.round(c2 + s2) - n;
    Math.abs(u2) !== 1 && (a2 -= u2), Math.abs(f2) !== 1 && (c2 -= f2);
  }
  return y(i2.left, i2.top, a2, c2);
}
var b = typeof SVGGraphicsElement != "undefined" ? function(t2) {
  return t2 instanceof h(t2).SVGGraphicsElement;
} : function(t2) {
  return t2 instanceof h(t2).SVGElement && typeof t2.getBBox == "function";
};
function _(t2) {
  return i ? b(t2) ? function(t3) {
    var e = t3.getBBox();
    return y(0, 0, e.width, e.height);
  }(t2) : p(t2) : d;
}
function y(t2, e, n, r2) {
  return {
    x: t2,
    y: e,
    width: n,
    height: r2
  };
}
var m = function() {
  function t2(t3) {
    this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = y(0, 0, 0, 0), this.target = t3;
  }
  return t2.prototype.isActive = function() {
    var t3 = _(this.target);
    return this.contentRect_ = t3, t3.width !== this.broadcastWidth || t3.height !== this.broadcastHeight;
  }, t2.prototype.broadcastRect = function() {
    var t3 = this.contentRect_;
    return this.broadcastWidth = t3.width, this.broadcastHeight = t3.height, t3;
  }, t2;
}(), g = function(t2, e) {
  var n, r2, i2, o2, s2, a2, c2, u2 = (r2 = (n = e).x, i2 = n.y, o2 = n.width, s2 = n.height, a2 = typeof DOMRectReadOnly != "undefined" ? DOMRectReadOnly : Object, c2 = Object.create(a2.prototype), f(c2, {
    x: r2,
    y: i2,
    width: o2,
    height: s2,
    top: i2,
    right: r2 + o2,
    bottom: s2 + i2,
    left: r2
  }), c2);
  f(this, {
    target: t2,
    contentRect: u2
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
        return new g(t4.target, t4.broadcastRect());
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
  var n = u.getInstance(), r2 = new w(e, n, this);
  O.set(this, r2);
};
["observe", "unobserve", "disconnect"].forEach(function(t2) {
  E.prototype[t2] = function() {
    var e;
    return (e = O.get(this))[t2].apply(e, arguments);
  };
});
var T = o.ResizeObserver !== void 0 ? o.ResizeObserver : E, M = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : {};
var x = function(t2) {
  var e = typeof t2;
  return t2 != null && (e == "object" || e == "function");
}, j = typeof M == "object" && M && M.Object === Object && M, A = typeof self == "object" && self && self.Object === Object && self, S = j || A || Function("return this")(), R = S, D = function() {
  return R.Date.now();
}, W = /\s/;
var k = function(t2) {
  for (var e = t2.length; e-- && W.test(t2.charAt(e)); )
    ;
  return e;
}, z = /^\s+/;
var N = function(t2) {
  return t2 ? t2.slice(0, k(t2) + 1).replace(z, "") : t2;
}, L = S.Symbol, q = L, C = Object.prototype, F = C.hasOwnProperty, G = C.toString, B = q ? q.toStringTag : void 0;
var H = function(t2) {
  var e = F.call(t2, B), n = t2[B];
  try {
    t2[B] = void 0;
    var r2 = true;
  } catch (o2) {
  }
  var i2 = G.call(t2);
  return r2 && (e ? t2[B] = n : delete t2[B]), i2;
}, V = Object.prototype.toString;
var I = H, P = function(t2) {
  return V.call(t2);
}, $ = L ? L.toStringTag : void 0;
var U = function(t2) {
  return t2 == null ? t2 === void 0 ? "[object Undefined]" : "[object Null]" : $ && $ in Object(t2) ? I(t2) : P(t2);
}, J = function(t2) {
  return t2 != null && typeof t2 == "object";
};
var K = N, Q = x, X = function(t2) {
  return typeof t2 == "symbol" || J(t2) && U(t2) == "[object Symbol]";
}, Y = /^[-+]0x[0-9a-f]+$/i, Z = /^0b[01]+$/i, tt = /^0o[0-7]+$/i, et = parseInt;
var nt = x, rt = D, it = function(t2) {
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
  var r2, i2, o2, s2, a2, c2, u2 = 0, f2 = false, h2 = false, d2 = true;
  if (typeof t2 != "function")
    throw new TypeError("Expected a function");
  function l2(e2) {
    var n2 = r2, o3 = i2;
    return r2 = i2 = void 0, u2 = e2, s2 = t2.apply(o3, n2);
  }
  function v2(t3) {
    return u2 = t3, a2 = setTimeout(b2, e), f2 ? l2(t3) : s2;
  }
  function p2(t3) {
    var n2 = t3 - c2;
    return c2 === void 0 || n2 >= e || n2 < 0 || h2 && t3 - u2 >= o2;
  }
  function b2() {
    var t3 = rt();
    if (p2(t3))
      return _2(t3);
    a2 = setTimeout(b2, function(t4) {
      var n2 = e - (t4 - c2);
      return h2 ? st(n2, o2 - (t4 - u2)) : n2;
    }(t3));
  }
  function _2(t3) {
    return a2 = void 0, d2 && r2 ? l2(t3) : (r2 = i2 = void 0, s2);
  }
  function y2() {
    var t3 = rt(), n2 = p2(t3);
    if (r2 = arguments, i2 = this, c2 = t3, n2) {
      if (a2 === void 0)
        return v2(c2);
      if (h2)
        return clearTimeout(a2), a2 = setTimeout(b2, e), l2(c2);
    }
    return a2 === void 0 && (a2 = setTimeout(b2, e)), s2;
  }
  return e = it(e) || 0, nt(n) && (f2 = !!n.leading, o2 = (h2 = "maxWait" in n) ? ot(it(n.maxWait) || 0, e) : o2, d2 = "trailing" in n ? !!n.trailing : d2), y2.cancel = function() {
    a2 !== void 0 && clearTimeout(a2), u2 = 0, r2 = c2 = i2 = a2 = void 0;
  }, y2.flush = function() {
    return a2 === void 0 ? s2 : _2(rt());
  }, y2;
}, ct = x;
var ut = function(t2, e, n) {
  var r2 = true, i2 = true;
  if (typeof t2 != "function")
    throw new TypeError("Expected a function");
  return ct(n) && (r2 = "leading" in n ? !!n.leading : r2, i2 = "trailing" in n ? !!n.trailing : i2), at(t2, e, {
    leading: r2,
    maxWait: e,
    trailing: i2
  });
};
const ft = (() => {
  const t2 = new Map(), e = new T((e2) => {
    for (const n of e2)
      t2.get(n.target)(n);
  });
  return (n, r2) => {
    !t2.has(n) && r2 ? (t2.set(n, ut(r2, 100)), e.observe(n)) : (t2.delete(n), e.unobserve(n));
  };
})();
function ht(t2, e) {
  ft(t2, e);
}
function dt(t2) {
  ft(t2);
}
document.createElement("canvas");
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeGlobal$1 = freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal$1 || freeSelf || Function("return this")();
var root$1 = root;
var Symbol$1 = root$1.Symbol;
var Symbol$2 = Symbol$1;
var objectProto$1 = Object.prototype;
var hasOwnProperty = objectProto$1.hasOwnProperty;
var nativeObjectToString$1 = objectProto$1.toString;
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
var reWhitespace = /\s/;
function trimmedEndIndex(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {
  }
  return index;
}
var reTrimStart = /^\s+/;
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
}
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var now = function() {
  return root$1.Date.now();
};
var now$1 = now;
var FUNC_ERROR_TEXT = "Expected a function";
var nativeMax = Math.max, nativeMin = Math.min;
function debounce(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now$1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now$1());
  }
  function debounced() {
    var time = now$1(), isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
var pie = defineConfig({
  name: "pie",
  resetOption(cols, data, ctx) {
    return {
      legend: {
        data: cols.map((t2) => t2.name)
      },
      series: [
        {
          type: "pie",
          radius: [0, "45%"],
          data
        }
      ]
    };
  }
});
var pie$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": pie
});
var render = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    ref: "EchartsEl"
  });
};
var staticRenderFns = [];
function normalizeComponent(scriptExports, render2, staticRenderFns2, functionalTemplate, injectStyles2, scopeId, moduleIdentifier, shadowMode) {
  var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
  if (render2) {
    options.render = render2;
    options.staticRenderFns = staticRenderFns2;
    options._compiled = true;
  }
  if (functionalTemplate) {
    options.functional = true;
  }
  if (scopeId) {
    options._scopeId = "data-v-" + scopeId;
  }
  var hook;
  if (moduleIdentifier) {
    hook = function(context) {
      context = context || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
      if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
        context = __VUE_SSR_CONTEXT__;
      }
      if (injectStyles2) {
        injectStyles2.call(this, context);
      }
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    };
    options._ssrRegister = hook;
  } else if (injectStyles2) {
    hook = shadowMode ? function() {
      injectStyles2.call(this, (options.functional ? this.parent : this).$root.$options.shadowRoot);
    } : injectStyles2;
  }
  if (hook) {
    if (options.functional) {
      options._injectStyles = hook;
      var originalRender = options.render;
      options.render = function renderWithStyleInjection(h2, context) {
        hook.call(context);
        return originalRender(h2, context);
      };
    } else {
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }
  return {
    exports: scriptExports,
    options
  };
}
const LAZY_LOAD_PLUGINS = { "./plugins/common.ts": () => import("./common.js"), "./plugins/constant.ts": () => import("./constant.js"), "./plugins/dybar.ts": () => import("./dybar.js"), "./plugins/line.ts": () => import("./line.js"), "./plugins/map.ts": () => import("./map.js"), "./plugins/map3d.ts": () => import("./map3d.js"), "./plugins/multi-line-bar-x.ts": () => import("./multi-line-bar-x.js"), "./plugins/pie.ts": () => Promise.resolve().then(function() {
  return pie$1;
}), "./plugins/ring.ts": () => import("./ring.js"), "./plugins/treemap.ts": () => import("./treemap.js") };
const script = {
  name: "KiEchartsPlus",
  props: {
    omit: { type: Number, default: 0 },
    rotate: { type: Number, default: 0 },
    zoomNum: { type: Number, default: 7 },
    type: { type: String, default: "pie" },
    cols: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    theme: { type: [String, Object] },
    locale: { type: String, default: "zh-cn" },
    renderer: { type: String, default: "canvas" },
    useDirtyRect: { type: Boolean, default: false },
    devicePixelRatio: { type: Number, default: window.devicePixelRatio }
  },
  data() {
    return {
      chart: null,
      chartId: "echarts-transition-id",
      setOptionFn: void 0
    };
  },
  created() {
    this.setOptionFn = debounce(this.resetOption, 500);
  },
  computed: {
    opts: function() {
      return {
        locale: this.locale,
        renderer: this.rendererType,
        devicePixelRatio: this.devicePixelRatio,
        useDirtyRect: this.useDirtyRect
      };
    }
  },
  plugins: {
    pie
  },
  watch: {
    opts: function() {
      this.chart && this.chart.dispose();
      this.init();
    },
    theme: function() {
      this.chart && this.chart.dispose();
      this.init();
    },
    type: function(newV, oldV) {
      if (this.isSimType(newV) === this.isSimType(oldV)) {
        this.chart && this.chart.clear();
      }
    },
    data: {
      handler: function() {
        this.setOptionFn();
      },
      deep: true
    }
  },
  mounted() {
    this.$refs.EchartsEl ? this.init() : this.$nextTick(() => this.init());
  },
  beforeDestroy() {
    this.chart && dt(this.$refs.EchartsEl);
    this.chart.dispose();
  },
  methods: {
    init() {
      this.chart = echarts.init(this.$refs.EchartsEl, this.theme, this.opts);
      ht(this.$refs.EchartsEl, () => {
        this.setOptionFn();
        this.chart.resize();
      });
      this.setOptionFn();
    },
    async resetOption() {
      if (!this.chart)
        return;
      let plugin = this.$options.plugins[this.type];
      if (!plugin) {
        try {
          let importPlugin = await LAZY_LOAD_PLUGINS[`./plugins/${this.type}.ts`]();
          plugin = this.$options.plugins[this.type] = importPlugin.default.default || importPlugin.default || importPlugin;
        } catch (error) {
          throw new Error(`\u672A\u627E\u5230\u3010${this.type}\u3011\u7C7B\u578B, \u76EE\u524DKiEchartsPlus\u4EC5\u652F\u6301pie,line,bar,dybar,multi-line-bar-x
          \u82E5\u6CA1\u6709\u6EE1\u610F\u7684\u7C7B\u578B\uFF0C\u53EF\u81EA\u5B9A\u4E49\u7C7B\u578Bplugin\uFF0C\u5E76\u4F7F\u7528KiEchartsPlus.use(plugin)\u6DFB\u52A0\u81EA\u5B9A\u4E49\u7C7B\u578B\u3002
          \u81EA\u5B9A\u4E49\u7C7B\u578B\u53EF\u53C2\u8003\u6280\u672F\u6587\u6863\uFF1Ahttps://github.com
          \uFF1A${error}`);
        }
      }
      const option = plugin.resetOption(this.cols, this.data, this);
      try {
        !plugin.isDynamic && this.chart.clear();
        this.chart.setOption(option);
      } catch (error) {
        if (error.message && error.message.indexOf("not be called during main process") > 0) {
          this.chart.dispose();
          this.chart.setOption(option);
        } else {
          throw new Error(error);
        }
      }
    },
    isSimType(type) {
      if (["line", "dybar", "multi-line-bar-x"].includes(type)) {
        return "xy";
      } else if (["pie", "ring"].includes(type)) {
        return "pie";
      } else if (["map", "treemap", "map3d"].includes(type)) {
        return "map";
      } else {
        return "unknow";
      }
    }
  }
};
const __cssModules = {};
var __component__ = /* @__PURE__ */ normalizeComponent(script, render, staticRenderFns, false, injectStyles, null, null, null);
function injectStyles(context) {
  for (let o2 in __cssModules) {
    this[o2] = __cssModules[o2];
  }
}
var KiEchartsPlus = /* @__PURE__ */ function() {
  return __component__.exports;
}();
KiEchartsPlus.install = (vue) => {
  vue.component(KiEchartsPlus.name, KiEchartsPlus);
};
function defineConfig(config) {
  return config;
}
KiEchartsPlus.addPlugin = (plugin) => {
  if (plugin.name in KiEchartsPlus.plugins) {
    throw Error(`pluginName is exist ${plugin.name} \u8BE5\u63D2\u4EF6\u540D\u5DF2\u5B58\u5728`);
  }
  KiEchartsPlus.plugins[plugin.name] = plugin;
  return KiEchartsPlus;
};
if (typeof window !== "undefined" && window.Vue) {
  KiEchartsPlus.install(window.Vue);
}
export { KiEchartsPlus, defineConfig };
