import * as mongoose from 'mongoose';



/**
 * UserDocument 接口
 */
export interface IUserDocument extends mongoose.Document {
  /**
   * 邮箱
   */
  email: String;

  /**
   * 用户名
   */
  username: String;

  /**
   * 密码
   */
  password: String;

  /**
   * 性别
   */
  gender: String;

  /**
   * 等级
   */
  lv: Number;

  /**
   * 个人简介
   */
  profile: String;

  /**
   * 头像
   */
  avatar: String;

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
  salt: String;
}
