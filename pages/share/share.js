const CONFIG = require('../../config');
const AUTH = require('../../utils/auth');
Page({
    data: {
        baseUrl: CONFIG.url,
        wxlogin: true,
        qrCode: "",
    },
    qrcode: "",
    onLoad() {
        let _this = this;
        this.setHeight();
        AUTH.checkHasLogined()
            .then((isLogin) => {
                if (!isLogin) {
                    _this.setData({wxlogin: false})
                    return
                }
                _this.userID = wx.getStorageSync('Uid');
                _this.getQrCode();
            })
    },
    userID: 0,
    /**
     * 设置页面高度
     */
    setHeight: function () {
        let _this = this;
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    pageHeight: res.windowHeight,
                });
            }
        });
    },
    /*
    *授权登录成功后回调
    */
    afterAuth(e) {
        this.setData({
            wxlogin: true,
        });
        this.userID = wx.getStorageSync('Uid')

    },
    getUserInfo() {
        AUTH.httpGet("User/GetUserInfo")
            .then((result) => {
                this.userID = result.content.Uid;
            })
            .catch((err) => {

            })
    },
    /**
     * 分享当前页面
     */
    onShareAppMessage: function () {
        // 构建页面参数
        let _this = this;
        return {
            title: "予农惠，优惠多多，快来购物吧",
            path: "/pages/my/index?reid=" + _this.userID
        };
    },
    /**
     * 获取二维码
     */
    getQrCode() {
        AUTH.httpGet("user/GetReCode", {page: "pages/my/index", scene: `reid=${this.userID}`})
            .then((result) => {
                let url = 'data:image/png;base64,' + result.content;
                this.qrcode = result.content;
                this.setData({qrCode: url})
            })
            .catch((err) => {

            })
    },
    /**
     * 检查是否有相册权限
     */
    checkAuthorize() {
        wx.showLoading();
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    this.authorizePhoto();
                } else {
                    this.saveToFile();
                }
            }
        })
    },
    /**
     * 授权相册权限
     */
    authorizePhoto() {
        wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
                this.saveToFile();
            },
            fail: (err) => {
                wx.hideLoading();
                wx.showModal({
                    title: '提示',
                    content: '若点击不授权，将无法保存图片',
                    cancelText: '不授权',
                    confirmText: '授权',
                    success: (res) => {
                        if (res.confirm) {
                            wx.openSetting({
                                success: (res) => {

                                }
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }
        })
    },
    /**
     * 暂存到文件、保存到相册
     */
    saveToFile() {
        const _this = this;
        const time = new Date().getTime();
        wx.getFileSystemManager().writeFile({
            filePath: `${wx.env.USER_DATA_PATH}/qrcode_${time}.png`,
            data: _this.qrcode,
            encoding: "base64",
            success: (res) => {
                wx.saveImageToPhotosAlbum({
                    filePath: `${wx.env.USER_DATA_PATH}/qrcode_${time}.png`,
                    success: () => {
                        wx.hideLoading();
                        wx.showToast({
                            title: "保存成功"
                        });
                    },
                    fail: (err) => {
                        wx.hideLoading();
                        if (!err.errMsg.includes("cancel")) {
                            wx.showToast({
                                title: err.errMsg, icon: "none"
                            });
                        }
                    },
                    complete: () => {

                    }
                })
            },
            fail: (err) => {
                wx.hideLoading();
            },
        })
    }
})
