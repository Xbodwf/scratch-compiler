import JSZip from "jszip"

export interface ScratchExtensionInfo {
  id: string
  name: string
  color1?: string
  color2?: string
  color3?: string
  blocks: ScratchExtensionBlock[]
  menus?: Record<string, any>
}

export interface ScratchExtensionBlock {
  opcode: string
  blockType: string
  text: string
  arguments?: Record<string, any>
  disableMonitor?: boolean
}

// Scratch global object structure
export const ScratchGlobal = {
  ArgumentType: {
    ANGLE: "angle",
    BOOLEAN: "Boolean",
    COLOR: "color",
    COSTUME: "costume",
    IMAGE: "image",
    MATRIX: "matrix",
    NOTE: "note",
    NUMBER: "number",
    SOUND: "sound",
    STRING: "string",
  },
  BlockShape: {
    HEXAGONAL: 1,
    ROUND: 2,
    SQUARE: 3,
  },
  BlockType: {
    BOOLEAN: "Boolean",
    BUTTON: "button",
    COMMAND: "command",
    CONDITIONAL: "conditional",
    EVENT: "event",
    HAT: "hat",
    LABEL: "label",
    LOOP: "loop",
    REPORTER: "reporter",
    XML: "xml",
  },
  Cast: class Cast {
    static toNumber(value: any) {
      return Number(value)
    }
    static toString(value: any) {
      return String(value)
    }
    static toBoolean(value: any) {
      return Boolean(value)
    }
    static toMatrix(value: any) {
      return value
    }
    static toNote(value: any) {
      return value
    }
    static toCostume(value: any) {
      return value
    }
    static toSound(value: any) {
      return value
    }
    static toImage(value: any) {
      return value
    }
    static toAngle(value: any) {
      return value
    }
  },
  TargetType: {
    SPRITE: "sprite",
    STAGE: "stage",
  },
  canEmbed: () => Promise.resolve(true),
  canFetch: () => Promise.resolve(true),
  canGeolocate: () => Promise.resolve(true),
  canNotify: () => Promise.resolve(true),
  canOpenWindow: () => Promise.resolve(true),
  canReadClipboard: () => Promise.resolve(true),
  canRecordAudio: () => Promise.resolve(true),
  canRecordVideo: () => Promise.resolve(true),
  canRedirect: () => Promise.resolve(true),
  extensions: {
    register: (extension: any) => {
      return extension
    },
    unsandboxed: true,
  },
  fetch: (url: string, options?: any) => Promise.resolve({} as any),
  openWindow: (url: string) => Promise.resolve(),
  redirect: (url: string) => Promise.resolve(),
  translate: Object.assign(
    (id: string) => {
      return id
    },
    {
      setup: (translations: Record<string, string>) => {
        return translations
      },
    },
  ),
  vm: {
    blockListener: () => {},
    deleteSprite: (spriteId: string) => {},
    dupclicateSprite: (spriteId: string) => {},
    editingTarget: () => {},
    exports: {
      JSZip,
      RendererTarget: null,
      Sprite: null,
      Variable: null,
      i_will_not_ask_for_help_when_these_break: null,
    },
    extensionManager: {
      asyncExtensionsLoadedCallbacks: (url: string) => Promise.resolve(),
      builtinExtensions: {
        boost: () => {},
        ev3: () => {},
        gdxfor: () => {},
        makeymakey: () => {},
        microbit: () => {},
        music: () => {},
        pen: () => {},
        speech: () => {},
        text2speech: () => {},
        translate: () => {},
        videoSensing: () => {},
        wedo2: () => {},
        tw: () => {},
        coreExample: () => {},
      },
      loadingAsyncExtensions: 0,
      nextExtensionWorker: null,
      pendingExtensions: [],
      pendingWorkers: [],
      securityManager: {
        canLoadUnsafeExtensions: () => true,
        canEmbed: () => Promise.resolve(true),
        canFetch: () => Promise.resolve(true),
        canGeolocate: () => Promise.resolve(true),
        canNotify: () => Promise.resolve(true),
        canOpenWindow: () => Promise.resolve(true),
        canReadClipboard: () => Promise.resolve(true),
        canRecordAudio: () => Promise.resolve(true),
        canRecordVideo: () => Promise.resolve(true),
        canRedirect: () => Promise.resolve(true),
        getSandboxMode: () => "unsandboxed",
        canLoadExtensionFromProject: (url: string) => true,
      },
      isExtensionLoaded: (id: string) => true,
      loadExtensionIdSync: (id: string) => {},
    },
    flyoutBlockListener: () => {},
    initialized: true,
    installTargets: () => {},
    monitorBlockListener: () => {},
    runtime: {
      addCloudVariable: (varName: string) => {},
      addonBlocks: {
        breakpoint: {
          namesIdsDefaults: Array(0),
          procedureCode: "​​breakpoint​​",
          arguments: Array(0),
          displayName: "断点",
          callback: () => {},
        },
        error: {
          namesIdsDefaults: Array(0),
          procedureCode: "​​error​​ %s",
          arguments: Array(1),
          displayName: "错误 %s",
          callback: () => {},
        },
        log: {
          namesIdsDefaults: Array(0),
          procedureCode: "​​error​​ %s",
          arguments: Array(1),
          displayName: "错误 %s",
          callback: () => {},
        },
        warn: {
          namesIdsDefaults: Array(0),
          procedureCode: "​​error​​ %s",
          arguments: Array(1),
          displayName: "错误 %s",
          callback: () => {},
        },
      },
      ext_pen: {
        namesIdsDefaults: Array(0),
        procedureCode: "​​pen​​",
        arguments: Array(0),
        displayName: "笔",
        callback: () => {},
        _getPenLayerID: () => {},
      },
      audioEngine: {},
      on: (event: string, callback: () => void) => {},
      off: (event: string, callback: () => void) => {},
      frameLoop: {
        framerate: 0,
      },
      compilerOptions: { enabled: true, warpTimer: true },
      canAddCloudVariable: () => true,
      cloudOptions: { limit: Number.POSITIVE_INFINITY },
      currentMSecs: 1760243220762,
      currentStepTime: 33.333333333333336,
      debug: false,
      enforcePrivacy: true,
      executableTargets: [],
      extensionStorage: {},
      getBlocksXML: () => '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>',
      getNumberOfCloudVariables: () => 0,
      finishedAssetRequests: 0,
      renderer: {
        exports: {
          twgl: {
            createFramebufferInfo: () => {},
            resizeFramebufferInfo: () => {},
            createProgramInfo: () => {},
            createBufferInfoFromArrays: () => {},
            setBuffersAndAttributes: () => {},
            bindFramebufferInfo: () => {},
            setFramebufferInfo: () => {},
            resizeFramebuffer: () => {},
            bindFramebuffer: () => {},
            createTexture: () => {},
            resizeTexture: () => {},
            setTexture: () => {},
            bindTexture: () => {},
            setTextureParameters: () => {},
            createVAO: () => {},
            SVGRenderer: {
              BitmapAdapter: () => {},
              convertFonts: () => {},
              inlineSvgFonts: () => {},
              loadSvgString: () => {},
              sanitizeSvg: { sanitizeByteStream: () => {}, sanitizeSvgText: () => {} },
              serializeSvgToString: () => {},
              SvgElement: () => {},
              SVGRenderer: () => {},
              fixForVanilla: () => {},
              DOMPurify: () => {},
            },
            Drawable: () => {},
            Skin: () => {},
            BitmapSkin: () => {},
            TextBubbleSkin: () => {},
            PenSkin: () => {},
            SVGSkin: () => {},
            CanvasMeasurementProvider: () => {},
            Rectangle: () => {},
          },
          Renderer: null,
          RendererTarget: null,
          Sprite: null,
          Variable: null,
          i_will_not_ask_for_help_when_these_break: null,
        },
        canvas: { addEventListener: () => {} },
        _gl: {
          NEAREST: null,
          RGBA: null,
          UNSIGNED_BYTE: null,
          TEXTURE_2D: null,
          TEXTURE_WRAP_S: null,
          TEXTURE_WRAP_T: null,
          TEXTURE_MIN_FILTER: null,
          TEXTURE_MAG_FILTER: null,
          CLAMP_TO_EDGE: null,
          LINEAR: null,
          RGBA32F: null,
          DEPTH_STENCIL: null,
          FRAMEBUFFER_BINDING: null,
          DEPTH_TEST: null,
          LEQUAL: null,
          enable: () => {},
          disable: () => {},
          depthFunc: () => {},
          getParameter: () => {},
          bindFramebuffer: () => {},
          createShader: () => {},
        },
        useHighQualityRender: true,
        _nativeSize: [0, 0],
      },
    },
    on: (event: string, callback: () => void) => {},
    off: (event: string, callback: () => void) => {},
  },
  securityManager: {
    canLoadUnsafeExtensions: () => true,
    canEmbed: () => Promise.resolve(true),
    canFetch: () => Promise.resolve(true),
    canGeolocate: () => Promise.resolve(true),
    canNotify: () => Promise.resolve(true),
    canOpenWindow: () => Promise.resolve(true),
    canReadClipboard: () => Promise.resolve(true),
    canRecordAudio: () => Promise.resolve(true),
    canRecordVideo: () => Promise.resolve(true),
    canRedirect: () => Promise.resolve(true),
    getSandboxMode: () => "unsandboxed",
    canLoadExtensionFromProject: (url: string) => true,
  },
  shareSoundToTarget: () => {},
  variableListener: () => {},
  _events: {
    NEW_PROJECT: [],
    PROJECT_LOADED: [],
    PROJECT_START: [],
    PROJECT_STOP_ALL: [],
    RUNTIME_STARTED: [],
    RUNTIME_STOPPED: [],
    TARGETS_UPDATE: [],
    BLOCK_DRAG_UPDATE: [],
    BLOCK_DRAG_END: [],
    BLOCK_DRAG_START: [],
    MONITORS_UPDATE: [],
    MONITORS_UPDATE_LIST: [],
    EXTENSION_ADDED: [],
  },
  _eventsCount: 0,
  _maxListeners: undefined,
  addEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {},
}

