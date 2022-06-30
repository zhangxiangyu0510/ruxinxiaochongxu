// pages/ucenter/confirmRecommended/confirmRecommended.ts
var changeSvg1 = require('../../../utils/changeThemeColor');
var Api = require('../../../config/api')
var util = require('../../../utils/util');
import { EventBusInstance } from '../../../utils/eventBus'
const app1 = getApp<IAppOption>();
Page({
  getgoodsData() {
    let _id = this.data.fenceData.id || this.data.fenceData.officialRecommendationId
    let _isOfficial = this.data.fenceData.isOfficial
    let that = this
    util.request(Api.HybridRecommendDetail + '/' + _id, { isOfficial: _isOfficial }, 'get').then(function (res: any) {
      that.setData({
        submitDataModel: res.data,
        title: res.data.title
      })
      let _goodsData = wx.getStorageSync('addGoodsData')

      _goodsData.forEach(item => {
        item.total = 1
        item.retailPrice = 0
        item.starPrice = 0
        item.itemPrice ? "" : item.itemPrice = []
        item.itemPrice.forEach(cItem => {
          switch (cItem.saleType) {
            case 'P1':
              item.retailPrice = cItem.salePrice
              break;
            case 'P3':
              break;
            case '23':
              item.starPrice = cItem.salePrice
              break;
            default:
              break;
          }
        });
      });
      if (_goodsData.length == 1) {
        that.setData({
          title: _goodsData[0].itemName,
          inputDisabled: true,
          jointImagePath: _goodsData[0].itemImage
        })
      } else {
        that.setData({
          title: '',
          inputDisabled: false
        })
      }
      if (_goodsData.length) {
        that.setData({
          HybridRecommendListData: _goodsData
        })
      }
      // 拼合图片
      that.jigsawImage()
      // 计算价格
      that.calculatePrice()

    });
  },
  inputVal: function (e: any) {
    let strCodeNumber = this.strCode(e.detail.value)
    console.log(strCodeNumber)
    if (strCodeNumber > 45) {
      this.setData({
        title: this.data.title
      })
      // wx.showToast({
      //   title: '名称达到上限',
      //   icon: 'none',
      //   duration: 2000
      // })
      return
    }
    this.setData({
      title: e.detail.value
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
      console.log(count);
      return count;  //返回字节数
    } else {
      console.log(0);
      return 0;  //如果参数为空，则返回0个
    }
  },
  // 确认提交
  affirmSubmit() {
    if (!this.data.title) {
      wx.showToast({
        title: '请填写组合名称',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.isSubmit) {
      wx.showToast({
        title: '推荐已提交，请勿重复提交',
        icon: 'none',
        duration: 2000
      })
      return
    }
    util.showOtherToast('加载中', 'loading', 4000);
    this.setData({
      isSubmit: true
    })
    // this.handleUpImg(this.data.jointImagePath)
    this.confirmRecommended()




  },
  // 获取店主信息
  getShopkeeperInfo() {
    let that = this
    util.request(api.shopkeeperInfo, {},
      'get').then(function (res: any) {
        that.setData({
          shopkeeperInfoData: res.data
        })
        wx.setStorageSync("userInfo", JSON.stringify(res.data))
      });
  },
  // 移除商品
  removeGoods(e: any) {
    let _changeItem = e.currentTarget.dataset.item
    let _index = e.currentTarget.dataset.index
    let _HybridRecommendListData = this.data.HybridRecommendListData
    if (_HybridRecommendListData.length <= 1) {
      // wx.showToast({
      //   title: '至少包含1个产品',
      //   icon: 'none',
      //   duration: 2000
      // })
      _HybridRecommendListData.splice(_index, 1);
      wx.setStorageSync('addGoodsData', _HybridRecommendListData)
      wx.navigateBack()
      return
    }
    // id方式移除
    // _HybridRecommendListData.forEach((item, index) => {
    //   if (_changeItem.isOfficial && _changeItem.officialRecommendationId == item.officialRecommendationId) {
    //     _HybridRecommendListData.splice(index, 1);
    //   }
    //   if (!_changeItem.isOfficial && _changeItem.itemId == item.itemId) {
    //     _HybridRecommendListData.splice(index, 1);
    //   }
    // })
    // index方式移除
    _HybridRecommendListData.splice(_index, 1);
    wx.setStorageSync('addGoodsData', _HybridRecommendListData)
    if (_HybridRecommendListData.length == 1) {
      this.setData({
        title: _HybridRecommendListData[0].itemName,
        inputDisabled: true
      })
    }
    this.setData({
      HybridRecommendListData: _HybridRecommendListData
    })
    this.jigsawImage()
    this.calculatePrice()


    // _changeItem.total++
  },
  // 修改商品数量
  revampGoodsNumber(e: any) {
    let that = this
    let _changeItem = e.currentTarget.dataset.item
    let _HybridRecommendListData = this.data.HybridRecommendListData
    if (e.currentTarget.dataset.type == 'add') {
      _HybridRecommendListData.forEach((item, index) => {
        if (_changeItem.itemId == item.itemId) {
          if (item.total == 100) {
            wx.showToast({
              title: '产品数量最多添加100个',
              icon: 'none',
              duration: 2000
            })
            return
          }
          item.total++
        }
        // if (!_changeItem.isOfficial && _changeItem.id == item.id) {
        //   item.total++
        // }
      })
      this.setData({
        HybridRecommendListData: _HybridRecommendListData
      })
      // 修改数量重新计算价格
      this.calculatePrice()
      // _changeItem.total++
    } else {
      if (_changeItem.total == 1) {
        wx.showToast({
          title: '产品数量最少为一条',
          icon: 'none',
          duration: 2000
        })
        return
      }
      _HybridRecommendListData.forEach((item, index) => {
        if (_changeItem.itemId == item.itemId) {
          item.total--
          that.setData({
            HybridRecommendListData: _HybridRecommendListData
          })
        }
        // if (!_changeItem.isOfficial && _changeItem.id == item.id) {
        //   item.total--
        //   that.setData({
        //     HybridRecommendListData: _HybridRecommendListData
        //   })
        // }
      })
      // 修改数量重新计算价格
      this.calculatePrice()
    }


  },
  // 排序移动
  changeListSort(e: any) {
    let changeitem = e.currentTarget.dataset.item
    let _HybridRecommendListData = this.data.HybridRecommendListData
    let _index = e.currentTarget.dataset.index
    if (e.currentTarget.dataset.type == 'up') {
      if (_index == 0) {
        wx.showToast({
          title: '当前产品已在第一位',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let temp = _HybridRecommendListData[_index];
      _HybridRecommendListData[_index] = _HybridRecommendListData[_index - 1];
      _HybridRecommendListData[_index - 1] = temp;
      // index方式修改

      // id方式修改
      // _HybridRecommendListData.forEach((item, index) => {
      //   if (index == 0) {
      //     return
      //   }
      //   if (changeitem.isOfficial) {
      //     if (changeitem.officialRecommendationId == item.officialRecommendationId) {
      //       let temp = _HybridRecommendListData[index];
      //       _HybridRecommendListData[index] = _HybridRecommendListData[index - 1];
      //       _HybridRecommendListData[index - 1] = temp;
      //       console.log(111)
      //       return
      //     }
      //   } else {
      //     if (changeitem.id == item.id) {
      //       let temp = _HybridRecommendListData[index];
      //       _HybridRecommendListData[index] = _HybridRecommendListData[index - 1];
      //       _HybridRecommendListData[index - 1] = temp;
      //       console.log(222)
      //       return
      //     }
      //   }
      // })
    } else {
      if (_index == _HybridRecommendListData.length - 1) {
        wx.showToast({
          title: '当前产品已在最后一位',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let temp = _HybridRecommendListData[_index];
      _HybridRecommendListData[_index] = _HybridRecommendListData[_index + 1];
      _HybridRecommendListData[_index + 1] = temp;

      // _HybridRecommendListData.forEach((item, index) => {
      // 判断是官方推荐还是自己推荐
      // if (changeitem.isOfficial) {
      //   if (changeitem.officialRecommendationId == item.officialRecommendationId) {
      //     let temp = _HybridRecommendListData[index];
      //     _HybridRecommendListData[index] = _HybridRecommendListData[index + 1];
      //     _HybridRecommendListData[index + 1] = temp;
      //     return
      //   }
      // } else {
      //   if (changeitem.id == item.id) {
      //     let temp = _HybridRecommendListData[index];
      //     _HybridRecommendListData[index] = _HybridRecommendListData[index + 1];
      //     _HybridRecommendListData[index + 1] = temp;
      //   }
      // }
      // })
    }
    _HybridRecommendListData.forEach((item, index) => {
      item.sequence = index + 1
    })
    this.setData({
      HybridRecommendListData: _HybridRecommendListData
    })
    this.jigsawImage()
  },
  // 排序方法
  compare(name: any) {
    return function (a: any, b: any) {
      var value1 = a[name];
      var value2 = b[name];
      return value1 - value2;
    }
  },
  // 关闭分享
  closeSharePosters() {
    this.setData({
      showShare: false
    })
  },
  // 输出图片
  givePicture(imagePath: any) {
    this.setData({
      jointImagePath: imagePath.detail
    })
    this.handleUpImg(this.data.jointImagePath)
  },
  // 打开分享
  openSharePosters(ev: any) {
    // this.setData({
    //   painting: ev.detail
    // })
    this.setData({
      showShare: true
    })
  },
  // 计算价格
  calculatePrice() {

    let _goodsRetailPrice = 0
    let _goodsStarPrice = 0
    this.data.HybridRecommendListData.forEach(item => {
      _goodsRetailPrice = _goodsRetailPrice + Number(item.retailPrice) * item.total
      _goodsStarPrice = _goodsStarPrice + Number(item.starPrice) * item.total
    })
    this.setData({
      goodsRetailPrice: _goodsRetailPrice.toFixed(2),
      goodsStarPrice: _goodsStarPrice.toFixed(2)
    })

  },
  // 数量填写
  changeNumber(ev) {
    let _index = ev.currentTarget.dataset.index
    let _value = ev.detail.value
    if (_value <= 0) {
      _value = '1'
    }
    if (_value >= 100) {
      wx.showToast({
        title: '产品数量最多添加100个',
        icon: 'none',
        duration: 2000
      })
      _value = '100'
    }
    if (_value.includes('.')) {
      _value = parseInt(_value)
    }

    this.data.HybridRecommendListData[_index].total = _value
    this.setData({
      HybridRecommendListData: this.data.HybridRecommendListData
    })
    this.calculatePrice()


  },
  // 拼接图片
  jigsawImage() {
    var _painting = JSON.parse(JSON.stringify(this.data.painting))
    _painting.views = []
    let imageNumber = this.data.HybridRecommendListData.length
    if (imageNumber == 5) {
      _painting.width = 300
      _painting.height = 300
    } else {
      _painting.width = 200
      _painting.height = 200
    }
    this.data.HybridRecommendListData.forEach((item, index) => {
      let _data = {
        type: 'image',
        url: '',
        top: 0,
        left: 0,
        width: 100,
        height: 100,
      }
      _data.url = item.itemImage
      switch (index) {
        case 0:
          if (imageNumber == 1) {
            _data.top = 0
            _data.left = 0
            _data.width = 200
            _data.height = 200
          }
          if (imageNumber == 2) {
            _data.top = 50
            _data.left = 0
          }
          if (imageNumber == 3) {
            _data.top = 0
            _data.left = 50
          }
          if (imageNumber == 5) {
            _data.top = 100
            _data.left = 0
          }
          break;
        case 1:
          _data.top = 0
          _data.left = 100
          if (imageNumber == 2) {
            _data.top = 50
            _data.left = 100
          }
          if (imageNumber == 3) {
            _data.top = 100
            _data.left = 0
          }
          if (imageNumber == 4) {
            _data.top = 0
            _data.left = 100
          }
          if (imageNumber == 5) {
            _data.top = 50
            _data.left = 100
          }
          break;
        case 2:
          _data.top = 100
          _data.left = 100
          if (imageNumber == 4) {
            _data.top = 100
            _data.left = 0
          }
          if (imageNumber == 5) {
            _data.top = 50
            _data.left = 200
          }
          break;
        case 3:
          _data.top = 100
          _data.left = 100
          if (imageNumber == 5) {
            _data.top = 150
            _data.left = 100
          }

          break;
        case 4:
          _data.top = 150
          _data.left = 200
          break;
        default:
          break;
      }
      _data.url ? _painting.views.push(_data) : ''
    })
    // _painting.views=imagesData
    this.setData({
      painting: _painting
    })
    this.setData({
      showShare: true
    })
  },
  // 确认推荐
  confirmRecommended() {
    let that = this
    if (!this.data.successfullyUpload) {
      that.setData({
        failInKeeping: this.data.failInKeeping + 1
      })
      if(this.data.failInKeeping>6){
        wx.showToast({
          title: '请稍等图片生成中',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          failInKeeping: 0,
          isSubmit:false
        })
        return
      }
      setTimeout(() => {
        this.confirmRecommended()
      }, 500);
      return
    }
    var _data = JSON.parse(JSON.stringify(that.data.submitDataModel))
    _data.shopProductItemList = []
    _data.title = that.data.title
    that.data.HybridRecommendListData.forEach(item => {
      _data.shopProductItemList.push(item)
    })
    let _shopId = JSON.parse(wx.getStorageSync('userInfo')) ? JSON.parse(wx.getStorageSync('userInfo')).shop.id : ''
    util.request(Api.HybridRecommendDetail + '/' + _shopId, _data, 'put').then(function (res: any) {
      wx.showToast({
        title: '推荐成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(() => {
        // wx.redirectTo({
        //   url: "/packageRecommend/pages/hybridRecommend/hybridRecommend"
        // })
        wx.navigateBack({
          delta: 2
        })
      }, 1000)
    }).catch(() => {
      that.setData({
        isSubmit: false
      })
      wx.hideTabBar({});

    })
  },
  // 上传拼接图片
  handleUpImg(currentUrl: any) {
    let that = this
    that.getUploadUrl().then((ress: any) => {
      let url = ress.data.downloadUrl
      // let currentUrl = res.tempFiles[0].tempFilePath
      that.setData({
        avatar: currentUrl,
        uploadUrl: url
      })
      wx.getFileSystemManager().readFile({
        filePath: currentUrl,
        success(data) {
          util.request(ress.data.uploadUrl, data.data, "PUT", { 'Content-Type': 'image/' + currentUrl.split('.')[1] }).then((res) => {
            that.setData({
              successfullyUpload: true
            })


          }).catch(() => {
            wx.showToast({
              title: '图片上传失败',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              isSubmit: false
            })
            wx.hideTabBar({});
          })
        },
        fail() {
          wx.showToast({
            title: '图片解析失败',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            isSubmit: false
          })
        },

      })
    })
  },
  getUploadUrl() {
    let that = this
    let _submitDataModel = this.data.submitDataModel
    return new Promise(function (resolve) {
      util.request(Api.UploadAvatar + '?type=1').then((res: any) => {
        _submitDataModel.image = res.data.downloadUrl
        that.setData({
          submitDataModel: _submitDataModel
        })

        resolve(res)
      })
    })
  },
  // 点击下一步
  guidanceNext() {
    this.setData({
      guidanceIndex: 4
    })


  },
  // 完成新手引导
  backPage() {
    // wx.navigateBack()
    var _this = this
    var partnerId = JSON.parse(wx.getStorageSync('userInfo')).shop.partnerId
    util.request(Api.tipsGuideDone, { type: 2, partnerId: partnerId },
      'post').then(function (res: any) {
        _this.setData({
          guidanceIndex: 3,
          isGuidance: false
        })
        wx.redirectTo({
          url: '/packageRecommend/pages/productClassification/productClassification',
        })
      })
  },

  /**
   * 页面的初始数据
   */
  data: {
    successfullyUpload: false,
    failInKeeping: 0,
    guidanceIndex: 3,
    isGuidance: false,//是否是新手引导
    // 新手引导默认参数
    guidanceData: [{
      itemCode: "29001363",
      itemId: "1276849620978287685",
      itemImage: "https://img.cn.nuskin.com/supplychain-dev/test/release/nPC8YyHBrm.jpg",
      itemName: "丝昂炫洁牙膏（暂为非直销品)",
      itemPrice: [],
      itemType: "SALE",
      retailPrice: 55,
      skuId: "1276849620985627754",
      starPrice: 50,
      type: "1",
      total: 1
    }, {
      itemCode: "29001363",
      itemId: "1276849620978287685",
      itemImage: "https://img.cn.nuskin.com/supplychain-dev/test/release/nPC8YyHBrm.jpg",
      itemName: "丝昂炫洁牙膏（暂为非直销品)",
      itemPrice: [],
      itemType: "SALE",
      retailPrice: 55,
      skuId: "1276849620985627754",
      starPrice: 50,
      type: "1",
      total: 1
    }],
    shopkeeperInfoData: {},
    jointImagePath: '',
    ctx: null,
    isSubmit: false,//防抖
    title: null,//组合商品标题
    inputDisabled: false,
    goodsRetailPrice: 0,
    goodsStarPrice: 0,
    themeColor: app1.globalData.themeColor,
    removeIcon: app1.globalData.imageUrl + '/images/hybridRecommend_remove.svg',
    addIcon: app1.globalData.imageUrl + '/images/hybridRecommend_add.svg',
    subtractionIcon: app1.globalData.imageUrl + '/images/hybridRecommend_subtraction.svg',
    moveUpIcon: app1.globalData.imageUrl + '/images/hybridRecommend_moveUp.svg',
    moveDownIcon: app1.globalData.imageUrl + '/images/hybridRecommend_moveDown.svg',
    submitDataModel: {},
    showShare: false,
    painting: {
      width: 200,
      height: 200,
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
      ],
    },
    HybridRecommendListData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    if (option.isGuidance) {
      this.setData({
        isGuidance: true
      })
    }
    this.changeColor('removeIcon', this.data.removeIcon, app1.globalData.themeColor)
    this.changeColor('addIcon', this.data.addIcon, app1.globalData.themeColor)
    this.changeColor('subtractionIcon', this.data.subtractionIcon, app1.globalData.themeColor)
    this.changeColor('moveUpIcon', this.data.moveUpIcon, app1.globalData.themeColor)
    this.changeColor('moveDownIcon', this.data.moveDownIcon, app1.globalData.themeColor)

    // let imagesData = []


  },
  changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
    changeSvg1.svgColor(url, color, type).then((res: any) => {
      this.setData({ [name]: res })
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // this.setData({
    //   ctx: wx.createCanvasContext('canvasdrawer', this)
    // })
    // this.testCanvas()

    // this.ctx = wx.createCanvasContext('canvasdrawer', this)
    // let _imageData = []
    // this.data.HybridRecommendListData.forEach(item => {
    //   _imageData.push(item.image)

    // })

    // this.picture(_imageData, 'myCanvas')

    // debugger
    let _fenceData = wx.getStorageSync('fenceData') ? JSON.parse(wx.getStorageSync('fenceData')) : ''
    if (_fenceData.id || _fenceData.officialRecommendationId)
      this.setData({
        fenceData: _fenceData
      })
    //   debugger
    if (this.data.isGuidance) {
      this.setData({
        HybridRecommendListData: this.data.guidanceData
      })
      // 拼合图片
      this.jigsawImage()
      // 计算价格
      this.calculatePrice()
    } else {
      this.getgoodsData()

    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    EventBusInstance.on('notification', (data: any) => {
      console.log('page index:', data)
      this.selectComponent("#notificationDialog").push(data)
    }, true)
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