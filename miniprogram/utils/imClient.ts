import TIM from 'tim-wx-sdk'
import TIMUploadPlugin from 'tim-upload-plugin'
import { EventBusInstance } from '../utils/eventBus';
const options = {
    //如新线上环境
    // SDKAppID: 1400686532
    //如新开发环境
    SDKAppID: 1400661803
    //本地环境
    // SDKAppID: 1400631764
};
const tim = TIM.create(options);
tim.setLogLevel(0);
tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
wx.$TUIKit = tim;
wx.$TUIKitTIM = TIM;
wx.$TUIKitEvent = TIM.EVENT
wx.$TUIKitVersion = TIM.VERSION
wx.$TUIKitTypes = TIM.TYPES

let readyCallback: any = null;
const sdkReady = (event: any) => {
    console.log('ready');
    tim.setMessageRead({ conversationID: 'C2Cadministrator' });
    // let nextReqMessageID:any=null;
    // const newsList=(()=>{
    //     let getList=tim.getMessageList({conversationID: 'C2Cadministrator',nextReqMessageID, count: 15});
    //     getList.then(function(imResponse:any) {
    //         const messageList = imResponse.data.messageList; // 消息列表。
    //         console.log('messageList======',messageList);
    //         nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
    //         const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。isCompleted 为 true 时，nextReqMessageID 为 ""。
    //         messageList.forEach((item:any)=>{
    //             if(item.isRead==false){
    //                 let payload=item.payload.text;
    //                 EventBusInstance.emit('notification', JSON.parse(payload));
    //             }
    //         });
    //         if(isCompleted){
    //             readyCallback=(()=>{
    //                 tim.setMessageRead({conversationID: 'C2Cadministrator'});
    //             })
    //             return;
    //         }else{
    //         let ishave= messageList.some((item:any)=>{
    //             item.isRead==true;
    //         });
    //         if(!ishave){
    //             newsList();
    //         }else{
    //         readyCallback=(()=>{
    //             tim.setMessageRead({conversationID: 'C2Cadministrator'});
    //         })
    //     }
    //     }
    //       });
    // })

}

const messageReceived = (event: any) => {
    console.log('message received', event)
    const payload = event.data[0].payload.text
    console.log('messagePayload', payload)
    EventBusInstance.emit('notification', JSON.parse(payload));
    if (readyCallback) {
        readyCallback();
    }

}


class ImClient {
    connected: boolean;
    tim: any;
    constructor(tim: any) {
        this.connected = false
        this.tim = tim
    }

    connect(loginInfo: any) {
        this.tim.on(TIM.EVENT.SDK_READY, sdkReady)
        this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, messageReceived)

        this.tim.login(loginInfo);
        this.connected = true
    }
    disconnect() {
        this.tim.logout();
        this.connected = false;
    }
    on(eventName: any, event: any) {
        this.tim.on(eventName, event);
    }
    off(eventName: any, event: any) {
        this.tim.off(eventName, event)
    }
}

const imClinet = new ImClient(tim);

export default imClinet
