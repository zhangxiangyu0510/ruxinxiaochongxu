// pages/ucenter/commodityAnalysis/commodityAnalysis.ts
// F2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
// var container = document.createElement('div');

Page({

  changeTobs: function (event: any) {
    this.setData({ tabsIndex: event.currentTarget.dataset.item })
  },
  toDetailsPage: function () {
    wx.navigateTo({
      url: '/pages/ucenter/commodityDetails/commodityDetails',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    tabsIndex: 1,
    chartText: '',
    onInitChart(F2: any, config: any) {
      // config.PieLabel=PieLabel
      const chart = new F2.Chart(config);
      const data = [{
        name: '待检查',
        percent: 25,
        a: '1'
      },
      {
        name: '处理中',
        percent: 30,
        a: '1'
      },
      {
        name: '流转中',
        percent: 15,
        a: '1'
      },
      {
        name: '已结束',
        percent: 30,
        a: '1'
      }
      ];
      var map = {
        '待检查': ((25) * 100).toFixed(2) + '%',
        '处理中': ((30) * 100).toFixed(2) + '%',
        '流转中': ((15) * 100).toFixed(2) + '%',
        '已结束': ((30) * 100).toFixed(2) + '%',
      };
      chart.source(data, {
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

      chart.legend(false);
      chart.axis(false);
      chart.tooltip(false);
      chart.coord('polar', {
        transposed: true,
        radius: 1,
        innerRadius: 0.5,
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
            text: data.percent,
            fill: '#808080',
            fontWeight: 'bold'
          };
        },
        onClick: function onClick(ev) {
          console.log(ev.data)
          this.setData({ chartText: ev.data.name })
        }
      });
      chart.interval().position('a*percent').color('name', ['#2d8cf0', '#19be6b', '#ff9900', '#bbbec4']).adjust('stack').style({
        lineWidth: 1,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

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

  
})