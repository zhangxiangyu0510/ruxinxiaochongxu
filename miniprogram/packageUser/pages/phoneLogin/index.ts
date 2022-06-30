let appLogins = getApp<IAppOption>();
var api = require('../../../config/api')
var util = require('../../../utils/util');
import imClient from "../../../utils/imClient";
var Encrypt = require('./jsencrypt');
var changeSvg = require('../../../utils/changeThemeColor');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    times:0,
    subflag:false,
    placeHolder1:"请输入CN号/手机号/证件号/邮箱",
    placeHolder3:"请输入密码",

    placeHolder2: "请输入手机号",
    placeHolder4:  "请输入验证码",
    placeHolder5:  "请输入手机验证码",
    showPhoneDialog2: false,
    showSingleStop:false,
    errorText:'',
    imageCode: '',
    time: 60,
    timer: {},
    phoneDisabled: false,
    smsDisabled: false,
    bgHightColor: false,
    logo: appLogins.globalData.imageUrl+'/icons/logo.svg',
    // logo: appLogins.globalData.imageUrl+'/icons/logo.svg',
    // Rectangle946: appLogins.globalData.imageUrl+'/icons/Rectangle946.svg',
    // Group: appLogins.globalData.imageUrl+'/icons/Group.svg',
    themeColor: appLogins.globalData.themeColor,

    form: {
      mobile: '',
      image_code: '',
      graphic_code_id: '',
      smsCode: '',

      // 前端暂时定义
      account: '',
      //   密码
      loginPassWord: '',
    },
    current: 1,
   

  },
  tapDialogButton() {
    this.setData({
      showSingleStop: false,
    })
  },
  bindHideToast() {
    this.setData({
    errorText: ''
    })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
      console.log(1);
    //获取图形验证码
    this.getImgCode();

  },
  onHide: function () {
    // 页面隐藏
  },

  loginTab(event: any) {
    var data = {};
    if (event.currentTarget.dataset.current == 2) {
      data = {
        "form.image_code": '',
        "form.graphic_code_id": '',
      }
      this.changeImgCode()
    }
    this.setData({
      current: event.currentTarget.dataset.current,
      //   form:this.data.form,
      ...data,
    })

  },
  isHight() {
    if (this.data.form.mobile && (/^1[3-9]\d{9}$/.test(this.data.form.mobile)) && this.data.form.mobile.length == 11 && this.data.form.image_code.length == 4) {
      this.setData({
        bgHightColor: true
      })
    } else {
      this.setData({
        bgHightColor: false
      })
    }
  },
  phoneHandle(event: any) {
    if (event.detail.value) {
        this.setData({
            [this.data.current==2?"placeHolder2":"placeHolder1"]    :'',
            [this.data.current==2?"form.mobile":"form.account"]   : event.detail.value
          })
          this.data.current==2&&  this.isHight();
        } else {
          this.setData({
            [this.data.current==2?"placeHolder2":"placeHolder1"]:this.data.current==2?'请输入手机号':'请输入CN号/手机号/证件号/邮箱',
            [this.data.current==2?"form.mobile":"form.account"] : ''
          })
        }
  },
  imgHandle(event: any) {
    if (event.detail.value) {
        this.setData({
          'placeHolder4':'',
          "form.image_code": event.detail.value
        })
        this.isHight();
      } else {
        this.setData({
          'placeHolder4':'请输入验证码',
          "form.image_code": ''
        })
      }
  },
  smsHandle(event: any) {
    if (event.detail.value) {
      this.setData({
           // [this.data.current==2?"placeHolder5":"placeHolder3"]:'',
        [this.data.current == 2 ? "form.smsCode" : "form.loginPassWord"]: event.detail.value
      })
    } else {
      this.setData({
           // [this.data.current==2?"placeHolder5":"placeHolder3"]:this.data.current==2?'请输入手机验证码':'请输入密码',
        [this.data.current == 2 ? "form.smsCode" : "form.loginPassWord"]: ''
      })
    }
  },
  changeImgCode() {
    this.getImgCode();
  },
  getImgCode() {
    let _that = this;
    util.request(api.getPhoneImgCode).then(function (res: any) {
      if (res && res.data.image) {
        _that.setData({
          imageCode: 'data:image/jpeg;base64,' + res.data.image.replace(/[\r\n]/g, ""),
          "form.graphic_code_id": res.data.uniqueId
        })

      }
      console.log(res);
    });
  },
  getPhoneCode() {
    let self = this;
    // console.log('1111手机验证码');
    //获取手机验证码
    if (!this.data.form.mobile || !(/^1[3-9]\d{9}$/.test(this.data.form.mobile)) || this.data.form.mobile.length < 11 || !this.data.form.image_code) {
      util.showErrorToast('请输入正确的手机号和图形验证码');
    } else {
      let that = this;
      that.setData({
        smsDisabled: true,
      });
      util.request(api.getPhoneCode, that.data.form).then((res: any) => {
        if (res && res.data) {
          that.setData({
            "form.graphic_code_id": res.data
          })
          util.showOtherToast('获取成功', 'success')
          that.cutDown();
        }
      }).catch(() => {
        that.getImgCode();
      });
      setTimeout(() => {
        that.setData({
          smsDisabled: false,
        });
      }, 1500)
    }
  },
  cutDown() {
    var that = this;
    var countDown = that.data.time;
    var timer = setInterval(() => {
      countDown--;
      console.log('开始倒计时');
      that.setData({
        phoneDisabled: true,
        time: countDown
      });
      if (countDown == 0) {
        clearInterval(timer);
        that.setData({
          phoneDisabled: false,
          smsDisabled: false,
          time: 60
        })
      }
    }, 1000)
  },
  encryption(text: string) {
    let cryptFirst = new Encrypt.JSEncrypt();
    cryptFirst.setPublicKey("MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKGMO7wkQhOozmdT+cOghhC+m/5D0dbvzxnFNhKLjUmmBy7r4xTtnFe1K5P9j4sQwrIGAvtgZdS9oDJ0H2XvgwcCAwEAAQ==");
    return cryptFirst.encrypt(text)
  },
  closeDialog() {
    this.setData({
      showPhoneDialog2: false
    });
  },
  //getphone
  getPhoneNumber(e: any) {
    let self = this;
    console.log('获取手机号码====', e);

    if (e.detail.errMsg == "getPhoneNumber:ok") {
      self.setData({
        showPhoneDialog2: false,
      })
      self.submitForm(1, e.detail.code)
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


  },
  submitForm(num: number, str: string) {
    let that = this;
   
    if (this.data.current == 2) {
      if (!this.data.form.mobile) {
        util.showErrorToast('请输入手机号')
      } else if (!(/^1[3-9]\d{9}$/.test(this.data.form.mobile)) || this.data.form.mobile.length < 11) {
        util.showErrorToast('请输入正确的手机号')
      } else if (!this.data.form.image_code) {
        util.showErrorToast('请输入图形验证码')
      } else if (!this.data.form.smsCode) {
        util.showErrorToast('请输入手机验证码')
      } else {
        util.showOtherToast('加载中', "loading");
        wx.login({
          success: (res) => {
            if (res.code) {
              console.log(res.code, "res.code");
              var userSIngleInfo = JSON.parse(wx.getStorageSync('permisssion').rawData);
              util.request(api.AuthLoginByWeixin, { nickname: userSIngleInfo.nickName, avatar: userSIngleInfo.avatarUrl, loginType: 3, wechatCode: res.code, mobile: that.data.form.mobile, smsCode: that.data.form.smsCode, imageCode: that.data.form.image_code, uniqueId: that.data.form.graphic_code_id }
                , 'POST').then(function (res: any) {
                  // console.log('手机验证码====', res);
                  wx.hideToast();
                  if (res && res.data.accessToken) {
                    util.showOtherToast('登录成功', 'success')
                    wx.setStorageSync("cookie", res.data.accessToken);
                    wx.setStorageSync("currentUserInfo", res.data.currentUserInfo);
                    wx.setStorageSync("userSign", res.data.userSign);
                    util.getThemeColor().then((themeColor: string) => {
                      console.log('@@@@@@@@',themeColor)
                      wx.setStorageSync('themeColor', themeColor);
                      appLogins.globalData.themeColor = themeColor;
                      that.getShopAndUserInfo();
                    });
                  }
                }).catch((error:any)=>{
                    wx.hideToast();
                    if(error.data.errorCode=='100015'||error.data.errorCode=='900003'){
                        that.setData({
                            errorText:error.data.errMessage,
                        }) 
                    }else if(error.data.errorCode=='100026'){
                        that.setData({
                            showSingleStop:true,
                        }) 
                    }
                });
            }
          }
        })
      }
    } else if (this.data.current == 1) {
        if( this.data.subflag){
            return
        }
        this.data.subflag = true
        clearTimeout(this.data.times)
        this.data.times = setTimeout(()=>{
            if(!wx.getStorageSync('cookie')){
                this.data.subflag = false
            }
        },2000)
      if (!this.data.form.account) {
        util.showErrorToast('请输入CN号/手机号/证件号/邮箱')
      } else if (!this.data.form.loginPassWord) {
        util.showErrorToast('请输入密码')
      } else {
        util.showOtherToast('加载中', "loading");
        let passWord = this.encryption(this.data.form.loginPassWord);
        wx.login({
          success: (res) => {

            if (res.code) {
              console.log(res, "wodayingde");
              var userSIngleInfo = JSON.parse(wx.getStorageSync('permisssion').rawData);
              var data: any = { nickname: userSIngleInfo.nickName, avatar: userSIngleInfo.avatarUrl, loginType: 4, wechatCode: res.code, loginPassWord: passWord, account: that.data.form.account }
              if (num === 1) {
                data.wechatPhoneCode = str
              }

              util.request(api.AuthLoginByWeixin, data
                , 'POST').then((res: any) => {
                    wx.hideToast();
                  // console.log('手机验证码====', res);
                  if (res && res.data.accessToken) {
                    // wx.setStorageSync("cookie", res.data.accessToken);
                    // wx.setStorageSync("nuskinToken", res.data.nuskinToken);
                    // that.getShopAndUserInfo();
                    util.showOtherToast('登录成功', 'success')
                    wx.setStorageSync("cookie", res.data.accessToken);
                    wx.setStorageSync("currentUserInfo", res.data.currentUserInfo);
                    wx.setStorageSync("userSign", res.data.userSign);
                    util.getThemeColor().then((themeColor: string) => {
                      console.log('@@@@@@@@',themeColor)
                      wx.setStorageSync('themeColor', themeColor);
                      appLogins.globalData.themeColor = themeColor;
                      that.getShopAndUserInfo();
                    })
                   
                  }
                }).catch((error: any) => {
                  // bindPhone
                  wx.hideToast();
                  console.log('error====', error);
                  if (error.data.errorCode == '100024') {
                    that.setData({
                      showPhoneDialog2: true,
                    })
                  }else if(error.data.errorCode=='100015' ||error.data.errorCode=='100034'){
                        that.setData({
                            errorText:error.data.errMessage,
                        }) 
                    }else if(error.data.errorCode=='100026'){
                        that.setData({
                            showSingleStop:true,
                        }) 
                    }
                });
            }
          }
        })
      }
    }
  },
  getShopAndUserInfo() {
    //todo 回到上一个页面
    let _that = this;
    util.getH5token();
    util.request(api.getShopInfo).then(function (res: any) {
      console.log('获取的店铺信息====', res);
      if (res && res.data.partner) {
        wx.setStorageSync('userInfo', JSON.stringify(res.data));
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
      // logo: changeSvg.svgColor(this.data.logo, appLogins.globalData.themeColor),
      // Rectangle946: changeSvg.svgColor(this.data.Rectangle946, appLogins.globalData.themeColor),
      // Group: changeSvg.svgColor(this.data.Group, appLogins.globalData.themeColor),
    })
    this.changeColor('logo',this.data.logo, appLogins.globalData.themeColor);
    this.changeColor('Rectangle946',this.data.Rectangle946, appLogins.globalData.themeColor);
    this.changeColor('Group',this.data.Group, appLogins.globalData.themeColor);

  },
  changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
    changeSvg.svgColor(url, color,type).then((res:any)=>{
      this.setData({[name]:res})
    })


  },

  /**
   * 生命周期函数--监听页面隐藏
   */


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  goOverCard() {
    //如新 终止卡页面
    wx.navigateTo({
      url: `/pages/customPage/index?url=${appLogins.globalData.customerH5}/shop/accountActivation&flag=activation&type=miniProgram`
    })
  }

})