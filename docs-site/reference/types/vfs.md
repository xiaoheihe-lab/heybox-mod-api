# vfs 托管部署域

> 定义位置：`types/vfs.d.ts`。托管部署变更相关类型。入口：
> [api.vfs.runManagedDeploymentMutation](/reference/api/vfs-loadorder#runmanageddeploymentmutation)。

## ManagedDeploymentEntry

```ts
type ManagedDeploymentEntry = {
  modKey: string
  modId?: number
  fileId?: number
  versionId?: number
  modType?: string
  targetPath: string
  absolutePath: string
  expectedHash: string
  currentHash?: string | null
  exists?: boolean
  metaInfo?: any
}
```

一条已部署文件记录；`targetPath` 相对游戏根目录，`absolutePath` 为物理路径。

## ManagedDeploymentGameFile

```ts
type ManagedDeploymentGameFile = {
  targetPath: string
  absolutePath: string
  hash?: string | null
  exists?: boolean
  managed?: boolean
}
```

游戏目录内单个文件的快照行；`managed` 表示是否已被托管。

## ManagedDeploymentMutationSnapshot

```ts
type ManagedDeploymentMutationSnapshot = {
  gamePath: string
  entries: ManagedDeploymentEntry[]
  gameFiles?: ManagedDeploymentGameFile[]
}
```

mutation 开始时的部署状态快照。

## ManagedDeploymentMutationOperation

```ts
type ManagedDeploymentMutationOperation =
  | { type: 'moveDeployment'; modKey: string; from: string; to: string; expectedHash?: string }
  | { type: 'adoptDeployment'; modKey: string; from: string; to: string; expectedHash?: string }
  | { type: 'setModMetadata'; modKey: string; patch: Record<string, unknown> }
```

可提交的三种变更操作。

## ManagedDeploymentMutationOptions

```ts
type ManagedDeploymentMutationOptions = {
  modType?: string
  includeCurrentHashes?: boolean            // @deprecated 用下面两个细粒度开关
  includeManagedCurrentHashes?: boolean
  includeGameFileHashes?: boolean
  includeGameFiles?: { directories?: string[]; extensions?: string[] }
}
```

快照过滤与包含选项，按需开启以控制快照大小。

## ManagedDeploymentMutationResult

```ts
type ManagedDeploymentMutationResult = {
  ok: boolean
  applied: number
  warnings: Array<{ message: string; details?: Record<string, unknown> }>
}
```

mutation 应用结果：成功与否、实际应用数、警告列表。

## ManagedDeploymentMutation

```ts
type ManagedDeploymentMutation = ManagedDeploymentMutationSnapshot & {
  moveDeployment(input): void
  adoptDeployment(input): void
  setModMetadata(input): void
  warn(message: string, details?: Record<string, unknown>): void
}
```

快照 + 变更收集器：回调内调用操作方法**收集**变更，返回后由基座统一应用。

## ManagedDeploymentHookPhase

```ts
type ManagedDeploymentHookPhase = 'afterEnable' | 'afterDisable' | 'afterUninstall'
```

托管部署钩子触发阶段。用法见
[registerManagedDeploymentHook](/reference/context/registerManagedDeploymentHook)。

## IExtensionVfsApi

```ts
interface IExtensionVfsApi {
  runManagedDeploymentMutation<T = unknown>(
    options: ManagedDeploymentMutationOptions,
    callback: (mutation: ManagedDeploymentMutation) => T | Promise<T>
  ): Promise<ManagedDeploymentMutationResult>
}
```

托管部署变更入口（`api.vfs`）。
