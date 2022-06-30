// pages/ucenter/NUAnalyse/NUAnalyse.ts
const date = new Date()
const years = []
const months = []
const days = []
var api = require('../../../config/api')
var util = require('../../../utils/util');
var changeSvg = require('../../../utils/changeThemeColor');
import { EventBusInstance } from '../../../utils/eventBus'
const indexAap = getApp<IAppOption>();
for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}

Page({
  changeTobs: function (event: any) {
    //   console.log('切换了',event);
    wx.showLoading({
        title: '加载中',
        mask:true
    })
    this.setData({ 
        tabsIndex: event.currentTarget.dataset.item,
        'searchData.page':1,
        'searchData.sortNo':event.currentTarget.dataset.item
    })
    this.getShopOrder()
  },
  close: function () {
    this.setData({
      showActionsheet: false
    })
  },
  btnClick(e: any) {//季度控件
    this.setData({
        'searchData.dateType':2,
        'searchData.dateValue':e.detail.value,
        'searchData.page':1,
        showActionsheet:false,
        'quarterTextValue':e.detail.value,
        'monthTextValue':'月度',
        'yearTextValue':'年度',
        isCheckedMonth:false,
        isCheckedYear:false,
        isCheckedQuarter:true
    })
    this.getShopOrder()
  },
  cancelModel: function () {
    this.setData({
      pickerModelShow: false
    })
  },
  cancelModel2: function () {
    this.setData({
      provinceModelShow:false
    })
  },
  openModel: function () {
    this.setData({
      pickerModelShow: true
    })
  },
  openModel2: function () {
    this.setData({
      provinceModelShow:true
    })
  },
  openActionSheet: function (event: any) {//季度
    this.setData({
      showActionsheet: true
    })
  },
  onShareAppMessage() {
    return {
      title: 'picker-view',
      path: 'page/component/pages/picker-view/picker-view'
    }
  },
  bindChange(e: any) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      // day: this.data.days[val[2]],
      // isDaytime: !val[3]
    })
  },
  bindChange2(e: any) {
    const val = e.detail.value[0]
    console.log('我是省份bindChange2',e);
    
    this.setData({
        province:this.data.provinceList[val]
    })
  },
  pickerConfirm: function (event: any) {//月度弹窗
    this.setData({
      monthTextValue: this.data.year + '年' + this.data.month + '月',
      'yearTextValue':'年度',
      'quarterTextValue':'季度',
      'searchData.dateType':3,
      isCheckedMonth:true,
      isCheckedQuarter:false,
      isCheckedYear:false,
      'searchData.dateValue':String(this.data.year)+String(this.data.month<10?'0'+this.data.month:this.data.month),
      'searchData.page':1,
      pickerModelShow: false
    })
    this.getShopOrder()
  },
  pickerConfirm2:function (e:any) {
    console.log('----我是省份弹窗',e,this.data.province);
    this.setData({
        'searchData.province':this.data.province,
        'provinceTextValue':this.data.province,
        'searchData.page':1,
        provinceModelShow: false
      })
      this.getShopOrder()
  },
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: indexAap.globalData.imageUrl, 
    ranking_bg: indexAap.globalData.imageUrl+'/icons/beijing.svg', 
    zuo: indexAap.globalData.imageUrl+'/icons/huangguan.svg', 
    themeColor: indexAap.globalData.themeColor,
    tabsIndex: 1,
    showActionsheet: false,
    groups: [],
    provinceList:[],
    years,
    year: date.getFullYear(),
    months,
    month: date.getMonth(),
    days,
    day: date.getDay(),
    value: [9999, 1, 1],
    isDaytime: true,
    pickerModelShow: false,
    provinceModelShow:false,
    monthTextValue: '月度',
    quarterTextValue:'季度',
    yearTextValue:'年度',
    provinceTextValue:'全国',
    province:'',
    changeTobs:[],
    explainTime:'',
    searchData:{
        dateType:'',//日期类型：1-年、2-季度、3-月份
        dateValue:'',//日期值（(yyyy)、(yyyy年第一季度、yyyy年第二季度、yyyy年第三季度、yyyy年第四季度)、(yyyymm)）
        province:'',//省份  全国不传
        sortNo:'1',//排序 1、订单金额 2、转化率 3、人气 4、店铺等级 默认为1
        page:1,
        size:''
    },
    listName:{
        '1':'订单金额',
        '2':'留客率',
        '3':'粉丝数',
        '4':'店铺等级',
    },
    shopkeeperInfoData:[],
    myRanking:'',
    isCheckedYear:false,
    isCheckedMonth:false,
    isCheckedQuarter:false,
    endData:false
  },
  changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
    changeSvg.svgColor(url, color,type).then((res:any)=>{
      this.setData({[name]:res})
    })


  },

  getShopOrder(){
    //   console.log('我是查询的条件',this.data.searchData);
    wx.showLoading({
        title: '加载中',
        mask:true
    })
    util.request(api.getShopOrder,this.data.searchData).then((res: any) => {
        if (res&&res.data&&res.data.shopOrders&&res.data.shopOrders.content) {
          console.log('=======',res,res.data.shopOrders.content.length);
          this.setData({
            shopkeeperInfoData:this.data.searchData.page==1?res.data.shopOrders.content:this.data.shopkeeperInfoData.concat(res.data.shopOrders.content),
            myRanking:res.data.myRanking,
            endData:res.data.shopOrders.content.length < this.data.searchData.size ? false :true
          })
          if (Number(this.data.searchData.dateType)==2) {
            this.close()
          }
        //   console.log('我是最后的数据',this.data.shopkeeperInfoData);
        }
        wx.hideLoading();//隐藏loading
    }).catch((res:any) => {
        console.log(res);
        wx.hideLoading();//隐藏loading
    })
  },
  getSortShow(){
    util.request(api.getSortShow).then((res: any) => {
        if (res&&res.data) {
        //   console.log('-----------',res);
          this.setData({
            'searchData.size':res.data.pageSize,
            changeTobs:res.data.sortNo
          })
          this.getShopOrder()
        }
    }).catch((res:any) => {
        console.log(res);
    })
  },
  getYear(){
    if (this.data.isCheckedYear) {//取消选中年度
        this.setData({
            isCheckedYear : !this.data.isCheckedYear,
            'searchData.dateType':'',
            'searchData.page':1,
            'yearTextValue':'年度',
            'quarterTextValue':'季度',
            'monthTextValue':'月度'
        })
        this.getShopOrder()
    } else {//选中年度
        this.setData({
            isCheckedYear : !this.data.isCheckedYear,
            isCheckedQuarter:false,
            isCheckedMonth:false,
            'searchData.dateType':1,
            'yearTextValue':'年度',
            'quarterTextValue':'季度',
            'monthTextValue':'月度'
        })
        this.getShopOrder()
    }
  },
  getProvince(){
    util.request(api.getProvince).then((res: any) => {
        if (res&&res.data) {
            let length = res.data.length-1
            this.setData({
                provinceList:res.data,
                province:res.data[length]
            })
        //   console.log('获取省份',res);
        }
    }).catch((res:any) => {
        console.log(res);
    })
  },
  getQuarter(){
    util.request(api.getQuarter).then((res: any) => {
        if (res&&res.data) {
          this.setData({
            groups:res.data
          })
        }
    }).catch((res:any) => {
        console.log(res);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    const day1 = new Date()
    day1.setTime(day1.getTime()-24*60*60*1000)
    this.setData({
        explainTime:day1.getFullYear()+'年'+(day1.getMonth()+1)+'月'+day1.getDate()+'日'
    })
    this.getSortShow()
    this.getQuarter()
    this.getProvince()
    this.changeColor('zuo',this.data.zuo,indexAap.globalData.themeColor)
    this.changeColor('ranking_bg',this.data.ranking_bg,indexAap.globalData.themeColor)
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
      this.setData({
        tabsIndex:1,
        provinceTextValue:'全国',
        monthTextValue: '月度',
        quarterTextValue:'季度',
        yearTextValue:'年度',
        'searchData.dateType':'',
        'searchData.dateValue':'',
        'searchData.province':'',
        'searchData.sortNo':'1',
        'searchData.page':1
      })
    this.getShopOrder()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.endData) {
        console.log('进来了');
        this.setData({
            'searchData.page':this.data.searchData.page+1
        })
        this.getShopOrder()
    }
  }
})