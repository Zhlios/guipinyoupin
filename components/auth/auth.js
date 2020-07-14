const app = getApp();
const authUtils = require('../../utils/auth')
Component({
    openIdContent: null,
    didClick: false,
    options: {
        addGlobalClass: true
    },
    data: {
        openId: '',
        logo: '',
        reid: '',
    },
    userInfo: null,
    properties: {
        isHidden: {
            type: Boolean,
            value: true,
        }
    },
    lifetimes: {
        attached() {
            const that = this
            wx.getStorage({
                key: 'reid', success(res) {
                    that.setData({
                        reid: res.data
                    })
                }
            });
        }
    },
    methods: {
        close() {
            this.setData({
                isHidden: true,
            })
            this.triggerEvent('closeAuth');
        },
        pageClose() {
            this.triggerEvent('afterAuth');
        },
        bindGetUserInfo(e) {
            if (!e.detail.userInfo) {
                return;
            }
            this.userInfo = e.detail.userInfo;
            this.login();
        },
        login() {
            const that = this;
            wx.login({
                success(res) {
                    authUtils.httpPost("outapi/GetUsrOpenID", {code: res.code})
                        .then((result) => {
                            that.didClick = false;
                            that.openIdContent = result.content;
                            that.setData({openId: result.content.openid})
                        })
                        .catch()
                }
            })
        },
        bindgetphonenumber: function (e) {
            let that = this;
            const userInfo = that.userInfo;
            wx.showLoading({title: "正在手机号码登录", mask: true});
            const params = {
                openid: that.data.openId,
                iv: e.detail.iv,
                data: e.detail.encryptedData,
                reid: wx.getStorageSync('reid'),
                oath_token: that.openIdContent.oath_token,
                timestamp: that.openIdContent.timestamp,
                session_key: that.openIdContent.session_key,
                nickName: userInfo.nickName,
            }
            console.log(params,'params');
            authUtils.httpPost("outapi/LoginByOpenId", params)
                .then((res) => {
                    console.log(res,'res');
                    wx.setStorageSync("Uid", res.content.Uid);
                    wx.setStorageSync("token", res.content.UserToken);
                    wx.setStorageSync("userImg", userInfo.avatarUrl);
                    wx.removeStorageSync("reid");
                    that.pageClose();
                    authUtils.imgToBase64(userInfo.avatarUrl, function () {
                        that.setData({openId: ""})
                    })
                })
                .catch((err) => {

                })
        },
    }
})
