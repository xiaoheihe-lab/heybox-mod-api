# Post-installer 属性抽取

> 定位：`registerPostInstallerAttributeExtractor` 让扩展从**最终会被部署的文件集合**派生 Mod 持久属性。
> 面向交互式/条件式 installer（如 FOMOD），因为仅凭压缩包整体检查无法确定被选中的文件。

```ts
context.registerPostInstallerAttributeExtractor(100, async (result) => ({
  selectedFeatureMetadata: await inspect(result.instructions, result.stagingPath),
}))
```

## 类型契约

```ts
type PostInstallerAttributeExtractor = (
  context: PostInstallerAttributeContext
) => Record<string, unknown> | Promise<Record<string, unknown>>

interface PostInstallerAttributeContext {
  appid: number
  gameId: number
  modKey: string
  installerTypeId: string
  modTypeId: string
  stagingPath: string                 // 解压后的暂存目录
  archiveFiles: readonly string[]
  instructions: readonly FinalFileInstruction[]   // 不可变 copy/generatefile 视图
}
```

## 执行时机与顺序

- 在 installer 返回、SDK 解析完 Mod-type 目的地**之后**、VFS 执行之前运行。
- 按 priority 降序执行，再按注册顺序；**第一个声明某 key 的抽取器拥有该 key**。
- 返回值必须是 JSON 兼容值。
- 保留字段：`fomod` 与 `heyboxModType` 由 installer 和 SDK 持有，抽取器不能写。
- installer 显式返回的属性也保留对自身 key 的所有权；抽取器只能补充，不能替换。

## 约束（红线）

抽取器必须**确定性且无副作用**：

- 可以读取 `stagingPath` 下被选中的源文件。
- 不能写游戏文件、不能启动工具、不能向用户发起另一个问题、不能凭压缩包内所有文件推断选择。
- 抽取器出错会在 VFS 执行前终止，错误以结构化字段传播。

## 典型用途

FOMOD 选择的 pak 列表 → 写进 Mod 属性，供后续 load order / 展示使用：

```ts
context.registerPostInstallerAttributeExtractor(100, (result) => {
  const pakFiles = result.instructions
    .filter((i) => i.type === 'copy' && isPakDestination(i.destination))
    .map((i) => baseName(i.destination))
  return { [PAK_ATTRIBUTE]: [...new Set(pakFiles)] }
})
```
