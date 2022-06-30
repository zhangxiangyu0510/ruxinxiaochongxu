let componentApp = getApp<IAppOption>();
var componSvg = require('../../utils/changeThemeColor')
var util = require('../../utils/util');
var api = require('../../config/api')
// const indexAap = getApp<IAppOption>();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recommends: {
      type: Array,
      value: []
    },
    showOperate: {
      type: Number,
      value: 1,
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    themeColor: componentApp.globalData.themeColor,
    pointShow: false,
    outProductName: '',
    selectItem: {},
    loadding: false,
    recommend_share:componentApp.globalData.imageUrl +'/images/recommend_share.svg',
    recommend_re: componentApp.globalData.imageUrl +'/images/iconre.svg',
    toup: componentApp.globalData.imageUrl +'/images/toup.svg',
    todown: componentApp.globalData.imageUrl +'/images/todown.svg',
    toup1: componentApp.globalData.imageUrl +'/images/toup11.svg',
    todown1: componentApp.globalData.imageUrl +'/images/toup1.svg',

    painting: {
      width: 248,
      height: 418,
      background: '#fff',
      clear: true,
      views: [{
        type: 'rect',
        top: 0,
        left: 0,
        width: 248,
        height: 418,
        background: '#fff'
      },
      {
        type: 'rect',
        top: 40,
        left: 24,
        width: '200',
        height: '200',
        background: '#ccc',
        borderRadius: 8
      },
      {
        type: 'rect',
        top: 360,
        left: 24,
        width: '36',
        height: '16',
        background: '#ccc',
        borderRadius: 8
      },
      {
        type: 'rect',
        top: 380,
        left: 24,
        width: '36',
        height: '16',
        background: '',
        borderRadius: 8
      },
      {
        type: 'arc',
        top: 250,
        left: 24,
        width: '25',
        height: '25',
        background: '#ccc',
      },

      {
        type: 'text',
        content: '蓝色的枫叶',
        fontSize: 12,
        lineHeight: 20,
        color: '#383549',
        textAlign: 'left',
        top: 258,
        left: 55,
        width: 150,
        MaxLineNumber: 1,
        breakWord: true,
        bold: true
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
        content: '零售价',
        fontSize: 10,
        lineHeight: 14,
        color: '#fff',
        textAlign: 'left',
        top: 363,
        left: 27,
        // width: 50,
        MaxLineNumber: 1,
      },
      {
        type: 'text',
        content: '￥1200',
        fontSize: 10,
        lineHeight: 14,
        color: '#8c8c8c',
        textAlign: 'left',
        top: 365,
        left: 65,
        // width: 50,
        MaxLineNumber: 1,
      },
      {
        type: 'text',
        content: '￥1100',
        fontSize: 10,
        lineHeight: 14,
        color: '',
        textAlign: 'left',
        top: 385,
        left: 65,
        // width: 50,
        MaxLineNumber: 1,
      },
      {
        type: 'text',
        content: '星级价',
        fontSize: 10,
        lineHeight: 14,
        color: '#fff',
        textAlign: 'left',
        top: 383,
        left: 27,
        // width: 50,
        MaxLineNumber: 1,
      },
      {
        type: 'text',
        content: '如新优选滢白三效修护霜暂为非直销品',
        fontSize: 12,
        lineHeight: 14,
        color: '#4A4A4A',
        textAlign: 'left',
        top: 305,
        left: 24,
        width: 190,
        MaxLineNumber: 2,
        breakWord: true,
        // bolder: true
      },





      {
        type: 'image',
        url: '',
        top: 250,
        left: 24,
        width: 26,
        height: 26,
        borderRadius: 13,
      },
      {
        type: 'image',
        url: '',
        top: 40,
        left: 24,
        width: 200,
        height: 200,
      },
  
      ],
    },


  },

  lifetimes: {
    attached() {
      util.getThemeColor().then((res: any) => {
        console.log('123456789', res);
        wx.setStorageSync('themeColor', res);
        console.log('此时缓存里的主题色======', wx.getStorageSync('themeColor'))
        componentApp.globalData.themeColor = res;

      })
      this.setData({
        // recommend_share: componSvg.svgColor(this.data.recommend_share, componentApp.globalData.themeColor),
        // recommend_re: componSvg.svgColor(this.data.recommend_re, componentApp.globalData.themeColor),
        // toup: componSvg.svgColor(this.data.toup, componentApp.globalData.themeColor),
        // todown: componSvg.svgColor(this.data.todown, componentApp.globalData.themeColor),
        themeColor: componentApp.globalData.themeColor,
      })
      this.changeColor('recommend_share', this.data.recommend_share, componentApp.globalData.themeColor)
      this.changeColor('recommend_re', this.data.recommend_re, componentApp.globalData.themeColor)
      this.changeColor('toup', this.data.toup, componentApp.globalData.themeColor)
      this.changeColor('todown', this.data.todown, componentApp.globalData.themeColor)
    },

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goH5Detail(e: any) {
      // console.log('right,e======',e);
      console.log(e.currentTarget.dataset)
      let addAgruments = {
        catalogId: e.currentTarget.dataset.item.catalogId,
        itemId: e.currentTarget.dataset.item.itemId,
        itemType: e.currentTarget.dataset.item.itemType
      };
      let params = Object.assign({}, addAgruments, util.getCommonArguments());
      wx.navigateTo({
        url: '/pages/customPage/index?url=' + componentApp.globalData.h5DetailUrl + 'productDetail&params=' + encodeURIComponent(JSON.stringify(params))
      })

    },
    //下架产品
    outProduct(e: any) {
      if (this.data.loadding) {
        return;
      }

      let getObj = e.currentTarget.dataset.item;
      var _this = this;
      console.log(getObj)
      console.log('123456=====', e.currentTarget.dataset);
      this.setData({
        outProductName: getObj.itemInfo.itemName,
        selectItem: getObj
      })
      wx.showModal({
        title: '提示',
        cancelText: '否',
        confirmText: '是',
        confirmColor: this.data.themeColor,
        content: '是否取消推荐“"' + e.currentTarget.dataset.item.itemInfo.itemName + '“',
        success(res) {
          if (res.confirm) {
            _this.setData({ loadding: true })

            var obj = { id: _this.data.selectItem.id }
            util.request(api.cancleRecommend, obj, 'put').then((res: any) => {
              console.log('999999999', res)
              // _this.setData({ outRecommends: res.data })
              wx.showToast({
                title: '取消推荐成功',
                icon: 'success',
                duration: 2000
              })
              _this.setData({ loadding: false })
              _this.triggerEvent('getList')
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    },

    toUpUp(e: any) {

      console.log(e.currentTarget.dataset.item.itemInfo)
      var id = e.currentTarget.dataset.item.itemInfo.itemId
      var list = this.data.recommends;

      list.forEach((item, index) => {
        if (item.itemInfo.itemId == id) {
          list.splice(index, 1);
          list.unshift(item);
        }
      })
      console.log(list)
      this.setData({ recommends: list });

    },
    changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
      componSvg.svgColor(url, color,type).then((res:any)=>{
        this.setData({[name]:res})
      })
  
  
    },
    // 打开分享
    openSharePosters(e: any) {
      this.triggerEvent('openSharePosters', { painting: this.data.painting, item: e.currentTarget.dataset.item })
    },
    deleteItem(e: any) {
      var _this = this;
      console.log(e.currentTarget.dataset.item.itemInfo.itemId)
      wx.showModal({
        title: '提示',
        cancelText: '否',
        confirmText: '是',
        confirmColor: this.data.themeColor,
        content: '是否删除已取消推荐记录"' + e.currentTarget.dataset.item.itemInfo.itemName + '"',
        success(res) {
          if (res.confirm) {
            util.request(api.deleteCancleRecommend + e.currentTarget.dataset.item.id, {}, 'delete').then((res: any) => {
              console.log('777777', res)
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              _this.triggerEvent('getList');
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })


    },
    //重新推荐
    recommend(e: any) {
      var item = e.currentTarget.dataset.item
      // var arr = [];
      // console.log(item);
      var data = { id: item.id }
      // arr.push(data)
      var _this = this;
      wx.showModal({
        title: '提示',
        cancelText: '否',
        confirmText: '是',
        confirmColor: this.data.themeColor,
        content: '是否重新推荐"' + e.currentTarget.dataset.item.itemInfo.itemName + '"',
        success(res) {
          if (res.confirm) {
            util.request(api.againRecommend, data, 'post').then((res: any) => {
              wx.showToast({
                title: '推荐成功',
                icon: 'success',
                duration: 2000
              })
              _this.triggerEvent('getList');

            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })


    },
    removeItem(e: any) {
      console.log(e)
      var data = e.currentTarget.dataset.item
      console.log('!!!', data)
      var array = this.data.recommends
      array.forEach((item, index) => {
        if (item.itemId == data.itemId) {
          array.splice(index, 1);
        }
      })
      this.setData({ recommends: array })
      wx.setStorageSync('addGoodsData', array)
      if (array.length == 0) {
        wx.redirectTo({ url: '/packageRecommend/pages/singleRecommend/singleRecommend' })

      }


    },
    toUp(e: any) {

      var data = e.currentTarget.dataset.item;
      var index = e.currentTarget.dataset.index;
      if (index == 0) {

        return

      }
      console.log(data, index)
      var array = this.data.recommends
      var item = array[index];
      array[index] = array[index - 1];
      array[index - 1] = item;
      this.setData({ recommends: array });






    },


    toDown(e) {
      var data = e.currentTarget.dataset.item;
      var index = e.currentTarget.dataset.index;
      var array = this.data.recommends
      if (index == array.length - 1) {
        // wx.showToast({
        //   title: '最下面了，没办法上移了',
        //   icon: 'error',
        //   duration: 2000
        // })
        return;
      }
      console.log(data, index)
      var item = array[index];
      array[index] = array[index + 1];
      array[index + 1] = item;
      this.setData({ recommends: array });

    },
    update() {
      var arr = this.data.recommends;
      var array = []
      var _this = this;
      arr.forEach((item, index) => {
        let _userInfo = JSON.parse(wx.getStorageSync('userInfo'))
        console.log(index);
        console.log(item)
        var item1 = { id: item.id, sequence: index + 1 }

        array.push(item1)

      })
      util.request(api.updateRecommendation, array, 'put').then((res: any) => {
        console.log('999999999', res)
        // _this.setData({ outRecommends: res.data })
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })

        _this.triggerEvent('getList')
      })

    },
    toRecommend() {
      // var item = e.currentTarget.dataset.item
      // var arr = [];
      // var data =  {...item,status:1}
      // arr.push(data)
      wx.showLoading({
        title: '加载中'
      });
      var arr = this.data.recommends;
      var array = []
      arr.forEach((item, index) => {
        let _userInfo = JSON.parse(wx.getStorageSync('userInfo'))
        console.log(index);
        console.log(item)
        // primaryCatalogId:item.primaryCatalogId,
        var item1 = {
          productId: item.itemId, sequence: index
            + 1, title: item.itemName, image: item.itemImage, productCode: item.itemCode, productCatalogId: item.catalogId, productCatalogName: item.catalogName,

        }
        if (item.id) {
          item1 = { ...item1, officialRecommendationId: item.id }
        }
        console.log(item1)
        array.push(item1)

      })
      util.request(api.recommend, array, 'post').then((res: any) => {
        wx.hideLoading();
        wx.showToast({
          title: '推荐成功',
          icon: 'success',
          duration: 2000
        })
        wx.hideLoading()

        wx.redirectTo({ url: '/packageRecommend/pages/myRecommend/myRecommend' })

      })
      // _this.triggerEvent('getList');

    }

  },

})
