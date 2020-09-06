const CONFIG = require('../../config');
const TOOLS = require('../../utils/tools');
const AUTH = require('../../utils/auth');
Page({
    data: {
        data: [],
        no_more: false,
        total: 0,
    },
    onLoad() {
        this.getData(1);
    },
    pageSize: 20,
    pageIndex: 1,
    /**
     * 获取数据
     */
    getData(pageIndex) {
        const data = this.data.data;
        AUTH.httpGet("user/PassticketUnlockList", {PageSize: this.pageSize, PageIndex: pageIndex})
            .then((res) => {
                const handleData = res.rows.map((item) => {
                    return {
                        ...item,
                        unlockTime: TOOLS.changeDateFormat(item.unlockTime),
                        createTime: TOOLS.changeDateFormat(item.createTime)
                    }
                })
                this.setData({data: [...data, ...handleData], total: res.total});
            })
            .catch(() => {

            })
    },
    /**
     * 下拉到底加载数据
     */
    bindDownLoad() {
        // 已经是最后一页
        const total = this.data.total;
        const data = this.data.data;
        if (data.length >= total) {
            this.setData({no_more: true});
            return false;
        }
        this.getData(++this.pageIndex);
    },
});
