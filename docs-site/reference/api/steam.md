# steam 启动与游戏

> `api.util.steam` 负责 Steam 维度能力：游戏路径查找、启动参数读写、拉起客户端。

## 方法总览

| 方法 | 说明 |
| --- | --- |
| findByAppId | 按 appid 查找游戏安装路径 |
| getLaunchOptions | 读取所有 Steam 用户的启动参数 |
| setLaunchOptions | 写入所有用户的启动参数 |
| ensureLaunchOptionArgument | 确保参数存在（幂等追加） |
| clearLaunchOptions | 清空所有用户的启动参数 |
| launchClient | 请求 UI 拉起 Steam 客户端 |

## findByAppId

```ts
findByAppId(appId: string | number): Promise<{ gamePath: string } | null>
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| appId | `string \| number` | Steam appid |

返回：`Promise<{ gamePath: string } | null>`，未找到为 `null`。等价于
`api.util.GameStoreHelper.findByAppId`（内部会自动初始化并刷新商店数据）。

## getLaunchOptions / setLaunchOptions / clearLaunchOptions

```ts
getLaunchOptions(appId: string | number): Promise<IExtensionSteamLaunchOptionsEntry[]>
setLaunchOptions(appId: string | number, launchOptions: string): Promise<IExtensionSteamLaunchOptionsEntry[]>
clearLaunchOptions(appId: string | number): Promise<IExtensionSteamLaunchOptionsEntry[]>
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| appId | `string \| number` | Steam appid |
| launchOptions | `string` | 要写入的启动参数串 |

返回：[IExtensionSteamLaunchOptionsEntry[]](/reference/types/api#iextensionsteamlaunchoptionsentry)：
每个 Steam 用户一条 `{ userId, localConfigPath, launchOptions }`。

## ensureLaunchOptionArgument

```ts
ensureLaunchOptionArgument(
  appId: string | number,
  argument: string,
): Promise<IExtensionSteamEnsureLaunchOptionResult>
```

**幂等语义**：对所有**缺失该参数**的用户追加写入；已存在的用户不动。

返回 [IExtensionSteamEnsureLaunchOptionResult](/reference/types/api#iextensionsteamensurelaunchoptionresult)：

| 字段 | 说明 |
| --- | --- |
| entries | 写入后的全部条目 |
| updatedUserIds | 本次实际被更新的用户 |
| failures | 读写失败的用户及错误信息（单个失败不中断其他用户） |

## launchClient

```ts
launchClient(): Promise<IExtensionUiResponse>
```

无参数。发起「拉起 Steam 客户端」的 UI 请求，返回 [IExtensionUiResponse](/reference/types/api#iextensionuiresponse)。

## 运行流程

1. 所有方法经 RPC 转发主线程，主线程操作 Steam 本地配置文件（按用户维度存储）。
2. 返回条目按用户展开；多用户环境一次调用覆盖全部用户。

## 意义与应用场景

- **游戏路径发现**：`findByAppId` 是 `queryPath` 的标准实现。
- **前置工具注入参数**：如 REDmod 需要 `-modded` 启动参数 → `ensureLaunchOptionArgument` 幂等写入。
- **一键启动**：Web 按钮 → `launchClient` 拉起 Steam。

## 相关类型

- [IExtensionSteamLaunchOptionsEntry](/reference/types/api#iextensionsteamlaunchoptionsentry)
- [IExtensionSteamEnsureLaunchOptionResult](/reference/types/api#iextensionsteamensurelaunchoptionresult)
- [IExtensionSteamLaunchOptionFailure](/reference/types/api#iextensionsteamlaunchoptionfailure)
