# scratch-compiler

一个不成熟的scratch编译器/反编译器

将你的Scratch作品反编译为Typescript,或者将Typescript编译为Scratch作品。

* 支持生成扩展的`d.ts`文件
* 支持装饰器
* 编译/反编译速度极快
* 良好的类型定义支持

> [!Caution]
> 由于未完全完成，可能无法正常编译大部分项目。

## 安装
```bash
npm install github:xbodwf/scratch-compiler -g
```

反编译项目:
```bash
scc -d <path_to_sb3> -d <dist_folder>
```

编译项目:
```bash
scc -p <path_to_folder>/scconfig.json
```


## 使用
`scconfig.json`是scratch-compiler使用的一种配置文件.

格式如下:

```jsonc
{
  // Scratch Compiler Configuration
  "compilerOptions": {
    // Target format: "scratchBlocks" compiles to Scratch blocks(sb3), "sprites" compiles to sprite format(.sprite3)
    //Warning: option "sprites" is wip
    "target": "scratchBlocks",

    // Force MD5 extension format for assets (e.g., 0e556a.png instead of abc123)
    "forceUseMD5Extension": true,

    // Output directory for compiled .sb3 file
    "outDir": "./dist",

    // Root directory of the Scratch project (contains root.json and sprite folders)
    "rootDir": "./",

    // Extension resolution strategy:
    // - "bundler": Bundle extensions into the project
    // - "only-url": Only allow online extensions (URL references)
    // - "file-and-url": Bundle extensions as data URLs
    "extensionResolution": "bundler"
  }
}
```

按道理，使用scc反编译的项目默认会自带一个`scconfig.json`,含默认配置。
(如果目标文件夹不存在)

如果`package.json`和`tsconfig.json`不存在,则会一同创建。

然后您再进行:
```bash
cd <dist_folder>

npm install
```

随后您就可以使用Typescript来编写已有Scratch作品了。

