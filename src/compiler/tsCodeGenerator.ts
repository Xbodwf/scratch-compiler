import type { Sprite, Block, BlockMap } from "../types/index.js"
import { OPCODE_MAP, OPCODE_TO_METHOD_MAP, SCRATCH_OPCODES, type OpcodeDefinition, type OpcodeArg } from "../opcodes/definitions.js"

// Interface for custom procedure information
interface CustomProcedure {
  proccode: string
  argumentIds: string[]
  argumentNames: string[]
  argumentDefaults: string[]
  warp: boolean
  definitionBlockId: string
}

/**
 * TSCodeGenerator - Generates TypeScript code from Scratch sprite data
 * Based on src/opcodes/definitions.ts for opcode mapping
 */
export class TSCodeGenerator {
  // Track used variable names to ensure uniqueness within a sprite
  private usedVarNames: Map<string, number> = new Map()
  // Store custom procedures for this sprite
  private customProcedures: Map<string, CustomProcedure> = new Map()
  // Map from definition block ID to method name
  private procedureMethodNames: Map<string, string> = new Map()

  generateSpriteClass(sprite: Sprite, extensionMap?: Map<string, any>): string {
    // Reset state for each sprite
    this.usedVarNames = new Map()
    this.customProcedures = new Map()
    this.procedureMethodNames = new Map()
    
    // First pass: collect all custom procedures
    if (sprite.blocks) {
      this.collectCustomProcedures(sprite.blocks)
    }
    
    const className = this.sanitizeClassName(sprite.name)
    const classBody: string[] = []

    // Generate class properties
    classBody.push(this.generateProperties(sprite))

    // Generate constructor
    classBody.push(this.generateConstructor(sprite))

    // Generate variables with decorators
    if (sprite.variables && Object.keys(sprite.variables).length > 0) {
      classBody.push(this.generateVariables(sprite.variables, sprite.isStage))
    }

    // Generate lists with decorators
    if (sprite.lists && Object.keys(sprite.lists).length > 0) {
      classBody.push(this.generateLists(sprite.lists, sprite.isStage))
    }

    // Generate block methods with decorators
    if (sprite.blocks && Object.keys(sprite.blocks).length > 0) {
      classBody.push(this.generateBlockMethods(sprite.blocks))
    }

    let extensionImports = ""
    if (extensionMap && sprite.blocks) {
      const usedExtensions = this.getUsedExtensions(sprite.blocks, extensionMap)
      if (usedExtensions.length > 0) {
        extensionImports =
          usedExtensions
            .map((extId) => {
              const extName = this.sanitizeExtensionName(extId)
              return `import ${extName} from "@/extensions/${extId}"`
            })
            .join("\n") + "\n\n"
      }
    }

    const imports = `${extensionImports}
import { 
  motion,
  control,
  data,
  argument,
  procedures,
  pen,
  music,
  looks,
  sound,
  event,
  operator,
  sensing 
} from 'scratch-compiler/dist/src/runtime/scratchBlocks'
   
import { varExport, listExport, blockExport } from "scratch-compiler/dist/src/decorators"\n\n`

    const classCode = `export default class ${className} {
${classBody.join("\n\n")}
}`

    return imports + classCode
  }

  private getUsedExtensions(blocks: BlockMap, extensionMap: Map<string, any>): string[] {
    const extensions = new Set<string>()

    Object.values(blocks).forEach((block) => {
      if (block.opcode) {
        const namespace = block.opcode.split("_")[0]
        if (extensionMap.has(namespace)) {
          extensions.add(namespace)
        }
      }
    })

    return Array.from(extensions)
  }

  /**
   * Sanitize class name - replace special chars with underscore
   */
  private sanitizeClassName(name: string): string {
    let className = name.replace(/[^a-zA-Z0-9_]/g, "_")
    if (/^\d/.test(className)) {
      className = "_" + className
    }
    return className || "Sprite"
  }

