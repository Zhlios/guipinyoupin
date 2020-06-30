const WXAPI = require('apifm-wxapi')
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
import ApifmShare from '../../template/share/index.js';

const TOOLS = require('../../utils/tools');
const CONFIG = require('../../config.js')
const AUTH = require('../../utils/auth')
const SelectSizePrefix = "选择："


Page({
    data: {
        bannerPath: CONFIG.imageThumbPath,
        imagePath: CONFIG.imagePath,
        img750: CONFIG.imgType.img750,
        img180: CONFIG.imgType.img180,
        img420: CONFIG.imgType.img420,
        img800: CONFIG.imgType.img800,
        wxlogin: true,
        goodsDetail: {},
        selectSizePrice: 0,
        hideShopPopup: true,
        buyNumber: 0,
        buyNumMin: 1,
        buyNumMax: 0,
        spellproductcfgInfo: {},    //拼团信息
        bargainProductEditResModel: {},//砍价信息
        shopType: "addShopCar", //购物类型，加入购物车或立即购买，默认为加入购物车
        pintuanType: "0",   //拼团类型0发起 1选择别人的拼团
        showShare: false,
        tab: {
            curHdIndex: 0,
            curBdIndex: 0
        },
        dotStyle: "square-dot",
    },
    async onLoad(e) {
        ApifmShare.init(this)
        if (e && e.scene) {
            const scene = decodeURIComponent(e.scene) // 处理扫码进商品详情页面的逻辑
            if (scene) {
                e.id = scene.split(',')[0]
                wx.setStorageSync('referrer', scene.split(',')[1])
            }
        }
        this.data.goodsId = e.id
        const that = this
        this.data.kjJoinUid = e.kjJoinUid
        this.setData({
            goodsDetailSkuShowType: CONFIG.goodsDetailSkuShowType,
            curuid: wx.getStorageSync('uid')
        })
        this.getGoodDetail(e.id);
    },

    onShow() {

    },
    async getGoodDetail(pid) {
        let goodsDetail = await AUTH.httpGet("outapi/productshow", {pid});
        const buyNumber = goodsDetail.content.Number > 0 ? 1 : 0;
        const buyNumMax = goodsDetail.content.Number;
        const spellproductcfgInfo = goodsDetail.content.SpellproductInfo.SpellproductcfgInfo;
        const bargainProductEditResModel = goodsDetail.content.BargainProductEditResModel;
        this.setData({
            goodsDetail: goodsDetail.content,
            buyNumber,
            buyNumMax,
            spellproductcfgInfo,
            bargainProductEditResModel
        });
        WxParse.wxParse('article', 'html', goodsDetail.content.Description, this, 5);
    },
    afterAuth() {
        this.setData({
            wxlogin: true
        })
        this.getFav(this.data.goodsId)
    },
    tabChange: function (e) {
        const id = e.target.dataset.id;
        let obj = {};
        obj.curHdIndex = id;
        obj.curBdIndex = id;
        this.setData({
            tab: obj
        });
    },
    goShopCar: function () {
        wx.reLaunch({
            url: "/pages/shop-cart/index"
        });
    },
    toAddShopCar: function () {
        this.setData({
            shopType: "addShopCar"
        })
        this.bindGuiGeTap();
    },
    tobuy: function () {
        this.setData({
            shopType: "tobuy",
            // selectSizePrice: this.data.goodsDetail.basicInfo.minPrice
        });
        this.bindGuiGeTap();
    },
    /**
     * 发起拼单团购
     */
    toPintuan: function (e) {
        const pintuanType = e.currentTarget.dataset.type;
        AUTH.checkHasLogined().then(isLogined => {
            if (!isLogined) {
                this.setData({
                    wxlogin: false
                })
            } else {
                this.setData({shopType: "toPintuan", pintuanType});
                this.bindGuiGeTap();
            }
        })

    },
    /**
     * 发起砍价
     */
    toKanjia: function () {

    },
    /**
     * 规格选择弹出框
     */
    bindGuiGeTap: function () {
        this.setData({
            hideShopPopup: false
        })
    },
    /**
     * 规格选择弹出框隐藏
     */
    closePopupTap: function () {
        this.setData({
            hideShopPopup: true
        })
    },
    numJianTap: function () {
        if (this.data.buyNumber > this.data.buyNumMin) {
            var currentNum = this.data.buyNumber;
            currentNum--;
            this.setData({
                buyNumber: currentNum
            })
        } else {
            wx.showToast({title: "购买数量不能为0", icon: "none"});
        }
    },
    numJiaTap: function () {
        if (this.data.buyNumber < this.data.buyNumMax) {
            var currentNum = this.data.buyNumber;
            currentNum++;
            this.setData({
                buyNumber: currentNum
            })
        } else {
            wx.showToast({title: "库存不足", icon: "none"});
        }
    },
    /**
     * 加入购物车
     */
    async addShopCar() {
        if (this.data.goodsDetail.properties && !this.data.canSubmit) {
            if (!this.data.canSubmit) {
                wx.showToast({
                    title: '请选择规格',
                    icon: 'none'
                })
            }
            this.bindGuiGeTap()
            return
        }
        if (this.data.buyNumber < 1) {
            wx.showToast({
                title: '请选择购买数量',
                icon: 'none'
            })
            return
        }
        const isLogined = await AUTH.checkHasLogined()
        if (!isLogined) {
            this.setData({
                wxlogin: false
            })
            return
        }
        const token = wx.getStorageSync('token')
        const goodsId = this.data.goodsDetail.basicInfo.id
        const sku = []
        if (this.data.goodsDetail.properties) {
            this.data.goodsDetail.properties.forEach(p => {
                sku.push({
                    optionId: p.id,
                    optionValueId: p.optionValueId
                })
            })
        }
        const res = await WXAPI.shippingCarInfoAddItem(token, goodsId, this.data.buyNumber, sku)
        if (res.code != 0) {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
            return
        }

        this.closePopupTap();
        wx.showToast({
            title: '加入购物车',
            icon: 'success'
        })
        this.shippingCartInfo()
    },
    /**
     * 立即购买
     */
    buyNow: function (e) {
        let that = this
        let shoptype = e.currentTarget.dataset.shoptype
        if (this.data.buyNumber < 1) {
            wx.showModal({
                title: '提示',
                content: '购买数量不能为0！',
                showCancel: false
            })
            return;
        }
        this.closePopupTap();
        const buyNumber = this.data.buyNumber;
        const pID = this.data.goodsDetail.Pid;
        if (shoptype == 'toPintuan') {
            wx.navigateTo({
                url: "/pages/to-pay-order/index?" + TOOLS.urlEncode({
                    orderType: shoptype,
                    buyNumber,
                    pintuanID: that.data.spellproductcfgInfo.recordId,
                    pintuanType: that.data.pintuanType,
                })
            })
        } else {
            wx.navigateTo({
                url: "/pages/to-pay-order/index?orderType=buyNow&&buyNumber=" + buyNumber + "&pid=" + pID
            })
        }

    },

    /**
     * 选择商品规格
     * @param {Object} e
     */
    async labelItemTap(e) {
        const propertyindex = e.currentTarget.dataset.propertyindex
        const propertychildindex = e.currentTarget.dataset.propertychildindex

        const property = this.data.goodsDetail.SKUListInfo[propertyindex]
        const child = property.ItemAttrInfo.Value[propertychildindex]
        if (child.Checked || !child.State) {
            return;
        }
        this.getGoodDetail(child.Pid);
    },
    onShareAppMessage: function () {
        let _data = {
            title: this.data.goodsDetail.basicInfo.name,
            path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + wx.getStorageSync(
                'uid'),
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
        if (this.data.kjJoinUid) {
            _data.title = this.data.curKanjiaprogress.joiner.nick + '邀请您帮TA砍价'
            _data.path += '&kjJoinUid=' + this.data.kjJoinUid
        }
        return _data
    },


    joinPingtuan: function (e) {
        let pingtuanopenid = e.currentTarget.dataset.pingtuanopenid
        wx.navigateTo({
            url: "/pages/to-pay-order/index?orderType=buyNow&pingtuanOpenId=" + pingtuanopenid
        })
    },
    goIndex() {
        wx.switchTab({
            url: '/pages/index/index',
        });
    },
    helpKanjia() {
        const _this = this;
        AUTH.checkHasLogined().then(isLogined => {
            _this.setData({
                wxlogin: isLogined
            })
            if (isLogined) {
                _this.helpKanjiaDone()
            }
        })
    },
    helpKanjiaDone() {
        const _this = this;
        WXAPI.kanjiaHelp(wx.getStorageSync('token'), _this.data.kjId, _this.data.kjJoinUid, '').then(function (res) {
            if (res.code != 0) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                return;
            }
            _this.setData({
                myHelpDetail: res.data
            });
            wx.showModal({
                title: '成功',
                content: '成功帮TA砍掉 ' + res.data.cutPrice + ' 元',
                showCancel: false
            })
            _this.getGoodsDetailAndKanjieInfo(_this.data.goodsDetail.basicInfo.id)
        })
    },
    closePop() {
        this.setData({
            posterShow: false
        })
    }
})
