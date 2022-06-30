
var api = require('../../../../config/api')
var util = require('../../../../utils/util');
var changeSvg = require('../../../../utils/changeThemeColor');
const indexAap = getApp<IAppOption>();
import { EventBusInstance } from '../../../../utils/eventBus'
import imClinet from '../../../../utils/imClient';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conversationList:[{conversationID:'',unreadCount:0}],
    themeColor: wx.getStorageSync('themeColor'),
    zuo: indexAap.globalData.imageUrl+'/icons/huangguan.svg',
    you: indexAap.globalData.imageUrl+'/icons/beijing.svg', 
    zuo2: indexAap.globalData.imageUrl+'/icons/huangguan.svg', 
    you2: indexAap.globalData.imageUrl+'/icons/beijing.svg',
    my_header_avater: indexAap.globalData.imageUrl+"/userCenterIcon/defaultMyIcon.svg",
    fromData: {},
    userTagValueDtos: [],
    goodsList:[],
    noMore:false,
    birthdayTime: '',
    ageNum:'' as any,
    page:1,
    nkMemberId:'',
    identityTagObj: {
      ORDINARY_CUSTOMERS: '注册顾客',
      RETAIL_CUSTOMERS: '零售顾客',
      STAR_CUSTOMERS: '星级顾客',
    },
    showChart: false,
    onInitChart(F2: any, config: any) {
      const chart = new F2.Chart(config);
      const data = wx.getStorageSync('orderStatisticalChart')
      let amtOrderMax = JSON.parse(JSON.stringify(data)).sort(function (a:any,b:any) {
        return b.amtOrder - a.amtOrder
      })
      console.log('最大值',amtOrderMax);
      
      chart.source(data, {
        // name: {
        //   range: [0, 1],
        //   type: 'timeCat',
        //   mask: 'MM-DD'
        // },
        amtOrder: {
          max: amtOrderMax[0].amtOrder,
          alias:'订单金额',
          tickCount: 4
        }
      });
      // chart.area().position('name*value').color('city').adjust('stack');
      chart.line().position('dateType*amtOrder').adjust('stack');
      chart.point().position('dateType*amtOrder').style({
        stroke: wx.getStorageSync('themeColor'),
        lineWidth: 1
      });
      chart.render();
      // 注意：需要把chart return 出来
      return chart;
    },
    isDelTags: false,
    userId:'',
    customerDetailId: '',//顾客的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options: any) {
    console.log('-------', options);
    this.changeColor('my_header_avater',this.data.my_header_avater, indexAap.globalData.themeColor, "stroke")
    this.setData({
      customerDetailId: options.id,
      nkMemberId:options.nkMemberId,
    })
    // this.getCustomerDetail(options.id)
  },
  changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
    changeSvg.svgColor(url, color,type).then((res:any)=>{
      this.setData({[name]:res})
    })
  },

  // });


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
    this.setData({
        themeColor:indexAap.globalData.themeColor,
        // zuo: changeSvg.svgColor('/images/icons/huangguan.svg', indexAap.globalData.themeColor),
        // you: changeSvg.svgColor('/images/icons/beijing.svg', indexAap.globalData.themeColor),
    })
    this.getCustomerDetail(this.data.customerDetailId)
    this.changeColor('zuo',this.data.zuo, indexAap.globalData.themeColor)
    this.changeColor('you',this.data.you, indexAap.globalData.themeColor)
    this.changeColor('zuo2',this.data.zuo2, '#666666')
    this.changeColor('you2',this.data.you2, '#666666')
    
  },
  getCustomerDetail(id: any) {
    // console.log('进来了');
    let _that = this;
    wx.showLoading({
      title: '加载中'
    })
    util.request(api.getCustomerDetail, {
      user_id: id,
      nkMemberId:this.data.nkMemberId
    }).then(function (res: any) {
      if (res && res.data) {
        // console.log('》》》》',res);
        if (res.data.userTagValueDtos) {
            res.data.userTagValueDtos.forEach((item: any) => {
              item.isDel = false
            });
        }
        var date = new Date();
        let birthday = res.data.birthday ? util.formatDate(res.data.birthday).split('-')[1] + '.' + util.formatDate(res.data.birthday).split('-')[2] : '',
        ageNum = res.data.birthday ? date.getFullYear() - new Date(res.data.birthday).getFullYear() : ''
        if (res.data.lastOrderInfo && res.data.lastOrderInfo.orderTime) {
            res.data.lastOrderInfo.orderTime = res.data.lastOrderInfo.orderTime.split(/\s+/)[0]
        }
        _that.setData({
          fromData: res.data,
          userTagValueDtos: res.data.userTagValueDtos,
          birthdayTime: birthday,
          ageNum:ageNum,
          userId:res.data.userId
        })
        // wx.setStorageSync('orderStatisticalChart', res.data.orderStatisticalChart)
        wx.hideLoading();//隐藏loading
        _that.getUserList(res.data.userId)
        _that.getUserDetailByTime(res.data.nkMemberId)
        // _that.setData({
        //   showF2:true
        // })

      }
      //   console.log('顾客详情',res);
    });
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
  goOrderList() {
    wx.navigateTo({
      url: '../../customerLabelingProcess/customerorderlist/customerorderlist?id='+this.data.customerDetailId,
    })
  },
  goOrderDetail(e: any) {
    // console.log('准备进入订单详情页',e.currentTarget);

    wx.navigateTo({
      url: '../../customerLabelingProcess/customerorderdetail/customerorderdetail?orderNo=' + e.currentTarget.dataset.id+'&id='+this.data.customerDetailId
    })
  },
  getUserList(id:any){
    util.request(api.userGoodsList, {userId:id, page:this.data.page,size:20}).then((res: any) => {
      console.log(res,'######');
      this.setData({
        goodsList:res.data
      });
      if(res.data.length<20){
        this.setData({noMore:true})
      }
    }).catch(e=>{
      console.log(e,'@@@@')
    })

  },
  getUserDetailByTime(id:any){
      let dateYear = new Date().getFullYear()
    util.request(api.getUserDetailByTime, {accountId:id, page:this.data.page,size:20,dateType:dateYear}).then((res: any) => {
      console.log('00000',res);
      wx.setStorageSync('orderStatisticalChart', res.data)
      this.setData({
          showChart:true
      })
    }).catch((e:any)=>{
      console.log(e,'@@@@')
    })
  },
  goCustormLabelList() {
    wx.navigateTo({
      url: '../../customerLabelingProcess/customerlabelList/customerlabelList?custormDetail=true&customerDetailId=' + this.data.customerDetailId,
    })
  },
  goVirtualCoins() {
    wx.navigateTo({
        url: '../../customerLabelingProcess/virtualCoinslist/virtualCoinslist?userId=' + this.data.customerDetailId,
      })
  },
  delTags() {
    this.data.userTagValueDtos.forEach((item: any) => {
      item.isDel = false
    });
    this.setData({
      isDelTags: !this.data.isDelTags,
      userTagValueDtos: this.data.userTagValueDtos
    })
  },
  deleteTag(e: any) {
    // console.log('删除标签',e);
    this.data.userTagValueDtos.forEach((item: any) => {
      if (item.id == e.currentTarget.dataset.id) {
        item.isDel = true
      }
    });
    this.setData({
      userTagValueDtos: this.data.userTagValueDtos
    })
  },
  delSave() {
    let _that = this,
      delArr: any = []
    this.data.userTagValueDtos.forEach((item: any) => {
      if (item.isDel) {
        delArr.push(item.id)
      }
    });
    if (delArr.length == 0) {
      wx.showToast({
        title: '请选择需要删除的笔记',
        icon: 'error',
        duration: 2000
      })
      return false;
    }
    util.request(api.delUserTagValue, delArr, 'post').then(function (res: any) {
      if (res) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        })
        _that.getCustomerDetail(_that.data.customerDetailId)
        _that.setData({
          isDelTags: !_that.data.isDelTags
        })
      }
      //   console.log('删除标签成功',res);
    });
  },
  copy:function(e:any){
    var code = e.currentTarget.dataset.copy;
    wx.setClipboardData({
      data: code,
      success: function (res:any) {
        wx.showToast({
          title: '复制成功',
        });
      },
      fail:function(res:any){
        wx.showToast({
          title: '复制失败',
        });
      }
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
      if (!this.data.noMore) {
          this.data.page++
          this.setData({
              page:this.data.page
          })
          this.getUserList(this.data.userId)
      }
  }
})