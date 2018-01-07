/**
 * JWT 密钥
 */
const JWT_Secret: string = 'OiJnaW5sc2wiLCJuYW0iOiJnaW5sc2wiLCJpYXQiOjE1MTM1N';

/**
 * JWT 过期时间
 */
const expiresIn: string = '6h';

/**
 * 应用配置
 */
export const AppConfig = {

  /**
   * JWT 密钥
   */
  JWT_Secret,

  /**
   * JWT 过期时间
   */
  expiresIn,

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
