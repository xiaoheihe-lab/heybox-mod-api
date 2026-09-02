# context.api 工具面

> `context.api` 是扩展可调用的宿主能力集合。除本地工具外，其余方法走 RPC 到主线程，
> 只能调用白名单中存在的路径。Proxy 不能枚举或展开。

## 事件总线

`api.events` 是扩展沙箱内的本地事件总线：仅当前扩展自身可见，不与其他扩展互通；
监听者在 Worker 本地执行，不走主线程 RPC。

```ts
api.events.on(eventName, listener)        // 监听
api.events.once(eventName, listener)      // 一次性监听
api.events.removeListener(eventName, listener)
api.events.emit(eventName, ...args)       // 触发，返回是否存在监听者；监听者异步执行
api.emitAndAwait(eventName, ...args)      // 触发并收集所有监听者的非空返回值
api.onAsync(eventName, listener)          // 注册异步监听者（emitAndAwait 会等待）
```

## steam

| 方法 | 说明 |
| --- | --- |
| `findByAppId(appId)` | 按 appid 查找游戏安装路径，未找到返回 `null` |
| `getLaunchOptions(appId)` | 读取所有 Steam 用户针对该游戏的启动参数 |
| `setLaunchOptions(appId, options)` | 写入所有用户的启动参数 |
| `ensureLaunchOptionArgument(appId, argument)` | 确保参数存在：只对缺失该参数的用户追加写入 |
| `clearLaunchOptions(appId)` | 清空所有用户的启动参数 |
| `launchClient()` | 请求 UI 拉起 Steam 客户端 |

详见 [Steam 启动参数](../game/steam-launch-options.md)。

## ui

```ts
const response = await api.util.ui.request({
  type: 'mod_choice',
  title: 'Choose Variant',
  content: '选择要安装的变体',
  choices: [
    { id: 'A/file.patch_0', text: 'A/file.patch_0', value: true },
    { id: 'B/file.patch_0', text: 'B/file.patch_0' },
  ],
  confirm: { text: 'Confirm', type: 'primary' },
  cancel: { text: 'Cancel', type: 'cancel', visible: true },
}, { timeoutMs: 10 * 60 * 1000 })

const choiceId = response.payload?.choiceId
```

- `request` 返回 `{ requestId, action, confirmed, payload }`；Web 不可用时 `action: 'unavailable'`
  且 `confirmed: false`。
- `notify` 是只通知型事件，无响应。
- payload 的 appid 由主线程注入，extension 自报值不能覆盖任务归属。
- 在 installer/tester 中等待 UI 会占用沙箱 callback，务必设置 `timeoutMs` 并处理 cancel/timeout。

## fomod

```ts
await api.util.fomod.requestStep(payload)              // 请求一步选择
api.util.fomod.closeSession(payload)                    // 结束 session
await api.util.fomod.resolveFileDependencies(paths)     // 解析 bundle 内文件依赖
```

- `requestStep` 的 payload 见 `FomodStepRequest`；appid 由基座注入。切换游戏会 suspend 当前
  step，切回后恢复同一 session；close 按 appid/sessionId 清理。
- `resolveFileDependencies` 在 Worker 本地解析当前扩展 bundle 内的文件，返回
  `{ states: Record<path, 'Active' | 'Missing'> }`。

## path / fs

`api.util.path` 是 Node `path` 的同步本地封装：`sep` / `join` / `normalize` / `basename` /
`dirname` / `extname`。

`api.util.fs` 是受限只读文件接口：

```ts
const stat = await api.util.fs.stat(filePath)      // { isFile, isDirectory, size, mtimeMs, ... }
const names = await api.util.fs.readdir(dirPath)
const text = await api.util.fs.readFile(filePath, 'utf8')
```

- `stat`/`readdir`/`readFile` 与 `*Async` 后缀方法等价（历史别名）。
- 路径含 `\0` 会抛错；只能读取，不能写文件。

## archive

| 方法 | 说明 |
| --- | --- |
| `extractZip` / `extractRar` / `extract7z` | 按格式解压，返回相对路径数组；7z 为 solid 压缩，全量解压 |
| `extract` | 按扩展名自动分派 zip/rar/7z |
| `list` | 不解压列出文件树 `{ path, size?, isDirectory }[]` |

- `*Async` 为同实现历史别名。
- 入参必须是绝对路径或可 `path.resolve` 的路径；空串或含 `\0` 抛 `Invalid extension archive <name>`。
- zip 解压做路径穿越防护，非法 entry 抛 `Unsafe zip entry path`。
- `list`：zip/7z 为纯 peek（只读头部）；rar 会退化为解压到临时目录遍历后清理。
- 加密归档（含 `-mhe=on` 加密头）不支持，会立即失败并返回「该压缩包已加密，暂不支持」。

## 其他工具

| 方法 | 说明 |
| --- | --- |
| `GameStoreHelper` | Steam 商店辅助：`findByAppId` / `getGameInfoByAppid` / `initialize` / `refreshStore` |
| `fileParseApi.parseXmlToObject(xml)` | XML 文本 → 普通对象 |
| `sanitizeFilename(name, fallback?)` | 替换非法字符、去尾部点号/空格、规避 Windows 保留设备名 |
| `pathPattern(game, template)` | 路径模板解析（最小实现，仅支持 `{gamePath}`），纯同步本地方法 |

`GameStoreHelper.findByAppId` 内部会自动初始化并刷新商店数据；`getGameInfoByAppid` 是同步缓存读取。

## vfs / loadOrder

```ts
await api.vfs.runManagedDeploymentMutation(options, (mutation) => {
  mutation.moveDeployment({ modKey, from, to, expectedHash? })
  mutation.adoptDeployment({ modKey, from, to, expectedHash? })
  mutation.setModMetadata({ modKey, patch })
  mutation.warn(message, details?)
})

const snapshot = await api.loadOrder.deploy(providerId)
```

详见 [托管部署 Mutation](../vfs/managed-deployment-mutation.md) 与
[加载顺序 Load Order](../vfs/load-order.md)。
