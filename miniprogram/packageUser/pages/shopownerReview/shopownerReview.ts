// pages/ucenter/shopowner/shopowner.ts
var api = require('../../../config/api')
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // badgeData:[{name:'未来可期'},{name:'十分热爱'},{name:'开单大吉'},{name:'大有作为'}]
    thisShow: false,
    itemShow:{},
  },
  goEdit: function () {
    wx.navigateTo({
      url: '/packageUser/pages/userInfo/userInfo',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getConfig();
  },
  getConfig(){
    util.request(api.getShopConfig).then((res: any) => {
   console.log(res);
   this.setData({itemShow:res.data})
  }).catch((e:any) => {
      console.log('eeeee',e);
      
  })


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