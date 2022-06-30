// pages/ucenter/replaceProduct/replaceProduct.ts
const changeSvg = require('../../../utils/changeThemeColor');
var api = require('../../../config/api')
var util = require('../../../utils/util');
const apps = getApp<IAppOption>();
Page({

  swiperChange(e: any) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },
  // 排序
  amendGoodsSort() {
    const that = this;
    let _userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    if (this.data.isSort && this.data.isMove) {
      util.request(api.HybridRecommendsort + '/' + _userInfo.shop.id, this.data.HybridRecommendListData,
        'put').then(function (res: any) {
          // 排序成功重新请求数据
          that.getPageList()
        });



    }
    that.setData({
      isSort: !this.data.isSort
    })
  },
  edtAmendGoodsSort() {
    this.getPageList()
    let _that = this
    setTimeout(() => {
      _that.setData({
        isSort: !this.data.isSort,
        // HybridRecommendListData: []
      })
    }, 500);


  },

  goToAddGoods(e: any) {
    // if(e.currentTarget.dataset.type=='replace'){
    wx.setStorageSync('fenceData', JSON.stringify(e.currentTarget.dataset.item))
    // }
    wx.navigateTo({
      url: '/packageRecommend/pages/productClassification/productClassification',
    })

  },
  init() {
    // 获取店主信息
    let _info = {}
    if (wx.getStorageSync('userInfo')) {
      _info = JSON.parse(wx.getStorageSync('userInfo'))
      this.setData({
        shopkeeperInfoData: _info
      })
    } else {
      this.getShopkeeperInfo()
    }
    this.getPageList()





  },
  // 跳转商品详情
  changeGoodsItem(ev) {
    return
    if (ev.currentTarget.dataset.item.shopProductItemList.length == 0) {
      return
    }
    let _id = ev.currentTarget.dataset.item.id || ev.currentTarget.dataset.item.officialRecommendationId
    let _isOfficial = ev.currentTarget.dataset.item.isOfficial
    let _operationType = ev.currentTarget.dataset.item.operationType

    // if (_isOfficial) {
    //   return
    // }
    wx.navigateTo({
      url: `/packageRecommend/pages/productDetail/productDetail?id=${_id}&isOfficial=${_isOfficial}&operationType=${_operationType}`
    })


  },
  // 获取组合推荐列表
  getPageList() {
    let that = this
    util.showOtherToast('加载中', "loading");
    this.setData({
      isLoading: true
    })
    let _id = that.data.shopkeeperInfoData.shop.id
    util.request(api.combinationList, { shopId: _id,status: 1 },
      'get').then(function (res: any) {
        let noGoodsArr = []
        let _HybridRecommendListData = res.data
        _HybridRecommendListData.forEach((item, index) => {
          if (item.shopProductItemList.length == 1) {
            item.title = item.shopProductItemList[0].title
            item.image = item.image || item.shopProductItemList[0].image
          }
          if (!item.shopProductItemList.length) {
            // let newArr = _HybridRecommendListData.splice(index, 1);
            noGoodsArr.push(_HybridRecommendListData[index]);
          }
        });
        let newArr = _HybridRecommendListData.filter((item, index) => {
          return item.shopProductItemList.length != 0

        });
        _HybridRecommendListData = [...newArr, ...noGoodsArr]
        that.setData({
          HybridRecommendListData: _HybridRecommendListData,
          isLoading: false
        })
        wx.hideToast();
      });
  },
  // 获取店主信息
  getShopkeeperInfo() {
    let that = this
    util.request(api.shopkeeperInfo, {},
      'get').then(function (res: any) {
        that.setData({
          shopkeeperInfoData: res.data
        })
        // debugger
        // wx.setStorageSync("userInfo", JSON.stringify(res.data))
        // 拿到店铺信息，请求店铺列表
        that.getPageList()
      });
  },
  // 排序移动
  changeListSort(e: any) {
    let changeitem = e.currentTarget.dataset.item
    let _index = e.currentTarget.dataset.index
    let _HybridRecommendListData = this.data.HybridRecommendListData.filter(item => {
      return item.shopProductItemList.length != 0
    })
    if (e.currentTarget.dataset.type == 'up') {
      if (_index === 0) {
        wx.showToast({
          title: '当前产品已排在首位',
          icon: 'none',
          duration: 2000
        })
        return
      }
      try {
        _HybridRecommendListData.forEach((item, index) => {
          this.setData({
            isMove: true
          })
          if (changeitem.isOfficial) {
            if (changeitem.officialRecommendationId == item.officialRecommendationId) {
              let temp = _HybridRecommendListData[index];
              _HybridRecommendListData[index] = _HybridRecommendListData[index - 1];
              _HybridRecommendListData[index - 1] = temp;
              throw new Error("back");
            }
          } else {
            if (changeitem.id == item.id) {
              let temp = _HybridRecommendListData[index];
              _HybridRecommendListData[index] = _HybridRecommendListData[index - 1];
              _HybridRecommendListData[index - 1] = temp;
              throw new Error("back");

            }
          }
        })
      } catch (e) {
        // 循环结束
      }

    } else {
      if (_index == _HybridRecommendListData.length - 1) {
        wx.showToast({
          title: '当前产品已排在最后',
          icon: 'none',
          duration: 2000
        })
        return
      }
      this.setData({
        isMove: true
      })
      try {
        _HybridRecommendListData.forEach((item, index) => {
          // 判断是官方推荐还是自己推荐
          if (changeitem.isOfficial) {
            if (changeitem.officialRecommendationId == item.officialRecommendationId) {
              let temp = _HybridRecommendListData[index];
              _HybridRecommendListData[index] = _HybridRecommendListData[index + 1];
              _HybridRecommendListData[index + 1] = temp;
              throw new Error("back");
            }
          } else {
            if (changeitem.id == item.id) {
              let temp = _HybridRecommendListData[index];
              _HybridRecommendListData[index] = _HybridRecommendListData[index + 1];
              _HybridRecommendListData[index + 1] = temp;
              throw new Error("back");
            }
          }
        })
      } catch (e) {
        // 循环结束
      }
    }
    _HybridRecommendListData.forEach((item, index) => {
      item.sequence = index + 1
    })
    this.setData({
      HybridRecommendListData: _HybridRecommendListData
    })
  },
  // 排序方法
  compare(name: any) {
    return function (a: any, b: any) {
      var value1 = a[name];
      var value2 = b[name];
      return value1 - value2;
    }
  },
  // 返回
  backPage() {
    wx.navigateBack()
  },


  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    executeOnshow: false,
    shopkeeperInfoData: {},//店主信息
    themeColor: apps.globalData.themeColor,
    textTitleIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_textTitle.svg', apps.globalData.themeColor),
    FrameIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_Frame.svg', apps.globalData.themeColor),
    quitIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_quit.svg', apps.globalData.themeColor),
    replaceIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_replace.svg', apps.globalData.themeColor),
    addIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_add.svg', apps.globalData.themeColor),
    addBgIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_addBg.svg', apps.globalData.themeColor + 10),
    moveUpIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_moveUp.svg', apps.globalData.themeColor),
    moveDownIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_moveDown.svg', apps.globalData.themeColor),
    empty: changeSvg.svgColor('/packageRecommend/images/empty.svg', apps.globalData.themeColor),
    emptyBg: '/packageRecommend/images/emptyBg.svg',
    autoplay: false,
    isMove: false,
    swiperIndex: '',
    swiperData: [],
    HybridRecommendListData: [],
    isSort: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    let _listData= JSON.parse(options.listData) 
    this.setData({
      executeOnshow: true,
      HybridRecommendListData:_listData.shopProductDtos,
    })

    // this.init()

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
    if (!this.data.executeOnshow) {
      this.getPageList()
    }
    this.setData({
      executeOnshow: false,
      themeColor: apps.globalData.themeColor,
      textTitleIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_textTitle.svg', apps.globalData.themeColor),
      FrameIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_Frame.svg', apps.globalData.themeColor),
      quitIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_quit.svg', apps.globalData.themeColor),
      replaceIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_replace.svg', apps.globalData.themeColor),
      addIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_add.svg', apps.globalData.themeColor),
      addBgIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_addBg.svg', apps.globalData.themeColor + 10),
      moveUpIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_moveUp.svg', apps.globalData.themeColor),
      moveDownIcon: changeSvg.svgColor('/packageRecommend/images/hybridRecommend_moveDown.svg', apps.globalData.themeColor)
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
})