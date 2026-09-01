/**
 * Steam 前置条件（如官方工具 DLC）类型（extension 通过 GameConfig.steamPrerequisites 声明）
 */

export type SteamPrerequisiteCheckReason = 'game-open' | 'manual-recheck' | 'view-enter'

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

export interface SteamPrerequisiteCheckContext {
  appid: number
  gameId: number
  gamePath: string
  reason: SteamPrerequisiteCheckReason
}

export interface SteamPrerequisiteRegistration {
  id: string
  steamAppId: number
  presentation: SteamPrerequisitePresentation
  check(context: SteamPrerequisiteCheckContext): boolean | Promise<boolean>
}

export type SteamPrerequisiteStatus = 'installed' | 'missing' | 'error'

export interface SteamPrerequisiteUiItem {
  id: string
  steamAppId: number
  storeUrl: string
  presentation: SteamPrerequisitePresentation
  status: SteamPrerequisiteStatus
}

export interface SteamPrerequisiteSnapshot {
  supported: boolean
  appid: number
  reason: SteamPrerequisiteCheckReason
  prerequisites: SteamPrerequisiteUiItem[]
}

export interface SteamPrerequisiteCheckStatus {
  appid: number
  initialized: boolean
  checked: boolean
  snapshot: SteamPrerequisiteSnapshot | null
}

export interface SteamPrerequisiteOpenStoreResult {
  appid: number
  prerequisiteId: string
  steamAppId: number
  opened: true
}
