// pages/customersStatistics/customersStatistics.ts
// var changeSvg2 = require('../../../utils/changeThemeColor');
let recommendApp = getApp<IAppOption>();
var util = require('../../../utils/util');
var api = require('../../../config/api')
// var componSvg = require('../../../utils/changeThemeColor')
let chart: any = null;


Page({
  data: {
    httpDate: '',
    orderNumber: 0,
    totalNumber: 0,
    lastDay:'',
    addNoPayGoods:0,
    addNoPayUser:0,
    firstBuy:0,
   
    themeColor: recommendApp.globalData.themeColor,
    onInitChart(F2: any, config: any) {
      
      // config.PieLabel=PieLabel
      chart = new F2.Chart(config);
      chart.source([], {
        percent: {
          formatter: function formatter(val) {
            return val * 100 + '%';
          }
        }
      });
      chart.legend(false);
      chart.axis(false);
      chart.tooltip(false);
      chart.coord('polar', {
        transposed: true,
        radius: 1,
        innerRadius: 0.6,
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
      chart.interval().position('a*percent').color('name', ['#ffd700', '#00b5e2', '#7340b3' ,'#00b5e2', '#7340b3']).adjust('stack').style({
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
      chart.render();
      // 注意：需要把chart return 出来
      return chart;
    },
    onInitChart1(F2, config) {
      // const container = document.getElementById('container');
      // container.className = 'guage';

      const {
        Shape,
        G,
        Util,
        Global
      } = F2;
      const Vector2 = G.Vector2;

      // 注册自定义Shape, 极坐标下带圆角的条形，只对极坐标生效
      Shape.registerShape('interval', 'polar-tick', {
        draw: function draw(cfg, container) {
          const points = this.parsePoints(cfg.points);
          const style = Util.mix({
            stroke: cfg.color
          }, Global.shape.interval, cfg.style);

          let newPoints = points.slice(0);
          if (this._coord.transposed) {
            newPoints = [points[0], points[3], points[2], points[1]];
          }

          const center = cfg.center;
          const x = center.x,
            y = center.y;


          const v = [1, 0];
          const v0 = [newPoints[0].x - x, newPoints[0].y - y];
          const v1 = [newPoints[1].x - x, newPoints[1].y - y];
          const v2 = [newPoints[2].x - x, newPoints[2].y - y];

          let startAngle = Vector2.angleTo(v, v1);
          let endAngle = Vector2.angleTo(v, v2);
          const r0 = Vector2.length(v0);
          const r = Vector2.length(v1);

          if (startAngle >= 1.5 * Math.PI) {
            startAngle = startAngle - 2 * Math.PI;
          }

          if (endAngle >= 1.5 * Math.PI) {
            endAngle = endAngle - 2 * Math.PI;
          }

          const lineWidth = r - r0;
          const newRadius = r - lineWidth / 2;

          return container.addShape('Arc', {
            className: 'interval',
            attrs: Util.mix({
              x: 160,
              y: 50,
              startAngle,
              endAngle,
              r: newRadius,
              lineWidth,
              lineCap: 'round'
            }, style)
          });
        }
      });

      const data = [{
        const: 'a',
        actual: 100,
        expect: 50
      }];

      // 创建图表
      const chart = new F2.Chart(config);
      chart.source(data, {
        actual: {
          max: 100,
          min: 0,
          nice: false
        }
      });

      // 设定极坐标系
      chart.coord('polar', {
        transposed: true,
        innerRadius: 0.8,
        startAngle: -Math.PI,
        endAngle: 0
      });
      chart.axis(false);

      // 绘制两个条形，分别作为背景和实际的百分比进度。
      chart.interval()
        .position('const*actual')
        // .shape('polar-tick')
        .size(20)
        .color('#234554')
        .animate({
          appear: {
            duration: 1100,
            easing: 'linear',
            animation: function animation(shape, animateCfg) {
              const startAngle = shape.attr('startAngle');
              let endAngle = shape.attr('endAngle');
              if (startAngle > endAngle) {
                endAngle += Math.PI * 2;
              }
              shape.attr('endAngle', startAngle);
              shape.animate().to(Util.mix({
                attrs: {
                  endAngle
                }
              }, animateCfg)).onUpdate(function (frame) {
              });
            }
          }
        });
      chart.render();
      return chart

    }
  },
  mounthChange(value: Object) {
    console.log(value)
    wx.setStorageSync('date', value.detail.value);
    let date = value.detail.value.replace('-', '年') + '月'
    let httpDate = value.detail.value.replace('-', '')
    console.log(date)
    this.setData({ date: date, httpDate: httpDate })

  },
  


  /**
   * 页面的初始数据
   */


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var day = new Date();
    var lastDay = new Date(day.getTime()-24*60*60*1000).getFullYear()+'年'+(new Date(day.getTime()-24*60*60*1000).getMonth()+1)+'月'+new Date(day.getTime()-24*60*60*1000).getDate()+'日';
    this.setData({lastDay:lastDay})
   
   

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  //顾客消费情况customerSale
  getCustomerSale() {
    util.request(api.customerSale, { dateType: this.data.httpDate }).then((res: any) => {
      this.setData({ orderNumber:util.toQfw(res.data.amtSales), totalNumber: util.toQfw(res.data.numItemTotalSale) })

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
        array.push({ name: item.buyerProvince, percent: item.rateBuyerProvince,a:1})
      });
      console.log(array)
      setTimeout(function () {

        chart.changeData(array)
      }, 1000)
    })

  },//addNoPayAndfirstSales
  //获取采购未下单及首次购买商品
  getAddNoPayAndFirstSales(){
    util.request(api.addNoPayAndfirstSales, {}).then((res: any) => {
     console.log(res)
     this.setData({addNoPayGoods:util.toQfw(res.data.numAddcartNotPayItems),addNoPayUser:util.toQfw(res.data.numAddcartNotPayUsers),firstBuy:util.toQfw(res.data.numFisrtTimeBuyItems)})
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
    this.getCustomerSale();
    this.getAreaSale();
    this.getAddNoPayAndFirstSales();

  },
  toExpense(){
    wx.navigateTo({url:'/packageRecommend/pages/customersStatistics/expense/expense'})
  },
  toGoodsUser(){
    wx.navigateTo({url:'/packageRecommend/pages/customersStatistics/goodsUser/goodsUser'})

  },
  toFirstGoods(){
    wx.navigateTo({url:'/packageRecommend/pages/customersStatistics/firstBuy/firstBuy'})


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