# weplus

Weplus is a lightweight library for wexin mini program developement. Weplus 是一个轻量级的微信小程序开发库。

已实现特性:
* 小程序 API promise 化工具
* 支持 fetch API 风格的网络请求接口
* 支持网络请求队列
* 提供 Page 和 Component 基类，提供组件化集成方式

未来特性:
* 支持基于脏检查的数据更新
* 更多...


## 更新日志

**0.1.2**
* 修复 promisify 返回函数使用无参调用时，被错误的 resolve 的 bug

## 教程

### 1. 安装 weplus

通过 npm 或 yarn 安装[@whinc/weplus](https://www.npmjs.com/package/@whinc/weplus)
```bash
npm install @whinc/weplus
# or 
yarn add @whinc/weplus
```

将`node_modules/@whinc/weplus/dist/weplus.js`拷贝到你的项目中，例如放在根目录下的`lib/weplus.js`下，之后可在用到的地方导入：
```javascript
import weplus from './lib/weplus'
// or
const weplus = require('./lib/weplus')
```

### 2. Promise 化微信 API

微信异步 API 形参具有下面形式：
```javascript
wx.api({
    success: function() {}
    fail: function() {}
})
```

`weplus.promisify()`可将这种类型接口转换为返回`Promise`的接口：
```jvascript
weplus.promisify(wx.api)(parmas)
```

示例：
```javascript
weplus.promisify(wx.setStorage)({ key: 'k1', data: 'd1'}).then(res => {
    return weplus.promisify(wx.getStorage)({ key: 'k1'});
}).then(res => {
    console.log(res.data);  // 'd1'
});
```

对于不满足上面形参的 API，`weplus.promisify()`提供了自定义 Promise 化处理函数，只需要给你的函数加上自定义处理函数，属性名必须是`weplush.promisify.custom`提供的值，该函数内部控制如何 Promise 化。
```javascript
const doSomethingAsync = (name, callback) => {
    setTimeout(() => {
        callback('hello' + name)
    }, 1000)
}

doSomethingAsync[weplus.promisify.custom] = (name) => {
    return new Promise((resolve, reject) => {
        doSomethingAsync(name, (helloName) => {
            resolve(helloName)
        })
    })
}

weplus.promisify(doSomethingAsync) === doSomethingAsync[weplus.promisify.custom]    // true

weplus.promisify(doSomethingAsync)('Kit').then(helloName => {
    console.log(helloName)      // helloKit
})
```

3. fetch API & 无限制的网络接口调用

`weplus.fetch()`提供了与 Web 规范中定义的 [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 兼容的接口，你可以继续使用熟悉的 Web 标准 API。

请求接口，`fetch`返回一个`Promise`表示请求结果，示例：
```javascript
weplus.fetch('http://127.0.0.1:8888').then(res => {
    console.log("data: %s", res.text());
});
```

为请求指定额外的参数：
```javascript
let init = {
    headers: {
        'content-type': 'json'
    },
    dataType: 'json',
    method: 'POST',
    data: {
        name: 'whinc',
        age: 25
    }
};

weplus.fetch('https://www.baidu.com', init).then(res => {
    if (res.ok) {
        console.log('success:%O', res.text());
    } else {
        console.error('failed, status code: %d', res.status);
    }
}).catch(err => {
    console.error("error: %O", err);
});
```

使用`weplus.fetch()`接口你不用担心是否会超过微信限制的并发请求数，因为 weplus 内部实现了一个请求队列，所有`weplus.fetch()`接口请求都会先放到请求队列中，队列调度器会以微信允许的最大并发数依次调用请求队列中的请求任务。

下面是一段联系调用`weplus.fetch()`接口的示例：
```js
const n = 20;
for (let i = 1; i <= n; ++i) {
    weplus.fetch('http://127.0.0.1:8888/?n=' + i).then(res => {
        console.log("data: %s", res.text());
    });
}
```

在微信并发数为`5`的情况下，连续调用`20`次网络请求的结果如下：

![并发请求](./fetch.png)

4. Page 基类 


5. Component 基类 - 组件化

## 指南