const app = getApp()
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const wxpay = require('../../utils/pay.js')
const tools = require('../../utils/tools.js')
const CONFIG = require('../../config.js')
Page({
    data: {
        imagePath: CONFIG.imagePath,
        img750: CONFIG.imgType.img750,
        img180: CONFIG.imgType.img180,
        img420: CONFIG.imgType.img420,
        img800: CONFIG.imgType.img800,
        wxlogin: true,
        options: {},
        coupons: [],
        curCoupon: null, // 当前选择使用的优惠券
        remark: '',
        showModal: false, //是否显示微信支付modal
        payAmount: null,
        payId: null,

        OrderProductsModel: [], //订单商品详情
        CouponMM: [], // 优惠券
        PointsInfo: {}, // 积分。可以兑换
        LessMoney: 0, // 总牛牛豆
        TotalMoney: 0, // 总价格
        CutMoney: 0, // 满减价格. 满减在最后
        RegionOrderInfo: null, //地址信息
        commission: 0, // 牛牛豆兑换
        realMoney: 0, // 实际支付金额
        selectCoupon: 0,      //优惠券 减去的价格
        integral: 0, // 积分兑换
        showcommission: true,  //是否需要展示牛牛豆购买
        wechatPayContent: {},
    },
    double: true,           //TODO 防止跳转到订单列表后报错 待优化
    onShow() {
        AUTH.checkHasLogined().then(isLogined => {
            if (isLogined) {
                this.double && this.doneShow();
            } else {
                this.setData({
                    wxlogin: isLogined
                })

            }
        })
    },
    afterAuth() {
        this.setData({
            wxlogin: true
        })
        this.doneShow()
    },
    async doneShow() {
        //立即购买下单
        const options = this.data.options;
        console.log(options.orderType, 'hahaa===拼团进来的')
        // 积分商城购买
        if (options.orderType === "integral") {

            const {pid, buyNumber} = options;
            console.log(options);
            const result = await AUTH.httpPost("order/CashPointSubmitOrder", {recordId:pid, cCount:buyNumber});
            console.log(result,'jifen');
            this.setData({
                ...result.content,
                realMoney:result.content.TotalMoney,
                integral: result.content.TotalPoints,
            }, () => {
    
            });
            return;
        }

        // 立即购买
        if (options.orderType === "buyNow") {
            const {pid, buyNumber} = options;
            const result = await AUTH.httpPost("order/BuyNowSubmitOrder", {
                pid,
                buycount: buyNumber,
            });
            this.setData({
                ...result.content,
                
            }, () => {
                this.getRealMonery();
            });
            return;
        }
        //砍价购买
        if (options.orderType === "kanjia") {
            const bid = options.bid;
            AUTH.httpPost("order/BargainSubmitOrder", {bid})
                .then((result) => {
                    this.setData({
                        ...result.content,
                    }, () => {
                        this.getRealMonery();
                    });
                })
            return;
        }
        //拼团购买
        if (options.orderType === "toPintuan") {
            console.log(options);
            const sType = options.pintuanType;
            const id = options.pintuanID;
            const result = await AUTH.httpPost("order/SpellSubmitOrder", {sType, id})
            this.setData(result.content, function () {
                this.getRealMonery()
            })
            return;
        }
        //购物车
        if (options.orderType === "car") {
            let recordIds = JSON.parse(options.recordIds)
            const result = await AUTH.httpPost('order/SubmitOrder', {ids: options.recordIds});
            this.setData(result.content, function () {
                this.getRealMonery()
            })
            return
        }
        //购物车下单
        const res = await WXAPI.shippingCarInfo(token)
        if (res.code == 0) {
            shopList = res.data.items

        }
    },
    onLoad(e) {
        this.data.options = e;
        this.setData({
            options: e,
        })
    },

    getDistrictId: function (obj, aaa) {
        if (!obj) {
            return "";
        }
        if (!aaa) {
            return "";
        }
        return aaa;
    },
    remarkChange(e) {
        this.data.remark = e.detail.value
    },
    createOrder: function () {
        wx.showLoading();
        let that = this;
        let remark = this.data.remark; // 备注信息
        const options = this.data.options;
        let postData = {
            PayEcurr: this.data.commission,  //账户余额
            BuyerRemark: remark,
        };
        if (!that.data.RegionOrderInfo) {
            wx.hideLoading();
            wx.showModal({
                title: '友情提示',
                content: '请先设置您的收货地址！',
                showCancel: false
            })
            return;
        }
        if (options.orderType === "integral") {
            const param = {
                recordId: options.pid,
                UseMoney: this.data.realMoney,
                SaId: this.data.RegionOrderInfo.said,
                cCount: options.buyNumber,
                BuyerRemark: remark,
            }
            AUTH.httpPost('order/CashPointCreateOrder', param)
            .then((result) => {
                that.setData({
                    showModal: true,
                    wechatPayContent: result.content
                });
            })
            .catch((err) => {
                console.log(err,'jifenerr')
            });
            return;
        }

        if (options.orderType === "toPintuan") {
            const param = {
                ...postData,
                Stype: options.pintuanType,
                Id: options.pintuanID,
                Said: this.data.RegionOrderInfo.said,
                BuyCount: options.buyNumber,
            }
            AUTH.httpPost('order/SpellCreateOrder', param)
                .then(result => {
                    that.setData({
                        showModal: true,
                        wechatPayContent: result.content
                    });
                    // this.toPay(result.content);
                })
                .catch((err) => {

                })
        }
        if (options.orderType === "kanjia") {
            let param = {
                Bid: options.bid,
                Said: this.data.RegionOrderInfo.said,
                PaycReditCount: this.data.integral,
                ...postData
            }
            AUTH.httpPost('order/BargainCreateOrder', param)
                .then((result) => {
                    that.setData({
                        showModal: true,
                        wechatPayContent: result.content
                    });
                })
                .catch((err) => {

                })
            return;
        }
        if (options.orderType === "buyNow") {
            const params = {
                ...postData,
                Pid: options.pid,
                Said: this.data.RegionOrderInfo.said,
                CouponId: this.data.CouponMM.length ? this.data.CouponMM[0].CouponId : 0,
                PaycReditCount: this.data.integral,
                BuyCount: options.buyNumber,
            }
            AUTH.httpPost('order/BuyNowCreateOrder', params)
                .then((result) => {
                    that.setData({
                        showModal: true,
                        wechatPayContent: result.content
                    });
                    // this.toPay(result.content);
                })
                .catch((err) => {

                });
            return
        }
        if (options.orderType === "car") {
            const params = {
                ...postData,
                RecordId: JSON.parse(this.data.options.recordIds),
                Said: this.data.RegionOrderInfo.said,
                CouponId: this.data.CouponMM.length ? this.data.CouponMM[0].CouponId : 0,
                PaycReditCount: this.data.integral
            }
            AUTH.httpPost('order/CreateOrder', {jsonString: JSON.stringify(params)})
                .then((result) => {
                    that.setData({
                        showModal: true,
                        wechatPayContent: result.content
                    });
                })
                .catch((err) => {

                })
        }
    },
    toPay() {
        const data = this.data.wechatPayContent;
        if (data.Flag) {
            wx.showToast({title: '支付成功', icon: "success"});
            wx.redirectTo({
                url: '/pages/order-list/index?type=1',
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
        // 发起微信支付
        this.double = false;
        wxpay.wxpay(json, "/pages/order-list/index?type=1");
    },
    hideModal() {
        wx.redirectTo({
            url: "/pages/order-list/index"
        });
    },
    addAddress: function () {
        wx.navigateTo({
            url: "/pages/address-add/index"
        })
    },
    selectAddress: function () {
        wx.navigateTo({
            url: "/pages/select-address/index"
        })
    },
    getMyCoupons: function () {
        var that = this;
        WXAPI.myCoupons({
            token: wx.getStorageSync('token'),
            status: 0
        }).then(function (res) {
            if (res.code == 0) {
                // 过滤不满足满减最低金额的优惠券
                var coupons = res.data.filter(entity => {
                    return entity.moneyHreshold <= that.data.TotalMoney;
                });

                var dayTime = tools.formatTime(new Date());
                //过滤还没到可以使用时间的优惠券
                coupons = coupons.filter(entity => {
                    return entity.dateStart <= dayTime;
                });

                if (coupons.length > 0) {
                    that.setData({
                        hasNoCoupons: false,
                        coupons: coupons
                    });
                }
            }
        })
    },
    bindChangeCoupon: function (e) {
        const selIndex = e.detail.value[0] - 1;
        if (selIndex == -1) {
            this.setData({
                youhuijine: 0,
                curCoupon: null
            });
            return;
        }
        //console.log("selIndex:" + selIndex);
        this.setData({
            youhuijine: this.data.coupons[selIndex].money,
            curCoupon: this.data.coupons[selIndex]
        });
    },


    // 显示金额计算
    getRealMonery: function () {
        // 实际支付金额
        // 实际支付金额= 总金额 - 满减金额 - 优惠券  - 积分兑换
        const options = this.data.options;
        // 积分商城购买
        if (options.orderType === "integral") {
        
        }else {
            let coupop = 0;
            if (this.data.CouponMM.length) {
                coupop = this.data.CouponMM[0].Money;
            }
            let pointMoney = this.data.integral / this.data.PointsInfo.MoneyToPoints;
            let realMonery = (this.data.TotalMoney - this.data.CutMoney - coupop - pointMoney - this.data.commission).toFixed(2);
            this.setData({
                realMoney: realMonery,
            });
        }

      

    },
    integral: 0,
    commission: 0,
    //最终金额实时计算
    getRealMoneyRealTime: function () {
        let coupop = 0;
        if (this.data.CouponMM.length) {
            coupop = this.data.CouponMM[0].Money;
        }
        let pointMoney = this.integral / this.data.PointsInfo.MoneyToPoints;

        let realMonery = (this.data.TotalMoney - this.data.CutMoney - coupop - pointMoney - this.commission);
        return realMonery;
    },
    // 积分
    bindPointsInput: function (e) {
        //
        let _this = this;
        let value = !e.detail.value ? 0 : e.detail.value;
        let currentValue = parseInt(value);
        this.integral = currentValue;
        if (currentValue > this.data.PointsInfo.Points) {
            currentValue = this.data.PointsInfo.Points;
            this.setData({
                integral: currentValue,
            })
        } else {
            //如果实时计算价格小于等于0  则将积分设置为实付款金额 * 积分兑换比例
            if (this.getRealMoneyRealTime() <= 0) {
                let coupop = 0;
                if (this.data.CouponMM.length) {
                    coupop = this.data.CouponMM[0].Money;
                }
                currentValue = (this.data.TotalMoney - this.data.commission - this.data.CutMoney - coupop) * this.data.PointsInfo.MoneyToPoints;
                this.integral = currentValue;
            }

            this.setData({
                integral: currentValue,
            }, function () {
                _this.getRealMonery()
            })
        }
    },

    // 余额
    bindCommissionInput: function (e) {
        let _this = this;
        let value = !e.detail.value ? 0 : e.detail.value;
        let currentValue = parseInt(value);
        this.commission = currentValue;
        if (currentValue > this.data.LessMoney) {
            currentValue = this.data.LessMoney;
            this.setData({
                commission: currentValue,
            })
        } else {
            if (this.getRealMoneyRealTime() <= 0) {
                let coupop = 0;
                if (this.data.CouponMM.length) {
                    coupop = this.data.CouponMM[0].Money;
                }
                currentValue = this.data.TotalMoney - this.integral / this.data.PointsInfo.MoneyToPoints - this.data.CutMoney - coupop;
                this.commission = currentValue;
            }
            this.setData({
                commission: currentValue,
            }, function () {
                _this.getRealMonery()
            })
        }
    },
})
