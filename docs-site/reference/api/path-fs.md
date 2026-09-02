# path 与 fs

> 同步路径工具 + 受限只读文件系统。两者是 extension 处理本地路径与读取文件的唯一通道。

## path

`api.util.path` 是 Node `path` 的同步本地封装（纯本地实现，不走 RPC）：

| 方法 | 说明 |
| --- | --- |
| sep | 平台路径分隔符 |
| join(...segments) | 拼接路径 |
| normalize(filePath) | 规范化路径 |
| basename(filePath, ext?) | 取文件名 |
| dirname(filePath) | 取目录名 |
| extname(filePath) | 取扩展名 |

```ts
const root = context.api.util.path.join(gamePath, REDMOD_METADATA)
const ext = context.api.util.path.extname(root)
```

## fs

`api.util.fs` 是受限**只读**文件接口：

```ts
stat(filePath: unknown): Promise<IExtensionFsStats>
readdir(filePath: unknown): Promise<string[]>
readFile(filePath: unknown, options?: ExtensionFsReadFileOptions): Promise<ExtensionFsReadFileResult>
```

- `stat` 返回 [IExtensionFsStats](/reference/types/api#iextensionfsstats)：`{ isFile, isDirectory, isSymbolicLink, size, mtimeMs, ctimeMs, birthtimeMs }`。
- `readFile` 的 `options` 为 [ExtensionFsReadFileOptions](/reference/types/api#extensionfsreadfileoptions)：
  `BufferEncoding | { encoding? } | null`；返回 [ExtensionFsReadFileResult](/reference/types/api#extensionfsreadfileresult)（`string | Buffer`）。
- `statAsync` / `readdirAsync` / `readFileAsync` 为同实现的历史别名。
- 路径含 `\0` 会抛错；只能读，不能写文件。

## 运行流程

- `path` 系列在 Worker 本地同步执行，无主线程往返，可以放心在 getTargetPath 等同步函数内使用。
- `fs` 系列经 RPC 到主线程，由受控的只读实现执行后返回序列化结果。

## 意义

沙箱隔离下 extension 没有 Node 的 `fs`/`path`，这两个门面是替代品：
`path` 保证纯字符串运算零开销；`fs` 把文件读取限制在白名单语义内。

## 应用场景

- **游戏文件探测**：`stat` 判断前置工具是否已安装（如 REDmod 的 metadata 文件）。
- **读配置文件**：`readFile(path, 'utf8')` 读游戏 ini / 清单。
- **目录扫描**：`readdir` 枚举游戏 Mod 目录下的 pak。

## 相关类型

- [IExtensionPathApi](/reference/types/api#iextensionpathapi)
- [IExtensionFsApi](/reference/types/api#iextensionfsapi)
- [IExtensionFsStats](/reference/types/api#iextensionfsstats)
