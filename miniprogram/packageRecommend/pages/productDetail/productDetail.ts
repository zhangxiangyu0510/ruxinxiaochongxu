// pages/my/my.ts
const app = getApp<IAppOption>()
var api = require('../../../config/api')
var util = require('../../../utils/util');
import { EventBusInstance } from '../../../utils/eventBus'
Page({
  // onShareAppMessage() {
  //   // 分享
  //   let _detailFrom=this.data.detailFrom
  //   let _id = _detailFrom.id
  //   let _isOfficial = _detailFrom.isOfficial || false
  //   let operationType = _detailFrom.operationType
  //   let _newShareKey = this.data.newShareKey
  //   // setTimeout(() => {
  //   this.setData({
  //     isShare: true,
  //   })
  //   // }, 2000);
  //   const promise = new Promise(resolve => {
  //     resolve({
  //       title: _detailFrom.title,
  //       // path: `pages/productDetail/productDetail?id=${_id}&shareKey=${_newShareKey}`,
  //       path: `packageOne/pages/productDetail/productDetail?id=${_id}&isOfficial=${_isOfficial}&operationType=${operationType}&shareKey=${_newShareKey}`,
  //       imageUrl:_detailFrom.image

  //     })
  //   })
  //   this.setData({
  //     showShare: false,
  //   })
  //   return {
  //     title: '我是商品分享',
  //     path: `packageOne/pages/productDetail/productDetail?id=${_id}&isOfficial=${_isOfficial}&type=${_type}&shareKey=${_newShareKey}`,
  //     promise
  //   }
  // },
  // 关闭分享
  closeSharePosters() {
    this.setData({
      showShare: false
    })
  },
  // 打开分享
  openSharePosters(ev: any) {
    util.checkLogin().then(() => {
    }).catch(() => {
      util.getUserProfile();
    })
    let that = this
    that.setData({
      wxQrcodeData:{}
    })
    let _userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    // 先放首页
    let _id = this.data.detailFrom.id || this.data.detailFrom.officialRecommendationId
    let _shopId = _userInfo.shop.id
    if (!_id) {
      wx.showToast({
        title: '没有商品信息',
        icon: 'none',
        duration: 2000
      })
      return
    }

    let _isOfficial = this.data.detailFrom.isOfficial || false
    let operationType = this.data.detailFrom.operationType
    let _themeColor= wx.getStorageSync('themeColor').substring(1)
    let _data = JSON.parse(JSON.stringify(this.data.painting)) 
    _data.views[11].content = that.data.detailFrom.title
    _data.views[5].content = _userInfo.partnerProfile.nickname
    _data.views[8].content = that.data.detailFrom.retailPrice
    _data.views[9].content = that.data.detailFrom.starPrice

    _data.views[12].url = _userInfo.partnerProfile.avatar  || app.globalData.imageUrl+'/icons/accountPictures.png'
    if(!that.data.detailFrom.image.includes('http')){
      that.data.detailFrom.image='https:'+ that.data.detailFrom.image
    }
    _data.views[13].url = that.data.detailFrom.image
    that.setData({
      painting: _data,
      showShare: true,
    })
    let requstData = {
      id: _id,
      // path: `pages/index/index?id=${_id}&isOfficial=${_isOfficial}&type=${_type}`,
      path: `packageOne/pages/productDetail/productDetail?id=${_id}&shopId=${_shopId}&Off=${_isOfficial}&type=${operationType}&tc=${_themeColor}`,
      isOfficial: _isOfficial,
      operationType: operationType,
      shareKey: ''
    }
    util.showOtherToast('加载中', "loading");
    util.request(api.shareCombProduct + '/' + _id, requstData,'post').then((res: any) => {
      console.log('shareKey', res.data.shareKey)
      let _wxQrcodeData={
        type: 'image',
        url:  res.data.wxQrcode,
        top: 350,
        left: 170,
        width: 50,
        height: 50,
        isBase64: true
      }
      that.setData({
        newShareKey: res.data.shareKey,
        shareData: res.data,
        wxQrcode: res.data.wxQrcode || that.data.wxQrcode,
        wxQrcodeData:_wxQrcodeData
      })
      wx.hideToast();
    }).catch(() => {
      util.showOtherToast('加载失败');
    })
  },
  // 加入星级顾客
  toH5Join() {
    // util.getCommonArguments()
    let _path = 'pages/customerPage/index?url='+app.globalData.h5DetailUrl+'/#/starCustomer&params=' + encodeURIComponent(JSON.stringify(util.getCommonArguments()))
    wx.navigateToMiniProgram({
      appId: app.globalData.shopAppId,
      // path: 'pages/index/index?id=123',
      path: _path,
      extraData: {
        foo: 'bar'
      },
      envVersion: 'trial',
      success(res) {
        // 打开成功
      },
      fail(err) {
        wx.navigateBack()
        // 打开成功
      }
    })
  },
       // 跳转商品详情
       goH5Detail(e: any) {
        // console.log('right,e======',e);
        let addAgruments = {
          catalogId: e.currentTarget.dataset.item.catalogId,
          itemId: e.currentTarget.dataset.item.itemId,
          itemType: e.currentTarget.dataset.item.itemType
        };
        let params = Object.assign({}, addAgruments, util.getCommonArguments());
        wx.navigateTo({
          url: '/pages/customPage/index?url='+app.globalData.h5DetailUrl+'productDetail&params=' + encodeURIComponent(JSON.stringify(params))
        })
      },
  /**
   * 页面的初始数据
   */
  data: {
    wxQrcodeData:{},
    wxQrcode: '',
    themeColor: app.globalData.themeColor,
    detailFrom: {},
    showShare: false,
    newShareKey: '',
    goodsShareKey: '',
    painting: {
      width: 248,
      height: 418,
      background: '#fff',
      clear: true,
      views: [{
        type: 'rect',
        top: 0,
        left: 0,
        width: 248,
        height: 418,
        background: '#fff'
      },
      {
        type: 'rect',
        top: 40,
        left: 24,
        width: '200',
        height: '200',
        background: '#fff',
        borderRadius: 8
      },
      {
        type: 'rect',
        top: 360,
        left: 24,
        width: '36',
        height: '16',
        background: '#ccc',
        borderRadius: 8
      },
      {
        type: 'rect',
        top: 380,
        left: 24,
        width: '36',
        height: '16',
        background: '',
        borderRadius: 8
      },
      {
        type: 'arc',
        top: 250,
        left: 24,
        width: '25',
        height: '25',
        background: '#ccc',
      },

      {
        type: 'text',
        content: '蓝色的枫叶',
        fontSize: 12,
        lineHeight: 20,
        color: '#383549',
        textAlign: 'left',
        top: 258,
        left: 55,
        width: 150,
        MaxLineNumber: 1,
        breakWord: true,
        // bolder: true
      },
      {
        type: 'text',
        content: '向你推荐',
        fontSize: 10,
        lineHeight: 14,
        color: '#8c8c8c',
        textAlign: 'left',
        top: 290,
        left: 24,
        width: 50,
        MaxLineNumber: 1,

      },
      {
        type: 'text',
        content: '零售价',
        fontSize: 10,
        lineHeight: 14,
        color: '#fff',
        textAlign: 'left',
        top: 363,
        left: 27,
        // width: 50,
        MaxLineNumber: 1,
      },
      {
        type: 'text',
        content: '￥1200',
        fontSize: 10,
        lineHeight: 14,
        color: '#8c8c8c',
        textAlign: 'left',
        top: 365,
        left: 65,
        // width: 50,
        MaxLineNumber: 1,
      },
      {
        type: 'text',
        content: '￥1100',
        fontSize: 10,
        lineHeight: 14,
        color: '',
        textAlign: 'left',
        top: 385,
        left: 65,
        // width: 50,
        MaxLineNumber: 1,
      },
      {
        type: 'text',
        content: '星级价',
        fontSize: 10,
        lineHeight: 14,
        color: '#fff',
        textAlign: 'left',
        top: 383,
        left: 27,
        // width: 50,
        MaxLineNumber: 1,
      },
      {
        type: 'text',
        content: '如新优选滢白三效修护霜暂为非直销品',
        fontSize: 12,
        lineHeight: 14,
        color: '#4A4A4A',
        textAlign: 'left',
        top: 305,
        left: 24,
        width: 190,
        MaxLineNumber: 2,
        breakWord: true,
        // bolder: true
      },
      {
        type: 'image',
        url: '',
        top: 250,
        left: 24,
        width: 26,
        height: 26,
        borderRadius: 13,
      },
      {
        type: 'image',
        url: '',
        top: 40,
        left: 24,
        width: 200,
        height: 200,
      },


      ],
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    this.setData({
      goodsShareKey: options.shareKey || ''
    })
    options.shareKey ? wx.getStorageSync('goodsShareKey', options.shareKey) : wx.getStorageSync('goodsShareKey', '')
    console.log('111111', options, wx.getStorageSync('shopId'));

    this.getProductDetail(options)
  },
  getProductDetail(options: any) {
    let that = this
    util.request(api.optimizationDetail + options.id, {
      isOfficial: options.isOfficial,
      operationType:options.operationType
    }, 'get').then(function (res: any) {
      console.log('详情', res);
      if (res.data.shopProductItemList.length == 1) {
        res.data.image = res.data.shopProductItemList[0].image
        res.data.title = res.data.shopProductItemList[0].title
      }
      that.setData({
        detailFrom: res.data
      })
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      showShare: false,
    });
    this.selectComponent("#dialogProtocol").close();
    EventBusInstance.on('notification', (data: any) => {
      console.log('page index:', data)
      this.selectComponent("#notificationDialog").push(data)
  }, true)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.selectComponent("#dialogProtocol").close();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  }
})