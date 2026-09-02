# registerAttributeExtractor

> Vortex 风格属性抽取器：从 modInfo / modPath 抽取属性，结果合并进 Mod 属性。

## 签名

```ts
registerAttributeExtractor(
  priority: number,
  extractor: AttributeExtractor,
): void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| priority | `number` | 数值越大越优先 |
| extractor | [AttributeExtractor](/reference/types/installer#attributeextractor) | `(modInfo, modPath) => Record<string, unknown> \| Promise<...>` |

## 返回值

无。

## 运行流程

1. 注册后由基座保存，多个抽取器按 priority 排序。
2. 基座在需要补全 Mod 属性时调用：传入 `modInfo`（已有属性）与 `modPath`（本地路径）。
3. 返回的属性合并进 Mod 属性（优先级高的先声明者生效）。

## 意义

从「压缩包整体」维度为 Mod 补充元信息，与 [registerPostInstallerAttributeExtractor](/reference/context/registerPostInstallerAttributeExtractor) 互补：后者面向「最终选中的文件集合」。

## 应用场景

- 读取 Mod 内的 manifest / 配置文件，提取名称、版本、依赖。
- 按文件内容给 Mod 打标签（如检测到插件目录则标记为「需要前置框架」）。

## 相关类型

- [AttributeExtractor](/reference/types/installer#attributeextractor)