export const ScratchExtensions = {
  register: ScratchGlobal.extensions.register,
}

/**
 * Load and analyze a Scratch extension
 */
export async function loadExtension(extensionCode: string): Promise<ScratchExtensionInfo | null> {
  try {
    const sandbox = {
      Scratch: ScratchGlobal,
      ScratchExtensions: ScratchExtensions,
      console: console,
      window: globalThis,
    }
    ;(globalThis as any).addEventListener = ScratchGlobal.addEventListener as any

    let extensionInstance: any = null

    const originalRegister = ScratchGlobal.extensions.register
    ScratchGlobal.extensions.register = (extension: any) => {
      extensionInstance = extension
      return extension
    }

    const func = new Function(...Object.keys(sandbox), extensionCode)
    func(...Object.values(sandbox))

    ScratchGlobal.extensions.register = originalRegister

    if (extensionInstance && typeof extensionInstance.getInfo === "function") {
      const info = extensionInstance.getInfo()
      return info
    }

    return null
  } catch (error) {
    console.error("Failed to load extension:", error)
    return null
  }
}

/**
 * Map Scratch argument type to TypeScript type
 */
function mapScratchTypeToTS(scratchType: string): string {
  const typeMap: Record<string, string> = {
    number: "number",
    string: "string",
    Boolean: "boolean",
    angle: "number",
    color: "string",
    costume: "string",
    sound: "string",
  }
  return typeMap[scratchType] || "any"
}

