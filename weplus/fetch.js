
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
        obj.success = res => {
            resolve(new Response(res));
        };
        obj.fail = err => {
            reject(err);
        };
        wx.request(obj);
    });
}

export { fetch, Response }