"use strict";
(self.webpackChunkscratch_extensions = self.webpackChunkscratch_extensions || []).push([[7384], {
    49684: (t, e, s) => {
        s.r(e),
        s.d(e, {
            default: () => n
        });
        var a = s(36967);
        function i(t, e) {
            for (var s = 0; s < e.length; s++) {
                var a = e[s];
                a.enumerable = a.enumerable || !1,
                a.configurable = !0,
                "value"in a && (a.writable = !0),
                Object.defineProperty(t, a.key, a)
            }
        }
        const n = function() {
            function t(e) {
                var s = this;
                !function(t, e) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this, t),
                this.runtime = e,
                this.scfpson = !1,
                this.scfps = 0,
                this.scfpsn = 0,
                this.scfpscnt = 0,
                this.scfpsinterval = -1,
                this.scfpstime = 0,
                this.scDeltaTime = 0,
                this.webfpson = !1,
                this.webfps = 0,
                this.webfpsn = 0,
                this.webfpscnt = 0,
                this.webfpstick_end = !0,
                this.webfpstime = 0,
                this.webfpsinterval = -1,
                e.on("BEFORE_EXECUTE", (function() {
                    if (s.scfpson) {
                        var t = Date.now();
                        s.scDeltaTime = t - s.scfpstime,
                        s.scfpsn = 1e3 / s.scDeltaTime,
                        s.scfpstime = t,
                        s.scfpscnt++
                    }
                }
                )),
                this._formatMessage = e.getFormatMessage({
                    "zh-cn": {
                        "WitCatFPS.name": "[beta]白猫的FPS",
                        "WitCatFPS.webs": "浏览器",
                        "WitCatFPS.scratchs": "舞台",
                        "WitCatFPS.more": "更多",
                        "WitCatFPS.scratch": "舞台FPS",
                        "WitCatFPS.web": "浏览器FPS",
                        "WitCatFPS.nscratch": "瞬时舞台FPS",
                        "WitCatFPS.nweb": "瞬时浏览器FPS",
                        "WitCatFPS.turnon": "[type]舞台FPS检测",
                        "WitCatFPS.webturnon": "[type]浏览器FPS检测",
                        "WitCatFPS.type.1": "开启",
                        "WitCatFPS.type.2": "关闭",
                        "WitCatFPS.docs": "📖拓展教程",
                        "WitCatFPS.compute": "在帧率[fps]下的[num]",
                        "WitCatFPS.deltaTime": "帧时间差(ms)"
                    },
                    en: {
                        "WitCatFPS.name": "[beta]WitCat’s FPS",
                        "WitCatFPS.webs": "web",
                        "WitCatFPS.scratchs": "stage",
                        "WitCatFPS.more": "more",
                        "WitCatFPS.scratch": "stage FPS",
                        "WitCatFPS.web": "web FPS",
                        "WitCatFPS.nscratch": "stage current FPS",
                        "WitCatFPS.nweb": "web current FPS",
                        "WitCatFPS.turnon": "[type]stage FPS detection",
                        "WitCatFPS.webturnon": "[type]web FPS detection",
                        "WitCatFPS.type.1": "enable",
                        "WitCatFPS.type.2": "disable",
                        "WitCatFPS.docs": "📖 Tutorial",
                        "WitCatFPS.compute": "the number[num]from[fps]",
                        "WitCatFPS.deltaTime": "delta time (ms)"
                    }
                })
            }
            var e, s;
            return e = t,
            (s = [{
                key: "formatMessage",
                value: function(t) {
                    return this._formatMessage({
                        id: t,
                        default: t,
                        description: t
                    })
                }
            }, {
                key: "getInfo",
                value: function() {
                    return {
                        id: "WitCatFPS",
                        name: this.formatMessage("WitCatFPS.name"),
                        blockIconURI: a.q,
                        menuIconURI: a.q,
                        color1: "#EC3838",
                        color2: "#B32B2B",
                        blocks: [{
                            blockType: "button",
                            text: this.formatMessage("WitCatFPS.docs"),
                            onClick: this.docs
                        }, "---".concat(this.formatMessage("WitCatFPS.scratchs")), {
                            opcode: "scratch",
                            blockType: "reporter",
                            text: this.formatMessage("WitCatFPS.scratch"),
                            arguments: {}
                        }, {
                            opcode: "nscratch",
                            blockType: "reporter",
                            text: this.formatMessage("WitCatFPS.nscratch"),
                            arguments: {}
                        }, {
                            opcode: "turnon",
                            blockType: "command",
                            text: this.formatMessage("WitCatFPS.turnon"),
                            arguments: {
                                type: {
                                    type: "string",
                                    menu: "type"
                                }
                            }
                        }, "---".concat(this.formatMessage("WitCatFPS.webs")), {
                            opcode: "web",
                            blockType: "reporter",
                            text: this.formatMessage("WitCatFPS.web"),
                            arguments: {}
                        }, {
                            opcode: "nweb",
                            blockType: "reporter",
                            text: this.formatMessage("WitCatFPS.nweb"),
                            arguments: {}
                        }, {
                            opcode: "webturnon",
                            blockType: "command",
                            text: this.formatMessage("WitCatFPS.webturnon"),
                            arguments: {
                                type: {
                                    type: "string",
                                    menu: "type"
                                }
                            }
                        }, "---".concat(this.formatMessage("WitCatFPS.more")), {
                            opcode: "compute",
                            blockType: "reporter",
                            text: this.formatMessage("WitCatFPS.compute"),
                            arguments: {
                                fps: {
                                    type: "number",
                                    defaultValue: "30"
                                },
                                num: {
                                    type: "number",
                                    defaultValue: "5"
                                }
                            }
                        }, {
                            opcode: "deltaTime",
                            blockType: "reporter",
                            disableMonitor: !0,
                            text: this.formatMessage("WitCatFPS.deltaTime")
                        }],
                        menus: {
                            type: [{
                                text: this.formatMessage("WitCatFPS.type.1"),
                                value: "true"
                            }, {
                                text: this.formatMessage("WitCatFPS.type.2"),
                                value: "false"
                            }]
                        }
                    }
                }
            }, {
                key: "docs",
                value: function() {
                    var t = document.createElement("a");
                    t.href = "https://www.ccw.site/post/d6d96e80-3f58-4a19-b7e6-c567d3a6a583",
                    t.rel = "noopener noreferrer",
                    t.target = "_blank",
                    t.click()
                }
            }, {
                key: "_webfpstick",
                value: function(t) {
                    this.webfpson ? (this.webfpstick_end = !1,
                    this.webfpscnt++,
                    this.webfpsn = 1e3 / (t - this.webfpstime),
                    this.webfpstime = t,
                    requestAnimationFrame(this._webfpstick.bind(this))) : this.webfpstick_end = !0
                }
            }, {
                key: "scratch",
                value: function() {
                    return this.scfps
                }
            }, {
                key: "nscratch",
                value: function() {
                    return this.scfpsn
                }
            }, {
                key: "web",
                value: function() {
                    return this.webfps
                }
            }, {
                key: "nweb",
                value: function() {
                    return this.webfpsn
                }
            }, {
                key: "turnon",
                value: function(t) {
                    var e = this;
                    "true" == t.type ? 0 == this.scfpson && (this.scfpson = !0,
                    this.scfpstime = Date.now(),
                    this.scfpsinterval = setInterval((function() {
                        e.scfps = e.scfpscnt,
                        e.scfpscnt = 0
                    }
                    ), 1e3)) : 1 == this.scfpson && (this.scfpson = !1,
                    clearInterval(this.scfpsinterval),
                    this.scfps = 0,
                    this.scfpsn = 0)
                }
            }, {
                key: "webturnon",
                value: function(t) {
                    var e = this;
                    "true" == t.type ? 0 == this.webfpson && (this.webfpson = !0,
                    this.webfpstime = Date.now(),
                    this.webfpstick_end && requestAnimationFrame(this._webfpstick.bind(this)),
                    this.webfpsinterval = setInterval((function() {
                        e.webfps = e.webfpscnt,
                        e.webfpscnt = 0
                    }
                    ), 1e3)) : 1 == this.webfpson && (this.webfpson = !1,
                    clearInterval(this.webfpsinterval),
                    this.webfps = 0,
                    this.webfpsn = 0)
                }
            }, {
                key: "compute",
                value: function(t) {
                    return Number(t.num) / (this.scfpsn / Number(t.fps))
                }
            }, {
                key: "deltaTime",
                value: function() {
                    return this.scDeltaTime
                }
            }]) && i(e.prototype, s),
            Object.defineProperty(e, "prototype", {
                writable: !1
            }),
            t
        }()
    }
}]);
