// pages/search/search.js
const CONFIG = require('../../config.js')
const TOOLS = require('../../utils/tools')
const AUTH = require('../../utils/auth')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imagePath: CONFIG.imagePath,
        img420: CONFIG.imgType.img420,
        search: true,
        noneHidden: true,
        searchHidden: true,
        recentSearch: [],
        searchValue: '',
    },
    getRecentSearch: function () {
        let recentSearch = wx.getStorageSync('recentSearch');
        this.setData({
            recentSearch
        });
    },
    clearHistory: function () {
        wx.clearStorageSync('recentSearch')
        this.setData({
            recentSearch: []
        })
    },
    goSearch: function (e) {
        this.search(e)
    },
    search: function (e) {
        let that = this
        let keywords;
        e.detail.value ? keywords = e.detail.value : keywords = e.currentTarget.dataset.text,
            that.data.searchValue = keywords;
        if (that.data.searchValue) {
            // 记录最近搜索
            let recentSearch = wx.getStorageSync('recentSearch') || [];
            if (!TOOLS.isStrInArray(keywords, recentSearch)) {
                recentSearch.unshift(that.data.searchValue);
                wx.setStorageSync('recentSearch', recentSearch)
                that.setData({
                    recentSearch: recentSearch
                })
            }
        }
        AUTH.httpGet("outapi/productsearch", {Word: keywords})
            .then((result) => {
                const res = result.rows;
                console.log(result, "??????????????")
                let searchs = [];
                for (var i = 0; i < res.length; i++) {
                    searchs.push(res[i]);
                }
                that.setData({
                    searchs: searchs,
                    searchHidden: false,
                    noneHidden: true
                });
                // } else {
                //     that.setData({
                //         searchHidden: true,
                //         noneHidden: false
                //     });
                // }
            })
            .catch((err) => {

            })
    },
    searchFocus: function () {
        this.setData({
            search: false,
            searchInput: true
        })
    },
    searchClose: function () {
        // this.getRecentSearch()
        this.setData({
            search: true,
            searchInput: false,
            searchHidden: true
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getRecentSearch();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