  /**
   * Sanitize variable/list name for valid TypeScript identifier
   * Rules:
   * 1. If first character is not ASCII letter/underscore, add underscore prefix
   * 2. Unicode characters (like Chinese) are preserved
   * 3. Special characters (spaces, punctuation, etc.) are replaced with underscore
   * 4. Ensure uniqueness by adding numeric suffix if needed
   * e.g., "变量名" -> "_变量名", "123" -> "_123", "my-var" -> "my_var", "摄像机 x" -> "_摄像机_x"
   */
  private sanitizeVarName(name: string): string {
    let result = ""

    for (let i = 0; i < name.length; i++) {
      const char = name[i]
      const code = char.charCodeAt(0)
      const isAsciiLetter = (char >= "a" && char <= "z") || (char >= "A" && char <= "Z")
      const isDigit = char >= "0" && char <= "9"
      const isUnderscore = char === "_"
      // Unicode letter characters (including Chinese, Japanese, etc.)
      // TypeScript allows Unicode identifiers
      const isUnicodeLetter = code > 127 && /\p{L}/u.test(char)

      if (i === 0) {
        // First character: must be letter or underscore
        if (isAsciiLetter || isUnderscore) {
          result += char
        } else if (isUnicodeLetter || isDigit) {
          // Unicode letter or digit at start - add underscore prefix
          result = "_" + char
        } else {
          // Other special char - replace with underscore and add prefix
          result = "__"
        }
      } else {
        // Subsequent characters: can be letter, digit, underscore, or Unicode letter
        if (isAsciiLetter || isDigit || isUnderscore || isUnicodeLetter) {
          result += char
        } else {
          // Replace special char with underscore
          result += "_"
        }
      }
    }

    // Ensure non-empty
    if (!result) {
      result = "_variable"
    }

    // Ensure uniqueness - track used names
    const key = result
    if (!this.usedVarNames.has(key)) {
      this.usedVarNames.set(key, 1)
      return result
    }

    // Add numeric suffix for duplicates
    const count = this.usedVarNames.get(key)! + 1
    this.usedVarNames.set(key, count)
    return `${result}_${count}`
  }

  /**
   * Collect all custom procedures from blocks
   */
  private collectCustomProcedures(blocks: BlockMap): void {
    for (const [blockId, block] of Object.entries(blocks)) {
      if (block.opcode === "procedures_definition") {
        // Get the prototype block
        const customBlockInput = block.inputs?.custom_block
        if (customBlockInput && Array.isArray(customBlockInput) && customBlockInput.length > 1) {
          const prototypeId = customBlockInput[1]
          const prototypeBlock = blocks[prototypeId]
          
          if (prototypeBlock && prototypeBlock.opcode === "procedures_prototype") {
            const mutation = prototypeBlock.mutation as any
            if (mutation) {
              const procCode = mutation.proccode || ""
              const argumentIds = JSON.parse(mutation.argumentids || "[]")
              const argumentNames = JSON.parse(mutation.argumentnames || "[]")
              const argumentDefaults = JSON.parse(mutation.argumentdefaults || "[]")
              const warp = mutation.warp === "true"
              
              // Sanitize proccode to create method name
              const methodName = this.sanitizeProcCode(procCode)
              
              const proc: CustomProcedure = {
                proccode: procCode,
                argumentIds,
                argumentNames,
                argumentDefaults,
                warp,
                definitionBlockId: blockId,
              }
              
              this.customProcedures.set(procCode, proc)
              this.procedureMethodNames.set(blockId, methodName)
            }
          }
        }
      }
    }
  }

  /**
   * Sanitize proccode to create valid method name
   */
  private sanitizeProcCode(proccode: string): string {
    // Remove %s, %n, %b placeholders and sanitize
    let name = proccode
      .replace(/%s|%n|%b/g, "")
      .replace(/[^a-zA-Z0-9_\u4e00-\u9fff]/g, "_")
      .trim()
    
    // Add prefix if starts with digit
    if (/^\d/.test(name)) {
      name = "_" + name
    }
    
    // Add underscore prefix for Chinese characters
    if (name.length > 0 && /[\u4e00-\u9fff]/.test(name[0])) {
      name = "_" + name
    }
    
    return name || "customProcedure"
  }

