import lmscomments from "@/extensions/lmscomments"


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
   
import { varExport, listExport, blockExport } from "scratch-compiler/dist/src/decorators"

export default class __1 {
  // Sprite properties
  name: string = "角色1"
  isStage: boolean = false
  x: number = 0
  y: number = 0
  size: number = 100
  direction: number = 90
  visible: boolean = true
  draggable: boolean = false
  rotationStyle: string = "all around"
  currentCostume: number = 0
  volume: number = 100
  layerOrder: number = 1
  costumes = [
    {
      "name": "造型1",
      "md5ext": "927d672925e7b99f7813735c484c6922.svg",
      "dataFormat": "svg",
      "rotationCenterX": 30.74937882782359,
      "rotationCenterY": 58.864768144346826
    }
  ]

  constructor() {
    // Sprite initialized
  }

  // Block methods

  @blockExport("event_whenbroadcastreceived", "hat")
  async event_whenbroadcastreceived() {
    ccwpolyfill.emptyValue()
    lmscomments.commentCommand("把扩展防卸载器(Extension Keeper)去掉，再保存作品")
    lmscomments.commentCommand("保存作品后重新打开，你会发现作品加载不了了")
    lmscomments.commentCommand("因为必须携带CCW-Polyfill作为前置扩展，附属扩展才能正常加载")
  }

  @blockExport("event_whenflagclicked", "hat")
  async event_whenflagclicked() {
    WitCatFPS.webturnon("true")
    control.forever(data.setvariableto(WitCatFPS.nweb(), this.____))
  }
}