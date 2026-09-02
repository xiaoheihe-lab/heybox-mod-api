# API 参考

按 `types/` 的功能域划分，参考文档分三组：

## [扩展门面 context](/reference/context/registerGame)

`IExtensionContext` 上的全部注册函数，每个函数带参数视图、运行流程、意义与应用场景：

- [registerGame](/reference/context/registerGame) / [registerModType](/reference/context/registerModType) / [registerInstaller](/reference/context/registerInstaller)
- [registerAttributeExtractor](/reference/context/registerAttributeExtractor) / [registerPostInstallerAttributeExtractor](/reference/context/registerPostInstallerAttributeExtractor)
- [registerManagedDeploymentHook](/reference/context/registerManagedDeploymentHook) / [registerLoadOrder](/reference/context/registerLoadOrder)
- [registerExtensionAction](/reference/context/registerExtensionAction) / [registerAction 与 once](/reference/context/registerAction)

## [工具面 api](/reference/api/events)

`context.api` 提供的宿主能力：

- [events 事件总线](/reference/api/events) / [steam 启动与游戏](/reference/api/steam) / [ui 弹窗](/reference/api/ui)
- [fomod 安装向导](/reference/api/fomod) / [path 与 fs](/reference/api/path-fs) / [archive 压缩包](/reference/api/archive)
- [vfs 与 loadOrder](/reference/api/vfs-loadorder) / [其他工具](/reference/api/util-misc)

## [类型参考 types](/reference/types/game)

与 `types/` 文件一一对应的类型域：

- [game 游戏注册](/reference/types/game) / [installer 安装时序](/reference/types/installer) / [vfs 托管部署](/reference/types/vfs)
- [api 门面工具](/reference/types/api) / [fomod 安装向导](/reference/types/fomod)
- [load-order 加载顺序](/reference/types/load-order) / [steam-prerequisite 前置条件](/reference/types/steam-prerequisite)
- [ClientInvokeError](/reference/types/client-invoke-error)
