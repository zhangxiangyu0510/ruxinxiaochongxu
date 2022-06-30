// packageUser/pages/userAnalysis/browseAnalysis/browseAnalysis.ts
let indexAap = getApp<IAppOption>();
var util = require('../../../../utils/util');
var api = require('../../../../config/api')
// var changeSvg = require('../../../../utils/changeThemeColor')
let chart:any = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeColor: indexAap.globalData.themeColor,
    active:1,
    lastDay:'',
    date:'2021年1月',
    httpDate:'202101',
    pageNumber:0,
    personList:[],
    goodsPersonList:[],
    loadding:false,
    nomore:false,
    onInitChart(F2: any, config:any) {
   
      chart = new F2.Chart(config);
    
      chart.source([], {
        value: {
          tickInterval: 20
        }
      });
      chart.coord({
        transposed: true
      });
    
      chart.tooltip({
        custom: true, // 自定义 tooltip 内容框
      });
      chart.axis({
        label(data:any){
          return {
            text: data.label,
            // fill: '#808080',
            textAlign:'end'
          };
        }
      });
      chart.interval().position(['label','value']).color('type',['#0DB9E2','#7A4AB7']).size('type',[20,20]).adjust({
        type: 'dodge',
        marginRatio: 1/2
      });
      chart.render();
      return chart;
      
      // 注意：需要把chart return 出来
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var day = new Date();
    var lastDay = new Date(day.getTime()-24*60*60*1000).getFullYear()+'年'+(new Date(day.getTime()-24*60*60*1000).getMonth()+1)+'月'+new Date(day.getTime()-24*60*60*1000).getDate()+'日';
    this.setData({lastDay:lastDay})
    
 

  },
  getBroswerAll() {
    let _this = this;
    util.request(api.broswerAll, { dateType: this.data.httpDate }).then((res: any) => {
      console.log(res)
      var array:any = [];
      _this.setData({ shopView: util.toQfw(res.data.cntShopView), goodsView: util.toQfw(res.data.cntItemsView) })
      if(res.data.cntFirstWeekItemView){
        array.push({label:'第一周',type:'店铺浏览',value:res.data.cntFirstWeekItemView})
        array.push({label:'第一周',type:'商品浏览',value:res.data.cntFirstWeekShopView})
      
        array.push({label:'第一周',type:'店铺浏览',value:res.data.cntFirstWeekItemView})
        array.push({label:'第一周',type:'商品浏览',value:res.data.cntFirstWeekShopView})
      }
      if(res.data.cntSecondWeekShopView){
        array.push({label:'第二周',type:'店铺浏览',value:res.data.cntSecondWeekShopView})
        array.push({label:'第二周',type:'商品浏览',value:res.data.cntSecondWeekItemView})

      }
      if(res.data.cntThirdWeekItemView){
        array.push({label:'第三周',type:'店铺浏览',value:res.data.cntThirdWeekItemView})
        array.push({label:'第三周',type:'商品浏览',value:res.data.cntThirdWeekShopView})

      }
      if(res.data.cntFourWeekItemView){
        array.push({label:'第一周',type:'店铺浏览',value:res.data.cntFourWeekShopView})
        array.push({label:'第一周',type:'商品浏览',value:res.data.cntFourWeekItemView})

      }
      setTimeout(function () {
        chart.changeData(array)
      }, 1000)
      


    })


  },
  getShopPerson(){
    this.setData({loadding:true,nomore:false})
    var _this = this
    util.request(api.shopPerson, { dateType: this.data.httpDate,page:this.data.pageNumber,size:10 }).then((res: any) => { 
      if(_this.data.pageNumber==0&&res.data.length==0){
      _this.setData({loadding:false,empty:true,nomore:true})
    }
      res.data.forEach(item=>{
        item.lastViewTime = util.formatDateNoSecond(item.lastViewTime,false)

      })
      if(res.data.length<10){
        _this.setData({nomore:true})
      }
      _this.setData({personList:res.data,loadding:false});
    


    })

  },
  getGoodsPerson(){
    this.setData({loadding:true,nomore:false})
    var _this = this;
    util.request(api.goodsPerson, { dateType: this.data.httpDate,page:this.data.pageNumber,size:10  }).then((res: any) => {
      _this.setData({goodsPersonList:res.data,loadding:false})
      if(_this.data.pageNumber==0&&res.data.length==0){
        _this.setData({empty:true})
      }else if(res.data.length<10){
        this.setData({nomore:true})
      }

      


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
      indexAap.globalData.themeColor=res;
      this.setData({themeColor:res})
        
    })
    if(wx.getStorageSync('date')){
      var httpDate = wx.getStorageSync('date');
      var date = httpDate.replace('-', '年') + '月';
      this.setData({ date: date, httpDate: httpDate })
    }else{
      var d = new Date();
      d = util.formatDateNoSecond(d, true)
      var date = d.replace('-', '年') + '月';
      var httpDate = d.replace('-', '');
      wx.setStorageSync('date', d);
      console.log(date)
      this.setData({ date: date, httpDate: httpDate })
    }
    this.getBroswerAll();
    this.getShopPerson();

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
    if(this.data.active==1){
      this.getShopPerson();
    }else{
      this.getGoodsPerson();
    }

  },

  
  changeActive(e:any){
    this.setData({active:e.currentTarget.dataset.active,nomore:false,loadding:false,empty:false})
    if(e.currentTarget.dataset.active==2){
      this.getGoodsPerson();

    }else{
      this.getShopPerson();

    }

  },
  mounthChange(value:Object){
    console.log(value.detail)
    let date  = value.detail.value.replace('-','年')+'月'
    console.log(date)
    this.setData({date:date})

  }
})