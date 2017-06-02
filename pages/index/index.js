import * as weplus from '../../weplus/index'
//index.js
//获取应用实例
var app = getApp()

class IndexPage2 extends weplus.Page {
    method2() {
        console.log('IndexPage2: method2');
    }
}

class IndexPage extends IndexPage2 {
    constructor() {
        super();
        this.data = {
            motto: 'Hello World',
            userInfo: {}
        }
    }

    bindViewTap() {
        console.log('IndexPage:tap');
    }

    method2() {
        console.log('IndexPage: method2');
    }

    $method3() {
        console.log('method3');
    }

    _method1() {
        console.log('method1');
    }

    onLoad() {
        super.onLoad(IndexPage);
        this._method1();

        console.log('onLoad')
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })

        // wx.setStorage({
        //     key: 'k1',
        //     data: 'd1',
        //     success: res => {
        //         console.log('set success %O', res)
        //         wx.getStorage({
        //             key: 'k1',
        //             success: res => {
        //                 console.log('get success %O', res);
        //             }
        //         });
        //     },
        //     fail: err => console.log('fail %O', err)
        // });

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

// Page({
//   data: {
//     motto: 'Hello World',
//     userInfo: {}
//   },
//   //事件处理函数
//   bindViewTap: function() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onLoad: function () {
//     console.log('onLoad')
//     var that = this
//     //调用应用实例的方法获取全局数据
//     app.getUserInfo(function(userInfo){
//       //更新数据
//       that.setData({
//         userInfo:userInfo
//       })
//     })
//   }
// })
