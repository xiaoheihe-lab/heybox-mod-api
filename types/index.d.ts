/**
 * 扩展门面与游戏配置类型（第三方扩展仅通过 IExtensionContext 与基座交互）
 */

/** Steam 游戏信息 */
export interface SteamGameInfo {
  appid: number
  folder_path: string
}

/** GameStoreHelper - Steam 游戏商店辅助工具 */
export interface IGameStoreHelper {
  findByAppId(appId: number | string | Array<number | string>): Promise<{ gamePath: string } | null>
  getGameInfoByAppid(appid: number): SteamGameInfo | undefined
  initialize(): Promise<void>
  refreshStore(): Promise<void>
}

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

export interface IExtensionFsStats {
  isFile: boolean
  isDirectory: boolean
  isSymbolicLink: boolean
  size: number
  mtimeMs: number
  ctimeMs: number
  birthtimeMs: number
}

export interface IExtensionFsApi {
  stat(filePath: unknown): Promise<IExtensionFsStats>
  readdir(filePath: unknown): Promise<string[]>
  readFile(filePath: unknown, options?: ExtensionFsReadFileOptions): Promise<ExtensionFsReadFileResult>
  statAsync(filePath: unknown): Promise<IExtensionFsStats>
  readdirAsync(filePath: unknown): Promise<string[]>
  readFileAsync(filePath: unknown, options?: ExtensionFsReadFileOptions): Promise<ExtensionFsReadFileResult>
}

export interface IExtensionArchiveApi {
  extractZip(archivePath: unknown, destinationPath: unknown): Promise<string[]>
  extractZipAsync(archivePath: unknown, destinationPath: unknown): Promise<string[]>
}

export interface IExtensionFileParseApi {
  parseXmlToObject(xml: unknown): Promise<Record<string, unknown>>
}

export type ExtensionEventListener = (...args: any[]) => unknown

export interface IExtensionEventApi {
  on(eventName: string, listener: ExtensionEventListener): void
  once(eventName: string, listener: ExtensionEventListener): void
  removeListener(eventName: string, listener: ExtensionEventListener): void
  emit(eventName: string, ...args: any[]): boolean
}

export interface IExtensionSteamLaunchOptionsEntry {
  userId: string
  localConfigPath: string
  launchOptions: string
}

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

export interface IExtensionUiResponse {
  requestId: string
  action: string
  confirmed: boolean
  payload?: unknown
}

export interface IExtensionUiRequestOptions {
  timeoutMs?: number
}

export type ManagedDeploymentEntry = {
  modKey: string
  modId?: number
  fileId?: number
  versionId?: number
  modType?: string
  targetPath: string
  absolutePath: string
  expectedHash: string
  currentHash?: string | null
  exists?: boolean
  metaInfo?: any
}

export type ManagedDeploymentGameFile = {
  targetPath: string
  absolutePath: string
  hash?: string | null
  exists?: boolean
  managed?: boolean
}

export type ManagedDeploymentMutationSnapshot = {
  gamePath: string
  entries: ManagedDeploymentEntry[]
  gameFiles?: ManagedDeploymentGameFile[]
}

export type ManagedDeploymentMutationOperation =
  | {
      type: 'moveDeployment'
      modKey: string
      from: string
      to: string
      expectedHash?: string
    }
  | {
      type: 'adoptDeployment'
      modKey: string
      from: string
      to: string
      expectedHash?: string
    }
  | {
      type: 'setModMetadata'
      modKey: string
      patch: Record<string, unknown>
    }

export type ManagedDeploymentMutationOptions = {
  modType?: string
  /** @deprecated Use includeManagedCurrentHashes/includeGameFileHashes for finer control. */
  includeCurrentHashes?: boolean
  includeManagedCurrentHashes?: boolean
  includeGameFileHashes?: boolean
  includeGameFiles?: {
    directories?: string[]
    extensions?: string[]
  }
}

export type ManagedDeploymentMutationResult = {
  ok: boolean
  applied: number
  warnings: Array<{ message: string; details?: Record<string, unknown> }>
}

export type ManagedDeploymentMutation = ManagedDeploymentMutationSnapshot & {
  moveDeployment(input: Extract<ManagedDeploymentMutationOperation, { type: 'moveDeployment' }>): void
  adoptDeployment(input: Extract<ManagedDeploymentMutationOperation, { type: 'adoptDeployment' }>): void
  setModMetadata(input: Extract<ManagedDeploymentMutationOperation, { type: 'setModMetadata' }>): void
  warn(message: string, details?: Record<string, unknown>): void
}

export type ManagedDeploymentHookPhase = 'afterEnable' | 'afterDisable' | 'afterUninstall'

export interface IExtensionVfsApi {
  runManagedDeploymentMutation<T = unknown>(
    options: ManagedDeploymentMutationOptions,
    callback: (mutation: ManagedDeploymentMutation) => T | Promise<T>
  ): Promise<ManagedDeploymentMutationResult>
}

