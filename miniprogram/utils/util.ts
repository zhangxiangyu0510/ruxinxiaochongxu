var api = require('../config/api');
import imClient from "./imClient";
function formatTime(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}
function formatDateNoSecond(date: Date, noday: false) {
  var date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  const day = date.getDate()
  if (noday) {
    return (
      [year, month].map(formatNumber).join('-')
    )

  } else {
    return (
      [year, month, day].map(formatNumber).join('-')
    )

  }

}
function formatNumber(n: number) {
  const s = n.toString()
  return s[1] ? s : '0' + s
}
function toQfw(num: any) {
  var num = (num || 0).toString(), re = /\d{3}$/, result = '';
  while (re.test(num)) {
    result = RegExp.lastMatch + result;
    if (num !== RegExp.lastMatch) {
      result = ',' + result;
      num = RegExp.leftContext;
    } else {
      num = '';
      break;
    }
  }
  if (num) { result = num + result; }
  return result;
};
//去登录
function loginNow() {
  let userInfo = wx.getStorageSync('userInfo');
  if (userInfo == '') {
    wx.navigateTo({
      url: '/pages/app-auth/index',
    });
    return false;
  } else {
    return true;
  }
}
//api
function request(url: any, data: any = {}, method: any = "GET", header = {
  'Content-Type': 'application/json',
  'X-Auth-Token': wx.getStorageSync('cookie')
}) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header,
      success: function (res: any) {
        // 200, 400, 401和403
        if (res.statusCode == 200) {
          resolve(res);
        } else if (res.statusCode == 401) {
          //重新登录
          console.log('x-transaction-id===', res && res.header ? res.header['x-transaction-id'] : '');
          showErrorToast('登录态失效请重新登录');
          imClient.disconnect();
          wx.getStorageSync("token") && wx.removeStorageSync("token");
          wx.getStorageSync("openId") && wx.removeStorageSync("openId");
          wx.getStorageSync("userInfo") && wx.removeStorageSync("userInfo");
          wx.getStorageSync("access_token") && wx.removeStorageSync("access_token");
          wx.getStorageSync("nuskinToken") && wx.removeStorageSync("nuskinToken");
          wx.getStorageSync("cookie") && wx.removeStorageSync("cookie");
          wx.getStorageSync("permisssion") && wx.removeStorageSync("permisssion");
          wx.getStorageSync("userSign") && wx.removeStorageSync("userSign");
          wx.getStorageSync("currentUserInfo") && wx.removeStorageSync("currentUserInfo");
        } else if (res.statusCode == 400 || res.statusCode == 403) {
          console.log('x-transaction-id===', res && res.header ? res.header['x-transaction-id'] : '');
          if (res.data.errorCode != '100023' && res.data.errorCode != '100024' && res.data.errorCode != '100026' && res.data.errorCode != '100015' && res.data.errorCode != '100034' && res.data.errorCode != '400009' && res.data.errorCode != '10001') {
            showErrorToast(res.data.errMessage);
            // reject(res)
          } else if (res.data.errorCode == '400009' || res.data.errorCode == '10001') {
            showErrorToast(res.data.errMessage);
            reject(res)
          } else if (res.data.errorCode == '100023' || res.data.errorCode == '100034' || res.data.errorCode == '100024' || res.data.errorCode == '100026' || res.data.errorCode == '100015') {
            reject(res)
          } else {
            reject(res.errMsg);
          }
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}
//是否登录
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('cookie')) {
      resolve(true);
      //   checkSession().then(() => {
      //     resolve(true);
      //   }).catch(() => {
      //     reject(false);
      //   });
    } else {
      reject(false);
    }
  });
}
function changeColor(url, color, type) {
  changeSvg.svgColor(url, color, type).then(res => {
    return res
  })


}
//过期
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}
//返回xx-xx-xx
function formatDate(inputTime: any) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d;

}
function formatDate2(inputTime: any) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  // m = m < 10 ? ('0' + m) : m;
  return y + '年' + m + '月';

}
function formatDate3(inputTime: any) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;

}
//整数千分位格式化
function toThousands(num: any) {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}
//用户信息
function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

//toLink
class link {
  myRecommend: any;
  offRecommend: any;
  callBack: any;
  btnClick: any;

  constructor() {
    this.btnClick = (callBack: any) => {
      this.callBack = callBack
      this.exec()


    }
    console.log('$$$4')
    this.myRecommend = null;
    this.offRecommend = null;
    let _userInfo
    if (wx.getStorageSync('userInfo')) {
      _userInfo = JSON.parse(wx.getStorageSync('userInfo'))



      request(api.recommendationList, { shop_id: _userInfo.shop ? _userInfo.shop.id : 30 }).then((res: any) => {
        console.log('myrecomend')
        if (res.data.searchShopProductDtos && res.data.searchShopProductDtos.length > 0) {
          this.myRecommend = res.data.searchShopProductDtos;
        } else {
          this.myRecommend = [];
        }
        this.exec();
      })
      request(api.recommendationAll, {}, 'get').then((res: any) => {
        console.log('myoff')
        if (res.data) {
          this.offRecommend = res.data
        } else {
          this.offRecommend = [];
        }
        this.exec();
      })
      console.log('@@@@@')
    }


  };
  // btnClick(callBack:Function){
  //   this.callBack = callBack
  //   this.exec()

