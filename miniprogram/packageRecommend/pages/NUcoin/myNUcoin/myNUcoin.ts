const indexAap = getApp<IAppOption>();
var api = require('../../../../config/api')
var util = require('../../../../utils/util');
import { EventBusInstance } from '../../../../utils/eventBus'
Page({
  jumpNUshoping: function () {
    wx.navigateTo ({
        url: '/pages/ucenter/NUShopping/NUShopping',
      })
  },
  /**
   * 页面的初始数据
   */
  data: {
    themeColor: indexAap.globalData.themeColor,
    tabs: [{ name: '获取记录' }, { name: '扣减记录' }],
    current: 0,
    currentData:{},
    currentData2:{},
    dialogShow: false,
    nuCoinDetail:{},
    expireDateTime:'',
    nowMonth:'',
    buttons: [{ text: '取消' }, { text: '确定' }],
    recordSearch:{
        beginDate:'',
        endDate:'',
        page:1,
        size:1000,
        type:'2'//1-待生效 2-获得 3-扣减
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  formatDate2(inputTime: any) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + m ;
  
  },
  onLoad() {
      console.log('ppppp',getApp<IAppOption>());
      
    let nowMonth = new Date()
    this.setData({
        'nowMonth':util.formatDate2(nowMonth.getTime()),
        'recordSearch.beginDate':util.formatDate(nowMonth.getTime()),
        'recordSearch.endDate':util.formatDate(nowMonth.getTime())
    })
    this.getListData()
    this.getNucoinRecord()
    this.getNucoinRecord2()
  },
  getListData(){
    util.request(api.getNucoinDetail).then((res: any) => {
        console.log('NU数据====',res,util.formatDate(res.data.expireDate));
        res.data.availableTotalNuCoin = util.toThousands(res.data.availableTotalNuCoin)
        res.data.waitEffectiveTotalNuCoin = util.toThousands(res.data.waitEffectiveTotalNuCoin)
        res.data.expireMonthTotalNuCoin = util.toThousands(res.data.expireMonthTotalNuCoin)
        if(res&&res.data){
            this.setData({
                nuCoinDetail:res.data,
                expireDateTime:res.data.expireDate?util.formatDate(res.data.expireDate):''
            })
        }
    }).catch((e:any) => {
        console.log('eeeee',e);
        
    })
  },
  getNucoinRecord(){//获取记录
    util.request(api.getNucoinRecord,this.data.recordSearch).then((res: any) => {
        console.log('NU记录====',res);
        if (res&&res.data) {
            res.data.forEach((item:any) => {
                item.date = util.formatDate2(item.date)
                if (item.list.length!=0) {
                    item.list.forEach((item1:any) => {
                        item1.date = util.formatDate3(item1.date)
                    });
                }
            });
            console.log('处理好的明细',res.data);
            this.setData({
                currentData:res.data[0]
            })
        }
    }).catch(() => {
        
    })
  },
  getNucoinRecord2(){//扣减记录
    this.setData({
        'recordSearch.type' : '3'
    })
    util.request(api.getNucoinRecord,this.data.recordSearch).then((res: any) => {
        console.log('NU记录2222====',res);
        if (res&&res.data) {
            res.data.forEach((item:any) => {
                item.date = util.formatDate2(item.date)
                if (item.list.length!=0) {
                    item.list.forEach((item1:any) => {
                        item1.date = util.formatDate3(item1.date)
                    });
                }
            });
            console.log('处理好的扣减明细',res.data);
            this.setData({
                currentData2:res.data[0]
            })
        }
    }).catch(() => {
        
    })
  },
  goDetail(){
    wx.navigateTo({
      url: '/packageRecommend/pages/NUcoin/nuDetail/nuDetail'
    })
  },
  goExpirePage(e:any){//type 0 待生效 1 失效
    // console.log('要进去了',e);
    wx.navigateTo({
      url: '/packageRecommend/pages/NUcoin/nuOut/nuOut?expireMonthTotalNuCoin='+e.currentTarget.dataset.num+'&type='+e.currentTarget.dataset.type
    })
  },
  openConfirm: function () {
    this.setData({
      dialogShow: true
    })
  },
  closeConfirm: function () {
    this.setData({
      dialogShow: false
    })
  },
  onTabCLick(e:any) {
    console.log(e)
    this.setData({
      current: e.detail.index,
    })
  },
  goNuLogin(e:any){//跳转h5
    console.log('e======',e);
    let that = this;
    let apiAndQuery=api.nu_login;
    if(e.currentTarget.dataset.num==1){
      apiAndQuery=`${api.nu_login}?redirect=https://activity-pre.m.duiba.com.cn/crecord/record`;
    }
    util.request(apiAndQuery).then((res: any) => {
      console.log('免密登录====',res);
      if(res&&res.data){
      wx.navigateTo({
        url:'/pages/customPage/index?from=nu&url='+encodeURIComponent(JSON.stringify(res.data))
      })
    }
    }).catch(() => {
      
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

  },

  
})