// components/posterDialog/posterDialog.ts
var changeSvg = require('../../utils/changeThemeColor');
const canvasApp = getApp<IAppOption>();
Component({
  /**
   * 组件的属性列表
   */
  // 模拟弹出写后续逻辑
  lifetimes: {

    attached() {
      this.init()
      this.getShopImages()

    }
  },
  pageLifetimes: {
    show:function() {
      this.init()
      this.getShopImages()
    }
  },
  properties: {
    wxQrcode: {
      type: String,
      value: '',
    },
    type: {
      type: String,
      value: '',
    },
    goodsInfo: {
      type: Object,
      value: {},
    },
    levelImageValue:{
        type: String,
        value: '',
    },
    h5GoodsInfo: {
      type: Object,
      value: {
        itemPrice: []
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    addBgIcon: canvasApp.globalData.imageUrl + '/images/hybridRecommend_addBg.svg',
    themeColor: '',
    userInfo: {},
    newGoodsInfo: {},
    shopImages: {
      bg: '',
      avatar: "",
      logo: 'https://nuskin-1257745828.cos.ap-shanghai.myqcloud.com/20220415/f4845ec7-924c-4479-8ac7-cb79d7f01a91.png',
      level: '',
      mobile: 'https://nuskin-1257745828.cos.ap-shanghai.myqcloud.com/20220415/30f867db-56fe-474c-bc1b-efa643333c43.png',
      code: '',
    }

  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      let _userInfo = JSON.parse(wx.getStorageSync('userInfo'))
      this.setData({
        userInfo: _userInfo,
        themeColor: canvasApp.globalData.themeColor
      })

      this.changeColor('addBgIcon', this.data.addBgIcon, canvasApp.globalData.themeColor + 10)
      let _h5GoodsInfo = {
        h5GoodsImg: '',
        title: '',
        retailPrice: '',
        starPrice: "",
      }
      _h5GoodsInfo.h5GoodsImg = this.data.h5GoodsInfo.itemImages && this.data.h5GoodsInfo.itemImages[0] && this.data.h5GoodsInfo.itemImages[0].fileUrl
      _h5GoodsInfo.title = this.data.h5GoodsInfo.name
      if (this.data.h5GoodsInfo.itemPrice) {
        this.data.h5GoodsInfo.itemPrice.forEach(cItem => {
          switch (cItem.priceType) {
            case 'P1':
              _h5GoodsInfo.retailPrice = cItem.salePrice
              break;
            case 'P3':
              break;
            case '23':
              _h5GoodsInfo.starPrice = cItem.salePrice
              break;
            default:
              break;
          }
        });
      }
      this.setData({
        h5GoodsInfo: _h5GoodsInfo,
      })


    },
    changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
      changeSvg.svgColor(url, color, type).then((res: any) => {
        this.setData({ [name]: res })
      })


    },
    getShopImages() {
      // 背景图
      console.log(this.data.shopImages)

      let _canvasBg = wx.getStorageSync('canvasBg')
      if (_canvasBg) {
        if (!_canvasBg.includes('http')) {
          _canvasBg = 'https://' + _canvasBg
        }
      }
      // 头像
      let _userInfo = JSON.parse(wx.getStorageSync('userInfo'))
      let _avatar = _userInfo.partnerProfile.avatar || canvasApp.globalData.imageUrl + '/icons/accountPictures.png'
      console.log('---------',this.data.levelImageValue);
      
      let _level = this.data.levelImageValue ? this.data.levelImageValue : wx.getStorageSync('levelImage')
      this.setData({
        ['shopImages.bg']: _canvasBg,
        ['shopImages.avatar']: _avatar,
        ['shopImages.level']: _level


      })
      console.log(this.data.shopImages)
    }
  }
})
