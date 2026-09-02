/**
 * 安装时序域：Mod 类型规则、部署选项、installer 与属性抽取
 */
import type { FomodDeploymentOptions } from './fomod'

/** Mod 类型安装规则（目标路径、过滤条件等由具体扩展约定） */
export type ModTypeRule = Record<string, unknown>

/** enable 阶段由外部注入给 extension 的动态部署选项 */
export interface DeploymentOptions {
  /**
   * Default Extension 专用：压缩包内 source 路径 -> default_path（相对游戏根目录）
   * - value 缺省/空字符串表示安装到游戏根目录
   */
  defaultPathBySource?: Record<string, string>
  /** Web 侧「忽略冲突并继续」：跳过 enable 前栈冲突预检，直接覆盖落地 */
  ignoreConflict?: boolean
  /** 预留给未来其他动态参数 */
  /** SDK 内部传给 extension 的原始文件物理路径映射：archive relative path -> hash pool absolute path */
  sourcePathByFile?: Record<string, string>
  /** FOMOD 专用部署上下文；storedState 由 SDK 注入。 */
  fomod?: FomodDeploymentOptions
  /** 预留给未来其他动态参数 */
  [key: string]: unknown
}

/** Installer 测试函数：判断是否能处理当前文件集合 */
export type InstallerTest = (
  files: string[],
  gameId: number | string
) => boolean | Promise<boolean> | { supported: boolean } | Promise<{ supported: boolean }>

/** Installer 执行函数：生成安装结果（通常包含 instructions） */
export type InstallerInstall = (
  files: string[],
  destinationPath?: string,
  options?: DeploymentOptions
) => any | Promise<any>

/** Vortex 风格属性抽取器：从 modInfo/modPath 抽取属性，结果合并进 mod 属性 */
export type AttributeExtractor = (
  modInfo: unknown,
  modPath: string
) => Record<string, unknown> | Promise<Record<string, unknown>>

/** 安装指令：copy 复制文件，generatefile 生成文件；verification/conflictPolicy 控制校验与冲突策略 */
export type FinalFileInstruction =
  | {
      readonly type: 'copy'
      readonly source: string
      readonly destination: string
      readonly verification?: 'hash' | 'exists'
      readonly conflictPolicy?: 'prompt' | 'overwrite'
    }
  | {
      readonly type: 'generatefile'
      readonly source?: string
      readonly destination: string
      readonly data?: string | Buffer | Uint8Array | null
      readonly verification?: 'hash' | 'exists'
      readonly conflictPolicy?: 'prompt' | 'overwrite'
    }

/** post-install 属性抽取上下文：安装指令生成后、落地前注入 */
export interface PostInstallerAttributeContext {
  appid: number
  gameId: number
  modKey: string
  installerTypeId: string
  modTypeId: string
  /** 暂存目录（解压后的原始文件所在位置） */
  stagingPath: string
  archiveFiles: readonly string[]
  instructions: readonly FinalFileInstruction[]
}

/** post-install 属性抽取器：在安装指令生成后基于文件集合提取属性（如 FOMOD 选中的 pak 列表） */
export type PostInstallerAttributeExtractor = (
  context: PostInstallerAttributeContext
) => Record<string, unknown> | Promise<Record<string, unknown>>
