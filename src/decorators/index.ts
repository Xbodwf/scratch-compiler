// Scratch block decorators for TypeScript classes
// These decorators mark methods and properties that should be compiled to Scratch blocks

export interface BlockMetadata {
  opcode: string
  type: "hat" | "stack" | "reporter" | "boolean"
  category?: string
}

export interface VarMetadata {
  name: string
  isGlobal: boolean
}

export interface ListMetadata {
  name: string
  isGlobal: boolean
}

// Store metadata for decorated methods and properties
const blockMetadataMap = new Map<any, Map<string, BlockMetadata>>()
const varMetadataMap = new Map<any, VarMetadata[]>()
const listMetadataMap = new Map<any, ListMetadata[]>()

/**
 * Decorator to mark a method as a Scratch block
 * @param opcode - The Scratch opcode (e.g., "motion_movesteps")
 * @param type - Block type: "hat" (event), "stack" (command), "reporter" (value), "boolean"
 */
export function blockExport(opcode: string, type: BlockMetadata["type"] = "stack") {
  return (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => {
    if (!blockMetadataMap.has(target.constructor)) {
      blockMetadataMap.set(target.constructor, new Map())
    }
    const metadata = blockMetadataMap.get(target.constructor)!
    metadata.set(propertyKey, { opcode, type })
    return descriptor
  }
}

/**
 * Decorator to mark a property as a Scratch variable
 * @param isGlobal - Whether this is a global variable (Stage only)
 */
export function varExport(isGlobal = false) {
  return (target: any, propertyKey: string) => {
    if (!varMetadataMap.has(target.constructor)) {
      varMetadataMap.set(target.constructor, [])
    }
    const metadata = varMetadataMap.get(target.constructor)!
    metadata.push({ name: propertyKey, isGlobal })
  }
}

/**
 * Decorator to mark a property as a Scratch list
 * @param isGlobal - Whether this is a global list (Stage only)
 */
export function listExport(isGlobal = false) {
  return (target: any, propertyKey: string) => {
    if (!listMetadataMap.has(target.constructor)) {
      listMetadataMap.set(target.constructor, [])
    }
    const metadata = listMetadataMap.get(target.constructor)!
    metadata.push({ name: propertyKey, isGlobal })
  }
}

/**
 * Get all block metadata for a class
 */
export function getBlockMetadata(target: any): Map<string, BlockMetadata> {
  return blockMetadataMap.get(target) || new Map()
}

/**
 * Get all variable metadata for a class
 */
export function getVarMetadata(target: any): VarMetadata[] {
  return varMetadataMap.get(target) || []
}

/**
 * Get all list metadata for a class
 */
export function getListMetadata(target: any): ListMetadata[] {
  return listMetadataMap.get(target) || []
}
