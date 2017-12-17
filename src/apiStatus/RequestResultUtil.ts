import { IServiceResult } from "../interfaces/index";
import { ErrorCodeEnum } from "./ErrorCode.enum";

/**
 * 请求结果工具类
 */
export class RequestResultUtil {

  /**
   * 返回一个错误数据
   *
   * @param errorCode 错误代码
   * @param errorMessage 错误消息
   */
  public static createError(errorCode: ErrorCodeEnum, errorMessage?: string): IServiceResult<any> {
    return {
      success: false,
      errorCode: errorCode,
      errorMessage: errorMessage
    };
  }

  /**
   * 返回成功数据
   *
   * @param successResult 成功返回的数据
   */
  public static createSuccess<T>(successResult?: T): IServiceResult<T> {
    return {
      success: true,
      successResult: successResult
    };
  }
}
