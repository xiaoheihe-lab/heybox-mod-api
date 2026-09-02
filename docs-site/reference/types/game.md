# game 游戏注册域

> 定义位置：`types/game.d.ts`。游戏注册相关类型。

## SteamGameInfo

```ts
interface SteamGameInfo {
  appid: number
  folder_path: string
}
```

Steam 游戏信息：appid 与安装目录。`GameStoreHelper.getGameInfoByAppid` 的返回值。

## IGameStoreHelper

```ts
interface IGameStoreHelper {
  findByAppId(appId: number | string | Array<number | string>): Promise<{ gamePath: string } | null>
  getGameInfoByAppid(appid: number): SteamGameInfo | undefined
  initialize(): Promise<void>
  refreshStore(): Promise<void>
}
```

Steam 游戏商店辅助工具。实例位于 `api.util.GameStoreHelper`。

| 方法 | 说明 |
| --- | --- |
| findByAppId | 按 appid 查找游戏安装路径；内部自动初始化并刷新，未找到返回 null |
| getGameInfoByAppid | 同步读取缓存信息 |
| initialize | 初始化商店数据 |
| refreshStore | 刷新商店数据 |

## LocalModMarkType

```ts
type LocalModMarkType = 'prerequisite' | 'warning' | 'danger' | 'success'
```

标记类型：`prerequisite` 前置、`warning` 警告、`danger` 危险、`success` 成功。

## LocalModMark

```ts
interface LocalModMark {
  type: LocalModMarkType
  label: string
}
```

本地 Mod 列表中的标记（如「前置模组」）。

## LocalModFeature

```ts
interface LocalModFeature {
  modId: number
  pinned?: boolean
  marked?: boolean
  mark?: LocalModMark
}
```

本地 Mod 列表的 extension 声明条目；重复 modId 以后声明为准。

## GameConfig

```ts
interface GameConfig {
  id?: number | string | 'default'
  queryPath: () => string | undefined | Promise<string | undefined>
  steamPrerequisites?: SteamPrerequisiteRegistration[]
  localModFeatures?: LocalModFeature[]
  [key: string]: unknown
}
```

游戏基础描述；id 缺省时由加载流程注入为当前 appid。用法见
[registerGame](/reference/context/registerGame)。
