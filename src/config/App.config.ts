/**
 * JWT 密钥
 */
const JWT_SECRET__SIGN: string = 'OiJnaW5sc2wiLCJuYW0iOiJnaW5sc2wiLCJpYXQiOjE1MTM1N';

/**
 * JWT 账户激活密钥
 */
const JWT_SECRET__ACTIVE: string = 'x4JxooLafUSIwL6UrcuXi0PW0MMFgpqJ';

/**
 * JWT 登录过期时间
 */
const EXPIRES_IN__SIGN: string = '24h';

/**
 * JWT 账户激活过期时间
 */
const EXPIRES_IN__ACTIVE: string = '1h';

/**
 * 应用配置
 */
export const AppConfig = {

  /**
   * JWT 登录密钥
   */
  JWT_SECRET__SIGN,

  /**
   * JWT 账户激活密钥
   */
  JWT_SECRET__ACTIVE,

  /**
   * JWT 登录过期时间
   */
  EXPIRES_IN__SIGN,

  /**
   * JWT 账户激活过期时间
   */
  EXPIRES_IN__ACTIVE,

};

/**
 * 站点配置
 */
export const SiteConfig = {

  /**
   * 站点名称
   */
  siteName: 'GIN LSL',

  /**
   * URL
   */
  siteUrl: 'http://127.0.0.1:3000',

};
