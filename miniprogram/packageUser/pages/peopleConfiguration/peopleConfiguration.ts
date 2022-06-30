// miniprogram/pages/ucenter/peopleConfiguration/index.js
var api = require('../../../config/api')
var util = require('../../../utils/util');
Page({
  switchChange: function (event:any) {
    console.log(event.detail)
    // this.setData({ msg: "Hello World" })
  },
  /**
   * 页面的初始数据
   */
  data: {
    themeColor:wx.getStorageSync("themeColor"),
    show:false,
    textData: [
    //   {
    //   text: "粉丝数",
    //   status: true,
    //   remark:''
    // },
    // {
    //   text: "等级",
    //   status: false,
    //   remark:''
    // },{
    //   text: "开店时间",
    //   status: false,
    //   remark:''
    // },
        {
      text: "店主年限",
      status: true,
      remark:'',
      switchConf: {
        width:102,
        height:62,
        spotHeight:54,
        spotColor:"#ffffff",
        color: wx.getStorageSync("themeColor"),
        checked: true,
        disabled: false,
        noRadius: false,
      },
    },
    {
      text: "基本信息",
      status: false,
      remark:'姓名、性别、年龄、星座、经营年限、所在地、如新年资',
      switchConf: {
        width:102,
        height:62,
        spotHeight:54,
        spotColor:"#ffffff",
        color: wx.getStorageSync("themeColor"),
        checked: true,
        disabled: false,
        noRadius: false,
      },
    },
    // {
    //   text: "联系方式",
    //   status: false,
    //   remark:'店主电话、微信号、抖音号、微博号'
    // },
    {
      text: "店铺评分",
      status: false,
      remark:'',
      switchConf: {
        width:102,
        height:62,
        spotHeight:54,
        spotColor:"#ffffff",
        color: wx.getStorageSync("themeColor"),
        checked: true,
        disabled: false,
        noRadius: false,
      },
    },],
    age:false,
    information:false,
    score:false,
  

  },
  doSwitch: function(e:any) {
    console.log(e.currentTarget.dataset.index,e.detail,e.detail.checked)
    if(e.currentTarget.dataset.index==0){
      this.setData({age:e.detail.checked})
    }else if(e.currentTarget.dataset.index==1){
      this.setData({information:e.detail.checked})

    }else if(e.currentTarget.dataset.index==2){
      this.setData({score:e.detail.checked})

    }
    
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getConfig();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
        themeColor:wx.getStorageSync("themeColor")
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  getConfig(){
    wx.showLoading({title:'加载中'});
    util.request(api.getShopConfig).then((res: any) => {
      var textData = this.data.textData;
      textData[0].switchConf.checked=res.data.age;
      textData[1].switchConf.checked=res.data.information;
      textData[2].switchConf.checked=res.data.score;
      this.setData({'show':true,'textData':textData,'age':res.data.age,'information':res.data.information,score:res.data.score})
      wx.hideLoading();
      
  }).catch((e:any) => {
      console.log('eeeee',e);
      
  })


  },
  setConfig(){
    util.request(api.setShopConfig,{age:this.data.age,information:this.data.information,score:this.data.score},'put').then((res: any) => {
      console.log(res);
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      })
      // wx.navigateTo({url:'/packageUser/pages/shopowner/shopowner'})
      wx.navigateBack();
  }).catch((e:any) => {
   

      
  })

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})