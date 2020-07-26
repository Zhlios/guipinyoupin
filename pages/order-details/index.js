const AUTH = require("../../utils/auth")
const CONFIG = require('../../config.js')
const TOOL = require('../../utils/tools')
const WXAPI = require('apifm-wxapi')
Page({
    data: {
        orderId: 0,
        goodsList: [],
        imagePath: CONFIG.imagePath,
        img220: CONFIG.imgType.img220,
        OrderAllInfo: null,
        OrderProductInfo: [],
        OrderUserInfo: null,
    },
    onLoad: function (e) {
        let orderId = e.id;
        this.data.orderId = orderId;
        this.setData({
            orderId: orderId,
        });
    },
    onShow: function () {
        var that = this;
        AUTH.httpGet('order/OrderDetails', {oid: that.data.orderId})
            .then((result) => {
                console.log(result, 'OrderDetails')
                const date = result.content.OrderAllInfo.addtime;
                result.content.OrderAllInfo.addtime = TOOL.changeDateFormat(date);
                that.setData({
                    ...result.content
                });
            })
            .catch((err) => {

            })
    },
    wuliuDetailsTap: function (e) {
        let orderId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/wuliu/index?id=" + orderId
        })
    },
    confirmBtnTap: function (e) {
        let that = this;
        let orderId = this.data.orderId;
        wx.showModal({
            title: '确认您已收到商品？',
            content: '',
            success: function (res) {
                if (res.confirm) {
                    WXAPI.orderDelivery(wx.getStorageSync('token'), orderId).then(function (res) {
                        if (res.code == 0) {
                            that.onShow();
                        }
                    })
                }
            }
        })
    },
    /**
     *  跳转到物流详情界面
     * */
    navigateToLogisticDetail: function (e) {
        wx.navigateTo({
            url: '/pages/order-details/logistic_detail?osn=' + this.data.OrderAllInfo.osn,
        })
    },
    /**
     * 再来一单
     * @param e
     */
    navigateToPayOrder(e) {
        const id = e.currentTarget.dataset.id;
        const orderType = e.currentTarget.dataset.type;
        const num = this.data.OrderProductInfo[0].BuyCount;
        const pid = this.data.OrderProductInfo[0].Pid;
        let type = "buyNow";
        if (orderType == "0") {
            type = "buyNow";
            wx.navigateTo({
                url: `/pages/to-pay-order/index?orderType=${type}&pid=${pid}&buyNumber=${num}`
            })
        }
        if (orderType == "2") {
            type = "toPintuan";
            wx.navigateTo({
                url: `/pages/to-pay-order/index?orderType=${type}&pintuanID=${id}&pintuanType=0&buyNumber=${num}`
            })
        }
    },
    /**
     * 添加到购物车
     */
    addToShoppingCart() {
        this.data.OrderProductInfo.map(async (item) => {
            await AUTH.httpPost('Order/AddCartProduct', {
                pid: item.Pid,
                count: item.BuyCount,
            });
        });
        wx.switchTab({url:"/pages/shop-cart/index"});
    }
})
