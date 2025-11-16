// Runtime namespace proxy system for capturing block calls during compilation
// This allows TypeScript code like control.wait_until() to be captured and converted to blocks

import fs from "node:fs"
import type { Block } from "../types/index.js"

let blockRecordingPath: string | null = null
let blockIdCounter = 0
let recordedBlocks: Block[] = []

export function startBlockRecording(outputPath: string) {
  blockRecordingPath = outputPath
  blockIdCounter = 0
  recordedBlocks = []

  // Clear the file if it exists
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath)
  }
}

export function stopBlockRecording(): Block[] {
  blockRecordingPath = null
  const blocks = [...recordedBlocks]
  recordedBlocks = []
  return blocks
}

function recordBlock(namespace: string, opcode: string, inputs: any = {}, fields: any = {}): string {
  const blockId = `block_${blockIdCounter++}`
  const fullOpcode = `${namespace}_${opcode}`

  const block: Block = {
    opcode: fullOpcode,
    next: null,
    parent: null,
    inputs,
    fields,
    shadow: false,
    topLevel: false,
    x: 0,
    y: 0,
    disabled: false,
    blockType: "command",
    id: blockId,
  }

  recordedBlocks.push(block)

  // Write to temp file if recording
  if (blockRecordingPath) {
    const blockData = { id: blockId, block }
    fs.appendFileSync(blockRecordingPath, JSON.stringify(blockData) + "\n")
  }

  return blockId
}

// Create namespace proxies
function createNamespaceProxy(namespace: string): any {
  return new Proxy(
    {},
    {
      get(target, prop: string) {
        return (...args: any[]) => {
          // Record the block call
          const inputs: any = {}
          const fields: any = {}

          // Parse arguments into inputs/fields
          args.forEach((arg, index) => {
            if (typeof arg === "object" && arg !== null) {
              Object.assign(inputs, arg)
            } else {
              inputs[`ARG${index}`] = [1, arg]
            }
          })

          return recordBlock(namespace, prop, inputs, fields)
        }
      },
    },
  )
}

// Export namespace proxies
export const motion = createNamespaceProxy("motion")
export const looks = createNamespaceProxy("looks")
export const sound = createNamespaceProxy("sound")
export const event = createNamespaceProxy("event")
export const control = createNamespaceProxy("control")
export const sensing = createNamespaceProxy("sensing")
export const operator = createNamespaceProxy("operator")
export const data = createNamespaceProxy("data")
export const procedures = createNamespaceProxy("procedures")

// Extension namespaces (dynamically created)
const extensionProxies = new Map<string, any>()

export function getExtensionNamespace(extensionName: string): any {
  if (!extensionProxies.has(extensionName)) {
    extensionProxies.set(extensionName, createNamespaceProxy(extensionName))
  }
  return extensionProxies.get(extensionName)
}

// Helper to create a global context with all namespaces
export function createBlockContext() {
  return {
    motion,
    looks,
    sound,
    event,
    control,
    sensing,
    operator,
    data,
    procedures,
    // Extension namespaces will be added dynamically
  }
}
