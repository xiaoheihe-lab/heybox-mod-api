# Steam 启动参数

> 启动参数按「Steam 用户」维度存储（localconfig.vdf），每个用户一条记录。

## 类型契约

```ts
interface IExtensionSteamLaunchOptionsEntry {
  userId: string
  localConfigPath: string
  launchOptions: string
}

interface IExtensionSteamLaunchOptionFailure {
  userId: string
  localConfigPath: string
  message: string
}

interface IExtensionSteamEnsureLaunchOptionResult {
  entries: IExtensionSteamLaunchOptionsEntry[]
  updatedUserIds: string[]
  failures: IExtensionSteamLaunchOptionFailure[]
}
```

## API 行为

| 方法 | 行为 |
| --- | --- |
| `getLaunchOptions(appId)` | 读取所有 Steam 用户针对该游戏的启动参数，返回条目数组 |
| `setLaunchOptions(appId, options)` | 写入该游戏在所有用户下的启动参数，返回写入后的条目数组 |
| `ensureLaunchOptionArgument(appId, argument)` | 对所有**缺失该参数**的用户追加写入；已存在的用户不动 |
| `clearLaunchOptions(appId)` | 清空该游戏在所有用户下的启动参数 |
| `launchClient()` | 请求 Mod 管理器 UI 拉起 Steam 客户端 |

## ensure 语义

`ensureLaunchOptionArgument` 是幂等的「确保参数存在」操作：

- 返回值 `entries`：写入后的全部条目。
- `updatedUserIds`：本次实际被更新的用户。
- `failures`：读写失败的用户及错误信息（单个用户失败不中断其他用户）。

典型用途：为特定 Mod 环境（如 REDmod）确保 `-modded` 之类的启动参数在所有用户配置中存在。
