// pages/customerLabelingProcess/customerorderdetail/customerorderdetail.ts
var api=require('../../../../config/api')
var util = require('../../../../utils/util');
var changeSvg = require('../../../../utils/changeThemeColor');
const indexAap = getApp<IAppOption>();
import { EventBusInstance } from '../../../../utils/eventBus'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zuo: indexAap.globalData.imageUrl+'/icons/huangguan.svg',
    you: indexAap.globalData.imageUrl+'/icons/beijing.svg',
    zuo2: indexAap.globalData.imageUrl+'/icons/huangguan.svg', 
    you2: indexAap.globalData.imageUrl+'/icons/beijing.svg',
    my_header_avater: indexAap.globalData.imageUrl+"/userCenterIcon/defaultMyIcon.svg",
    identityTagObj: {
        ORDINARY_CUSTOMERS: '注册顾客',
        RETAIL_CUSTOMERS: '零售顾客',
        STAR_CUSTOMERS: '星级顾客',
      },
    detailFromData:{},
    orderMain:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    console.log('订单详情',options);
    this.changeColor('my_header_avater',this.data.my_header_avater, indexAap.globalData.themeColor, "stroke")
    this.getOrderDetail(options)
  },
  eventDiscountAmount(orderMain:any) {
      let data:any = orderMain
    let itemAmount = data.itemAmount?data.itemAmount : 0
    let dedGiftAmount = data.dedGiftAmount?data.dedGiftAmount : 0
    let payAmount = data.payAmount?data.payAmount : 0
    let virtualCoinAmount = data.virtualCoinAmount?data.virtualCoinAmount : 0
    let couponAmount = Math.abs(data.couponTotalAmount?data.couponTotalAmount:0)

    //plus +   minus -
    if (data.freightAmount) {//8
      itemAmount = Number(itemAmount)+Number(data.freightAmount?data.freightAmount:0)
    }
    let price = Number(itemAmount)-Number(payAmount)-Number(virtualCoinAmount)
    let price2 = Number(price)-Number(dedGiftAmount)-Number(couponAmount)
    console.log('计算结果是',price2);
    
    return price2==0?'':'-¥'+Math.abs(price2)
  },
  getOrderDetail(options:any){
    // console.log('进来了',id);formatDate
    let _that=this;
    util.request(api.getOrderDetail+'?orderNo='+options.orderNo+'&id='+options.id).then(function (res:any) {
      if(res&&res.data){
          if (res.data.orderMain&&res.data.orderMain.orderDt) {
              res.data.orderMain.orderDt = res.data.orderMain.orderDt.split(/\s+/)[0]
          }
          if (res.data.orderMain&&res.data.orderMain.eventDiscountAmount) {
              res.data.orderMain.eventDiscountAmount = _that.eventDiscountAmount(res.data.orderMain)
          }
          console.log('要渲染了',_that.eventDiscountAmount(res.data.orderMain))
          
        _that.setData({
          detailFromData : res.data
        })
      }
      console.log('订单详情',res);
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
    EventBusInstance.on('notification', (data: any) => {
        console.log('page index:', data)
        this.selectComponent("#notificationDialog").push(data)
    }, true)
    this.setData({
        themeColor:indexAap.globalData.themeColor,
        // zuo: changeSvg.svgColor('/images/icons/huangguan.svg', indexAap.globalData.themeColor),
        // you: changeSvg.svgColor('/images/icons/beijing.svg', indexAap.globalData.themeColor),
    })
    this.changeColor('zuo',this.data.zuo,indexAap.globalData.themeColor)
    this.changeColor('you',this.data.you,indexAap.globalData.themeColor)
    this.changeColor('zuo2',this.data.zuo2, '#666666')
    this.changeColor('you2',this.data.you2, '#666666')
  },
  changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
    changeSvg.svgColor(url, color,type).then((res:any)=>{
      this.setData({[name]:res})
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