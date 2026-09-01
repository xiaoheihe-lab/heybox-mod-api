import type { IExtensionApi } from '../types'

export type {
  AttributeExtractor,
  DeploymentOptions,
  ExtensionEventListener,
  ExtensionFsReadFileOptions,
  ExtensionFsReadFileResult,
  ExtensionMain,
  FinalFileInstruction,
  GameConfig,
  IExtensionApi,
  IExtensionArchiveApi,
  IExtensionArchiveEntry,
  IExtensionContext,
  IExtensionEventApi,
  IExtensionFileParseApi,
  IExtensionFsApi,
  IExtensionFsStats,
  IExtensionPathApi,
  IExtensionSteamEnsureLaunchOptionResult,
  IExtensionSteamLaunchOptionFailure,
  IExtensionSteamLaunchOptionsEntry,
  IExtensionUiRequestOptions,
  IExtensionUiRequestPayload,
  IExtensionUiResponse,
  IExtensionVfsApi,
  IGameStoreHelper,
  InstallerInstall,
  InstallerTest,
  LocalModFeature,
  LocalModMark,
  LocalModMarkType,
  ManagedDeploymentEntry,
  ManagedDeploymentGameFile,
  ManagedDeploymentHookPhase,
  ManagedDeploymentMutation,
  ManagedDeploymentMutationOperation,
  ManagedDeploymentMutationOptions,
  ManagedDeploymentMutationResult,
  ManagedDeploymentMutationSnapshot,
  ModTypeRule,
  PostInstallerAttributeContext,
  PostInstallerAttributeExtractor,
  SteamGameInfo,
  VortexActionCallback,
  VortexActionCondition,
  VortexActionPropsCallback,
  VortexRegisterModTypeOptions,
} from '../types'

export type * from '../types/fomod'
export type * from '../types/load-order'
export type * from '../types/steam-prerequisite'

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
  /** 稳定的错误码；缺省回退到 status。 */
  code: string
  constructor(input: string | { [k: string]: any })
}

export declare const api: IExtensionApi
