/** 游戏注册配置 */
export interface GameConfig {
  id?: number | string
  name?: string
  gamePath?: string
  use_default_extension?: boolean
  [key: string]: any
}

/** Mod 类型规则 */
export interface ModTypeRule {
  priority: number
  name?: string
  isSupported: (gameId: number) => boolean
  targetPathTemplate: string
  targetPathResolved: string
  isDefault?: () => Promise<boolean>
}

/** Vortex registerModType 选项 */
export interface VortexRegisterModTypeOptions {
  name?: string
  [key: string]: any
}

/** Installer 检测函数 */
export type InstallerTest = (...args: any[]) => boolean | Promise<boolean>

/** Installer 安装函数 */
export type InstallerInstall = (...args: any[]) => any

/** Steam 游戏信息 */
export type SteamGameInfo = any

/** GameStoreHelper - Steam 游戏商店辅助工具 */
export interface IGameStoreHelper {
  findByAppId(appId: number): Promise<{ gamePath: string } | null>
  getGameInfoByAppid(appid: number): SteamGameInfo | undefined
  initialize(): Promise<void>
  refreshStore(): Promise<void>
}
