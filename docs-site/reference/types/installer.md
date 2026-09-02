# installer 安装时序域

> 定义位置：`types/installer.d.ts`。安装时序相关类型：规则、部署选项、installer 与属性抽取。

## ModTypeRule

```ts
type ModTypeRule = Record<string, unknown>
```

Mod 类型安装规则（目标路径、过滤条件等由具体扩展约定）。

## DeploymentOptions

```ts
interface DeploymentOptions {
  defaultPathBySource?: Record<string, string>
  ignoreConflict?: boolean
  sourcePathByFile?: Record<string, string>
  fomod?: FomodDeploymentOptions
  [key: string]: unknown
}
```

enable 阶段由外部注入给 `install` 的动态部署选项：

| 字段 | 说明 |
| --- | --- |
| defaultPathBySource | default 扩展专用：压缩包内 source 路径 → 相对游戏根目录落点 |
| ignoreConflict | Web 侧「忽略冲突并继续」：跳过冲突预检直接覆盖 |
| sourcePathByFile | 压缩包相对路径 → 哈希池绝对路径（基座注入） |
| fomod | FOMOD 部署上下文（[FomodDeploymentOptions](/reference/types/fomod#fomoddeploymentoptions)） |

## InstallerTest

```ts
type InstallerTest = (
  files: string[],
  gameId: number | string
) => boolean | Promise<boolean> | { supported: boolean } | Promise<{ supported: boolean }>
```

判断是否能处理当前文件集合；四种返回形态等价。

## InstallerInstall

```ts
type InstallerInstall = (
  files: string[],
  destinationPath?: string,
  options?: DeploymentOptions
) => any | Promise<any>
```

生成安装结果（通常包含 `instructions`）。用法见
[registerInstaller](/reference/context/registerInstaller)。

## AttributeExtractor

```ts
type AttributeExtractor = (
  modInfo: unknown,
  modPath: string
) => Record<string, unknown> | Promise<Record<string, unknown>>
```

Vortex 风格属性抽取器：从 modInfo / modPath 抽取属性。用法见
[registerAttributeExtractor](/reference/context/registerAttributeExtractor)。

## FinalFileInstruction

```ts
type FinalFileInstruction =
  | { type: 'copy'; source: string; destination: string;
      verification?: 'hash' | 'exists'; conflictPolicy?: 'prompt' | 'overwrite' }
  | { type: 'generatefile'; source?: string; destination: string;
      data?: string | Buffer | Uint8Array | null;
      verification?: 'hash' | 'exists'; conflictPolicy?: 'prompt' | 'overwrite' }
```

安装指令：

- `copy`：复制文件（`source` 为压缩包内相对路径，`destination` 为落地路径）。
- `generatefile`：生成新文件（`data` 为内容）。
- `verification`：落地校验策略；`conflictPolicy`：冲突策略。

## PostInstallerAttributeContext

```ts
interface PostInstallerAttributeContext {
  appid: number
  gameId: number
  modKey: string
  installerTypeId: string
  modTypeId: string
  stagingPath: string
  archiveFiles: readonly string[]
  instructions: readonly FinalFileInstruction[]
}
```

post-install 属性抽取上下文；`instructions` 为不可变 copy/generatefile 视图。用法见
[registerPostInstallerAttributeExtractor](/reference/context/registerPostInstallerAttributeExtractor)。

## PostInstallerAttributeExtractor

```ts
type PostInstallerAttributeExtractor = (
  context: PostInstallerAttributeContext
) => Record<string, unknown> | Promise<Record<string, unknown>>
```

post-install 属性抽取器签名。
