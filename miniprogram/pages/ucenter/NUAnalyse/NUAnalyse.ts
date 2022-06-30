// pages/ucenter/NUAnalyse/NUAnalyse.ts
const changeSvg = require('../../../utils/changeThemeColor');
var api = require('../../../config/api')
var util = require('../../../utils/util');
const appNUAnalyse = getApp<IAppOption>();

Page({
  changeTobs: function (event: any) {
    this.setData({
      pageNum: 1,
      loadingCompleted: false,
      salesUserRealtimeData: [],
      sisUsedRealtimeData: [],
      tabsIndex: event.currentTarget.dataset.item
    })
    if (event.currentTarget.dataset.item == 1) {
      this.getSalesUserRealtime()
    } else {
      this.getSisUsedRealtime()
    }
  },
  // 获取记录
  getSalesUserRealtime() {
    if (this.data.loadingCompleted) {
      wx.showToast({
        title: '已加载完所有记录',
        icon: 'none',
        duration: 2000
      })
      return
    }
    util.showOtherToast('加载中', "loading");
    let _data = {
      dateType: this.data.dateType,
      page: this.data.pageNum,
      size: 10
    }
    util.request(api.adsNucoinAnalysisIncomeRealtime, _data).then((res: any) => {
      if (!res.data || res.data.length == 0) {
        this.setData({
          loadingCompleted: true
        })
        return
      }
      res.data.forEach(item => {
        item.time = this.formatDate(item.incomeNuCoinTime)
      });
      // res.data.push(res.data[0])
      // res.data.push(res.data[0])
      // res.data.push(res.data[0])

      this.setData({
        salesUserRealtimeData: [...this.data.salesUserRealtimeData, ...res.data]
      })
      wx.hideToast();
    }).catch(() => {
      util.showOtherToast('加载失败');
    })
  },
  // 概况
  getSisIncomeRealtime() {
    util.showOtherToast('加载中', "loading");
    let _data = {
      dateType: this.data.dateType
    }
    util.request(api.adsNucoinAnalysisSalesUserRealtime, _data).then((res: any) => {
      res.data.expireTime = this.formatDate(res.data.willExpireNuCoinTime)
      this.setData({
        sisIncomeRealtimeData: res.data
      })
      wx.hideToast();
    }).catch(() => {
      util.showOtherToast('加载失败');
    })
  },
  // 消耗记录
  getSisUsedRealtime() {
    if (this.data.loadingCompleted) {
      wx.showToast({
        title: '已加载完所有记录',
        icon: 'none',
        duration: 2000
      })
      return
    }
    util.showOtherToast('加载中', "loading");
    let _data = {
      dateType: this.data.dateType,
      page: this.data.pageNum,
      size: 10
    }
    util.request(api.adsNucoinAnalysisUsedRealtime, _data).then((res: any) => {
      if (!res.data || res.data.length == 0) {
        this.setData({
          loadingCompleted: true
        })
        return
      }
      res.data.forEach(item => {
        item.time = this.formatDate(item.usedNuCoinTime)
      });
      // res.data.push(res.data[0])
      // res.data.push(res.data[0])
      // res.data.push(res.data[0])

      this.setData({
        sisUsedRealtimeData: [...this.data.sisUsedRealtimeData, ...res.data]
      })
      wx.hideToast();
    }).catch(() => {
      util.showOtherToast('加载失败');
    })
  },

  mounthChange(value: Object) {
    console.log(value.detail)
    let date = value.detail.value.replace('-', '年') + '月'
    let _dateType = value.detail.value.replace('-', '')
    console.log(date)
    this.setData({
      dateTime: date,
      dateType: _dateType
    })

  },
  onReachBottom() {
    if (this.data.loadingCompleted) {
      wx.showToast({
        title: '已加载完所有记录',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    if (this.data.tabsIndex == 1) {
      this.getSalesUserRealtime()
    } else {
      this.getSisUsedRealtime()
    }

  },

  // 时间格式转换
  formatDate(time: any, format = 'yyyy-MM-dd') {
    let date = new Date(time)
    var v = "";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var weekDay = date.getDay();
    var ms = date.getMilliseconds();
    var weekDayString = "";
    if (weekDay == 1) {
      weekDayString = "星期一";
    } else if (weekDay == 2) {
      weekDayString = "星期二";
    } else if (weekDay == 3) {
      weekDayString = "星期三";
    } else if (weekDay == 4) {
      weekDayString = "星期四";
    } else if (weekDay == 5) {
      weekDayString = "星期五";
    } else if (weekDay == 6) {
      weekDayString = "星期六";
    } else if (weekDay == 7) {
      weekDayString = "星期日";
    }
    v = format;
    //Year
    v = v.replace(/yyyy/g, year);
    v = v.replace(/YYYY/g, year);
    v = v.replace(/yy/g, (year + "").substring(2, 4));
    v = v.replace(/YY/g, (year + "").substring(2, 4));
    //Month
    var monthStr = ("0" + month);
    v = v.replace(/MM/g, monthStr.substring(monthStr.length - 2));
    //Day
    var dayStr = ("0" + day);
    v = v.replace(/dd/g, dayStr.substring(dayStr.length - 2));
    //hour
    var hourStr = ("0" + hour);
    v = v.replace(/HH/g, hourStr.substring(hourStr.length - 2));
    v = v.replace(/hh/g, hourStr.substring(hourStr.length - 2));
    //minute
    var minuteStr = ("0" + minute);
    v = v.replace(/mm/g, minuteStr.substring(minuteStr.length - 2));
    //Millisecond
    v = v.replace(/sss/g, ms);
    v = v.replace(/SSS/g, ms);
    //second
    var secondStr = ("0" + second);
    v = v.replace(/ss/g, secondStr.substring(secondStr.length - 2));
    v = v.replace(/SS/g, secondStr.substring(secondStr.length - 2));
    //weekDay
    v = v.replace(/E/g, weekDayString);
    return v;
  },
  /**
   * 页面的初始数据
   */
  data: {
    themeColor: wx.getStorageSync('themeColor'),
    dateType: '',
    dateTime: '',
    loadingCompleted: false,//加载完成
    tabsIndex: 1,
    salesUserRealtimeData: [],
    sisUsedRealtimeData: [],
    sisIncomeRealtimeData: {},
    pageNum: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let _dateType = this.formatDate(new Date().getTime(), 'yyyyMM')
    let _date = this.formatDate(new Date().getTime(), 'yyyy-MM')
    _date = _date.replace('-', '年') + '月'
    this.setData({
      dateTime: _date,
      dateType: _dateType
    })

    this.getSisIncomeRealtime()
    this.getSalesUserRealtime()
    // this.getSisUsedRealtime()

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
    this.setData({
      themeColor: wx.getStorageSync('themeColor'),
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



})