  /**
   * Sanitize extension name for import
   */
  private sanitizeExtensionName(name: string): string {
    return name.replace(/[^a-zA-Z0-9_]/g, "_")
  }

  private generateProperties(sprite: Sprite): string {
    const props: string[] = []

    props.push(`  // Sprite properties`)
    props.push(`  name: string = "${this.escapeString(sprite.name)}"`)
    props.push(`  isStage: boolean = ${sprite.isStage}`)

    if (!sprite.isStage) {
      props.push(`  x: number = ${sprite.x ?? 0}`)
      props.push(`  y: number = ${sprite.y ?? 0}`)
      props.push(`  size: number = ${sprite.size ?? 100}`)
      props.push(`  direction: number = ${sprite.direction ?? 90}`)
      props.push(`  visible: boolean = ${sprite.visible ?? true}`)
      props.push(`  draggable: boolean = ${sprite.draggable ?? false}`)
      props.push(`  rotationStyle: string = "${sprite.rotationStyle ?? "all around"}"`)
    }

    props.push(`  currentCostume: number = ${sprite.currentCostume}`)
    props.push(`  volume: number = ${sprite.volume}`)
    props.push(`  layerOrder: number = ${sprite.layerOrder}`)

    if (sprite.costumes && sprite.costumes.length > 0) {
      const costumesJson = JSON.stringify(
        sprite.costumes.map((c) => ({
          name: c.name,
          bitmapResolution: c.bitmapResolution,
          dataFormat: c.dataFormat,
          assetId: c.assetId,
          md5ext: c.md5ext,
          rotationCenterX: c.rotationCenterX,
          rotationCenterY: c.rotationCenterY,
        })),
        null,
        2,
      ).replace(/\n/g, "\n  ")
      props.push(`  costumes = ${costumesJson}`)
    }

    if (sprite.sounds && sprite.sounds.length > 0) {
      const soundsJson = JSON.stringify(
        sprite.sounds.map((s) => ({
          name: s.name,
          assetId: s.assetId,
          md5ext: s.md5ext,
          dataFormat: s.dataFormat,
          rate: s.rate,
          sampleCount: s.sampleCount,
        })),
        null,
        2,
      ).replace(/\n/g, "\n  ")
      props.push(`  sounds = ${soundsJson}`)
    }

    return props.join("\n")
  }

  private generateConstructor(sprite: Sprite): string {
    return `  constructor() {\n    // Sprite initialized\n  }`
  }

  private generateVariables(variables: { [key: string]: [string, any] }, isStage: boolean): string {
    const lines: string[] = []
    lines.push(`  // Variables`)

    for (const [varId, [varName, varValue]] of Object.entries(variables)) {
      const sanitizedName = this.sanitizeVarName(varName)
      const isGlobal = isStage
      const value = typeof varValue === "string" ? `"${this.escapeString(varValue)}"` : varValue

      lines.push(`  @varExport(${isGlobal})`)
      lines.push(`  ${sanitizedName}: any = ${value} // Original: "${varName}", ID: ${varId}`)
    }

    return lines.join("\n")
  }

  private generateLists(lists: { [key: string]: [string, string[]] }, isStage: boolean): string {
    const lines: string[] = []
    lines.push(`  // Lists`)

    for (const [listId, [listName, listValue]] of Object.entries(lists)) {
      const sanitizedName = this.sanitizeVarName(listName)
      const isGlobal = isStage
      const value = JSON.stringify(listValue)

      lines.push(`  @listExport(${isGlobal})`)
      lines.push(`  ${sanitizedName}: any[] = ${value} // Original: "${listName}", ID: ${listId}`)
    }

    return lines.join("\n")
  }

