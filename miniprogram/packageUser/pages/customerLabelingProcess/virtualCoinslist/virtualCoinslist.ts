// pages/customerLabelingProcess/customerorderlist/customerorderlist.ts
var api=require('../../../../config/api')
var util = require('../../../../utils/util');
const indexAap = getApp<IAppOption>();
import { EventBusInstance } from '../../../../utils/eventBus'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // ellipsis: false,
    // ellipsis1: true,
    themeColor: wx.getStorageSync('themeColor'),
    boxData: [],
    searchData:{
        pageNo:1,
        pageSize:100,
        userId:null as any
    },
    isDataEnd:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
      console.log('0000失效点数页面',options);
      this.setData({
          'searchData.userId':options.userId
      })
    this.getVirtualCoins()
      
  },
  getVirtualCoins(){
    let _that=this;
    util.request(api.getVirtualCoins,this.data.searchData).then(function (res:any) {
        console.log('--------getVirtualCoins',res);
      if(res&&res.data){
        _that.setData({
            boxData:res.data
        })
      }
    });
  },
  foramateArr(arr:any){
    let arr2 = arr.filter(function(element:any,index:any,self:any){
          return self.indexOf(element) === index;
      });
    return arr2;
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
    EventBusInstance.on('notification', (data: any) => {
        console.log('page index:', data)
        this.selectComponent("#notificationDialog").push(data)
    }, true)
    this.setData({
        themeColor:indexAap.globalData.themeColor
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
    this.setData({
      'searchData.pageNo':1
    })
    this.getVirtualCoins()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (!this.data.isDataEnd) {
    //   console.log('上拉了',this.data.page++);
      this.setData({
        'searchData.pageNo':this.data.searchData.pageNo++
      })
      
    }
  }
})