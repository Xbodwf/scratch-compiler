// Auto-generated TypeScript wrapper for Comment Blocks extension
// Extension ID: lmscomments
import { recordExtensionBlock } from "../runtime/blockRecorder.js"

const lmscomments = {
  /**
   * // [COMMENT]
   */
  commentHat(COMMENT: string | any): void {
    return recordExtensionBlock("lmscomments", "commentHat", [COMMENT]) as void
  },

  /**
   * // [COMMENT]
   */
  commentCommand(COMMENT: string | any): void {
    return recordExtensionBlock("lmscomments", "commentCommand", [COMMENT]) as void
  },

  /**
   * // [COMMENT]
   */
  commentC(COMMENT: string | any): void {
    return recordExtensionBlock("lmscomments", "commentC", [COMMENT]) as void
  },

  /**
   * [INPUT] // [COMMENT]
   */
  commentReporter(COMMENT: string | any, INPUT: string | any): any {
    return recordExtensionBlock("lmscomments", "commentReporter", [COMMENT, INPUT]) as any
  },

  /**
   * [INPUT] // [COMMENT]
   */
  commentBoolean(COMMENT: string | any, INPUT: boolean | any): boolean {
    return recordExtensionBlock("lmscomments", "commentBoolean", [COMMENT, INPUT]) as boolean
  },

}

export default lmscomments