  private generateBlockMethods(blocks: BlockMap): string {
    const lines: string[] = []
    lines.push(`  // Block methods`)

    // Find all top-level blocks (event handlers)
    const topLevelBlocks = Object.entries(blocks)
      .filter(([_, block]) => block.topLevel)
      .map(([id, block]) => ({ id, block }))

    // Group by opcode
    const opcodeGroups = new Map<string, Array<{ id: string; block: Block }>>()
    for (const item of topLevelBlocks) {
      const opcode = item.block.opcode
      if (!opcodeGroups.has(opcode)) {
        opcodeGroups.set(opcode, [])
      }
      opcodeGroups.get(opcode)!.push(item)
    }

    // Generate methods for each opcode group
    for (const [opcode, items] of opcodeGroups.entries()) {
      if (items.length === 1) {
        const method = this.generateBlockMethod(items[0].id, opcode, blocks, opcode)
        if (method) lines.push(method)
      } else {
        items.forEach((item, index) => {
          const methodName = `${opcode}_${index + 1}`
          const method = this.generateBlockMethod(item.id, methodName, blocks, opcode)
          if (method) lines.push(method)
        })
      }
    }

    return lines.join("\n\n")
  }

  private generateBlockMethod(blockId: string, methodName: string, blocks: BlockMap, opcode: string): string | null {
    const block = blocks[blockId]
    if (!block) return null

    const lines: string[] = []

    // Special handling for procedures_definition
    if (opcode === "procedures_definition") {
      const customMethodName = this.procedureMethodNames.get(blockId) || methodName
      const proc = this.findProcedureByDefinitionId(blockId)
      
      // Add decorator with proccode
      lines.push(`  @blockExport("${opcode}", "hat", "${proc?.proccode || ""}")`)
      
      // Generate method with parameters if any
      const params = proc?.argumentNames.map((name, i) => `${this.sanitizeVarName(name)}: any`).join(", ") || ""
      lines.push(`  async ${this.sanitizeMethodName(customMethodName)}(${params}) {`)
      
      // Generate method body - start from next block after definition
      const bodyLines = this.generateBlockChainCode(block.next, blocks, 2)
      if (bodyLines.length > 0) {
        lines.push(bodyLines.join("\n"))
      } else {
        lines.push(`    // Empty procedure`)
      }
      
      lines.push(`  }`)
      return lines.join("\n")
    }

    // Add decorator
    const blockType = this.getBlockType(opcode)
    lines.push(`  @blockExport("${opcode}", "${blockType}")`)

    // Generate method signature
    lines.push(`  async ${this.sanitizeMethodName(methodName)}() {`)

    // Generate method body
    const bodyLines = this.generateBlockChainCode(block.next, blocks, 2)
    if (bodyLines.length > 0) {
      lines.push(bodyLines.join("\n"))
    } else {
      lines.push(`    // Empty block`)
    }

    lines.push(`  }`)

    return lines.join("\n")
  }

  /**
   * Find procedure by definition block ID
   */
  private findProcedureByDefinitionId(definitionId: string): CustomProcedure | undefined {
    for (const proc of this.customProcedures.values()) {
      if (proc.definitionBlockId === definitionId) {
        return proc
      }
    }
    return undefined
  }

  /**
   * Find procedure by proccode
   */
  private findProcedureByProccode(proccode: string): CustomProcedure | undefined {
    return this.customProcedures.get(proccode)
  }

  private sanitizeMethodName(name: string): string {
    // Replace any non-alphanumeric characters with underscore
    return name.replace(/[^a-zA-Z0-9_]/g, "_")
  }

  private getBlockType(opcode: string): "hat" | "stack" | "reporter" | "boolean" {
    const def = OPCODE_MAP.get(opcode)
    if (def) {
      switch (def.type) {
        case "hat":
          return "hat"
        case "any":
          return "reporter"
        case "bool":
          return "boolean"
        default:
          return "stack"
      }
    }

    // Fallback based on namespace
    if (opcode.startsWith("event_")) return "hat"
    if (opcode.startsWith("operator_")) return "reporter"
    if (opcode.startsWith("sensing_")) return "reporter"
    return "stack"
  }

  private generateBlockChainCode(blockId: string | null, blocks: BlockMap, indent: number): string[] {
    const lines: string[] = []
    const indentStr = "  ".repeat(indent)

    let currentId = blockId
    while (currentId && blocks[currentId]) {
      const block = blocks[currentId]
      const code = this.generateBlockCode(block, blocks, indent)
      if (code) {
        lines.push(...code)
      }
      currentId = block.next
    }

    return lines
  }

