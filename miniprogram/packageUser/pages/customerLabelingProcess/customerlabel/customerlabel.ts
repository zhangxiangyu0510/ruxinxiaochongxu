// pages/customerLabelingProcess/customerlabel/customerlabel.ts
var api=require('../../../../config/api')
var util = require('../../../../utils/util');
var changeSvg = require('../../../../utils/changeThemeColor');
import { EventBusInstance } from '../../../../utils/eventBus'
const indexAap = getApp<IAppOption>();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shows:false,
    themeColor: wx.getStorageSync('themeColor'),
    // imageUrl:indexAap.globalData.imageUrl,
    custormDetail:false,
    zuo2: indexAap.globalData.imageUrl+'/icons/icon_checked.svg', 
    arrayData: [],
    searchData:{
      page:0,
      size:'100',
      tagId:''
    },
    custormDetailId:'',
    isDataEnd:false,
    selectType:false,//1 单选 2 多选
  },
  getDataList () {
    let _that=this;
    util.request(api.getTagValues,_that.data.searchData).then(function (res:any) {
      if(res&&res.data){
        res.data.forEach((item:any) => {
          item.checked = false
          item.isSelected = false
          item.userTageValueList.forEach((e:any) => {
            if (e.userId == _that.data.custormDetailId) {
              item.isSelected = true
            }
          });
        });
        if (_that.data.searchData.page!=0) {
            _that.setData({
              arrayData:_that.foramateArr(_that.data.arrayData.concat(res.data)),
              'selectType':res.data[0].selectType==1?false:true,
              isDataEnd:false
            })
        }else{
            _that.setData({
                arrayData:res.data,
                'selectType':res.data[0].selectType==1?false:true,
                isDataEnd:false
              })
        }
        if (res.data.length<100) {
            _that.setData({
                isDataEnd:true
            })
        }
      }else{
          _that.setData({
            isDataEnd:true
          })
      }
    //   console.log('二级顾客标签列表',res);
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  foramateArr(arr:any){
    let arr2 = arr.filter(function(element:any,index:any,self:any){      
        return self.indexOf(element) === index;
      });
    
    return arr2;
  },
  onLoad:function (options) {
    // console.log('-------aaaa',options);
    this.setData({
      custormDetail:options.custormDetail=='true'?true:false,
      custormDetailId:options.custormDetailId,
      'searchData.tagId':options.tagId
    })
    // console.log('----------bbbbbb',this.data.custormDetail);
    // this.getDataList()
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  save() {
    let _that = this,
    tagValueIds:any = []
    _that.data.arrayData.forEach((item:any)=>{
      if (item.checked) {
        tagValueIds.push(item.id)
      }
    })
    if (tagValueIds.length==0) {
      wx.showToast({
        title: '请选择笔记',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    util.request(api.batchSaveUserTagValueByUser,{
        'userId':Number(this.data.custormDetailId),
        'tagValueIds':tagValueIds
    },'POST').then(function (res:any) {
      if(res.data){
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        // console.log(pages.length)
        prevPage.setData({
            showtoast: true,
            isAddTags:false
        })
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
        
      }
    });
  },
  onReady() {

  },
  goSetLabel(e:any){
    wx.navigateTo({
      url: '../../customerLabelingProcess/setlabel/setlabel?id='+e.currentTarget.dataset.id+'&label='+e.currentTarget.dataset.label,
    })
  },
  changeColor(name:string,url:string,color='#EBEBEB',type='fill'){
    changeSvg.svgColor(url, color,type).then((res:any)=>{
      this.setData({[name]:res})
    })
  },
  checkboxChange: function (e:any) {
    // console.log('checkbox发生change事件，携带value值为：', e,e.detail.value);
    var checkboxItems = this.data.arrayData, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i]['checked'] = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i]['id'] == values[j]) {
          checkboxItems[i]['checked'] = true;
          break;
        }
      }
    }

    this.setData({
      arrayData: checkboxItems,
      [`formData.checkbox`]: e.detail.value
    });
    // console.log('改变了', this.data.arrayData);
  },
  radioChange(e: any) {
    // console.log('radio发生change事件，携带value值为：',e, e.currentTarget.dataset.index);
    this.data.arrayData.forEach((item:any,index:any) => {
        if (index == e.currentTarget.dataset.index) {
            item.checked = !this.data.arrayData[e.currentTarget.dataset.index]['checked']
        } else {
            item.checked = false
        }
    })
    this.setData({
        arrayData:this.data.arrayData
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
    console.log(indexAap.globalData.imageUrl);
    
    this.setData({
        themeColor:indexAap.globalData.themeColor
    })
    this.getDataList()
       this.changeColor('zuo2',this.data.zuo2,indexAap.globalData.themeColor || wx.getStorageSync("themeColor"))
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
        'searchData.page':0,
        'searchData.size':'100'
    })
    this.getDataList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (!this.data.isDataEnd) {//没有更多数据
        this.data.searchData.page++;
        this.getDataList()
    }
  }
})