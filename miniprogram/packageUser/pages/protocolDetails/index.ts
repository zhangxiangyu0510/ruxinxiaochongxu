// packageUser/pages/protocolDetails/index.ts
var api = require('../../../config/api')
var util = require('../../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.hideShareMenu({
            menus: ['shareAppMessage', 'shareTimeline']
          })
        console.log(options.code,"options");
        
        this.getDetailData(options.code+"")
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    getDetailData(id:string){
       
        // code
//         条款管理列表
// userClause:用户条款 REGISTRATION_AGREEMENT
// privateClause: 行上code字段   === PRIVACY_AGREEMENT
// 用户条款  ===REGISTRATION_AGREEMENT
        util.request(api.getTermdetails,{termsId:id}).then((res: any) => {
            console.log("res.content",res);
            
           this.setData({
            content:res.data.content
           })
        })
    }
})