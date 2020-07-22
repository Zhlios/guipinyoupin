const AUTH = require('./auth')

/**
 * type: order 支付订单 recharge 充值 paybill 优惠买单
 * data: 扩展数据对象，用于保存参数
 */
function wxpay(json, redirectUrl) {
    // 发起支付
    wx.requestPayment({
        ...json,
        fail: function (aaa) {
            wx.showToast({
                title: '支付失败:' + aaa
            })
            wx.redirectTo({
                url: redirectUrl+'1'
            });
        },
        success: function () {
            // 提示支付成功
            wx.showToast({
                title: '支付成功'
            })
            wx.redirectTo({
                url: redirectUrl+'2'
            });
        }
    })
}

module.exports = {
    wxpay: wxpay
}
