const AUTH = require('../utils/auth')

//判断字符串是否在数组中
function isStrInArray(item, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == item) {
            return true;
        }
    }
    return false;
}

// 显示购物车tabBar的Badge
function showTabBarBadge() {
    AUTH.httpGet('order/GetCart')
        .then((result) => {
            if (Array.isArray(result.content)) {
                if (result.content.length === 0) {
                    wx.removeTabBarBadge({
                        index: 2
                    });
                } else {
                    wx.setTabBarBadge({
                        index: 2,
                        text: `${result.content.length}`
                    });
                }
            }
        })
        .catch((err) => {

        })
}

// 返回api工厂一样格式的当前时间
function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 对象转URL
 */
function urlEncode(data) {
    let _result = [];
    for (let key in data) {
        let value = data[key];
        if (Array.isArray(value)) {
            value.forEach(function (_value) {
                _result.push(key + "=" + _value);
            });
        } else {
            _result.push(key + "=" + value);
        }
    }
    return _result.join("&");
}

/**
 * 时间转换
 */
function changeDateFormat(cellval) {

    let date = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10));

    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;

    let currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

    let h = date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours();
    let m1 = date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes();
    let s = date.getSeconds() < 10 ? ("0" + date.getSeconds()) : date.getSeconds();

    return date.getFullYear() + "-" + month + "-" + currentDate + " " + h + ":" + m1 + ":" + s;

}

function changeDateFormatNY(cellval) {

    let date = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10));

    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;

    let currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + currentDate;

}

/**
 * 时分秒倒计时
 */
function countTime(cellval, i) {
    let date = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10)) - 1000 * i;
    //定义变量 d,h,m,s保存倒计时的时间
    let d, h, m, s;
    if (date >= 0) {
        // d = Math.floor(date / 1000 / 60 / 60 / 24);
        h = Math.floor(date / 1000 / 60 / 60 % 24);
        m = Math.floor(date / 1000 / 60 % 60);
        s = Math.floor(date / 1000 % 60);
        h = h < 10 ? ("0" + h) : h;
        m = m < 10 ? ("0" + m) : m;
        s = s < 10 ? ("0" + s) : s;
    }
    return `${h}:${m}:${s}`;
}

function timeChange(cellval) {
    let time = parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10);
    return time;
}

module.exports = {
    isStrInArray: isStrInArray,
    formatTime: formatTime,
    urlEncode: urlEncode,
    changeDateFormat,
    changeDateFormatNY,
    timeChange,
    showTabBarBadge,
    countTime,
}
