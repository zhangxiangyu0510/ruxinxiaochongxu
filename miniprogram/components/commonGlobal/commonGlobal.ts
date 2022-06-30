var util = require('../../utils/util');
let commmonApp = getApp<IAppOption>();

Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        isShow:false
    },
    lifetimes:{
        created(){
            // if(!wx.getStorageSync("themeColor")){
                // wx.setStorageSync("themeColor",'#7340B3')
            // }
        }
    },
    pageLifetimes:{
        show(){
            util.getThemeColor().then((res: any) => {
                wx.setStorageSync('themeColor', res);
                console.log(res,'gloabl')
                commmonApp.globalData.themeColor=res;
              })
            if(!wx.getStorageSync("cookie"))return
            this.isShowBardge()//徽章弹出时机
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        isShowBardge(){
            this.setData({
                isShow:false
            })
        }
    }
})
