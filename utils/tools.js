const WXAPI = require('apifm-wxapi')
//判断字符串是否在数组中
function isStrInArray(item, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == item) {
            return true;
        }
    }
    return false;
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



module.exports = {
    isStrInArray: isStrInArray,
    formatTime: formatTime,
    urlEncode: urlEncode,
    changeDateFormat,
    changeDateFormatNY,
}
