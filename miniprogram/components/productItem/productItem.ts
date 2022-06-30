var changeSvg = require('../../utils/changeThemeColor');
var util = require('../../utils/util');
var api = require('../../config/api')
const indexAap = getApp<IAppOption>();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsListData: { type: Array, value: [] },
    userLevel: { type: Number, value: 3 },
    // themeColor:{type:String,value:indexAap.globalData.themeColor}


  },
  /**
   * 组件的初始数据
   */
  data: {
    themeColor: '',
    shoppingTrolleyIcon: indexAap.globalData.imageUrlUser + '/icons/shoppingTrolley.svg',
    productData: []
  },
  lifetimes: {
    created() {
      console.log(444)
    },
    attached() {
      // util.getThemeColor().then((themeColor:string)=>{
      console.log(indexAap.globalData.themeColor, 55555)
      this.setData({
        themeColor: indexAap.globalData.themeColor,
        // shoppingTrolleyIcon: changeSvg.svgColor(this.data.shoppingTrolleyIcon, indexAap.globalData.themeColor),
      })
      this.changeColor('shoppingTrolleyIcon', this.data.shoppingTrolleyIcon, indexAap.globalData.themeColor)
      // })
    },
  },
  methods: {
    changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
      changeSvg.svgColor(url, color, type).then((res: any) => {
        this.setData({ [name]: res })
      })


    },

    // 跳转商品详情
    goH5Detail(e: any) {
      // console.log('right,e======',e);
      let addAgruments = {
        catalogId: e.currentTarget.dataset.item.catalogId,
        itemId: e.currentTarget.dataset.item.itemId,
        itemType: e.currentTarget.dataset.item.itemType
      };
      let params = Object.assign({}, addAgruments, util.getCommonArguments());
      wx.navigateTo({
        url: '/pages/pageDetail/index?url=' + indexAap.globalData.h5Address + 'productDetail&params=' + encodeURIComponent(JSON.stringify(params))
      })
    },
    // 查询商品库存
    cartGetStockQty(e: any) {
      util.checkLogin().then(() => {
        let that = this
        let ids = []
        // if (ids.length) {
        let _data = {
          "provinceCode": 'SH',//省Code
          "cityCode": "SHSH",//市Code
          itemIds: [e.currentTarget.dataset.item.itemId]
        }

        util.request(api.productStatus, _data, 'post',).then(function (res: any) {
          if (res.data[0].stockCount == 0) {
            wx.showToast({
              title: '库存不足',
              icon: 'none',
              duration: 2000
            })
          } else {
            that.AddShoppingCart(e)
          }
        })
      }).catch(() => {
        util.getUserProfile();
      })
    },
    // 获取用户地址列表
    getAddressList() {
      let _data = {
        'pageNum': '1',
        'pageSize': '10'
      }
      util.request(api.addressList, _data, 'get', true).then(function (res: any) {


      });
    },
    // 加入购物车
    AddShoppingCart(e: any) {
      let that = this
      util.checkLogin().then(() => {
        let _userInfo = wx.getStorageSync('userInfo')
        let _priceType = ''
        switch (_userInfo.level) {
          case 1:
            _priceType = 'P1'
            break;
          case 2:
            _priceType = 'P3'
            break;
          case 3:
            _priceType = '23'
            break;
          default:
            _priceType = 'P1'
            break;
        }
        let _item = e.currentTarget.dataset.item
        let _data = {
          "ageLocMeId": "",
          "catalogId": _item.catalogId,//类目ID
          // "cityCode": '246116',
          "cityCode": 'SHSH',//市Code
          // "couponId": "",//优惠券id
          "enjoyAlias": "",//尊享码别名
          "enjoyCode": "",//尊享码Code
          "isCoreItem": _item.isCoreItem,//1是智芯商品
          // "isUseCoupon": "-1",//是否使用资格券不使用-1
          "itemId": _item.itemId,//商品ID
          "itemName": _item.itemName,//商品名称
          "itemNum": 1,//选择商品数量
          "items": '',//子产品的商品ID
          // "liveRoomId": "",//直播间id
          "parentPriceType": _item.itemType,//父类价格类型
          // "priceMarkupId": "",//加价购活动id
          "priceType": _priceType,//子类价格类型
          "priceTypeList": [],//所有价格类型
          "provinceCode": 'SH',//省Code
          // "provinceCode": '230011',
          "selected": true,//是否选中
          "skuId": _item.skuId,//SKUID
          "sourceType": 1,//产品类型   1单品 2组合产品
          storeId: wx.getStorageSync('shopId'),//店铺id
          storeName: wx.getStorageSync('shopInfo').shop && wx.getStorageSync('shopInfo').shop.name,//店铺名称
          channelId: "12"//渠道id

        }
        if (_item.type == 2) {
          util.request(api.cartTip, {}, 'get', true).then(function (res: any) {
            wx.showModal({
              title: '友情提示',
              content: res.data.data.value,
              success(res) {
                if (res.confirm) {
                  util.request(api.cart, _data, 'post', true).then(function (res: any) {
                    if (res.data.success) {
                      wx.showToast({
                        title: '加入购物车成功',
                        icon: 'success',
                        duration: 2000
                      })
                    } else {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                      })

                    }
                  }).catch((err: any) => {
                    console.log('加购物车报错啦', err)
                  })
                } else if (res.cancel) {
                }
              }
            })
          })
        } else {
          util.request(api.cart, _data, 'post', true).then(function (res: any) {
            if (res.data.success) {
              wx.showToast({
                title: '加入购物车成功',
                icon: 'success',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })

            }
          }).catch((err: any) => {
            console.log('加购物车报错啦', err)
          })
        }




      }).catch(() => {
        util.getUserProfile();
      })

    },

  },
})
