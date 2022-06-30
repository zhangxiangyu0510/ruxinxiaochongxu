// components/commonService/commonService.ts
const commonServiceApp = getApp<IAppOption>();
var api=require('../../config/api')
var util = require('../../utils/util');
// const changeSvg = require('../../utils/changeThemeColor');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showShare: {
      type: Boolean,
      value: true
    },
    showCustomer: {
      type: Boolean,
      value: true
    },
    bgColor: {
      type: String,
      value: ''
    },
    bottom: {
      type: String,
      value: '198rpx'
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    hasPhone:false,
    customerPhone:'',
    themeColor:commonServiceApp.globalData.themeColor,
    imageUrl:commonServiceApp.globalData.imageUrl,
    painting: {
      width: 248,
      height: 366,
      background: '#fff',
      clear: true,
      type:'2',
      views: [{
              type: 'rect',
              top: 0,
              left: 0,
              width: 248,
              height: 366,
              background: '#fff',
          },
          {
            type: 'image',
            url: 'https://nuskin-1257745828.cos.ap-shanghai.myqcloud.com/20220415/f4845ec7-924c-4479-8ac7-cb79d7f01a91.png',
            top: 12,
            left: 0,
            width: 250,
            height: 210,
        },
     
          {
            type: 'roundRect',
            top: 248,
            left: 16,
            width: 216,
            height: 80,
            background: commonServiceApp.globalData.themeColor,
            borderRadius: 8,
        },
        {
          type: 'roundRect',
          top: 249,
          left: 17,
          width: 214,
          height: 78,
          background: '#fff',
          borderRadius: 8,
          borderColor:commonServiceApp.globalData.themeColor,
      },
          {
              type: 'arc',
              top: 40,
              left: 74,
              width: '100',
              height: '100',
              background: commonServiceApp.globalData.themeColor,
          },
          {
              type: 'text',
              content: '蓝色的枫叶',
              fontSize: 16,
              lineHeight: 22,
              color: '#383549',
              textAlign: 'center',
              top: 170,
              left: 124,
              width: 160,
              bold:true,
              MaxLineNumber: 2,
              breakWord: true,
              // bolder: true
          },
          {
              type: 'text',
              content: '13255998901',
              fontSize: 14,
              lineHeight: 17,
              color: '#4A4A4A',
              textAlign: 'left',
              top: 202,
              left: 88,
              width: 40,
              MaxLineNumber: 1,
              // breakWord: true,
              // bolder: true
          },
          {
              type: 'text',
              content: '蓝色的枫叶',
              fontSize: 14,
              lineHeight: 20,
              color: '#383549',
              textAlign: 'left',
              top: 262,
              left: 28,
              width: 70,
              MaxLineNumber: 1,
              bold:true,
              breakWord: true,
              // breakWord: true,
              // bolder: true
          },
          {
              type: 'text',
              content: '识别二维码，进入店铺了解更多信息。',
              fontSize: 10,
              lineHeight: 14,
              color: '#4A4A4A',
              textAlign: 'left',
              top: 286,
              left: 28,
              width: 104,
              MaxLineNumber: 2,
              breakWord: true,
              // bolder: true
          },
          {
              type: 'text',
              content: '的如新NU店',
              fontSize: 10,
              lineHeight: 14,
              color: '#8c8c8c',
              textAlign: 'left',
              top: 264,
              left: 102,
              width: 200,
              MaxLineNumber: 1,
              breakWord: true,

    
          },
          {
              type: 'image',
              url: 'https://nuskin-1257745828.cos.ap-shanghai.myqcloud.com/20220415/30f867db-56fe-474c-bc1b-efa643333c43.png',
              top: 204,
              left: 72,
              width: 10,
              height: 13,
          },
        //   {
        //     type: 'image',
        //     url: '../../packageRecommend/images/hybridRecommend_addBg.svg',
        //     top: 20,
        //     left: 20,
        //     width: 200,
        //     height: 300,
        // },
          // changeSvg.svgColor('/packageRecommend/images/hybridRecommend_addBg.svg', apps.globalData.themeColor + 10),
          {
            type: 'image',
            url: 'https://thirdwx.qlogo.cn/mmopen/vi_32/XSESMjMSnpY1cnqZCj2DGWRQ69YKKwiaTRpKZpenibj8Tqm9oabqGbOpeJTsaPbd8GBdwN5U8a4ufiaCaOicXfkuZg/132',
            top: 45,
            left: 79,
            width: 90,
            height: 90,
            borderRadius:45,
        },
        {
          type: 'text',
          content: '',
          top: 340,
          left: 95,
          width: '67',
          height: '14',
      },
          // {
          //     type: 'image',
          //     url: '',
          //     top: 260,
          //     left: 170,
          //     width: 50,
          //     height: 50,
          //     isBase64:true
          // },
  
  
      ],
  },
  },
  pageLifetimes: {
    show:function() {
            this.setData({
                themeColor:commonServiceApp.globalData.themeColor
            })
    }
  },
  lifetimes:{
    attached(){
        util.getThemeColor().then((themeColor:string)=>{
            this.setData({
                themeColor
            })
        })
    },
},
  

  /**
   * 组件的方法列表
   */
  methods: {
    openSharePosters(){
      this.triggerEvent('openSharePosters',this.data.painting)

    },
    onService(){
      var _that=this;
        util.request(api.customerService).then(function (res:any) {
          if (res&&res.data) {
            _that.setData({
              customerPhone:res.data.ot,
              hasPhone:true,
            });
            _that.triggerEvent('dialogevent',{params: true});
          }
      });
    },
    positionevent(){
      this.triggerEvent('dialogevent',{params: true});
    },
    tapDialogButton(e:any){
      if(e.detail.index==0){
        this.setData({
          hasPhone:false
        })
      }else{
        wx.makePhoneCall({
          phoneNumber: this.data.customerPhone,
        })
    
    
      }
      
    }

  }
})
