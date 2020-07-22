// pages/order-details/logistic_detail.js
const AUTH = require("../../utils/auth")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logisticList:[],  //过去的数据
    currentMsg: null,
    osn: '',
    ShipCompany:'',
    ShipAddress:'',
    ShipSn:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.osn = options.osn;
    this.getLogisticDetail();
  },
    /**
   * 获取到订单详情
   */
  getLogisticDetail:function() {
    console.log(this.data.osn,'osn')
    var that = this;
   
    AUTH.httpGet('order/OrderShipInfo',{osn: this.data.osn})
    .then(result => {
      console.log(result,'result')
      var currentMsg ;
      var oldList = [];
      result.content.Data.map((e,index) =>{
        e.nyr =  e.time.split(' ')[0].split('-')[1]+'-'+e.time.split(' ')[0].split('-')[2] ;
        e.xfm = e.time.split(' ')[1].split(':')[1]+':'+e.time.split(' ')[1].split(':')[2] ;
        if(index == 0){
          currentMsg = e;
        }
        if(index>0) {
          oldList.push(e)
        }
      })
      that.setData({logisticList: oldList,currentMsg:currentMsg,...result.content})
    }).catch(error =>{

    });
  }
  
})