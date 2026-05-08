# heybox-mod-api

小黑盒 Mod 管理器运行时 API 类型声明和文档。

## 安装

## 使用

```ts
import type { GameConfig, ModTypeRule } from 'heybox-mod-api'
import type { IExtensionContext, IExtensionApi } from 'heybox-mod-api/api'
```

## 目录结构

```
types/   # 基础类型：GameConfig, ModTypeRule, IGameStoreHelper 等
api/     # 门面接口：IExtensionContext, IExtensionApi, ClientInvokeError
docs/    # 使用文档和示例
```

## 许可

ISC
