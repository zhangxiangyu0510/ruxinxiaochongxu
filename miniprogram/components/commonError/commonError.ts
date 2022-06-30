// components/commonError/commonError.ts
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        innerText: {
            type: String,
            value: '',
          }
    },
    ready(){
        // 定时器关闭  
        setTimeout(() => {
          this.triggerEvent('HideToast')
        }, this.properties.innerText.length < 40 ? 2200 : this.properties.innerText.length*57);
      },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
