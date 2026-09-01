# heybox-mod-api

小黑盒 Mod 管理器运行时 API 类型声明和文档。

## 安装

```bash
npm install -D heybox-mod-api
```

## 使用

```ts
import type { GameConfig, ModTypeRule } from 'heybox-mod-api'
import type {
  IExtensionContext,
  IExtensionApi,
  LoadOrderRegistration,
  LoadOrderSnapshot,
  FomodStepRequest,
  SteamPrerequisiteRegistration,
} from 'heybox-mod-api/apis'
```

也可以按子路径只导入某一类声明：

```ts
import type { GameConfig } from 'heybox-mod-api/types'
import type { IExtensionContext } from 'heybox-mod-api/apis'
```

## 目录结构

```
types/                 # 基础类型与门面：GameConfig, IExtensionContext, IExtensionApi 等
types/fomod.d.ts       # FOMOD 安装器 UI 类型
types/load-order.d.ts  # 加载顺序 provider 类型
types/steam-prerequisite.d.ts # Steam 前置条件（官方工具 DLC）类型
apis/                  # 门面接口再导出：IExtensionContext, IExtensionApi, ClientInvokeError
docs/                  # 使用文档和示例
```

## 与 SDK 版本的对应

- 本包类型与 `@heybox/hb-pc-mod-sdk` 中 extension 门面（`IExtensionContext` / `IExtensionApi`）对齐；
- 扩展只通过该门面与 Mod 管理器基座交互，不暴露 SDK 内部能力。

## 许可

ISC
