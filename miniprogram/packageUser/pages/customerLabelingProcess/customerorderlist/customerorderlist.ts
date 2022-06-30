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
    page:1,
    pageSize:10,
    offset:0,
    checkedIndex:0,
    isDataEnd:false,
    customerDetailId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
      this.setData({
        customerDetailId:options.id
      })
    this.getOrderListData(options.id)
  },
  openOrClose: function (event:any) {
    // console.log(event.currentTarget.dataset,this.data.boxData)
    var changeData =  'boxData['+event.currentTarget.dataset.index+'].ellipsis'

    this.setData({
      [changeData]: !event.currentTarget.dataset.ellipsis
    })
  },
  getOrderListData(customerDetailId:any){
    // console.log('顾客订单列表',this.data.page,this.data.pageSize);
    wx.showLoading({
        title: '加载中',
        mask:true
    })
    let _that=this;
    util.request(api.getOrderList+'?id='+customerDetailId).then(function (res:any) {
      if(res&&res.data){
        // let setData = _that.foramateArr(_that.data.boxData.concat(res.data.orderListDtos))
        res.data.forEach((item:any)=>{
          item.ellipsis = !item.ellipsis? false :true
          item.orderItem.forEach((e:any) => {
              if (e.orderTime) {
                  e.orderTime = e.orderTime.split(/\s+/)[0]
              }
          });
        })
        // console.log('我是处理之后的数据',setData);
        
        _that.setData({
          boxData:res.data
        })
        wx.hideLoading();//隐藏loading
      }
    }).catch(()=>{
        wx.hideLoading();//隐藏loading
    });
  },
  foramateArr(arr:any){
    let arr2 = arr.filter(function(element:any,index:any,self:any){
          return self.indexOf(element) === index;
      });
    return arr2;
  },
  goOrderDetail(e:any){
    wx.navigateTo({
      url: '../../customerLabelingProcess/customerorderdetail/customerorderdetail?orderNo='+e.currentTarget.dataset.id+'&id='+this.data.customerDetailId,
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
  }
})