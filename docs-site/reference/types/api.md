# api 门面工具域

> 定义位置：`types/api.d.ts`。`IExtensionApi` 及其工具子面。总览见各
> [工具面 API](/reference/api/events) 页面，此处按类型逐一说明。

## IExtensionApi

```ts
interface IExtensionApi {
  events: IExtensionEventApi
  emitAndAwait<T = any>(eventName: string, ...args: any[]): Promise<T[]>
  onAsync(eventName: string, listener: (...args: any[]) => PromiseLike<any> | any): void
  vfs: IExtensionVfsApi
  loadOrder: { deploy(providerId: string): Promise<LoadOrderSnapshot> }
  util: { GameStoreHelper; steam; ui; fomod; path; fs; archive; fileParseApi; sanitizeFilename; pathPattern }
}
```

受限门面：除 events/path/sanitizeFilename/pathPattern 等本地工具外，其余方法走 RPC 由主线程白名单解析。

## IExtensionEventApi

```ts
interface IExtensionEventApi {
  on(eventName: string, listener: ExtensionEventListener): void
  once(eventName: string, listener: ExtensionEventListener): void
  removeListener(eventName: string, listener: ExtensionEventListener): void
  emit(eventName: string, ...args: any[]): boolean
}
```

扩展沙箱内本地事件总线。用法见 [events](/reference/api/events)。

## ExtensionEventListener

```ts
type ExtensionEventListener = (...args: any[]) => unknown
```

事件监听器签名。

## IExtensionPathApi

```ts
interface IExtensionPathApi {
  sep: string
  join(...segments: unknown[]): string
  normalize(filePath: unknown): string
  basename(filePath: unknown, ext?: unknown): string
  dirname(filePath: unknown): string
  extname(filePath: unknown): string
}
```

Node `path` 的同步本地封装。用法见 [path 与 fs](/reference/api/path-fs)。

## IExtensionFsApi / IExtensionFsStats

```ts
interface IExtensionFsApi {
  stat(filePath: unknown): Promise<IExtensionFsStats>
  readdir(filePath: unknown): Promise<string[]>
  readFile(filePath: unknown, options?: ExtensionFsReadFileOptions): Promise<ExtensionFsReadFileResult>
  statAsync(filePath: unknown): Promise<IExtensionFsStats>
  readdirAsync(filePath: unknown): Promise<string[]>
  readFileAsync(filePath: unknown, options?: ExtensionFsReadFileOptions): Promise<ExtensionFsReadFileResult>
}

interface IExtensionFsStats {
  isFile: boolean
  isDirectory: boolean
  isSymbolicLink: boolean
  size: number
  mtimeMs: number
  ctimeMs: number
  birthtimeMs: number
}
```

受限只读文件接口；`*Async` 为同实现历史别名。

## ExtensionFsReadFileOptions / ExtensionFsReadFileResult

```ts
type ExtensionFsReadFileOptions = BufferEncoding | { encoding?: BufferEncoding | null } | null
type ExtensionFsReadFileResult = string | Buffer
```

`readFile` 的选项与返回类型。

## IExtensionArchiveApi / IExtensionArchiveEntry

```ts
interface IExtensionArchiveEntry {
  path: string
  size?: number
  isDirectory: boolean
}

interface IExtensionArchiveApi {
  extractZip(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  extractZipAsync(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  extractRar(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  extractRarAsync(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  extract7z(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  extract7zAsync(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  extract(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  extractAsync(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  list(archivePath: unknown): Promise<IExtensionArchiveEntry[]>
  listAsync(archivePath: unknown): Promise<IExtensionArchiveEntry[]>
}
```

压缩包解压/列目录接口；`*Async` 为历史别名。用法见 [archive](/reference/api/archive)。

## IExtensionFileParseApi

```ts
interface IExtensionFileParseApi {
  parseXmlToObject(xml: unknown): Promise<Record<string, unknown>>
}
```

XML 文本 → 普通对象。

## Steam 相关类型

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

启动参数条目、失败信息与 ensure 结果。用法见 [steam](/reference/api/steam)。

## UI 相关类型

```ts
interface IExtensionUiRequestPayload {
  type?: string
  title?: string
  content?: string
  choices?: Array<{
    id: string
    text?: string
    description?: string
    value?: boolean
    disabled?: boolean
    level?: number
    selectMode?: 'single' | 'checkbox' | 'radio' | 'none'
    groupId?: string
    payload?: unknown
  }>
  choiceMode?: 'single' | 'multiple'
  selectedChoiceIds?: string[]
  defaultChoiceId?: string
  confirm?: { text?: string; type?: string; visible?: boolean }
  cancel?: { text?: string; type?: string; visible?: boolean }
  [key: string]: unknown
}

interface IExtensionUiResponse {
  requestId: string
  action: string
  confirmed: boolean
  payload?: unknown
}

interface IExtensionUiRequestOptions {
  timeoutMs?: number
}
```

弹窗请求负载、响应与选项。用法见 [ui](/reference/api/ui)。
