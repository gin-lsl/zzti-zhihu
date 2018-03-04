/**
 * 错误消息枚举
 */
export enum ErrorCodeEnum {

  /**
   * 成功
   */
  SUCCESS = '#___ZZTI__SUCCESS',

  /**
   * 未知原因导致错误
   */
  UNDEFINED_ERROR = '#___ZZTI__UNDEFINED_ERROR',

  /**
   * 缺少参数
   */
  MISSING__PARAMETERS = '#___ZZTI__MISSING__PARAMETERS',

  //
  // 登录
  //

  /**
   * 登录失败，未知原因的错误
   */
  LOGIN_ERROR__UNDEFINED = '#___ZZTI__LOGIN_ERROR__UNDEFINED',

  /**
   * EMAIL(邮箱)错误
   */
  LOGIN_ERROR__EMAIL_ERROR = '#___ZZTI__LOGIN_ERROR__EMAIL_ERROR',

  /**
   * 密码错误
   */
  LOGIN_ERROR__PASSWORD_ERROR = '#___ZZTI__LOGIN_ERROR__PASSWORD_ERROR',

  /**
   * EMAIL(邮箱)或密码错误
   */
  LOGIN_ERROR__EMAIL_OR_PASSWORD_ERROR = '#___ZZTI__LOGIN_ERROR__EMAIL_OR_PASSWORD_ERROR',

  //
  // 注册
  //

  /**
   * 注册失败，未知原因的错误
   */
  LOGON_ERROR__UNDEFINED = '#___ZZTI__LOGON_ERROR__UNDEFINED',

  /**
   * 没有提供邮箱或密码
   */
  LOGON_ERROR__NO_EMAIL_OR_PASSWORD = '#___ZZTI__LOGON_ERROR__NO_EMAIL_OR_PASSWORD',

  /**
   * 缺少邮箱
   */
  LOGON_ERROR__NO_EMAIL = '#___ZZTI__LOGON_ERROR__NO_EMAIL',

  /**
   * EMAIL(邮箱)已存在
   */
  LOGON_ERROR__EMAIL_EXIST = '#___ZZTI__LOGON_ERROR__EMAIL_EXIST',

  /**
   * EMAIL(邮箱)不合法
   */
  LOGON_ERROR__EMAIL_ILLEGAL = '#___ZZTI__LOGON_ERROR__EMAIL_ILLEGAL',

  /**
   * 密码错误
   */
  LOGON_ERROR__PASSWORD_ERROR = '#___ZZTI__LOGON_ERROR__PASSWORD_ERROR',

  /**
   * 密码长度不够
   */
  LOGIN_ERROR__PASSWORD_TOO_SHORT = '#___ZZTI__LOGIN_ERROR__PASSWORD_TOO_SHORT',

  /**
   * 没有权限
   */
  AUTHORIZATION = '#___ZZTI__AUTHORIZATION',

  /**
   * 未知用户
   */
  UNKNOWN_USER = '#___ZZTI__UNKNOWN_USER',

  /**
   * 不能对自己执行此操作
   */
  CANNOT_DO_FOR_SELF = '#___ZZTI__CANNOT_DO_FOR_SELF',

  /**
   * 找不到目标
   */
  CANNOT_FOUND_TARGET = '#___ZZTI__CANNOT_FOUND_TARGET',

  /**
   * 操作重复
   */
  OPERATION_DUPLICATION = '#___ZZTI__OPERATION_DUPLICATION',

  /**
   * 操作冲突
   */
  OPERATION_CONFLICT = '#___ZZTI__OPERATION_CONFLICT',

}
