const AUTH = require('../../utils/auth')
//获取应用实例
var app = getApp()
Page({
    data: {
        wxlogin: true,
        consignee: '',
        region: '',
        mobile: '',
        address: '',
        regionTxt: '',
        range: [],
        isdefault: false,
    },
    asid: '',
    province: [],
    city: [],
    area: [],
    cityIdx: 0,
    addressList: [],
    onShow() {
        AUTH.checkHasLogined(isLogined => {
            if (!isLogined) {
                this.setData({
                    wxlogin: false
                })
            }
        })
    },
    afterAuth() {
        this.setData({
            wxlogin: true
        })
    },
    /**
     * 获取当前地址信息
     */
    getAddressDetail(said) {
        let _this = this;
        AUTH.httpGet('user/GetAddresses', {said})
            .then((result) => {
                const data = result.content[0];
                _this.addressList = [data.pHide, data.cHide, data.aHide];
                _this.setData({...data, region: data.regionTxt, isdefault: data.isdefault == 1 ? true : false});
            })
            .catch((err) => {

            })
    },
    async bindSave(e) {
        let linkMan = e.detail.value.consignee;
        let address = e.detail.value.address;
        let mobile = e.detail.value.mobile;
        let isdefault = e.detail.value.isdefault;
        if (linkMan == "") {
            wx.showModal({
                title: '提示',
                content: '请填写联系人姓名',
                showCancel: false
            })
            return
        }
        if (mobile == "") {
            wx.showModal({
                title: '提示',
                content: '请填写手机号码',
                showCancel: false
            })
            return
        }
        if (!this.data.region) {
            wx.showModal({
                title: '提示',
                content: '省市区不能空',
                showCancel: false
            })
            return false;
        }
        if (address == "") {
            wx.showModal({
                title: '提示',
                content: '请填写详细地址',
                showCancel: false
            })
            return
        }
        let postData = {
            consignee: linkMan,
            address: address,
            mobile: mobile,
            isdefault: isdefault ? 1 : 0,
        }
        postData.pHide = this.addressList[0];
        postData.cHide = this.addressList[1];
        postData.aHide = this.addressList[2];
        if (this.said) {
            postData.said = this.said;
        }
        AUTH.httpPost(this.said ? 'user/EditAddresses' : 'user/AddAddresses', postData)
            .then((result) => {
                wx.showToast({title: "添加成功", icon: "success"});
                wx.navigateBack();
            })
            .catch((err) => {

            })
    },
    onLoad: function (e) {
        this.said = e.said;
        if (e.said) {
            this.getAddressDetail(e.said);
            wx.setNavigationBarTitle({title:"修改地址"});
        }
        this.getLocationProvince();
    },
    deleteAddress: function () {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定要删除该收货地址吗？',
            success: function (res) {
                if (res.confirm) {
                    AUTH.httpPost('user/DelAddresses', {said: that.said})
                        .then((result) => {
                            wx.showToast({title: "修改成功", icon: "success"});
                            wx.navigateBack();
                        })
                        .catch(err => {
                            wx.showToast({title: err.content, icon: "fail"});
                        })
                } else {
                    console.log('用户点击取消')
                }
            }
        })
    },
    /**
     * 修改地区
     */
    bindRegionChange(e) {
        let region = "";
        const data = this.data.range;
        const arr = e.detail.value.map((item, idx) => {
            region += data[idx][Number(item)].Name;
            return data[idx][Number(item)].RegionId;
        });
        this.addressList = arr;
        this.setData({
            region
        })
    },
    /**
     * 列表修改时改变
     */
    bindcolumnchange(e) {
        let _this = this;
        const column = e.detail.column;
        const value = e.detail.value
        if (column === 0) {
            const provinceIdId = _this.province[value].RegionId;
            _this.getLocationCity(provinceIdId)
        }
        if (column === 1) {
            _this.cityIdx = value;
            const cityId = _this.city[value].RegionId;
            _this.getLocationArea(cityId);
        }
    },
    /**
     * 获取省级地址
     */
    getLocationProvince() {
        let _this = this;
        AUTH.httpGet("outapi/ProvinceList")
            .then((result) => {
                _this.province = result.content;
                const provinceId = result.content[0].RegionId;
                _this.getLocationCity(provinceId);
            })
            .then((err) => {
            })
    },
    /**
     * 获取省下面的市
     * @param provinceId
     */
    getLocationCity(provinceId) {
        let _this = this;
        AUTH.httpGet("outapi/CityList", {provinceId})
            .then((result) => {
                _this.city = result.content;
                const provinceId = result.content[_this.cityIdx].RegionId;
                _this.getLocationArea(provinceId);
            })
            .catch((err) => {

            })
    },
    /**
     * 获取市下的所有区
     */
    getLocationArea(cityid) {
        let _this = this;
        console.log(cityid, "??????????????????????")
        AUTH.httpGet("outapi/CountyList", {cityid})
            .then((result) => {
                _this.area = result.content;
                const range = [_this.province, _this.city, _this.area];
                console.log(range, "=================")
                _this.setData({range})
            })
            .catch((err) => {

            })
    }
})
