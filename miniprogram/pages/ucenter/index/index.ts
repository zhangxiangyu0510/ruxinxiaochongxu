// pages/my/my.ts
const indexAap = getApp<IAppOption>();
import { svgColor } from "../../../utils/changeThemeColor";
var api = require('../../../config/api')
var util = require('../../../utils/util');
import { EventBusInstance } from '../../../utils/eventBus'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: [
      { name: '待付款', orderCount:0, urlIcon: indexAap.globalData.imageUrl+"/userCenterIcon/pending-payment.svg" },
      { name: '已支付', orderCount:0, urlIcon: indexAap.globalData.imageUrl+"/userCenterIcon/Paid.svg" },
      { name: '待捡配', orderCount:0, urlIcon: indexAap.globalData.imageUrl+"/userCenterIcon/picked.svg" },
      { name: '已完成', orderCount:0, urlIcon: indexAap.globalData.imageUrl+"/userCenterIcon/completed.svg" }
    ],
    hasUserInfo: false,
    imageUrl:indexAap.globalData.imageUrl,
    my_header_avater: indexAap.globalData.imageUrl+"/userCenterIcon/defaultMyIcon.svg",
    themeColor: indexAap.globalData.themeColor,
    enNumber:0,
    shopInfo: {},
    userInfo:{},
    showBg:true
  },
  goBadge() {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '/packageUser/pages/myBadge/myBadge'
      })
    } else {
      this.goLoginPage()
    }
  },
  getOrderStatusCount(){
    let that = this
    util.request(api.getOrderStatusCount).then((res: any) => {
        if (res&&res.data) {
            // { name: '待付款', payOrderCount:null, urlIcon: indexAap.globalData.imageUrl+"/userCenterIcon/pending-payment.svg" },
            // { name: '已支付', payOrderCount:null, urlIcon: indexAap.globalData.imageUrl+"/userCenterIcon/Paid.svg" },
            // { name: '待捡配', postOrderCount:null, urlIcon: indexAap.globalData.imageUrl+"/userCenterIcon/picked.svg" },
            // { name: '已完成', urlIcon: indexAap.globalData.imageUrl+"/userCenterIcon/completed.svg" }
          console.log('我是订单--------',res);
          that.data.status.forEach((item:any)=>{
              if (item.name=='待付款') {
                  item.orderCount = res.data.preOrderCount
              }else if (item.name == '已支付') {
                  item.orderCount = res.data.payOrderCount
              } else if (item.name == '待捡配') {
                item.orderCount = res.data.postOrderCount 
              } else {
                item.orderCount = 0
              }
          })
          that.setData({
              status:that.data.status
          })
        }
      }).catch((res: any) => {
        console.log(res);
  
      })
  },
  jumpCustormDetail() {
    wx.navigateToMiniProgram({
        appId: indexAap.globalData.shopAppId,
        // path: 'pages/index/index?id=123',
        path: 'pages/index/index',
        extraData: {
            // nuskinAuth:wx.getStorageSync('access_token'),
            // flag:'shopkeeper',
            foo: 'bar'
        },
        envVersion: 'trial',
        //   envVersion: 'release',//开发版本  生产版本release
        success(res) {
            // 打开成功
            console.log('打开成功',res);
            
        },
        fail(err) {
            wx.navigateBack()
            // 打开成功
        }
    })
  },
  myOrder(e: any) {
    console.log('下标====', e.currentTarget.dataset.orderindex);
    util.checkLogin().then(() => {
        let params = Object.assign({}, {
            orderIndex: e.currentTarget.dataset.orderindex,
          }, util.getCommonArguments())
      wx.navigateTo({
        url: `/pages/customPage/index?url=${indexAap.globalData.h5DetailUrl}orderList&params=${encodeURIComponent(JSON.stringify(params))}`
      })
    }).catch(() => {
      util.getUserProfile();
    })
  },
  getSelfEnNumber() {
    let that = this
    util.request(api.getSelfEnNumber).then((res: any) => {
      if (res&&res.data) {
        that.setData({
          enNumber: res.data[0].availableTotalVirtualCoin
        })
      }
    }).catch((res: any) => {
      console.log(res);

    })
  },
  goOwner() {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '/packageUser/pages/userInfo/userInfo?state=seeDetail'
      })
    } else {
      this.goLoginPage()
    }
  },
  goEditInfo() {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '/packageUser/pages/userInfo/userInfo?state=editInfo',
      })
    } else {
      this.goLoginPage()
    }

  },
  goLoginPage() {
    util.getUserProfile()
  },

  goEnHome() {
    if (this.data.hasUserInfo) {
        wx.navigateTo({
          url: `/pages/customPage/index?url=${indexAap.globalData.customerH5}/shop/productPoints&type=enhome`
        })
    } else {
    this.goLoginPage()
    }
  },
  getShopInfo() {
    let that = this
    util.request(api.getShopInfo).then((res: any) => {
      let shopInfo = {
        avatar: '',
        nickname: '',
        fansCount: '',
        shopTime: '',
        mobile: ''
      }
      shopInfo.avatar = res.data.partnerProfile && res.data.partnerProfile.avatar
      shopInfo.nickname = res.data.partnerProfile && res.data.partnerProfile.nickname
      shopInfo.fansCount = res.data.shop && res.data.shop.fansCount
      shopInfo.mobile = res.data.partner && res.data.partner.mobile
      if (res.data.shop && res.data.shop.startTime) {
        shopInfo.shopTime = util.timeTmp(res.data.shop.startTime)
      }

      this.setData({
        shopInfo,
      })
    }).catch(() => {
      console.log("获取用户信息失败");
    })
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
    // let themeIcon: string = svgColor(this.data.my_header_avater, indexAap.globalData.themeColor, "stroke")

    this.setData({
        // my_header_avater: themeIcon,
        themeColor: indexAap.globalData.themeColor,
        'bg': wx.getStorageSync('bgIndex') 

    })
    this.changeColor('my_header_avater',this.data.my_header_avater, indexAap.globalData.themeColor, "stroke")
    EventBusInstance.on('notification', (data: any) => {
        console.log('ucenter', data)
        this.selectComponent("#notificationDialog").push(data)
    }, true)

    util.getUrl();
    this.selectComponent("#dialogProtocol").close();
    util.checkLogin().then(() => {
        util.request(api.getH5Token).then(function (res: any) {
            if (res && res.data) {
              console.log('shar_key====', res.data);
              wx.setStorageSync("access_token", res.data.nuskinToken);
            }
          });
      this.getShopInfo()
      this.getOrderStatusCount()
      this.getSelfEnNumber()
      this.setData({
        hasUserInfo: true,
        userInfo: JSON.parse(wx.getStorageSync('userInfo'))
      });
    }).catch(() => {
      this.setData({
        hasUserInfo: false,
      });
    })
  },
  onPageScroll: function(e) {
    console.log(e.scrollTop);
    if(e.scrollTop>80){
      this.setData({showBg:false})

    }else{
      this.setData({showBg:true})

      }
    

  
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.selectComponent("#dialogProtocol").close();
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
  goShopkeeperLevel() {
    if (this.data.hasUserInfo) {
        wx.navigateTo({
          url: '/packageUser/pages/mylevel/mylevel',
        })
    } else {
    this.goLoginPage()
    }
  },
  changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
    svgColor(url, color,type).then((res:any)=>{
      this.setData({[name]:res})
    })


  },
  goMyNucoin() {
    if (this.data.hasUserInfo) {
        wx.navigateTo({
          url: '/packageRecommend/pages/NUcoin/myNUcoin/myNUcoin',
        })
    } else {
    this.goLoginPage()
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },


})