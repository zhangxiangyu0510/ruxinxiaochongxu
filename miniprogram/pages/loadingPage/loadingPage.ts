const loadingApp = getApp<IAppOption>();
var api = require('../../config/api')
var util = require('../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

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
            wx.setStorageSync('themeColor', res || '#7340B3');
            console.log('此时缓存里的主题色======', wx.getStorageSync('themeColor'))
            loadingApp.globalData.themeColor = res;
            wx.switchTab({
              url: '/pages/index/index'
            })
          }).catch(() => {
            wx.setStorageSync('themeColor', '#7340B3');
            loadingApp.globalData.themeColor = '7340B3';
            wx.switchTab({
              url: '/pages/index/index'
            })
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})