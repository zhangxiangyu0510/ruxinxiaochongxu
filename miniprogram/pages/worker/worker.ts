// pages/worker/worker.ts
var changeSvg = require('../../utils/changeThemeColor');
const indexAap = getApp<IAppOption>();
var util = require('../../utils/util');
var api = require('../../config/api')
import { EventBusInstance } from '../../utils/eventBus'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopsProduct: [{ name: '单品推荐', path: '/packageRecommend/pages/myRecommend/myRecommend?refresh=true', icon: indexAap.globalData.imageUrl + '/icons/icon_1.svg' }, { name: '组合推荐', path: '/packageRecommend/pages/hybridRecommend/hybridRecommend', icon: indexAap.globalData.imageUrl + '/icons/icon_2.svg' }, { name: '顾客档案', path: '/packageUser/pages/customerLabelingProcess/customerlist/customerlist', icon: indexAap.globalData.imageUrl + '/icons/icon_3.svg' }, { name: '店铺预览', path: '/packageUser/pages/previewShop/index', icon: indexAap.globalData.imageUrl + '/icons/icon_4.svg' },  { name: '我的NU店', path: '/packageUser/pages/shopowner/shopowner', icon: indexAap.globalData.imageUrl + '/icons/icon_6.svg' },{ name: '店铺换肤', path: '/packageRecommend/pages/changeSkin/changeSkin', icon: indexAap.globalData.imageUrl + '/icons/icon_7.svg' }],
    // { name: '我的NU币', path: '/packageRecommend/pages/NUcoin/myNUcoin/myNUcoin', icon: indexAap.globalData.imageUrl + '/icons/icon_5.svg' },
    reportData: [{ name: '用户分析', icon: indexAap.globalData.imageUrl + "/icons/dashboard_3.svg", path: '/packageUser/pages/userAnalysis/userAnalysis' },{ name: '店铺分析', path: "/packageRecommend/pages/storeAnalysisPages/storeAnalysis/storeAnalysis", icon: indexAap.globalData.imageUrl + "/icons/dashboard_1.svg", },{ name: 'NU币分析', path: '/pages/ucenter/NUAnalyse/NUAnalyse', icon: indexAap.globalData.imageUrl + "/icons/dashboard_5.svg" }, { name: '商品分析', path: "/packageRecommend/pages/commodityAnalysisPages/commodityAnalysis/commodityAnalysis", icon: indexAap.globalData.imageUrl + "/icons/dashboard_2.svg" },  {
        name: '顾客统计', icon: indexAap.globalData.imageUrl + "/icons/dashboard_4.svg",
        path: '/packageRecommend/pages/customersStatistics/customersStatistics'
      },  { name: '店铺排名', path: '/packageRecommend/pages/storeRanking/storeRanking', icon: indexAap.globalData.imageUrl + "/icons/dashboard_6.svg", }],
    userInfo: {},
    path:new util.link()
  },
  //函数
  goRelativePage(e: any) {
    if (e.currentTarget.dataset.item.name == '店铺分析' ||e.currentTarget.dataset.item.name == '商品分析' ||e.currentTarget.dataset.item.name == '用户分析' || e.currentTarget.dataset.item.name == '顾客统计' || e.currentTarget.dataset.item.name == 'NU币分析' || e.currentTarget.dataset.item.name == '店铺排名' ) {
        wx.showToast({
          title: '功能开发中...',
          icon: 'none',
        });
      return;
      }
    var _this = this;
  
    util.checkLogin().then(() => {
      console.log(wx.getStorageSync('userInfo'))
      var userInfo = JSON.parse(wx.getStorageSync('userInfo'))
      if (e.currentTarget.dataset.item.name == '店铺换肤' && userInfo.shop.level < 2) {
        // 店铺换肤
        wx.showToast({ title: '请您再接再厉，获得V2店铺等级后解锁功能', icon: 'none' })
        return;
      }
      if (e.currentTarget.dataset.item.name == '单品推荐') {
        this.data.path.btnClick((res:any)=>{
          wx.navigateTo({
                  url: res
                })
        })

        // let _userInfo = JSON.parse(wx.getStorageSync('userInfo'))
        // util.request(api.recommendationList, { shop_id: _userInfo.shop ? _userInfo.shop.id : 30 }).then((res: any) => {
        //   if (res.data.searchShopProductDtos && res.data.searchShopProductDtos.length > 0) {
        //     wx.navigateTo({
        //       url: "/packageRecommend/pages/myRecommend/myRecommend"
        //     })
        //   } else {
        //     util.request(api.recommendationAll, {}, 'get').then((res: any) => {
        //       if (res.data) {
        //         wx.navigateTo({ url: '/packageRecommend/pages/offcialRecommend/offcialRecommend' })
        //         return;
        //       } else {
        //         wx.navigateTo({
        //           url: "/packageRecommend/pages/myRecommend/myRecommend"
        //         })
        //       }
        //     })
        //   }
        // })
        return;
      }
      wx.navigateTo({
        url: e.currentTarget.dataset.item.path,
      })
    }).catch(() => {
      util.getUserProfile()
    })
  },
  getShowStoreRanking() {
      util.request(api.getShow).then((res: any) => {
        if (res) {
          if (res.data != 0) {
            let arr = this.data.reportData.filter((item:any)=>{
                return item.name != '店铺排名'
            })
            this.setData({
              reportData: arr
            })
          }
        }
      }).catch((res: any) => {
        console.log(res);
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() { },
  toLink(){

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
    this.setData({path: new util.link()})
    EventBusInstance.on('notification', (data: any) => {
      console.log('worker', data)
      this.selectComponent("#notificationDialog").push(data)
    }, true)

    util.getUrl();
    this.selectComponent("#dialogProtocol").close();
    util.checkLogin().then(() => {
      console.log('登录了');
      this.setData({
        userInfo: JSON.parse(wx.getStorageSync('userInfo'))
      })
    //   登录成功查询店铺排名入口是否开启
      this.getShowStoreRanking()
    }).catch(() => {

    })
    this.data.shopsProduct.forEach((item, index) => {
      this.changeColorArray('shopsProduct', index, this.data.shopsProduct, 'icon', item.icon, indexAap.globalData.themeColor);


    })
    this.data.reportData.forEach((item, index) => {
      this.changeColorArray('reportData', index, this.data.reportData, 'icon', item.icon, indexAap.globalData.themeColor);

    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.selectComponent("#dialogProtocol").close();
  },
  changeColorArray(name: string, index: number, obj: any, key: any, url: string, color = '#EBEBEB', type = 'fill') {
    console.log(url, color, type)
    changeSvg.svgColor(url, color, type).then((res: any) => {
      obj[index][key] = res;
      var key = name + '[' + index + '].icon'
      console.log(key)
      this.setData({ [key]: res })
      console.log(obj);
      console.log(this.data)

    })
    // this.setData({[name[index]]:obj})


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
})