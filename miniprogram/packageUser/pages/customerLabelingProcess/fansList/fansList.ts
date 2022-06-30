// pages/customerLabelingProcess/fansList/fansList.ts
var api=require('../../../../config/api')
var util = require('../../../../utils/util');
var changeSvgFans = require('../../../../utils/changeThemeColor');
const indexAapFans = getApp<IAppOption>();
import { EventBusInstance } from '../../../../utils/eventBus'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      dataArray:[],
      themeColor: wx.getStorageSync('themeColor'),
      my_header_avater: indexAapFans.globalData.imageUrl+"/userCenterIcon/defaultMyIcon.svg",
      searchData:{
        offset:'0',
        shop_id:'',
        page:0,
        size:'100'
      },
      isDataEnd:false
  },
  getFansList(){
    let _that = this
    util.request(api.fansList,_that.data.searchData,'get').then(function (res:any) {
        if(res.data.content){
            let dataList = res.data.content
            dataList.forEach((item:any) => {
                item.followTime = util.formatDate(item.followTime)
            });
          _that.setData({
              dataArray:res.data.content,
              isDataEnd:false
          })
        }else{
            _that.setData({
                isDataEnd:true
            })
        }
        console.log('粉丝列表',res);
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // let themeIcon: string = changeSvgFans.svgColor(this.data.my_header_avater, indexAapFans.globalData.themeColor, "stroke")
    this.setData({
        // my_header_avater: themeIcon,
        'searchData.shop_id':typeof wx.getStorageSync('userInfo') == 'string' ? JSON.parse(wx.getStorageSync('userInfo')).shop.id : wx.getStorageSync('userInfo').id
    })
    this.getFansList()
    this.changeColor('my_header_avater',this.data.my_header_avater,indexAapFans.globalData.themeColor, "stroke")
  },
  changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
    changeSvgFans.svgColor(url, color,type).then((res:any)=>{
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
    this.setData({
        themeColor:indexAapFans.globalData.themeColor
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
    this.setData({
        ['searchData.offset'] : '0',
        ['searchData.shop_id'] : '1',
        ['searchData.type'] : '1',
        ['searchData.page'] : '0',
        ['searchData.size'] : '100',
        isDataEnd : false
    })
    this.getFansList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (!this.data.isDataEnd) {//没有更多数据
        this.data.searchData.page++;
        this.getFansList()
    }
  }
})