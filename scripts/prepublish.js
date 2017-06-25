const fs = require('fs')

const filename = './dist/weplus.js';
fs.access(filename, fs.constants.F_OK | fs.constants.W_OK | fs.constants.R_OK, (err) => {
    if (err) {
        console.log(filename + ' can not be accessed')
        return
    }
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('prepublish fail')
            return
        }

        const newData = data.replace(/return (__webpack_require__\(.*\))/g, (match, p1) => {
            return `return Object.assign(exports, ${p1}.default)`
        })

        fs.writeFile(filename, newData, (err) => {
            if (err) {
                console.error('prepublish fail')
                return
            }
            console.log('prepublish success')
        })
    })
})
