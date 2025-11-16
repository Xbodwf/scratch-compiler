import { decompileFromJSON } from "../decompiler.js"
import path from "node:path"
import fs from "node:fs/promises"
import JSZip from "jszip"
import type { ScratchProject } from "../types/index.js"

export async function createDecompileTask(p: string, o: string) {
  const tpath = path.resolve(p)
  const scratchProject = await fs.readFile(tpath)
  const zip = await JSZip.loadAsync(scratchProject)

  const jsonFile = zip.file("project.json")
  if (!jsonFile) {
    console.error("[Error] Invalid Scratch Project.")
    process.exit(1)
  }

  const projectJson = JSON.parse(await jsonFile.async("text")) as ScratchProject
  const outputPath = path.resolve(o)

  const assetsPath = path.join(outputPath, "assets")
  await fs.mkdir(assetsPath, { recursive: true })

  // Extract all files except project.json
  const files = zip.file(/.*/)
  for (const file of files) {
    if (file.name === "project.json" || file.dir) continue

    const content = await file.async("nodebuffer")
    const assetPath = path.join(assetsPath, file.name)
    await fs.writeFile(assetPath, content)
    console.log(`[Asset] Extracted: ${file.name}`)
  }

  return await decompileFromJSON(projectJson, outputPath)
}
