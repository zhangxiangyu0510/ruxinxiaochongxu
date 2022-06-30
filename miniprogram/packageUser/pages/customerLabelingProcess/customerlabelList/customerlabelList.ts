// pages/customerLabelingProcess/customerlabel/customerlabel.ts
var api=require('../../../../config/api')
var util = require('../../../../utils/util');
import { EventBusInstance } from '../../../../utils/eventBus'
const indexAap = getApp<IAppOption>();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeColor: wx.getStorageSync('themeColor'),
    arrayData: [],
    custormDetailId:'',
    custormDetail:false
  },
  getDataList () {
    let _that=this;
    util.request(api.getTagList).then(function (res:any) {
        // console.log('顾客标签一级列表',res);
      if(res&&res.data){
          let arr:any = []
          res.data.forEach((item:any) => {
              if (item.tagType==1) {
                  arr.push(item)
              }
          });
        _that.setData({
          arrayData:arr
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    // console.log('-------aaaa',options);
    this.setData({
        custormDetailId:options.customerDetailId,
        custormDetail:options.custormDetail=='true'?true:false,
    })
    this.getDataList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  goCustomerlabelList(e:any){
    wx.navigateTo({
      url: '../../customerLabelingProcess/customerlabel/customerlabel?tagId='+e.currentTarget.dataset.id+'&custormDetailId='+this.data.custormDetailId+'&custormDetail='+this.data.custormDetail,
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

  }
})