// Auto-generated TypeScript runtime for Scratch built-in blocks
// Based on src/opcodes/definitions.ts
// These functions record block calls during compilation

import { recordBlock, getCurrentBlockContext } from "./blockRecorder.js"
import { SCRATCH_OPCODES, OPCODE_MAP, type OpcodeDefinition } from "../opcodes/definitions.js"

/**
 * Convert opcode method name to camelCase
 * e.g., "movesteps" -> "movesteps", "gotoxy" -> "gotoxy"
 */
function toCamelCase(str: string): string {
  return str.toLowerCase()
}

/**
 * Get the namespace from a full opcode
 * e.g., "motion_movesteps" -> "motion"
 */
function getNamespace(opcode: string): string {
  const idx = opcode.indexOf("_")
  return idx !== -1 ? opcode.substring(0, idx) : ""
}

/**
 * Get the method name from a full opcode
 * e.g., "motion_movesteps" -> "movesteps"
 */
function getMethodName(opcode: string): string {
  const idx = opcode.indexOf("_")
  return idx !== -1 ? opcode.substring(idx + 1) : opcode
}

/**
 * Create a runtime function for an opcode definition
 */
function createBlockFunction(def: OpcodeDefinition): (...args: any[]) => any {
  const { opcode, type, args: opcodeArgs, fields } = def
  const namespace = getNamespace(opcode)
  const methodName = getMethodName(opcode)

  // Special handling for control blocks (with callbacks)
  if (namespace === "control") {
    return createControlBlockFunction(def)
  }

  // Special handling for data blocks (variable/list operations)
  if (namespace === "data") {
    return createDataBlockFunction(def)
  }

  // Special handling for procedures
  if (namespace === "procedures") {
    return createProceduresBlockFunction(def)
  }

  // Special handling for argument
  if (namespace === "argument") {
    return createArgumentBlockFunction(def)
  }

  // Standard block function
  return (...callArgs: any[]) => {
    const inputs: Record<string, any> = {}
    const blockFields: Record<string, any> = {}

    let argIndex = 0

    // Process opcode args
    for (const arg of opcodeArgs) {
      if (arg.type === "field") {
        // Field argument - store as field
        const value = callArgs[argIndex] ?? ""
        blockFields[arg.name] = [value, null]
      } else if (arg.type === "substack") {
        // Substack handled by control blocks
      } else {
        // Regular input (any, bool)
        const value = callArgs[argIndex]
        inputs[arg.name] = [1, value]
      }
      argIndex++
    }

    // Process predefined fields
    if (fields) {
      for (const [fieldName, fieldValue] of Object.entries(fields)) {
        blockFields[fieldName] = [fieldValue, null]
      }
    }

    return recordBlock(namespace, methodName, inputs, blockFields)
  }
}

/**
 * Create control block functions with callback support
 */
