import * as path from 'path';
import * as fs from 'fs';

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
 * 用户头像保存路径
 */
const USER_AVATAR_PATH = path.join(__dirname, '..', 'static', 'avatar');

/**
 * 静态资源目录
 */
const STATIC_PATH = path.join(__dirname, '..', 'static');

// 生成目录
if (!fs.existsSync(STATIC_PATH)) {
  fs.mkdirSync(STATIC_PATH);
}

if (!fs.existsSync(USER_AVATAR_PATH)) {
  fs.mkdirSync(USER_AVATAR_PATH);
}

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

  /**
   * 用户头像保存路径
   */
  USER_AVATAR_PATH,

  /**
   * 静态资源目录
   */
  STATIC_PATH,

};

/**
 * 数据库配置
 */
export const DB = {

  development: {

    /**
     * 数据库名称
     */
    dbName: 'zzti_zhihu',

    /**
     * 数据库HOST
     */
    dbHost: '127.0.0.1:27017',

  },

  production: {

    dbName: 'zzti_zhihu',

    dbHost: '127.0.0.1:27017'
  }

};

/**
 * ElasticSearch 配置
 */
export const ES = {

  /**
   * Development 环境下的ES配置
   */
  development: {
    host: 'localhost:9200',
    log: 'trace',
  },

  /**
   * Production 环境下的ES配置
   */
  production: {
    host: 'localhost:9200',
    log: 'trace',
  },

  /**
   * ES索引信息
   */
  index: {
    name: 'zzti_zhihu',
  }
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
