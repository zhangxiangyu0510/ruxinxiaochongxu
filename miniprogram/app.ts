var util = require('utils/util');
// var api = require('config/api');
import { EventBusInstance } from './utils/eventBus';
import { messageObj } from './utils/globalMessage'
App<IAppOption>({
  globalData: {
    fontFamily: 'Verlag',
    themeColor: '',
    messageList: [],
    // =======dev环境=======
    // h5DetailUrl: 'https://shop-h5-test.cn.nuskin.com/index.html#/',
    // imageUrl: 'https://myshop-dev-1259463275.cos.ap-shanghai.myqcloud.com/myshop/partner',
    // imageUrlUser: 'https://myshop-dev-1259463275.cos.ap-shanghai.myqcloud.com/myshop/user',
    // customerH5: 'https://dev.cn.nuskin.com',
    // staticFont:'https://myshop-dev-1259463275.cos.ap-shanghai.myqcloud.com',
    // shopAppId:'wx8a63e3382df92d5b',
    // SDKAppID: 1400661803,
    // =======dev环境=======
    // =======qa环境=======
    // h5DetailUrl: 'https://shop-h5-test.cn.nuskin.com/index.html#/',
    // imageUrl: 'https://myshop-dev-1259463275.cos.ap-shanghai.myqcloud.com/myshop/partner',
    // imageUrlUser: 'https://myshop-dev-1259463275.cos.ap-shanghai.myqcloud.com/myshop/user',
    // customerH5: 'https://1000112.cn.nuskin.com',
    // staticFont:'https://myshop-dev-1259463275.cos.ap-shanghai.myqcloud.com',
    // shopAppId:'wx8a63e3382df92d5b',
    // SDKAppID: 1400661803,
    // =======qa环境=======
    // =======stage环境=======
    imageUrl: 'https://myshop-stage-1259463275.cos.ap-shanghai.myqcloud.com/myshop/partner',
    h5DetailUrl: 'https://shop-h5-stage.cn.nuskin.com/index.html#/',
    customerH5: 'https://stage.cn.nuskin.com',
    imageUrlUser: 'https://myshop-stage-1259463275.cos.ap-shanghai.myqcloud.com/myshop/user',
    staticFont: 'https://myshop-stage-1259463275.cos.ap-shanghai.myqcloud.com',
    shopAppId: 'wx57f21fcac8dac900',
    SDKAppID: 1400661803,
    // =======stage环境=======
    // =======prod环境=======
    // imageUrl: 'https://myshop-prod-1259463275.cos.ap-shanghai.myqcloud.com/myshop/partner',
    // imageUrlUser: 'https://myshop-prod-1259463275.cos.ap-shanghai.myqcloud.com/myshop/user',
    // h5DetailUrl: 'https://shop-h5.cn.nuskin.com/index.html#/',
    // customerH5: 'https://china.nuskin.com',
    // staticFont: 'https://myshop-prod-1259463275.cos.ap-shanghai.myqcloud.com',
    // shopAppId: 'wx4c5241cbbf136e19',
    // SDKAppID: 1400686532,
    // =======prod环境=======
  },
  onLaunch() {
    EventBusInstance.on('global', (data: any) => {
      console.log('app.ts======:', data)
      messageObj.addNews(data)
    }, true);

    util.getThemeColor().then((res: any) => {
      console.log('123456789', res);
      wx.setStorageSync('themeColor', res || '#7340B3');
      console.log('此时缓存里的主题色======', wx.getStorageSync('themeColor'))
      this.globalData.themeColor = res;
      wx.switchTab({
        url: '/pages/index/index'
      });
      // 监听系统级事件
    }).catch(() => {
      wx.setStorageSync('themeColor', '#7340B3');
      this.globalData.themeColor = '7340B3';
      wx.switchTab({
        url: '/pages/index/index'
      })
    })
    // wx.request({
    //     url: api.getSkin,
    //     method: "GET",
    //     success: function (res: any) {
    //         console.log(res.data,"666666666666666");
    //         wx.setStorageSync("themeColor",res.data)
    //     }
    // })
    // 展示本地存储能力
    // wx.setStorageSync('themeColor', '#7340B3');
    // var _this = this;
    // if (wx.getStorageSync("cookie")) {
    //   util.request(api.getSkinDetail, {}).then((res: any) => {
    //     console.log('!!!!')
    //     console.log(res);
    //     wx.setStorageSync('themeColor', res.data.primaryColor);
    //     _this.globalData.themeColor = res.data.primaryColor;
    //     console.log(_this.globalData.themeColor)

    //   })
    //   console.log(this.globalData.themeColor)
    // } else {
    //   util.request(api.getSkin, {}).then((res: any) => {
    //     console.log('!!!!')
    //     console.log(res);
    //     wx.setStorageSync('themeColor', res.data);
    //     _this.globalData.themeColor = res.data;
    //     console.log(_this.globalData.themeColor);
    //   })
    //   console.log(this.globalData.themeColor)

    // }
    //加载字体
    wx.loadFontFace({
      global: true,
      family: this.globalData.fontFamily,
      source: `url("${this.globalData.staticFont}/myshop/staticFont/Verlag-Bold.ttf")`,
      success() {
      },
      fail: function () {
      },

    });
    wx.getSystemInfo({
      success: (result) => {
        if (result.platform !== "devtools") {
          console.log = () => { }
        }
      },
    })
  },
  onShow() {
    // wx.setStorageSync('showMessage',true);


  }

})