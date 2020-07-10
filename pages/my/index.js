const app = getApp()
const AUTH = require('../../utils/auth')
Page({
    data: {
        score: 0,
        money: 0,
        hujianguo: 0,
        score_sign_continuous: 0,
        userInfo: null,
        wxlogin: true, //是否隐藏登录弹窗
        version: null,
        noticeList: [],
    },
    onLoad: function () {

    },
    onShow() {
        // 校验登录状态
        AUTH.checkHasLogined().then(isLogined => {
            if (isLogined) {
                this.getUserApiInfo();
                this.getUserAmount()
                return
            }
            this.setData({userInfo: null, wxlogin: false})
        })
        //更新订单状态
    },
    showAuth() {
        this.setData({
            wxlogin: false
        })
    },
    /*
     *授权登录成功后回调
     */
    afterAuth(e) {
        this.setData({
            wxlogin: true,
        });
        this.getUserApiInfo()
        this.getUserAmount()
    },
    getUserApiInfo: function () {
        let that = this;
        AUTH.httpGet('User/GetUserInfo', {},)
            .then((result) => {
                that.setData({userInfo: result.content})
            })
            .catch((err) => {

            })
    },
    getUserAmount: function () {
        AUTH.httpGet("user/GetAccountInfo")
            .then((result) => {
                const score = result.content.LessPoints;
                const hujianguo = result.content.LessMoney;
                const money = result.content.CpassTicketLessCount;
                this.setData({score, hujianguo, money})
            })
            .catch((err) => {

            })
    },
    score: function () {
        wx.navigateTo({
            url: "/pages/sign/index"
        })
    },
    navigateToPage(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        })
    }
})
