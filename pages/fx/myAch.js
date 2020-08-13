const CONFIG = require('../../config')
const AUTH = require('../../utils/auth')
Page({
    data: {
      endTime:'',
      startTime:'',
      pvamount: 0,
      surplusmoney: 0,

    },
    onLoad() {
        AUTH.checkHasLogined().then(isLogined => {
            if (isLogined) {
                
            } else {
                wx.showModal({
                    title: '提示',
                    content: '本次操作需要您的登录授权',
                    cancelText: '暂不登录',
                    confirmText: '前往登录',
                    success(res) {
                        if (res.confirm) {
                            wx.switchTab({
                                url: "/pages/my/index"
                            })
                        } else {
                            wx.navigateBack()
                        }
                    }
                })
            }
        })
    },
    getAchieveMent: function() {
      let _this = this;
      AUTH.httpGet("user/GetAchieveMent", { startTime:"2020-05-01",endTime:"2020-08-10" })
      .then((result) => {
        console.log(result,'myyeji')
        _this.setData({...result.content});
      })
      .then((err) => {

      })

    },
    clickChooseStartTime: function(e) {
      let _this = this;
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        startTime: e.detail.value
      },function(){
        _this.afterChange();
      })
    },
    clickChooseEndTime: function(e) {
      let _this = this;
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        endTime: e.detail.value
      },function(){
        _this.afterChange();
      })
    },
    afterChange: function(){
      if(!this.data.startTime.length){
        return;
      }
      if(!this.data.endTime.length){
          return;
      }
      this.getAchieveMent();
    }
})
