import { Context } from "koa";
import { QuestionService } from "../services/QuestionService";
import * as Debug from 'debug';
import { IQuestion } from "../entities/index";
import { RequestResultUtil, ErrorCodeEnum } from "../apiStatus/index";
import { NextCallback } from "../types/index";
import * as elasticsearch from 'elasticsearch';

const debug = Debug('zzti-zhihu:controller:question');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

/**
 * QuestionController
 *
 * @author lsl
 */
export class QuestionController {

  /**
   * 发布问题
   *
   * @param ctx ctx
   * @param next next
   */
  public static async postTopic(ctx: Context, next: NextCallback): Promise<any> {
    debug('发布问题');
    // const { title, description, tags, isAnonymous } = ctx.request.body as IQuestion;
    const question = ctx.request.body as IQuestion;
    question.userId = ctx.state.currentUser.uid;
    debug('question: %O', question);
    ctx.body = await QuestionService.postQuestion(ctx.request.body, ctx.state.currentUser.uid);
  }

  /**
   * 收藏问题
   *
   * @param ctx ctx
   * @param next next
   */
  public static async collect(ctx: Context, next: NextCallback): Promise<any> {
    debug('收藏问题');
    const { id } = ctx.state.params;
    const { uid } = ctx.state.currentUser;
    if (!id) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    const collectRes = await QuestionService.collect(id, uid);
    ctx.body = collectRes;
  }

  /**
   * 取消收藏问题
   *
   * @param ctx ctx
   * @param next next
   */
  public static async cancelCollect(ctx: Context, next: NextCallback): Promise<any> {
    debug('取消收藏问题');
    const { id } = ctx.state.params;
    const { uid } = ctx.state.currentUser;
    if (!id) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    await QuestionService.cancelCollect(id, uid);
    ctx.body = RequestResultUtil.createSuccess();
  }

  /**
   * 对问题点赞
   *
   * @param ctx ctx
   * @param next next
   */
  public static async up(ctx: Context, next: NextCallback): Promise<any> {
    debug('对问题点赞');
    const { id } = ctx.state.params;
    const { uid } = ctx.state.currentUser;
    if (!id) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    ctx.body = await QuestionService.up(id, uid);
  }

  /**
   * 对问题取消点赞
   *
   * @param ctx ctx
   * @param next next
   */
  public static async cancelUp(ctx: Context, next: NextCallback): Promise<any> {
    debug('取消问题点赞');
    const { id } = ctx.state.params;
    const { uid } = ctx.state.currentUser;
    if (!id) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    await QuestionService.cancelUp(id, uid);
    ctx.body = RequestResultUtil.createSuccess();
  }

  /**
   * 反对问题
   *
   * @param ctx ctx
   * @param next next
   */
  public static async down(ctx: Context, next: NextCallback): Promise<any> {
    debug('反对问题');
    const { id } = ctx.state.params;
    const { uid } = ctx.state.currentUser;
    if (!id) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    ctx.body = await QuestionService.down(id, uid);
  }

  /**
   * 对问题取消反对
   *
   * @param ctx ctx
   * @param next next
   */
  public static async cancelDown(ctx: Context, next: NextCallback): Promise<any> {
    debug('取消问题反对');
    const { id } = ctx.state.params;
    const { uid } = ctx.state.currentUser;
    if (!id) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    await QuestionService.cancelDown(id, uid);
    ctx.body = RequestResultUtil.createSuccess();
  }

  /**
   * 收藏问题
   *
   * @param ctx ctx
   * @param next next
   */
  public static async like(ctx: Context, next: NextCallback): Promise<any> {
    debug('收藏问题');
    const { id } = ctx.state.params;
    const { uid } = ctx.state.currentUser;
    if (!id) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    ctx.body = await QuestionService.like(id, uid);
  }

  /**
   * 取消收藏问题
   *
   * @param ctx ctx
   * @param next next
   */
  public static async unLike(ctx: Context, next: NextCallback): Promise<any> {
    debug('取消收藏');
    const { id } = ctx.state.params;
    const { uid } = ctx.state.currentUser;
    if (!id) {
      return ctx.body = RequestResultUtil.createError(ErrorCodeEnum.CANNOT_FOUND_TARGET);
    }
    await QuestionService.unLike(id, uid);
    ctx.body = RequestResultUtil.createSuccess();
  }

  /**
   * 获取所有问题
   *
   * @param ctx ctx
   * @param next next
   */
  public static async getAll(ctx: Context, next: NextCallback): Promise<any> {
    debug('获取所有问题: ', ctx.query);
    const questions = await QuestionService.getAll();
    return ctx.body = RequestResultUtil.createSuccess(questions);
  }

  /**
   * 获取一些问题
   *
   * @param ctx ctx
   * @param next next
   */
  public static async getMany(ctx: Context, next: NextCallback): Promise<any> {
    debug('获取一些Questions');
    const count = +(ctx.query.count || 0);
    const questions = await QuestionService.getMany(count);
    ctx.body = RequestResultUtil.createSuccess(questions);
  }

  /**
   * 获取某个问题详情
   *
   * @param ctx ctx
   * @param next next
   */
  public static async getById(ctx: Context, next: NextCallback): Promise<any> {
    debug('获取指定问题详情');
    const { id } = ctx.state.params;
    ctx.body = await QuestionService.getById(id);
  }

  /**
   * 搜索
   *
   * @param ctx ctx
   * @param next next
   */
  public static async search(ctx: Context, next: NextCallback): Promise<any> {
    return ctx.body = await QuestionService.search(ctx.query.search);
  }

  public static async moreLikeThis(ctx: Context, next: NextCallback): Promise<any> {
    const response = await client.search({
      index: 'zzti_zhihu',
      body: {
        query: {
          more_like_this: {
            fields: ['title'],
            like: '请问这是什么动画中的截图?',
            min_doc_freq: 0,
            min_word_len: 0,
            min_term_freq: 0
          }
        }
      }
    });
    debug('请求结果: %O', response);
    ctx.body = RequestResultUtil.createSuccess(response);
  }
}

