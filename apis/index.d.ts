import type {
  GameConfig,
  ModTypeRule,
  VortexRegisterModTypeOptions,
  InstallerTest,
  InstallerInstall,
  IGameStoreHelper,
} from '../types'

/** 客户端调用错误 */
export declare class ClientInvokeError extends Error {
  constructor(message: string)
}

/** Extension API - Vortex 兼容接口 */
export interface IExtensionApi {
  util: {
    GameStoreHelper: IGameStoreHelper
    pathPattern: (game: { gamePath?: string }, template: string) => string
  }
}

/**
 * 受限门面：扩展只能调用此处声明的能力，禁止访问 ExtensionManager / HeyboxModManager
 */
export interface IExtensionContext {
  /** 注册一款游戏及其基础描述 */
  registerGame(config: GameConfig): void

  /**
   * 旧式：为特定游戏注册 Mod 类型
   * @param gameId 游戏 ID
   * @param typeId Mod 类型标识
   * @param rule Mod 类型规则
   */
  registerModType(gameId: number, typeId: string, rule: ModTypeRule): void

  /**
   * Vortex 风格：注册 ModType（以 typeId 作为关联键）
   * @param typeId modType 唯一标识
   * @param priority 优先级（数值越大越优先）
   * @param isSupported 当前环境是否支持
   * @param getTargetPath 返回目标路径模板
   * @param isDefault 是否默认启用
   * @param options 显示名等元数据
   */
  registerModType(
    typeId: string,
    priority: number,
    isSupported: (gameId: number) => boolean,
    getTargetPath: (game: { gamePath?: string }) => string,
    isDefault: () => Promise<boolean>,
    options?: VortexRegisterModTypeOptions,
  ): void

  /**
   * 注册 installer，并与对应的 modType(typeId) 绑定
   */
  registerInstaller(typeId: string, priority: number, test: InstallerTest, install: InstallerInstall): void

  /** 注册自定义动作 */
  registerAction(gameId: number, actionName: string, callback: (...args: unknown[]) => unknown): void

  /** 兼容 once 语义（立即执行一次） */
  once(fn: () => void): void

  /** Vortex 兼容 API */
  api: IExtensionApi
}
