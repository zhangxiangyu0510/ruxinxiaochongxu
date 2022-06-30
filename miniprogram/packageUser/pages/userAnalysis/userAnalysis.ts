// packageUser/pages/userAnalysis/userAnalysis.ts
// var  = require('../../../utils/changeThemeColor');
let recommendApp = getApp<IAppOption>();
var util = require('../../../utils/util');
var api = require('../../../config/api')
// var componSvg = require('../../../utils/changeThemeColor')
let chart: any = null;
let chart1: any = null;
let guide:any = null;
let guide1:any = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeColor: recommendApp.globalData.themeColor,
    date: '2021年01月',
    httpDate: '202101',
    shopView: 0,
    goodsView: 0,
    customNum:0,
    customNum1:0,
    lastDay:'',

    onInitChart(F2: any, config: any) {
      // config.PieLabel=PieLabel
      chart = new F2.Chart({...config,padding:0});
      guide = chart.guide().text({
        position: [ '50%', '50%' ],
        content: '',
        style:{
          fontSize:16,
          fill:'#333',
          fontWeight:500
        }
      });
 
      chart.source([], {
        percent: {
          formatter: function formatter(val) {
            return val * 100 + '%';
          }
        }
      });

      chart.legend(false);
      chart.axis(false);
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
            text: data.count,
          };
        },
        label2: function label2(data) {
          return {
            text:data.name+ '\n'+ data.percent+'%' ,
            fill: '#808080',
            fontWeight: 'bold'
          };
        },
     
      });
      chart.interval().position('a*percent').color('name', ['#ffd700', '#00b5e2', '#7340b3',]).adjust('stack').style({
        // lineWidth: 1,
        stroke: '#fff',
        lineJoin: 'round',
        lineCap: 'round'
      }).animate({
        appear: {
          duration: 1200,
          easing: 'bounceOut'
        }
      });
      chart.render();
      return chart;
    },

    onInitChart1(F2: any, config: any) {
      // config.PieLabel=PieLabel
      chart1 = new F2.Chart({...config,padding:0});
      guide1 = chart1.guide().text({
        position: [ '50%', '50%' ],
        content: '',
        style:{
          fontSize:16,
          fill:'#333',
          fontWeight:500
        }
      });


      chart1.source([], {
        percent: {
          formatter: function formatter(val) {
            return val * 100 + '%';
          }
        }
      });
      // chart.legend({
      //   position: 'right',
      //   itemFormatter: function itemFormatter(val) {
      //     return val + '  ' + map[val];
      //   }
      // });

      chart1.legend(false);
      chart1.axis(false);
      chart1.tooltip(false);
      chart1.coord('polar', {
        transposed: true,
        radius: 1,
        innerRadius: 0.6,
      });
      chart1.axis(false);
      chart1.pieLabel({
        sidePadding: 10,
        label1: function label1(data, color) {
          return {
            text: data.count,
          };
        },
        label2: function label2(data) {
          return {
            text:data.name+'\n'+ data.percent+'%',
            fill: '#808080',
            fontWeight: 'bold'
          };
        }
      });
      chart1.interval().position('a*percent').color('name', ['#ffd700', '#00b5e2', '#7340b3', '#7340b3']).adjust('stack').style({
        // lineWidth: 1,
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
      chart1.render();
      // 注意：需要把chart return 出来
      return chart1;
    },

  },
  getVisitorData() {
    util.request(api.visitor, { dateType: this.data.httpDate }).then((res: any) => {
      var array: Array<any> = []
      var sum = 0
      res.data.forEach(item => {
        sum += item.numUserView
      })
      
     

      res.data.forEach(item => {
        var data: any = {}
        console.log(item);
        data.count = util.toQfw(item.numUserView);
        data.percent = Math.ceil(item.numUserView / sum * 100) ;
        data.a = 1;
        switch (item.userType) {
          case 1:
            data.name = '老顾客'
            break;
          case 2:
            data.name = '新顾客'
            break;
          case 3:
            data.name = '注册顾客'
            break;

          default:
            return;
        }
        console.log(array)
        array.push(data);
      });
    var _this = this
      setTimeout(function () {
        _this.setData({customNum:util.toQfw(sum)})

        chart.changeData(array)
        guide.content = util.toQfw(sum)+'\n人';
        guide.repaint();
      }, 1000)
    })


  },
  getFansType() {

    util.request(api.fansType, { dateType: this.data.httpDate }).then((res: any) => {
      var array: Array<any> = []
      var sum = 0
      res.data.forEach(item => {
        sum += item.numUserView
      })
      
      

      res.data.forEach(item => {
        var data: any = {}
        console.log(item);
        data.count = util.toQfw(item.numUserView);
        data.percent = Math.ceil(item.numUserView / sum * 100)
        data.a = 1;
        switch (item.userType) {
          case 1:
            data.name = '老顾客'
            break;
          case 2:
            data.name = '新顾客'
            break;
          case 3:
            data.name = '注册顾客'
            break;

          default:
            return;
        }
        array.push(data);
      });
      console.log(array)

      var _this = this
      setTimeout(function () {
        _this.setData({customNum1:util.toQfw(sum)})
        chart1.changeData(array)
        guide1.content = util.toQfw(sum)+'\n人';
        guide1.repaint();
      }, 1000)
    })


  },
  getBroswerAll() {
    let _this = this;

    util.request(api.broswerAll, { dateType: this.data.httpDate }).then((res: any) => {
      console.log(res)
      _this.setData({ shopView: util.toQfw(res.data.cntShopView), goodsView: util.toQfw(res.data.cntItemsView) })

    })


  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var d = new Date();
    var lastDay = new Date(d.getTime()-24*60*60*1000).getFullYear()+'年'+(new Date(d.getTime()-24*60*60*1000).getMonth()+1)+'月'+new Date(d.getTime()-24*60*60*1000).getDate()+'日';
    this.setData({lastDay:lastDay})
    console.log(lastDay);
    

    this.getVisitorData();
    this.getFansType();
    this.getBroswerAll();

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
      this.data.themeColor = res;
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
    this.getVisitorData();
    this.getFansType();
    this.getBroswerAll();


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
  toVisitorDetail() {
    wx.navigateTo({ url: '/packageUser/pages/userAnalysis/visitorsAnalysis/visitorsAnalysis' })

  },
  toFansDetail() {
    console.log('####')
    wx.navigateTo({ url: '/packageUser/pages/userAnalysis/fansAnalysis/fansAnalysis' })
  },
  toBrowseDetail() {
    wx.navigateTo({ url: '/packageUser/pages/userAnalysis/browseAnalysis/browseAnalysis' })

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

  mounthChange(value: Object) {
    console.log(value.detail)
    wx.setStorageSync('date', value.detail.value);
    let date = value.detail.value.replace('-', '年') + '月'
    let httpDate = value.detail.value.replace('-', '')
    console.log(date)
    this.setData({ date: date, httpDate: httpDate })
    this.getVisitorData();
    this.getFansType();
    this.getBroswerAll();

  }
})