const base_url = "https://www.ynhcn.net/mobile/";

// const base_url = "http://121.196.23.109:8001/mobile/";
async function checkSession() {
    return new Promise((resolve, reject) => {
        wx.checkSession({
            success() {
                return resolve(true)
            },
            fail() {
                return resolve(false)
            }
        })
    })
}

// 检测登录状态，返回 true / false
async function checkHasLogined() {
    const token = wx.getStorageSync('token')
    if (!token) {
        return false
    }
    const loggined = await checkSession();
    if (!loggined) {
        wx.removeStorageSync('token')
        return false
    }
    const checkTokenRes = await httpGet("User/GetUserInfo");
    if (checkTokenRes.code === 3) {
        wx.removeStorageSync('token')
        return false
    }
    return true
}


function loginOut() {
    wx.removeStorageSync('token');
    // wx.removeStorageSync('uID');
    wx.removeStorageSync('userImg');
}


/**
 * get请求
 */
async function httpGet(url, data = {}) {
    wx.showNavigationBarLoading();
    data = data || {};
    return new Promise((resolve, reject) => {
        wx.request({
            url: base_url + url,
            header: {
                "content-type": "application/json",
                'Cookie': wx.getStorageSync('cookie'),
            },
            data: data,
            success(res) {

                if (res.statusCode !== 200 || typeof res.data !== "object") {
                    wx.showModal({
                        title: '友情提示',
                        content: "网络请求出错",
                        showCancel: false
                    });
                    reject(res);
                    return;
                }
                if (res.data.code === 1) {
                    resolve(res.data);
                    return;
                }
                if (res.data.code === 3) {
                    // 登录态失效
                    resolve(res.data);
                    return;
                }
                wx.showModal({
                    title: '友情提示',
                    content: "网络请求出错",
                    showCancel: false,
                    success: function () {
                        reject(res)
                    }
                });
            },
            fail(res) {
                wx.showModal({
                    title: '友情提示',
                    content: res.errMsg,
                    showCancel: false
                });
                reject(res);
            },
            complete(res) {
                wx.hideLoading();
                wx.hideNavigationBarLoading();
            },
        });
    })
}

/**
 * post提交
 */
async function httpPost(url, data = {}) {
    wx.showNavigationBarLoading();
    data.wxapp_id = "10001";
    data.token = wx.getStorageSync("token");
    return new Promise((resolve, reject) => {
        wx.request({
            url: base_url + url,
            header: {
                "content-type": "application/x-www-form-urlencoded",
                'Cookie': wx.getStorageSync('cookie'),
            },
            method: "POST",
            data: data,
            success(res) {
                if (res.statusCode !== 200 || typeof res.data !== "object") {
                    wx.showModal({
                        title: '友情提示',
                        content: res.errMsg,
                        showCancel: false
                    })
                    reject(res);
                    return
                }
                if (res.data.code === 1) {
                    // 业务逻正常
                    if (url === 'outapi/LoginByOpenId' || url === 'OutApi/LoginIn') {
                        //如果url 为 登录成功接口，存storage
                        wx.setStorageSync('cookie', res.header['Set-Cookie']);
                    }
                    resolve(res.data);
                    return;
                }
                if (res.data.code === 3) {
                    // 登录态失效, 重新登录表示令牌校验不通过
                    resolve(res.data);
                    return
                }
                wx.showModal({
                    title: '友情提示',
                    content: res.data.content,
                    showCancel: false,
                    success: function () {
                        reject(res)
                    }
                });
            },
            fail(res) {
                wx.showModal({
                    title: '友情提示',
                    content: res.errMsg,
                    showCancel: false
                })
                reject(res);
            },
            complete(res) {
                wx.hideLoading();
                wx.hideNavigationBarLoading();
            },
        });
    })
}

/**
 * 图片转base64方法
 * @param imgUrl
 * @param success
 */
function imgToBase64(imgUrl, success) {
    let App = this;
    wx.request({
        url: imgUrl,
        responseType: 'arraybuffer',
        success: res => {
            let base64 = wx.arrayBufferToBase64(res.data);
            success && success();
            App.httpPost("user/UploadUserRankAvatar", {base64String: base64});
        }
    })
}

module.exports = {
    checkHasLogined: checkHasLogined,
    loginOut: loginOut,
    httpGet,
    httpPost,
    imgToBase64
}
