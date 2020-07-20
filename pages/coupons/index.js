const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["未使用","已使用", "已失效"],
    activeIndex: 0,
    wxlogin: true,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

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
    var that = this;
    AUTH.checkHasLogined().then(isLogined => {
			if (isLogined) {
				that.getMyCoupons();
				return
			}
			that.setData({ wxlogin: false})
		})
  },
   /**
   *  当登录登录
   */
  afterAuth(e) {
		this.setData({
			wxlogin: true,
		})
		this.getMyCoupons();
	},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
  * 点击tab
  */
  tabClick: function (e) {
    var that = this;
    this.setData({
      activeIndex: e.currentTarget.dataset.id
    },function(o){
      that.getMyCoupons();
    });
  },
   /**
   * 获取到优惠券
   */
  getMyCoupons: function () {
    var _this = this;
    AUTH.httpGet('user/GetUserCouponList',{State:this.data.activeIndex})
    .then(result =>{
      console.log(result,'result')
    }).catch(error =>{
      console.log(error)
    })
  },
  
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },
})