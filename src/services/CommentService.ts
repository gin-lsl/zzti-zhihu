import { CommentModel } from '../models/index';
import { IComment } from '../entities/index';
import { UserService } from './index';
import { RequestResultUtil, ErrorCodeEnum } from '../apiStatus/index';
import { IServiceResult } from '../interfaces/index';

/**
 * CommentService
 *
 * @author lsl
 */
export class CommentService {

  /**
   * 发布评论
   *
   * @param comment 评论内容
   * @param userId 用户ID
   * @param questionId 问题ID
   * @param replyId 回复ID
   */
  public static async postComment(comment: IComment, userId: string, questionId: string, replyId: string): Promise<IServiceResult> {
    let saveResult;
    try {
      saveResult = await new CommentModel({
        ...comment,
        userId,
        questionId,
        replyId,
        createAt: new Date(),
      }).save();
      const userRes = await UserService.getUserInfoById(userId);
      const user = userRes.success ? userRes.successResult : {};
      return RequestResultUtil.createSuccess({
        id: saveResult.id,
        content: saveResult.content,
        userId: saveResult.userId,
        questionId: saveResult.questionId,
        replyId: saveResult.replyId,
        createAt: saveResult.createAt,
        user: user,
      });
    } catch (error) {
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  /**
   * 用来获取指定问题的所有评论
   *
   * @param questionId 问题ID
   */
  public static async getCommentsByQuestionId(questionId: string): Promise<IServiceResult> {
    try {
      const cs = await CommentModel
        .find()
        .where('questionId', questionId)
        .exec();
      // 所有用户信息Promise
      const primises = cs.map(c => UserService.getUserInfoById(c.userId));
      // 用户信息
      const users = await Promise.all(primises);
      // 转为对象类型
      const _userEntity = {} as any;
      users.forEach(u => {
        if (u.success) {
          _userEntity[u.successResult.id] = u.successResult;
        }
      });
      const result = cs.map(c => ({
        id: c.id,
        questionId: c.questionId,
        replyId: c.replyId,
        content: c.content,
        createAt: c.createAt,
        userId: c.userId,
        user: _userEntity[c.userId],
      }));
      return RequestResultUtil.createSuccess(result);
    } catch (error) {
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

}
