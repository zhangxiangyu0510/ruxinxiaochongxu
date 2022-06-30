/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    // [propName: string]:any;//不够严谨
    fontFamily:string,
    themeColor:string,
    h5DetailUrl:string,
    imageUrl:string,
    messageList: Array<any>
    SDKAppID:number,
    customerH5:string,
    staticFont:string,
    shopAppId:string,
    imageUrlUser:string
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback
}

declare module 'tim-wx-sdk'
declare module 'tim-upload-plugin'