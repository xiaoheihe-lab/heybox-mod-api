# GameConfig 游戏注册

> 游戏基础描述；id 缺省时由加载流程注入为当前 appid。

## 类型契约

```ts
interface GameConfig {
  id?: number | string | 'default'
  queryPath: () => string | undefined | Promise<string | undefined>
  steamPrerequisites?: SteamPrerequisiteRegistration[]
  localModFeatures?: LocalModFeature[]
  [key: string]: unknown
}
```

## 字段语义

### id

- 正常 extension 写 Steam appid。
- default extension 写 `'default'`，基座注册时绑定到当前 `loadingAppId`。

### queryPath

解析游戏安装路径。返回 `undefined` 表示当前环境未安装该游戏。典型实现：

```ts
queryPath: async () =>
  (await context.api.util.GameStoreHelper.findByAppId(GAME_ID))?.gamePath,
```

### steamPrerequisites

Steam 前置条件声明（如官方工具 DLC），见 [Steam 前置条件](steam-prerequisites.md)。

### localModFeatures

本地 Mod 列表的 extension 声明；**重复 modId 以后声明为准**：

```ts
interface LocalModFeature {
  modId: number
  pinned?: boolean
  marked?: boolean
  mark?: LocalModMark   // { type: 'prerequisite' | 'warning' | 'danger' | 'success', label: string }
}
```

典型用途：把「前置模组」标记到本地 Mod 列表：

```ts
localModFeatures: [{
  modId: Number(MELON_BEPINEX_BRIDGE_MOD_ID),
  marked: true,
  mark: { type: 'prerequisite', label: '前置模组' },
}],
```

### 其他字段

`[key: string]: unknown` 允许透传 `name`、`shortName`、`executable`、`requiredFiles`、
`setup`、`environment`、`details` 等游戏描述字段，由基座按需读取。
