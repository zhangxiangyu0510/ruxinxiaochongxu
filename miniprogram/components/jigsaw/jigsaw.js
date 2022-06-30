/* global Component wx */
const app1 = getApp();
Component({
    properties: {
        painting: {
            type: Object,
            value: {
                view: []
            },
            observer(newVal, oldVal) {
                if (!this.data.isPainting) {
                    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                        if (newVal && newVal.width && newVal.height) {
                            this.setData({
                                showCanvas: true,
                                isPainting: true
                            })
                            newVal.width = newVal.width * 4
                            newVal.height = newVal.height * 4
                            newVal.views.forEach(item => {
                                item.width = (item.width || 0) * 4
                                item.height = (item.height || 0) * 4
                                item.left = (item.left || 0) * 4
                                item.top = (item.top || 0) * 4
                                item.borderRadius = (item.borderRadius || 0) * 4
                                item.fontSize = (item.fontSize || 0) * 4
                                item.lineHeight = (item.lineHeight || 0) * 4
                            })
                            this.readyPigment()
                        }
                    } else {
                        if (newVal && newVal.mode !== 'same') {
                            this.triggerEvent('getImage', {
                                errMsg: 'canvasdrawer:samme params'
                            })
                        }
                    }
                }
            }
        },

    },
    data: {
        showCanvas: false,
        imageUrl:app1.globalData.imageUrl,
        width: 100,
        height: 100,
        tempFileList: [],
        isPainting: false,
        // painting: {},
        shareImage: '',
        goodsUrl: '',
        goods: {},
        // painting: []
    },

    ctx: null,
    cache: {},
    ready() {
        // console.log('ready');
        wx.removeStorageSync('canvasdrawer_pic_cache')
        this.cache = wx.getStorageSync('canvasdrawer_pic_cache') || {}

        this.ctx = wx.createCanvasContext('canvasdrawer', this)
            // this.getQrcode();
    },
    methods: {
        // 关闭分享
        closeShare() {
            this.triggerEvent('closeSharePosters')
        },
        goToClientSide() {
            let _userInfo = wx.getStorageSync('userInfo')
            wx.navigateToMiniProgram({
                appId: 'wxc179d89468d1a487',
                // path: 'pages/index/index?id=123',
                //   先放首页店铺id，等后h5有了再跳转详情
                path: `pages/shareInterim/shareInterim?id=${_userInfo.shop.id}`,
                extraData: {
                    foo: 'bar'
                },
                envVersion: 'trial',
                success(res) {
                    // 打开成功
                }
            })

        },
        getQrcode() {
            let that = this;
            // util.request(api.GetBase64, {
            //     goodsId: id
            // }, 'POST').then(function(res) {
            //     if (res.errno === 0) {
            //         that.getQrcodeJpg(res.data);
            //     }
            // });
            that.getQrcodeJpg();
        },
        getQrcodeJpg() {
            let that = this;
            let num = Math.floor(Math.random() * 50);
            // let promise = new Promise((resolve, reject) => {
            //     const filePath = wx.env.USER_DATA_PATH + '/temp_image' + num + '.jpeg';
            //     const buffer = wx.base64ToArrayBuffer(code);
            //     wx.getFileSystemManager().writeFile({
            //         filePath,
            //         data: buffer,
            //         encoding: 'binary',
            //         success() {
            //             that.getGoodsInfo(filePath);
            //         },
            //         fail() {
            //             reject(new Error('ERROR_BASE64SRC_WRITE'));
            //         },
            //     });
            // });
            that.getGoodsInfo();
        },
        getGoodsInfo() {
            let that = this;
            // let id = that.data.goodsid;
            // util.request(api.GoodsShare, {
            //     id: id
            // }).then(function(res) {
            //     if (res.errno === 0) {
            //         that.setData({
            //             goods: res.data,
            //         });
            //         that.eventDraw(qrcodeUrl);
            //     }
            // });
            that.eventDraw();
        },
        eventDraw() {
            let that = this;
            let goodsUrl = that.data.goodsUrl;
            let goods = that.data.goods;
            console.log(this.data.painting)

            this.setData({
                showCanvas: true,
                isPainting: true
            })
            this.readyPigment()
            this.triggerEvent('getImage', {
                errMsg: 'canvasdrawer:samme params'
            })
        },
        readyPigment() {
            const {
                width,
                height,
                views
            } = this.data.painting
            this.setData({
                width,
                height
            })
            const inter = setInterval(() => {
                if (this.ctx) {
                    clearInterval(inter)
                    this.ctx.clearActions()
                    this.ctx.save()
                    this.getImagesInfo(views)
                }
            }, 100)
        },
        getImagesInfo(views) {
            const imageList = []
            for (let i = 0; i < views.length; i++) {
                if (views[i].type === 'image') {
                    //     console.log(views[i].url)
                    imageList.push(this.getImageInfo(views[i].url))
                }
            }
            const loadTask = []
            for (let i = 0; i < Math.ceil(imageList.length / 8); i++) {
                loadTask.push(new Promise((resolve, reject) => {
                    Promise.all(imageList.splice(i * 8, 8)).then(res => {
                        resolve(res)
                    }).catch(res => {
                        reject(res)
                    })
                }))
            }
            Promise.all(loadTask).then(res => {
                let tempFileList = []
                for (let i = 0; i < res.length; i++) {
                    tempFileList = tempFileList.concat(res[i])
                }
                this.setData({
                    tempFileList
                })
                this.startPainting()
            })
        },
        startPainting() {
            // console.log('startPainting');
            const {
                tempFileList,
                painting: {
                    views
                }
            } = this.data
                // console.log(tempFileList)
            for (let i = 0, imageIndex = 0; i < views.length; i++) {
                // console.log(views[i]);
                // console.log(views[i].type);
                if (views[i].type === 'image') {
                    this.drawImage({
                        ...views[i],
                        url: tempFileList[imageIndex]
                    })
                    imageIndex++
                } else if (views[i].type === 'text') {
                    if (!this.ctx.measureText) {
                        wx.showModal({
                            title: '提示',
                            content: '当前微信版本过低，无法使用 measureText 功能，请升级到最新微信版本后重试。'
                        })
                        this.triggerEvent('getImage', {
                            errMsg: 'canvasdrawer:version too low'
                        })
                        return
                    } else {
                        this.drawText(views[i])
                    }
                } else if (views[i].type === 'rect') {
                    this.drawRect(views[i])
                } else if (views[i].type === 'arc') {
                    // ctx.arc(150, 150, 60, 0, 2 * Math.PI)
                    this.ctx.strokeStyle = '#fff';
                    const {
                        top = 0,
                            left = 0,
                            width = 0,
                            height = 0
                    } = views[i]
                    this.ctx.arc(left + width / 2, top + width / 2, width / 2, 0, 2 * Math.PI);
                    this.ctx.clip()
                    this.drawRect(views[i])
                    this.ctx.restore()

                    // this.ctx.stroke();
                    // this.ctx.clip()


                    // this.drawRect(views[i])

                    // ctx.drawImage(img, 90, 90, 120, 120)

                    // this.ctx.beginPath();
                    // this.ctx.lineWidth = 2;
                    // this.ctx.strokeStyle = '#fff';

                    // this.ctx.arc(122,80,  views[i].radius/2, 0, 2 * Math.PI);

                    // this.ctx.stroke();
                } else if (views[i].type === 'roundRect') {
                    this.darwRoundRect(views[i])
                }
            }
            // console.log('????????为什么');
            this.ctx.draw(false, () => {
                // console.log(this.cache);
                wx.setStorageSync('canvasdrawer_pic_cache', this.cache)
                const system = wx.getSystemInfoSync().system
                if (/ios/i.test(system)) {
                    this.saveImageToLocal()
                } else {
                    // 延迟保存图片，解决安卓生成图片错位bug。
                    setTimeout(() => {
                        this.saveImageToLocal()
                    }, 800)
                }
            })
        },
        drawImage(params) {
            // console.log('drawImage');
            this.ctx.save()
            const {
                url,
                top = 0,
                left = 0,
                width = 0,
                height = 0,
                borderRadius = 0,
                deg = 0
            } = params
            // if (borderRadius) {
            //   this.ctx.beginPath()
            //   this.ctx.arc(left + borderRadius, top + borderRadius, borderRadius, 0, 2 * Math.PI)
            //   this.ctx.clip()
            //   this.ctx.drawImage(url, left, top, width, height)
            // } else {
            if (deg !== 0) {
                this.ctx.translate(left + width / 2, top + height / 2)
                this.ctx.rotate(deg * Math.PI / 180)
                this.ctx.drawImage(url, -width / 2, -height / 2, width, height)
            } else {
                this.ctx.drawImage(url, left, top, width, height)
            }
            // }
            this.ctx.restore()
        },
        // 圆角矩形
        darwRoundRect(params) {
            const {
                y = params.top,
                    x = params.left,
                    w = params.width,
                    h = params.height,
                    r = params.borderRadius,
                    background,
                    borderColor = params.borderColor,

            } = params
            this.ctx.save()
            this.ctx.beginPath()
                // 左上弧线
            this.ctx.arc(x + r, y + r, r, 1 * Math.PI, 1.5 * Math.PI)
                // 左直线
            this.ctx.moveTo(x, y + r)
            this.ctx.lineTo(x, y + h - r)
                // 左下弧线
            this.ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, 1 * Math.PI)
                // 下直线
            this.ctx.lineTo(x + r, y + h)
            this.ctx.lineTo(x + w - r, y + h)
                // 右下弧线
            this.ctx.arc(x + w - r, y + h - r, r, 0 * Math.PI, 0.5 * Math.PI)
                // 右直线
            this.ctx.lineTo(x + w, y + h - r)
            this.ctx.lineTo(x + w, y + r)
                // 右上弧线
            this.ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI)
                // 上直线
            this.ctx.lineTo(x + w - r, y)
            this.ctx.lineTo(x + r, y)
            this.ctx.setFillStyle(background)
            this.ctx.fill()
        },


        drawText(params) {
            // console.log('drawText');
            this.ctx.save()
                // console.log('drawText');
            const {
                MaxLineNumber = 2,
                    breakWord = false,
                    color = 'black',
                    content = '',
                    fontSize = 16,
                    top = 0,
                    left = 0,
                    lineHeight = 20,
                    textAlign = 'left',
                    width,
                    bolder = false,
                    textDecoration = 'none'
            } = params

            this.ctx.beginPath()
            this.ctx.setTextBaseline('top')
            this.ctx.setTextAlign(textAlign)
            this.ctx.setFillStyle(color)
            this.ctx.setFontSize(fontSize)

            if (!breakWord) {
                this.ctx.fillText(content, left, top)
                this.drawTextLine(left, top, textDecoration, color, fontSize, content)
            } else {
                let fillText = ''
                let fillTop = top
                let lineNum = 1
                for (let i = 0; i < content.length; i++) {
                    fillText += [content[i]]
                    if (this.ctx.measureText(fillText).width > width) {
                        if (lineNum === MaxLineNumber) {
                            if (i !== content.length) {
                                fillText = fillText.substring(0, fillText.length - 1) + '...'
                                this.ctx.fillText(fillText, left, fillTop)
                                this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
                                fillText = ''
                                break
                            }
                        }
                        this.ctx.fillText(fillText, left, fillTop)
                        this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
                        fillText = ''
                        fillTop += lineHeight
                        lineNum++
                    }
                }
                this.ctx.fillText(fillText, left, fillTop)
                this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
            }
            this.ctx.restore()
            if (bolder) {
                this.drawText({
                    ...params,
                    left: left + 0.3,
                    top: top + 0.3,
                    bolder: false,
                    textDecoration: 'none'
                })
            }
        },
        drawTextLine(left, top, textDecoration, color, fontSize, content) {
            if (textDecoration === 'underline') {
                this.drawRect({
                    background: color,
                    top: top + fontSize * 1.2,
                    left: left - 1,
                    width: this.ctx.measureText(content).width + 3,
                    height: 1
                })
            } else if (textDecoration === 'line-through') {
                this.drawRect({
                    background: color,
                    top: top + fontSize * 0.6,
                    left: left - 1,
                    width: this.ctx.measureText(content).width + 3,
                    height: 1
                })
            }
        },
        drawRect(params) {
            this.ctx.save()
            const {
                background,
                top = 0,
                left = 0,
                width = 0,
                height = 0,
                borderRadius = 0,
                borderColor = ''
            } = params
            if (borderRadius) {
                this.ctx.beginPath()
                this.ctx.arc(left + borderRadius, top + borderRadius, borderRadius, 0, 2 * Math.PI)
            }
            if (borderColor) {
                this.ctx.lineWidth = 1; //设置边框大写
                // this.ctx.fillStyle = "yellow";//填充实体颜色
                this.ctx.strokeStyle = borderColor; //填充边框颜色
                this.ctx.strokeRect(left, top, width, height); //对边框的设置
            }
            this.ctx.setFillStyle(background)
            this.ctx.fillRect(left, top, width, height)
            this.ctx.restore()
        },
        getImageInfo(url) {
            return new Promise((resolve, reject) => {
                if (this.cache[url]) {
                    resolve(this.cache[url])
                } else {
                    const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
                    if (objExp.test(url)) {
                        wx.getImageInfo({
                            src: url,
                            complete: res => {
                                // console.log(res.errMsg);
                                if (res.errMsg === 'getImageInfo:ok') {
                                    this.cache[url] = res.path
                                    resolve(res.path)
                                } else {
                                    this.triggerEvent('getImage', {
                                        errMsg: 'canvasdrawer:download fail'
                                    })
                                    reject(new Error('getImageInfo fail'))
                                }
                            }
                        })
                    } else {
                        this.cache[url] = url
                        resolve(url)
                    }
                }
            })
        },
        saveImageToLocal() {
            // console.log('saveImageToLocal');
            const {
                width,
                height
            } = this.data
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width,
                height,
                canvasId: 'canvasdrawer',
                complete: res => {
                    if (res.errMsg === 'canvasToTempFilePath:ok') {
                        this.setData({
                            showCanvas: false,
                            isPainting: false,
                            tempFileList: []
                        })
                        const data = {
                            tempFilePath: res.tempFilePath,
                            errMsg: 'canvasdrawer:ok'
                        }

                        this.eventGetImage(data)
                            // this.triggerEvent('getImage', {
                            //     tempFilePath: res.tempFilePath,
                            //     errMsg: 'canvasdrawer:ok'
                            // })
                    } else {
                        const data = {
                            errMsg: 'canvasdrawer:fail'
                        }
                        this.eventGetImage(data)
                            // this.triggerEvent('getImage', {
                            //     errMsg: 'canvasdrawer:fail'
                            // })
                    }
                }
            }, this)
        },
        eventGetImage(data) {
            //   wx.hideLoading()
            const {
                tempFilePath,
                errMsg
            } = data
            if (errMsg === 'canvasdrawer:ok') {
                this.setData({
                    shareImage: tempFilePath
                })
                this.triggerEvent('givePicture', tempFilePath)
            }
        },
        eventSave() {
            wx.saveImageToPhotosAlbum({
                filePath: this.data.shareImage,
                success(res) {
                    wx.showToast({
                        title: '保存图片成功',
                        icon: 'success',
                        duration: 2000
                    })
                }
            })
        },
    }
})