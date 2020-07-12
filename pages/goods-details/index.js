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
        spellproductListInfo: [],
        spellproductcfgInfo: {},    //拼团信息
        bargainProductEditResModel: {},//砍价信息
        shopType: "addShopCar", //购物类型，加入购物车或立即购买，默认为加入购物车
        pintuanType: "0",   //拼团类型0发起 1选择别人的拼团
        pintuanID: 0,        //拼团id
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
        this.data.kjJoinUid = e.kjJoinUid
        this.getGoodDetail(e.id);
    },

    onShow() {

    },
    async getGoodDetail(pid) {
        let goodsDetail = await AUTH.httpGet("outapi/productshow", {pid});
        const buyNumber = goodsDetail.content.Number > 0 ? 1 : 0;
        const buyNumMax = goodsDetail.content.Number;
        const spellproductcfgInfo = goodsDetail.content.SpellproductInfo.SpellproductcfgInfo;
        const spellproductListInfo = goodsDetail.content.SpellproductInfo.SpellproductListInfo;
        const bargainProductEditResModel = goodsDetail.content.BargainProductEditResModel;
        this.setData({
            goodsDetail: goodsDetail.content,
            buyNumber,
            buyNumMax,
            spellproductListInfo,
            spellproductcfgInfo,
            bargainProductEditResModel
        });
        WxParse.wxParse('article', 'html', goodsDetail.content.Description, this, 5);
    },
    afterAuth() {
        this.setData({
            wxlogin: true
        })
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
     * 发起砍价
     */
    getBargainId: function () {
        AUTH.httpPost("user/StartBargainProduct", {recordId: this.data.bargainProductEditResModel.recordId})
            .then((result) => {
                const bid = result.content.bid;
                wx.navigateTo({url: "/pages/kanjia/kanjia?bid=" + bid})
            })
            .catch((err) => {

            })
    },
    /**
     * 发起拼单团购
     */
    toPintuan: function (e) {
        const pintuanType = e.currentTarget.dataset.type;
        const id = e.currentTarget.dataset.id;
        AUTH.checkHasLogined().then(isLogined => {
            if (!isLogined) {
                this.setData({
                    wxlogin: false
                })
                this.closePopupTap();
            } else {
                this.setData({shopType: "toPintuan", pintuanType, pintuanID: id});
                this.bindGuiGeTap();
            }
        })

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
    addShopCar() {
        let that = this;
        const pID = this.data.goodsDetail.Pid;
        const buyNumber = this.data.buyNumber;
        AUTH.checkHasLogined().then((isLogined) => {
            that.setData({
                wxlogin: isLogined
            });
            if (!isLogined) {
                this.closePopupTap();
                return
            }
            if (this.data.buyNumber < 1) {
                wx.showModal({
                    title: '提示',
                    content: '请选择正确数量！',
                    showCancel: false
                })
                return;
            }
            AUTH.httpPost('Order/AddCartProduct', {
                pid: pID,
                count: buyNumber,
            }).then((result) => {
                this.closePopupTap();
                wx.showToast({
                    title: '加入购物车',
                    icon: 'success'
                })
            }).catch((err) => {

            })
        })
    },
    /**
     * 立即购买
     */
    buyNow: function (e) {
        let that = this
        let shoptype = e.currentTarget.dataset.shoptype
        AUTH.checkHasLogined().then(isLogined => {
            that.setData({
                wxlogin: isLogined
            })
            if (isLogined) {
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
                            pintuanID: that.data.pintuanID,
                            pintuanType: that.data.pintuanType,
                        })
                    })
                } else {
                    wx.navigateTo({
                        url: "/pages/to-pay-order/index?orderType=buyNow&&buyNumber=" + buyNumber + "&pid=" + pID
                    })
                }
            } else {
                this.closePopupTap();
            }
        })
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
            title: this.data.goodsDetail.Name,
            path: '/pages/goods-details/index?id=' + this.data.goodsDetail.Pid,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
        return _data
    },


    goIndex() {
        wx.switchTab({
            url: '/pages/index/index',
        });
    },

    closePop() {
        this.setData({
            posterShow: false
        })
    }
})
