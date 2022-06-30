// pages/shopkeeperLevelProcess/mylevel/mylevel.ts
var api = require('../../../config/api')
var util = require('../../../utils/util');
let indexAap = getApp<IAppOption>();
import { EventBusInstance } from '../../../utils/eventBus'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    levelData:[],
    nowLevel:'',
    nowLevelImg:'',
    rightsAndInterests:{},//当前等级权益
    nextAchievementTips:'',
    themeColor: wx.getStorageSync('themeColor'),
  },
  getShopLevel(){
    util.request(api.getShopLevel).then((res: any) => {
        let level:any = JSON.parse(wx.getStorageSync('userInfo')).shop.level
        console.log('店铺等级====',res,res.data.achievementInfoList[level-1]);
        if(res&&res.data){
            this.setData({
                levelData:res.data.achievementInfoList,
                nextAchievementTips:res.data.nextAchievementTips,
                rightsAndInterests:res.data.achievementInfoList[level-1].ruleScript.newRightsAndInterests
            })
            if (res.data.achievementInfoList) {
                res.data.achievementInfoList.forEach((item:any) => {
                    if (item.level === JSON.parse(wx.getStorageSync('userInfo')).shop.level) {
                        this.setData({
                            nowLevelImg:item.levelImage
                        })
                    }
                });
            }
        }
    }).catch((e:any) => {
        console.log('eeeee',e);
        
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getShopLevel()
    if (wx.getStorageSync('userInfo')) {
        this.setData({
            nowLevel: JSON.parse(wx.getStorageSync('userInfo')).shop.level
        })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  goHierarchicalequity(){
    wx.navigateTo({
      url: '/packageUser/pages/hierarchicalequity/hierarchicalequity?levelData='+JSON.stringify(this.data.levelData),
    })
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