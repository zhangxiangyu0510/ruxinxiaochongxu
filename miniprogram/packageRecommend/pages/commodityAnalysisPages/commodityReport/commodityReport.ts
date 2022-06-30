const commodityReportApp = getApp<IAppOption>();
var api = require('../../../../config/api')
var util = require('../../../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        itemCode:"",
        changeYear:'',
        changeMonth:'',
        isHasData:true,
        isShowNotDataTitle:false,
        page:1,
        size:20,
        infoData:{},
        productBuyersList:[],
        currentDate:'',
        isSate:false,
        themeColor:commodityReportApp.globalData.themeColor
    },
    toDetail(e:any){
        wx.navigateTo({
            url: '/packageUser/pages/customerLabelingProcess/custormDetail/custormDetail?id='+e.currentTarget.dataset.id
        })
    },
    mounthChange(e:any){
        this.setData({
            changeYear:e.detail.value.split("-")[0],
            changeMonth:e.detail.value.split("-")[1],
            page:1,
            productBuyersList:[],
            isHasData:true,
            isSate:false
        })
        this.getBuyerList()        
    },
    getBuyerList(){
        let {changeYear,changeMonth,itemCode,size,page,isSate} = this.data
        let data = {
            dateType:`${changeYear}${changeMonth}`,
            itemCode,
            page,
            size
        }
        let arrList:any = []
        util.request(api.productAnalysisBuyer_list,!isSate?data:{page,size}).then((res:any)=>{
            console.log(res);
            let resData = res.data
            if(!resData.productBuyers.content.length||resData.productBuyers.content.length<this.data.size){
                this.setData({
                    isShowNotDataTitle:true,
                    isHasData:false
                })
            }
            arrList.push(...resData.productBuyers.content)
            this.setData({
                productBuyersList:[...this.data.productBuyersList,...arrList],
                infoData:{
                    itemCode:resData.itemCode,
                    itemImage:resData.itemImage,
                    itemName:resData.itemName,
                    numItemSale:resData.numItemSale,
                    numItemSaleUsers:resData.numItemSaleUsers
                }
            })
        })
    },
    handleGetAllData(){
        this.setData({
            page:1,
            isSate:true,
            productBuyersList:[],
            isHasData:true
        })
        this.getBuyerList()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(opions) {
        let date = new Date()
        let YY = date.getFullYear()
        let MM = date.getMonth()+1
        let DD = date.getDate()
        this.setData({
            changeYear:YY+'',
            changeMonth:util.isTwo(MM),
            currentDate:`${YY}年${MM}月${DD-1}日`,
            itemCode:opions.itemCode
        })
        this.getBuyerList()
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
        this.setData({
            themeColor:commodityReportApp.globalData.themeColor
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
        if(this.data.isHasData){
            let page = this.data.page
            ++page
            this.setData({
                page,
            })
            this.getBuyerList()
        }
    },

   
})