import "reflect-metadata"
import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"
import type { CompilerConfig, ScratchProject, Sprite } from "../types/index.js"
import JSZip from "jszip"
import { parse } from "jsonc-parser"
import ts from "typescript"
import { startBlockRecording, stopBlockRecording } from "../runtime/blockRecorder.js"
import * as scratchBlocksModule from "../runtime/scratchBlocks.js"
import * as decoratorsModule from "../decorators/index.js"
import { getBlockMetadata } from "../decorators/index.js"

async function loadAndExecuteSprite(spritePath: string, indexJsonPath?: string, projectRoot?: string): Promise<Sprite> {
  // Read index.json for sprite metadata if it exists
  let spriteData: Sprite

  if (indexJsonPath && fs.existsSync(indexJsonPath)) {
    spriteData = JSON.parse(fs.readFileSync(indexJsonPath, "utf-8"))
  } else {
    // Create minimal sprite structure if index.json doesn't exist
    console.log(`[Info] index.json not found, creating minimal sprite structure`)
    spriteData = {
      isStage: false,
      name: path.basename(spritePath),
      variables: {},
      lists: {},
      broadcasts: {},
      blocks: {},
      comments: {},
      currentCostume: 0,
      costumes: [],
      sounds: [],
      volume: 100,
      layerOrder: 1,
      visible: true,
      x: 0,
      y: 0,
      size: 100,
      direction: 90,
      draggable: false,
      rotationStyle: "all around",
    }
  }

  // Read index.ts to execute decorated methods
  const indexTsPath = path.join(spritePath, "index.ts")
  if (!fs.existsSync(indexTsPath)) {
    console.warn(`[Warning] index.ts not found for sprite, using JSON data only`)
    return spriteData
  }

  // Compile TypeScript to JavaScript
  const tsCode = fs.readFileSync(indexTsPath, "utf-8")
  const jsCode = ts.transpileModule(tsCode, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ESNext,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      allowJs: true,
      skipLibCheck: true,
    },
  }).outputText

  // Execute the JavaScript to get the class
  const module = { exports: {} }

  const require = createRequire(indexTsPath)

  const originalRequire = require
  const customRequire = (id: string) => {
    // Handle scratchBlocks and decorators imports
    if (id.includes("scratchBlocks")) {
      return scratchBlocksModule
    }
    if (id.includes("decorators")) {
      return decoratorsModule
    }

    if (id.includes("@/extensions/")) {
      const extensionName = id.split("/").pop()

      if (projectRoot && extensionName) {
        // Try to load the extension wrapper from extensions folder
        const extensionWrapperPath = path.join(projectRoot, "extensions", `${extensionName}.ts`)

        if (fs.existsSync(extensionWrapperPath)) {
          try {
            // Read and transpile the extension wrapper
            const wrapperTsCode = fs.readFileSync(extensionWrapperPath, "utf-8")
            const wrapperJsCode = ts.transpileModule(wrapperTsCode, {
              compilerOptions: {
                module: ts.ModuleKind.CommonJS,
                target: ts.ScriptTarget.ESNext,
                allowJs: true,
                skipLibCheck: true,
              },
            }).outputText

            // Execute the wrapper code
            const wrapperModule = { exports: {} }
            const wrapperRequire = createRequire(extensionWrapperPath)

            // Create a custom require for the wrapper that can load blockRecorder
            const wrapperCustomRequire = (wrapperId: string) => {
              if (wrapperId.includes("blockRecorder")) {
                return require("../runtime/blockRecorder.js")
              }
              return wrapperRequire(wrapperId)
            }

            const wrapperFunc = new Function("module", "exports", "require", wrapperJsCode)
            wrapperFunc(wrapperModule, wrapperModule.exports, wrapperCustomRequire)

            return (wrapperModule.exports as any).default || wrapperModule.exports
          } catch (error) {
            console.warn(`[Warning] Failed to load extension wrapper ${extensionName}:`, error)
          }
        }
      }

      // Fallback: create a simple proxy if wrapper not found
      console.warn(`[Warning] Extension wrapper not found for ${extensionName}, using fallback proxy`)
      const { recordExtensionBlock } = require("../runtime/blockRecorder.js")
      return new Proxy(
        {},
        {
          get: (target, prop) => {
            return (...args: any[]) => {
              return recordExtensionBlock(extensionName || "extension", String(prop), args)
            }
          },
        },
      )
    }

    // Use the real require for everything else
    try {
      return originalRequire(id)
    } catch (error) {
      console.warn(`[Warning] Could not require module: ${id}`)
      return {}
    }
  }

  // Execute the code
  const func = new Function("module", "exports", "require", jsCode)
  func(module, module.exports, customRequire)

  const SpriteClass = (module.exports as any).default
  if (!SpriteClass) {
    console.warn(`[Warning] No default export found in ${indexTsPath}`)
    return spriteData
  }

  // Instantiate the class
  const spriteInstance = new SpriteClass()

  if (spriteInstance.name) {
    spriteData.name = spriteInstance.name
  }
  if (spriteInstance.isStage !== undefined) {
    spriteData.isStage = spriteInstance.isStage
  }
  if (spriteInstance.x !== undefined) {
    spriteData.x = spriteInstance.x
  }
  if (spriteInstance.y !== undefined) {
    spriteData.y = spriteInstance.y
  }
  if (spriteInstance.size !== undefined) {
    spriteData.size = spriteInstance.size
  }
  if (spriteInstance.direction !== undefined) {
    spriteData.direction = spriteInstance.direction
  }
  if (spriteInstance.visible !== undefined) {
    spriteData.visible = spriteInstance.visible
  }
  if (spriteInstance.draggable !== undefined) {
    spriteData.draggable = spriteInstance.draggable
  }
  if (spriteInstance.rotationStyle !== undefined) {
    spriteData.rotationStyle = spriteInstance.rotationStyle
  }
  if (spriteInstance.currentCostume !== undefined) {
    spriteData.currentCostume = spriteInstance.currentCostume
  }
  if (spriteInstance.volume !== undefined) {
    spriteData.volume = spriteInstance.volume
  }
  if (spriteInstance.layerOrder !== undefined) {
    spriteData.layerOrder = spriteInstance.layerOrder
  }
  if (spriteInstance.costumes && Array.isArray(spriteInstance.costumes)) {
    spriteData.costumes = spriteInstance.costumes
  }
  if (spriteInstance.sounds && Array.isArray(spriteInstance.sounds)) {
    spriteData.sounds = spriteInstance.sounds
  }

  const blockMetadata = getBlockMetadata(SpriteClass)

  // Execute each decorated method to record blocks
  const allBlocks: Record<string, any> = {}

  for (const [methodName, metadata] of blockMetadata.entries()) {
    console.log(`[Executing] ${spriteData.name}.${methodName}() [${metadata.opcode}]`)

    // Start recording blocks
    startBlockRecording(spriteData.variables || {}, spriteData.lists || {})

    try {
      // Execute the method
      const funct = spriteInstance[methodName]
      if (typeof funct == "function") {
        await funct.call(spriteInstance)
      }
    } catch (error) {
      console.error(`[Error] Failed to execute ${methodName}:`, error)
    }

    // Stop recording and collect blocks
    const blocks = stopBlockRecording()
    Object.assign(allBlocks, blocks)
  }

  // Merge recorded blocks with existing blocks
  spriteData.blocks = { ...spriteData.blocks, ...allBlocks }

  return spriteData
}

