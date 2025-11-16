// Block recording system for capturing block calls during TypeScript execution

import type { Block } from "../types/index.js"

interface BlockContext {
  parentBlock: string | null
  substackType: string | null
  variables: Map<string, string>
  lists: Map<string, string>
}

let currentContext: BlockContext | null = null
let blockIdCounter = 0
let recordedBlocks: Map<string, Block> = new Map()

export function startBlockRecording(variables: Record<string, any> = {}, lists: Record<string, any> = {}) {
  blockIdCounter = 0
  recordedBlocks = new Map()

  currentContext = {
    parentBlock: null,
    substackType: null,
    variables: new Map(Object.entries(variables).map(([name, data]) => [name, data[0]])),
    lists: new Map(Object.entries(lists).map(([name, data]) => [name, data[0]])),
  }
}

export function stopBlockRecording(): Record<string, Block> {
  const blocks = Object.fromEntries(recordedBlocks)
  recordedBlocks = new Map()
  currentContext = null
  return blocks
}

export function getCurrentBlockContext(): BlockContext & {
  getVariableId: (name: string) => string
  getListId: (name: string) => string
} {
  if (!currentContext) {
    throw new Error("Block recording not started")
  }

  return {
    ...currentContext,
    getVariableId: (name: string) => {
      if (!currentContext!.variables.has(name)) {
        throw new Error(`Variable "${name}" not found`)
      }
      return currentContext!.variables.get(name)!
    },
    getListId: (name: string) => {
      if (!currentContext!.lists.has(name)) {
        throw new Error(`List "${name}" not found`)
      }
      return currentContext!.lists.get(name)!
    },
  }
}

export function recordBlock(
  namespace: string,
  opcode: string,
  inputs: Record<string, any> = {},
  fields: Record<string, any> = {},
): string {
  if (!currentContext) {
    throw new Error("Block recording not started")
  }

  const blockId = `block_${blockIdCounter++}`
  const fullOpcode = `${namespace}_${opcode}`

  const processedInputs: Record<string, any> = {}
  for (const [key, value] of Object.entries(inputs)) {
    if (Array.isArray(value) && value.length >= 2) {
      const [inputType, inputValue] = value
      // If inputValue is a block ID (string starting with "block_"), use it as a reference
      if (typeof inputValue === "string" && inputValue.startsWith("block_")) {
        processedInputs[key] = [2, inputValue] // Type 2 = block reference
      } else {
        processedInputs[key] = value
      }
    } else {
      processedInputs[key] = value
    }
  }

  const block: Block = {
    opcode: fullOpcode,
    next: null,
    parent: currentContext.parentBlock,
    inputs: processedInputs,
    fields,
    shadow: false,
    topLevel: currentContext.parentBlock === null,
    x: 0,
    y: 0,
    disabled: false,
    blockType: "command",
    id: blockId,
  }

  // Handle substack (for control blocks)
  if (currentContext.substackType) {
    if (currentContext.parentBlock) {
      const parentBlock = recordedBlocks.get(currentContext.parentBlock)
      if (parentBlock) {
        if (!parentBlock.inputs) parentBlock.inputs = {}
        parentBlock.inputs[currentContext.substackType] = [2, blockId]
      }
    }
  }

  recordedBlocks.set(blockId, block)

  // Link to previous block in sequence
  const blocks = Array.from(recordedBlocks.values())
  const prevBlock = blocks[blocks.length - 2]
  if (prevBlock && prevBlock.parent === block.parent && !prevBlock.next && !currentContext.substackType) {
    prevBlock.next = blockId
  }

  return blockId
}

export function recordExtensionBlock(extensionId: string, opcode: string, args: any[] = []): string {
  if (!currentContext) {
    throw new Error("Block recording not started")
  }

  const blockId = `block_${blockIdCounter++}`
  const fullOpcode = `${extensionId}_${opcode}`

  // Process arguments as inputs
  const inputs: Record<string, any> = {}
  args.forEach((arg, index) => {
    const inputKey = `INPUT${index}`
    if (typeof arg === "string" && arg.startsWith("block_")) {
      inputs[inputKey] = [2, arg] // Block reference
    } else {
      inputs[inputKey] = [1, arg] // Literal value
    }
  })

  const block: Block = {
    opcode: fullOpcode,
    next: null,
    parent: currentContext.parentBlock,
    inputs,
    fields: {},
    shadow: false,
    topLevel: currentContext.parentBlock === null,
    x: 0,
    y: 0,
    disabled: false,
    blockType: "command",
    id: blockId,
  }

  recordedBlocks.set(blockId, block)

  // Link to previous block in sequence
  const blocks = Array.from(recordedBlocks.values())
  const prevBlock = blocks[blocks.length - 2]
  if (prevBlock && prevBlock.parent === block.parent && !prevBlock.next) {
    prevBlock.next = blockId
  }

  return blockId
}
