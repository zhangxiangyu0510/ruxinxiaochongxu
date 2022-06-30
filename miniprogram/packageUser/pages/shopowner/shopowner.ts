// pages/ucenter/shopowner/shopowner.ts
var api = require('../../../config/api')
var util = require('../../../utils/util');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // badgeData:[{name:'未来可期'},{name:'十分热爱'},{name:'开单大吉'},{name:'大有作为'}]
    thisShow: true,
    progress: 0,
    nextLevelData:{},
    nextAchievementTips:'',
    userInfo: {},
    orderNum:0,
    orderPrice:0,
  },
  goReview: function () {
    wx.navigateTo({
      url: '/packageUser/pages/shopownerReview/shopownerReview',
    })
  },

  goConfig: function () {
    wx.navigateTo({
      url: '/packageUser/pages/peopleConfiguration/peopleConfiguration',
    })
  },
  goEdit: function () {
    wx.navigateTo({
      url: '/packageUser/pages/userInfo/userInfo',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // this.setData({'nextLevelData':nextLevelData})
    
  },
  getShopLevel(){
    util.request(api.getShopLevel).then((res: any) => {
        let level:any = JSON.parse(wx.getStorageSync('userInfo')).shop.level,
        length:any = res.data.achievementInfoList.length
        console.log('店铺等级====',res,res.data.achievementInfoList[level-1]);
        if(res&&res.data){
            this.setData({
                nextLevelData:res.data.achievementInfoList[level].ruleScript.newRightsAndInterests,
                nextAchievementTips:res.data.nextAchievementTips,
                progress:level/length*100
            })
            const query = wx.createSelectorQuery()
            query.select('#myCanvas')
            .fields({ node: true, size: true })
            .exec((res) => {
                console.log(res, 999999999);
                const canvas: any = res[0].node
                const ctx: any = canvas.getContext('2d')
                const dpr: number = wx.getSystemInfoSync().pixelRatio
                canvas.width = res[0].width * dpr
                canvas.height = res[0].height * dpr
                let percent: number = this.data.progress
                let circleX: number = canvas.width / 2 //中心x坐标
                let circleY: number = canvas.height / 2 //中心y坐标
                let radius: number = 120 //圆环半径
                let lineWidth: number = 18 //圆形线条的宽度
                let fontSize: number = 40//字体大小
                //画圆
                function circle(cx: number, cy: number, r: number) {
                ctx.beginPath();
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = '#eee';
                ctx.arc(cx, cy, r, 0, (Math.PI), true);
                ctx.stroke();
                }

                //画弧线
                function sector(cx: number, cy: number, r: number, endAngle: number): void {
                ctx.beginPath();
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = wx.getStorageSync("themeColor");

                //圆弧两端的样式
                ctx.lineCap = 'round';
                ctx.arc(
                    cx, cy, r,
                    (Math.PI),
                    (Math.PI) + endAngle / 100 * (Math.PI),
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
                ctx.font = 'normal bold ' + fontSize + 'px April';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = wx.getStorageSync("themeColor");
                // ctx.fillText(parseFloat(process).toFixed(0) + '%', circleX, circleY);
                ctx.fillText('V'+level, circleX, circleY - 15);
                //圆形
                circle(circleX, circleY, radius);

                //圆弧
                sector(circleX, circleY, radius, process);
                process += 1.0;
                }

                var process: any = 0.0; //进度
                setInterval(function () {
                loading();
                }, 20);
            })
        }
    }).catch((e:any) => {
        console.log('eeeee',e);
        
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getShopLevel()
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

  }
})