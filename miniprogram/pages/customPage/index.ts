// pages/customerPage1/index.ts
var util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    webViewSrc: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    console.log('options=====',options);
    if (options.url) {
      wx.setStorageSync('initRoute', options.url);
    }
    if(options.params){
      options.url +='?params='+options.params;
    }
    if(options.from=='nu'){
      options.url =JSON.parse(decodeURIComponent(options.url))
    }
    if (options.type=='enhome') { 
        console.log('我是悦家点数');
        options.url = decodeURIComponent(options.url);
        wx.setStorageSync('initRoute', options.url);
        options.url = options.url+'?token='+ wx.getStorageSync('access_token') +'&type=miniProgram&userType=2&deviceId='+ wx.getStorageSync('unionId') +'&shareKey=d7593bd727264432&flag=home'
    }
    if(options.flag=="activation"){
        options.url = options.url+'?type='+options.type;
    }
    // if(options.orderId){
    //   if (wx.getStorageSync('cookie')) {
    //     options.url = options.url+'?token='+ wx.getStorageSync('access_token') +'&type=miniProgram&userType=2&deviceId='+ wx.getStorageSync('unionId') +'&shareKey=d7593bd727264432&flag=home' 
    //   }else{
    //     util.getUserProfile();
    //   }
    // }
      this.setData({
        webViewSrc: options.url,
    });
 

  },
   getParams(url:any) {
    //我们只要问号后面的字符串
    var arr = url.split('?')
    // console.log(arr);
    var params = arr[1];
    //console.log(params);    //userName=yft&pwd=admin
    var arr1 = params.split('&');
    console.log(arr1);
    var o:any = {}
    //因为arr1里面有多个元素，都要切割，所以我们需要遍历循环。
    for (var i = 0; i < arr1.length; i++) {
      // console.log(arr[i]);
      var newArr = arr1[i].split('=');
      console.log(newArr);
      // newArr[0]    newArr[1]
      o[newArr[0]] = newArr[1];
    }
    return o;
  },
  bindLoadHandler: function (e:any) {
    console.log(e);
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