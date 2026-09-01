/**
 * FOMOD 安装器 UI 类型（extension 通过 context.api.util.fomod 与基座交互）
 */

export type FomodErrorCode =
  | 'FOMOD_INSTALL_CANCELLED'
  | 'FOMOD_INVALID_CONFIG'
  | 'FOMOD_UNSUPPORTED_FEATURE'
  | 'FOMOD_UI_TIMEOUT'
  | 'FOMOD_SESSION_BUSY'

export type FomodGroupType = 'SelectAny' | 'SelectAll' | 'SelectExactlyOne' | 'SelectAtMostOne' | 'SelectAtLeastOne'
export type FomodOptionType = 'Required' | 'Recommended' | 'Optional' | 'NotUsable' | 'CouldBeUsable'

export interface FomodUiOption {
  id: string
  name: string
  description?: string
  imageDataUrl?: string
  type: FomodOptionType
  selected: boolean
  disabled: boolean
}

export interface FomodUiGroup {
  id: string
  name: string
  type: FomodGroupType
  options: FomodUiOption[]
}

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

export interface FomodStepResponse {
  requestId?: string
  action: 'next' | 'back' | 'install' | 'cancel'
  selectedOptionIds?: string[]
}

export interface FomodSessionClosePayload {
  appid?: number
  sessionId: string
  status: 'completed' | 'cancelled' | 'failed'
  message?: string
}

export interface FomodStoredState {
  schemaVersion: 1
  protocolVersion: '1.0'
  configHash: string
  selections: Record<string, string[]>
  groupSelections: Record<string, string[]>
}

export interface FomodExtensionApi {
  requestStep(payload: FomodStepRequest): Promise<FomodStepResponse>
  closeSession(payload: FomodSessionClosePayload): void | Promise<void>
  resolveFileDependencies(paths: string[]): Promise<{ states: Record<string, 'Active' | 'Missing'> }>
}

export interface FomodDeploymentOptions {
  mode?: 'auto' | 'reconfigure' | 'reuse'
  storedState?: FomodStoredState
}
