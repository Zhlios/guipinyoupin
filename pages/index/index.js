const WXAPI = require('apifm-wxapi')
const CONFIG = require('../../config.js')
const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth')
//获取应用实例
var app = getApp()
Page({
    data: {
        bannerPath: CONFIG.imageThumbPath,
        imagePath: CONFIG.imagePath,
        flashSalePath: CONFIG.flashSalePath,    //秒杀
        spellPath: CONFIG.spellPath,            //拼购
        bargainPath: CONFIG.bargainPath,            //砍价
        imgBanner: CONFIG.imgType.imgBanner,
        img420: CONFIG.imgType.img420,
        img180: CONFIG.imgType.img180,
        inputVal: "", // 搜索框内容
        goodsRecommend: [], // 推荐商品
        kanjiaList: [], //砍价商品列表
        pingtuanList: [], //拼团商品列表
        miaoshaList: [],//秒杀商品列表
        jingpinList: [],//精品商品列表
        hotList:[], //热销商品列表
        newList: [], //新品商品列表
        selectCurrent: 0,
        goods: [],
        scrollTop: 0,
        loadingMoreHidden: true,
        coupons: [],
        curPage: 1,
        pageSize: 10,
        cateScrollTop: 0,
        dotStyle: "square-dot", //swiper指示点样式可选square-dot round-dot
        navigation: [
            {title: "优惠券", image: '/images/index_item01.png', url: '/pages/coupons/list'},
            {title: "签到", image: '/images/index_item02.png', url: '/pages/sign/index'},
            {title: "抢票", image: '/images/index_item03.png', url: '/pages/bidding/bidding'},
            {title: "积分商城", image: '/images/index_item04.png', url: '/pages/integral/list'},
        ],
        banners: [],
        disableSearchJump: true,
        aliveRooms: [],
        allGoods: [],
    },
    tapNav(e) {
        const url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: url
        })
    },
    tabClick: function (e) {
        wx.navigateTo({
            url: '/pages/goods/list?categoryId=' + e.currentTarget.id,
        })
    },
    toDetailsTap: function (e) {
        wx.navigateTo({
            url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
        })
    },
    tapBanner: function (e) {
        wx.navigateTo({
            url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
        })
    },
    bindTypeTap: function (e) {
        this.setData({
            selectCurrent: e.index
        })
    },
    onLoad: function (e) {
        wx.showShareMenu({
            withShareTicket: true
        })
        if (e && e.scene) {
            const scene = decodeURIComponent(e.scene)
            if (scene) {
                wx.setStorageSync('referrer', scene.substring(11))
            }
        }

        this.initPage()
    },
    async initPage() {
        wx.showLoading();
        //获取轮播
        const bannerRes = await AUTH.httpGet("outapi/getadverts");
        const banner = bannerRes.content.AdertTypeInfo.find((item) => {
            return item.TypeVale === "banner";
        });
        banner && this.setData({banners: banner.AdertInfo});
        this.getGoods();
        // this.pingtuanGoods()
        wx.hideLoading()
    },
    onShow: function (e) {
        app.fadeInOut(this, 'fadeAni', 0);
        // 获取购物车数据，显示TabBarBadge
        TOOLS.showTabBarBadge();
    },
    onPageScroll(e) {
        // let scrollTop = this.data.scrollTop
        // this.setData({
        //     scrollTop: e.scrollTop
        // })
        // if (e.scrollTop >= 180) {
        //     wx.setNavigationBarColor({
        //         frontColor: '#000000',
        //         backgroundColor: '#ffffff'
        //     })
        //     app.fadeInOut(this, 'fadeAni', 1)
        //     this.setData({
        //         disableSearchJump: false
        //     })
        // } else {
        //     wx.setNavigationBarColor({
        //         frontColor: '#ffffff',
        //         backgroundColor: '#ffffff'
        //     })
        //     app.fadeInOut(this, 'fadeAni', 0)
        //     this.setData({
        //         disableSearchJump: true //隐藏自定义导航栏时点击到搜索框区域时不跳转搜索页面
        //     })
        // }
    },
    onReachBottom: function () {
        this.setData({
            curPage: this.data.curPage + 1
        });
    },
    onPullDownRefresh: function () {
        this.setData({
            curPage: 1
        });
        this.initPage()
        wx.stopPullDownRefresh()
    },
    //获取首页所有商品
    async getGoods() {
        const that = this;
        this.setData({loadingMoreHidden: true});
        const result = await AUTH.httpGet("outapi/indexdata");
        this.setData({allGoods: result.content}, () => {
            that.setData({
                kanjiaList: that.getGoodsByType(5),
                pingtuanList: that.getGoodsByType(4),
                jingpinList: that.getGoodsByType(1),
                newList: that.getGoodsByType(2),
                hotList:that.getGoodsByType(6),
                miaoshaList: that.getGoodsByType(3),
                loadingMoreHidden: false
            })
        });
    },
    //获取指定商品 1精品2新品3秒杀4拼购5砍价
    getGoodsByType(type) {
        const goods = this.data.allGoods.find(item => item.DataType === type);
        console.log(goods, "@@@@@@@@@@@@@@")
        return goods ? goods.Data : [];
    },
    goCoupons: function (e) {
        wx.navigateTo({
            url: "/pages/coupons/index"
        })
    },
    pingtuanGoods() { // 获取团购商品列表
        const _this = this
        WXAPI.goods({
            pingtuan: true
        }).then(res => {
            if (res.code === 0) {
                _this.setData({
                    pingtuanList: res.data
                })
            }
        })
    },
    bindinput(e) {
        this.setData({
            inputVal: e.detail.value
        })
    },
    bindconfirm(e) {
        this.setData({
            inputVal: e.detail.value
        })
        wx.navigateTo({
            url: '/pages/goods/list?name=' + this.data.inputVal,
        })
    },
    onShareAppMessage: function () {
        return {
            title: CONFIG.shareProfile,
            path: '/pages/index/index'
        }
    },
})
