import { BasePage } from '../../weplus/index'
//index.js
//获取应用实例
var app = getApp()

class IndexPage2 extends BasePage {
    method2() {
        console.log('method2');
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
