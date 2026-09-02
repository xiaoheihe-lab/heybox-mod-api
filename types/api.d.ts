/**
 * 门面 API 域：IExtensionApi 及其工具子面（path / fs / archive / events / steam / ui）
 */
import type { FomodExtensionApi } from './fomod'
import type { IGameStoreHelper } from './game'
import type { LoadOrderSnapshot } from './load-order'
import type { IExtensionVfsApi } from './vfs'

/** Extension API - Vortex 兼容接口（简化版） */
export interface IExtensionPathApi {
  sep: string
  join(...segments: unknown[]): string
  normalize(filePath: unknown): string
  basename(filePath: unknown, ext?: unknown): string
  dirname(filePath: unknown): string
  extname(filePath: unknown): string
}

export type ExtensionFsReadFileOptions = BufferEncoding | { encoding?: BufferEncoding | null } | null
export type ExtensionFsReadFileResult = string | Buffer

/** fs.stat 的序列化结果 */
export interface IExtensionFsStats {
  isFile: boolean
  isDirectory: boolean
  isSymbolicLink: boolean
  size: number
  mtimeMs: number
  ctimeMs: number
  birthtimeMs: number
}

/** 受限文件系统读取接口（仅 stat/readdir/readFile；路径含 \0 会抛错） */
export interface IExtensionFsApi {
  stat(filePath: unknown): Promise<IExtensionFsStats>
  readdir(filePath: unknown): Promise<string[]>
  readFile(filePath: unknown, options?: ExtensionFsReadFileOptions): Promise<ExtensionFsReadFileResult>
  statAsync(filePath: unknown): Promise<IExtensionFsStats>
  readdirAsync(filePath: unknown): Promise<string[]>
  readFileAsync(filePath: unknown, options?: ExtensionFsReadFileOptions): Promise<ExtensionFsReadFileResult>
}

/** 压缩包条目 */
export interface IExtensionArchiveEntry {
  path: string
  size?: number
  isDirectory: boolean
}

