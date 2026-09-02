# load-order 加载顺序域

> 定义位置：`types/load-order.d.ts`。加载顺序相关类型。用法见
> [registerLoadOrder](/reference/context/registerLoadOrder) 与
> [vfs 与 loadOrder](/reference/api/vfs-loadorder)。

## LoadOrderReason

```ts
type LoadOrderReason =
  | 'open' | 'refresh' | 'user-save' | 'manual-deploy'
  | 'after-enable' | 'after-disable' | 'after-uninstall' | 'after-reconfigure'
```

触发加载顺序交互的原因。

## LoadOrderDeploymentStatus

```ts
type LoadOrderDeploymentStatus = 'clean' | 'dirty' | 'deploying' | 'failed'
```

部署状态：clean 干净、dirty 待部署、deploying 部署中、failed 失败。

## LoadOrderModSnapshot

```ts
interface LoadOrderModSnapshot {
  modKey: string
  modId?: number
  fileId?: number
  versionId?: number
  modType?: string
  enabled: boolean
  metaInfo: Record<string, unknown>
}
```

参与加载顺序的单个 Mod 快照。

## LoadOrderContext

```ts
interface LoadOrderContext {
  appid: number
  gameId: number
  gamePath: string
  revision: number
  reason: LoadOrderReason
  savedOrder: string[]
  mods: LoadOrderModSnapshot[]
}
```

加载顺序钩子上下文；`revision` 为乐观锁修订号。

## LoadOrderEntry

```ts
interface LoadOrderEntry {
  id: string
  ownerModKey: string
  name: string
  enabled: boolean
  data?: Record<string, unknown>
}
```

一个加载顺序条目；`id` 稳定且在 provider 内唯一，`data` 为扩展私有（不发 Web）。

## LoadOrderRegistration

```ts
interface LoadOrderRegistration {
  id: string
  gameId: number | string
  title: string
  usageInstructions?: string | string[]
  modTypes: string[]
  isModRelevant?(mod: LoadOrderModSnapshot): boolean | Promise<boolean>
  deserializeLoadOrder(context: LoadOrderContext): LoadOrderEntry[] | Promise<LoadOrderEntry[]>
  validate?(previous: LoadOrderEntry[], current: LoadOrderEntry[], context: LoadOrderContext): void | Promise<void>
  serializeLoadOrder(entries: LoadOrderEntry[], context: LoadOrderContext): void | Promise<void>
  onDidDeploy?(entries: LoadOrderEntry[], context: LoadOrderContext): void | Promise<void>
}
```

provider 注册配置。各钩子职责见 [registerLoadOrder](/reference/context/registerLoadOrder)。

## LoadOrderPersistedError / LoadOrderPersistedState

```ts
interface LoadOrderPersistedError {
  code: string
  message: string
}

interface LoadOrderPersistedState {
  schemaVersion: 1
  revision: number
  orderedEntryIds: string[]
  appliedRevision?: number
  deploymentStatus: LoadOrderDeploymentStatus
  lastError?: LoadOrderPersistedError
  updatedAt: string
}
```

持久化的错误与状态（基座维护，extension 一般只读）。

## LoadOrderSnapshot

```ts
interface LoadOrderSnapshot {
  supported: boolean
  providers: LoadOrderProviderSummary[]
  providerId?: string
  revision: number
  entries: LoadOrderUiEntry[]
  deploymentStatus: LoadOrderDeploymentStatus
  appliedRevision?: number
  lastError?: LoadOrderPersistedError
}
```

`loadOrder.deploy` 的返回快照。
