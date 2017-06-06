
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

export { promisify }