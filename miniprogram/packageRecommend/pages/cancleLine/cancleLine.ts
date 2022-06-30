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
    goodsInfo: {},
    shareData: {},
    themeColor: recommendApp.globalData.themeColor,
    recommends: [],
    outRecommends: [],
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    point: recommendApp.globalData.imageUrl+'/images/point.svg',
    empty:recommendApp.globalData.imageUrl+'/images/empty.svg',
    emptyBg: recommendApp.globalData.imageUrl+'/images/emptyBg.svg',
    showShare: false,
    page: 1,
    close: false,
    noMore: false,
    type: 5,
    outShow: false,
    list:[],

  },
  lifetimes:{
    attached(){
      console.log('23333333')
      
    }

  },
  //去下架列表
  goOutRecommendList() {
    wx.navigateTo({
      url: '/pages/recommend/outRecommend/outRecommend'
    })

  },
  changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
    changeSvg2.svgColor(url, color,type).then((res:any)=>{
      this.setData({[name]:res})
    })


  },

  // 关闭分享
  closeSharePosters() {
    this.setData({
      showShare: false
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
    this.changeColor('point',this.data.point, recommendApp.globalData.themeColor)
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
    this.setData({ outRecommends: [],list:[] })

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
    var list = wx.getStorageSync('offProduct')
    list.itemPrices.forEach((item:any) => {
      console.log(item);
    switch (item.statement) {
      case '零售顾客价':
        list.retailPrice = item.salePrice
        break;
      case '优惠顾客价':
        break;
      case '星级顾客价':
        list.starPrice = item.salePrice
        break;
      default:
        break;
    }
  });


    
    this.setData({'recommends':list});
    console.log(list)
    // this.recommendationList();
    util.getThemeColor().then((res: any) => {
      console.log('123456789', res);
      wx.setStorageSync('themeColor', res);
      console.log('此时缓存里的主题色======', wx.getStorageSync('themeColor'))
      recommendApp.globalData.themeColor=res;
        
    })
    EventBusInstance.on('notification', (data: any) => {
      console.log('page index:', data)
      this.selectComponent("#notificationDialog").push(data)
  }, true)
    // this.setData({
    //   empty:componSvg.svgColor(this.data.empty, recommendApp.globalData.themeColor),

    // })
    this.changeColor('empty',this.data.empty, recommendApp.globalData.themeColor)
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


  },


  //获取已推荐列表
  recommendationList() {
    wx.showLoading({title:'加载中'})
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
        

        _this.setData({ recommends:arr|| [] })
        _this.setData({ show: true })

      } else {
        _this.setData({ show: true })
      }
    })
    wx.hideLoading();




  },
 



  


})