/**
 * 错误消息枚举
 */
export enum ErrorCodeEnum {

  /**
   * 成功
   */
  SUCCESS,

  /**
   * 未知原因导致错误
   */
  ERROR_UNDEFINED,

  //
  // 登录
  //

  /**
   * 登录失败，未知原因的错误
   */
  LOGIN_ERROR__UNDEFINED,

  /**
   * EMAIL(邮箱)错误
   */
  LOGIN_ERROR__EMAIL_ERROR,

  /**
   * 密码错误
   */
  LOGIN_ERROR__PASSWORD_ERROR,

  /**
   * EMAIL(邮箱)或密码错误
   */
  LOGIN_ERROR__EMAIL_OR_PASSWORD_ERROR,

  //
  // 注册
  //

  /**
   * 注册失败，未知原因的错误
   */
  LOGON_ERROR__UNDEFINED,

  /**
   * 缺少邮箱
   */
  LOGON_ERROR__EMAIL_REQUIRE,

  /**
   * EMAIL(邮箱)已存在
   */
  LOGON_ERROR__EMAIL_EXIST,

  /**
   * EMAIL(邮箱)不合法
   */
  LOGON_ERROR__EMAIL_ILLEGAL,

  /**
   * 密码错误
   */
  LOGON_ERROR__PASSWORD_ERROR,

}
