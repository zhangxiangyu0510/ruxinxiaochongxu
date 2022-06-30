// components/recommendList/recommendList.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recommends:{
      type:Array,
      value:[{name:'如新滢白三效修护霜（暂为非直销品）如新滢白三效修护霜（暂为非直销品如新滢白三效修护霜（暂为非直销品'},{name:'立白洗洁精'},{name:'开心麻花开心麻花开心麻花开心麻花'},{name:'如新滢白三效修护霜（暂为非直销品）测试数据'}]
    },
    showOperate:{
      type:Boolean,
      value:true
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    pointShow:false,
    outProductName:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //下架产品
    outProduct(e:any){
      let getObj=e.currentTarget.dataset.item;
      console.log('123456=====',e.currentTarget.dataset);
      this.setData({
        pointShow:true,
        outProductName:getObj.name
      })
    },
    tapDialogButton(e:any){
      //否
      if(e.detail.index==0){
        this.setData({
          pointShow:false,
        })
        // todo逻辑处理
      }else{
        this.setData({
          pointShow:false,
        });
        // todo逻辑处理
      }
      console.log('11111====',e);
    }
  }
})
