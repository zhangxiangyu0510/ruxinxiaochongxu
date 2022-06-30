var util = require('./util');
export function svgColor(url:string,color='#EBEBEB',type='fill'):any{
  return new Promise((resolve, reject) => {
    url = decodeURIComponent(url)
    if(url&&url.includes(`<svg style="${type}:`)){
      let colrValue:string = url.split(`<svg style="${type}:`)[1].slice(0,7);
     
      
      resolve(encodeURIComponent(url.replace(colrValue, color)))
    }else{
    if(url&&url.indexOf('http')>=0){
      util.request(url,'get',{},{'Content-Type':'binary'}).then((res:any)=>{
        url = decodeURIComponent(res.data)
     
      var svgFile = res.data;
      resolve(encodeURIComponent(svgFile.replace('<svg', '<svg style="'+type+':'+color+'"')))
     
    }).catch(err=>{
    })
  }else{
  let svgFile:any = wx.getFileSystemManager().readFileSync(url,'binary');
  resolve(encodeURIComponent(svgFile.replace('<svg', '<svg style="'+type+':'+color+'"')))
}
}
})
}
