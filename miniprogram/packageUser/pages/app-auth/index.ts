import imClient from "../../../utils/imClient";

// pages/app-auth/app-auth.ts
let appLogin = getApp<IAppOption>();
var api = require('../../../config/api')
var util = require('../../../utils/util');
var changeSvg = require('../../../utils/changeThemeColor');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPhoneDialog1: false,
    showPhoneDialog2: false,
    showSingleStop: false,
    errorText: '',
    checked: false,
    protocol: [],
    isNewUser: '',
    logo: appLogin.globalData.imageUrl + '/icons/logo.svg',
    submitAccess: true,
    // logo: appLogin.globalData.imageUrl+'/icons/logo.svg',
    // Rectangle946: appLogin.globalData.imageUrl+'/icons/Rectangle946.svg',
    // Group: appLogin.globalData.imageUrl+'/icons/Group.svg',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    console.log('地址上过来的数据', options);
    if (options.isNewUser) {
      this.setData({
        isNewUser: options.isNewUser
      })
    }
  },
  tapDialogButton() {
    this.setData({
      showSingleStop: false,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  bindHideToast() {
    this.setData({
      errorText: ''
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // this.setData({
    //   logo: changeSvg.svgColor(this.data.logo, appLogin.globalData.themeColor),
    //   Rectangle946: changeSvg.svgColor(this.data.Rectangle946, appLogin.globalData.themeColor),
    //   Group: changeSvg.svgColor(this.data.Group, appLogin.globalData.themeColor),
    // });

    this.changeColor('logo', this.data.logo, appLogin.globalData.themeColor)
    // this.changeColor('logo',this.data.logo,appLogin.globalData.themeColor)
    // this.changeColor('Rectangle946',this.data.Rectangle946,appLogin.globalData.themeColor)
    // this.changeColor('Group',this.data.Group,appLogin.globalData.themeColor)


  },
  changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
    changeSvg.svgColor(url, color, type).then((res: any) => {
      this.setData({ [name]: res })
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
  dialogevent(e: any) {
    console.log('e.detail.params=======', e.detail.params);
    // this.setData({
    //   showDialog: e.detail.params
    // })
  },
  radioChange(e: any) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var checked = this.data.checked;
    this.setData({
      "checked": !checked
    });
  },
  isAgree() {
    if (!this.data.checked) {
      util.showErrorToast('请先阅读用户注册协议')
    }
  },
  goProtocol(e: any) {
    console.log('1111', e, this.data.protocol);
    var index = e.currentTarget.dataset.index;
    // var content = this.data.protocol[index]['content'];
    // console.log('12345====', content);
    wx.navigateTo({
      url: '/packageUser/pages/protocol/protocol?index=' + index
    })
  },
  //getphone
  getPhoneNumber(e: any) {
    let self = this;
    self.setData({
      showPhoneDialog1: false,
      showPhoneDialog2: false,
    })
    console.log('获取手机号码====', e);
    if (!this.data.checked) {
      util.showErrorToast('请先阅读用户注册协议')
    } else {
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        self.setData({
          showPhoneDialog1: false,
          showPhoneDialog2: false,
        })
        wx.login({
          success: (res) => {
            if (res.code) {
              //确认
              var userSIngleInfo = JSON.parse(wx.getStorageSync('permisssion').rawData);
              util.request(api.AuthLoginByWeixin, { nickname: userSIngleInfo.nickName, avatar: userSIngleInfo.avatarUrl, wechatPhoneCode: e.detail.code, loginType: 2, wechatCode: res.code }
                , 'POST').then(function (res: any) {
                  if (res && res.data.accessToken) {
                    wx.setStorageSync("cookie", res.data.accessToken);
                    wx.setStorageSync("currentUserInfo", res.data.currentUserInfo);
                    wx.setStorageSync("userSign", res.data.userSign);
                    util.getThemeColor().then((themeColor: string) => {
                      wx.setStorageSync('themeColor', themeColor);
                      appLogin.globalData.themeColor = themeColor;
                      self.getShopAndUserInfo();
                    });

                  }
                }).catch((error: any) => {
                  if (error.data.errorCode == '100023') {
                    self.setData({
                      showPhoneDialog2: true,
                    })
                  } else if (error.data.errorCode == '100026') {
                    self.setData({
                      showSingleStop: true,
                    });
                  } else if (error.data.errorCode == '100015' || error.data.errorCode == '100034') {
                    self.setData({
                      errorText: error.data.errMessage,
                    });
                  }
                });
            }
          }
        })
      } else {
        if (e.detail.errMsg === 'getPhoneNumber:fail user deny' || e.detail.errMsg === 'getPhoneNumber:fail:user deny') {
          wx.showModal({
            title: '提示',
            content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
            showCancel: false,
            confirmText: '返回授权',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击了“返回授权”');
              }
            }
          });
        } else {
          wx.showModal({
            title: '提示',
            content: '小程序主体企业未完成微信认证，无法授权获取手机号',
            showCancel: false,
            confirmText: '确定'
          });
        }

      }

    }

  },
  goOtherLogin() {
    if (!this.data.checked) {
      util.showErrorToast('请先阅读用户注册协议')
    } else {
      wx.navigateTo({
        url: '/packageUser/pages/phoneLogin/index'
      })
    }
  },
  goLogin() {
    let code = '';
    let _that = this;
    var userSIngleInfo = JSON.parse(wx.getStorageSync('permisssion').rawData);
    if (!this.data.checked) {
      util.showErrorToast('请同意用户注册协议')
    } else {
      if (this.data.isNewUser == "true") {
        console.log('jinlail====', this.data.isNewUser)
        this.setData({
          showPhoneDialog1: true,
        })
      } else {
        if (this.data.submitAccess) {
          _that.setData({
            submitAccess: false,
          })
          wx.login({
            success: (res) => {
              code = res.code;
              if (code) {
                util.request(api.AuthLoginByWeixin, { nickname: userSIngleInfo.nickName, avatar: userSIngleInfo.avatarUrl, wechatCode: code, loginType: 2, wechatToken: wx.getStorageSync('token') }
                  , 'POST').then(function (res: any) {
                    console.log('不获取手机号码的直接登录====', res);
                    if (res && res.data.accessToken) {
                      wx.setStorageSync("cookie", res.data.accessToken);
                      wx.setStorageSync("currentUserInfo", res.data.currentUserInfo);
                      wx.setStorageSync("userSign", res.data.userSign);
                      util.getThemeColor().then((themeColor: string) => {
                        wx.setStorageSync('themeColor', themeColor);
                        appLogin.globalData.themeColor = themeColor;
                        _that.getShopAndUserInfo();
                      });
                    }
                  }).catch((error: any) => {
                    if (error.data.errorCode == '100023') {
                      _that.setData({
                        showPhoneDialog2: true,
                      })
                    } else if (error.data.errorCode == '100026') {
                      _that.setData({
                        showSingleStop: true,
                      });
                    } else if (error.data.errorCode == '100015' || error.data.errorCode == '100034') {
                      _that.setData({
                        errorText: error.data.errMessage,
                      });
                    }
                  });
              }
            },
          });
          setTimeout(() => {
            this.setData({
              submitAccess: true,
            })
          }, 2500)
        }
      }
    }
  },
  closeDialog() {
    this.setData({
      showPhoneDialog1: false,
      showPhoneDialog2: false
    });
  },
  getShopAndUserInfo() {
    //todo 回到上一个页面
    let _that = this;
    util.getH5token()
    util.request(api.getShopInfo).then(function (res: any) {
      // console.log('获取的店铺信息====', res);
      if (res && res.data.partner) {
        wx.setStorageSync("userInfo", JSON.stringify(res.data));
        wx.setStorageSync('addInfo', res.data.shop.level);
        wx.setStorageSync('isLogin', true);
        util.showOtherToast('登录成功', 'success');
        if (imClient.connected) {
          imClient.disconnect();
        }
        const imInfo = { userID: wx.getStorageSync("currentUserInfo").uid, userSig: wx.getStorageSync("userSign") }
        imClient.connect(imInfo);
        setTimeout(() => {
          util.backAddress();
          _that.saveProtocol();
        }, 1500)
      }
    });
  },
  //同意用户注册协议
  saveProtocol() {
    // console.log('同意用户协议');
    util.request(api.saveProtocols, { agreeEmp: "4", memberId: JSON.parse(wx.getStorageSync('userInfo')).partner.nkMemberId, termsId: wx.getStorageSync('userProtocolInfo').id, typeId: wx.getStorageSync('userProtocolInfo').typeId }, 'POST').then(() => {
    });
  }
})