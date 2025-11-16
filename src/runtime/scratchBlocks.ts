// Auto-generated TypeScript runtime for Scratch built-in blocks
// These functions record block calls during compilation

import { recordBlock, getCurrentBlockContext } from "./blockRecorder.js"

export const motion = {
  movesteps: (steps: number | any) => recordBlock("motion", "movesteps", { STEPS: [1, steps] }),
  turnright: (degrees: number | any) => recordBlock("motion", "turnright", { DEGREES: [1, degrees] }),
  turnleft: (degrees: number | any) => recordBlock("motion", "turnleft", { DEGREES: [1, degrees] }),
  goto: (target: string | any) => recordBlock("motion", "goto", { TO: [1, target] }),
  gotoxy: (x: number | any, y: number | any) => recordBlock("motion", "gotoxy", { X: [1, x], Y: [1, y] }),
  glideto: (secs: number | any, target: string | any) =>
    recordBlock("motion", "glideto", { SECS: [1, secs], TO: [1, target] }),
  glide: (secs: number | any, x: number | any, y: number | any) =>
    recordBlock("motion", "glidesecstoxy", { SECS: [1, secs], X: [1, x], Y: [1, y] }),
  pointindirection: (direction: number | any) =>
    recordBlock("motion", "pointindirection", { DIRECTION: [1, direction] }),
  pointtowards: (target: string | any) => recordBlock("motion", "pointtowards", { TOWARDS: [1, target] }),
  changex: (dx: number | any) => recordBlock("motion", "changexby", { DX: [1, dx] }),
  setx: (x: number | any) => recordBlock("motion", "setx", { X: [1, x] }),
  changey: (dy: number | any) => recordBlock("motion", "changeyby", { DY: [1, dy] }),
  sety: (y: number | any) => recordBlock("motion", "sety", { Y: [1, y] }),
  ifonedgebounce: () => recordBlock("motion", "ifonedgebounce", {}),
  setrotationstyle: (style: "left-right" | "don't rotate" | "all around" | any) =>
    recordBlock("motion", "setrotationstyle", {}, { STYLE: [style, null] }),
  x: () => recordBlock("motion", "xposition", {}),
  y: () => recordBlock("motion", "yposition", {}),
  direction: () => recordBlock("motion", "direction", {}),
}

export const looks = {
  sayforsecs: (message: string | any, secs: number | any) =>
    recordBlock("looks", "sayforsecs", { MESSAGE: [1, message], SECS: [1, secs] }),
  say: (message: string | any) => recordBlock("looks", "say", { MESSAGE: [1, message] }),
  thinkforsecs: (message: string | any, secs: number | any) =>
    recordBlock("looks", "thinkforsecs", { MESSAGE: [1, message], SECS: [1, secs] }),
  think: (message: string | any) => recordBlock("looks", "think", { MESSAGE: [1, message] }),
  switchcostume: (costume: string | number | any) => recordBlock("looks", "switchcostumeto", { COSTUME: [1, costume] }),
  nextcostume: () => recordBlock("looks", "nextcostume", {}),
  switchbackdrop: (backdrop: string | number | any) =>
    recordBlock("looks", "switchbackdropto", { BACKDROP: [1, backdrop] }),
  nextbackdrop: () => recordBlock("looks", "nextbackdrop", {}),
  changesize: (change: number | any) => recordBlock("looks", "changesizeby", { CHANGE: [1, change] }),
  setsize: (size: number | any) => recordBlock("looks", "setsizeto", { SIZE: [1, size] }),
  changeeffect: (
    effect: "COLOR" | "FISHEYE" | "WHIRL" | "PIXELATE" | "MOSAIC" | "BRIGHTNESS" | "GHOST" | any,
    change: number | any,
  ) => recordBlock("looks", "changeeffectby", { CHANGE: [1, change] }, { EFFECT: [effect, null] }),
  seteffectto: (
    effect: "COLOR" | "FISHEYE" | "WHIRL" | "PIXELATE" | "MOSAIC" | "BRIGHTNESS" | "GHOST" | any,
    value: number | any,
  ) => recordBlock("looks", "seteffectto", { VALUE: [1, value] }, { EFFECT: [effect, null] }),
  cleareffects: () => recordBlock("looks", "cleargraphiceffects", {}),
  show: () => recordBlock("looks", "show", {}),
  hide: () => recordBlock("looks", "hide", {}),
  setlayer: (layer: "front" | "back" | any) =>
    recordBlock("looks", "goforwardbackwardlayers", {}, { FORWARD_BACKWARD: [layer, null] }),
  changelayer: (direction: "forward" | "backward" | any, num: number | any) =>
    recordBlock("looks", "goforwardbackwardlayers", { NUM: [1, num] }, { FORWARD_BACKWARD: [direction, null] }),
  costumename: () => recordBlock("looks", "costumenumbername", {}, { NUMBER_NAME: ["name", null] }),
  costumenumber: () => recordBlock("looks", "costumenumbername", {}, { NUMBER_NAME: ["number", null] }),
  backdropname: () => recordBlock("looks", "backdropnumbername", {}, { NUMBER_NAME: ["name", null] }),
  backdropnumber: () => recordBlock("looks", "backdropnumbername", {}, { NUMBER_NAME: ["number", null] }),
  size: () => recordBlock("looks", "size", {}),
}

