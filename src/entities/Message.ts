import { SchemaDefinition } from "mongoose";
import { MessageTypeEnum } from "../apiStatus/index";

/**
 * 消息接口
 * @author lsl 2018.3.4
 */
export interface IMessage {

  /**
   * 消息类型
   */
  type: MessageTypeEnum;

  /**
   * 消息创建时间
   */
  createAt: Date;

  /**
   * 消息创建者, 指的是这条消息跟何人有关
   */
  createUserId: string;

  /**
   * 消息给谁提示
   */
  userId: string;

  /**
   * 消息内容
   */
  content?: string;

  /**
   * 链接
   */
  link?: string;

  /**
   * 是否已经查看过
   */
  isLooked: boolean;

}

/**
 * 消息
 */
export class Message implements IMessage {

  id: string;

  /**
   * 是否已经查看过
   */
  isLooked: boolean;
  /**
   * 消息类型
   */
  type: MessageTypeEnum;
  /**
   * 消息创建时间
   */
  createAt: Date;
  /**
   * 消息创建者, 指的是这条消息跟何人有关
   */
  createUserId: string;
  /**
   * 消息给谁提示
   */
  userId: string;
  /**
   * 消息内容
   */
  content?: string;
  /**
   * 链接
   */
  link?: string;

  /**
   * 构造消息对象
   *
   * @param type 类型
   * @param createUserId 消息创建者
   * @param userId 接收消息的用户
   * @param link 链接
   * @param content 内容
   */
  public constructor(type: MessageTypeEnum, createUserId: string, userId: string, link?: string, content?: string) {
    this.type = type;
    this.createUserId = this.createUserId;
    this.userId = userId;
    this.link = link;
    this.content = content;
    this.createAt = new Date();
    this.isLooked = false;
  }

  /**
   * 生成mongoose模式定义对象
   */
  static createSchemaDefinition(): SchemaDefinition {
    return {
      type: String,
      createAt: Date,
      createUserId: String,
      userId: String,
      content: String,
      link: String,
      isLooked: Boolean,
    };
  }
}
