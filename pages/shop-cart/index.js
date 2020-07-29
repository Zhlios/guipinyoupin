const WXAPI = require('apifm-wxapi')
const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth')
const CONFIG = require('../../config.js')
const app = getApp()

Page({
    data: {
        wxlogin: true,
        imagePath: CONFIG.imagePath,
        img750: CONFIG.imgType.img750,
        img180: CONFIG.imgType.img180,
        img420: CONFIG.imgType.img420,
        img800: CONFIG.imgType.img800,
        saveHidden: true,
        allSelect: true,
        shippingCarInfo: {},
        delBtnWidth: 120, //删除按钮宽度单位（rpx）
        title: "猜你喜欢",
        orderBy: "ordersDown",
        totalMoney: 0,
        showTotalMoney: true,
        count: 4
    },

    //获取元素自适应后的实际宽度
    getEleWidth: function (w) {
        var real = 0;
        try {
            var res = wx.getSystemInfoSync().windowWidth
            var scale = (750 / 2) / (w / 2)
            // console.log(scale);
            real = Math.floor(res / scale);
            return real;
        } catch (e) {
            return false;
            // Do something when catch error
        }
    },
    initEleWidth: function () {
        var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
        this.setData({
            delBtnWidth: delBtnWidth
        });
    },
    onLoad: function () {
        this.initEleWidth();
    },
    onShow: function () {
        AUTH.checkHasLogined().then(isLogined => {
            this.setData({
                wxlogin: isLogined
            })
            if (isLogined) {
                this.shippingCarInfo()
            }
        })
    },
    async shippingCarInfo() {
        let shippingCarInfo = {};
        AUTH.httpGet('order/GetCart')
            .then((result) => {
                console.log(result,"?????????//")
                const items = result.content.map(e => {
                    if(e.SkuInfo ===null) {
                        e.SkuInfo = "";
                    }
                    e.selected = this.data.allSelect;
                    return e;
                });
                shippingCarInfo.items = items;
                this.setData({shippingCarInfo}, () => {
                    this.sumCount();
                })
            })
            .catch((err) => {

            })
    },
    toIndexPage: function () {
        wx.switchTab({
            url: "/pages/index/index"
        });
    },

    touchS: function (e) {
        if (e.touches.length == 1) {
            this.setData({
                startX: e.touches[0].clientX
            });
        }
    },
    toDetail:function(e){
      wx.navigateTo({url:`/pages/goods-details/index?id=${e.currentTarget.dataset.id}`})
    },
    touchM: function (e) {
        const index = e.currentTarget.dataset.index;
        if (e.touches.length == 1) {
            var moveX = e.touches[0].clientX;
            var disX = this.data.startX - moveX;
            var delBtnWidth = this.data.delBtnWidth;
            var left = "";
            if (disX == 0 || disX < 0) { //如果移动距离小于等于0，container位置不变
                left = "margin-left:0px";
            } else if (disX > 0) { //移动距离大于0，container left值等于手指移动距离
                left = "margin-left:-" + disX + "px";
                if (disX >= delBtnWidth) {
                    left = "left:-" + delBtnWidth + "px";
                }
            }
            this.data.shippingCarInfo.items[index].left = left
            this.setData({
                shippingCarInfo: this.data.shippingCarInfo
            })
        }
    },

    touchE: function (e) {
        var index = e.currentTarget.dataset.index;
        if (e.changedTouches.length == 1) {
            var endX = e.changedTouches[0].clientX;
            var disX = this.data.startX - endX;
            var delBtnWidth = this.data.delBtnWidth;
            //如果距离小于删除按钮的1/2，不显示删除按钮
            var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
            this.data.shippingCarInfo.items[index].left = left
            this.setData({
                shippingCarInfo: this.data.shippingCarInfo
            })
        }
    },
    delItem(e) {
        let _this = this,
            recordid = e.currentTarget.dataset.key;

        wx.showModal({
            title: "提示",
            content: "您确定要移除当前商品吗?",
            success: function (e) {
                e.confirm && AUTH.httpPost('order/DelCartProduct', {
                    recordid: recordid,
                }).then((result) => {
                    _this.shippingCarInfo();
                    TOOLS.showTabBarBadge();
                })
            }
        });
    },
    async jiaBtnTap(e) {
        const index = e.currentTarget.dataset.index;
        const item = this.data.shippingCarInfo.items[index]
        const buycount = item.buycount + 1
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        const result = await AUTH.httpPost('order/UpdateCartProduct', {
            pid: item.pid,
            count: buycount,
        });
        this.shippingCarInfo()
    },
    async jianBtnTap(e) {
        const index = e.currentTarget.dataset.index;
        const item = this.data.shippingCarInfo.items[index]
        const buycount = item.buycount - 1
        if (buycount <= 0) {
            return
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        const result = await AUTH.httpPost('order/UpdateCartProduct', {
            pid: item.pid,
            count: buycount,
        });
        this.shippingCarInfo()
    },
    cancelLogin() {
        this.setData({
            wxlogin: true
        })
    },
    processLogin(e) {
        if (!e.detail.userInfo) {
            wx.showToast({
                title: '已取消',
                icon: 'none',
            })
            return;
        }
    },
    /**
     * 计算总价
     */
    sumCount: function () {
        let count = 0;
        let num = 0;
        this.data.shippingCarInfo.items.map(e => {
            if (e.selected) {
                count = (Number(count) + Number(e.buycount * e.shopprice)).toFixed(2);
                num = Number(count) + Number(e.buycount * e.shopprice);
            }
        });
        this.setData({
            totalMoney: count,
            showTotalMoney: !!num,
        })
    },
    /**
     * 选择
     */
    clickChangeSkuSelected: function (e) {
        let _this = this;
        const index = e.currentTarget.dataset.index;
        let items = this.data.shippingCarInfo.items.map((every, idx) => {
            if (idx == index) {
                every.selected = !every.selected;
            }
            return every;
        });
        let shippingCarInfo = this.data.shippingCarInfo;
        const allSelect = items.every((item) => {
            return item.selected;
        })
        shippingCarInfo = {...shippingCarInfo, items};
        this.setData({shippingCarInfo, allSelect}, function () {
            _this.sumCount()
        })
    },
    /**
     * 选择全部
     */
    selectAll() {
        const _this = this;
        const allSelect = this.data.allSelect;
        let items = this.data.shippingCarInfo.items.map((every, idx) => {
            every.selected = !allSelect;
            return every;
        })
        let shippingCarInfo = this.data.shippingCarInfo;
        shippingCarInfo = {...shippingCarInfo, items};
        this.setData({shippingCarInfo, allSelect: !allSelect}, function () {
            _this.sumCount()
        })
    },
    /**
     * 购物车结算
     */
    submit: function () {
        let recordIds = [];
        this.data.shippingCarInfo.items.map(e => {
            if (e.selected) {
                recordIds.push(e.recordid)
            }
        })
        if (recordIds.length < 1) {
            return;
        }
        var stringRecordIds = JSON.stringify(recordIds)
        wx.navigateTo({
            url: '/pages/to-pay-order/index?orderType=car&recordIds=' + stringRecordIds
        });
    },
    afterAuth() {
        this.setData({
            wxlogin: true
        });
        this.shippingCarInfo()
    },
})
