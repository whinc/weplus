
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

export { fetch, Response }