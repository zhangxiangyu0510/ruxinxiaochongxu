var api = require('../../../config/api')
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proContent:[],
    singleProtocol:'',
    index:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    if(options.index){
      this.setData({
        index:options.index
      });
        if(wx.getStorageSync('loginProtocols')){
          this.setData({
            singleProtocol:wx.getStorageSync('loginProtocols')[options.index]['content']
          });
        }else{
          this.getProtocols();
        }
     
    }
    console.log('参数index',this.data.index);

  },
  getProtocols() {
    let that = this;
    util.showOtherToast('加载中',"loading");
    util.request(api.getNoLoginProtocols).then(function (res: any) {
      if (res && res.data) {
        wx.hideToast();
        that.setData({
          proContent: res.data.visitorTermsInfos,
          singleProtocol:res.data.visitorTermsInfos[that.data.index]['content']
        });
        wx.setStorageSync('loginProtocols',that.data.proContent);
      }
      console.log('隐私=====', that.data.proContent);
    });
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
})