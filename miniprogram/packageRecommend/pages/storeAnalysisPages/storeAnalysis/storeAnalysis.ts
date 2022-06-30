// packageRecommend/pages/storeAnalysis/storeAnalysis.ts
const storeAnalysisApp = getApp<IAppOption>();
var api = require('../../../../config/api')
var util = require('../../../../utils/util');
import { svgColor } from "../../../../utils/changeThemeColor";
var chart:any = null
var chart1:any = null
Page({

  /**
   * 页面的初始数据
   */
//   ：1-老PC、2-新PC、3-RC、4-Q用户
  data: {
    typeData:{
        1:"老顾客",
        2:"新顾客",
        3:"注册顾客",
        4:"Q用户",
    },
    // opts:{
    //     onInitChart: null
    // },
    onInitChart1(F2: any, config:any) {
        console.log(F2, config,"uuuuuuuuuuuuuuuuuuuuuuu");
        // config.PieLabel=PieLabel
        chart = new F2.Chart({...config});
        let lastClickedShape:any;
        chart.source([], {
          percent: {
            formatter: function formatter(val:any) {
              return val * 100 + '%';
            }
          }
        });
        // chart1.legend({
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
          radius: 0.7,
          innerRadius: 0.5,
        });
        chart.axis(false);
        chart.pieLabel({
          sidePadding: 10,
          label1: function label1(data:any, color:string) {
            return {
              text: data.numBuyer ,
              fill: '#808080'
            };
          },
          label2: function label2(data:any, color:string) {
            return {
              text: data.name+'\n'+data.percent*100+'%',
              fill: '#808080'
            };
          },
          onClick:(data:any) => {
            const dataValue = data&&data.data&&data.data.name;
            const geom = chart.get('geoms')[0];
            const shapes = geom.get('shapes'); // 只有带精细动画的 geom 才有 shapes 这个属性
            var clickedShape:any;
            shapes.forEach((element:any) => {
                const origin = element.get('origin');
                console.log(element,element.get('origin'),"vvvvv");
                if (origin && origin.name === dataValue) {
                  clickedShape = element;
                }
            });
            if (lastClickedShape) {
                lastClickedShape.animate().to({
                  attrs: {
                    lineWidth: 0,
                    stroke: '#fff',
                    lineJoin: 'round',
                    lineCap: 'round'
                  },
                  duration: 200
                }).onStart(() => {
                //   if (lastClickedShape.label) {
                //     lastClickedShape.label.hide();
                //   }
                }).onEnd(() => {
                  lastClickedShape.set('selected', false);
                });
            }
            if(!clickedShape)return
            if (clickedShape.get('selected')) {
                clickedShape.animate().to({
                    attrs: {
                        lineWidth: 0
                    },
                    duration: 200
                }).onStart(() => {
                // if (clickedShape.label) {
                //     clickedShape.label.hide();
                // }
                }).onEnd(() => {
                clickedShape.set('selected', false);
                });
            }else{
            const color = clickedShape.attr('fill');
            clickedShape.animate().to({
                attrs: {
                  lineWidth: 8
                },
                duration: 350,
                easing: 'bounceOut'
              }).onStart(() => {
                clickedShape.attr('stroke', color);
                clickedShape.set('zIndex', 1);
              }).onEnd(() => {
                clickedShape.set('selected', true);
                clickedShape.set('zIndex', 0);
                lastClickedShape = clickedShape;
              });
            }
          }
        });
        chart.interval().position('a*percent').color('name', ['#2d8cf0', '#19be6b','#ff9900','#bbbec4']).adjust('stack').style({
        //   lineWidth: 1,
        //   stroke: '#fff',
        //   lineJoin: 'round',
        //   lineCap: 'round'
        }).animate({
          appear: {
            duration: 1200,
            easing: 'bounceOut'
          }
        });
        // chart.guide().text({
        //   position: ['50%', '50%'],
        //   content: '12,345\n人',
        //   style: {
        //     fontSize: 14
        //   }
        // });
        chart.render();
        // 注意：需要把chart return 出来
        return chart;
    },
    onInitChart2(F2: any, config:any) {
        // config.PieLabel=PieLabel
        chart1 = new F2.Chart({...config});
        let lastClickedShape2:any;
      chart1.source([], {
          percent: {
            formatter: function formatter(val:any) {
              return val * 100 + '%';
            }
          }
        });
        // chart1.legend({
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
          radius: 0.7,
          innerRadius: 0.5,
        });
        chart1.axis(false);
        chart1.pieLabel({
          sidePadding: 10,
          label1: function label1(data:any, color:string) {
            return {
              text: data.name,
              fill: color
            };
          },
          label2: function label2(data:any) {
            return {
                text: data.name+'\n'+data.percent*100+'%',
                fill: '#808080'
              };
            // return {
            //   text: data.percent,
            //   fill: '#808080',
            //   fontWeight: 'bold'
            // };
          },
          onClick:(data:any) => {
            const dataValue = data&&data.data&&data.data.name;
            const geom = chart1.get('geoms')[0];
            const shapes = geom.get('shapes'); // 只有带精细动画的 geom 才有 shapes 这个属性
            var clickedShape:any;
            shapes.forEach((element:any) => {
                const origin = element.get('origin');
                console.log(element,element.get('origin'),"vvvvv");
                if (origin && origin.name === dataValue) {
                  clickedShape = element;
                }
            });
            if (lastClickedShape2) {
                lastClickedShape2.animate().to({
                  attrs: {
                    lineWidth: 0
                  },
                  duration: 200
                }).onStart(() => {
                //   if (lastClickedShape.label) {
                //     lastClickedShape.label.hide();
                //   }
                }).onEnd(() => {
                  lastClickedShape2.set('selected', false);
                });
            }
            if(!clickedShape)return
            if (clickedShape.get('selected')) {
                clickedShape.animate().to({
                    attrs: {
                        lineWidth: 0
                    },
                    duration: 200
                }).onStart(() => {
                // if (clickedShape.label) {
                //     clickedShape.label.hide();
                // }
                }).onEnd(() => {
                clickedShape.set('selected', false);
                });
            }else{
            const color = clickedShape.attr('fill');
            clickedShape.animate().to({
                attrs: {
                  lineWidth: 8
                },
                duration: 350,
                easing: 'bounceOut'
              }).onStart(() => {
                clickedShape.attr('stroke', color);
                clickedShape.set('zIndex', 1);
              }).onEnd(() => {
                clickedShape.set('selected', true);
                clickedShape.set('zIndex', 0);
                lastClickedShape2 = clickedShape;
              });
            }
          }
        });
        chart1.interval().position('a*percent').color('name', ['#2d8cf0', '#19be6b','#ff9900','#bbbec4']).adjust('stack').style({
        //   lineWidth: 1,
        //   stroke: '#fff',
        //   lineJoin: 'round',
        //   lineCap: 'round'
        }).animate({
          appear: {
            duration: 1200,
            easing: 'bounceOut'
          }
        });
        // chart1.guide().text({
        //   position: ['50%', '50%'],
        //   content: '12,345\n人',
        //   style: {
        //     fontSize: 14
        //   }
        // });
        chart1.render();
        // 注意：需要把chart return 出来
        return chart1;
    },
    progress:0,
    themeColor:storeAnalysisApp.globalData.themeColor,
    storeAnalysisData:{},
    buyArrData : [{
        userType: '老PC粉丝',
        numBuyer: 25,
        a: '1'
      },
      {
        userType: 'Q粉丝',
        numBuyer: 25,
        a: '1'
      },
      {
        userType: '流转中',
        numBuyer: 25,
        a: '1'
      },
      {
        userType: '已结束',
        numBuyer: 25,
        a: '1'
      }
    ],
    changeYear:'',
    changeMonth:'',
    currentDate:'',
    arrowUpIcon:"/packageRecommend/images/arrowUp.svg",
    value1:0,
    value2:0,
  },
  
  mounthChange(e:any){
      console.log(e);
      
    this.setData({
        changeYear:e.detail.value.split("-")[0],
        changeMonth:e.detail.value.split("-")[1]
    })
    this.getShopAnalysisList()
    this.getBuyerInfo()
    this.getFans_info()
  },
  toOrderAmountPage(){
    wx.navigateTo({
      url:"/packageRecommend/pages/storeAnalysisPages/orderAmount/orderAmount"
    })
  },
  toNumberBuyersPage(){
    wx.navigateTo({
      url:"/packageRecommend/pages/storeAnalysisPages/numberBuyers/numberBuyers?dateType="+this.data.changeYear+this.data.changeMonth
    })
  },
  toNewFansPage(){
    wx.navigateTo({
      url:"/packageRecommend/pages/storeAnalysisPages/newFans/newFans?dateType="+this.data.changeYear+this.data.changeMonth
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getBuyerInfo(){
    let that = this
    let {changeYear,changeMonth,} = this.data
    let value1 = 0
    util.request(api.shopAnalysisBuyer_info,{dateType:`${changeYear}${changeMonth}`}).then((res:any)=>{
        console.log(res,"===============");
        // let userType = ""
        const arr = res.data.map((item:any)=>{
            // userType = that.data.typeData[item.userType]
            value1 += item.numBuyer
            return {
                name: that.data.typeData[item.userType],
                percent: item.rateUserType,
                numBuyer:item.numBuyer,
                a: '1'
            }
        })||[]
        this.setData({
            value1
        })
        chart.changeData(arr)
    })
  },
  getFans_info(){
    let that = this
    let {changeYear,changeMonth,} = this.data
    let value2 = 0
    util.request(api.shopAnalysisFans_info,{dateType:`${changeYear}${changeMonth}`}).then((res:any)=>{
        console.log(res,"===============");
        
        // let userType = ""
        const arr = res.data.map((item:any)=>{
            // userType = that.data.typeData[item.userType]
            value2 += item.numNewFans
            return {
                name: that.data.typeData[item.userType],
                percent: item.numNewFans,
                a: '1'
            }
        })||[]
        this.setData({
            value2
        })
        chart1.changeData(arr)
    })
  },
  getShopAnalysisList(){
    let that = this
    let {changeYear,changeMonth} = this.data
    util.request(api.shopAnalysisList,{dateType:`${changeYear}${changeMonth}`}).then((res:any)=>{
        let resData = res.data
        that.setData({
            storeAnalysisData:resData,
            progress:resData.numViewIsNotFansBeFans&&resData.numViewIsNotFans&&(resData.numViewIsNotFansBeFans/resData.numViewIsNotFans*100)||0
        })
        this.draw()
    })
  },
  onLoad() {
    let date = new Date()
    let YY = date.getFullYear()
    let MM = date.getMonth()+1
    let DD = date.getDate()
    this.setData({
        changeYear:YY+'',
        changeMonth:util.isTwo(MM),
        currentDate:`${YY}年${MM}月${DD}日`,
    })
    this.getShopAnalysisList()
    this.getBuyerInfo()
    this.getFans_info()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  draw(){
    console.log('onReady');
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        console.log(res,999999999);
        const canvas:any = res[0].node
        const ctx:any = canvas.getContext('2d')
        const dpr:number = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        let percent:number = this.data.progress
        let circleX:number = canvas.width / 2 //中心x坐标
        let circleY:number = canvas.height / 2 //中心y坐标
        let radius:number= 120 //圆环半径
        let lineWidth:number = 20 //圆形线条的宽度
        let fontSize:number = 40//字体大小
        //画圆
        function circle(cx:number, cy:number, r:number) {
          ctx.beginPath();
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = '#eee';
          ctx.arc(cx, cy, r, 0, (Math.PI * 2), true);
          ctx.stroke();
        }

        //画弧线
        function sector(cx:number, cy:number, r:number, endAngle:number):void {
            ctx.beginPath();
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = wx.getStorageSync("themeColor");

            //圆弧两端的样式
            ctx.lineCap = 'round';
            ctx.arc(
                cx, cy, r,
                (Math.PI * -1 / 2),
                (Math.PI * -1 / 2) + endAngle / 100 * (Math.PI * 2),
                false
            );
            ctx.stroke();
        }
        //刷新
        function loading() {
            if (process >= percent) {
                //  clearInterval(circleLoading);
                process = percent;
            }

            //清除canvas内容
            ctx.clearRect(0, 0, circleX * 2, circleY * 2);

            //中间的字
            ctx.font = 'normal bold '+fontSize + 'px April';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#151522';
            ctx.fillText(parseFloat(process).toFixed(0) + '%', circleX, circleY);

            //圆形
            circle(circleX, circleY, radius);

            //圆弧
            sector(circleX, circleY, radius, process);
            process += 1.0;
        }

        var process:any = 0.0; //进度
        setInterval(function() {
            loading();
        }, 20);
      })
  },
  onReady() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    svgColor(this.data.arrowUpIcon,storeAnalysisApp.globalData.themeColor,"stroke").then((res:any)=>{
        this.setData({
            arrowUpIcon: res
        })
    })
    this.setData({
        themeColor:storeAnalysisApp.globalData.themeColor
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