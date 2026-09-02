/**
 * 扩展门面类型总入口：按功能域拆分，此文件仅做统一再导出
 *
 * - fomod / load-order / steam-prerequisite：三个独立交互域
 * - game：游戏注册域（GameConfig、IGameStoreHelper、本地 Mod 标记）
 * - installer：安装时序域（ModTypeRule、DeploymentOptions、installer、属性抽取）
 * - vfs：托管部署域（ManagedDeploymentMutation）
 * - api：门面 API 域（IExtensionApi 及其工具子面）
 * - context：扩展门面域（IExtensionContext、入口签名、Vortex 辅助类型）
 */
export type * from './fomod'
export type * from './load-order'
export type * from './steam-prerequisite'
export type * from './game'
export type * from './installer'
export type * from './vfs'
export type * from './api'
export type * from './context'
