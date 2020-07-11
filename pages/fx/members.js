const AUTH = require('../../utils/auth')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        number1: 0,
        number2: 0,
        activeIndex: 1,
        teamMessage: {},
        teamList: [],
        pageHeight: 0,
        total: 0,
        no_more: false,
    },
    page: 1,
    onLoad: function () {
        this.setHeight();
    },
    tabClick: function (e) {
        const activeIndex = e.currentTarget.id;
        if (activeIndex == this.data.activeIndex) {
            return;
        }
        this.page = 1;
        this.setData({
            activeIndex,
            teamList: [],
        }, () => {
            this.getTeamList();
        });
    },
    /**
     * 设置页面高度
     */
    setHeight: function () {
        let _this = this;
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    pageHeight: res.windowHeight - 135,
                });
            }
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        AUTH.checkHasLogined().then(isLogined => {
            if (isLogined) {
                this.getTeamList();
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
    getTeamList: function () {
        const _this = this;
        AUTH.httpGet("user/MyTeam", {PageIndex: this.page, PageSize: 10, Level: this.data.activeIndex})
            .then((result) => {
                const teamMessage = result.content.MyTeamUserCount;
                const total = result.content.TotalItemCount;
                const teamList = result.content.MyTeamList;
                if (teamMessage) {
                    _this.setData({teamMessage, total, teamList});
                    return;
                }
                _this.setData({total, teamList: [..._this.data.teamList, ...teamList]})
            })
            .catch((err) => {

            })
    },
    /**
     * 下拉到底加载数据
     */
    bindDownLoad: function () {
        // 已经是最后一页
        const total = this.data.total;
        const teamList = this.data.teamList;
        if (teamList.length >= total) {
            this.setData({no_more: true});
            return false;
        }
        ++this.page;
        this.getTeamList();
    },
})
