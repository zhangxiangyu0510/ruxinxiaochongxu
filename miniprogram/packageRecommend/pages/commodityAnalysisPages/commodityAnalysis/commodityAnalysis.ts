// packageRecommend/pages/commodityAnalysisPages/commodityAnalysis/commodityAnalysis.ts
const newApp = getApp<IAppOption>();
var api = require('../../../../config/api')
var util = require('../../../../utils/util');
let chart:any = null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        changDate:[
            {
                text:'销量排序'
            },{
                text:'购买用户排序'
            }
        ],
        itemData:[
            {
                text:"黄金生态圈",
                value:1800,
                color:"#FED80C"
            },
            {
                text:"彩妆",
                value:1900,
                color:"#7949B6"
            },
            {
                text:"身体护理",
                value:1000,
                color:"#BB29BB"
            },{
                text:"护肤",
                value:1500,
                color:"#C4D600"
            },
            {
                text:"营养健康",
                value:1200,
                color:"#0CB8E1"
            },{
                text:"TR90",
                value:1400,
                color:"#FE6B0C"
            },

        ],
        active:0,
        onInitChart(F2: any, config:any) {
            chart = new F2.Chart(config);
            var Global = F2.Global;
              chart.source([], {
                population: {
                  tickCount: 6
                }
              });
              chart.legend(false);
              chart.coord({
                transposed: true
              });
              chart.axis('categoryName', {
                line: Global._defaultAxis.line,
                grid: null
              });
              chart.axis('categoryNumItemSale', {
                line: null,
                grid: Global._defaultAxis.grid
              });
              chart.interval().position('categoryName*categoryNumItemSale').color('categoryName',['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0']);
              chart.render();
              
              return chart;
        },
        changeYear:"",
        changeMonth:"",
        page:1,
        size:20,
        isHasData:true,
        itemSaleVos:[],
        itemTotalSale:'',
        currentDate:'',
        isSate:false,
        themeColor:newApp.globalData.themeColor
    },
    handleChangeOn(e:any){
        // console.log(e);
        this.setData({
            active:e.currentTarget.dataset.index,
            page:1
        })
        this.getProductAnalysisList()
    },
    handleToReport(e:any){
        wx.navigateTo({
            url:"/packageRecommend/pages/commodityAnalysisPages/commodityReport/commodityReport?itemCode="+e.currentTarget.dataset.item.itemCode
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    getProductAnalysisList(){
        let that = this
        let {changeYear,changeMonth,active,size,page,isSate} = this.data
        let data = {
            sortByIdFlag:active+1,
            dateType:`${changeYear}${changeMonth}`,
            page,
            size
        }
        let listItemSaleVos:any = []
        util.request(api.productAnalysisList,!isSate?data:{page,size}).then((res:any)=>{
            let resData = res.data
            if(!resData.itemSaleVos.length||resData.itemSaleVos.length<this.data.size){
                this.setData({
                    isShowNotDataTitle:true,
                    isHasData:false
                })
            }
            listItemSaleVos.push(...resData.itemSaleVos.content)
            that.setData({
                itemSaleVos:[...this.data.itemSaleVos,...listItemSaleVos],
                itemTotalSale:resData.numItemTotalSale
            })
            chart.changeData(resData.categoryItemSales)
            
        })
    },
    handleGetAllData(){
        this.setData({
            page:1,
            itemSaleVos:[],
            isHasData:true,
            isSate:true
        })
        this.getProductAnalysisList()
    },
    mounthChange(e:any){
        this.setData({
            changeYear:e.detail.value.split("-")[0],
            changeMonth:e.detail.value.split("-")[1],
            page:1,
            itemSaleVos:[],
            isHasData:true,
            isSate:false
        })
        this.getProductAnalysisList()
    },
    onLoad() {
        // util.request(api.productAnalysisProduct_list,{accountId:"",dateType:202204}).then((res:any)=>{
        //     console.log(res);
           
        // })
        let date = new Date()
        let YY = date.getFullYear()
        let MM = date.getMonth()+1
        let DD = date.getDate()
        this.setData({
            changeYear:YY+'',
            changeMonth:util.isTwo(MM),
            currentDate:`${YY}年${MM}月${DD}日`,
        })
        this.getProductAnalysisList()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        // const query = wx.createSelectorQuery()
        // query.select('#myCanvas')
        // .fields({ node: true, size: true })
        // .exec((res) => {
        //     console.log(res,this.data.itemData);
        //     const canvas = res[0].node
        //     // canvas宽、高
        //     const width = res[0].width
        //     const height = res[0].height
        //     let ctx = canvas.getContext("2d")
        //     let data = this.data.itemData
        //     // 最大值
        //     let {tmp} = this.getMaxValue(data)
        //     let initX = 45;
        //     let initY = 133;
        //     let endX = initX
        //     for(let i=1;i<=6;i++){
        //         ctx.beginPath()
        //         ctx.moveTo(endX-0.5,0-0.5)
        //         ctx.lineTo(endX-0.5,height-90-0.5)
        //         ctx.strokeStyle="#ddd"
        //         ctx.stroke()
        //         endX = endX +( width-30)/6
        //     }
        //     let changeY = initY
        //     data.forEach((item)=>{
        //         ctx.fillStyle=item.color
        //         ctx.font = 'PingFang SC';
        //         ctx.textAlign = 'right'
        //         ctx.fillText(item.text,40,changeY+3);
        //         ctx.beginPath()
        //         ctx.moveTo(initX-0.5,changeY-7.5-0.5)
        //         ctx.lineTo((width-30)*(item.value/tmp)-0.5,changeY-7.5-0.5)
        //         ctx.lineTo((width-30)*(item.value/tmp)-0.5,changeY+7.5-0.5)
        //         ctx.lineTo(initX-0.5,changeY+7.5-0.5)
        //         ctx.closePath()
        //         ctx.fill()
        //         changeY = changeY-((initY-15)/(data.length-1))
        //     })
        // })
    },
    
    getMaxValue(arr:any[]){
        let tmp = 0
        arr.forEach(item=>{
            if(item.value>tmp){
                tmp = item.value
            }
        })
        return {tmp}
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.setData({
            themeColor:newApp.globalData.themeColor
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
            this.getProductAnalysisList()
        }
    },

    
})