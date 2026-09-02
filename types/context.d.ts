/**
 * 扩展门面域：IExtensionContext、入口签名与 Vortex 风格注册辅助类型
 * （第三方扩展仅通过 IExtensionContext 与基座交互）
 */
import type { IExtensionApi } from './api'
import type { GameConfig } from './game'
import type {
  AttributeExtractor,
  InstallerInstall,
  InstallerTest,
  ModTypeRule,
  PostInstallerAttributeExtractor,
} from './installer'
import type { LoadOrderRegistration } from './load-order'
import type { ManagedDeploymentHookPhase } from './vfs'

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

  /** 注册安装后属性抽取器（基于最终文件集合，如 FOMOD 选择结果） */
  registerPostInstallerAttributeExtractor(priority: number, extractor: PostInstallerAttributeExtractor): void

  /** 注册托管部署生命周期钩子；options.modType 可限定只处理指定 modType */
  registerManagedDeploymentHook(
    phase: ManagedDeploymentHookPhase,
    options: { modType?: string },
    callback: (payload: Record<string, unknown>) => unknown | Promise<unknown>
  ): void

  /** 为指定游戏注册加载顺序 provider（deserialize/serialize/validate 等钩子） */
  registerLoadOrder(options: LoadOrderRegistration): void

  /**
   * 注册自定义动作（如部署后回调）。
   * 注意：当前 SDK 仅为 Vortex 兼容保留签名，不会注册进 Web 可调用的动作表。
   */
  registerAction(
    group: string,
    position: number,
    iconOrComponent: string | unknown,
    props: Record<string, unknown>,
    titleOrProps?: string | VortexActionPropsCallback,
    actionOrCondition?: VortexActionCallback,
    condition?: VortexActionCondition
  ): void

  /** 注册一个可供 Web 侧按名称调用的扩展动作 */
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
