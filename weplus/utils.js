
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