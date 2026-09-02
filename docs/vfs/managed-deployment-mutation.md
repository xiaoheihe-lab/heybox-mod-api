# 托管部署 Mutation

> 定位：`api.vfs.runManagedDeploymentMutation` 面向**当前已部署文件**的事务式变更；
> 它与 [加载顺序 Load Order](load-order.md)（面向全部注册 Mod）的数据来源、时机和回滚语义不同，
> 不能互相替代。

## 类型契约

```ts
type ManagedDeploymentEntry = {
  modKey: string
  modId?: number
  fileId?: number
  versionId?: number
  modType?: string
  targetPath: string        // 相对游戏根目录
  absolutePath: string
  expectedHash: string
  currentHash?: string | null
  exists?: boolean
  metaInfo?: any
}

type ManagedDeploymentMutationSnapshot = {
  gamePath: string
  entries: ManagedDeploymentEntry[]
  gameFiles?: ManagedDeploymentGameFile[]
}

type ManagedDeploymentMutation = ManagedDeploymentMutationSnapshot & {
  moveDeployment(input: { modKey, from, to, expectedHash? }): void
  adoptDeployment(input: { modKey, from, to, expectedHash? }): void
  setModMetadata(input: { modKey, patch }): void
  warn(message: string, details?: Record<string, unknown>): void
}

type ManagedDeploymentMutationResult = {
  ok: boolean
  applied: number
  warnings: Array<{ message: string; details?: Record<string, unknown> }>
}
```

## 事务语义

`runManagedDeploymentMutation` 是事务式入口：

1. 基座创建当前部署快照并传给回调。
2. 回调内调用 mutation 方法**收集操作**（moveDeployment / adoptDeployment / setModMetadata / warn）。
3. 回调返回后，基座**统一应用**所有操作并返回 `ManagedDeploymentMutationResult`。

```ts
await context.api.vfs.runManagedDeploymentMutation({ modType: 'pak' }, (mutation) => {
  mutation.moveDeployment({
    modKey,
    from: 'Content/Paks/a.pak',
    to: 'Content/Paks/~mods/a.pak',
    expectedHash: mutation.entries[0].expectedHash,
  })
  mutation.warn('custom-path collision resolved')
})
```

## 操作语义

| 操作 | 含义 |
| --- | --- |
| `moveDeployment` | 把托管文件从 `from` 移动到 `to`；`expectedHash` 用于校验当前内容，不匹配则拒绝 |
| `adoptDeployment` | 把游戏目录中已有文件接纳为托管部署（`from` → `to` 并纳入管理） |
| `setModMetadata` | 更新 mod 元数据补丁 |
| `warn` | 记录警告，随结果返回 |

## 选项

```ts
type ManagedDeploymentMutationOptions = {
  modType?: string
  includeCurrentHashes?: boolean            // @deprecated 用下面两个细粒度开关
  includeManagedCurrentHashes?: boolean
  includeGameFileHashes?: boolean
  includeGameFiles?: { directories?: string[]; extensions?: string[] }
}
```

用于控制快照中包含哪些文件与哈希信息，按需开启以控制快照大小。
