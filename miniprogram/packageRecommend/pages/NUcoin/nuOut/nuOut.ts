// pages/NUcoin/nuOut/nuOut.ts
var api = require('../../../../config/api')
var util = require('../../../../utils/util');
var changeSvg = require('../../../../utils/changeThemeColor')
import { EventBusInstance } from '../../../../utils/eventBus'
const nuApp = getApp<IAppOption>();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeColor: wx.getStorageSync('themeColor'),
    empty:nuApp.globalData.imageUrl+'/images/empty.svg',
    emptyBg:nuApp.globalData.imageUrl+'/images/emptyBg.svg',
    record:[],
    searchData:{
        page:1,
        size:1000
    },
    searchData1:{
        page:1,
        size:1000,
        type:'1'
    },
    expireNuCoin:'',
    ListType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
    changeSvg.svgColor(url, color,type).then((res:any)=>{
      this.setData({[name]:res})
    })


  },
  onLoad(options:any) {
    this.setData({
        expireNuCoin:options.expireMonthTotalNuCoin,
        // empty:componSvg.svgColor(this.data.empty, nuApp.globalData.themeColor),
        ListType:options.type
    })
    this,this.changeColor('empty',this.data.empty, nuApp.globalData.themeColor)
    console.log('-------',options);
    if (options.type=='0') {//待生效的页面
        this.getWaitRecord()
        wx.setNavigationBarTitle({
            title:'待生效NU币'
        })
    }else{//失效的页面
        this.getExpireRecord()
    }
  },
  getExpireRecord(){//即将过期
    util.request(api.getExpireRecord,this.data.searchData).then((res: any) => {
        console.log('即将过期====',res);
        if(res&&res.data){
            res.data.forEach((item:any,index:any) => {
                item.isOpen = false
                item.date = util.formatDate2(item.date)
                if (index==0) {
                    item.isOpen = true
                }
                if (item.list.length!=0) {
                    item.list.forEach((item1:any) => {
                        item1.date = util.formatDate3(item1.date)
                        if (item1.cause=='0') {//0.系统 1.后管 2.用户下单 3.等级达成 4.兑吧
                            item1.cause = '系统'
                        }else if (item1.cause=='1') {
                            item1.cause = '后管'
                        } else if (item1.cause=='2') {
                            item1.cause = '用户下单'
                        } else if (item1.cause=='3') {
                            item1.cause = '等级达成'
                        } else if (item1.cause=='4') {
                            item1.cause = '兑吧'
                        }
                    });
                }
            });
            console.log('===========>',res.data);
            this.setData({
                record:res.data
            })
        }
    }).catch((e:any) => {
        console.log('eeeee',e);
        
    })
  },
  getWaitRecord(){//待生效
    util.request(api.getNucoinRecord,this.data.searchData1).then((res: any) => {
        console.log('待生效====',res);
        if(res&&res.data){
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
            console.log('待生效===========>',res.data);
            this.setData({
                record:res.data
            })
        }
    }).catch((e:any) => {
        console.log('eeeee',e);
        
    })
  },
  checkOpen(e:any){//展开收起
    let i = e.currentTarget.dataset.index
    this.data.record.forEach((item:any,index:any)=>{
        if (index==i) {
            item.isOpen = !item.isOpen
        }
    })
    this.setData({
        record:this.data.record
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

  },


})