/** 压缩包解压 / 列目录接口。`*Async` 为同实现的历史别名 */
export interface IExtensionArchiveApi {
  /** 解压 zip */
  extractZip(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  extractZipAsync(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  /** 解压 rar */
  extractRar(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  extractRarAsync(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  /** 解压 7z（solid 压缩，全量解压） */
  extract7z(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  extract7zAsync(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  /** 按扩展名自动分派到 zip/rar/7z 解压 */
  extract(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  extractAsync(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  /** 不解压列出文件树（zip/7z 为纯 peek；rar 会退化为解压到临时目录遍历） */
  list(archivePath: unknown): Promise<IExtensionArchiveEntry[]>
  listAsync(archivePath: unknown): Promise<IExtensionArchiveEntry[]>
}

/** 文件解析工具 */
export interface IExtensionFileParseApi {
  /** 将 XML 文本解析为普通对象 */
  parseXmlToObject(xml: unknown): Promise<Record<string, unknown>>
}

export type ExtensionEventListener = (...args: any[]) => unknown

/**
 * 扩展沙箱内的事件总线：仅当前扩展自身可见，不与其他扩展互通。
 * 所有监听在 Worker 本地执行，不走主线程 RPC。
 */
export interface IExtensionEventApi {
  on(eventName: string, listener: ExtensionEventListener): void
  once(eventName: string, listener: ExtensionEventListener): void
  removeListener(eventName: string, listener: ExtensionEventListener): void
  /** 触发事件并返回是否存在监听者；监听者异步执行 */
  emit(eventName: string, ...args: any[]): boolean
}

/** 单个 Steam 用户的启动参数条目 */
export interface IExtensionSteamLaunchOptionsEntry {
  userId: string
  localConfigPath: string
  launchOptions: string
}

/** 单个 Steam 用户启动参数写入失败的信息 */
export interface IExtensionSteamLaunchOptionFailure {
  userId: string
  localConfigPath: string
  message: string
}

/** ensureLaunchOptionArgument 的结果：写入后的全部条目、实际更新的用户、失败项 */
export interface IExtensionSteamEnsureLaunchOptionResult {
  entries: IExtensionSteamLaunchOptionsEntry[]
  updatedUserIds: string[]
  failures: IExtensionSteamLaunchOptionFailure[]
}

/** ui.request 的弹窗请求负载；appid 由基座注入，extension 自报值不生效 */
export interface IExtensionUiRequestPayload {
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

/** ui.request 的响应；Web 不可用时 action 为 'unavailable' 且 confirmed 为 false */
export interface IExtensionUiResponse {
  requestId: string
  action: string
  confirmed: boolean
  payload?: unknown
}

export interface IExtensionUiRequestOptions {
  /** 等待用户操作的超时；installer/tester 中等待 UI 会占用沙箱回调，建议显式设置 */
  timeoutMs?: number
}

/**
 * 受限门面：扩展只能调用此处声明的能力。
 * 除 events/path/sanitizeFilename/pathPattern 等本地工具外，其余方法走 RPC 由主线程白名单解析。
 */
export interface IExtensionApi {
  /** 扩展沙箱内的本地事件总线 */
  events: IExtensionEventApi
  /** 触发事件并收集所有监听者的非空返回值 */
  emitAndAwait<T = any>(eventName: string, ...args: any[]): Promise<T[]>
  /** 注册异步监听者（emitAndAwait 会等待其完成） */
  onAsync(eventName: string, listener: (...args: any[]) => PromiseLike<any> | any): void
  /** 托管部署变更 */
  vfs: IExtensionVfsApi
  /** 加载顺序部署 */
  loadOrder: {
    /** 触发指定 load order provider 的序列化与部署，返回部署后的快照 */
    deploy(providerId: string): Promise<LoadOrderSnapshot>
  }
  util: {
    GameStoreHelper: IGameStoreHelper
    steam: {
      /** 按 appid 查找游戏路径（等价于 GameStoreHelper.findByAppId） */
      findByAppId(appId: string | number): Promise<{ gamePath: string } | null>
      /** 读取所有 Steam 用户针对该游戏的启动参数 */
      getLaunchOptions(appId: string | number): Promise<IExtensionSteamLaunchOptionsEntry[]>
      /** 写入该游戏在所有用户下的启动参数 */
      setLaunchOptions(appId: string | number, launchOptions: string): Promise<IExtensionSteamLaunchOptionsEntry[]>
      /** 确保参数存在：对所有缺失该参数的用户追加写入，返回更新情况 */
      ensureLaunchOptionArgument(appId: string | number, argument: string): Promise<IExtensionSteamEnsureLaunchOptionResult>
      /** 清空该游戏在所有用户下的启动参数 */
      clearLaunchOptions(appId: string | number): Promise<IExtensionSteamLaunchOptionsEntry[]>
      /** 请求 Mod 管理器 UI 拉起 Steam 客户端 */
      launchClient(): Promise<IExtensionUiResponse>
    }
    ui: {
      /** 向 Web 发起弹窗询问；需设置 timeoutMs 并处理 cancel/close/timeout */
      request(payload: IExtensionUiRequestPayload, options?: IExtensionUiRequestOptions): Promise<IExtensionUiResponse>
      /** 只通知型 UI 事件，无响应 */
      notify(payload: IExtensionUiRequestPayload): void
    }
    /** FOMOD 安装器 UI */
    fomod: FomodExtensionApi
    path: IExtensionPathApi
    fs: IExtensionFsApi
    archive: IExtensionArchiveApi
    fileParseApi: IExtensionFileParseApi
    /** 清洗文件名：替换非法字符、去除尾部点号/空格、规避 Windows 保留设备名 */
    sanitizeFilename(name: unknown, fallback?: string): string
    /**
     * Vortex 常用的路径模板解析（最小实现：仅支持 {gamePath}）
     * @param game 至少需要包含 gamePath
     * @param template 形如 \"{gamePath}/mods\"
     */
    pathPattern: (game: { gamePath?: string }, template: string) => string
  }
}
