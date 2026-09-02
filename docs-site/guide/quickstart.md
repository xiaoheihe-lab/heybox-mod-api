# 快速开始

## 这是什么

`heybox-mod-api` 是小黑盒 Mod 管理器的 **extension 类型声明包**。Mod 管理器通过加载各游戏的
extension 来支持不同游戏的 Mod 安装；你写的 extension 是这样一个入口：

```ts
export default async function main(context: IExtensionContext) {
  // 注册游戏、Mod 类型、installer 等
}
```

extension 代码运行在 **Worker 沙箱**中，只能通过 `context` 门面与基座（Mod 管理器宿主）交互，
不能直接使用 `fs`、`child_process`、`electron` 等 Node/Electron 能力。

## 安装

```bash
npm install -D heybox-mod-api
```

类型声明按子路径导出：

```ts
import type { IExtensionContext, IExtensionApi } from 'heybox-mod-api/apis'
import type { GameConfig, ModTypeRule } from 'heybox-mod-api/types'
```

## 最小 extension

```ts
import type { IExtensionContext } from 'heybox-mod-api'

const GAME_ID = 1091500

export default function main(context: IExtensionContext) {
  // 1. 注册游戏：告诉基座这个 extension 负责哪款游戏、如何找到游戏目录
  context.registerGame({
    id: GAME_ID,
    queryPath: async () =>
      (await context.api.util.GameStoreHelper.findByAppId(GAME_ID))?.gamePath,
  })

  // 2. 注册 Mod 类型：声明「什么算一个 Mod」以及它安装到哪里
  context.registerModType(
    'example-mod',
    25, // priority 越大越优先
    () => true,
    () => '{gamePath}/Mods',
    (files) => files.some((file) => file.endsWith('.pak')),
    { name: 'Example Mod' },
  )

  // 3. 注册 installer：给定文件集合，产出安装指令
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
}
```

::: tip 一句话理解三者的关系
`registerModType` 决定“这个压缩包算哪种 Mod、装到哪个目录”；`registerInstaller` 决定“怎么从压缩包里
选出文件、生成哪些落地指令”。基座在启用 Mod 时按 priority 依次调用 installer 的 test，第一个命中的
installer 生成 `instructions`，再由基座统一落地。
:::

## 目录约定

```
src/
  index.ts        # 入口，default export main(context)
  constants.ts    # appid、modType id、路径等
  modTypes.ts     # registerModType 调用
  installers.ts   # registerInstaller 调用
```

## 调试

- 本地开发路径在 Mod 管理器用户设置中配置（developer extension），加载顺序优先于远端版本。
- 扩展内 `console.log` 输出会被转发到基座日志。
- 想验证类型是否写对，直接用 TypeScript 检查：

```bash
tsc --noEmit
```

## 下一步

- [扩展运行时序](/guide/lifecycle)：了解扩展从加载到启用、禁用、卸载的完整生命周期。
- [扩展门面 context](/reference/context/registerGame)：所有注册函数的参数与流程。
- [工具面 API](/reference/api/events)：steam / ui / fomod / fs / archive 等宿主能力。
