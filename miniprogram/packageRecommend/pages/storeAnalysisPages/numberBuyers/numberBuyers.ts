// packageRecommend/pages/storeAnalysisPages/numberBuyers/numberBuyers.ts
var api = require('../../../../config/api')
var util = require('../../../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dateType:'',
        listData:[],
        isHasData:true,
        isShowNotDataTitle:false,
        page:1,
        size:10,
        currentDate:""
    },
    toDetail(e:any){
        wx.navigateTo({
            url: '/packageUser/pages/customerLabelingProcess/custormDetail/custormDetail?id='+e.currentTarget.dataset.id
        })
    },
    getDataList(page:any){
        let listArr:any = []
        util.request(api.shopAnalysisShop_buyer_info,{dateType:this.data.dateType,page,size:this.data.size}).then((res:any)=>{
            console.log(res);
            if(!res.data.content.length||res.data.content.length<this.data.size){
                this.setData({
                    isShowNotDataTitle:true,
                    isHasData:false
                })
            }
            listArr.push(...res.data.content.length&&res.data.content)
            this.setData({
                listData:[...this.data.listData,...listArr]
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let date = new Date()
        let YY = date.getFullYear()
        let MM = date.getMonth()+1
        let DD = date.getDate()
        this.setData({
            currentDate:`${YY}年${MM}月${DD}日`,
            dateType:options.dateType
        })
        this.getDataList(this.data.page)
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
        if(this.data.isHasData){
            let page = this.data.page
            ++page
            this.setData({
                page
            })
            this.getDataList(page)
        }
    },

    
})