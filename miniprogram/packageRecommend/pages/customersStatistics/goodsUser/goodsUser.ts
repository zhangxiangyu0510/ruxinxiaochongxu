// pages/customersStatistics/goodsUser/goodsUser.ts
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
    page:0,
    noMore:false,
    tabList:[{name:'加购未下单商品',id:1},{name:'加购未下单用户',id:2}],
    tabIndex:1,
    lastDay:'',
    goodsList:[],
    userList:[],
    loadding:false,
    // zuo: changeSvg.svgColor('/images/icons/huangguan.svg', recommendApp.globalData.themeColor),
    // you: changeSvg.svgColor('/images/icons/beijing.svg', recommendApp.globalData.themeColor),
    themeColor: recommendApp.globalData.themeColor,

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
  changeTab(e){
    console.log(e.currentTarget.dataset.item.id)
    this.setData({tabIndex:e.currentTarget.dataset.item.id,goodsList:[],userList:[],loadding:false,noMore:false,empty:false,page:0})
    if(this.data.tabIndex==1){
      this.getGoodsList();

    }else{
      this.getUserList();
      
    }

  },
  //去加购商品
  toShopGoods(e){
    var item = e.currentTarget.dataset.item
    console.log(e.currentTarget.dataset.item)
    wx.setStorageSync('shopGoods',item);
    wx.navigateTo({url:'/packageRecommend/pages/customersStatistics/shopGoods/shopGoods',query:{itemCode:item.itemCode}})

  },
  //去相情
  toUserDetail(e){
    var item = e.currentTarget.dataset.item
    console.log(e.currentTarget.dataset.item)
    wx.setStorageSync('noBuy',item);
    wx.navigateTo({url:'/packageRecommend/pages/customersStatistics/noBuyGoods/noBuyGoods',query:{itemCode:item.itemCode}})

  },

  //加购未下单用户
  getGoodsList(){
    this.setData({loadding:true})
    util.request(api.addNoPayGoods, { page:this.data.page,size:10}).then((res: any) => {
      console.log(res,'######');
      this.setData({goodsList:res.data,loadding:false});
      if(res.data.length<10){
        this.setData({noMore:true})
      }
    }).catch(e=>{
      console.log(e,'@@@@')
    })

  },
  //addNoPayGoods加购未下单商品
  getUserList(){
    this.setData({loadding:true})
    util.request(api.addNoPayUser, { page:this.data.page,size:10}).then((res: any) => {
      console.log(res,'######');
      this.setData({userList:res.data,loadding:false});
      if(res.data.length<10){
        this.setData({noMore:true})
      }
    }).catch(e=>{
      console.log(e,'@@@@')
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
      return ;
    }else{
      var page = this.data.page+1;
      this.setData({page:page})
      if(this.data.tabIndex==1){
        this.getGoodsList();
  
      }else{
        this.getUserList();
        
      }

    }
  
    

  }
})