  // }
  exec() {
    if (this.myRecommend == null || this.offRecommend == null || this.callBack == null) {
      return;
    }
    if (this.myRecommend.length > 0) {
      this.callBack('/packageRecommend/pages/myRecommend/myRecommend');
      return;

    }
    if (this.offRecommend.length > 0) {
      this.callBack('/packageRecommend/pages/offcialRecommend/offcialRecommend');
      return;

    } else {
      this.callBack('/packageRecommend/pages/myRecommend/myRecommend');


    }

  }


}
// function buildLink(){

//   return new link();

// }
//登录
function login() {
  return new Promise(function (resolve: any, reject: any) {
    wx.login({
      success: function (res) {
        if (res.code) {
          //登录远程服务器
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}
function showErrorToast(msg: string) {
  wx.showToast({
    title: msg,
    icon: 'none',
  });
  return false;
}
function showOtherToast(msg: string, icons: any = "none", duration: number = 1500) {
  wx.showToast({
    title: msg,
    icon: icons,
    duration: duration,
  });
  return false;
}
function GetAge(identityCard: string): number {
  let len: number = (identityCard + "").length;
  let strBirthday = "";
  if (len == 18) {
    //处理18位的身份证号码从号码中得到生日和性别代码
    strBirthday =
      identityCard.substr(6, 4) +
      "/" +
      identityCard.substr(10, 2) +
      "/" +
      identityCard.substr(12, 2);
  }
  if (len == 15) {
    let birthdayValue = "";
    birthdayValue = identityCard.charAt(6) + identityCard.charAt(7);
    if (parseInt(birthdayValue) < 10) {
      strBirthday =
        "20" +
        identityCard.substr(6, 2) +
        "/" +
        identityCard.substr(8, 2) +
        "/" +
        identityCard.substr(10, 2);
    } else {
      strBirthday =
        "19" +
        identityCard.substr(6, 2) +
        "/" +
        identityCard.substr(8, 2) +
        "/" +
        identityCard.substr(10, 2);
    }
  }
  //时间字符串里，必须是“/”
  let birthDate = new Date(strBirthday);
  let nowDateTime = new Date();
  let age = nowDateTime.getFullYear() - birthDate.getFullYear();
  //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
  if (
    nowDateTime.getMonth() < birthDate.getMonth() ||
    (nowDateTime.getMonth() == birthDate.getMonth() &&
      nowDateTime.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

function timeTmp(s: number) {
  const time = 24 * 60 * 60 * 1000
  let n = new Date().valueOf()//当前时间戳
  let tmpDate = (n - s) / time

  if (tmpDate < 36.5) {
    return 0.1
  } else {
    return (tmpDate / 365).toFixed(1)
  }
}
function getCurrentAge(startTime: Date, endTime = new Date()): number {
  if (!startTime) return 0
  // 获取年份
  let startYear = startTime.getFullYear();
  let endYear = endTime.getFullYear();
  // 获取月份
  let startMonth = startTime.getMonth() + 1;
  let endMonth = endTime.getMonth() + 1;
  // 获取天
  let startDay = startTime.getDate();
  let endDay = endTime.getDate();
  // 年份相差
  let tmpYear = endYear - startYear;
  let tmp = 0
  if (endMonth === startMonth) {
    if (endDay <= startDay) {
      tmp = -1
    } else {
      tmp = 1
    }
  } else if (endMonth > startMonth) {
    tmp = 1
  } else if (endMonth < startMonth) {
    tmp = -1
  }
  return tmpYear + tmp
}
function getUrl() {
  var pages = getCurrentPages();
  var currentPage = pages[pages.length - 1];
  var url = currentPage.route;
  wx.setStorageSync('Router', `/${url}`)
  var options = currentPage.options;
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  wx.setStorageSync('Url', `/${urlWithArgs}`)
}
function backAddress() {
  let router = wx.getStorageSync('Router') || '/pages/index/index';
  let url = wx.getStorageSync('Url') || '/pages/index/index';
  if (router == '/pages/index/index' || router == '/pages/worker/worker' || router == '/pages/news/news' || router == '/pages/ucenter/index/index') {
    wx.switchTab({
      url: router,
    })
  } else {
    wx.redirectTo({
      url: url,
    })
  }
}
function getUserProfile() {
  // let that = this;
  let code = '';
  let isNewUser = '';
  wx.login({
    success: (res) => {
      code = res.code;
      console.log('获取code===', code);
    },
  });
  // 获取用户信息
  wx.getUserProfile({
    lang: 'zh_CN',
    desc: '用户登录',
    success: (res: any) => {
      let loginParams = {
        code: code,
        encryptedData: res.encryptedData,
        iv: res.iv,
        rawData: res.rawData,
        signature: res.signature
      };
      request(api.getToken + '?code=' + code).then(function (res: any) {
        // console.log('接口后的=====', res);
        if (res && res.data) {
          isNewUser = res.data.newUser;
          wx.setStorageSync('token', res.data.wechatToken);
          wx.setStorageSync('openId', res.data.openId);
          wx.setStorageSync('unionId', res.data.unionId);
          wx.navigateTo({
            url: '/packageUser/pages/app-auth/index?isNewUser=' + isNewUser
          })
        }
      });
      // console.log('登录信息====', loginParams);
      wx.setStorageSync('permisssion', loginParams);

    },
    // 失败回调
    fail: () => {
      showErrorToast('授权失败，请重新尝试');
    }
  });
}
//获取商城token
function getH5token() {
  //拿到商城的token
  // + '?shar_key=' + wx.getStorageSync('shar_key')
  // +'?shar_key=1d887e2b3bb38565'
  request(api.getH5Token).then(function (res: any) {
    if (res && res.data) {
      console.log('shar_key====', res.data);
      wx.setStorageSync("access_token", res.data.nuskinToken);
      wx.setStorageSync("nuskinToken", res.data.shopToken.access_token);
    }
  });
}
function reverseData(str: string) {
  var reverse = str.split("").reverse().join("")
  console.log(reverse);

}
function isTwo(str: string): string {
  if (Number(str) < 10) {
    return '0' + str
  } else {
    return str
  }
}
//公共参数
function getCommonArguments() {
  let params: any = {
    token: wx.getStorageSync("nuskinToken") || null,
    nuskinToken: wx.getStorageSync('access_token') || null,
    userInfo: wx.getStorageSync('userInfo') ? JSON.parse(wx.getStorageSync('userInfo')) : null,
    fromType: 'shopkeeper',
    channelId: 9,
    sessionInfo: {
      openId: null,
      unionId: null,
    },
    shopkeeperId: null,
    msShopId: null
  }
//   params.userInfo.mobile = JSON.parse(wx.getStorageSync('userInfo')).partner.mobile;
  if (wx.getStorageSync('userInfo')) {
    params.userInfo.mobile = JSON.parse(wx.getStorageSync('userInfo')).partner.mobile;
    params.userInfo.partnerProfile.avatar = '';
  }

  if (wx.getStorageSync('cookie')) {
    params.sessionInfo.openId = wx.getStorageSync("openId");
    params.sessionInfo.unionId = wx.getStorageSync('unionId');
    params.shopkeeperId = JSON.parse(wx.getStorageSync('userInfo')).partner.nkMemberId;
    params.msShopId = JSON.parse(wx.getStorageSync('userInfo')).shop.id;
  } else {
    params.sessionInfo = null;
    params.shopkeeperId = null;
    params.msShopId = null;
  }
  return params


}
//公共参数
// function getCommonArguments() {
//   let params: any = {
//     token: wx.getStorageSync("nuskinToken") || null,
//     nuskinToken: wx.getStorageSync('access_token') || null,
//     userInfo: wx.getStorageSync('userInfo') || null,
//     fromType: 'shopkeeper'
//   }
//   checkLogin().then(() => {
//     params['sessionInfo.openId'] = wx.getStorageSync("openId");
//     params['sessionInfo.unionId'] = wx.getStorageSync('unionId');
//     params['sessionInfo.unionId'] = wx.getStorageSync('unionId');
//     params['shopkeeperId'] =  JSON.parse(wx.getStorageSync('userInfo')).partner.nkMemberId
//     params['msShopId'] =  JSON.parse(wx.getStorageSync('userInfo')).shop.id
//   }).catch(() => {
//     params['sessionInfo'] = null;
//   });
//   return params;
// }
function getThemeColor() {
  return new Promise((resolve, reject) => {
    checkLogin().then(() => {
      request(api.getSkinDetail).then((res: any) => {
        console.log(res, 'utils')
        wx.setStorageSync('bgIndex', res.data.primaryBackgroundImage);
        wx.setStorageSync('canvasBg', res.data.posterImage);
        if (res && res.data.primaryColor) {
          wx.setStorageSync('themeColor', res.data.primaryColor);
          resolve(res.data.primaryColor);
        } else {
          wx.setStorageSync('themeColor', '#7340B3');
          resolve('#7340B3');
        }
      })
    }).catch(() => {
      request(api.getSkin).then((res: any) => {
        if (res && res.data.primaryColor && res.data.primaryColor !== '') {
          wx.setStorageSync('themeColor', res.data.primaryColor);
          resolve(res.data.primaryColor);
        } else {
          wx.setStorageSync('themeColor', '#7340B3');
          resolve('#7340B3');
        }
      })
    })

  })

}

module.exports = {
  formatTime,
  formatNumber,
  loginNow,
  request,
  checkLogin,
  checkSession,
  getUserInfo,
  login,
  formatDate,
  formatDate2,
  formatDate3,
  toThousands,
  showErrorToast,
  GetAge,
  getCurrentAge,
  getH5token,
  getUserProfile,
  getUrl,
  backAddress,
  timeTmp,
  showOtherToast,
  isTwo,
  getCommonArguments,
  formatDateNoSecond,
  getThemeColor,
  toQfw,

  link
}

export { checkLogin }
