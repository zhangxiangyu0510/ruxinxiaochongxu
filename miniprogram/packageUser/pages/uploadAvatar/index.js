import WeCropper from './we-cropper.min.js'
// import weDebug from '@we-debug/core/libs/index'
var api = require('../../../config/api')
var util = require('../../../utils/util');
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({
  data: {
    themeColor:wx.getStorageSync('themeColor'),
    cropperOpt: {
      id: 'cropper',
      targetId: 'targetCropper',
      pixelRatio: device.pixelRatio,
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      },
      boundStyle: {
        mask: 'rgba(0,0,0,0.8)',
        lineWidth: 1
      }
    }
  },
  touchStart (e) {
    this.cropper.touchStart(e)
  },
  touchMove (e) {
    this.cropper.touchMove(e)
  },
  touchEnd (e) {
    this.cropper.touchEnd(e)
  },
  getUploadUrl() {
    return new Promise(function (resolve) {
      util.request(api.UploadAvatar).then((res) => {
        resolve(res)
      })
    })
  },
  getCropperImage () {
    let that = this
    this.cropper.getCropperImage(function (path, err) {
      if (err) {
        wx.showModal({
          title: '温馨提示',
          content: err.message
        })
      } else {
        // weDebug.event.emit('avatar:finish', path)
        
        that.getUploadUrl().then(ress => {
          let url = ress.data.downloadUrl
          wx.getFileSystemManager().readFile({
            filePath: path,
            success(data) {
              util.request(ress.data.uploadUrl, data.data, "PUT", { 'Content-Type': 'image/' + path.split('.')[1] }).then(() => {
                console.log("成功了");
                var pages  = getCurrentPages();
                console.log(pages ,"88888");
                var prevPage = pages[pages.length - 2];
                prevPage.setData({
                  avatar: path,
                  uploadUrl: url
                })
                wx.navigateBack({
                  delta: 1
                });
              })
            }
          })
        })
        
      }
    })
  },
  uploadTap () {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.cropper.pushOrign(src)
      }
    })
  },
  onLoad (option) {
    console.log(option,"mmmmmmmmmm");
    const { cropperOpt } = this.data
    this.setData({ cropperOpt })

    if (option.src) {
      cropperOpt.src = option.src
      this.cropper = new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          console.log(`picture loaded`)
          console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          console.log(`before canvas draw,i can do something`)
          console.log(`current canvas context:`, ctx)
        })
    }
  }
})
