import { Message } from '../entities/index';
import * as Debug from 'debug';
import { MessageModel, UserModel } from '../models';
import { IMessageDocument } from '../schemas';

const debug = Debug('zzti-zhihu:service:message');

/**
 * 消息服务
 */
export class MessageService {

  /**
   * 保存消息
   * @param message 消息
   */
  public static async save(message: Message): Promise<void> {
    await new MessageModel(message).save();
  }

  /**
   * 获取某位用户的消息
   * @param userId UserId
   */
  public static async getMessagesByUserId(userId: string): Promise<Message[]> {
    return await MessageModel.find().where('userId', userId).exec() as Message[];
  }

  public static async testDel() {
    const users = await UserModel.find().exec();
    debug('users: %O', users);
    return users;
  }

  /**
   * 将某条消息设置为已读
   * @param id Message ID
   */
  public static async setMessageIsLooked(id: string): Promise<void> {
    await MessageModel.findByIdAndUpdate(id, {
      isLooked: true,
    });
  }

  /**
   * 把某用户所有的消息设置为已读
   * @param userId 用户ID
   */
  public static async setAllMessagesIsLookedByUserId(userId: string): Promise<void> {
    await MessageModel.find().where('userId', userId).update({
      isLooked: true,
    }).exec();
  }

  /**
   * 删除某条消息
   * @param id Message ID
   */
  public static async removeMessage(id: string): Promise<void> {
    await MessageModel.findByIdAndRemove(id);
  }

  /**
   * 清空某用户的所有消息
   * @param userId 用户ID
   */
  public static async clearAllMessagesByUserId(userId: string): Promise<any> {
    await MessageModel.find().where('userId', userId).remove().exec();
  }
}
