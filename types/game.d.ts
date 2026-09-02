/**
 * 游戏注册域：Steam 商店信息、游戏基础描述与本地 Mod 标记
 */
import type { SteamPrerequisiteRegistration } from './steam-prerequisite'

/** Steam 游戏信息 */
export interface SteamGameInfo {
  appid: number
  folder_path: string
}

/** GameStoreHelper - Steam 游戏商店辅助工具 */
export interface IGameStoreHelper {
  /** 按 appid 查找游戏安装路径；未找到返回 null。内部会自动初始化并刷新商店数据 */
  findByAppId(appId: number | string | Array<number | string>): Promise<{ gamePath: string } | null>
  /** 同步返回缓存的 Steam 游戏信息 */
  getGameInfoByAppid(appid: number): SteamGameInfo | undefined
  /** 初始化商店数据 */
  initialize(): Promise<void>
  /** 刷新商店数据 */
  refreshStore(): Promise<void>
}

export type LocalModMarkType = 'prerequisite' | 'warning' | 'danger' | 'success'

/** 本地 Mod 列表中的标记（如「前置模组」） */
export interface LocalModMark {
  type: LocalModMarkType
  label: string
}

/** 本地 Mod 列表的 extension 声明条目；重复 modId 以后声明为准 */
export interface LocalModFeature {
  modId: number
  pinned?: boolean
  marked?: boolean
  mark?: LocalModMark
}

/** 游戏基础描述；id 缺省时由加载流程注入为当前 appid */
export interface GameConfig {
  id?: number | string | 'default'
  /** 解析游戏安装路径；返回 undefined 表示当前环境未安装 */
  queryPath: () => string | undefined | Promise<string | undefined>
  /** Steam 前置条件声明（如官方工具 DLC） */
  steamPrerequisites?: SteamPrerequisiteRegistration[]
  /** 本地 Mod 列表的 extension 声明；重复 modId 以后声明为准。 */
  localModFeatures?: LocalModFeature[]
  [key: string]: unknown
}
