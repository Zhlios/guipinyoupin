const app = getApp()
const AUTH = require('../../utils/auth')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        disabled: false,
        nav_select: false, // 快捷导航
        consignee: '',
        region: '',
        mobile: '',
        address: '',
        isdefault: true,
        regionTxt: '',
        range: [],
        error: '',
        type: undefined,
    },
    province: [],
    city: [],
    area: [],
    cityIdx: 0,
    addressList: [],
    said: "",
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.said = options.said;
        // 获取当前地址信息
        if (options.type) {
            wx.setNavigationBarTitle({
                title: "修改地址"
            });
            this.addressList = [options.provinceiId, options.cityId, options.regionId];
            this.setData({region: options.region, type: options.type,address:options.address});
        } else {
            this.getAddressDetail(options.said);
        }
        this.getLocationProvince();
    },

    /**
     * 获取当前地址信息
     */
    getAddressDetail: function (said) {
        let _this = this;
        AUTH.httpGet('user/GetAddresses', {
            said
        }).then(function (result) {
            const data = result.content[0];
            _this.addressList = [data.pHide, data.cHide, data.aHide];
            _this.setData({...result.content[0], region: result.content[0].regionTxt});
        });
    },

    /**
     * 表单提交
     */
    saveData: function (e) {
        let _this = this,
            values = e.detail.value;
        values.pHide = this.addressList[0];
        values.cHide = this.addressList[1];
        values.aHide = this.addressList[2];
        values.said = this.said;
        if (values.isdefault) {
            values.isdefault = 1;
        } else {
            values.isdefault = 0;
        }

        // 记录formId
        // App.saveFormId(e.detail.formId);

        // 表单验证
        if (!_this.validation(values)) {
            App.showError(_this.data.error);
            return false;
        }

        // 按钮禁用
        _this.setData({
            disabled: true
        });
        if(this.data.type){
            let pages = getCurrentPages();
            const prevPage = pages[pages.length - 2];
            wx.navigateBack({
                success: function () {
                    prevPage.addressChange(_this.addressList, _this.data.region, values.address);
                }
            });
            return;
            return
        }

        // 提交到后端
        AUTH.httpPost('user/EditAddresses', values).then(function (result) {
            App.showSuccess(result.content, function () {
                wx.navigateBack();
            });
        });
    },

    /**
     * 表单验证
     */
    validation: function (values) {
        if (!this.data.type) {
            if (values.consignee === '') {
                this.data.error = '收件人不能为空';
                return false;
            }
            if (values.mobile.length < 1) {
                this.data.error = '手机号不能为空';
                return false;
            }
            if (values.mobile.length !== 11) {
                this.data.error = '手机号长度有误';
                return false;
            }
            let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
            if (!reg.test(values.mobile)) {
                this.data.error = '手机号不符合要求';
                return false;
            }
        }
        if (!this.data.region) {
            this.data.error = '省市区不能空';
            return false;
        }
        if (values.address === '') {
            this.data.error = '详细地址不能为空';
            return false;
        }
        return true;
    },
    /**
     * 列表修改时改变
     */
    bindcolumnchange: function (e) {
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
     * 修改地区
     */
    bindRegionChange: function (e) {
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
     * 获取省级地址
     */
    getLocationProvince: function () {
        let _this = this;
        AUTH.httpGet("outapi/ProvinceList", {}).then(function (result) {
            _this.province = result.content;
            const provinceId = result.content[0].RegionId;
            _this.getLocationCity(provinceId);
        })
    },
    /**
     * 获取省下面的市
     * @param provinceId
     */
    getLocationCity: function (provinceId) {
        let _this = this;
        AUTH.httpGet("outapi/CityList", {provinceId})
        .then(function (result) {
            _this.city = result.content;
            const provinceId = result.content[_this.cityIdx].RegionId;
            _this.getLocationArea(provinceId);
        })
    },
    /**
     * 获取市下的所有区
     */
    getLocationArea: function (cityid) {
        let _this = this;
        AUTH.httpGet("outapi/CountyList", {cityid})
        .then(function (result) {
            _this.area = result.content;
            const range = [_this.province, _this.city, _this.area]
            _this.setData({range})
        })
    }
})
