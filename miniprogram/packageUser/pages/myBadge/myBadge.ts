// pages/ucenter/myBadge/myBadge.ts
var api = require('../../../config/api')
var util = require('../../../utils/util');
var changeSvgBadge = require('../../../utils/changeThemeColor');
const indexAapBadge = getApp<IAppOption>();
import { EventBusInstance } from '../../../utils/eventBus'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    badgeData: [],
    userInfo:{},
    infoTime:null as any,
    my_header_avater: indexAapBadge.globalData.imageUrl+"/userCenterIcon/defaultMyIcon.svg",
    themeColor:indexAapBadge.globalData.themeColor
  },
  
  goBadgeDetail(e:any){
    let item = e.currentTarget.dataset.item
    console.log('进入详情',item);
    
    wx.setStorageSync("badgeDetail",item)
    wx.navigateTo({
      url:`/packageUser/pages/badgeDetail/badgeDetail`
    })
  },
  getBadgeAll(){
    // util.request(api.getBadge).then((res: any) => {
    //     console.log('获取所有点亮的徽章====',res);
    //     // if(res&&res.data){
            
    //     // }
    // }).catch((e:any) => {
    //     console.log('eeeee',e);
        
    // })
    util.request(api.getBadgeAll).then((res: any) => {
        console.log('获取所有徽章====',res);
        if(res&&res.data){
            this.setData({
                badgeData:res.data
            })
        }
    }).catch((e:any) => {
        console.log('eeeee',e);
        
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.changeColor('my_header_avater',this.data.my_header_avater, indexAapBadge.globalData.themeColor, "stroke")
    this.getBadgeAll()
  },
  changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
    changeSvgBadge.svgColor(url, color,type).then((res:any)=>{
      this.setData({[name]:res})
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
    if (JSON.parse(wx.getStorageSync('userInfo'))) {
        EventBusInstance.on('notification', (data: any) => {
            console.log('page index:', data)
            this.selectComponent("#notificationDialog").push(data)
        }, true)
        let num = (Number(new Date().getTime()) - Number(JSON.parse(wx.getStorageSync('userInfo')).partnerProfile.createTime))/1000/24/3600
        this.setData({
            userInfo:JSON.parse(wx.getStorageSync('userInfo')),
            themeColor:indexAapBadge.globalData.themeColor,
            infoTime:Math.ceil(num)
        })
    }
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