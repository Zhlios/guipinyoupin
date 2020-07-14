const AUTH = require('../../utils/auth')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        balance: 0,
        wxlogin: true, //是否隐藏登录弹窗

        accountInfo: {
            LessMoney: 0,
            LessPoints: 0,
            UnMoney: 0,
            UnPoints: 0,
            CashMonthTotalMoney: 0  // 月累计提现
        },
        TaskType: false, //当为true 的时候不要输入银行卡等信息
        BankName: [], // 选择银行
        TimeStamp: '',
        NonceStr: '',
        TaskSign: '',
        TaxStarting: '',
        Rules: [],  //大额提现规则
        deductTheTax: 0,  //利息
        TaxPercent: 0,  //扣税百分比
        CashMonthTotalMoney: 0,
        DevelopmentFundPercentConfig: 0,//发展基金扣除比例
        MinMoney: 0,
        MaxMoney: 0,
        canCashInMaxMoney: 0,
        fazhanjijin: 0,
        canCashInMinMoney: 0,
        MobileSmsCodeExpirationTime: 60, // 短信时间
        isNeedCash: false, // 是否需要转账
        cashModel: {
            cashNumber: 0, // 提取现金
            remark: '', //备注
            mobile: '', //手机号码
            smscode: '', //短信验证码
            bankName: '', //开户行
            bankUserName: '', //开户姓名
            bankNumber: '', // 银行卡号
            bankAddress: '' // 开户行地址
        },
        index: 0,
        codeMessage: '验证码',
        chooseItem: [
            {title: "普通提现", type: 0},
            {title: "兑换产品", type: 1},
        ],
        selectItem: null,
        selectCommonType: null, // 普通提现的方式
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        AUTH.checkHasLogined()
            .then((isLogin) => {
                if (!isLogin) {
                    _this.setData({wxlogin: false})
                    return
                }
                this.getUserInfo();
                this.getMoney();
                this.clickToGetCashType();
            })
    },
    afterAuth() {
        this.setData({
            wxlogin: true
        })
        this.getUserInfo();
        this.getMoney();
        this.clickToGetCashType();
    },
    getUserInfo() {
        AUTH.httpGet("User/GetUserInfo")
            .then((result) => {
                const mobile = result.content.Mobile;
                this.setData({
                    cashModel: {...this.data.cashModel, mobile}
                })
            })
            .catch((err) => {

            })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        AUTH.checkHasLogined(isLogined => {
            if (!isLogined) {
                this.setData({
                    wxlogin: false
                })
            }
        })
    },
    getMoney: function () {
        let _this = this;
        AUTH.httpGet('user/GetAccountInfo')
            .then((result) => {
                _this.setData({
                    accountInfo: result.content,
                })
            })
            .catch((err) => {

            })
    },

    clickToGetCashType: function () {
        let _this = this
        if (this.data.isNeedCash) {
            return;
        }
        AUTH.httpGet('user/GetTaskType')
            .then((result) => {
                console.log(result, '卡片方式')
                _this.setData({
                    ...result.content,
                    isNeedCash: true,
                    canCashInMaxMoney: result.content.MaxMoney,
                    canCashInMinMoney: result.content.MinMoney,
                })
            })
            .catch((err) => {

            })
    },

    PointNum: function (obj) {
        obj = obj.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
        obj = obj.replace(/^\./g, ""); //验证第一个字符是数字
        obj = obj.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
        obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
        if (obj.indexOf(".") < 0 && obj != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            obj = parseFloat(obj);
        }
        if (!obj || obj == '0' || obj == '0.0' || obj == '0.00') {
            return 0;
        }
        return obj;
    },

    changeCashNumber: function (e) {


        let money = this.PointNum(e.detail.value);
        let fazhanjijin = 0;
        if (money > this.data.canCashInMaxMoney) {
            money = this.data.canCashInMaxMoney;
        }
        fazhanjijin = money * this.data.DevelopmentFundPercentConfig / 100;
        let deductTheTax = 0;
        if (this.data.accountInfo.CashMonthTotalMoney >= this.data.TaxStarting) {
            deductTheTax = money * (this.data.TaxPercent / 100);
        } else {
            const totalMoney = money + this.data.accountInfo.CashMonthTotalMoney;
            const taxMoney = totalMoney - this.data.TaxStarting;
            if (taxMoney > 0) {
                deductTheTax = taxMoney * (this.data.TaxPercent / 100);
            }
        }
        this.setData({
            cashModel: {...this.data.cashModel, cashNumber: money},
            deductTheTax,
            fazhanjijin
        })
    },
    bindPickerChange: function (e) {
        this.setData({
            cashModel: {...this.data.cashModel, bankName: this.data.BankName[e.detail.value]}
        })
    },

    // 选择提现类型
    bindChooseItemChange: function (e) {
        let _this = this;
        this.setData({
            selectItem: this.data.chooseItem[e.detail.value],
        }, function (e) {

            if (_this.data.selectItem.type == 1) {
                _this.setData({
                    selectCommonType: {title: "兑换产品", taskType: 2},
                })
            } else {

                if (_this.data.TaskType == false) {
                    _this.setData({
                        selectCommonType: {title: "兑换产品", taskType: 1},
                    })
                } else {
                    _this.setData({
                        selectCommonType: {title: "兑换产品", taskType: 0},
                    })
                }

            }
            _this.calculateCanCashInMaxMoney();
        })
    },
    // 获取可以提现的最大金额
    calculateCanCashInMaxMoney: function (e) {
        //  如果是大额提现 则要去计算最大提现金额 和最小提现金额
        // 如果是普通提现，则使用当前的数据 maxMoney 和minMoney
        if (this.data.selectItem.type == 1) {
            // 大额度提现
            if (this.data.Rules.length == 0) {
                this.setData({
                    canCashInMaxMoney: this.data.MaxMoney,
                    canCashInMinMoney: this.data.MinMoney,
                })
                return;
            }
            for (var i = 0; i < this.data.Rules.length; i++) {
                var data = this.data.Rules[i];
                if (this.data.accountInfo.LessMoney >= data.fromNumber && this.data.accountInfo.LessMoney <= data.toNumber) {
                    this.setData({
                        canCashInMaxMoney: this.data.accountInfo.LessMoney * data.percentNumber / 100,
                        canCashInMinMoney: 2000,
                    }, function (e) {
                        console.log(this.data.canCashInMaxMoney, 'lll')
                    })

                }
            }
        } else {

            this.setData({
                canCashInMaxMoney: this.data.MaxMoney,
                canCashInMinMoney: this.data.MinMoney,
            })
        }
    },


    changeBankNumber: function (e) {
        this.setData({
            cashModel: {...this.data.cashModel, bankNumber: e.detail.value}
        })
    },
    changeBankUserName: function (e) {
        this.setData({
            cashModel: {...this.data.cashModel, bankUserName: e.detail.value}
        })
    },
    changeBankAddress: function (e) {
        this.setData({
            cashModel: {...this.data.cashModel, bankAddress: e.detail.value}
        })
    },
    changeMobile: function (e) {
        this.setData({
            cashModel: {...this.data.cashModel, mobile: e.detail.value}
        })
    },
    changeSmscode: function (e) {
        this.setData({
            cashModel: {...this.data.cashModel, smscode: e.detail.value}
        })
    },
    changeRemark: function (e) {
        this.setData({
            cashModel: {...this.data.cashModel, remark: e.detail.value}
        })
    },
    // 获取验证码
    getCode: function (e) {

        if (this.data.codeMessage !== '验证码') {
            return;
        }

        if (!this.data.cashModel.mobile.length) {
            wx.showToast({
                title: '请输入手机号码',
                icon: 'none',
            })
            return;
        }

        const isMPStrict = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/g.test(this.data.cashModel.mobile);

        if (isMPStrict == false) {
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
            })
            return;
        }

        let _that = this
        AUTH.httpPost('outapi/GetSmsCode', {mobile: this.data.cashModel.mobile, smsType: 1})
            .then((result) => {
                wx.showToast({
                    title: '短信发送成功',
                    icon: 'none',
                })
                let count = _that.data.MobileSmsCodeExpirationTime
                let timer = setInterval(function () {
                    if (count == 0) {
                        _that.setData({codeMessage: '验证码'})
                        clearInterval(timer)
                        return;
                    }
                    let message = `${count}s`
                    _that.setData({codeMessage: message})
                    count = count - 1;
                }, 1000)
            })
            .catch((err) => {

            })
    },
    //提取
    submitCash: function (e) {
        console.log(this.data.cashModel)
        if (!this.data.selectItem) {
            wx.showToast({
                title: `请选择提现类型`,
                icon: 'none',
            })
            return;
        }

        if (this.data.cashModel.cashNumber < this.data.canCashInMinMoney) {
            wx.showToast({
                title: `提现金额不能少于${this.data.canCashInMinMoney}`,
                icon: 'none',
            })
            return;
        }
        if (this.data.cashModel.cashNumber > this.data.canCashInMaxMoney) {
            wx.showToast({
                title: `提现金额不能大于${this.data.canCashInMaxMoney}`,
                icon: 'none',
            })
            return;
        }
        if (this.data.cashModel.cashNumber % 100) {
            wx.showToast({
                title: "提现金额必须为100的整数倍",
                icon: 'none',
            })
            return;
        }

        if (this.data.selectCommonType.taskType != 0) {

            if (!this.data.cashModel.bankName.length) {
                wx.showToast({
                    title: '请选择开户行',
                    icon: 'none',
                })
                return;
            }
            if (!this.data.cashModel.bankNumber.length) {
                wx.showToast({
                    title: '请输入银行卡号',
                    icon: 'none',
                })
                return;
            }

            const isAccountNumber = /^[1-9]\d{9,29}$/g.test(this.data.cashModel.bankNumber)

            if (isAccountNumber == false) {
                wx.showToast({
                    title: '请输入正确的银行卡号',
                    icon: 'none',
                })
                return;
            }

            if (!this.data.cashModel.bankUserName.length) {
                wx.showToast({
                    title: '请输入开户人姓名',
                    icon: 'none',
                })
                return;
            }

            if (!this.data.cashModel.bankAddress.length) {
                wx.showToast({
                    title: '请输入开户地址',
                    icon: 'none',
                })
                return;
            }

        }

        if (!this.data.cashModel.mobile.length) {
            wx.showToast({
                title: '请输入手机号码',
                icon: 'none',
            })
            return;
        }

        const isMPStrict = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/g.test(this.data.cashModel.mobile);

        if (isMPStrict == false) {
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
            })
            return;
        }

        if (!this.data.cashModel.smscode.length) {
            wx.showToast({
                title: '请输入短信验证码',
                icon: 'none',
            })
            return;
        }

        var json = {
            TimeStamp: this.data.TimeStamp,
            NonceStr: this.data.NonceStr,
            TaskSign: this.data.TaskSign,
            MobileSmsCodeExpirationTime: this.data.MobileSmsCodeExpirationTime,
            taskType: this.data.selectCommonType.taskType,
        }
        console.log(json, 'json')
        let _this = this
        AUTH.httpPost('user/CommissionCash', {...this.data.cashModel, ...json})
            .then((result) => {
                wx.showToast({
                    title: '申请提现成功',
                    icon: 'none',
                });
                _this.setData({
                    cashModel: {
                        ..._this.data.cashModel,
                        cashNumber: 0, // 提取现金
                        remark: '',
                        smscode: '',
                        bankName: '',
                        bankUserName: '',
                        bankNumber: '',
                        bankAddress: ''
                    },
                    deductTheTax: 0,
                    fazhanjijin: 0
                })
            }, () => {
                _this.getMoney();
                _this.clickToGetCashType();
            })
            .catch((err) => {

            })
    },
})
