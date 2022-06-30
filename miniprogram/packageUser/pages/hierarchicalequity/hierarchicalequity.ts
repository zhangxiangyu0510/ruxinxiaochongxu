// pages/shopkeeperLevelProcess/hierarchicalequity/hierarchicalequity.ts
let indexAap = getApp<IAppOption>();
import { EventBusInstance } from '../../../utils/eventBus'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeColor: wx.getStorageSync('themeColor'),
    arrayData:[{
      name:'基本功能',
    },
    {
      name:'店铺换肤',
    },{
      name:'NU币奖励：100个',
    },{
      name:'NU币奖励：500个',
    },{
      name:'NU币奖励：1000个',
    },{
      name:'无',
    },{
      name:'优先兑换NU币',
    },{
      name:'品牌活动入围资格',
    }],
    levelData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    console.log('等级权益-----',JSON.parse(options.levelData));
    this.setData({
        levelData:JSON.parse(options.levelData)
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

})