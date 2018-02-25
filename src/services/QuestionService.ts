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
   * 发表问题
   *
   * @param question 问题信息
   * @param userId 用户id
   */
  public static async postQuestion(question: IQuestion, userId: string): Promise<IServiceResult> {
    let saveResult;
    try {
      saveResult = await new QuestionModel({ ...question, userId, createAt: new Date() }).save();
      return RequestResultUtil.createSuccess(saveResult.id);
    } catch (error) {
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
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
   */
  public static async getAll(): Promise<IQuestionDocument[]> {
    return await QuestionModel.find();
  }

  /**
   * 过去一些Questions
   *
   * @param count 页面中已有的
   */
  public static async getMany(count: number = 0): Promise<IQuestionDocument[]> {
    return await QuestionModel.find().skip(count).limit(10).exec();
  }

  /**
   * 获取指定id的问题信息
   *
   * @param id 问题的id
   */
  public static async getById(id: string): Promise<IServiceResult> {
    try {
      const q = await QuestionModel.findById(id);
      return RequestResultUtil.createSuccess<any>({
        id: q.id,
        title: q.title,
        description: q.description,
        tags: q.tags,
        collectUserIds: q.collectUserIds,
        upUserIds: q.upUserIds,
        downUserIds: q.downUserIds,
        saveUserIds: q.saveUserIds,
      });
    } catch (error) {
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  /**
   * 获取指定用户发布的帖子
   *
   * @param userId 用户id
   */
  public static async getUserPosted(userId: string): Promise<IServiceResult> {
    try {
      const qs = await QuestionModel.find().where('userId', userId).exec();
      return RequestResultUtil.createSuccess(qs.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        tags: q.tags,
        collectUserIds: q.collectUserIds,
        upUserIds: q.upUserIds,
        downUserIds: q.downUserIds,
        saveUserIds: q.saveUserIds,
        createAt: q.createAt,
      })));
    } catch (error) {
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
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
      collectUserIds: p.collectUserIds,
      upUserIds: p.upUserIds,
      downUserIds: p.downUserIds,
      saveUserIds: p.saveUserIds,
      description: p.description,
      title: p.title
    })));
  }

}
