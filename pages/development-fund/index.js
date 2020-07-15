const AUTH = require('../../utils/auth');
const TOOLS = require('../../utils/tools');
Page({
    data: {
        DevelopmentFundTotalMoney: 0,
        DevelopmentFundMoney: 0,
        list: [],
        wxlogin: true,
    },
    pageSize: 20,
    pageIndex: 1,
    onLoad() {
        this.getDevelopmentFund();
        this.getUserMoney();
    },
    onShow() {
        this.pageIndex = 1;
        AUTH.checkHasLogined()
            .then((isLogin) => {
                if (isLogin) {
                    this.getDevelopmentFund();
                    this.getUserMoney();
                    return
                }
                this.setData({
                    wxlogin: false
                })
            })
    },
    afterAuth() {
        this.setData({
            wxlogin: true
        })
        this.getDevelopmentFund();
        this.getUserMoney();
    },
    closeAuth() {
        wx.navigateBack()
    },
    getDevelopmentFund() {
        AUTH.httpGet('user/DevelopmentFundList', {
            PageSize: this.pageSize,
            PageIndex: this.pageIndex,
        })
            .then((result) => {
                const list = result.rows.map((item, index) => {
                    const time = TOOLS.changeDateFormat(item.createTime);
                    return {...item, createTime: time}
                })
                this.setData({list})
            })
            .catch((err) => {

            })
    },
    getUserMoney(page) {
        AUTH.httpGet('user/GetAccountInfo')
            .then((result) => {
                this.setData(result.content);
            })
            .catch((err) => {

            })
    },
    scrollToBottom: function () {
        let _this = this;
        this.pageIndex++;
        // 获取订单列表
        _this.getDevelopmentFund();
    },
});
