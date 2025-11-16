# scratch-compiler

A premature scratch compiler/decompiler

Decompile your Scratch projects intocript, or compile Typescript into Scratch projects.

* Support for generating extended `d.ts` files
* Support for decorators
* Extremely fast/decompile speed
* Good type definition support

> [!Caution]
> As it is not fully completed, it may not compile most projects correctly.
## Installation
```bash
npm install github:xbodwf/scratch-compiler -g
```

Decompile a project:
```bash
sccd <path_to_sb3> -d <dist_folder>
```

Compile a project:
```bash
scc -p <path_tofolder>/scconfig.json
```

## Usage
`scconfig.json` is a configuration file used by scratch-compiler.

 format is as follows:

```jsonc
{
  // Scratch Compiler Configuration
  "compilerOptions": {
    // Target format: "atchBlocks" compiles to Scratch blocks(sb3), "sprites" compiles to sprite format(.sprite3)
    //Warning: option "sprites" is wip
    "target": "scratchBlocks",

    // Force MD5 extension format for assets (e.g., 0e56a.png instead of abc123)
    "forceUseMD5Extension": true,

    // Output directory for compiled .sb3
    "outDir": "./dist",

    // Root directory of the Scratch project (contains root.json and sprite folders)
    rootDir": "./",

    // Extension resolution strategy:
    // - "bundler": Bundle extensions into the project
    // - "onlyurl": Only allow online extensions (URL references)
    // - "file-and-url": Bundle extensions as data URLs
    "extensionResolution": "bler"
  }
}
```

In theory, a project decompiled with scc will have a default `scconfig.json` with default configurations.
(if the target folder does not exist)

If `package.json` and `tsconfig.json` do not exist, they will be created along with it

Then you can go on with:
```bash
cd <dist_folder>

npm install
```

After that, you can use Typescript to existing Scratch projects.