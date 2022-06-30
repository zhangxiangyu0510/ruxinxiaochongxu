// index.ts
import imClient from "../../utils/imClient";
import { EventBusInstance } from '../../utils/eventBus'


// 获取应用实例
const indexApp = getApp<IAppOption>();
var changeSvg = require('../../utils/changeThemeColor');
var api = require('../../config/api')
var util = require('../../utils/util');

Page({
  data: {
    showAllPage: false,
    wxQrcode: '',
    wxQrcodeData: {},
    disabled: true,
    showDialog: false,
    UpgradeDialogShow: true,
    showShare: false,
    // base64Imag:'',
    painting: '',
    shareData: {},
    imageUrl: indexApp.globalData.imageUrl,
    zuo: indexApp.globalData.imageUrl + '/icons/huangguan.svg',
    you: indexApp.globalData.imageUrl + '/icons/beijing.svg',
    noticeIcon: indexApp.globalData.imageUrl + '/icons/notice.svg',
    nuBg: indexApp.globalData.imageUrl + '/icons/myFans.svg',
    myFans: indexApp.globalData.imageUrl + '/icons/myFans.svg',
    fansBg: indexApp.globalData.imageUrl + '/icons/fans_bg.svg',
    myBadge: indexApp.globalData.imageUrl + '/icons/myBadge.svg',
    deAvatar: indexApp.globalData.imageUrl + '/icons/user_avatar.svg',
    my_header_avater: indexApp.globalData.imageUrl + '/icons/user_avatar.svg',
    themeColor: indexApp.globalData.themeColor,
    indexTopSwiper: true,
    noticeScroll: true,
    bg: '',
    banners: [],
    noticeList: [],
    items: [{ name: '单品推荐', path: '/packageRecommend/pages/myRecommend/myRecommend?refresh=true', icon: indexApp.globalData.imageUrl + '/icons/icon_1.svg' }, { name: '组合推荐', path: '/packageRecommend/pages/hybridRecommend/hybridRecommend', icon: indexApp.globalData.imageUrl + '/icons/icon_2.svg' }, { name: '顾客档案', path: '/packageUser/pages/customerLabelingProcess/customerlist/customerlist', icon: indexApp.globalData.imageUrl + '/icons/icon_3.svg' }, { name: '店铺预览', path: '/packageUser/pages/previewShop/index', icon: indexApp.globalData.imageUrl + '/icons/icon_4.svg' }],
    // , { name: '我的NU币', path: '/packageRecommend/pages/NUcoin/myNUcoin/myNUcoin', icon: indexApp.globalData.imageUrl + '/icons/icon_5.svg' }
    
    importCustomers: [],
    userInfo: {},
    hasUserInfo: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),// 如需尝试获取用户信息可改为false
    fontFamily: indexApp.globalData.fontFamily,
    page: 0,
    bannerTime: 3000,
    noMore: false,
    empty: false,
    isLoad: false,
    lastLightingData: {},
    path: new util.link(),
    showBg: true,
    achievementInfoList: []
  },
  dialogevent(e: any) {
    this.setData({
      showDialog: e.detail.params
    })
  },
  // 关闭分享
  closeSharePosters() {
    this.setData({
      showShare: false
    })
  },
  strCode(str: any) {  //获取字符串的字节数
    var count = 0;  //初始化字节数递加变量并获取字符串参数的字符个数
    if (str) {  //如果存在字符串，则执行
      let len = str.length;
      for (var i = 0; i < len; i++) {  //遍历字符串，枚举每个字符
        if (str.charCodeAt(i) > 255) {  //字符编码大于255，说明是双字节字符(即是中文)
          count += 2;  //则累加2个
        } else {
          count++;  //否则递加一次
        }
      }
      return count;  //返回字节数
    } else {
      return 0;  //如果参数为空，则返回0个
    }
  },
  // 打开分享
  openSharePosters(ev: any) {
    this.setData({
      wxQrcodeData: {}
    })  
    let _userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    console.log(_userInfo.shop.id)
    let _themeColor = wx.getStorageSync('themeColor').substring(1)

    util.showOtherToast('加载中', "loading");
    let _data = JSON.parse(JSON.stringify(ev.detail))
    _data.views[5].content = _userInfo.partnerProfile.nickname
    _data.views[6].content = _userInfo.partner.mobile
    _data.views[7].content = _userInfo.partnerProfile.nickname
    let _namewidth = 0
    let nameWidthArr = _userInfo.partnerProfile.nickname.split('')
    nameWidthArr.forEach(item => {
      let number = item.replace(/[^\x00-\xff]/g, "**")
      if (number == "**") {
        _namewidth = _namewidth + 15
      } else if (!isNaN(number)) {
        _namewidth = _namewidth + 9.9
      } else {
        _namewidth = _namewidth + 10

      }
    });
    if (_namewidth >= 88) {
      _data.views[9].left = _data.views[7].left + 85
    } else {
      _data.views[9].left = _data.views[7].left + _namewidth
    }
    if (_namewidth >= 170) {
      _data.views[6].top = _data.views[6].top + 16
      _data.views[10].top = _data.views[10].top + 16
    }
    _data.views[11].url = _userInfo.partnerProfile.avatar || indexApp.globalData.imageUrl + '/icons/accountPictures.png'


    let noAvatar = {
      type: 'roundRect',
      top: 45,
      left: 79,
      width: 90,
      height: 90,
      background: '#fff',
      borderRadius: 45
    }
    _data.views.splice(5, 0, noAvatar);
    // _data.views[13].url= decodeURIComponent(this.data.addIcon)
    // debugger
    this.setData({
      painting: _data,
      showShare: true,
    })
    let requstdata = {
      id: _userInfo.shop.id,
      path: `pages/loadingPage/loadingPage?shopId=${_userInfo.shop.id}&tc=${_themeColor}`,
      shareKey: '',
    }
    util.request(api.shareShop + '/' + _userInfo.shop.id, requstdata, 'post').then((res: any) => {
      let _wxQrcodeData = {
        type: 'image',
        url: res.data.wxQrcode,
        top: 260,
        left: 170,
        width: 50,
        height: 50,
        isBase64: true
      }
      console.log('shareKey', res.data.shareKey)
      wx.setStorageSync('shareKey', res.data.shareKey)
      this.setData({
        shareData: res.data,
        wxQrcode: res.data.wxQrcode,
        wxQrcodeData: _wxQrcodeData
      })
      wx.hideToast();
    }).catch(() => {
      util.showOtherToast('加载失败');


    })
  },
  goFansList() {
    wx.navigateTo({
      url: '../../packageUser/pages/customerLabelingProcess/fansList/fansList',
    })
  },
  upgradeOpenShare(ev: any) {
    this.setData({
      painting: ev.detail
    })
    this.setData({
      UpgradeDialogShow: false
    })
    this.setData({
      showShare: true
    })
  },
  goEnHome() {
    wx.navigateTo({
      url: `/pages/customPage/index?url=${indexApp.globalData.customerH5}/shop/productPoints&type=enhome`
    })
  },
  changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
    changeSvg.svgColor(url, color, type).then((res: any) => {
      this.setData({ [name]: res })
    })


  },
  changeColorArray(name: string, index: number, obj: any, key: any, url: string, color = '#EBEBEB', type = 'fill') {
    console.log(url, color, type)
    changeSvg.svgColor(url, color, type).then((res: any) => {
      obj[index][key] = res;
      var key = name + '[' + index + '].icon'
      console.log(key)
      this.setData({ [key]: res })
      console.log(obj);
      console.log(this.data)
    })
    // this.setData({[name[index]]:obj})
  },
  goNews() {
    wx.navigateTo({
      url: '/packageUser/pages/shopowner/shopowner'
    })
  },
  navigationTo(e: any) {
    console.log(e)
    if (e.currentTarget.dataset.item.name != '单品推荐' && e.currentTarget.dataset.item.name != '组合推荐' && e.currentTarget.dataset.item.name != '顾客档案') {
    }
    if (e.currentTarget.dataset.item.name == '单品推荐') {
      console.log(this.data.path.btnClick, '$$$$')
      this.data.path.btnClick((res: any) => {
        wx.navigateTo({
          url: res
        })
      })
      return;

    }

    wx.navigateTo({
      url: e.currentTarget.dataset.item.path,
    })
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 80) {
      this.setData({ showBg: false })

    } else {
      this.setData({ showBg: true })

    }




  },
  handleMylevel() {
    if (wx.getStorageSync("cookie")) {
      wx.navigateTo({
        url: "/packageUser/pages/mylevel/mylevel"
      })
    }
  },
  goLogin() {
    util.getUserProfile();
  },
  onPullDownRefresh: function () {
    console.log('refresh')
    if (wx.getStorageSync("cookie")) {//登录成功后解决初次加载的时差
      this.getUserInfo();
      this.getCustomerFocus();
      this.getNotice();
    }
    this.closeSharePosters()
    this.getBanner();
    this.setData({ importCustomers: [], page: 0 });
    wx.stopPullDownRefresh();
  },
  getLastLighting() {
    util.request(api.getLastLighting).then((res: any) => {
      console.log('最后点亮的徽章====', res);
      if (res && res.data) {
        this.setData({
          lastLightingData: res.data
        })
      }
    }).catch((e: any) => {
      console.log('eeeee', e);

    })
  },
  getShopLevel(level: any) {
    util.request(api.getShopLevel).then((res: any) => {
      wx.setStorageSync("levelList", res.data.achievementInfoList)
      this.setData({
        achievementInfoList: res.data.achievementInfoList.filter((item: any) => {
          if (item.level === level) {
            return item
          }
        }) || []
      })
      wx.setStorageSync("levelImage", this.data.achievementInfoList[0] && this.data.achievementInfoList[0].levelImage)

      console.log(this.data.achievementInfoList, "店铺等级");
    })
  },
  onLoad() {
    this.getBanner();
    console.log(this.data.themeColor)
    console.log('loadloaflod')
    if (wx.getStorageSync("cookie")) {//登录成功后解决初次加载的时差
      this.getUserInfo();
      this.getCustomerFocus();
    }
    this.closeSharePosters()

  },
  onHide: function () {
    this.setData({
      indexTopSwiper: false,
      noticeScroll: false
    });
    this.selectComponent("#dialogProtocol").close();
  },
  onShow: function () {
    this.setData({ path: new util.link() })
    util.getUrl();
    if (wx.getStorageSync("cookie") && !imClient.connected) {
      const imInfo = { userID: wx.getStorageSync("currentUserInfo").uid, userSig: wx.getStorageSync("userSign") }
      imClient.connect(imInfo)
    }
    this.setData({
      themeColor: wx.getStorageSync('themeColor') || indexApp.globalData.themeColor,

    });
    console.log(this.data.themeColor)
    this.changeColor('addIcon', indexApp.globalData.imageUrl + '/icons/hybridRecommend_add.svg', 'rgba(127, 127, 127, 0.2)')
    this.changeColor('deAvatar', this.data.deAvatar, this.data.themeColor, "stroke")
    this.changeColor('zuo', this.data.zuo, this.data.themeColor)
    this.changeColor('you', this.data.you, this.data.themeColor)
    this.changeColor('noticeIcon', this.data.noticeIcon, this.data.themeColor)
    this.changeColor('nuBg', this.data.nuBg, this.data.themeColor)
    this.changeColor('myFans', this.data.myFans, this.data.themeColor)
    this.changeColor('fansBg', this.data.fansBg, this.data.themeColor)
    this.changeColor('myBadge', this.data.myBadge, this.data.themeColor)
    this.changeColor('zuo1', this.data.zuo, 'rgba(64, 64, 64, 0.8)')
    this.changeColor('you1', this.data.you, 'rgba(64, 64, 64, 0.8)')
    this.changeColor('zuo2', this.data.zuo, 'rgba(127, 127, 127, 0.8)')
    this.changeColor('you2', this.data.you, 'rgba(127, 127, 127, 0.8)')
    this.changeColor('my_header_avater', this.data.my_header_avater, this.data.themeColor, "stroke")
    // this.changeColor('myBadge',this.data.myBadge, indexApp.globalData.themeColor, "stroke")
    //c
    this.data.items.forEach((item, index) => {
      this.changeColorArray('items', index, this.data.items, 'icon', item.icon, indexApp.globalData.themeColor);
    });
    // this.setData({
    //   items: changeItem
    // })
    this.selectComponent("#dialogProtocol").close();
    if (wx.getStorageSync('cookie')) {
      this.setData({ 'bg': wx.getStorageSync('bgIndex') });
      this.getCustomerFocus();
      this.getNotice();
      this.getLastLighting()
      wx.setStorageSync('isLogin', false);
    } else {
      this.setData({ 'bg': '' });

    }
    this.closeSharePosters()
    util.checkLogin().then(() => {
      this.getUserInfo();
      this.setData({
        hasUserInfo: true,
        showDialog: true
      });

      console.log('测试专属字段--token====', wx.getStorageSync('cookie'));
      console.log('测试专属字段--shopid====', JSON.parse(wx.getStorageSync('userInfo')).shop.id);
    }).catch(() => {
      this.setData({
        hasUserInfo: false,
      });
    })
    this.setData({
      indexTopSwiper: true,
      noticeScroll: true,
      autoplay: true
    });
    wx.removeStorageSync('categoryId');
    console.log(this.selectComponent("#notificationDialog"));
    EventBusInstance.on('notification', (data: any) => {
      console.log('page index:', data)
      this.selectComponent("#notificationDialog").push(data)
    }, true)
  },

  getUserInfo() {
    let that = this
    util.request(api.getShopInfo).then((res: any) => {
      let data = res.data
      if (data.shop && data.shop.startTime) {
        data.shopTime = util.timeTmp(data.shop.startTime)
      }
      wx.setStorageSync("userInfo", JSON.stringify(res.data))
      wx.setStorageSync("shopId", res.data.shop.id)
      console.log(data, "00000");
      this.getShopLevel(res.data.shop.level)
      that.setData({
        userInfo: data,
        hasUserInfo: true,
      });
    }).catch(() => {
      that.setData({
        hasUserInfo: false,
      });
    })
  },
  getBanner() {
    var _this = this;
    console.log('eee')
    util.request(api.getBanner).then((res: any) => {
      console.log('!!!!', res)
      res.data.forEach((item: any) => {

        var re = new RegExp("^(http|https)://", "i");
        console.log(item, '@@@@@0', re.test(item.bannerItemVo.imageUrl))


        item.bannerItemVo.imageUrl = re.test(item.bannerItemVo.imageUrl) ? item.bannerItemVo.imageUrl : 'https://' + item.bannerItemVo.imageUrl


      });

      res.data.sort((a: any, b: any) => { return a.bannerItemVo.sequence - b.bannerItemVo.sequence })
      console.log(res.data)
      _this.setData({ banners: res.data })
      _this.setData({ bannerTime: res.data[0].intervals ? res.data[0].intervals * 1000 : 3000 })

    })

  },
  getNotice() {
    console.log('notice')
    let _this = this

    util.request(api.getNotice).then((res: any) => {
      console.log(res)
      _this.setData({ noticeList: res.data })
    })

  },
  toNoticeDetail(e: any) {
    console.log(e);

  },
  toMyBarder() {
    wx.navigateTo({
      url: '/packageUser/pages/myBadge/myBadge'
    })
  },
  //获取重点顾客列表
  getCustomerFocus() {
    // wx.showLoading({
    //   title: '加载中',
    // })
    this.setData({ isLoad: true });
    let _this = this
    let _userInfo
    if (wx.getStorageSync('userInfo')) {
      _userInfo = JSON.parse(wx.getStorageSync('userInfo'))
      util.request(api.getCustomerFocus, { shop_id: _userInfo.shop.id, size: 10, page: _this.data.page, }).then((res: any) => {
        if (res.data.length == 0 && _this.data.page == 0) {
          _this.setData({ empty: true })
        } else {
          _this.setData({ empty: false })

        }
        console.log('99999', res);

        res.data.forEach((item: { lastOrderInfo: { orderTime: string | number | Date; }; }) => {
          if (item.lastOrderInfo) {
            console.log(item.lastOrderInfo.orderTime)
            var getDate = new Date(item.lastOrderInfo.orderTime.replace(/-/g, '/'))
            item.lastOrderInfo.orderTime = getDate.getFullYear() + '-' + (getDate.getMonth() + 1) + '-' + getDate.getDate()
            console.log(item.lastOrderInfo.orderTime, '@@@@@@')
            if (item.lastOrderInfo.images.length > 3) {
              item.lastOrderInfo.images = item.lastOrderInfo.images.slice(0, 3);

            }


          }

        });
        console.log(res.data)
        var arr: Array<any> = []
        if (this.data.page != 0) {
          arr = _this.data.importCustomers.concat(res.data);


        } else {
          arr = res.data
        }
        console.log(arr)

        _this.setData({ importCustomers: arr })
        if (res.data.length < 10) {
          _this.setData({ noMore: true })
        }
        _this.setData({ isLoad: false })
        wx.hideLoading();
      })
    }
    console.log('!!!!!!', _userInfo)
  },
  goOrderDetail(e: any) {
    // console.log('准备进入订单详情页',e.currentTarget);
    console.log(e, '!!!!')
    // console.log('/packageUser/pages/customerLabelingProcess/customerorderdetail/customerorderdetail?orderNo='+e.currentTarget.dataset.id+'&id='+e.currentTarget.dataset.nkmemberid)

    wx.navigateTo({
      url: '/packageUser/pages/customerLabelingProcess/customerorderdetail/customerorderdetail?orderNo=' + e.currentTarget.dataset.id + '&id=' + e.currentTarget.dataset.userid,
    })
  },
  onReachBottom() {
    console.log(this.data.noMore)
    if (this.data.noMore || this.data.isLoad) {
      return;
    } else {
      console.log('111');
      var num = this.data.page;
      this.setData({ page: num + 1 })
      this.getCustomerFocus();

    }



  },
  toCustomerDetail(e: any) {
    // console.log(e.currentTarget.dataset.id);

    wx.navigateTo({
      url: '/packageUser/pages/customerLabelingProcess/custormDetail/custormDetail?id=' + e.currentTarget.dataset.item.userId
        + '&nkMemberId=' + e.currentTarget.dataset.item.nkMemberId
    })

  },
  toLink(e: any) {
    util.checkLogin().then(() => {
    console.log(e);

    if (e.currentTarget.dataset.banner.type == 1) {
      wx.navigateTo({
        url: e.currentTarget.dataset.banner.url,
      })
    } else if (e.currentTarget.dataset.banner.type == 2) {
      console.log(e.currentTarget.dataset.banner.appId)
      var appid = e.currentTarget.dataset.banner.appId.replace('"', "").replace('"', "").replace("'", "").replace("'", "");
      wx.navigateToMiniProgram({
        appId: appid,
        path: e.currentTarget.dataset.banner.url,
        extraData: {
            nuskinAuth:wx.getStorageSync('access_token'),
            flag:'shopkeeper'
        },
        envVersion: 'trial',// 体验版   正式版release
        success(res) {
          // 打开成功
        },
        fail: function (err) {
          console.log(err);
        }
      })
    } else {
      console.log('lanjie====',e.currentTarget.dataset.banner);
      let currentParams=decodeURIComponent(e.currentTarget.dataset.banner.url);
      let getUrl=currentParams.includes('?')?currentParams.split('?')[0]:currentParams;
      let getParams=currentParams.includes('?')?currentParams.split('?')[1]:'';
      console.log('nadaode===',getParams);
    
    wx.navigateTo({
      url: `/packageUser/pages/bannerDetail/bannerDetail?url=${getUrl}&${getParams}`,
    
    })

    }
}).catch(() => {
    util.getUserProfile()
  })

  }

})
