// pages/ucenter/myChange/myChange.ts
const indexAap = getApp<IAppOption>();
Page({
  onChange: function (event: any) {
    console.log(event.detail.index)
    this.setData({ activeId: event.detail.index })
  },
  departmentStoreChange(event: any) {
    this.setData({ typeIndex: event.target.dataset.type })
  },
  couponChange(event: any) {
    this.setData({ couponTypeIndex: event.target.dataset.type })
  },

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{ title: '全部兑换' }, { title: '百货' }, { title: '卡券' }],
    imageUrl:indexAap.globalData.imageUrl,
    departmentStoreData:[{
      name:'全部',
      type:0
    },{
      name:'待发货',
      type:1
    },{
      name:'配送中',
      type:2
    },{
      name:'已完成',
      type:3
    }],
    couponData:[{
      name:'全部',
      type:0
    },{
      name:'已使用',
      type:1
    },{
      name:'未使用',
      type:2
    }],
    activeId: '0',
    typeIndex:0,
    couponTypeIndex:0


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