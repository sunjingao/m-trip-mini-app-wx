module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1751267232845, function(require, module, exports) {
const u = /^1[3456789]\d{9}$/, m = /[\(\)\`\~\!\@\#\$\%\^\&\*\-\+\=\_\|\{\}\[\]\:\;\'\<\>\,\.\?\\]/, f = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[`~!@#$%^&*()-+=_|{}\[\]:;'<>,.?/])[\da-zA-Z`~!@#$%^&*()-+=_|{}\[\]:;'<>,.?/]{12,30}$/, g = /(^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}$)/, S = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/, $ = /^[a-zA-Z0-9]{15}|[a-zA-Z0-9]{18}|[a-zA-Z0-9]{20}$/;
function h(t) {
  return new Promise((o) => {
    const e = document.createElement("script");
    e.type = "text/javascript", e.src = t, e.onload = function() {
      o();
    }, document.head.appendChild(e);
  });
}
function l(t, o) {
  const e = Math.pow(10, o);
  return (Math.round(t * e) / e).toFixed(o);
}
function I(t, o) {
  return t ? t % 1 === 0 ? t / 1 : l(t / 100, o) : 0;
}
function C(t, o, e = "0") {
  let n = String(t);
  return n.length < o && (n = e.repeat(o - n.length) + n), n;
}
function R(t, o) {
  const e = document.createElement("a");
  e.href = URL.createObjectURL(t), e.target = "_blank", e.download = o, document.body.appendChild(e), e.click(), URL.revokeObjectURL(e.href), document.body.removeChild(e);
}
const w = {
  // 拼接url，参数为要拼接的对象
  // 如果值为undefined，则不会加入url中
  concat(t, o = {}) {
    let e = "";
    for (const [n, a] of Object.entries(o))
      a !== void 0 && (e === "" ? e = `${e}${n}=${encodeURIComponent(encodeURIComponent(JSON.stringify(a)))}` : e = `${e}&${n}=${encodeURIComponent(encodeURIComponent(JSON.stringify(a)))}`);
    return t.includes("?") ? `${t}&${e}` : `${t}?${e}`;
  },
  // 解析通过本对象中concat方法编译过的url参数，返回对象
  parse(t = location.href) {
    return t.includes("?") ? t.slice(t.indexOf("?") + 1).split("&").reduce((e, n) => {
      const [a, c] = n.split("=");
      return e[a] = JSON.parse(decodeURIComponent(decodeURIComponent(c))), e;
    }, {}) : {};
  }
};
let d = "";
const y = {
  init(t) {
    d = t;
  },
  getItem(t) {
    if (typeof localStorage > "u")
      return;
    let o = localStorage.getItem(d);
    if (o)
      return o = JSON.parse(o), o[t];
  },
  setItem(t, o) {
    if (typeof localStorage > "u" || o === void 0)
      return;
    let e = localStorage.getItem(d);
    e ? (e = JSON.parse(e), e[t] = o) : e = {
      [t]: o
    }, localStorage.setItem(d, JSON.stringify(e));
  },
  clear() {
    typeof localStorage > "u" || localStorage.removeItem(d);
  },
  removeItem: localStorage && localStorage.removeItem
}, r = navigator && navigator.userAgent || "", s = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(r), p = /Windows|Macintosh|Linux/i.test(r) && !s, i = {
  WeChatMini: "WeChatMini",
  // 微信小程序
  AlipayMini: "AlipayMini",
  // 支付宝小程序
  Android: "Android",
  // 安卓端
  Ios: "Ios",
  // ios端
  Mobile: "Mobile",
  // 移动端
  Pc: "Pc"
  // pc端
}, A = {
  ["is" + i.WeChatMini]: /miniProgram/i.test(r),
  // 微信小程序
  ["is" + i.AlipayMini]: /AlipayClient.*miniProgram/i.test(r),
  // 支付宝小程序
  ["is" + i.Android]: /Android/i.test(r),
  // andorid
  ["is" + i.Ios]: /iPhone|iPad|iPod/i.test(r),
  // ios
  ["is" + i.Mobile]: s,
  ["is" + i.Pc]: p
};
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });Object.defineProperty(exports, 'ALL_ENV', { enumerable: true, configurable: true, get: function() { return i; } });Object.defineProperty(exports, 'OperationUrl', { enumerable: true, configurable: true, get: function() { return w; } });Object.defineProperty(exports, 'RUN_ENV', { enumerable: true, configurable: true, get: function() { return A; } });Object.defineProperty(exports, 'Storage', { enumerable: true, configurable: true, get: function() { return y; } });Object.defineProperty(exports, 'customRound', { enumerable: true, configurable: true, get: function() { return l; } });Object.defineProperty(exports, 'downloadByBlob', { enumerable: true, configurable: true, get: function() { return R; } });Object.defineProperty(exports, 'downloadCdn', { enumerable: true, configurable: true, get: function() { return h; } });Object.defineProperty(exports, 'emailReg', { enumerable: true, configurable: true, get: function() { return S; } });Object.defineProperty(exports, 'idCardReg', { enumerable: true, configurable: true, get: function() { return g; } });Object.defineProperty(exports, 'passwordReg', { enumerable: true, configurable: true, get: function() { return f; } });Object.defineProperty(exports, 'phoneReg', { enumerable: true, configurable: true, get: function() { return u; } });Object.defineProperty(exports, 'specialCharReg', { enumerable: true, configurable: true, get: function() { return m; } });Object.defineProperty(exports, 'tinReg', { enumerable: true, configurable: true, get: function() { return $; } });Object.defineProperty(exports, 'transformCentToYuan', { enumerable: true, configurable: true, get: function() { return I; } });Object.defineProperty(exports, 'transformIntToLen', { enumerable: true, configurable: true, get: function() { return C; } });
















//# sourceMappingURL=mo-front-end-util.js.map

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1751267232845);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map