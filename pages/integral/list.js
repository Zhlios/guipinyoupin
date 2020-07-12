// pages/integral/list.js
const WXAPI = require('apifm-wxapi')
const CONFIG = require('../../config.js')
const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagePath: CONFIG.imagePath,
    img750: CONFIG.imgType.img750,
    img420: CONFIG.imgType.img420,
    query: {
      PageIndex: 0,
      PageSize: 20,
    },
    list : [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPointStoreList();
  },

  /**
   * 获取积分商城
   */
  getPointStoreList:function(e) {
    var that = this; 
    AUTH.httpGet('outapi/PointStore',this.data.query)
    .then(result => {
      console.log(result,'storelist')
      if(that.data.query.PageIndex == 0) {
        that.setData({list: result.rows})
      }else {
        that.setData({list : [...that.data.rows,...result.rows]})
      }

    }).catch(error =>{

    })
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
      // 下拉刷新
      var that = this;
      this.setData({
        query: {
          PageIndex: 0,
          PageSize: 20,
        },
      },function() {
        that.getPointStoreList();
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //上拉刷新
    var that = this;
    this.setData({
      query: {
        PageIndex: this.data.query.PageIndex+1,
        PageSize: 20,
      },
    },function() {
      that.getPointStoreList();
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})