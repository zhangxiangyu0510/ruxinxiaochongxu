// miniprogram/pages/ucenter/userInfo/index.js
var loginOut = getApp<IAppOption>();
var api = require('../../../config/api')
var util = require('../../../utils/util');
import imClient from "../../../utils/imClient";
import { svgColor } from "../../../utils/changeThemeColor";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeColor: loginOut.globalData.themeColor || wx.getStorageSync("themeColor"),
    my_header_avater: loginOut.globalData.imageUrl + "/userCenterIcon/defaultMyIcon.svg",
    hasUserInfo: false,
    ValueMaxlength: 32,
    userInfo: {//自定义业务字段
      avatar: '',
      nickname: '',
      name: '',
      gender: '',
      mobile: '',
      age: '',
      constellation: '',
      address: ['北京市', '北京市'],
      wechatNo: '',
      tiktokNo: '',
      microblogNo: '',
      xiaoHongShuNo: '',
      cnCardNo: '',
      provinceName: '',
      cityName: '',
      regionName: ''
    },
    newAgreementsId: '',
    avatar: '',//头像路径
    uploadUrl: "",//上传的头像路径
    region: [],
    seeDetail: false,
    completionInfo: false,
    genderData: {
      3: '保密',
      1: "男",
      2: "女"
    },
    isFocus1: false,
    isFocus2: false,
    isFocus3: false,
    isFocus4: false,
    isFocus5: false,
    isHandleClick: true
  },
  handleFocus(e: any) {
    this.setData({
      [e.currentTarget.dataset.type]: true
    })
  },
  gettermsAndagreements() {
    util.request(api.getNewTermdetails).then((res: any) => {
      console.log(res, "这是最新的协议", res.data[0].termsId);
      this.setData({
        newAgreementsId: res.data[0].termsId
      })
    })
  },
  //   条款管理跳转
  termsAndagreements(event: any) {
    console.log(event, "event12312312");
    if (event.currentTarget.dataset.value == 1) {
      wx.navigateTo({
        url: '/packageUser/pages/termsManagement/index'
      })
    } else {
      wx.navigateTo({
        url: `/packageUser/pages/protocolDetails/index?code=${this.data.newAgreementsId}`
      })
    }
  },
  isChineseChar(str: string): any {
    var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/g
    return str.match(reg)
  },
  changeValue(e: any) {
    let chinese = this.isChineseChar(e.detail.value) && this.isChineseChar(e.detail.value).length || 0
    if (e.detail.value.length - chinese + chinese * 2 >= 32) {
      this.setData({
        ValueMaxlength: e.detail.value.length
      })
    }

  },
  handleChoiceItem(e: any): void {
    console.log(e);
    let item = e.currentTarget.dataset.item;
    if (item.name === "所在地") {
    }
  },
  bindRegionChange: function (e: any): void {
    console.log('picker发送选择改变，携带值为', e, e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  handleUpImg() {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ['album', 'camera'],
      success(res: any) {
        let currentUrl = res.tempFiles[0].tempFilePath
        console.log(currentUrl, "9999999");
        wx.navigateTo({
          url: `/packageUser/pages/uploadAvatar/index?src=${currentUrl}`
        })

      },
      fail(err: any) {
        console.log(err);
      }
    })
  },
  // 保存
  formSubmit(e: any) {
    if (!this.data.isHandleClick) return
    let data = {
      partner: {
        microblogNo: '',
        tiktokNo: '',
        wechatNo: '',
        xiaoHongShuNo: ''
      },
      partnerProfile: {
        avatar: this.data.uploadUrl ? this.data.uploadUrl : this.data.avatar,
        nickname: this.data.userInfo.nickname,
        provinceName: this.data.userInfo.provinceName,
        cityName: this.data.userInfo.cityName,
        regionName: this.data.userInfo.regionName
      }
    }
    let value = e.detail.value;
    data.partner.microblogNo = value.microblogNo;
    data.partner.tiktokNo = value.tiktokNo;
    data.partner.wechatNo = value.wechatNo;
    data.partner.xiaoHongShuNo = value.xiaoHongShuNo
    data.partnerProfile.nickname = value.nickname
    data.partnerProfile.provinceName = this.data.region[0]
    data.partnerProfile.cityName = this.data.region[1]
    // 微信号校验
    let reg = /^[a-zA-Z0-9]([-_a-zA-Z0-9]{5,19})$/
    if (data.partner.wechatNo && !reg.test(data.partner.wechatNo)) {
      util.showErrorToast('请输入正确的微信号');
      return
    }
    let r = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
    if (r.test(data.partner.microblogNo)) {
      util.showErrorToast('请勿输入表情');
      return
    }
    if (r.test(data.partner.tiktokNo)) {
      util.showErrorToast('请勿输入表情');
      return
    }
    if (r.test(data.partner.xiaoHongShuNo)) {
      util.showErrorToast('请勿输入表情');
      return
    }
    if (!data.partnerProfile.nickname) return util.showErrorToast('昵称不能为空')
    if (!/^\S*$/.test(value.nickname)) return util.showErrorToast('输入昵称不能有空格')
    this.setData({
      isHandleClick: false
    })
    util.request(api.putUserInfo, data, "PUT").then((res: any) => {
      wx.showToast({
        title: '已保存',
        icon: 'success',
        duration: 2000,
        success() {
          wx.setStorageSync('addInfo', 1);
          setTimeout(() => {
            // util.backAddress();
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }
      });
    }).catch((err: any) => {
      this.setData({
        isHandleClick: true
      })
      console.log(err);
      if (err.data.errMessage === "头像存在敏感信息") {
        this.setData({
          avatar: this.data.userInfo.avatar,
          uploadUrl: ''
        })
      }
      wx.showToast({
        title: err.errMessage,
        icon: 'error',
        duration: 2000,
        success() {
          setTimeout(() => {
            util.backAddress();
          }, 2000)
        }
      });
    })
  },
  // 退出登录
  handleLogOut() {
    wx.showToast({
      title: '退出成功',
      icon: 'success',
      duration: 2000,
      success() {
        imClient.disconnect();
        wx.getStorageSync("token") && wx.removeStorageSync("token");
        wx.getStorageSync("access_token") && wx.removeStorageSync("access_token");
        wx.getStorageSync("nuskinToken") && wx.removeStorageSync("nuskinToken");
        wx.getStorageSync("openId") && wx.removeStorageSync("openId");
        wx.getStorageSync("userInfo") && wx.removeStorageSync("userInfo");
        wx.getStorageSync("cookie") && wx.removeStorageSync("cookie");
        wx.getStorageSync("permisssion") && wx.removeStorageSync("permisssion");
        wx.getStorageSync("bgIndex") && wx.removeStorageSync("bgIndex");
        util.getThemeColor().then((themeColor: string) => {
          wx.setStorageSync('themeColor', themeColor);
          loginOut.globalData.themeColor = themeColor;
        });
        setTimeout(() => {
          wx.switchTab({
            url: "/pages/ucenter/index/index"
          })
        }, 2000)
      }
    });
  },
  handleBack() {
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ state }: { state: string }) {

    this.gettermsAndagreements()
    // completionInfo 信息补全
    // seeDetail 查看信息
    // editInfo 编辑信息
    this.getUserInfo()
    if (state === "seeDetail") {
      this.setData({
        seeDetail: true
      })
    } else if (state === "completionInfo") {
      this.setData({
        completionInfo: true,
        seeDetail: true
      })
      console.log(this.data.completionInfo);

    } else {
      this.setData({
        completionInfo: false,
        seeDetail: false
      })
    }
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
  getUserInfo() {
    util.request(api.getShopInfo).then((res: any) => {
      let userInfo = { ...res.data.partner, ...res.data.partnerProfile }
      userInfo.name = this.noPassByName(res.data.partnerProfile.realName)
      userInfo.age = userInfo.birthday && util.getCurrentAge(new Date(userInfo.birthday)) || ''
      this.setData({
        userInfo,
        avatar: userInfo.avatar,
        // region: address
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let themeIcon: string = svgColor(this.data.my_header_avater, this.data.themeColor, "stroke")
    this.setData({
      // my_header_avater: themeIcon,
      themeColor: loginOut.globalData.themeColor
    })
    this.changeColor('my_header_avater', this.data.my_header_avater, this.data.themeColor, "stroke")
  },
  changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
    svgColor(url, color, type).then((res: any) => {
      this.setData({ [name]: res })
    })


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})