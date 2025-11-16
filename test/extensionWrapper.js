/**
 * CCW Extension Polyfill
 * Author: Xbodwf(https://github.com/xbodwf)
 */

; ((window, sc) => {
    if (!sc.extensions.unsandboxed) {
        throw new Error("This extension must run unsandboxed")
    }

    const translations = {
        en: {
            "ccwpolyfill.noticeTitle": "Notice",
            "ccwpolyfill.cancelBtn": "Cancel",
            "ccwpolyfill.confirmBtn": "Accept",
            "ccwpolyfill.warning": "Warning",
            "ccwpolyfill.experimentalWarning": "You're using Experimental features",
            "ccwpolyfill.extensionKeeper": "Extension Keeper",
            "ccwpolyfill.screenshotCommentMessage":
                "This page requests your screenshot comment (though this is not CCW and has no effect)",
            "ccwpolyfill.promptTitle": "Prompt",
            "ccwpolyfill.okMeow": "Okay meow...",
            "ccwpolyfill.meowQuestion": "Meow?",
            "ccwpolyfill.meowAlert": "Meow~",
        },
        "zh-cn": {
            "ccwpolyfill.noticeTitle": "通知",
            "ccwpolyfill.cancelBtn": "取消",
            "ccwpolyfill.confirmBtn": "确认",
            "ccwpolyfill.warning": "警告",
            "ccwpolyfill.experimentalWarning": "您正在使用实验性功能",
            "ccwpolyfill.extensionKeeper": "扩展防卸载器",
            "ccwpolyfill.screenshotCommentMessage": "该页面请求您截图评论(虽然这不是CCW并没有什么用)",
            "ccwpolyfill.promptTitle": "提示",
            "ccwpolyfill.okMeow": "好的喵...",
            "ccwpolyfill.meowQuestion": "喵？",
            "ccwpolyfill.meowAlert": "喵~",
        },
    }

    const translate = (t) =>
        typeof translations[sc.translate?.language] != undefined &&
            typeof translations[sc.translate?.language][t] == "undefined"
            ? t
            : translations[sc.translate?.language][t]

    function showConfirm(message, title = "Notice", cancelText = "Cancel", confirmText = "Accept", onConfirm, onCancel) {
        const overlay = document.createElement("div")
        overlay.className = "modal-overlay"

        const container = document.createElement("div")
        container.className = "modal-container"

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
            `

        overlay.appendChild(container)
        document.body.appendChild(overlay)

        setTimeout(() => overlay.classList.add("active"), 10)

        const cancelBtn = container.querySelector(".cancel")
        cancelBtn.addEventListener("click", () => {
            closeModal(overlay)
            onCancel && onCancel()
        })

        const confirmBtn = container.querySelector(".confirm")
        confirmBtn.addEventListener("click", () => {
            closeModal(overlay)
            onConfirm && onConfirm()
        })

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                closeModal(overlay)
                onCancel && onCancel()
            }
        })

        const handleEsc = (e) => {
            if (e.key === "Escape") {
                closeModal(overlay)
                onCancel && onCancel()
                document.removeEventListener("keydown", handleEsc)
            }
        }
        document.addEventListener("keydown", handleEsc)

        function closeModal(overlay) {
            overlay.classList.remove("active")
            setTimeout(() => {
                document.body.removeChild(overlay)
            }, 300)
        }
    }

    class ExtensionLoader extends Array {
        //注意: window.tempExt与ExtensionLoader无关。只有webpack打包的chunk会触发extensionLoader,修改此处即可。
        constructor() {
            super()

            this.installedChunks = {}

            const originalPush = Array.prototype.push.bind(this)

            this.push = function push(chunkData) {
                // Call original push to maintain array behavior
                originalPush(chunkData)

                const [chunkIds, modules, runtime] = chunkData

                let moduleId
                let chunkId

                // Mark chunks as loaded
                for (let i = 0; i < chunkIds.length; i++) {
                    chunkId = chunkIds[i]
                    if (this.installedChunks[chunkId]) {
                        this.installedChunks[chunkId][0]()
                    }
                    this.installedChunks[chunkId] = 0
                }

                for (moduleId in modules) {
                    if (Object.prototype.hasOwnProperty.call(modules, moduleId)) {
                        // Store module for later require
                        if (!this.moduleRegistry) {
                            this.moduleRegistry = {}
                        }
                        this.moduleRegistry[moduleId] = modules[moduleId]
                    }
                }

                if (runtime) runtime(this.requireFn || this.require.bind(this))

                this.loadExtensionFromModules(modules)

                return chunkData
            }
        }

        // 硬编码的chunkIDs和moduleIds映射
        chunkToModuleMap = {
            9445: 47156,
            5777: 8713,
            3814: 20210,
            1868: 60214,
            3977: 32845,
            6767: 11298,
            1743: 94165,
            4991: 52214,
            2606: 80893,
            9244: 20184,
            1169: 35340,
            8450: 93034,
            3347: 63969,
            2259: 18018,
            3854: 68005,
            3632: 73632,
            2226: 8338,
            8635: 83787,
            7372: 69219,
            1417: 54398,
            6552: 93614,
            9986: 21002,
            155: 50780,
            7490: 15679,
            9468: 93150,
            321: 69434,
            1561: 51509,
            7119: 48656,
            6127: 48859,
            1431: 46798,
            2730: 3276,
            9139: 13740,
            2581: 66493,
            1081: 40862,
            4071: 92413,
            1138: 15698,
            8364: 33824,
            4279: 23542,
            5437: 49014,
            9583: 40721,
            5537: 44418,
            1179: 94954,
            7384: 49684,
            4732: 64345,
            9051: 91803,
            1825: 36679,
            388: 63960,
            4451: 92409,
            1757: 87533
        }

        loadExtensionFromModules(modules) {
            const results = []
            const detectedLoaderChunks = new Set()
            
            // 首先检查是否有扩展加载器函数
            const candidateFns = Object.values(modules).filter((fn) => typeof fn === "function")
            
            // 检查函数是否是扩展加载器
            candidateFns.forEach((fn) => {
                if (typeof fn === "function") {
                    const fnStr = fn.toString()
                    if (fnStr.includes("return N.e(")) {
                        // 这是一个扩展加载器，提取chunkId
                        const match = fnStr.match(/return N\.e\((\d+)\)\.then\(N\.bind\(N,\s*(\d+)\)\)/)
                        if (match) {
                            const chunkId = parseInt(match[1])
                            const moduleId = parseInt(match[2])
                            detectedLoaderChunks.add(chunkId)
                            console.log(`[CCW Polyfill] 检测到扩展加载器: chunkId=${chunkId}, moduleId=${moduleId}`)
                        }
                    }
                }
            })
            
            // 处理常规扩展函数
            const regularCandidateFns = candidateFns.filter((fn) => fn.length === 3)
            regularCandidateFns.forEach((moduleFn) => {
                try {
                    const moduleResult = this.require(undefined, moduleFn, modules)
                    results.push(moduleResult)
                } catch (e) {
                    console.warn("[CCW Polyfill] Failed to load module:", e)
                }
            })
            
            // 尝试从硬编码的chunkId加载扩展
            for (const [chunkId, moduleId] of Object.entries(this.chunkToModuleMap)) {
                if (detectedLoaderChunks.has(parseInt(chunkId))) {
                    try {
                        if (this.moduleRegistry && this.moduleRegistry[moduleId]) {
                            const moduleResult = this.require(moduleId)
                            if (moduleResult) {
                                results.push(moduleResult)
                                console.log(`[CCW Polyfill] 从硬编码chunkId=${chunkId}加载了moduleId=${moduleId}`)
                            }
                        }
                    } catch (e) {
                        console.warn(`[CCW Polyfill] 从硬编码chunkId=${chunkId}加载moduleId=${moduleId}失败:`, e)
                    }
                }
            }

            let target
            let info

            if (results.length > 0) {
                try {
                    let moduleExports = results[0].exports

                    if (moduleExports.__esModule === true) {
                        target = new moduleExports.default(sc.vm)
                    } else {
                        target = new moduleExports(sc.vm)
                    }

                    info = target.getInfo()

                    target.getInfo = () => {
                        const blocks = info.blocks
                        if (typeof blocks === "object" && blocks !== null) {
                            for (const [key, block] of Object.entries(blocks)) {
                                if (typeof block === "string" && block.startsWith("---") && block.length !== 3) {
                                    blocks[key] = {
                                        blockType: sc.BlockType.LABEL,
                                        text: block.substring(3),
                                    }
                                }
                            }
                        }
                        if (!/^[a-z0-9]+$/i.test(info.id)) {
                            info.id = info.id.replace(/[^a-zA-Z0-9]/g, '');
                        }
                        return info
                    }

                    Scratch.extensions.register(target) //此时必须使用Scratch.extensions.register而非sc的否则会爆Too late to register new extensions.
                    sc.vm.runtime[`ext_${info.id}`] = target
                    console.log("[CCW Polyfill] Successfully registered extension:", info.id)
                } catch (e) {
                    console.warn("[CCW Polyfill] First Method failed...", e)
                    try {
                        const processed = this.convertBlocks(info.blocks)
                        target._______ccw_polyfill__temp = () => "__ccw_polyfill"
                        const proxiedTarget = this.createProxiedFunctions(target)
                        proxiedTarget.getInfo = function () {
                            const info = target.getInfo.call(this)
                            const blocks = info.blocks
                            if (typeof blocks === "object" && blocks !== null) {
                                for (const [key, block] of Object.entries(blocks)) {
                                    if (typeof block === "string" && block.startsWith("---") && block.length !== 3) {
                                        blocks[key] = {
                                            blockType: sc.BlockType.LABEL,
                                            text: block.substring(3),
                                        }
                                    }
                                    /*if(typeof block === 'object' && block.type == 'button' && typeof block.onClick === 'function') {
                                                                      block.opcode = "ccw_polyfill_"
                                                                  }*/
                                }
                            }
                            if (!/^[a-z0-9]+$/i.test(info.id)) {
                                info.id = info.id.replace(/[^a-zA-Z0-9]/g, '');
                            }
                            return info
                        }
                        ScratchExtensions.register(info.name || info.id, { blocks: processed }, proxiedTarget) //ScratchExtension是另外一种注册方式。
                        sc.vm.runtime[`ext_${info.id}`] = target
                    } catch (e) {
                        console.warn("[CCW Polyfill] Failed to register extensions.", e)
                    }
                }
            }
        }

        require(moduleId, moduleFunc, modules = {}) {
            var module = {
                exports: {},
            }

            const requireFn = (id) => {
                return this.require(id, undefined, modules)
            }

            // Attach webpack helper methods to the require function
            requireFn.r = (exports) => {
                if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
                }
                Object.defineProperty(exports, "__esModule", { value: true })
            }

            requireFn.d = (exports, definition) => {
                for (const key in definition) {
                    if (!Object.prototype.hasOwnProperty.call(exports, key)) {
                        Object.defineProperty(exports, key, {
                            enumerable: true,
                            get: definition[key],
                        })
                    }
                }
            }

            requireFn.o = (object, property) => Object.prototype.hasOwnProperty.call(object, property)

            requireFn.n = (module) => {
                var getter =
                    module && module.__esModule
                        ? function getDefault() {
                            return module["default"]
                        }
                        : function getModuleExports() {
                            return module
                        }
                requireFn.d(getter, { a: getter })
                return getter
            }
            
            // Additional webpack_require properties
            requireFn.s = null; // the module id of the entry point
            requireFn.c = this.moduleRegistry || {}; // the module cache
            requireFn.m = modules; // the module functions
            requireFn.p = ""; // the bundle public path
            requireFn.i = x => x; // the identity function used for harmony imports
            requireFn.e = chunkId => {
                // the chunk ensure function
                if (this.installedChunks[chunkId] === 0) {
                    return Promise.resolve();
                }
                
                // Create a Promise to load the chunk
                if (!this.installedChunks[chunkId]) {
                    this.installedChunks[chunkId] = [
                        resolve => {
                            this.installedChunks[chunkId] = 0;
                            resolve();
                        }
                    ];
                }
                
                return new Promise((resolve, reject) => {
                    this.installedChunks[chunkId].push(resolve);
                });
            };
            requireFn.t = (value, mode) => {
                // create a fake namespace object
                if (mode & 1) value = requireFn(value);
                if (mode & 8) return value;
                if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
                var ns = Object.create(null);
                requireFn.r(ns);
                Object.defineProperty(ns, 'default', { enumerable: true, value: value });
                if (mode & 2 && typeof value != 'string') {
                    for (var key in value) requireFn.d(ns, key, function(key) { return value[key]; }.bind(null, key));
                }
                return ns;
            };
            requireFn.h = ""; // the webpack hash
            requireFn.w = {}; // WebAssembly exports
            requireFn.oe = err => { throw err; }; // uncaught error handler
            requireFn.nc = undefined; // script nonce for CSP

            var func = typeof moduleId == "undefined" ? moduleFunc : modules[moduleId]
            if (typeof func == "function") func(module, module.exports, requireFn)
            return module
        }

        uuidv4() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
                const r = (Math.random() * 16) | 0
                const v = c == "x" ? r : (r & 0x3) | 0x8
                return v.toString(16)
            })
        }

        convertBlocks(blocks) {
            return blocks.map((block) => [
                this.stringifyScratchXBlockType(block),
                block.text == undefined ? "" : block.text,
                block.opcode == undefined ? "_______ccw_polyfill__temp" : block.opcode,
                block.arguments == undefined ? {} : block.arguments,
                block.defaultValue == undefined ? "" : block.defaultValue,
            ])
        }

        stringifyScratchXBlockType(blockInfo) {
            const { blockType, async = false } = blockInfo

            if (blockType === sc.BlockType.COMMAND) {
                return async ? "w" : ""
            }

            if (blockType === sc.BlockType.REPORTER) {
                return async ? "R" : "r"
            }

            if (blockType === sc.BlockType.BOOLEAN) {
                return "b"
            }

            if (blockType === sc.BlockType.HAT) {
                return "h"
            }

            return async ? "R" : "r"
        }

        getAllFunctions(target) {
            const functions = new Map()
            let currentObj = target

            while (currentObj && currentObj !== Object.prototype) {
                const props = Object.getOwnPropertyNames(currentObj)
                for (const prop of props) {
                    if (prop !== "constructor" && typeof currentObj[prop] === "function") {
                        if (!functions.has(prop)) {
                            functions.set(prop, currentObj[prop])
                        }
                    }
                }
                currentObj = Object.getPrototypeOf(currentObj)
            }

            return functions
        }

        createProxiedFunctions(target) {
            const proxiedObj = {}
            const allFunctions = this.getAllFunctions(target)

            allFunctions.forEach((func, prop) => {
                proxiedObj[prop] = (...args) => func.call(target, ...args)
            })

            return proxiedObj
        }
    }

    /**
     * Scratch VM Runtime to project.json Converter
     * Pure JavaScript class to convert Scratch VM runtime state to project.json format
     */
    class VMToJSON {
        /**
         * Convert Scratch VM runtime to project.json format
         * @param {Object} vm - The Scratch VM instance
         * @returns {String} - project.json compatible object
         */
        convert(vm) {
            const targets = vm.runtime.targets || []
            const projectTargets = targets.map((target) => this.#convertTarget(target))

            const project = {
                targets: projectTargets,
                monitors: this.#convertMonitors(vm.runtime._monitorState),
                extensions: Array.from(vm.runtime.extensionManager._loadedExtensions.keys()),
                meta: {
                    semver: "3.0.0",
                    vm: vm.runtime.runtimeOptions?.version || "0.2.0",
                    agent: "Mozilla/5.0 (Scratch 3.0)",
                    platform: {
                        name: "CCW Polyfill Generater",
                    },
                },
                extensionStorage: this.#convertExtensionStorage(vm.runtime.extensionManager),
            }

            const extensionURLs = this.#getExtensionURLs(vm.runtime.extensionManager)
            if (Object.keys(extensionURLs).length > 0) {
                project.extensionURLs = extensionURLs
            }

            return JSON.stringify(project)
        }

        saveProjectSb3(vm) {
            return new Promise((resolve) => {
                const jszip = new vm.exports.JSZip()
                jszip.file("project.json", this.convert(vm))
                this.#addFileDescsToZip(this.#serializeAssetsA(undefined, vm), jszip)
                const date = new Date(1591657163000)
                for (const file of Object.values(jszip.files)) {
                    file.date = date
                }

                const COMPRESSABLE_FORMATS = [".json", ".svg", ".wav", ".ttf", ".otf", ".woff", ".woff2"]
                for (const file of Object.values(jszip.files)) {
                    if (COMPRESSABLE_FORMATS.some((ext) => file.name.endsWith(ext))) {
                        file.options.compression = "DEFLATE"
                    } else {
                        file.options.compression = "STORE"
                    }
                }
                const projectSb3 = jszip.generateAsync({ type: "blob", mimeType: "application/x.scratch.sb3" })
                resolve(projectSb3)
            })
        }

        /**
         * Convert a single target (sprite or stage) to project.json format
         * @param {Object} target - Runtime target object
         * @returns {Object} - project.json target object
         */
        #convertTarget(target) {
            return {
                isStage: target.isStage,
                name: target.sprite.name,
                variables: this.#convertVariables(target.variables),
                lists: this.#convertLists(target.variables),
                broadcasts: this.#convertBroadcasts(target.variables),
                blocks: this.#convertBlocks(target.blocks),
                comments: this.#convertComments(target.comments),
                currentCostume: target.currentCostume,
                costumes: this.#convertCostumes(target.sprite.costumes),
                sounds: this.#convertSounds(target.sprite.sounds),
                volume: target.volume,
                layerOrder: target.layerOrder,
                ...(target.isStage ? this.#getStageProperties(target) : this.#getSpriteProperties(target)),
            }
        }

        /**
         * Get stage-specific properties
         * @param {Object} target - Stage target object
         * @returns {Object} - Stage properties
         */
        #getStageProperties(target) {
            return {
                tempo: target.tempo,
                videoTransparency: target.videoTransparency,
                videoState: target.videoState,
                textToSpeechLanguage: target.textToSpeechLanguage || null,
            }
        }

        /**
         * Get sprite-specific properties
         * @param {Object} target - Sprite target object
         * @returns {Object} - Sprite properties
         */
        #getSpriteProperties(target) {
            return {
                visible: target.visible,
                x: target.x,
                y: target.y,
                size: target.size,
                direction: target.direction,
                draggable: target.draggable,
                rotationStyle: target.rotationStyle,
            }
        }

        /**
         * Convert variables from runtime format to project.json format
         * @param {Object} variables - Runtime variables object
         * @returns {Object} - project.json variables object
         */
        #convertVariables(variables) {
            const result = {}

            for (const [id, variable] of Object.entries(variables)) {
                if (variable.type === "" || variable.type === "scalar") {
                    result[id] = [variable.name, variable.value]
                }
            }

            return result
        }

        /**
         * Convert lists from runtime format to project.json format
         * @param {Object} variables - Runtime variables object containing lists
         * @returns {Object} - project.json lists object
         */
        #convertLists(variables) {
            const result = {}

            for (const [id, variable] of Object.entries(variables)) {
                if (variable.type === "list") {
                    result[id] = [variable.name, variable.value || []]
                }
            }

            return result
        }

        /**
         * Convert broadcasts from runtime format to project.json format
         * @param {Object} variables - Runtime variables object containing broadcasts
         * @returns {Object} - project.json broadcasts object
         */
        #convertBroadcasts(variables) {
            const result = {}

            for (const [id, variable] of Object.entries(variables)) {
                if (variable.type === "broadcast_msg") {
                    result[id] = variable.name
                }
            }

            return result
        }

        /**
         * Convert blocks from runtime format to project.json format
         * @param {Object} blocks - Runtime blocks object
         * @returns {Object} - project.json blocks object
         */
        #convertBlocks(blocks) {
            if (!blocks || !blocks._blocks) {
                return {}
            }

            const result = {}
            const blockMap = blocks._blocks

            for (const [id, block] of Object.entries(blockMap)) {
                if (!block || !block.opcode || typeof block.opcode !== "string") {
                    console.warn(`[ScratchVMToProjectConverter] Skipping block ${id} with invalid opcode:`, block?.opcode)
                    continue
                }

                result[id] = this.#convertBlock(block, blockMap)
            }

            return result
        }

        /**
         * Convert a single block to project.json format
         * @param {Object} block - Runtime block object
         * @param {Object} blockMap - Map of all blocks for reference
         * @returns {Object} - project.json block object
         */
        #convertBlock(block, blockMap) {
            const converted = {
                opcode: block.opcode,
                next: block.next || null,
                parent: block.parent || null,
                inputs: this.#convertInputs(block.inputs, blockMap),
                fields: this.#convertFields(block.fields),
                shadow: block.shadow || false,
                topLevel: block.topLevel || false,
            }

            // Add optional properties
            if (block.topLevel) {
                converted.x = block.x || 0
                converted.y = block.y || 0
            }

            if (block.mutation) {
                converted.mutation = this.#convertMutation(block.mutation)
            }

            if (block.comment) {
                converted.comment = block.comment
            }

            return converted
        }

        /**
         * Convert block inputs to project.json format
         * @param {Object} inputs - Runtime inputs object
         * @param {Object} blockMap - Map of all blocks for reference
         * @returns {Object} - project.json inputs object
         */
        #convertInputs(inputs, blockMap) {
            const result = {}

            for (const [inputName, input] of Object.entries(inputs)) {
                // Input format: [inputType, blockId, shadowBlockId?]
                // inputType: 1 = shadow only, 2 = no shadow, 3 = shadow obscured by block

                if (input.block && input.shadow) {
                    // Both block and shadow exist - shadow obscured by block
                    result[inputName] = [3, input.block, input.shadow]
                } else if (input.block) {
                    // Only block exists - no shadow
                    result[inputName] = [2, input.block]
                } else if (input.shadow) {
                    // Only shadow exists
                    result[inputName] = [1, input.shadow]
                } else {
                    // Primitive value - create inline primitive array
                    const value = input.value !== undefined ? input.value : null
                    const type = this.#getPrimitiveType(value)
                    result[inputName] = [1, [type, String(value)]]
                }
            }

            return result
        }

        /**
         * Get primitive type code for project.json
         * @param {*} value - Primitive value to check
         * @returns {number} - Type code (4 for number, 10 for text)
         */
        #getPrimitiveType(value) {
            if (typeof value === "number" || !isNaN(Number(value))) {
                return 4 // number primitive
            } else if (typeof value === "string") {
                return 10 // text primitive
            }
            return 10 // default to text
        }

        /**
         * Convert block fields to project.json format
         * @param {Object} fields - Runtime fields object
         * @returns {Object} - project.json fields object
         */
        #convertFields(fields) {
            const result = {}

            for (const [fieldName, field] of Object.entries(fields)) {
                if (field.value !== undefined) {
                    result[fieldName] = [field.value, field.id || null]
                }
            }

            return result
        }

        /**
         * Convert mutation object to project.json format
         * @param {Object} mutation - Runtime mutation object
         * @returns {Object} - project.json mutation object
         */
        #convertMutation(mutation) {
            const result = {
                tagName: mutation.tagName || "mutation",
                children: [],
            }

            // Copy all mutation properties
            for (const [key, value] of Object.entries(mutation)) {
                if (key !== "tagName" && key !== "children") {
                    result[key] = value
                }
            }

            return result
        }

        /**
         * Convert comments to project.json format
         * @param {Object} comments - Runtime comments object
         * @returns {Object} - project.json comments object
         */
        #convertComments(comments) {
            const result = {}

            for (const [id, comment] of Object.entries(comments)) {
                result[id] = {
                    blockId: comment.blockId,
                    x: comment.x,
                    y: comment.y,
                    width: comment.width,
                    height: comment.height,
                    minimized: comment.minimized,
                    text: comment.text,
                }
            }

            return result
        }

        /**
         * Convert costumes to project.json format
         * @param {Array} costumes - Runtime costumes array
         * @returns {Array} - project.json costumes array
         */
        #convertCostumes(costumes) {
            return costumes.map((costume) => {
                let assetId = costume.assetId
                if (!assetId && costume.md5ext) {
                    // Extract assetId by removing file extension from md5ext
                    assetId = costume.md5ext.split(".")[0]
                }
                if (!assetId && costume.asset && costume.asset.assetId) {
                    assetId = costume.asset.assetId
                }

                return {
                    assetId: assetId,
                    name: costume.name,
                    bitmapResolution: costume.bitmapResolution || 1,
                    md5ext: costume.md5ext || `${assetId}.${costume.dataFormat}`,
                    dataFormat: costume.dataFormat,
                    rotationCenterX: costume.rotationCenterX || 0,
                    rotationCenterY: costume.rotationCenterY || 0,
                }
            })
        }

        /**
         * Convert sounds to project.json format
         * @param {Array} sounds - Runtime sounds array
         * @returns {Array} - project.json sounds array
         */
        #convertSounds(sounds) {
            return sounds.map((sound) => {
                let assetId = sound.assetId
                if (!assetId && sound.md5ext) {
                    // Extract assetId by removing file extension from md5ext
                    assetId = sound.md5ext.split(".")[0]
                }
                if (!assetId && sound.asset && sound.asset.assetId) {
                    assetId = sound.asset.assetId
                }

                return {
                    assetId: assetId,
                    name: sound.name,
                    dataFormat: sound.dataFormat,
                    format: sound.format || sound.dataFormat,
                    rate: sound.rate || 48000,
                    sampleCount: sound.sampleCount || 0,
                    md5ext: sound.md5ext || `${assetId}.${sound.dataFormat}`,
                }
            })
        }

        /**
         * Convert monitors to project.json format
         * @param {Object} monitorState - Runtime monitor state object
         * @returns {Array} - project.json monitors array
         */
        #convertMonitors(monitorState) {
            if (!monitorState) {
                return []
            }

            const monitors = []

            for (const [id, monitor] of Object.entries(monitorState)) {
                if (!monitor) continue

                if (!monitor.opcode || typeof monitor.opcode !== "string") {
                    console.warn(`[ScratchVMToProjectConverter] Skipping monitor ${id} with invalid opcode:`, monitor?.opcode)
                    continue
                }

                monitors.push({
                    id: monitor.id || id,
                    mode: monitor.mode || "default",
                    opcode: monitor.opcode,
                    params: monitor.params || {},
                    spriteName: monitor.spriteName || null,
                    value: monitor.value,
                    width: monitor.width || 0,
                    height: monitor.height || 0,
                    x: monitor.x || 0,
                    y: monitor.y || 0,
                    visible: monitor.visible !== false,
                    sliderMin: monitor.sliderMin || 0,
                    sliderMax: monitor.sliderMax || 100,
                    isDiscrete: monitor.isDiscrete !== false,
                })
            }

            return monitors
        }

        /**
         * Convert extension storage to project.json format
         * @param {Object} extensionManager - Runtime extension manager
         * @returns {Object} - project.json extension storage object
         */
        #convertExtensionStorage(extensionManager) {
            const storage = {}

            if (!extensionManager || !extensionManager._loadedExtensions) {
                return storage
            }

            // Iterate through loaded extensions
            for (const [extensionId, extension] of extensionManager._loadedExtensions.entries()) {
                // Check if extension has storage data
                if (extension._extensionStorage) {
                    storage[extensionId] = extension._extensionStorage
                } else if (extension.storage) {
                    storage[extensionId] = extension.storage
                }
            }

            return storage
        }

        /**
         * Get extension URLs for custom extensions
         * @param {Object} extensionManager - Runtime extension manager
         * @returns {Object} - project.json extension URLs object
         */
        #getExtensionURLs(extensionManager) {
            const urls = {}

            if (!extensionManager || !extensionManager._loadedExtensions) {
                return urls
            }

            // Iterate through loaded extensions
            for (const [extensionId, extension] of extensionManager._loadedExtensions.entries()) {
                // Check if extension has a custom URL (non-built-in extensions)
                if (extension.extensionURL) {
                    urls[extensionId] = extension.extensionURL
                } else if (extension._extensionURL) {
                    urls[extensionId] = extension._extensionURL
                }
            }

            return urls
        }

        /**
         * Serialize all the assets of the given type ('sounds' or 'costumes')
         * in the provided runtime into an array of file descriptors.
         * A file descriptor is an object containing the name of the file
         * to be written and the contents of the file, the serialized asset.
         * @param {Runtime} runtime The runtime with the assets to be serialized
         * @param {string} assetType The type of assets to be serialized: 'sounds' | 'costumes'
         * @param {string=} optTargetId Optional target id to serialize assets for
         * @returns {Array<object>} An array of file descriptors for each asset
         */
        #serializeAssets(runtime, assetType, optTargetId) {
            const targets = optTargetId ? [runtime.getTargetById(optTargetId)] : runtime.targets
            const assetDescs = []
            for (let i = 0; i < targets.length; i++) {
                const currTarget = targets[i]
                const currAssets = currTarget.sprite[assetType]
                for (let j = 0; j < currAssets.length; j++) {
                    const currAsset = currAssets[j]
                    const asset = currAsset.broken ? currAsset.broken.asset : currAsset.asset
                    if (asset) {
                        // Serialize asset if it exists, otherwise skip
                        assetDescs.push({
                            fileName: `${asset.assetId}.${asset.dataFormat}`,
                            fileContent: asset.data,
                        })
                    }
                }
            }
            return assetDescs
        }

        /**
         * Serialize all the sounds in the provided runtime or, if a target id is provided,
         * in the specified target into an array of file descriptors.
         * A file descriptor is an object containing the name of the file
         * to be written and the contents of the file, the serialized sound.
         * @param {Runtime} runtime The runtime with the sounds to be serialized
         * @param {string=} optTargetId Optional targetid for serializing sounds of a single target
         * @returns {Array<object>} An array of file descriptors for each sound
         */
        #serializeSounds(runtime, optTargetId) {
            return this.#serializeAssets(runtime, "sounds", optTargetId)
        }

        /**
         * Serialize all the costumes in the provided runtime into an array of file
         * descriptors. A file descriptor is an object containing the name of the file
         * to be written and the contents of the file, the serialized costume.
         * @param {Runtime} runtime The runtime with the costumes to be serialized
         * @param {string} optTargetId Optional targetid for serializing costumes of a single target
         * @returns {Array<object>} An array of file descriptors for each costume
         */
        #serializeCostumes(runtime, optTargetId) {
            return this.#serializeAssets(runtime, "costumes", optTargetId)
        }

        /**
         * @param {string} targetId Optional ID of target to export
         * @returns {Array<{fileName: string; fileContent: Uint8Array;}} list of file descs
         */
        #serializeAssetsA(targetId, vm) {
            const costumeDescs = this.#serializeCostumes(vm.runtime, targetId)
            const soundDescs = this.#serializeSounds(vm.runtime, targetId)
            const fontDescs = vm.runtime.fontManager.serializeAssets().map((asset) => ({
                fileName: `${asset.assetId}.${asset.dataFormat}`,
                fileContent: asset.data,
            }))
            return [...costumeDescs, ...soundDescs, ...fontDescs]
        }

        #addFileDescsToZip(fileDescs, zip) {
            for (let i = 0; i < fileDescs.length; i++) {
                const currFileDesc = fileDescs[i]
                zip.file(currFileDesc.fileName, currFileDesc.fileContent)
            }
        }
    }

    class CCWPolyfill {
        constructor() {
            this.vm = sc.vm || {}
            this.register = () => { }
            const cssE = document.createElement("style")
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
        }`
            document.head.appendChild(cssE)

            this.vmToJSON = new VMToJSON()
        }

        getInfo() {
            return {
                id: "extensionWrapper",
                name: "Warpper",
                color1: "#4285F4",
                color2: "#2855C1",
                blocks: [
                    {
                        blockType: sc.BlockType.LABEL,
                        text: translate("ccwpolyfill.warning"),
                    },
                    {
                        blockType: sc.BlockType.LABEL,
                        text: translate("ccwpolyfill.experimentalWarning"),
                    },
                    {
                        opcode: "emptyValue",
                        blockType: sc.BlockType.COMMAND,
                        text: translate("ccwpolyfill.extensionKeeper"),
                        arguments: {},
                    },
                ],
            }
        }

        emptyValue() {
            return undefined
        }

        hookScratch() {
            if (typeof self.webpackChunkscratch_extensions == "undefined")
                self.webpackChunkscratch_extensions = new ExtensionLoader()
            if (typeof window.ScratchExtensions == "undefined") window.ScratchExtensions = sc.extensions
            if (typeof window.tempExt == "undefined") {
                let _tempExtValue
                Object.defineProperty(window, "tempExt", {
                    get() {
                        return _tempExtValue
                    },

                    set(newValue) {
                        if (typeof newValue != "undefined" && typeof newValue.Extension == "function") {
                            _tempExtValue = newValue
                            let target, info
                            try {
                                target = new newValue.Extension(sc.vm)
                                const proxiedTarget = self.webpackChunkscratch_extensions.createProxiedFunctions(target)
                                info = target.getInfo()
                                proxiedTarget.getInfo = () => {
                                    const blocks = info.blocks
                                    if (typeof blocks === "object" && blocks !== null) {
                                        for (const [key, block] of Object.entries(blocks)) {
                                            if (typeof block === "string" && block.startsWith("---") && block.length !== 3) {
                                                blocks[key] = {
                                                    blockType: sc.BlockType.LABEL,
                                                    text: block.substring(3),
                                                }
                                            }
                                        }
                                    }
                                    if (!/^[a-z0-9]+$/i.test(info.id)) {
                                        info.id = info.id.replace(/[^a-zA-Z0-9]/g, '');
                                    }
                                    return info
                                }
                                Scratch.extensions.register(proxiedTarget)
                                sc.vm.runtime[`ext_${info.id}`] = target
                            } catch (e) {
                                console.warn("[CCW Polyfill] First Method failed...", e)
                                try {
                                    const processed = self.webpackChunkscratch_extensions.convertBlocks(info.blocks)
                                    target._______ccw_polyfill__temp = () => "__ccw_polyfill"
                                    const proxiedTarget = self.webpackChunkscratch_extensions.createProxiedFunctions(target)
                                    proxiedTarget.getInfo = function () {
                                        const info = target.getInfo.call(this)
                                        const blocks = info.blocks
                                        if (typeof blocks === "object" && blocks !== null) {
                                            for (const [key, block] of Object.entries(blocks)) {
                                                if (typeof block === "string" && block.startsWith("---") && block.length !== 3) {
                                                    blocks[key] = {
                                                        blockType: sc.BlockType.LABEL,
                                                        text: block.substring(3),
                                                    }
                                                }
                                                /*if(typeof block === 'object' && block.type == 'button' && typeof block.onClick === 'function') {
                                                                            block.opcode = "ccw_polyfill_"
                                                                        }*/
                                            }
                                        }
                                        if (!/^[a-z0-9]+$/i.test(info.id)) {
                                            info.id = info.id.replace(/[^a-zA-Z0-9]/g, '');
                                        }
                                        return info
                                    }
                                    ScratchExtensions.register(info.name || info.id, { blocks: processed }, proxiedTarget)
                                    sc.vm.runtime[`ext_${info.id}`] = target
                                } catch (e) {
                                    console.warn("[CCW Polyfill] Failed to register extensions.", e)
                                }
                            }
                        } else {
                            return
                        }
                    },

                    enumerable: true,
                    configurable: true,
                })
            }

            this.setupVM()
        }

        setupVM() {
            this.vm.getFormatMessage = (fm) => {
                return (i) =>
                    typeof fm[sc.translate.language][i.id] == "undefined" ? i["default"] : fm[sc.translate.language][i.id]
            }
            this.vm.runtime.getFormatMessage = this.vm.getFormatMessage
            if (typeof this.vm.toJSON != "function") this.vm.toJSON = this.vmToJSON.convert.bind(this.vmToJSON, this.vm)
            if (typeof this.vm.saveProjectSb3 != "function")
                this.vm.saveProjectSb3 = this.vmToJSON.saveProjectSb3.bind(this.vmToJSON, this.vm)
            this.vm.ccwPolyfill = {
                convert: this.vmToJSON.convert.bind(this.vmToJSON, this.vm),
                save: this.vmToJSON.saveProjectSb3.bind(this.vmToJSON, this.vm),
            }
            this.vm.renderer.layerManager = {rootFolder: ""};
            this.vm.runtime.ccwAPI = {
                commentWithStageSnapshot() {
                    return new Promise((resolve, reject) => {
                        resolve(
                            showConfirm(
                                translate("ccwpolyfill.screenshotCommentMessage"),
                                translate("ccwpolyfill.noticeTitle"),
                                translate("ccwpolyfill.okMeow"),
                                translate("ccwpolyfill.meowQuestion"),
                                () => {
                                    alert(translate("ccwpolyfill.meowAlert"))
                                },
                            ),
                        )
                    })
                },
                getCoinCount() {
                    return new Promise((resolve, reject) => {
                        resolve(0)
                    })
                },
                getDeviceType() {
                    return new Promise((resolve, reject) => {
                        resolve("PC")
                    })
                },
                getExtensionURLById(id) {
                    return new Promise((resolve, reject) => {
                        resolve("")
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
                                bucks: 0,
                                name: "",
                                oid: "",
                                avatar: "",
                            },
                            rankingList: undefined,
                        })
                    })
                },
                getProjectSb3Id() {
                    return ""
                },
                getProjectStats() {
                    return new Promise((resolve, reject) => {
                        resolve({
                            commentCount: 0,
                            favoriteCount: 0,
                            likeCount: 0,
                            totalBucks: 0,
                        })
                    })
                },
                getProjectUUID() {
                    return ""
                },
                getUserInfo() {
                    return new Promise((resolve, reject) => {
                        resolve({
                            userId: "",
                            userName: "",
                            uuid: "",
                            oid: "",
                            avatar: "",
                            constellation: -1,
                            following: 0,
                            followers: 0,
                            liked: 0,
                            gender: -1,
                            pendant: "",
                            reputationScore: {
                                rank: "EXCELLENT",
                                score: 100,
                                studentOid: "",
                            },
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

                preActionInterceptor() { },

                redirect() { },

                requestCoins() { },

                requestFollow() { },

                sendPlayEventCode() { },

                setAvatar() { },

                showShare() { },

                uploadAssetToCloud(M, t) { },
            }
        }
    }
    const ccwpolyfill = new CCWPolyfill()
    sc.extensions.register(ccwpolyfill)
    ccwpolyfill.hookScratch()
})(window, typeof window.Scratch == "undefined" ? { vm: { runtime: {} } } : window.Scratch)
