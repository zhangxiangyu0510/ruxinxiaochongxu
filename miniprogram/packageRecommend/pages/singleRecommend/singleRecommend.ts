// pages/ucenter/productClassification/productClassification.ts
const serviceApp = getApp<IAppOption>();
const changeSvg = require('../../../utils/changeThemeColor');
var util = require('../../../utils/util');
var api = require('../../../config/api')
import { EventBusInstance } from '../../../utils/eventBus'
Page({
  // 新手引导
  stepProcess(e: any) {
    console.log('step', wx.getStorageSync('addGoodsData'))
    wx.setStorageSync('back', true)

    wx.navigateTo({
      url: '/packageRecommend/pages/firstTip/firstTip',
    })

  },
  // 商品搜索
  goodsSearch(e: any) {
    let recommend = this.data.recommentList
    let _value = e.detail.value
    let that = this
    this.setData({ empty: false, searchPageNumber: 1, searchGoodsData: [], });

    if (!_value) {
      // this.getShopkeeperList(this.data.shopkeeperChildrenId)
      this.setData({
        searchValue: '',
        showClassify: true,
        empty: false,
        searchGoodsData: [],
      })
      let _addGoodsData = wx.getStorageSync('addGoodsData') || []
      let _selectItem: any = []
      _addGoodsData.forEach(item => {
        _selectItem.push(item.itemId)
      });
      this.data.goodsData.forEach(item => {
        item.isAddGoods = _selectItem.includes(item.itemId) ? true : false;
        item.isRecommend = recommend.includes(item.itemId) ? true : false
      })
      this.setData({
        goodsData: this.data.goodsData
      })
      wx.hideLoading();

      return
    }
    this.setData({
      searchGoodsData: [],
      searchValue: _value,
      showClassify: false,

    })
    wx.showLoading({ title: '加载中' })
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
        if ((!res.data.itemVos) || res.data.itemVos.total == 0) {
          console.log(22222)

          that.setData({ empty: true })
        }
        wx.hideLoading();
        res.data.itemVos.list.forEach(item => {
          item.isAddGoods = _selectItem.includes(item.itemId) ? true : false
          item.isRecommend = recommend.includes(item.itemId) ? true : false
          console.log(item)
          item.itemPrice.forEach(cItem => {
            
            console.log(cItem.saleType, '@@@@@', cItem.salePrice, item.itemName)
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
        })
        that.setData({
          searchGoodsData: res.data.itemVos.list,
          searchTotal: res.data.itemVos.total
        })

      }).catch(() => {
        wx.hideLoading();

      })
  },
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
      url: '/pages/customPage/index?url=' + serviceApp.globalData.h5DetailUrl + 'productDetail&params=' + encodeURIComponent(JSON.stringify(params))
    })

  },
  goToAddGoods() {

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
    wx.navigateTo({
      url: '/packageRecommend/pages/recommendAdjust/recommendAdjust',
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
    if (id == '-1') {
      that.setData({
        leftClassification: []
      })
      let _addGoodsData = wx.getStorageSync('addGoodsData') || []
      let _selectItem = []
      _addGoodsData.forEach(item => {
        _selectItem.push(item.itemId)
      });
      let recommend = this.data.recommentList
      util.request(api.recommendationAll,
        'get').then((res: any) => {
          if (!res.data) {
            var arr = that.data.shopkeeperClassifyData;
            arr.shift();
            that.setData({ shopkeeperClassifyData: arr })
            that.getShopkeeperChildren(arr[0].id)

          }


          res.data.sort((a, b) => { return a.sequence - b.sequence })
          if (res.data.length) {
            if (res.data && res.data.length) {
              let newData = []

              res.data.forEach(item => {
                if (item.itemInfo) {
                  item.itemInfo.isAddGoods = false
                  item.itemInfo.isRecommend = false;
                  newData.push({ ...item.itemInfo, id: item.id })
                }


              });
              newData.forEach(newItem => {
                newItem.itemPrice = newItem.itemPrice || []
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
                newItem.isRecommend = recommend.includes(newItem.itemId) ? true : false
                that.setData({
                  goodsData: newData,
                })
                wx.setStorageSync('egItem', this.data.goodsData[0]);
                console.log(recommend)
              });
            }
            console.log(recommend)
            console.log('####', this.data.goodsData)
            // let _goodsData = that.data.goodsData
            // if (res.data.itemVos.list.length) {
            //   _goodsData = [..._goodsData, ...res.data.itemVos.list]
            // }
          } else {
            let arr = this.data.shopkeeperClassifyData
            arr.shift();
            this.setData({ shopkeeperClassifyData: arr })

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
              leftClassification: res.data,
              // selectClass:res.data[0]

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
    })
    wx.showLoading({ title: '加载中' })
    let _data = {
      catalog_id: id,
      page_number: this.data.pageNumber,
      page_size: this.data.pageSize,
    }
    this.setData({
      showClassify: true,
    })
    let _addGoodsData = wx.getStorageSync('addGoodsData') || []
    let _selectItem: any[] = []
    let recommend = this.data.recommentList
    console.log(recommend, '$$$$$$$')
    _addGoodsData.forEach(item => {
      _selectItem.push(item.itemId)
    });
    // 如果是第一页，先清空数据

    util.request(api.shopkeeperList, _data,
      'get').then(function (res: any) {
        console.log(res);
        if (!res.data.itemVos || res.data.itemVos.total == 0) {
          that.setData({ empty: true })
        }

        wx.hideLoading();
        if (that.data.pageNumber == 1) {
          that.setData({
            goodsData: []
          })
        }

        if (res.data.itemVos.list && res.data.itemVos.list.length) {
          res.data.itemVos.list.forEach((item: any) => {
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
            item.isAddGoods = _selectItem.includes(item.itemId) ? true : false
            item.isRecommend = recommend.includes(item.itemId) ? true : false
            console.log(item.isRecommend)
          });
        }

        let _goodsData = that.data.goodsData
        if (res.data.itemVos.list.length) {
          _goodsData = [..._goodsData, ...res.data.itemVos.list]
        }
        _goodsData.forEach(newItem => {
          console.log(newItem.itemName)
          newItem.itemPrice = newItem.itemPrice || []
          newItem.itemPrice.forEach(cItem => {
            console.log(cItem.saleType, '@@@@@', cItem.salePrice, newItem.itemName)
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

          // wx.setStorageSync('egItem',this.data.goodsData[0]);
        });
        that.setData({
          goodsData: _goodsData,
          total: res.data.itemVos.total,

        })

        wx.setStorageSync('egItem', that.data.goodsData[0]);
      });



  },
  // 选中商品
  changeGoods(e: any) {

    let _type = e.currentTarget.dataset.type
    let _index = e.currentTarget.dataset.index
    let _selectItem: any = {}
    var item = e.currentTarget.dataset.item
    // if(this.data.isOff){
    // _selectItem = item
    // }else{
    _selectItem = item
    // _selectItem = {...e.currentTarget.dataset.item,catalogId:this.data.selectClass.id,catalogName:this.data.selectClass.name}


    // }
    let _search = e.currentTarget.dataset.search
    let alreadySelectNumber = wx.getStorageSync('addGoodsData').length
    // let goodsSelectNumber = this.data.goodsData.filter((item) => { return item.isAddGoods })
    // let searchGoodsSelectNumber = this.data.searchGoodsData.filter((item) => { return item.isAddGoods })
    // alreadySelectNumber = goodsSelectNumber.length + searchGoodsSelectNumber.length

    if (alreadySelectNumber > 19 - this.data.recommentList.length && _type == 'add') {
      wx.showToast({
        title: '最多推荐单品20个',
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

    let _selectNumber = wx.getStorageSync('addGoodsData')
    this.setData({
      goodsData: this.data.goodsData,
      searchGoodsData: this.data.searchGoodsData,
      selectNumber: _selectNumber.length
    })
    wx.setStorageSync('egItem', this.data.goodsData[0]);
  },
  changeLeftClassification(e: any) {
    this.setData({
      pageNumber: 1,
      empty: false,
      goodsData: []

    })
    let _item = e.currentTarget.dataset.item

    this.getShopkeeperList(_item.id)
    this.setData({
      leftIndex: e.currentTarget.dataset.index,
      // selectClass:_item

    })
  },
  changeTopTabs(e: any) {
    if (e.currentTarget.dataset.item.id == -1) {
      this.setData({ isOff: true })
    } else {
      this.setData({ isOff: false })

    }
    this.setData({
      tabsIndex: e.currentTarget.dataset.index,
      leftIndex: 0,
      pageNumber: 1,
      empty: false,
      goodsData: []

    })
    let _item = e.currentTarget.dataset.item
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
    let recommend = this.data.recommentList
    _addGoodsData.forEach(item => {
      _selectItem.push(item.itemId)
    });
    util.request(api.shopkeeperSearch, _data,
      'get').then(function (res: any) {
        res.data.itemVos.list.forEach(item => {
          console.log(item)
          item.isAddGoods = _selectItem.includes(item.itemId) ? true : false
          item.isRecommend = recommend.includes(item.itemId) ? true : false
          console.log(item.itemPrice, 'EEEEE')
          item.itemPrice.forEach(cItem => {
            console.log(cItem.saleType, '@@@@@', cItem.salePrice, item.itemName)
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

        that.setData({
          searchGoodsData: [..._searchGoodsData, ...res.data.itemVos.list]
        })
      });
  },
  reachBottom(e: any) {
    console.log('#####到底了')


    if (this.data.isOff || !this.data.shopkeeperChildrenId) {
      wx.showToast({
        title: '已加载完当前分类所有商品',
        icon: 'none',
        duration: 2000
      })
      return;
    } else {
      if (this.data.total <= this.data.goodsData.length) {
        wx.showToast({
          title: '已加载完当前分类所有商品',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let _pageNumber = this.data.pageNumber + 1
      this.setData({
        pageNumber: _pageNumber
      })
      this.getShopkeeperList(this.data.shopkeeperChildrenId)


    }

    // console.log('我滚动到底部了呦', e)
  },
  recommendationList() {
    var _this = this;
    let _userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    console.log(_userInfo)
    util.request(api.recommendationList, { shop_id: _userInfo.shop ? _userInfo.shop.id : 30 }).then((res: any) => {
      var arr = []
      if (res.data.searchShopProductDtos && res.data.searchShopProductDtos.length > 0) {
        res.data.searchShopProductDtos.forEach(item => {
          arr.push(item.itemInfo.itemId)
        });
        _this.setData({ recommentList: arr })
      }
      this.getShopkeeperClassify();
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    shopkeeperClassifyData: [],//一级类目
    shopkeeperChildrenId: null,//当前二级分类id
    showClassify: true,//是否是搜索数据
    searchValue: '',//储存搜索文字
    pageSize: 10,
    pageNumber: 1,
    searchPageNumber: 1,
    searchPageSize: 10,
    searchTotal: 0,
    total: null,
    tabsIndex: 0,
    leftIndex: 0,
    empty: false,
    themeColor: serviceApp.globalData.themeColor,
    guideIcon: serviceApp.globalData.imageUrl + '/images/guide.svg',
    addIcon: serviceApp.globalData.imageUrl + '/images/hybridRecommend_add.svg',
    activeId: '0',
    leftClassification: [{ title: 'ageLOC LumiSpa', }, { title: 'ageLOC Spa' }, { title: 'ageLOC活颜抗老系列' }, { title: 'ageLOC 焕新系列' }, { title: 'ageLOC R²' }],
    selectNumber: 0,//选中数量
    stepProcessNumber: 0,
    goodsData: [],
    searchGoodsData: [],
    recommentList: [],
    firstRecommendation: false,
    isOff: true,
    // selectClass:{}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log('loadload')
    this.recommendationList();


    wx.setStorageSync('addGoodsData', [])
    this.changeColor('guideIcon', this.data.guideIcon, serviceApp.globalData.themeColor)
    this.changeColor('addIcon', this.data.addIcon, serviceApp.globalData.themeColor)

  },
  changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
    changeSvg.svgColor(url, color, type).then((res: any) => {
      this.setData({ [name]: res })
    })


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
      serviceApp.globalData.themeColor = res;

    })
    let _addGoodsData = wx.getStorageSync('addGoodsData')
    console.log(this.data.recommentList, '#####', _addGoodsData)
    var _selectItem: Array<number> = []

    _addGoodsData.forEach((item: any) => {
      _selectItem.push(item.itemId)

    })
    var newData = this.data.goodsData;
    var searchGoodsData = this.data.searchGoodsData
    var recommend = this.data.recommentList
    newData.forEach((item: any) => {
      item.isAddGoods = _selectItem.includes(item.itemId) ? true : false
      item.isRecommend = recommend.includes(item.itemId) ? true : false

    });
    searchGoodsData.forEach((item: any) => {
      item.isAddGoods = _selectItem.includes(item.itemId) ? true : false
      item.isRecommend = recommend.includes(item.itemId) ? true : false

    });
    console.log(newData)


    this.setData({
      goodsData: newData,
      selectNumber: _addGoodsData.length,
      searchGoodsData: searchGoodsData

    })
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
  reset() {
    console.log('2222')
    this.setData({ searchValue: '', showClassify: true })
    console.log(this.data.searchValue)

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

  }
})