/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return Object.assign(exports, __webpack_require__(__webpack_require__.s = 4).default);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Component; });

class Component {
    constructor(name = this.name, id = '') {
        this._name = name;
        this._id = id;
    }

    // 组件名称
    get NAME() {
        return this._name;
    }

    // 同类型组件实例的唯一标识
    get ID() {
        return this._id;
    }

    // 组件方法前缀
    get UNIQUE_NAME() {
        if (this.ID) {
            return `${this.NAME}_${this.ID}`;
        } else {
            return `${this.NAME}`;
        }
    }

    setState(obj) {
        const curPages = getCurrentPages();
        const curPage = curPages[curPages.length - 1];
        Reflect.ownKeys(obj).forEach(key => {
            // TODO：多层嵌套时需要优化
            this[key] = obj[key];
        });
        curPage.setData({
            [this.UNIQUE_NAME]: obj
        });
    }
}



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fetch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Response; });

/**
 * fetch API 返回的 Response 类型
 */
class Response {
    constructor(res) {
        this._res = res;
    }
    get data() {
        return this._res.data;
    }

    get headers() {
        return this._res.header;
    }

    get status() {
        return this._res.statusCode;
    }

    get ok() {
        return this.status >= 200 && this.status <= 299;
    }

    json() {
        return this._res.data;
    }

    text() {
        return this._res.data;
    }
}

const requestQueue = {
    // 请求队列
    _queue: [],
    // 最大并发数
    _maxN: 10,
    // 当前并发数
    _curN: 0,
    _exec() {
        if (this._curN >= this._maxN) {
            return;
        }     

        let restN = this._maxN - this._curN;
        let queueLen = this._queue.length;
        for (let i = 0; i < restN && i < queueLen; ++i) {
            let fn = this._queue.shift();
            ++this._curN;
            let action = () => {
                --this._curN;
                this._exec();
            };
            fn().then(action, action);
        }
    },
    add(fn) {
        if (typeof fn !== 'function') {
            throw new Error(fn + " is not a function");
        } 

        this._queue.push(fn);
        this._exec();
    },
    addList(...fns) {
        fns.forEach(fn => {
            if (typeof fn !== 'function') {
                throw new Error(fn + " is not a function");
            }
        });

        this._queue.push(...fns);
        this._exec()
    }
}

/**
 * 封装 wx.request 接口为 fetch API 接口
 * @param {string} input - 请求的 URL 地址
 * @param {Object=} init - 初始化参数
 * @return {Promise<Response>} 网络请求成功时返回 resolved promise；否则返回 rejected promise
 */
function fetch(input, init = {}) {
    const obj = Object.create(null);
    if (typeof input === 'string') {
        obj.url = input;
    }
    if (init.method !== undefined) {
        obj.method = init.method;
    }
    if (init.headers !== undefined) {
        obj.header = init.headers;
    }
    if (init.body !== undefined) {
        obj.data = init.body;
    }
    if (init.dataType !== undefined) {
        obj.dataType = init.dataType;
    }
    return new Promise((resolve, reject) => {
        let request = () => {
            return new Promise((resolve2, reject2) => {
                obj.success = res => {
                    let data = new Response(res);
                    resolve2(data);
                    resolve(data);
                };
                obj.fail = err => {
                    reject2(err);
                    reject(err);
                };
                wx.request(obj);
            })
        };
        requestQueue.add(request);
    });
}



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(5);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Page; });


class Page {
    constructor() {
        this._components = [];
    }

