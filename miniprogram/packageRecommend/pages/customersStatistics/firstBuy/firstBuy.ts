// pages/customersStatistics/firstBuy/firstBuy.ts
// var changeSvg = require('../../../../utils/changeThemeColor');
let recommendApp = getApp<IAppOption>();
var util = require('../../../../utils/util');
var api = require('../../../../config/api')
// var componSvg = require('../../../../utils/changeThemeColor')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lastDay:'',
    page:0,
    goodsList:[],
    loadding:false,
    noMore:false,
    empty:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var day = new Date();
    var lastDay = new Date(day.getTime()-24*60*60*1000).getFullYear()+'年'+(new Date(day.getTime()-24*60*60*1000).getMonth()+1)+'月'+new Date(day.getTime()-24*60*60*1000).getDate()+'日';
    this.setData({lastDay:lastDay})
    this.getGoodsList();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  getGoodsList(){
    util.request(api.firstGoods, { page:this.data.page,size:10}).then((res: any) => {
      this.setData({goodsList:res.data,loadding:false});
      if(res.data.length<10){
        this.setData({noMore:true})
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    util.getThemeColor().then((res: any) => {
      console.log('123456789', res);
      wx.setStorageSync('themeColor', res);
      console.log('此时缓存里的主题色======', wx.getStorageSync('themeColor'))
      recommendApp.globalData.themeColor=res;
      this.setData({themeColor:res})
        
    })

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
    if(this.data.noMore){
      return;
    }else{
      var page = this.data.page+1;
      this.setData({page:page});
      this.getGoodsList();
    }

  }
})