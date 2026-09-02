# registerAction 与 once

## registerAction

> ⚠️ 当前 SDK 仅为 Vortex 兼容**保留签名**，不会注册进 Web 可调用的动作表。
> 需要 Web 可调用请使用 [registerExtensionAction](/reference/context/registerExtensionAction)。

```ts
registerAction(
  group: string,
  position: number,
  iconOrComponent: string | unknown,
  props: Record<string, unknown>,
  titleOrProps?: string | VortexActionPropsCallback,
  actionOrCondition?: VortexActionCallback,
  condition?: VortexActionCondition,
): void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| group | `string` | 动作分组 |
| position | `number` | 组内位置 |
| iconOrComponent | `string \| unknown` | 图标或组件 |
| props | `Record<string, unknown>` | 动作属性 |
| titleOrProps | `string \| VortexActionPropsCallback` | 标题或属性回调 |
| actionOrCondition | `VortexActionCallback` | 动作回调 |
| condition | `VortexActionCondition` | 可用条件 |

**意义**：为从 Vortex 生态迁移过来的扩展保留代码兼容性；新代码请直接用 `registerExtensionAction`。

## once

```ts
once(fn: () => void): void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| fn | `() => void` | 要立即执行的初始化函数 |

**运行流程**：立即同步执行一次 `fn`。

**意义**：兼容部分扩展「注册后立即初始化一次」的写法。

> 已标记 `@deprecated`：尽量在扩展内自行控制初始化时机，不要在注册序列里夹带副作用。
