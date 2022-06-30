// pages/customersStatistics/shopGoods/shopGoods.ts
// var changeSvg = require('../../../../utils/changeThemeColor');
let recommendApp = getApp<IAppOption>();
var util = require('../../../../utils/util');
var api = require('../../../../config/api')
var componSvg = require('../../../../utils/changeThemeColor')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lastDay:'',
    page:0,
    themeColor: recommendApp.globalData.themeColor,
    // zuo: changeSvg.svgColor('/images/icons/huangguan.svg', recommendApp.globalData.themeColor),
    // you: changeSvg.svgColor('/images/icons/beijing.svg', recommendApp.globalData.themeColor),
    item:{},
    noMore:false,
    goodsList:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var day = new Date();
    var lastDay = new Date(day.getTime()-24*60*60*1000).getFullYear()+'年'+(new Date(day.getTime()-24*60*60*1000).getMonth()+1)+'月'+new Date(day.getTime()-24*60*60*1000).getDate()+'日';
    this.setData({lastDay:lastDay})
    var item = wx.getStorageSync('noBuy');
    this.setData({item:item})
    console.log(item);
    this.getUserList();



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  getUserList(){
    util.request(api.userGoodsList, {userId:this.data.item.userId, page:this.data.page,size:10}).then((res: any) => {
      console.log(res,'######');
      // res.data.forEach(item => {
      //   item.lastAddCartTime = util.formatDateNoSecond(item.lastAddCartTime, false)
        
      // });
      this.setData({goodsList:res.data,loadding:false});
      if(res.data.length<10){
        this.setData({noMore:true})
      }
    }).catch(e=>{
      console.log(e,'@@@@')
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
    console.log('@@@@')
    if(this.data.noMore){
      return;
    }else{
      console.log('@@@@')
      var page = this.data.page;
      this.setData({page:page+1});
      this.getUserList();
    }


  }
})