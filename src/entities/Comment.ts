import { SchemaDefinition } from 'mongoose';

/**
 * IComment 接口
 *
 * @author lsl
 */
export interface IComment {

  /**
   * 内容
   */
  content: string;

  /**
   * 问题ID
   */
  questionId: string;

  /**
   * 评论的回复ID, 可以没有, 比如评论的是问题而不是某个回复信息
   */
  replyId?: string;

  /**
   * 用户ID
   */
  userId: string;

  /**
   * 发布时间
   */
  createAt: Date;

  /**
   * 给此评论点赞的用户
   */
  upUserIds: Array<string>;

  /**
   * 反对此评论的用户
   */
  downUserIds: Array<string>;

  /**
   * 是否是匿名用户评论
   */
  isAnonymous: boolean;

}

/**
 * Comment 类
 *
 * @author lsl
 */
export class Comment implements IComment {
  content: string;
  questionId: string;
  replyId?: string;
  userId: string;
  createAt: Date;
  updateAt: Date;
  upUserIds: string[];
  downUserIds: string[];
  isAnonymous: boolean;

  /**
   * 生成mongoose模式定义对象
   */
  static createSchemaDefinition(): SchemaDefinition {
    return {
      content: String,
      questionId: String,
      replyId: String,
      userId: String,
      createAt: Date,
      updateAt: Date,
      upUserIds: [String],
      downUserIds: [String],
      isAnonymous: Boolean,
    };
  }
}
