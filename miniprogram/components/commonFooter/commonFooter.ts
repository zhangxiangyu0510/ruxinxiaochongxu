// components/commonFooter/commonFooter.ts
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
    tabbar:[{name:'首页'},{name:'工作台'},{name:'消息'},{name:'我的'}],
    currentIndex:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goSwitch(e:any){
      let current:number=e.currentTarget.dataset.index;
      this.setData({currentIndex:current});
      switch(this.data.currentIndex){
        case 0:wx.switchTab({ url:'/pages/index/index'});
          break;
        case 1:wx.switchTab({ url:'/pages/worker/worker'});
          break;
        case 2:wx.switchTab({ url:'/pages/news/news'});
          break;
        case 3:wx.switchTab({ url:'/pages/ucenter/index/index'});
          break;
      }
    },
  }
})
