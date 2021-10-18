import * as echarts from "echarts";
Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: (t2, e) => {
    let n2 = false;
    return function(...r2) {
      let i2 = this;
      n2 || (setTimeout(function() {
        t2.apply(i2, r2), n2 = false;
      }, e), n2 = true);
    };
  }
});
Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: function(t2, e) {
    let n2 = [], r2 = 0, i2 = t2.length - 1, o2 = e.length - 1;
    for (; i2 >= 0 || o2 >= 0; ) {
      let s2 = Number(t2[i2--] || 0) + Number(e[o2--] || 0) + r2;
      n2.push(s2 % 10), r2 = Math.floor(s2 / 10);
    }
    return r2 > 0 && n2.push(r2), n2.reverse().join("");
  }
});
var n = function() {
  if (typeof Map != "undefined")
    return Map;
  function t2(t3, e) {
    var n2 = -1;
    return t3.some(function(t4, r2) {
      return t4[0] === e && (n2 = r2, true);
    }), n2;
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
      var n2 = t2(this.__entries__, e2), r2 = this.__entries__[n2];
      return r2 && r2[1];
    }, e.prototype.set = function(e2, n2) {
      var r2 = t2(this.__entries__, e2);
      ~r2 ? this.__entries__[r2][1] = n2 : this.__entries__.push([e2, n2]);
    }, e.prototype.delete = function(e2) {
      var n2 = this.__entries__, r2 = t2(n2, e2);
      ~r2 && n2.splice(r2, 1);
    }, e.prototype.has = function(e2) {
      return !!~t2(this.__entries__, e2);
    }, e.prototype.clear = function() {
      this.__entries__.splice(0);
    }, e.prototype.forEach = function(t3, e2) {
      e2 === void 0 && (e2 = null);
      for (var n2 = 0, r2 = this.__entries__; n2 < r2.length; n2++) {
        var i2 = r2[n2];
        t3.call(e2, i2[1], i2[0]);
      }
    }, e;
  }();
}(), r = typeof window != "undefined" && typeof document != "undefined" && window.document === document, i = typeof global != "undefined" && global.Math === Math ? global : typeof self != "undefined" && self.Math === Math ? self : typeof window != "undefined" && window.Math === Math ? window : Function("return this")(), o = typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(i) : function(t2) {
  return setTimeout(function() {
    return t2(Date.now());
  }, 1e3 / 60);
};
var s = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], a = typeof MutationObserver != "undefined", c = function() {
  function t2() {
    this.connected_ = false, this.mutationEventsAdded_ = false, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = function(t3, e) {
      var n2 = false, r2 = false, i2 = 0;
      function s2() {
        n2 && (n2 = false, t3()), r2 && c2();
      }
      function a2() {
        o(s2);
      }
      function c2() {
        var t4 = Date.now();
        if (n2) {
          if (t4 - i2 < 2)
            return;
          r2 = true;
        } else
          n2 = true, r2 = false, setTimeout(a2, e);
        i2 = t4;
      }
      return c2;
    }(this.refresh.bind(this), 20);
  }
  return t2.prototype.addObserver = function(t3) {
    ~this.observers_.indexOf(t3) || this.observers_.push(t3), this.connected_ || this.connect_();
  }, t2.prototype.removeObserver = function(t3) {
    var e = this.observers_, n2 = e.indexOf(t3);
    ~n2 && e.splice(n2, 1), !e.length && this.connected_ && this.disconnect_();
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
    r && !this.connected_ && (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), a ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = true), this.connected_ = true);
  }, t2.prototype.disconnect_ = function() {
    r && this.connected_ && (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = false, this.connected_ = false);
  }, t2.prototype.onTransitionEnd_ = function(t3) {
    var e = t3.propertyName, n2 = e === void 0 ? "" : e;
    s.some(function(t4) {
      return !!~n2.indexOf(t4);
    }) && this.refresh();
  }, t2.getInstance = function() {
    return this.instance_ || (this.instance_ = new t2()), this.instance_;
  }, t2.instance_ = null, t2;
}(), u = function(t2, e) {
  for (var n2 = 0, r2 = Object.keys(e); n2 < r2.length; n2++) {
    var i2 = r2[n2];
    Object.defineProperty(t2, i2, {
      value: e[i2],
      enumerable: false,
      writable: false,
      configurable: true
    });
  }
  return t2;
}, f = function(t2) {
  return t2 && t2.ownerDocument && t2.ownerDocument.defaultView || i;
}, h = _(0, 0, 0, 0);
function d(t2) {
  return parseFloat(t2) || 0;
}
function l(t2) {
  for (var e = [], n2 = 1; n2 < arguments.length; n2++)
    e[n2 - 1] = arguments[n2];
  return e.reduce(function(e2, n3) {
    return e2 + d(t2["border-" + n3 + "-width"]);
  }, 0);
}
function v(t2) {
  var e = t2.clientWidth, n2 = t2.clientHeight;
  if (!e && !n2)
    return h;
  var r2 = f(t2).getComputedStyle(t2), i2 = function(t3) {
    for (var e2 = {}, n3 = 0, r3 = ["top", "right", "bottom", "left"]; n3 < r3.length; n3++) {
      var i3 = r3[n3], o3 = t3["padding-" + i3];
      e2[i3] = d(o3);
    }
    return e2;
  }(r2), o2 = i2.left + i2.right, s2 = i2.top + i2.bottom, a2 = d(r2.width), c2 = d(r2.height);
  if (r2.boxSizing === "border-box" && (Math.round(a2 + o2) !== e && (a2 -= l(r2, "left", "right") + o2), Math.round(c2 + s2) !== n2 && (c2 -= l(r2, "top", "bottom") + s2)), !function(t3) {
    return t3 === f(t3).document.documentElement;
  }(t2)) {
    var u2 = Math.round(a2 + o2) - e, v2 = Math.round(c2 + s2) - n2;
    Math.abs(u2) !== 1 && (a2 -= u2), Math.abs(v2) !== 1 && (c2 -= v2);
  }
  return _(i2.left, i2.top, a2, c2);
}
var p = typeof SVGGraphicsElement != "undefined" ? function(t2) {
  return t2 instanceof f(t2).SVGGraphicsElement;
} : function(t2) {
  return t2 instanceof f(t2).SVGElement && typeof t2.getBBox == "function";
};
function b(t2) {
  return r ? p(t2) ? function(t3) {
    var e = t3.getBBox();
    return _(0, 0, e.width, e.height);
  }(t2) : v(t2) : h;
}
function _(t2, e, n2, r2) {
  return {
    x: t2,
    y: e,
    width: n2,
    height: r2
  };
}
var y = function() {
  function t2(t3) {
    this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = _(0, 0, 0, 0), this.target = t3;
  }
  return t2.prototype.isActive = function() {
    var t3 = b(this.target);
    return this.contentRect_ = t3, t3.width !== this.broadcastWidth || t3.height !== this.broadcastHeight;
  }, t2.prototype.broadcastRect = function() {
    var t3 = this.contentRect_;
    return this.broadcastWidth = t3.width, this.broadcastHeight = t3.height, t3;
  }, t2;
}(), m = function(t2, e) {
  var n2, r2, i2, o2, s2, a2, c2, f2 = (r2 = (n2 = e).x, i2 = n2.y, o2 = n2.width, s2 = n2.height, a2 = typeof DOMRectReadOnly != "undefined" ? DOMRectReadOnly : Object, c2 = Object.create(a2.prototype), u(c2, {
    x: r2,
    y: i2,
    width: o2,
    height: s2,
    top: i2,
    right: r2 + o2,
    bottom: s2 + i2,
    left: r2
  }), c2);
  u(this, {
    target: t2,
    contentRect: f2
  });
}, g = function() {
  function t2(t3, e, r2) {
    if (this.activeObservations_ = [], this.observations_ = new n(), typeof t3 != "function")
      throw new TypeError("The callback provided as parameter 1 is not a function.");
    this.callback_ = t3, this.controller_ = e, this.callbackCtx_ = r2;
  }
  return t2.prototype.observe = function(t3) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element != "undefined" && Element instanceof Object) {
      if (!(t3 instanceof f(t3).Element))
        throw new TypeError('parameter 1 is not of type "Element".');
      var e = this.observations_;
      e.has(t3) || (e.set(t3, new y(t3)), this.controller_.addObserver(this), this.controller_.refresh());
    }
  }, t2.prototype.unobserve = function(t3) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element != "undefined" && Element instanceof Object) {
      if (!(t3 instanceof f(t3).Element))
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
        return new m(t4.target, t4.broadcastRect());
      });
      this.callback_.call(t3, e, t3), this.clearActive();
    }
  }, t2.prototype.clearActive = function() {
    this.activeObservations_.splice(0);
  }, t2.prototype.hasActive = function() {
    return this.activeObservations_.length > 0;
  }, t2;
}(), w = typeof WeakMap != "undefined" ? new WeakMap() : new n(), O = function t(e) {
  if (!(this instanceof t))
    throw new TypeError("Cannot call a class as a function.");
  if (!arguments.length)
    throw new TypeError("1 argument required, but only 0 present.");
  var n2 = c.getInstance(), r2 = new g(e, n2, this);
  w.set(this, r2);
};
["observe", "unobserve", "disconnect"].forEach(function(t2) {
  O.prototype[t2] = function() {
    var e;
    return (e = w.get(this))[t2].apply(e, arguments);
  };
});
var E = i.ResizeObserver !== void 0 ? i.ResizeObserver : O, M = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : {};
var T = function(t2) {
  var e = typeof t2;
  return t2 != null && (e == "object" || e == "function");
}, j = typeof M == "object" && M && M.Object === Object && M, x = typeof self == "object" && self && self.Object === Object && self, A = j || x || Function("return this")(), S = A, R = function() {
  return S.Date.now();
}, z = /\s/;
var D = function(t2) {
  for (var e = t2.length; e-- && z.test(t2.charAt(e)); )
    ;
  return e;
}, W = /^\s+/;
var k = function(t2) {
  return t2 ? t2.slice(0, D(t2) + 1).replace(W, "") : t2;
}, N = A.Symbol, L = N, q = Object.prototype, F = q.hasOwnProperty, G = q.toString, B = L ? L.toStringTag : void 0;
var C = function(t2) {
  var e = F.call(t2, B), n2 = t2[B];
  try {
    t2[B] = void 0;
    var r2 = true;
  } catch (o2) {
  }
  var i2 = G.call(t2);
  return r2 && (e ? t2[B] = n2 : delete t2[B]), i2;
}, H = Object.prototype.toString;
var P = C, V = function(t2) {
  return H.call(t2);
}, I = N ? N.toStringTag : void 0;
var $ = function(t2) {
  return t2 == null ? t2 === void 0 ? "[object Undefined]" : "[object Null]" : I && I in Object(t2) ? P(t2) : V(t2);
}, U = function(t2) {
  return t2 != null && typeof t2 == "object";
};
var J = k, K = T, Q = function(t2) {
  return typeof t2 == "symbol" || U(t2) && $(t2) == "[object Symbol]";
}, X = /^[-+]0x[0-9a-f]+$/i, Y = /^0b[01]+$/i, Z = /^0o[0-7]+$/i, tt = parseInt;
var et = T, nt = R, rt = function(t2) {
  if (typeof t2 == "number")
    return t2;
  if (Q(t2))
    return NaN;
  if (K(t2)) {
    var e = typeof t2.valueOf == "function" ? t2.valueOf() : t2;
    t2 = K(e) ? e + "" : e;
  }
  if (typeof t2 != "string")
    return t2 === 0 ? t2 : +t2;
  t2 = J(t2);
  var n2 = Y.test(t2);
  return n2 || Z.test(t2) ? tt(t2.slice(2), n2 ? 2 : 8) : X.test(t2) ? NaN : +t2;
}, it = Math.max, ot = Math.min;
var st = function(t2, e, n2) {
  var r2, i2, o2, s2, a2, c2, u2 = 0, f2 = false, h2 = false, d2 = true;
  if (typeof t2 != "function")
    throw new TypeError("Expected a function");
  function l2(e2) {
    var n3 = r2, o3 = i2;
    return r2 = i2 = void 0, u2 = e2, s2 = t2.apply(o3, n3);
  }
  function v2(t3) {
    return u2 = t3, a2 = setTimeout(b2, e), f2 ? l2(t3) : s2;
  }
  function p2(t3) {
    var n3 = t3 - c2;
    return c2 === void 0 || n3 >= e || n3 < 0 || h2 && t3 - u2 >= o2;
  }
  function b2() {
    var t3 = nt();
    if (p2(t3))
      return _2(t3);
    a2 = setTimeout(b2, function(t4) {
      var n3 = e - (t4 - c2);
      return h2 ? ot(n3, o2 - (t4 - u2)) : n3;
    }(t3));
  }
  function _2(t3) {
    return a2 = void 0, d2 && r2 ? l2(t3) : (r2 = i2 = void 0, s2);
  }
  function y2() {
    var t3 = nt(), n3 = p2(t3);
    if (r2 = arguments, i2 = this, c2 = t3, n3) {
      if (a2 === void 0)
        return v2(c2);
      if (h2)
        return clearTimeout(a2), a2 = setTimeout(b2, e), l2(c2);
    }
    return a2 === void 0 && (a2 = setTimeout(b2, e)), s2;
  }
  return e = rt(e) || 0, et(n2) && (f2 = !!n2.leading, o2 = (h2 = "maxWait" in n2) ? it(rt(n2.maxWait) || 0, e) : o2, d2 = "trailing" in n2 ? !!n2.trailing : d2), y2.cancel = function() {
    a2 !== void 0 && clearTimeout(a2), u2 = 0, r2 = c2 = i2 = a2 = void 0;
  }, y2.flush = function() {
    return a2 === void 0 ? s2 : _2(nt());
  }, y2;
}, at = T;
var ct = function(t2, e, n2) {
  var r2 = true, i2 = true;
  if (typeof t2 != "function")
    throw new TypeError("Expected a function");
  return at(n2) && (r2 = "leading" in n2 ? !!n2.leading : r2, i2 = "trailing" in n2 ? !!n2.trailing : i2), st(t2, e, {
    leading: r2,
    maxWait: e,
    trailing: i2
  });
};
const ut = (() => {
  const t2 = new Map(), e = new E((e2) => {
    for (const n2 of e2)
      t2.get(n2.target)(n2);
  });
  return (n2, r2) => {
    !t2.has(n2) && r2 ? (t2.set(n2, ct(r2, 100)), e.observe(n2)) : (t2.delete(n2), e.unobserve(n2));
  };
})();
function ft(t2, e) {
  ut(t2, e);
}
function ht(t2) {
  ut(t2);
}
function _isPlaceholder(a2) {
  return a2 != null && typeof a2 === "object" && a2["@@functional/placeholder"] === true;
}
function _curry1(fn) {
  return function f1(a2) {
    if (arguments.length === 0 || _isPlaceholder(a2)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}
function _curry2(fn) {
  return function f2(a2, b2) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a2) ? f2 : _curry1(function(_b) {
          return fn(a2, _b);
        });
      default:
        return _isPlaceholder(a2) && _isPlaceholder(b2) ? f2 : _isPlaceholder(a2) ? _curry1(function(_a) {
          return fn(_a, b2);
        }) : _isPlaceholder(b2) ? _curry1(function(_b) {
          return fn(a2, _b);
        }) : fn(a2, b2);
    }
  };
}
function _curry3(fn) {
  return function f3(a2, b2, c2) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a2) ? f3 : _curry2(function(_b, _c) {
          return fn(a2, _b, _c);
        });
      case 2:
        return _isPlaceholder(a2) && _isPlaceholder(b2) ? f3 : _isPlaceholder(a2) ? _curry2(function(_a, _c) {
          return fn(_a, b2, _c);
        }) : _isPlaceholder(b2) ? _curry2(function(_b, _c) {
          return fn(a2, _b, _c);
        }) : _curry1(function(_c) {
          return fn(a2, b2, _c);
        });
      default:
        return _isPlaceholder(a2) && _isPlaceholder(b2) && _isPlaceholder(c2) ? f3 : _isPlaceholder(a2) && _isPlaceholder(b2) ? _curry2(function(_a, _b) {
          return fn(_a, _b, c2);
        }) : _isPlaceholder(a2) && _isPlaceholder(c2) ? _curry2(function(_a, _c) {
          return fn(_a, b2, _c);
        }) : _isPlaceholder(b2) && _isPlaceholder(c2) ? _curry2(function(_b, _c) {
          return fn(a2, _b, _c);
        }) : _isPlaceholder(a2) ? _curry1(function(_a) {
          return fn(_a, b2, c2);
        }) : _isPlaceholder(b2) ? _curry1(function(_b) {
          return fn(a2, _b, c2);
        }) : _isPlaceholder(c2) ? _curry1(function(_c) {
          return fn(a2, b2, _c);
        }) : fn(a2, b2, c2);
    }
  };
}
function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function _isObject(x2) {
  return Object.prototype.toString.call(x2) === "[object Object]";
}
var mergeWithKey = /* @__PURE__ */ _curry3(function mergeWithKey2(fn, l2, r2) {
  var result = {};
  var k2;
  for (k2 in l2) {
    if (_has(k2, l2)) {
      result[k2] = _has(k2, r2) ? fn(k2, l2[k2], r2[k2]) : l2[k2];
    }
  }
  for (k2 in r2) {
    if (_has(k2, r2) && !_has(k2, result)) {
      result[k2] = r2[k2];
    }
  }
  return result;
});
var mergeWithKey$1 = mergeWithKey;
var mergeDeepWithKey = /* @__PURE__ */ _curry3(function mergeDeepWithKey2(fn, lObj, rObj) {
  return mergeWithKey$1(function(k2, lVal, rVal) {
    if (_isObject(lVal) && _isObject(rVal)) {
      return mergeDeepWithKey2(fn, lVal, rVal);
    } else {
      return fn(k2, lVal, rVal);
    }
  }, lObj, rObj);
});
var mergeDeepWithKey$1 = mergeDeepWithKey;
var mergeDeepRight = /* @__PURE__ */ _curry2(function mergeDeepRight2(lObj, rObj) {
  return mergeDeepWithKey$1(function(k2, lVal, rVal) {
    return rVal;
  }, lObj, rObj);
});
var mergeDeepRight$1 = mergeDeepRight;
var pie = defineConfig({
  name: "pie",
  resetOption(cols, data) {
    const option = {
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
    return option;
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
const plugins = { "./plugins/line.ts": () => import("./line.js"), "./plugins/pie.ts": () => Promise.resolve().then(function() {
  return pie$1;
}) };
const script = {
  name: "KiEchartsPlus",
  props: {
    type: { type: String, default: "pie" },
    option: { type: Object, default: () => ({}) },
    cols: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] }
  },
  data() {
    return {
      chart: null
    };
  },
  plugins: {
    pie
  },
  watch: {
    type: function() {
      this.resetOption();
    },
    data: function() {
      this.resetOption();
    }
  },
  mounted() {
    this.$nextTick(() => this.init());
  },
  beforeDestroy() {
    this.chart && ht(this.$refs.EchartsEl) && this.chart.dispose();
  },
  methods: {
    init() {
      this.chart = echarts.init(this.$refs.EchartsEl);
      ft(this.$refs.EchartsEl, () => this.chart.resize());
      this.resetOption();
    },
    async resetOption() {
      let option = {};
      if (!this.$options.plugins[this.type]) {
        try {
          const plugin = await plugins[`./plugins/${this.type}.ts`]();
          this.$options.plugins[this.type] = plugin.default.default;
        } catch (error) {
          throw new Error(`\u672A\u627E\u5230\u3010${this.type}\u3011\u7C7B\u578B\uFF1A${error}`);
        }
      }
      option = this.$options.plugins[this.type].resetOption(this.cols, this.data);
      this.chart.clear();
      this.chart.setOption(mergeDeepRight$1(option, this.option));
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
var EchartsPlus = /* @__PURE__ */ function() {
  return __component__.exports;
}();
EchartsPlus.install = (vue) => {
  vue.component(EchartsPlus.name, EchartsPlus);
};
function defineConfig(config) {
  return config;
}
EchartsPlus.use = (plugin) => {
  if (plugin.name in EchartsPlus.plugins) {
    throw Error(`pluginName is exist ${plugin.name} \u8BE5\u63D2\u4EF6\u540D\u5DF2\u5B58\u5728`);
  }
  EchartsPlus.plugins[plugin.name] = plugin;
  return EchartsPlus;
};
if (typeof window !== "undefined" && window.Vue) {
  EchartsPlus.install(window.Vue);
}
export { EchartsPlus as default, defineConfig };
