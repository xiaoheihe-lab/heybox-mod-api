# registerPostInstallerAttributeExtractor

> 在 installer 返回、落地执行**之前**运行，从最终选中的文件集合产出 Mod 持久属性。
> 面向交互式/条件式安装（如 FOMOD）：仅凭压缩包整体检查无法确定被选中的文件。

## 签名

```ts
registerPostInstallerAttributeExtractor(
  priority: number,
  extractor: PostInstallerAttributeExtractor,
): void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| priority | `number` | 数值越大越优先 |
| extractor | [PostInstallerAttributeExtractor](/reference/types/installer#postinstallerattributeextractor) | `(context) => Record<string, unknown> \| Promise<...>` |

抽取上下文 [PostInstallerAttributeContext](/reference/types/installer#postinstallerattributecontext) 关键字段：

| 字段 | 说明 |
| --- | --- |
| instructions | 不可变的 `copy` / `generatefile` 指令视图（最终将执行的落点） |
| stagingPath | 解压后的暂存目录，可读取被选中的源文件 |
| modTypeId / installerTypeId | 命中的类型与 installer 标识，可据此区分场景 |

## 返回值

无。

## 运行流程

1. installer 返回指令后、基座执行落地**之前**触发。
2. 按 priority 降序执行，再按注册顺序。
3. 第一个声明某 key 的抽取器拥有该 key；返回值必须 JSON 兼容。
4. 抽取器出错会在落地前终止，错误以结构化字段传播。

## 意义

让 Mod 的持久属性反映「用户实际选择」而不是「压缩包全部内容」。预览与启用走同一套抽取，两者观察到的选择结果一致。

## 应用场景

- **FOMOD 选出的 pak 列表**写入属性，供加载顺序与展示使用。
- 依据选中的文件给 Mod 打上「需要部署工具」类标记。

## 约束（红线）

- 必须**确定性与无副作用**：可以读 `stagingPath` 下被选中的文件，不能写游戏文件、不能弹 UI、不能启动工具。
- 保留字段 `fomod` / `heyboxModType` 由 installer 和基座持有，抽取器不能写。

## 相关类型

- [PostInstallerAttributeContext](/reference/types/installer#postinstallerattributecontext)
- [PostInstallerAttributeExtractor](/reference/types/installer#postinstallerattributeextractor)
