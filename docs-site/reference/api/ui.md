# ui 弹窗

> `api.util.ui` 向 Web 发起弹窗交互：确认框、单选/多选、通知。appid 由主线程注入，extension 自报值不能覆盖任务归属。

## request

```ts
request(
  payload: IExtensionUiRequestPayload,
  options?: IExtensionUiRequestOptions,
): Promise<IExtensionUiResponse>
```

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| payload | [IExtensionUiRequestPayload](/reference/types/api#iextensionuirequestpayload) | 弹窗负载 |
| options | [IExtensionUiRequestOptions](/reference/types/api#iextensionuirequestoptions) | 可选，`{ timeoutMs?: number }` |

`payload` 常用字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| type | `string` | 弹窗类型（如 `'mod_choice'`） |
| title / content | `string` | 标题与内容 |
| choices | 数组 | 可选项 `{ id, text, value?, disabled?, ... }`；不传则为普通确认框 |
| confirm / cancel | 对象 | 按钮文案、类型、是否可见 |

### 返回

[IExtensionUiResponse](/reference/types/api#iextensionuiresponse)：`{ requestId, action, confirmed, payload }`。
Web 不可用时返回 `action: 'unavailable'` 且 `confirmed: false`。

## notify

```ts
notify(payload: IExtensionUiRequestPayload): void
```

只通知型事件，无响应、无返回。

## 运行流程

1. `request` 经 RPC 发到主线程，主线程注入可信 appid 后转发 Web。
2. Web 弹出对话框；用户操作或超时后，响应原路返回调用方 Promise。
3. 切换游戏或页面失活时，旧游戏请求按各自规则挂起、关闭或返回 unavailable，不会投影成新游戏的提醒。

## 意义

安装决策需要人参与的入口：FOMOD 之外的通用选择（变体选择、冲突确认、安装确认）都走这里。

## 应用场景

- **安装变体选择**：同一 Mod 多个补丁变体，让用户挑一个。
- **风险确认**：覆盖已有文件前弹确认框。
- **进度提示**：用 `notify` 单向提示「正在生成入口文件」。

## 注意

- 在 installer/tester 中等待 UI 会占用沙箱 callback，务必设置 `timeoutMs` 并处理 cancel/close/timeout。
- 单选结果的典型读取：`response.payload?.choiceId`。

## 相关类型

- [IExtensionUiRequestPayload](/reference/types/api#iextensionuirequestpayload)
- [IExtensionUiResponse](/reference/types/api#iextensionuiresponse)
- [IExtensionUiRequestOptions](/reference/types/api#iextensionuirequestoptions)
