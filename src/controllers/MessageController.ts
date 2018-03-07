import * as Debug from 'debug';
import { Context } from 'koa';
import { NextCallback } from '../types/index';
import { MessageService, UserService } from '../services/index';
import { MessageTypeEnum, RequestResultUtil } from '../apiStatus';
import { Message, User } from '../entities';

const debug = Debug('zzti-zhihu:controller:message');

/**
 * Message Controller
 *
 * @author lsl
 */
export class MessageController {

  /**
   * 获取用户所有消息
   * @param ctx ctx
   * @param next next
   */
  public static async getUserAllMessages(ctx: Context, next: NextCallback): Promise<any> {
    const currUser = ctx.state.currentUser;
    const userId = currUser.uid;
    const messages = await MessageService.getMessagesByUserId(userId);
    const promisesUser = await Promise.all([...new Set(messages.map(m => UserService.get(m.createUserId)))]);
    const userEntity = {} as {
      [id: string]: User;
    };
    promisesUser.forEach(u => {
      userEntity[u.id] = u;
    });

    const results: Message[] = messages.map(m => {
      switch (m.type) {
        case MessageTypeEnum.FOLLOWED_USER_CREATE_QUESTION:
          return {
            ...m,
            content: '你关注的用户 @' + userEntity[m.createUserId].username + ' 创建了一个问题',
            link: '/question/' + m.link
          };
        case MessageTypeEnum.FOLLOWED_USER_CREATE_REPLY:
          return {
            ...m,
            content: `你关注的用户 @${userEntity[m.createUserId].username} 回答了问题`,
            link: '/question/' + m.link,
          };
        case MessageTypeEnum.USER_COMMENT_MY_REPLY:
          return {
            ...m,
            content: `@${userEntity[m.createUserId].username} 在你的回复中有新的评论`,
            link: `/question/${m.link}`,
          };
        case MessageTypeEnum.USER_FOLLOW_ME:
          return {
            ...m,
            content: `@${userEntity[m.createUserId].username} 关注了你`,
            link: `/user/${m.createUserId}`,
          };
        case MessageTypeEnum.USER_LIKE_MY_QUESTION:
          return {
            ...m,
            content: `@${userEntity[m.createUserId].username} 收藏了你的问题`,
            link: `/question/${m.link}`,
          };
        case MessageTypeEnum.USER_REPLY_MY_QUESTION:
          return {
            ...m,
            content: `@${userEntity[m.createUserId].username} 回复了你的问题`,
            link: `/question/${m.link}`,
          };
        case MessageTypeEnum.USER_UP_MY_QUESTION:
          return {
            ...m,
            content: `@${userEntity[m.createUserId].username} 给你的问题点了赞`,
            link: `/question/${m.link}`,
          };
        case MessageTypeEnum.USER_UP_MY_REPLY:
          return {
            ...m,
            content: `@${userEntity[m.createUserId].username} 给你的评论点了赞`,
            link: `/question/${m.link}`,
          };
      }
    });
    return RequestResultUtil.createSuccess(results);
  }

  /**
   * 设置已读
   * @param ctx ctx
   * @param next next
   */
  public static async setIsLooked(ctx: Context, next: NextCallback): Promise<any> {

  }

  /**
   * 设置用户所有的消息为已读
   * @param ctx ctx
   * @param next next
   */
  public static async setUserAllMessageToIsLooked(ctx: Context, next: NextCallback): Promise<any> {

  }

  /**
   * 删除消息
   * @param ctx ctx
   * @param next next
   */
  public static async remove(ctx: Context, next: NextCallback): Promise<any> {
    return await MessageService.testDel();
  }

  /**
   * 删除用户所有消息
   * @param ctx ctx
   * @param next next
   */
  public static async removeUserAllMessages(ctx: Context, next: NextCallback): Promise<any> {

  }

}
