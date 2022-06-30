var changeSvg2 = require('../../../utils/changeThemeColor');
let recommendApp = getApp<IAppOption>();
var util = require('../../../utils/util');
var api = require('../../../config/api')
var componSvg = require('../../../utils/changeThemeColor')
import { EventBusInstance } from '../../../utils/eventBus'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxQrcodeData: {},
    goodsInfo: {},
    shareData: {},
    themeColor: recommendApp.globalData.themeColor,
    recommends: [],
    outRecommends: [],
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    point: recommendApp.globalData.imageUrl + '/images/point.svg',
    empty: recommendApp.globalData.imageUrl + '/images/empty.svg',
    emptyBg: recommendApp.globalData.imageUrl + '/images/emptyBg.svg',
    showShare: false,
    page: 1,
    close: false,
    noMore: false,
    type: 1,
    outShow: false,
    list: [],

  },
  lifetimes: {
    attached() {
      console.log('23333333')

    }

  },
  //去下架列表
  goOutRecommendList() {
    wx.navigateTo({
      url: '/pages/recommend/outRecommend/outRecommend'
    })

  },
  changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
    changeSvg2.svgColor(url, color, type).then((res: any) => {
      this.setData({ [name]: res })
    })


  },
  swichNav(e: any) {
    var that = this;
    this.setData({})
    this.setData({ show: false, outShow: false })
    this.setData({ page: 1, recommends: [], outRecommends: [], list: [] });
    this.setData({ type: 1 })
    console.log(e.target.dataset.current)
    if (e.target.dataset.current == 1) {
      this.outRecommendation();


    } else {
      this.recommendationList();

    }
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // 关闭分享
  closeSharePosters() {
    this.setData({
      showShare: false
    })
  },
  // 打开分享
  openSharePosters(ev: any) {
    let that = this
    this.setData({
      wxQrcodeData: {},
      goodsInfo: ev.detail.item.itemInfo
    })
    let _userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    let _shopId = _userInfo.shop.id
    let _retailPrice = 0
    let _starPrice = 0
    ev.detail.item.itemInfo.itemPrice.forEach(item => {
      switch (item.saleType) {
        case 'P1':
          _retailPrice = item.salePrice
          break;
        case 'P3':
          break;
        case '23':
          _starPrice = item.salePrice
          break;
        default:
          break;
      }
    });
    let H5GoodsInfo = ev.detail.item.itemInfo
    let _params = H5GoodsInfo.catalogId + "," + H5GoodsInfo.itemId + ',' + H5GoodsInfo.itemType + ',' + _shopId
    let _themeColor = wx.getStorageSync('themeColor').substring(1)
    let _path = '/pages/pageDetail/index?shareParams=' + _params + '&tc=' + _themeColor
    let _data = JSON.parse(JSON.stringify(ev.detail.painting))
    _data.views[11].content = ev.detail.item.itemInfo && ev.detail.item.itemInfo.itemName
    _data.views[5].content = _userInfo.partnerProfile && _userInfo.partnerProfile.nickname
    _data.views[8].content = _retailPrice
    _data.views[9].content = _starPrice
    _data.views[12].url = _userInfo.partnerProfile.avatar || recommendApp.globalData.imageUrl + '/icons/accountPictures.png'
    _data.views[13].url = ev.detail.item.itemInfo && ev.detail.item.itemInfo.itemImage
    this.setData({
      painting: _data,
      showShare: true
    })

    let requestData = {
      catalogId: H5GoodsInfo.catalogId,
      itemId: H5GoodsInfo.itemId,
      itemType: H5GoodsInfo.itemType,
      shareKey: '',
      path: _path
    }
    util.showOtherToast('加载中', "loading");
    util.request(api.shareProduct + '/' + H5GoodsInfo.itemId, requestData, 'post').then((res: any) => {
      console.log('shareKey', res.data.shareKey)
      wx.setStorageSync('shareKey', res.data.shareKey)
      let _wxQrcodeData = {
        type: 'image',
        url:  res.data.wxQrcode,
        top: 350,
        left: 170,
        width: 50,
        height: 50,
        isBase64: true
      }
      this.setData({
        wxQrcodeData: _wxQrcodeData,
      })
      wx.hideToast();
    }).catch(() => {
      util.showOtherToast('加载失败');
    })

    // this.setData({
    //   painting: ev.detail
    // })
    // this.setData({
    //   showShare: true
    // })
  },
  getGuide() {
    var _this = this
    var partnerId = JSON.parse(wx.getStorageSync('userInfo')).shop.partnerId;
    util.request(api.isTipsGuide, { type: 1, partner_id: partnerId },
      'get').then(function (res: any) {
        console.log(res)
        if (res.data) {
          wx.setStorageSync('back', false);
          wx.navigateTo({
            url: '/packageRecommend/pages/firstTip/firstTip',
          })
        } else {
          if (_this.data.recommends.length >= 20) {
            wx.showToast()
          }
          wx.navigateTo({
            url: '/packageRecommend/pages/singleRecommend/singleRecommend'
          })
        }
      }).catch(() => {


      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    this.setData({ isLoad: true });
    // this.setData({
    //   point: changeSvg2.svgColor(this.data.point, recommendApp.globalData.themeColor),
    // })
    this.changeColor('point', this.data.point, recommendApp.globalData.themeColor)
    // this.getTips();
    //   wx.showToast({
    //     title: '推荐成功'
    // });
    var that = this;
    /**
     * 获取当前设备的宽高
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
    this.setData({ outRecommends: [], list: [] })

  },
  toClose() {
    var _this = this
    var partnerId = JSON.parse(wx.getStorageSync('userInfo')).shop.partnerId
    util.request(api.tipsGuideDone, { type: 3, partnerId: partnerId },
      'post').then(function (res: any) {
        _this.setData({ close: true })
      }).catch(() => {
      })
  },
  getTips() {
    console.log('********guide')
    var _this = this
    var partnerId = JSON.parse(wx.getStorageSync('userInfo')).shop.partnerId
    util.request(api.isTipsGuide, { type: 3, partner_id: partnerId },
      'get').then(function (res: any) {
        console.log(res, '********guide')
        if (res.data) {
          _this.setData({ close: false })
        } else {
          _this.setData({ close: true })
        }

      }).catch(() => {


      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  toList() {
    this.refreshList();
    this.setData({ type: 1 })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.recommendationList();
    util.getThemeColor().then((res: any) => {
      console.log('123456789', res);
      wx.setStorageSync('themeColor', res);
      console.log('此时缓存里的主题色======', wx.getStorageSync('themeColor'))
      recommendApp.globalData.themeColor = res;
      this.setData({ themeColor: res })

    })
    EventBusInstance.on('notification', (data: any) => {
      console.log('page index:', data)
      this.selectComponent("#notificationDialog").push(data)
    }, true)
    // this.setData({
    //   empty:componSvg.svgColor(this.data.empty, recommendApp.globalData.themeColor),

    // })
    this.changeColor('empty', this.data.empty, recommendApp.globalData.themeColor)
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
    var length = getCurrentPages().length;
    wx.navigateBack({
      delta: length - 2
    })
    // wx.redirectTo({ url: 'pages/index/index' })
    // console.log('fanuui')


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
    console.log(this.data.noMore)
    if (this.data.noMore) {
      return;
    }
    var page = this.data.page + 1;
    this.setData({ page: page })
    this.outRecommendation();


  },


  //获取已推荐列表
  recommendationList() {
    wx.showLoading({ title: '加载中' })
    var _this = this;
    console.log('!!!!!', wx.getStorageSync('userInfo'));
    let _userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    util.request(api.recommendationList, { shop_id: _userInfo.shop ? _userInfo.shop.id : 30 }).then((res: any) => {
      if (res.data.searchShopProductDtos && res.data.searchShopProductDtos.length > 0) {
        res.data.searchShopProductDtos.sort((a, b) => { return a.sequence - b.sequence })
        var arr = res.data.searchShopProductDtos
        arr.forEach(newItem => {
          console.log(newItem)
          newItem.itemInfo.itemPrice.forEach(cItem => {
            switch (cItem.saleType) {
              case 'P1':
                newItem.itemInfo.retailPrice = cItem.salePrice
                break;
              case 'P3':
                break;
              case '23':
                newItem.itemInfo.starPrice = cItem.salePrice
                break;
              default:
                break;
            }
          });
        });;


        _this.setData({ recommends: arr || [] })
        _this.setData({ show: true })

      } else {
        _this.setData({ show: true })
      }
    })
    wx.hideLoading();




  },
  refreshList() {

    this.setData({ show: false, outShow: false })
    this.setData({ page: 1, recommends: [], outRecommends: [], list: [] });
    this.setData({ type: 1 })
    if (this.data.currentTab == 1) {
      this.outRecommendation();
    } else {
      this.recommendationList();


    }
  },


  //获取取消推荐列表
  outRecommendation() {
    wx.showLoading({ title: '加载中' })
    var _this = this;
    let _userInfo = JSON.parse(wx.getStorageSync('userInfo'))

    util.request(api.outRecommendation, { shop_id: _userInfo.shop.id, size: 10, page: this.data.page }).then((res: any) => {

      var array = _this.data.outRecommends;
      var list = _this.data.list;
      // let getDate = new Date(1551187357000)
      var days: any;
      list = list.concat(res.data.content);
      if (this.data.outRecommends.length > 0) {
        days = this.data.outRecommends[this.data.outRecommends.length - 1].title;
      }
      if (res.data) {
        res.data.content.forEach((element, index) => {
          if (element.itemInfo && element.itemInfo.itemPrice) {
            element.itemInfo.itemPrice.forEach(cItem => {
              switch (cItem.saleType) {
                case 'P1':
                  element.itemInfo.retailPrice = cItem.salePrice
                  break;
                case 'P3':
                  break;
                case '23':
                  element.itemInfo.starPrice = cItem.salePrice
                  break;
                default:
                  break;
              }

            });
          }


          var getDate = new Date(element.createTime);
          var newDatas = getDate.getFullYear() + '年' + (getDate.getMonth() + 1) + '月'
          //  res.data.content[index].createTime = newDatas;

          if (days == newDatas) {

            var index1 = array.length
            console.log(element, index1, array[0])
            array[index1 - 1]['list'].push(element)
          } else {
            array.push({ title: newDatas, list: [element] })
          }
          days = newDatas;
        });
        var newArr = array
        _this.setData({ outRecommends: newArr, list: list })

      }
      console.log(this.data.list.length)
      if (res.data && res.data.total <= this.data.list.length) {
        _this.setData({ noMore: true })
      } else {
        _this.setData({ noMore: false })

      }
      wx.hideLoading();

      this.setData({ outShow: true, show: true })
    })

  },
  //调整顺序
  toAdjust() {
    // wx.setStorageSync('addGoodsData', this.data.recommends)
    // wx.navigateTo({url:'/packageRecommend/pages/recommendAdjust/recommendAdjust'})
    this.setData({ type: 4 })

  },
  //去单品推荐
  toRecommend() {
    // console.log(getCurrentPages())
    // var length = getCurrentPages();
    // wx.navigateBack({
    //   delta:length
    // })
    this.getGuide();


  }
  ,


})