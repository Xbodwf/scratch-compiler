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
  // Placeholder methods that return promises
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
      // Extension registration handler
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
    blockListener: () => {
      // Placeholder for block listener
    },
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

// Also provide ScratchExtensions alias
export const ScratchExtensions = {
  register: ScratchGlobal.extensions.register,
}

/**
 * Load and analyze a Scratch extension
 * @param extensionCode - The extension JavaScript code
 * @returns Extension info from getInfo()
 */
export async function loadExtension(extensionCode: string): Promise<ScratchExtensionInfo | null> {
  try {
    // Create a sandbox environment
    const sandbox = {
      Scratch: ScratchGlobal,
      ScratchExtensions: ScratchExtensions,
      console: console,
      window: globalThis,
    }
    globalThis.addEventListener = ScratchGlobal.addEventListener as any

    let extensionInstance: any = null

    // Override register to capture the extension instance
    const originalRegister = ScratchGlobal.extensions.register
    ScratchGlobal.extensions.register = (extension: any) => {
      extensionInstance = extension
      return extension
    }

    // Execute the extension code in the sandbox
    const func = new Function(...Object.keys(sandbox), extensionCode)
    func(...Object.values(sandbox))

    // Restore original register
    ScratchGlobal.extensions.register = originalRegister

    // Get extension info
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
 * Generate TypeScript definition file for an extension
 * @param info - Extension info from getInfo()
 * @returns TypeScript definition code
 */
export function generateExtensionDTS(info: ScratchExtensionInfo): string {
  const lines: string[] = []

  lines.push(`// Auto-generated TypeScript definitions for ${info.name} extension`)
  lines.push(`// Extension ID: ${info.id}`)
  lines.push(``)
  lines.push(`declare namespace ${info.id} {`)

  // Generate function declarations for each block
  for (const block of info.blocks) {
    const args: string[] = []

    if (block.arguments) {
      for (const [argName, argDef] of Object.entries(block.arguments)) {
        const argType = (argDef as any).type || "any"
        const tsType = mapScratchTypeToTS(argType)
        args.push(`${argName}: ${tsType}`)
      }
    }

    const returnType = mapBlockTypeToReturnType(block.blockType)
    const argsStr = args.length > 0 ? args.join(", ") : ""

    lines.push(`  /**`)
    lines.push(`   * ${block.text}`)
    lines.push(`   */`)
    lines.push(`  function ${block.opcode}(${argsStr}): ${returnType}`)
    lines.push(``)
  }

  lines.push(`}`)
  lines.push(``)
  lines.push(`export default ${info.id}`)

  return lines.join("\n")
}

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

function mapBlockTypeToReturnType(blockType: string): string {
  const typeMap: Record<string, string> = {
    command: "void",
    reporter: "any",
    Boolean: "boolean",
    hat: "void",
  }
  return typeMap[blockType] || "void"
}

/**
 * Generate TypeScript wrapper module for an extension
 * @param info - Extension info from getInfo()
 * @param extensionId - Extension ID
 * @returns TypeScript wrapper code
 */
export function generateExtensionWrapper(info: ScratchExtensionInfo, extensionId: string): string {
  const lines: string[] = []

  lines.push(`// Auto-generated TypeScript wrapper for ${info.name} extension`)
  lines.push(`// Extension ID: ${info.id}`)
  lines.push(`import { recordExtensionBlock } from "../runtime/blockRecorder.js"`)
  lines.push(``)
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
    lines.push(`   */`)
    lines.push(`  ${block.opcode}(${argsStr}): ${returnType} {`)

    if (argNames.length > 0) {
      const argsArray = argNames.join(", ")
      lines.push(`    return recordExtensionBlock("${info.id}", "${block.opcode}", [${argsArray}]) as ${returnType}`)
    } else {
      lines.push(`    return recordExtensionBlock("${info.id}", "${block.opcode}", []) as ${returnType}`)
    }

    lines.push(`  },`)
    lines.push(``)
  }

  // Generate menu functions if they exist
  if (info.menus) {
    for (const [menuName, menuDef] of Object.entries(info.menus)) {
      lines.push(`  /**`)
      lines.push(`   * Menu: ${menuName}`)
      lines.push(`   */`)
      lines.push(`  menu_${menuName}(value: string | any): string | any {`)
      lines.push(`    return value`)
      lines.push(`  },`)
      lines.push(``)
    }
  }

  lines.push(`}`)
  lines.push(``)
  lines.push(`export default ${info.id}`)

  return lines.join("\n")
}

/**
 * Process extensions from project.json and save them to sources and extensions directories
 * @param extensions - Extensions object from project.json
 * @param outputDir - Output directory for extensions
 * @returns Map of extension ID to extension info
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
  let extensionsInstance = extensions || {};
  for (const [extensionId, extensionUrl] of Object.entries(extensionsInstance)) {
    try {
      let extensionCode: string

      // Check if it's a data URL
      if (extensionUrl.startsWith("data:")) {
        // Extract code from data URL
        const base64Data = extensionUrl.split(",")[1]
        extensionCode = Buffer.from(base64Data, "base64").toString("utf-8")

        const filename = `${extensionId}.js`
        await fs.writeFile(path.join(sourcesDir, filename), extensionCode)
      } else {
        // It's a URL, fetch it
        const response = await fetch(extensionUrl)
        extensionCode = await response.text()

        const filename = `${extensionId}.js`
        await fs.writeFile(path.join(sourcesDir, filename), extensionCode)
      }

      // Load and analyze the extension
      const info = await loadExtension(extensionCode)

      if (info) {
        extensionMap.set(extensionId, info)

        const wrapper = generateExtensionWrapper(info, extensionId)
        await fs.writeFile(path.join(extensionsDir, `${extensionId}.ts`), wrapper)

        // Also generate .d.ts for type checking
        const dts = generateExtensionDTS(info)
        await fs.writeFile(path.join(extensionsDir, `${extensionId}.d.ts`), dts)
      }
    } catch (error) {
      console.error(`Failed to process extension ${extensionId}:`, error)
    }
  }

  return extensionMap
}

/**
 * Generate import statements for extensions used by a sprite
 * @param blocks - Sprite's blocks
 * @param extensionMap - Map of extension ID to extension info
 * @returns Array of import statements
 */
export function generateExtensionImports(
  blocks: Record<string, any>,
  extensionMap: Map<string, ScratchExtensionInfo>,
): string[] {
  const usedExtensions = new Set<string>()

  // Scan blocks to find which extensions are used
  for (const block of Object.values(blocks)) {
    if (block && typeof block === "object" && block.opcode) {
      const opcode = block.opcode as string

      // Check if opcode belongs to an extension (not a built-in namespace)
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
      ]

      const namespace = opcode.split("_")[0]
      if (!builtInNamespaces.includes(namespace)) {
        // This is an extension block
        usedExtensions.add(namespace)
      }
    }
  }

  // Generate import statements
  const imports: string[] = []
  for (const extId of usedExtensions) {
    if (extensionMap.has(extId)) {
      // NOTE: Sprite files are at src/<sprite>/index.ts, extensions live at <out>/extensions
      // We need to traverse two levels up to reach the extensions dir.
      imports.push(`/// <reference path="@/extensions/${extId}.d.ts" />`)
    }
  }

  return imports
}
