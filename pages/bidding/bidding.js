// pages/freshman/freshman.js
const app = getApp()
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOL = require('../../utils/tools')
Page({
	data: {
		bidList: [],
    wxlogin:true,
	},
	afterAuth() {
		this.setData({
			wxlogin: true
    })
    this.getPassTicketList()
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

    // var json = {
    //   endtime: "/Date(1593179528000)/",
    //   handle: false,
    //   isBidding: true,
    //   lessCnt: 0,
    //   name: "111111",
    //   oneMoney: 37,
    //   percentNumber: 6,
    //   recoredId: 2,
    //   starttime: "/Date(1587010821000)/",
    //   status: false,
    //   totalCnt: 6,
    // }
    // json.endtime = TOOL.changeDateFormatNY(json.endtime)
    // json.starttime = TOOL.changeDateFormatNY(json.starttime)
    // this.setData({
    //   bidList: [json]
    // })
    // return
    let that = this;
		AUTH.checkHasLogined().then(isLogined => {
			this.setData({
				wxlogin: isLogined
			})
			if(isLogined) {
        // 如果登录了获取 通政配置接口
        that.getPassTicketList();
			}
		})
  },
  getPassTicketList: function(e) {
    var that = this;
    AUTH.httpGet('user/PassTicketList', {},)
    .then((result) => {
      result.rows.map(e=>{
        e.endtime = TOOL.changeDateFormatNY(e.endtime)
        e.starttime = TOOL.changeDateFormatNY(e.starttime)
      })
      that.setData({
        bidList:result.rows,
      })
      console.log(result,'result');
    })
    .catch((err) => {
    })
  },
  clickBiding: function(e) {
    console.log(e)
    var that = this;
    var enable = e.currentTarget.dataset.enable;
    var id = e.currentTarget.dataset.id;
    if(enable == false) {
      wx.showToast({
        title: '当前不可竞标',
        icon:'none'
      })
      return;
    }
    AUTH.httpPost('user/RushBuyPassTicket',{id: id})
    .then(result=>{
      wx.showToast({
        title: '兑换成功',
        icon:'none',
      })
      that.getPassTicketList();
    }).catch(error=>{

    })
  },
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