  /**
   * Generate TypeScript code for a single block
   * Uses OPCODE_MAP for mapping
   */
  private generateBlockCode(block: Block, blocks: BlockMap, indent: number): string[] | null {
    const indentStr = "  ".repeat(indent)
    const { opcode, inputs, fields } = block

    // Get opcode definition from OPCODE_MAP
    const def = OPCODE_MAP.get(opcode)
    const methodKey = OPCODE_TO_METHOD_MAP.get(opcode)
    const firstUnderscoreIndex = opcode.indexOf("_")

    if (firstUnderscoreIndex === -1) {
      return [`${indentStr}// Unknown opcode: ${opcode}`]
    }

    const namespace = opcode.substring(0, firstUnderscoreIndex)
    const opcodeMethod = opcode.substring(firstUnderscoreIndex + 1)

    // Handle procedures_call - call custom procedure
    if (opcode === "procedures_call") {
      return this.generateProcedureCallCode(block, blocks, indent)
    }

    // Handle argument_reporter - get argument value
    if (opcode === "argument_reporter" || opcode === "argument_reporter_string_number") {
      const argName = fields?.VALUE?.[0] || ""
      const sanitizedName = this.sanitizeVarName(argName)
      return [`${indentStr}argument.reporter("${this.escapeString(argName)}")`]
    }

    // Handle control blocks with substacks
    if (namespace === "control" && inputs) {
      return this.generateControlBlockCode(block, blocks, indent, opcodeMethod, methodKey)
    }

    // Handle extension blocks
    if (!def && !SCRATCH_OPCODES[namespace as keyof typeof SCRATCH_OPCODES]) {
      return this.generateExtensionBlockCode(block, blocks, indent, namespace, opcodeMethod)
    }

    const args: string[] = []

    // Process based on opcode definition
    if (def) {
      args.push(...this.processArgsFromDefinition(def, inputs, fields, blocks))
    } else {
      // Fallback: process without definition
      args.push(...this.processArgsFallback(inputs, fields, blocks))
    }

    const argsStr = args.length > 0 ? args.join(", ") : ""
    // Use method key from OPCODE_TO_METHOD_MAP if available, otherwise use opcode suffix
    const finalMethodKey = methodKey || opcodeMethod
    return [`${indentStr}${namespace}.${this.toMethodKey(finalMethodKey)}(${argsStr})`]
  }

  /**
   * Generate code for procedures_call block
   */
  private generateProcedureCallCode(block: Block, blocks: BlockMap, indent: number): string[] {
    const indentStr = "  ".repeat(indent)
    const mutation = block.mutation as any
    const proccode = mutation?.proccode || ""
    
    const proc = this.findProcedureByProccode(proccode)
    if (!proc) {
      return [`${indentStr}// Unknown procedure: ${proccode}`]
    }
    
    const methodName = this.sanitizeProcCode(proccode)
    
    // Extract arguments based on argumentIds
    const args: string[] = []
    for (const argId of proc.argumentIds) {
      const inputValue = block.inputs?.[argId]
      if (inputValue) {
        args.push(this.extractInputValue(inputValue, blocks))
      } else {
        args.push('""')
      }
    }
    
    const argsStr = args.length > 0 ? args.join(", ") : ""
    // Don't use await - the procedure call is just a regular block
    return [`${indentStr}procedures.call("${this.escapeString(proccode)}"${argsStr ? ", " + argsStr : ""})`]
  }

