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
   * 收藏此问题的用户id
   */
  collectUsersId: Array<string>;

  /**
   * 给此问题点赞的用户
   */
  upUsersId: Array<string>;
}

/**
 * Question 类
 *
 * @author lsl
 */
export class Question implements IQuestion {
  title: string;
  description: string;
  collectUsersId: string[];
  upUsersId: string[];

  /**
   * 生成mongoose模式定义对象
   */
  static createSchemaDefinition(): SchemaDefinition {
    return {
      title: String,
      description: String,
      collectUsersId: [String],
      upUsersId: [String],
    };
  }
}
