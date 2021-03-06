import * as mongoose from 'mongoose';
import { SchemaDefinition } from 'mongoose';

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
  followHimIds: Array<string>;

  /**
   * 他关注的
   */
  hisFollowIds: Array<string>;

  /**
   * 他收藏的
   */
  collectionQuestionIds: Array<string>;

  /**
   * 加盐值
   */
  salt: string;

  /**
   * 赞同人数
   */
  upCount: number;

  /**
   * 收藏人数
   */
  saveCount: number;
}


/**
 * User 类
 *
 * @author lsl
 */
export class User implements IUser {
  id: string;
  email: string;
  username: string;
  password: string;
  gender: string;
  lv: number;
  profile: string;
  avatar: string;
  logonTime: Date;
  lastLoginTime: Date;
  followHimIds: string[];
  hisFollowIds: string[];
  collectionQuestionIds: string[];
  salt: string;
  upCount: number;
  saveCount: number;

  /**
   * 生成mongoose模式定义对象
   */
  static createSchemaDefinition(): SchemaDefinition {
    return {
      email: String,
      username: String,
      password: String,
      gender: String,
      lv: Number,
      profile: String,
      avatar: String,
      logonTime: Date,
      lastLoginTime: Date,
      followHimIds: [String],
      hisFollowIds: [String],
      collectionQuestionIds: [String],
      salt: String,
      upCount: Number,
      saveCount: Number,
    };
  }
}
