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
        PointsProductsModel: null,  //  积分信息
        spellproductListInfo: [],
        spellproductcfgInfo: {},    //拼团信息
        bargainProductEditResModel: {},//砍价信息
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
    async getGoodDetail(id) {
        let goodsDetail = await AUTH.httpGet("outapi/PointProductShow", {recordId:id});
        console.log(goodsDetail,'detail')
        const buyNumber = goodsDetail.content.Number > 0 ? 1 : 0;
        const buyNumMax = goodsDetail.content.Number;
        const spellproductcfgInfo = goodsDetail.content.SpellproductInfo.SpellproductcfgInfo;
        const spellproductListInfo = goodsDetail.content.SpellproductInfo.SpellproductListInfo;
        const bargainProductEditResModel = goodsDetail.content.BargainProductEditResModel;
        const PointsProductsModel = goodsDetail.content.PointsProductsModel;
        this.setData({
            goodsDetail: goodsDetail.content,
            buyNumber,
            buyNumMax,
            spellproductListInfo,
            spellproductcfgInfo,
            bargainProductEditResModel,
            PointsProductsModel
        });
        WxParse.wxParse('article', 'html', goodsDetail.content.Description, this, 5);
    },
    afterAuth() {
        this.setData({
            wxlogin: true
        })
        this.getGoodDetail();
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
     * 立即购买
     */
    buyNow: function (e) {
        let that = this
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
                const buyNumber = this.data.buyNumber;
                wx.navigateTo({
                    url: "/pages/to-pay-order/index?orderType=integral&&buyNumber=" + buyNumber + "&pid=" + that.data.goodsId
                })   
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
            path: '/pages/integral/index?id=' + this.data.goodsId,
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
