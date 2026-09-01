/**
 * 加载顺序（Load Order）类型（extension 通过 context.registerLoadOrder 注册 provider）
 */

export type LoadOrderReason =
  | 'open'
  | 'refresh'
  | 'user-save'
  | 'manual-deploy'
  | 'after-enable'
  | 'after-disable'
  | 'after-uninstall'
  | 'after-reconfigure'

export type LoadOrderDeploymentStatus = 'clean' | 'dirty' | 'deploying' | 'failed'

export type LoadOrderErrorCode =
  | 'LOAD_ORDER_NOT_SUPPORTED'
  | 'LOAD_ORDER_STALE'
  | 'LOAD_ORDER_INVALID'
  | 'LOAD_ORDER_BUSY'
  | 'LOAD_ORDER_DEPLOY_FAILED'

export interface LoadOrderModSnapshot {
  modKey: string
  modId?: number
  fileId?: number
  versionId?: number
  modType?: string
  enabled: boolean
  metaInfo: Record<string, unknown>
}

export interface LoadOrderContext {
  appid: number
  gameId: number
  gamePath: string
  revision: number
  reason: LoadOrderReason
  savedOrder: string[]
  mods: LoadOrderModSnapshot[]
}

export interface LoadOrderEntry {
  id: string
  ownerModKey: string
  name: string
  enabled: boolean
  data?: Record<string, unknown>
}

export interface LoadOrderRegistration {
  id: string
  gameId: number | string
  title: string
  usageInstructions?: string | string[]
  modTypes: string[]
  isModRelevant?(mod: LoadOrderModSnapshot): boolean | Promise<boolean>
  deserializeLoadOrder(context: LoadOrderContext): LoadOrderEntry[] | Promise<LoadOrderEntry[]>
  validate?(
    previous: LoadOrderEntry[],
    current: LoadOrderEntry[],
    context: LoadOrderContext
  ): void | Promise<void>
  serializeLoadOrder(entries: LoadOrderEntry[], context: LoadOrderContext): void | Promise<void>
  onDidDeploy?(entries: LoadOrderEntry[], context: LoadOrderContext): void | Promise<void>
}

export interface LoadOrderPersistedError {
  code: string
  message: string
}

export interface LoadOrderPersistedState {
  schemaVersion: 1
  revision: number
  orderedEntryIds: string[]
  appliedRevision?: number
  deploymentStatus: LoadOrderDeploymentStatus
  lastError?: LoadOrderPersistedError
  updatedAt: string
}

export interface LoadOrderProviderSummary {
  id: string
  title: string
  usageInstructions?: string[]
}

export interface LoadOrderUiEntry {
  id: string
  ownerModKey: string
  name: string
  enabled: boolean
}

export interface LoadOrderSnapshot {
  supported: boolean
  providers: LoadOrderProviderSummary[]
  providerId?: string
  revision: number
  entries: LoadOrderUiEntry[]
  deploymentStatus: LoadOrderDeploymentStatus
  appliedRevision?: number
  lastError?: LoadOrderPersistedError
}
