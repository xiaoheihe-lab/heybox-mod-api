# steam-prerequisite 前置条件域

> 定义位置：`types/steam-prerequisite.d.ts`。Steam 前置条件（官方工具 DLC）相关类型。
> 通过 [GameConfig.steamPrerequisites](/reference/types/game#gameconfig) 声明。

## SteamPrerequisiteCheckReason

```ts
type SteamPrerequisiteCheckReason = 'game-open' | 'manual-recheck' | 'view-enter'
```

触发检查的原因。

## SteamPrerequisitePresentation

```ts
interface SteamPrerequisitePresentation {
  title: string
  content: string
  imageUrl?: string
  installButtonText: string
  openingText: string
  openFailedText: string
  recheckButtonText: string
  checkingText: string
  notFoundText: string
  checkFailedText: string
}
```

前置条件在 UI 中的文案与按钮配置。

## SteamPrerequisiteCheckContext

```ts
interface SteamPrerequisiteCheckContext {
  appid: number
  gameId: number
  gamePath: string
  reason: SteamPrerequisiteCheckReason
}
```

`check` 回调的上下文。

## SteamPrerequisiteRegistration

```ts
interface SteamPrerequisiteRegistration {
  id: string
  steamAppId: number
  presentation: SteamPrerequisitePresentation
  check(context: SteamPrerequisiteCheckContext): boolean | Promise<boolean>
}
```

前置条件注册项；`check` 返回 `true` 表示已安装。

## 基座侧快照类型

```ts
type SteamPrerequisiteStatus = 'installed' | 'missing' | 'error'

interface SteamPrerequisiteUiItem {
  id: string
  steamAppId: number
  storeUrl: string
  presentation: SteamPrerequisitePresentation
  status: SteamPrerequisiteStatus
}

interface SteamPrerequisiteSnapshot {
  supported: boolean
  appid: number
  reason: SteamPrerequisiteCheckReason
  prerequisites: SteamPrerequisiteUiItem[]
}
```

extension 一般不直接构造，仅供了解 UI 数据结构。
