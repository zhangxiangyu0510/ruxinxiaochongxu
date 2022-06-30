var api = require('../../config/api')
var util = require('../../utils/util');
import { EventBusInstance } from '../../utils/eventBus'
import TIM from 'tim-wx-sdk'
import imClinet from '../../utils/imClient';
const newsApp = getApp<IAppOption>();
var changeSvg = require('../../utils/changeThemeColor');
console.log('imClinet====',imClinet);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowNoData:false,
    deAvatar: newsApp.globalData.imageUrl+'/userCenterIcon/defaultMyIcon.svg',
    themeColor:newsApp.globalData.themeColor,
    conversationList:[],
    index: 0,
    unreadCount: 0,
    conversationInfomation: {},
    transChenckID: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.changeColor('deAvatar',this.data.deAvatar, newsApp.globalData.themeColor, "stroke")
//     wx.navigateTo({
//       url:'/TUI-CustomerService/pages/TUI-Conversation/conversation/conversation',
//   })

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
        console.log('worker', data)
        this.selectComponent("#notificationDialog").push(data)
      }, true)
      // 登入后拉去会话列表
    wx.$TUIKit.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onConversationListUpdated, this);
    // wx.$TUIKit.on(, this.onConversationListUpdated, this);
    let that=this;
    util.getUrl();
    this.setData({
        themeColor:wx.getStorageSync('themeColor')
    })
    this.changeColor('deAvatar',this.data.deAvatar, newsApp.globalData.themeColor, "stroke")
    this.selectComponent("#dialogProtocol").close();
    this.getConversationList();

  },
    // 更新会话列表
    onConversationListUpdated(event:any) {
        console.log('event====',event);
        const updateConversationList=event.data.filter((item:any)=>{return item.userProfile.userID!="administrator"})
        this.setData({
          conversationList:updateConversationList,
        });

      },
    // 获取会话列表
    getConversationList() {
        let that=this;
        let promise = imClinet.tim.getConversationList();
        promise.then((imResponse:any)=> {
            // 全量的会话列表，用该列表覆盖原有的会话列表
        const conversationList = imResponse.data.conversationList.filter((item:any)=>{return item.userProfile.userID!="administrator"}); 
        that.setData({
            conversationList,
        })
        console.log('conversationList====',conversationList)
        }).catch((imError:any)=> {
        console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
        });
      },
        // 跳转到子组件需要的参数
  handleRoute(event:any) {
    const flagIndex = this.data.conversationList.findIndex((item:any) => item.conversationID === event.currentTarget.id);
    this.setData({
      index: flagIndex,
    });
    this.getConversationList();
    this.data.conversationInfomation = { conversationID: event.currentTarget.id,
      unreadCount: this.data.conversationList[this.data.index].unreadCount };
    const url = `/TUI-CustomerService/pages/TUI-Chat/chat?conversationInfomation=${JSON.stringify(this.data.conversationInfomation)}`;
    wx.navigateTo({
      url,
    });
  },
  changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
    changeSvg.svgColor(url, color,type).then((res:any)=>{
      this.setData({[name]:res})
    })


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.selectComponent("#dialogProtocol").close();
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