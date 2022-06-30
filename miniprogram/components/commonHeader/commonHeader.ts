// components/commendHeader.ts
var headerApp = getApp<IAppOption>();
var changeHeaderSvg = require('../../utils/changeThemeColor');
var util = require('../../utils/util');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleText: {
      type: String,
      value: 'My Shop'
    },
    bg: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    logo: headerApp.globalData.imageUrl + '/icons/logo_header.svg',
  },
  pageLifetimes: {
    show: function () {
      this.changeColor('logo', this.data.logo, headerApp.globalData.themeColor);
    }
  },


  /**
   * 组件的方法列表
   */
  methods: {
    changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
      changeHeaderSvg.svgColor(url, color, type).then((res: any) => {
        this.setData({ [name]: res })
      })


    },


  }
})
