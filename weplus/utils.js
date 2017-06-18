

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

export { utils }