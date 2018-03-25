import * as Debug from 'debug';
import { IReply, Message } from '../entities/index';
import { IServiceResult } from '../interfaces/index';
import { ReplyModel, QuestionModel, UserModel, MessageModel } from '../models/index';
import { RequestResultUtil, ErrorCodeEnum, MessageTypeEnum } from '../apiStatus/index';
import { UserService } from './index';
import { MessageService } from './MessageService';

const debug = Debug('zzti-zhihu:service:reply');

/**
 * ReplyService
 *
 * @author lsl
 */
export class ReplyService {

  /**
   * 发表回复
   *
   * @param reply 回复信息
   * @param userId 用户id
   * @param questionId 问题id
   */
  public static async postReply(reply: IReply, userId: string, questionId: string): Promise<IServiceResult> {
    debug('发布回复');
    let saveResult;
    try {
      saveResult = await new ReplyModel({
        ...reply,
        userId,
        createAt: new Date()
      }).save();
      const userRes = await UserService.getUserInfoById(userId);
      const question = await QuestionModel.findById(questionId);
      const user = userRes.success ? userRes.successResult : {};
      // 消息
      const messageQuestionUserId = new Message(MessageTypeEnum.USER_REPLY_MY_QUESTION, userId, question.userId, questionId);
      debug('user: %O', user);
      const messagesFollowHim = userRes.successResult.followHimIds
        .map(_ => new Message(MessageTypeEnum.FOLLOWED_USER_CREATE_REPLY, userId, _, questionId));
      await MessageModel.create([...messagesFollowHim, messageQuestionUserId]);
      return RequestResultUtil.createSuccess({
        id: saveResult.id,
        questionId: saveResult.questionId,
        userId: saveResult.userId,
        content: saveResult.content,
        createAt: saveResult.createAt,
        updateAt: saveResult.createAt,
        user: user,
      });
    } catch (error) {
      debug('error: ', error);
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  /**
   * 获取指定问题的所有回复
   *
   * @param questionId 问题id
   */
  public static async getRepliesByQuestionId(questionId: string): Promise<IServiceResult> {
    try {
      const rs = await ReplyModel
        .find()
        .where('questionId', questionId)
        .exec();
      // 所有用户信息Promise
      const promises = rs.map(r => UserService.getUserInfoById(r.userId));
      // 用户信息
      const users = await Promise.all(promises);
      // 转为对象类型
      const _userEntity = {} as any;
      users.forEach(u => {
        if (u.success) {
          _userEntity[u.successResult.id] = u.successResult;
        }
      });
      const result = rs.map(r => ({
        id: r.id,
        questionId: r.questionId,
        content: r.content,
        createAt: r.createAt,
        updateAt: r.updateAt,
        userId: r.userId,
        user: _userEntity[r.userId],
      }));
      return RequestResultUtil.createSuccess(result);
    } catch (error) {
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  /**
   * 获取指定用户发布的回复
   *
   * @param userId 用户ID
   * @param hasAuth 是否有病权限
   */
  public static async getRepliesByUserId(userId: string, hasAuth: boolean = false): Promise<IServiceResult> {
    try {
      const rs = await ReplyModel.find().where('userId', userId).exec();
      return RequestResultUtil.createSuccess(rs.map(r => ({
        id: r.id,
        questionId: r.questionId,
        content: r.content,
        createAt: r.createAt,
        updateAt: r.updateAt,
        userId: r.userId,
      })));
    } catch (error) {
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }
}
