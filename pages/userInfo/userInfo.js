// pages/user/userinfo.js
const app = getApp()
const AUTH = require('../../utils/auth')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null,
        sexList: [
            {id: 0, name: '男'},
            {id: 1, name: '女'},
        ],
        index: 0,
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
        this.getUserInfo()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },


    updateUserInfo: function (e) {
        // 点击
        let userInfo = this.data.userInfo;
        let _this = this;
        if (userInfo.NickName.length < 1) {
            wx.showToast({
                title: '昵称不能为空',
                icon: "none",
            })
            return
        }

        var json = {
          NickName: userInfo.NickName,
          Address: userInfo.Address,
          Gender: userInfo.Gender,
          ProvinceiId: userInfo.ProvinceiId,
          CityId: userInfo.CityId,
          RegionId: userInfo.RegionId,
          RealName: userInfo.RealName,
        }

      if (json.IsShop) {
        json.WeiChat = userInfo.WeiChat;
        json.CustomerService = userInfo.CustomerService;
      }
        AUTH.httpPost('User/UpdateUserInfo',json)
        .then(function(result){
            wx.showToast({
                title: '修改成功',
            })
            _this.getUserInfo();
        }).catch(function(error){

        })

    },
    getUserInfo: function () {
        let _this = this;
        AUTH.httpGet('User/GetUserInfo',{})
        .then( function(result){
            console.log(result,'ussss');
            _this.setData({
                userInfo: result.content,
            })
        }).catch(function(error){

        })
    },
    bindPickerChange: function (e) {

        if (e.detail.value === '0') {
            this.setData({
                userInfo: {...this.data.userInfo, Gender: 0}
            })
        } else {
            this.setData({
                userInfo: {...this.data.userInfo, Gender: 1}
            })
        }

    },
    addressChange: function (addressList, region, address) {
        this.setData({
            userInfo: {
                ...this.data.userInfo,
                ProvinceiId: addressList[0],
                CityId: addressList[1],
                RegionId: addressList[2],
                regionTxt: region,
                Address: address
            }
        })
    },
    /**
     *去设置地址页面
     */
    toAddressPage: function () {
        let _this = this;
        if (this.data.userInfo.regionTxt) {
            wx.navigateTo({
                url: "/pages/address/detail?" + AUTH.urlEncode({
                    provinceiId: _this.data.userInfo.ProvinceiId,
                    cityId: _this.data.userInfo.CityId,
                    regionId: _this.data.userInfo.RegionId,
                    region: _this.data.userInfo.regionTxt,
                    address: _this.data.userInfo.Address,
                    type: 'userInfo'
                })
            })
            return;
        }
        wx.navigateTo({url: "/pages/address/create?type=userInfo"});
    },
    changeName: function (e) {
        this.setData({
            userInfo: {...this.data.userInfo, RealName: e.detail.value}
        })
    },
    changeContactWechat: function(e) {
      this.setData({
        userInfo: { ...this.data.userInfo, WeiChat: e.detail.value }
      })
    },
    changeContactPhone: function(e) {
      this.setData({
        userInfo: { ...this.data.userInfo, CustomerService: e.detail.value }
      })
    }
})
