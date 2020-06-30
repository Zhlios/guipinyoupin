const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

const app = getApp()
Page({
    data: {
        addressList: [],
        wxlogin: true
    },

    selectTap: function (e) {
        var id = e.currentTarget.dataset.id;
        WXAPI.updateAddress({
            token: wx.getStorageSync('token'),
            id: id,
            isDefault: 'true'
        }).then(function (res) {
            wx.navigateBack({})
        })
    },

    addAddess: function () {
        wx.navigateTo({
            url: "/pages/address-add/index"
        })
    },

    editAddess: function (e) {
        wx.navigateTo({
            url: "/pages/address-add/index?said=" + e.currentTarget.dataset.id
        })
    },

    onLoad: function () {
    },
    afterAuth() {
        this.setData({
            wxlogin: true
        })
        this.getAddressList()
    },
    closeAuth() {
        wx.navigateBack()
    },
    onShow: function () {
        AUTH.checkHasLogined().then(isLogined => {
            if (!isLogined) {
                this.setData({
                    wxlogin: false
                })
                return
            }
            this.getAddressList();
        })
    },
    /**
     * 获取收货地址列表
     */
    getAddressList: async function () {
        let that = this;
        console.log(wx.getStorageSync('cookie'), 'cookie')
        const addressList = await AUTH.httpGet('user/GetAddresses', {said: 0});
        that.setData({addressList:addressList.content});
    },
})
