const CONFIG = require('../../config')
const AUTH = require('../../utils/auth')
Page({
    data: {
        rankList: [],
        headImg: CONFIG.uploadImgPath
    },
    onLoad() {
        this.rankData();
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
