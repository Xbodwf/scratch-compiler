import * as t from "@babel/types"
import {generate} from "@babel/generator"
import type { Block, BlockMap } from "../types/index.js"
import { OPCODE_MAP, type OpcodeDefinition } from "../opcodes/index.js"

export class BlockCompiler {
  compile(blocks: BlockMap): string {
    const topLevelBlocks = Object.entries(blocks)
      .filter(([_, block]) => block.topLevel)
      .map(([id, block]) => ({ id, block }))

    // Group by opcode to handle multiple same-opcode blocks
    const opcodeGroups = new Map<string, Array<{ id: string; block: Block }>>()
    for (const item of topLevelBlocks) {
      const opcode = item.block.opcode
      if (!opcodeGroups.has(opcode)) {
        opcodeGroups.set(opcode, [])
      }
      opcodeGroups.get(opcode)!.push(item)
    }

    const functions: t.FunctionDeclaration[] = []

    // Generate functions for each opcode group
    for (const [opcode, items] of opcodeGroups.entries()) {
      if (items.length === 1) {
        // Single function with opcode name
        const func = this.compileTopLevelBlock(items[0].id, opcode, blocks)
        if (func) functions.push(func)
      } else {
        // Multiple functions with numbered suffixes
        items.forEach((item, index) => {
          const func = this.compileTopLevelBlock(item.id, `${opcode}_${index + 1}`, blocks)
          if (func) functions.push(func)
        })
      }
    }

    return functions.map((func) => generate(func).code).join("\n\n")
  }

  private compileTopLevelBlock(blockId: string, functionName: string, blocks: BlockMap): t.FunctionDeclaration | null {
    const block = blocks[blockId]
    if (!block) return null

    // Compile the body (next blocks)
    const bodyStatements: t.Statement[] = []
    if (block.next) {
      this.compileBlockChain(block.next, blocks, bodyStatements)
    }

    // Create async function if it contains await
    const hasAwait = this.containsAwait(bodyStatements)

    return t.functionDeclaration(t.identifier(functionName), [], t.blockStatement(bodyStatements), false, hasAwait)
  }

  private compileBlockChain(blockId: string | null, blocks: BlockMap, statements: t.Statement[]): void {
    if (!blockId || !blocks[blockId]) return

    const block = blocks[blockId]
    const statement = this.compileBlockToStatement(block, blocks)

    if (statement) {
      if (Array.isArray(statement)) {
        statements.push(...statement)
      } else {
        statements.push(statement)
      }
    }

    // Continue with next block
    if (block.next) {
      this.compileBlockChain(block.next, blocks, statements)
    }
  }

