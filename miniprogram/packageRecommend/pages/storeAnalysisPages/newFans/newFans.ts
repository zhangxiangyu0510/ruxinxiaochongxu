// packageRecommend/pages/storeAnalysisPages/newFans/newFans.ts
const newFansApp = getApp<IAppOption>();
var api = require('../../../../config/api')
var util = require('../../../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        narBar:[
            {
                text:"全部新增",
                value:"0",
                width:"163"
            },
            {
                text:"注册顾客",
                value:"1",
                width:"163"
            },
            {
                text:"新顾客",
                value:"2",
                width:"120"
            },
            {
                text:"老顾客",
                value:"3",
                width:"120"
            },
        ],
        isactive:0,
        dateType:'',
        listData:[],
        isHasData:true,
        isShowNotDataTitle:false,
        page:1,
        size:10,
        itemType:'',
        currentDate:'',
        themeColor:newFansApp.globalData.themeColor
    },
    toDetail(e:any){
        wx.navigateTo({
            url: '/packageUser/pages/customerLabelingProcess/custormDetail/custormDetail?id='+e.currentTarget.dataset.id
        })
    },
    handleActive(e:any){
        let itemData:any = e.currentTarget.dataset.item
        this.setData({
            isactive:e.currentTarget.dataset.index,
            page:1,
            itemType:itemData,
            listData:[],
            isHasData:true
        })
        this.getData(itemData)
    },
    getData(itemData:any){
        let data = {
            dateType:this.data.dateType,
            userType:itemData?itemData.value:'0',
            page:this.data.page,
            size:this.data.size
        }
        let listArr:any = []
        util.request(api.shopAnalysisNew_fans_info,data).then((res:any)=>{
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
        this.getData(this.data.itemType)
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
            themeColor:newFansApp.globalData.themeColor
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
            this.getData(this.data.itemType)
        }
    }


    
})