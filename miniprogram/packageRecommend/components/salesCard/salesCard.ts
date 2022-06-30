// packageRecommend/components/salesCard/salesCard.ts
const salesCardApp = getApp<IAppOption>();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        infoData: {
            type: Object,
            value: {}
        }
    },
    pageLifetimes:{
        show(){
            this.setData({
                themeColor:salesCardApp.globalData.themeColor
            })
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        themeColor:salesCardApp.globalData.themeColor
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
