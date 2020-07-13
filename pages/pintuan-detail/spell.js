const AUTH = require('../../utils/auth');
const CONFIG = require('../../config');
const TOOLS = require('../../utils/tools');
Page({
    data: {
        imagePath: CONFIG.imagePath,
        img180: CONFIG.imgType.img180,
        baseUrl: CONFIG.url,
        userImg: CONFIG.uploadImgPath,
        spellGoods: {},
        spellUser: [],
        countTime: "",
        spellMessage: undefined,
        isSelf: true,
    },
    timer: undefined,
    sId: undefined,
    onLoad(options) {
        this.setHeight();
        const sId = options.id;
        this.sId = sId;
        this.getSpellInfo(sId);
    },
    onShow() {
        if (this.sId) {
            this.getSpellInfo(this.sId);
        }
    },
    onUnload() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    /**
     * 获取拼购信息
     */
    getSpellInfo: function (sId) {
        let _this = this;
        AUTH.httpGet("outapi/GetSpellproductInfo", {sId})
            .then((result) => {
                let i = 1;
                const countTime = TOOLS.countTime(result.content.endTime, i);
                if (!_this.timer) {
                    _this.timer = setInterval(() => {
                        i++;
                        const countTimeLoop = TOOLS.countTime(result.content.endTime, i);
                        _this.setData({countTime: countTimeLoop});
                    }, 1000)
                }
                const status = result.content.status;
                let spellMessage = "";
                if (status === 1) {
                    spellMessage = "拼单完成";
                }
                if (status === 2) {
                    spellMessage = "拼单已过期"
                }
                const isSelf = result.flag === 1;
                _this.setData({spellGoods: result.content, countTime, isSelf, spellMessage});
                const cntTotal = result.content.cntTotal;
                const list = result.content.SpellUserListInfo;
                _this.spellUserImg(cntTotal, list)
            })
            .catch()
    },
    /**
     * 设置页面高度
     */
    setHeight: function () {
        let _this = this;
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    pageHeight: res.windowHeight,
                });
            }
        });
    },
    /**
     * 设置拼单用户头像
     */
    spellUserImg: function (total, list) {
        const spellUserList = [];
        for (let i = 0; i < total; i++) {
            spellUserList[i] = {img: list[i] ? list[i].head : ""};
        }
        this.setData({spellUserList});
    },
    /**
     * 分享当前页面
     */
    onShareAppMessage: function () {
        // 构建页面参数
        let _this = this;
        return {
            title: `我在予农惠购买${_this.data.spellGoods.name}快来跟我拼团吧！`,
            path: "/pages/pintuan-detail/spell?id=" + _this.data.spellGoods.sId
        };
    },
    /**
     * 拼单
     */
    spellBuy: function () {
        let _this = this;
        wx.navigateTo({
            url: '/pages/to-pay-order/index?' + TOOLS.urlEncode({
                orderType: "toPintuan",
                buyNumber: 1,
                pintuanID: _this.data.spellGoods.sId,
                pintuanType: 0,
            })
        });
    },
    /**
     * 去商品详情
     */
    toGoods: function () {
        wx.navigateTo({
            url: "../goods/index?Pid="
        })
    }
})
