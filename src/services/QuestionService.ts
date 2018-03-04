import { IQuestionDocument, IUserDocument } from "../schemas/index";
import { QuestionModel, UserModel } from "../models/index";
import * as Debug from 'debug';
import { Question, IQuestion, IUser } from "../entities/index";
import { RequestResultUtil, ErrorCodeEnum } from "../apiStatus/index";
import { IServiceResult } from "../interfaces/index";
import { esClient, DB, ES } from "../config";

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
      saveResult = await new QuestionModel({ ...question, userId, createAt: new Date(), lookCount: 0 }).save();
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
      await UserModel.findByIdAndUpdate(question.userId, {
        $inc: {
          upCount: 1,
        }
      });
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
    const question = await QuestionModel.findById(questionId);
    if (question) {
      await UserModel.findByIdAndUpdate(question.userId, {
        $inc: {
          upCount: -1
        }
      });
      await question.update({
        $pull: {
          upUserIds: userId
        }
      }).exec();
    } else {
      throw ErrorCodeEnum.CANNOT_FOUND_TARGET;
    }
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
      UserModel.findByIdAndUpdate(question.userId, {
        $inc: {
          saveCount: 1,
        }
      });
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
    const question = await QuestionModel.findById(questionId);
    await question.update({ $pull: { saveUserIds: userId } });
    await UserModel.findByIdAndUpdate(question.userId, {
      $inc: {
        saveCount: -1
      }
    });
  }

  /**
   * 获取所有问题
   * @deprecated
   */
  public static async getAll(): Promise<IQuestionDocument[]> {
    return await QuestionModel.find();
  }

  /**
   * 获取一些Questions
   *
   * @param count 页面中已有的
   */
  public static async getMany(count: number = 0): Promise<any[]> {
    const questions = await QuestionModel.find().skip(count).limit(10).exec();
    const createUserIds = [...new Set(questions.filter(q => !q.isAnonymous).map(q => q.userId))];
    const promises = createUserIds.map(_ => UserModel.findById(_));
    const users = await Promise.all(promises);
    const _userEntity = {} as any;
    users.forEach(u => {
      _userEntity[u.id] = {
        id: u.id,
        email: u.email,
        avatar: u.avatar,
        gender: u.gender,
        profile: u.profile,
        lv: u.lv,
        username: u.username,
      };
    });
    return questions.map(q => ({
      id: q.id,
      title: q.title,
      description: q.description,
      tags: q.tags,
      createAt: q.createAt,
      upUserIds: q.upUserIds,
      downUserIds: q.downUserIds,
      saveUserIds: q.saveUserIds,
      isAnonymous: q.isAnonymous,
      lookCount: q.lookCount,
      user: q.isAnonymous ? {} : _userEntity[q.userId]
    }));
  }

  /**
   * 获取指定id的问题信息
   *
   * @param id 问题的id
   */
  public static async getById(id: string): Promise<IServiceResult> {
    try {
      const q = await QuestionModel.findById(id);
      const u = await UserModel.findById(q.userId);
      await q.update({
        $inc: {
          lookCount: 1,
        }
      });
      return RequestResultUtil.createSuccess<any>({
        id: q.id,
        title: q.title,
        description: q.description,
        tags: q.tags,
        collectUserIds: q.collectUserIds,
        upUserIds: q.upUserIds,
        downUserIds: q.downUserIds,
        saveUserIds: q.saveUserIds,
        lookCount: q.lookCount + 1,
        isAnonymous: q.isAnonymous,
        user: q.isAnonymous
          ? {}
          : {
            id: u.id,
            email: u.email,
            avatar: u.avatar,
            gender: u.gender,
            profile: u.profile,
            lv: u.lv,
            username: u.username,
          },
      });
    } catch (error) {
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  /**
   * 获取指定用户发布的帖子
   *
   * @param userId 用户id
   * @param hasAuth 是否有权限查看匿名发布的信息
   */
  public static async getUserPosted(userId: string, hasAuth: boolean = false): Promise<IServiceResult> {
    try {
      let _qs = QuestionModel.find().where('userId', userId);
      if (hasAuth) {
        _qs = _qs.where('isAnonymous').ne(true);
      }

      const qs = await _qs.exec();
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
        lookCount: q.lookCount,
      })));
    } catch (error) {
      return RequestResultUtil.createError(ErrorCodeEnum.UNDEFINED_ERROR);
    }
  }

  /**
   * 获取用户收藏的问题
   *
   * @param userId 用户ID
   */
  public static async getUserSaved(userId: string): Promise<any> {
    const user = await UserModel.findById(userId);
    const promises = user.collectionQuestionIds.map(_ => QuestionModel.findById(_));
    const qs = await Promise.all(promises);
    debug('qs: ', qs);
    return qs.map(q => {
      if (!q) {
        return {
          notFound: true,
          title: '问题不存在',
        };
      }
      return {
        id: q.id,
        title: q.title,
        description: q.description,
        tags: q.tags,
        collectUserIds: q.collectUserIds,
        upUserIds: q.upUserIds,
        downUserIds: q.downUserIds,
        saveUserIds: q.saveUserIds,
        createAt: q.createAt,
        lookCount: q.lookCount,
      };
    });
  }

  /**
   * 搜索
   *
   * @param searchText 搜索文本
   */
  public static async search(searchText: string = ''): Promise<IServiceResult> {

    const result = {
      byTitle: [],
      byDescription: [],
    };

    searchText = searchText.trim();
    if (searchText === '') {
      throw RequestResultUtil.createError(ErrorCodeEnum.MISSING__PARAMETERS);
    }

    // 相似标题结果
    const resultsByTitle = await esClient.search({
      index: ES.index.name,
      body: {
        query: {
          match_phrase_prefix: {
            title: searchText
          }
        },
        highlight: {
          fields: {
            title: {}
          }
        }
      }
    });

    // 相似内容结果
    const resultsByDescription = await esClient.search({
      index: ES.index.name,
      body: {
        query: {
          match_phrase_prefix: {
            description: searchText
          }
        },
        highlight: {
          fields: {
            description: {}
          }
        }
      }
    });


    if (resultsByTitle.timed_out || resultsByDescription.timed_out) {
      return RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }

    const titleHits = resultsByTitle.hits.hits;
    const descriptionHints = resultsByDescription.hits.hits;

    return RequestResultUtil.createSuccess({
      byTitle: titleHits.map(q => ({
        id: q._id,
        createAt: q._source['createAt'],
        title: q._source['title'],
        _highlight: q.highlight,
      })),
      byDescription: descriptionHints.map(q => ({
        id: q._id,
        createAt: q._source['createAt'],
        title: q._source['title'],
        description: q._source['description'],
        _highlight: q.highlight,
      })),
    });
  }

  /**
   * 增加访问次数
   *
   * @param id 问题ID
   */
  public static async addLookCount(id: string): Promise<void> {
    await QuestionModel.findById(id).update({
      $inc: {
        lookCount: 1,
      }
    });
  }

}