export const sound = {
  playsound: (sound: string | any) => recordBlock("sound", "playsound", { SOUND: [1, sound] }),
  playsoundawait: (sound: string | any) => recordBlock("sound", "playsoundawait", { SOUND: [1, sound] }),
  stopallsounds: () => recordBlock("sound", "stopallsounds", {}),
  changeeffect: (effect: "PITCH" | "PAN" | any, change: number | any) =>
    recordBlock("sound", "changeeffectby", { CHANGE: [1, change] }, { EFFECT: [effect, null] }),
  seteffect: (effect: "PITCH" | "PAN" | any, value: number | any) =>
    recordBlock("sound", "seteffectto", { VALUE: [1, value] }, { EFFECT: [effect, null] }),
  cleareffects: () => recordBlock("sound", "cleareffects", {}),
  changevolume: (change: number | any) => recordBlock("sound", "changevolumeby", { CHANGE: [1, change] }),
  setvolume: (volume: number | any) => recordBlock("sound", "setvolumeto", { VOLUME: [1, volume] }),
  volume: () => recordBlock("sound", "volume", {}),
}

export const event = {
  start: () => recordBlock("event", "start", {}),
  keypressed: (key: string | any) => recordBlock("event", "keypressed", { KEY: [1, key] }),
  scenestart: (backdrop: string | any) => recordBlock("event", "scenestart", { BACKDROP: [1, backdrop] }),
  thisspriteclicked: () => recordBlock("event", "thisspriteclicked", {}),
  stageclicked: () => recordBlock("event", "stageclicked", {}),
  onbroadcast: (message: string | any) => recordBlock("event", "onbroadcast", { MESSAGE: [1, message] }),
  broadcast: (message: string | any) => recordBlock("event", "broadcast", { MESSAGE: [1, message] }),
  broadcastawait: (message: string | any) => recordBlock("event", "broadcastawait", { MESSAGE: [1, message] }),
}

export const control = {
  wait: (duration: number | any) => recordBlock("control", "wait", { DURATION: [1, duration] }),
  until: (condition: any, callback: () => any) => {
    const conditionId = typeof condition === "string" ? condition : condition
    const blockId = recordBlock("control", "wait_until", { CONDITION: [2, conditionId] })
    return blockId
  },
  repeat: (times: any, callback: () => any) => {
    const timesId = typeof times === "string" ? times : times
    const blockId = recordBlock("control", "repeat", { TIMES: [1, timesId] })
    // Execute callback to record nested blocks
    const ctx = getCurrentBlockContext()
    ctx.parentBlock = blockId
    if (typeof callback == "function") callback()
    ctx.parentBlock = null
    return blockId
  },
  forever: (callback: () => any) => {
    const blockId = recordBlock("control", "forever", {})
    const ctx = getCurrentBlockContext()
    ctx.parentBlock = blockId
    if (typeof callback == "function") callback()
    ctx.parentBlock = null
    return blockId
  },
  if_else: (condition: any, thenCallback: () => any, elseCallback?: () => any) => {
    const conditionId = typeof condition === "string" ? condition : condition
    const blockId = recordBlock("control", "if_else", { CONDITION: [2, conditionId] })
    const ctx = getCurrentBlockContext()

    // Record THEN branch
    ctx.parentBlock = blockId
    ctx.substackType = "SUBSTACK"
    if (typeof thenCallback == "function") thenCallback()

    // Record ELSE branch if exists
    if (elseCallback && typeof elseCallback == "function") {
      ctx.substackType = "SUBSTACK2"
      if (typeof elseCallback == "function") elseCallback()
    }

    ctx.parentBlock = null
    ctx.substackType = null
    return blockId
  },
  _if: (condition: any, callback: () => any) => {
    const conditionId = typeof condition === "string" ? condition : condition
    const blockId = recordBlock("control", "if", { CONDITION: [2, conditionId] })
    const ctx = getCurrentBlockContext()
    ctx.parentBlock = blockId
    ctx.substackType = "SUBSTACK"
    if (typeof callback == "function") callback()
    ctx.parentBlock = null
    ctx.substackType = null
    return blockId
  },
  stop: (option: "all" | "this script" | "other scripts in sprite" | any) =>
    recordBlock("control", "stop", {}, { OPTION: [option, null] }),
  clone: (target: string | any) => recordBlock("control", "clone", { TARGET: [1, target] }),
  deleteself: () => recordBlock("control", "deleteself", {}),
  onclone: () => recordBlock("control", "onclone", {}),
}

