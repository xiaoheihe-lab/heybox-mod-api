# events 事件总线

> 扩展沙箱内的**本地事件总线**：仅当前扩展自身可见，不与其他扩展互通；监听者在 Worker 本地执行，不走主线程 RPC。

## 可用方法

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| on | `(eventName, listener) => void` | 注册监听 |
| once | `(eventName, listener) => void` | 一次性监听，触发后自动移除 |
| removeListener | `(eventName, listener) => void` | 移除监听 |
| emit | `(eventName, ...args) => boolean` | 触发事件，返回是否存在监听者；监听者异步执行 |
| emitAndAwait | `<T>(eventName, ...args) => Promise<T[]>` | 触发并收集所有监听者的**非空**返回值 |
| onAsync | `(eventName, listener) => void` | 注册异步监听者（emitAndAwait 会等待其完成） |

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| eventName | `string` | 事件名，扩展内自定义 |
| listener | [ExtensionEventListener](/reference/types/game#extensioneventlistener) | `(...args: any[]) => unknown` |

`emitAndAwait` 返回 `Promise<T[]>`：按注册顺序执行监听者，收集返回值中**非 null/undefined** 的部分。

## 运行流程

1. 监听器存于 Worker 本地的事件表，按事件名分桶。
2. `emit` / `emitAndAwait` 依序执行桶内监听者；单个监听者抛错只记录日志，不中断其他监听者。
3. `once` 监听者在执行后（无论成败）自动移除。

## 意义

扩展内部各模块（installer、load order、fomod）之间的解耦通道，也是把多个回调的结果聚合回一个 Promise 的手段。

## 应用场景

- **部署完成通知**：installer 完成 → `emit('deployed', ...)`，其他模块监听后更新自身状态。
- **聚合多来源结果**：多个监听者各自返回一段配置，`emitAndAwait` 收集合并。
- **一次性初始化**：`once('ready', init)` 保证只执行一次。

## 相关类型

- [ExtensionEventListener](/reference/types/api#extensioneventlistener)
