#!/usr/bin/env node
import minimist from "minimist"
import { createDecompileTask } from "./decompile/index.js"
import { createCompileTask } from "./compile/index.js"

const args = minimist(process.argv.slice(2))

function showHelp(): void {
  console.log(`
Usage:
  scc                    Compile current project (default, like tsc)
  scc -c [folder]        Compile according to current project
  scc -d <file> -o <dir> Decompile file to dist folder
  scc -p <config>        Compile with standalone config file
  scc -help              Show help
  `)
}

if (Object.keys(args).length === 1 && args._.length === 0) {
  // No arguments provided, default to compiling current directory
  console.log(`[Compile] Preparing from ${process.cwd()}`)
  try {
    await createCompileTask(process.cwd())
    console.log(`[Compile] Complete!`)
  } catch (error) {
    console.error(`[Compile] Error:`, error)
    process.exit(1)
  }
} else if (args.c !== undefined) {
  const folder: string = args.c === true ? process.cwd() : args.c
  console.log(`[Compile] Preparing from ${folder}`)
  try {
    await createCompileTask(folder)
    console.log(`[Compile] Complete!`)
  } catch (error) {
    console.error(`[Compile] Error:`, error)
    process.exit(1)
  }
} else if (args.d && args.o) {
  console.log(`[Decompile] ${args.d} => ${args.o}`)
  await createDecompileTask(args.d, args.o)
  console.log(`[Decompile] Complete!`)
} else if (args.p) {
  console.log(`[Compile] Using config: ${args.p}`)
  try {
    await createCompileTask(args.p)
    console.log(`[Compile] Complete!`)
  } catch (error) {
    console.error(`[Compile] Error:`, error)
    process.exit(1)
  }
} else if (args.help) {
  showHelp()
} else {
  console.error('Failed to execute this command. Try to use "scc -help" to get commands.')
  process.exit(1)
}
