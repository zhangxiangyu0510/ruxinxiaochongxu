// pages/customerLabelingProcess/setlabel1/setlabel1.ts
var api=require('../../../../config/api')
var util = require('../../../../utils/util');
var changeSvg = require('../../../../utils/changeThemeColor');
const indexAap = getApp<IAppOption>();
import { EventBusInstance } from '../../../../utils/eventBus'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeColor: wx.getStorageSync('themeColor'),
    my_header_avater: indexAap.globalData.imageUrl+"/userCenterIcon/defaultMyIcon.svg",
    ellipsis: false,
    ellipsis1: true,
    showtoast:false,
    ellipsisRetail:true,
    checkboxItems: [],
    checkboxItemsNum:0,
    checkboxItems1: [],
    checkboxItems2: [],
    id:'',
    labelName:'',
    startX: 0, //开始坐标
    startY: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    // let themeIcon: string = changeSvg.svgColor(this.data.my_header_avater, indexAap.globalData.themeColor, "stroke")
    this.setData({
      // my_header_avater: themeIcon,
      id:options.id,
      labelName:options.label
    })
    this.getTagValueUsers(options.id)
    this.changeColor('my_header_avater',this.data.my_header_avater, indexAap.globalData.themeColor, "stroke")
  },
  changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
    changeSvg.svgColor(url, color,type).then((res:any)=>{
      this.setData({[name]:res})
    })


  },

  getTagValueUsers(id:any){
    // console.log('iiiii', id);
    wx.showLoading({
        title: '加载中',
        mask:true
    })
    let _that=this;
    util.request(api.getTagValueUsers,{
      tagValueId:id
    }).then(function (res:any) {
      if(res.data){
          let numArr:any = [],
          numArr1:any = [],
          numArr2:any = []
          res.data.forEach((item:any) => {
              item.isTouchMove = false
              if (!item.avatar) {
                item.avatar = 'data:image/svg+xml,'+_that.data.my_header_avater
              }
              if (item.isSelected) {
                  if (item.userType=='1') {//注册顾客
                    numArr.push(item)
                  }else if (item.userType=='2') {//零售顾客
                    numArr1.push(item)
                  } else {//星级顾客
                    numArr2.push(item)
                  }
              }
          });
        _that.setData({
          checkboxItems:numArr,
          checkboxItems1:numArr1,
          checkboxItems2:numArr2,
          checkboxItemsNum:numArr.length+numArr1.length+numArr2.length
        })
        wx.hideLoading();//隐藏loading
      }
      console.log('设置标签--顾客列表',res);
    }).catch(res=>{
        wx.hideLoading();//隐藏loading
    });
  },
  // checkboxChange: function (e:any) {
  //   console.log('checkbox发生change事件，携带value值为：', e.detail.value);

  //   var checkboxItems = this.data.checkboxItems, values = e.detail.value;
  //   for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
  //     for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
  //       if (checkboxItems[i]['userId'] == values[j]) {
  //         checkboxItems[i].checked = true;
  //         break;
  //       }
  //     }
  //   }

  //   this.setData({
  //     checkboxItems: checkboxItems,
  //     [`formData.checkbox`]: e.detail.value
  //   });
  // },
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  addCustorm() {
    wx.navigateTo({
      url: '../../customerLabelingProcess/choosecustorm/choosecustorm?id='+this.data.id,
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
     if(this.data.showtoast){
       let self = this
       setTimeout(function(){
        self.setData({
          showtoast:false
        })
       },3000)
     }
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

  },

  //手指触摸动作开始 记录起点X坐标
 touchstart: function (e:any) {
    //开始触摸时 重置所有删除
    this.data.checkboxItems.forEach(function (v:any) {
     if (v.isTouchMove)//只操作为true的
      v.isTouchMove = false;
    })
    this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
        checkboxItems: this.data.checkboxItems
    })
   },
   //滑动事件处理
   touchmove: function (e:any) {
    var that = this,
     index = e.currentTarget.dataset.index,//当前索引
     type = e.currentTarget.dataset.type,
     startX = that.data.startX,//开始X坐标
     startY = that.data.startY,//开始Y坐标
     touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
     touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
     //获取滑动角度
     angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
     let dataList = that.data.checkboxItems
     if (type == '1') {//零售顾客
        dataList = that.data.checkboxItems1
     }
     if (type == '2') {
        dataList = that.data.checkboxItems2
     }
     dataList.forEach(function (v:any, i) {
     v.isTouchMove = false
     //滑动超过30度角 return
     if (Math.abs(angle) > 30) return;
     if (i == index) {
      if (touchMoveX > startX) //右滑
       v.isTouchMove = false
      else //左滑
       v.isTouchMove = true
     }
    })
    //更新数据
    if (type=='0') {
        that.setData({
            checkboxItems: dataList
        })
    } else if (type == '1') {
        that.setData({
            checkboxItems1: dataList
        })
    }else{
        that.setData({
            checkboxItems2: dataList
        })
    }
   },
   /**
    * 计算滑动角度
    * @param {Object} start 起点坐标
    * @param {Object} end 终点坐标
    */
   angle: function (start:any, end:any) {
    var _X = end.X - start.X,
     _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
   },
   //删除事件
   del: function (e:any) {
        console.log('我是滑动删除',e);
        let _that = this,
        delArr:any = []
        if (e.currentTarget.dataset.userid) {
            delArr.push(e.currentTarget.dataset.userid)
        }
        util.request(api.delUserTagValue,delArr,'post').then(function (res:any) {
            if(res){
                wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                })
                _that.getTagValueUsers(_that.data.id)
            }
        });
   }
})