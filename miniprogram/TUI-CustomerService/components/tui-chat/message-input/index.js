import logger from '../../../utils/logger';
var util = require('../../../../utils/util');
var api = require('../../../../config/api')
const app = getApp()
// eslint-disable-next-line no-undef
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    conversation: {
      type: Object,
      value: {},
      observer(newVal) {
        this.setData({
          conversation: newVal,
        });
      },
    },
    shareMessage:{
        type: Object 
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shareBoxBottom: 220,
    conversation: {},
    message: '',
    extensionArea: false,
    sendMessageBtn: false,
    displayFlag: '',
    isAudio: false,
    bottomVal: 0,
    startPoint: 0,
    popupToggle: false,
    isRecording: false,
    canSend: true,
    text: '按住说话',
    title: ' ',
    notShow: false,
    isShow: true,
    commonFunction: [
      { name: '常用语', key: '0' },
      { name: '发送订单', key: '1' },
      { name: '服务评价', key: '2' },
    ],
    displayServiceEvaluation: false,
    showErrorImageFlag: 0,
    firstSendMessage: true,
  },

  lifetimes: {
    attached() {
      // 加载声音录制管理器
      this.recorderManager = wx.getRecorderManager();
      this.recorderManager.onStop((res) => {
        wx.hideLoading();
        if (this.data.canSend) {
          if (res.duration < 1000) {
            wx.showToast({
              title: '录音时间太短',
              icon: 'none',
            });
          } else {
            // res.tempFilePath 存储录音文件的临时路径
            this.getOnlineStatus()
            const message = wx.$TUIKit.createAudioMessage({
              to: this.getToAccount(),
              conversationType: this.data.conversation.type,
              payload: {
                file: res,
              },
            });
            this.$sendTIMMessage(message);
          }
        }
        this.setData({
          startPoint: 0,
          popupToggle: false,
          isRecording: false,
          canSend: true,
          title: ' ',
          text: '按住说话',
        });
      });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
       //发送自定义消息
       shareMessage(){
        this.setData({
            'shareMessage.show':false
        });
    const to = this.getToAccount();
    const message = wx.$TUIKit.createCustomMessage({
      to,
      conversationType: 'C2C',
      payload: {
          data: 'share',
          description:'测试',
          extension: JSON.stringify(this.data.shareMessage)
        }
    });
    this.setData({
      message: '',
      sendMessageBtn: false,
    });
    this.$sendTIMMessage(message);


    },
    // 打开录音开关
    switchAudio() {
      this.setData({
        isAudio: !this.data.isAudio,
        text: '按住说话',
      });
    },
    // 长按录音
    handleLongPress(e) {
      this.recorderManager.start({
        duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
        sampleRate: 44100, // 采样率
        numberOfChannels: 1, // 录音通道数
        encodeBitRate: 192000, // 编码码率
        format: 'aac', // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和Web）互通
      });
      this.setData({
        startPoint: e.touches[0],
        title: '正在录音',
        // isRecording : true,
        // canSend: true,
        notShow: true,
        isShow: false,
        isRecording: true,
        popupToggle: true,
      });
    },

    // 录音时的手势上划移动距离对应文案变化
    handleTouchMove(e) {
      if (this.data.isRecording) {
        if (this.data.startPoint.clientY - e.touches[e.touches.length - 1].clientY > 100) {
          this.setData({
            text: '抬起停止',
            title: '松开手指，取消发送',
            canSend: false,
          });
        } else if (this.data.startPoint.clientY - e.touches[e.touches.length - 1].clientY > 20) {
          this.setData({
            text: '抬起停止',
            title: '上划可取消',
            canSend: true,
          });
        } else {
          this.setData({
            text: '抬起停止',
            title: '正在录音',
            canSend: true,
          });
        }
      }
    },
    // 手指离开页面滑动
    handleTouchEnd() {
      this.setData({
        isRecording: false,
        popupToggle: false,

      });
      wx.hideLoading();
      this.recorderManager.stop();
    },
    // 选中表情消息
    handleEmoji() {
      let targetFlag = 'emoji';
      let _number = 652
      if (this.data.displayFlag === 'emoji') {
        targetFlag = '';
        _number = 220
      }
      this.setData({
        displayFlag: targetFlag,
        shareBoxBottom: _number
      });
    },
    // 选自定义消息
    handleExtensions() {
      let targetFlag = 'extension';
      let _number = 420
      if (this.data.displayFlag === 'extension') {
        targetFlag = '';
        _number = 220
      }
      this.setData({
        displayFlag: targetFlag,
        shareBoxBottom: _number
      });
    },

    error(e) {
      console.log(e.detail);
    },

    handleSendPicture() {
      this.sendImageMessage('camera');
    },
    handleSendImage() {
      this.sendImageMessage('album');
    },
    sendImageMessage(type) {
      const maxSize = 20480000;
      wx.chooseImage({
        sourceType: [type],
        count: 1,
        success: (res) => {
          if (res.tempFiles[0].size > maxSize) {
            wx.showToast({
              title: '大于20M图片不支持发送',
              icon: 'none',
            });
            return;
          }
          this.getOnlineStatus()
          const message = wx.$TUIKit.createImageMessage({
            to: this.getToAccount(),
            conversationType: this.data.conversation.type,
            payload: {
              file: res,
            },
            onProgress: (percent) => {
              message.percent = percent;
            },
          });
          this.$sendTIMMessage(message);
        },
      });
    },
    handleShootVideo() {
      this.sendVideoMessage('camera');
    },
    handleSendVideo() {
      this.sendVideoMessage('album');
    },
    sendVideoMessage(type) {
      wx.chooseVideo({
        sourceType: [type], // 来源相册或者拍摄
        maxDuration: 60, // 设置最长时间60s
        camera: 'back', // 后置摄像头
        success: (res) => {
          if (res) {
              this.getOnlineStatus()
            const message = wx.$TUIKit.createVideoMessage({
              to: this.getToAccount(),
              conversationType: this.data.conversation.type,
              payload: {
                file: res,
              },
              onProgress: (percent) => {
                message.percent = percent;
              },
            });
            this.$sendTIMMessage(message);
          }
        },
      });
    },
    handleCommonFunctions(e) {
      switch (e.target.dataset.function.key) {
        case '0':
          this.setData({
            displayCommonWords: true,
          });
          break;
        case '1':
          this.setData({
            displayOrderList: true,
          });
          break;
        case '2':
          this.setData({
            displayServiceEvaluation: true,
          });
          break;
        default:
          break;
      }
    },
    handleSendOrder() {
      this.setData({
        displayOrderList: true,
      });
    },
    appendMessage(e) {
      this.setData({
        message: this.data.message + e.detail.message,
        sendMessageBtn: true,
      });
    },
    getToAccount() {
      if (!this.data.conversation || !this.data.conversation.conversationID) {
        return '';
      }
      switch (this.data.conversation.type) {
        case 'C2C':
          return this.data.conversation.conversationID.replace('C2C', '');
        case 'GROUP':
          return this.data.conversation.conversationID.replace('GROUP', '');
        default:
          return this.data.conversation.conversationID;
      }
    },
    handleCalling(e) {
      // todo 目前支持单聊
      if (this.data.conversation.type === 'GROUP') {
        wx.showToast({
          title: '群聊暂不支持',
          icon: 'none',
        });
        return;
      }
      const type = e.currentTarget.dataset.value;
      const { userID } = this.data.conversation.userProfile;
      this.triggerEvent('handleCall', {
        type,
        userID,
      });
      this.setData({
        displayFlag: '',
        shareBoxBottom: 220,
      });
    },
    getOnlineStatus(){
        const pages = getCurrentPages()  //获取加载的页面
        const currentPage = pages[pages.length-1]  //获取当前页面的对象
        const options = currentPage.options  //如果要获取url中所带的参数可以查看options
        const obj = JSON.parse(options.conversationInfomation).conversationID
        const userInfo = JSON.parse(wx.getStorageSync('userInfo')).partnerProfile
        let uid = obj.split('C2C')
        let arr = []
        arr.push(uid[1])
        util.request(api.getOnlineStatus,{"To_Account":arr},'post').then(function (res) {
            if (res&&res.data) {
                console.log('当前用户状态',res);
                if (res.data.QueryResult[0].Status=="Offline") {//不在线,调用订阅消息
                    util.request(api.sendMessage,{
                        "uid": uid[1], //用户id不能为空
                        "partnerNickName":'如新NU店',
                        "page":"pages/loadingPage/loadingPage"//点击模板卡片后的跳转页面，仅限本小程序内的页面。支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转。
                    },'post').then(function (res) {
                          if (res&&res.data) {
                              console.log('0000000',res);
                          }
                    })
                }
            }
        })
    },
    sendTextMessage(msg, flag) {
        this.getOnlineStatus()
        const to = this.getToAccount();
        const text = flag ? msg : this.data.message;
        const message = wx.$TUIKit.createTextMessage({
            to,
            conversationType: this.data.conversation.type,
            payload: {
            text,
            },
        });
        this.setData({
            message: '',
            sendMessageBtn: false,
        });
        this.$sendTIMMessage(message);
    },

    onInputValueChange(event) {
      if (event.detail.message) {
        this.setData({
          message: event.detail.message.payload.text,
          sendMessageBtn: true,
        });
      } else if (event.detail.value) {
        this.setData({
          message: event.detail.value,
          sendMessageBtn: true,
        });
      } else {
        this.setData({
          sendMessageBtn: false,
        });
      }
    },

    $handleSendTextMessage(event) {
      this.sendTextMessage(event.detail.message, true);
      this.setData({
        displayCommonWords: false,
      });
    },

    $handleSendCustomMessage(e) {
      const message = wx.$TUIKit.createCustomMessage({
        to: this.getToAccount(),
        conversationType: this.data.conversation.type,
        payload: e.detail.payload,
      });
      this.$sendTIMMessage(message);
      this.setData({
        displayOrderList: false,
      });
    },

    $handleCloseCards(e) {
      switch (e.detail.key) {
        case '0':
          this.setData({
            displayCommonWords: false,
          });
          break;
        case '1':
          this.setData({
            displayOrderList: false,
          });
          break;
        case '2':
          this.setData({
            displayServiceEvaluation: false,
          });
          break;
        default:
          break;
      }
    },

    $sendTIMMessage(message) {
      this.triggerEvent('sendMessage', {
        message,
      });
      wx.$TUIKit.sendMessage(message, {
        offlinePushInfo: {
          disablePush: true,
        },
      }).then((res)=>{
        console.log(res,"触发了");
        util.request(api.chatLastTime, { uid: res.data.message.to }, 'post').then((ress)=>{
            console.log(ress,"记录时间")
        })
        if(this.data.firstSendMessage) {
				wx.aegis.reportEvent({
					    name: 'sendMessage',
					    ext1: 'sendMessage-success',
					    ext2: 'imTuikitExternal',
              ext3: app.globalData.SDKAppID
        })
      }
    }).catch((error) => {
    //     logger.log(`| TUI-chat | message-input | sendMessageError: ${error.code} `);
    //     wx.aegis.reportEvent({
    //       name: 'sendMessage',
    //       ext1: `sendMessage-failed#error: ${error}`,
    //       ext2: 'imTuikitExternal',
    //       ext3: app.globalData.SDKAppID
    // })
    //     this.triggerEvent('showMessageErrorImage', {
    //       showErrorImageFlag: error.code,
    //       message,
    //     });
      });
      this.setData({
        displayFlag: '',
        shareBoxBottom: 220,
      });
    },
    handleClose() {
      this.setData({
        displayFlag: '',
        shareBoxBottom: 220,
      });
    },
    handleServiceEvaluation() {
      this.setData({
        displayServiceEvaluation: true,
      });
    },
  },
});
