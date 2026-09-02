# fomod 安装向导

> `api.util.fomod` 驱动 FOMOD 风格的分步安装向导：步骤选择、会话关闭、bundle 内文件依赖解析。

## 方法总览

| 方法 | 说明 |
| --- | --- |
| requestStep | 向 Web 发起一步选择 |
| closeSession | 结束当前 session |
| resolveFileDependencies | 解析当前扩展 bundle 内文件的依赖状态（Worker 本地执行） |

## requestStep

```ts
requestStep(payload: FomodStepRequest): Promise<FomodStepResponse>
```

### 参数

[FomodStepRequest](/reference/types/fomod#fomodsteprequest) 关键字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| sessionId | `string` | 会话标识，同一次安装向导内保持一致 |
| moduleName | `string` | 模块名（Mod 名） |
| stepId / stepName | `string` | 当前步骤标识与名称 |
| stepIndex / totalSteps | `number` | 进度 |
| canGoBack / isLastStep | `boolean` | 导航能力 |
| groups | [FomodUiGroup[]](/reference/types/fomod#fomoduigroup) | 选项组（type 决定选择约束，options 为选项） |

> appid 与 requestId 由基座注入，extension 自报值不能改变任务归属。

### 返回

[FomodStepResponse](/reference/types/fomod#fomodstepresponse)：`{ action: 'next' | 'back' | 'install' | 'cancel', selectedOptionIds? }`。

## closeSession

```ts
closeSession(payload: FomodSessionClosePayload): void | Promise<void>
```

参数 [FomodSessionClosePayload](/reference/types/fomod#fomodsessionclosepayload)：
`{ sessionId, status: 'completed' | 'cancelled' | 'failed', message? }`。

## resolveFileDependencies

```ts
resolveFileDependencies(paths: string[]): Promise<{ states: Record<string, 'Active' | 'Missing'> }>
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| paths | `string[]` | bundle 内相对路径数组 |

返回每个路径的状态：`'Active'`（存在）或 `'Missing'`（缺失）。**在 Worker 本地解析**，不走主线程。

## 运行流程

1. installer 在 `install` 内按需调用 `requestStep`，逐步骤收集用户选择。
2. 主线程把事件转发 Web 前注入 sandbox 所属 appid；Web 按 appid 路由 session。
3. 切换游戏会 suspend 当前 step（不回复 cancel），切回后恢复同一 session。
4. 安装完成或放弃时调用 `closeSession` 结束会话。

## 意义

FOMOD 是 Mod 安装领域的标准交互协议（源自 Oblivion/Fallout 生态）。相比通用
[ui.request](/reference/api/ui#request)，fomod 提供步骤化、选项组约束、session 管理的完整语义，
适合「安装向导式」的复杂选择。

## 应用场景

- **分步配置安装**：Cyberpunk 2077 的 REDmod 包、BlackMythWukong 的 FOMOD pak 选择。
- **条件选项**：根据已选内容禁用后续选项（type 为 `NotUsable` / `CouldBeUsable`）。
- **依赖检测**：`resolveFileDependencies` 检查向导自身资源是否完整。

## 相关类型

- [FomodStepRequest](/reference/types/fomod#fomodsteprequest) / [FomodStepResponse](/reference/types/fomod#fomodstepresponse)
- [FomodUiGroup](/reference/types/fomod#fomoduigroup) / [FomodUiOption](/reference/types/fomod#fomoduioption)
- [FomodSessionClosePayload](/reference/types/fomod#fomodsessionclosepayload)
- 部署侧：[FomodDeploymentOptions](/reference/types/fomod#fomoddeploymentoptions)