function createControlBlockFunction(def: OpcodeDefinition): (...args: any[]) => any {
  const { opcode, args: opcodeArgs } = def
  const namespace = "control"
  const methodName = getMethodName(opcode)

  switch (methodName) {
    case "repeat":
      return (times: any, callback: () => any) => {
        const blockId = recordBlock(namespace, "repeat", { TIMES: [1, times] })
        const ctx = getCurrentBlockContext()
        ctx.parentBlock = blockId
        ctx.substackType = "SUBSTACK"
        if (typeof callback === "function") callback()
        ctx.parentBlock = null
        ctx.substackType = null
        return blockId
      }

    case "forever":
      return (callback: () => any) => {
        const blockId = recordBlock(namespace, "forever", {})
        const ctx = getCurrentBlockContext()
        ctx.parentBlock = blockId
        ctx.substackType = "SUBSTACK"
        if (typeof callback === "function") callback()
        ctx.parentBlock = null
        ctx.substackType = null
        return blockId
      }

    case "if":
      return (condition: any, callback: () => any) => {
        const conditionId = typeof condition === "string" ? condition : condition
        const blockId = recordBlock(namespace, "if", { CONDITION: [2, conditionId] })
        const ctx = getCurrentBlockContext()
        ctx.parentBlock = blockId
        ctx.substackType = "SUBSTACK"
        if (typeof callback === "function") callback()
        ctx.parentBlock = null
        ctx.substackType = null
        return blockId
      }

    case "if_else":
      return (condition: any, thenCallback: () => any, elseCallback?: () => any) => {
        const conditionId = typeof condition === "string" ? condition : condition
        const blockId = recordBlock(namespace, "if_else", { CONDITION: [2, conditionId] })
        const ctx = getCurrentBlockContext()

        // Record THEN branch
        ctx.parentBlock = blockId
        ctx.substackType = "SUBSTACK"
        if (typeof thenCallback === "function") thenCallback()

        // Record ELSE branch if exists
        if (elseCallback && typeof elseCallback === "function") {
          ctx.substackType = "SUBSTACK2"
          elseCallback()
        }

        ctx.parentBlock = null
        ctx.substackType = null
        return blockId
      }

    case "repeat_until":
      return (condition: any, callback: () => any) => {
        const conditionId = typeof condition === "string" ? condition : condition
        const blockId = recordBlock(namespace, "repeat_until", { CONDITION: [2, conditionId] })
        const ctx = getCurrentBlockContext()
        ctx.parentBlock = blockId
        ctx.substackType = "SUBSTACK"
        if (typeof callback === "function") callback()
        ctx.parentBlock = null
        ctx.substackType = null
        return blockId
      }

    case "wait_until":
      return (condition: any) => {
        const conditionId = typeof condition === "string" ? condition : condition
        return recordBlock(namespace, "wait_until", { CONDITION: [2, conditionId] })
      }

    default:
      // Standard control block
      return (...callArgs: any[]) => {
        const inputs: Record<string, any> = {}
        const blockFields: Record<string, any> = {}

        let argIndex = 0
        for (const arg of opcodeArgs) {
          if (arg.type === "field") {
            const value = callArgs[argIndex] ?? ""
            blockFields[arg.name] = [value, null]
          } else {
            const value = callArgs[argIndex]
            inputs[arg.name] = [1, value]
          }
          argIndex++
        }

        return recordBlock(namespace, methodName, inputs, blockFields)
      }
  }
}

/**
 * Create data block functions with variable/list context support
 */
