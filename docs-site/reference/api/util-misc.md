# 其他工具

> `api.util` 下剩余的通用工具：商店辅助、XML 解析、文件名清洗、路径模板。

## GameStoreHelper

```ts
findByAppId(appId: number | string | Array<number | string>): Promise<{ gamePath: string } | null>
getGameInfoByAppid(appid: number): SteamGameInfo | undefined
initialize(): Promise<void>
refreshStore(): Promise<void>
```

| 方法 | 说明 |
| --- | --- |
| findByAppId | 按 appid 查找游戏安装路径；内部自动初始化并刷新商店数据 |
| getGameInfoByAppid | **同步**返回缓存的 Steam 游戏信息（初始化前可能为 undefined） |
| initialize | 初始化商店数据 |
| refreshStore | 刷新商店数据 |

返回类型见 [SteamGameInfo](/reference/types/game#steamgameinfo)。

## fileParseApi

```ts
parseXmlToObject(xml: unknown): Promise<Record<string, unknown>>
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| xml | `unknown` | XML 文本 |

返回：解析后的普通对象。

## sanitizeFilename

```ts
sanitizeFilename(name: unknown, fallback?: string): string
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | `unknown` | 待清洗的文件名 |
| fallback | `string` | 清洗结果为空时的回退（默认 `'unnamed'`） |

清洗规则：替换 `<>:"/\|?*` 等非法字符、去除尾部点号与空格、连续空白折叠、规避 Windows
保留设备名（con/prn/aux/nul/com1-9/lpt1-9 前缀加下划线）。**纯本地同步方法**。

## pathPattern

```ts
pathPattern(game: { gamePath?: string }, template: string): string
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| game | `{ gamePath?: string }` | 至少包含 gamePath |
| template | `string` | 形如 `'{gamePath}/mods'` |

把模板中的 `{gamePath}` 替换为实际路径。**纯本地同步方法**，最小实现仅支持 `{gamePath}`。

## 运行流程与意义

- `GameStoreHelper`、`fileParseApi` 经 RPC 到主线程执行。
- `sanitizeFilename`、`pathPattern` 是纯字符串运算，Worker 本地同步返回，
  因此可以在 `getTargetPath` 等同步注册函数内直接调用。

## 应用场景

- **Mod 名 → 安全目录名**：用户上传的压缩包名可能含非法字符，落盘前用 `sanitizeFilename`。
- **目标路径模板**：`getTargetPath` 返回 `pathPattern(game, '{gamePath}/Mods')`。
- **读 mod 元数据**：XML 格式的 manifest 用 `parseXmlToObject` 转对象。

## 相关类型

- [IGameStoreHelper](/reference/types/game#igamestorehelper)
- [SteamGameInfo](/reference/types/game#steamgameinfo)
- [IExtensionFileParseApi](/reference/types/api#iextensionfileparseapi)
