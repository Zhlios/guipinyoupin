const AUTH = require('utils/auth')
App({
    onLaunch: function () {
        // WXAPI.init("fireshop") // 从根目录的 config.js 文件中读取
        const that = this;
        // 检测新版本
        // const updateManager = wx.getUpdateManager()
        // updateManager.onUpdateReady(function() {
        // 	wx.showModal({
        // 		title: '更新提示',
        // 		content: '新版本已经准备好，是否重启应用？',
        // 		success(res) {
        // 			if (res.confirm) {
        // 				// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        // 				updateManager.applyUpdate()
        // 			}
        // 		}
        // 	})
        // })
        //检测手机类型
        // wx.getSystemInfo({
        // 	success: function(res) {
        // 		if (res.model.search("iPhone X") != -1) {
        // 			that.globalData.iphone = true;
        // 		}
        // 		if (res.model.search("MI 8") != -1) {
        // 			that.globalData.iphone = true;
        // 		}
        // 	}
        // });
        /**
         * 初次加载判断网络情况
         * 无网络状态下根据实际情况进行调整
         */
        wx.getNetworkType({
            success(res) {
                const networkType = res.networkType
                if (networkType === 'none') {
                    that.globalData.isConnected = false
                    wx.showToast({
                        title: '当前无网络',
                        icon: 'loading',
                        duration: 2000
                    })
                }
            }
        });
        /**
         * 监听网络状态变化
         * 可根据业务需求进行调整
         */
        wx.onNetworkStatusChange(function (res) {
            if (!res.isConnected) {
                that.globalData.isConnected = false
                wx.showToast({
                    title: '网络已断开',
                    icon: 'loading',
                    duration: 2000,
                    complete: function () {
                        that.goStartIndexPage()
                    }
                })
            } else {
                that.globalData.isConnected = true
                wx.hideToast()
            }
        });
    },
    fadeInOut: function (that, param, opacity) {
        const animation = wx.createAnimation({
            //持续时间800ms
            duration: 300,
            timingFunction: 'ease',
        })
        animation.opacity(opacity).step()
        let json = '{"' + param + '":""}'
        json = JSON.parse(json);
        json[param] = animation.export()
        that.setData(json)
    },
    goStartIndexPage: function () {
        setTimeout(function () {
            wx.redirectTo({
                url: "/pages/index/index"
            })
        }, 1000)
    },
    onShow(e) {
        this.globalData.launchOption = e
        // 保存邀请人
        if (e && e.query && e.query.inviter_id) {
            wx.setStorageSync('referrer', e.query.inviter_id)
            if (e.shareTicket) {
                // 通过分享链接进来
                wx.getShareInfo({
                    shareTicket: e.shareTicket,
                    success: res => {
                        // console.error(res)
                        // console.error({
                        //   referrer: e.query.inviter_id,
                        //   encryptedData: res.encryptedData,
                        //   iv: res.iv
                        // })
                    }
                })
            }
        }
        // 自动登录
        AUTH.checkHasLogined().then(isLogined => {
            console.log(`登录状态------------>${isLogined ? "已登录" : "失效"}`)
        })
    },
    globalData: {
        isConnected: true,
        launchOption: undefined,
        vipLevel: 0
    }
})
