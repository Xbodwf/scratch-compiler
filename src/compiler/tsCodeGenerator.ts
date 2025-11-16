import {generate} from "@babel/generator"
import type { Sprite, Block, BlockMap } from "../types/index.js"

export class TSCodeGenerator {
  generateSpriteClass(sprite: Sprite, extensionMap?: Map<string, any>): string {
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
              const extName = extId.replace(/[^a-zA-Z0-9]/g, "_")
              return `import ${extName} from "@/extensions/${extName}"`
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

  private sanitizeClassName(name: string): string {
    // Convert sprite name to valid class name
    let className = name.replace(/[^a-zA-Z0-9_]/g, "_")
    if (/^\d/.test(className)) {
      className = "_" + className
    }
    return className || "Sprite"
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
          md5ext: c.md5ext,
          dataFormat: c.dataFormat,
          rotationCenterX: c.rotationCenterX,
          rotationCenterY: c.rotationCenterY,
        })),
        null,
        2,
      ).replace(/\n/g, "\n  ") // Indent properly
      props.push(`  costumes = ${costumesJson}`)
    }

    if (sprite.sounds && sprite.sounds.length > 0) {
      const soundsJson = JSON.stringify(
        sprite.sounds.map((s) => ({
          name: s.name,
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
      const isGlobal = isStage // Stage variables are global
      const value = typeof varValue === "string" ? `"${varValue}"` : varValue

      lines.push(`  @varExport(${isGlobal})`)
      lines.push(`  ${sanitizedName}: any = ${value} // ID: ${varId}`)
    }

    return lines.join("\n")
  }

  private generateLists(lists: { [key: string]: [string, string[]] }, isStage: boolean): string {
    const lines: string[] = []
    lines.push(`  // Lists`)

    for (const [listId, [listName, listValue]] of Object.entries(lists)) {
      const sanitizedName = this.sanitizeVarName(listName)
      const isGlobal = isStage // Stage lists are global
      const value = JSON.stringify(listValue)

      lines.push(`  @listExport(${isGlobal})`)
      lines.push(`  ${sanitizedName}: any[] = ${value} // ID: ${listId}`)
    }

    return lines.join("\n")
  }

  private sanitizeVarName(name: string): string {
    let varName = name.replace(/[^a-zA-Z0-9_]/g, "_")
    if (/^\d/.test(varName)) {
      varName = "_" + varName
    }
    return varName || "variable"
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

    // Add decorator
    const blockType = this.getBlockType(opcode)
    lines.push(`  @blockExport("${opcode}", "${blockType}")`)

    // Generate method signature
    lines.push(`  async ${methodName}() {`)

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

  private getBlockType(opcode: string): "hat" | "stack" | "reporter" | "boolean" {
    if (opcode.startsWith("event_")) return "hat"
    if (opcode.startsWith("control_")) return "stack"
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

  private generateBlockCode(block: Block, blocks: BlockMap, indent: number): string[] | null {
    const indentStr = "  ".repeat(indent)
    const { opcode, inputs, fields } = block

    const firstUnderscoreIndex = opcode.indexOf("_")
    if (firstUnderscoreIndex === -1) {
      return [`${indentStr}// Unknown opcode: ${opcode}`]
    }

    const namespace = opcode.substring(0, firstUnderscoreIndex)
    const opcodeMethod = opcode.substring(firstUnderscoreIndex + 1)

    const args: string[] = []

    // Process inputs
    if (inputs) {
      for (const [key, value] of Object.entries(inputs)) {
        if (Array.isArray(value) && value.length >= 2) {
          const inputType = value[0]
          const inputValue = value[1]

          if (typeof inputValue === "string") {
            // This is a block ID reference - resolve it
            const referencedBlock = blocks[inputValue]
            if (referencedBlock) {
              // Generate nested block call
              const nestedCode = this.generateInlineBlockCode(referencedBlock, blocks)
              args.push(nestedCode)
            } else {
              args.push(`/* unresolved: ${inputValue} */`)
            }
          } else if (typeof inputValue === "number") {
            args.push(String(inputValue))
          } else if (Array.isArray(inputValue)) {
            // Literal value [type, value]
            const literalValue = inputValue[1]
            if (typeof literalValue === "string") {
              args.push(`"${this.escapeString(literalValue)}"`)
            } else {
              args.push(String(literalValue))
            }
          }
        }
      }
    }

    // Process fields (variables, dropdowns, etc.)
    if (fields) {
      for (const [key, value] of Object.entries(fields)) {
        if (Array.isArray(value) && value.length >= 1) {
          const fieldValue = value[0]
          if (key === "VARIABLE" || key === "LIST") {
            // This is a variable/list reference - use the variable name
            const varName = this.sanitizeVarName(fieldValue)
            args.push(`this.${varName}`)
          } else {
            args.push(`"${this.escapeString(String(fieldValue))}"`)
          }
        }
      }
    }

    const argsStr = args.length > 0 ? args.join(", ") : ""
    return [`${indentStr}${namespace}.${opcodeMethod}(${argsStr})`]
  }

  private generateInlineBlockCode(block: Block, blocks: BlockMap): string {
    const { opcode, inputs, fields } = block

    const firstUnderscoreIndex = opcode.indexOf("_")
    if (firstUnderscoreIndex === -1) {
      return `/* ${opcode} */`
    }

    const namespace = opcode.substring(0, firstUnderscoreIndex)
    const opcodeMethod = opcode.substring(firstUnderscoreIndex + 1)

    const args: string[] = []

    // Process inputs recursively
    if (inputs) {
      for (const [key, value] of Object.entries(inputs)) {
        if (Array.isArray(value) && value.length >= 2) {
          const inputValue = value[1]

          if (typeof inputValue === "string" && blocks[inputValue]) {
            args.push(this.generateInlineBlockCode(blocks[inputValue], blocks))
          } else if (Array.isArray(inputValue)) {
            const literalValue = inputValue[1]
            if (typeof literalValue === "string") {
              args.push(`"${this.escapeString(literalValue)}"`)
            } else {
              args.push(String(literalValue))
            }
          }
        }
      }
    }

    // Process fields
    if (fields) {
      for (const [key, value] of Object.entries(fields)) {
        if (Array.isArray(value) && value.length >= 1) {
          const fieldValue = value[0]
          if (key === "VARIABLE" || key === "LIST") {
            const varName = this.sanitizeVarName(fieldValue)
            args.push(`this.${varName}`)
          } else {
            args.push(`"${this.escapeString(String(fieldValue))}"`)
          }
        }
      }
    }

    const argsStr = args.length > 0 ? args.join(", ") : ""
    return `${namespace}.${opcodeMethod}(${argsStr})`
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
