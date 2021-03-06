import { SchemaDefinition } from "mongoose";

/**
 * IQuestion 接口
 *
 * @author lsl
 */
export interface IQuestion {

  /**
   * 标题
   */
  title: string;

  /**
   * 描述
   */
  description: string;

  /**
   * 用户ID
   */
  userId: string;

  /**
   * 标签
   */
  tags: Array<string>;

  /**
   * 发布日期
   */
  createAt: Date;

  /**
   * 收藏此问题的用户id
   */
  collectUserIds: Array<string>;

  /**
   * 给此问题点赞的用户
   */
  upUserIds: Array<string>;

  /**
   * 反对此问题的用户
   */
  downUserIds: Array<string>;

  /**
   * 收藏此问题的用户
   */
  saveUserIds: Array<string>;

  /**
   * 是否是匿名用户提问
   */
  isAnonymous: boolean;

  /**
   * 访问次数
   */
  lookCount: number;

  /**
   * 是否被置顶
   */
  isTop: boolean;
}

/**
 * Question 类
 *
 * @author lsl
 */
export class Question implements IQuestion {
  id: string;
  title: string;
  description: string;
  userId: string;
  tags: string[];
  createAt: Date;
  collectUserIds: string[];
  upUserIds: string[];
  downUserIds: string[];
  saveUserIds: string[];
  isAnonymous: boolean;
  lookCount: number;
  isTop: boolean;

  /**
   * 生成mongoose模式定义对象
   */
  static createSchemaDefinition(): SchemaDefinition {
    return {
      title: String,
      description: String,
      userId: String,
      tags: [String],
      createAt: Date,
      collectUserIds: [String],
      upUserIds: [String],
      downUserIds: [String],
      saveUserIds: [String],
      isAnonymous: Boolean,
      lookCount: Number,
      isTop: Boolean,
    };
  }
}
