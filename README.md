# heybox-mod-api

小黑盒 Mod 管理器运行时 API 类型声明和文档。

## 安装

```bash
npm install -D heybox-mod-api
```

## 使用

```ts
import type { GameConfig, ModTypeRule } from 'heybox-mod-api'
import type { IExtensionContext, IExtensionApi } from 'heybox-mod-api/apis'
```

也可以按子路径只导入某一类声明：

```ts
import type { GameConfig } from 'heybox-mod-api/types'
import type { IExtensionContext } from 'heybox-mod-api/apis'
```

## 目录结构

```
types/   # 基础类型：GameConfig, ModTypeRule, IGameStoreHelper 等
apis/    # 门面接口：IExtensionContext, IExtensionApi, ClientInvokeError
docs/    # 使用文档和示例
```

## 许可

ISC
