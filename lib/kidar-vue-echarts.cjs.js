"use strict";Object.defineProperty(exports,"__esModule",{value:!0});exports[Symbol.toStringTag]="Module";var et=require("echarts");function nt(t){if(t&&t.__esModule)return t;var e={__proto__:null,[Symbol.toStringTag]:"Module"};return t&&Object.keys(t).forEach(function(n){if(n!=="default"){var r=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(e,n,r.get?r:{enumerable:!0,get:function(){return t[n]}})}}),e.default=t,Object.freeze(e)}var rt=nt(et);Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:(t,e)=>{let n=!1;return function(...r){let i=this;n||(setTimeout(function(){t.apply(i,r),n=!1},e),n=!0)}}});Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:function(t,e){let n=[],r=0,i=t.length-1,o=e.length-1;for(;i>=0||o>=0;){let s=Number(t[i--]||0)+Number(e[o--]||0)+r;n.push(s%10),r=Math.floor(s/10)}return r>0&&n.push(r),n.reverse().join("")}});var P=function(){if(typeof Map!="undefined")return Map;function t(e,n){var r=-1;return e.some(function(i,o){return i[0]===n&&(r=o,!0)}),r}return function(){function e(){this.__entries__=[]}return Object.defineProperty(e.prototype,"size",{get:function(){return this.__entries__.length},enumerable:!0,configurable:!0}),e.prototype.get=function(n){var r=t(this.__entries__,n),i=this.__entries__[r];return i&&i[1]},e.prototype.set=function(n,r){var i=t(this.__entries__,n);~i?this.__entries__[i][1]=r:this.__entries__.push([n,r])},e.prototype.delete=function(n){var r=this.__entries__,i=t(r,n);~i&&r.splice(i,1)},e.prototype.has=function(n){return!!~t(this.__entries__,n)},e.prototype.clear=function(){this.__entries__.splice(0)},e.prototype.forEach=function(n,r){r===void 0&&(r=null);for(var i=0,o=this.__entries__;i<o.length;i++){var s=o[i];n.call(r,s[1],s[0])}},e}()}(),W=typeof window!="undefined"&&typeof document!="undefined"&&window.document===document,M=typeof global!="undefined"&&global.Math===Math?global:typeof self!="undefined"&&self.Math===Math?self:typeof window!="undefined"&&window.Math===Math?window:Function("return this")(),it=typeof requestAnimationFrame=="function"?requestAnimationFrame.bind(M):function(t){return setTimeout(function(){return t(Date.now())},1e3/60)},ot=["top","right","bottom","left","width","height","size","weight"],st=typeof MutationObserver!="undefined",ut=function(){function t(){this.connected_=!1,this.mutationEventsAdded_=!1,this.mutationsObserver_=null,this.observers_=[],this.onTransitionEnd_=this.onTransitionEnd_.bind(this),this.refresh=function(e,n){var r=!1,i=!1,o=0;function s(){r&&(r=!1,e()),i&&u()}function a(){it(s)}function u(){var f=Date.now();if(r){if(f-o<2)return;i=!0}else r=!0,i=!1,setTimeout(a,n);o=f}return u}(this.refresh.bind(this),20)}return t.prototype.addObserver=function(e){~this.observers_.indexOf(e)||this.observers_.push(e),this.connected_||this.connect_()},t.prototype.removeObserver=function(e){var n=this.observers_,r=n.indexOf(e);~r&&n.splice(r,1),!n.length&&this.connected_&&this.disconnect_()},t.prototype.refresh=function(){this.updateObservers_()&&this.refresh()},t.prototype.updateObservers_=function(){var e=this.observers_.filter(function(n){return n.gatherActive(),n.hasActive()});return e.forEach(function(n){return n.broadcastActive()}),e.length>0},t.prototype.connect_=function(){W&&!this.connected_&&(document.addEventListener("transitionend",this.onTransitionEnd_),window.addEventListener("resize",this.refresh),st?(this.mutationsObserver_=new MutationObserver(this.refresh),this.mutationsObserver_.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})):(document.addEventListener("DOMSubtreeModified",this.refresh),this.mutationEventsAdded_=!0),this.connected_=!0)},t.prototype.disconnect_=function(){W&&this.connected_&&(document.removeEventListener("transitionend",this.onTransitionEnd_),window.removeEventListener("resize",this.refresh),this.mutationsObserver_&&this.mutationsObserver_.disconnect(),this.mutationEventsAdded_&&document.removeEventListener("DOMSubtreeModified",this.refresh),this.mutationsObserver_=null,this.mutationEventsAdded_=!1,this.connected_=!1)},t.prototype.onTransitionEnd_=function(e){var n=e.propertyName,r=n===void 0?"":n;ot.some(function(i){return!!~r.indexOf(i)})&&this.refresh()},t.getInstance=function(){return this.instance_||(this.instance_=new t),this.instance_},t.instance_=null,t}(),k=function(t,e){for(var n=0,r=Object.keys(e);n<r.length;n++){var i=r[n];Object.defineProperty(t,i,{value:e[i],enumerable:!1,writable:!1,configurable:!0})}return t},O=function(t){return t&&t.ownerDocument&&t.ownerDocument.defaultView||M},F=$(0,0,0,0);function S(t){return parseFloat(t)||0}function q(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return e.reduce(function(r,i){return r+S(t["border-"+i+"-width"])},0)}function at(t){var e=t.clientWidth,n=t.clientHeight;if(!e&&!n)return F;var r=O(t).getComputedStyle(t),i=function(d){for(var h={},p=0,m=["top","right","bottom","left"];p<m.length;p++){var E=m[p],w=d["padding-"+E];h[E]=S(w)}return h}(r),o=i.left+i.right,s=i.top+i.bottom,a=S(r.width),u=S(r.height);if(r.boxSizing==="border-box"&&(Math.round(a+o)!==e&&(a-=q(r,"left","right")+o),Math.round(u+s)!==n&&(u-=q(r,"top","bottom")+s)),!function(d){return d===O(d).document.documentElement}(t)){var f=Math.round(a+o)-e,g=Math.round(u+s)-n;Math.abs(f)!==1&&(a-=f),Math.abs(g)!==1&&(u-=g)}return $(i.left,i.top,a,u)}var ct=typeof SVGGraphicsElement!="undefined"?function(t){return t instanceof O(t).SVGGraphicsElement}:function(t){return t instanceof O(t).SVGElement&&typeof t.getBBox=="function"};function ft(t){return W?ct(t)?function(e){var n=e.getBBox();return $(0,0,n.width,n.height)}(t):at(t):F}function $(t,e,n,r){return{x:t,y:e,width:n,height:r}}var ht=function(){function t(e){this.broadcastWidth=0,this.broadcastHeight=0,this.contentRect_=$(0,0,0,0),this.target=e}return t.prototype.isActive=function(){var e=ft(this.target);return this.contentRect_=e,e.width!==this.broadcastWidth||e.height!==this.broadcastHeight},t.prototype.broadcastRect=function(){var e=this.contentRect_;return this.broadcastWidth=e.width,this.broadcastHeight=e.height,e},t}(),lt=function(t,e){var n,r,i,o,s,a,u,f=(r=(n=e).x,i=n.y,o=n.width,s=n.height,a=typeof DOMRectReadOnly!="undefined"?DOMRectReadOnly:Object,u=Object.create(a.prototype),k(u,{x:r,y:i,width:o,height:s,top:i,right:r+o,bottom:s+i,left:r}),u);k(this,{target:t,contentRect:f})},dt=function(){function t(e,n,r){if(this.activeObservations_=[],this.observations_=new P,typeof e!="function")throw new TypeError("The callback provided as parameter 1 is not a function.");this.callback_=e,this.controller_=n,this.callbackCtx_=r}return t.prototype.observe=function(e){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if(typeof Element!="undefined"&&Element instanceof Object){if(!(e instanceof O(e).Element))throw new TypeError('parameter 1 is not of type "Element".');var n=this.observations_;n.has(e)||(n.set(e,new ht(e)),this.controller_.addObserver(this),this.controller_.refresh())}},t.prototype.unobserve=function(e){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if(typeof Element!="undefined"&&Element instanceof Object){if(!(e instanceof O(e).Element))throw new TypeError('parameter 1 is not of type "Element".');var n=this.observations_;n.has(e)&&(n.delete(e),n.size||this.controller_.removeObserver(this))}},t.prototype.disconnect=function(){this.clearActive(),this.observations_.clear(),this.controller_.removeObserver(this)},t.prototype.gatherActive=function(){var e=this;this.clearActive(),this.observations_.forEach(function(n){n.isActive()&&e.activeObservations_.push(n)})},t.prototype.broadcastActive=function(){if(this.hasActive()){var e=this.callbackCtx_,n=this.activeObservations_.map(function(r){return new lt(r.target,r.broadcastRect())});this.callback_.call(e,n,e),this.clearActive()}},t.prototype.clearActive=function(){this.activeObservations_.splice(0)},t.prototype.hasActive=function(){return this.activeObservations_.length>0},t}(),K=typeof WeakMap!="undefined"?new WeakMap:new P,L=function t(e){if(!(this instanceof t))throw new TypeError("Cannot call a class as a function.");if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");var n=ut.getInstance(),r=new dt(e,n,this);K.set(this,r)};["observe","unobserve","disconnect"].forEach(function(t){L.prototype[t]=function(){var e;return(e=K.get(this))[t].apply(e,arguments)}});var pt=M.ResizeObserver!==void 0?M.ResizeObserver:L,A=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},C=function(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")},vt=typeof A=="object"&&A&&A.Object===Object&&A,_t=typeof self=="object"&&self&&self.Object===Object&&self,B=vt||_t||Function("return this")(),gt=B,mt=function(){return gt.Date.now()},yt=/\s/,bt=function(t){for(var e=t.length;e--&&yt.test(t.charAt(e)););return e},wt=/^\s+/,Ot=function(t){return t&&t.slice(0,bt(t)+1).replace(wt,"")},x=B.Symbol,G=x,V=Object.prototype,Et=V.hasOwnProperty,Tt=V.toString,T=G?G.toStringTag:void 0,jt=function(t){var e=Et.call(t,T),n=t[T];try{t[T]=void 0;var r=!0}catch{}var i=Tt.call(t);return r&&(e?t[T]=n:delete t[T]),i},Mt=Object.prototype.toString,St=jt,$t=function(t){return Mt.call(t)},H=x?x.toStringTag:void 0,At=function(t){return t==null?t===void 0?"[object Undefined]":"[object Null]":H&&H in Object(t)?St(t):$t(t)},Dt=function(t){return t!=null&&typeof t=="object"},Rt=Ot,I=C,Wt=function(t){return typeof t=="symbol"||Dt(t)&&At(t)=="[object Symbol]"},Ct=/^[-+]0x[0-9a-f]+$/i,xt=/^0b[01]+$/i,zt=/^0o[0-7]+$/i,Nt=parseInt,Pt=C,z=mt,U=function(t){if(typeof t=="number")return t;if(Wt(t))return NaN;if(I(t)){var e=typeof t.valueOf=="function"?t.valueOf():t;t=I(e)?e+"":e}if(typeof t!="string")return t===0?t:+t;t=Rt(t);var n=xt.test(t);return n||zt.test(t)?Nt(t.slice(2),n?2:8):Ct.test(t)?NaN:+t},kt=Math.max,Ft=Math.min,qt=function(t,e,n){var r,i,o,s,a,u,f=0,g=!1,d=!1,h=!0;if(typeof t!="function")throw new TypeError("Expected a function");function p(l){var v=r,j=i;return r=i=void 0,f=l,s=t.apply(j,v)}function m(l){return f=l,a=setTimeout(w,e),g?p(l):s}function E(l){var v=l-u;return u===void 0||v>=e||v<0||d&&l-f>=o}function w(){var l=z();if(E(l))return N(l);a=setTimeout(w,function(v){var j=e-(v-u);return d?Ft(j,o-(v-f)):j}(l))}function N(l){return a=void 0,h&&r?p(l):(r=i=void 0,s)}function R(){var l=z(),v=E(l);if(r=arguments,i=this,u=l,v){if(a===void 0)return m(u);if(d)return clearTimeout(a),a=setTimeout(w,e),p(u)}return a===void 0&&(a=setTimeout(w,e)),s}return e=U(e)||0,Pt(n)&&(g=!!n.leading,o=(d="maxWait"in n)?kt(U(n.maxWait)||0,e):o,h="trailing"in n?!!n.trailing:h),R.cancel=function(){a!==void 0&&clearTimeout(a),f=0,r=u=i=a=void 0},R.flush=function(){return a===void 0?s:N(z())},R},Kt=C,Lt=function(t,e,n){var r=!0,i=!0;if(typeof t!="function")throw new TypeError("Expected a function");return Kt(n)&&(r="leading"in n?!!n.leading:r,i="trailing"in n?!!n.trailing:i),qt(t,e,{leading:r,maxWait:e,trailing:i})};const X=(()=>{const t=new Map,e=new pt(n=>{for(const r of n)t.get(r.target)(r)});return(n,r)=>{!t.has(n)&&r?(t.set(n,Lt(r,100)),e.observe(n)):(t.delete(n),e.unobserve(n))}})();function Bt(t,e){X(t,e)}function Gt(t){X(t)}function c(t){return t!=null&&typeof t=="object"&&t["@@functional/placeholder"]===!0}function y(t){return function e(n){return arguments.length===0||c(n)?e:t.apply(this,arguments)}}function b(t){return function e(n,r){switch(arguments.length){case 0:return e;case 1:return c(n)?e:y(function(i){return t(n,i)});default:return c(n)&&c(r)?e:c(n)?y(function(i){return t(i,r)}):c(r)?y(function(i){return t(n,i)}):t(n,r)}}}function J(t){return function e(n,r,i){switch(arguments.length){case 0:return e;case 1:return c(n)?e:b(function(o,s){return t(n,o,s)});case 2:return c(n)&&c(r)?e:c(n)?b(function(o,s){return t(o,r,s)}):c(r)?b(function(o,s){return t(n,o,s)}):y(function(o){return t(n,r,o)});default:return c(n)&&c(r)&&c(i)?e:c(n)&&c(r)?b(function(o,s){return t(o,s,i)}):c(n)&&c(i)?b(function(o,s){return t(o,r,s)}):c(r)&&c(i)?b(function(o,s){return t(n,o,s)}):c(n)?y(function(o){return t(o,r,i)}):c(r)?y(function(o){return t(n,o,i)}):c(i)?y(function(o){return t(n,r,o)}):t(n,r,i)}}}function D(t,e){return Object.prototype.hasOwnProperty.call(e,t)}function Q(t){return Object.prototype.toString.call(t)==="[object Object]"}var Vt=J(function(e,n,r){var i={},o;for(o in n)D(o,n)&&(i[o]=D(o,r)?e(o,n[o],r[o]):n[o]);for(o in r)D(o,r)&&!D(o,i)&&(i[o]=r[o]);return i}),Ht=Vt,It=J(function t(e,n,r){return Ht(function(i,o,s){return Q(o)&&Q(s)?t(e,o,s):e(i,o,s)},n,r)}),Ut=It,Xt=b(function(e,n){return Ut(function(r,i,o){return o},e,n)}),Jt=Xt,Y=tt({name:"pie",resetOption(t,e){return{legend:{data:t.map(r=>r.name)},series:[{type:"pie",radius:[0,"45%"],data:e}]}}}),Qt=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:Y}),Yt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"EchartsEl"})},Zt=[];function te(t,e,n,r,i,o,s,a){var u=typeof t=="function"?t.options:t;e&&(u.render=e,u.staticRenderFns=n,u._compiled=!0),r&&(u.functional=!0),o&&(u._scopeId="data-v-"+o);var f;if(s?(f=function(h){h=h||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,!h&&typeof __VUE_SSR_CONTEXT__!="undefined"&&(h=__VUE_SSR_CONTEXT__),i&&i.call(this,h),h&&h._registeredComponents&&h._registeredComponents.add(s)},u._ssrRegister=f):i&&(f=a?function(){i.call(this,(u.functional?this.parent:this).$root.$options.shadowRoot)}:i),f)if(u.functional){u._injectStyles=f;var g=u.render;u.render=function(p,m){return f.call(m),g(p,m)}}else{var d=u.beforeCreate;u.beforeCreate=d?[].concat(d,f):[f]}return{exports:t,options:u}}const ee={"./plugins/line.ts":()=>Promise.resolve().then(function(){return require("./line.js")}),"./plugins/pie.ts":()=>Promise.resolve().then(function(){return Qt})},ne={name:"KiEchartsPlus",props:{type:{type:String,default:"pie"},option:{type:Object,default:()=>({})},cols:{type:Array,default:()=>[]},data:{type:Array,default:()=>[]}},data(){return{chart:null}},plugins:{pie:Y},watch:{type:function(){this.resetOption()},data:function(){this.resetOption()}},mounted(){this.$nextTick(()=>this.init())},beforeDestroy(){this.chart&&Gt(this.$refs.EchartsEl)&&this.chart.dispose()},methods:{init(){this.chart=rt.init(this.$refs.EchartsEl),Bt(this.$refs.EchartsEl,()=>this.chart.resize()),this.resetOption()},async resetOption(){let t={};if(!this.$options.plugins[this.type])try{const e=await ee[`./plugins/${this.type}.ts`]();this.$options.plugins[this.type]=e.default.default}catch(e){throw new Error(`\u672A\u627E\u5230\u3010${this.type}\u3011\u7C7B\u578B\uFF1A${e}`)}t=this.$options.plugins[this.type].resetOption(this.cols,this.data),this.chart.clear(),this.chart.setOption(Jt(t,this.option))}}},Z={};var re=te(ne,Yt,Zt,!1,ie,null,null,null);function ie(t){for(let e in Z)this[e]=Z[e]}var _=function(){return re.exports}();_.install=t=>{t.component(_.name,_)};function tt(t){return t}_.use=t=>{if(t.name in _.plugins)throw Error(`pluginName is exist ${t.name} \u8BE5\u63D2\u4EF6\u540D\u5DF2\u5B58\u5728`);return _.plugins[t.name]=t,_};typeof window!="undefined"&&window.Vue&&_.install(window.Vue);exports.default=_;exports.defineConfig=tt;