    onLoad(ChildPage) {
        const wxPage = this;

        // 重建原型链 
        // this                               WXPage
        //      -> ChildPage -> ... -> Page ->
        const originPrototype = Reflect.getPrototypeOf(wxPage);
        Reflect.setPrototypeOf(wxPage, ChildPage.prototype);    
        Reflect.setPrototypeOf(Page.prototype, originPrototype)

        // 拷贝原型方法到运行时 Page 实例对象，以便 wxml 事件绑定可以找到对应函数
        let curPrototype = ChildPage.prototype;
        while (curPrototype !== originPrototype) {
            Reflect.ownKeys(curPrototype).filter(key => {
                const isLifeCycleMethods = ['constructor', 'onLoad', 'onReady', 'onShow', 'onHide', 'onUnload'].indexOf(key) !== -1;
                const isPublicMethods = /^[a-zA-Z]/.test(key);
                return !isLifeCycleMethods && isPublicMethods;
            }).forEach(key => {
                if (!wxPage.hasOwnProperty(key)) {
                    wxPage[key] = curPrototype[key]
                } else {
                    __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* utils */].error(`duplicate key! ${curPrototype.constructor.name}.${key} has defined in page({...})`);
                }
            });
            curPrototype = Reflect.getPrototypeOf(curPrototype);
        }

        // 处理组件
        wxPage._components.forEach(component => {
            // Copy component methods to runtime page. 
            // Rename the component method to avoid name conflict.
            const proto = Reflect.getPrototypeOf(component);
            Object.getOwnPropertyNames(proto).forEach(methodName => {
                if (typeof proto[methodName] === 'function') {
                    const methodNameInPage = component.NAME + '_' + methodName;
                    if (!wxPage[methodNameInPage]) {
                        wxPage[methodNameInPage] = event => {
                            const id = event.target.dataset.id;
                            const targetComponent = wxPage._components.find(c => {
                                return component.NAME === c.NAME && (id === undefined || c.ID === id)
                            });
                            if (targetComponent ) {
                                proto[methodName].apply(targetComponent , arguments);
                            }
                        }
                    }
                }
            });

            // 将组件实例复制到 Page#data 下
            // 传入组件实例，组件事件响应函数中修改组件状态
            this.setData({ [component.UNIQUE_NAME]:  component});
        });

    }

    registerComponent(component) {
        this._components.push(component);
    }
}



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return promisify; });

const custom = Symbol()

/**
 * wx api promise 化
 * @param {function} wxfn - wx api
 * @return {Promise} 接口调用成功时，返回包含数据的 resolved promise；否则返回包含错误信息的 rejected promise
 * 
 * 使用示例：
 * 
 * promisify(wx.xxAPI)(args).then(data => {
 *      // handle data
 * }).catch(err => {
 *      // handle error
 * });
 */
const promisify = (wxfn) => {
    if (typeof wxfn !== 'function') {
        return null;
    }

    if (typeof wxfn[custom] === 'function') {
        return wxfn[custom]
    } 

    return (...args) => {
        return new Promise((resolve, reject) => {
            if (typeof args[0] !== 'object' || args[0] === null) {
                args[0] = {};
            }
            Object.assign(args[0], {
                success: data => resolve(data),
                fail: err => reject(err)
            });
            wxfn.call(wx, ...args)
        });
    }
}

promisify.custom = custom



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__promisify__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__fetch__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__component__ = __webpack_require__(0);





/* harmony default export */ __webpack_exports__["default"] = ({ Page: __WEBPACK_IMPORTED_MODULE_0__page__["a" /* Page */], Component: __WEBPACK_IMPORTED_MODULE_3__component__["a" /* Component */], promisify: __WEBPACK_IMPORTED_MODULE_1__promisify__["a" /* promisify */], fetch: __WEBPACK_IMPORTED_MODULE_2__fetch__["a" /* fetch */], Response: __WEBPACK_IMPORTED_MODULE_2__fetch__["b" /* Response */] });

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return utils; });


const DEBUG = true;
const TAG = 'weplus';

function _console(name, ...args) {
    if (DEBUG) {
        if (arguments[0] !== undefined) {
            arguments[0] = TAG + ':' + arguments[0];
        }
        console[name](...args);
    }
}

class utils {
    static error() {
        _console('error', ...arguments);
    }
    static log() {
        _console('log', ...arguments);
    }
    static warn() {
        _console('warn', ...arguments);
    }
}



/***/ })
/******/ ]);
//# sourceMappingURL=weplus.js.map