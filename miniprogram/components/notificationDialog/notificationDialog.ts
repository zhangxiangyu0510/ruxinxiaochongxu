const dialogApp2 = getApp<IAppOption>();
var util = require('../../utils/util');
var api = require('../../config/api');
import imClient from "../../utils/imClient";
var getChangeTheme = require("../../utils/changeThemeColor");
import { messageObj } from '../..//utils/globalMessage'
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },
    // 模拟弹出写后续逻辑
    lifetimes: {

        attached() {
            // this.openSharePosters(1)
            // let _data = {
            //     messageType: 'groupOffShelf',
            // }
            // console.log('============',);

            // this.data.messageList.push(_data)
            // this.setData({
            //     messageList: this.data.messageList
            // })
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        wxQrcodeData:{},
        isShow:false,
        groupOffShelfBody: {},
        groupOffShelfimage: '',
        themeColor: dialogApp2.globalData.themeColor,
        imageUrl: dialogApp2.globalData.imageUrl,
        showShare: false,
        painting: '' as any,
        wxQrcode: '',
        levelImageValue:'',
        messageList: [] as Array<any>,
        sdkReady: null as any,
        messageReceived: null as any,
        ids: [] as Array<number>,
        offOnImage: '',
    },
    attached() { },
    pageLifetimes: {
        show: function () {
            let _protocolInfo = wx.getStorageSync('protocolInfo')
            let _newProtocolInfo  =   wx.getStorageSync('newProtocolInfo')
            if(_protocolInfo && (_protocolInfo.version==_newProtocolInfo.version)){
                this.setData({
                    isShow: true
                })
            }
       
            if (wx.getStorageSync('cookie')) {
                this.setData({ 'messageList': [] })
                let getMessage = messageObj.getAllNews();
                console.log('message=======', getMessage)
                console.log(getMessage);
                if (getMessage.length > 0) {
                    for (let i = 0; i < getMessage.length; i++) {

                        this.push(getMessage[i]);
                    }
                    if(this.data.isShow){
                        wx.hideTabBar({})
                    }
                }

            }

            // console.log('-------',this.data.levelObj,JSON.parse(wx.getStorageSync('userInfo')).nextRightsAndInterests,dialogApp2.globalData.imageUrl);

            // if (wx.getStorageSync('showMessage') && wx.getStorageSync('userInfo')) {
            //     var array = wx.getStorageSync('messageList')
            //     this.setData({ messageList: array });
            //     var ids = wx.getStorageSync('messageIds')
            //     this.setData({ ids: ids });
            //     if (array.length > 0) {
            //         wx.hideTabBar({})
            //     }


            // }
            this.setData({
                themeColor: dialogApp2.globalData.themeColor,
                imageUrl: dialogApp2.globalData.imageUrl,
            })
        }

    },
    detached() { },

    /**
     * 组件的方法列表
     */
    methods: {
        toList() {
            wx.navigateTo({ url: 'packageRecommend/pages/cancleLine/cancleLine' })

        },
        push(data: any) {
            console.log('进来了', data,this.data.messageList);
            var array: any = null;
            var messageIds: Array<number> = [];
            var arr1: any = []
            var ids: any = []
            if (!data.messageType) {
                return
            }

            // if (wx.getStorageSync('messageList')) {
            //     array = wx.getStorageSync('messageList')
            //     if (wx.getStorageSync('messageIds')) {
            //         messageIds = wx.getStorageSync('messageIds')
            //     }
            // }
            console.log(this.data.messageList.length, '@@@@@3')
            if (this.data.messageList.length > 0) {
                arr1 = this.data.messageList;
                messageIds = this.data.ids


            }
            if (data.messageType == "groupOffShelf" || data.messageType == "officialGroupOffShelf") {
                let _body = JSON.parse(data.body)
                data.image = _body.shopProductDtos[0].image
                this.setData({
                    groupOffShelfBody: _body,
                    groupOffShelfimage: _body.shopProductDtos[0].image
                })
                wx.setStorageSync('groupOffShelfBody', data.body)
            }
            if (data.messageType == "shopLevelUp" || data.messageType == 'getBadge' || data.messageType == 'productOffShelf') {//店铺升级弹窗
                if (data.body && data.body !== '') {
                    data.body = JSON.parse(data.body)
                }
                // if (data.messageType=="shopLevelUp") {
                //     data.body.imageUrl = data.body.level?dialogApp2.globalData.imageUrl+'/icons/level_'+data.body.level+'.png':''
                // }
            }
            if (data.messageType == "getBadge" || data.messageType == "shopLevelUp") {
                data.body.imageUrlImg = dialogApp2.globalData.imageUrl +'/images/level_bg.svg'
                this.data.messageList.forEach((item:any)=>{
                    if (item.messageType == 'getBadge'||item.messageType == 'shopLevelUp') {
                        if (item.body.level > data.body.level) {
                            data = item
                        }
                    }
                })
            }
            console.log(data, 'message');
            if (data.messageType == "productOnShelf") {
                data.body = JSON.parse(data.body);
                data.image = data.body.imageAddress;
                console.log(data.image)
                // this.setData({image:data.body.imageAddress})

            }
            if (data.messageType == 'shopLevelUp') {
                util.request(api.getShopInfo).then(function (res: any) {
                    if (res && res.data.partner) {
                      wx.setStorageSync("userInfo", JSON.stringify(res.data));
                    }
                });
            }
            // messageIds.push(data.messageId);
            if (arr1.length > 0) {
                console.log(3333, arr1.length)
                arr1.forEach((item: any, index: number) => {
                    if (item.messageType == data.messageType) {

                        messageObj.removeNews(messageIds[index]);
                        console.log(messageIds, arr1)

                        arr1.splice(index, 1)
                        messageIds.splice(index, 1);
                        console.log(index)

                    }
                })

            }
            if (!array) {
                array = arr1;
                // if(arr1.length>0){
                //     arr1.forEach(item => {
                //         messageIds.push(item.messageId)


                //     });

                // }

            }
            console.log(array, messageIds, '###',this.data.messageList)
            console.log(array)
            messageIds.push(data.messageId);
            array.push(data);

            console.log(array);

            if (data.messageType && (data.messageType != "shopLevelUp" && data.messageType != 'getBadge')) {
                wx.setStorageSync('messageList', array);
                wx.setStorageSync('messageIds', messageIds);
            }
            
            console.log('handlePush', data, dialogApp2.globalData.imageUrl, array)
            // data.body = JSON.parse(data.body)
            // data.body.imageUrl = dialogApp2.globalData.imageUrl+'/icons/level_'+data.body.level+'.png'
            // this.data.messageList.push(data)

            if (messageIds[0] && array[0].messageType) {
                // this.data.messageList.push(array[0])
                this.setData({
                    messageList: array,
                    ids: messageIds
                })
                 if(this.data.isShow){
                    wx.hideTabBar({})
                 }
            }
            console.log('打印message====', this.data.messageList)
        },
        close(e: any) {
            // var array = [];
            // var messageIds: Array<number> = [];
            console.log(this.data.messageList[e.currentTarget.dataset.index], e.currentTarget.dataset.index)


            messageObj.removeOnBeforeLanch(this.data.messageList[e.currentTarget.dataset.index].messageId)
            // if (messageIds.indexOf(this.data.messageList[e.currentTarget.dataset.index].messageId) > -1) {

            // } else {
            //     array.push(this.data.messageList[e.currentTarget.dataset.index]);
            //     console.log(this.data.messageList[e.currentTarget.dataset.index].messageId, messageIds)
            //     messageIds.push(this.data.messageList[e.currentTarget.dataset.index].messageId);


            // }

            // wx.setStorageSync('messageList', array);
            // wx.setStorageSync('messageIds', messageIds);
            // var arr1 =  [];
            var arr1 = this.data.messageList;
            // var messageType = this.data.messageList[e.currentTarget.dataset.index].messageType
            arr1.splice(e.currentTarget.dataset.index, 1)

            // this.data.messageList.forEach((item,index)=>{
            //     console.log(item);
            //     if(item.messageType==messageType){
            //         console.log('@@@@@')
            //         console.log(index)
            //         arr1.splice(index, 1)
            //         console.log(arr1)

            //     }

            // })




            this.setData({
                messageList: arr1
            })
            // if (this.data.messageList.length == 0) {
            //     wx.setStorageSync('showMessage', false);
            // }

            // wx.setStorageSync('messageList', array);
            // wx.setStorageSync('messageIds', messageIds);
            if (this.data.messageList.length === 0) {
                wx.showTabBar({})
            }
        },
        closeBadge(e: any) {//徽章弹窗
            console.log('删除', e);
            this.data.messageList.forEach((item: any, index: any) => {
                if (item.messageId == e.currentTarget.dataset.messageid) {
                    this.data.messageList.splice(index, 1)
                }
            });
            messageObj.removeNews(e.currentTarget.dataset.messageid);
            this.setData({
                messageList: this.data.messageList
            })
            wx.showTabBar({})
        },
        notTip(e: any) {
            this.data.messageList.splice(e.currentTarget.dataset.index, 1)
            messageObj.removeNews(this.data.ids[e.currentTarget.dataset.index]);
            this.data.ids.splice(e.currentTarget.dataset.index, 1)
            this.setData({
                messageList: this.data.messageList,
                ids: this.data.ids
            })

            console.log(this.data.messageList.length)

            // if (wx.getStorageSync('showMessage')) {
            //     wx.setStorageSync('messageList', this.data.messageList);
            //     wx.setStorageSync('messageIds', this.data.ids);

            // }
            // if (this.data.messageList.length == 0) {
            //     wx.setStorageSync('showMessage', false);
            // }


            if (this.data.messageList.length === 0) {
                wx.showTabBar({})
            }


        },
        // 点击按钮跳转方法
        jump(e: any) {

            var pages = getCurrentPages();
            var currentPage = pages[pages.length - 1]
            var route = currentPage.route;
            this.data.messageList.splice(e.currentTarget.dataset.index, 1)
            messageObj.removeNews(this.data.ids[e.currentTarget.dataset.index]);
            this.data.ids.splice(e.currentTarget.dataset.index, 1)
            this.setData({
                messageList: this.data.messageList,
                ids: this.data.ids

            })
            console.log(this.data.messageList.length)

            // if (wx.getStorageSync('showMessage')) {
            //     wx.setStorageSync('messageList', this.data.messageList);
            //     wx.setStorageSync('messageIds', this.data.ids);

            // }
            // if (this.data.messageList.length == 0) {
            //     wx.setStorageSync('showMessage', false);
            // }


            if (this.data.messageList.length === 0) {
                wx.showTabBar({})
            }
            if (route == 'packageRecommend/pages/offcialRecommend/offcialRecommend' && e.currentTarget.dataset.path == '/packageRecommend/pages/offcialRecommend/offcialRecommend') {
                console.log('@@@@@@@@@@333')
                wx.redirectTo({ url: e.currentTarget.dataset.path })
                return;
            } else {
                if (e.currentTarget.dataset.item) {
                    wx.setStorageSync('offProduct', e.currentTarget.dataset.item)

                }
                if (e.currentTarget.dataset.type == 'groupOffShelf') {
                    console.log(this.data.messageList)
                    let _data = wx.getStorageSync('groupOffShelfBody')
                    wx.navigateTo({
                        url: e.currentTarget.dataset.path + `?listData=${_data}`
                    })
                    return
                }
                wx.navigateTo({
                    url: e.currentTarget.dataset.path
                })

            }

        },
        openSharePosters(e: any) {
            this.data.messageList.forEach((item: any, index: any) => {
                if (item.messageId == e.currentTarget.dataset.messageid) {
                    this.data.messageList.splice(index, 1)
                }
            });
            messageObj.removeNews(e.currentTarget.dataset.messageid);
            this.setData({
                wxQrcodeData:{},
                messageList: this.data.messageList,
                levelImageValue:e.currentTarget.dataset.url,
                ids: this.data.ids
            })
            wx.hideTabBar({})
            let painting = {
                width: 248,
                height: 401,
                background: '#ffffff',
                clear: true,
                type: '1',
                views: [
                    {
                        type: 'rect',
                        top: 0,
                        left: 0,
                        width: 248,
                        height: 418,
                        background: '#ffffff'
                    },
                    {
                        type: 'text',
                        content: '恭喜您的如新NU店',
                        fontSize: 16,
                        lineHeight: 20,
                        color: '#404040',
                        textAlign: 'left',
                        top: 200,
                        left: 56,
                        width: 136,
                        MaxLineNumber: 1,
                        breakWord: true,
                        // bolder: true
                    },
                    {
                        type: 'text',
                        content: '等级已提升至',
                        fontSize: 16,
                        lineHeight: 20,
                        color: '#404040',
                        textAlign: 'left',
                        top: 220,
                        width: 200,
                        left: 60,
                        MaxLineNumber: 1,
                        breakWord: true
                    },
                    {
                        type: 'text',
                        content: '',
                        fontSize: 16,
                        lineHeight: 26,
                        color: '',
                        textAlign: 'left',
                        top: 220,
                        left: 160,
                        width: 50,
                        MaxLineNumber: 1,
                        breakWord: true,
                        // bolder: true
                    },
                    {
                        type: 'image',
                        url: '',
                        top: 260,
                        left: 24,
                        width: 24,
                        height: 24
                    },
                    {
                        type: 'text',
                        content: '',
                        fontSize: 12,
                        lineHeight: 17,
                        color: '#4A4A4A',
                        textAlign: 'left',
                        top: 264,
                        left: 52,
                        width: 48,
                        MaxLineNumber: 1,
                        breakWord: true,
                        // bolder: true
                    },
                    {
                        type: 'text',
                        content: '向你推荐',
                        fontSize: 10,
                        lineHeight: 14,
                        color: '#7F7F7F',
                        textAlign: 'left',
                        top: 300,
                        left: 25,
                        width: 40,
                        MaxLineNumber: 1,

                    },
                    {
                        type: 'text',
                        content: '如新NU店小程序 ',
                        fontSize: 12,
                        lineHeight: 17,
                        color: '#4A4A4A',
                        textAlign: 'left',
                        top: 318,
                        left: 25,
                        width: 92,
                        MaxLineNumber: 1,
                        // breakWord: true,
                        // bolder: true
                    },
                    {
                        type: 'text',
                        content: '',
                        top: 320,
                        left: 170,
                        width: 60,
                        height: 60,
                    },
                    {
                        type: 'image',
                        url: '/images/icons/canvas_addBg.png',
                        top: 348,
                        left: 24,
                        width: 28,
                        height: 28,
                    },
                    {
                        type: 'image',
                        url: '',
                        top: 25,
                        left: 50,
                        width: 142,
                        height: 132,
                    },
                   
                ]
            }
            console.log('-----------------',this.data.levelImageValue);
            
            wx.setStorageSync("levelImage", e.currentTarget.dataset.url);
            this.openSharePosters2(painting,e.currentTarget.dataset.url)
        },
        //关闭解绑换绑
        tapDialogButton(e: any) {
            this.data.messageList.splice(e.currentTarget.dataset.index, 1)
            messageObj.removeNews(this.data.ids[e.currentTarget.dataset.index]);
            this.data.ids.splice(e.currentTarget.dataset.index, 1)
            this.setData({
                messageList: this.data.messageList,
                ids: this.data.ids
            })
              imClient.disconnect();
              wx.getStorageSync("token") && wx.removeStorageSync("token");
              wx.getStorageSync("access_token") && wx.removeStorageSync("access_token");
              wx.getStorageSync("openId") && wx.removeStorageSync("openId");
              wx.getStorageSync("userInfo") && wx.removeStorageSync("userInfo");
              wx.getStorageSync("cookie") && wx.removeStorageSync("cookie");
              wx.getStorageSync("permisssion") && wx.removeStorageSync("permisssion");
              wx.getStorageSync("userSign") && wx.removeStorageSync("userSign");
              wx.getStorageSync("currentUserInfo") && wx.removeStorageSync("currentUserInfo"); 
              if (this.data.messageList.length === 0) {
                wx.showTabBar({})
            }
            wx.switchTab({
                url: '/pages/ucenter/index/index',
              });
              
          },
        // 打开分享
        openSharePosters2(ev: any,dataUrl:any) {
            let _userInfo = JSON.parse(wx.getStorageSync('userInfo'))
            let _themeColor = wx.getStorageSync('themeColor').substring(1)
            console.log(_userInfo.shop.id, ev,dataUrl)
            let _data = JSON.parse(JSON.stringify(ev))
            _data.views[5].content =_userInfo.partnerProfile.nickname
            _data.views[4].url =_userInfo.partnerProfile.avatar || dialogApp2.globalData.imageUrl+'/icons/accountPictures.png'
            _data.views[3].content = 'V.' +_userInfo.shop.level
            _data.views[3].color = dialogApp2.globalData.themeColor
            _data.views[10].url = dataUrl
            // _data.views[11].url = res.data.wxQrcode || this.data.wxQrcode

            let noAvatar = {
                type: 'roundRect',
                top: 45,
                left: 79,
                width: 90,
                height: 90,
                background: '#ffffff',
                borderRadius: 45
            }
            _data.views.splice(5, 0, noAvatar);

            // _data.views[13].url= decodeURIComponent(this.data.addIcon)
            this.setData({
                painting: _data,
                showShare: true,
            })
            let requstData = {
                id: _userInfo.shop.id,
                path: `pages/loadingPage/loadingPage?shopId=${_userInfo.shop.id}&tc=${_themeColor}`,
                shareKey: '',
            }
            util.showOtherToast('加载中', "loading");
            console.log('path', _data.path)
            util.request(api.shareShop + '/' + _userInfo.shop.id, requstData, 'post').then((res: any) => {
                console.log('shareKey', res.data)
                wx.setStorageSync('shareKey', res.data.shareKey)
                let _wxQrcodeData={
                        type: 'image',
                        url: res.data.wxQrcode,
                        top: 318,
                        left: 167,
                        width: 56,
                        height: 56,
                        isBase64: true
                }
                this.setData({
                    shareData: res.data,
                    wxQrcode: res.data.wxQrcode,
                    wxQrcodeData: _wxQrcodeData,

                })
                wx.hideToast();
            }).catch(() => {
                util.showOtherToast('加载失败');
            })
        },
        // 关闭分享
        closeSharePosters() {
            this.setData({
                showShare: false
            })
            wx.showTabBar({})
        },
        goBadgeDetail(e: any) {//徽章详情
            this.data.messageList.forEach((item: any, index: any) => {
                if (item.messageId == e.currentTarget.dataset.messageid) {
                    this.data.messageList.splice(index, 1)
                }
            });
            messageObj.removeNews(e.currentTarget.dataset.messageid);
            wx.setStorageSync("badgeDetail", e.currentTarget.dataset.item)
            wx.hideTabBar({})
            wx.navigateTo({
                url: "/packageUser/pages/badgeDetail/badgeDetail"
            })
        }
    }
})
