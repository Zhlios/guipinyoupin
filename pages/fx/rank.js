const CONFIG = require('../../config')
const AUTH = require('../../utils/auth')
Page({
    data: {
        rankList: [],
        headImg: CONFIG.uploadImgPath
    },
    onLoad() {
        AUTH.checkHasLogined().then(isLogined => {
            if (isLogined) {
                this.rankData();
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
    rankData: function () {
        let _this = this;
        AUTH.httpGet("user/GetUserRanking", {cnt: 30})
            .then((result) => {
                _this.setData({rankList: result.content.UserRankInfo})
            })
            .then((err) => {

            })
    }
})
