// pages/customersStatistics/expenseDetail/expenseDetail.ts
// var changeSvg = require('../../../../utils/changeThemeColor');
let recommendApp = getApp<IAppOption>();
var util = require('../../../../utils/util');
var api = require('../../../../config/api')
// var componSvg = require('../../../../utils/changeThemeColor')
let chart:any=null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    themeColor: recommendApp.globalData.themeColor,
    httpDate: '',
    name:'',
    monthPay:'',
    item:{},
    image:'',
    id: 0,
    price:0,
    goodsList:[],
    onInitChart(F2: any, config: any) {
      chart = new F2.Chart(config);
      chart.coord({
        transposed: true
      });
      chart.legend(false);
      chart.interval().position(['population','year']).color('population').adjust({
        type: 'dodge',
        marginRatio: 1/2
      });
         // 配置month轴
         chart.axis("population", {
          line: {
            lineWidth: 1,
            stroke: '#ccc',
            top: true
          },})
          chart.axis("year", {
            label:{
              
            }
           })
      chart.render();
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
              y: 110,
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
        expect: 100
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
        .size(25)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    var day = new Date();
    var lastDay = new Date(day.getTime() - 24 * 60 * 60 * 1000).getFullYear() + '年' + (new Date(day.getTime() - 24 * 60 * 60 * 1000).getMonth() + 1) + '月' + new Date(day.getTime() - 24 * 60 * 60 * 1000).getDate() + '日';
    this.setData({ lastDay: lastDay })
    var d = new Date();
    d = util.formatDateNoSecond(d, true)
    var date = d.replace('-', '年') + '月';
    var httpDate = d.replace('-', '');
    wx.setStorageSync('date', d);
    console.log(date)
    this.setData({ date: date, httpDate: httpDate })
    console.log(option)
    this.setData({ id: option.id,name:option.name,image:option.image,monthPay:option.amtSales})
    this.getUserHobby();
    this.getPayGoods();
   
    console.log(wx.getStorageSync('userData'))
    var data = wx.getStorageSync('userData');
    data.lastOrderTime = util.formatDateNoSecond(data.lastOrderTime, false)
    data.numOrder = util.toQfw(data.numOrder);
    data.amtSales = util.toQfw(data.amtSales);
    data.amtSalesLastHalfYear = util.toQfw(data.amtSalesLastHalfYear);
    data.numOrderLastHalfYear = util.toQfw(data.numOrderLastHalfYear);
    console.log(data);
    this.setData({item:data});

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

  },
  //获取用户消费产品列表payGoods
  getPayGoods(){
      util.request(api.payGoods, { dateType: this.data.httpDate,userId:this.data.id,page:0,size:10}).then((res: any) => {
        console.log(res);
        res.data.numItemSales = util.toQfw(res.data.numItemSales)
        res.data.amtItemSales = util.toQfw(res.data.amtItemSales)
        this.setData({goodsList:res.data})
       
       
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
  //获取用户偏好
  getUserHobby(){
    util.request(api.userHobby, { dateType: this.data.httpDate,userId:this.data.id}).then((res: any) => {
      console.log(res);
      var array = [];
     res.data.forEach(item => {
       array.push({year:item.amtSales,population:item.itemCategoryName})

       
     });
     console.log(array)
     chart.changeData(array)
     
     
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  }
})