/**
 * Map block type to return type
 */
function mapBlockTypeToReturnType(blockType: string): string {
  const typeMap: Record<string, string> = {
    command: "void",
    reporter: "any",
    Boolean: "boolean",
    hat: "void",
    loop: "void",
    conditional: "void",
  }
  return typeMap[blockType] || "void"
}

/**
 * Generate TypeScript wrapper module for an extension
 * Uses the same recordBlock mechanism as built-in blocks
 */
export function generateExtensionWrapper(info: ScratchExtensionInfo, extensionId: string): string {
  const lines: string[] = []

  lines.push(`// Auto-generated TypeScript wrapper for ${info.name} extension`)
  lines.push(`// Extension ID: ${info.id}`)
  lines.push(`// Generated by scratch-compiler`)
  lines.push(``)
  lines.push(`import { recordBlock, getCurrentBlockContext } from "scratch-compiler/dist/src/runtime/blockRecorder.js"`)
  lines.push(``)
  lines.push(`/**`)
  lines.push(` * ${info.name} Extension`)
  lines.push(` * Extension ID: ${info.id}`)
  lines.push(` */`)
  lines.push(`const ${info.id} = {`)

  // Generate wrapper functions for each block
  for (const block of info.blocks) {
    const args: string[] = []
    const argNames: string[] = []

    if (block.arguments) {
      for (const [argName, argDef] of Object.entries(block.arguments)) {
        const argType = (argDef as any).type || "any"
        const tsType = mapScratchTypeToTS(argType)
        args.push(`${argName}: ${tsType} | any`)
        argNames.push(argName)
      }
    }

    const returnType = mapBlockTypeToReturnType(block.blockType)
    const argsStr = args.length > 0 ? args.join(", ") : ""

    lines.push(`  /**`)
    lines.push(`   * ${block.text}`)
    lines.push(`   * Block type: ${block.blockType}`)
    lines.push(`   */`)
    lines.push(`  ${block.opcode}(${argsStr}): ${returnType} {`)

    // Use recordBlock like built-in blocks
    if (argNames.length > 0) {
      const inputsObj = argNames
        .map((name, idx) => `    INPUT${idx}: [1, ${name}]`)
        .join(",\n")

      lines.push(`    const inputs: Record<string, any> = {`)
      lines.push(`${inputsObj}`)
      lines.push(`    }`)
      lines.push(`    return recordBlock("${info.id}", "${block.opcode}", inputs, {}) as ${returnType}`)
    } else {
      lines.push(`    return recordBlock("${info.id}", "${block.opcode}", {}, {}) as ${returnType}`)
    }

    lines.push(`  },`)
    lines.push(``)
  }

  // Generate menu helpers if they exist
  if (info.menus) {
    for (const [menuName, menuDef] of Object.entries(info.menus)) {
      const items = Array.isArray(menuDef)
        ? menuDef
        : (menuDef as any).items || []

      lines.push(`  /**`)
      lines.push(`   * Menu: ${menuName}`)
      lines.push(`   */`)
      lines.push(`  menu_${menuName}: {`)
      if (Array.isArray(items)) {
        items.forEach((item: any) => {
          if (typeof item === "string") {
            lines.push(`    "${item}": "${item}",`)
          } else if (item && item.value) {
            lines.push(`    "${item.value}": "${item.text || item.value}",`)
          }
        })
      }
      lines.push(`  } as const,`)
      lines.push(``)
    }
  }

  lines.push(`}`)
  lines.push(``)
  lines.push(`export default ${info.id}`)

  return lines.join("\n")
}

