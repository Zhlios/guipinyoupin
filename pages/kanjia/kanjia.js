const AUTH = require('../../utils/auth')
const CONFIG = require('../../config.js')
const TOOL = require('../../utils/tools.js')

Page({
    data: {
        imagePath: CONFIG.imagePath,
        img220:CONFIG.imgType.img220,
        pageHeight: 0,
        message: {},
        isSelf: true,
    },
    bid: 0,
    onLoad(options) {
        let _this = this;
        _this.bid = options.bid;
        _this.setHeight();
        _this.getBargainMessage();
    },
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
    /**
     * 获取砍价商品详情
     */
    getBargainMessage: function () {
        let _this = this;
        AUTH.httpGet("outapi/GetBargainProductInfo", {bid: this.bid})
            .then((result) => {
                const isSelf = result.flag === 1;
                _this.setData({message: result.content, isSelf});
            })
    },
    /**
     * 用户进行砍价
     */
    beganToBargain: function () {
        let _this = this;
        AUTH.httpPost("user/UserBargainProduct", {bid: this.bid, key: "jksnyojnnsl-shan8&^4"})
            .then((result) => {
                App.showSuccess("砍价成功");
                _this.getBargainMessage();
            })
            .catch((err) => {

            })
    },
    /**
     * 立即购买
     */
    buyNow: function () {
        let _this = this;
        wx.navigateTo({
            url: '/pages/to-pay-order/index?' + TOOL.urlEncode({
                orderType: "kanjia",
                bid: _this.bid,
            })
        });
    },
    /**
     * 分享当前页面
     */
    onShareAppMessage: function () {
        // 构建页面参数
        return {
            title: "我在某某某发现一件好的商品，快来吧帮我砍价吧~",
            path: "/pages/kanja/kanjia?bid=" + this.bid
        };
    },
})
