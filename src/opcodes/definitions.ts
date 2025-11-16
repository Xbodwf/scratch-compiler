// Scratch Block Opcode Definitions
// Based on scratch-fuse project

export interface OpcodeArg {
  name: string
  type: "any" | "bool" | "field" | "substack"
  menu?: Record<string, string> | null
}

export interface OpcodeDefinition {
  opcode: string
  type: "void" | "any" | "bool" | "hat" | "substack"
  args: OpcodeArg[]
  fields?: Record<string, string>
}

export interface OpcodeNamespace {
  [key: string]: OpcodeDefinition
}

export const SCRATCH_OPCODES: Record<string, OpcodeNamespace> = {
  motion: {
    moveSteps: {
      opcode: "motion_movesteps",
      type: "void",
      args: [{ name: "STEPS", type: "any" }],
    },
    turnRight: {
      opcode: "motion_turnright",
      type: "void",
      args: [{ name: "DEGREES", type: "any" }],
    },
    turnLeft: {
      opcode: "motion_turnleft",
      type: "void",
      args: [{ name: "DEGREES", type: "any" }],
    },
    goTo: {
      opcode: "motion_goto",
      type: "void",
      args: [{ name: "TO", type: "any" }],
    },
    setXY: {
      opcode: "motion_gotoxy",
      type: "void",
      args: [
        { name: "X", type: "any" },
        { name: "Y", type: "any" },
      ],
    },
    glideTo: {
      opcode: "motion_glideto",
      type: "void",
      args: [
        { name: "SECS", type: "any" },
        { name: "TO", type: "any" },
      ],
    },
    glide: {
      opcode: "motion_glidesecstoxy",
      type: "void",
      args: [
        { name: "SECS", type: "any" },
        { name: "X", type: "any" },
        { name: "Y", type: "any" },
      ],
    },
    pointInDirection: {
      opcode: "motion_pointindirection",
      type: "void",
      args: [{ name: "DIRECTION", type: "any" }],
    },
    pointTowards: {
      opcode: "motion_pointtowards",
      type: "void",
      args: [{ name: "TOWARDS", type: "any" }],
    },
    changeX: {
      opcode: "motion_changexby",
      type: "void",
      args: [{ name: "DX", type: "any" }],
    },
    setX: {
      opcode: "motion_setx",
      type: "void",
      args: [{ name: "X", type: "any" }],
    },
    changeY: {
      opcode: "motion_changeyby",
      type: "void",
      args: [{ name: "DY", type: "any" }],
    },
    setY: {
      opcode: "motion_sety",
      type: "void",
      args: [{ name: "Y", type: "any" }],
    },
    ifOnEdgeBounce: {
      opcode: "motion_ifonedgebounce",
      type: "void",
      args: [],
    },
    setRotationStyle: {
      opcode: "motion_setrotationstyle",
      type: "void",
      args: [
        {
          name: "STYLE",
          type: "field",
          menu: {
            "left-right": "left-right",
            "no-rotate": "don't rotate",
            "all-around": "all around",
          },
        },
      ],
    },
    x: {
      opcode: "motion_xposition",
      type: "any",
      args: [],
    },
    y: {
      opcode: "motion_yposition",
      type: "any",
      args: [],
    },
    direction: {
      opcode: "motion_direction",
      type: "any",
      args: [],
    },
  },
  looks: {
    sayForSecs: {
      opcode: "looks_sayforsecs",
      type: "void",
      args: [
        { name: "MESSAGE", type: "any" },
        { name: "SECS", type: "any" },
      ],
    },
    say: {
      opcode: "looks_say",
      type: "void",
      args: [{ name: "MESSAGE", type: "any" }],
    },
    thinkForSecs: {
      opcode: "looks_thinkforsecs",
      type: "void",
      args: [
        { name: "MESSAGE", type: "any" },
        { name: "SECS", type: "any" },
      ],
    },
    think: {
      opcode: "looks_think",
      type: "void",
      args: [{ name: "MESSAGE", type: "any" }],
    },
    switchCostume: {
      opcode: "looks_switchcostumeto",
      type: "void",
      args: [{ name: "COSTUME", type: "any" }],
    },
    nextCostume: {
      opcode: "looks_nextcostume",
      type: "void",
      args: [],
    },
    switchBackdrop: {
      opcode: "looks_switchbackdropto",
      type: "void",
      args: [{ name: "BACKDROP", type: "any" }],
    },
    nextBackdrop: {
      opcode: "looks_nextbackdrop",
      type: "void",
      args: [],
    },
    changeSize: {
      opcode: "looks_changesizeby",
      type: "void",
      args: [{ name: "DSIZE", type: "any" }],
    },
    setSize: {
      opcode: "looks_setsizeto",
      type: "void",
      args: [{ name: "SIZE", type: "any" }],
    },
    changeEffect: {
      opcode: "looks_changeeffectby",
      type: "void",
      args: [
        {
          name: "EFFECT",
          type: "field",
          menu: {
            color: "COLOR",
            fisheye: "FISHEYE",
            whirl: "WHIRL",
            pixelate: "PIXELATE",
            mosaic: "MOSAIC",
            brightness: "BRIGHTNESS",
            ghost: "GHOST",
          },
        },
        { name: "CHANGE", type: "any" },
      ],
    },
    setEffect: {
      opcode: "looks_seteffectto",
      type: "void",
      args: [
        {
          name: "EFFECT",
          type: "field",
          menu: {
            color: "COLOR",
            fisheye: "FISHEYE",
            whirl: "WHIRL",
            pixelate: "PIXELATE",
            mosaic: "MOSAIC",
            brightness: "BRIGHTNESS",
            ghost: "GHOST",
          },
        },
        { name: "VALUE", type: "any" },
      ],
    },
    clearEffects: {
      opcode: "looks_cleargraphiceffects",
      type: "void",
      args: [],
    },
    show: {
      opcode: "looks_show",
      type: "void",
      args: [],
    },
    hide: {
      opcode: "looks_hide",
      type: "void",
      args: [],
    },
    setLayer: {
      opcode: "looks_gotofrontback",
      type: "void",
      args: [
        {
          name: "FRONT_BACK",
          type: "field",
          menu: { front: "front", back: "back" },
        },
      ],
    },
    changeLayer: {
      opcode: "looks_goforwardbackwardlayers",
      type: "void",
      args: [
        {
          name: "FORWARD_BACKWARD",
          type: "field",
          menu: { forward: "forward", backward: "backward" },
        },
        { name: "NUM", type: "any" },
      ],
    },
    costumeName: {
      opcode: "looks_costumenumbername",
      type: "any",
      fields: { NUMBER_NAME: "name" },
      args: [],
    },
    costumeNumber: {
      opcode: "looks_costumenumbername",
      type: "any",
      fields: { NUMBER_NAME: "number" },
      args: [],
    },
    backdropName: {
      opcode: "looks_backdropnumbername",
      type: "any",
      fields: { NUMBER_NAME: "name" },
      args: [],
    },
    backdropNumber: {
      opcode: "looks_backdropnumbername",
      type: "any",
      fields: { NUMBER_NAME: "number" },
      args: [],
    },
    size: {
      opcode: "looks_size",
      type: "any",
      args: [],
    },
  },
  sound: {
    playSound: {
      opcode: "sound_play",
      type: "void",
      args: [{ name: "SOUND_MENU", type: "any" }],
    },
    playSoundAwait: {
      opcode: "sound_playuntildone",
      type: "void",
      args: [{ name: "SOUND_MENU", type: "any" }],
    },
    stopAllSounds: {
      opcode: "sound_stopallsounds",
      type: "void",
      args: [],
    },
    changeEffect: {
      opcode: "sound_changeeffectby",
      type: "void",
      args: [
        {
          name: "EFFECT",
          type: "field",
          menu: { pitch: "PITCH", pan: "PAN" },
        },
        { name: "CHANGE", type: "any" },
      ],
    },
    setEffect: {
      opcode: "sound_seteffectto",
      type: "void",
      args: [
        {
          name: "EFFECT",
          type: "field",
          menu: { pitch: "PITCH", pan: "PAN" },
        },
        { name: "VALUE", type: "any" },
      ],
    },
    clearEffects: {
      opcode: "sound_cleareffects",
      type: "void",
      args: [],
    },
    changeVolume: {
      opcode: "sound_changevolumeby",
      type: "void",
      args: [{ name: "VOLUME", type: "any" }],
    },
    setVolume: {
      opcode: "sound_setvolumeto",
      type: "void",
      args: [{ name: "VOLUME", type: "any" }],
    },
    volume: {
      opcode: "sound_volume",
      type: "any",
      args: [],
    },
  },
  event: {
    start: {
      opcode: "event_whenflagclicked",
      type: "hat",
      args: [],
    },
    keyPressed: {
      opcode: "event_whenkeypressed",
      type: "hat",
      args: [{ name: "KEY_OPTION", type: "field", menu: null }],
    },
    sceneStart: {
      opcode: "event_whenbackdropswitchesto",
      type: "hat",
      args: [{ name: "BACKDROP", type: "any" }],
    },
    thisSpriteClicked: {
      opcode: "event_whenthisspriteclicked",
      type: "hat",
      args: [],
    },
    stageClicked: {
      opcode: "event_whenstageclicked",
      type: "hat",
      args: [],
    },
    onBroadcast: {
      opcode: "event_whenbroadcastreceived",
      type: "hat",
      args: [{ name: "BROADCAST_OPTION", type: "field", menu: null }],
    },
    broadcast: {
      opcode: "event_broadcast",
      type: "void",
      args: [{ name: "BROADCAST_INPUT", type: "any" }],
    },
    broadcastAwait: {
      opcode: "event_broadcastandwait",
      type: "void",
      args: [{ name: "BROADCAST_INPUT", type: "any" }],
    },
  },
  control: {
    wait: {
      opcode: "control_wait",
      type: "void",
      args: [{ name: "DURATION", type: "any" }],
    },
    until: {
      opcode: "control_repeat_until",
      type: "void",
      args: [
        { name: "CONDITION", type: "bool" },
        { name: "SUBSTACK", type: "substack" },
      ],
    },
    repeat: {
      opcode: "control_repeat",
      type: "void",
      args: [
        { name: "TIMES", type: "any" },
        { name: "SUBSTACK", type: "substack" },
      ],
    },
    forever: {
      opcode: "control_forever",
      type: "void",
      args: [{ name: "SUBSTACK", type: "substack" }],
    },
    if: {
      opcode: "control_if",
      type: "void",
      args: [
        { name: "CONDITION", type: "bool" },
        { name: "SUBSTACK", type: "substack" },
      ],
    },
    ifElse: {
      opcode: "control_if_else",
      type: "void",
      args: [
        { name: "CONDITION", type: "bool" },
        { name: "SUBSTACK", type: "substack" },
        { name: "SUBSTACK2", type: "substack" },
      ],
    },
    watch: {
      opcode: "control_wait_until",
      type: "void",
      args: [{ name: "CONDITION", type: "bool" }],
    },
    stop: {
      opcode: "control_stop",
      type: "void",
      args: [
        {
          name: "STOP_OPTION",
          type: "field",
          menu: {
            all: "all",
            return: "this script",
            other: "other scripts in sprite",
          },
        },
      ],
    },
    clone: {
      opcode: "control_create_clone_of",
      type: "void",
      args: [{ name: "CLONE_OPTION", type: "any" }],
    },
    deleteSelf: {
      opcode: "control_delete_this_clone",
      type: "void",
      args: [],
    },
    onClone: {
      opcode: "control_start_as_clone",
      type: "hat",
      args: [],
    },
  },
  sensing: {
    touchingObject: {
      opcode: "sensing_touchingobject",
      type: "bool",
      args: [{ name: "TOUCHINGOBJECTMENU", type: "any" }],
    },
    touchingColor: {
      opcode: "sensing_touchingcolor",
      type: "bool",
      args: [{ name: "COLOR", type: "any" }],
    },
    colorTouchingColor: {
      opcode: "sensing_coloristouchingcolor",
      type: "bool",
      args: [
        { name: "COLOR1", type: "any" },
        { name: "COLOR2", type: "any" },
      ],
    },
    distanceTo: {
      opcode: "sensing_distanceto",
      type: "any",
      args: [{ name: "DISTANCETOMENU", type: "any" }],
    },
    ask: {
      opcode: "sensing_askandwait",
      type: "void",
      args: [{ name: "QUESTION", type: "any" }],
    },
    askAnswer: {
      opcode: "sensing_answer",
      type: "any",
      args: [],
    },
    isKeyPressed: {
      opcode: "sensing_keypressed",
      type: "bool",
      args: [{ name: "KEY_OPTION", type: "any" }],
    },
    mouseX: {
      opcode: "sensing_mousex",
      type: "any",
      args: [],
    },
    mouseY: {
      opcode: "sensing_mousey",
      type: "any",
      args: [],
    },
    mouseDown: {
      opcode: "sensing_mousedown",
      type: "bool",
      args: [],
    },
    setDragMode: {
      opcode: "sensing_setdragmode",
      type: "void",
      args: [
        {
          name: "DRAG_MODE",
          type: "field",
          menu: { draggable: "draggable", undraggable: "not draggable" },
        },
      ],
    },
    loudness: {
      opcode: "sensing_loudness",
      type: "any",
      args: [],
    },
    timer: {
      opcode: "sensing_timer",
      type: "any",
      args: [],
    },
    resetTimer: {
      opcode: "sensing_resettimer",
      type: "void",
      args: [],
    },
    of: {
      opcode: "sensing_of",
      type: "any",
      args: [
        { name: "PROPERTY", type: "field", menu: null },
        { name: "OBJECT", type: "any" },
      ],
    },
    current: {
      opcode: "sensing_current",
      type: "any",
      args: [
        {
          name: "CURRENTMENU",
          type: "field",
          menu: {
            year: "YEAR",
            month: "MONTH",
            date: "DATE",
            dayofweek: "DAYOFWEEK",
            hour: "HOUR",
            minute: "MINUTE",
            second: "SECOND",
          },
        },
      ],
    },
    daysSince2000: {
      opcode: "sensing_dayssince2000",
      type: "any",
      args: [],
    },
    username: {
      opcode: "sensing_username",
      type: "any",
      args: [],
    },
  },
  operator: {
    add: {
      opcode: "operator_add",
      type: "any",
      args: [
        { name: "NUM1", type: "any" },
        { name: "NUM2", type: "any" },
      ],
    },
    subtract: {
      opcode: "operator_subtract",
      type: "any",
      args: [
        { name: "NUM1", type: "any" },
        { name: "NUM2", type: "any" },
      ],
    },
    multiply: {
      opcode: "operator_multiply",
      type: "any",
      args: [
        { name: "NUM1", type: "any" },
        { name: "NUM2", type: "any" },
      ],
    },
    divide: {
      opcode: "operator_divide",
      type: "any",
      args: [
        { name: "NUM1", type: "any" },
        { name: "NUM2", type: "any" },
      ],
    },
    random: {
      opcode: "operator_random",
      type: "any",
      args: [
        { name: "FROM", type: "any" },
        { name: "TO", type: "any" },
      ],
    },
    gt: {
      opcode: "operator_gt",
      type: "bool",
      args: [
        { name: "OPERAND1", type: "any" },
        { name: "OPERAND2", type: "any" },
      ],
    },
    lt: {
      opcode: "operator_lt",
      type: "bool",
      args: [
        { name: "OPERAND1", type: "any" },
        { name: "OPERAND2", type: "any" },
      ],
    },
    equals: {
      opcode: "operator_equals",
      type: "bool",
      args: [
        { name: "OPERAND1", type: "any" },
        { name: "OPERAND2", type: "any" },
      ],
    },
    and: {
      opcode: "operator_and",
      type: "bool",
      args: [
        { name: "OPERAND1", type: "bool" },
        { name: "OPERAND2", type: "bool" },
      ],
    },
    or: {
      opcode: "operator_or",
      type: "bool",
      args: [
        { name: "OPERAND1", type: "bool" },
        { name: "OPERAND2", type: "bool" },
      ],
    },
    not: {
      opcode: "operator_not",
      type: "bool",
      args: [{ name: "OPERAND", type: "bool" }],
    },
    join: {
      opcode: "operator_join",
      type: "any",
      args: [
        { name: "STRING1", type: "any" },
        { name: "STRING2", type: "any" },
      ],
    },
    letterOf: {
      opcode: "operator_letter_of",
      type: "any",
      args: [
        { name: "LETTER", type: "any" },
        { name: "STRING", type: "any" },
      ],
    },
    length: {
      opcode: "operator_length",
      type: "any",
      args: [{ name: "STRING", type: "any" }],
    },
    contains: {
      opcode: "operator_contains",
      type: "bool",
      args: [
        { name: "STRING1", type: "any" },
        { name: "STRING2", type: "any" },
      ],
    },
    mod: {
      opcode: "operator_mod",
      type: "any",
      args: [
        { name: "NUM1", type: "any" },
        { name: "NUM2", type: "any" },
      ],
    },
    round: {
      opcode: "operator_round",
      type: "any",
      args: [{ name: "NUM", type: "any" }],
    },
    mathop: {
      opcode: "operator_mathop",
      type: "any",
      args: [
        { name: "OPERATOR", type: "field", menu: null },
        { name: "NUM", type: "any" },
      ],
    },
  },
  data: {
    variable: {
      opcode: "data_variable",
      type: "any",
      args: [{ name: "VARIABLE", type: "field", menu: null }],
    },
    setVariable: {
      opcode: "data_setvariableto",
      type: "void",
      args: [
        { name: "VARIABLE", type: "field", menu: null },
        { name: "VALUE", type: "any" },
      ],
    },
    changeVariable: {
      opcode: "data_changevariableby",
      type: "void",
      args: [
        { name: "VARIABLE", type: "field", menu: null },
        { name: "VALUE", type: "any" },
      ],
    },
    showVariable: {
      opcode: "data_showvariable",
      type: "void",
      args: [{ name: "VARIABLE", type: "field", menu: null }],
    },
    hideVariable: {
      opcode: "data_hidevariable",
      type: "void",
      args: [{ name: "VARIABLE", type: "field", menu: null }],
    },
    listContents: {
      opcode: "data_listcontents",
      type: "any",
      args: [{ name: "LIST", type: "field", menu: null }],
    },
    addToList: {
      opcode: "data_addtolist",
      type: "void",
      args: [
        { name: "ITEM", type: "any" },
        { name: "LIST", type: "field", menu: null },
      ],
    },
    deleteOfList: {
      opcode: "data_deleteoflist",
      type: "void",
      args: [
        { name: "INDEX", type: "any" },
        { name: "LIST", type: "field", menu: null },
      ],
    },
    deleteAllOfList: {
      opcode: "data_deletealloflist",
      type: "void",
      args: [{ name: "LIST", type: "field", menu: null }],
    },
    insertAtList: {
      opcode: "data_insertatlist",
      type: "void",
      args: [
        { name: "ITEM", type: "any" },
        { name: "INDEX", type: "any" },
        { name: "LIST", type: "field", menu: null },
      ],
    },
    replaceItemOfList: {
      opcode: "data_replaceitemoflist",
      type: "void",
      args: [
        { name: "INDEX", type: "any" },
        { name: "LIST", type: "field", menu: null },
        { name: "ITEM", type: "any" },
      ],
    },
    itemOfList: {
      opcode: "data_itemoflist",
      type: "any",
      args: [
        { name: "INDEX", type: "any" },
        { name: "LIST", type: "field", menu: null },
      ],
    },
    itemNumOfList: {
      opcode: "data_itemnumoflist",
      type: "any",
      args: [
        { name: "ITEM", type: "any" },
        { name: "LIST", type: "field", menu: null },
      ],
    },
    lengthOfList: {
      opcode: "data_lengthoflist",
      type: "any",
      args: [{ name: "LIST", type: "field", menu: null }],
    },
    listContainsItem: {
      opcode: "data_listcontainsitem",
      type: "bool",
      args: [
        { name: "LIST", type: "field", menu: null },
        { name: "ITEM", type: "any" },
      ],
    },
    showList: {
      opcode: "data_showlist",
      type: "void",
      args: [{ name: "LIST", type: "field", menu: null }],
    },
    hideList: {
      opcode: "data_hidelist",
      type: "void",
      args: [{ name: "LIST", type: "field", menu: null }],
    },
  },
  pen: {
    clear: {
      opcode: "pen_clear",
      type: "void",
      args: [],
    },
    stamp: {
      opcode: "pen_stamp",
      type: "void",
      args: [],
    },
    penDown: {
      opcode: "pen_penDown",
      type: "void",
      args: [],
    },
    penUp: {
      opcode: "pen_penUp",
      type: "void",
      args: [],
    },
    setColor: {
      opcode: "pen_setPenColorToColor",
      type: "void",
      args: [{ name: "COLOR", type: "any" }],
    },
    setParam: {
      opcode: "pen_setPenColorParamTo",
      type: "void",
      args: [
        { name: "COLOR_PARAM", type: "any" },
        { name: "VALUE", type: "any" },
      ],
    },
    changeParam: {
      opcode: "pen_changePenColorParamBy",
      type: "void",
      args: [
        { name: "COLOR_PARAM", type: "any" },
        { name: "VALUE", type: "any" },
      ],
    },
    setSize: {
      opcode: "pen_setPenSizeTo",
      type: "void",
      args: [{ name: "SIZE", type: "any" }],
    },
    changeSize: {
      opcode: "pen_changePenSizeBy",
      type: "void",
      args: [{ name: "SIZE", type: "any" }],
    },
  },
  music: {
    playDrum: {
      opcode: "music_playDrumForBeats",
      type: "void",
      args: [
        { name: "DRUM", type: "any" },
        { name: "BEATS", type: "any" },
      ],
    },
    restForBeats: {
      opcode: "music_restForBeats",
      type: "void",
      args: [{ name: "BEATS", type: "any" }],
    },
    playNote: {
      opcode: "music_playNoteForBeats",
      type: "void",
      args: [
        { name: "NOTE", type: "any" },
        { name: "BEATS", type: "any" },
      ],
    },
    setInstrument: {
      opcode: "music_setInstrument",
      type: "void",
      args: [{ name: "INSTRUMENT", type: "any" }],
    },
    setTempo: {
      opcode: "music_setTempo",
      type: "void",
      args: [{ name: "TEMPO", type: "any" }],
    },
    changeTempo: {
      opcode: "music_changeTempo",
      type: "void",
      args: [{ name: "TEMPO", type: "any" }],
    },
    getTempo: {
      opcode: "music_getTempo",
      type: "any",
      args: [],
    },
  },
}

// Create a reverse lookup map: opcode -> definition
export const OPCODE_MAP: Map<string, OpcodeDefinition> = new Map()

for (const namespace of Object.values(SCRATCH_OPCODES)) {
  for (const def of Object.values(namespace)) {
    OPCODE_MAP.set(def.opcode, def)
  }
}