export const sensing = {
  touchingobject: (object: string | any) => recordBlock("sensing", "touchingobject", { OBJECT: [1, object] }),
  touchingcolor: (color: string | any) => recordBlock("sensing", "touchingcolor", { COLOR: [1, color] }),
  colortouchingcolor: (color1: string | any, color2: string | any) =>
    recordBlock("sensing", "colortouchingcolor", { COLOR1: [1, color1], COLOR2: [1, color2] }),
  distanceto: (target: string | any) => recordBlock("sensing", "distanceto", { TARGET: [1, target] }),
  ask: (question: string | any) => recordBlock("sensing", "ask", { QUESTION: [1, question] }),
  askanswer: () => recordBlock("sensing", "askanswer", {}),
  iskeypressed: (key: string | any) => recordBlock("sensing", "iskeypressed", { KEY: [1, key] }),
  mousex: () => recordBlock("sensing", "mousex", {}),
  mousey: () => recordBlock("sensing", "mousey", {}),
  mousedown: () => recordBlock("sensing", "mousedown", {}),
  setdragmode: (mode: "draggable" | "not draggable" | any) =>
    recordBlock("sensing", "setdragmode", {}, { MODE: [mode, null] }),
  loudness: () => recordBlock("sensing", "loudness", {}),
  timer: () => recordBlock("sensing", "timer", {}),
  resettimer: () => recordBlock("sensing", "resettimer", {}),
  of: (property: string | any, object: string | any) =>
    recordBlock("sensing", "of", { PROPERTY: [1, property], OBJECT: [1, object] }),
  current: (unit: "YEAR" | "MONTH" | "DATE" | "DAYOFWEEK" | "HOUR" | "MINUTE" | "SECOND" | any) =>
    recordBlock("sensing", "current", {}, { UNIT: [unit, null] }),
  dayssince2000: () => recordBlock("sensing", "dayssince2000", {}),
  username: () => recordBlock("sensing", "username", {}),
}

export const operator = {
  add: (a: any, b: any) => recordBlock("operator", "add", { A: [1, a], B: [1, b] }),
  subtract: (a: any, b: any) => recordBlock("operator", "subtract", { A: [1, a], B: [1, b] }),
  multiply: (a: any, b: any) => recordBlock("operator", "multiply", { A: [1, a], B: [1, b] }),
  divide: (a: any, b: any) => recordBlock("operator", "divide", { A: [1, a], B: [1, b] }),
  random: (from: number | any, to: number | any) => recordBlock("operator", "random", { FROM: [1, from], TO: [1, to] }),
  gt: (a: any, b: any) => recordBlock("operator", "gt", { A: [1, a], B: [1, b] }),
  lt: (a: any, b: any) => recordBlock("operator", "lt", { A: [1, a], B: [1, b] }),
  equals: (a: any, b: any) => recordBlock("operator", "equals", { A: [1, a], B: [1, b] }),
  and: (a: boolean | any, b: boolean | any) => recordBlock("operator", "and", { A: [1, a], B: [1, b] }),
  or: (a: boolean | any, b: boolean | any) => recordBlock("operator", "or", { A: [1, a], B: [1, b] }),
  not: (operand?: boolean | any) => recordBlock("operator", "not", { OPERAND: [1, operand] }),
  join: (str1: string | any, str2: string | any) =>
    recordBlock("operator", "join", { STR1: [1, str1], STR2: [1, str2] }),
  letterof: (index: number | any, str: string | any) =>
    recordBlock("operator", "letterof", { INDEX: [1, index], STR: [1, str] }),
  length: (str: string | any) => recordBlock("operator", "length", { STR: [1, str] }),
  contains: (str1: string | any, str2: string | any) =>
    recordBlock("operator", "contains", { STR1: [1, str1], STR2: [1, str2] }),
  mod: (a: number | any, b: number | any) => recordBlock("operator", "mod", { A: [1, a], B: [1, b] }),
  round: (num: number | any) => recordBlock("operator", "round", { NUM: [1, num] }),
  mathop: (operator: string | any, num: number | any) =>
    recordBlock("operator", "mathop", { OPERATOR: [1, operator], NUM: [1, num] }),
}

