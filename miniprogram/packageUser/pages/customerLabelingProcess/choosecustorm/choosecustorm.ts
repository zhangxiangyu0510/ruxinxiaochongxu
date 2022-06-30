// pages/customerLabelingProcess/setlabel/setlabel.ts
var api=require('../../../../config/api')
var util = require('../../../../utils/util');
var changeSvg = require('../../../../utils/changeThemeColor');
import { EventBusInstance } from '../../../../utils/eventBus'
let indexAap = getApp<IAppOption>();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeColor: wx.getStorageSync('themeColor'),
    my_header_avater: indexAap.globalData.imageUrl+"/userCenterIcon/defaultMyIcon.svg",
    ellipsis: false,
    ellipsis1: true,
    ellipsisRetail:true,
    checkboxItems: [],
    checkboxItems1: [],
    checkboxItems2: [],
    tagValueId:'',
    userTagvalueInfo:[]
  },
  getTagValueUsers(id:any){
    // console.log('iiiii', id);
    
    let _that=this;
    util.request(api.getTagValueUsers,{
      tagValueId:id
    }).then(function (res:any) {
      if(res&&res.data){
        let numArr:any = [],
        numArr1:any = [],
        numArr2:any = []
        res.data.forEach((item:any) => {
          item.checked = item.isSelected
          if (!item.avatar) {
              item.avatar = 'data:image/svg+xml,'+_that.data.my_header_avater
          }
          if (item.userType=='1') {//注册顾客
            numArr.push(item)
          }else if (item.userType=='2') {//零售顾客
            numArr1.push(item)
          } else {//星级顾客
            numArr2.push(item)
          }
        });
        _that.setData({
            checkboxItems:numArr,
            checkboxItems1:numArr1,
            checkboxItems2:numArr2
        })
      }
      // console.log('查询顾客列表',res);
    });
  },
  goodsSearch(e:any){
    let _that=this;
    if (!e.detail.value) {
        _that.getTagValueUsers(_that.data.tagValueId)
    }else{
        util.request(api.getTagValueUsers,{
          tagValueId:_that.data.tagValueId,
          userName:e.detail.value
        }).then(function (res:any) {
          if(res&&res.data){
            res.data.forEach((item:any) => {
              item.checked = item.isSelected
              if (!item.avatar) {
                item.avatar = 'data:image/svg+xml,'+_that.data.my_header_avater
              }
            });
            _that.setData({
              checkboxItems:res.data,
              checkboxItems1:[],
              checkboxItems2:[]
            })
          }
          // console.log('查询顾客列表',res);
        });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    // console.log('---options',options);
    // let themeIcon: string = changeSvg.svgColor(this.data.my_header_avater,indexAap.globalData.themeColor, "stroke")
    this.setData({
      // my_header_avater: themeIcon,
      tagValueId:options.id
    })
    this.getTagValueUsers(options.id)
    this.changeColor('my_header_avater',this.data.my_header_avater,indexAap.globalData.themeColor, "stroke")
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
  save() {
    console.log(11111)
    let _that = this,
    arr = [..._that.data.checkboxItems,..._that.data.checkboxItems1,..._that.data.checkboxItems2],
    userIds:any = []
    arr.forEach((item:any)=>{
      if (item.checked) {
        userIds.push(item.userId)
      }
    })
    if (userIds.length==0) {
      wx.showToast({
        title: '请选择顾客',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    util.request(api.batchSaveUserTagValue,{
        'userIds':userIds,
        'tagValueId':Number(this.data.tagValueId)
    },'POST').then(function (res:any) {
      if(res.data){
        wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
        })
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.getTagValueUsers(_that.data.tagValueId)
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
       // console.log(pages.length)
        prevPage.setData({
    
          showtoast: true
    
        })
    
        wx.navigateBack({
    
          delta: 1, // 回退前 delta(默认为1) 页面
    
        })
        
      }
    });


  },

  checkboxChange: function (e:any) {
    // console.log('checkbox发生change事件，携带value值为：', this.data.checkboxItems,e.detail.value);
    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i]['checked'] = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i]['userId'] == values[j]) {
          checkboxItems[i]['checked'] = true;
          break;
        }
      }
    }
    this.setData({
        checkboxItems:checkboxItems,
      [`formData.checkbox`]: e.detail.value
    });
    // console.log('改变了', this.data.checkboxItems);
  },
  checkboxChange1: function (e:any) {
    var checkboxItems = this.data.checkboxItems1, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i]['checked'] = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i]['userId'] == values[j]) {
          checkboxItems[i]['checked'] = true;
          break;
        }
      }
    }
    this.setData({
        checkboxItems1:checkboxItems,
      [`formData.checkbox`]: e.detail.value
    });
    // console.log('改变了', this.data.checkboxItems);
  },
  checkboxChange2: function (e:any) {
    var checkboxItems = this.data.checkboxItems2, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i]['checked'] = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i]['userId'] == values[j]) {
          checkboxItems[i]['checked'] = true;
          break;
        }
      }
    }
    this.setData({
        checkboxItems2:checkboxItems,
      [`formData.checkbox`]: e.detail.value
    });
    // console.log('改变了', this.data.checkboxItems);
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
  openOrCloseRetail: function () {
    this.setData({
      ellipsisRetail: !this.data.ellipsisRetail

    })
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
        themeColor:indexAap.globalData.themeColor
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

  }
})