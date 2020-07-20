//index.js
//获取应用实例 获取系统优惠券
const AUTH = require('../../utils/auth.js');
Page({
	data: {
		coupons: [],
		wxlogin: true,  //判断是否登录
	},
	onLoad: function() {
		var that = this
		AUTH.checkHasLogined().then(isLogined => {
			if (isLogined) {
				that.getCoupons();
					return
			}
			that.setData({ wxlogin: false})
		})
	},
	afterAuth(e) {
		this.setData({
			wxlogin: true,
		})
		this.getCoupons();
	},
	getCoupons: function() {
		var that = this;
		AUTH.httpGet('outapi/CouponsList',{})
		.then(result => {
			console.log(result,'result');
			that.setData({
				coupons: result.rows,
			})
		}).catch(error =>{

		})
	},
	givecoupons: function(e) {
		console.log(e);
		var id = e.currentTarget.dataset.id;
		var that = this;
		AUTH.httpPost('user/ActivateCoupon',{coupontypeid: id})
		.then(result =>{
			wx.showToast({
				title: '领券成功',
				icon: 'success',
				duration: 2000
			})
			that.getCoupons();
		}).catch(error =>{

		})

	}
	
	
	
})
