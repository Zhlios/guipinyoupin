const app = getApp()
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        total: 0,
        date: "",
        no_more:false,
        dataType: [{value: "全部", key: -1}, {value: "已到账", key: 1}, {value: "未到账", key: 0}],
        dataTypeValue: "全部",
        currencyTypeValue: "积分",
        currencyType: [{value: "全部", key: -1},{value: "虎坚果", key: 0}, {value: "积分", key: 1}, {value: "通证票", key: 2}],
        cashlogs: undefined
    },
    startTime: "",
    endTime: '',
    Ispay: -1,
    Mtype: -1,
    page: 1,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.nowDate();
        if(options.type){
            this.Mtype = options.type;
        }
        if (this.Mtype == -1) {
            this.setData({currencyTypeValue: "全部"});
        }
        if (this.Mtype == 0) {
            this.setData({currencyTypeValue: "虎坚果"});
        }
        if (this.Mtype == 1) {
            this.setData({currencyTypeValue: "积分"});
        }
        if (this.Mtype == 2) {
            this.setData({currencyTypeValue: "通证票"});
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        AUTH.checkHasLogined().then(isLogined => {
            if (isLogined) {
                this.doneShow(1);
            } else {
                wx.showModal({
                    title: '提示',
                    content: '本次操作需要您的登录授权',
                    cancelText: '暂不登录',
                    confirmText: '前往登录',
                    success(res) {
                        if (res.confirm) {
                            wx.switchTab({
                                url: "/pages/my/index"
                            })
                        } else {
                            wx.navigateBack()
                        }
                    }
                })
            }
        })
    },
    doneShow: function (page) {
        this.page = page;
        const _this = this
        let obj = {
            Mtype: this.Mtype,
            Ispay: this.Ispay,
            PageIndex: page,
            StartTime: this.startTime,
            EndTime: this.endTime,
            PageSize: 20,
        }
        AUTH.httpGet("user/CommissionList", obj)
            .then((result) => {
                if (page === 1) {
                    _this.setData({cashlogs: result.rows, total: result.total});
                    return;
                }
                _this.setData({cashlogs: [..._this.data.cashlogs, ...result.rows], total: result.total});
            })
            .catch((err) => {

            })
    },

    /**
     * 日期改变事件
     */
    bindDate: function (value) {
        this.handleDate(value.detail.value);
    },
    /**
     * 货币状态改变
     */
    bindDateType: function (value) {
        const dataType = this.data.dataType;
        const idx = value.detail.value;
        this.Ispay = dataType[idx].key;
        this.setData({dataTypeValue: dataType[idx].value});
        this.doneShow(1);
    },
    /**
     * 下拉到底加载数据
     */
    bindDownLoad: function () {
        // 已经是最后一页
        const total = this.data.total;
        const data = this.data.cashlogs;
        if (data.length >= total) {
            this.setData({no_more: true});
            return false;
        }
        this.doneShow(++this.page);
    },
    /**
     * 货币类型改变
     */
    bindCurrencyType: function (value) {
        const currencyType = this.data.currencyType;
        const idx = value.detail.value;
        this.Mtype = currencyType[idx].key;
        this.setData({currencyTypeValue: currencyType[idx].value});
        this.doneShow(1);
    },
    /**
     * 处理日期
     */
    handleDate: function (date) {
        this.setData({date});
        const time = "-01 0:00:00";
        const length = date.length;
        let year1 = date.substring(0, 2);
        let year2 = Number(date.substring(2, 4));
        let month = Number(date.substring(length - 2, length));
        let endTimeMonth = "";
        let endTimeYear2 = year2;
        if (month < 12) {
            endTimeMonth = month + 1;
            month = "0" + month;
        } else {
            endTimeMonth = 1;
            endTimeYear2 = endTimeYear2 + 1;
        }
        if (endTimeMonth < 10) {
            endTimeMonth = "0" + endTimeMonth;
        }
        this.startTime = year1 + year2 + "-" + month + time;
        this.endTime = year1 + endTimeYear2 + "-" + endTimeMonth + time;
        this.doneShow(1);
    },
    nowDate: function () {
        let date = new Date();
        const year = date.getFullYear(); //获取完整的年份(4位)
        let month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        if (month < 10) {
            month = "0" + month;
        }
        const now = year + "-" + month;
        this.handleDate(now);
    },
    recharge: function (e) {
        wx.navigateTo({
            url: "/pages/recharge/index"
        })
    },
    withdraw: function (e) {
        wx.navigateTo({
            url: "/pages/withdraw/index"
        })
    }
})
