const app = getApp()
const AUTH = require('../../utils/auth')
Page({
    data: {
        score: 0,  //已到积分
        unscore: 0,  //未到积分
        money: 0,    //  已经到的通政票
        unmoney: 0,  //  未到的通政票
        hujianguo: 0,   // 已经到账的虎坚果
        unhujianguo: 0,  // 未到账 虎坚果
        score_sign_continuous: 0,
        userInfo: null,
        wxlogin: true, //是否隐藏登录弹窗
        version: null,
        noticeList: [],
        isSignIn: false,


        DaiFaHuo: 0,
        DaiFenXiang: 0,
        DaiShouHuo: 0,
        DaiZhiFu: 0,
        QuanBu: 0,
    },
    onLoad: function (e) {
        console.log(e,"============")
        if (e.reid) {
            wx.setStorageSync('reid', e.reid);
        }
    },
    onShow() {
        // 校验登录状态
        AUTH.checkHasLogined().then(isLogined => {
            if (isLogined) {
                this.getUserApiInfo();
                this.getUserAmount()
                this.isSignIn();
                this.getOrderNum();
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
    getOrderNum() {
        AUTH.httpGet("order/GetOrderStateCount")
            .then((result) => {
                this.setData(result.content);
            })
            .catch((err) => {

            })
    },
    isSignIn() {
        AUTH.httpGet("user/GetSignInTodayFlag")
            .then((result) => {
                this.setData({isSignIn: result.content});
            })
            .catch()
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
                const score = result.content.LessPoints;  // 积分
                const unscore = result.content.UnPoints;  //
                const hujianguo = result.content.LessMoney;  // 虎坚果
                const unhujianguo = result.content.UnMoney;
                const money = result.content.CpassTicketLessCount;
                const unmoney = result.content.UnCpassTicketLessCount; // 通政票
                this.setData({score, hujianguo, money, unscore, unhujianguo,unmoney})
            })
            .catch((err) => {
                console.log(err,'err');
            })
    },
    score: function () {
        wx.navigateTo({
            url: "/pages/sign/index"
        })
    },
    loginOut() {
        let _this = this;
        wx.showModal({
            title: '提示',
            content: '确认退户当前用户?',
            cancelText: '取消',
            confirmText: '退出',
            success(res) {
                if (res.confirm) {
                    AUTH.httpPost('outapi/LoginOut')
                        .then((result) => {
                            wx.showToast({
                                title: '注销用户成功', success: () => {
                                    wx.switchTab({url: "/pages/index/index"})
                                }
                            })
                            AUTH.loginOut();
                        })
                }
            }
        })
    },
    navigateToPage(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        })
    },
    userInfoSet(e) {
        wx.navigateTo({
          url: '/pages/userInfo/userInfo',
        })
    }
})
