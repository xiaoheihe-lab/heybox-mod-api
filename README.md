# heybox-mod-api

小黑盒 Mod 管理器运行时 API 类型声明和文档。扩展（extension）开发者通过
`IExtensionContext` 门面与 Mod 管理器基座交互，本包提供该门面的完整类型。

📖 文档站点：<https://docs.xiaoheihe.cn/hb_mod_api/>

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

`./apis` 子路径会全量再导出 `./types` 的全部类型，并额外提供 `ClientInvokeError` 等
客户端调用类型。

## 目录结构

```
types/                 # 类型声明，按功能域拆分；index.d.ts 为统一再导出桶文件
  game.d.ts            #   游戏注册域：GameConfig, IGameStoreHelper, LocalMod 标记
  installer.d.ts       #   安装时序域：DeploymentOptions, Installer, 属性抽取
  vfs.d.ts             #   托管部署域：ManagedDeploymentMutation
  api.d.ts             #   门面 API 域：IExtensionApi 及其工具子面
  context.d.ts         #   扩展门面域：IExtensionContext, ExtensionMain
  fomod.d.ts           #   FOMOD 安装向导域
  load-order.d.ts      #   加载顺序域
  steam-prerequisite.d.ts # Steam 前置条件（官方工具 DLC）域
apis/                  # 门面接口再导出 + ClientInvokeError
docs/                  # 分域文档（对齐 SDK devdocs 划分）：
                       #   extension/  扩展沙箱、门面与工具 API
                       #   game/       游戏注册与 Steam 能力
                       #   installers/ ModType 与 installer
                       #   mod/        Mod 生命周期（enable / disable / uninstall）
                       #   vfs/        托管部署与加载顺序
docs-site/             # 交互式文档站点（VitePress + Mermaid 时序图）
.github/workflows/     # GitHub Pages 自动部署
```

## 与 SDK 版本的对应

- 本包类型与 `@heybox/hb-pc-mod-sdk` 中 extension 门面（`IExtensionContext` / `IExtensionApi`）对齐；
- 扩展只通过该门面与 Mod 管理器基座交互，不暴露 SDK 内部能力；
- 本包版本与 SDK 版本同步演进（当前 1.17.0 对应 SDK 1.17.x）。

## 发布

发布目标为私有源 `registry.debugmode.cn`（见 `publishConfig.registry`）：

```bash
npm publish          # 正式版，默认 latest
npm publish --tag alpha  # 预发布版（如 1.17.0-alpha.x），不打 latest
```

预发布版本不会被 `^1.x` 范围匹配，消费方需精确锁定版本号。

## 文档站点

- 线上文档：<https://docs.xiaoheihe.cn/hb_mod_api/>（由本仓库 docs-site 构建，独立流水线部署）
- 本仓库部署：`.github/workflows/deploy-docs.yml` 在推送到 `main` 时自动构建并发布到
  GitHub Pages（<https://xiaoheihe-lab.github.io/heybox-mod-api/>）；workflow 会在首次
  运行时自动启用 Pages（无需手动去 Settings 配置 Source）
- 本地预览：`cd docs-site && npm run dev`（首次需 `npm install`）
- 站点 base 固定为 `/heybox-mod-api/`（GitHub Pages 项目页路径），构建时无需额外配置

## 许可

ISC
