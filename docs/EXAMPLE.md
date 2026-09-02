# Example

这是小黑盒 Mod 管理器扩展（extension）的类型仓库。扩展通过 `IExtensionContext` 门面与基座交互：

```ts
import type { IExtensionContext } from 'heybox-mod-api'

const GAME_ID = 1091500

export default function main(context: IExtensionContext) {
  // 注册游戏及其基础描述
  context.registerGame({
    id: GAME_ID,
    queryPath: async () =>
      (await context.api.util.GameStoreHelper.findByAppId(GAME_ID))?.gamePath,
  })

  // Vortex 风格：注册 ModType
  context.registerModType(
    'example-mod',
    25,
    () => true,
    () => '{gamePath}/Mods',
    (files) => files.some((file) => file.endsWith('.pak')),
    { name: 'Example Mod' },
  )

  // 注册 installer，返回 instructions 等安装结果
  context.registerInstaller(
    'example-mod',
    10,
    (files) => files.some((file) => file.endsWith('.pak')),
    (files) => ({
      instructions: files
        .filter((file) => file.endsWith('.pak'))
        .map((file) => ({ type: 'copy', source: file, destination: file })),
    }),
  )

  // 注册加载顺序 provider
  context.registerLoadOrder({
    id: 'example-load-order',
    gameId: GAME_ID,
    title: '加载顺序',
    modTypes: ['example-mod'],
    deserializeLoadOrder: (loadOrderContext) => loadOrderContext.mods.map((mod) => ({
      id: mod.modKey,
      ownerModKey: mod.modKey,
      name: String(mod.metaInfo.name || mod.modKey),
      enabled: mod.enabled,
    })),
    serializeLoadOrder: async (entries, loadOrderContext) => {
      // 写入游戏配置或调用官方部署工具
    },
  })

  // 通过受限 API 面使用宿主能力
  context.registerExtensionAction(GAME_ID, 'deployLoadOrder', () =>
    context.api.loadOrder.deploy('example-load-order'))
}
```

扩展只能调用 `IExtensionContext` 中声明的能力，禁止访问 ExtensionManager / HeyboxModManager。

## 进一步阅读

- 分域文档见 [docs/README.md](README.md)
- 交互式站点（含时序图）在 `docs-site/`