export async function createCompileTask(configPath?: string): Promise<void> {
  // Read scconfig.json (with comments support)
  const configFile = configPath || path.join(process.cwd(), "scconfig.json")

  if (!fs.existsSync(configFile)) {
    throw new Error(`Config file not found: ${configFile}`)
  }

  const configDir = path.dirname(path.resolve(configFile))

  const configContent = fs.readFileSync(configFile, "utf-8")
  const config: CompilerConfig = parse(configContent)

  const { compilerOptions } = config

  const rootDir = path.resolve(configDir, compilerOptions.rootDir)
  const outDir = path.resolve(configDir, compilerOptions.outDir)
  const { target } = compilerOptions

  console.log(`[Compile] Config directory: ${configDir}`)
  console.log(`[Compile] Reading from ${rootDir}`)
  console.log(`[Compile] Target: ${target}`)

  // Read root.json (Stage)
  const rootPath = path.join(rootDir, "root.json")
  if (!fs.existsSync(rootPath)) {
    throw new Error(`root.json not found in ${rootDir}`)
  }

  const stage: Sprite = JSON.parse(fs.readFileSync(rootPath, "utf-8"))
  if (!stage.blocks) {
    stage.blocks = {}
  }

  const srcDir = path.join(rootDir, "src")
  if (!fs.existsSync(srcDir)) {
    throw new Error(`src/ directory not found in ${rootDir}`)
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true })
  const spriteFolders = entries.filter((entry) => entry.isDirectory())

  const targets: Sprite[] = [stage]

  for (const folder of spriteFolders) {
    const spritePath = path.join(srcDir, folder.name)
    const indexJsonPath = path.join(spritePath, "index.json")
    const indexTsPath = path.join(spritePath, "index.ts")

    // Process sprite if either index.json or index.ts exists
    if (fs.existsSync(indexJsonPath) || fs.existsSync(indexTsPath)) {
      const spriteData = await loadAndExecuteSprite(
        spritePath,
        fs.existsSync(indexJsonPath) ? indexJsonPath : undefined,
        rootDir, // Pass project root for extension loading
      )
      targets.push(spriteData)
      console.log(`[Loaded] ${spriteData.name}`)
    } else {
      console.warn(`[Warning] Skipping ${folder.name}: neither index.json nor index.ts found`)
    }
  }

  // Create project.json
  const project: ScratchProject = {
    targets,
    monitors: [],
    extensions: [],
    extensionURLs: {},
    meta: {
      semver: "3.0.0",
      vm: "0.2.0",
      agent: "scratch-compiler",
      platform: {
        name: "scratch-compiler",
        url: "https://github.com/xbodwf/scratch-compiler",
      },
    },
  }

  // Create .sb3 file (zip)
  const zip = new JSZip()
  zip.file("project.json", JSON.stringify(project, null, 2))

  // Add assets (costumes and sounds)
  for (const target of targets) {
    // Add costumes
    for (const costume of target.costumes) {
      const assetPath = path.join(rootDir, "assets", costume.md5ext)
      if (fs.existsSync(assetPath)) {
        const assetData = fs.readFileSync(assetPath)
        zip.file(costume.md5ext, assetData)
      }
    }

    // Add sounds
    for (const sound of target.sounds) {
      const assetPath = path.join(rootDir, "assets", sound.md5ext)
      if (fs.existsSync(assetPath)) {
        const assetData = fs.readFileSync(assetPath)
        zip.file(sound.md5ext, assetData)
      }
    }
  }

  // Generate .sb3 file
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  const outputPath = path.join(outDir, "project.sb3")
  const content = await zip.generateAsync({ type: "nodebuffer" })
  fs.writeFileSync(outputPath, content)

  console.log(`[Compile] Complete! Output: ${outputPath}`)
}
