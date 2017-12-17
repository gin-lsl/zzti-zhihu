import * as mongoose from 'mongoose';



/**
 * UserDocument 接口
 */
export interface IUserDocument extends mongoose.Document {
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
  lv: Number;

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
  followHim: [mongoose.Schema.Types.ObjectId];

  /**
   * 他关注的
   */
  hesFollow: [mongoose.Schema.Types.ObjectId];

  /**
   * 他收藏的
   */
  collections: [mongoose.Schema.Types.ObjectId];

  /**
   * 加盐值
   */
  salt: string;
}
