# heybox-mod-api 文档

小黑盒 Mod 管理器扩展（extension）开发文档。目录划分对齐 SDK `devdocs/` 的分域风格：

```
docs/
  extension/     # 扩展沙箱、门面与工具 API
  game/          # 游戏注册与 Steam 能力
  installers/    # ModType 与 installer
  mod/           # Mod 生命周期（enable / disable / uninstall）
  vfs/           # 托管部署与加载顺序
```

## 文档索引

| 域 | 文档 | 内容 |
| --- | --- | --- |
| extension | [扩展沙箱与加载模型](extension/extension-sandbox.md) | 加载来源、Worker 沙箱边界、API Proxy 与注册协议 |
| extension | [IExtensionContext 门面](extension/extension-context.md) | 所有注册函数的签名与用途 |
| extension | [context.api 工具面](extension/extension-api.md) | steam / ui / fomod / fs / archive 等宿主能力 |
| game | [GameConfig 游戏注册](game/game-config.md) | queryPath、default 绑定、前置条件与本地 Mod 标记 |
| game | [Steam 启动参数](game/steam-launch-options.md) | 按用户读写启动参数、ensure 语义 |
| game | [Steam 前置条件](game/steam-prerequisites.md) | 官方工具 DLC 检查与 UI 呈现 |
| installers | [ModType 与 installer](installers/installer-and-modtype.md) | 注册、priority、安装指令与 DeploymentOptions |
| installers | [Post-installer 属性抽取](installers/post-installer-attributes.md) | 基于最终文件集合产出 Mod 属性 |
| mod | [Enable 时序](mod/mod-enable.md) | 从文件清单到指令生成的完整链路 |
| mod | [Disable 与 Uninstall](mod/mod-disable-uninstall.md) | 回滚语义、引用计数与生命周期钩子 |
| vfs | [托管部署 Mutation](vfs/managed-deployment-mutation.md) | 事务式部署变更 |
| vfs | [加载顺序 Load Order](vfs/load-order.md) | provider 注册、revision 与部署队列 |

## 快速开始

- 完整可运行的最小扩展见 [EXAMPLE.md](EXAMPLE.md)。
- 交互式站点（含时序图）在 `docs-site/`，运行 `cd docs-site && npm run dev` 后访问
  <http://localhost:5173>。
