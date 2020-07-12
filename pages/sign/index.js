const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Page({
	data: {
		score: 0, // 通政票
		scoreSignContinuous: 0, //连续签到次数
		isSigned: false, //今天是否已签到
		wxlogin: true, //是否隐藏登录弹窗
	},

	onShow() {
	//	console.log('kkkkkk');
		let that = this;
		AUTH.checkHasLogined().then(isLogined => {
			console.log(isLogined,'lllll');
			this.setData({
				wxlogin: isLogined
			})
			if(isLogined) {
				that.getAllScore();
				that.getTodayisSign();
				that.getSignHistory();
				// 如果登录成功了 就去 获取所有的通证票， 获取是否已经签到 。 获取到当月的签到
			}
		})
	},
	afterAuth(e) {
		this.setData({
			wxlogin: true, 
		})
		that.getAllScore();
		that.getTodayisSign();
		that.getSignHistory();
	},
	// 获取所有的通政票
	getAllScore: function() {
		let that = this;
		AUTH.httpGet('user/GetAccountInfo', {},)
				.then((result) => {
						that.setData({score: result.content.CpassTicketLessCount})
				})
				.catch((err) => {
				})
	},

	// 获取今天是否签到
	getTodayisSign: function() {
		let that = this;
		AUTH.httpGet('user/GetSignInTodayFlag', {},)
		.then((result) => {
			console.log(result,'isSign')
			that.setData({isSigned: result.content})
		})
		.catch((err) => {
		})
	},
	// 获取到本月签到列表
	getSignHistory: function(year,month) {
		let that = this;
		console.log(this.calendar.getCurrentYM(),'calender')	
		let json = this.calendar.getCurrentYM();
		AUTH.httpGet('user/GetSignInInfo', json,)
		.then((result) => {
			console.log(result)
			result.content.forEach(ele => {
				console.log(ele)
				console.log(parseInt(ele.signInTime.split("-")[0]),'kk');
				that.calendar.setTodoLabels({
					pos: 'bottom',
					dotColor: '#40',
					days: [{
						year: parseInt(ele.signInTime.split("-")[0]),
						month: parseInt(ele.signInTime.split("-")[1]),
						day: parseInt(ele.signInTime.split("-")[2]),
						todoText: '已签到'
					}],
				});
			})
		})
		.catch((err) => {
		})	
	},
	// 当改变日期
	whenChangeDate:function(e) {
		console.log(e);
		this.getSignHistory();
	},
	//签到按钮
	scoreSign: function() {
	 // 进行签到
	 let that = this; 
		AUTH.httpPost('user/DailySignIn',{})
		.then(result => {
			console.log(result,'sign')
			wx.showToast({
				title: '签到成功',
				icon: 'none',
				duration: 2000
			})
			that.getAllScore();
			that.getTodayisSign();
			that.getSignHistory();
		})
		.catch(error =>{
		})	
	},

	onLoad: function() {

	},
})