function createDataBlockFunction(def: OpcodeDefinition): (...args: any[]) => any {
  const { opcode, args: opcodeArgs, fields } = def
  const namespace = "data"
  const methodName = getMethodName(opcode)

  switch (methodName) {
    case "variable":
      return (name: string | any) => {
        const ctx = getCurrentBlockContext()
        const varId = ctx.getVariableId(name)
        return recordBlock(namespace, "variable", {}, { VARIABLE: [name, varId] })
      }

    case "setvariableto":
      return (name: string | any, value: any) => {
        const ctx = getCurrentBlockContext()
        const varId = ctx.getVariableId(name)
        return recordBlock(namespace, "setvariableto", { VALUE: [1, value] }, { VARIABLE: [name, varId] })
      }

    case "changevariableby":
      return (name: string | any, value: number | any) => {
        const ctx = getCurrentBlockContext()
        const varId = ctx.getVariableId(name)
        return recordBlock(namespace, "changevariableby", { VALUE: [1, value] }, { VARIABLE: [name, varId] })
      }

    case "showvariable":
    case "hidevariable":
      return (name: string | any) => {
        return recordBlock(namespace, methodName, {}, { VARIABLE: [name, null] })
      }

    case "listcontents":
      return (name: string | any) => {
        const ctx = getCurrentBlockContext()
        const listId = ctx.getListId(name)
        return recordBlock(namespace, "listcontents", {}, { LIST: [name, listId] })
      }

    case "addtolist":
      return (item: any, name: string | any) => {
        const ctx = getCurrentBlockContext()
        const listId = ctx.getListId(name)
        return recordBlock(namespace, "addtolist", { ITEM: [1, item] }, { LIST: [name, listId] })
      }

    case "deleteoflist":
      return (index: number | any, name: string | any) => {
        const ctx = getCurrentBlockContext()
        const listId = ctx.getListId(name)
        return recordBlock(namespace, "deleteoflist", { INDEX: [1, index] }, { LIST: [name, listId] })
      }

    case "deletealloflist":
      return (name: string | any) => {
        const ctx = getCurrentBlockContext()
        const listId = ctx.getListId(name)
        return recordBlock(namespace, "deletealloflist", {}, { LIST: [name, listId] })
      }

    case "insertatlist":
      return (item: any, index: number | any, name: string | any) => {
        const ctx = getCurrentBlockContext()
        const listId = ctx.getListId(name)
        return recordBlock(namespace, "insertatlist", { ITEM: [1, item], INDEX: [1, index] }, { LIST: [name, listId] })
      }

    case "replaceitemoflist":
      return (index: number | any, name: string | any, item: any) => {
        const ctx = getCurrentBlockContext()
        const listId = ctx.getListId(name)
        return recordBlock(namespace, "replaceitemoflist", { INDEX: [1, index], ITEM: [1, item] }, { LIST: [name, listId] })
      }

    case "itemoflist":
      return (index: number | any, name: string | any) => {
        const ctx = getCurrentBlockContext()
        const listId = ctx.getListId(name)
        return recordBlock(namespace, "itemoflist", { INDEX: [1, index] }, { LIST: [name, listId] })
      }

    case "itemnumoflist":
      return (item: any, name: string | any) => {
        const ctx = getCurrentBlockContext()
        const listId = ctx.getListId(name)
        return recordBlock(namespace, "itemnumoflist", { ITEM: [1, item] }, { LIST: [name, listId] })
      }

    case "lengthoflist":
      return (name: string | any) => {
        const ctx = getCurrentBlockContext()
        const listId = ctx.getListId(name)
        return recordBlock(namespace, "lengthoflist", {}, { LIST: [name, listId] })
      }

    case "listcontainsitem":
      return (name: string | any, item: any) => {
        const ctx = getCurrentBlockContext()
        const listId = ctx.getListId(name)
        return recordBlock(namespace, "listcontainsitem", { ITEM: [1, item] }, { LIST: [name, listId] })
      }

    case "showlist":
    case "hidelist":
      return (name: string | any) => {
        return recordBlock(namespace, methodName, {}, { LIST: [name, null] })
      }

    default:
      // Standard data block
      return (...callArgs: any[]) => {
        const inputs: Record<string, any> = {}
        const blockFields: Record<string, any> = {}

        let argIndex = 0
        for (const arg of opcodeArgs) {
          if (arg.type === "field") {
            const value = callArgs[argIndex] ?? ""
            blockFields[arg.name] = [value, null]
          } else {
            const value = callArgs[argIndex]
            inputs[arg.name] = [1, value]
          }
          argIndex++
        }

        return recordBlock(namespace, methodName, inputs, blockFields)
      }
  }
}

/**
 * Create procedures block functions
 */
function createProceduresBlockFunction(def: OpcodeDefinition): (...args: any[]) => any {
  const methodName = getMethodName(def.opcode)

  switch (methodName) {
    case "call":
      return (proccode?: string | any, ...args: any[]) => {
        const inputs: Record<string, any> = {}
        const blockFields: Record<string, any> = {}

        if (proccode) {
          blockFields.proccode = [proccode, null]
        }

        // Add arguments as inputs
        args.forEach((arg, index) => {
          inputs[`arg${index}`] = [1, arg]
        })

        return recordBlock("procedures", "call", inputs, blockFields)
      }

    case "definition":
      return (proccode: string | any) => {
        return recordBlock("procedures", "definition", {}, { proccode: [proccode, null] })
      }

    default:
      return (...callArgs: any[]) => {
        return recordBlock("procedures", methodName, {})
      }
  }
}

