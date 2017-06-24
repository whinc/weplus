// develop package
// import weplus from '../../weplus/index'
// publish package
import weplus from '../../dist/weplus'
import { ButtonGroup, ToggleButton } from '../../components/index'

//index.js
//获取应用实例
var app = getApp()

class IndexPage extends weplus.Page {
    constructor() {
        super();
        this.data = {
            motto: 'Hello World',
            userInfo: {}
        }
    }

    onClickFetchAPI() {
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
            console.log("response: %O", res);
            if (res.ok) {
                console.log('success:%O', res.text());
            } else {
                console.error('failed, status code: %d', res.status);
            }
        }).catch(err => {
            console.error("error: %O", err);
        });
    }

    onClickPage() {
        wx.navigateTo({
            url: '/pages/weplus-page/weplus-page'
        });
    }

    onClickNetRequest(event) {
        // 先运行命令 node server/server.js 启动接口测试服务
        const n = Number.parseInt(event.target.dataset.n);
        for (let i = 1; i <= n; ++i) {
            weplus.fetch('http://127.0.0.1:8888/?n=' + i).then(res => {
                console.log("data: %s", res.text());
            });
        }
    }

    onClickPromisify() {
        // promisify wx api
        weplus.promisify(wx.setStorage)({ key: 'k1', data: 'd1'}).then(res => {
            console.log('set success %O', res)
            return weplus.promisify(wx.getStorage)({ key: 'k1'});
        }).then(res => {
            console.log('get success %O', res)
            weplus.promisify(wx.clearStorage)().then(() => {
                console.log('clear storage');
            });
        });

        // promisify custom api 
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
        console.log('promisify:' + (weplus.promisify(doSomethingAsync) === doSomethingAsync[weplus.promisify.custom]))
        doSomethingAsync('Jim', helloName => console.log(helloName))
        weplus.promisify(doSomethingAsync)('Kit').then(helloName => console.log(helloName))
    }

    onLoad() {
        super.onLoad(IndexPage);
        var that = this

        // const buttonGroup = new ButtonGroup();
        // this.setData({
        //     [ButtonGroup.NAME]: buttonGroup
        // });
        // Object.getOwnPropertyNames(buttonGroup).forEach(name => {
        //     if (typeof buttonGroup[name] === 'function') {
        //         this[name] = ButtonGroup[name].bind(this.data[ButtonGroup.name]);
        //     }
        // });

        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
    }
}

const indexPage = new IndexPage();
indexPage.registerComponent(new ButtonGroup('ButtonGroup'));
indexPage.registerComponent(new ToggleButton('ToggleButton', '1'));
indexPage.registerComponent(new ToggleButton('ToggleButton', '2'));
Page(indexPage);