/**
 * Process extensions from project.json
 * Generates TypeScript wrappers instead of .d.ts files
 */
export async function processExtensions(
  extensions: Record<string, string>,
  outputDir: string,
): Promise<Map<string, ScratchExtensionInfo>> {
  const fs = await import("fs/promises")
  const path = await import("path")

  const sourcesDir = path.join(outputDir, "sources")
  const extensionsDir = path.join(outputDir, "extensions")

  await fs.mkdir(sourcesDir, { recursive: true })
  await fs.mkdir(extensionsDir, { recursive: true })

  const extensionMap = new Map<string, ScratchExtensionInfo>()
  const extensionsInstance = extensions || {}

  for (const [extensionId, extensionUrl] of Object.entries(extensionsInstance)) {
    try {
      let extensionCode: string

      // Check if it's a data URL
      if (extensionUrl.startsWith("data:")) {
        const base64Data = extensionUrl.split(",")[1]
        extensionCode = Buffer.from(base64Data, "base64").toString("utf-8")

        const filename = `${extensionId}.js`
        await fs.writeFile(path.join(sourcesDir, filename), extensionCode)
      } else {
        // Fetch from URL
        const response = await fetch(extensionUrl)
        extensionCode = await response.text()

        const filename = `${extensionId}.js`
        await fs.writeFile(path.join(sourcesDir, filename), extensionCode)
      }

      // Load and analyze the extension
      const info = await loadExtension(extensionCode)

      if (info) {
        extensionMap.set(extensionId, info)

        // Generate TypeScript wrapper (not .d.ts)
        const wrapper = generateExtensionWrapper(info, extensionId)
        await fs.writeFile(path.join(extensionsDir, `${extensionId}.ts`), wrapper)

        console.log(`[Extension] Generated ${extensionId}.ts`)
      }
    } catch (error) {
      console.error(`Failed to process extension ${extensionId}:`, error)
    }
  }

  return extensionMap
}

/**
 * Generate import statements for extensions used by a sprite
 */
export function generateExtensionImports(
  blocks: Record<string, any>,
  extensionMap: Map<string, ScratchExtensionInfo>,
): string[] {
  const usedExtensions = new Set<string>()

  // Scan blocks to find which extensions are used
  const builtInNamespaces = [
    "motion",
    "looks",
    "sound",
    "event",
    "control",
    "sensing",
    "operator",
    "data",
    "pen",
    "music",
    "procedures",
    "argument",
  ]

  for (const block of Object.values(blocks)) {
    if (block && typeof block === "object" && block.opcode) {
      const opcode = block.opcode as string
      const namespace = opcode.split("_")[0]

      if (!builtInNamespaces.includes(namespace)) {
        usedExtensions.add(namespace)
      }
    }
  }

  // Generate import statements
  const imports: string[] = []
  for (const extId of usedExtensions) {
    if (extensionMap.has(extId)) {
      imports.push(`import ${extId} from "@/extensions/${extId}"`)
    }
  }

  return imports
}