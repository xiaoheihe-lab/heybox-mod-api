# ClientInvokeError

> 定义位置：`apis/index.d.ts`。客户端调用错误类型，扩展侧可用于结构化抛错。

## 类型

```ts
type ClientInvokeResult = any

type ClientInvokeErrorType<T = ClientInvokeResult> = {
  status: 'failed' | 'conflict'
  msg: string
  result: T | null
}

class ClientInvokeError<T = any> extends Error {
  status: 'failed' | string
  result: T | null
  msg: string
  code: string   // 稳定错误码，缺省回退到 status
  constructor(input: string | { [k: string]: any })
}
```

| 成员 | 说明 |
| --- | --- |
| status | 失败类别（`'failed'` 或自定义） |
| result | 附带的结果负载 |
| msg | 错误消息 |
| code | 稳定错误码；构造时取 `input.code ?? input.status ?? 'failed'` |

## 运行流程

构造时支持两种形态：

- 传字符串：`status` 取 `'failed'`、`msg` 取该字符串、`result` 为 `null`。
- 传对象：从 `msg` / `status` / `result` / `code` 字段水合。

## 意义与应用场景

- **结构化失败**：FOMOD 配置无效时抛带 `code: 'FOMOD_INVALID_CONFIG'` 的错误，上层可凭 `code` 分流处理。
- **跨边界透传**：错误对象可跨 RPC 序列化，扩展抛出的错误能被基座识别与展示。

## 相关

- `api`：`apis/index.d.ts` 中还导出了门面实例声明 `declare const api: IExtensionApi`（仅类型声明，运行时由基座注入）。
