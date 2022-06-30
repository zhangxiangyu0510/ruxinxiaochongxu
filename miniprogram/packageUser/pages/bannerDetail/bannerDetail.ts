// packageUser/pages/bannerDetail/bannerDetail.ts
import { EventBusInstance } from '../../../utils/eventBus';
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    console.log('options====', options)
    if (options.params) {
      let params = Object.assign(JSON.parse(options.params), util.getCommonArguments());
      console.log('12345===', params);
      this.setData({ url: `${options.url}?params=${encodeURIComponent(JSON.stringify(params))}` });
    } else {
      this.setData({ url: `${options.url}` });
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
    EventBusInstance.on('notification', (data: any) => {
      console.log('page index:', data)
      this.selectComponent("#notificationDialog").push(data)
    }, true)

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