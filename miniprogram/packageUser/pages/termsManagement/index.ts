// packageUser/pages/termsManagement/index.ts
var api = require('../../../config/api')
var util = require('../../../utils/util');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        height:0,
        dataList:[],
        page:1,
        pageSize:10,
        total:0,
        topHeight:0,
        bottomHeight:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        wx.getSystemInfo({
            success: (res) => {
                console.log(res.windowHeight * 2 ,"gaodu");
              this.setData({
                height: res.windowHeight * 2 
              })
              console.log(this.data.height,"sdsadas");
            }
        })
        this.getDataList().then((res:any)=>{
            console.log(res,"sdasd");
            this.data.total= res.data.totalSize;
             this.setData({
                dataList:res.data.clauseManageInfos
            })
        });
    },
    // 安全区域
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    // 获取列表数据
    getDataList(){
        // api.getTermList
        // 请求
        let that = this;
      return new Promise(function(resole,reject){
        util.request(api.getTermList,{page:that.data.page,pageSize:that.data.pageSize}).then((res: any) => {
        resole(res)
        }).catch((err:any)=>{
            reject(err)
        })
        })
    },
    // 跳转协议详情
    jumpDetails(event:any){
        // wx.setStorageSync('protocolInfo',this.data.protocols);
        
        console.log(event,"dsa");
        wx.navigateTo({
         url: `/packageUser/pages/protocolDetails/index?code=${event.currentTarget.dataset.code}`
        })
    },
    // 
    lower() {
       
        var result = this.data.dataList;
       
        if (result.length >= this.data.total) {
            console.log("oooooo");
            
          wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
            title: '到底了',
            icon: 'success',
            duration: 300
          });
        } else {
            console.log("pppppp");

          wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
            title: '加载中',
            icon: 'loading',
          });
          this.data.page=this.data.page+1;
 this.getDataList().then((res:any)=>{
            console.log(res,"sdasd");
            let newDataList = this.data.dataList.concat(res.data.clauseManageInfos)
             this.setData({
                dataList:newDataList
            })
            wx.hideLoading();
        });

      
        }
      }


})