/**
 * 托管部署域：ManagedDeploymentMutation 事务式部署变更
 */

/** 一条已部署文件记录；targetPath 相对游戏根目录 */
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

/** 游戏目录内单个文件的快照行 */
export type ManagedDeploymentGameFile = {
  targetPath: string
  absolutePath: string
  hash?: string | null
  exists?: boolean
  managed?: boolean
}

/** mutation 开始时 VFS 托管部署的状态快照 */
export type ManagedDeploymentMutationSnapshot = {
  gamePath: string
  entries: ManagedDeploymentEntry[]
  gameFiles?: ManagedDeploymentGameFile[]
}

/** 可提交的托管部署变更操作 */
export type ManagedDeploymentMutationOperation =
  | {
      /** 把托管文件从 from 移动到 to（expectedHash 用于校验当前内容） */
      type: 'moveDeployment'
      modKey: string
      from: string
      to: string
      expectedHash?: string
    }
  | {
      /** 把游戏目录中已有的文件接纳为托管部署（from 移动到 to 并纳入管理） */
      type: 'adoptDeployment'
      modKey: string
      from: string
      to: string
      expectedHash?: string
    }
  | {
      /** 更新 mod 元数据 */
      type: 'setModMetadata'
      modKey: string
      patch: Record<string, unknown>
    }

/** 快照过滤与包含选项 */
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

/** mutation 应用结果 */
export type ManagedDeploymentMutationResult = {
  ok: boolean
  applied: number
  warnings: Array<{ message: string; details?: Record<string, unknown> }>
}

/** 快照 + 变更收集器：回调内调用操作方法收集变更，返回后由基座统一应用 */
export type ManagedDeploymentMutation = ManagedDeploymentMutationSnapshot & {
  moveDeployment(input: Omit<Extract<ManagedDeploymentMutationOperation, { type: 'moveDeployment' }>, 'type'>): void
  adoptDeployment(input: Omit<Extract<ManagedDeploymentMutationOperation, { type: 'adoptDeployment' }>, 'type'>): void
  setModMetadata(input: Omit<Extract<ManagedDeploymentMutationOperation, { type: 'setModMetadata' }>, 'type'>): void
  warn(message: string, details?: Record<string, unknown>): void
}

/** 托管部署钩子触发阶段 */
export type ManagedDeploymentHookPhase = 'afterEnable' | 'afterDisable' | 'afterUninstall'

/** 托管部署变更入口 */
export interface IExtensionVfsApi {
  /** 在快照上以事务方式修改托管部署：回调内调用 mutation 方法收集操作，返回后由基座统一应用并返回结果 */
  runManagedDeploymentMutation<T = unknown>(
    options: ManagedDeploymentMutationOptions,
    callback: (mutation: ManagedDeploymentMutation) => T | Promise<T>
  ): Promise<ManagedDeploymentMutationResult>
}
