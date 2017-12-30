import { model, Schema, Document, Model } from 'mongoose';
import { ObjectId } from 'bson';
import { IUserDocument } from '../schemas/IUserDocument';

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
  followHim: [String],

  /**
   * 他关注的
   */
  hesFollow: [String],

  /**
   * 他收藏的
   */
  collections: [String],

  /**
   * 加盐值
   */
  salt: String,
});

/**
 * User模型
 */
export const UserModel: Model<IUserDocument> = model<IUserDocument>('User', UserSchema);
