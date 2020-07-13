const CONFIG = require('../../config');
const AUTH = require('../../utils/auth');
Page({
    data: {
        baseUrl: CONFIG.url,
        wxlogin: true,
    },
    onLoad() {
        let _this = this;
        this.setHeight();
        AUTH.checkHasLogined()
            .then((isLogin) => {
                if (!isLogin) {
                    _this.setData({wxlogin: false})
                    return
                }
                _this.userID = wx.getStorageSync('Uid')
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
        console.log(this.userID)
        let _this = this;
        return {
            title: "予弄惠，优惠多多，快来购物吧",
            path: "/pages/my/index?reid=" + _this.userID
        };
    },
})
