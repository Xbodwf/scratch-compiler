(function (window, Scratch) {
    // Base64编码的核心代码，解码后为 "console.log(1)"
    const ccwBase64 = 'Y29uc29sZS5sb2coMSk=';
    // 解码Base64内容为字符串
    const ccwCode = atob(ccwBase64);

    // 构建要执行的脚本内容，包裹在Scratch上下文环境中
    const scriptContent = `var Scratch = document.getElementById('02ccwconverter').scratchInstance;
    (function (window) {
        ${ccwCode}
    })(document.getElementById('02ccwconverter').windowInstance)`;

    // 创建Blob URL用于加载脚本
    const blob = new Blob([scriptContent], { type: 'text/javascript' });
    const scriptUrl = URL.createObjectURL(blob);

    // 创建window代理，处理Scratch环境的变量映射
    const windowProxy = new Proxy(window, {
        get(target, prop) {
            // 暴露Scratch对象
            if (prop === 'Scratch') return Scratch;
            const value = Reflect.get(target, prop);
            // 代理函数调用，修正this指向
            if (typeof value === 'function') {
                return new Proxy(value, {
                    apply(func, thisArg, args) {
                        return Reflect.apply(func, thisArg === windowProxy ? window : thisArg, args);
                    }
                });
            }
            return value;
        },
        set(target, prop, value) {
            // 处理扩展注册逻辑
            if (prop === 'extensions') {
                if (typeof value === 'object' && value !== null && typeof value.Extension === 'function') {
                    // 代理runtime，处理消息翻译
                    const runtimeProxy = new Proxy(Scratch.vm.runtime, {
                        get(target, prop) {
                            if (prop === 'getFormatMessage') {
                                return (...args) => {
                                    Scratch.translate.call(Scratch, ...args);
                                    return Scratch.getFormatMessage;
                                };
                            }
                            return Reflect.get(target, prop);
                        },
                        has(target, prop) {
                            if (prop === 'getFormatMessage') return true;
                            return Reflect.has(target, prop);
                        }
                    });

                    // 处理扩展信息，修正标签类型
                    const extInfo = Reflect.construct(value.Extension, [runtimeProxy]);
                    const originalGetInfo = extInfo.getInfo;
                    extInfo.getInfo = function () {
                        const info = originalGetInfo.call(this);
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
                    // 注册扩展
                    Scratch.extensions.register(extInfo);
                }
                return true;
            }
            return Reflect.set(target, prop, value);
        },
        has(target, prop) {
            if (prop === 'Scratch') return true;
            if (prop === 'tempExt') return false;
            return Reflect.has(target, prop);
        }
    });

    // 创建并加载脚本
    const script = document.createElement('script');
    const removeScript = () => script.remove();

    script.src = scriptUrl;
    script.scratchInstance = Scratch;
    script.windowInstance = windowProxy;
    script.code = ccwCode;
    script.type = 'text/javascript';
    script.id = '02ccwconverter';
    script.addEventListener('load', removeScript);
    script.addEventListener('error', removeScript);
    document.head.appendChild(script);
})(window, Scratch);