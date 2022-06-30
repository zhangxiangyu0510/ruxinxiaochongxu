// packageRecommend/pages/changeSkin/changeSkin.ts
var changeSvg2 = require('../../../utils/changeThemeColor');
let recommendApp = getApp<IAppOption>();
var util = require('../../../utils/util');
var api = require('../../../config/api');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showUse: false,

    active: 0,
    isUse: 0,
    themeColor: recommendApp.globalData.themeColor,
    selectSkin: {},
    styleList: [
      { isActive: true, isMoren: true, url: '/packageRecommend/images/morebg.svg', text: '默认皮肤' },
      { isActive: true, url: '/packageRecommend/images/chun.png', text: '春暖花开' },
      { isActive: true, url: '/packageRecommend/images/xia.png', text: '夏日炎炎' },
      { isActive: true, url: '/packageRecommend/images/qiu.png', text: '一叶知秋' },
      { isActive: true, url: '/packageRecommend/images/dong.png', text: '冰天雪地' }
    ],
    egList: ['https://img1.baidu.com/it/u=4127991555,3421789262&fm=253&fmt=auto&app=138&f=JPEG?w=680&h=454', 'https://img1.baidu.com/it/u=4127991555,3421789262&fm=253&fmt=auto&app=138&f=JPEG?w=680&h=454']

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    if (this.data.active == this.data.isUse) {
      this.setData({ showUse: true })
    }
    this.getList();

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
    util.getThemeColor().then((res: any) => {
      console.log('123456789', res);
      wx.setStorageSync('themeColor', res);
      console.log('此时缓存里的主题色======', wx.getStorageSync('themeColor'))
      recommendApp.globalData.themeColor=res;
      this.setData({themeColor:res})
        
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
  getList() {
    var _this = this;
    util.request(api.skinList, {}).then((res: any) => {
      console.log(res);
      res.data.forEach(item => {
        console.log(item);
        item.name = item.name.slice(0, 4);

      });
      _this.setData({ styleList: res.data, selectSkin: res.data[0], });
      _this.getSkinDetail();



    })

  },
  getSkinDetail() {
    util.request(api.getSkinDetail, {}).then((res: any) => {
      console.log(res);
      // _this.setData({egList:res.data.posterImage});
      this.setData({ selectSkin: res.data, isUse: res.data.id,themeColor:res.data.primaryColor });
      recommendApp.globalData.themeColor = res.data.primaryColor;
      wx.setStorageSync('themeColor', res.data.primaryColor);
      this.getPreview();
      if (this.data.isUse == this.data.selectSkin.id) {
        this.setData({ showUse: true });
      } else {
        this.setData({ showUse: false });

      }

    })

  },
  getPreview() {
    wx.showLoading({ title: '加载中' })
    var _this = this;
    util.request(api.previewDetail, { skinId: this.data.selectSkin.id }).then((res: any) => {
      console.log(res);
      var str = res.data.previewImages.slice(1, res.data.previewImages.length - 1)
      console.log(str);
      var arr: Array<string> = [];
      var array: Array<string> = [];
      if (str) {
        arr = str.split(',');
      }
      console.log(str)
      arr.forEach(item => {
        array.push(item.slice(1, item.length - 1));

      })
      // arr = JSON.parse(str)
      console.log(array);
      wx.hideLoading();
      _this.setData({ egList: array });

    })


  },
  // 更新皮肤
  updateSkin() {
    util.request(api.updateSkin, { skinId: this.data.selectSkin.id }).then((res: any) => {
      console.log(res);
      // _this.setData({styleList:res.data});
      if (res.data) {
        this.getSkinDetail();
      }



    })


  },
  toRecommend() {
    this.updateSkin();

  },


  changeActive(e) {
    this.setData({ active: e.currentTarget.dataset.item.id, selectSkin: e.currentTarget.dataset.item })
    if (e.currentTarget.dataset.item.id == this.data.isUse) {
      this.setData({ showUse: true })
    } else {
      this.setData({ showUse: false })

    }
    this.getPreview();
  }

})