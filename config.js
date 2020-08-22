const baseUrl = "https://app.ynhcn.net"; // 这个是予农惠的
//const baseUrl = "https://app.hnxyql.com"; //  这个是予农惠优选的
// id : wx027ca1f05063fc1e  // 这个是严选的
// appid :  wx5b78b1b8d2dd440d 这个是 予农惠的
const type = "/mobile/"
module.exports = {
    url: baseUrl,
    baseUrl: baseUrl + type,
    imagePath: baseUrl + '/uploadfile/product/show/thumb',
    imageThumbPath: baseUrl + '/uploadfile/adv/thumb',
    uploadImgPath: baseUrl + "/uploadfile/userrank/",
    killImgPath: baseUrl + "/uploadfile/FlashSale/thumb",
    flashSalePath: baseUrl + "/uploadfile/FlashSale/thumb",    //秒杀
    spellPath: baseUrl + "/uploadfile/Spell/thumb",            //拼购
    bargainPath: baseUrl + "/uploadfile/Bargain/thumb",           //砍价
    imgType: {
        img42: "42_42/",
        img50: "50_50/",
        img180: "180_180/",
        img220: "220_220/",
        img420: "420_420/",
        img800: "800_800/",
        imgBanner:"750_350/"
    },
    version: "2.1.0",
    note: '增加小程序直播功能', // 这个为版本描述，无需修改
    shareProfile: '百款精品商品，总有一款适合您', // 首页转发的时候话术
    goodsDetailSkuShowType: 0, // 0 为点击立即购买按钮后出现规格尺寸、数量的选择； 1为直接在商品详情页面显示规格尺寸、数量的选择，而不弹框
}