  /**
   * Generate code for control blocks with substack support
   */
  private generateControlBlockCode(
    block: Block,
    blocks: BlockMap,
    indent: number,
    opcodeMethod: string,
    methodKey?: string,
  ): string[] {
    const indentStr = "  ".repeat(indent)
    const { inputs, fields } = block
    const lines: string[] = []

    switch (opcodeMethod) {
      case "repeat": {
        const timesArg = this.extractInputValue(inputs?.TIMES, blocks)
        lines.push(`${indentStr}control.repeat(${timesArg}, () => {`)

        // Generate substack
        const substackId = this.extractSubstackId(inputs?.SUBSTACK)
        if (substackId) {
          const substackLines = this.generateBlockChainCode(substackId, blocks, indent + 1)
          lines.push(...substackLines)
        }

        lines.push(`${indentStr}})`)
        break
      }

      case "forever": {
        lines.push(`${indentStr}control.forever(() => {`)

        const substackId = this.extractSubstackId(inputs?.SUBSTACK)
        if (substackId) {
          const substackLines = this.generateBlockChainCode(substackId, blocks, indent + 1)
          lines.push(...substackLines)
        }

        lines.push(`${indentStr}})`)
        break
      }

      case "if": {
        const conditionArg = this.extractInputValue(inputs?.CONDITION, blocks)
        lines.push(`${indentStr}control._if(${conditionArg}, () => {`)

        const substackId = this.extractSubstackId(inputs?.SUBSTACK)
        if (substackId) {
          const substackLines = this.generateBlockChainCode(substackId, blocks, indent + 1)
          lines.push(...substackLines)
        }

        lines.push(`${indentStr}})`)
        break
      }

      case "if_else": {
        const conditionArg = this.extractInputValue(inputs?.CONDITION, blocks)
        lines.push(`${indentStr}control.ifElse(${conditionArg}, () => {`)

        // THEN branch
        const substackId = this.extractSubstackId(inputs?.SUBSTACK)
        if (substackId) {
          const substackLines = this.generateBlockChainCode(substackId, blocks, indent + 1)
          lines.push(...substackLines)
        }

        lines.push(`${indentStr}}, () => {`)

        // ELSE branch
        const substack2Id = this.extractSubstackId(inputs?.SUBSTACK2)
        if (substack2Id) {
          const substackLines = this.generateBlockChainCode(substack2Id, blocks, indent + 1)
          lines.push(...substackLines)
        }

        lines.push(`${indentStr}})`)
        break
      }

      case "repeat_until": {
        const conditionArg = this.extractInputValue(inputs?.CONDITION, blocks)
        lines.push(`${indentStr}control.until(${conditionArg}, () => {`)

        const substackId = this.extractSubstackId(inputs?.SUBSTACK)
        if (substackId) {
          const substackLines = this.generateBlockChainCode(substackId, blocks, indent + 1)
          lines.push(...substackLines)
        }

        lines.push(`${indentStr}})`)
        break
      }

      case "wait_until": {
        const conditionArg = this.extractInputValue(inputs?.CONDITION, blocks)
        lines.push(`${indentStr}control.watch(${conditionArg})`)
        break
      }

      case "stop": {
        const stopOption = fields?.STOP_OPTION?.[0] || "all"
        lines.push(`${indentStr}control.stop("${stopOption}")`)
        break
      }

      default: {
        // Standard control block
        const args: string[] = []

        if (inputs) {
          for (const [key, value] of Object.entries(inputs)) {
            if (key !== "SUBSTACK" && key !== "SUBSTACK2") {
              args.push(this.extractInputValue(value, blocks))
            }
          }
        }

        if (fields) {
          for (const [key, value] of Object.entries(fields)) {
            if (Array.isArray(value)) {
              args.push(`"${this.escapeString(String(value[0]))}"`)
            }
          }
        }

        const argsStr = args.length > 0 ? args.join(", ") : ""
        // Use method key from OPCODE_TO_METHOD_MAP if available
        const finalMethodKey = methodKey || opcodeMethod
        lines.push(`${indentStr}control.${this.toMethodKey(finalMethodKey)}(${argsStr})`)
      }
    }

    return lines
  }

  /**
   * Generate code for extension blocks
   */
  private generateExtensionBlockCode(
    block: Block,
    blocks: BlockMap,
    indent: number,
    namespace: string,
    opcodeMethod: string,
  ): string[] {
    const indentStr = "  ".repeat(indent)
    const { inputs, fields } = block
    const args: string[] = []

    // Process inputs
    if (inputs) {
      for (const [key, value] of Object.entries(inputs)) {
        args.push(this.extractInputValue(value, blocks))
      }
    }

    // Process fields
    if (fields) {
      for (const [key, value] of Object.entries(fields)) {
        if (Array.isArray(value)) {
          args.push(`"${this.escapeString(String(value[0]))}"`)
        }
      }
    }

    const argsStr = args.length > 0 ? args.join(", ") : ""
    const extName = this.sanitizeExtensionName(namespace)
    return [`${indentStr}${extName}.${opcodeMethod}(${argsStr})`]
  }

