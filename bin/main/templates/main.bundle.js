!function(n){var e={};function t(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return n[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=n,t.c=e,t.d=function(n,e,o){t.o(n,e)||Object.defineProperty(n,e,{enumerable:!0,get:o})},t.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},t.t=function(n,e){if(1&e&&(n=t(n)),8&e)return n;if(4&e&&"object"==typeof n&&n&&n.__esModule)return n;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var r in n)t.d(o,r,function(e){return n[e]}.bind(null,r));return o},t.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(e,"a",e),e},t.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},t.p="",t(t.s=0)}([function(n,e,t){"use strict";t.r(e);t(1);var o,r,a=document.getElementsByTagName("body")[0],i=document.createElement("p"),c=document.createElement("p");r=document.createDocumentFragment();!function(){var n=document.createElement("button");n.innerHTML="Start",n.classList.add("button");var e=document.createElement("button");e.innerHTML="Stop",e.classList.add("button");var t=document.createElement("nav"),r=document.createElement("ul"),l=document.createElement("li"),d=document.createElement("li");l.appendChild(n),d.appendChild(e),r.appendChild(l),r.appendChild(d),t.appendChild(r);var s=document.createElement("div");s.classList.add("container");var u=document.createElement("div");u.classList.add("header");var f=document.createElement("div");f.classList.add("content-body"),f.classList.add("content");var p=document.createElement("main");p.classList.add("content");var m=document.createElement("div");m.style.position="absolute",m.style.transform="translate(-50%, -50%)",m.style.top="50%",m.style.left="50%",i.classList.add("foreign"),c.classList.add("translate"),m.appendChild(i),m.appendChild(c),p.appendChild(m);var h=document.createElement("div");h.classList.add("footer"),f.appendChild(p),u.appendChild(t),s.appendChild(u),s.appendChild(f),s.appendChild(h),a.appendChild(s),n.addEventListener("click",(function(){new Promise((function(n,e){(o=new WebSocket("ws://localhost:8090/echoBasic")).onopen=function(){o.send("start"),n(o)},o.onerror=function(n){e(n)}})).then((function(n){n.onmessage=function(n){!function(n){if(n.phrase.includes(":")){var e=n.phrase.split(":");i.innerHTML=e[0],c.innerHTML="[ "+e[1]+" ]";var t=document.getElementById("audio");void 0!==t&&null!=t&&(console.log("audio exist"),a.removeChild(t));var o=document.createElement("audio");a.appendChild(o);var r="data:audio/wav;base64,"+n.audio;o.setAttribute("src",r),o.setAttribute("id","audio"),o.addEventListener("canplaythrough",(function(n){console.log("play"),o.play()}))}}(JSON.parse(n.data))},n.onclose=function(n){console.log("close websocket")}})).catch((function(n){console.log(n)}))})),e.addEventListener("click",(function(){o.send("stop")}))}()},function(n,e,t){var o=t(2),r=t(3);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[n.i,r,""]]);var a={insert:"head",singleton:!1},i=(o("!!../node_modules/css-loader/dist/cjs.js!./style.css",r,a),r.locals?r.locals:{});n.exports=i},function(n,e,t){"use strict";var o,r={},a=function(){return void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o},i=function(){var n={};return function(e){if(void 0===n[e]){var t=document.querySelector(e);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(n){t=null}n[e]=t}return n[e]}}();function c(n,e,t){n=t.base?n+t.base:n,r[n]||(r[n]=[]);for(var o=0;o<e.length;o++){var a=e[o],i={css:a[1],media:a[2],sourceMap:a[3]},c=r[n];c[o]?c[o].updater(i):c.push({updater:h(i,t)})}for(var l=e.length;l<r[n].length;l++)r[n][l].updater();r[n].length=e.length,0===r[n].length&&delete r[n]}function l(n){var e=document.createElement("style"),o=n.attributes||{};if(void 0===o.nonce){var r=t.nc;r&&(o.nonce=r)}if(Object.keys(o).forEach((function(n){e.setAttribute(n,o[n])})),"function"==typeof n.insert)n.insert(e);else{var a=i(n.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(e)}return e}var d,s=(d=[],function(n,e){return d[n]=e,d.filter(Boolean).join("\n")});function u(n,e,t,o){var r=t?"":o.css;if(n.styleSheet)n.styleSheet.cssText=s(e,r);else{var a=document.createTextNode(r),i=n.childNodes;i[e]&&n.removeChild(i[e]),i.length?n.insertBefore(a,i[e]):n.appendChild(a)}}function f(n,e,t){var o=t.css,r=t.media,a=t.sourceMap;if(r?n.setAttribute("media",r):n.removeAttribute("media"),a&&btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),n.styleSheet)n.styleSheet.cssText=o;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(o))}}var p=null,m=0;function h(n,e){var t,o,r;if(e.singleton){var a=m++;t=p||(p=l(e)),o=u.bind(null,t,a,!1),r=u.bind(null,t,a,!0)}else t=l(e),o=f.bind(null,t,e),r=function(){!function(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n)}(t)};return o(n),function(e){if(e){if(e.css===n.css&&e.media===n.media&&e.sourceMap===n.sourceMap)return;o(n=e)}else r()}}n.exports=function(n,e,t){return(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=a()),c(n,e,t),function(e){c(n,e||[],t)}}},function(n,e,t){(e=t(4)(!1)).push([n.i,'\nhtml, body {\n  margin : 0;\t\n  padding: 0;\n  background: rgb(238, 238, 236);\n \n}\n.button {\n  padding: 10px 15px;\n  font-size: 16px;\n  text-align: center;\n  cursor: pointer;\n  outline: none;\n  color: #fff;\n  background-color: #4CAF50;\n  border: none;\n  border-radius: 4px;\n  box-shadow: 0 3px #999;\n  margin-left : 10px;\n}\n\n.button:hover {background-color: #3e8e41}\n\n.button:active {\n  background-color: #3e8e41;\n  box-shadow: 0 2px #666;\n  transform: translateY(2px);\n}\n.container {\n\tdisplay: flex;\n\tflex-direction: column;\n\theight: 100vh;\n}\n.header{\n\tflex: 0 0 50px;\n\t background-color:#34495E\n}\n.content-body{\n  flex: 1 1 auto;\n  \n  display: flex;\n  flex-direction: row;\n}\n\n.content-body .content{\n  flex: 1 1 auto;\n  overflow: auto;\n  background: rgb(0, 0, 0);\n}\n.footer{\n  flex: 0 0 50px;\n  background: #34495E;\n}\n\nnav {\n\twidth: 100%;\n\tline-height: 1.4em;\n\t\n\tmargin-top : 8px;\n\tmargin-bottom : 8px;\n}\nul {\n\tlist-style: none;\n\tdisplay: block;\n\twidth: 100%;\n\tmargin: 0;\n\tpadding: 0;\n\ttext-align: justify;\n\tmargin-bottom: -1.4em;\n}\nul:after {\n\tcontent: "";\n\tdisplay: inline-block;\n\twidth: 100%;\n}\nli{\n\tdisplay: inline-block;\n}\n\n.foreign{\n\tdisplay : inline;\n\tcolor : #FFFFFF;\n\tfont-family: Arial, Verdana, sans-serif;\n\tfont-size : 88px;\n\tz-index : 999;\n}\n.translate{\n\tdisplay : inline;\n\tcolor : #FFFFFF;\n\tfont-family: Arial, Verdana, sans-serif;\n\tfont-size : 48px;\n\tz-index : 999;\n}\n',""]),n.exports=e},function(n,e,t){"use strict";n.exports=function(n){var e=[];return e.toString=function(){return this.map((function(e){var t=function(n,e){var t=n[1]||"",o=n[3];if(!o)return t;if(e&&"function"==typeof btoa){var r=(i=o,c=btoa(unescape(encodeURIComponent(JSON.stringify(i)))),l="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(c),"/*# ".concat(l," */")),a=o.sources.map((function(n){return"/*# sourceURL=".concat(o.sourceRoot).concat(n," */")}));return[t].concat(a).concat([r]).join("\n")}var i,c,l;return[t].join("\n")}(e,n);return e[2]?"@media ".concat(e[2]," {").concat(t,"}"):t})).join("")},e.i=function(n,t){"string"==typeof n&&(n=[[null,n,""]]);for(var o=0;o<n.length;o++){var r=[].concat(n[o]);t&&(r[2]?r[2]="".concat(t," and ").concat(r[2]):r[2]=t),e.push(r)}},e}}]);