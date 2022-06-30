/* global Component wx */
var Api = require('../../config/api')
const app1 = getApp();
Component({
    properties: {
        painting: {
            type: Object,
            value: {
                view: []
            },
            observer(newVal, oldVal) {

                this.setData({
                    propertiesAccomplish: false,
                })
                if (!this.data.isPainting) {
                    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                        this.setData({
                            type: String(newVal.type)
                        })
                        let _levelImage = wx.getStorageSync('levelImage')
                        if (_levelImage && newVal.type == 2) {
                            let canvasBg = {
                                type: 'image',
                                url: _levelImage,
                                left: 154,
                                top: 114,
                                width: 20,
                                height: 20,
                            }
                            let _levelBg = {
                                background: "#fff",
                                height: "30",
                                left: 149,
                                top: 109,
                                type: "arc",
                                width: "30",
                            }
                            newVal.views.push(_levelBg)
                            // newVal.views.splice(1, 0, canvasBg)
                            newVal.views.push(canvasBg)
                        }
                        if (newVal.type != 1) {
                            let _bgColor = wx.getStorageSync('themeColor')
                            if (_bgColor) {
                                let rgbaArry = []
                                rgbaArry.push(
                                    `rgba(${parseInt('0x'+_bgColor.slice(1, 3))},${parseInt('0x'+_bgColor.slice(3, 5))},${parseInt('0x'+_bgColor.slice(5, 7))},${0.1})`
                                )
                                let zhuTiSe = {
                                    type: newVal.views[0].type,
                                    top: newVal.views[0].top,
                                    left: newVal.views[0].left,
                                    width: newVal.views[0].width,
                                    height: newVal.views[0].height,
                                }
                                zhuTiSe.background = rgbaArry[0] || '#ffffff'
                                newVal.views.splice(1, 0, zhuTiSe)
                            }

                            newVal.views.forEach(item => {

                                if (!item.color && !item.background) {
                                    item.background = wx.getStorageSync('themeColor')
                                    item.color = wx.getStorageSync('themeColor')
                                }
                            });

                            if (newVal.type == 2) {
                                let _canvasBg = wx.getStorageSync('canvasBg')
                                if (_canvasBg) {
                                    if (!_canvasBg.includes('http')) {
                                        _canvasBg = 'https://' + _canvasBg
                                    }
                                    let canvasBg = {
                                        type: 'image',
                                        url: _canvasBg,
                                        top: 0,
                                        left: 0,
                                        width: newVal.width,
                                        height: newVal.height,
                                    }
                                    newVal.views.splice(1, 0, canvasBg)
                                }
                            }
                        }
                        newVal.width = newVal.width * 2
                        newVal.height = newVal.height * 2
                        newVal.views.forEach(item => {
                            item.width = (item.width || 0) * 2
                            item.height = (item.height || 0) * 2
                            item.left = (item.left || 0) * 2
                            item.top = (item.top || 0) * 2
                            item.borderRadius = (item.borderRadius || 0) * 2
                            item.fontSize = (item.fontSize || 0) * 2
                            item.lineHeight = (item.lineHeight || 0) * 2
                        })
                        if (newVal && newVal.width && newVal.height) {
                            this.setData({
                                showCanvas: true,
                                isPainting: true
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
        wxQrcodeData: {
            type: Object,
            value: {},
            observer(newVal, oldVal) {
                this.setData({
                    wxQrcodeAccomplish: false
                })
                if (newVal.url && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                    var {
                        url,
                        top = 0,
                        left = 0,
                        width = 0,
                        height = 0,
                        borderRadius = 0,
                        deg = 0,
                        isBase64 = false
                    } = newVal
                    var that = this
                    // url = wx.base64ToArrayBuffer(url)
                    const FILE_BASE_NAME = new Date().getTime();
                    let fsm = wx.getFileSystemManager() //文件管理器
                    let format = 'png' //文件后缀
                    let buffer = wx.base64ToArrayBuffer(url) //base 转二进制
                    let filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`; //文件名
                    fsm.writeFile({ //写文件
                        filePath,
                        data: buffer,
                        encoding: 'binary',
                        success(res) {
                            wx.getImageInfo({ //读取图片
                                src: filePath,
                                success: function (ress) {
                                    url = ress.path

                                    if (that.data.propertiesAccomplish) {
                                        if (borderRadius) {
                                            that.ctx.beginPath()
                                            that.ctx.arc(left + borderRadius, top + borderRadius, borderRadius, 0, 2 * Math.PI)
                                            that.ctx.clip()
                                            that.ctx.drawImage(url, left, top, width, height)
                                        } else {
                                            if (deg !== 0) {
                                                that.ctx.translate(left + width / 2, top + height / 2)
                                                that.ctx.rotate(deg * Math.PI / 180)
                                                that.ctx.drawImage(url, -width / 2, -height / 2, width, height)
                                            } else {
                                                that.ctx.drawImage(url, left * 2, top * 2, width * 2, height * 2)
                                            }
                                        }
                                        that.ctx.restore()
                                        that.outputImage()
                                    } else {
                                        setTimeout(() => {
                                            that.drawAgain(newVal)
                                        }, 500);

                                    }
                                },

                            })


                        }
                    })
                }

            }
        },
        isgoods: {
            type: Boolean,
            value: false,
        },
        goodsInfo: {
            type: Object,
            value: {},
        },
        levelImageValue:{
            type: String,
            value: '',
        },
        h5GoodsInfo: {
            type: Object,
            value: {},
        },

    },
    data: {
        timeNumber: 0,
        eventSaveTimeNumber: 0,
        type: '',
        wxQrcodeAccomplish: false,
        propertiesAccomplish: false,
        imageUrl: app1.globalData.imageUrl,
        addHeight: 80,
        showCanvas: false,
        width: 100,
        height: 100,
        tempFileList: [],
        isPainting: false,
        // painting: {},
        shareImage: '',
        goodsUrl: '',
        goods: {},
        appidData: {
            'wxee071c2a11cedd1b': 'wxdc9105901fd53026', //172
            'wxc0e6a1cbe908790b': 'wxad1040bcdfcb9bda', //dev
            'wx5a9036a629064441': 'wxc179d89468d1a487', //qa
            'wx99682bbd6fd2a91e': 'wx3dcf11f9f91e5c27', //stage
        }

        // painting: []
    },

    ctx: null,
    cache: {},
    ready() {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 1000
        })
        // console.log('ready');
        wx.removeStorageSync('canvasdrawer_pic_cache')
        this.cache = wx.getStorageSync('canvasdrawer_pic_cache') || {}

        this.ctx = wx.createCanvasContext('canvasdrawer', this)
        // this.getQrcode();
    },
    methods: {
        // 处理网速慢的情况
        drawAgain(newVal) {
            var {
                url,
                top = 0,
                left = 0,
                width = 0,
                height = 0,
                borderRadius = 0,
                deg = 0,
                isBase64 = false
            } = newVal
            var that = this
            // url = wx.base64ToArrayBuffer(url)
            const FILE_BASE_NAME = new Date().getTime();
            let fsm = wx.getFileSystemManager() //文件管理器
            let format = 'png' //文件后缀
            let buffer = wx.base64ToArrayBuffer(url) //base 转二进制
            let filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`; //文件名
            fsm.writeFile({ //写文件
                filePath,
                data: buffer,
                encoding: 'binary',
                success(res) {
                    wx.getImageInfo({ //读取图片
                        src: filePath,
                        success: function (ress) {
                            url = ress.path
                            if (that.data.propertiesAccomplish) {
                                if (borderRadius) {
                                    that.ctx.beginPath()
                                    that.ctx.arc(left + borderRadius, top + borderRadius, borderRadius, 0, 2 * Math.PI)
                                    that.ctx.clip()
                                    that.ctx.drawImage(url, left, top, width, height)
                                } else {
                                    if (deg !== 0) {
                                        that.ctx.translate(left + width / 2, top + height / 2)
                                        that.ctx.rotate(deg * Math.PI / 180)
                                        that.ctx.drawImage(url, -width / 2, -height / 2, width, height)
                                    } else {
                                        that.ctx.drawImage(url, left * 2, top * 2, width * 2, height * 2)
                                    }
                                }
                                that.ctx.restore()
                                that.outputImage()
                            } else {
                                that.setData({
                                    timeNumber: that.data.timeNumber + 1
                                })
                                if (that.data.timeNumber > 5) {
                                    return
                                }
                                setTimeout(() => {
                                    that.drawAgain(newVal)
                                }, 1000);

                            }
                        },

                    })


                }
            })
        },
        // 关闭分享
        closeShare() {
            this.triggerEvent('closeSharePosters')
        },
        goToClientSide() {
            let _shareKey = wx.getStorageSync('shareKey')
            let _goodsInfo = this.data.goodsInfo
            let _h5GoodsInfo = this.data.h5GoodsInfo
            let _id = _goodsInfo.id || _goodsInfo.officialRecommendationId
            let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
            let _params = ''
            if (_h5GoodsInfo.finalCatalog) {
                _params = _h5GoodsInfo.finalCatalog[0].id + "," + _h5GoodsInfo.itemPrice[0].itemId + ',' + _h5GoodsInfo.itemType + ',' + _h5GoodsInfo.itemImages[0].fileUrl + ',' + _h5GoodsInfo.name
            }

            if (_goodsInfo.catalogId) {
                _params = _goodsInfo.catalogId + "," + _goodsInfo.itemId + ',' + _goodsInfo.itemType + ',' + _goodsInfo.itemImage + ',' + _goodsInfo.itemName
            }
            // _path = `packageOne/pages/productDetail/productDetail?shopId=${userInfo.shop.id}
            let _themeColor = wx.getStorageSync('themeColor').substring(1)
            let _path = `packageOne/pages/shareInterim/shareInterim?isShop=true&shopId=${userInfo.shop.id}&id=${_id || ''}&isOfficial=${_goodsInfo.isOfficial || false}&shareKey=${_shareKey}&h5Share=${_params}&tc=${_themeColor}`
            let _appid = ''
            if (Api.ApiRootUrl.includes('myshop-dev.cn.nuskin.com')) {
                _appid = 'wxad1040bcdfcb9bda'
            } else if (Api.ApiRootUrl.includes('myshop-test.cn.nuskin.com')) {
                _appid = 'wxc179d89468d1a487'
            } else if (Api.ApiRootUrl.includes('stage')) {
                _appid = 'wx3dcf11f9f91e5c27'
            } else if (Api.ApiRootUrl.includes('124')) {
                _appid = 'wxdc9105901fd53026'
            } else if (Api.ApiRootUrl.includes('myshop.cn.nuskin.com')) {
                _appid = 'wx27861eac4fb9698d'
            }
            wx.navigateToMiniProgram({
                appId: _appid,
                // path: 'pages/index/index?id=123',
                path: _path,
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
            if (this.data.painting.height > 800) {
                this.setData({
                    addHeight: 160
                })
            } else {
                this.setData({
                    addHeight: 80
                })
            }
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
            }, 200)
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

            // for (let i = 0; i < Math.ceil(imageList.length / 8); i++) {
            //     loadTask.push(new Promise((resolve, reject) => {
            //         Promise.all(imageList.splice(i * 8, 8)).then(res => {

            //             resolve(res)
            //         }).catch(res => {
            //             reject(res)
            //         })
            //     }))
            // }

            Promise.all(imageList).then(res => {
                // let tempFileList = []
                // for (let i = 0; i < res.length; i++) {
                //     tempFileList = tempFileList.concat(res[i])
                // }
                this.setData({
                    tempFileList: res
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
            // if (this.data.wxQrcodeAccomplish) {
            //     this.outputImage()
            // } else {
            this.setData({
                propertiesAccomplish: true
            })
            // }

            // console.log('????????为什么');

        },
        outputImage() {
            this.setData({
                timeNumber: 0
            })
            this.ctx.draw(false, () => {
                // console.log(this.cache);
                wx.setStorageSync('canvasdrawer_pic_cache', this.cache)
                const system = wx.getSystemInfoSync().system
                if (/ios/i.test(system)) {
                    this.saveImageToLocal()
                    // this.saveImageToLocal()
                } else {
                    // 延迟保存图片，解决安卓生成图片错位bug。
                    setTimeout(() => {
                        this.saveImageToLocal()
                    }, 200)
                }
            })
            // wx.hideToast();
        },
        drawImage(params) {
            // console.log('drawImage');
            this.ctx.save()
            var {
                url,
                top = 0,
                left = 0,
                width = 0,
                height = 0,
                borderRadius = 0,
                deg = 0,
                isBase64 = false
            } = params
            if (borderRadius) {
                this.ctx.beginPath()
                this.ctx.arc(left + borderRadius, top + borderRadius, borderRadius, 0, 2 * Math.PI)
                this.ctx.clip()
                this.ctx.drawImage(url, left, top, width, height)
            } else {
                if (deg !== 0) {
                    this.ctx.translate(left + width / 2, top + height / 2)
                    this.ctx.rotate(deg * Math.PI / 180)
                    this.ctx.drawImage(url, -width / 2, -height / 2, width, height)
                } else {
                    this.ctx.drawImage(url, left, top, width, height)
                }
            }
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
                    textDecoration = 'none',
                    bold = false
            } = params
            if (bold) {
                this.ctx.font = 'bold 14px normal';
            }
            this.ctx.beginPath()
            this.ctx.setTextBaseline('top')
            this.ctx.setTextAlign(textAlign)
            this.ctx.setFillStyle(color)
            this.ctx.setFontSize(fontSize)

            if (!breakWord) {
                if (textAlign == 'center') {
                    this.ctx.fillText(content, width / 2, top)
                } else {
                    this.ctx.fillText(content, left, top)
                }
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
                                    // wx.showToast({
                                    //     title: '海报生成失败，请稍后再试',
                                    //     icon: 'none',
                                    //     duration: 2000
                                    // })
                                    console.log('失败的图片', url)
                                    // this.triggerEvent('getImage', {
                                    //     errMsg: 'canvasdrawer:download fail'
                                    // })
                                    resolve(url)
                                    // reject(new Error('getImageInfo fail'))
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
            // wx.hideLoading()
            const {
                tempFilePath,
                errMsg
            } = data
            if (errMsg === 'canvasdrawer:ok') {
                this.setData({
                    shareImage: tempFilePath
                })

            }
        },
        eventSave() {
            let that = this
            wx.getSetting({
                success(res) {
                    console.log(res.authSetting['scope.writePhotosAlbum'], res)
                    if (res.authSetting['scope.writePhotosAlbum'] || res.authSetting['scope.writePhotosAlbum'] == undefined) {
                        console.log("1111", res[0])
                        if (that.data.shareImage) {
                            that.setData({
                                eventSaveTimeNumber: 0
                            })
                            wx.saveImageToPhotosAlbum({
                                filePath: that.data.shareImage,
                                success: (e) => {
                                    wx.showToast({
                                        title: '保存成功',
                                        duration: 2000
                                    });
                                },
                                fail: (e) => {
                                    console.log("失败", e)
                                }
                            })
                        } else {
                            that.setData({
                                eventSaveTimeNumber: that.data.eventSaveTimeNumber + 1
                            })
                            if (that.data.eventSaveTimeNumber > 5) {
                                wx.showToast({
                                    title: '请稍等图片生成中',
                                    duration: 2000
                                });
                                return
                            }
                            setTimeout(() => {
                                that.eventSave()
                            }, 500);
                        }
                    } else {
                        wx.showModal({
                            title: '',
                            content: '检测到您没打开保存图片到相册的权限，是否去设置打开?',
                            success(res) {
                                if (res.confirm) {
                                    wx.openSetting({
                                        success(res) {}
                                    })
                                } else if (res.cancel) {}
                            }
                        })

                    }
                }
            })
            // wx.saveImageToPhotosAlbum({
            //     filePath: this.data.shareImage,
            //     success(res) {
            //         wx.showToast({
            //             title: '保存图片成功',
            //             icon: 'success',
            //             duration: 2000
            //         })
            //     }
            // })
        },
    }
})