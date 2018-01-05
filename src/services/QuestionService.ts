import { IQuestionDocument, IUserDocument } from "../schemas/index";
import { QuestionModel, UserModel } from "../models/index";
import * as Debug from 'debug';
import { Question, IQuestion, IUser } from "../entities/index";
import { RequestResultUtil, ErrorCodeEnum } from "../apiStatus/index";
import { IServiceResult } from "../interfaces/index";

const debug = Debug('zzti-zhihu:service:question');

/**
 * QuestionService
 *
 * @author lsl
 */
export class QuestionService {

  /**
   * 保存问题
   *
   * @param title 标题
   * @param description 描述
   */
  public static async postQuestion(title: string, description: string): Promise<any> {
    const question = new QuestionModel({ title, description });
    return question.save();
  }

  /**
   * 收藏问题
   *
   * @param questionId 问题id
   * @param userId 用户id
   */
  public static async collect(questionId: string, userId: string): Promise<IServiceResult<any>> {
    debug('收藏问题');
    const question = await QuestionModel.findById(questionId);
    const user = await UserModel.findById(userId);
    if (!user) {
      return RequestResultUtil.createError(ErrorCodeEnum.AUTHORIZATION);
    }
    if (!question) {
      return RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    if (user.collectionQuestions.find(p => p === question.id)) {
      return RequestResultUtil.createError(ErrorCodeEnum.OPERATION_DUPLICATION);
    }
    try {
      user.collectionQuestions.push(question.id);
      question.collectUsersId.push(user.id);
      await user.save();
      await question.save();
      return RequestResultUtil.createSuccess();
    } catch (error) {
      debug('收藏问题, 发生错误: ', error);
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  /**
   * 取消收藏
   *
   * @param questionId 问题id
   * @param userId 用户id
   */
  public static async cancelCollect(questionId: string, userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $pull: { collectionQuestions: questionId } });
    await QuestionModel.findByIdAndUpdate(questionId, { $pull: { collectUsersId: userId } });
  }

  /**
   * 对问题点赞
   *
   * @param questionId 问题id
   * @param userId 用户id
   */
  public static async up(questionId: string, userId: string): Promise<IServiceResult<any>> {
    debug('对问题点赞');
    const question = await QuestionModel.findById(questionId);
    const user = await UserModel.findById(userId);
    if (!user) {
      return RequestResultUtil.createError(ErrorCodeEnum.AUTHORIZATION);
    }
    if (!question) {
      return RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    if (question.upUsersId.find(p => p === user.id)) {
      // 已经点赞
      return RequestResultUtil.createError(ErrorCodeEnum.OPERATION_DUPLICATION);
    }
    try {
      question.upUsersId.push(user.id);
      await question.save();
      return RequestResultUtil.createSuccess();
    } catch (error) {
      debug('点赞发生错误: %O', error);
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  /**
   * 对问题取消点赞
   *
   * @param questionId 问题id
   * @param userId 用户id
   */
  public static async cancelUp(questionId: string, userId: string): Promise<void> {
    debug('取消问题点赞');
    await QuestionModel.findByIdAndUpdate(questionId, { $pull: { upUsersId: userId } });
  }

  /**
   * 获取所有问题
   *
   * @param limit 数量限制, 默认20条
   */
  public static async getAll(limit: number = 20): Promise<IQuestionDocument[]> {
    return await QuestionModel.find().limit(limit);
  }

  /**
   * 获取指定id的问题信息
   *
   * @param id 问题的id
   */
  public static async getById(id: string): Promise<IQuestionDocument> {
    return await QuestionModel.findById(id);
  }

}
