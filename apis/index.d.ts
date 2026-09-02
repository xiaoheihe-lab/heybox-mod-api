import type { IExtensionApi } from '../types'

// 门面接口全量再导出（等价于 heybox-mod-api/types 的全部导出）
export type * from '../types'

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
