// components/commendHeader.ts
let componentApp1 = getApp<IAppOption>();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleText: {
      type: String,
      value: '暂无数据'
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    themeColor: componentApp1.globalData.themeColor,
    imageUrl :componentApp1.globalData.imageUrl

  },
  pageLifetimes: {
    show: function () {
        this.setData({
            themeColor:componentApp1.globalData.themeColor
        })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