  private compileBlockToStatement(block: Block, blocks: BlockMap): t.Statement | t.Statement[] | null {
    const { opcode, inputs, fields } = block

    // Check if we have a definition for this opcode
    const opcodeDefinition = OPCODE_MAP.get(opcode)

    if (opcodeDefinition) {
      return this.compileDefinedBlock(block, opcodeDefinition, blocks)
    }

    // Special handling for control flow blocks
    if (opcode === "control_repeat") {
      const times = this.compileInputToExpression(inputs.TIMES, blocks)
      const bodyStatements: t.Statement[] = []
      const substack = inputs.SUBSTACK?.[1]
      if (substack) {
        this.compileBlockChain(substack, blocks, bodyStatements)
      }

      return t.forStatement(
        t.variableDeclaration("let", [t.variableDeclarator(t.identifier("i"), t.numericLiteral(0))]),
        t.binaryExpression("<", t.identifier("i"), times),
        t.updateExpression("++", t.identifier("i")),
        t.blockStatement(bodyStatements),
      )
    }

    if (opcode === "control_forever") {
      const bodyStatements: t.Statement[] = []
      const substack = inputs.SUBSTACK?.[1]
      if (substack) {
        this.compileBlockChain(substack, blocks, bodyStatements)
      }

      return t.whileStatement(t.booleanLiteral(true), t.blockStatement(bodyStatements))
    }

    if (opcode === "control_if") {
      const condition = this.compileInputToExpression(inputs.CONDITION, blocks)
      const bodyStatements: t.Statement[] = []
      const substack = inputs.SUBSTACK?.[1]
      if (substack) {
        this.compileBlockChain(substack, blocks, bodyStatements)
      }

      return t.ifStatement(condition, t.blockStatement(bodyStatements))
    }

    if (opcode === "control_if_else") {
      const condition = this.compileInputToExpression(inputs.CONDITION, blocks)
      const ifStatements: t.Statement[] = []
      const elseStatements: t.Statement[] = []

      const substack = inputs.SUBSTACK?.[1]
      if (substack) {
        this.compileBlockChain(substack, blocks, ifStatements)
      }

      const substack2 = inputs.SUBSTACK2?.[1]
      if (substack2) {
        this.compileBlockChain(substack2, blocks, elseStatements)
      }

      return t.ifStatement(condition, t.blockStatement(ifStatements), t.blockStatement(elseStatements))
    }

    if (opcode === "control_repeat_until") {
      const condition = this.compileInputToExpression(inputs.CONDITION, blocks)
      const bodyStatements: t.Statement[] = []
      const substack = inputs.SUBSTACK?.[1]
      if (substack) {
        this.compileBlockChain(substack, blocks, bodyStatements)
      }

      return t.whileStatement(t.unaryExpression("!", condition), t.blockStatement(bodyStatements))
    }

    if (opcode === "control_wait_until") {
      const condition = this.compileInputToExpression(inputs.CONDITION, blocks)
      return t.whileStatement(
        t.unaryExpression("!", condition),
        t.blockStatement([
          t.expressionStatement(
            t.awaitExpression(
              t.callExpression(t.memberExpression(t.thisExpression(), t.identifier("wait")), [t.numericLiteral(0.01)]),
            ),
          ),
        ]),
      )
    }

    // Data blocks (variables and lists)
    if (opcode === "data_setvariableto") {
      const variableId = fields.VARIABLE?.[1]
      const variableName = fields.VARIABLE?.[0] || "variable"
      const value = this.compileInputToExpression(inputs.VALUE, blocks)
      return t.expressionStatement(
        t.assignmentExpression(
          "=",
          t.memberExpression(
            t.memberExpression(t.thisExpression(), t.identifier("variables")),
            t.stringLiteral(variableId || variableName),
            true,
          ),
          value,
        ),
      )
    }

    if (opcode === "data_changevariableby") {
      const variableId = fields.VARIABLE?.[1]
      const variableName = fields.VARIABLE?.[0] || "variable"
      const value = this.compileInputToExpression(inputs.VALUE, blocks)
      return t.expressionStatement(
        t.assignmentExpression(
          "+=",
          t.memberExpression(
            t.memberExpression(t.thisExpression(), t.identifier("variables")),
            t.stringLiteral(variableId || variableName),
            true,
          ),
          value,
        ),
      )
    }

    // Procedures (custom blocks)
    if (opcode === "procedures_call") {
      const proccode = block.mutation?.proccode || "customBlock"
      const functionName = proccode.replace(/[^a-zA-Z0-9]/g, "_")
      const args: t.Expression[] = []

      if (block.mutation?.argumentids) {
        const argumentids = JSON.parse(block.mutation.argumentids)
        for (const argId of argumentids) {
          if (inputs[argId]) {
            args.push(this.compileInputToExpression(inputs[argId], blocks))
          }
        }
      }

      return t.expressionStatement(
        t.callExpression(t.memberExpression(t.thisExpression(), t.identifier(functionName)), args),
      )
    }

    // Default: generate runtime call for unknown blocks
    return this.generateRuntimeCall(opcode, inputs, fields, blocks)
  }