  /**
   * Process arguments based on opcode definition
   */
  private processArgsFromDefinition(
    def: OpcodeDefinition,
    inputs: Record<string, any> | undefined,
    fields: Record<string, any> | undefined,
    blocks: BlockMap,
  ): string[] {
    const args: string[] = []
    const processedFields = new Set<string>()

    for (const arg of def.args) {
      if (arg.type === "field") {
        // Field argument
        if (fields?.[arg.name]) {
          const fieldValue = fields[arg.name]
          if (arg.name === "VARIABLE" || arg.name === "LIST") {
            // Variable/list reference
            const varName = this.sanitizeVarName(String(fieldValue[0]))
            args.push(`"${fieldValue[0]}"`) // Use original name for runtime lookup
          } else {
            args.push(`"${this.escapeString(String(fieldValue[0]))}"`)
          }
          processedFields.add(arg.name)
        }
      } else if (arg.type === "substack") {
        // Substack handled separately in control blocks
      } else {
        // Regular input (any, bool)
        if (inputs?.[arg.name]) {
          args.push(this.extractInputValue(inputs[arg.name], blocks))
        }
      }
    }

    // Process any additional fields not in args (from def.fields)
    if (def.fields) {
      for (const [fieldName, fieldValue] of Object.entries(def.fields)) {
        if (!processedFields.has(fieldName)) {
          args.push(`"${fieldValue}"`)
        }
      }
    }

    return args
  }

  /**
   * Fallback argument processing when no definition exists
   */
  private processArgsFallback(
    inputs: Record<string, any> | undefined,
    fields: Record<string, any> | undefined,
    blocks: BlockMap,
  ): string[] {
    const args: string[] = []

    if (inputs) {
      for (const [key, value] of Object.entries(inputs)) {
        if (key !== "SUBSTACK" && key !== "SUBSTACK2") {
          args.push(this.extractInputValue(value, blocks))
        }
      }
    }

    if (fields) {
      for (const [key, value] of Object.entries(fields)) {
        if (Array.isArray(value)) {
          if (key === "VARIABLE" || key === "LIST") {
            args.push(`"${this.escapeString(String(value[0]))}"`)
          } else {
            args.push(`"${this.escapeString(String(value[0]))}"`)
          }
        }
      }
    }

    return args
  }

