// pages/customersStatistics/expense/expense.ts
var changeSvg2 = require('../../../../utils/changeThemeColor');
let recommendApp = getApp<IAppOption>();
var util = require('../../../../utils/util');
var api = require('../../../../config/api')
var componSvg = require('../../../../utils/changeThemeColor')
let chart: any = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderNumber:0,
    httpDate:'',
    totalNumber:0,
    lastDay:'',
    date:'',
    themeColor: recommendApp.globalData.themeColor,
    
    tabIndex:'',
    userList:[],
    page:0,
    tabList:[{name:'全部顾客',id:''},{name:'老顾客',id:'1'},{name:'新顾客',id:'2'},{name:'注册顾客',id:'3'},{name:'游客',id:'4'}],
    onInitChart(F2: any, config:any) {
      // config.PieLabel=PieLabel
        chart = new F2.Chart(config);
      chart.source([], {
        percent: {
          formatter: function formatter(val) {
            return val * 100 + '%';
          }
        }
      });
      chart.guide().text({
        top: {Boolean}, // 指定 guide 是否绘制在 canvas 最上层，默认为 true, 即绘制在最上层
        position: ['50%','50%'] ,// 文本的起始位置，值为原始数据值，支持 callback
        content: '顾客地域', // 显示的文本内容
        style: {
          fill: '#000', // 文本颜色
          fontSize: '18', // 文本大小
          fontWeight: 'bold' // 文本粗细
        }, // 文本的图形样式属性
        // offsetX: {Number}, // x 方向的偏移量
        // offsetY: {Number} // y 方向偏移量
      });
      // chart.legend({
      //   position: 'right',
      //   itemFormatter: function itemFormatter(val) {
      //     return val + '  ' + map[val];
      //   }
      // });

      chart.legend(false);
      chart.axis(false);
      chart.tooltip(false);
      chart.coord('polar', {
        transposed: true,
        radius: 1,
        innerRadius: 0.6,
      });
      chart.axis(false);
      chart.pieLabel({
        sidePadding: 10,
        label1: function label1(data, color) {
          return {
            text: data.name,
            fill: color
          };
        },
        label2: function label2(data) {
          return {
            text: data.percent+'%',
            fill: '#808080',
            fontWeight: 'bold'
          };
        }
      });
      chart.interval().position('a*percent').color('name', ['#2d8cf0', '#19be6b','#ff9900','#bbbec4']).adjust('stack').style({
        stroke: '#fff',
        lineJoin: 'round',
        lineCap: 'round'
      }).animate({
        appear: {
          duration: 1200,
          easing: 'bounceOut'
        }
      });
      // chart.interaction().position('date*value').adjust('stack');
      chart.render();
      // 注意：需要把chart return 出来
      return chart;
    }

  },
 

mounthChange(value: Object) {
  console.log(value.detail)
  wx.setStorageSync('date', value.detail.value);
  let date = value.detail.value.replace('-', '年') + '月'
  let httpDate = value.detail.value.replace('-', '')
  console.log(date)
  this.setData({ date: date, httpDate: httpDate })
  

},
toDetail(e){
  console.log(e.currentTarget.dataset.item);
  var item  = e.currentTarget.dataset.item
  console.log(item);
  wx.setStorageSync('userData',item);
  wx.navigateTo({url:'/packageRecommend/pages/customersStatistics/expenseDetail/expenseDetail?id='+item.userId+'&image='+item.userImage+'&name='+item.userName+'&amtSales='+item.amtSales})

},
tabChange(e){
  console.log(e.currentTarget.dataset.item.id);
  this.setData({tabIndex:e.currentTarget.dataset.item.id,userList:[],page:0,noMore:false,loadding:false})
  this.getUserList();

  

},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
  
    var day = new Date();
    var lastDay = new Date(day.getTime()-24*60*60*1000).getFullYear()+'年'+(new Date(day.getTime()-24*60*60*1000).getMonth()+1)+'月'+new Date(day.getTime()-24*60*60*1000).getDate()+'日';
    this.setData({lastDay:lastDay})
   
    this.getCustomerSale();
    this.getAreaSale();
    this.getUserList();

  },
  //顾客消费情况customerSale
  getCustomerSale() {
    util.request(api.customerSale, { dateType: this.data.httpDate }).then((res: any) => {
      this.setData({ orderNumber:util.toQfw(res.data.amtSales), totalNumber:util.toQfw( res.data.numItemTotalSale) })

      // setTimeout(function () {
      //   chart1.changeData(array)
      // }, 1000)
    })

  },
  //各地区消费情况
  getAreaSale() {
    util.request(api.areaSale, { dateType: this.data.httpDate }).then((res: any) => {
      var array: any = [];
      res.data.forEach(item => {
        array.push({ name: item.buyerProvince, percent: item.rateBuyerProvince })
      });
      console.log(array)
      setTimeout(function () {
        chart.changeData(array)
      }, 1000)
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
      recommendApp.globalData.themeColor=res;
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

  },
  //用户列表
  getUserList(){
    this.setData({loadding:true})
    util.request(api.payDetailUserList, { dateType: this.data.httpDate ,page:this.data.page,size:100}).then((res: any) => {
      console.log(res);
      this.setData({userList:res.data,loadding:false})
      if(res.data.length<10){
        this.setData({noMore:true})
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

  }
})