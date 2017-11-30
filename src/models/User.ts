import { model, Schema, Document, Model } from 'mongoose';
import { ObjectId } from 'bson';
import { IUser } from '../schemas/IUser';

/**
 * User模式
 */
const UserSchema = new Schema({

  /**
   * 邮箱
   */
  email: String,

  /**
   * 用户名
   */
  username: String,

  /**
   * 密码
   */
  password: String,

  /**
   * 性别
   */
  gender: String,

  /**
   * 等级
   */
  lv: Number,

  /**
   * 个人简介
   */
  profile: String,

  /**
   * 头像
   */
  avatar: String,

  /**
   * 注册时间
   */
  logonTime: Date,

  /**
   * 上次登录时间
   */
  lastLoginTime: Date,

  /**
   * 关注他的
   */
  followHim: [Schema.Types.ObjectId],

  /**
   * 他关注的
   */
  hesFollow: [Schema.Types.ObjectId],

  /**
   * 他收藏的
   */
  collections: [Schema.Types.ObjectId],

  /**
   * 加盐值
   */
  salt: String,
});

/**
 * User模型
 */
export const UserModel: Model<IUser> = model<IUser>('User', UserSchema);
