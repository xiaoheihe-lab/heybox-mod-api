# Example

这是小黑盒 Mod 管理器扩展（extension）的类型仓库。扩展通过 `IExtensionContext` 门面与基座交互：

```ts
import type {
  IExtensionContext,
  LoadOrderRegistration,
  SteamPrerequisiteRegistration,
} from 'heybox-mod-api'

export default async function main(context: IExtensionContext) {
  // 注册游戏及其基础描述
  context.registerGame({
    id: '2868840',
    queryPath: () => undefined,
    steamPrerequisites: [redmodPrerequisite],
  })

  // Vortex 风格：注册 ModType
  context.registerModType(
    '2868840-mod',
    25,
    (gameId) => true,
    () => '{gamePath}/mods',
    (files) => files.some((file) => file.endsWith('.pak')),
    { name: 'Pak Mod' },
  )

  // 注册 installer，返回 instructions 等安装结果
  context.registerInstaller('2868840-mod', 10, test, install)

  // 注册加载顺序 provider
  context.registerLoadOrder({
    id: 'pak-load-order',
    gameId: 2868840,
    title: 'Pak 加载顺序',
    modTypes: ['2868840-mod'],
    deserializeLoadOrder: (context) => [],
    serializeLoadOrder: async (entries, context) => {},
  })

  // 通过受限 API 面使用宿主能力
  const game = await context.api.util.GameStoreHelper.findByAppId(2868840)
  await context.api.loadOrder.deploy('pak-load-order')
}
```

扩展只能调用 `IExtensionContext` 中声明的能力，禁止访问 ExtensionManager / HeyboxModManager。
