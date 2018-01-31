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
  public static async postQuestion(question: IQuestion, userId: string): Promise<any> {
    // const question = new QuestionModel({ title, description });
    // return question.save();
    return new QuestionModel({ ...question, userId }).save();
  }

  /**
   * 收藏问题
   *
   * @param questionId 问题id
   * @param userId 用户id
   */
  public static async collect(questionId: string, userId: string): Promise<IServiceResult> {
    debug('收藏问题');
    const question = await QuestionModel.findById(questionId);
    if (!question) {
      return RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return RequestResultUtil.createError(ErrorCodeEnum.AUTHORIZATION);
    }
    if (user.collectionQuestionIds.includes(question.id) || question.collectUserIds.includes(user.id)) {
      return RequestResultUtil.createError(ErrorCodeEnum.OPERATION_DUPLICATION);
    }
    try {
      user.collectionQuestionIds.push(question.id);
      question.collectUserIds.push(user.id);
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
    await UserModel.findByIdAndUpdate(userId, { $pull: { collectionQuestionIds: questionId } });
    await QuestionModel.findByIdAndUpdate(questionId, { $pull: { collectUserIds: userId } });
  }

  /**
   * 对问题点赞
   *
   * @param questionId 问题id
   * @param userId 用户id
   */
  public static async up(questionId: string, userId: string): Promise<IServiceResult> {
    debug('对问题点赞');
    const question = await QuestionModel.findById(questionId);
    if (!question) {
      return RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return RequestResultUtil.createError(ErrorCodeEnum.UNKNOWN_USER);
    }
    if (question.downUserIds.includes(user.id)) {
      return RequestResultUtil.createError(ErrorCodeEnum.OPERATION_CONFLICT);
    }
    if (question.upUserIds.includes(user.id)) {
      // 已经点赞
      return RequestResultUtil.createError(ErrorCodeEnum.OPERATION_DUPLICATION);
    }
    try {
      question.upUserIds.push(user.id);
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
    await QuestionModel.findByIdAndUpdate(questionId, { $pull: { upUserIds: userId } });
  }

  /**
   * 反对某问题
   *
   * @param questionId 问题id
   * @param userId 用户id
   */
  public static async down(questionId: string, userId: string): Promise<IServiceResult> {
    debug('反对某问题');
    const question = await QuestionModel.findById(questionId);
    if (!question) {
      return RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return RequestResultUtil.createError(ErrorCodeEnum.UNKNOWN_USER);
    }
    if (question.upUserIds.includes(user.id)) {
      return RequestResultUtil.createError(ErrorCodeEnum.OPERATION_CONFLICT);
    }
    if (question.downUserIds.includes(user.id)) {
      return RequestResultUtil.createError(ErrorCodeEnum.OPERATION_DUPLICATION);
    }
    try {
      question.downUserIds.push(user.id);
      await question.save();
      return RequestResultUtil.createSuccess();
    } catch (error) {
      debug('点赞发生错误: ', error);
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  public static async cancelDown(questionId: string, userId: string): Promise<void> {
    debug('取消反对某问题');
    await QuestionModel.findByIdAndUpdate(questionId, { $pull: { downUserIds: userId } });
  }

  /**
   * 收藏问题
   *
   * @param questionId 问题id
   * @param userId 用户id
   */
  public static async like(questionId: string, userId: string): Promise<IServiceResult> {
    debug('收藏');
    const question = await QuestionModel.findById(questionId);
    if (!question) {
      return RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return RequestResultUtil.createError(ErrorCodeEnum.UNKNOWN_USER);
    }
    if (user.collectionQuestionIds.includes(question.id) || question.saveUserIds.includes(user.id)) {
      return RequestResultUtil.createError(ErrorCodeEnum.OPERATION_DUPLICATION);
    }
    try {
      user.collectionQuestionIds.push(question.id);
      question.saveUserIds.push(user.id);
      await user.save();
      await question.save();
      return RequestResultUtil.createSuccess();
    } catch (error) {
      debug('收藏发生错误');
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  /**
   * 取消收藏
   *
   * @param questionId 问题id
   * @param userId 用户id
   */
  public static async unLike(questionId: string, userId: string): Promise<void> {
    debug('取消收藏');
    await UserModel.findByIdAndUpdate(userId, { $pull: { collectionQuestionIds: questionId } });
    await QuestionModel.findByIdAndUpdate(questionId, { $pull: { saveUserIds: userId } });
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

  /**
   * 搜索
   *
   * @param searchText 搜索文本
   */
  public static async search(searchText: string = ''): Promise<IServiceResult> {
    const searchRegex = searchText
      .split(' ')
      .map(p => `(${p})`)
      .join('|');
    const foundQuestions = await QuestionModel.find().where('title', RegExp(searchRegex)).exec();
    return RequestResultUtil.createSuccess(foundQuestions && foundQuestions.map(p => ({
      id: p.id,
      tags: p.tags,
      collcateUserIds: p.collectUserIds,
      upUserIds: p.upUserIds,
      downUserIds: p.downUserIds,
      saveUserIds: p.saveUserIds,
      description: p.description,
      title: p.title
    })));
  }

}
