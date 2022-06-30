const dialogApp = getApp<IAppOption>();
var util = require('../../utils/util');
var api = require('../../config/api');

var getChangeTheme = require("../../utils/changeThemeColor");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //拨打电话
    phone: {
      type: String,
      value: '400-004-5555',
    },
    showCallPhone: {
      type: Boolean,
      value: false,
    },
    //补全信息
    shopKeeperInfo: {
      type: Object,
      value: {}
    },
    //协议
    // showProtocol:{
    //   type:Boolean,
    //   value:false,
    // },
    // showAddInfoDialog: {
    //   type: Boolean,
    //   value: false
    // },
    //  protocols: {
    //   type: String,
    //   value: '以下隐私协议'
    // },
    //组件区分
    // 1.协议 2.电话 3.信息补全 后面依次递增
    componentType: {
      type: Number,
      value: 1,
      required: true
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    themeColor: dialogApp.globalData.themeColor,
    themeColor1: wx.getStorageSync('themeColor'),
    showAddInfoDialog: false,
    showGetBradge: false,
    showProtocol: false,
    protocols: '',
    shopLevel: '',
    protocolsVersion: '',
    protocolCon: '',
    time: 5,
    disabled: true,
    isMatch: 0,
    signFlag: true,
    showNewUser: false,
    my_header_avater: dialogApp.globalData.imageUrl + "/userCenterIcon/defaultMyIcon.svg",

  },
  pageLifetimes: {
    show: function () {
      let _self = this;
      //   util.getThemeColor().then((themeColor:string)=>{
      this.setData({
        themeColor: wx.getStorageSync('themeColor') || dialogApp.globalData.themeColor
      })
      // })
      _self.setData({
        disabled: true,
        time: 5
      })
      util.checkLogin().then(() => {
        _self.setData({
          shopKeeperInfo: JSON.parse(wx.getStorageSync('userInfo'))
        })
        // console.log('登录后的保存')
        if (wx.getStorageSync('protocolInfo')) {
          if (!wx.getStorageSync('notloginProSubmit')) {
            if (_self.data.componentType == 1) {
              setTimeout(() => {
                _self.saveProtocol(1);//只走一次
              }, 1500);
            }
          } else {
            if (_self.data.componentType == 1) {
              _self.getLoginProtocols();//避免一起出现
            } else {
              // if(!_self.data.showProtocol&&_self.data.componentType != 1){
              //
              // }
            }
          }
        }
      }).catch(() => {
        // console.log('没登录该做的事情');
        if (this.data.componentType == 1) {
          _self.getNotLoginProtocols();
        }

      })

    },
  },

  attached() {
    // console.log('我先执行');
    // util.checkLogin().then(()=>{
    // }).catch(()=>{
    //   this.getNotLoginProtocols();
    // })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
      getChangeTheme.svgColor(url, color, type).then((res: any) => {
        this.setData({ [name]: res })
      })


    },

    //检查是否补全信息
    checkAddInfo() {
      // if (this.data.componentType == 3) {
      if (wx.getStorageSync('addInfo') == 0) {
        // let themeIcon = getChangeTheme.svgColor(this.data.my_header_avater, wx.getStorageSync('themeColor'), "stroke");
        this.setData({
          // my_header_avater: themeIcon,
          showAddInfoDialog: true,
        });
        this.changeColor('my_header_avater', this.data.my_header_avater, wx.getStorageSync('themeColor'), "stroke")
        wx.hideTabBar({});
        this.triggerEvent('dialogevent', { params: true });
      } else {
        if (wx.getStorageSync('globalMessage').length > 0 && wx.getStorageSync('userInfo')) {
        } else {
          wx.showTabBar({});


        }

        this.setData({
          showAddInfoDialog: false,
        });
      }


      //   }
    },
    //禁止滚动
    preventTouchMove() {
      return;
    },
    //关闭弹窗
    close() {
      this.setData({
        showProtocol: false
      })
    },
    //取消电话
    cancelPhone() {
      this.setData({
        showCallPhone: false,
      });
      this.triggerEvent('middleChangePosition', false);
      this.triggerEvent('dialogevent', { params: true });
    },
    //拨打电话
    callPhone() {
      wx.makePhoneCall({
        phoneNumber: this.data.phone,
      })
    },
    //信息补全
    goUserInfo() {
      wx.navigateTo({
        url: '/packageUser/pages/userInfo/userInfo?state=completionInfo',
      })
    },
    //登录协议
    getLoginProtocols() {
      let that = this;
      util.request(api.getProtocols).then(function (res: any) {
        if (res && res.data) {
          // console.log('登录后的协议',res.data);
          that.setData({
            shopLevel: JSON.parse(wx.getStorageSync('userInfo')).shop.level,
            protocolCon: res.data.memberTermsInfos[1]['content'],
            isMatch: res.data.memberTermsInfos[1].isMatch,
            protocols: res.data.memberTermsInfos[1],
            signFlag: res.data.memberTermsInfos[1].signFlag
          });
          wx.setStorageSync('protocolInfo', that.data.protocols);
          //协议是否有更新--弹出协议
          if (that.data.isMatch == 0 || that.data.signFlag == false) {
            that.setData({
              showProtocol: true,
            });
            wx.hideTabBar({});
            that.cutDown();
            that.triggerEvent('dialogevent', { params: true });
          } else {
            that.checkAddInfo();
            // that.setData({
            //   showNewUser:true
            // })
          }
        }
      });
      // }
    },
    //未登录协议
    getNotLoginProtocols() {
      let that = this;
      util.showOtherToast('加载中', 'loading', 4000);
      util.request(api.getNoLoginProtocols).then(function (res: any) {
        if (res && res.data) {
          wx.hideToast();
          that.setData({
            protocolCon: res.data.visitorTermsInfos[1]['content'],
            protocols: res.data.visitorTermsInfos[1],
            protocolsVersion: res.data.visitorTermsInfos[1]['version'],
          });
          wx.setStorageSync('userProtocolInfo', res.data.visitorTermsInfos[0]);
          wx.setStorageSync('newProtocolInfo', res.data.visitorTermsInfos[1]);
          //是否展示弹窗（本地存储小于接口版本弹）
          if (wx.getStorageSync('protocolInfo')) {
            if (that.data.protocolsVersion != wx.getStorageSync('protocolInfo')['version']) {
              that.setData({
                showProtocol: true,
              });
              wx.hideTabBar({});
              that.triggerEvent('dialogevent', { params: true });
            } else {
              that.setData({
                showProtocol: false,
              });
              that.triggerEvent('dialogevent', { params: true });
            }
          } else {
            that.setData({
              showProtocol: true,
            });
            wx.hideTabBar({});
            that.triggerEvent('dialogevent', { params: true });
          }
          that.cutDown();
        }
        // console.log('隐私=====', that.data.protocols);
      });
    },
    //倒计时
    cutDown() {
      var that = this;
      var countDown = that.data.time;
      var timer = setInterval(() => {
        countDown--;
        that.setData({
          disabled: true,
          time: countDown
        });
        if (countDown == 0) {
          clearInterval(timer);
          that.setData({
            disabled: false,
            time: 5
          })
        }
      }, 1000)
    },
    agree() {
      let _that = this;
      util.checkLogin().then(() => {
        _that.saveProtocol(2);
      }).catch(() => {
        wx.setStorageSync('protocolInfo', this.data.protocols);
        this.setData({
          //   showNewUser:true,
          showProtocol: false,
        });
        this.triggerEvent('dialogevent', { params: true });
        if (wx.getStorageSync('userInfo') && wx.getStorageSync('globalMessage').length > 0) {
        } else {
          wx.showTabBar({});

        }
      })
    },
    //保存提交协议
    saveProtocol(num: number) {
      let _this = this;
      util.request(api.saveProtocols, { agreeEmp: "4", memberId: JSON.parse(wx.getStorageSync('userInfo')).partner.nkMemberId, termsId: wx.getStorageSync('protocolInfo').id, typeId: wx.getStorageSync('protocolInfo').typeId }, 'POST').then((res: any) => {
        if (res && res.data) {
          if (num == 1) {
            //存前端的协议保存
            wx.setStorageSync('notloginProSubmit', true);
          }
          _this.setData({
            showProtocol: false,
            disabled: true
          });
        //   wx.getStorageSync('showMessage') && 
          if (wx.getStorageSync('userInfo') && wx.getStorageSync('messageList').length > 0) {
          } else {
            wx.showTabBar({});

          }
          _this.checkAddInfo();
          // console.log('条款保存成功');
        }
      });
    },
    openSharePosters() {
      let painting = {
        width: 248,
        height: 400,
        background: '#fff',
        clear: true,
        views: [
          {
            type: 'rect',
            top: 0,
            left: 0,
            width: 248,
            height: 418,
            background: '#fff'
          },
          {
            type: 'text',
            content: '恭喜您的如新NU店',
            fontSize: 16,
            lineHeight: 20,
            color: '#383549',
            textAlign: 'left',
            top: 190,
            left: 56,
            MaxLineNumber: 2,
            breakWord: true,
            // bolder: true
          },
          {
            type: 'text',
            content: '等级已提升至',
            fontSize: 16,
            lineHeight: 20,
            color: '#383549',
            textAlign: 'left',
            top: 220,
            left: 60,
            MaxLineNumber: 2,
            breakWord: true
          },
          {
            type: 'text',
            content: 'V.' + JSON.parse(wx.getStorageSync('userInfo')).shop.level,
            fontSize: 16,
            lineHeight: 20,
            color: wx.getStorageSync('themeColor'),
            textAlign: 'left',
            top: 220,
            left: 160,
            MaxLineNumber: 2,
            breakWord: true,
            // bolder: true
          },
          {
            type: 'image',
            url: JSON.parse(wx.getStorageSync('userInfo')).partnerProfile.avatar,
            top: 250,
            left: 24,
            width: 25,
            height: 25
          },
          {
            type: 'text',
            content: JSON.parse(wx.getStorageSync('userInfo')).shop.name,
            fontSize: 12,
            lineHeight: 20,
            color: '#383549',
            textAlign: 'left',
            top: 258,
            left: 55,
            width: 70,
            MaxLineNumber: 2,
            breakWord: true,
            // bolder: true
          },
          {
            type: 'text',
            content: '向你推荐',
            fontSize: 10,
            lineHeight: 14,
            color: '#8c8c8c',
            textAlign: 'left',
            top: 290,
            left: 24,
            width: 50,
            MaxLineNumber: 1,

          },
          {
            type: 'text',
            content: '如新NU店小程序 ',
            fontSize: 14,
            lineHeight: 14,
            color: '#4A4A4A',
            textAlign: 'left',
            top: 310,
            left: 24,
            width: 190,
            MaxLineNumber: 2,
            breakWord: true,
            // bolder: true
          },
          {
            type: 'image',
            url: '',
            top: 320,
            left: 170,
            width: 60,
            height: 60,
          },
          {
            type: 'image',
            url: '../../images/icons/canvas_addBg.svg',
            top: 340,
            left: 24,
            width: 30,
            height: 30,
          },

          {
            type: 'image',
            url: '../../images/icons/level_1.png',
            top: 49,
            left: 53,
            width: 142,
            height: 132,
          },
        ],
      }
      this.setData({
        showNewUser: false
      })
      this.triggerEvent('openSharePosters', painting)
    }
  }
})
