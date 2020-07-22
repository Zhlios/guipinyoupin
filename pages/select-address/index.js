const AUTH = require('../../utils/auth')

const app = getApp()
Page({
    data: {
        addressList: [],
        options: {},
        wxlogin: true
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

    onLoad: function (e) {
        this.setData({
            options: e
        })
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
        that.setData({addressList: addressList.content});
    },
    /**
     * 设置为默认地址
     */
    setDefault: function (e) {
        if (this.data.options.from === 'order') {
            let address_id = e.currentTarget.dataset.id;
            AUTH.httpPost('user/SetDefaultAddress', {
                id:address_id
            })
                .then((result) => {
                    wx.navigateBack();
                })
                .catch(() => {

                })
        }
    }
})
