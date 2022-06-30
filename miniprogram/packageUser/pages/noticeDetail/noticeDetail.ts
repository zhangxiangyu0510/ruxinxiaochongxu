// packageUser/pages/noticeDetail/noticeDetail.ts
var api = require('../../../config/api');
var WxParse = require('../wxParse/wxParse.js');
import { EventBusInstance } from '../../../utils/eventBus'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeDetail: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */

    


  onLoad(options:any) {
    console.log(options)
    this.getNoticeDetail(options.id);

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


  getNoticeDetail(id: number | string) {
    console.log('jjajaj')
    let _this = this;
    wx.request({
      url: api.getNoticeDetail + id, //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        console.log(res.data)
        if (res.data.type == 1) {
          console.log('11111')
          WxParse.wxParse('article', 'html', res.data.content, _this, 5);

        }

        _this.setData({ noticeDetail: res.data })
      },
      fail(err) {
        console.log(err)
      }
    })

  }
})