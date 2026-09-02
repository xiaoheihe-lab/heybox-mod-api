# registerModType

> 声明「什么算一个 Mod」以及它安装到哪个目录。两个重载分别对应简式注册与 Vortex 风格注册。

## 签名

```ts
// 简式：为特定游戏声明 Mod 类型
registerModType(gameId: number, typeId: string, rule: ModTypeRule): void

// Vortex 风格：声明目标路径与文件判定
registerModType(
  typeId: string,
  priority: number,
  isSupported: (gameId: number | string) => boolean,
  getTargetPath: (game: { gamePath?: string }) => string,
  test: (...args: unknown[]) => boolean | Promise<boolean>,
  options?: VortexRegisterModTypeOptions,
): void
```

## 参数（Vortex 风格重载）

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| typeId | `string` | modType 唯一标识（例如 `2868840-mod`），与 installer 关联键一致 |
| priority | `number` | 优先级，数值越大越优先 |
| isSupported | `(gameId) => boolean` | 当前环境是否支持（例如已发现 gamePath） |
| getTargetPath | `(game) => string` | 返回目标路径模板，支持 `{gamePath}` 占位符 |
| test | `(...args) => boolean \| Promise<boolean>` | 判断某文件集合是否属于该类型 |
| options | [VortexRegisterModTypeOptions](#vortexregistermodtypeoptions) | 显示名等元数据 |

## 返回值

无。

## 运行流程

1. 注册信息随扩展加载登记到该游戏的 `GameContext`。
2. **发现游戏阶段**：基座调用 `isSupported(gameId)` 判断该 modType 是否可用。
3. **启用阶段**：基座调用 `test(files)` 判断文件集合是否属于该类型。
4. **求目标目录**：基座调用 `getTargetPath({ gamePath })`，把 `{gamePath}` 替换为真实游戏目录。

注意：`getTargetPath` 只是求「目标目录模板」，真正的文件落点由 installer 的指令决定。

## 意义

modType 是 Mod 分类的核心：一个游戏可以有多种 Mod 形态（pak、脚本、存档），每种各注册一个 modType，安装路径和判定逻辑各自独立。

## 应用场景

- **按扩展名分类**：`.pak` → `{gamePath}/Content/Paks`，`.lua` → `{gamePath}/Scripts`。
- **按目录分类**：BepInEx 插件 → `{gamePath}/BepInEx/plugins`，MelonLoader → `{gamePath}/MLLoader/Mods`。
- **安装到游戏根目录**：`getTargetPath` 直接返回 `'{gamePath}'`。

## 相关类型

- [ModTypeRule](/reference/types/installer#modtyperule)
- [VortexRegisterModTypeOptions](#vortexregistermodtypeoptions)：`{ name?: string; [k: string]: unknown }`

### VortexRegisterModTypeOptions

```ts
type VortexRegisterModTypeOptions = { name?: string; [k: string]: unknown }
```
