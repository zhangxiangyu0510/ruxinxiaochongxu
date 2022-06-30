// pages/ucenter/productClassification/productClassification.ts
const serviceApp = getApp<IAppOption>();
const changeSvg = require('../../../utils/changeThemeColor');
var util = require('../../../utils/util');
var api = require('../../../config/api');
import { EventBusInstance } from '../../../utils/eventBus'
Page({
  // 新手引导
  stepProcess(e: any) {
    this.setData({
      scrollHeight: 0
    })
    let _number = e.currentTarget.dataset.number
    if (_number == 3) {
      // _number = 0
      this.setData({
        stepProcessNumber: 0,
      })
      wx.redirectTo({
        url: '/packageRecommend/pages/confirmRecommended/confirmRecommended?isGuidance=true',
      })
      return
    }
    this.setData({
      stepProcessNumber: _number
    })
  },
  //分类搜索
  // focusH5(){
  //   wx.navigateTo({
  //     url:'/pages/customPage/index?url='+serviceApp.globalData.h5DetailUrl+'/#/searchPage&params='+encodeURIComponent(JSON.stringify(util.getCommonArguments()))
  //   })
  // },
  changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
    changeSvg.svgColor(url, color,type).then((res:any)=>{
      this.setData({[name]:res})
    })


  },
  // 商品搜索
  goodsSearch(e: any) {
    let _value = e.detail.value
    let that = this
    if (!_value) {
      // this.getShopkeeperList(this.data.shopkeeperChildrenId)
      this.setData({
        searchPageNumber: 1,
        searchValue: '',
        showClassify: true
      })
      let _addGoodsData = wx.getStorageSync('addGoodsData') || []
      let _selectItem = []
      _addGoodsData.forEach(item => {
        _selectItem.push(item.itemId)
      });
      this.data.goodsData.forEach(item => {
        item.isAddGoods = _selectItem.includes(item.itemId) ? true : false
      })
      this.setData({
        goodsData: this.data.goodsData
      })
      return
    }


    this.setData({
      searchGoodsData: [],
      searchValue: _value,
      showClassify: false,
      isLoading: true,
    })
    let _data = {
      keyword: _value,
      page_number: this.data.searchPageNumber,
      page_size: this.data.searchPageSize,
    }
    let _addGoodsData = wx.getStorageSync('addGoodsData') || []
    let _selectItem = []
    _addGoodsData.forEach(item => {
      _selectItem.push(item.itemId)
    });
    util.request(api.shopkeeperSearch, _data,
      'get').then(function (res: any) {
        res.data.itemVos.list.forEach(item => {
          item.productCode = item.itemCode
          item.productCatalogId = item.catalogId
          item.productCatalogName = item.catalogName
          item.productId = item.itemId
          item.isAddGoods = _selectItem.includes(item.itemId) ? true : false
        });
        that.setData({
          searchGoodsData: res.data.itemVos.list,
          searchTotal: res.data.itemVos.total
        })
      }).catch(() => {
        this.setData({
          isLoading: false,
        })

      })
  },
  goToAddGoods() {
    // let _goodsData = this.data.goodsData.filter((item) => { return item.isAddGoods })
    // let _searchData = this.data.searchGoodsData.filter((item) => { return item.isAddGoods })
    // wx.setStorageSync('addGoodsData', JSON.stringify([..._searchData, ..._goodsData]))
    let _number = wx.getStorageSync('addGoodsData')
    //      let _data=_goodsData.length+_searchData.length
    if (_number.length < 1) {
      wx.showToast({
        title: '请先选择产品',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // wx.setStorageSync('addGoodsData', JSON.stringify([..._searchData, ..._goodsData]))
    wx.navigateTo({
      url: '/packageRecommend/pages/confirmRecommended/confirmRecommended',
    })

  },
  // 获取一级目录
  getShopkeeperClassify() {
    let that = this
    util.request(api.shopkeeperClassify, {},
      'get').then(function (res: any) {
        let _item = {
          name: '官方推荐',
          id: '-1'
        }
        res.data.unshift(_item)
        if (res.data.length) {
          that.setData({
            shopkeeperClassifyData: res.data
          })
          that.getShopkeeperChildren(res.data[0].id)

          // that.getShopkeeperList(res.data[0].id)
        }
      });
  },
  // 根据一级目录获取二级分类
  getShopkeeperChildren(id: any) {
    let that = this
    this.setData({
      pageNumber: 1,
    })
    if (id == '-1') {
      that.setData({
        leftClassification: [],
        goodsData: [],
        isLoading: true,
      })
      let _addGoodsData = wx.getStorageSync('addGoodsData') || []
      let _selectItem = []
      _addGoodsData.forEach(item => {
        _selectItem.push(item.itemId)
      });
      util.request(api.recommendationAll,
        'get').then(function (res: any) {
          that.setData({
            isLoading: false,
          })
          if (res.data.length) {
            if (res.data && res.data.length) {
              let newData = []
              res.data.forEach(item => {
                if (!item.itemInfo) {
                  return
                }
                item.itemInfo.productCode = item.itemInfo.itemCode
                item.itemInfo.productCatalogId = item.categoryId
                item.itemInfo.productCatalogName = item.categoryName
                item.itemInfo.isAddGoods = false
                item.itemInfo.productId = item.itemInfo.itemId
                item.itemInfo.sequence = item.sequence
                newData.push(item.itemInfo)
              });
              newData.forEach(newItem => {
                newItem.itemPrice.forEach(cItem => {
                  switch (cItem.saleType) {
                    case 'P1':
                      newItem.retailPrice = cItem.salePrice
                      break;
                    case 'P3':
                      break;
                    case '23':
                      newItem.starPrice = cItem.salePrice
                      break;
                    default:
                      break;
                  }
                });
                newItem.isAddGoods = _selectItem.includes(newItem.itemId) ? true : false
              });

              newData = newData.sort(that.compare('sequence'))
              that.setData({
                goodsData: newData,
              })
            }
            // let _goodsData = that.data.goodsData
            // if (res.data.itemVos.list.length) {
            //   _goodsData = [..._goodsData, ...res.data.itemVos.list]
            // }
          }
        });
    } else {
      let _data = {
        catalog_id: id,
      }
      util.request(api.shopkeeperChildren, _data,
        'get').then(function (res: any) {
          if (res.data.length) {

            that.setData({
              leftClassification: res.data
            })
            that.getShopkeeperList(res.data[0].id)
          }
        });

    }


  },
  // 根据二级目录id获取列表
  getShopkeeperList(id: any) {
    let that = this
    that.setData({
      shopkeeperChildrenId: id,
      isLoading: true,
    })
    let _data = {
      catalog_id: id,
      page_number: this.data.pageNumber,
      page_size: this.data.pageSize,
    }
    this.setData({
      showClassify: true,
    })
    let _addGoodsData = wx.getStorageSync('addGoodsData') || []
    let _selectItem = []
    _addGoodsData.forEach(item => {
      _selectItem.push(item.itemId)
    });
    // 如果是第一页，先清空数据
    if (that.data.pageNumber == 1) {
      that.setData({
        goodsData: []
      })
    }
    util.request(api.shopkeeperList, _data,
      'get').then(function (res: any) {
        that.setData({
          isLoading: false,
        })
        if (res.data.itemVos.list && res.data.itemVos.list.length) {
          res.data.itemVos.list.forEach(item => {
            item.productCode = item.itemCode
            item.productCatalogId = item.catalogId
            item.productCatalogName = item.catalogName
            item.productId = item.itemId
            item.isAddGoods = _selectItem.includes(item.itemId) ? true : false
          });
        }
        let _goodsData = that.data.goodsData
        if (res.data.itemVos.list.length) {
          _goodsData = [..._goodsData, ...res.data.itemVos.list]
        }
        that.setData({
          goodsData: _goodsData,
          total: res.data.itemVos.total,

        })
      });



  },
  // 选中商品
  changeGoods(e: any) {
    let _type = e.currentTarget.dataset.type
    let _index = e.currentTarget.dataset.index
    let _selectItem = e.currentTarget.dataset.item
    let _search = e.currentTarget.dataset.search
    let alreadySelectNumber = wx.getStorageSync('addGoodsData').length
    // let goodsSelectNumber = this.data.goodsData.filter((item) => { return item.isAddGoods })
    // let searchGoodsSelectNumber = this.data.searchGoodsData.filter((item) => { return item.isAddGoods })
    // alreadySelectNumber = goodsSelectNumber.length + searchGoodsSelectNumber.length

    if (alreadySelectNumber > 4 && _type == 'add') {
      wx.showToast({
        title: '最多选择五种产品',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (_type == 'add') {
      let _addGoodsData = wx.getStorageSync('addGoodsData') || []
      _addGoodsData.push(_selectItem)
      if (_search == 'search') {
        this.data.searchGoodsData[_index].isAddGoods = true
      } else {
        this.data.goodsData[_index].isAddGoods = true
      }
      wx.setStorageSync('addGoodsData', _addGoodsData)
    } else {
      if (_search == 'search') {
        this.data.searchGoodsData[_index].isAddGoods = false
      } else {
        this.data.goodsData[_index].isAddGoods = false
      }
      let _addGoodsData = wx.getStorageSync('addGoodsData') || []
      try {
        _addGoodsData.forEach((item, index) => {
          if (item.itemId == _selectItem.itemId) {
            _addGoodsData.splice(index, 1);
            throw new Error("back");
          }
        })
      } catch (e) {

      }
      wx.setStorageSync('addGoodsData', _addGoodsData)
    }

    // if (e.currentTarget.dataset.search == 'search') {
    //   this.data.searchGoodsData[_index].isAddGoods = _type == 'add' ? true : false
    //   let _addGoodsData=wx.getStorageSync('addGoodsData')
    //   let allItemId=[]
    //   _addGoodsData.forEach(item => {
    //     allItemId.push(item.itemId)
    //   });
    //   // if(allItemId.in)
    //   wx.setStorageSync('addGoodsData', JSON.stringify([..._searchData, ..._goodsData]))
    //   this.setData({
    //     searchGoodsData: this.data.searchGoodsData
    //   })
    // } else {
    //   this.data.goodsData[_index].isAddGoods = _type == 'add' ? true : false
    // }
    let _selectNumber = wx.getStorageSync('addGoodsData')
    this.setData({
      goodsData: this.data.goodsData,
      searchGoodsData: this.data.searchGoodsData,
      selectNumber: _selectNumber.length
    })
  },
  changeLeftClassification(e: any) {
    this.setData({
      pageNumber: 1
    })
    let _item = e.currentTarget.dataset.item
    this.getShopkeeperList(_item.id)
    this.setData({
      leftIndex: e.currentTarget.dataset.index,
    })
  },
  changeTopTabs(e: any) {
    this.setData({
      tabsIndex: e.currentTarget.dataset.index,
      leftIndex: 0,
    })
    let _item = e.currentTarget.dataset.item
    // this.getShopkeeperList(_item.id)
    this.getShopkeeperChildren(_item.id)



  },
  // 搜索分页
  searchReachBottom() {
    let that = this
    if (this.data.searchTotal <= this.data.searchGoodsData.length) {
      wx.showToast({
        title: '已加载完所有商品',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let _searchPageNumber = this.data.searchPageNumber + 1
    this.setData({
      searchPageNumber: _searchPageNumber
    })
    let _data = {
      keyword: this.data.searchValue,
      page_number: this.data.searchPageNumber,
      page_size: this.data.searchPageSize,
    }
    let _searchGoodsData = this.data.searchGoodsData
    let _addGoodsData = wx.getStorageSync('addGoodsData') || []
    let _selectItem = []
    _addGoodsData.forEach(item => {
      _selectItem.push(item.itemId)
    });
    util.request(api.shopkeeperSearch, _data,
      'get').then(function (res: any) {
        res.data.itemVos.list.forEach(item => {
          item.productCode = item.itemCode
          item.productCatalogId = item.catalogId
          item.productCatalogName = item.catalogName
          item.productId = item.itemId
          item.isAddGoods = _selectItem.includes(item.itemId) ? true : false
        });
        that.setData({
          searchGoodsData: [..._searchGoodsData, ...res.data.itemVos.list]
        })
      });
    // this.getShopkeeperList(this.data.shopkeeperChildrenId)
  },
  reachBottom(e: any) {
    //  let addData=JSON.parse(JSON.stringify(this.data.goodsData.slice(0,5)))
    // let addData = [{
    //   title: '新加载商品',
    //   isReduction: true,
    //   isAddGoods: false,
    //   image: ''
    // }, {
    //   title: '新加载商品',
    //   isReduction: true,
    //   isAddGoods: false,
    //   image: ''
    // }, {
    //   title: '新加载商品',
    //   isReduction: true,
    //   isAddGoods: false,
    //   image: ''
    // }, {
    //   title: '新加载商品',
    //   isReduction: true,
    //   isAddGoods: false,
    //   image: ''
    // }, {
    //   title: '新加载商品',
    //   isReduction: true,
    //   isAddGoods: false,
    //   image: ''
    // },]
    // let _data = [...this.data.goodsData, ...addData]
    // this.setData({
    //   goodsData: _data
    // })
    if (this.data.total <= this.data.goodsData.length) {
      wx.showToast({
        title: '已加载完当前分类所有商品',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.tabsIndex == 0) {
      return
    }
    let _pageNumber = this.data.pageNumber + 1
    this.setData({
      pageNumber: _pageNumber
    })
    this.getShopkeeperList(this.data.shopkeeperChildrenId)
    // console.log('我滚动到底部了呦', e)
  },
  // 重置
  resetBack() {
    this.setData({
      searchPageNumber: 1,
      showClassify: true,
      searchValue: ''
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
  getGuide() {
    var _this = this
    var partnerId = JSON.parse(wx.getStorageSync('userInfo')).shop.partnerId
    util.request(api.isTipsGuide, { type: 2, partner_id: partnerId },
      'get').then(function (res: any) {
        if (res.data) {
          _this.setData({ stepProcessNumber: 1 })
        } else {
          _this.setData({
            stepProcessNumber: 0,
            scrollHeight: 0
          })
        }
      }).catch(() => {


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
      url: '/pages/customPage/index?url='+serviceApp.globalData.h5DetailUrl+'productDetail&params=' + encodeURIComponent(JSON.stringify(params))
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0,
    isLoading: true,
    shopkeeperClassifyData: [],//一级类目
    shopkeeperChildrenId: null,//当前二级分类id
    showClassify: true,//是否是搜索数据
    searchValue: '',//储存搜索文字
    pageSize: 10,
    pageNumber: 1,
    searchPageNumber: 1,
    searchPageSize: 10,
    searchTotal: null,
    total: null,
    tabsIndex: 0,
    leftIndex: 0,
    themeColor: serviceApp.globalData.themeColor,
    guideIcon: serviceApp.globalData.imageUrl+'/images/guide.svg', 
    addIcon:  serviceApp.globalData.imageUrl+'/images/hybridRecommend_add.svg',
    activeId: '0',
    leftClassification: [],
    selectNumber: 0,//选中数量
    stepProcessNumber: 0,
    goodsData: [],
    searchGoodsData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.setStorageSync('addGoodsData', [])
    this.getShopkeeperClassify()
    this.getGuide()
    this.changeColor('guideIcon',this.data.guideIcon, serviceApp.globalData.themeColor)
    this.changeColor('addIcon',this.data.addIcon, serviceApp.globalData.themeColor)
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
    EventBusInstance.on('notification', (data: any) => {
      console.log('page index:', data)
      this.selectComponent("#notificationDialog").push(data)
  }, true)
    util.getThemeColor().then((res: any) => {
      console.log('123456789', res);
      wx.setStorageSync('themeColor', res);
      console.log('此时缓存里的主题色======', wx.getStorageSync('themeColor'))
      serviceApp.globalData.themeColor = res;

    })
    // util.getThemeColor().then((res: any) => {
    //   console.log('123456789', res);
    //   wx.setStorageSync('themeColor', res);
    //   console.log('此时缓存里的主题色======', wx.getStorageSync('themeColor'))
    //   serviceApp.globalData.themeColor=res;

    // })
    if (this.data.goodsData.length) {
      let _addGoodsData = wx.getStorageSync('addGoodsData') || []
      let _selectItem = []
      _addGoodsData.forEach(item => {
        _selectItem.push(item.itemId)
      });
      this.data.goodsData.forEach(item => {
        item.isAddGoods = _selectItem.includes(item.itemId) ? true : false
      })
      this.setData({
        goodsData: this.data.goodsData,
        selectNumber: _selectItem.length
      })
    }
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