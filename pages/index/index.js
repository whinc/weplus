import * as weplus from '../../weplus/index'
import { ButtonGroup } from '../../components/button-group/button-group'

//index.js
//获取应用实例
var app = getApp()

class IndexPage extends weplus.Page {
    constructor() {
        super();
        this.data = {
            motto: 'Hello World',
            userInfo: {},
            buttonGroup: null
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
        weplus.fetch('https://www.webank.com', init).then(res => {
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

    onLoad() {
        super.onLoad(IndexPage);
        var that = this

        this.setData({
            [ButtonGroup.name]: ButtonGroup
        });
        Object.getOwnPropertyNames(ButtonGroup).forEach(name => {
            if (typeof ButtonGroup[name] === 'function') {
                this[name] = ButtonGroup[name].bind(this.data[ButtonGroup.name]);
            }
        });

        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })

        weplus.promisify(wx.setStorage)({ key: 'k1', data: 'd1'}).then(res => {
            console.log('set success %O', res)
            return weplus.promisify(wx.getStorage)({ key: 'k1'});
        }).then(res => {
            console.log('get success %O', res)
            weplus.promisify(wx.clearStorage)().then(() => {
                console.log('clear storage');
            });
        });
    }
}

const indexPage = new IndexPage();
Page(indexPage);
