// packageRecommend/pages/storeAnalysisPages/orderAmount/orderAmount.ts
const orderAmountApp = getApp<IAppOption>();
var api = require('../../../../config/api')
var util = require('../../../../utils/util');
import { svgColor } from "../../../../utils/changeThemeColor";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList:[],
        listData:{},
        changeYear:'',
        changeMonth:'',
        isHasData:true,
        isShowNotDataTitle:false,
        page:1,
        size:20,
        currentDate:'',
        themeColor:orderAmountApp.globalData.themeColor,
        arrowUpIcon:"/packageRecommend/images/arrowUp.svg"
    },
    toOrderDetailsPage(e:any){
        console.log(e);
        
        wx.navigateTo({
            url:"/packageUser/pages/customerLabelingProcess/customerorderdetail/customerorderdetail?id="+e.currentTarget.dataset.id
        })
    },
    mounthChange(e:any){
        this.setData({
            changeYear:e.detail.value.split("-")[0],
            changeMonth:e.detail.value.split("-")[1],
            page:1,
            orderList:[],
            isHasData:true
        })
        this.getOrderData(this.data.page)        
    },
    getOrderData(page:any){
        let {changeYear,changeMonth} = this.data
        let listArr:any = []
        util.request(api.shopAnalysisOrder_info,{dateType:`${changeYear}${changeMonth}`,page,size:this.data.size}).then((res:any)=>{
            console.log(res,"shopAnalysisOrder_info");
            let resData = res.data
            if(!resData.page.content.length||resData.page.content.length<this.data.size){
                this.setData({
                    isShowNotDataTitle:true,
                    isHasData:false
                })
            }
            listArr.push(...resData.page.content.length&&resData.page.content.map((item:any)=>{
                item.itemImagesList = item.itemImagesList.split(",").slice(0,3)
                return item
            })||[])
            this.setData({
                listData:{
                    amtTotalOrder:resData.amtTotalOrder,
                    amtTotalOrderMom:resData.amtTotalOrderMom*100,
                    amtTotalOrderYoy:resData.amtTotalOrderYoy*100
                },
                orderList:[...this.data.orderList,...listArr]
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
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
        this.getOrderData(this.data.page)
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
        svgColor(this.data.arrowUpIcon,orderAmountApp.globalData.themeColor,"stroke").then((res:any)=>{
            this.setData({
                arrowUpIcon: res
            })
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
                page
            })
            this.getOrderData(page)
        }
    }

})