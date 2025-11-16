// Export all types from a central location
export interface ScratchProject {
  targets: Sprite[]
  monitors: Array<any>
  extensions?: Array<string>
  extensionURLs?: {
    [key: string]: string
  }
  customFonts?: customFont[]
  meta?: {
    semver: string
    vm: string
    agent: string
    platform: {
      name: string
      url: string
    }
  }
}

export interface Sprite {
  isStage: boolean
  name: string
  variables: Variables
  lists: Lists
  broadcasts: Variables
  blocks: BlockMap
  comments: { [key: string]: any }
  currentCostume: number
  costumes: Costume[]
  sounds: Sound[]
  volume: number
  layerOrder: number
  tempo?: number
  videoTransparency?: number
  videoState?: "on" | "off"
  textToSpeechLanguage?: any
  visible?: boolean
  x?: number
  y?: number
  size?: number
  direction?: number
  draggable?: boolean
  rotationStyle?: string
}

export type Variables = {
  [key: string]: [string, any]
}

export type Lists = {
  [key: string]: [string, string[]]
}

export interface Costume {
  name: string
  dataFormat: "svg" | "png"
  assetId: string
  md5ext: string
  rotationCenterX: number
  rotationCenterY: number
  bitmapResolution?: number
}

export interface Sound {
  name: string
  assetId: string
  dataFormat: string
  format: string
  rate: number
  sampleCount: number
  md5ext: string
}

export interface customFont {
  system: false
  family: string
  fallback: string
  md5ext?: string
}

export interface Mutation {
  tagName: string
  children: any[]
  proccode?: string // Custom block procedure code
  argumentids?: string // JSON string of argument IDs
  argumentnames?: string // JSON string of argument names
  argumentdefaults?: string // JSON string of argument defaults
  warp?: string // "true" or "false" string
  hasnext?: string // "true" or "false" string
}

export interface Block {
  opcode: string
  next: string | null
  parent: string | null
  inputs: { [key: string]: any }
  fields: { [key: string]: any }
  shadow: boolean
  topLevel: boolean
  x?: number
  y?: number
  disabled?: boolean
  blockType?: string
  id?: string
  mutation?: Mutation
}

export interface BlockMap {
  [blockId: string]: Block
}

export interface CompilerOptions {
  target: "scratchBlocks" | "sprites"
  forceUseMD5Extension: boolean
  outDir: string
  rootDir: string
  extensionResolution: "bundler" | "only-url" | "file-and-url"
}

export interface CompilerConfig {
  compilerOptions: CompilerOptions
}
