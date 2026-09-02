# registerInstaller

> 决定「怎么从压缩包里选出文件、生成哪些落地指令」。与同 `typeId` 的 modType 绑定。

## 签名

```ts
registerInstaller(
  typeId: string,
  priority: number,
  test: InstallerTest,
  install: InstallerInstall,
): void
```

## 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| typeId | `string` | 关联的 modType id（与 `registerModType` 的 typeId 一致） |
| priority | `number` | installer 优先级，数值越大越优先 |
| test | [InstallerTest](/reference/types/installer#installertest) | 判断是否能处理当前文件集合 |
| install | [InstallerInstall](/reference/types/installer#installerinstall) | 生成安装结果（通常包含 instructions） |

## 返回值

无。

## 运行流程

1. **启用 Mod 时**，基座按 priority 从高到低调用各 installer 的 `test(files, gameId)`。
2. 第一个返回 true 的 installer 被选中；全部未命中则报「未知的 Mod 格式」。
3. 基座调用命中 installer 的 `install(files, destinationPath?, options?)`。
4. `install` 返回的 `instructions`（[FinalFileInstruction[]](/reference/types/installer#finalfileinstruction)）交给基座执行落地。
5. 若注册了 post-installer 属性抽取器，此时运行（见 [registerPostInstallerAttributeExtractor](/reference/context/registerPostInstallerAttributeExtractor)）。

关键约束：installer **只生成施工图纸**（指令），不直接写游戏目录；落地与回滚由基座统一负责。

## 意义

installer 是「安装决策」的唯一入口：同一份压缩包，不同游戏/不同 modType 的处理方式不同，都由这里定义。

## 应用场景

- **筛选落地**：把压缩包里特定后缀/目录的文件映射到游戏目录。
- **生成配置文件**：`generatefile` 指令在目标目录生成新文件（如入口 ini）。
- **交互式安装**：在 `install` 内调用 `api.util.fomod.requestStep` / `api.util.ui.request`，按用户选择生成指令。
- **复合安装**：一个 installer 同时产出 `copy` + `generatefile` + `attribute` 指令。

## 相关类型

- [InstallerTest](/reference/types/installer#installertest)
- [InstallerInstall](/reference/types/installer#installerinstall)
- [FinalFileInstruction](/reference/types/installer#finalfileinstruction)
- [DeploymentOptions](/reference/types/installer#deploymentoptions)
