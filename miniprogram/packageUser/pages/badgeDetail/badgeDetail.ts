// pages/ucenter/badgeDetail/badgeDetail.ts
import { EventBusInstance } from '../../../utils/eventBus'
var util = require('../../../utils/util');
var api = require('../../../config/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    badgeDetailData:{},
    badgeGrades:[],
    badgeDetailImg:'',
    badgeDetailTip:'',
    themeColor:wx.getStorageSync("themeColor"),
    badgeProcessData:[
      {
        onWidth:'100%',
        onLevel:1
      },
      {
        onWidth:'100%',
        onLevel:2
      },
      {
        onWidth:'100%',
        onLevel:3
      },
      {
        onWidth:'50%',
        onLevel:4
      },
      {
        onLevel:5
      },
      {
        onLevel:6
      }
    ]
  },
  handleLevel(e:any){
    let level = e.currentTarget.dataset.level
    // console.log(level,e,1234,this.data.badgeGrades);
    this.data.badgeGrades.forEach((item:any)=>{
        if (item.level==level) {
            this.setData({
                badgeDetailImg : item.lighting?item.imageAchieve:item.imageNoAchieve,
                badgeDetailName:item.name?item.name:wx.getStorageSync("badgeDetail").name,
                badgeDetailTip : item.nextUpgradeDescription
            })
        }
    })
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
    EventBusInstance.on('notification', (data: any) => {
        console.log('page index:', data)
        this.selectComponent("#notificationDialog").push(data)
    }, true)
    util.request(api.getBadgeAll).then((res: any) => {
        console.log('获取所有徽章====',res);
        if(res&&res.data){
            let data = wx.getStorageSync("badgeDetail")
            res.data.forEach((item:any) => {
                item.badges.forEach((item1:any) => {
                    if (item1.badgeId == wx.getStorageSync("badgeDetail").badgeId) {
                        data = item1
                    }
                });
            });
            if (data) {
                wx.setNavigationBarTitle({
                    title:wx.getStorageSync("badgeDetail").name
                })
                data.badgeGrades.forEach((row:any) => {
                    if (data.lighting) {//外面的等级是点亮的状态
                        if (row.level<=data.level) {//小于等于这个等级全部是点亮
                            row.lighting = true
                        }else{
                            row.lighting = false
                        }
                    }else{//外面的等级未点亮，则所有的等级都是未点亮
                        row.lighting = false
                    }
                });
            }
            this.setData({
                badgeDetailImg:data.lighting?data.imageAchieve:data.imageNoAchieve,
                badgeDetailTip:data.nextUpgradeDescription?data.nextUpgradeDescription:'',
                badgeDetailName:data.multiGrade?data.badgeGradeName:data.name,
                badgeGrades:data.badgeGrades,
                badgeDetailData:data
            })
        }
    }).catch((e:any) => {
        console.log('eeeee',e);
        
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

  }
})