export const data = {
  variable: (name: string | any) => {
    const ctx = getCurrentBlockContext()
    const varId = ctx.getVariableId(name)
    return recordBlock("data", "variable", {}, { VARIABLE: [name, varId] })
  },
  setvariableto: (value: any, name: string | any) => {
    const ctx = getCurrentBlockContext()
    const varId = ctx.getVariableId(name)
    const valueId = typeof value === "string" ? value : value
    return recordBlock("data", "setvariableto", { VALUE: [1, valueId] }, { VARIABLE: [name, varId] })
  },
  changevariable: (value: number | any, name: string | any) => {
    const ctx = getCurrentBlockContext()
    const varId = ctx.getVariableId(name)
    return recordBlock("data", "changevariableby", { VALUE: [1, value] }, { VARIABLE: [name, varId] })
  },
  showvariable: (name: string | any) => recordBlock("data", "showvariable", { VARIABLE: [1, name] }),
  hidevariable: (name: string | any) => recordBlock("data", "hidevariable", { VARIABLE: [1, name] }),
  listcontents: (name: string | any) => recordBlock("data", "listcontents", { LIST: [1, name] }),
  addtolist: (item: any, list: string | any) => recordBlock("data", "addtolist", { ITEM: [1, item], LIST: [1, list] }),
  deleteoflist: (index: number | any, list: string | any) =>
    recordBlock("data", "deleteoflist", { INDEX: [1, index], LIST: [1, list] }),
  deletealloflist: (list: string | any) => recordBlock("data", "deletealloflist", { LIST: [1, list] }),
  insertatlist: (item: any, index: number | any, list: string | any) =>
    recordBlock("data", "insertatlist", { ITEM: [1, item], INDEX: [1, index], LIST: [1, list] }),
  replaceitemoflist: (index: number | any, list: string | any, item: any) =>
    recordBlock("data", "replaceitemoflist", { INDEX: [1, index], LIST: [1, list], ITEM: [1, item] }),
  itemoflist: (index: number | any, list: string | any) =>
    recordBlock("data", "itemoflist", { INDEX: [1, index], LIST: [1, list] }),
  itemnumoflist: (list: string | any, item: any) =>
    recordBlock("data", "itemnumoflist", { LIST: [1, list], ITEM: [1, item] }),
  lengthoflist: (list: string | any) => recordBlock("data", "lengthoflist", { LIST: [1, list] }),
  listcontainsitem: (list: string | any, item: any) =>
    recordBlock("data", "listcontainsitem", { LIST: [1, list], ITEM: [1, item] }),
  showlist: (list: string | any) => recordBlock("data", "showlist", { LIST: [1, list] }),
  hidelist: (list: string | any) => recordBlock("data", "hidelist", { LIST: [1, list] }),
}

export const pen = {
  clear: () => recordBlock("pen", "clear", {}),
  stamp: () => recordBlock("pen", "stamp", {}),
  pendown: () => recordBlock("pen", "pendown", {}),
  penup: () => recordBlock("pen", "penup", {}),
  setPenColorToColor: (color: string | any) => recordBlock("pen", "setpencolortocolor", { COLOR: [1, color] }),
  setparam: (param: string | any, value: number | any) =>
    recordBlock("pen", "setparam", { PARAM: [1, param], VALUE: [1, value] }),
  changeparam: (param: string | any, value: number | any) =>
    recordBlock("pen", "changeparam", { PARAM: [1, param], VALUE: [1, value] }),
  setPenSizeTo: (size: number | any) => recordBlock("pen", "setpensizeto", { SIZE: [1, size] }),
  changesize: (change: number | any) => recordBlock("pen", "changesize", { CHANGE: [1, change] }),
}

export const music = {
  playdrum: (drum: number | any, beats: number | any) =>
    recordBlock("music", "playdrum", { DRUM: [1, drum], BEATS: [1, beats] }),
  restforbeats: (beats: number | any) => recordBlock("music", "restforbeats", { BEATS: [1, beats] }),
  playnote: (note: number | any, beats: number | any) =>
    recordBlock("music", "playnote", { NOTE: [1, note], BEATS: [1, beats] }),
  setinstrument: (instrument: number | any) => recordBlock("music", "setinstrument", { INSTRUMENT: [1, instrument] }),
  settempo: (tempo: number | any) => recordBlock("music", "settempo", { TEMPO: [1, tempo] }),
  changetempo: (change: number | any) => recordBlock("music", "changetempo", { CHANGE: [1, change] }),
  gettempo: () => recordBlock("music", "gettempo", {}),
}

export const procedures = {
  call: (proccode?: string | any, ...args: any[]) => {
    const inputs: Record<string, any> = {}
    const fields: Record<string, any> = { NAME: [proccode, null] }

    // Add arguments as inputs
    if (args.length > 0) {
      fields.RESTS = args
    }

    return recordBlock("procedures", "call", inputs, fields)
  },
}

export const argument = {
  reporter_string_number: (name: string | any) => {
    return recordBlock("argument", "reporter_string_number", {}, { VALUE: [name, null] })
  },
}
