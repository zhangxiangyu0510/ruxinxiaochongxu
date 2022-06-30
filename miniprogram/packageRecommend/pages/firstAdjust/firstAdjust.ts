// packageRecommend/pages/recommendAdjust/recommendAdjust.ts
// var changeSvg2 = require('../../../utils/changeThemeColor');
let recommendApp = getApp<IAppOption>();
var util = require('../../../utils/util');
var api = require('../../../config/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    themeColor: recommendApp.globalData.themeColor,
    isGuidance:false,
    list1:[],
    


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    this.setData({
      list:wx.getStorageSync('addGoodsData'),
      list1:[wx.getStorageSync('egItem')]
    })
    console.log(this.data.list1)
    if (option.isGuidance) {
      this.setData({
        isGuidance: true
      })
    }else{
      this.setData({
        isGuidance: false
      })

    }

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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },
  backPage() {
    // wx.navigateBack()
    var _this = this
    var partnerId = JSON.parse(wx.getStorageSync('userInfo')).shop.partnerId
    util.request(api.tipsGuideDone,{type:1,partnerId:partnerId},
      'post').then(function (res: any) {
       console.log(res)
        // wx.redirectTo({
        //   url: '/packageRecommend/pages/singleRecommend/singleRecommend',
        // })
        // wx.navigateBack();
        if(wx.getStorageSync('back')){
        wx.navigateBack({delta: 1})

        }else{
          wx.redirectTo({
            url: '/packageRecommend/pages/singleRecommend/singleRecommend'
          })
        }
        wx.setStorageSync('done',true);
        
      }).catch(() => {
       
  
      })
   
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage() {

  // },

 


 
})