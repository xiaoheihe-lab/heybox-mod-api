# Steam 前置条件

> 通过 `GameConfig.steamPrerequisites` 声明官方工具（如 REDmod DLC）是否已安装，
> 由基座驱动检查与 UI 呈现。

## 类型契约

```ts
interface SteamPrerequisiteRegistration {
  id: string
  steamAppId: number
  presentation: SteamPrerequisitePresentation
  check(context: SteamPrerequisiteCheckContext): boolean | Promise<boolean>
}

interface SteamPrerequisiteCheckContext {
  appid: number
  gameId: number
  gamePath: string
  reason: 'game-open' | 'manual-recheck' | 'view-enter'
}

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

## 行为语义

- `check` 返回 `true` 表示前置条件已安装；在三个时机触发：`game-open`（打开游戏页）、
  `manual-recheck`（手动重新检查）、`view-enter`（进入视图）。
- `presentation` 定义 UI 文案：安装按钮、打开 Steam 页、检查中、未找到、检查失败等各状态文本。
- `steamAppId` 用于跳转 Steam 商店页。

## 示例

```ts
steamPrerequisites: [{
  id: 'cyberpunk-redmod',
  steamAppId: REDMOD_STEAM_APP_ID,
  presentation: {
    title: '安装 REDmod',
    content: 'REDmod 是 Cyberpunk 2077 的免费官方 Mod 工具 DLC。',
    installButtonText: '前往 Steam 安装',
    openingText: '正在打开 Steam…',
    openFailedText: '无法打开 Steam 商店页面，请稍后重试。',
    recheckButtonText: '重新检查',
    checkingText: '正在检查 REDmod…',
    notFoundText: '暂未检测到 REDmod。',
    checkFailedText: '检查 REDmod 时发生错误，请稍后重试。',
  },
  check: async ({ gamePath }) => {
    const stat = await context.api.util.fs.stat(join(gamePath, REDMOD_METADATA))
    return Boolean(stat?.isFile)
  },
}],
```

## 相关 UI 类型

基座侧使用的快照类型（extension 一般不直接构造）：

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
