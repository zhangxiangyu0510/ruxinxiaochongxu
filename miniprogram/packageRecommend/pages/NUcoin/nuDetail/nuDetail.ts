// pages/NUcoin/nuDetail/nuDetail.ts
const nuApp = getApp<IAppOption>();
var api = require('../../../../config/api')
var util = require('../../../../utils/util');
import { EventBusInstance } from '../../../../utils/eventBus'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeColor: wx.getStorageSync('themeColor'),
    tabs: [{ name: '获取记录' }, { name: '扣减记录' }],
    current: 0,
    dialogShow:false,
    recordSearch:{
        beginDate:'',
        endDate:'',
        page:1,
        size:1000,
        type:'2'//1-待生效 2-获得 3-扣减
    },
    nuCoinDetail:{},
    currentData:[],
    currentData2:[],
  },
  onTabCLick(e:any) {
    this.setData({
      current: e.detail.index,
    })
  },
  openConfirm: function () {
      console.log('-----我是明细');
      
    this.setData({
      dialogShow: true
    })
  },
  closeConfirm: function () {
    this.setData({
      dialogShow: false
    })
  },
  checkOpen(e:any){//展开收起
    let i = e.currentTarget.dataset.index
    this.data.currentData.forEach((item:any,index:any)=>{
        if (index==i) {
            item.isOpen = !item.isOpen
        }
    })
    this.setData({
        currentData:this.data.currentData
    })
  },
  checkOpen2(e:any){//展开收起
    let i = e.currentTarget.dataset.index
    this.data.currentData2.forEach((item:any,index:any)=>{
        if (index==i) {
            item.isOpen = !item.isOpen
        }
    })
    this.setData({
        currentData2:this.data.currentData2
    })
  },
  getListData(){
    util.request(api.getNucoinDetail).then((res: any) => {
        console.log('NU数据====',res);
        res.data.availableTotalNuCoin = util.toThousands(res.data.availableTotalNuCoin)//可用总额
        res.data.waitEffectiveTotalNuCoin = util.toThousands(res.data.waitEffectiveTotalNuCoin)//待生效
        res.data.expireMonthTotalNuCoin = util.toThousands(res.data.expireMonthTotalNuCoin)//即将失效
        res.data.expireTotalNuCoin = util.toThousands(res.data.expireTotalNuCoin)//已过期总额
        res.data.totalNuCoin = util.toThousands(res.data.totalNuCoin)//总额
        res.data.usedTotalNuCoin = util.toThousands(res.data.usedTotalNuCoin)//已使用
        if(res&&res.data){
            this.setData({
                nuCoinDetail:res.data
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
            res.data.forEach((item:any,index:any) => {
                item.isOpen = false
                item.date = util.formatDate2(item.date)
                if (index==0) {
                    item.isOpen = true
                }
                if (item.list.length!=0) {
                    item.list.forEach((item1:any) => {
                        item1.date = util.formatDate3(item1.date)
                    });
                }
            });
            console.log('处理好的明细',res.data);
            this.setData({
                currentData:res.data
            })
        }
    }).catch(() => {
        
    })
  },
  getNucoinRecord2(){//获取记录
    this.setData({
        'recordSearch.type' : '3'
    })
    util.request(api.getNucoinRecord,this.data.recordSearch).then((res: any) => {
        console.log('NU记录2222====',res);
        if (res&&res.data) {
            res.data.forEach((item:any,index:any) => {
                item.isOpen = false
                item.date = util.formatDate2(item.date)
                if (index==0) {
                    item.isOpen = true
                }
                if (item.list.length!=0) {
                    item.list.forEach((item1:any) => {
                        item1.date = util.formatDate3(item1.date)
                    });
                }
            });
            console.log('处理好的扣减明细',res.data);
            this.setData({
                currentData2:res.data
            })
        }
    }).catch(() => {
        
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getListData()
    this.getNucoinRecord()
    this.getNucoinRecord2()
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
        themeColor:nuApp.globalData.themeColor
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