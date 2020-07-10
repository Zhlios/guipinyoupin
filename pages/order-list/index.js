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
                    AUTH.httpPost('order/UpdateOrder', {oid: orderId, act: 1})
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
        AUTH.httpGet("order/GetSign", {oid: orderId})
            .then((result) => {
                wx.showModal({
                    title: '请确认支付',
                    content: "",
                    confirmText: "确认支付",
                    cancelText: "取消支付",
                    success: function (res) {
                        console.log(res);
                        if (res.confirm) {
                            that.weiPay(result.content)
                        } else {
                            console.log('用户点击取消支付')
                        }
                    }
                });
            })
            .then((err) => {

            })
    },
    weiPay: function (data) {
        if (data.Flag == true) {
            App.onShow('支付成功');
            wx.redirectTo({
                url: '../order/detail?order_id=' + data.Oid,
            });
            return;
        }
        let json = {
            timeStamp: data.TimeStamp + "",
            nonceStr: data.NonceStr,
            package: 'prepay_id=' + data.PrepayId,
            signType: 'MD5',
            paySign: data.PaySign,
        }
        wxpay.wxpay(json, "/pages/order-list/index");
    },

    onLoad: function (options) {
        this.setListHeight();
        if (options && options.type) {
            this.setData({
                currentType: options.type
            }, () => {
                this.onShow(true);
            });
        }
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
