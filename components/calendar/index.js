!function (e) {
    var t = {};

    function a(n) {
        if (t[n]) return t[n].exports;
        var o = t[n] = {i: n, l: !1, exports: {}};
        return e[n].call(o.exports, o, o.exports, a), o.l = !0, o.exports
    }

    a.m = e, a.c = t, a.d = function (e, t, n) {
        a.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: n})
    }, a.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
    }, a.t = function (e, t) {
        if (1 & t && (e = a(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var n = Object.create(null);
        if (a.r(n), Object.defineProperty(n, "default", {
            enumerable: !0,
            value: e
        }), 2 & t && "string" != typeof e) for (var o in e) a.d(n, o, function (t) {
            return e[t]
        }.bind(null, o));
        return n
    }, a.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return a.d(t, "a", t), t
    }, a.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, a.p = "", a(a.s = 8)
}([function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var n = class {
        constructor(e) {
            this.Component = e
        }

        getData(e) {
            const t = this.Component.data;
            if (!e) return t;
            if (e.includes(".")) {
                return e.split(".").reduce((e, t) => e[t], t)
            }
            return this.Component.data[e]
        }

        setData(e, t = (() => {
        })) {
            e && "object" == typeof e && this.Component.setData(e, t)
        }
    };
    t.default = n
}, function (e, t, a) {
    "use strict";
    let n;

    function o() {
        return n || (n = wx.getSystemInfoSync())
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.getSystemInfo = o, t.isComponent = function (e) {
        return e && void 0 !== e.__wxExparserNodeId__ && "function" == typeof e.setData
    }, t.isIos = c, t.getCurrentPage = l, t.getComponent = function (e) {
        const t = new r;
        let a = l() || {};
        if (a.selectComponent && "function" == typeof a.selectComponent) {
            if (e) return a.selectComponent(e);
            t.warn("???????????????ID")
        } else t.warn("???????????????????????????????????????????????????")
    }, t.uniqueArrayByDate = function (e = []) {
        let t = {}, a = [];
        e.forEach(e => {
            t[`${e.year}-${e.month}-${e.day}`] = e
        });
        for (let e in t) a.push(t[e]);
        return a
    }, t.delRepeatedEnableDay = function (e = [], t = []) {
        let a, n;
        if (2 === t.length) {
            const {startTimestamp: e, endTimestamp: o} = i(t);
            a = e, n = o
        }
        return f(e).filter(e => e < a || e > n)
    }, t.convertEnableAreaToTimestamp = i, t.getDateTimeStamp = d, t.converEnableDaysToTimestamp = f, t.initialTasks = t.GetDate = t.Slide = t.Logger = void 0;

    class r {
        info(e) {
            console.log("%cInfo: %c" + e, "color:#FF0080;font-weight:bold", "color: #FF509B")
        }

        warn(e) {
            console.log("%cWarn: %c" + e, "color:#FF6600;font-weight:bold", "color: #FF9933")
        }

        tips(e) {
            console.log("%cTips: %c" + e, "color:#00B200;font-weight:bold", "color: #00CC33")
        }
    }

    t.Logger = r;
    t.Slide = class {
        isUp(e = {}, t = {}) {
            const {startX: a, startY: n} = e, o = t.clientX - a;
            return t.clientY - n < -60 && o < 20 && o > -20 && (this.slideLock = !1, !0)
        }

        isDown(e = {}, t = {}) {
            const {startX: a, startY: n} = e, o = t.clientX - a;
            return t.clientY - n > 60 && o < 20 && o > -20
        }

        isLeft(e = {}, t = {}) {
            const {startX: a, startY: n} = e, o = t.clientX - a, r = t.clientY - n;
            return o < -60 && r < 20 && r > -20
        }

        isRight(e = {}, t = {}) {
            const {startX: a, startY: n} = e, o = t.clientX - a, r = t.clientY - n;
            return o > 60 && r < 20 && r > -20
        }
    };

    class s {
        newDate(e, t, a) {
            let n = `${+e}-${+t}-${+a}`;
            return c() && (n = `${+e}/${+t}/${+a}`), new Date(n)
        }

        thisMonthDays(e, t) {
            return new Date(Date.UTC(e, t, 0)).getUTCDate()
        }

        firstDayOfWeek(e, t) {
            return new Date(Date.UTC(e, t - 1, 1)).getUTCDay()
        }

        dayOfWeek(e, t, a) {
            return new Date(Date.UTC(e, t - 1, a)).getUTCDay()
        }

        todayDate() {
            const e = new Date;
            return {year: e.getFullYear(), month: e.getMonth() + 1, date: e.getDate()}
        }

        todayTimestamp() {
            const {year: e, month: t, date: a} = this.todayDate();
            return this.newDate(e, t, a).getTime()
        }

        toTimeStr(e) {
            return `${e.year}-${e.month}-${e.day}`
        }

        sortDates(e, t) {
            return e.sort(function (e, a) {
                return d(e) < d(a) && "desc" !== t ? -1 : 1
            })
        }

        prevMonth(e) {
            return +e.month > 1 ? {year: e.year, month: e.month - 1} : {year: e.year - 1, month: 12}
        }

        nextMonth(e) {
            return +e.month < 12 ? {year: e.year, month: e.month + 1} : {year: e.year + 1, month: 1}
        }
    }

    function c() {
        const e = o();
        return /iphone|ios/i.test(e.platform)
    }

    function l() {
        const e = getCurrentPages();
        return e[e.length - 1]
    }

    function i(e = []) {
        const t = new s, a = e[0].split("-"), n = e[1].split("-"), o = new r;
        return 3 !== a.length || 3 !== n.length ? (o.warn('enableArea() ???????????????: ["2018-2-1", "2018-3-1"]'), {}) : {
            start: a,
            end: n,
            startTimestamp: t.newDate(a[0], a[1], a[2]).getTime(),
            endTimestamp: t.newDate(n[0], n[1], n[2]).getTime()
        }
    }

    function d(e) {
        if ("[object Object]" !== Object.prototype.toString.call(e)) return;
        return (new s).newDate(e.year, e.month, e.day).getTime()
    }

    function f(e = []) {
        const t = new r, a = new s, n = [];
        return e.forEach(e => {
            if ("string" != typeof e) return t.warn("enableDays()????????????????????????");
            const o = e.split("-");
            if (3 !== o.length) return t.warn("enableDays()????????????????????????");
            const r = a.newDate(o[0], o[1], o[2]).getTime();
            n.push(r)
        }), n
    }

    t.GetDate = s;
    t.initialTasks = {flag: "finished", tasks: []}
}, function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    const n = {
        lunarInfo: [19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970, 19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450, 38320, 84343, 18800, 42160, 46261, 27216, 27968, 109396, 11104, 38256, 21234, 18800, 25958, 54432, 59984, 28309, 23248, 11104, 100067, 37600, 116951, 51536, 54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344, 46423, 27808, 46416, 86869, 19872, 42416, 83315, 21168, 43432, 59728, 27296, 44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925, 19152, 42192, 54484, 53840, 54616, 46400, 46752, 103846, 38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256, 19189, 18800, 25776, 29859, 59984, 27480, 21952, 43872, 38613, 37600, 51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893, 43344, 46240, 47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312, 31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576, 23200, 30371, 38608, 19195, 19152, 42192, 118966, 53840, 54560, 56645, 46496, 22224, 21938, 18864, 42359, 42160, 43600, 111189, 27936, 44448, 84835, 37744, 18936, 18800, 25776, 92326, 59984, 27424, 108228, 43744, 41696, 53987, 51552, 54615, 54432, 55888, 23893, 22176, 42704, 21972, 21200, 43448, 43344, 46240, 46758, 44368, 21920, 43940, 42416, 21168, 45683, 26928, 29495, 27296, 44368, 84821, 19296, 42352, 21732, 53600, 59752, 54560, 55968, 92838, 22224, 19168, 43476, 41680, 53584, 62034, 54560],
        solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        Gan: ["???", "???", "???", "???", "???", "???", "???", "???", "???", "???"],
        Zhi: ["???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???"],
        Animals: ["???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???"],
        solarTerm: ["??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????"],
        sTermInfo: ["9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c3598082c95f8c965cc920f", "97bd0b06bdb0722c965ce1cfcc920f", "b027097bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd0b06bdb0722c965ce1cfcc920f", "b027097bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd0b06bdb0722c965ce1cfcc920f", "b027097bd097c36b0b6fc9274c91aa", "9778397bd19801ec9210c965cc920e", "97b6b97bd19801ec95f8c965cc920f", "97bd09801d98082c95f8e1cfcc920f", "97bd097bd097c36b0b6fc9210c8dc2", "9778397bd197c36c9210c9274c91aa", "97b6b97bd19801ec95f8c965cc920e", "97bd09801d98082c95f8e1cfcc920f", "97bd097bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec95f8c965cc920e", "97bcf97c3598082c95f8e1cfcc920f", "97bd097bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c3598082c95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c3598082c95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd097bd07f595b0b6fc920fb0722", "9778397bd097c36b0b6fc9210c8dc2", "9778397bd19801ec9210c9274c920e", "97b6b97bd19801ec95f8c965cc920f", "97bd07f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c920e", "97b6b97bd19801ec95f8c965cc920f", "97bd07f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bd07f1487f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c9274c920e", "97bcf7f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c91aa", "97b6b97bd197c36c9210c9274c920e", "97bcf7f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c920e", "97b6b7f0e47f531b0723b0b6fb0722", "7f0e37f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36b0b70c9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e37f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc9210c8dc2", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0787b0721", "7f0e27f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c91aa", "97b6b7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c8dc2", "977837f0e37f149b0723b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f5307f595b0b0bc920fb0722", "7f0e397bd097c35b0b6fc9210c8dc2", "977837f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e37f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc9210c8dc2", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14998082b0723b06bd", "7f07e7f0e37f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f1487f595b0b0bb0b6fb0722", "7f0e37f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f1487f531b0b0bb0b6fb0722", "7f0e37f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e37f1487f531b0b0bb0b6fb0722", "7f0e37f0e37f14898082b072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e37f0e37f14898082b072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f149b0723b0787b0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14998082b0723b06bd", "7f07e7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14998082b0723b06bd", "7f07e7f0e37f14998083b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14898082b0723b02d5", "7f07e7f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e36665b66aa89801e9808297c35", "665f67f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e36665b66a449801e9808297c35", "665f67f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e36665b66a449801e9808297c35", "665f67f0e37f14898082b072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e26665b66a449801e9808297c35", "665f67f0e37f1489801eb072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722"],
        nStr1: ["???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???"],
        nStr2: ["???", "???", "???", "???"],
        nStr3: ["???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???"],
        lYearDays: function (e) {
            let t, a = 348;
            for (t = 32768; t > 8; t >>= 1) a += n.lunarInfo[e - 1900] & t ? 1 : 0;
            return a + n.leapDays(e)
        },
        leapMonth: function (e) {
            return 15 & n.lunarInfo[e - 1900]
        },
        leapDays: function (e) {
            return n.leapMonth(e) ? 65536 & n.lunarInfo[e - 1900] ? 30 : 29 : 0
        },
        monthDays: function (e, t) {
            return t > 12 || t < 1 ? -1 : n.lunarInfo[e - 1900] & 65536 >> t ? 30 : 29
        },
        solarDays: function (e, t) {
            if (t > 12 || t < 1) return -1;
            const a = t - 1;
            return 1 == +a ? e % 4 == 0 && e % 100 != 0 || e % 400 == 0 ? 29 : 28 : n.solarMonth[a]
        },
        toGanZhiYear: function (e) {
            let t = (e - 3) % 10, a = (e - 3) % 12;
            return 0 == +t && (t = 10), 0 == +a && (a = 12), n.Gan[t - 1] + n.Zhi[a - 1]
        },
        toAstro: function (e, t) {
            return "??????????????????????????????????????????????????????????????????????????????".substr(2 * e - (t < [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22][e - 1] ? 2 : 0), 2) + "???"
        },
        toGanZhi: function (e) {
            return n.Gan[e % 10] + n.Zhi[e % 12]
        },
        getTerm: function (e, t) {
            if (e < 1900 || e > 2100) return -1;
            if (t < 1 || t > 24) return -1;
            const a = n.sTermInfo[e - 1900],
                o = [parseInt("0x" + a.substr(0, 5)).toString(), parseInt("0x" + a.substr(5, 5)).toString(), parseInt("0x" + a.substr(10, 5)).toString(), parseInt("0x" + a.substr(15, 5)).toString(), parseInt("0x" + a.substr(20, 5)).toString(), parseInt("0x" + a.substr(25, 5)).toString()],
                r = [o[0].substr(0, 1), o[0].substr(1, 2), o[0].substr(3, 1), o[0].substr(4, 2), o[1].substr(0, 1), o[1].substr(1, 2), o[1].substr(3, 1), o[1].substr(4, 2), o[2].substr(0, 1), o[2].substr(1, 2), o[2].substr(3, 1), o[2].substr(4, 2), o[3].substr(0, 1), o[3].substr(1, 2), o[3].substr(3, 1), o[3].substr(4, 2), o[4].substr(0, 1), o[4].substr(1, 2), o[4].substr(3, 1), o[4].substr(4, 2), o[5].substr(0, 1), o[5].substr(1, 2), o[5].substr(3, 1), o[5].substr(4, 2)];
            return parseInt(r[t - 1])
        },
        toChinaMonth: function (e) {
            if (e > 12 || e < 1) return -1;
            let t = n.nStr3[e - 1];
            return t += "???"
        },
        toChinaDay: function (e) {
            let t;
            switch (e) {
                case 10:
                    t = "??????";
                    break;
                case 20:
                    t = "??????";
                    break;
                case 30:
                    t = "??????";
                    break;
                default:
                    t = n.nStr2[Math.floor(e / 10)], t += n.nStr1[e % 10]
            }
            return t
        },
        getAnimal: function (e) {
            return n.Animals[(e - 4) % 12]
        },
        solar2lunar: function (e, t, a) {
            if (e < 1900 || e > 2100) return -1;
            if (1900 == +e && 1 == +t && +a < 31) return -1;
            let o, r, s = 0, c = 0;
            e = (o = e ? new Date(e, parseInt(t) - 1, a) : new Date).getFullYear(), t = o.getMonth() + 1, a = o.getDate();
            let l = (Date.UTC(o.getFullYear(), o.getMonth(), o.getDate()) - Date.UTC(1900, 0, 31)) / 864e5;
            for (r = 1900; r < 2101 && l > 0; r++) l -= c = n.lYearDays(r);
            l < 0 && (l += c, r--);
            const i = new Date;
            let d = !1;
            i.getFullYear() === +e && i.getMonth() + 1 === +t && i.getDate() === +a && (d = !0);
            let f = o.getDay();
            const b = n.nStr1[f];
            0 == +f && (f = 7);
            const h = r;
            s = n.leapMonth(r);
            let u = !1;
            for (r = 1; r < 13 && l > 0; r++) s > 0 && r === s + 1 && !1 === u ? (--r, u = !0, c = n.leapDays(h)) : c = n.monthDays(h, r), !0 === u && r === s + 1 && (u = !1), l -= c;
            0 === l && s > 0 && r === s + 1 && (u ? u = !1 : (u = !0, --r)), l < 0 && (l += c, --r);
            const y = r, m = l + 1, D = t - 1, p = n.toGanZhiYear(h), g = n.getTerm(e, 2 * t - 1),
                T = n.getTerm(e, 2 * t);
            let C = n.toGanZhi(12 * (e - 1900) + t + 11);
            a >= g && (C = n.toGanZhi(12 * (e - 1900) + t + 12));
            let w = !1, M = null;
            +g === a && (w = !0, M = n.solarTerm[2 * t - 2]), +T === a && (w = !0, M = n.solarTerm[2 * t - 1]);
            const _ = Date.UTC(e, D, 1, 0, 0, 0, 0) / 864e5 + 25567 + 10, S = n.toGanZhi(_ + a - 1),
                k = n.toAstro(t, a);
            return {
                lYear: h,
                lMonth: y,
                lDay: m,
                Animal: n.getAnimal(h),
                IMonthCn: (u ? "???" : "") + n.toChinaMonth(y),
                IDayCn: n.toChinaDay(m),
                cYear: e,
                cMonth: t,
                cDay: a,
                gzYear: p,
                gzMonth: C,
                gzDay: S,
                isToday: d,
                isLeap: u,
                nWeek: f,
                ncWeek: "??????" + b,
                isTerm: w,
                Term: M,
                astro: k
            }
        },
        lunar2solar: function (e, t, a, o) {
            o = !!o;
            const r = n.leapMonth(e);
            if (o && r !== t) return -1;
            if (2100 == +e && 12 == +t && +a > 1 || 1900 == +e && 1 == +t && +a < 31) return -1;
            const s = n.monthDays(e, t);
            let c = s;
            if (o && (c = n.leapDays(e, t)), e < 1900 || e > 2100 || a > c) return -1;
            let l = 0;
            for (let t = 1900; t < e; t++) l += n.lYearDays(t);
            let i = 0, d = !1;
            for (let a = 1; a < t; a++) i = n.leapMonth(e), d || i <= a && i > 0 && (l += n.leapDays(e), d = !0), l += n.monthDays(e, a);
            o && (l += s);
            const f = Date.UTC(1900, 1, 30, 0, 0, 0), b = new Date(864e5 * (l + a - 31) + f), h = b.getUTCFullYear(),
                u = b.getUTCMonth() + 1, y = b.getUTCDate();
            return n.solar2lunar(h, u, y)
        }
    }, {Gan: o, Zhi: r, nStr1: s, nStr2: c, nStr3: l, Animals: i, solarTerm: d, lunarInfo: f, sTermInfo: b, solarMonth: h, ...u} = n;
    var y = u;
    t.default = y
}, function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var n = c(a(0)), o = c(a(4)), r = c(a(2)), s = a(1);

    function c(e) {
        return e && e.__esModule ? e : {default: e}
    }

    const l = new s.Logger, i = new s.GetDate, d = Object.prototype.toString;

    class f extends n.default {
        constructor(e) {
            super(e), this.Component = e
        }

        getCalendarConfig() {
            return this.Component.config
        }

        buildDate(e, t) {
            const a = i.todayDate(), n = i.thisMonthDays(e, t), o = [], {showLunar: s} = this.getCalendarConfig();
            for (let c = 1; c <= n; c++) {
                const n = +a.year == +e && +a.month == +t && c === +a.date, l = this.getCalendarConfig(), d = {
                    year: e,
                    month: t,
                    day: c,
                    choosed: !1,
                    week: i.dayOfWeek(e, t, c),
                    isToday: n && l.highlightToday
                };
                s && (d.lunar = r.default.solar2lunar(+d.year, +d.month, +d.day)), o.push(d)
            }
            return o
        }

        enableArea(e = []) {
            if (2 === e.length) {
                if (this.__judgeParam(e)) {
                    let {days: t = [], selectedDay: a = []} = this.getData("calendar");
                    const {startTimestamp: n, endTimestamp: o} = (0, s.convertEnableAreaToTimestamp)(e),
                        r = this.__handleEnableArea({dateArea: e, days: t, startTimestamp: n, endTimestamp: o}, a);
                    this.setData({
                        "calendar.enableArea": e,
                        "calendar.days": r.dates,
                        "calendar.selectedDay": r.selectedDay,
                        "calendar.enableAreaTimestamp": [n, o]
                    })
                }
            } else l.warn('enableArea()??????????????????????????????????????????["2018-8-4" , "2018-8-24"]')
        }

        enableDays(e = []) {
            const {enableArea: t = []} = this.getData("calendar");
            let a = [];
            a = t.length ? (0, s.delRepeatedEnableDay)(e, t) : (0, s.converEnableDaysToTimestamp)(e);
            let {days: n = [], selectedDay: o = []} = this.getData("calendar");
            const r = this.__handleEnableDays({days: n, expectEnableDaysTimestamp: a}, o);
            this.setData({
                "calendar.days": r.dates,
                "calendar.selectedDay": r.selectedDay,
                "calendar.enableDays": e,
                "calendar.enableDaysTimestamp": a
            })
        }

        setSelectedDays(e) {
            if (!(0, o.default)(this.Component).getCalendarConfig().multi) return l.warn("?????????????????????????????????????????????????????? multi");
            let {days: t} = this.getData("calendar"), a = [];
            if (e) {
                if (e && e.length) {
                    const {dates: n, selectedDates: o} = this.__handleSelectedDays(t, a, e);
                    t = n, a = o
                }
            } else t.map(e => {
                e.choosed = !0, e.showTodoLabel = !1
            }), a = t;
            (0, o.default)(this.Component).setCalendarConfig("multi", !0), this.setData({
                "calendar.days": t,
                "calendar.selectedDay": a
            })
        }

        disableDays(e) {
            const {disableDays: t = [], days: a} = this.getData("calendar");
            if ("[object Array]" !== Object.prototype.toString.call(e)) return l.warn("disableDays ???????????????");
            let n = [];
            if (e.length) {
                const o = (n = (0, s.uniqueArrayByDate)(e.concat(t))).map(e => i.toTimeStr(e));
                a.forEach(e => {
                    const t = i.toTimeStr(e);
                    o.includes(t) && (e.disable = !0)
                })
            } else a.forEach(e => {
                e.disable = !1
            });
            this.setData({"calendar.days": a, "calendar.disableDays": n})
        }

        chooseArea(e = []) {
            return new Promise((t, a) => {
                if (1 === e.length && (e = e.concat(e)), 2 === e.length) {
                    if (this.__judgeParam(e)) {
                        const n = (0, o.default)(this.Component).getCalendarConfig(), {startTimestamp: r, endTimestamp: c} = (0, s.convertEnableAreaToTimestamp)(e);
                        this.setData({
                            calendarConfig: {...n, chooseAreaMode: !0, mulit: !0},
                            "calendar.chooseAreaTimestamp": [r, c]
                        }, () => {
                            this.__chooseContinuousDates(r, c).then(t).catch(a)
                        })
                    }
                }
            })
        }

        __pusheNextMonthDateArea(e, t, a) {
            const n = this.buildDate(e.year, e.month);
            let o = n.length;
            for (let e = 0; e < o; e++) {
                const r = n[e], c = (0, s.getDateTimeStamp)(r);
                c <= t && a.push({
                    ...r,
                    choosed: !0
                }), e === o - 1 && c < t && this.__pusheNextMonthDateArea(i.nextMonth(r), t, a)
            }
        }

        __pushPrevMonthDateArea(e, t, a) {
            const n = i.sortDates(this.buildDate(e.year, e.month), "desc");
            let o = n.length;
            for (let e = 0; e < o; e++) {
                const r = n[e], c = (0, s.getDateTimeStamp)(r);
                if (!(c >= t)) return;
                a.push({...r, choosed: !0}), e === o - 1 && c > t && this.__pushPrevMonthDateArea(i.prevMonth(r), t, a)
            }
        }

        __calcDateWhenNotInOneMonth(e) {
            const {firstDate: t, lastDate: a, startTimestamp: n, endTimestamp: o, filterSelectedDate: r} = e;
            return (0, s.getDateTimeStamp)(t) > n && this.__pushPrevMonthDateArea(i.prevMonth(t), o, r), (0, s.getDateTimeStamp)(a) < o && this.__pusheNextMonthDateArea(i.nextMonth(a), o, r), [...i.sortDates(r)]
        }

        __chooseContinuousDates(e, t) {
            return new Promise((a, n) => {
                const {days: o, selectedDay: r = []} = this.getData("calendar"), c = [];
                let l = [];
                r.forEach(a => {
                    const n = (0, s.getDateTimeStamp)(a);
                    n >= e && n <= t && (l.push(a), c.push(i.toTimeStr(a)))
                }), o.forEach(a => {
                    const n = (0, s.getDateTimeStamp)(a), o = c.includes(i.toTimeStr(a));
                    if (n >= e && n <= t) {
                        if (o) return;
                        a.choosed = !0, l.push(a)
                    } else if (a.choosed = !1, o) {
                        const e = l.findIndex(e => i.toTimeStr(e) === i.toTimeStr(a));
                        e > -1 && l.splice(e, 1)
                    }
                });
                const d = o[0], f = o[o.length - 1], b = this.__calcDateWhenNotInOneMonth({
                    firstDate: d,
                    lastDate: f,
                    startTimestamp: e,
                    endTimestamp: t,
                    filterSelectedDate: l
                });
                try {
                    this.setData({"calendar.days": [...o], "calendar.selectedDay": b}, () => {
                        a(b)
                    })
                } catch (e) {
                    n(e)
                }
            })
        }

        setDateStyle(e) {
            if ("[object Array]" !== d.call(e)) return;
            const {days: t, specialStyleDates: a} = this.getData("calendar");
            "[object Array]" === d.call(a) && (e = (0, s.uniqueArrayByDate)([...a, ...e]));
            const n = e.map(e => `${e.year}_${e.month}_${e.day}`), o = t.map(t => {
                const a = n.indexOf(`${t.year}_${t.month}_${t.day}`);
                return a > -1 ? {...t, class: e[a].class} : {...t}
            });
            this.setData({"calendar.days": o, "calendar.specialStyleDates": e})
        }

        __judgeParam(e) {
            const {start: t, end: a, startTimestamp: n, endTimestamp: o} = (0, s.convertEnableAreaToTimestamp)(e);
            if (!t || !a) return;
            const r = i.thisMonthDays(t[0], t[1]), c = i.thisMonthDays(a[0], a[1]);
            return t[2] > r || t[2] < 1 ? (l.warn("enableArea() ??????????????????????????????????????????????????????????????????"), !1) : t[1] > 12 || t[1] < 1 ? (l.warn("enableArea() ?????????????????????????????????1-12??????"), !1) : a[2] > c || a[2] < 1 ? (l.warn("enableArea() ??????????????????????????????????????????????????????????????????"), !1) : a[1] > 12 || a[1] < 1 ? (l.warn("enableArea() ?????????????????????????????????1-12??????"), !1) : !(n > o) || (l.warn("enableArea()???????????????????????????????????????"), !1)
        }

        __handleEnableArea(e = {}, t = []) {
            const {area: a, days: n, startTimestamp: o, endTimestamp: r} = e,
                c = this.getData("calendar.enableDays") || [];
            let l = [];
            c.length && (l = (0, s.delRepeatedEnableDay)(c, a));
            const {disablePastDay: d, disableLaterDay: f} = this.getCalendarConfig();
            let b = i.todayTimestamp();
            const h = [...n];
            return h.forEach(e => {
                const a = +i.newDate(e.year, e.month, e.day).getTime();
                (+o > a || a > +r) && !l.includes(a) || d && a < b || f && a > b ? (e.disable = !0, e.choosed && (e.choosed = !1, t = t.filter(t => i.toTimeStr(e) !== i.toTimeStr(t)))) : e.disable && (e.disable = !1)
            }), {dates: h, selectedDay: t}
        }

        __handleEnableDays(e = {}, t = []) {
            const {days: a, expectEnableDaysTimestamp: n} = e, {enableAreaTimestamp: o = []} = this.getData("calendar"),
                r = [...a];
            return r.forEach(e => {
                const a = i.newDate(e.year, e.month, e.day).getTime();
                let r = !1;
                o.length ? (+o[0] > +a || +a > +o[1]) && !n.includes(+a) && (r = !0) : n.includes(+a) || (r = !0), r ? (e.disable = !0, e.choosed && (e.choosed = !1, t = t.filter(t => i.toTimeStr(e) !== i.toTimeStr(t)))) : e.disable = !1
            }), {dates: r, selectedDay: t}
        }

        __handleSelectedDays(e = [], t = [], a) {
            const {selectedDay: n, showLabelAlways: o} = this.getData("calendar");
            t = n && n.length ? (0, s.uniqueArrayByDate)(n.concat(a)) : a;
            const {year: r, month: c} = e[0], l = [];
            return t.forEach(e => {
                +e.year == +r && +e.month == +c && l.push(i.toTimeStr(e))
            }), [...e].map(e => {
                l.includes(i.toTimeStr(e)) && (e.choosed = !0, o && e.showTodoLabel ? e.showTodoLabel = !0 : e.showTodoLabel = !1)
            }), {dates: e, selectedDates: t}
        }
    }

    t.default = e => new f(e)
}, function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var n, o = (n = a(0)) && n.__esModule ? n : {default: n};

    class r extends o.default {
        constructor(e) {
            super(e), this.Component = e
        }

        getCalendarConfig() {
            return this.Component && this.Component.config ? this.Component.config : {}
        }

        setCalendarConfig(e) {
            return new Promise((t, a) => {
                if (!this.Component || !this.Component.config) return void a("????????????????????????????????????");
                let n = {...this.Component.config, ...e};
                this.Component.config = n, this.setData({calendarConfig: n}, () => {
                    t(n)
                })
            })
        }
    }

    t.default = e => new r(e)
}, function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var n = i(a(3)), o = i(a(0)), r = i(a(6)), s = i(a(4)), c = i(a(2)), l = a(1);

    function i(e) {
        return e && e.__esModule ? e : {default: e}
    }

    const d = new l.GetDate, f = new l.Logger;

    class b extends o.default {
        constructor(e) {
            super(e), this.Component = e, this.getCalendarConfig = (0, s.default)(this.Component).getCalendarConfig
        }

        switchWeek(e, t) {
            return new Promise((a, n) => {
                if ((0, s.default)(this.Component).getCalendarConfig().multi) return f.warn("????????????????????????????????????");
                const {selectedDay: o = [], curYear: c, curMonth: l} = this.getData("calendar");
                if (!o.length) return this.__tipsWhenCanNotSwtich();
                const i = o[0];
                if ("week" === e) {
                    if (this.Component.weekMode) return;
                    const e = t || i, {year: o, month: r} = e;
                    if (c !== o || l !== r) return this.__tipsWhenCanNotSwtich();
                    this.Component.weekMode = !0, this.setData({"calendar.weekMode": !0}), this.jump(e).then(a).catch(n)
                } else this.Component.weekMode = !1, this.setData({"calendar.weekMode": !1}), (0, r.default)(this.Component).renderCalendar(c, l, t).then(a).catch(n)
            })
        }

        updateCurrYearAndMonth(e) {
            let {days: t, curYear: a, curMonth: n} = this.getData("calendar");
            const {month: o} = t[0], {month: r} = t[t.length - 1], s = d.thisMonthDays(a, n), c = t[t.length - 1],
                l = t[0];
            return (c.day + 7 > s || n === o && o !== r) && "next" === e ? (n += 1) > 12 && (a += 1, n = 1) : (+l.day <= 7 || n === r && o !== r) && "prev" === e && (n -= 1) <= 0 && (a -= 1, n = 12), {
                Uyear: a,
                Umonth: n
            }
        }

        calculateLastDay() {
            const {days: e = [], curYear: t, curMonth: a} = this.getData("calendar");
            return {lastDayInThisWeek: e[e.length - 1].day, lastDayInThisMonth: d.thisMonthDays(t, a)}
        }

        calculateFirstDay() {
            const {days: e} = this.getData("calendar");
            return {firstDayInThisWeek: e[0].day}
        }

        firstWeekInMonth(e, t, a) {
            let o = d.dayOfWeek(e, t, 1);
            a && 0 === o && (o = 7);
            const [, r] = [0, 7 - o];
            let s = this.getData("calendar.days") || [];
            return this.Component.weekMode && (s = (0, n.default)(this.Component).buildDate(e, t)), s.slice(0, a ? r + 1 : r)
        }

        lastWeekInMonth(e, t, a) {
            const o = d.thisMonthDays(e, t), r = d.dayOfWeek(e, t, o), [s, c] = [o - r, o];
            let l = this.getData("calendar.days") || [];
            return this.Component.weekMode && (l = (0, n.default)(this.Component).buildDate(e, t)), l.slice(a ? s : s - 1, c)
        }

        initSelectedDay(e) {
            let t = [...e];
            const {selectedDay: a = []} = this.getData("calendar"), n = a.map(e => `${+e.year}-${+e.month}-${+e.day}`),
                o = this.getCalendarConfig();
            return t = t.map(e => {
                let t = {...e};
                return n.includes(`${+t.year}-${+t.month}-${+t.day}`) ? t.choosed = !0 : t.choosed = !1, t = this.__setTodoWhenJump(t, o), o.showLunar && (t = this.__setSolarLunar(t)), o.highlightToday && (t = this.__highlightToday(t)), t
            })
        }

        setEnableAreaOnWeekMode(e = []) {
            let {todayTimestamp: t, enableAreaTimestamp: a = [], enableDaysTimestamp: n = []} = this.getData("calendar");
            e.forEach(e => {
                const o = d.newDate(e.year, e.month, e.day).getTime();
                let r = !1;
                a.length ? (+a[0] > +o || +o > +a[1]) && !n.includes(+o) && (r = !0) : n.length && !n.includes(+o) && (r = !0), r && (e.disable = !0, e.choosed = !1);
                const {disablePastDay: c} = (0, s.default)(this.Component).getCalendarConfig() || {};
                c && o - t < 0 && !e.disable && (e.disable = !0)
            })
        }

        calculateNextWeekDays() {
            let {lastDayInThisWeek: e, lastDayInThisMonth: t} = this.calculateLastDay(), {curYear: a, curMonth: o} = this.getData("calendar"),
                r = [];
            if (t - e >= 7) {
                const {Uyear: t, Umonth: n} = this.updateCurrYearAndMonth("next");
                a = t, o = n;
                for (let t = e + 1; t <= e + 7; t++) r.push({year: a, month: o, day: t, week: d.dayOfWeek(a, o, t)})
            } else {
                for (let n = e + 1; n <= t; n++) r.push({year: a, month: o, day: n, week: d.dayOfWeek(a, o, n)});
                const {Uyear: n, Umonth: s} = this.updateCurrYearAndMonth("next");
                a = n, o = s;
                for (let n = 1; n <= 7 - (t - e); n++) r.push({year: a, month: o, day: n, week: d.dayOfWeek(a, o, n)})
            }
            r = this.initSelectedDay(r), this.setEnableAreaOnWeekMode(r), this.setData({
                "calendar.curYear": a,
                "calendar.curMonth": o,
                "calendar.days": r
            }, () => {
                (0, n.default)(this.Component).setDateStyle()
            })
        }

        calculatePrevWeekDays() {
            let {firstDayInThisWeek: e} = this.calculateFirstDay(), {curYear: t, curMonth: a} = this.getData("calendar"),
                o = [];
            if (e - 7 > 0) {
                const {Uyear: n, Umonth: r} = this.updateCurrYearAndMonth("prev");
                t = n, a = r;
                for (let n = e - 7; n < e; n++) o.push({year: t, month: a, day: n, week: d.dayOfWeek(t, a, n)})
            } else {
                let n = [];
                for (let o = 1; o < e; o++) n.push({year: t, month: a, day: o, week: d.dayOfWeek(t, a, o)});
                const {Uyear: r, Umonth: s} = this.updateCurrYearAndMonth("prev");
                t = r, a = s;
                const c = d.thisMonthDays(t, a);
                for (let n = c - Math.abs(e - 7); n <= c; n++) o.push({
                    year: t,
                    month: a,
                    day: n,
                    week: d.dayOfWeek(t, a, n)
                });
                o = o.concat(n)
            }
            o = this.initSelectedDay(o), this.setEnableAreaOnWeekMode(o), this.setData({
                "calendar.curYear": t,
                "calendar.curMonth": a,
                "calendar.days": o
            }, () => {
                (0, n.default)(this.Component).setDateStyle()
            })
        }

        calculateDatesWhenJump({year: e, month: t, day: a}, {firstWeekDays: n, lastWeekDays: o}, r) {
            const s = this.__dateIsInWeek({year: e, month: t, day: a}, n),
                c = this.__dateIsInWeek({year: e, month: t, day: a}, o);
            let l = [];
            return l = s ? this.__calculateDatesWhenInFirstWeek(n, r) : c ? this.__calculateDatesWhenInLastWeek(o, r) : this.__calculateDates({
                year: e,
                month: t,
                day: a
            }, r)
        }

        jump({year: e, month: t, day: a}) {
            return new Promise(o => {
                if (!a) return;
                const r = this.getCalendarConfig(), s = "Mon" === r.firstDayOfWeek, c = this.firstWeekInMonth(e, t, s);
                let l = this.lastWeekInMonth(e, t, s), i = this.calculateDatesWhenJump({year: e, month: t, day: a}, {
                    firstWeekDays: c,
                    lastWeekDays: l
                }, s);
                i = i.map(n => {
                    let o = {...n};
                    return +o.year == +e && +o.month == +t && +o.day == +a && (o.choosed = !0), o = this.__setTodoWhenJump(o, r), r.showLunar && (o = this.__setSolarLunar(o)), r.highlightToday && (o = this.__highlightToday(o)), o
                }), this.setEnableAreaOnWeekMode(i), this.setData({
                    "calendar.days": i,
                    "calendar.curYear": e,
                    "calendar.curMonth": t,
                    "calendar.empytGrids": [],
                    "calendar.lastEmptyGrids": [],
                    "calendar.selectedDay": i.filter(e => e.choosed)
                }, () => {
                    (0, n.default)(this.Component).setDateStyle(), o({year: e, month: t, date: a})
                })
            })
        }

        __setTodoWhenJump(e) {
            const t = {...e}, {todoLabels: a = [], showLabelAlways: n} = this.getData("calendar"),
                o = a.map(e => `${+e.year}-${+e.month}-${+e.day}`).indexOf(`${+t.year}-${+t.month}-${+t.day}`);
            if (-1 !== o) {
                t.showTodoLabel = !!n || !t.choosed;
                const e = a[o] || {};
                t.showTodoLabel && e.todoText && (t.todoText = e.todoText)
            }
            return t
        }

        __setSolarLunar(e) {
            const t = {...e};
            return t.lunar = c.default.solar2lunar(+t.year, +t.month, +t.day), t
        }

        __highlightToday(e) {
            const t = {...e}, a = d.todayDate(), n = +a.year == +t.year && +a.month == +t.month && +t.day == +a.date;
            return t.isToday = n, t
        }

        __calculateDatesWhenInFirstWeek(e, t) {
            const a = [...e];
            if (a.length < 7) {
                let e, {year: t, month: n} = a[0], o = 7 - a.length;
                for (n > 1 ? (n -= 1, e = d.thisMonthDays(t, n)) : (n = 12, t -= 1, e = d.thisMonthDays(t, n)); o;) a.unshift({
                    year: t,
                    month: n,
                    day: e,
                    week: d.dayOfWeek(t, n, e)
                }), e -= 1, o -= 1
            }
            return a
        }

        __calculateDatesWhenInLastWeek(e, t) {
            const a = [...e];
            if (t && a.length < 7) {
                let {year: e, month: t} = a[0], n = 7 - a.length, o = 1;
                for (t > 11 ? (t = 1, e += 1) : t += 1; n;) a.push({
                    year: e,
                    month: t,
                    day: o,
                    week: d.dayOfWeek(e, t, o)
                }), o += 1, n -= 1
            }
            return a
        }

        __calculateDates({year: e, month: t, day: a}, o) {
            const r = d.dayOfWeek(e, t, a);
            let s = [a - r, a + (6 - r)];
            return o && (s = [a + 1 - r, a + (7 - r)]), (0, n.default)(this.Component).buildDate(e, t).slice(s[0] - 1, s[1])
        }

        __dateIsInWeek(e, t) {
            return t.find(t => +t.year == +e.year && +t.month == +e.month && +t.day == +e.day)
        }

        __tipsWhenCanNotSwtich() {
            f.info("????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????")
        }
    }

    t.default = e => new b(e)
}, function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var n = l(a(3)), o = l(a(7)), r = l(a(0)), s = l(a(2)), c = a(1);

    function l(e) {
        return e && e.__esModule ? e : {default: e}
    }

    const i = new c.GetDate;

    class d extends r.default {
        constructor(e) {
            super(e), this.Component = e
        }

        getCalendarConfig() {
            return this.Component.config
        }

        renderCalendar(e, t, a) {
            return new Promise(r => {
                this.calculateEmptyGrids(e, t), this.calculateDays(e, t, a).then(() => {
                    const {todoLabels: a, specialStyleDates: s} = this.getData("calendar") || {};
                    a && a.find(a => +a.month == +t && +a.year == +e) && (0, o.default)(this.Component).setTodoLabels(), s && s.length && s.find(a => +a.month == +t && +a.year == +e) && (0, n.default)(this.Component).setDateStyle(s), this.Component.firstRender ? r({firstRender: !1}) : r({firstRender: !0})
                })
            })
        }

        calculateEmptyGrids(e, t) {
            this.calculatePrevMonthGrids(e, t), this.calculateNextMonthGrids(e, t)
        }

        calculatePrevMonthGrids(e, t) {
            let a = [];
            const n = i.thisMonthDays(e, t - 1);
            let o = i.firstDayOfWeek(e, t);
            const r = this.getCalendarConfig() || {};
            if ("Mon" === r.firstDayOfWeek && (0 === o ? o = 6 : o -= 1), o > 0) {
                const c = n - o, {onlyShowCurrentMonth: l} = r, {showLunar: i} = this.getCalendarConfig();
                for (let o = n; o > c; o--) l ? a.push("") : a.push({
                    day: o,
                    lunar: i ? s.default.solar2lunar(e, t - 1, o) : null
                });
                this.setData({"calendar.empytGrids": a.reverse()})
            } else this.setData({"calendar.empytGrids": null})
        }

        calculateExtraEmptyDate(e, t, a) {
            let n = 0;
            if (2 == +t) {
                n += 7;
                let o = i.dayOfWeek(e, t, 1);
                "Mon" === a.firstDayOfWeek ? 1 == +o && (n += 7) : 0 == +o && (n += 7)
            } else {
                let o = i.dayOfWeek(e, t, 1);
                "Mon" === a.firstDayOfWeek ? 0 !== o && o < 6 && (n += 7) : o < 5 && (n += 7)
            }
            return n
        }

        calculateNextMonthGrids(e, t) {
            let a = [];
            const n = i.thisMonthDays(e, t);
            let o = i.dayOfWeek(e, t, n);
            const r = this.getCalendarConfig() || {};
            "Mon" === r.firstDayOfWeek && (0 === o ? o = 6 : o -= 1);
            let c = 7 - (o + 1);
            const {onlyShowCurrentMonth: l, showLunar: d} = r;
            l || (c += this.calculateExtraEmptyDate(e, t, r));
            for (let n = 1; n <= c; n++) l ? a.push("") : a.push({
                day: n,
                lunar: d ? s.default.solar2lunar(e, t + 1, n) : null
            });
            this.setData({"calendar.lastEmptyGrids": a})
        }

        setSelectedDay(e, t, a) {
            let n = [];
            const o = this.getCalendarConfig();
            if (o.noDefault) n = [], o.noDefault = !1; else {
                const o = this.getData("calendar") || {}, {showLunar: r} = this.getCalendarConfig();
                n = a ? [{
                    year: e,
                    month: t,
                    day: a,
                    choosed: !0,
                    week: i.dayOfWeek(e, t, a),
                    lunar: r ? s.default.solar2lunar(e, t, a) : null
                }] : o.selectedDay
            }
            return n
        }

        calculateDays(e, t, a) {
            return new Promise(o => {
                let r = [];
                const {todayTimestamp: s, disableDays: l = [], chooseAreaTimestamp: d = []} = this.getData("calendar");
                r = (0, n.default)(this.Component).buildDate(e, t);
                const f = this.setSelectedDay(e, t, a), b = f.map(e => i.toTimeStr(e)),
                    h = l.map(e => i.toTimeStr(e)), [u, y] = d;
                r.forEach(e => {
                    const t = i.toTimeStr(e), a = (0, c.getDateTimeStamp)(e);
                    if (b.includes(t)) {
                        if (e.choosed = !0, a > y || a < u) {
                            const t = f.findIndex(t => i.toTimeStr(t) === i.toTimeStr(e));
                            f.splice(t, 1)
                        }
                    } else u && y && a >= u && a <= y && (e.choosed = !0, f.push(e));
                    h.includes(t) && (e.disable = !0);
                    const {disablePastDay: n, disableLaterDay: o} = this.getCalendarConfig();
                    let r = !1;
                    n ? r = n && a - s < 0 && !e.disable : o && (r = o && a - s > 0 && !e.disable), (r || this.__isDisable(a)) && (e.disable = !0, e.choosed = !1)
                }), this.setData({"calendar.days": r, "calendar.selectedDay": [...f] || !1}, () => {
                    o()
                })
            })
        }

        __isDisable(e) {
            const {enableArea: t = [], enableDays: a = [], enableAreaTimestamp: n = []} = this.getData("calendar");
            let o = !1, r = (0, c.converEnableDaysToTimestamp)(a);
            return t.length && (r = (0, c.delRepeatedEnableDay)(a, t)), n.length ? (+n[0] > +e || +e > +n[1]) && !r.includes(+e) && (o = !0) : r.length && !r.includes(+e) && (o = !0), o
        }
    }

    t.default = e => new d(e)
}, function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var n, o = (n = a(0)) && n.__esModule ? n : {default: n}, r = a(1);
    const s = new r.Logger, c = new r.GetDate;

    class l extends o.default {
        constructor(e) {
            super(e), this.Component = e
        }

        setTodoLabels(e) {
            e && (this.Component.todoConfig = e);
            const t = this.getData("calendar");
            if (!t || !t.days) return s.warn("???????????????????????????????????????????????????");
            const a = [...t.days], {curYear: n, curMonth: o} = t, {circle: c, dotColor: l = "", pos: i = "bottom", showLabelAlways: d, days: f = []} = e || this.Component.todoConfig || {}, {todoLabels: b = [], todoLabelPos: h, todoLabelColor: u} = t,
                y = this.getTodoLabels({year: n, month: o});
            let m = f.filter(e => +e.year == +n && +e.month == +o);
            this.Component.weekMode && (m = f);
            const D = y.concat(m);
            for (let e of D) {
                let t;
                (t = this.Component.weekMode ? a.find(t => +e.year == +t.year && +e.month == +t.month && +e.day == +t.day) : a[e.day - 1]) && (t.showTodoLabel = !!d || !t.choosed, t.showTodoLabel && e.todoText && (t.todoText = e.todoText), e.todoLabelColor && (t.todoLabelColor = e.todoLabelColor))
            }
            const p = {"calendar.days": a, "calendar.todoLabels": (0, r.uniqueArrayByDate)(f.concat(b))};
            c || (i && i !== h && (p["calendar.todoLabelPos"] = i), l && l !== u && (p["calendar.todoLabelColor"] = l)), p["calendar.todoLabelCircle"] = c || !1, p["calendar.showLabelAlways"] = d || !1, this.setData(p)
        }

        deleteTodoLabels(e) {
            if (!(e instanceof Array && e.length)) return;
            const t = this.filterTodos(e), {days: a, curYear: n, curMonth: o} = this.getData("calendar"),
                r = t.filter(e => n === +e.year && o === +e.month);
            a.forEach(e => {
                e.showTodoLabel = !1
            }), r.forEach(e => {
                a[e.day - 1].showTodoLabel = !a[e.day - 1].choosed
            }), this.setData({"calendar.days": a, "calendar.todoLabels": t})
        }

        clearTodoLabels() {
            const {days: e = []} = this.getData("calendar"), t = [].concat(e);
            t.forEach(e => {
                e.showTodoLabel = !1
            }), this.setData({"calendar.days": t, "calendar.todoLabels": []})
        }

        getTodoLabels(e) {
            const {todoLabels: t = []} = this.getData("calendar");
            if (e) {
                const {year: a, month: n} = e;
                return t.filter(e => +e.year == +a && +e.month == +n)
            }
            return t
        }

        filterTodos(e) {
            const t = this.getData("calendar.todoLabels") || [], a = e.map(e => c.toTimeStr(e));
            return t.filter(e => !a.includes(c.toTimeStr(e)))
        }

        showTodoLabels(e, t, a) {
            e.forEach(e => {
                if (this.Component.weekMode) t.forEach((n, o) => {
                    if (+n.day == +e.day) {
                        const n = t[o];
                        n.hasTodo = !0, n.todoText = e.todoText, a && a.length && +a[0].day == +e.day && (n.showTodoLabel = !0)
                    }
                }); else {
                    const n = t[e.day - 1];
                    if (!n) return;
                    n.hasTodo = !0, n.todoText = e.todoText, a && a.length && +a[0].day == +e.day && (t[a[0].day - 1].showTodoLabel = !0)
                }
            })
        }
    }

    t.default = e => new l(e)
}, function (e, t, a) {
    "use strict";
    var n, o = (n = a(5)) && n.__esModule ? n : {default: n}, r = a(1), s = function (e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e) for (var a in e) if (Object.prototype.hasOwnProperty.call(e, a)) {
            var n = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(e, a) : {};
            n.get || n.set ? Object.defineProperty(t, a, n) : t[a] = e[a]
        }
        return t.default = e, t
    }(a(9));
    const c = new r.Slide, l = new r.Logger;
    Component({
        options: {styleIsolation: "apply-shared", multipleSlots: !0},
        properties: {calendarConfig: {type: Object, value: {}}},
        data: {
            handleMap: {
                prev_year: "chooseYear",
                prev_month: "chooseMonth",
                next_month: "chooseMonth",
                next_year: "chooseYear"
            }
        },
        lifetimes: {
            attached: function () {
                this.initComp()
            }
        },
        attached: function () {
            this.initComp()
        },
        methods: {
            initComp() {
                const e = this.properties.calendarConfig || {};
                this.setConfig(e), (0, s.default)(this, e)
            }, setConfig(e) {
                e.markToday && "string" == typeof e.markToday && (e.highlightToday = !0), e.theme = e.theme || "default", this.setData({calendarConfig: e})
            }, chooseDate(e) {
                const {type: t} = e.currentTarget.dataset;
                t && this[this.data.handleMap[t]](t)
            }, chooseYear(e) {
                const {curYear: t, curMonth: a} = this.data.calendar;
                if (!t || !a) return l.warn("?????????????????????????????????");
                if (this.weekMode) return console.warn("???????????????????????????????????????");
                let n = +t, o = +a;
                "prev_year" === e ? n -= 1 : "next_year" === e && (n += 1), this.render(t, a, n, o)
            }, chooseMonth(e) {
                const {curYear: t, curMonth: a} = this.data.calendar;
                if (!t || !a) return l.warn("?????????????????????????????????");
                if (this.weekMode) return console.warn("???????????????????????????????????????");
                let n = +t, o = +a;
                "prev_month" === e ? (o -= 1) < 1 && (n -= 1, o = 12) : "next_month" === e && (o += 1) > 12 && (n += 1, o = 1), this.render(t, a, n, o)
            }, render(e, t, a, n) {
                s.whenChangeDate.call(this, {
                    curYear: e,
                    curMonth: t,
                    newYear: a,
                    newMonth: n
                }), this.setData({"calendar.curYear": a, "calendar.curMonth": n}), s.renderCalendar.call(this, a, n)
            }, tapDayItem(e) {
                const {idx: t, disable: a} = e.currentTarget.dataset;
                if (a) return;
                const n = this.data.calendarConfig || this.config || {}, {multi: o, chooseAreaMode: r} = n;
                o ? s.whenMulitSelect.call(this, t) : r ? s.whenChooseArea.call(this, t) : s.whenSingleSelect.call(this, t)
            }, doubleClickToToday() {
                if (!this.config.multi && !this.weekMode) if (void 0 === this.count ? this.count = 1 : this.count += 1, this.lastClick) {
                    (new Date).getTime() - this.lastClick < 500 && this.count >= 2 && s.jump.call(this), this.count = void 0, this.lastClick = void 0
                } else this.lastClick = (new Date).getTime()
            }, calendarTouchstart(e) {
                const t = e.touches[0], a = t.clientX, n = t.clientY;
                this.slideLock = !0, this.setData({"gesture.startX": a, "gesture.startY": n})
            }, handleSwipe(e) {
                let t = "calendar.leftSwipe", a = "next_month", n = "next_week";
                if ("right" === e && (t = "calendar.rightSwipe", a = "prev_month", n = "prev_week"), this.setData({[t]: 1}), this.currentYM = (0, s.getCurrentYM)(), this.weekMode) return this.slideLock = !1, this.currentDates = (0, s.getCalendarDates)(), "prev_week" === n ? (0, o.default)(this).calculatePrevWeekDays() : "next_week" === n && (0, o.default)(this).calculateNextWeekDays(), this.onSwipeCalendar(n), void this.onWeekChange(n);
                this.chooseMonth(a), this.onSwipeCalendar(a)
            }, calendarTouchmove(e) {
                const {gesture: t} = this.data, {preventSwipe: a} = this.properties.calendarConfig;
                this.slideLock && !a && (c.isLeft(t, e.touches[0]) && (this.handleSwipe("left"), this.slideLock = !1), c.isRight(t, e.touches[0]) && (this.handleSwipe("right"), this.slideLock = !1))
            }, calendarTouchend(e) {
                this.setData({"calendar.leftSwipe": 0, "calendar.rightSwipe": 0})
            }, onSwipeCalendar(e) {
                this.triggerEvent("onSwipe", {directionType: e, currentYM: this.currentYM})
            }, onWeekChange(e) {
                this.triggerEvent("whenChangeWeek", {
                    current: {
                        currentYM: this.currentYM,
                        dates: [...this.currentDates]
                    }, next: {currentYM: (0, s.getCurrentYM)(), dates: (0, s.getCalendarDates)()}, directionType: e
                }), this.currentDates = null, this.currentYM = null
            }
        }
    })
}, function (e, t, a) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0}), t.getCurrentYM = L, t.getSelectedDay = v, t.cancelAllSelectedDay = W, t.jump = A, t.setTodoLabels = x, t.deleteTodoLabels = O, t.clearTodoLabels = Y, t.getTodoLabels = E, t.disableDay = P, t.enableArea = I, t.enableDays = j, t.setSelectedDays = $, t.getCalendarConfig = G, t.setCalendarConfig = U, t.getCalendarDates = F, t.chooseDateArea = N, t.setDateStyle = R, t.switchView = X, t.default = t.calculateNextWeekDays = t.calculatePrevWeekDays = t.whenMulitSelect = t.whenChooseArea = t.whenSingleSelect = t.renderCalendar = t.whenChangeDate = void 0;
    var n = f(a(3)), o = f(a(5)), r = f(a(7)), s = f(a(0)), c = f(a(6)), l = f(a(4)), i = f(a(2)), d = a(1);

    function f(e) {
        return e && e.__esModule ? e : {default: e}
    }

    let b = {}, h = new d.Logger, u = new d.GetDate, y = null;

    function m(e) {
        return e && (b = (0, d.getComponent)(e)), b
    }

    function D(e, t) {
        return m(t), (y = new s.default(b)).getData(e)
    }

    function p(e, t = (() => {
    })) {
        return new s.default(b).setData(e, t)
    }

    const g = {
        renderCalendar(e, t, a) {
            return (0, d.isComponent)(this) && (b = this), new Promise((n, o) => {
                (0, c.default)(b).renderCalendar(e, t, a).then((o = {}) => {
                    if (!o.firstRender) return n({year: e, month: t, date: a});
                    !function (e) {
                        e.calendar = {
                            jump: A,
                            switchView: X,
                            disableDay: P,
                            enableArea: I,
                            enableDays: j,
                            chooseDateArea: N,
                            getCurrentYM: L,
                            getSelectedDay: v,
                            cancelAllSelectedDay: W,
                            setDateStyle: R,
                            setTodoLabels: x,
                            getTodoLabels: E,
                            deleteTodoLabels: O,
                            clearTodoLabels: Y,
                            setSelectedDays: $,
                            getCalendarConfig: G,
                            setCalendarConfig: U,
                            getCalendarDates: F
                        }
                    }((0, d.getCurrentPage)()), b.triggerEvent("afterCalendarRender", b), b.firstRender = !0, d.initialTasks.flag = "finished", d.initialTasks.tasks.length && d.initialTasks.tasks.shift()(), n({
                        year: e,
                        month: t,
                        date: a
                    })
                }).catch(e => {
                    o(e)
                })
            })
        }, whenChangeDate({curYear: e, curMonth: t, newYear: a, newMonth: n}) {
            b.triggerEvent("whenChangeMonth", {current: {year: e, month: t}, next: {year: a, month: n}})
        }, whenMulitSelect(e) {
            (0, d.isComponent)(this) && (b = this);
            const {calendar: t = {}} = D(), {days: a, todoLabels: n} = t, o = (0, l.default)(b).getCalendarConfig();
            let {selectedDay: r = []} = t;
            const s = a[e];
            if (s) {
                if (s.choosed = !s.choosed, s.choosed) {
                    s.cancel = !1;
                    const {showLabelAlways: e} = D("calendar");
                    e && s.showTodoLabel ? s.showTodoLabel = !0 : s.showTodoLabel = !1, o.takeoverTap || r.push(s)
                } else {
                    s.cancel = !0;
                    const e = u.toTimeStr(s);
                    r = r.filter(t => e !== u.toTimeStr(t)), n && n.forEach(t => {
                        e === u.toTimeStr(t) && (s.showTodoLabel = !0)
                    })
                }
                if (o.takeoverTap) return b.triggerEvent("onTapDay", s);
                p({"calendar.days": a, "calendar.selectedDay": r}), g.afterTapDay(s, r)
            }
        }, whenSingleSelect(e) {
            (0, d.isComponent)(this) && (b = this);
            const {calendar: t = {}} = D(), {days: a, selectedDay: n = [], todoLabels: o} = t;
            let s = [];
            const c = a[e];
            if (!c) return;
            const i = (n[0] || {}).day, f = i && a[i - 1] || {}, {month: h, year: u} = a[0] || {},
                y = (0, l.default)(b).getCalendarConfig();
            if (y.takeoverTap) return b.triggerEvent("onTapDay", c);
            if (g.afterTapDay(c), !y.inverse && f.day === c.day) return;
            b.weekMode && a.forEach((e, t) => {
                e.day === i && (a[t].choosed = !1)
            }), o && (s = o.filter(e => +e.year === u && +e.month === h)), (0, r.default)(b).showTodoLabels(s, a, n);
            const m = {"calendar.days": a};
            f.day !== c.day ? (f.choosed = !1, c.choosed = !0, t.showLabelAlways && c.showTodoLabel || (c.showTodoLabel = !1), m["calendar.selectedDay"] = [c]) : y.inverse && (c.choosed = !c.choosed, c.choosed && (c.showTodoLabel && t.showLabelAlways ? c.showTodoLabel = !0 : c.showTodoLabel = !1), m["calendar.selectedDay"] = []), p(m)
        }, gotoSetContinuousDates: (e, t) => N([`${u.toTimeStr(e)}`, `${u.toTimeStr(t)}`]), timeRangeHelper(e, t) {
            const a = (0, d.getDateTimeStamp)(e), n = t[0];
            let o, r, s = t.length;
            return s > 1 && (o = t[s - 1], r = (0, d.getDateTimeStamp)(o)), {
                endDate: o,
                startDate: n,
                currentDateTimestamp: a,
                endDateTimestamp: r,
                startTimestamp: (0, d.getDateTimeStamp)(n)
            }
        }, calculateDateRange(e, t) {
            const {endDate: a, startDate: n, currentDateTimestamp: o, endDateTimestamp: r, startTimestamp: s} = this.timeRangeHelper(e, t);
            let c = [], l = t.length;
            const i = t.filter(t => u.toTimeStr(t) === u.toTimeStr(e));
            if (2 === l && i.length) return c = [e, e];
            if (o >= s && r && o <= r) {
                c = l / 2 > t.findIndex(t => u.toTimeStr(t) === u.toTimeStr(e)) ? [e, a] : [n, e]
            } else o < s ? c = [e, a] : o > s && (c = [n, e]);
            return c
        }, whenChooseArea(e) {
            return new Promise((t, a) => {
                if ((0, d.isComponent)(this) && (b = this), b.weekMode) return;
                const {days: n = [], selectedDay: o, lastChoosedDate: r} = D("calendar"), s = n[e];
                if (!s.disable) {
                    if ((0, l.default)(b).getCalendarConfig().takeoverTap) return b.triggerEvent("onTapDay", s);
                    if (o && o.length > 1) {
                        const e = g.calculateDateRange(s, u.sortDates(o));
                        return g.gotoSetContinuousDates(...e).then(e => {
                            t(e), g.afterTapDay(s)
                        }).catch(e => {
                            a(e), g.afterTapDay(s)
                        })
                    }
                    if (r || o && 1 === o.length) {
                        const e = r || o[0];
                        let n = [e, s];
                        const c = (0, d.getDateTimeStamp)(s);
                        return (0, d.getDateTimeStamp)(e) > c && (n = [s, e]), g.gotoSetContinuousDates(...n).then(e => {
                            t(e), g.afterTapDay(s)
                        }).catch(e => {
                            a(e), g.afterTapDay(s)
                        })
                    }
                    n.forEach(e => {
                        +e.day == +s.day ? e.choosed = !0 : e.choosed = !1
                    }), this.setData({"calendar.days": [...n], "calendar.lastChoosedDate": s})
                }
            })
        }, afterTapDay(e, t) {
            const a = (0, l.default)(b).getCalendarConfig(), {multi: n} = a;
            n ? b.triggerEvent("afterTapDay", {currentSelected: e, selectedDates: t}) : b.triggerEvent("afterTapDay", e)
        }, jumpToToday: () => new Promise((e, t) => {
            const {year: a, month: n, date: o} = u.todayDate(), r = u.todayTimestamp(),
                s = (0, l.default)(b).getCalendarConfig();
            p({
                "calendar.curYear": a,
                "calendar.curMonth": n,
                "calendar.selectedDay": [{
                    year: a,
                    day: o,
                    month: n,
                    choosed: !0,
                    lunar: s.showLunar ? i.default.solar2lunar(a, n, o) : null
                }],
                "calendar.todayTimestamp": r
            }), g.renderCalendar(a, n, o).then(() => {
                e({year: a, month: n, date: o})
            }).catch(() => {
                t("jump failed")
            })
        })
    }, T = g.whenChangeDate;
    t.whenChangeDate = T;
    const C = g.renderCalendar;
    t.renderCalendar = C;
    const w = g.whenSingleSelect;
    t.whenSingleSelect = w;
    const M = g.whenChooseArea;
    t.whenChooseArea = M;
    const _ = g.whenMulitSelect;
    t.whenMulitSelect = _;
    const S = g.calculatePrevWeekDays;
    t.calculatePrevWeekDays = S;
    const k = g.calculateNextWeekDays;

    function L(e) {
        return m(e), {year: D("calendar.curYear"), month: D("calendar.curMonth")}
    }

    function v(e) {
        return m(e), D("calendar.selectedDay")
    }

    function W(e) {
        m(e);
        const t = [...D("calendar.days")];
        t.map(e => {
            e.choosed = !1
        }), p({"calendar.days": t, "calendar.selectedDay": []})
    }

    function A(e, t, a, n) {
        return new Promise((r, s) => {
            m(n);
            const {selectedDay: c = [], weekMode: l} = D("calendar") || {}, {year: i, month: d, day: f} = c[0] || {};
            if (+i != +e || +d != +t || +f != +a) {
                if (l) return (0, o.default)(b).jump({year: e, month: t, day: a}).then(e => {
                    r(e)
                }).catch(e => {
                    s(e)
                });
                if (e && t) {
                    if ("number" != typeof +e || "number" != typeof +t) return h.warn("jump ????????????????????????????????????");
                    const n = u.todayTimestamp();
                    p({"calendar.curYear": e, "calendar.curMonth": t, "calendar.todayTimestamp": n}, () => {
                        g.renderCalendar(e, t, a).then(e => {
                            r(e)
                        }).catch(e => {
                            s(e)
                        })
                    })
                } else g.jumpToToday().then(e => {
                    r(e)
                }).catch(e => {
                    s(e)
                })
            }
        })
    }

    function x(e, t) {
        m(t), (0, r.default)(b).setTodoLabels(e)
    }

    function O(e, t) {
        m(t), (0, r.default)(b).deleteTodoLabels(e)
    }

    function Y(e) {
        m(e), (0, r.default)(b).clearTodoLabels()
    }

    function E(e) {
        return m(e), (0, r.default)(b).getTodoLabels()
    }

    function P(e = [], t) {
        m(t), (0, n.default)(b).disableDays(e)
    }

    function I(e = [], t) {
        m(t), (0, n.default)(b).enableArea(e)
    }

    function j(e = [], t) {
        m(t), (0, n.default)(b).enableDays(e)
    }

    function $(e, t) {
        m(t), (0, n.default)(b).setSelectedDays(e)
    }

    function G(e) {
        return m(e), (0, l.default)(b).getCalendarConfig()
    }

    function U(e, t) {
        if (m(t), !e || 0 === Object.keys(e).length) return h.warn("setCalendarConfig ???????????????????????????");
        const a = G();
        return new Promise((t, n) => {
            (0, l.default)(b).setCalendarConfig(e).then(n => {
                t(n);
                const o = "disableLaterDay" in e && a.disableLaterDay !== e.disableLaterDay,
                    r = "disablePastDay" in e && a.disablePastDay !== e.disablePastDay;
                if (o || r) {
                    const {year: e, month: t} = L();
                    A(e, t)
                }
            }).catch(e => {
                n(e)
            })
        })
    }

    function F(e) {
        return m(e), D("calendar.days", e)
    }

    function N(e, t) {
        return m(t), (0, n.default)(b).chooseArea(e)
    }

    function R(e, t) {
        e && (m(t), (0, n.default)(b).setDateStyle(e))
    }

    function X(...e) {
        return new Promise((t, a) => {
            const n = e[0];
            if (!e[1]) return (0, o.default)(b).switchWeek(n).then(t).catch(a);
            "string" == typeof e[1] ? (m(e[1]), (0, o.default)(b).switchWeek(n, e[2]).then(t).catch(a)) : "object" == typeof e[1] && ("string" == typeof e[2] && m(e[1]), (0, o.default)(b).switchWeek(n, e[1]).then(t).catch(a))
        })
    }

    function Z(e, t) {
        d.initialTasks.flag = "process", (b = e).config = t, function (e) {
            let t = ["???", "???", "???", "???", "???", "???", "???"];
            "Mon" === e && (t = ["???", "???", "???", "???", "???", "???", "???"]), p({"calendar.weeksCh": t})
        }(t.firstDayOfWeek), function (e) {
            if (e && "string" == typeof e) {
                const t = e.split("-");
                if (t.length < 3) return h.warn("?????? jumpTo ????????????: 2018-4-2 ??? 2018-04-02");
                A(+t[0], +t[1], +t[2])
            } else e || (b.config.noDefault = !0), A()
        }(t.defaultDay), h.tips("????????????????????????????????? https://github.com/treadpit/wx_calendar/issues ??????")
    }

    t.calculateNextWeekDays = k;
    t.default = (e, t = {}) => {
        if ("process" === d.initialTasks.flag) return d.initialTasks.tasks.push(function () {
            Z(e, t)
        });
        Z(e, t)
    }
}]);