  /**
   * Extract input value and convert to TypeScript expression
   * Scratch input format:
   * - [1, value] = literal value (number or string)
   * - [2, blockId] = block reference
   * - [3, blockId, [type, value, ...]] = shadow block with optional fallback
   * - [type, value, id] where type >= 10 = embedded value:
   *   - 10 = number literal
   *   - 11 = string literal
   *   - 12 = variable reference (should generate data.variable())
   *   - 13 = list reference (should generate data.listcontents())
   */
  private extractInputValue(input: any, blocks: BlockMap): string {
    if (!input) return '""'

    if (!Array.isArray(input)) {
      // Single value
      if (typeof input === "string") {
        return `"${this.escapeString(input)}"`
      }
      return String(input ?? '""')
    }

    const inputType = input[0]

    // Handle embedded value format [type, value, id] where type >= 10
    if (typeof inputType === "number" && inputType >= 10) {
      const value = input[1]
      if (inputType === 12) {
        // Variable reference - generate data.variable() call
        return `data.variable("${this.escapeString(String(value))}")`
      }
      if (inputType === 13) {
        // List reference - generate data.listcontents() call
        return `data.listcontents("${this.escapeString(String(value))}")`
      }
      // Number (10) or string (11)
      if (typeof value === "string") {
        return `"${this.escapeString(value)}"`
      }
      return String(value ?? '""')
    }

    const inputValue = input[1]
    const fallbackValue = input[2] // For shadow blocks

    switch (inputType) {
      case 1: // Literal value with embedded type
        if (Array.isArray(inputValue)) {
          // [1, [10, "value"]] format
          return this.extractInputValue(inputValue, blocks)
        }
        if (typeof inputValue === "string") {
          return `"${this.escapeString(inputValue)}"`
        }
        return String(inputValue ?? '""')

      case 2: // Block reference
        if (typeof inputValue === "string" && blocks[inputValue]) {
          return this.generateInlineBlockCode(blocks[inputValue], blocks)
        }
        // No block found, return empty
        return '""'

      case 3: // Shadow block with possible fallback
        // First check if inputValue is an embedded value (like [12, varName, varId])
        if (Array.isArray(inputValue) && typeof inputValue[0] === "number" && inputValue[0] >= 10) {
          return this.extractInputValue(inputValue, blocks)
        }
        // Check if there's an actual block referenced
        if (typeof inputValue === "string" && inputValue && blocks[inputValue]) {
          return this.generateInlineBlockCode(blocks[inputValue], blocks)
        }
        // Use fallback value
        if (fallbackValue) {
          return this.extractInputValue(fallbackValue, blocks)
        }
        return '""'

      default:
        // Unknown format, try to extract something useful
        if (Array.isArray(inputValue) && typeof inputValue[0] === "number" && inputValue[0] >= 10) {
          return this.extractInputValue(inputValue, blocks)
        }
        if (typeof inputValue === "string" && blocks[inputValue]) {
          return this.generateInlineBlockCode(blocks[inputValue], blocks)
        }
        if (fallbackValue) {
          return this.extractInputValue(fallbackValue, blocks)
        }
        return '""'
    }
  }

  /**
   * Extract substack block ID from input
   */
  private extractSubstackId(input: any): string | null {
    if (!input) return null

    if (Array.isArray(input) && input.length >= 2) {
      const blockId = input[1]
      if (typeof blockId === "string") {
        return blockId
      }
    }

    return null
  }

  /**
   * Generate inline block code for reporter/boolean blocks
   */
  private generateInlineBlockCode(block: Block, blocks: BlockMap): string {
    const { opcode, inputs, fields } = block

    const def = OPCODE_MAP.get(opcode)
    const methodKey = OPCODE_TO_METHOD_MAP.get(opcode)
    const firstUnderscoreIndex = opcode.indexOf("_")

    if (firstUnderscoreIndex === -1) {
      return `/* ${opcode} */`
    }

    const namespace = opcode.substring(0, firstUnderscoreIndex)
    const opcodeMethod = opcode.substring(firstUnderscoreIndex + 1)

    const args: string[] = []

    // Process based on definition
    if (def) {
      args.push(...this.processArgsFromDefinition(def, inputs, fields, blocks))
    } else {
      // Fallback
      if (inputs) {
        for (const [key, value] of Object.entries(inputs)) {
          if (key !== "SUBSTACK" && key !== "SUBSTACK2") {
            args.push(this.extractInputValue(value, blocks))
          }
        }
      }

      if (fields) {
        for (const [key, value] of Object.entries(fields)) {
          if (Array.isArray(value)) {
            args.push(`"${this.escapeString(String(value[0]))}"`)
          }
        }
      }
    }

    const argsStr = args.length > 0 ? args.join(", ") : ""
    // Use method key from OPCODE_TO_METHOD_MAP if available
    const finalMethodKey = methodKey || opcodeMethod
    return `${namespace}.${this.toMethodKey(finalMethodKey)}(${argsStr})`
  }

  /**
   * Convert opcode method name to camelCase method key
   * Also removes leading underscore if present (e.g., "_if" -> "if")
   */
  private toMethodKey(methodName: string): string {
    // Remove leading underscore if present (e.g., "_if" -> "if")
    if (methodName.startsWith("_")) {
      methodName = methodName.substring(1)
    }
    return methodName.charAt(0).toLowerCase() + methodName.slice(1)
  }

  private escapeString(str: string): string {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
  }
}