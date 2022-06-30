const appOriginal = getApp<IAppOption>()
var changeSvg = require('../../utils/changeThemeColor');
var api = require('../../config/api')
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxQrcodeData:{},
    h5IntroductionData: {},
    hasPhone: false,
    noLogin: false,
    customerPhone: '',
    bg: '/images/icons/origin_bg.svg',
    showShare: false,
    goodsImage: '',
    goodsName: '',
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
        type: 'oneselfImage',
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
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // this.setData({
    //   bg: changeSvg.svgColor(this.data.bg, appOriginal.globalData.themeColor),
    // });
    let urlData = JSON.parse(decodeURIComponent(options.params));
    console.log('urlData====', urlData);
    util.checkLogin().then(() => {
      this.setData({
        noLogin: false,
      })
      console.log('options=====', JSON.parse(decodeURIComponent(options.params)));
      
      if (urlData && urlData.type == 1) {
        this.setData({
          h5IntroductionData: urlData.productInfo
        })
        util.showOtherToast('加载中', "loading");
        this.posterShow(urlData.productInfo)

      } else if (urlData && (urlData.type == 3 || urlData.type == 8)) {
        let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
        // this.setData({
        //   h5IntroductionData: urlData.productInfo
        // })
        // itemId，shareKey，itemType，catalogId
        // console.log('options',options)
        // catalogId: _h5IntroductionData.finalCatalog[0].id,
        // itemId: _h5IntroductionData.itemPrice[0].itemId,
        // itemType: _h5IntroductionData.itemType,
        let _shareKey=wx.getStorageSync('shareKey')
        // if(!urlData.productInfo && urlData.type == 3){
        //   wx.showToast({
        //     title: '没有商品信息',
        //     icon: 'none',
        //     duration: 2000
        //   })
        //   return
        // }
        let _path=''
        if(urlData.type == 3){
          _path = `pages/goodsDetail/goodsDetail?itemId=${urlData.productInfo.itemPrice[0].itemId}&shareKey=${_shareKey}&itemType=${urlData.productInfo.itemType}&catalogId=${urlData.productInfo.finalCatalog[0].id}`
        }
        if(urlData.type == 8){
          _path = `pages/cart/cart`
        }
      
        // let _path =''
        wx.navigateToMiniProgram({
          appId: appOriginal.globalData.shopAppId,
          // path: 'pages/index/index?id=123',
          path: _path,
          extraData: {
            // nuskinAuth:wx.getStorageSync('access_token'),
            // flag:'shopkeeper',
            foo: 'bar'
          },
          envVersion: 'trial',
          success(res) {
            wx.navigateBack({
              delta: 2
          })
            // 打开成功
          },
          	fail(err) {
              wx.navigateBack()
            // 打开成功
          }
        })

      }else if(urlData.type == 9){
        let _userInfo=JSON.parse(wx.getStorageSync('userInfo')) 

        let _mobile=_userInfo.partner.mobile
        if(_mobile){
          _mobile=   _mobile.slice(0, 3) + "*****" + _mobile.slice(8,11);
        }
        let addAgruments = {
          orderId: urlData.orderId,
          title: _userInfo.partnerProfile.nickname,
          mobile: _mobile
        };
        // let params = Object.assign({}, addAgruments, util.getCommonArguments());
        wx.navigateTo({
          url: `/pages/customPage/index?url=${appOriginal.globalData.h5DetailUrl}shoppingList&orderId=${addAgruments.orderId}&title=${addAgruments.title}&mobile=${addAgruments.mobile}` 
        })



      } else {
        //客服--剩余对接im
        this.onService();
      }
    }).catch(() => {
      if (urlData && urlData.type == 2) {
        this.onService();
      } else {
        // console.log('没登录11111');
        this.setData({
          noLogin: true,
        })
      }
    })
  },
  tapDialogButton(e: any) {
    //否
    if (e.detail.index == 0) {
      wx.navigateBack({});
      this.setData({
        noLogin: false,
      })
      // todo逻辑处理
    } else {
      this.setData({
        noLogin: false,
      });
      util.getUserProfile();
    }
  },
  onService() {
    var _that = this;
    util.request(api.customerService).then(function (res: any) {
      if (res && res.data) {
        _that.setData({
          customerPhone: res.data.ot,
          hasPhone: true,
        });
        // _that.triggerEvent('dialogevent',{params: true});
      }
    });
  },
  positionevent() {
    this.triggerEvent('dialogevent', { params: false });
    wx.navigateBack({});
  },
  // 关闭分享
  closeSharePosters() {
    this.setData({
      showShare: false
    })
    wx.navigateBack({});
  },
  // 分享海报显示
  posterShow(goodsInfo: any) {
    wx.hideToast();
    this.setData({
      wxQrcodeData:{}
    })
    let _shopInfo = JSON.parse(wx.getStorageSync('userInfo')) 
    let _h5IntroductionData = this.data.h5IntroductionData

    let _data = JSON.parse(JSON.stringify(this.data.painting))
    let _retailPrice = 0
    let _starPrice = 0
    goodsInfo.itemPrice.forEach(cItem => {
      switch (cItem.priceType) {
        case 'P1':
          _retailPrice = cItem.salePrice
          break;
        case 'P3':
          break;
        case '23':
          _starPrice = cItem.salePrice
          break;
        default:
          break;
      }
    });
    _data.views[11].content = goodsInfo.name || ''
    _data.views[5].content = _shopInfo.partnerProfile.nickname || ''
    _data.views[8].content = _retailPrice
    _data.views[9].content = _starPrice
    // _data.views[12].url = res.data.wxQrcode
    // _data.views[12].isBase64 = true
    // if (_shopInfo.partnerProfile.avatar) {
      _data.views[12].url = _shopInfo.partnerProfile.avatar || appOriginal.globalData.imageUrl+'/icons/accountPictures.png'
      _data.views[12].type = 'image'
    // }
    _data.views[13].url = goodsInfo.itemImages[0].fileUrl
    this.setData({
      painting: _data,
      showShare: true,
      goodsName: goodsInfo.name,
      goodsImage: goodsInfo.itemImages[0].fileUrl
    })
    let requstData = {
      catalogId: _h5IntroductionData.finalCatalog[0].id,
      itemId: _h5IntroductionData.itemPrice[0].itemId,
      itemType: _h5IntroductionData.itemType,
      path: ''
    }
    let _themeColor= wx.getStorageSync('themeColor').substring(1)
    let _params=_h5IntroductionData.finalCatalog[0].id+","+_h5IntroductionData.itemPrice[0].itemId+','+ _h5IntroductionData.itemType+','+_shopInfo.shop.id
    requstData.path = '/pages/pageDetail/index?shareParams=' +_params+'&tc='+_themeColor
    util.request(api.shareProduct + '/' + requstData.itemId, requstData,'post').then((res: any) => {
      wx.setStorageSync('shareKey',res.data.shareKey)
      let _wxQrcodeData={
        type: 'image',
        url:  res.data.wxQrcode,
        top: 350,
        left: 170,
        width: 50,
        height: 50,
        isBase64: true
      }
      this.setData({
        wxQrcodeData:_wxQrcodeData
      })
    })
    // }).catch(() => {
    //   console.log('我没登录了');
    //   util.getUserProfile();
    // });

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
    // this.posterShow()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  onShareAppMessage() {
    let _h5IntroductionData = this.data.h5IntroductionData
    let params = {
      catalogId: _h5IntroductionData.finalCatalog[0].id,
      itemId: _h5IntroductionData.itemPrice[0].itemId,
      itemType: _h5IntroductionData.itemType,
      token: null,
      nuskinToken: null,
      userInfo: null,
      shareKey: '',
      sessionInfo: {
        openId: wx.getStorageSync("openId") || null,
        unionid: wx.getStorageSync('unionId') || null,
      },
      fromType: 'customer'
    }
    const promise = new Promise(resolve => {
      resolve({
        title: this.data.goodsName,
        // path: `pages/productDetail/productDetail?id=${_id}&shareKey=${_newShareKey}`,
        path: '/pages/pageDetail/index?url='+appOriginal.globalData.h5DetailUrl+'productDetail&params=' + encodeURIComponent(JSON.stringify(params)),
        imageUrl: this.data.goodsImage
      })
    })
    return {
      title: this.data.goodsName,
      path: '/pages/pageDetail/index?url='+appOriginal.globalData.h5DetailUrl+'productDetail&params=' + encodeURIComponent(JSON.stringify(params)),
      imageUrl: this.data.goodsImage,
      promise
    }
  },

})