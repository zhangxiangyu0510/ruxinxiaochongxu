let messageObj:any={
    removeNews:function(messageIds:string){
        let removeArr= this.allNews.filter((item:any)=>{
            return item.messageId!=messageIds
        });
        this.allNews=removeArr;
        console.log('delete======',this.allNews);
        wx.setStorageSync('globalMessage',this.allNews);
    },
    addNews:function(argument:any){
        let currentObj=Object.assign({},argument);
        console.log('argument=======',argument)
        if (!currentObj.messageType) return
        this.allNews.push(currentObj);
        wx.setStorageSync('globalMessage',this.allNews);

    },
    getAllNews:function(){
        let currentArr=[];
        for(let i=0;i<this.allNews.length;i++){
            if(this.messageIds.includes(this.allNews[i].messageId)){
                continue;
            }
            currentArr.push(Object.assign({},this.allNews[i]))
        }
        return currentArr
    },
    removeOnBeforeLanch(id:any){
        this.messageIds.push(id);
    },
    allNews:[],
    messageIds:[],
}
if(wx.getStorageSync('globalMessage')){
    messageObj.allNews=wx.getStorageSync('globalMessage');
}
export {messageObj};