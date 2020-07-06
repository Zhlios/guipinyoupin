//index.js
const app = getApp();
const WXAPI = require('apifm-wxapi');
const CONFIG = require('../../config.js');
const AUTH = require('../../utils/auth.js');
const TOOLS = require('../../utils/tools.js')
Page({
	data: {
		imagePath: CONFIG.imagePath,
		img750: CONFIG.imgType.img750,
    img420: CONFIG.imgType.img420,
		categoryList: [],
		shopList: [],
		show_centent:false,
		if_show:false,
		CateId: 0,
		PageIndex: 0,
		PageSize: 10,
	},
	onShow: function() {
		this.getCategoryList();
		this.getAllShopList();
	},
	getCategoryList: function() {
		var that = this;
		AUTH.httpGet('outapi/getproductcategory',{})
		.then(result => {
			// 把二级id 找出来，然后把数据塞进去
			var arr = [];
			result.content.map(e =>{
				if(e.layer==2) {
					arr.push(e);
				}
			})
			arr.map(e =>{
				e.children = result.content.filter(j => j.parentid == e.cateid) 
			})
			console.log(arr,'arr')
			that.setData({categoryList: arr})
		}).catch(error => {
			console.log(error);
		})
	},
	getAllShopList: function() {
		var that = this;
		var json = {
			CateId:  this.data.CateId,
			PageIndex: this.data.PageIndex,
			PageSize: this.data.PageSize,

		}
		AUTH.httpGet('outapi/productlist',json)
		.then(result => {
			console.log(result)
			if(that.data.PageIndex == 0) {
				that.setData({
					shopList:  result.rows
				})
			}else{
				that.setData({
					shopList: that.data.shopList.concat(result.rows)  
				})
			}
			
		}).catch(error => {
			console.log(error);
		})
	},
	btn: function () {
    var that =this;
    if (!this.data.show_centent) {
      this.setData({
        if_show: true,
        show_centent: true
      })
    } else {
      that.setData({
        show_centent: false
      })
      setTimeout(function () {
        that.setData({
          if_show: false
        })
      },500)
		}
	},
	clickSelectCategory: function(e) {
		console.log(e,'kkkk')
		var that = this;
		var id = e.currentTarget.dataset.id;
		if(id == this.data.CateId) {
			return;
		}
		this.setData({
			CateId: id,
			PageIndex: 0,
		},function(){
			that.btn();
			that.getAllShopList();
		})
		
	},
	clickTopushSearch: function(e) {
		wx.navigateTo({
			url: '../search/index'
		})
	},
	toprefresh: function(e){
		var that = this;
		this.setData({
			PageIndex: 0
		},function() {
			that.getAllShopList();
		})
	},
	bottomrefresh: function(e) {
		var that = this;
		this.setData({
			PageIndex: this.data.PageIndex+1,
		},function() {
			that.getAllShopList();
		})
	},

	
})
