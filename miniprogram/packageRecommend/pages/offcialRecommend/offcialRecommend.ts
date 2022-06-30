// pages/recommend/offcialRecommend/offcialRecommend.ts
var changeSvg2 = require('../../../utils/changeThemeColor');
let recommendApp = getApp<IAppOption>();
var util = require('../../../utils/util');
var api = require('../../../config/api')
var componSvg = require('../../../utils/changeThemeColor')
import { EventBusInstance } from '../../../utils/eventBus'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    offList:[],
    themeColor: recommendApp.globalData.themeColor,
    selectList:[],
    selectNumber:[],
    check:false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
 
  onLoad() {
    this.getOfficalList();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  goH5Detail(e:any){
    // console.log('right,e======',e);
    console.log(e.currentTarget.dataset)
    let addAgruments = {
     catalogId: e.currentTarget.dataset.item.itemInfo.catalogId,
     itemId: e.currentTarget.dataset.item.itemInfo.itemId,
     itemType: e.currentTarget.dataset.item.itemInfo.itemType
   };
   let params = Object.assign({}, addAgruments, util.getCommonArguments());
   wx.navigateTo({
     url: '/pages/customPage/index?url='+recommendApp.globalData.h5DetailUrl+'productDetail&params=' + encodeURIComponent(JSON.stringify(params))
   })

 },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    util.getThemeColor().then((res: any) => {
      console.log('123456789', res);
      wx.setStorageSync('themeColor', res);
      console.log('此时缓存里的主题色======', wx.getStorageSync('themeColor'))
      recommendApp.globalData.themeColor=res;
        
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
  getOfficalList(){

    var _this = this;
    var recommendList:any =[]
    let _userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    util.request(api.recommendationList, { shop_id: _userInfo.shop ? _userInfo.shop.id : 30 }).then((res: any) => {
      if (res.data.searchShopProductDtos && res.data.searchShopProductDtos.length > 0) {
        
        res.data.searchShopProductDtos.forEach((item) => {
          recommendList.push(item.itemInfo.itemId)
          
        });



      }
    })
    util.request(api.recommendationAll, {},'get').then((res: any) => {
      console.log('hhhhah',res)

      res.data.sort((a,b)=>{ return a.sequence-b.sequence})
      let arr  =res.data.filter(item=>{
        return item.itemInfo&&!recommendList.includes(item.itemInfo.itemId);
      })
     

      
      _this.setData({offList:arr})
      // if(res.data){
        // wx.navigateTo({url:'/packageRecommend/pages/offcialRecommend/offcialRecommend'})
      // }
    })

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    

  },
  getGuide(){
    var _this = this
    var partnerId = JSON.parse(wx.getStorageSync('userInfo')).shop.partnerId;
    util.request(api.isTipsGuide,{type:1,partner_id:partnerId},
      'get').then(function (res: any) {
        console.log(res)
        if(res.data){
          wx.setStorageSync('back',false);
          wx.navigateTo({
            url: '/packageRecommend/pages/firstTip/firstTip',
          })
        }else{
          wx.navigateTo({
            url: '/packageRecommend/pages/singleRecommend/singleRecommend'
          })
        }
      }).catch(() => {
       
  
      })
  },
  toRecommend(){
    this.getGuide()
    // wx.navigateTo({url:'/packageRecommend/pages/singleRecommend/singleRecommend'})
    // wx.redirectTo({
    //   url: '/packageRecommend/pages/singleRecommend/singleRecommend'
    // })
    

  },
  check(e:any){
    console.log(e);
    console.log(e.currentTarget.dataset.item);
    var arr:any = this.data.selectList;
    var num:Array<number>  = this.data.selectNumber;
    var item = e.currentTarget.dataset.item;
    if(arr.length==0){
      arr.push({productId:item.itemInfo.itemId,check:true,title:item.itemInfo.itemName,image:item.itemInfo.itemImage,productCode:item.itemInfo.itemCode,productCatalogId:item.itemInfo.catalogId,productCatalogName:item.itemInfo.catalogName})
      num.push(item.id);
      console.log(num)
    }else{
      if(num.indexOf(item.id)>-1){
        var index = num.indexOf(item.id)
        console.log(index,'#####')

        arr.splice(index,1);
        num.splice(index,1);
      }else{
        arr.push({productId:item.itemInfo.itemId,check:true,title:item.itemInfo.itemName,image:item.itemInfo.itemImage,productCode:item.itemInfo.itemCode,productCatalogId:item.itemInfo.catalogId,productCatalogName:item.itemInfo.catalogName});
        num.push(item.id)
      }
   
  }
    this.setData({selectList:arr})
    this.setData({selectNumber:num})
    console.log(arr,num,'$$$$');
    console.log(this.data.selectNumber.length,this.data.offList.length,'KKKKK')
    if(this.data.selectNumber.length<this.data.offList.length){
      this.setData({check:false})
    }else{
      this.setData({check:true})
    }


  },
  putRecommend(){
    wx.showLoading({title:'加载中'})
    if(this.data.selectNumber.length<=0){
      wx.showToast({
        title: '请选择商品',
        icon: 'error',
        duration: 2000
      })
      return;
      
    }
    var array:Array<any> = []
    this.data.selectList.forEach((item:any,index)=>{
      array.push({...item,sequence:index+1})


    })

    
    util.request(api.recommend,array,'post').then((res: any) => {
      wx.hideLoading();
      setTimeout(function(){
        wx.showToast({
          title: '推荐成功',
          icon: 'success',
          duration: 2000
        })
         
      },300)
   
      // wx.navigateTo({
      //   url: '/packageRecommend/pages/myRecommend/myRecommend'
      // })
      // wx.navigateBack({
      //   delta:1
      // })
      wx.redirectTo({
        url: '/packageRecommend/pages/myRecommend/myRecommend'
      })

      })
      

  },
  selectAll(){
    var list = this.data.offList;
    var arr:Array<object>=[];
    var _this = this;
    var num:Array<number>=[]
    var arr1:Array<object> = []
    
    list.forEach((item:any) => {
      if(_this.data.check){
      
        arr.push({...item,check:false});
        
        
      }else{
        num.push(item.id)
        arr.push({...item,check:true});
        arr1.push({productId:item.itemInfo.itemId,title:item.itemInfo.itemName,image:item.itemInfo.itemImage,officialRecommendationId:item.id,productCode:item.itemInfo.itemCode,productCatalogId:item.itemInfo.catalogId,productCatalogName:item.itemInfo.catalogName,});
      }
    });
    console.log(arr)
      this.setData({selectNumber:num});
    this.setData({offList:arr,check:!this.data.check});
    this.setData({selectList:arr1});
   
    

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