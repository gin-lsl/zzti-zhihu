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
   * 收藏此问题的用户id
   */
  collectUsersId: Array<string>;

  /**
   * 给此问题点赞的用户
   */
  upUsersId: Array<string>;

  /**
   * 是否是匿名用户提问
   */
  isAnonymous: boolean;
}

/**
 * Question 类
 *
 * @author lsl
 */
export class Question implements IQuestion {
  title: string;
  description: string;
  userId: string;
  tags: string[];
  collectUsersId: string[];
  upUsersId: string[];
  isAnonymous: boolean;

  /**
   * 生成mongoose模式定义对象
   */
  static createSchemaDefinition(): SchemaDefinition {
    return {
      title: String,
      description: String,
      userId: String,
      tags: [String],
      collectUsersId: [String],
      upUsersId: [String],
      isAnonymous: Boolean,
    };
  }
}
