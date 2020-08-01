const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const CONFIG = require('../../config');
Page({
    data: {
        orderId: 1,
        amount: 999.00,

        refundApplyDetail: undefined,

        type: 0,
        typeItems: [
            '',
            '我要退款(无需退货)',
            '我要退货退款',
        ],

        logisticsStatus: null,
        logisticsStatusItems: [
            '未收到货',
            '已收到货'
        ],
        reasons: [
            "不喜欢/不想要",
            "空包裹",
            "未按约定时间发货",
            "快递/物流一直未送达",
            "货物破损已拒签",
            "退运费",
            "规格尺寸与商品页面描述不符",
            "功能/效果不符",
            "质量问题",
            "少件/漏发",
            "包装/商品破损",
            "发票问题",
        ],
        reasonIndex: null,

        files: [],
        pics: [],
        maxImgCount: 9, //允许上传图片数,最多9张
    },
    onLoad: function (e) {
        this.setData({
            orderId: e.id,
            type: e.type
        });
    },
    onShow() {
        const _this = this
        WXAPI.refundApplyDetail(wx.getStorageSync('token'), _this.data.orderId).then(res => {
            if (res.code == 0) {
                _this.setData({
                    refundApplyDetail: res.data[0] // baseInfo, pics
                })
            }
        })
    },
    refundApplyCancel() {
        const _this = this
        WXAPI.refundApplyCancel(wx.getStorageSync('token'), _this.data.orderId).then(res => {
            if (res.code == 0) {
                wx.navigateTo({
                    url: "/pages/order-list/index"
                })
            }
        })
    },
    typeChange(e) {
        this.setData({
            type: e.detail.value
        })
    },
    logisticsStatusChange(e) {
        this.setData({
            logisticsStatus: e.detail.value
        })
    },
    typeItemsChange: function (e) {
        const typeItems = this.data.typeItems;
        for (var i = 0, len = typeItems.length; i < len; ++i) {
            typeItems[i].checked = typeItems[i].value == e.detail.value;
        }
        this.setData({
            typeItems: typeItems,
            type: e.detail.value
        });
    },
    logisticsStatusItemsChange: function (e) {
        const logisticsStatusItems = this.data.logisticsStatusItems;
        for (var i = 0, len = logisticsStatusItems.length; i < len; ++i) {
            logisticsStatusItems[i].checked = logisticsStatusItems[i].value == e.detail.value;
        }
        this.setData({
            logisticsStatusItems: logisticsStatusItems,
            logisticsStatus: e.detail.value
        });
    },
    reasonChange: function (e) {
        this.setData({
            reasonIndex: e.detail.value
        })
    },
    chooseImage: function (e) {
        const that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            count: that.data.maxImgCount - that.data.files.length,
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
            }
        })
    },
    previewImage: function (e) {
        const that = this;
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: that.data.files // 需要预览的图片http链接列表
        })
    },
    delImg(e) {
        wx.showModal({
            title: '删除图片',
            content: '确定要删除这张图片吗？',
            cancelText: '取消',
            confirmText: '删除',
            success: res => {
                if (res.confirm) {
                    this.data.files.splice(e.currentTarget.dataset.index, 1);
                    this.setData({
                        files: this.data.files
                    })
                }
            }
        })
    },
    async uploadPics() {
        const _this = this;
        for (let i = 0; i < _this.data.files.length; i++) {
            const res = await this.uploadFile(i);
            // if (res.code == 0) {
            //     _this.data.pics.push(res.data.url)
            // }
        }
    },
    uploadFile(i) {
        const _this = this;
        return new Promise(((resolve, reject) => {
            wx.uploadFile({
                url: CONFIG.baseUrl + "order/UploadImgFile", filePath: _this.data.files[i], name: "file", formData: {
                    'operation': 'uploadsaleserviceimage',
                    'osn': _this.data.orderId,
                },
                header: {'Cookie': wx.getStorageSync('cookie')},
                success: (result) => {
                    resolve(result.data)
                },
                fail: (err) => {
                    reject(err)
                }
            })
        }))
    },
    async bindSave(e) {
        // 提交保存
        const _this = this;
        // let amount = e.detail.value.amount;
        // if (_this.data.type == 2) {
        // 	amount = 0.00
        // }
        let remark = e.detail.value.remark;
        if (!remark) {
            remark = ''
        }
        let act = this.data.type === "1" ? 2 : 3;
        // 上传图片
        wx.showLoading({title: '正在上传', mask: true})
        _this.data.type == 2 && await _this.uploadPics();
        // _this.data.pics
        AUTH.httpPost('order/UpdateOrder', {desc: remark, oid: _this.data.orderId, act})
            .then(res => {
                wx.hideLoading()
                wx.showModal({
                    title: '成功',
                    content: '提交成功，请耐心等待我们处理！',
                    showCancel: false,
                    confirmText: '我知道了',
                    success(res) {
                        wx.navigateBack();
                    }
                })
            })
            .catch((err) => {
                wx.hideLoading();
                wx.navigateBack();
            })
    },
});
