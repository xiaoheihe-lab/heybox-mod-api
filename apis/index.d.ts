import type { IExtensionApi } from '../types'

export type {
  AttributeExtractor,
  DeploymentOptions,
  ExtensionEventListener,
  ExtensionFsReadFileOptions,
  ExtensionFsReadFileResult,
  ExtensionMain,
  GameConfig,
  IExtensionApi,
  IExtensionArchiveApi,
  IExtensionContext,
  IExtensionEventApi,
  IExtensionFileParseApi,
  IExtensionFsApi,
  IExtensionFsStats,
  IExtensionPathApi,
  IExtensionSteamLaunchOptionsEntry,
  IExtensionUiRequestOptions,
  IExtensionUiRequestPayload,
  IExtensionUiResponse,
  IGameStoreHelper,
  InstallerInstall,
  InstallerTest,
  ModTypeRule,
  SteamGameInfo,
  VortexActionCallback,
  VortexActionCondition,
  VortexActionPropsCallback,
  VortexRegisterModTypeOptions,
} from '../types'

export type ClientInvokeResult = any

export type ClientInvokeErrorType<T = ClientInvokeResult> = {
  status: 'failed' | 'conflict'
  msg: string
  result: T | null
}

/** 客户端调用错误 */
export declare class ClientInvokeError<T = any> extends Error {
  status: 'failed' | string
  result: T | null
  msg: string
  constructor(input: string | { [k: string]: any })
}

export declare const api: IExtensionApi
