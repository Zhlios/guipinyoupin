const WXAPI = require('apifm-wxapi')
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
import ApifmShare from '../../template/share/index.js';

const CONFIG = require('../../config.js')
const AUTH = require('../../utils/auth')
const SelectSizePrefix = "选择："


let videoAd = null; // 视频激励广告

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
        hasMoreSelect: false,
        selectSize: SelectSizePrefix,
        selectSizePrice: 0,
        totalScoreToPay: 0,
        shopNum: 0,
        hideShopPopup: true,
        buyNumber: 0,
        buyNumMin: 1,
        buyNumMax: 0,
        spellproductcfgInfo: {},    //拼团信息
        propertyChildIds: "",
        propertyChildNames: "",
        canSubmit: false, //  选中规格尺寸时候是否允许加入购物车
        shopType: "addShopCar", //购物类型，加入购物车或立即购买，默认为加入购物车
        showShare: false,
        tab: {
            curHdIndex: 0,
            curBdIndex: 0
        },
        favicon: 0,
        dotStyle: "square-dot",
        isInPintuan: false,
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
        this.reputation(e.id)
        this.shippingCartInfo()
    },
    async shippingCartInfo() {
        const token = wx.getStorageSync('token')
        if (!token) {
            return
        }
        const res = await WXAPI.shippingCarInfo(token)
        if (res.code == 0) {
            this.setData({
                shopNum: res.data.number
            })
        }
    },
    onShow() {
        this.getGoodsDetailAndKanjieInfo(this.data.goodsId)
        this.pingtuanList(this.data.goodsId) //更新拼团列表
    },
    afterAuth() {
        this.setData({
            wxlogin: true
        })
        this.shippingCartInfo()
        this.getFav(this.data.goodsId)
    },
    async getGoodDetail(pid) {
        let goodsDetail = await AUTH.httpGet("outapi/productshow", {pid});
        const buyNumber = goodsDetail.content.Number > 0 ? 1 : 0;
        const buyNumMax = goodsDetail.content.Number;
        const spellproductcfgInfo = goodsDetail.content.SpellproductInfo.SpellproductcfgInfo;
        this.setData({goodsDetail: goodsDetail.content, buyNumber, buyNumMax, spellproductcfgInfo});
        WxParse.wxParse('article', 'html', goodsDetail.content.Description, this, 5);
    },
    async getGoodsDetailAndKanjieInfo(goodsId) {
        const that = this;
        const goodsDetailRes = await WXAPI.goodsDetail(goodsId)
        const goodsKanjiaSetRes = await WXAPI.kanjiaSet(goodsId)
        if (goodsDetailRes.code == 0) {
            var selectSizeTemp = SelectSizePrefix;
            if (goodsDetailRes.data.properties) {
                for (var i = 0; i < goodsDetailRes.data.properties.length; i++) {
                    selectSizeTemp = selectSizeTemp + " " + goodsDetailRes.data.properties[i].name;
                }
                that.setData({
                    hasMoreSelect: true,
                    selectSize: selectSizeTemp,
                    selectSizePrice: goodsDetailRes.data.basicInfo.minPrice,
                    totalScoreToPay: goodsDetailRes.data.basicInfo.minScore
                });
            }
            if (goodsDetailRes.data.basicInfo.pingtuan) {
                that.pingtuanList(goodsId)
            }
            that.data.goodsDetail = goodsDetailRes.data;
            if (goodsDetailRes.data.basicInfo.videoId) {
                that.getVideoSrc(goodsDetailRes.data.basicInfo.videoId);
            }
            let _data = {
                goodsDetail: goodsDetailRes.data,
                selectSizePrice: goodsDetailRes.data.basicInfo.minPrice,
                totalScoreToPay: goodsDetailRes.data.basicInfo.minScore,
                buyNumMax: goodsDetailRes.data.basicInfo.stores,
                buyNumber: (goodsDetailRes.data.basicInfo.stores > 0) ? 1 : 0
            }
            if (goodsKanjiaSetRes.code == 0) {
                _data.curGoodsKanjia = goodsKanjiaSetRes.data[0]
                that.data.kjId = goodsKanjiaSetRes.data.id
                // 获取当前砍价进度
                if (!that.data.kjJoinUid) {
                    that.data.kjJoinUid = wx.getStorageSync('uid')
                }
                const curKanjiaprogress = await WXAPI.kanjiaDetail(goodsKanjiaSetRes.data.id, that.data.kjJoinUid)
                const myHelpDetail = await WXAPI.kanjiaHelpDetail(wx.getStorageSync('token'), goodsKanjiaSetRes.data.id, that.data
                    .kjJoinUid)
                if (curKanjiaprogress.code == 0) {
                    _data.curKanjiaprogress = curKanjiaprogress.data
                    _data.kanjiaPercent = 100 * (_data.curGoodsKanjia.originalPrice - _data.curKanjiaprogress.kanjiaInfo.curPrice) /
                        (_data.curGoodsKanjia.originalPrice - _data.curGoodsKanjia.minPrice)
                }
                if (myHelpDetail.code == 0) {
                    _data.myHelpDetail = myHelpDetail.data
                }


            }
            if (goodsDetailRes.data.basicInfo.pingtuan) {
                const pingtuanSetRes = await WXAPI.pingtuanSet(goodsId)
                if (pingtuanSetRes.code == 0) {
                    _data.pingtuanSet = pingtuanSetRes.data
                }
            }
            that.setData(_data);
            WxParse.wxParse('article', 'html', goodsDetailRes.data.content, that, 5);
            console.log(this.data.goodsDetail)
        }
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
    toPingtuan: function (e) {
        AUTH.checkHasLogined().then(isLogined => {
            if (!isLogined) {
                this.setData({
                    wxlogin: false
                })
            } else {
                let pingtuanopenid = 0
                if (e.currentTarget.dataset.pingtuanopenid) {
                    pingtuanopenid = e.currentTarget.dataset.pingtuanopenid
                }
                this.setData({
                    shopType: "toPingtuan",
                    selectSizePrice: this.data.spellproductcfgInfo.price,
                    pingtuanopenid: pingtuanopenid
                });
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
        // 计算当前价格
        // if (canSubmit) {
        //     const res = await WXAPI.goodsPrice(this.data.goodsDetail.basicInfo.id, propertyChildIds)
        //     if (res.code == 0) {
        //         let _price = res.data.price
        //         if (this.data.shopType == 'toPingtuan') {
        //             _price = res.data.pingtuanPrice
        //         }
        //         this.setData({
        //             selectSizePrice: _price,
        //             totalScoreToPay: res.data.score,
        //             propertyChildIds: propertyChildIds,
        //             propertyChildNames: propertyChildNames,
        //             buyNumMax: res.data.stores,
        //             buyNumber: (res.data.stores > 0) ? 1 : 0
        //         });
        //     }
        // }
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
        //组建立即购买信息
        // var buyNowInfo = this.buliduBuyNowInfo(shoptype);
        // 写入本地存储
        // wx.setStorage({
        //     key: "buyNowInfo",
        //     data: buyNowInfo
        // })
        this.closePopupTap();
        const buyNumber = this.data.buyNumber;
        const pID = this.data.goodsDetail.Pid;
        if (shoptype == 'toPingtuan') {
            if (this.data.pingtuanopenid) {
                wx.navigateTo({
                    url: "/pages/to-pay-order/index?orderType=buyNow&pingtuanOpenId=" + this.data.pingtuanopenid
                })
            } else {
                WXAPI.pingtuanOpen(wx.getStorageSync('token'), that.data.goodsDetail.basicInfo.id).then(function (res) {
                    if (res.code == 2000) {
                        that.setData({
                            wxlogin: false
                        })
                        return
                    }
                    if (res.code != 0) {
                        wx.showToast({
                            title: res.msg,
                            icon: 'none',
                            duration: 2000
                        })
                        return
                    }
                    wx.navigateTo({
                        url: "/pages/to-pay-order/index?orderType=buyNow&pingtuanOpenId=" + res.data.id
                    })
                })
            }
        } else {
            wx.navigateTo({
                url: "/pages/to-pay-order/index?orderType=buyNow&&buyNumber=" + buyNumber + "&pid=" + pID
            })
        }

    },
    /**
     * 组建立即购买信息
     */
    buliduBuyNowInfo: function (shoptype) {
        var shopCarMap = {};
        shopCarMap.goodsId = this.data.goodsDetail.Pid;
        shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
        shopCarMap.name = this.data.goodsDetail.basicInfo.name;
        // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸
        shopCarMap.propertyChildIds = this.data.propertyChildIds;
        shopCarMap.label = this.data.propertyChildNames;
        shopCarMap.price = this.data.selectSizePrice;
        // if (shoptype == 'toPingtuan') { // 20190714 拼团价格注释掉
        //   shopCarMap.price = this.data.goodsDetail.basicInfo.pingtuanPrice;
        // }
        shopCarMap.score = this.data.totalScoreToPay;
        shopCarMap.left = "";
        shopCarMap.active = true;
        shopCarMap.number = this.data.buyNumber;
        shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
        shopCarMap.logistics = this.data.goodsDetail.logistics;
        shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

        var buyNowInfo = {};
        if (!buyNowInfo.shopNum) {
            buyNowInfo.shopNum = 0;
        }
        if (!buyNowInfo.shopList) {
            buyNowInfo.shopList = [];
        }
        buyNowInfo.shopList.push(shopCarMap);
        buyNowInfo.kjId = this.data.kjId;
        return buyNowInfo;
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
    reputation: function (goodsId) {
        var that = this;
        WXAPI.goodsReputation({
            goodsId: goodsId
        }).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    reputation: res.data
                });
            }
        })
    },
    pingtuanList: function (goodsId) {
        var that = this;
        WXAPI.pingtuanList({
            goodsId: goodsId,
            status: 0
        }).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    pingtuanList: res.data.result
                });
                //当前用户是否在已经参与拼团
                const curUid = wx.getStorageSync('uid')
                for (let i = 0; i < res.data.result.length; i++) {
                    if (res.data.result[i].uid == curUid) {
                        that.setData({
                            isInPintuan: true
                        });
                        return;
                    }
                }
            }
        })
    },
    getVideoSrc: function (videoId) {
        var that = this;
        WXAPI.videoDetail(videoId).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    videoMp4Src: res.data.fdMp4
                });
            }
        })
    },
    joinKanjia() {
        AUTH.checkHasLogined().then(isLogined => {
            if (isLogined) {
                this.doneJoinKanjia();
            } else {
                this.setData({
                    wxlogin: false
                })
            }
        })
    },
    doneJoinKanjia: function () { // 报名参加砍价活动
        const _this = this;
        if (!_this.data.curGoodsKanjia) {
            return;
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        WXAPI.kanjiaJoin(wx.getStorageSync('token'), _this.data.curGoodsKanjia.id).then(function (res) {
            wx.hideLoading()
            if (res.code == 0) {
                _this.data.kjJoinUid = wx.getStorageSync('uid')
                _this.getGoodsDetailAndKanjieInfo(_this.data.goodsDetail.basicInfo.id)
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            }
        })
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
    getFav(goodsId) {
        WXAPI.goodsFavCheck(wx.getStorageSync('token'), goodsId).then(res => {
            if (res.code == 0) {
                this.setData({
                    favicon: 1
                })
            }
        })
    },
    addToFav: function () {
        AUTH.checkHasLogined(isLogined => {
            if (!isLogined) {
                this.setData({
                    wxlogin: false
                })
                return
            }
        })
        WXAPI.goodsFavPut(wx.getStorageSync('token'), this.data.goodsDetail.basicInfo.id).then(res => {
            if (res.code == 0) {
                wx.showToast({
                    title: '收藏成功',
                    icon: 'success',
                    image: '../../images/active.png',
                    duration: 2000
                })
                this.setData({
                    favicon: 1
                });
            }
        })
    },
    delFav: function () {
        WXAPI.goodsFavDelete(wx.getStorageSync('token'), '', this.data.goodsDetail.basicInfo.id).then(res => {
            if (res.code == 0) {
                wx.showToast({
                    title: '取消收藏',
                    icon: 'success',
                    image: '../../images/error.png',
                    duration: 2000
                })
                this.setData({
                    favicon: 0
                });
            }
        })
    },
    closePop() {
        this.setData({
            posterShow: false
        })
    }
})