export interface IExtensionApi {
  events: IExtensionEventApi
  emitAndAwait<T = any>(eventName: string, ...args: any[]): Promise<T[]>
  onAsync(eventName: string, listener: (...args: any[]) => PromiseLike<any> | any): void
  vfs: IExtensionVfsApi
  util: {
    GameStoreHelper: IGameStoreHelper
    steam: {
      findByAppId(appId: string | number): Promise<{ gamePath: string } | null>
      getLaunchOptions(appId: string | number): Promise<IExtensionSteamLaunchOptionsEntry[]>
      setLaunchOptions(appId: string | number, launchOptions: string): Promise<IExtensionSteamLaunchOptionsEntry[]>
      clearLaunchOptions(appId: string | number): Promise<IExtensionSteamLaunchOptionsEntry[]>
      launchClient(): Promise<IExtensionUiResponse>
    }
    ui: {
      request(payload: IExtensionUiRequestPayload, options?: IExtensionUiRequestOptions): Promise<IExtensionUiResponse>
      notify(payload: IExtensionUiRequestPayload): void
    }
    path: IExtensionPathApi
    fs: IExtensionFsApi
    archive: IExtensionArchiveApi
    fileParseApi: IExtensionFileParseApi
    sanitizeFilename(name: unknown, fallback?: string): string
    /**
     * Vortex 常用的路径模板解析（最小实现：仅支持 {gamePath}）
     * @param game 至少需要包含 gamePath
     * @param template 形如 \"{gamePath}/mods\"
     */
    pathPattern: (game: { gamePath?: string }, template: string) => string
  }
}

/** 游戏基础描述；id 缺省时由加载流程注入为当前 appid */
export interface GameConfig {
  id?: number | string | 'default'
  queryPath?: () => string | undefined | Promise<string | undefined>
  [key: string]: unknown
}

/** Mod 类型安装规则（目标路径、过滤条件等由具体扩展约定） */
export type ModTypeRule = Record<string, unknown>

/** enable 阶段由外部注入给 extension 的动态部署选项 */
export interface DeploymentOptions {
  /**
   * Default Extension 专用：压缩包内 source 路径 -> default_path（相对游戏根目录）
   * - value 缺省/空字符串表示安装到游戏根目录
   */
  defaultPathBySource?: Record<string, string>
  /** Web 侧「忽略冲突并继续」：跳过 enable 前栈冲突预检，直接覆盖落地 */
  ignoreConflict?: boolean
  /** 预留给未来其他动态参数 */
  /** SDK 内部传给 extension 的原始文件物理路径映射：archive relative path -> hash pool absolute path */
  sourcePathByFile?: Record<string, string>
  /** 预留给未来其他动态参数 */
  [key: string]: unknown
}

/** Installer 测试函数：判断是否能处理当前文件集合 */
export type InstallerTest = (
  files: string[],
  gameId: number | string
) => boolean | Promise<boolean> | { supported: boolean } | Promise<{ supported: boolean }>

/** Installer 执行函数：生成安装结果（通常包含 instructions） */
export type InstallerInstall = (
  files: string[],
  destinationPath?: string,
  options?: DeploymentOptions
) => any | Promise<any>

export type AttributeExtractor = (
  modInfo: unknown,
  modPath: string
) => Record<string, unknown> | Promise<Record<string, unknown>>

/** Vortex 风格的 ModType 注册参数 */
export type VortexRegisterModTypeOptions = { name?: string; [k: string]: unknown }
export type VortexActionPropsCallback = (...args: unknown[]) => Record<string, unknown>
export type VortexActionCallback = (instanceIds?: string[]) => void | boolean
export type VortexActionCondition = (instanceIds?: string[]) => boolean | string

/**
 * 受限门面：扩展只能调用此处声明的能力，禁止访问 ExtensionManager / HeyboxModManager
 */
export interface IExtensionContext {
  /** 注册一款游戏及其基础描述 */
  registerGame(config: GameConfig): void

  /** 为特定游戏注册 Mod 类型 */
  registerModType(gameId: number, typeId: string, rule: ModTypeRule): void

  /**
   * Vortex 风格：注册 ModType（以 typeId 作为关联键）
   * @param typeId modType 唯一标识（例如 2868840-mod）
   * @param priority 优先级（数值越大越优先）
   * @param isSupported 当前环境是否支持（例如已发现 gamePath）
   * @param getTargetPath 返回目标路径模板（可包含 {gamePath}）
   * @param test 判断是否支持该文件集合
   * @param options 显示名等元数据
   */
  registerModType(
    typeId: string,
    priority: number,
    isSupported: (gameId: number | string) => boolean,
    getTargetPath: (game: { gamePath?: string }) => string,
    test: (...args: unknown[]) => boolean | Promise<boolean>,
    options?: VortexRegisterModTypeOptions
  ): void

  /**
   * Vortex 风格：注册 installer，并与对应的 modType(typeId) 绑定
   * @param typeId 关联的 modType id
   * @param priority installer 优先级（数值越大越优先）
   * @param test 判断是否支持该文件集合
   * @param install 生成 instructions 等结果
   */
  registerInstaller(typeId: string, priority: number, test: InstallerTest, install: InstallerInstall): void

  registerAttributeExtractor(priority: number, extractor: AttributeExtractor): void

  registerManagedDeploymentHook(
    phase: ManagedDeploymentHookPhase,
    options: { modType?: string },
    callback: (payload: Record<string, unknown>) => unknown | Promise<unknown>
  ): void

  /** 注册自定义动作（如部署后回调） */
  registerAction(
    group: string,
    position: number,
    iconOrComponent: string | unknown,
    props: Record<string, unknown>,
    titleOrProps?: string | VortexActionPropsCallback,
    actionOrCondition?: VortexActionCallback,
    condition?: VortexActionCondition
  ): void

  registerExtensionAction(gameId: number | string, actionName: string, callback: (...args: unknown[]) => unknown): void

  /**
   * 兼容部分 extension 的 once 语义（立即执行一次）
   * @deprecated 尽量在扩展内自行控制初始化时机
   */
  once(fn: () => void): void

  /** Vortex 兼容 API */
  api: IExtensionApi
}

/** extension 的入口函数签名 */
export type ExtensionMain = (context: IExtensionContext) => void | Promise<void>
