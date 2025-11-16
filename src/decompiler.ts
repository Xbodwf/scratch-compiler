import fs from "node:fs"
import path from "node:path"
import { TSCodeGenerator } from "./compiler/tsCodeGenerator.js"
import type { ScratchProject, Sprite, CompilerConfig } from "./types/index.js"
import cliProgress from "cli-progress"
import chalk from "chalk"

export async function decompileFromJSON(input: ScratchProject, out: string) {
  const { targets } = input
  if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true })

  const srcDir = path.join(out, "src")
  if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true })

  const packageJsonPath = path.join(out, "package.json")
  if (!fs.existsSync(packageJsonPath)) {
    const packageJson = {
      name: "scratch-decompiled-project",
      version: "1.0.0",
      type: "module",
      scripts: {
        build: "scc -p scconfig.json",
      },
      dependencies: {
        "scratch-compiler": "^1.0.0",
      },
      devDependencies: {
        typescript: "^5.0.0",
        "@types/node": "^20.0.0",
      },
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log(chalk.green(`[Generated] package.json`))
  }

  const tsconfigPath = path.join(out, "tsconfig.json")
  if (!fs.existsSync(tsconfigPath)) {
    const tsconfig = {
      compilerOptions: {
        target: "ES2020",
        module: "ESNext",
        moduleResolution: "bundler",
        lib: ["ES2020"],
        outDir: "./dist",
        rootDir: "./",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        baseUrl: ".",
        paths: {
          "@/*": ["./*"],
        },
      },
      include: ["src/**/*", "extensions/**/*"],
      exclude: ["node_modules", "dist"],
    }
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2))
    console.log(chalk.green(`[Generated] tsconfig.json`))
  }

  const scconfigPath = path.join(out, "scconfig.json")
  if (!fs.existsSync(scconfigPath)) {
    const defaultConfig: CompilerConfig = {
      compilerOptions: {
        target: "scratchBlocks",
        forceUseMD5Extension: true,
        outDir: "./dist",
        rootDir: "./",
        extensionResolution: "bundler",
      },
    }
    fs.writeFileSync(scconfigPath, JSON.stringify(defaultConfig, null, 2))
    console.log(chalk.green(`[Generated] scconfig.json`))
  }

  const stage = targets.find((t) => t.isStage === true)
  if (stage) {
    const rootPath = path.join(out, "root.json")
    fs.writeFileSync(rootPath, JSON.stringify(stage, null, 2))
    console.log(chalk.green(`[Saved] root.json (Stage)`))
  }

  let extensionMap = new Map()
  if (input.extensions && Object.keys(input.extensions).length > 0) {
    const { processExtensions } = await import("./extensions/sandbox.js")
    extensionMap = await processExtensions(input.extensionURLs!, out)
    console.log(chalk.green(`[Processed] ${extensionMap.size} extension(s)`))
  }

  const tsGenerator = new TSCodeGenerator()

  const progressBar = new cliProgress.SingleBar({
    format: `Decompiling |${chalk.cyan("{bar}")}| {percentage}% | {value}/{total} Sprites | {sprite}`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  })

  progressBar.start(targets.length, 0, { sprite: "" })

  const errors: Array<{ sprite: string; error: Error }> = []
  let successCount = 0

  targets.forEach((sprite: Sprite, index: number) => {
    try {
      const spriteFolderName = sprite.name.replace(/[/\\]/g, "_")
      progressBar.update(index + 1, { sprite: spriteFolderName })

      const spriteFolder = path.join(srcDir, spriteFolderName)

      if (!fs.existsSync(spriteFolder)) {
        fs.mkdirSync(spriteFolder, { recursive: true })
      }

      const jsonPath = path.join(spriteFolder, "index.json")
      fs.writeFileSync(jsonPath, JSON.stringify(sprite, null, 2))

      const tsCode = tsGenerator.generateSpriteClass(sprite, extensionMap)
      const tsPath = path.join(spriteFolder, "index.ts")
      fs.writeFileSync(tsPath, tsCode)

      successCount++
    } catch (error) {
      errors.push({ sprite: sprite.name, error: error as Error })
    }
  })

  progressBar.stop()

  const failCount = errors.length
  console.log(chalk.bold(`\n${chalk.green(`✓ ${successCount} succeeded`)} | ${chalk.red(`✗ ${failCount} failed`)}`))

  if (errors.length > 0) {
    console.log(chalk.red("\nErrors:"))
    errors.forEach(({ sprite, error }) => {
      console.log(chalk.red(`  [${sprite}] ${error.message}`))
      if (error.stack) {
        console.log(chalk.gray(`    ${error.stack.split("\n").slice(1, 3).join("\n    ")}`))
      }
    })
  }
}
