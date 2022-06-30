// pages/userAnalysis/visitorsAnalysis/visitorsAnalysis.ts
let indexAap = getApp<IAppOption>();
var util = require('../../../../utils/util');
var api = require('../../../../config/api')
let chart:any  = null
let guide:any = null
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    themeColor: indexAap.globalData.themeColor,
    date:'2021年1月',
    httpDate:'202101',
    tabList:[{name:'全部顾客',type:''},{name:'老顾客',type:1},{name:'新顾客',type:2},{name:'注册顾客',type:3}],
    pageNumer:0,
    active:0,
    customNum:0,
    personList:[],
    selectItem:{name:'老顾客',type:1},
    noMore:false,
    loadding:false,
    lastDay:'',
    empty:false,
    onInitChart(F2: any, config:any) {
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
      const data =  [{
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
      chart.axis(false);
      chart.pieLabel({
        sidePadding: 10,
        label1: function label1(data, color) {
          return {
            text: data.count,
            fill: '#808080',
          };
        },
        label2: function label2(data) {
          return {
            text: data.name+'\n'+data.percent+'%',
            fill: '#808080',
            fontWeight: 'bold'
          };
        }
      });
      chart.interval().position('a*percent').color('name', ['#ffd700', '#00b5e2', '#7340b3']).adjust('stack').style({
        // lineWidth: 1,
        stroke: '#fff',
        lineJoin: 'round',
        lineCap: 'round'
      }).animate({
        appear: {
          duration: 1000,
          easing: 'bounceOut'
        }
      });
      // chart.interaction().position('date*value').adjust('stack');
      chart.render();
      // 注意：需要把chart return 出来
      return chart;
    },
   
  


  },
  changeTobs: function (event: any) {
    console.log(event)
    this.setData({ active: event.currentTarget.dataset.index,selectItem: event.currentTarget.dataset.item,pageNumer:0,personList:[] ,noMore:false,empty:false})
    this.getVisitorList();
  
  },
  getVisitorData() {
    util.request(api.visitor, {dateType:this.data.httpDate}).then((res: any) => {
      var array:Array<any> = []
      var sum = 0
      res.data.forEach(item => {
        sum+=item.numUserView
      })
      this.setData({customNum:util.toQfw(sum)})
      
      res.data.forEach(item => {
        var data:any = {}
        console.log(item); 
        data.count = item.numUserView;
        data.percent = Math.ceil(item.numUserView/sum*100);
        data.a = 1;
        switch(item.userType) {
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

      setTimeout(function(){
        chart.changeData(array)
        guide.content = util.toQfw(sum)+'\n人';
        guide.repaint();
      },1000)
    })


  },
  getVisitorList() {
    this.setData({loadding:true});

    var _this = this;
    util.request(api.visitorList, {dateType:this.data.httpDate,page:this.data.pageNumer,size:10,userType:this.data.selectItem.type}).then((res: any) => {
      if(_this.data.pageNumer==0&&res.data.length==0){
        _this.setData({loadding:false,empty:true,noMore:true})
      }
      res.data.forEach(item=>{
        item.lastViewTime = util.formatDateNoSecond(item.lastViewTime,false)

      })
      var list = this.data.personList.concat(res.data);
      _this.setData({personList:list,loadding:false})
      if(res.data.length<10){
        _this.setData({noMore:true})
      }
     
    })


  },

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
    this.getVisitorData();
    this.getVisitorList() 

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
    var page = this.data.pageNumer;
    if(this.data.noMore){
      return;
      
    }else{
      this.setData({pageNumer:page+1})
      this.getVisitorList();

    }


  },


  mounthChange(value:Object){
    console.log(value.detail)
    let date  = value.detail.value.replace('-','年')+'月'
    let httpDate  = value.detail.value.replace('-','')
    console.log(date)
    this.setData({date:date,httpDate:httpDate})



  },

})