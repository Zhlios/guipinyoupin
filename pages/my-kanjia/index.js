const AUTH = require('../../utils/auth')
const CONFIG = require('../../config.js')
Page({
    data: {
        bargainPath: CONFIG.bargainPath,            //砍价
        imgPath:CONFIG.imagePath,
        img420: CONFIG.imgType.img420,
        kjGoodsList: [],
        wxlogin: true
    },
    onShow() {
        AUTH.checkHasLogined().then(isLogined => {
            if (!isLogined) {
                this.setData({
                    wxlogin: false
                })
            } else {
                this.doneShow();
            }
        })
    },
    doneShow() {
        AUTH.httpGet("user/GetUserBargainProductList")
            .then((result) => {
                this.setData({kjGoodsList: result.content})
            })
            .catch((err) => {

            })
    },
    afterAuth() {
        this.setData({
            wxlogin: true
        })
        this.doneShow()
    },
    closeAuth() {
        wx.navigateBack()
    },

})
