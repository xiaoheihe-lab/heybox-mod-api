# vfs 与 loadOrder

> 两个「部署级」入口：`vfs.runManagedDeploymentMutation` 面向当前已部署文件的事务式变更；
> `loadOrder.deploy` 面向全部注册 Mod 的加载顺序部署。两者数据来源与时机不同，不能互相替代。

## runManagedDeploymentMutation

```ts
runManagedDeploymentMutation<T = unknown>(
  options: ManagedDeploymentMutationOptions,
  callback: (mutation: ManagedDeploymentMutation) => T | Promise<T>,
): Promise<ManagedDeploymentMutationResult>
```

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| options | [ManagedDeploymentMutationOptions](/reference/types/vfs#manageddeploymentmutationoptions) | 快照过滤与包含选项 |
| callback | `(mutation) => T \| Promise<T>` | 在快照上收集变更的回调 |

回调收到的 [ManagedDeploymentMutation](/reference/types/vfs#manageddeploymentmutation) 包含快照
`{ gamePath, entries, gameFiles? }` 与四个操作方法：

| 方法 | 说明 |
| --- | --- |
| moveDeployment({ modKey, from, to, expectedHash? }) | 移动托管文件；expectedHash 用于校验当前内容 |
| adoptDeployment({ modKey, from, to, expectedHash? }) | 接纳游戏目录已有文件为托管 |
| setModMetadata({ modKey, patch }) | 更新 mod 元数据 |
| warn(message, details?) | 记录警告 |

### 返回

[ManagedDeploymentMutationResult](/reference/types/vfs#manageddeploymentmutationresult)：
`{ ok, applied, warnings }`。

### 运行流程（事务语义）

1. 基座按 options 生成当前部署快照并传入回调。
2. 回调内调用 mutation 方法**只收集操作**。
3. 回调返回后，基座**统一应用**所有操作并返回结果。

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

## loadOrder.deploy

```ts
deploy(providerId: string): Promise<LoadOrderSnapshot>
```

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| providerId | `string` | 目标 provider id（与 [registerLoadOrder](/reference/context/registerLoadOrder) 的 id 一致） |

### 返回

[LoadOrderSnapshot](/reference/types/load-order#loadordersnapshot)：
`{ supported, providers, providerId?, revision, entries, deploymentStatus, appliedRevision?, lastError? }`。

### 运行流程

1. 进入该 provider 的串行部署队列（不会与另一次部署重叠）。
2. 依次执行 deserialize → validate → serialize 链。
3. 成功后持久化 `deploymentStatus: 'clean'` 并调用 `onDidDeploy`（错误仅记日志）。

## 意义与应用场景

- **自定义路径迁移**：Mod 作者改版后文件落点变化，用 moveDeployment 平滑迁移。
- **文件收养**：把用户手动放进游戏目录的文件纳入管理（adoptDeployment）。
- **手动部署**：Web 按钮 → `api.loadOrder.deploy` 立即把当前顺序写回游戏。

## 相关类型

- [ManagedDeploymentMutation](/reference/types/vfs#manageddeploymentmutation)
- [ManagedDeploymentMutationResult](/reference/types/vfs#manageddeploymentmutationresult)
- [LoadOrderSnapshot](/reference/types/load-order#loadordersnapshot)
