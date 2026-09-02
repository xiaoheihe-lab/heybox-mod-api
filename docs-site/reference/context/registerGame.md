# registerGame

> 在 `main` 中最先调用：声明这个扩展负责哪款游戏。基座据此建立游戏上下文。

## 签名

```ts
registerGame(config: GameConfig): void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| config | [GameConfig](/reference/types/game#gameconfig) | 游戏基础描述；id 缺省时由加载流程注入当前 appid |

`GameConfig` 关键字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | `number \| string \| 'default'` | Steam appid；default 扩展写 `'default'`，基座绑定到真实 appid |
| queryPath | `() => string \| undefined \| Promise<...>` | 解析游戏安装路径；`undefined` 表示当前环境未安装 |
| steamPrerequisites | [SteamPrerequisiteRegistration[]](/reference/types/steam-prerequisite#steamprerequisiteregistration) | Steam 前置条件（官方工具 DLC）声明 |
| localModFeatures | [LocalModFeature[]](/reference/types/game#localmodfeature) | 本地 Mod 列表标记；重复 modId 以后声明为准 |
| ... | `[key: string]: unknown` | 可透传 name / executable / setup / details 等游戏描述字段 |

## 返回值

无。注册函数不返回结果，失败通过异常反馈。

## 运行流程

1. Worker 内把 `config` 序列化（函数字段转成 callback 引用）发给主线程。
2. 主线程解析 gameId：default 扩展或 `id === 'default'` 时绑定当前 `loadingAppId`，否则用 `config.id`。
3. 建立该游戏的 `GameContext`，后续 `registerModType` / `registerInstaller` 都挂到它名下。
4. `queryPath` 在发现游戏、打开游戏页时被调用，用于判断游戏是否已安装。

扩展本身的解析顺序（由基座决定，与 registerGame 无关）：developer 路径 > 远端配置 > 本地 `extensions/${appid}.cjs` > `extensions/default.cjs`。

## 意义

`registerGame` 是扩展与基座交互的起点：没有它，基座不知道这个扩展为谁服务，其他注册都会落空。

## 应用场景

- **普通游戏扩展**：写真实 Steam appid，`queryPath` 走 `GameStoreHelper.findByAppId`。
- **default 兜底扩展**：`id` 写 `'default'`，适用于没有专用扩展的游戏。
- **声明前置条件**：如 Cyberpunk 2077 用 `steamPrerequisites` 声明 REDmod DLC。
- **本地列表标记**：如 `localModFeatures` 把 BepInEx 桥接包标记为「前置模组」。

## 相关类型

- [GameConfig](/reference/types/game#gameconfig) / [SteamGameInfo](/reference/types/game#steamgameinfo)
- [SteamPrerequisiteRegistration](/reference/types/steam-prerequisite#steamprerequisiteregistration)
- [LocalModFeature](/reference/types/game#localmodfeature)
