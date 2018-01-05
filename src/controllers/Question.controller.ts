import { Context } from "koa";
import { QuestionService } from "../services/QuestionService";
import * as Debug from 'debug';
import { IQuestion } from "../entities/index";
import { RequestResultUtil, ErrorCodeEnum } from "../apiStatus/index";
import { NextCallback } from "../types/index";

const debug = Debug('zzti-zhihu:controller:question');

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
    const { title, description } = ctx.request.body as IQuestion;
    const postRes = await QuestionService.postQuestion(title, description);
    ctx.body = RequestResultUtil.createSuccess<IQuestion>(postRes);
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
   * 获取所有问题
   *
   * @param ctx ctx
   * @param next next
   */
  public static async getAll(ctx: Context, next: NextCallback): Promise<any> {
    debug('获取所有问题: ', ctx.query);
    const limit = +ctx.query.limit;
    const questions = await QuestionService.getAll(+limit);
    return ctx.body = RequestResultUtil.createSuccess(questions);
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
    const question = await QuestionService.getById(id);
    return ctx.body = RequestResultUtil.createSuccess(question);
  }
}