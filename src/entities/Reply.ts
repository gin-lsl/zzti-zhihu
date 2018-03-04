import { SchemaDefinition } from 'mongoose';

/**
 * IReply 接口
 *
 * @author lsl
 */
export interface IReply {

  /**
   * 内容
   */
  content: string;

  /**
   * 问题ID
   */
  questionId: string;

  /**
   * 用户ID
   */
  userId: string;

  /**
   * 发布时间
   */
  createAt: Date;

  /**
   * 更新时间
   */
  updateAt: Date;

  /**
   * 给此回答点赞的用户
   */
  upUserIds: Array<string>;

  /**
   * 反对此回答的用户
   */
  downUserIds: Array<string>;

  /**
   * 是否是匿名用户回答
   */
  isAnonymous: boolean;

}


/**
 * Reply 类
 *
 * @author lsl
 */
export class Reply implements IReply {
  id: string;
  content: string;
  questionId: string;
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
      userId: String,
      createAt: Date,
      updateAt: Date,
      upUserIds: [String],
      downUserIds: [String],
      isAnonymous: Boolean,
    };
  }
}
