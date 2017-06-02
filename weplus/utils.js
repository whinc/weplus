/**
 * wx api promise 化
 * @param {function} wxfn - wx api
 * @return {Promise} 接口调用成功时，返回包含数据的 resolved promise；否则返回包含错误信息的 rejected promise
 */
function promisify(wxfn) {
    if (typeof wxfn !== 'function') {
        return null;
    }
    return (...args) => {
        return new Promise((resolve, reject) => {
            if (typeof args[0] === 'object' && args[0] !== null) {
                Object.assign(args[0], {
                    success: data => resolve(data),
                    fail: err => reject(err)
                });
                wxfn(...args);
            } else {
                wxfn(...args);
                resolve();
            }
        });
    }
}

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

/**
 * 封装 wx.request 接口为 fetch API 接口
 * @param {string} input - 请求的 URL 地址
 * @param {Object} init - 初始化参数
 * @return {Promise<Response>} 网络请求成功时返回 resolved promise；否则返回 rejected promise
 */
function fetch(input, init) {

    return new Promise((resolve, reject) => {
        const obj = Object.create(null);

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
        obj.success = res => {
            resolve(new Response(res));
        };
        obj.fail = err => {
            reject(err);
        };
        wx.request(obj);
    });
}

export { promisify, fetch, Response }