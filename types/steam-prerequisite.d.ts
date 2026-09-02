/**
 * Steam 前置条件（如官方工具 DLC）类型（extension 通过 GameConfig.steamPrerequisites 声明）
 */

/** 触发前置条件检查的原因 */
export type SteamPrerequisiteCheckReason = 'game-open' | 'manual-recheck' | 'view-enter'

/** 前置条件在 UI 中的文案与按钮配置 */
export interface SteamPrerequisitePresentation {
  title: string
  content: string
  imageUrl?: string
  installButtonText: string
  openingText: string
  openFailedText: string
  recheckButtonText: string
  checkingText: string
  notFoundText: string
  checkFailedText: string
}

/** check 回调的上下文 */
export interface SteamPrerequisiteCheckContext {
  appid: number
  gameId: number
  gamePath: string
  reason: SteamPrerequisiteCheckReason
}

/** 前置条件注册项：check 返回 true 表示已安装 */
export interface SteamPrerequisiteRegistration {
  id: string
  steamAppId: number
  presentation: SteamPrerequisitePresentation
  check(context: SteamPrerequisiteCheckContext): boolean | Promise<boolean>
}

/** 检查状态：installed 已安装、missing 缺失、error 检查出错 */
export type SteamPrerequisiteStatus = 'installed' | 'missing' | 'error'

/** UI 展示用的前置条件条目 */
export interface SteamPrerequisiteUiItem {
  id: string
  steamAppId: number
  storeUrl: string
  presentation: SteamPrerequisitePresentation
  status: SteamPrerequisiteStatus
}

/** 一次检查的完整快照 */
export interface SteamPrerequisiteSnapshot {
  supported: boolean
  appid: number
  reason: SteamPrerequisiteCheckReason
  prerequisites: SteamPrerequisiteUiItem[]
}

/** 单个游戏的检查状态 */
export interface SteamPrerequisiteCheckStatus {
  appid: number
  initialized: boolean
  checked: boolean
  snapshot: SteamPrerequisiteSnapshot | null
}

/** 打开 Steam 商店页的结果 */
export interface SteamPrerequisiteOpenStoreResult {
  appid: number
  prerequisiteId: string
  steamAppId: number
  opened: true
}
