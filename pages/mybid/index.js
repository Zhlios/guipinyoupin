// pages/mybid/index.js
const WXAPI = require('apifm-wxapi')
const CONFIG = require('../../config.js')
const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    query: {
      pageIndex: 1,
      pageSize: 20,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBidsList();
  },

    /**
   * 生命周期函数--监听页面卸载
   */
  getBidsList: function(e) {
    const that = this;
    AUTH.httpGet('user/UserPassTicketList',this.data.query)
    .then(result => {
      result.rows.map(e =>{
        e.endtime = TOOLS.changeDateFormat(e.endtime)
        e.starttime = TOOLS.changeDateFormat(e.starttime)
      })
      if(that.data.query.pageIndex == 1) {
        that.setData({
          list: result.rows,
        })
      }else {
        that.setData({
          list: [...that.data.list,...result.rows]
        })
      }
      wx.stopPullDownRefresh();
    }).catch(error =>{
      wx.stopPullDownRefresh();
    })
  },
  clickCancel: function(e) {
    console.log(e)
    var that = this;
    var id = e.currentTarget.dataset.id;
    AUTH.httpPost('user/CanclePassTicket',{id:id})
    .then(result =>{
      wx.showToast({
        title: '取消兑换成功',
      })
      that.getBidsList();
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
    const that = this;
    this.setData({
      query: {
        pageIndex: 1,
        PageSize: 20,
      },
    },()=>{
      that.getBidsList();
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
        pageIndex: this.data.query.pageIndex+1,
        PageSize: 20,
      },
    },()=> {
      that.getBidsList();
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})