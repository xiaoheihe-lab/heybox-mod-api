# archive 压缩包

> `api.util.archive` 解压 / 列目录压缩包。全部方法异步，返回相对路径数组。

## 方法总览

| 方法 | 说明 |
| --- | --- |
| extractZip / extractRar / extract7z | 按格式解压；7z 为 solid 压缩，全量解压 |
| extract | 按扩展名自动分派 zip/rar/7z |
| list | 不解压列出文件树 |

签名（以 zip 为例，rar/7z/通用同名）：

```ts
extractZip(archivePath: unknown, destinationPath: unknown): Promise<string[]>
extract(archivePath: unknown, destinationPath: unknown): Promise<string[]>
list(archivePath: unknown): Promise<IExtensionArchiveEntry[]>
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| archivePath | `unknown` | 压缩包路径（须为绝对路径或可 path.resolve 的路径） |
| destinationPath | `unknown` | 解压目标目录 |

返回：

- `extract*`：`Promise<string[]>`，解压出的相对路径数组。
- `list`：[IExtensionArchiveEntry[]](/reference/types/api#iextensionarchiveentry)：`{ path, size?, isDirectory }`。

`*Async` 为同实现的历史别名。

## 行为与错误语义

- 空串或含 `\0` 抛 `Invalid extension archive <name>`。
- zip 解压做路径穿越防护，非法 entry 抛 `Unsafe zip entry path`。
- `list`：zip/7z 为纯 peek（只读头部，不解压数据）；rar 会退化为解压到临时目录遍历后清理。
- 加密归档（含 `-mhe=on` 加密头）不支持，立即失败并提示「该压缩包已加密，暂不支持」。

## 运行流程

1. 请求经 RPC 到主线程，由受控压缩库（yauzl / node-unrar-js / 7z-wasm）执行。
2. 结果（相对路径数组或条目列表）序列化回 Worker。

## 意义

extension 无法访问 Node 解压能力，`archive` 是「读取压缩包内容」的受控出口，且带路径穿越与加密防护。

## 应用场景

- **FOMOD 预览**：`list` 读取包内文件树，供向导生成步骤。
- **条件安装**：`extract` 解压到临时目录后按规则筛选落地。
- **格式兼容**：`extract` 一个入口覆盖 zip/rar/7z 三种格式。

## 相关类型

- [IExtensionArchiveApi](/reference/types/api#iextensionarchiveapi)
- [IExtensionArchiveEntry](/reference/types/api#iextensionarchiveentry)
