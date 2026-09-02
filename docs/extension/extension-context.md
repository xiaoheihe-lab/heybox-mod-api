# IExtensionContext 门面

> 受限门面：扩展只能调用此处声明的能力，禁止访问 ExtensionManager / HeyboxModManager。
> 每个注册函数的函数体留在 Worker 沙箱内，由主线程通过 callback proxy 调用。

## 生命周期注册

### registerGame

```ts
registerGame(config: GameConfig): void
```

注册扩展负责的游戏，`main` 中最先调用。详见 [GameConfig 游戏注册](../game/game-config.md)。

### registerModType

```ts
// 简式：为特定游戏声明 Mod 类型
registerModType(gameId: number, typeId: string, rule: ModTypeRule): void

// Vortex 风格：声明目标路径与文件判定
registerModType(
  typeId: string,
  priority: number,
  isSupported: (gameId: number | string) => boolean,
  getTargetPath: (game: { gamePath?: string }) => string,
  test: (...args: unknown[]) => boolean | Promise<boolean>,
  options?: VortexRegisterModTypeOptions,
): void
```

- `priority` 数值越大越优先。
- `getTargetPath` 返回目标路径模板，支持 `{gamePath}` 占位符。
- `options.name` 为显示名。

### registerInstaller

```ts
registerInstaller(typeId: string, priority: number, test: InstallerTest, install: InstallerInstall): void
```

与同 `typeId` 的 modType 绑定。启用 Mod 时基座按 priority 依次调用 `test(files, gameId)`，
第一个命中的 installer 的 `install(...)` 生成安装指令。详见
[ModType 与 installer](../installers/installer-and-modtype.md)。

## 属性与钩子

### registerAttributeExtractor

```ts
registerAttributeExtractor(priority: number, extractor: AttributeExtractor): void
```

Vortex 风格：从 `(modInfo, modPath)` 抽取属性，结果合并进 Mod 属性。

### registerPostInstallerAttributeExtractor

```ts
registerPostInstallerAttributeExtractor(priority: number, extractor: PostInstallerAttributeExtractor): void
```

在 installer 返回、VFS 执行前运行，从最终选中的文件集合产出 Mod 属性。详见
[Post-installer 属性抽取](../installers/post-installer-attributes.md)。

### registerManagedDeploymentHook

```ts
registerManagedDeploymentHook(
  phase: 'afterEnable' | 'afterDisable' | 'afterUninstall',
  options: { modType?: string },
  callback: (payload: Record<string, unknown>) => unknown | Promise<unknown>,
): void
```

托管部署生命周期钩子。`options.modType` 可限定只处理指定类型；回调失败会中断对应阶段。

### registerLoadOrder

```ts
registerLoadOrder(options: LoadOrderRegistration): void
```

注册加载顺序 provider，详见 [加载顺序 Load Order](../vfs/load-order.md)。

## 动作与兼容

### registerExtensionAction

```ts
registerExtensionAction(gameId: number | string, actionName: string, callback: (...args: unknown[]) => unknown): void
```

注册一个可由 Web 侧按名称调用的扩展动作（如「部署加载顺序」按钮）。

### registerAction

```ts
registerAction(
  group: string,
  position: number,
  iconOrComponent: string | unknown,
  props: Record<string, unknown>,
  titleOrProps?: string | VortexActionPropsCallback,
  actionOrCondition?: VortexActionCallback,
  condition?: VortexActionCondition,
): void
```

> ⚠️ 当前 SDK 仅为 Vortex 兼容**保留签名**，不会注册进 Web 可调用的动作表。
> 需要 Web 可调用时请使用 `registerExtensionAction`。

### once

```ts
once(fn: () => void): void
```

立即执行一次 `fn`，兼容部分 extension 的初始化习惯。已标记 `@deprecated`，建议在扩展内自行控制初始化时机。

### api

```ts
api: IExtensionApi
```

受限宿主能力面，见 [context.api 工具面](extension-api.md)。
