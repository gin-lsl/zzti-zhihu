import * as Debug from 'debug';
import { IReply } from '../entities/index';
import { IServiceResult } from '../interfaces/index';
import { ReplyModel } from '../models/index';
import { RequestResultUtil, ErrorCodeEnum } from '../apiStatus/index';
import { UserService } from './index';

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
    let saveResult;
    try {
      saveResult = await new ReplyModel({
        ...reply,
        userId,
        createAt: new Date()
      }).save();
      const userRes = await UserService.getUserInfoById(userId);
      const user = userRes.success ? userRes.successResult : {};
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
        id: r._id,
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
}