/**
 * Create argument block functions
 */
function createArgumentBlockFunction(def: OpcodeDefinition): (...args: any[]) => any {
  const methodName = getMethodName(def.opcode)

  switch (methodName) {
    case "reporter_string_number":
      return (name: string | any) => {
        return recordBlock("argument", "reporter_string_number", {}, { VALUE: [name, null] })
      }

    case "reporter_boolean":
      return (name: string | any) => {
        return recordBlock("argument", "reporter_boolean", {}, { VALUE: [name, null] })
      }

    default:
      return (...callArgs: any[]) => {
        return recordBlock("argument", methodName, {})
      }
  }
}

/**
 * Build runtime namespace from opcode definitions
 * Uses the definition key as method name (e.g., "_if") to match definitions.ts
 * This properly handles JS reserved words like "if" -> "_if"
 */
function buildRuntimeNamespace(namespaceName: string): Record<string, (...args: any[]) => any> {
  const namespace: Record<string, (...args: any[]) => any> = {}
  const namespaceDefs = SCRATCH_OPCODES[namespaceName]

  if (!namespaceDefs) {
    return namespace
  }

  for (const [key, def] of Object.entries(namespaceDefs)) {
    // Use the definition key as method name (with first char lowercase)
    // e.g., "_if" stays as "_if", "moveSteps" becomes "moveSteps"
    const methodKey = key.charAt(0).toLowerCase() + key.slice(1)
    namespace[methodKey] = createBlockFunction(def)
  }

  return namespace
}

// Export built namespaces
export const motion = buildRuntimeNamespace("motion")
export const looks = buildRuntimeNamespace("looks")
export const sound = buildRuntimeNamespace("sound")
export const event = buildRuntimeNamespace("event")
export const control = buildRuntimeNamespace("control")
export const sensing = buildRuntimeNamespace("sensing")
export const operator = buildRuntimeNamespace("operator")
export const data = buildRuntimeNamespace("data")
export const pen = buildRuntimeNamespace("pen")
export const music = buildRuntimeNamespace("music")

// Procedures and argument are special
export const procedures = {
  call: (proccode?: string | any, ...args: any[]) => {
    const inputs: Record<string, any> = {}
    const fields: Record<string, any> = {}

    if (proccode) {
      fields.proccode = [proccode, null]
    }

    args.forEach((arg, index) => {
      inputs[`arg${index}`] = [1, arg]
    })

    return recordBlock("procedures", "call", inputs, fields)
  },
  definition: (proccode: string | any) => {
    return recordBlock("procedures", "definition", {}, { proccode: [proccode, null] })
  },
}

export const argument = {
  reporter: (name: string | any) => {
    return recordBlock("argument", "reporter", {}, { VALUE: [name, null] })
  },
  reporter_string_number: (name: string | any) => {
    return recordBlock("argument", "reporter_string_number", {}, { VALUE: [name, null] })
  },
  reporter_boolean: (name: string | any) => {
    return recordBlock("argument", "reporter_boolean", {}, { VALUE: [name, null] })
  },
}

/**
 * Get runtime function by full opcode
 * Useful for dynamic block execution
 */
export function getRuntimeFunction(opcode: string): ((...args: any[]) => any) | null {
  const def = OPCODE_MAP.get(opcode)
  if (!def) return null

  const namespace = getNamespace(opcode)
  const methodName = getMethodName(opcode)
  const methodKey = methodName.charAt(0).toLowerCase() + methodName.slice(1)

  // Get namespace object
  const namespaceObj = (globalThis as any).__scratchRuntime?.[namespace]
  if (namespaceObj && typeof namespaceObj[methodKey] === "function") {
    return namespaceObj[methodKey]
  }

  return null
}

// Register runtime for dynamic access
(globalThis as any).__scratchRuntime = {
  motion,
  looks,
  sound,
  event,
  control,
  sensing,
  operator,
  data,
  pen,
  music,
  procedures,
  argument,
}