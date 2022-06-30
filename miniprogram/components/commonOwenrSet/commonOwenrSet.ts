// pages/ucenter/shopowner/shopowner.ts
const app = getApp<IAppOption>();
let themeColrSvg = require("../../utils/changeThemeColor");
var api = require("../../config/api");
var util = require("../../utils/util");
import { EventBusInstance } from '../../utils/eventBus'
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    nextLevelData: {
        type: Object,
        value: {}
    },  
    ifShow: {
      type: Boolean,
      value: true
    },
    itemShow: {
      type: Object,
      value: { age: true, score: true, information: true }
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    dialogShow:false,
    orderNum:null,
    orderPrice:null,
    badgeData: [
      { name: '十分热爱', badgeIcon: app.globalData.imageUrl + "/userCenterIcon/badge(1).svg" },
      { name: '开单大吉', badgeIcon: app.globalData.imageUrl + "/userCenterIcon/badge(3).svg" },
      { name: '订单不断', badgeIcon: app.globalData.imageUrl + "/userCenterIcon/badge(2).svg" },
      { name: '大有作为', badgeIcon: app.globalData.imageUrl + "/userCenterIcon/badge(1).svg" }
    ],
    themeColor: app.globalData.themeColor || wx.getStorageSync("themeColor"),
    scoreIcon: app.globalData.imageUrl + "/userCenterIcon/Group 923.svg",
    config: {
      // canvasSize: {
      //   width: 300,
      //   height: 300
      // },
      barStyle: [{ width: 10, fillStyle: '#f0f0f0' }, { width: 10, animate: true, fillStyle: [{ position: 0, color: '#7340B3' }, { position: 1, color: '#7340B3' }] }],
      needDot: false,
      dotStyle: [{ r: 10, fillStyle: '#ffffff', shadow: 'rgba(0,0,0,.15)' }, { r: 5, fillStyle: '#7340B3' }]
    },
    userInfo: {},
    shopInfo: {},
    my_header_avater: app.globalData.imageUrl + "/userCenterIcon/defaultMyIcon.svg",
    genderData: {
      0: '保密',
      1: "男",
      2: "女"
    },
    levelImage:'',
    tipsIcon:`<svg style="fill:#FFF" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 0H0V24H24V0Z" fill-opacity="0.01"/>
    <path d="M12 22C14.7614 22 17.2614 20.8807 19.0711 19.0711C20.8807 17.2614 22 14.7614 22 12C22 9.2386 20.8807 6.7386 19.0711 4.92893C17.2614 3.11929 14.7614 2 12 2C9.2386 2 6.7386 3.11929 4.92893 4.92893C3.11929 6.7386 2 9.2386 2 12C2 14.7614 3.11929 17.2614 4.92893 19.0711C6.7386 20.8807 9.2386 22 12 22Z" stroke="white" fill-opacity="0.01" stroke-width="1.33333" stroke-linejoin="round"/>
    <rect x="11" y="10" width="2" height="8" rx="1"/>
    <rect x="10.5" y="6" width="3" height="3" rx="1.5" />
    </svg>
    `,
    tipsIcon2:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 0H0V24H24V0Z" fill="white" fill-opacity="0.01"/>
    <path d="M12 22C14.7614 22 17.2614 20.8807 19.0711 19.0711C20.8807 17.2614 22 14.7614 22 12C22 9.2386 20.8807 6.7386 19.0711 4.92893C17.2614 3.11929 14.7614 2 12 2C9.2386 2 6.7386 3.11929 4.92893 4.92893C3.11929 6.7386 2 9.2386 2 12C2 14.7614 3.11929 17.2614 4.92893 19.0711C6.7386 20.8807 9.2386 22 12 22Z" stroke="#7F7F7F" stroke-width="1.33333" stroke-linejoin="round"/>
    <rect x="11" y="10" width="2" height="8" rx="1" fill="#7F7F7F"/>
    <rect x="10.5" y="6" width="3" height="3" rx="1.5" fill="#7F7F7F"/>
    </svg>
    
    `,
    bradge:false,
    score:false,
    lavel:false,
    tipsCloseIcon:`<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 22C4.928 22 0 17.072 0 11C0 4.928 4.928 0 11 0C17.072 0 22 4.928 22 11C22 17.072 17.072 22 11 22ZM11 1.045C5.522 1.045 1.045 5.522 1.045 11C1.045 16.478 5.511 20.955 11 20.955C16.489 20.955 20.955 16.489 20.955 11C20.955 5.511 16.478 1.045 11 1.045Z" fill="white"/>
    <path d="M11.7705 11L15.8475 6.94896C16.0508 6.74694 16.0508 6.41733 15.8475 6.18341L15.8154 6.15152C15.6121 5.94949 15.2804 5.94949 15.077 6.15152L11 10.2344L6.92295 6.18341C6.71964 5.98139 6.38791 5.98139 6.18459 6.18341L6.15249 6.21531C5.94917 6.41733 5.94917 6.74694 6.15249 6.98086L10.2295 11L6.15249 15.051C5.94917 15.2531 5.94917 15.5827 6.15249 15.8166L6.18459 15.8485C6.38791 16.0505 6.71964 16.0505 6.92295 15.8485L11 11.7656L15.077 15.8166C15.2804 16.0186 15.6121 16.0186 15.8154 15.8166L15.8475 15.7847C16.0508 15.5827 16.0508 15.2531 15.8475 15.0191L11.7705 11Z" fill="white"/>
    </svg>
    `,
  },
  lifetimes: {
    created() {
    },
    attached() {
      console.log(wx.getStorageSync('userInfo'))
      let levelList = wx.getStorageSync("levelList")
      var level = JSON.parse(wx.getStorageSync('userInfo')).shop.level
      let filterLevel = levelList.filter((item:any)=>{
        if(item.level==level){
          return item
        }
      })||[]
      this.setData({levelImage:filterLevel.length&&filterLevel[0].levelImage})
      console.log(this.data.levelImage,456);
          util.getThemeColor().then((res: any) => {
        console.log('123456789', res);
        wx.setStorageSync('themeColor', res);
        console.log('此时缓存里的主题色======', wx.getStorageSync('themeColor'))
        app.globalData.themeColor=res;
        this.setData({
            themeColor:res,
            tipsIcon:encodeURIComponent(this.data.tipsIcon),
            tipsIcon2:encodeURIComponent(this.data.tipsIcon2),
            tipsCloseIcon:encodeURIComponent(this.data.tipsCloseIcon)
        })
      })
      // let themeIcon: string = themeColrSvg.svgColor(this.data.my_header_avater, wx.getStorageSync("themeColor"), "stroke")
      // let scoreIcon = themeColrSvg.svgColor(this.data.scoreIcon, wx.getStorageSync("themeColor"))
      // this.setData({
      //   scoreIcon: scoreIcon,
      //   my_header_avater: themeIcon
      // })
      console.log(this.data.itemShow)
      this.getBadgeLight();
      this.changeColor('scoreIcon', this.data.scoreIcon, app.globalData.themeColor || wx.getStorageSync("themeColor"));
      var color = app.globalData.themeColor || wx.getStorageSync("themeColor")
      this.changeColor('my_header_avater',this.data.my_header_avater, color, "stroke");

    }
  },
  pageLifetimes: {
    show() {
      this.getShopInfo()
      EventBusInstance.on('notification', (data: any) => {
        console.log('worker', data)
        this.selectComponent("#notificationDialog").push(data)
      }, true)
      if(this.data.ifShow){
        this.getOrderData()
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getOrderData(){
        util.request(api.orderData).then((res: any) => {
          console.log(res)
       
        
          
          this.setData({orderNum:util.toQfw(res.data.numItemTotalSale)})
          this.setData({orderPrice:util.toQfw(res.data.amtSales)})
          console.log(this.data.orderNum,this.data.orderPrice,"----------");
        })
    },
    openConfirm(e:any){
        if(!this.data.ifShow)return 
        // if(e.currentTarget.dataset.type==="bradge"){
        //     this.setData({
        //         dialogShow:true,
        //         bradge:true,
        //         score:false,
        //         lavel:false
        //     })
        // }else if(e.currentTarget.dataset.type==="score"){
        //     this.setData({
        //         dialogShow:true,
        //         bradge:false,
        //         score:true,
        //         lavel:false
        //     })
        // }else if(e.currentTarget.dataset.type==="lavel"){
        //     this.setData({
        //         dialogShow:true,
        //         bradge:false,
        //         score:false,
        //         lavel:true
        //     })
        // }
        this.setData({
            bradge:false,
            score:false,
            lavel:false
        })
        this.setData({
            [e.currentTarget.dataset.type]:true,
            dialogShow:true
        })
    },
    closeConfirm(){
      this.setData({
        dialogShow:false,
        bradge:false,
        score:false,
        lavel:false
      })
    },
    changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
      themeColrSvg.svgColor(url, color, type).then((res: any) => {
        this.setData({ [name]: res })
      })
    },
    //获取点亮徽章
    getBadgeLight() {
      console.log(222222)
      util.request(api.badgeLight).then((res: any) => {
        console.log(res);
        res.data.sort((a, b) => { return b.lightingTime - a.lightingTime })
        res.data.forEach((item:any) => {
          if(item.name&&item.name.length>5){
            console.log('22222')
            item.name = item.name.slice(0,5)+'...'
            console.log(item.name)
          }
          
        });
        console.log(res.data);
        
        this.setData({ 'badgeData': res.data.slice(0,4) })
      })

    },
    //名字脱敏处理
    noPassByName(str: string): any {
      if (null != str && str != undefined) {
        if (str.length == 2) {
          return str.substring(0, 1) + '*' //截取name 字符串截取第一个字符，
        } else if (str.length == 3) {
          return str.substring(0, 1) + "*" + str.substring(2, 3)//截取第一个和第三个字符
        } else if (str.length > 3) {
          return str.substring(0, 1) + "*" + '*' + str.substring(3, str.length)//截取第一个和大于第4个字符
        }
      } else {
        return "";
      }
    },
    getShopInfo() {
      util.request(api.getShopInfo).then((res: any) => {
        console.log(res);
        let userInfo = {
          ...res.data.partner,
          ...res.data.partnerProfile,
          name: this.noPassByName(res.data.partnerProfile.realName)
        }
        userInfo.age = userInfo.birthday && util.getCurrentAge(new Date(userInfo.birthday)) || ''
        //年资
        userInfo.durationTime = userInfo.createTime && util.timeTmp(userInfo.createTime)
        let shopInfo = {
          ...res.data.shop,
          shopTime: 0
        }
        console.log(shopInfo, userInfo);

        // 开店时间
        if (res.data.shop && res.data.shop.startTime) {
          shopInfo.shopTime = util.timeTmp(res.data.shop.startTime)
        }
        this.setData({
          userInfo,
          shopInfo
        })
        console.log(this.data.shopInfo, this.data.userInfo);

      })
    },
    goReview() {
      this.triggerEvent("goReview")
    },
    goConfig() {
      this.triggerEvent("goConfig")
    },
    goEdit() {
      this.triggerEvent("goEdit")
    },
    goBadge() {
        if(!this.data.ifShow)return
      wx.navigateTo({
        url: "/packageUser/pages/myBadge/myBadge"
      })
    },
    goBadgeDetail(e: any) {
        if(!this.data.ifShow)return
      console.log(e.currentTarget.dataset.item)
      wx.setStorageSync('badgeDetail',e.currentTarget.dataset.item)
      wx.navigateTo({
        url: "/packageUser/pages/badgeDetail/badgeDetail"
      })
    },
    goMylevel() {
      wx.navigateTo({
        url: "/packageUser/pages/mylevel/mylevel"
      })
    }
  },

})
