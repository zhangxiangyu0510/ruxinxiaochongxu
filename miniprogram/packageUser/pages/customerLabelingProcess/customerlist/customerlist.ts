var api=require('../../../../config/api')
var util = require('../../../../utils/util');
const indexAap = getApp<IAppOption>();
var changeSvg = require('../../../../utils/changeThemeColor');
import { EventBusInstance } from '../../../../utils/eventBus'
import imClinet from '../../../../utils/imClient';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conversationList:[{conversationID:'',unreadCount:0}],
    themeColor: wx.getStorageSync('themeColor'),
    showOpenArrow: false,
    showOpenArrow1: false,
    isClickConsume:false,
    isCommunicate:false,
    isClickAll:false,
    isDataEnd:false,
    isShowListData2:false,
    listTitle:'近七天访问粉丝',
    listTitle1:'七天前访问的粉丝',
    listTitle2:'三个月以上消费',
    maxHeight:0,
    searchData:{
      offset:'0',
      shopId:'',
      page:0,
      size:'100',
      tagList: [],//标签的id集合
      type:'1'//筛选类型，1：默认 2：最近消费 3：最近沟通
    },
    searchDataList:[],
    inputValue:'',
    isShowSearch:false,
    identityTagObj:{
      ORDINARY_CUSTOMERS:'注册顾客',
      RETAIL_CUSTOMERS:'零售顾客',
      STAR_CUSTOMERS:'星级顾客',
    },
    ListData:[],//第一个列表
    ListData1:[],//第二个
    ListData2:[],//第三个
    ellipsis: false,
    ellipsis1: true,
    ellipsis2:true,
    tabs: [],
    searchInputValue:'',
    activeId: '0',
    my_header_avater: indexAap.globalData.imageUrl+"/userCenterIcon/defaultMyIcon.svg",
    zuo:indexAap.globalData.imageUrl+'/icons/up_arrows_1.svg',
    rightListData:[]
  },
  getListData(){
    // console.log('进来了',this.data.searchData);
    let _that=this;
    const nowPage = this.data.searchData.page
    util.request(api.getCustomerList+'?page='+_that.data.searchData.page+'&size='+_that.data.searchData.size,_that.data.searchData,'POST').then(function (res:any) {
      if(res){
        
        if (_that.data.searchData.type == '1' || _that.data.searchData.type == '3') {//默认
            if (nowPage==0) {//查询第一页数据不需要拼接到一起
                _that.setData({
                    isShowSearch:false,
                    'inputValue':'',
                    ListData:res.data.withSevCust,
                    ListData1:res.data.outSevCust,
                    ListData2:[]
                })
            } else {
                _that.setData({
                  isShowSearch:false,
                  'inputValue':'',
                  ListData:res.data.withSevCust&&res.data.withSevCust.length!=0?_that.foramateArr(_that.data.ListData.concat(res.data.withSevCust)):_that.data.ListData,
                  ListData1:res.data.outSevCust&&res.data.outSevCust.length!=0?_that.foramateArr(_that.data.ListData1.concat(res.data.outSevCust)):_that.data.ListData1,
                  ListData2:[]
                })
            }
          if (res.data.withSevCust || res.data.outSevCust) {
            _that.setData({
              isDataEnd:true
            })
          }
        } else {//最近消费
            if (nowPage == 0) {
                _that.setData({
                    isShowSearch:false,
                    'inputValue':'',
                    ListData:res.data.oneMonCust,
                    ListData1:res.data.threeMonCust,
                    ListData2:res.data.outThreeMonCust
                })
            } else {
                _that.setData({
                  isShowSearch:false,
                  'inputValue':'',
                  ListData:res.data.oneMonCust&&res.data.oneMonCust.length!=0?_that.foramateArr(_that.data.ListData.concat(res.data.oneMonCust)):_that.data.ListData,
                  ListData1:res.data.threeMonCust&&res.data.threeMonCust.length!=0?_that.foramateArr(_that.data.ListData1.concat(res.data.threeMonCust)):_that.data.ListData1,
                  ListData2:res.data.outThreeMonCust&&res.data.outThreeMonCust.length!=0?_that.foramateArr(_that.data.ListData2.concat(res.data.outThreeMonCust)):_that.data.ListData2
                })
            }
          if (res.data.oneMonCust||res.data.threeMonCust||res.data.outThreeMonCust) {
            _that.setData({
              isDataEnd:true
            })
          }
        }
      }
    //   console.log('顾客列表',res);
    });
  },
  getTagList(){
    let _that=this;
    util.request(api.getTagList).then(function (res:any) {
      if(res&&res.data){
        // let arr:any = []
        // arr.push(res.data[0])
        res.data.forEach((item:any) => {
          item.tagValues.forEach((item1:any) => {
            item1.checked = false
          });
        });
        _that.setData({
          tabs:res.data
        //   rightListData:arr
        })
      }
    //   console.log('标签列表',res);
    });
  },
  onTabCLick(e:any){
    let arr:any = []
    if (this.data.tabs[e.detail.index]) {
      arr.push(this.data.tabs[e.detail.index])
      this.setData({
        rightListData:arr
      })
      
    }
  },
  foramateArr(arr:any){
    let arr2 = arr.filter(function(element:any,index:any,self:any){      
        return self.indexOf(element) === index;
      });
    
    return arr2;
  },
  openLabels: function () {
    // this.data.showOpenArrow = !this.data.showOpenArrow;
    // console.log('我是全部标签',this.data.tabs);
    this.setData({
      showOpenArrow: !this.data.showOpenArrow,
      isClickAll:!this.data.isClickAll,
      rightListData:[
        this.data.tabs[0]
      ]
    })
  },
  openOrClose: function () {
    this.setData({
      ellipsis: !this.data.ellipsis

    })
  },
  openOrClose1: function () {
    this.setData({
      ellipsis1: !this.data.ellipsis1

    })
  },
  openOrClose2:function () {
    this.setData({
      ellipsis2: !this.data.ellipsis2

    })
  },
  diseaseSwitch: function (options:any) {
    // console.log('diseaseSwitch',options);
    var fordata = options.currentTarget.dataset.fordata
    let that = this,
    isCheckbox:any = false,
    tabArr = this.data.tabs;
    let newArr:any = []
    fordata.forEach((item:any) => {
      item.tagValues.forEach((item1:any) => {
        if (item1.id == options.currentTarget.dataset.id) {
          item1.checked = !item1.checked
          newArr.push(item)
        }
        if (item.name == '如新需求' || item.name == '喜好') {
          isCheckbox = true
        }
      });
    });
    if (!isCheckbox) {
      newArr.forEach((item:any) => {
        item.tagValues.forEach((item1:any) => {
          if (item1.id != options.currentTarget.dataset.id) {
            item1.checked = false
          }
        });
      });
    }
    // console.log('组合',newArr,this.data.tabs);
    tabArr.forEach((item:any)=>{
        newArr.forEach((item1:any) => {
            if (item.id == item1.id) {
                item.tagValues = item1.tagValues
            }
        });
    })
    // 更新
    that.setData({
      rightListData: newArr,
      tabs:tabArr
    });
  },
  goodsSearch(e:any){
      console.log('我是搜索',e.detail.value,this.data.inputValue);
    let _that=this;
    if (!e.detail.value.trim()) {
        _that.setData({
            'searchData.page':0,
            'searchData.size':'100',
            'searchInputValue':''
        })
        _that.getListData()
    } else {
        util.request(api.getCustomerBySearch,{
            search_value:e.detail.value.trim()
        }).then(function (res:any) {
            if(res&&res.data){
                _that.setData({
                    isShowSearch:true,
                    isCommunicate:false,
                    isClickConsume:false,
                    showOpenArrow:false,
                    isClickAll:false,
                    searchInputValue:e.detail.value.trim(),
                    searchDataList:res.data
                })
            }
        });
    }
  },
  goCustormLabelList() {
    this.setData({
      showOpenArrow: false
    })
    wx.navigateTo({
      url: '../../customerLabelingProcess/customerlabelList/customerlabelList',
    })
  },
  goChat(e:any){
      console.log('----------开始聊天了',e);
    let that=this;
    let promise = imClinet.tim.getConversationList();
    promise.then((imResponse:any)=> {
        // 全量的会话列表，用该列表覆盖原有的会话列表
        console.log('imResponse====',imResponse);
    const conversationList = imResponse.data.conversationList.filter((item:any)=>{return item.userProfile.userID==e.currentTarget.dataset.uid}); 
    that.setData({
        conversationList,
    });
    console.log('conversationList====',conversationList)
    let conversationInfomation:any = { conversationID: that.data.conversationList[0].conversationID,
        unreadCount: that.data.conversationList[0].unreadCount  };
            const url = `/TUI-CustomerService/pages/TUI-Chat/chat?conversationInfomation=${JSON.stringify(conversationInfomation)}`;
            wx.navigateTo({
            url,
            });
    }).catch((imError:any)=> {
    console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
    });
  },
  goCustormDetail(e:any){
    // console.log('点击进入详情页',e.currentTarget.dataset);
    
    wx.navigateTo({
      url: '../../customerLabelingProcess/custormDetail/custormDetail?id='+e.currentTarget.dataset.id
      +'&nkMemberId='+e.currentTarget.dataset.nkmemberid,
    })
  },
  getConsume(){
    // console.log('>>>>>>>>>',this.data.isClickConsume,this.data.isCommunicate);
    if (this.data.isClickConsume) {//查询默认
      let searchDataType = 'searchData.type',
      searchDataPage = 'searchData.page' 
      this.setData({
        isClickConsume: !this.data.isClickConsume,
        listTitle:'近七天访问粉丝',
        listTitle1:'七天前访问的粉丝',
        ListData:[],
        ListData1:[],
        [searchDataType]:'1',
        showOpenArrow: false,
        isClickAll:false,
        [searchDataPage]:0,
        isShowListData2:false,
        isDataEnd:false
      })
      this.getListData()
    } else {  //查询最近消费  
      let searchDataType = 'searchData.type',
      searchDataPage = 'searchData.page' 
      this.setData({
        isClickConsume: !this.data.isClickConsume,
        isCommunicate:this.data.isClickConsume,
        listTitle:'近一个月内消费',
        listTitle1:'近三个月内消费',
        listTitle2:'三个月以上消费',
        ListData:[],
        ListData1:[],
        ListData2:[],
        showOpenArrow: false,
        isClickAll:false,
        [searchDataType]:'2',
        [searchDataPage]:0,
        isShowListData2:true,
        isDataEnd:false
      })
      this.getListData()
    }
  },
  getCommunicate(){
    if (this.data.isCommunicate) {//取消选中
      let searchDataType = 'searchData.type',
      searchDataPage = 'searchData.page'
      this.setData({
        isCommunicate: !this.data.isCommunicate,
        listTitle:'近七天访问粉丝',
        listTitle1:'七天前访问的粉丝',
        ListData:[],
        ListData1:[],
        [searchDataType]:'1',
        [searchDataPage]:0,
        isShowListData2:false,
        showOpenArrow: false,
        isClickAll:false,
        isDataEnd:false
      })
      this.getListData()
    } else {
      let searchDataType = 'searchData.type',
      searchDataPage = 'searchData.page'
      this.setData({
        isCommunicate: !this.data.isCommunicate,
        isClickConsume:this.data.isCommunicate,
        listTitle:'近七天内沟通',
        listTitle1:'七天前沟通',
        showOpenArrow: false,
        isClickAll:false,
        ListData:[],
        ListData1:[],
        [searchDataType]:'3',
        [searchDataPage]:0,
        isShowListData2:false,
        isDataEnd:false
      })
      this.getListData()
    }
  },
  save(){
    let _that = this,
    idArr:any = []
    _that.data.tabs.forEach((item:any)=>{
      item.tagValues.forEach((item1:any) => {
        if (item1.checked) {
            idArr.push(item1.id)
        }
      });
    })
    this.setData({
      showOpenArrow: !this.data.showOpenArrow,
      isClickAll:false,
      'searchData.tagList':idArr
    })
    // console.log('选中标签集合',idArr);
    this.getListData()
  },
  reset(){
    // console.log('我是重置');
    let _that = this
    _that.data.tabs.forEach((item:any)=>{
      item.tagValues.forEach((item1:any) => {
        item1.checked = false
      });
    })
    _that.data.rightListData.forEach((item:any)=>{
        item.tagValues.forEach((item1:any) => {
            item1.checked = false
        });
    })
    this.setData({
        tabs:_that.data.tabs,
      'searchData.tagList':[],
       rightListData:_that.data.rightListData
    })
  },
  controlShowFloat(e:any){
    if (e.currentTarget.dataset.show=='0') {
      this.setData({
        showOpenArrow: false,
        isClickAll:false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // let themeIcon: string = changeSvg.svgColor(this.data.my_header_avater, indexAap.globalData.themeColor, "stroke"),
    // icon:string = changeSvg.svgColor(this.data.zuo, indexAap.globalData.themeColor, "stroke")
    this.setData({
        'searchData.shopId':typeof wx.getStorageSync('userInfo') == 'string' ? JSON.parse(wx.getStorageSync('userInfo')).shop.id : wx.getStorageSync('userInfo').id,
        // my_header_avater: themeIcon,
        // zuo:icon
    })
    this.changeColor('zuo',this.data.zuo, indexAap.globalData.themeColor, "stroke")
    this.changeColor('my_header_avater',this.data.my_header_avater, indexAap.globalData.themeColor, "stroke")
  },
  changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
    changeSvg.svgColor(url, color,type).then((res:any)=>{
      this.setData({[name]:res})
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
    EventBusInstance.on('notification', (data: any) => {
        console.log('page index:', data)
        this.selectComponent("#notificationDialog").push(data)
    }, true)
    var that = this;
    wx.getSystemInfo({
        success: function (res) {
          console.log('屏幕参数',res);
          // 获取可使用窗口宽度
          let windowHeight = res.windowHeight;
          // 设置高度
          let currentHeight=(windowHeight-195);
          console.log('当前高度====',currentHeight);
          that.setData({
            maxHeight: currentHeight
          });
        }
    });
    this.setData({
        themeColor:indexAap.globalData.themeColor
    })
    this.getListData()
    this.getTagList()
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
    // console.log('-----下拉刷新');
    this.setData({
      ['searchData.offset'] : '0',
      ['searchData.type'] : '1',
      ['searchData.page'] : 0,
      ['searchData.size'] : '100',
    })
    this.getListData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('上拉加载更多',this.data.searchInputValue);
    if (!this.data.searchInputValue) {
        if (this.data.isDataEnd) {//没有更多数据
          this.data.searchData.page++;
          this.getListData()
        }
    }
  }
})