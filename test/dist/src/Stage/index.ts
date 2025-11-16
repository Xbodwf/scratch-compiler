
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

export default class Stage {
  // Sprite properties
  name: string = "Stage"
  isStage: boolean = true
  currentCostume: number = 0
  volume: number = 100
  layerOrder: number = 0
  costumes = [
    {
      "name": "背景1",
      "md5ext": "cd21514d0531fdffb22204e0ec5ed84a.svg",
      "dataFormat": "svg",
      "rotationCenterX": 240,
      "rotationCenterY": 180
    }
  ]

  constructor() {
    // Sprite initialized
  }

  // Variables
  @varExport(true)
  ____: any = 59.8802395210207 // ID: `jEk@4|i[#Fk?(8x)AV.-my variable
}