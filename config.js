const baseUrl = "https://www.ynhcn.net";
// const baseUrl = "http://121.196.23.109:8001";
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
        img800: "750_350/",
    },
    version: "2.1.0",
    note: '增加小程序直播功能', // 这个为版本描述，无需修改
    shareProfile: '百款精品商品，总有一款适合您', // 首页转发的时候话术
    goodsDetailSkuShowType: 0, // 0 为点击立即购买按钮后出现规格尺寸、数量的选择； 1为直接在商品详情页面显示规格尺寸、数量的选择，而不弹框
}
