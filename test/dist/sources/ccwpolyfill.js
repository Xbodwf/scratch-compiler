/**
 * CCW Extension Polyfill
 * Author: Xbodwf(https://github.com/xbodwf) 
 */



(function (window, sc) {
    'use strict';

    if (!sc.extensions.unsandboxed) {
        throw new Error('This extension must run unsandboxed');
    }

    const translations = {
        en: {
            'ccwpolyfill.noticeTitle': 'Notice',
            'ccwpolyfill.cancelBtn': 'Cancel',
            'ccwpolyfill.confirmBtn': 'Accept',
            'ccwpolyfill.warning': 'Warning',
            'ccwpolyfill.experimentalWarning': "You're using Experimental features",
            'ccwpolyfill.extensionKeeper': 'Extension Keeper',
            'ccwpolyfill.screenshotCommentMessage': 'This page requests your screenshot comment (though this is not CCW and has no effect)',
            'ccwpolyfill.promptTitle': 'Prompt',
            'ccwpolyfill.okMeow': 'Okay meow...',
            'ccwpolyfill.meowQuestion': 'Meow?',
            'ccwpolyfill.meowAlert': 'Meow~'
        },
        "zh-cn": {
            'ccwpolyfill.noticeTitle': '通知',
            'ccwpolyfill.cancelBtn': '取消',
            'ccwpolyfill.confirmBtn': '确认',
            'ccwpolyfill.warning': '警告',
            'ccwpolyfill.experimentalWarning': '您正在使用实验性功能',
            'ccwpolyfill.extensionKeeper': '扩展防卸载器',
            'ccwpolyfill.screenshotCommentMessage': '该页面请求您截图评论(虽然这不是CCW并没有什么用)',
            'ccwpolyfill.promptTitle': '提示',
            'ccwpolyfill.okMeow': '好的喵...',
            'ccwpolyfill.meowQuestion': '喵？',
            'ccwpolyfill.meowAlert': '喵~'
        }
    };

    const translate = t => typeof translations[Scratch?.translate?.language] != undefined && typeof translations[Scratch?.translate?.language][t] == 'undefined' ? t : translations[Scratch?.translate?.language][t]

    function showConfirm(message, title = 'Notice', cancelText = 'Cancel', confirmText = 'Accept', onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        const container = document.createElement('div');
        container.className = 'modal-container';

        container.innerHTML = `
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                </div>
                <div class="modal-body">
                    ${message}
                </div>
                <div class="modal-footer">
                    <button class="modal-btn cancel">${cancelText}</button>
                    <button class="modal-btn confirm">${confirmText}</button>
                </div>
            `;

        overlay.appendChild(container);
        document.body.appendChild(overlay);

        setTimeout(() => overlay.classList.add('active'), 10);

        const cancelBtn = container.querySelector('.cancel');
        cancelBtn.addEventListener('click', () => {
            closeModal(overlay);
            onCancel && onCancel();
        });

        const confirmBtn = container.querySelector('.confirm');
        confirmBtn.addEventListener('click', () => {
            closeModal(overlay);
            onConfirm && onConfirm();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
                onCancel && onCancel();
            }
        });

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal(overlay);
                onCancel && onCancel();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);

        function closeModal(overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        }
    }

    class ExtensionLoader extends Array {
        constructor(f) {
            super()
            this.push = function push([e, a]) {
                Array.prototype.push.bind(this)([e, a]);
                let results = [];
                const candidateFns = Object.values(a).filter(fn =>
                    typeof fn === 'function' && fn.length === 3
                );
                candidateFns.forEach(t => {
                    try {
                        results.push(this.__scratch__webpack_require__(undefined, t, a));
                    } catch {

                    }
                });
                let target;
                let info;
                if (results.length > 0) {
                    try {
                        target = new results[0].exports.default(sc.vm);
                        info = target.getInfo();
                        target.getInfo = function () {
                            const blocks = info.blocks;
                            if (typeof blocks === 'object' && blocks !== null) {
                                for (const [key, block] of Object.entries(blocks)) {
                                    if (typeof block === 'string' && block.startsWith('---') && block.length !== 3) {
                                        blocks[key] = {
                                            blockType: Scratch.BlockType.LABEL,
                                            text: block.substring(3)
                                        };
                                    }
                                }
                            }
                            return info;
                        };
                        Scratch.extensions.register(target);
                    } catch (e) {
                        try {
                            const processed = this.convertBlocks(info.blocks)
                            target._______ccw_polyfill__temp = function () {
                                return '__ccw_polyfill'
                            }
                            const proxiedTarget = this.createProxiedFunctions(target);
                            ScratchExtensions.register(info.name || info.id, { blocks: processed }, proxiedTarget);
                            console.log(proxiedTarget)
                        } catch (e) { console.warn("[CCW Polyfill] Failed to register extensions.", e) }
                    }
                }
                console.log(results)
                return results;
            }

            this.__scratch__webpack_require__.r = (exports) => {
                if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                }
                Object.defineProperty(exports, '__esModule', { value: true });
            };

            this.__scratch__webpack_require__.d = (exports, definition) => {
                for (const key in definition) {
                    if (!Object.prototype.hasOwnProperty.call(exports, key)) {
                        Object.defineProperty(exports, key, {
                            enumerable: true,
                            get: definition[key]
                        });
                    }
                }
            };
        }

        __scratch__webpack_require__(moduleId, moduleFunc, modules = {}) {
            var module = {
                exports: {}
            }
            var func = (typeof moduleId == 'undefined') ? moduleFunc : modules[moduleId]
            if (typeof func == 'function') func(module, module.exports, this.__scratch__webpack_require__)
            return module
        }

        uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        convertBlocks(blocks) {
            return blocks.map(block => [
                this.stringifyScratchXBlockType(block),
                block.text == undefined ? '' : block.text,
                block.opcode == undefined ? '_______ccw_polyfill__temp' : block.opcode,
                block.arguments == undefined ? {} : block.arguments,
                block.defaultValue == undefined ? '' : block.defaultValue
            ]);
        }

        stringifyScratchXBlockType(blockInfo) {
            const { blockType, async = false } = blockInfo;

            if (blockType === Scratch.BlockType.COMMAND) {
                return async ? 'w' : '';
            }

            if (blockType === Scratch.BlockType.REPORTER) {
                return async ? 'R' : 'r';
            }

            if (blockType === Scratch.BlockType.BOOLEAN) {
                return 'b';
            }

            if (blockType === Scratch.BlockType.HAT) {
                return 'h';
            }

            return async ? 'R' : 'r';
        };

        getAllFunctions(target) {
            const functions = new Map();
            let currentObj = target;

            while (currentObj && currentObj !== Object.prototype) {
                const props = Object.getOwnPropertyNames(currentObj);
                for (const prop of props) {
                    if (prop !== 'constructor' && typeof currentObj[prop] === 'function') {
                        if (!functions.has(prop)) {
                            functions.set(prop, currentObj[prop]);
                        }
                    }
                }
                currentObj = Object.getPrototypeOf(currentObj);
            }

            return functions;
        }

        createProxiedFunctions(target) {
            const proxiedObj = {};
            const allFunctions = this.getAllFunctions(target);

            allFunctions.forEach((func, prop) => {
                proxiedObj[prop] = function (...args) {
                    return func.call(target, ...args);
                };
            });

            return proxiedObj;
        }

    }

    class CCWPolyfill {
        constructor() {
            this.vm = sc.vm || {};
            this.register = () => { };
            let cssE = document.createElement('style');
            cssE.textContent = `.modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-container {
            background: #fff;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        }

        .modal-overlay.active .modal-container {
            transform: translateY(0);
        }

        .modal-header {
            padding: 16px 20px;
            border-bottom: 1px solid #eee;
        }

        .modal-title {
            margin: 0;
            font-size: 1.2rem;
            color: #333;
        }

        .modal-body {
            padding: 20px;
            font-size: 1rem;
            color: #666;
            line-height: 1.5;
        }

        .modal-footer {
            padding: 12px 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .modal-btn {
            padding: 8px 16px;
            border-radius: 4px;
            border: none;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .modal-btn.cancel {
            background: #f0f0f0;
            color: #333;
        }

        .modal-btn.cancel:hover {
            background: #e0e0e0;
        }

        .modal-btn.confirm {
            background: #4285f4;
            color: white;
        }

        .modal-btn.confirm:hover {
            background: #3367d6;
        }

        @media (max-width: 480px) {
            .modal-container {
                width: 95%;
            }

            .modal-header {
                padding: 12px 16px;
            }

            .modal-title {
                font-size: 1.1rem;
            }

            .modal-body {
                padding: 16px;
                font-size: 0.95rem;
            }

            .modal-footer {
                padding: 10px 16px;
                flex-wrap: wrap;
            }

            .modal-btn {
                padding: 6px 12px;
                font-size: 0.85rem;
                flex: 1;
                min-width: 100px;
            }
        }`;
            document.head.appendChild(cssE);
        }

        getInfo() {
            return {
                id: 'ccwpolyfill',
                name: 'CCW-Polyfill',
                color1: '#4285F4',
                color2: '#2855C1',
                blocks: [
                    {
                        blockType: sc.BlockType.LABEL,
                        text: translate("ccwpolyfill.warning")
                    },
                    {
                        blockType: sc.BlockType.LABEL,
                        text: translate("ccwpolyfill.experimentalWarning")
                    },
                    {
                        opcode: 'emptyValue',
                        blockType: sc.BlockType.COMMAND,
                        text: translate("ccwpolyfill.extensionKeeper"),
                        arguments: {}
                    }
                ]
            };
        }


        emptyValue() {
            return undefined;
        }

        hookScratch() {
            if (typeof self.webpackChunkscratch_extensions == 'undefined') self.webpackChunkscratch_extensions = new ExtensionLoader();
            if (typeof ScratchExtensions == 'undefined') window.ScratchExtensions = sc.extensions;
            if (typeof tempExt == 'undefined') {
                let _tempExtValue;
                Object.defineProperty(window, 'tempExt', {
                    get() {
                        return _tempExtValue;
                    },

                    set(newValue) {
                        if (typeof newValue != 'undefined' && typeof newValue.Extension == 'function') {
                            _tempExtValue = newValue;
                            let target, info;
                            try {
                                target = new newValue.Extension(sc.vm);
                                const proxiedTarget = webpackChunkscratch_extensions.createProxiedFunctions(target);
                                info = target.getInfo();
                                proxiedTarget.getInfo = function () {
                                    const blocks = info.blocks;
                                    if (typeof blocks === 'object' && blocks !== null) {
                                        for (const [key, block] of Object.entries(blocks)) {
                                            if (typeof block === 'string' && block.startsWith('---') && block.length !== 3) {
                                                blocks[key] = {
                                                    blockType: Scratch.BlockType.LABEL,
                                                    text: block.substring(3)
                                                };
                                            }
                                        }
                                    }
                                    return info;
                                };
                                Scratch.extensions.register(proxiedTarget);
                            } catch (e) {
                                try {
                                    const processed = webpackChunkscratch_extensions.convertBlocks(info.blocks)
                                    target._______ccw_polyfill__temp = function () {
                                        return '__ccw_polyfill'
                                    }
                                    const proxiedTarget = webpackChunkscratch_extensions.createProxiedFunctions(target);
                                    proxiedTarget.getInfo = function () {
                                        const info = target.getInfo.call(this);
                                        const blocks = info.blocks;
                                        if (typeof blocks === 'object' && blocks !== null) {
                                            for (const [key, block] of Object.entries(blocks)) {
                                                if (typeof block === 'string' && block.startsWith('---') && block.length !== 3) {
                                                    blocks[key] = {
                                                        blockType: Scratch.BlockType.LABEL,
                                                        text: block.substring(3)
                                                    };
                                                }
                                            }
                                        }
                                        return info;
                                    };
                                    ScratchExtensions.register(info.name || info.id, { blocks: processed }, proxiedTarget);
                                    console.log(proxiedTarget)
                                } catch (e) { console.warn("[CCW Polyfill] Failed to register extensions.", e) }
                            }
                        } else {
                            return;
                        }
                    },

                    enumerable: true,
                    configurable: true
                });

            }

            this.setupVM()

        }

        setupVM() {
            this.vm.getFormatMessage = (fm) => {
                return function (i) {
                    return typeof fm[Scratch.translate.language][i.id] == 'undefined' ? i['default'] : fm[Scratch.translate.language][i.id];
                }
            }
            this.vm.runtime.getFormatMessage = this.vm.getFormatMessage;
            this.vm.runtime.ccwAPI = {
                commentWithStageSnapshot() {
                    return new Promise((resolve, reject) => {
                        resolve(showConfirm(translate("ccwpolyfill.screenshotCommentMessage"), translate("ccwpolyfill.noticeTitle"), translate("ccwpolyfill.okMeow"), translate("ccwpolyfill.meowQuestion"), () => {
                            alert(translate("meowAlert"))
                        }))
                    })
                },
                getCoinCount() {
                    return new Promise((resolve, reject) => {
                        resolve(0)
                    })
                },
                getDeviceType() {
                    return new Promise((resolve, reject) => {
                        resolve('PC')
                    })
                },
                getExtensionURLById(id) {
                    return new Promise((resolve, reject) => {
                        resolve('')
                    })
                },
                getOnlineExtensionsConfig() {
                    return new Promise((resolve, reject) => {
                        resolve({})
                    })
                },
                getProjectDonateRanking() {
                    return new Promise((resolve, reject) => {
                        resolve({
                            curUserDonatedRecord: {
                                "bucks": 0,
                                "name": "",
                                "oid": "",
                                "avatar": ""
                            },
                            rankingList: undefined
                        })
                    })
                },
                getProjectSb3Id() {
                    return ''
                },
                getProjectStats() {
                    return new Promise((resolve, reject) => {
                        resolve({
                            "commentCount": 0,
                            "favoriteCount": 0,
                            "likeCount": 0,
                            "totalBucks": 0
                        })
                    })
                },
                getProjectUUID() {
                    return ''
                },
                getUserInfo() {
                    return new Promise((resolve, reject) => {
                        resolve({
                            "userId": "",
                            "userName": "",
                            "uuid": "",
                            "oid": "",
                            "avatar": "",
                            "constellation": -1,
                            "following": 0,
                            "followers": 0,
                            "liked": 0,
                            "gender": -1,
                            "pendant": "",
                            "reputationScore": {
                                "rank": "EXCELLENT",
                                "score": 100,
                                "studentOid": ""
                            }
                        })
                    })
                },

                getOpenVM() {
                    return sc.vm
                },

                isFavoriteProject() {
                    return new Promise((resolve, reject) => {
                        resolve(true)
                    })
                },

                isFollowed() {
                    return new Promise((resolve, reject) => {
                        resolve(true)
                    })
                },

                isLikedProject() {
                    return new Promise((resolve, reject) => {
                        resolve(true)
                    })
                },

                isMyFans() {
                    return new Promise((resolve, reject) => {
                        resolve(true)
                    })
                },

                preActionInterceptor() {

                },

                redirect() { },

                requestCoins() { },

                requestFollow() { },

                sendPlayEventCode() { },

                setAvatar() { },

                showShare() { },

                uploadAssetToCloud(M, t) { }


            };
        }


    }
    let ccwpolyfill = new CCWPolyfill();
    sc.extensions.register(ccwpolyfill);
    ccwpolyfill.hookScratch()
})(window, typeof Scratch == 'undefined' ? { vm: { runtime: {} } } : Scratch);