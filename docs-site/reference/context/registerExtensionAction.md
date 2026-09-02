# registerExtensionAction

> 注册一个可由 Web 侧按名称调用的扩展动作：把扩展内的某个操作暴露成按钮/接口。

## 签名

```ts
registerExtensionAction(
  gameId: number | string,
  actionName: string,
  callback: (...args: unknown[]) => unknown,
): void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| gameId | `number \| string` | 归属游戏 |
| actionName | `string` | 动作名，Web 按此名称调用 |
| callback | `(...args) => unknown` | 动作实现；函数体留在 Worker 内 |

## 返回值

无。

## 运行流程

1. 注册时函数保存在 Worker 的 callback store，主线程保存同签名 proxy。
2. Web 按 `gameId + actionName` 发起调用。
3. 主线程通过 proxy RPC 回 Worker 执行真实 callback。

## 意义

Web 侧的主动触发口：大部分扩展逻辑是「基座在启用时调用你」，而 registerExtensionAction 是反方向的「你暴露能力给 Web 调」。

## 应用场景

- **手动部署**：Web 放一个「部署加载顺序」按钮 → callback 调 `api.loadOrder.deploy`。
- **状态查询**：如「查询 REDmod 状态」供 Web 展示。

## 注意

与 [registerAction](/reference/context/registerAction) 的区别：`registerAction` 当前仅为 Vortex 兼容保留签名，
不会注册进 Web 可调用的动作表；需要 Web 可调用请使用本方法。