  private compileDefinedBlock(block: Block, definition: OpcodeDefinition, blocks: BlockMap): t.Statement | null {
    const { opcode, inputs, fields } = block
    const args: t.Expression[] = []

    // Extract arguments based on definition
    for (const argDef of definition.args) {
      if (argDef.type === "field") {
        // Field argument (from fields)
        const fieldValue = fields[argDef.name]
        if (fieldValue && Array.isArray(fieldValue)) {
          args.push(t.stringLiteral(String(fieldValue[0])))
        } else if (definition.fields && definition.fields[argDef.name]) {
          args.push(t.stringLiteral(definition.fields[argDef.name]))
        }
      } else if (argDef.type === "substack") {
        // Substack is handled separately in control flow
        continue
      } else {
        // Input argument (from inputs)
        const inputValue = inputs[argDef.name]
        if (inputValue) {
          args.push(this.compileInputToExpression(inputValue, blocks))
        }
      }
    }

    // Generate function call based on opcode type
    const functionName = this.opcodeToFunctionName(opcode)

    // Check if this is an await-able function
    const isAwait = opcode.includes("untildone") || opcode.includes("wait") || opcode.includes("andwait")

    const callExpr = t.callExpression(t.memberExpression(t.thisExpression(), t.identifier(functionName)), args)

    if (isAwait) {
      return t.expressionStatement(t.awaitExpression(callExpr))
    }

    // For reporter blocks (type: "any" or "bool"), this shouldn't be a statement
    // but we return it as expression statement for now
    if (definition.type === "void" || definition.type === "hat") {
      return t.expressionStatement(callExpr)
    }

    return t.expressionStatement(callExpr)
  }

  private opcodeToFunctionName(opcode: string): string {
    const parts = opcode.split("_")
    if (parts.length < 2) return opcode

    // Remove the category prefix
    const withoutCategory = parts.slice(1).join("_")

    // Convert to camelCase
    return withoutCategory.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
  }

