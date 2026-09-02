# fomod 安装向导域

> 定义位置：`types/fomod.d.ts`。FOMOD 安装向导相关类型。用法见
> [fomod 安装向导](/reference/api/fomod)。

## FomodGroupType / FomodOptionType

```ts
type FomodGroupType = 'SelectAny' | 'SelectAll' | 'SelectExactlyOne' | 'SelectAtMostOne' | 'SelectAtLeastOne'
type FomodOptionType = 'Required' | 'Recommended' | 'Optional' | 'NotUsable' | 'CouldBeUsable'
```

- 组选择约束：SelectAny 任意、SelectAll 全选、SelectExactlyOne 恰好一个、
  SelectAtMostOne 至多一个、SelectAtLeastOne 至少一个。
- 选项类型：Required 必选、Recommended 推荐、Optional 可选、NotUsable 不可用、
  CouldBeUsable 条件可用。

## FomodUiOption

```ts
interface FomodUiOption {
  id: string
  name: string
  description?: string
  imageDataUrl?: string
  type: FomodOptionType
  selected: boolean
  disabled: boolean
}
```

单个选项。

## FomodUiGroup

```ts
interface FomodUiGroup {
  id: string
  name: string
  type: FomodGroupType
  options: FomodUiOption[]
}
```

选项组。

## FomodStepRequest

```ts
interface FomodStepRequest {
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
```

一次步骤选择请求；appid/requestId 由基座注入。

## FomodStepResponse

```ts
interface FomodStepResponse {
  requestId?: string
  action: 'next' | 'back' | 'install' | 'cancel'
  selectedOptionIds?: string[]
}
```

用户对一步选择的响应。

## FomodSessionClosePayload

```ts
interface FomodSessionClosePayload {
  appid?: number
  sessionId: string
  status: 'completed' | 'cancelled' | 'failed'
  message?: string
}
```

结束会话的通知。

## FomodStoredState

```ts
interface FomodStoredState {
  schemaVersion: 1
  protocolVersion: '1.0'
  configHash: string
  selections: Record<string, string[]>
  groupSelections: Record<string, string[]>
}
```

已持久化的 FOMOD 选择状态；由基座在 reconfigure/reuse 时注入。

## FomodExtensionApi

```ts
interface FomodExtensionApi {
  requestStep(payload: FomodStepRequest): Promise<FomodStepResponse>
  closeSession(payload: FomodSessionClosePayload): void | Promise<void>
  resolveFileDependencies(paths: string[]): Promise<{ states: Record<string, 'Active' | 'Missing'> }>
}
```

`api.util.fomod` 的门面类型。

## FomodDeploymentOptions

```ts
interface FomodDeploymentOptions {
  mode?: 'auto' | 'reconfigure' | 'reuse'
  storedState?: FomodStoredState
}
```

FOMOD 部署上下文（挂载在 [DeploymentOptions.fomod](/reference/types/installer#deploymentoptions)）。
