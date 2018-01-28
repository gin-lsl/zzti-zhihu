import { ErrorCodeEnum } from "../apiStatus";

/**
 * Service返回的数据对象接口
 */
export interface IServiceResult<T = any> {

  /**
   * 是否成功
   */
  success: boolean;

  /**
   * 错误代码
   */
  errorCode?: ErrorCodeEnum;

  /**
   * 错误消息，一般直接返回错误代码即可
   */
  errorMessage?: string;

  /**
   * 执行成功返回的结果
   */
  successResult?: T;
}
