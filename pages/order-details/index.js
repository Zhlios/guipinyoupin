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
    navigateToLogisticDetail:function(e) {
        wx.navigateTo({
            url: '/pages/order-details/logistic_detail?osn='+this.data.OrderAllInfo.osn,
        })
    }
    
})
