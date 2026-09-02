/**
 * FOMOD 安装器 UI 类型（extension 通过 context.api.util.fomod 与基座交互）
 */

/** FOMOD 会话错误码 */
export type FomodErrorCode =
  | 'FOMOD_INSTALL_CANCELLED'
  | 'FOMOD_INVALID_CONFIG'
  | 'FOMOD_UNSUPPORTED_FEATURE'
  | 'FOMOD_UI_TIMEOUT'
  | 'FOMOD_SESSION_BUSY'

/** 组选择类型：SelectAny 任意、SelectAll 全选、SelectExactlyOne 恰好一个、SelectAtMostOne 至多一个、SelectAtLeastOne 至少一个 */
export type FomodGroupType = 'SelectAny' | 'SelectAll' | 'SelectExactlyOne' | 'SelectAtMostOne' | 'SelectAtLeastOne'

/** 选项类型：Required 必选、Recommended 推荐、Optional 可选、NotUsable 不可用、CouldBeUsable 条件可用 */
export type FomodOptionType = 'Required' | 'Recommended' | 'Optional' | 'NotUsable' | 'CouldBeUsable'

/** FOMOD 单个选项 */
export interface FomodUiOption {
  id: string
  name: string
  description?: string
  imageDataUrl?: string
  type: FomodOptionType
  selected: boolean
  disabled: boolean
}

/** FOMOD 选项组 */
export interface FomodUiGroup {
  id: string
  name: string
  type: FomodGroupType
  options: FomodUiOption[]
}

/** 一次步骤选择请求；appid/requestId 由基座注入，extension 自报值不能改变任务归属 */
export interface FomodStepRequest {
  appid?: number
  requestId?: string
  sessionId: string
  moduleName: string
  moduleAuthor?: string
  moduleVersion?: string
  moduleWebsite?: string
  moduleImageDataUrl?: string
  stepId: string
  stepName: string
  stepIndex: number
  totalSteps: number
  canGoBack: boolean
  isLastStep: boolean
  groups: FomodUiGroup[]
}

/** 用户对一步选择的响应 */
export interface FomodStepResponse {
  requestId?: string
  action: 'next' | 'back' | 'install' | 'cancel'
  selectedOptionIds?: string[]
}

/** 结束 FOMOD 会话的通知 */
export interface FomodSessionClosePayload {
  appid?: number
  sessionId: string
  status: 'completed' | 'cancelled' | 'failed'
  message?: string
}

/** 已持久化的 FOMOD 选择状态；由 SDK 在 reconfigure/reuse 时注入 DeploymentOptions.fomod */
export interface FomodStoredState {
  schemaVersion: 1
  protocolVersion: '1.0'
  configHash: string
  selections: Record<string, string[]>
  groupSelections: Record<string, string[]>
}

/** FOMOD 扩展可用 API */
export interface FomodExtensionApi {
  /** 向 Web 发起一步选择；切换游戏会 suspend 当前 step，切回后恢复同一 session */
  requestStep(payload: FomodStepRequest): Promise<FomodStepResponse>
  /** 结束当前 session（按 appid/sessionId 清理） */
  closeSession(payload: FomodSessionClosePayload): void | Promise<void>
  /** 解析当前扩展 bundle 内文件的依赖状态（Active/Missing）；在 Worker 本地执行 */
  resolveFileDependencies(paths: string[]): Promise<{ states: Record<string, 'Active' | 'Missing'> }>
}

/** FOMOD 专用部署上下文；storedState 由 SDK 注入 */
export interface FomodDeploymentOptions {
  mode?: 'auto' | 'reconfigure' | 'reuse'
  storedState?: FomodStoredState
}