  private generateRuntimeCall(opcode: string, inputs: any, fields: any, blocks: BlockMap): t.Statement {
    const args: t.Expression[] = []

    if (inputs) {
      for (const [key, value] of Object.entries(inputs)) {
        args.push(this.compileInputToExpression(value, blocks))
      }
    }

    if (fields) {
      for (const [key, value] of Object.entries(fields)) {
        if (Array.isArray(value) && value.length > 0) {
          args.push(t.stringLiteral(String(value[0])))
        }
      }
    }

    return t.expressionStatement(
      t.callExpression(
        t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier("runtime")), t.identifier(opcode)),
        args,
      ),
    )
  }

  private compileInputToExpression(input: any, blocks: BlockMap): t.Expression {
    if (!input) return t.numericLiteral(0)

    const [inputType, value] = input

    // Shadow block (literal value)
    if (inputType === 1 && Array.isArray(value)) {
      const [type, val] = value
      // Number types
      if (type === 4 || type === 5 || type === 6 || type === 7 || type === 8) {
        const num = Number(val)
        return isNaN(num) ? t.numericLiteral(0) : t.numericLiteral(num)
      }
      // String type
      if (type === 10) {
        return t.stringLiteral(String(val))
      }
      // Broadcast type
      if (type === 11) {
        return t.stringLiteral(String(val))
      }
      // Variable reference
      if (type === 12) {
        const variableId = val[1]
        const variableName = val[0]
        return t.memberExpression(
          t.memberExpression(t.thisExpression(), t.identifier("variables")),
          t.stringLiteral(variableId || variableName),
          true,
        )
      }
      // List reference
      if (type === 13) {
        const listId = val[1]
        const listName = val[0]
        return t.memberExpression(
          t.memberExpression(t.thisExpression(), t.identifier("lists")),
          t.stringLiteral(listId || listName),
          true,
        )
      }
    }

    // Block reference
    if (inputType === 2 && typeof value === "string" && blocks[value]) {
      return this.compileBlockToExpression(blocks[value], blocks)
    }

    // Obscured shadow (both literal and block)
    if (inputType === 3 && Array.isArray(value) && value.length >= 2) {
      const blockId = value[0]
      if (typeof blockId === "string" && blocks[blockId]) {
        return this.compileBlockToExpression(blocks[blockId], blocks)
      }
      // Fallback to shadow value
      if (Array.isArray(value[1])) {
        return this.compileInputToExpression([1, value[1]], blocks)
      }
    }

    return t.numericLiteral(0)
  }

  private compileBlockToExpression(block: Block, blocks: BlockMap): t.Expression {
    const { opcode, inputs, fields } = block

    // Check if we have a definition for this opcode
    const opcodeDefinition = OPCODE_MAP.get(opcode)

    // Operator blocks
    if (opcode === "operator_add") {
      const num1 = this.compileInputToExpression(inputs.NUM1, blocks)
      const num2 = this.compileInputToExpression(inputs.NUM2, blocks)
      return t.binaryExpression("+", num1, num2)
    }

    if (opcode === "operator_subtract") {
      const num1 = this.compileInputToExpression(inputs.NUM1, blocks)
      const num2 = this.compileInputToExpression(inputs.NUM2, blocks)
      return t.binaryExpression("-", num1, num2)
    }

    if (opcode === "operator_multiply") {
      const num1 = this.compileInputToExpression(inputs.NUM1, blocks)
      const num2 = this.compileInputToExpression(inputs.NUM2, blocks)
      return t.binaryExpression("*", num1, num2)
    }

    if (opcode === "operator_divide") {
      const num1 = this.compileInputToExpression(inputs.NUM1, blocks)
      const num2 = this.compileInputToExpression(inputs.NUM2, blocks)
      return t.binaryExpression("/", num1, num2)
    }

    if (opcode === "operator_random") {
      const from = this.compileInputToExpression(inputs.FROM, blocks)
      const to = this.compileInputToExpression(inputs.TO, blocks)
      return t.callExpression(t.memberExpression(t.thisExpression(), t.identifier("random")), [from, to])
    }

    if (opcode === "operator_gt") {
      const operand1 = this.compileInputToExpression(inputs.OPERAND1, blocks)
      const operand2 = this.compileInputToExpression(inputs.OPERAND2, blocks)
      return t.binaryExpression(">", operand1, operand2)
    }

    if (opcode === "operator_lt") {
      const operand1 = this.compileInputToExpression(inputs.OPERAND1, blocks)
      const operand2 = this.compileInputToExpression(inputs.OPERAND2, blocks)
      return t.binaryExpression("<", operand1, operand2)
    }

    if (opcode === "operator_equals") {
      const operand1 = this.compileInputToExpression(inputs.OPERAND1, blocks)
      const operand2 = this.compileInputToExpression(inputs.OPERAND2, blocks)
      return t.binaryExpression("===", operand1, operand2)
    }

    if (opcode === "operator_and") {
      const operand1 = this.compileInputToExpression(inputs.OPERAND1, blocks)
      const operand2 = this.compileInputToExpression(inputs.OPERAND2, blocks)
      return t.logicalExpression("&&", operand1, operand2)
    }

    if (opcode === "operator_or") {
      const operand1 = this.compileInputToExpression(inputs.OPERAND1, blocks)
      const operand2 = this.compileInputToExpression(inputs.OPERAND2, blocks)
      return t.logicalExpression("||", operand1, operand2)
    }

    if (opcode === "operator_not") {
      const operand = this.compileInputToExpression(inputs.OPERAND, blocks)
      return t.unaryExpression("!", operand)
    }

    if (opcode === "operator_join") {
      const string1 = this.compileInputToExpression(inputs.STRING1, blocks)
      const string2 = this.compileInputToExpression(inputs.STRING2, blocks)
      return t.binaryExpression("+", string1, string2)
    }

    if (opcode === "operator_mod") {
      const num1 = this.compileInputToExpression(inputs.NUM1, blocks)
      const num2 = this.compileInputToExpression(inputs.NUM2, blocks)
      return t.binaryExpression("%", num1, num2)
    }

    if (opcode === "operator_round") {
      const num = this.compileInputToExpression(inputs.NUM, blocks)
      return t.callExpression(t.memberExpression(t.identifier("Math"), t.identifier("round")), [num])
    }

    if (opcode === "operator_mathop") {
      const operator = fields.OPERATOR?.[0] || "abs"
      const num = this.compileInputToExpression(inputs.NUM, blocks)
      return t.callExpression(t.memberExpression(t.identifier("Math"), t.identifier(operator)), [num])
    }

    if (opcode === "operator_letter_of") {
      const letter = this.compileInputToExpression(inputs.LETTER, blocks)
      const string = this.compileInputToExpression(inputs.STRING, blocks)
      return t.memberExpression(string, t.binaryExpression("-", letter, t.numericLiteral(1)), true)
    }

    if (opcode === "operator_length") {
      const string = this.compileInputToExpression(inputs.STRING, blocks)
      return t.memberExpression(string, t.identifier("length"))
    }

    if (opcode === "operator_contains") {
      const string1 = this.compileInputToExpression(inputs.STRING1, blocks)
      const string2 = this.compileInputToExpression(inputs.STRING2, blocks)
      return t.callExpression(t.memberExpression(string1, t.identifier("includes")), [string2])
    }

    // Sensing blocks
    if (opcode === "sensing_touchingobject") {
      const object = this.compileInputToExpression(inputs.TOUCHINGOBJECTMENU, blocks)
      return t.callExpression(t.memberExpression(t.thisExpression(), t.identifier("touching")), [object])
    }

    if (opcode === "sensing_answer") {
      return t.memberExpression(t.thisExpression(), t.identifier("answer"))
    }

    if (opcode === "sensing_keypressed") {
      const key = this.compileInputToExpression(inputs.KEY_OPTION, blocks)
      return t.callExpression(t.memberExpression(t.thisExpression(), t.identifier("keyPressed")), [key])
    }

    if (opcode === "sensing_mousedown") {
      return t.memberExpression(t.thisExpression(), t.identifier("mouseDown"))
    }

    if (opcode === "sensing_mousex") {
      return t.memberExpression(t.thisExpression(), t.identifier("mouseX"))
    }

    if (opcode === "sensing_mousey") {
      return t.memberExpression(t.thisExpression(), t.identifier("mouseY"))
    }

    if (opcode === "sensing_timer") {
      return t.callExpression(t.memberExpression(t.thisExpression(), t.identifier("timer")), [])
    }

    // Data blocks
    if (opcode === "data_variable") {
      const variableId = fields.VARIABLE?.[1]
      const variableName = fields.VARIABLE?.[0] || "variable"
      return t.memberExpression(
        t.memberExpression(t.thisExpression(), t.identifier("variables")),
        t.stringLiteral(variableId || variableName),
        true,
      )
    }

    if (opcode === "data_itemoflist") {
      const listId = fields.LIST?.[1]
      const listName = fields.LIST?.[0] || "list"
      const index = this.compileInputToExpression(inputs.INDEX, blocks)
      return t.memberExpression(
        t.memberExpression(
          t.memberExpression(t.thisExpression(), t.identifier("lists")),
          t.stringLiteral(listId || listName),
          true,
        ),
        t.binaryExpression("-", index, t.numericLiteral(1)),
        true,
      )
    }

    if (opcode === "data_lengthoflist") {
      const listId = fields.LIST?.[1]
      const listName = fields.LIST?.[0] || "list"
      return t.memberExpression(
        t.memberExpression(
          t.memberExpression(t.thisExpression(), t.identifier("lists")),
          t.stringLiteral(listId || listName),
          true,
        ),
        t.identifier("length"),
      )
    }

    if (opcode === "data_listcontainsitem") {
      const listId = fields.LIST?.[1]
      const listName = fields.LIST?.[0] || "list"
      const item = this.compileInputToExpression(inputs.ITEM, blocks)
      return t.callExpression(
        t.memberExpression(
          t.memberExpression(
            t.memberExpression(t.thisExpression(), t.identifier("lists")),
            t.stringLiteral(listId || listName),
            true,
          ),
          t.identifier("includes"),
        ),
        [item],
      )
    }

    // Motion reporters
    if (opcode === "motion_xposition") {
      return t.memberExpression(t.thisExpression(), t.identifier("x"))
    }

    if (opcode === "motion_yposition") {
      return t.memberExpression(t.thisExpression(), t.identifier("y"))
    }

    if (opcode === "motion_direction") {
      return t.memberExpression(t.thisExpression(), t.identifier("direction"))
    }

    // Looks reporters
    if (opcode === "looks_size") {
      return t.memberExpression(t.thisExpression(), t.identifier("size"))
    }

    if (opcode === "looks_costumenumbername") {
      const numberName = fields.NUMBER_NAME?.[0] || "number"
      if (numberName === "number") {
        return t.memberExpression(t.thisExpression(), t.identifier("currentCostume"))
      } else {
        return t.memberExpression(
          t.memberExpression(
            t.memberExpression(t.thisExpression(), t.identifier("costumes")),
            t.memberExpression(t.thisExpression(), t.identifier("currentCostume")),
            true,
          ),
          t.identifier("name"),
        )
      }
    }

    // Argument reporters (for custom blocks)
    if (opcode === "argument_reporter_string_number") {
      const argName = fields.VALUE?.[0] || "arg"
      return t.identifier(argName)
    }

    if (opcode === "argument_reporter_boolean") {
      const argName = fields.VALUE?.[0] || "arg"
      return t.identifier(argName)
    }

    if (opcodeDefinition && opcodeDefinition.type !== "void") {
      const args: t.Expression[] = []

      for (const argDef of opcodeDefinition.args) {
        if (argDef.type === "field") {
          const fieldValue = fields[argDef.name]
          if (fieldValue && Array.isArray(fieldValue)) {
            args.push(t.stringLiteral(String(fieldValue[0])))
          }
        } else {
          const inputValue = inputs[argDef.name]
          if (inputValue) {
            args.push(this.compileInputToExpression(inputValue, blocks))
          }
        }
      }

      const functionName = this.opcodeToFunctionName(opcode)
      return t.callExpression(t.memberExpression(t.thisExpression(), t.identifier(functionName)), args)
    }

    // Extension blocks as expressions
    if (opcode.includes("_")) {
      const args: t.Expression[] = []
      if (inputs) {
        for (const [key, value] of Object.entries(inputs)) {
          args.push(this.compileInputToExpression(value, blocks))
        }
      }
      if (fields) {
        for (const [key, value] of Object.entries(fields)) {
          if (Array.isArray(value) && value.length > 0) {
            args.push(t.stringLiteral(String(value[0])))
          }
        }
      }

      return t.callExpression(
        t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier("runtime")), t.identifier(opcode)),
        args,
      )
    }

    // Default
    return t.numericLiteral(0)
  }

  private containsAwait(statements: t.Statement[]): boolean {
    for (const stmt of statements) {
      if (t.isExpressionStatement(stmt)) {
        if (t.isAwaitExpression(stmt.expression)) {
          return true
        }
      }
      if (t.isIfStatement(stmt)) {
        if (t.isBlockStatement(stmt.consequent) && this.containsAwait(stmt.consequent.body)) {
          return true
        }
        if (stmt.alternate && t.isBlockStatement(stmt.alternate) && this.containsAwait(stmt.alternate.body)) {
          return true
        }
      }
      if ((t.isWhileStatement(stmt) || t.isForStatement(stmt)) && t.isBlockStatement(stmt.body)) {
        if (this.containsAwait(stmt.body.body)) {
          return true
        }
      }
    }
    return false
  }
}
