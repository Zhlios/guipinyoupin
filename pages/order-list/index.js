const wxpay = require('../../utils/pay.js')
const app = getApp()
const CONFIG = require('../../config.js')
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth');
const TOOL = require("../../utils/tools");
Page({
    data: {
        imagePath: CONFIG.imagePath,
        img220: CONFIG.imgType.img220,
        statusType: ["全部", "待付款", "待发货", "待收货", "待分享"],
        currentType: 0,
        orderList: [],
        tabClass: ["", "", "", "", ""],
        wxlogin: true,
        PageSize: 10,
        PageIndex: 1,
        scrollHeight: 0,
    },
    copyOrderNumber(e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.num,
            success() {
                wx.showToast({
                    title: "复制成功",
                    icon: "success"
                })
            }
        })
    },
    /**
     * 设置分类列表高度
     */
    setListHeight: function () {
        let _this = this;
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    scrollHeight: res.windowHeight - 45,
                });
            }
        });
    },
    statusTap: function (e) {
        const curType = e.currentTarget.dataset.index;
        this.data.currentType = curType
        this.setData({
            currentType: curType,
            PageIndex: 1,
            orderList: [],
        });
        this.doneShow();
    },
    cancelOrderTap: function (e) {
        const that = this;
        const orderId = e.currentTarget.dataset.id;
        wx.showModal({
            title: '确定要取消该订单吗？',
            content: '',
            success: function (res) {
                if (res.confirm) {
                    AUTH.httpPost('order/UpdateOrder', {oid: order_id, act: 1})
                        .then((result) => {
                            that.setData({
                                PageIndex: 1,
                                orderList: [],
                            })
                            that.doneShow();
                        })
                        .catch(() => {

                        })
                }
            }
        })
    },
    refundApply(e) {
        // 申请售后
        const orderId = e.currentTarget.dataset.id;
        const amount = e.currentTarget.dataset.amount;
        wx.navigateTo({
            url: "/pages/order/refundApply?id=" + orderId + "&amount=" + amount
        })
    },
    toPayTap: function (e) {
        // 防止连续点击--开始
        if (this.data.payButtonClicked) {
            wx.showToast({
                title: '休息一下~',
                icon: 'none'
            })
            return
        }
        this.data.payButtonClicked = true
        setTimeout(() => {
            this.data.payButtonClicked = false
        }, 3000) // 可自行修改时间间隔（目前是3秒内只能点击一次支付按钮）
        // 防止连续点击--结束
        const that = this;
        const orderId = e.currentTarget.dataset.id;
        let money = e.currentTarget.dataset.money;
        const needScore = e.currentTarget.dataset.score;
        WXAPI.userAmount(wx.getStorageSync('token')).then(function (res) {
            if (res.code == 0) {
                // 增加提示框
                if (res.data.score < needScore) {
                    wx.showToast({
                        title: '您的积分不足，无法支付',
                        icon: 'none'
                    })
                    return;
                }
                let _msg = '订单金额: ' + money + ' 元'
                if (res.data.balance > 0) {
                    _msg += ',可用余额为 ' + res.data.balance + ' 元'
                    if (money - res.data.balance > 0) {
                        _msg += ',仍需微信支付 ' + (money - res.data.balance) + ' 元'
                    }
                }
                if (needScore > 0) {
                    _msg += ',并扣除 ' + money + ' 积分'
                }
                money = money - res.data.balance
                wx.showModal({
                    title: '请确认支付',
                    content: _msg,
                    confirmText: "确认支付",
                    cancelText: "取消支付",
                    success: function (res) {
                        console.log(res);
                        if (res.confirm) {
                            that._toPayTap(orderId, money)
                        } else {
                            console.log('用户点击取消支付')
                        }
                    }
                });
            } else {
                wx.showModal({
                    title: '错误',
                    content: '无法获取用户资金信息',
                    showCancel: false
                })
            }
        })
    },
    _toPayTap: function (orderId, money) {
        const _this = this
        if (money <= 0) {
            // 直接使用余额支付
            WXAPI.orderPay(wx.getStorageSync('token'), orderId).then(function (res) {
                _this.onShow();
            })
        } else {
            wxpay.wxpay('order', money, orderId, "/pages/order-list/index");
        }
    },
    onLoad: function (options) {
        console.log(options.type, "--------------------")
        this.setListHeight();
        if (options && options.type) {
            this.setData({
                currentType: options.type
            }, () => {
                this.onShow(true);
            });
        }
    },
    getOrderStatistics: function () {
        var that = this;
        WXAPI.orderStatistics(wx.getStorageSync('token')).then(function (res) {
            if (res.code == 0) {
                var tabClass = that.data.tabClass;
                if (res.data.count_id_no_pay > 0) {
                    tabClass[0] = "red-dot"
                } else {
                    tabClass[0] = ""
                }
                if (res.data.count_id_no_transfer > 0) {
                    tabClass[1] = "red-dot"
                } else {
                    tabClass[1] = ""
                }
                if (res.data.count_id_no_confirm > 0) {
                    tabClass[2] = "red-dot"
                } else {
                    tabClass[2] = ""
                }
                if (res.data.count_id_no_reputation > 0) {
                    tabClass[3] = "red-dot"
                } else {
                    tabClass[3] = ""
                }
                if (res.data.count_id_success > 0) {
                    //tabClass[4] = "red-dot"
                } else {
                    //tabClass[4] = ""
                }

                that.setData({
                    tabClass: tabClass,
                });
            }
        })
    },
    scrollToBottom: function (e) {
        let _this = this;
        this.setData({PageIndex: this.data.PageIndex + 1}, function () {
            // 获取订单列表
            _this.doneShow(this.data.dataType);
        });
    },
    onShow: function (first) {
        if (!first) {
            AUTH.checkHasLogined().then(isLogined => {
                if (!isLogined) {
                    this.setData({
                        wxlogin: false
                    })
                } else {
                    this.doneShow();
                }
            })
        }
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
        this.setData({
            PageIndex: 1,
        })
    },
    afterAuth() {
        this.setData({
            wxlogin: true
        })
        this.doneShow()
    },
    doneShow: function () {
        let query
        const dataType = this.data.currentType;
        //全部
        if (dataType == 0) {
            query = {
                OrderState: -1,
                PageSize: this.data.PageSize,
                PageIndex: this.data.PageIndex,
            }
        }
        //待付款
        if (dataType == 1) {
            query = {
                OrderState: 0,
                PageSize: this.data.PageSize,
                PageIndex: this.data.PageIndex,
            }
        }
        //待发货
        if (dataType == 2) {
            query = {
                shipState: 1,
                orderState: 1,
                PageSize: this.data.PageSize,
                PageIndex: this.data.PageIndex,
            }
        }
        //待收货
        if (dataType == 3) {
            query = {
                shipState: 2,
                orderState: 1,
                PageSize: this.data.PageSize,
                PageIndex: this.data.PageIndex,
            }
        }
        //分享
        if (dataType == 4) {
            query = {
                Shared: 0,
                PageSize: this.data.PageSize,
                PageIndex: this.data.PageIndex,
            }
        }
        // this.getOrderStatistics();
        AUTH.httpGet('order/OrderList', query)
            .then((result) => {
                const orderList = this.data.orderList;
                const data = result.content.map((item) => {
                    return {...item, addtime: TOOL.changeDateFormat(item.addtime)}
                })
                this.setData({orderList: [...orderList, ...data]})
            })
            .catch((err) => {

            })
        // WXAPI.orderList(postData).then(function(res) {
        // 	if (res.code == 0) {
        // 		that.setData({
        // 			orderList: res.data.orderList,
        // 			logisticsMap: res.data.logisticsMap,
        // 			goodsMap: res.data.goodsMap
        // 		});
        // 	} else {
        // 		that.setData({
        // 			orderList: null,
        // 			logisticsMap: {},
        // 			goodsMap: {}
        // 		});
        // 	}
        // })
    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数

    }
})
