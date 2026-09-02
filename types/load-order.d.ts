/**
 * 加载顺序（Load Order）类型（extension 通过 context.registerLoadOrder 注册 provider）
 */

/** 触发加载顺序交互的原因 */
export type LoadOrderReason =
  | 'open'
  | 'refresh'
  | 'user-save'
  | 'manual-deploy'
  | 'after-enable'
  | 'after-disable'
  | 'after-uninstall'
  | 'after-reconfigure'

/** 部署状态：clean 干净、dirty 待部署、deploying 部署中、failed 失败 */
export type LoadOrderDeploymentStatus = 'clean' | 'dirty' | 'deploying' | 'failed'

/** 加载顺序错误码 */
export type LoadOrderErrorCode =
  | 'LOAD_ORDER_NOT_SUPPORTED'
  | 'LOAD_ORDER_STALE'
  | 'LOAD_ORDER_INVALID'
  | 'LOAD_ORDER_BUSY'
  | 'LOAD_ORDER_DEPLOY_FAILED'

/** 参与加载顺序的单个 Mod 快照 */
export interface LoadOrderModSnapshot {
  modKey: string
  modId?: number
  fileId?: number
  versionId?: number
  modType?: string
  enabled: boolean
  metaInfo: Record<string, unknown>
}

/** 加载顺序钩子的上下文 */
export interface LoadOrderContext {
  appid: number
  gameId: number
  gamePath: string
  /** 状态修订号，用于乐观锁（stale 检测） */
  revision: number
  reason: LoadOrderReason
  /** 上次持久化的顺序 */
  savedOrder: string[]
  mods: LoadOrderModSnapshot[]
}

/** 一个加载顺序条目 */
export interface LoadOrderEntry {
  id: string
  ownerModKey: string
  name: string
  enabled: boolean
  data?: Record<string, unknown>
}

/** provider 注册配置：extension 通过 registerLoadOrder 提交 */
export interface LoadOrderRegistration {
  /** provider 唯一标识 */
  id: string
  gameId: number | string
  title: string
  usageInstructions?: string | string[]
  /** 该 provider 负责的 modType 列表 */
  modTypes: string[]
  /** 判断某个 Mod 是否参与此加载顺序 */
  isModRelevant?(mod: LoadOrderModSnapshot): boolean | Promise<boolean>
  /** 从游戏文件反序列化出当前顺序 */
  deserializeLoadOrder(context: LoadOrderContext): LoadOrderEntry[] | Promise<LoadOrderEntry[]>
  /** 校验用户调整后的顺序；校验失败应抛出错误 */
  validate?(
    previous: LoadOrderEntry[],
    current: LoadOrderEntry[],
    context: LoadOrderContext
  ): void | Promise<void>
  /** 把顺序写回游戏文件 */
  serializeLoadOrder(entries: LoadOrderEntry[], context: LoadOrderContext): void | Promise<void>
  /** 部署完成后的回调 */
  onDidDeploy?(entries: LoadOrderEntry[], context: LoadOrderContext): void | Promise<void>
}

/** 持久化的加载顺序错误 */
export interface LoadOrderPersistedError {
  code: string
  message: string
}

/** 持久化的加载顺序状态 */
export interface LoadOrderPersistedState {
  schemaVersion: 1
  revision: number
  orderedEntryIds: string[]
  appliedRevision?: number
  deploymentStatus: LoadOrderDeploymentStatus
  lastError?: LoadOrderPersistedError
  updatedAt: string
}

/** provider 摘要（用于 UI 列表） */
export interface LoadOrderProviderSummary {
  id: string
  title: string
  usageInstructions?: string[]
}

/** UI 展示用的条目 */
export interface LoadOrderUiEntry {
  id: string
  ownerModKey: string
  name: string
  enabled: boolean
}

/** 加载顺序部署后的快照（loadOrder.deploy 的返回） */
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
