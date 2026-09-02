# ModType 与 installer

> 定位：`registerModType` 决定「这个压缩包算哪种 Mod、装到哪个目录」；
> `registerInstaller` 决定「怎么从压缩包里选出文件、生成哪些落地指令」。

## 类型契约

```ts
type InstallerTest = (
  files: string[],
  gameId: number | string
) => boolean | Promise<boolean> | { supported: boolean } | Promise<{ supported: boolean }>

type InstallerInstall = (
  files: string[],
  destinationPath?: string,
  options?: DeploymentOptions
) => any | Promise<any>

type FinalFileInstruction =
  | { type: 'copy'; source: string; destination: string;
      verification?: 'hash' | 'exists'; conflictPolicy?: 'prompt' | 'overwrite' }
  | { type: 'generatefile'; source?: string; destination: string;
      data?: string | Buffer | Uint8Array | null;
      verification?: 'hash' | 'exists'; conflictPolicy?: 'prompt' | 'overwrite' }
```

## 匹配与生成流程

1. 基座按 priority 从高到低调用各 installer 的 `test(files, gameId)`。
2. 第一个返回 true 的 installer 被选中。
3. 基座调用其 `install(files, destinationPath?, options?)` 生成指令序列。
4. 指令交给基座统一落地：`copy` 按源文件落地，`generatefile` 生成新文件。
5. `attribute` 类指令（`{ type: 'attribute', key, value }`）写入当前 ModFile 的 metaInfo，不落地文件。

installer 本身不直接写游戏目录。

## 指令字段

- `verification`：落地后的校验策略，`'hash'` 严格校验、`'exists'` 仅校验存在。
- `conflictPolicy`：冲突策略，`'prompt'` 询问、`'overwrite'` 直接覆盖。
- `destination` 支持相对 gamePath 的路径，也支持扩展产出的绝对路径。

## DeploymentOptions

```ts
interface DeploymentOptions {
  defaultPathBySource?: Record<string, string>   // default 扩展：source 路径 -> 相对游戏根目录落点
  ignoreConflict?: boolean                        // Web「忽略冲突并继续」：跳过冲突预检直接覆盖
  sourcePathByFile?: Record<string, string>       // 压缩包相对路径 -> 哈希池绝对路径（SDK 注入）
  fomod?: FomodDeploymentOptions                  // FOMOD 部署上下文
  [key: string]: unknown
}
```

> ⚠️ 当前 default extension runtime 把 `defaultPathBySource` 当作**单个相对落点目录字符串**读取，
> 不等同于按 source 分别映射的 Record。类型仍保留 Record 声明以兼容旧数据。

`fomod` 的 `FomodDeploymentOptions`：`{ mode?: 'auto' | 'reconfigure' | 'reuse', storedState? }`，
`storedState` 由 SDK 注入，用于 FOMOD 重配置/复用时的选择恢复。

## 最小示例

```ts
context.registerModType(
  'example-mod',
  25,                                  // priority
  () => true,                          // isSupported
  () => '{gamePath}/Mods',             // getTargetPath（支持 {gamePath} 模板）
  (files) => files.some((f) => f.endsWith('.pak')),
  { name: 'Example Mod' },
)

context.registerInstaller(
  'example-mod',
  10,
  (files) => files.some((f) => f.endsWith('.pak')),
  (files) => ({
    instructions: files
      .filter((f) => f.endsWith('.pak'))
      .map((f) => ({ type: 'copy', source: f, destination: f })),
  }),
)
```
