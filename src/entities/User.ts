import * as mongoose from 'mongoose';

/**
 * IUser 接口
 *
 * @author lsl
 */
export interface IUser {

  /**
   * 邮箱
   */
  email: string;

  /**
   * 用户名
   */
  username: string;

  /**
   * 密码
   */
  password: string;

  /**
   * 性别
   */
  gender: string;

  /**
   * 等级
   */
  lv: number;

  /**
   * 个人简介
   */
  profile: string;

  /**
   * 头像
   */
  avatar: string;

  /**
   * 注册时间
   */
  logonTime: Date;

  /**
   * 上次登录时间
   */
  lastLoginTime: Date;

  /**
   * 关注他的
   */
  followHim: Array<string>;

  /**
   * 他关注的
   */
  hesFollow: Array<string>;

  /**
   * 他收藏的
   */
  collections: Array<string>;

  /**
   * 加盐值
   */
  salt: string;
}


/**
 * User 类
 *
 * @author lsl
 */
export class User implements IUser {

  /**
   * 邮箱
   */
  email: string;

  /**
   * 用户名
   */
  username: string;

  /**
   * 密码
   */
  password: string;

  /**
   * 性别
   */
  gender: string;

  /**
   * 等级
   */
  lv: number;

  /**
   * 个人简介
   */
  profile: string;

  /**
   * 头像
   */
  avatar: string;

  /**
   * 注册时间
   */
  logonTime: Date;

  /**
   * 上次登录时间
   */
  lastLoginTime: Date;

  /**
   * 关注他的
   */
  followHim: Array<string>;

  /**
   * 他关注的
   */
  hesFollow: Array<string>;

  /**
   * 他收藏的
   */
  collections: Array<string>;

  /**
   * 加盐值
   */
  salt: string;
}
